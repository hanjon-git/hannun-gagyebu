/** @OnlyCurrentDoc */
/**
 * 판매.gs — 판매용 공통 (2026-11-13 시작)
 *  메뉴 '가계부' · 설치 · '계획'·'설정' 탭 · 웹앱 입구(doGet) · 대시보드 키 · 화면→서버 호출 창구(api)
 *
 *  보이는 탭 = 계획(고객이 입력) · 설정(상태·공휴일). 나머지 기록 탭은 숨김.
 *  보안
 *   - 웹앱 액세스 '모든 사용자'(확장·알림 앱이 구글 로그인 없이 보내야 함), 실행 '나'
 *   - 데이터 받기 = 토큰(TOKEN), 대시보드 = 키(DKEY). 둘 다 스크립트 속성에만 저장, 코드·로그에 없음
 *   - 화면에서 부르는 서버 함수는 api(키, 이름, 인자) 하나뿐. 나머지 공개 함수는 메뉴용(getUi 필요 → 웹앱에서 부르면 실패)
 */
const SALE = {
  VER: '0.3',
  PLAN: '계획', SET: '설정',
  PLAN_GUIDE: '아래 빈 줄에 그냥 입력하세요. 지울 때는 줄 내용만 지우면 됩니다. 순서는 상관없습니다.',
  PLAN_HEAD: ['구분', '대상', '항목', '월 금액', '날짜', '끝나는 달', '쿠팡·네이버 연결 분류', '메모'],
  PLAN_FIRST: 3, PLAN_ROWS: 200,
  KINDS: ['수입', '지출', '저축'],
  WHO: ['나', '배우자', '아이', '공통'],
  REST: '나머지 전부',
  SET_HEAD: ['항목', '값'],
  SET_ROWS: ['대시보드 주소', '연결코드', '쿠팡', '네이버', '버전'],   // A2~A6
  APP_ROW: 8,    // 알림 앱(안드로이드) 설정 머리글 행, 9~12행 값
  APP_KEYS: ['생활계좌 (예: 국민 123)', '신용카드 끝자리 (예: 1234)', '카드 결제일 (1~31)', '내 이름 (내 계좌 이동 판단)'],   // 예전 설정 탭 (옮길 때만)
  CARD_KEYS: ['신용카드 끝자리', '카드 결제일', '내 이름'],   // 새 설정 탭 '카드' 칸
  HOLI_ROW: 14,  // 공휴일 표 머리글 행 (A14:B14), 15행부터 날짜·이름
  // 공휴일 기본값 (한국천문연구원 월력요항 기준으로 개인용에서 쓰던 목록). 고객이 설정 탭에 직접 추가
  HOLI: [
    ['2026-01-01', '신정'], ['2026-02-16', '설날 연휴'], ['2026-02-17', '설날'], ['2026-02-18', '설날 연휴'], ['2026-03-01', '삼일절'], ['2026-03-02', '대체공휴일'],
    ['2026-05-05', '어린이날'], ['2026-05-24', '부처님오신날'], ['2026-05-25', '대체공휴일'], ['2026-06-03', '지방선거'], ['2026-06-06', '현충일'], ['2026-07-17', '제헌절'],
    ['2026-08-15', '광복절'], ['2026-08-17', '대체공휴일'], ['2026-09-24', '추석 연휴'], ['2026-09-25', '추석'], ['2026-09-26', '추석 연휴'], ['2026-10-03', '개천절'],
    ['2026-10-05', '대체공휴일'], ['2026-10-09', '한글날'], ['2026-12-25', '성탄절'],
    ['2027-01-01', '신정'], ['2027-02-06', '설날 연휴'], ['2027-02-07', '설날'], ['2027-02-08', '설날 연휴'], ['2027-02-09', '대체공휴일'], ['2027-03-01', '삼일절'],
    ['2027-05-01', '공휴일'], ['2027-05-03', '대체공휴일'], ['2027-05-05', '어린이날'], ['2027-05-13', '부처님오신날'], ['2027-06-06', '현충일'], ['2027-07-17', '제헌절'],
    ['2027-07-19', '대체공휴일'], ['2027-08-15', '광복절'], ['2027-08-16', '대체공휴일'], ['2027-09-14', '추석 연휴'], ['2027-09-15', '추석'], ['2027-09-16', '추석 연휴'],
    ['2027-10-03', '개천절'], ['2027-10-04', '대체공휴일'], ['2027-10-09', '한글날'], ['2027-10-11', '대체공휴일'], ['2027-12-25', '성탄절'], ['2027-12-27', '대체공휴일'],
  ],
  DAILY_HOUR: 7,
};

