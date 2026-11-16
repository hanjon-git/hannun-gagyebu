/**
 * 설정.gs — '설정' 탭 (2026-11-15, 판매용_개발가이드 5-2장). 가계부설정에서 쓰던 것 중 사람이 고치는 것만 위에서 아래로.
 *  연결 상태 : 쿠팡·네이버 마지막 동기화 (알림수집기가 숨긴 가계부설정 M6:N7에 계속 기록 → 여기선 수식으로 보여 줌)
 *  제외      : 단어 · 사유 (알림 글에 단어가 있으면 지출·입금에서 뺌)
 *  분류      : 단어(쉼표로 여러 개) · 분류 (위가 우선)
 *  예산은 계획 탭에서 계산(수입 − 고정 − 저축)하므로 여기 없음.
 */
const ST = {
  TAB: '설정',
  CONN: '연결 상태', CARD: '카드', EX: '제외', CAT: '분류',
  EX_ROWS: 20, CAT_ROWS: 40,
  YELLOW: '#FFF2CC',
};

/* ---------- 순수 ---------- */

/** 'A, B' 또는 'A|B' → 정규식 글자 (각 단어는 글자 그대로) */
function stWordsRe_(s) {
  const esc = w => w.replace(/[.*+?^${}()[\]\\]/g, '\\$&');
  return String(s || '').split(/\s*[,|]\s*/).map(w => w.trim()).filter(Boolean).map(esc).join('|');
}
/** 탭 값(A·B 두 칸) → {exclude, rules}. 제목 줄('제외'·'분류') 다음 머리 줄 다음부터 다음 제목까지 */
function stParse_(v) {
  const out = { exclude: [], rules: [] };
  let sec = '';
  v.forEach(r => {
    const a = String(r[0] == null ? '' : r[0]).trim(), b = String(r[1] == null ? '' : r[1]).trim();
    if (a === ST.CONN || a === ST.CARD || a === ST.EX || a === ST.CAT) { sec = a; return; }
    if (!a || a === '단어' || a === '항목') return;
    if (sec === ST.EX) out.exclude.push([a, b]);
    if (sec === ST.CAT) { const re = stWordsRe_(a); if (re) out.rules.push([re, b || '기타']); }
  });
  return out;
}

/* ---------- 시트 ---------- */

/** 없으면 만들고 가계부설정 D:E(제외)·G:H(분류)를 옮김.
 *  판매용: saleStConn_(예전 탭)·saleStCard_(예전 탭)가 있으면 '연결 상태' 줄과 '카드' 칸을 그 값으로. 예전 배치 설정 탭(A1 '항목')은 '설정(예전)'으로 이름을 바꿔 숨기고 새로 만듦 */
