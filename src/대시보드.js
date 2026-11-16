/**
 * 대시보드.gs — HTML 소비 대시보드 (같은 Apps Script 프로젝트에 넣어서 사용)
 *   필요한 파일: 구매내역_가져오기.gs, 소비분석.gs, 대시보드.gs, dashboard.html
 *
 *   PC  : 시트 메뉴 '구매내역 → 대시보드 열기' (시트 위에 큰 창으로 뜸)
 *   폰  : 웹앱으로 배포한 URL을 브라우저로 열기 (배포: 편집기 오른쪽 위 '배포 → 새 배포 → 웹 앱',
 *         실행 사용자 '나', 액세스 권한 '나만')  → 소비분석 탭 A3에 링크가 생김
 *
 *   숫자 계산은 소비분석.gs의 computeAnalysis를 그대로 브라우저로 보내서 씀 → 시트 탭과 같은 숫자
 */
const DASH = {
  TITLE: '소비 대시보드',
  NOTI_SRC: '카드·계좌',   // 알림(은행·카드)에서 온 행의 구분 이름
  LIVING_ACCT: '',          // 생활계좌 (알림 앱판: 설정에서). 비면 잔액 줄 숨김
  MANUAL_SRC: '직접',      // 대시보드 '+'로 직접 넣은 행(현금 등)의 구분 이름
  MANUAL_TAB: '직접입력',  // 저장 탭: A 날짜 · B 내용 · C 금액 · D 분류 · E 입력시각 (삭제하면 그 행을 비움 → 행 번호 유지)
  MANUAL_BASE: 1000000,    // 대시보드 행 번호 = 이 값 + 직접입력 탭 행 (구매내역관리 행·알림원본 음수와 안 겹치게)
  CARD: '',                // 신용카드 끝자리 (알림 앱판: 설정에서). 비면 카드 줄 숨김
};

/* ---------- 속도 (2026-11-13) ----------
 * ① 한 번만 읽기: getDashboardJson_ 한 번 실행 안에서 같은 탭(구매내역·알림원본·개인 탭·연결 단어)을 다시 읽지 않음 (memo_)
 * ② 결과 저장: 계산한 JSON을 스크립트 캐시에 둠(최대 6시간). 대시보드를 열면 캐시로 바로 그리고, 화면이 뒤에서 새로 계산해 바뀐 게 있으면 다시 그림.
 *    분류 바꾸기·직접 추가·예산 바꾸기 때 캐시를 지움. '새로고침' 버튼은 항상 새로 계산.
 * ③ 폰트: 처음 HTML에서 뺌 → 화면을 먼저 그리고 getDashFont로 받아 브라우저(localStorage)에 저장, 다음부터는 저장본을 바로 씀
 */
/* 기록용 탭 자동 숨김 (2026-11-13 사용자: 안 봐도 되는 기록 탭이 너무 많음). 숨겨도 코드는 그대로 읽고 씀.
 * 처음 한 번 숨기고(스크립트 속성 HIDE_TABS_V1), 이후 새로 만드는 기록 탭도 숨김. 사람이 '보기 → 숨겨진 시트'로 다시 보이게 하면 그대로 둠(매일 다시 숨기지 않음).
 * 보이게 두는 탭: 개인·정기결제·가계부설정·월마감(사람이 고치는 탭)과 그 밖의 사용자 탭 */
const HIDE_TABS = ['입금분류', '알림원본', '점검기록', '속도기록', '소비분석', '직접입력', '가게분류', '구매내역관리', '가계부설정', '월마감', '보관_구매', '보관_알림', '공휴일', '계획(예전)', '설정(예전)'];
function hideTab_(sh) { try { if (sh && !sh.isSheetHidden()) sh.hideSheet(); } catch (e) {} }
/** 판매용: 기록 탭은 처음 보일 때 한 번만 숨김 (나중에 생긴 탭도). 고객이 다시 보이게 하면 그대로 둠 */
function hideRecordTabsOnce_(ss) {
  try {
    const p = PropertiesService.getScriptProperties();
    const done = JSON.parse(p.getProperty('HIDDEN_TABS') || '[]');
    let ch = false;
    HIDE_TABS.forEach(n => { if (done.indexOf(n) >= 0) return; const sh = ss.getSheetByName(n); if (!sh) return; hideTab_(sh); done.push(n); ch = true; });
    if (ch) p.setProperty('HIDDEN_TABS', JSON.stringify(done));
  } catch (e) {}
}

let MEMO_ = null;
function memo_(k, fn) { if (!MEMO_) return fn(); if (!(k in MEMO_)) MEMO_[k] = fn(); return MEMO_[k]; }
const DASH_CACHE = { KEY: 'dashJson_v1', CHUNK: 30000, TTL: 21600 };   // 캐시 값 하나 최대 100KB → 한글 3바이트 기준 30,000자씩 나눔
function dashCachePut_(json, at) {   // at: 저장본 시각을 그대로 두고 보관 기간만 늘릴 때
  try {
    const K = DASH_CACHE.KEY, n = Math.ceil(json.length / DASH_CACHE.CHUNK), o = {};
    for (let i = 0; i < n; i++) o[K + '_' + i] = json.substr(i * DASH_CACHE.CHUNK, DASH_CACHE.CHUNK);
    o[K + '_at'] = String(at != null ? at : Date.now()); o[K + '_n'] = String(n);
    CacheService.getScriptCache().putAll(o, DASH_CACHE.TTL);
  } catch (e) {}
}
function dashCacheGet_() {
  try {
    const K = DASH_CACHE.KEY, c = CacheService.getScriptCache(), n = Number(c.get(K + '_n'));
    if (!n) return null;
    const keys = []; for (let i = 0; i < n; i++) keys.push(K + '_' + i);
    const m = c.getAll(keys.concat([K + '_at']));
    let s = '';
    for (const k of keys) { if (m[k] == null) return null; s += m[k]; }
    return { json: s, at: Number(m[K + '_at']) || 0 };
  } catch (e) { return null; }
}
/** 저장본을 '오래됨'으로 표시 (2026-11-16 속도 P2: 지우지 않음 → 다음 열기도 저장본으로 바로 그리고, 화면이 뒤에서 새로 계산해 바꿈) */
function dashCacheClear_() { try { CacheService.getScriptCache().put(DASH_CACHE.KEY + '_at', '0', DASH_CACHE.TTL); } catch (e) {} }
/** 4시간마다 미리 계산 (속도 P2, 개인용 2026-11-16 이식). 판매용은 드라이브 권한을 늘리지 않으려고 '시트가 바뀌었는지' 확인 없이 매번 계산 (하루 6번 × 약 4초) */
function dashWarm() {
  getDashboardJson_();
  return 'warm';
}
function dashJsonDay_(json) { const m = String(json).slice(0, 40).match(/"today":"(\d{4}-\d{2}-\d{2})"/); return m ? m[1] : ''; }
/** 한 번만: 4시간 트리거 설치 (예전 30분 트리거는 지움) */
function dashWarmSetup_() {
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'dashWarm').forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('dashWarm').timeBased().everyHours(4).create();
}
/* ---------- 가게분류 탭 (2026-11-13): 카드·계좌 결제의 분류를 대시보드에서 바꾸면 그 가게를 기억 → 같은 가게의 다른 결제도 같은 분류 ----------
 * A 가게 · B 분류 · C 마지막 수정. 사람이 직접 고치거나 줄을 지워도 됨. 우선순위: 그 결제의 분류 수정(알림원본 N) > 이 탭 > 배달·교통 > 가계부 분류 > 가게 이름 규칙 > 상품 규칙
 * 맞추기: 띄어쓰기·대소문자 무시, 같거나 한쪽이 다른 쪽으로 시작(4글자 이상) — 은행 알림의 잘린 이름('신주옥미강남')도 '신주옥미 강남점'에 맞음 */