/* ---------- 공통 ---------- */
function saleSs_() {
  let ss = null;
  try { ss = SpreadsheetApp.getActiveSpreadsheet(); } catch (e) {}
  if (ss) return ss;
  const id = PropertiesService.getScriptProperties().getProperty('SS_ID');
  if (!id) throw new Error('설치가 아직 안 됨 (시트 메뉴 가계부 → 설치)');
  return SpreadsheetApp.openById(id);
}
function saleProp_(k, make) {
  const p = PropertiesService.getScriptProperties();
  let v = p.getProperty(k);
  if (!v && make) { v = make(); p.setProperty(k, v); }
  return v || '';
}
const saleKey_ = () => saleProp_('DKEY', () => Utilities.getUuid().replace(/-/g, '').slice(0, 20));
function saleWebUrl_() {
  return saleProp_('WEBAPP_URL');   // 배포 후 고객이 한 번 붙여넣음. ScriptApp.getService().getUrl()은 실제 배포 주소와 다른 값을 돌려줘서(2026-11-13 시험: 404) 쓰지 않음
}
/** 연결코드 = 웹앱 주소 + 토큰을 한 줄로 (크롬 확장·알림 앱에 붙여넣기) */
function saleConnCode_() {
  const u = saleWebUrl_();
  if (!u) return '';
  return 'KB1.' + Utilities.base64EncodeWebSafe(JSON.stringify({ u: u, t: saleToken_(), s: saleSs_().getId() })).replace(/=+$/, '');   // s = 이 시트 (확장이 이 시트를 열 때 동기화)
}
/** 알림 앱(안드로이드, noti-collector-sale SetupLink.kt) 설정 링크 — 폰에서 글째 붙여넣기 */
function saleAppLink_() {
  const u = saleWebUrl_();
  return u ? 'noticollector://setup?u=' + encodeURIComponent(u) + '&t=' + saleToken_() : '';
}
function saleDashUrl_() { const u = saleWebUrl_(); return u ? u + '?k=' + saleKey_() : ''; }

/* ---------- 함께 쓰기 (2026-11-15): 각자 시트를 쓰고 읽기 전용 코드로 서로 연결 → 대시보드에서 나 / 상대 / 합쳐서 ----------
 *  RKEY = 읽기 전용 키(대시보드 키 DKEY와 별개). 내 코드 = 'KBR1.' + base64url({u: 웹앱 주소, r: RKEY, n: 내 이름})
 *  상대 시트는 ?r=RKEY&do=share 로 내 지출 줄·예산만 받음 (고치기 불가). LINKS = [{n, u, r}] (스크립트 속성)
 *  끊기 = 내 쪽 목록에서 지움 / 상대 접근 막기 = '키·토큰 새로 만들기'(RKEY도 바뀜)
 */
const saleRKey_ = () => saleProp_('RKEY', () => Utilities.getUuid().replace(/-/g, '').slice(0, 20));
const saleMyName_ = () => PropertiesService.getScriptProperties().getProperty('MYNAME') || '나';
function saleLinks_() { try { return JSON.parse(PropertiesService.getScriptProperties().getProperty('LINKS') || '[]'); } catch (e) { return []; } }
function saleShareCode_() {
  const u = saleWebUrl_();
  return u ? 'KBR1.' + Utilities.base64EncodeWebSafe(JSON.stringify({ u: u, r: saleRKey_(), n: saleMyName_() })).replace(/=+$/, '') : '';
}
/** 'KBR1.…' → {u, r, n} (순수) */
function saleShareParse_(code) {
  const m = String(code || '').trim().match(/^KBR1\.([A-Za-z0-9_-]+)$/);
  if (!m) return null;
  try {
    const s = m[1] + '==='.slice((m[1].length + 3) % 4);
    const o = JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(s)).getDataAsString());
    return o && /^https:\/\/script\.google\.com\/.*\/exec$/.test(o.u) && /^[a-f0-9]{20}$/.test(o.r) ? { u: o.u, r: o.r, n: String(o.n || '상대').slice(0, 20) } : null;
  } catch (e) { return null; }
}
let SHARE_OUT_ = false;   // 상대에게 내보낼 때는 내 쪽 연결을 다시 부르지 않음 (서로 부르는 무한 반복 방지)
/** ?r=RKEY&do=share → {ok, v, name, today, limit, rows} */
function saleShareOut_() {
  let d = null;
  const c = typeof dashCacheGet_ === 'function' ? dashCacheGet_() : null;
  try { d = JSON.parse(c && c.json || 'null'); } catch (e) {}
  if (!d) { SHARE_OUT_ = true; try { d = JSON.parse(getDashboardJson_()); } finally { SHARE_OUT_ = false; } }
  const out = { ok: true, v: 1, name: saleMyName_(), today: d.today, limit: d.gauge ? +d.gauge.limit || 0 : 0, rows: d.rows || [] };
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}
/** 대시보드용: 연결된 사람들의 지출 [{n, rows, limit} | {n, err}] (병렬로 받음) */
function saleShareFetch_() {
  if (SHARE_OUT_) return [];
  const L = saleLinks_();
  if (!L.length) return [];
  const res = UrlFetchApp.fetchAll(L.map(l => ({ url: l.u + '?do=share&r=' + l.r, muteHttpExceptions: true, followRedirects: true })));
  return L.map((l, i) => {
    try {
      const o = JSON.parse(res[i].getContentText());
      return o && o.ok ? { n: l.n, rows: o.rows || [], limit: +o.limit || 0 } : { n: l.n, err: '코드가 바뀜' };
    } catch (e) { return { n: l.n, err: '연결 안 됨' }; }
  });
}

