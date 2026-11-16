/**
 * 수집.gs (판매용) — 웹앱 입구: 크롬 확장(쿠팡·네이버)·알림 앱이 보내는 데이터를 받음
 *  개인용에서는 별도 프로젝트(알림수집기)였음. 판매용은 시트에 붙은 프로젝트 하나로 합쳐 배포 1회.
 *  웹앱 액세스 '모든 사용자' + 비밀 토큰(스크립트 속성 TOKEN, 설치 때 자동 생성). 대시보드는 별도 키(DKEY)로 보호 (판매.gs doGet)
 *  원칙: 알림은 원문을 먼저 그대로 저장하고, 금액·구분 추출은 그다음.
 */
const NOTI = {
  TAB: '알림원본',
  HEAD: ['수신시각', '앱', '제목', '내용', '구분', '금액', '상대(추정)', '중복키', '추출메모'],
  BUY_TAB: '구매내역관리',
  BUY_FIRST: 5,
  MAX_ROWS: 3000,           // 구매내역 한 번에 받는 최대 행 (비정상 요청 차단)
  BUY_SRC: { coupang: '쿠팡', naver: '네이버' },   // kind → 구매내역관리 A열 구분
  // 동기화 필요 여부(kind=need, 크롬 확장이 쇼핑몰을 열기 전에 물어봄): 마지막 동기화 뒤 그 쇼핑몰 결제·취소 알림이 있거나 SYNC_MAX_DAYS일이 지났으면 필요
  SHOP_RE: { coupang: /쿠팡|coupang/i, naver: /네이버|naver|N페이|npay/i },
  EATS_RE: /쿠팡이츠|coupangeats|coupang\.mobile\.eats/i,   // 쿠팡이츠는 쿠팡 주문목록에 없음 → 동기화 이유가 아님
  SYNC_MAX_DAYS: 7,
};

/** 토큰 (없으면 만듦). 화면·로그에 찍지 않음 — 연결코드로만 보여줌 (판매.gs) */
function saleToken_() {
  const props = PropertiesService.getScriptProperties();
  let t = props.getProperty('TOKEN');
  if (!t) { t = Utilities.getUuid().replace(/-/g, ''); props.setProperty('TOKEN', t); }
  return t;
}

function doPost(e) { return receive_(e); }

function receive_(e) {
  let p = {};
  try {
    p = params_(e);
    const token = PropertiesService.getScriptProperties().getProperty('TOKEN');
    if (!token || p.token !== token) {
      if (NOTI.BUY_SRC[p.kind] && p.format === 'json') return out_({ ok: false, error: 'token' });
      return p.kind === 'coupang' ? page_(false, '토큰이 맞지 않습니다', ['시트 메뉴 가계부 → 대시보드 주소 · 연결코드 보기에서 연결코드를 다시 복사하세요.']) : out_({ ok: false, error: 'token' });
    }
    if (NOTI.BUY_SRC[p.kind]) return purchase_(p, NOTI.BUY_SRC[p.kind]);
    if (p.kind === 'need') return needSync_();
    const text = String(p.text || '').trim(), title = String(p.title || '').trim();
    if (!text && !title) return out_({ ok: false, error: 'empty' });
    // 광고 푸시는 저장하지 않음 (정보통신망법상 광고 알림은 제목·내용 앞에 '(광고)' 표기)
    if (/^\s*[(\[]\s*광고\s*[)\]]/.test(title) || /^\s*[(\[]\s*광고\s*[)\]]/.test(text)) return out_({ ok: true, skipped: 'ad' });
    const app = String(p.app || '').trim();
    const tz = 'Asia/Seoul';
    const when = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd HH:mm:ss');
    const key = [app, title, text].join('|');
    const lock = LockService.getScriptLock(); lock.waitLock(10000);
    try {
      const sh = tab_();
      // 같은 알림이 다시 표시되는 경우(업데이트·재알림)만 건너뜀: 같은 내용이 2분 안에 또 오면 중복.
      // (같은 가게에서 같은 금액을 하루에 두 번 결제한 건 시간이 떨어져 있으니 둘 다 기록)
      const last = sh.getLastRow();
      if (last > 1) {
        const n = Math.min(50, last - 1);
        const recent = sh.getRange(last - n + 1, 1, n, 8).getValues();
        const now = Date.parse(when.replace(' ', 'T') + '+09:00');
        const t = v => (v instanceof Date ? v.getTime() : Date.parse(String(v).replace(' ', 'T') + '+09:00'));   // 시트가 날짜로 바꿔 저장해도 처리
        if (recent.some(r => r[7] === key && Math.abs(now - t(r[0])) < 120000))
          return out_({ ok: true, dup: true });
      }
      const x = parseNoti(title, text);
      sh.appendRow([when, app, title, text, x.type, x.amount, x.party, key, x.note]);
    } finally { lock.releaseLock(); }
    return out_({ ok: true });
  } catch (err) {
    const msg = String(err && err.message || err);
    if (NOTI.BUY_SRC[p.kind] && p.format === 'json') return out_({ ok: false, error: msg });
    return p.kind === 'coupang' ? page_(false, '반영 실패', [msg]) : out_({ ok: false, error: msg });
  }
}