const MERCHANT_TAB = '가게분류';
const mkey_ = s => String(s || '').replace(/\s+/g, '').toLowerCase();
function merchantMemoMap_() {
  return memo_('merchantMemo', () => {
    const out = [];
    try {
      const sh = dashSs_().getSheetByName(MERCHANT_TAB);
      const last = sh ? sh.getLastRow() : 0;
      if (last >= 2) sh.getRange(2, 1, last - 1, 2).getDisplayValues().forEach(r => {
        const k = mkey_(r[0]), c = String(r[1]).trim();
        if (k && CAT_ORDER.indexOf(c) >= 0) out.push([k, c]);
      });
    } catch (e) {}
    return out;
  });
}
function merchantMemoFind_(name) {
  const k = mkey_(name);
  if (!k || /동기화전/.test(k)) return '';
  let best = '', bl = 0;
  merchantMemoMap_().forEach(([m, c]) => {
    const hit = m === k || (Math.min(m.length, k.length) >= 4 && (m.indexOf(k) === 0 || k.indexOf(m) === 0));
    if (hit && m.length > bl) { best = c; bl = m.length; }
  });
  return best;
}
function merchantMemoSave_(names, cat) {
  try {
    const ss = dashSs_();
    let sh = ss.getSheetByName(MERCHANT_TAB);
    if (!sh) {
      sh = ss.insertSheet(MERCHANT_TAB); hideTab_(sh);
      sh.getRange(1, 1, 1, 3).setValues([['가게', '분류', '마지막 수정']]).setFontWeight('bold').setBackground('#385723').setFontColor('#FFFFFF');
      sh.setFrozenRows(1); sh.setColumnWidth(1, 220);
    }
    const tz = ss.getSpreadsheetTimeZone() || 'Asia/Seoul', now = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd HH:mm');
    const n = sh.getLastRow() - 1, cur = n > 0 ? sh.getRange(2, 1, n, 1).getDisplayValues().map(r => mkey_(r[0])) : [];
    const uniq = {}; names.forEach(x => { const k = mkey_(x); if (k && !/동기화전/.test(k)) uniq[k] = String(x).trim(); });
    Object.keys(uniq).forEach(k => {
      const i = cur.indexOf(k);
      if (i >= 0) sh.getRange(i + 2, 2, 1, 2).setValues([[cat, now]]);
      else { sh.appendRow([uniq[k], cat, now]); cur.push(k); }
    });
  } catch (e) {}
}
/** 처음 한 번: 지금까지 알림원본 N열로 고친 분류를 가게분류 탭에 옮겨 둠 (탭이 없을 때만, 대시보드를 열 때) */
function merchantMemoSeed_(ss, tz) {
  try {
    if (ss.getSheetByName(MERCHANT_TAB) || typeof ledgerLive_ !== 'function') return;
    const by = {};
    ledgerLive_(ss, tz).forEach(x => { if (x.type === '출금' && CAT_ORDER.indexOf(x.fix) >= 0) { by[x.fix] = by[x.fix] || []; by[x.fix].push(notiName_(x)); } });
    const cats = Object.keys(by);
    if (!cats.length) { merchantMemoSave_([], ''); return; }
    cats.forEach(c => merchantMemoSave_(by[c], c));
  } catch (e) {}
}

/** 화면이 그려진 뒤 부름: 내장 폰트 CSS (<style> 태그 뺀 글자) */
function getDashFont_() { return dashFont_().replace(/^\s*<style>/, '').replace(/<\/style>\s*$/, ''); }

function openDashboard() {
  SpreadsheetApp.getUi();   // 메뉴에서만
  SpreadsheetApp.getUi().showModalDialog(dashOutput_().setWidth(1280).setHeight(880), DASH.TITLE);
}

