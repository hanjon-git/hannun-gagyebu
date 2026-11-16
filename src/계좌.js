/**
 * 계좌.gs — '계좌' 탭 + 대시보드 '자산' (2026-11-15, 판매용_개발가이드 5-2장)
 *
 *  탭 구성 (A~F, 숨김 G = 대출 기준 '금액|시각ms')
 *   통장    3~10행: 끝자리 · 은행 · 용도 · 메모 (노랑, 직접) · 잔액 · 갱신 (알림 잔액 자동)
 *   기타 자산 14~21행: 이름 · 금액
 *   대출    25~32행: 이름 · 기준 잔액 · 기준일(자동) · 계획 항목(노랑, 드롭다운) · 현재(자동)
 *  개인용: 기타 자산·대출의 이름·금액은 개인 탭 '보유 현금'·'대출 잔액' 칸에서 자동(회색). 판매용(개인 탭 없음)은 직접 입력.
 *  대출 현재 = 기준 잔액 − 기준 시각 이후 '계획 항목' 출금 합 (항목 이름에 '이자'가 있으면 차감 안 함).
 *   기준 시각 = 기준 잔액이 바뀐 순간 (G열에 기록). 금리는 쓰지 않음(사용자 결정).
 */
const AC = {
  TAB: '계좌',
  BANK: { r0: 1, first: 3, n: 8, head: ['끝자리', '은행', '용도', '메모', '잔액', '갱신'] },
  OTHER: { r0: 12, first: 14, n: 8, head: ['이름', '금액', '', '', '', ''] },
  LOAN: { r0: 23, first: 25, n: 8, head: ['이름', '기준 잔액', '기준일', '계획 항목', '현재', ''] },
  ROLES: ['생활', '저축', '카드대금', '기타'],
  SRC_ASSET: '보유 현금', SRC_LOAN: '대출 잔액',
  SKIP_ASSET: /잔액/,           // '카뱅잔액'처럼 알림 잔액이 있는 통장은 통장 칸에서 셈
  INTEREST: /이자/,
  GRAY: '#F1F3F4', YELLOW: '#FFF2CC',
};

/* ---------- 순수 ---------- */

/** 개인 탭 값(표시값·수식) → {others:[[이름,금액]], loans:[[이름,금액]]}. 머리 글자를 찾아 그 아래 빈 칸까지 */
function acFromPersonal_(v, f) {
  const num = x => { const s = String(x == null ? '' : x).replace(/[₩￦,\s원]/g, ''); return /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : null; };
  const block = (head, skip) => {
    let r0 = -1, c0 = -1;
    for (let r = 0; r < Math.min(10, v.length) && r0 < 0; r++) for (let c = 0; c < v[r].length; c++) if (String(v[r][c]).trim() === head) { r0 = r; c0 = c; break; }
    if (r0 < 0) return [];
    const out = [];
    for (let r = r0 + 1; r < v.length; r++) {
      const name = String(v[r][c0] || '').trim();
      if (!name) { if (out.length || r > r0 + 3) break; continue; }   // 머리 바로 아래 빈 칸 몇 줄은 건너뜀
      const amt = num(v[r][c0 + 1]);
      if (amt == null || (f && /^=/.test(String(f[r][c0 + 1] || ''))) || (skip && skip.test(name))) continue;   // 합계 수식 줄·잔액 줄 건너뜀
      out.push([name, amt]);
    }
    return out;
  };
  return { others: block(AC.SRC_ASSET, AC.SKIP_ASSET), loans: block(AC.SRC_LOAN) };
}

/** 대출 이름 → 가장 비슷한 계획 항목 (글자 앞부분 2글자 이상 겹침 · 숫자 일치) */
function acGuessItem_(loan, names) {
  const core = s => String(s).replace(/대출|할부|이자|\s/g, '');
  const L = core(loan), d = (loan.match(/\d+$/) || [''])[0];
  let best = '', score = 0;
  names.forEach(n => {
    const N = core(n);
    if ((n.match(/\d+$/) || [''])[0] !== d) return;
    let k = 0; while (k < Math.min(L.length, N.length) && L[k] === N[k]) k++;
    if (k >= 2 && k > score) { score = k; best = n; }
  });
  return best;
}

/**
 * 대출 현재 잔액 (순수)
 *  loan {base, since(ms), item}, plan item {name, plan}, re = planRe_ 결과, notis = ledgerLive_ 행
 *  이름에 '이자' → base. 아니면 since 이후 출금 중 re가 맞고 금액이 계획 ±50% 안인 것의 합을 뺌
 */