/** JSON 본문, 폼, 주소(쿼리) 어느 방식으로 보내도 받음 */
function params_(e) {
  const p = Object.assign({}, (e && e.parameter) || {});
  const body = e && e.postData && e.postData.contents;
  if (body) {
    try { Object.assign(p, JSON.parse(body)); }
    catch (err) {
      // JSON이 아니면(알림 문구에 따옴표·줄바꿈이 섞여 깨진 경우 포함) 본문 전체를 알림으로 봄: 첫 줄 = 제목, 나머지 = 내용
      if (!p.text && !p.title && !/^[\w%]+=/.test(body)) {
        const i = body.indexOf('\n');
        if (i > 0) { p.title = body.slice(0, i); p.text = body.slice(i + 1); } else p.text = body;
      }
    }
  }
  return p;
}

function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

function tab_() {
  const ss = saleSs_();
  let sh = ss.getSheetByName(NOTI.TAB);
  if (!sh) {
    sh = ss.insertSheet(NOTI.TAB);
    sh.getRange(1, 1, 1, NOTI.HEAD.length).setValues([NOTI.HEAD]).setFontWeight('bold').setBackground('#1F3864').setFontColor('#FFFFFF');
    sh.setFrozenRows(1);
    sh.getRange('F:F').setNumberFormat('#,##0');
    [150, 110, 160, 420, 60, 90, 160, 80, 160].forEach((w, i) => sh.setColumnWidth(i + 1, w));
    sh.hideColumns(8);
  }
  return sh;
}

/**
 * 알림 문구 → {type: 출금/입금/취소/'', amount, party, note}
 *  은행·카드마다 문구가 달라서 1차 규칙은 일반형. 실제 알림이 쌓이면 규칙을 보완하고 reparseAll() 실행.
 */
function parseNoti(title, text) {
  const s = (String(title || '') + ' ' + String(text || '')).replace(/\s+/g, ' ').trim();
  // 금액 후보: '12,345원' 형태. '잔액'·'누적'·'한도' 바로 뒤 금액은 제외
  const re = /([0-9]{1,3}(?:,[0-9]{3})+|[0-9]+)\s*원/g;
  let m, amount = '', note = '';
  while ((m = re.exec(s)) !== null) {
    const before = s.slice(Math.max(0, m.index - 6), m.index);
    if (/잔액|누적|한도|잔고/.test(before)) continue;
    amount = +m[1].replace(/,/g, '');
    break;
  }
  if (amount === '') note = '금액 못 찾음';
  let type = '';
  if (/취소/.test(s)) type = '취소';
  else if (/입금|받았|들어왔/.test(s)) type = '입금';
  else if (/받아주세요|님이\s*[0-9,]+\s*원을?\s*보냈/.test(s)) type = '입금';   // 2026-11-15: 카카오페이 받은 돈('○○ 님이 …원을 보냈어요')
  else if (/출금|승인|결제|이체|사용|보냈|빠져나/.test(s)) type = '출금';
  else note = (note ? note + ', ' : '') + '구분 못 찾음';
  // 상대(가맹점·받는 사람) 추정: 대괄호·괄호 안 이름, 또는 '→' 뒤
  let party = '';
  const arrow = s.match(/(?:→|->|to)\s*([^\s|,]+)/);
  if (arrow) party = arrow[1];
  return { type, amount, party, note };
}