function dashOutput_() {
  // 속도 측정(2026-11-09): 구간별 ms를 캐시에 두고, 화면이 다 그려진 뒤 브라우저가 logPerf로 화면 쪽 시간과 합쳐 '속도기록' 탭에 남김
  const P = { start: Date.now() };
  const t = HtmlService.createTemplateFromFile('dashboard');
  const cached = dashCacheGet_();
  let json = cached ? cached.json : getDashboardJson_(P); P.json = Date.now() - P.start;
  P.cache = cached ? (cached.at ? 'hit' : 'stale') : 'miss'; t.cacheAge = cached ? Math.max(0, Date.now() - cached.at) : 0;
  if (cached) {   // 자정이 지난 저장본: 날짜만 오늘로 바꿔 그리고(오늘 막대), 화면이 뒤에서 새로 계산 (속도 P2)
    const tz = dashSs_().getSpreadsheetTimeZone() || 'Asia/Seoul', today = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd'), d = dashJsonDay_(json);
    if (d && d !== today) { json = json.replace('"today":"' + d + '"', '"today":"' + today + '"'); t.cacheAge = Math.max(t.cacheAge, 3600000); P.cache = 'oldday'; }
  }
  let k = Date.now(); t.payload = json; t.lib = dashLib_(); P.lib = Date.now() - k;
  t.font = ''; P.font = 0;   // 폰트는 화면을 그린 뒤 따로 받음 (getDashFont_)
  P.id = Utilities.getUuid().slice(0, 8); t.perfId = P.id; t.dkey = saleKey_();
  k = Date.now(); const out = t.evaluate(); P.eval = Date.now() - k;
  P.end = Date.now(); P.total = P.end - P.start;
  P.dataKB = Math.round(json.length / 1024); P.fontKB = Math.round(String(t.font || '').length / 1024);
  try { CacheService.getScriptCache().put('perf_' + P.id, JSON.stringify(P), 900); } catch (e) {}
  return out;
}

/** 브라우저가 화면을 다 그린 뒤 부름 → '속도기록' 탭 한 줄. 실패해도 화면에는 영향 없음 */
function logPerf_(id, c) {
  try {
    const ss = dashSs_();
    const tz = ss.getSpreadsheetTimeZone() || Session.getScriptTimeZone() || 'Asia/Seoul';
    let P = {};
    try { P = JSON.parse((id && CacheService.getScriptCache().get('perf_' + id)) || '{}'); } catch (e) {}
    if (!id) { try { P = JSON.parse(CacheService.getScriptCache().get('perf_build') || '{}'); } catch (e) {} }   // 뒤에서 갱신·새로고침: 마지막 계산의 단계 시간
    c = c || {};
    let sh = ss.getSheetByName('속도기록');
    if (!sh) {
      sh = ss.insertSheet('속도기록'); hideTab_(sh);
      sh.getRange(1, 1, 1, 12).setValues([['시각', '종류', '서버 합계', '시트 읽기·계산', 'HTML 만들기', '서버→화면 시작', '화면 그리기', '새로고침 왕복', '데이터KB', '폰트KB', '시트 읽기 세부', '화면 세부']])
        .setFontWeight('bold').setBackground('#385723').setFontColor('#FFFFFF');
      sh.setFrozenRows(1);
    }
    const gap = P.end && c.start ? c.start - P.end : '';   // 서버 끝 → 화면 스크립트 시작 (전송·구글 iframe. 폰·서버 시계 차이가 섞임)
    sh.appendRow([Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd HH:mm:ss'), c.type || '', P.total || '', P.json || '', (P.lib || 0) + (P.font || 0) + (P.eval || 0) || '',
      gap, c.render || '', c.trip || '', P.dataKB || '', P.fontKB || '',
      JSON.stringify(Object.keys(P).filter(k => ['start', 'end', 'id', 'total', 'json', 'dataKB', 'fontKB'].indexOf(k) < 0).reduce((o, k) => { o[k] = P[k]; return o; }, {})),   // 단계별 ms 전부
      JSON.stringify(c.nav || {})]);
  } catch (e) {}
}


/** 내장 폰트(font.html: Pretendard 가변 폰트 일부 글자, base64). 없거나 실패하면 '' → dashboard.html이 CDN 링크로 대체 */
function dashFont_() {
  try { return HtmlService.createHtmlOutputFromFile('font').getContent(); } catch (e) { return ''; }
}

function dashSs_() { return memo_('ss', saleSs_); }