/* ---------- 메뉴 ---------- */
function onOpen() {
  // 메뉴 하나 (2026-11-15): 설치 전엔 '설치'가 맨 위, 그다음 대시보드, 나머지는 관리 안
  const ui = SpreadsheetApp.getUi(), p = PropertiesService.getScriptProperties();
  let installed = false;
  try { installed = p.getProperty('SS_ID') === SpreadsheetApp.getActiveSpreadsheet().getId(); } catch (e) {}
  const m = ui.createMenu('가계부');
  if (!installed) m.addItem('설치 (처음 한 번)', 'saleSetup');
  m.addItem('대시보드 열기', 'openDashboard')
    .addSubMenu(ui.createMenu('관리')
      .addItem('대시보드 주소 · 연결코드', 'saleShowCodes')
      .addItem('함께 쓰기', 'saleShareDialog')
      .addItem('지금 정리', 'saleRefresh')
      .addItem('설치 다시', 'saleSetup')
      .addItem('웹앱 주소 다시 넣기', 'saleResetUrl')
      .addItem('키·토큰 새로 만들기', 'saleRekey')
      .addSeparator()
      .addItem('이용권 키 넣기', 'updLicenseMenu')
      .addItem('업데이트 지금 확인', 'updNowMenu')
      .addItem('자동 업데이트 켜기·끄기', 'updToggleMenu'))
    .addToUi();
  try {   // 시작하기 탭: 사본을 처음 열면 만들고(승인 전에도 됨), 상태는 '아직'부터
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss.getSheetByName(GUIDE.TAB)) { saleGuideTab_(ss).activate(); ss.moveActiveSheet(1); }
    saleGuideStatus_(ss);
  } catch (e) {}
}

/** 설치: 탭 만들기·숨기기, 토큰·키, 매일 자동 정리. 여러 번 눌러도 있는 것은 그대로 둠 */
function saleSetup() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  PropertiesService.getScriptProperties().setProperty('SS_ID', ss.getId());
  if (ss.getSpreadsheetTimeZone() !== 'Asia/Seoul') ss.setSpreadsheetTimeZone('Asia/Seoul');
  saleGuideTab_(ss);
  saleMigrateV2_(ss);
  salePlanTab_(ss);
  saleSetTab_(ss);
  setupSheet();                                   // 구매내역관리 (숨김)
  saleToken_(); saleKey_();
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'saleDaily').forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('saleDaily').timeBased().everyDays(1).atHour(SALE.DAILY_HOUR).create();
  dashWarmSetup_(); PropertiesService.getScriptProperties().setProperty('DASH_WARM_V2', '1');   // 대시보드 4시간마다 미리 계산
  updEnsure_();                                   // 원격 업데이트 확인 (새벽 무작위 시각, 업데이트.gs)
  hideRecordTabsOnce_(ss);
  ['시트1', 'Sheet1'].forEach(n => { const s = ss.getSheetByName(n); if (s && ss.getSheets().length > 1 && s.getLastRow() === 0) ss.deleteSheet(s); });
  ss.getSheetByName(GUIDE.TAB).activate(); ss.moveActiveSheet(1);
  saleSetWrite_(ss);
  saleGuideStatus_(ss);
  const url = saleWebUrl_();
  ui.alert('설치 완료', url ? '메뉴 가계부 → 대시보드 주소 · 연결코드 보기' : "'시작하기' 탭 2번(웹앱 배포)부터 이어서 하세요.", ui.ButtonSet.OK);
}

function saleResetUrl() {
  SpreadsheetApp.getUi();   // 메뉴에서만
  PropertiesService.getScriptProperties().deleteProperty('WEBAPP_URL');
  saleShowCodes();
}

/** 키·토큰이 남에게 보였을 때: 새로 만들면 예전 대시보드 주소·연결코드는 바로 막힘 */
function saleRekey() {
  const ui = SpreadsheetApp.getUi();
  if (ui.alert('키·토큰 새로 만들기', '지금 쓰는 대시보드 주소와 연결코드가 막힙니다. 폰 즐겨찾기와 크롬 확장에 새 값을 다시 넣어야 합니다. 계속할까요?', ui.ButtonSet.YES_NO) !== ui.Button.YES) return;
  const p = PropertiesService.getScriptProperties();
  p.deleteProperty('DKEY'); p.deleteProperty('TOKEN'); p.deleteProperty('RKEY');   // 함께 쓰기 코드도 바뀜 → 상대 연결 끊김
  saleKey_(); saleToken_(); saleRKey_();
  try { dashCacheClear_(); } catch (e) {}
  saleShowCodes();
}

/** 대시보드 주소·연결코드 창. 웹앱 주소를 자동으로 못 찾으면 붙여넣기 받음 */
function saleShowCodes() {
  const ui = SpreadsheetApp.getUi();
  let url = saleWebUrl_();
  if (!url) {
    const r = ui.prompt('웹앱 주소', '배포 후 나온 웹 앱 URL(…/exec)을 붙여넣으세요', ui.ButtonSet.OK_CANCEL);
    if (r.getSelectedButton() !== ui.Button.OK) return;
    const v = String(r.getResponseText()).trim();
    if (!/^https:\/\/script\.google\.com\/.*\/exec$/.test(v)) { ui.alert('주소 형식이 맞지 않습니다 (…/exec 로 끝나야 함)'); return; }
    PropertiesService.getScriptProperties().setProperty('WEBAPP_URL', v);
    url = v;
  }
  saleSetWrite_(SpreadsheetApp.getActiveSpreadsheet());
  saleGuideStatus_(SpreadsheetApp.getActiveSpreadsheet());
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const box = (label, v) => '<div style="margin:0 0 14px"><b>' + label + '</b><textarea readonly onclick="this.select()" style="width:100%;height:58px;margin-top:4px;font:12px monospace">' + esc(v) + '</textarea></div>';
  const html = '<div style="font:13px sans-serif">' + box('대시보드 주소 (폰 즐겨찾기)', saleDashUrl_()) + box('연결코드 (크롬 확장에 붙여넣기)', saleConnCode_()) + box('알림 앱 연결 (안드로이드, 쓸 때만 · 폰 앱에 붙여넣기)', saleAppLink_())
    + '<div style="color:#666">두 값은 비밀번호처럼 다루세요. 다른 사람에게 보내지 마세요.</div></div>';
  ui.showModalDialog(HtmlService.createHtmlOutput(html).setWidth(460).setHeight(400), '대시보드 주소 · 연결코드');
}