/** 규칙을 고친 뒤 기존 행 전체 다시 계산 (원문 C·D열 기준) */
function reparseAll() {
  const sh = tab_(), last = sh.getLastRow();
  if (last < 2) return;
  const src = sh.getRange(2, 3, last - 1, 2).getValues();
  const outv = src.map(r => { const x = parseNoti(r[0], r[1]); return [x.type, x.amount, x.party]; });
  const notes = src.map(r => [parseNoti(r[0], r[1]).note]);
  sh.getRange(2, 5, outv.length, 3).setValues(outv);
  sh.getRange(2, 9, notes.length, 1).setValues(notes);
}

/* ---------------- 구매내역 (크롬 확장 kind=coupang|naver, 쿠팡 북마크 kind=coupang / payload) ---------------- */

function purchase_(p, src) {
  const raw = p.payload;
  if (!raw) throw new Error('전달된 데이터가 없습니다');
  const d = JSON.parse(raw);
  if (d.v !== 1 || !Array.isArray(d.rows)) throw new Error('데이터 형식이 맞지 않습니다');
  if (d.rows.length > NOTI.MAX_ROWS) throw new Error('행이 너무 많습니다: ' + d.rows.length);
  const cut = (v, n) => String(v == null ? '' : v).trim().slice(0, n);
  const rows = d.rows
    .map(r => [src, rcDate_(r[0]), cut(r[1], 40), cut(r[2], 300), rcNum_(r[3]) ?? '', rcNum_(r[4]) ?? 0, cut(r[5], 40)])
    .filter(r => r[1] && r[3]);
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  let u;
  try {
    const sh = saleSs_().getSheetByName(NOTI.BUY_TAB);
    if (!sh) throw new Error("'" + NOTI.BUY_TAB + "' 탭이 없습니다");
    u = rcUpsert_(sh, rows);
  } finally { lock.releaseLock(); }
  console.log(src + ' ' + rows.length + '행: 신규 ' + u.added + ' / 갱신 ' + u.updated + ' / 변동 없음 ' + u.same);
  markSync_(p.kind, src);
  if (p.format === 'json') return out_({ ok: true, rows: rows.length, added: u.added, updated: u.updated, same: u.same });   // 크롬 확장용
  return page_(true, '쿠팡 ' + (d.from || '') + ' 이후 ' + rows.length + '행 확인', [
    '신규 추가 ' + u.added + '행',
    '상태·금액 갱신 ' + u.updated + '행 (예: 배송중→배송완료, 취소)',
    '변동 없음 ' + u.same + '행',
    '대시보드에 바로 반영',
  ]);
}