/** 브라우저로 보낼 데이터 (읽기만 함). '새로고침' 버튼도 이 함수를 부름. 행 끝 = 시트 행 번호(분류 바꾸기용) */
function getDashboardJson_(P) {
  MEMO_ = {};
  let lap = Date.now();
  const own = !(P && typeof P === 'object'); if (own) P = { bg: 1 };   // 뒤에서 갱신·새로고침·미리 계산도 단계 시간을 남김 (2026-11-16)
  const tick = k => { const n = Date.now(); P[k] = n - lap; lap = n; };   // 속도 측정 (dashOutput_에서만 P가 옴)
  const ss = dashSs_();
  const tz = ss.getSpreadsheetTimeZone() || Session.getScriptTimeZone() || 'Asia/Seoul';   // 시트 시간대가 비어 있으면 스크립트 시간대 → 서울
  tick('open');   // 2026-11-16 속도: 예전 'rows'에 섞여 있던 단계를 나눠 잼
  if (typeof saleMigrateV2_ === 'function') { try { saleMigrateV2_(ss); } catch (e) { console.error('새 탭 구조: ' + e.message); } }   // 판매.gs: 한 번만
  if (typeof saleApplySettings_ === 'function') saleApplySettings_();   // 판매용: 설정 탭 생활계좌·카드·결제일
  hideRecordTabsOnce_(ss);
  if (!ledgerProps_()['DASH_WARM_V2'] && (typeof SHARE_OUT_ === 'undefined' || !SHARE_OUT_)) { try { dashWarmSetup_(); PropertiesService.getScriptProperties().setProperty('DASH_WARM_V2', '1'); } catch (e) { console.error('미리 계산 트리거: ' + e.message); } }   // 한 번만 (이미 설치한 사람용)
  tick('once');
  const { rows } = readRows_(ss, false); tick('rows');
  const manual = manualRows_(ss); tick('manual');
  merchantMemoSeed_(ss, tz);
  const notiRows = dashNotiRows_(ss, tz); tick('noti');
  const gauge = typeof ledgerGauge_ === 'function' ? ledgerGauge_(ss, tz) : { limit: 800000, noti: null }; tick('gauge');   // 가계부.gs가 있으면 한도·알림 기준 지출
  const plan = typeof planCompare_ === 'function' ? planCompare_(ss, tz, rows.concat(manual)) : null; tick('plan');   // 계획.gs: 개인 탭 대비 (최근 12개월)
  const alert = typeof ledgerAlert_ === 'function' ? ledgerAlert_(ss, tz) : ''; tick('alert');          // 알림 앱 하트비트 감시 (문제 있을 때만 문구)
  const data = {
    today: Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd'),
    stamp: Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd HH:mm'),
    upd: typeof updStatus_ === 'function' ? updStatus_() : null,   // 버전·업데이트 상태 (판매용, 문의 대응)
    sheetUrl: ss.getUrl(),
    rows: rows.map(r => [r.src, r.date, r.order, r.name, r.amount, r.cat, r.status, r.row]).concat(notiRows).concat(manual.map(r => [r.src, r.date, r.order, r.name, r.amount, r.cat, '', r.row]))
      .concat(typeof rcptRows_ === 'function' ? rcptRows_(ss) : []),   // 영수증.gs: 영수증 품목
    gauge, plan, alert,
  };
  // 게이지 '쓴 돈' = 이번 달 대시보드 행 합계(구매 + 카드·계좌). 화면 숫자와 게이지가 같은 기준이 되게 알림 합계는 쓰지 않음
  if (data.gauge) { data.notiFrom = data.gauge.notiFrom || ''; data.gauge.noti = null; }
  const pb = typeof planBudget_ === 'function' ? planBudget_(ss) : null;   // 예산 = 개인 탭 기준 (없으면 가계부설정 B4)
  if (data.gauge) { if (pb) { data.gauge.limit = pb.limit; data.gauge.src = '계획'; data.gauge.plan = pb; } else { data.gauge.limit = 0; data.gauge.src = 'none'; } }   // 판매용: 예산 = 계획 탭 쓰는 돈 합 (없으면 숨김)
  tick('budget');
  const kb = dashKbBal_(ss, tz); tick('kb');
  if (typeof acDash_ === 'function') { data.assets = acDash_(ss, tz); tick('assets'); }   // 계좌.gs: 자산 탭
  const card = dashCard_(ss, tz);
  if (card) data.card = card;
  const bills = typeof dashCardBills_ === 'function' ? dashCardBills_(ss, tz) : null;   // 수입.gs: 카드 출금 예정·할부
  if (bills) data.card = Object.assign(data.card || {}, bills);
  if (typeof dashIncome_ === 'function') data.inc = dashIncome_(ss, tz);                  // 수입.gs: 입금 종류
  if (typeof ledgerLive_ === 'function') data.fixedOut = dashFixedOut_(ledgerLive_(ss, tz), dashIsFixed_(ss));
  tick('inc');
  if (kb) { data.kbBal = kb.bal; data.kbAt = kb.when; }
  data.sync = dashSyncAt_(ss);   // 알림(종): 쿠팡·네이버 마지막 동기화
  if (typeof ptEditList_ === 'function') { try { data.planTab = ptEditList_(ss); } catch (e) {} }   // 계획 줄 고치기용
  if (typeof ledgerLive_ === 'function') { try { data.check = dashCheck_(ledgerLive_(ss, tz), dashIsFixed_(ss), Utilities.formatDate(new Date(), tz, 'yyyy-MM')); } catch (e) {} }   // 확인: 사람에게 보낸 이체
  if (!data.notiFrom && typeof ledgerLive_ === 'function') data.notiFrom = ledgerLive_(ss, tz).map(x => x.when.slice(0, 10)).filter(Boolean).sort()[0] || '';
  data.me = typeof saleMyName_ === 'function' ? saleMyName_() : '나';
  if (typeof saleShareFetch_ === 'function') { try { data.links = saleShareFetch_(); } catch (e) { data.links = []; } }   // 판매.gs 함께 쓰기
  if (!data.rows.length && typeof saleSample_ === 'function' && (typeof SHARE_OUT_ === 'undefined' || !SHARE_OUT_)) { try { saleSample_(ss, tz, data); } catch (e) { console.error('예시: ' + e.message); } }   // 판매.gs: 기록 0줄이면 예시
  tick('rest');
  if (own && (typeof SHARE_OUT_ === 'undefined' || !SHARE_OUT_)) { try { CacheService.getScriptCache().put('perf_build', JSON.stringify(P), 900); } catch (e) {} }
  const out = safeJson_(data);
  if (typeof SHARE_OUT_ === 'undefined' || !SHARE_OUT_) dashCachePut_(out);
  MEMO_ = null;
  return out;
}

/**
 * 알림(은행·카드) 출금 → 대시보드 행. 넣는 것: 출금 중 제외(내 계좌 이체·카드대금·중복 알림) 아님,
 * 쿠팡·네이버 주문과 짝 없음(짝 있으면 구매 행이 이미 있음), 고정지출 아님(가계부 분류 고정·할부·공과금·통신, 개인 탭 고정 항목과 맞는 것)
 * 행 번호 = -(알림원본 행) → 분류 바꾸기는 알림원본 N열에 저장
 */
function dashNotiRows_(ss, tz) {
  if (typeof ledgerLive_ !== 'function') return [];
  const linked = typeof rcptLinked_ === 'function' ? rcptLinked_(ss) : {};   // 영수증과 연결된 결제는 품목으로 대신 (이중 집계 방지)
  return buildNotiRows_(ledgerLive_(ss, tz), dashIsFixed_(ss), dashSyncAt_(ss)).filter(r => !linked[-r[7]]);
}
function dashIsFixed_(ss) { return memo_('isFixed', () => typeof planFixedTest_ === 'function' ? planFixedTest_(ss) : () => false);
}
/** 신용카드(DASH.CARD) 승인 알림 → {unpaid: 승인 합계(취소 뺌), n: 건수, cum: 마지막 '누적 ○원', cumAt} 또는 null
 *  카드대금 출금으로 0부터 다시 세는 규칙은 첫 대금 출금 알림을 본 뒤 추가 (2026-11-13: 지금은 알림 시작 11/7 이후 전부) */