function saleRefresh() {
  SpreadsheetApp.getUi();   // 메뉴에서만
  saleDaily();
  toast_('정리 완료');
}

/** 매일 자동 (설치 때 트리거): 쿠팡·네이버 분류 → (알림 앱을 쓰면) 알림 정리 → 점검 */
function saleDaily() {
  const ss = saleSs_();
  const tz = ss.getSpreadsheetTimeZone() || 'Asia/Seoul';
  const err = [];
  const step = (name, fn) => { try { fn(); } catch (e) { err.push(name + ': ' + e.message); console.error(name + ' 실패: ' + e.message); } };
  step('새 탭 구조', () => saleMigrateV2_(ss));
  step('설정 탭', () => saleSetWrite_(ss));
  if (typeof saleArchive_ === 'function') step('보관', () => saleArchive_(ss, tz));
  if (typeof refreshAnalysis === 'function') step('분류', () => refreshAnalysis());
  if (ss.getSheetByName(LEDGER.NOTI)) { step('알림 정리', () => refreshLedger()); step('계좌 목록', () => saleAcctHint_(ss, tz)); }
  else if (typeof runChecks_ === 'function') step('점검', () => runChecks_(ss, tz));
  step('탭 숨김', () => hideRecordTabsOnce_(ss));
  step('시작하기', () => saleGuideStatus_(ss));
  step('업데이트 예약', () => updEnsure_());   // 이미 설치한 사본에도 트리거가 생기게
  step('캐시', () => dashCacheClear_());
  return err;
}

/* ---------- 웹앱 입구 ---------- */
function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.k) {
    if (p.k !== saleKey_()) return HtmlService.createHtmlOutput('<p style="font:15px sans-serif;padding:24px">주소가 맞지 않습니다. 시트 메뉴 가계부 → 대시보드 주소 보기에서 다시 복사하세요.</p>');
    if (p.do === 'ping') return ContentService.createTextOutput(JSON.stringify({ ok: true, build: HN_BUILD, self: updSelfTest_() })).setMimeType(ContentService.MimeType.JSON);   // 업데이트 직후 점검 (업데이트.gs updPing_)
    if (p.do === 'check') return saleCheckOut_();   // 점검용: 매일 정리를 지금 돌리고 결과(오류·건수)를 JSON으로
    return dashOutput_().setTitle(DASH.TITLE).addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }
  if (p.r) {   // 함께 쓰기: 읽기 전용
    if (p.r !== saleRKey_() || p.do !== 'share') return ContentService.createTextOutput('{"ok":false}').setMimeType(ContentService.MimeType.JSON);
    return saleShareOut_();
  }
  if (p.token || p.kind) return receive_(e);
  return HtmlService.createHtmlOutput('<p style="font:15px sans-serif;padding:24px">가계부</p>');
}

/** ?k=키&do=check → 매일 정리 실행 + 대시보드 데이터 계산 결과 요약 (개인 데이터 내용은 안 보냄, 건수만) */
function saleCheckOut_() {
  const t0 = Date.now(), out = { ver: SALE.VER };
  try { out.dailyErrors = saleDaily(); } catch (e) { out.dailyErrors = ['saleDaily: ' + e.message]; }
  try {
    const d = JSON.parse(getDashboardJson_());
    const plan = d.plan || {};
    out.rows = (d.rows || []).length;
    out.bySrc = (d.rows || []).reduce((a, r) => { a[r[0]] = (a[r[0]] || 0) + 1; return a; }, {});
    out.plan = plan.error ? 'error: ' + plan.error : plan.empty ? 'empty' : Object.keys(plan.months || {}).length + 'months';
    out.planWarn = plan.warn || [];
    out.gauge = d.gauge ? { limit: d.gauge.limit, src: d.gauge.src } : null;
    out.notiFrom = d.notiFrom || '';
    out.alert = d.alert || '';
  } catch (e) { out.dashError = e.message; }
  const ss = saleSs_();
  out.tabs = ss.getSheets().map(s => s.getName() + (s.isSheetHidden() ? '(숨김)' : ''));
  out.triggers = ScriptApp.getProjectTriggers().map(t => t.getHandlerFunction());
  out.ms = Date.now() - t0;
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}

/** 화면 → 서버 호출 창구. 키가 맞을 때만, 정해진 함수만 */
const SALE_API = {
  getDashboardJson: () => getDashboardJson_(), getDashFont: () => getDashFont_(), logPerf: (a, b) => logPerf_(a, b),
  addManual: o => addManual_(o), editManual: (r, n, o, d) => editManual_(r, n, o, d), setCategory: (l, c) => setCategory_(l, c), setBudget: n => setBudget_(n),
  excludeNoti: l => excludeNoti_(l),
  setNotiAmount: (i, a) => setNotiAmount_(i, a), setPlanRow: (r, n, o) => setPlanRow_(r, n, o), setAcctRow: (k, r, key, o) => setAcctRow_(k, r, key, o),
  setIncomeType: (s, t, d) => setIncomeType_(s, t, d), addIncomeType: (n, m) => addIncomeType_(n, m), delIncomeType: n => delIncomeType_(n),
};
function api(k, name, args) {
  if (!k || k !== saleKey_()) throw new Error('키가 맞지 않음');
  const f = SALE_API[name];
  if (!f) throw new Error('없는 기능: ' + name);
  return f.apply(null, Array.isArray(args) ? args : []);
}