/** 쿠팡·네이버 내역을 받은 시각 기록: 스크립트 속성 SYNC_<kind>(확장의 kind=need용) + 설정 탭(대시보드용) */
function markSync_(kind, src) {
  const ts = Date.now();
  PropertiesService.getScriptProperties().setProperty('SYNC_' + kind, String(ts));
  try { saleSyncWrite_(src, Utilities.formatDate(new Date(ts), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss')); saleGuideStatus_(saleSs_()); }
  catch (e) { console.log('동기화 시각 기록 실패: ' + e.message); }
}

/** kind=need: 쇼핑몰별 동기화 필요 여부 {ok, need:{coupang:{need, why, last}, naver:{…}}} — 확장이 필요 없을 때 쇼핑몰을 열지 않게(로그인 요청·접속 차단 줄이기) */
function needSync_() {
  const props = PropertiesService.getScriptProperties(), now = Date.now();
  const sh = saleSs_().getSheetByName(NOTI.TAB);
  let rows = [];
  if (sh && sh.getLastRow() > 1) { const n = Math.min(400, sh.getLastRow() - 1); rows = sh.getRange(sh.getLastRow() - n + 1, 1, n, 6).getValues(); }
  const t = v => (v instanceof Date ? v.getTime() : Date.parse(String(v).replace(' ', 'T') + '+09:00'));
  const out = {};
  Object.keys(NOTI.BUY_SRC).forEach(id => {
    const last = Number(props.getProperty('SYNC_' + id)) || 0;
    let why = '';
    if (!last) why = '기록 없음';
    else if (now - last > NOTI.SYNC_MAX_DAYS * 864e5) why = NOTI.SYNC_MAX_DAYS + '일 지남';
    else if (!sh && Utilities.formatDate(new Date(last), 'Asia/Seoul', 'yyyy-MM-dd') < Utilities.formatDate(new Date(now), 'Asia/Seoul', 'yyyy-MM-dd')) why = '오늘 아직';   // 판매용 기본판(알림 앱 없음): 결제 알림으로 알 수 없으니 하루 한 번
    else if (rows.some(r => { const h = [r[1], r[2], r[3]].join(' '); return t(r[0]) > last && (r[4] === '출금' || r[4] === '취소') && NOTI.SHOP_RE[id].test(h) && !NOTI.EATS_RE.test(h); })) why = '새 결제 알림';
    out[id] = { need: !!why, why, last: last ? Utilities.formatDate(new Date(last), 'Asia/Seoul', 'yyyy-MM-dd HH:mm') : '' };
  });
  return out_({ ok: true, need: out });
}

/**
 * 구매내역관리 A~G 반영 — 시트 쪽 upsertPurchases_와 같은 규칙
 *  주문번호 있음: 구분+주문번호+상품명이 있으면 수량·금액·상태(E~G)만 갱신 / 주문번호 없음: 구분+주문일+주문번호+상품명+금액 같으면 건너뜀
 */
function rcUpsert_(sh, rows) {
  const F = NOTI.BUY_FIRST, n = Math.max(rcLast_(sh, F) - F + 1, 0);
  const cur = n ? sh.getRange(F, 1, n, 7).getDisplayValues() : [];
  const okey = r => [String(r[0]).trim(), String(r[2] || '').trim(), String(r[3]).trim()].join('|');
  const byOrder = new Map(), keys = new Set();
  cur.forEach((r, i) => { if (!r[0]) return; keys.add(rcKey_(r)); if (String(r[2]).trim()) byOrder.set(okey(r), i); });
  const next = n;   // 마지막 데이터 다음 행부터 이어 씀
  const add = [], upd = [];
  let same = 0;
  rows.forEach(r => {
    if (String(r[2] || '').trim()) {
      const k = okey(r);
      if (byOrder.has(k)) {
        const i = byOrder.get(k);
        if (i < 0) { same++; return; }                      // 같은 요청 안에서 중복
        const c = cur[i];
        const changed = rcNum_(c[5]) !== rcNum_(r[5]) || String(c[6]).trim() !== String(r[6] || '').trim()
          || (r[4] !== '' && rcNum_(c[4]) !== rcNum_(r[4]));
        if (changed) { upd.push([i, r]); c[4] = String(r[4]); c[5] = String(r[5]); c[6] = String(r[6] || ''); } else same++;
        return;
      }
      byOrder.set(k, -1);
    } else {
      const k = rcKey_(r);
      if (keys.has(k)) { same++; return; }
      keys.add(k);
    }
    add.push(r);
  });
  if (add.length) rcEnsure_(sh, F, F + next + add.length - 1);
  upd.forEach(([i, r]) => sh.getRange(F + i, 5, 1, 3).setValues([[r[4], r[5], r[6] || '']]));
  if (add.length) sh.getRange(F + next, 1, add.length, 7).setValues(add);
  return { added: add.length, updated: upd.length, same };
}

function rcDate_(v) {
  if (v instanceof Date && !isNaN(v)) return Utilities.formatDate(v, 'Asia/Seoul', 'yyyy-MM-dd');
  const m = String(v || '').match(/(\d{4})\D{1,3}(\d{1,2})\D{1,3}(\d{1,2})/);
  if (!m) return null;
  return m[1] + '-' + m[2].padStart(2, '0') + '-' + m[3].padStart(2, '0');
}

function rcNum_(v) {
  if (typeof v === 'number') return v;
  const s = String(v == null ? '' : v).replace(/[^\d.-]/g, '');
  if (s === '' || s === '-' || isNaN(+s)) return null;
  return +s;
}

function rcKey_(r) {
  return [String(r[0]).trim(), rcDate_(r[1]) || '', String(r[2] || '').trim(), String(r[3]).trim(), rcNum_(r[5])].join('|');
}

function page_(ok, title, lines) {
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const sheetUrl = saleSs_().getUrl();
  const html = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><base target="_top">'
    + '<style>body{font-family:-apple-system,"Malgun Gothic",sans-serif;background:#F4F5F7;margin:0;padding:40px 16px;color:#191F28}'
    + '.c{max-width:520px;margin:0 auto;background:#fff;border-radius:16px;padding:28px;box-shadow:0 1px 3px rgba(0,0,0,.06)}'
    + 'h1{font-size:20px;margin:0 0 14px}li{margin:6px 0}a{display:inline-block;margin:16px 8px 0 0;padding:10px 14px;border-radius:10px;background:#1F3864;color:#fff;text-decoration:none}'
    + 'a.s{background:#E9ECEF;color:#191F28}</style></head><body><div class="c">'
    + '<h1>' + (ok ? '✅ ' : '⚠️ ') + esc(title) + '</h1><ul>' + lines.map(l => '<li>' + esc(l) + '</li>').join('') + '</ul>'
    + '<a href="' + sheetUrl + '">시트 열기</a><a class="s" href="https://mc.coupang.com/ssr/desktop/order/list">쿠팡 주문목록으로</a></div></body></html>';
  return HtmlService.createHtmlOutput(html).setTitle('쿠팡 → 시트').addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/* ---------- 구매내역관리 행 수 (고정 상한 없음) ----------
 * 예전에는 5~1000행 고정이었음. 이제 데이터 마지막 행까지 읽고, 쓸 때 모자라면 행·수식·서식·드롭다운을 늘림.
 * 첫 실행 때 옛 수식($A$5:$A$1000처럼 1000행에 묶인 범위)을 열 끝까지($A$5:$A)로 바꿈.
 * 이 두 함수는 구매내역_가져오기.gs(buy…)에 같은 코드가 rc만 달리 있음 → 한쪽을 고치면 다른 쪽도.
 */
function rcLast_(sh, F) {
  const m = sh.getMaxRows();
  if (m < F) return F - 1;
  const v = sh.getRange(F, 1, m - F + 1, 4).getValues();   // A~D
  for (let i = v.length - 1; i >= 0; i--) if (String(v[i][0]).trim() !== '' || String(v[i][3]).trim() !== '') return F + i;
  return F - 1;
}
function rcEnsure_(sh, F, needLast) {
  const fix = f => String(f).replace(/(\$[A-Z]+\$\d+:\$[A-Z]+)\$1000\b/g, '$1');
  const m0 = sh.getMaxRows();
  // 1) 옛 1000행 고정 수식 → 열 끝까지 (L열 중복체크, N~R 월별 합계)
  if (/\$1000\b/.test(sh.getRange(F, 12).getFormula())) {
    const lr = sh.getRange(F, 12, m0 - F + 1, 1), lf = lr.getFormulas();
    if (lf.every(r => r[0] !== '')) lr.setFormulas(lf.map(r => [fix(r[0])]));
    else lf.forEach((r, i) => { if (r[0]) sh.getRange(F + i, 12).setFormula(fix(r[0])); });
    const nv = sh.getRange(F, 14, m0 - F + 1, 1).getValues();
    let k = 0; while (k < nv.length && String(nv[k][0]).trim() !== '') k++;
    if (k) {
      const rr = sh.getRange(F, 15, k, 4), rf = rr.getFormulas();
      if (rf.every(r => r.every(c => c !== ''))) rr.setFormulas(rf.map(r => r.map(fix)));
    }
  }
  // 2) needLast 행까지 수식(H·I·L)·서식·드롭다운이 있게 (여유 200행)
  const hf = sh.getRange(F, 8, m0 - F + 1, 1).getFormulas();
  let formLast = F - 1;
  for (let i = hf.length - 1; i >= 0; i--) if (hf[i][0]) { formLast = F + i; break; }
  if (formLast < F || needLast <= formLast) return;
  const target = needLast + 200;
  if (target > m0) sh.insertRowsAfter(m0, target - m0);
  const cnt = target - formLast, src = sh.getRange(formLast, 1, 1, 12), dst = sh.getRange(formLast + 1, 1, cnt, 12);
  src.copyTo(dst, SpreadsheetApp.CopyPasteType.PASTE_FORMAT, false);
  src.copyTo(dst, SpreadsheetApp.CopyPasteType.PASTE_DATA_VALIDATION, false);
  [8, 9, 12].forEach(c => sh.getRange(formLast, c).copyTo(sh.getRange(formLast + 1, c, cnt, 1), SpreadsheetApp.CopyPasteType.PASTE_FORMULA, false));
}