function dashCard_(ss, tz) {
  if (typeof ledgerLive_ !== 'function' || !DASH.CARD) return null;
  try {
    const re = new RegExp('카드\\s*' + DASH.CARD);
    let unpaid = 0, n = 0, cum = null, cumAt = '';
    ledgerLive_(ss, tz).forEach(x => {
      if (!re.test(x.body) || x.excluded || !(x.amount > 0)) return;
      if (x.type === '출금') { unpaid += x.amount; n++; } else if (x.type === '취소') unpaid -= x.amount;
      const m = String(x.body).match(/누적\s*([\d,]+)\s*원/);
      if (m && x.when >= cumAt) { cum = Number(m[1].replace(/,/g, '')); cumAt = x.when; }
    });
    return n || cum != null ? { unpaid, n, cum, cumAt } : null;
  } catch (e) { return null; }
}
/** 생활계좌 마지막 알림 잔액 {bal, when} 또는 null (알림원본 시각 순으로 마지막) */
function dashKbBal_(ss, tz) {
  if (typeof readNotis_ !== 'function' || typeof parseBalance_ !== 'function' || !DASH.LIVING_ACCT) return null;
  try {
    let last = null;
    readNotis_(ss.getSheetByName(LEDGER.NOTI), tz).forEach(x => {
      const b = parseBalance_(x.app, x.title, x.text);
      const t = b ? (b.acct.match(/(\d{2,})$/) || [])[1] : '';   // 생활계좌 = 계좌 탭 끝자리 (예전 '국민 123' 표기도 끝자리로 비교)
      if (b && (b.acct === DASH.LIVING_ACCT || acctTailEq_(t, (String(DASH.LIVING_ACCT).match(/(\d{2,})$/) || [])[1])) && (!last || x.when >= last.when)) last = { bal: b.bal, when: x.when };
    });
    return last;
  } catch (e) { return null; }
}
/** 알림수집기가 기록한 쇼핑몰별 마지막 동기화 시각 (가계부설정 M6:N7) → {쿠팡:'yyyy-MM-dd HH:mm:ss', 네이버:…} */
function dashSyncAt_(ss) { return memo_('syncAt', () => dashSyncAtRaw_(ss)); }
function dashSyncAtRaw_(ss) {
  const o = {};
  try {
    Object.assign(o, saleSyncRead_(ss));
  } catch (e) {}
  return o;
}
const NOTI_FIXED_CAT = ['고정·할부', '공과금·통신', '수입'];
const NOTI_SHOP_RE = /쿠팡|coupang|네이버|naver|N페이|npay/i, NOTI_EATS_RE = /쿠팡이츠|coupangeats|coupang\.mobile\.eats/i;
/**
 * 가게 이름용 분류 (카드·계좌 알림의 가게 이름, '+' 직접 입력 내용). 상품명 규칙(CAT_RULES)보다 먼저 검사.
 * 상품명 규칙에 넣지 않은 이유: '비비고 김밥'·'냉동 피자' 같은 쿠팡 상품은 식품이어야 해서 (2026-11-07 '김밥천국 점심'이 식품으로 잡힘)
 */
const DELIVERY_RE = /쿠팡이츠|coupangeats|coupang\.mobile\.eats|배달의민족|배민|요기요|땡겨요|위메프오/i;   // 배달 앱 (2026-11-08 '배달' 분류)
const TRANSIT_RE = /티머니|tmoney|캐시비|이즐|레일플러스|버스|지하철|도시철도|택시|카카오\s?T(?![a-z])|카카오모빌리티|우티|코레일|KTX|SRT|에스알/i;   // 대중교통·택시 (2026-11-08 '교통' 분류). 주유·주차·하이패스는 차량
const MERCHANT_RULES = [
  ['배달', DELIVERY_RE],
  ['교통', TRANSIT_RE],
  ['외식·카페', /김밥|분식|식당|국밥|순대|치킨|통닭|피자|버거|맥도날드|롯데리아|맘스터치|서브웨이|떡볶이|중국집|반점|짜장|짬뽕|마라|초밥|스시|돈까스|돈가스|고깃집|삼겹|갈비|곱창|막창|족발|보쌈|냉면|칼국수|국수|파스타|뷔페|횟집|포차|호프|주점|이자카야|점심|저녁|회식|커피|카페|베이커리|제과|빵집|파리바게뜨|뚜레쥬르|도넛|던킨|배스킨|설빙|공차|스타벅스|메가커피|컴포즈|이디야|투썸|빽다방|텐퍼센트/i],
  ['가전·디지털', /하이마트|전자랜드|삼성스토어|LG베스트샵|애플스토어|일렉트로마트/i],   // '하이마트'가 아래 '마트'(식품)에 걸리지 않게 먼저
  ['식품', /(?<!하이|일렉트로)마트|편의점|GS25|(^|[^A-Za-z])CU([^A-Za-z]|$)|세븐일레븐|미니스톱|시장|반찬|정육|청과|하나로|홈플러스|코스트코|트레이더스|컬리|장보기/i],
  ['건강', /약국|병원|의원|치과|안과|소아과/],
  ['차량', /주유|충전소|주차|하이패스|세차|정비|카센터|타이어/i],
  ['미용', /미용실|헤어|네일|바버|이발/],
  ['생활·주방', /다이소|세탁소|코인빨래/],
  ['뷰티·위생', /올리브영|롭스|화장품/],
  ['여행', /호텔|모텔|펜션|리조트|숙박|항공|공항/],
];
function merchantCat_(t) {
  const s = String(t || '');
  for (const [c, re] of MERCHANT_RULES) if (re.test(s)) return c;
  return null;
}
const NOTI_CAT_MAP = { '외식·카페': '외식·카페', '장보기': '식품', '의료': '건강', '교통·차량': '차량', '육아': '육아' };
function buildNotiRows_(live, isFixed, syncAt) {
  syncAt = syncAt || {};
  const out = [];
  live.forEach(x => {
    if (!(x.type === '출금' && x.amount > 0 && x.mon && !x.excluded && !x.matched) || notiIsFixed_(x, isFixed)) return;
    let name = notiName_(x), cat = notiCat_(x);
    if (NOTI_SHOP_RE.test(x.text) && !NOTI_EATS_RE.test(x.text)) {
      // 쿠팡·네이버 결제 알림인데 주문과 짝이 없음: 마지막 동기화 뒤의 것만 '동기화 전'으로 임시 포함(다음 동기화 때 주문과 짝지어지면 빠짐), 그 전 것은 구매 행에 이미 있으니 뺌
      const shop = /네이버|naver|N페이|npay/i.test(x.text) ? '네이버' : '쿠팡';
      if (!(syncAt[shop] && x.when > syncAt[shop])) return;
      name = shop + ' 결제 (동기화 전)'; cat = '기타';
    }
    out.push([DASH.NOTI_SRC, x.when.slice(0, 10), 'N' + x.row, name, x.amount, cat, '', -x.row].concat(x.amount0 != null && x.amount0 !== x.amount ? [0, x.amount0] : []));   // 10번째 = 고치기 전 금액 (9번째는 영수증 묶음 자리)
  });
  return out;
}
/**
 * 고정지출(대시보드 지출에서 빼고 계획 탭에서 셈): 개인 탭 고정 항목과 맞음, 또는 가계부 분류가 고정·공과금이면서 대시보드 분류가 '기타'뿐인 것
 *  2026-11-13 수정: 전에는 가계부 분류만 보고 뺐음 → 카드 '3개월 할부' 결제(분류 단어 '할부')·KTX(단어 'KT')·'수도권 주차장'(단어 '수도')이 지출에서 통째로 빠졌음
 */