/* ---------- 계획 탭 (2026-11-15: 개인용과 같은 계획탭.gs 구조로 바꿈 — 판매용_개발가이드 5-2장) ---------- */
/** 예전 배치(1행 안내·2행 머리 8칸: 구분 수입/지출/저축)를 새 배치(10칸: 수입·추가수입·고정·변동·저축 + 찾을·뺄 단어)로 옮김 */
function salePlanTab_(ss) {
  const sh = ss.getSheetByName(PT.TAB);
  if (sh && String(sh.getRange(2, 1).getDisplayValue()).trim() === '구분' && String(sh.getRange(2, 8).getDisplayValue()).trim() === '메모') {
    const n = sh.getLastRow() - 2;
    const v = n > 0 ? sh.getRange(3, 1, n, 8).getDisplayValues() : [];
    sh.setName(PT.TAB + '(예전)'); sh.hideSheet();
    const nsh = ptTab_(ss);
    const rows = v.filter(r => r.some(x => String(x).trim())).map(r => {
      const k = String(r[0]).trim(), cats = String(r[6]).trim();
      const kind = k === '수입' ? '수입' : k === '저축' ? '저축' : k === '지출' ? (cats ? '변동' : '고정') : k;
      return [kind, r[1], r[2], r[3], r[4], r[5], cats, '', '', r[7], ''];
    });
    if (rows.length) nsh.getRange(PT.FIRST, 1, rows.length, PT.COLS).setValues(rows);
    return nsh;
  }
  return ptTab_(ss);
}
/** 계획 탭 → {income, fixed, spend, warn} (계획탭.gs ptParse_) 또는 null */
function salePlan_(ss) {
  return memo_('salePlan', () => { const S = planSource_(ss); return S ? S.plan : null; });
}