function stTab_(ss) {
  let sh = ss.getSheetByName(ST.TAB);
  let prev = null;
  if (sh && String(sh.getRange(1, 1).getDisplayValue()).trim() === '항목') { prev = sh; prev.setName(ST.TAB + '(예전)'); prev.hideSheet(); sh = null; }
  if (sh) return sh;
  const after = ss.getSheetByName(typeof AC !== 'undefined' ? AC.TAB : '계좌') || ss.getSheetByName(typeof PT !== 'undefined' ? PT.TAB : '계획');
  sh = ss.insertSheet(ST.TAB, after ? after.getIndex() : 0);
  const old = ss.getSheetByName(typeof LEDGER !== 'undefined' ? LEDGER.SET : '가계부설정');
  let ex = [], cat = [];
  if (old && old.getLastRow() >= 6) {
    old.getRange(6, 4, old.getLastRow() - 5, 5).getDisplayValues().forEach(r => {
      if (String(r[0]).trim() && !/^\(/.test(String(r[0]).trim())) ex.push([String(r[0]).trim(), String(r[1]).trim()]);   // '(내 이름…)' 안내 줄 제외
      if (String(r[3]).trim()) cat.push([String(r[3]).trim().split('|').map(w => w.trim()).filter(Boolean).join(', '), String(r[4]).trim()]);
    });
  } else if (typeof LEDGER !== 'undefined') { ex = LEDGER.DEFAULT_EXCLUDE.slice(); cat = LEDGER.DEFAULT_RULES.map(r => [String(r[0]).split('|').join(', '), r[1]]); }
  const hd = r => r.setFontWeight('bold').setBackground('#F3F3F3').setBorder(null, null, true, null, null, null, '#9AA0A6', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  const title = (row, t) => sh.getRange(row, 1).setValue(t).setFontWeight('bold').setFontSize(11);
  let r = 1;
  title(r, ST.CONN); hd(sh.getRange(r + 1, 1, 1, 2)).setValues([['항목', '값']]);
  const set = old ? "'" + old.getName() + "'!" : '';
  const conn = typeof saleStConn_ === 'function' ? saleStConn_(prev) : [['쿠팡', old ? '=IFERROR(' + set + 'N6,"")' : ''], ['네이버', old ? '=IFERROR(' + set + 'N7,"")' : '']];
  sh.getRange(r + 2, 1, conn.length, 2).setValues(conn);
  sh.getRange(r + 2, 2, conn.length, 1).setFontColor('#5F6368');
  if (typeof saleStConn_ !== 'function') sh.getRange(r + 2, 2, conn.length, 1).setNumberFormat('yyyy-mm-dd hh:mm');   // 개인용: 동기화 시각 수식이 숫자로 보이지 않게
  r += 3 + conn.length;
  if (typeof saleStCard_ === 'function') {   // 판매용: 카드·내 이름 (알림 앱을 쓸 때)
    const card = saleStCard_(prev);
    title(r, ST.CARD); hd(sh.getRange(r + 1, 1, 1, 2)).setValues([['항목', '값']]);
    sh.getRange(r + 2, 1, card.length, 2).setValues(card);
    sh.getRange(r + 2, 2, card.length, 1).setBackground(ST.YELLOW).setNumberFormat('@');
    r += 3 + card.length;
  }
  title(r, ST.EX); hd(sh.getRange(r + 1, 1, 1, 2)).setValues([['단어', '사유']]);
  const exR = sh.getRange(r + 2, 1, ST.EX_ROWS, 2).setBackground(ST.YELLOW);
  if (ex.length) sh.getRange(r + 2, 1, Math.min(ex.length, ST.EX_ROWS), 2).setValues(ex.slice(0, ST.EX_ROWS));
  r += 2 + ST.EX_ROWS + 1;
  title(r, ST.CAT); hd(sh.getRange(r + 1, 1, 1, 2)).setValues([['단어', '분류']]);
  sh.getRange(r + 2, 1, ST.CAT_ROWS, 2).setBackground(ST.YELLOW);
  if (cat.length) sh.getRange(r + 2, 1, Math.min(cat.length, ST.CAT_ROWS), 2).setValues(cat.slice(0, ST.CAT_ROWS));
  const cats = cat.map(x => x[1]).concat(typeof LEDGER !== 'undefined' ? LEDGER.DEFAULT_RULES.map(x => x[1]) : []).filter((x, i, a) => x && a.indexOf(x) === i);
  if (cats.length) sh.getRange(r + 2, 2, ST.CAT_ROWS, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(cats, true).setAllowInvalid(true).build());
  sh.setColumnWidth(1, 360); sh.setColumnWidth(2, 220);
  return sh;
}

/** 설정 탭에서 A열 이름이 label인 줄의 B값 (없으면 '') / 쓰기 */
function stGet_(ss, label) {
  const sh = ss.getSheetByName(ST.TAB);
  if (!sh || sh.getLastRow() < 1) return '';
  const v = sh.getRange(1, 1, Math.min(sh.getLastRow(), 40), 2).getDisplayValues();
  const r = v.find(x => String(x[0]).trim() === label);
  return r ? String(r[1]).trim() : '';
}
function stSet_(ss, label, value) {
  const sh = ss.getSheetByName(ST.TAB);
  if (!sh || sh.getLastRow() < 1) return false;
  const v = sh.getRange(1, 1, Math.min(sh.getLastRow(), 40), 1).getDisplayValues();
  const i = v.findIndex(x => String(x[0]).trim() === label);
  if (i < 0) return false;
  sh.getRange(i + 1, 2).setValue(value);
  return true;
}

/** 읽기: 설정 탭이 있으면 {exclude, rules}, 없으면 null (→ 가계부설정에서) */
function stRead_(ss) {
  const sh = ss.getSheetByName(ST.TAB);
  const last = sh ? sh.getLastRow() : 0;
  if (last < 2) return null;
  return stParse_(sh.getRange(1, 1, last, 2).getDisplayValues());
}

/** 한 번만 (2026-11-15): 이미 만든 개인용 설정 탭의 동기화 시각 칸 형식 */
function stFmtV1_(ss) {
  const sh = ss.getSheetByName(ST.TAB);
  if (!sh || typeof saleStConn_ === 'function') return;
  const v = sh.getRange(1, 1, Math.min(sh.getLastRow(), 10), 1).getDisplayValues();
  v.forEach((r, i) => { if (/^(쿠팡|네이버)$/.test(String(r[0]).trim())) sh.getRange(i + 1, 2).setNumberFormat('yyyy-mm-dd hh:mm'); });
}
/** 한 번만: 설정 탭을 만들고 가계부설정 탭 숨김 (지우지 않음 — 알림수집기가 M6:N7에 동기화 시각을 계속 씀) */
function stTidyV1_(ss) {
  stTab_(ss);
  const old = ss.getSheetByName(typeof LEDGER !== 'undefined' ? LEDGER.SET : '가계부설정');
  if (old) old.hideSheet();
}

/** 한 번만: 탭 색·순서 정리 (가계부 입력 탭 = 노랑, 자동 계획 = 회색, 개인용 = 초록, 생활 문서 = 연회색으로 맨 뒤). 월마감 안내 2줄 숨김 */
function tabTidyV1_(ss) {
  const mine = !!ss.getSheetByName(typeof PT !== 'undefined' ? PT.SRC : '개인');   // 개인용: 계획 탭은 자동(회색)
  const color = { '시작하기': '#1A73E8', '계획': mine ? '#9AA0A6' : '#F9AB00', '계좌': '#F9AB00', '설정': '#F9AB00', '개인': '#188038', '월마감': '#188038' };
  const known = Object.keys(color).concat(['가계부설정', '정기결제']);
  ss.getSheets().forEach(sh => {
    const n = sh.getName();
    if (color[n]) sh.setTabColor(color[n]);
    else if (!sh.isSheetHidden() && known.indexOf(n) < 0) sh.setTabColor('#DADCE0');   // 생활 문서 등
  });
  // 보이는 생활 문서 탭을 맨 뒤로
  const life = ss.getSheets().filter(sh => !sh.isSheetHidden() && !color[sh.getName()] && known.indexOf(sh.getName()) < 0);
  life.forEach(sh => { ss.setActiveSheet(sh); ss.moveActiveSheet(ss.getNumSheets()); });
  const close = ss.getSheetByName(typeof LEDGER !== 'undefined' ? LEDGER.CLOSE : '월마감');
  if (close) close.hideRows(2, 2);
}