function notiIsFixed_(x, isFixed) {
  if (x.cat === '수입') return true;
  if (notiNotFixed_(x)) return false;
  if (isFixed(x.text, x.amount)) return true;
  return NOTI_FIXED_CAT.indexOf(x.cat) >= 0 && notiCat_(x) === '기타';
}
/** 고정지출이 될 수 없는 결제: 카드 할부 구매('3개월'), 대중교통·택시·배달 (연결 단어 'KT'·'할부'가 KTX·할부 구매에 걸리던 문제, 2026-11-13) */
function notiNotFixed_(x) {
  const t = [x.text, x.body, x.alt].map(v => String(v || '')).join(' ');
  const n = +((t.match(/(\d{1,2})\s*개월/) || [])[1] || 0);
  return n >= 2 || TRANSIT_RE.test(t) || DELIVERY_RE.test(t);
}
/** 월별 고정지출 알림 합계 {월: 금액} (계획 탭 '나간 돈') */
function dashFixedOut_(live, isFixed) {
  const out = {};
  live.forEach(x => { if (x.type === '출금' && x.amount > 0 && x.mon && !x.excluded && !x.matched && notiIsFixed_(x, isFixed)) out[x.mon] = (out[x.mon] || 0) + x.amount; });
  return out;
}
/** 알림 글에서 가게 이름만 남김 (이름 가림·날짜·계좌·금액·잔액 제거) */
function notiLabel_(x) {
  const p = String(x.party || '').trim();
  if (p) return p;
  const amt = Number(x.amount).toLocaleString('en-US');
  let s = String(x.body || '')
    .replace(/\[수신[^\]]*\]/g, ' ')
    .replace(/잔액[\s\S]*$/, ' ')
    .replace(/[가-힣A-Za-z]\*[가-힣A-Za-z*]*님/g, ' ')
    .replace(/\d{1,2}\/\d{1,2}\s+\d{1,2}:\d{2}/g, ' ')
    .replace(/[\d*]{2,}-[\d*-]+/g, ' ')
    .replace(/\(\d{3,4}\)/g, ' ')
    .split(amt + '원').join(' ').split(amt).join(' ')
    .replace(/\s+/g, ' ').trim()
    .replace(/\s*(FBS|체크카드|신용카드|전자금융|자동이체|CMS|타행|인터넷)?\s*(출금|사용|승인|결제)\s*$/, '').trim()
    .replace(/^[가-힣A-Za-z]*(체크|카드)\s+/, '')   // KB Pay 앞의 카드 이름 'KB국민체크'
    .replace(/\s*\([^)]*$/, '').trim();   // 잘린 괄호 '충전(' / 끝의 '체크카드출금' 같은 말 제거
  return s || String(x.title || '').trim() || '(알림)';
}
/** 가게 이름: 같은 결제의 두 알림(은행·KB Pay) 중 더 긴 이름 (은행 쪽은 잘려 오는 경우가 많음: '파리바게뜨신' vs '파리바게뜨 신흥사거') */
/**
 * 확인 (2026-11-15): 계좌에서 사람 이름으로 나간 이체 = 지출인지 모름 → 사람이 분류를 고르거나 '아님'
 *  대상: 출금 · 이번 달/지난달 · 제외·주문 짝·고정(계획 항목) 아님 · 아직 손대지 않음(알림원본 N열 빔). '아님' = excludeNoti_ (key = 알림 이름으로 행 확인)
 *  이체 표시: 'NN출금'(스마트폰·인터넷·모바일·폰뱅킹) 또는 '→ 이름' (카드·체크카드·자동이체(FBS) 출금은 가게 결제라 뺌)
 */
const CHECK_RE = /(스마트폰|인터넷|모바일|폰뱅킹|ATM)\s*출금|→\s*\S/;
function dashCheck_(live, isFixed, mon) {
  const prev = (() => { const y = +mon.slice(0, 4), m = +mon.slice(5, 7) - 1; return m ? y + '-' + String(m).padStart(2, '0') : (y - 1) + '-12'; })();
  return live.filter(x => x.type === '출금' && x.amount > 0 && (x.mon === mon || x.mon === prev) && !x.excluded && !x.matched && !x.fix
      && CHECK_RE.test(x.body || x.text) && !/체크카드출금|FBS출금|자동이체/.test(x.body || x.text) && !notiIsFixed_(x, isFixed))
    .sort((a, b) => a.when < b.when ? 1 : -1)
    .map(x => ({ row: -x.row, date: x.when.slice(0, 10), key: notiName_(x), name: notiName_(x).replace(/\s*(스마트폰|인터넷|모바일|폰뱅킹)$/, ''), amount: x.amount, acct: (String(x.body || '').match(/\((\d{4})\)/) || String(x.body || '').match(/\*{2,}(\d{2,})/) || [])[1] || '' }));
}
function notiName_(x) {
  const a = notiLabel_(x), b = x.alt ? notiLabel_({ body: x.alt, amount: x.amount }) : '';
  return b && b !== '(알림)' && b.length > a.length ? b : a;
}
/** 알림 분류: 직접 고친 값(대시보드 분류 칸) > 배달·교통 > 가계부 분류를 대시보드 분류로 바꾼 값 > 가게 이름 규칙 > 상품 분류 규칙 */
function notiCat_(x) {
  if (CAT_ORDER.indexOf(x.fix) >= 0) return x.fix;
  const mm = merchantMemoFind_(notiName_(x));   // 가게분류 탭 (대시보드에서 한 번 고친 가게)
  if (mm) return mm;
  const all = [notiLabel_(x), x.title, x.body, x.party, x.alt].map(v => String(v || '')).join(' ');
  if (DELIVERY_RE.test(all)) return '배달';   // 가계부 분류(외식)보다 먼저
  if (TRANSIT_RE.test(all)) return '교통';    // 가계부 분류 '교통·차량'보다 먼저 (주유·주차는 아래에서 차량)
  if (NOTI_CAT_MAP[x.auto]) return NOTI_CAT_MAP[x.auto];
  const t = notiName_(x) + ' ' + String(x.body || '') + ' ' + String(x.alt || '');
  return merchantCat_(t) || classify(t);
}