/* ---------- 설정 탭 (2026-11-15: 설정.gs 구조 — 연결 상태 · 카드 · 제외 · 분류. 생활계좌 = 계좌 탭, 공휴일 = 숨긴 '공휴일' 탭) ---------- */
const SALE_HOLI_TAB = '공휴일';
/** 설정.gs stTab_가 부름: '연결 상태' 줄 (예전 설정 탭이 있으면 그 값) */
function saleStConn_(prev) {
  const old = {};
  if (prev) prev.getRange(1, 1, Math.min(prev.getLastRow(), 20), 2).getDisplayValues().forEach(r => { old[String(r[0]).trim()] = String(r[1]).trim(); });
  return SALE.SET_ROWS.map(k => [k, old[k] || '']);
}
/** 설정.gs stTab_가 부름: '카드' 칸 (예전 '알림 앱' 칸 값을 옮김. 생활계좌는 계좌 탭으로) */
function saleStCard_(prev) {
  const old = {};
  if (prev) prev.getRange(1, 1, Math.min(prev.getLastRow(), 20), 2).getDisplayValues().forEach(r => { old[String(r[0]).trim()] = String(r[1]).trim(); });
  return SALE.CARD_KEYS.map((k, i) => [k, old[SALE.APP_KEYS[i + 1]] || '']);
}
function saleSetTab_(ss) {
  const prevHoli = saleHoliOld_(ss);
  const sh = stTab_(ss);
  saleHoliTab_(ss, prevHoli);
  return sh;
}
/** 예전 설정 탭(14행부터 공휴일)의 날짜 — 고객이 추가한 날 보존용 */
function saleHoliOld_(ss) {
  const sh = ss.getSheetByName(SALE.SET);
  if (!sh || String(sh.getRange(1, 1).getDisplayValue()).trim() !== '항목' || sh.getLastRow() <= SALE.HOLI_ROW) return null;
  return sh.getRange(SALE.HOLI_ROW + 1, 1, sh.getLastRow() - SALE.HOLI_ROW, 2).getDisplayValues().filter(r => /^\d{4}-\d{2}-\d{2}$/.test(String(r[0]).trim()));
}
function saleHoliTab_(ss, rows) {
  let sh = ss.getSheetByName(SALE_HOLI_TAB);
  if (sh) return sh;
  sh = ss.insertSheet(SALE_HOLI_TAB);
  const v = rows && rows.length ? rows : SALE.HOLI;
  sh.getRange(1, 1, 1, 2).setValues([['날짜', '이름']]).setFontWeight('bold').setBackground('#F3F3F3');
  sh.getRange(2, 1, v.length, 1).setNumberFormat('@');
  sh.getRange(2, 1, v.length, 2).setValues(v);
  sh.hideSheet();
  return sh;
}
/** 알림 앱 설정 {acct(생활계좌 끝자리), card, payDay, myName} — 비면 '' (그 기능 숨김) */
function saleSettings_() {
  return memo_('saleSet', () => {
    const o = { acct: '', card: '', payDay: 0, myName: '' };
    try {
      const ss = saleSs_();
      const ac = typeof AC !== 'undefined' ? ss.getSheetByName(AC.TAB) : null;
      if (ac) { const r = ac.getRange(AC.BANK.first, 1, AC.BANK.n, 3).getDisplayValues().find(x => String(x[2]).trim() === '생활' && String(x[0]).trim()); if (r) o.acct = String(r[0]).trim(); }
      o.card = (stGet_(ss, SALE.CARD_KEYS[0]).match(/\d{4}/) || [''])[0];
      const d = +stGet_(ss, SALE.CARD_KEYS[1]); o.payDay = d >= 1 && d <= 31 ? Math.floor(d) : 0;
      o.myName = stGet_(ss, SALE.CARD_KEYS[2]);
    } catch (e) {}
    return o;
  });
}
function saleAcctHint_() {}   // 계좌 탭이 잔액을 바로 보여줘서 필요 없음 (2026-11-15)
function saleApplySettings_() {
  const s = saleSettings_();
  DASH.LIVING_ACCT = s.acct; DASH.CARD = s.card;
  if (s.payDay && typeof INC !== 'undefined') INC.PAY_DAY = s.payDay;
}
/** 연결 상태 칸 쓰기 — 주소·연결코드는 설치·주소 보기 때 */
function saleSetWrite_(ss) {
  saleSetTab_(ss);
  const u = saleWebUrl_();   // 키·토큰이 든 주소는 칸에 적지 않음 (시트를 공유해도 새지 않게) → 메뉴 창에서만 보여줌
  stSet_(ss, SALE.SET_ROWS[0], u ? '연결됨' : '');
  stSet_(ss, SALE.SET_ROWS[1], '');
  stSet_(ss, SALE.SET_ROWS[4], SALE.VER + ' (' + HN_BUILD + ')');
}
/** 쇼핑몰 마지막 동기화 (수집.gs markSync_) */
function saleSyncWrite_(src, when) { try { stSet_(saleSs_(), src, when); } catch (e) {} }
function saleSyncRead_(ss) {
  const o = {};
  ['쿠팡', '네이버'].forEach(k => { const v = stGet_(ss, k); if (/^\d{4}-\d{2}-\d{2}/.test(v)) o[k] = v; });
  return o;
}
/** 공휴일 {연도: ['MM-DD', …]} — 숨긴 '공휴일' 탭 (없으면 기본값) */
function saleHoli_(ss) {
  return memo_('saleHoli', () => {
    const out = {};
    const add = d => { const m = String(d).trim().match(/^(\d{4})-(\d{2})-(\d{2})$/); if (m) (out[m[1]] = out[m[1]] || []).push(m[2] + '-' + m[3]); };
    const sh = ss && ss.getSheetByName(SALE_HOLI_TAB);
    if (sh && sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, 1).getDisplayValues().forEach(r => add(r[0]));
    else SALE.HOLI.forEach(r => add(r[0]));
    return out;
  });
}
/** 한 번만 (2026-11-15): 새 탭 구조로 — 계획(10칸)·설정(연결 상태·카드·제외·분류)·공휴일(숨김)·계좌·탭 색 */
function saleMigrateV2_(ss) {
  const p = PropertiesService.getScriptProperties();
  if (p.getProperty('SALE_V2')) return;
  salePlanTab_(ss);
  saleSetTab_(ss);
  if (typeof acTab_ === 'function') {
    const t = acTab_(ss);   // 예전 설정 탭 '생활계좌'(예: 국민 123) → 계좌 탭 통장 첫 줄
    const prev = ss.getSheetByName(SALE.SET + '(예전)');
    const r = prev ? prev.getRange(1, 1, Math.min(prev.getLastRow(), 20), 2).getDisplayValues().find(x => String(x[0]).trim() === SALE.APP_KEYS[0]) : null;
    const m = r ? String(r[1]).match(/^\s*(\S*?)\s*(\d{3,})\s*$/) : null;
    if (t.fresh && m) t.sh.getRange(AC.BANK.first, 1, 1, 3).setValues([[m[2], m[1], '생활']]);
  }
  if (typeof tabTidyV1_ === 'function') tabTidyV1_(ss);
  const g = ss.getSheetByName(GUIDE.TAB); if (g) { ss.setActiveSheet(g); ss.moveActiveSheet(1); }   // 시작하기는 맨 앞
  p.setProperty('SALE_V2', '1');
  if (typeof MEMO_ !== 'undefined' && MEMO_) MEMO_ = {};
}

