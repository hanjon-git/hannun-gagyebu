/**
 * 수입.gs — 입금 종류(수입·제외·환불·미정)와 신용카드 출금 예정 (2026-11-13)
 *
 *  입금 종류: '입금분류' 탭
 *    A 보낸 사람 · B 종류 · C 마지막 입금일   (보낸 사람별로 한 번 정하면 다음부터 자동)
 *    E 종류 · F 처리(수입 / 제외 / 환불 / 미정)   (종류 이름은 자유, 계산은 처리로만)
 *    처리: 수입 = 돈 흐름 '들어온 돈'에 더함 / 제외 = 안 셈(내 계좌 이동·가족 이체 등) / 환불 = 지출에서 뺌 / 미정 = 확인 필요
 *  자동 판단 순서: 탭에 정한 보낸 사람 > 가계부설정 제외 키워드(내 이름)에 걸린 입금 = '내 계좌 이동' > 개인 탭 수입 항목 연결 단어 = '수입'
 *                  > 글에 환불·취소·반품 = '환불' > '확인 필요'
 *
 *  카드 출금 예정: DASH.CARD 카드의 승인·취소 알림 + 결제일(INC.PAY_DAY) + KB국민카드 결제일별 이용기간
 *    출금 예정 = 이용기간 안의 일시불 승인 − 취소 + 그 결제일에 걸리는 할부 회차 (할부 수수료·연회비·알림 없는 이용은 빠짐 → 항상 '추정')
 *    이용기간 시작이 알림 수집 시작 전이면 '알림 대기'(계산 안 함)
 */
const INC = {
  TAB: '입금분류',
  TYPES: [['수입', '수입'], ['내 계좌 이동', '제외'], ['환불', '환불'], ['확인 필요', '미정']],
  MAP: [],   // 처음 만들 때 넣을 [보낸 사람, 종류] (판매용: 비움)
  ASK: '확인 필요', MOVE: '내 계좌 이동', REFUND: '환불',
  MODES: ['수입', '제외', '환불', '미정'],
  PAY_DAY: 15,   // 신용카드(DASH.CARD) 결제일 (알림 앱판에서 설정으로 뺄 것)
};

/* ---------- 입금 종류 ---------- */
function incTab_(ss, create) {
  let sh = ss.getSheetByName(INC.TAB);
  if (sh || !create) return sh;
  sh = ss.insertSheet(INC.TAB);
  sh.getRange(1, 1, 1, 3).setValues([['보낸 사람', '종류', '마지막 입금일']]).setFontWeight('bold').setBackground('#385723').setFontColor('#FFFFFF');
  sh.getRange(1, 5, 1, 2).setValues([['종류', '처리 (수입·제외·환불·미정)']]).setFontWeight('bold').setBackground('#385723').setFontColor('#FFFFFF');
  sh.getRange(2, 5, INC.TYPES.length, 2).setValues(INC.TYPES);
  if (INC.MAP.length) sh.getRange(2, 1, INC.MAP.length, 2).setValues(INC.MAP);
  sh.setFrozenRows(1); sh.setColumnWidth(1, 200); sh.setColumnWidth(2, 120); sh.setColumnWidth(5, 120); sh.setColumnWidth(6, 200);
  if (typeof hideTab_ === 'function') hideTab_(sh);
  return sh;
}
/** {types:[[이름,처리]], map:{보낸사람키: 종류}, rows:{보낸사람키: 시트행}} */
function incSettings_(ss) {
  return memo_('incSet', () => {
    const sh = incTab_(ss, true), last = sh.getLastRow();
    const v = last >= 2 ? sh.getRange(2, 1, last - 1, 6).getDisplayValues() : [];
    const types = v.filter(r => String(r[4]).trim()).map(r => [String(r[4]).trim(), INC.MODES.indexOf(String(r[5]).trim()) >= 0 ? String(r[5]).trim() : '미정']);
    if (!types.some(t => t[0] === INC.ASK)) types.push([INC.ASK, '미정']);
    const map = {}, rows = {};
    v.forEach((r, i) => { const k = mkey_(r[0]); if (k) { map[k] = String(r[1]).trim(); rows[k] = i + 2; } });
    return { types, map, rows };
  });
}
/** 입금 알림 → 보낸 사람 (알림 글에서 이름 가림·날짜·계좌·금액·잔액·'전자금융입금' 같은 말 제거) */
function incSender_(x) {
  const p = String(x.party || '').trim();
  if (p) return p;
  const k = String(x.body || '').match(/←\s*([^\n]+?)(?:\s*잔액|\s*$)/);   // 카카오뱅크 '입출금통장(1234) ← 이름'
  if (k) return k[1].trim();
  return notiLabel_({ body: x.body, amount: x.amount, title: x.title })
    .replace(/\s*(전자금융|모바일|인터넷|타행|FBS|CMS|펌뱅킹|자동이체)?\s*입금\s*$/, '').trim() || '(입금)';
}
/** 순수 판단: 입금 한 건 → 종류 이름 */
function incTypeOf_(x, sender, set, incomeRe) {
  const t = set.map[mkey_(sender)];
  if (t && set.types.some(y => y[0] === t)) return t;
  if (x.excluded && !/^중복/.test(x.exWhy || '')) return INC.MOVE;   // 가계부설정 제외 키워드(내 이름 등)
  if (incomeRe && incomeRe.test(x.text)) return '수입';
  if (/환불|취소|반품/.test(x.text)) return INC.REFUND;
  return INC.ASK;
}
/** 순수 계산: ledgerLive_ 행 → 입금 행 [{date, sender, amount, type, mode, row}] (같은 입금의 중복 알림은 뺌) */
function incRowsCalc_(live, set, incomeRe) {
  const modeOf = n => (set.types.find(t => t[0] === n) || [n, '미정'])[1];
  return live.filter(x => x.type === '입금' && x.amount > 0 && x.mon && !/^중복/.test(x.exWhy || '')).map(x => {
    const sender = incSender_(x), type = incTypeOf_(x, sender, set, incomeRe);
    return { date: x.when.slice(0, 10), sender, amount: x.amount, type, mode: modeOf(type), row: -x.row };
  });
}
/** 계획 탭 수입 항목의 찾는 단어를 합친 정규식 */
function incPlanRe_(ss) {
  try {
    const plan = salePlan_(ss); if (!plan) return null;
    const alias = planAlias_(ss);
    const parts = plan.income.map(it => planRe_(alias, it.name)).filter(r => r.re).map(r => r.re.source);
    return parts.length ? new RegExp(parts.join('|'), 'i') : null;
  } catch (e) { return null; }
}
function dashIncome_(ss, tz) {
  if (typeof ledgerLive_ !== 'function') return null;
  try {
    const set = incSettings_(ss);
    return { types: set.types, rows: incRowsCalc_(ledgerLive_(ss, tz), set, incPlanRe_(ss)) };
  } catch (e) { return { error: e.message, types: [], rows: [] }; }
}