/* ---------- 직접 입력 (현금 등 알림이 안 오는 지출) ---------- */
function manualTab_(ss, create) {
  let sh = ss.getSheetByName(DASH.MANUAL_TAB);
  if (sh || !create) return sh;
  sh = ss.insertSheet(DASH.MANUAL_TAB); hideTab_(sh);
  sh.getRange(1, 1, 1, 5).setValues([['날짜', '내용', '금액', '분류', '입력시각']]).setFontWeight('bold').setBackground('#385723').setFontColor('#FFFFFF');
  sh.setFrozenRows(1);
  sh.getRange('A:A').setNumberFormat('@'); sh.getRange('C:C').setNumberFormat('#,##0');
  return sh;
}
function manualRows_(ss) {
  const sh = manualTab_(ss, false);
  if (!sh || sh.getLastRow() < 2) return [];
  return sh.getRange(2, 1, sh.getLastRow() - 1, 4).getDisplayValues().map((r, i) => ({
    src: DASH.MANUAL_SRC, date: String(r[0]).trim(), order: 'M' + (i + 2), name: String(r[1]).trim(),
    amount: Number(String(r[2]).replace(/[^0-9.-]/g, '')) || 0, cat: CAT_ORDER.indexOf(r[3]) >= 0 ? r[3] : '기타', row: DASH.MANUAL_BASE + i + 2,
  })).filter(r => /^\d{4}-\d{2}-\d{2}$/.test(r.date) && r.amount > 0);
}
function manualCheck_(o) {
  const date = String(o && o.date || ''), name = String(o && o.name || '').trim().slice(0, 100), amount = Math.round(Number(o && o.amount));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('날짜 형식');
  if (!(amount >= 1 && amount <= 100000000)) throw new Error('금액은 1원~1억');
  if (!name) throw new Error('내용을 입력');
  if (CAT_ORDER.indexOf(o.cat) < 0) throw new Error('없는 분류: ' + o.cat);
  return { date, name, amount, cat: o.cat };
}
/** 대시보드 '+' → 직접입력 탭 한 행 추가. 반환 = 대시보드 행 번호 */
function addManual_(o) {
  dashCacheClear_();
  const v = manualCheck_(o);
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const sh = manualTab_(dashSs_(), true);
    sh.appendRow([v.date, v.name, v.amount, v.cat, Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss')]);
    return DASH.MANUAL_BASE + sh.getLastRow();
  } finally { lock.releaseLock(); }
}
/** 직접 입력 고치기·지우기 (del=true면 그 행을 비움). 행의 내용이 oldName과 다르면 거부 */
function editManual_(row, oldName, o, del) {
  dashCacheClear_();
  const r = Number(row) - DASH.MANUAL_BASE;
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const sh = manualTab_(dashSs_(), false);
    if (!sh || !(r >= 2 && r <= sh.getLastRow())) throw new Error('행 없음 → 새로고침');
    if (String(sh.getRange(r, 2).getDisplayValue()).trim() !== String(oldName).trim()) throw new Error('시트가 바뀜 → 새로고침');
    if (del) { sh.getRange(r, 1, 1, 5).clearContent(); return { deleted: true }; }
    const v = manualCheck_(o);
    sh.getRange(r, 1, 1, 4).setValues([[v.date, v.name, v.amount, v.cat]]);
    return { ok: true };
  } finally { lock.releaseLock(); }
}

/**
 * 대시보드에서 분류 바꾸기 → 구매내역관리 J열 (직접 고친 분류는 자동 분류가 덮어쓰지 않음)
 *  list = [[행번호, 상품명], ...]. 그 행의 상품명(D열)이 다르면(행이 밀렸으면) 건너뜀
 */
function setCategory_(list, cat) {
  dashCacheClear_();
  if (CAT_ORDER.indexOf(cat) < 0) throw new Error('없는 분류: ' + cat);
  if (!Array.isArray(list) || !list.length || list.length > 1000) throw new Error('잘못된 요청');
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const sh = dashSs_().getSheetByName(CFG.SHEET);
    const F = CFG.FIRST_ROW, L = Math.max(buyLast_(sh, F), F);
    const names = sh.getRange(F, 4, L - F + 1, 1).getDisplayValues();
    const ok = [], okN = [], okM = [];
    let skip = 0, live = null, mt = null, rt = null;
    const okR = [], memR = [];
    const memN = [];
    list.forEach(x => {
      const row = Number(x[0]);
      if (typeof RCPT !== 'undefined' && row > RCPT.BASE) {                  // 영수증 품목 → 영수증 E열
        if (!rt) rt = rcptTab_(dashSs_(), false);
        const r = row - RCPT.BASE;
        if (rt && r >= 2 && r <= rt.getLastRow() && String(rt.getRange(r, 3).getDisplayValue()).trim() === String(x[1]).trim()) { okR.push('E' + r); memR.push(String(x[1])); } else skip++;
        return;
      }
      if (row > DASH.MANUAL_BASE) {                                       // 직접 입력 행 → 직접입력 D열
        if (!mt) mt = manualTab_(dashSs_(), false);
        const r = row - DASH.MANUAL_BASE;
        if (mt && r >= 2 && r <= mt.getLastRow() && String(mt.getRange(r, 2).getDisplayValue()).trim() === String(x[1]).trim()) okM.push('D' + r); else skip++;
        return;
      }
      if (row < 0) {                                                     // 카드·계좌 행 → 알림원본 N열(분류 수정)
        if (!live) live = ledgerLive_(dashSs_(), 'Asia/Seoul');
        const n = live.find(o => o.row === -row);
        if (n && (notiName_(n) === String(x[1]) || notiLabel_(n) === String(x[1]))) { okN.push('N' + (-row)); memN.push(notiName_(n)); } else skip++;   // 화면 이름 = notiName_ (2026-11-13 수정: @30부터 이름이 달라 못 바꾸던 문제)
        return;
      }
      if (row >= F && row <= L && names[row - F][0] === String(x[1])) ok.push('J' + row); else skip++;
    });
    if (ok.length) sh.getRangeList(ok).setValue(cat);
    if (okN.length) dashSs_().getSheetByName(LEDGER.NOTI).getRangeList(okN).setValue(cat);
    if (okM.length) mt.getRangeList(okM).setValue(cat);
    if (okR.length) { rt.getRangeList(okR).setValue(cat); merchantMemoSave_(memR, cat); }   // 품목 이름별 기억
    if (memN.length) merchantMemoSave_(memN, cat);   // 가게분류 탭에 기억 → 같은 가게의 다른 결제도 이 분류
    return { done: ok.length + okN.length + okM.length + okR.length, skip };
  } finally { lock.releaseLock(); }
}