/* ---------- 함께 쓰기 창 (시트 메뉴). 아래 공개 함수들은 getUi()로 시트 안에서만 돌게 함 (웹앱에서 부르면 실패) ---------- */
function saleShareDialog() {
  const ui = SpreadsheetApp.getUi();
  if (!saleWebUrl_()) { ui.alert('먼저 메뉴 가계부 → 대시보드 주소 · 연결코드 보기에서 웹앱 주소를 넣으세요'); return; }
  const h = HtmlService.createHtmlOutput(SHARE_HTML_).setWidth(460).setHeight(400);
  ui.showModalDialog(h, '함께 쓰기');
}
function saleShareData() {
  SpreadsheetApp.getUi();
  return { name: saleMyName_(), code: saleShareCode_(), links: saleLinks_().map(l => l.n) };
}
function saleShareName(n) {
  SpreadsheetApp.getUi();
  n = String(n || '').trim().slice(0, 20);
  if (!n) throw new Error('이름');
  PropertiesService.getScriptProperties().setProperty('MYNAME', n);
  return saleShareData();
}
function saleShareLink(code) {
  SpreadsheetApp.getUi();
  const o = saleShareParse_(code);
  if (!o) throw new Error('코드 형식');
  if (o.r === saleRKey_()) throw new Error('내 코드');
  const res = UrlFetchApp.fetch(o.u + '?do=share&r=' + o.r, { muteHttpExceptions: true, followRedirects: true });
  let ok = false; try { ok = JSON.parse(res.getContentText()).ok; } catch (e) {}
  if (!ok) throw new Error('연결 안 됨');
  const L = saleLinks_().filter(l => l.u !== o.u);
  L.push(o);
  PropertiesService.getScriptProperties().setProperty('LINKS', JSON.stringify(L));
  try { dashCacheClear_(); } catch (e) {}
  return saleShareData();
}
function saleShareUnlink(i) {
  SpreadsheetApp.getUi();
  const L = saleLinks_(); L.splice(Number(i), 1);
  PropertiesService.getScriptProperties().setProperty('LINKS', JSON.stringify(L));
  try { dashCacheClear_(); } catch (e) {}
  return saleShareData();
}
const SHARE_HTML_ = `<style>
body{font-family:Arial,'Noto Sans KR',sans-serif;margin:0;color:#191F28}.l{font-size:13px;color:#6B7684;margin:12px 0 6px}
.r{display:flex;gap:8px}input{flex:1;border:1px solid #E5E8EB;border-radius:8px;padding:9px 11px;font:13px inherit;min-width:0}
input.c{font-family:monospace}button{border:1px solid #E5E8EB;border-radius:8px;padding:9px 13px;font-weight:700;background:#fff;cursor:pointer}
button.k{background:#191F28;color:#fff;border-color:#191F28}.m{display:flex;justify-content:space-between;align-items:center;border-top:1px solid #E5E8EB;padding:10px 0 0;margin-top:10px;font-size:14px}
.m i{font-style:normal;color:#2F9E44;font-size:12px;margin-left:6px}#e{color:#E8590C;font-size:12px;min-height:16px;margin-top:8px}
</style>
<div class="l">내 이름</div><div class="r"><input id="nm"><button id="sv">저장</button></div>
<div class="l">내 코드</div><div class="r"><input id="cd" class="c" readonly><button id="cp">복사</button></div>
<div class="l">상대 코드</div><div class="r"><input id="pc" class="c" placeholder="붙여넣기"><button id="ln" class="k">연결</button></div>
<div id="e"></div><div id="ls"></div>
<script>
var R=google.script.run;function $(i){return document.getElementById(i)}
function err(x){$('e').textContent=x&&x.message?x.message:''}
function show(d){err();$('nm').value=d.name;$('cd').value=d.code;$('ls').innerHTML=d.links.map(function(n,i){return '<div class="m"><span>'+n.replace(/</g,'&lt;')+'<i>연결됨</i></span><button data-i="'+i+'">끊기</button></div>'}).join('')}
R.withSuccessHandler(show).withFailureHandler(err).saleShareData();
$('sv').onclick=function(){R.withSuccessHandler(show).withFailureHandler(err).saleShareName($('nm').value)};
$('cp').onclick=function(){$('cd').select();document.execCommand('copy');$('cp').textContent='복사됨'};
$('ln').onclick=function(){$('ln').disabled=true;R.withSuccessHandler(function(d){$('ln').disabled=false;$('pc').value='';show(d)}).withFailureHandler(function(x){$('ln').disabled=false;err(x)}).saleShareLink($('pc').value)};
$('ls').onclick=function(e){var b=e.target.closest('button');if(b)R.withSuccessHandler(show).withFailureHandler(err).saleShareUnlink(+b.dataset.i)};
</script>`;

/* ---------- 예시 데이터 (2026-11-16, 판매용 업그레이드 기획 S1) ----------
 *  내 기록(구매·알림·직접 입력)이 0줄일 때만 대시보드에 보여 줌. 시트에는 쓰지 않음.
 *  행 번호는 'x…' 글자 → 분류 바꾸기·빼기가 걸리지 않음. 실제 기록이 1줄이라도 생기면 다음 불러오기부터 사라짐.
 *  계획 탭·계좌 탭에 사람이 적은 게 있으면 그건 그대로 쓰고, 비어 있는 것만 예시로 채움 */