/* 대시보드에서 바꾸기 (시트 '입금분류' 탭에 저장) */
function incSave_(fn) {
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try { const ss = dashSs_(); const r = fn(ss, incTab_(ss, true)); if (typeof dashCacheClear_ === 'function') dashCacheClear_(); return r; }
  finally { lock.releaseLock(); }
}
/** 보낸 사람 → 종류 (있으면 고치고 없으면 아래에 추가). '확인 필요'를 고르면 그 줄을 비움 */
function setIncomeType_(sender, type, date) {
  return incSave_((ss, sh) => {
    const k = mkey_(sender); if (!k) throw new Error('보낸 사람이 없음');
    const last = sh.getLastRow(), v = last >= 2 ? sh.getRange(2, 1, last - 1, 2).getDisplayValues() : [];
    const i = v.findIndex(r => mkey_(r[0]) === k);
    if (type === INC.ASK) { if (i >= 0) sh.getRange(i + 2, 1, 1, 3).clearContent(); return true; }
    const row = i >= 0 ? i + 2 : Math.max(1, v.map((r, j) => r[0] ? j + 2 : 0).reduce((a, b) => Math.max(a, b), 1)) + 1;
    sh.getRange(row, 1, 1, 3).setValues([[sender, type, date || '']]);
    return true;
  });
}
/** 종류 추가: 이름 + 처리 */
function addIncomeType_(name, mode) {
  name = String(name || '').trim();
  if (!name || name.length > 20) throw new Error('종류 이름은 1~20자');
  if (INC.MODES.indexOf(mode) < 0) throw new Error('처리는 수입·제외·환불·미정 중 하나');
  return incSave_((ss, sh) => {
    const last = sh.getLastRow(), v = last >= 2 ? sh.getRange(2, 5, last - 1, 1).getDisplayValues() : [];
    if (v.some(r => String(r[0]).trim() === name)) throw new Error('이미 있는 종류');
    const end = v.map((r, j) => String(r[0]).trim() ? j + 2 : 0).reduce((a, b) => Math.max(a, b), 1);
    sh.getRange(end + 1, 5, 1, 2).setValues([[name, mode]]);
    return true;
  });
}
/** 종류 삭제: 목록에서 빼고, 그 종류로 정해 둔 보낸 사람 줄도 비움 (→ 다시 자동 판단, 대개 '확인 필요') */
function delIncomeType_(name) {
  name = String(name || '').trim();
  if (name === INC.ASK) throw new Error("'확인 필요'는 지울 수 없음");
  return incSave_((ss, sh) => {
    const last = sh.getLastRow(); if (last < 2) return true;
    const v = sh.getRange(2, 1, last - 1, 6).getDisplayValues();
    v.forEach((r, i) => {
      if (String(r[4]).trim() === name) sh.getRange(i + 2, 5, 1, 2).clearContent();
      if (String(r[1]).trim() === name) sh.getRange(i + 2, 1, 1, 3).clearContent();
    });
    return true;
  });
}