function acLoanNow_(loan, item, re, notis) {
  if (!item || !re || !re.re || AC.INTEREST.test(item.name)) return { cur: loan.base, paid: 0, n: 0 };
  const ok = x => x.type === '출금' && !x.excluded && x.amount > 0 && new Date(String(x.when).replace(' ', 'T') + '+09:00').getTime() > loan.since
    && re.re.test(x.text) && (!item.plan || Math.abs(x.amount - item.plan) <= item.plan * 0.5);
  const hits = notis.filter(ok);
  const paid = hits.reduce((a, x) => a + x.amount, 0);
  return { cur: Math.max(0, loan.base - paid), paid, n: hits.length };
}

/* ---------- 시트 ---------- */

function acTab_(ss) {
  let sh = ss.getSheetByName(AC.TAB);
  if (sh) return { sh, fresh: false };
  const at = ss.getSheetByName(typeof PT !== 'undefined' ? PT.TAB : '계획');
  sh = ss.insertSheet(AC.TAB, at ? at.getIndex() : 0);
  const sec = (S, title) => {
    sh.getRange(S.r0, 1).setValue(title).setFontWeight('bold').setFontSize(11);
    sh.getRange(S.r0 + 1, 1, 1, 6).setValues([S.head]).setFontWeight('bold').setBackground('#F3F3F3')
      .setBorder(null, null, true, null, null, null, '#9AA0A6', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  };
  sec(AC.BANK, '통장'); sec(AC.OTHER, '기타 자산'); sec(AC.LOAN, '대출');
  const B = AC.BANK, O = AC.OTHER, L = AC.LOAN;
  sh.getRange(B.first, 1, B.n, 4).setBackground(AC.YELLOW);
  sh.getRange(B.first, 1, B.n, 1).setNumberFormat('@');
  sh.getRange(B.first, 3, B.n, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(AC.ROLES, true).setAllowInvalid(false).build());
  sh.getRange(B.first, 5, B.n, 1).setNumberFormat('#,##0');
  sh.getRange(O.first, 1, O.n, 2).setBackground(AC.YELLOW);
  sh.getRange(O.first, 2, O.n, 1).setNumberFormat('#,##0');
  sh.getRange(L.first, 1, L.n, 2).setBackground(AC.YELLOW);
  sh.getRange(L.first, 4, L.n, 1).setBackground(AC.YELLOW);
  sh.getRange(L.first, 2, L.n, 1).setNumberFormat('#,##0');
  sh.getRange(L.first, 5, L.n, 1).setNumberFormat('#,##0');
  [110, 120, 100, 170, 120, 90].forEach((w, i) => sh.setColumnWidth(i + 1, w));
  sh.hideColumns(7);
  // 통장: 예전 가계부설정 계좌 용도 표(M9:P)에서 옮김
  const old = typeof acctRolesOld_ === 'function' ? acctRolesOld_(ss) : [];
  if (old.length) sh.getRange(B.first, 1, Math.min(old.length, B.n), 4).setValues(old.slice(0, B.n).map(a => [a.tail, a.bank, a.role, a.memo]));
  return { sh, fresh: true };
}

/** 개인 탭 → 기타 자산·대출 이름·금액(회색), 대출 기준 시각(G) 갱신. live(알림)가 있으면 잔액·현재까지 계산해 씀. 반환 대시보드용 값
 *  2026-11-16 속도: 탭을 한 번에 읽고, 값은 바뀐 칸만 씀. 서식(글자 형식·드롭다운·회색)은 모양(줄 수·계획 항목)이 바뀐 때만 → 대시보드 한 번에 쓰기 12번 → 보통 0~2번 */
function acSync_(ss, live) {
  const { sh } = acTab_(ss);
  const O = AC.OTHER, L = AC.LOAN, B = AC.BANK;
  const V = sh.getRange(1, 1, L.first + L.n - 1, 7).getValues();
  const part = S => V.slice(S.first - 1, S.first - 1 + S.n);
  const src = ss.getSheetByName(typeof PT !== 'undefined' ? PT.SRC : '개인');
  const plan = typeof planSource_ === 'function' ? planSource_(ss) : null;
  const items = plan ? plan.plan.fixed.concat(plan.plan.spend, plan.plan.income) : [];
  const itemNames = items.map(it => it.name);
  const same = (a, b) => a.length === b.length && a.every((r, i) => r.length === b[i].length && r.every((x, j) => acCell_(x) === acCell_(b[i][j])));
  const put = (r, c, old, nv) => { if (!same(old, nv)) sh.getRange(r, c, nv.length, nv[0].length).setValues(nv); };
  let loanV = part(L).map(r => r.slice());
  const loanOld = part(L).map(r => r.slice());
  let nOther = -1, nLoan = -1, others = part(O).filter(r => String(r[0]).trim() && r[1] !== '').map(r => ({ name: String(r[0]).trim(), amt: Number(r[1]) || 0 }));
  if (src) {
    const rng = src.getRange(1, 1, Math.min(src.getLastRow(), 60), Math.min(src.getLastColumn(), 26));
    const P = acFromPersonal_(rng.getDisplayValues(), rng.getFormulas());
    const ov = P.others.slice(0, O.n).map(r => [r[0], r[1]]);
    while (ov.length < O.n) ov.push(['', '']);
    put(O.first, 1, part(O).map(r => [r[0], r[1]]), ov);
    others = ov.filter(r => String(r[0]).trim() && r[1] !== '').map(r => ({ name: String(r[0]).trim(), amt: Number(r[1]) || 0 }));
    const byName = {}; loanV.forEach(r => { if (String(r[0]).trim()) byName[String(r[0]).trim()] = r; });
    loanV = P.loans.slice(0, L.n).map(([n, a]) => { const o = byName[n]; return [n, a, o ? o[2] : '', o && o[3] ? o[3] : acGuessItem_(n, itemNames), o ? o[4] : '', '', o ? o[6] : '']; });
    while (loanV.length < L.n) loanV.push(['', '', '', '', '', '', '']);
    nOther = P.others.length; nLoan = P.loans.length;
  }
  // 서식: 모양이 바뀐 때만 (속성 AC_SIG에 기록)
  const sig = JSON.stringify([nOther, nLoan, itemNames]);
  const pp = PropertiesService.getScriptProperties(), props = typeof ledgerProps_ === 'function' ? ledgerProps_() : pp.getProperties();
  if (props.AC_SIG !== sig) {
    sh.getRange(B.first, 6, B.n, 1).setNumberFormat('@'); sh.getRange(L.first, 3, L.n, 1).setNumberFormat('@');   // '11/15'이 날짜로 바뀌지 않게
    if (itemNames.length) sh.getRange(L.first, 4, L.n, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(itemNames, true).setAllowInvalid(true).build());
    if (src) {
      sh.getRange(O.first, 1, O.n, 2).setBackground(null);
      if (nOther) sh.getRange(O.first, 1, nOther, 2).setBackground(AC.GRAY);
      sh.getRange(L.first, 1, L.n, 2).setBackground(null);
      if (nLoan) sh.getRange(L.first, 1, nLoan, 2).setBackground(AC.GRAY);
    }
    pp.setProperty('AC_SIG', sig); props.AC_SIG = sig;
  }
  // 기준 시각: 기준 잔액이 바뀌었으면 지금
  const now = Date.now(), tz = ss.getSpreadsheetTimeZone() || 'Asia/Seoul';
  loanV.forEach(r => {
    if (r[2] instanceof Date) r[2] = Utilities.formatDate(r[2], tz, 'MM/dd');
    if (!String(r[0]).trim()) { r[2] = ''; r[6] = ''; return; }
    const g = String(r[6] || '').split('|');
    if (g[0] !== String(r[1])) { r[6] = r[1] + '|' + now; r[2] = Utilities.formatDate(new Date(now), tz, 'MM/dd'); }
  });
  // 통장 잔액 + 대출 현재 (알림이 있을 때만)
  const bankV = part(B).map(r => r.slice(0, 6));
  if (live) {
    const bal = {};
    live.forEach(x => { const b = parseBalance_('', x.title, x.body); if (!b) return; const t = (b.acct.match(/(\d{2,})$/) || [])[1]; if (t && (!bal[t] || bal[t].when < x.when)) bal[t] = { bal: b.bal, when: x.when }; });
    bankV.forEach(r => {
      const tail = String(r[0]).trim(); if (!tail) { r[4] = ''; r[5] = ''; return; }
      const k = Object.keys(bal).find(t => acctTailEq_(t, tail)), b = k ? bal[k] : null;
      r[4] = b ? b.bal : ''; r[5] = b ? b.when.slice(5, 10).replace('-', '/') : '';
    });
    put(B.first, 5, part(B).map(r => [r[4], r[5]]), bankV.map(r => [r[4], r[5]]));
    const byItem = {}; items.forEach(it => { byItem[it.name] = it; });
    loanV.forEach(r => {
      if (!String(r[0]).trim()) { r[4] = ''; return; }
      const since = Number(String(r[6]).split('|')[1]) || now, it = byItem[String(r[3]).trim()];
      r[4] = acLoanNow_({ base: Number(r[1]) || 0, since }, it, it ? planRe_(plan.alias, it.name) : null, live).cur;
    });
  }
  put(L.first, 1, loanOld.map(r => [r[0], r[1], r[2], r[3], r[4], r[5], r[6]]), loanV.map(r => [r[0], r[1], r[2], r[3], r[4], '', r[6]]));
  const accts = bankV.map((r, i) => ({ row: B.first + i, tail: String(r[0]).trim(), bank: String(r[1]).trim(), role: String(r[2]).trim(), memo: String(r[3] || '').trim(), bal: r[4] === '' ? null : Number(r[4]), at: r[5] || '' })).filter(x => x.tail);
  const endOf = {}; items.forEach(it => { endOf[it.name] = it.end || ''; });
  const loans = loanV.map((r, i) => ({ row: L.first + i, name: String(r[0]).trim(), cur: Number(r[4] === '' ? r[1] : r[4]) || 0, base: Number(r[1]) || 0, since: r[2], item: String(r[3]).trim(), end: endOf[String(r[3]).trim()] || '', lock: !!src })).filter(x => x.name);   // lock = 개인 탭에서 오는 기준 잔액
  const assets = accts.reduce((a, x) => a + (x.bal || 0), 0) + others.reduce((a, x) => a + x.amt, 0), debt = loans.reduce((a, x) => a + x.cur, 0);
  return { accts, others, loans, assets, debt, net: assets - debt };
}
/** 칸 비교용: 날짜는 MM/dd 글자로, 숫자 글자 '1,000'과 숫자 1000은 같게 (순수) */
function acCell_(x) {
  if (x instanceof Date) return Utilities.formatDate(x, 'Asia/Seoul', 'MM/dd');
  if (x === null || x === undefined) return '';
  return typeof x === 'number' ? String(x) : String(x).trim();
}

/** 대시보드용 (getDashboardJson) */
/** 대시보드에서 계좌 탭 고치기 (2026-11-16). kind 'bank': o = {role, memo} / 'loan': o = {item, base?}. 줄 번호와 끝자리·이름이 맞을 때만. 개인 탭에서 오는 기준 잔액은 안 바꿈 */
function acSetRow_(ss, kind, row, key, o) {
  const sh = ss.getSheetByName(AC.TAB), R = kind === 'bank' ? AC.BANK : kind === 'loan' ? AC.LOAN : null;
  row = Number(row);
  if (!sh || !R || !(row >= R.first && row < R.first + R.n)) throw new Error('잘못된 줄');
  if (String(sh.getRange(row, 1).getDisplayValue()).trim() !== String(key).trim()) throw new Error('계좌 탭이 바뀌었음 — 새로고침');
  o = o || {};
  if (kind === 'bank') {
    if (o.role != null && o.role !== '' && AC.ROLES.indexOf(o.role) < 0) throw new Error('용도 확인');
    if (o.role != null) sh.getRange(row, 3).setValue(o.role);
    if (o.memo != null) sh.getRange(row, 4).setValue(String(o.memo).slice(0, 100));
  } else {
    if (o.item != null) sh.getRange(row, 4).setValue(String(o.item));
    const fromSrc = !!ss.getSheetByName(typeof PT !== 'undefined' ? PT.SRC : '개인');
    if (o.base != null && !fromSrc) { const b = Math.round(Number(o.base)); if (!(b >= 0)) throw new Error('금액 확인'); sh.getRange(row, 2).setValue(b); }   // 기준 시각은 acSync_가 '기준 잔액이 바뀜'을 보고 지금으로
  }
  return { ok: 1 };
}
function acDash_(ss, tz) {
  try { return acSync_(ss, typeof ledgerLive_ === 'function' ? ledgerLive_(ss, tz) : null); }
  catch (e) { return { error: e.message }; }
}

/** 한 번만: 계좌 탭으로 옮긴 옛 칸 숨김 (가계부설정 M~P 계좌 표, 월마감 Q~S 잔액). 지우지 않음 */
function acTidyV1_(ss) {
  if (!ss.getSheetByName(AC.TAB)) throw new Error('계좌 탭 없음');
  const set = ss.getSheetByName(typeof LEDGER !== 'undefined' ? LEDGER.SET : '가계부설정');
  if (set && typeof ACCT !== 'undefined') set.hideColumns(ACCT.COL, 4);
  const close = ss.getSheetByName(typeof LEDGER !== 'undefined' ? LEDGER.CLOSE : '월마감');
  if (close) close.hideColumns(17, 3);
}