const SAMPLE_ = {
  CP: [['생수 2L 12병', '식품', 6900], ['냉동 만두 1kg 2봉', '식품', 15900], ['계란 30구', '식품', 8900], ['닭가슴살 1kg', '식품', 12900], ['우유 900ml 2개', '식품', 5600],
    ['기저귀 4단계 66매', '육아', 32900], ['물티슈 캡형 100매 10팩', '육아', 15800], ['주방세제 1L 3개', '생활·주방', 9900], ['키친타월 6롤', '생활·주방', 7900],
    ['샴푸 1L 2개', '뷰티·위생', 18900], ['USB-C 충전 케이블 2m', '가전·디지털', 8900]],
  NV: [['배추김치 2kg', '식품', 19800], ['면 티셔츠 2장', '의류', 24000], ['원목 수납 선반 3단', '인테리어·가구', 39000], ['유아 빨대컵', '육아', 12000]],
  PLAN: [['수입', '나', '급여', 3200000, 25, '', ''], ['수입', '아이', '아동수당', 100000, 25, '', ''],
    ['고정', '공통', '월세', 550000, 25, '', ''], ['고정', '나', '휴대폰', 55000, 10, '', ''], ['고정', '공통', '자동차 할부', 320000, 15, '2029-02', ''], ['고정', '공통', '넷플릭스', 17000, 15, '', ''],
    ['변동', '공통', '장보기', 500000, '', '', '식품, 생활·주방'], ['변동', '나', '점심·커피', 150000, '', '', '외식·카페'], ['변동', '아이', '육아용품', 200000, '', '', '육아'], ['변동', '공통', '그 외', 200000, '', '', SALE.REST],
    ['저축', '나', '적금', 300000, 5, '2027-06', '']],
  ACCT: { accts: [{ tail: '123', bank: '국민', role: '생활', bal: 812000, at: '' }, { tail: '456', bank: '카카오', role: '비상금', bal: 2400000, at: '' }], others: [], loans: [{ name: '자동차 할부', cur: 9200000, base: 9200000, since: '', item: '자동차 할부', end: '2029-02' }] },
};
/** 오늘이 속한 달과 앞 3달, 오늘까지 → [{src,date,order,name,amount,cat,row}] (같은 날짜면 늘 같은 결과) */
function saleSampleRows_(today) {
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const pick = a => a[Math.floor(rnd() * a.length)];
  const out = []; let ord = 0;
  const y = +today.slice(0, 4), m0 = +today.slice(5, 7) - 1;
  for (let k = 3; k >= 0; k--) {
    const d0 = new Date(y, m0 - k, 1), ym = d0.getFullYear() + '-' + String(d0.getMonth() + 1).padStart(2, '0');
    const last = k === 0 ? +today.slice(8, 10) : new Date(d0.getFullYear(), d0.getMonth() + 1, 0).getDate();
    for (let d = 1; d <= last; d++) {
      const ds = ym + '-' + String(d).padStart(2, '0');
      if (rnd() < 0.4) { const o = 'X' + (++ord); for (let i = 0, n = 1 + Math.floor(rnd() * 3); i < n; i++) { const it = pick(SAMPLE_.CP); out.push({ src: '쿠팡', date: ds, order: o, name: it[0], amount: it[2], cat: it[1], row: 'x' + out.length }); } }
      if (rnd() < 0.12) { const it = pick(SAMPLE_.NV); out.push({ src: '네이버', date: ds, order: 'X' + (++ord), name: it[0], amount: it[2], cat: it[1], row: 'x' + out.length }); }
    }
  }
  return out;
}
/** getDashboardJson_ 끝에서 부름: data를 예시로 채움 (data.sample = 1) */
function saleSample_(ss, tz, data) {
  const today = data.today, rows = saleSampleRows_(today);
  data.rows = rows.map(r => [r.src, r.date, r.order, r.name, r.amount, r.cat, '배송완료', r.row]);
  let realPlan = null; try { realPlan = salePlan_(ss); } catch (e) {}
  if (realPlan) data.plan = planCompare_(ss, tz, rows);
  else {
    const plan = ptParse_(SAMPLE_.PLAN.map(r => [r[0], r[1], r[2], String(r[3]), String(r[4]), r[5], r[6], '', '', '', '']));
    const alias = {}; PLAN.DEFAULT_ALIAS.forEach(r => { alias[r[0]] = r[1]; });   // planAlias_와 같은 방식, 계획만 예시
    plan.income.concat(plan.fixed, plan.spend).forEach(it => { if ((it.find || []).length || (it.cats || []).length) alias[it.name] = { find: it.find || [], not: it.not || [], cats: it.cats || [] }; });
    const stub = { getSheetByName: () => null }, months = [];
    for (let i = 11; i >= 0; i--) { const d = new Date(+today.slice(0, 4), +today.slice(5, 7) - 1 - i, 1); months.push(d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0')); }
    const buys = rows.map(r => ({ date: r.date, name: r.name, amount: r.amount, cat: r.cat, src: r.src }));
    // 수입·고정·저축은 날짜가 지난 것을 낸 것으로 (예시 알림, excluded라 쓰는 돈에는 안 들어감)
    const notis = [], from = months[8] + '-01';
    months.slice(8).forEach(ym => {
      const last = new Date(+ym.slice(0, 4), +ym.slice(5, 7), 0).getDate();
      [['입금', plan.income], ['출금', plan.fixed]].forEach(([type, items]) => items.filter(it => it.day && it.plan > 0 && (!it.end || ym <= it.end)).forEach(it => {
        const ds = ym + '-' + String(Math.min(it.day, last)).padStart(2, '0');
        if (ds < today) notis.push({ type, amount: it.plan, when: ds + ' 09:00:00', text: it.name, body: it.name, mon: ym, excluded: true, matched: false });
      }));
    });
    const rec = typeof recForDash_ === 'function' ? recForDash_(stub, plan, alias, buys, notis, today, from) : null;   // stub → 계획 탭 날짜 채우기도 안 함
    data.plan = { months: computePlanCompare_(plan, alias, buys, notis, months, from, today), notiFrom: from, rec: rec ? rec.map : null, recMonth: today.slice(0, 7), recRows: rec ? rec.rows : null, warn: [] };
    const pb = ptBudget_(plan, today.slice(0, 7));
    data.gauge = Object.assign(data.gauge || {}, pb ? { limit: pb.limit, src: '계획', plan: pb } : { limit: 0, src: 'none' });
  }
  const a = data.assets;
  if (!a || a.error || !((a.accts || []).length || (a.others || []).length || (a.loans || []).length)) {
    const s = JSON.parse(JSON.stringify(SAMPLE_.ACCT)), at = (+today.slice(5, 7)) + '/' + (+today.slice(8, 10));
    s.accts.forEach(x => { x.at = at; });
    s.assets = s.accts.reduce((t, x) => t + x.bal, 0); s.debt = s.loans.reduce((t, x) => t + x.cur, 0); s.net = s.assets - s.debt;
    data.assets = s;
  }
  data.sample = 1; data.alert = ''; data.links = []; data.check = [];
}