/* ---------- 신용카드 출금 예정 ---------- */
const incYm_ = (ym, k) => { let y = +ym.slice(0, 4), m = +ym.slice(5, 7) - 1 + k; y += Math.floor(m / 12); m = ((m % 12) + 12) % 12; return y + '-' + String(m + 1).padStart(2, '0'); };
const incDay_ = (ym, d) => { const last = new Date(Date.UTC(+ym.slice(0, 4), +ym.slice(5, 7), 0)).getUTCDate(); return ym + '-' + String(Math.min(d, last)).padStart(2, '0'); };
/** KB국민카드 결제일별 일시불·할부 이용기간 (KB Think 표): 결제월 P, 결제일 d → [시작, 끝] */
function incWindow_(P, d) {
  if (d <= 13) return [incDay_(incYm_(P, -2), d + 17), incDay_(incYm_(P, -1), d + 16)];
  if (d === 14) return [incDay_(incYm_(P, -1), 1), incDay_(incYm_(P, -1), 31)];
  return [incDay_(incYm_(P, -1), d - 13), incDay_(P, d - 14)];
}
/** 그 날짜의 이용이 청구되는 결제월 */
function incPayMonth_(date, d) {
  for (let k = 0; k <= 2; k++) { const P = incYm_(date.slice(0, 7), k), w = incWindow_(P, d); if (date >= w[0] && date <= w[1]) return P; }
  return incYm_(date.slice(0, 7), 1);
}
/**
 * 순수 계산: live = ledgerLive_ 행, cardRe = 카드 알림 정규식, today·notiFrom 'yyyy-MM-dd', dueOf(P) = 휴일 반영 출금일
 *  반환 {payDay, bills:[{pay, due, from, to, amt, n, inst, state:'wait'|'est'}], inst:[{name, date, total, n, k, amt, due}]}
 */
function incCardCalc_(live, cardRe, payDay, today, notiFrom, dueOf) {
  const items = [];
  live.forEach(x => {
    if (!cardRe.test(x.body) || x.excluded || !(x.amount > 0) || !x.mon) return;
    if (x.type !== '출금' && x.type !== '취소') return;
    const n = +((String(x.body).match(/(\d{1,2})\s*개월/) || [])[1] || 1);
    items.push({ date: x.when.slice(0, 10), amount: x.amount, cancel: x.type === '취소', n: n >= 2 ? n : 1, name: (typeof notiName_ === 'function' ? notiName_(x) : '').replace(/\d{1,2}\s*개월|일시불|할부/g, ' ').replace(/\s+/g, ' ').trim() });
  });
  const cur = today.slice(0, 7), bills = [];
  for (let k = 0; k <= 3 && bills.length < 2; k++) {
    const P = incYm_(cur, k), due = dueOf(P);
    if (due < today) continue;
    const w = incWindow_(P, payDay);
    const b = { pay: P, due, from: w[0], to: w[1], amt: 0, n: 0, inst: 0, state: notiFrom && w[0] >= notiFrom ? 'est' : 'wait' };
    if (notiFrom && w[1] >= notiFrom) {
      items.forEach(it => {
        if (it.n > 1) {   // 할부: 첫 회 = 산 날이 들어가는 결제월, 이후 매달. 원금 균등, 나머지는 마지막 회
          const P1 = incPayMonth_(it.date, payDay), r = (+P.slice(0, 4) - +P1.slice(0, 4)) * 12 + (+P.slice(5, 7) - +P1.slice(5, 7)) + 1;
          if (r >= 1 && r <= it.n) { const base = Math.floor(it.amount / it.n); b.inst += r < it.n ? base : it.amount - base * (it.n - 1); }
        } else if (it.date >= w[0] && it.date <= w[1]) { b.amt += it.cancel ? -it.amount : it.amount; if (!it.cancel) b.n++; }
      });
      b.amt += b.inst;
      if (b.state === 'wait') b.state = 'part';   // 이용기간 일부만 알림이 있음 → 추정(일부)
    }
    bills.push(b);
  }
  const next = bills.length ? bills[0].pay : cur;
  const inst = items.filter(it => it.n > 1 && !it.cancel).map(it => {
    const P1 = incPayMonth_(it.date, payDay), r = Math.max(1, (+next.slice(0, 4) - +P1.slice(0, 4)) * 12 + (+next.slice(5, 7) - +P1.slice(5, 7)) + 1);
    const base = Math.floor(it.amount / it.n);
    return { name: it.name, date: it.date, total: it.amount, n: it.n, k: r, amt: r < it.n ? base : it.amount - base * (it.n - 1), due: dueOf(incYm_(P1, r - 1)) };
  }).filter(o => o.k <= o.n);
  return { payDay, bills, inst };
}
function dashCardBills_(ss, tz) {
  if (typeof ledgerLive_ !== 'function' || !DASH.CARD) return null;
  try {
    const live = ledgerLive_(ss, tz);
    const today = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
    const notiFrom = live.map(x => x.when.slice(0, 10)).filter(Boolean).sort()[0] || '';
    const dueOf = P => typeof recDue_ === 'function' ? recDue_(P, INC.PAY_DAY, '다음 영업일') : incDay_(P, INC.PAY_DAY);
    return Object.assign({ card: DASH.CARD }, incCardCalc_(live, new RegExp('카드\\s*' + DASH.CARD), INC.PAY_DAY, today, notiFrom, dueOf));
  } catch (e) { return null; }
}