/** 대시보드 '이 결제 빼기' (카드·계좌 알림만) → 알림원본 N열 '제외'. list = [[행번호(음수), 화면 이름], …] */
/** 대시보드 자산 고치기 (개인용 2026-11-16 이식, 계좌.gs acSetRow_) */
function setAcctRow_(kind, row, key, o) {
  dashCacheClear_();
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try { return acSetRow_(dashSs_(), kind, row, key, o); } finally { lock.releaseLock(); }
}
/** 대시보드 계획 줄 고치기 (계획탭.gs ptSetRow_) */
function setPlanRow_(row, name, o) {
  dashCacheClear_();
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try { return ptSetRow_(dashSs_(), row, name, o || {}); } finally { lock.releaseLock(); }
}
/** 대시보드 내역 → 금액 고치기: 알림원본 Q '금액 수정'. amount = null이면 원래대로. 원래 금액(F)은 그대로 */
function setNotiAmount_(id, amount) {
  dashCacheClear_();
  const r = -Number(id);
  const sh = dashSs_().getSheetByName(LEDGER.NOTI);
  if (!(r >= 2 && r <= sh.getLastRow()) || sh.getRange(r, 5).getValue() !== '출금') throw new Error('잘못된 줄');
  const v = amount == null || amount === '' ? '' : Math.round(Number(amount));
  if (v !== '' && !(v >= 0 && v <= 100000000)) throw new Error('금액 확인');
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    if (!String(sh.getRange(1, LEDGER.AMT_COL).getValue()).trim()) sh.getRange(1, LEDGER.AMT_COL).setValue('금액 수정').setFontWeight('bold');
    sh.getRange(r, LEDGER.AMT_COL).setValue(v);
    return { ok: 1 };
  } finally { lock.releaseLock(); }
}
function excludeNoti_(list) {
  dashCacheClear_();
  if (!Array.isArray(list) || !list.length || list.length > 200) throw new Error('잘못된 요청');
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const ss = dashSs_(), live = ledgerLive_(ss, 'Asia/Seoul'), ok = [];
    let skip = 0;
    list.forEach(x => {
      const row = Number(x[0]), n = row < 0 ? live.find(o => o.row === -row) : null;
      if (n && (notiName_(n) === String(x[1]) || notiLabel_(n) === String(x[1]))) ok.push('N' + (-row)); else skip++;
    });
    if (ok.length) ss.getSheetByName(LEDGER.NOTI).getRangeList(ok).setValue(LEDGER.FIX_EX);
    return { done: ok.length, skip };
  } finally { lock.releaseLock(); }
}

/** 대시보드에서 예산 바꾸기 → 가계부설정 B4 */
function setBudget_(n) {
  dashCacheClear_();
  n = Math.round(Number(n));
  if (!(n >= 10000 && n <= 100000000)) throw new Error('1만~1억 사이로 입력');
  const name = typeof LEDGER !== 'undefined' ? LEDGER.SET : '가계부설정';
  const st = dashSs_().getSheetByName(name);
  if (!st) throw new Error("'" + name + "' 탭이 없습니다 (setupLedger 먼저 실행)");
  st.getRange('B4').setValue(n);
  return n;
}

/** computeAnalysis와 그 설정값을 브라우저용 코드로 */
function dashLib_() {
  const ser = (name, list) => 'var ' + name + ' = [' + list.map(([c, re]) => '[' + JSON.stringify(c) + ',' + re.toString() + ']').join(',') + '];\n';
  const rules = ser('CAT_RULES', CAT_RULES) + ser('MERCHANT_RULES', MERCHANT_RULES) + merchantCat_.toString() + ';\n';   // '+' 창 분류 자동 추천용 (가게 이름 규칙 → 상품 규칙)
  return 'var CFG = ' + safeJson_({ SOURCES: CFG.SOURCES.concat([DASH.NOTI_SRC, DASH.MANUAL_SRC]).concat(typeof RCPT !== 'undefined' ? [RCPT.SRC] : []) }) + ';\n'
    + rules.split('</').join('<\\/') + classify.toString() + ';\n'
    + 'var ANA = ' + safeJson_(ANA) + ';\n'
    + 'var CAT_ORDER = ' + safeJson_(CAT_ORDER) + ';\n'
    + 'var CAT_COLOR = ' + safeJson_(CAT_COLOR) + ';\n'
    + computeAnalysis.toString() + ';\n';
}

// <script> 안에 넣어도 안전한 JSON (상품명에 '</script>' 같은 글자가 있어도 깨지지 않게)
function safeJson_(x) {
  return JSON.stringify(x).split('<').join(String.fromCharCode(92) + 'u003c');   // JSON 안의 '<'를 유니코드 이스케이프로 (값은 그대로, HTML 파서만 피함)
}
