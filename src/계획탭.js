/**
 * 계획탭.gs — '계획' 탭 (판매용과 같은 구조, 2026-11-15 결정: 판매용_개발가이드 5-2장)
 *
 *  칸: 구분 · 대상 · 항목 · 월 금액 · 날짜 · 끝나는 달 · 연결 분류 · 찾을 단어 · 뺄 단어 · 메모 (+ 숨김 K열 '연동')
 *   구분 = 수입 · 추가수입(예산 제외) · 고정(달마다 한 번) · 변동(여러 번 쓴 합계) · 저축
 *   연결 칸: 연결 분류(넓게) / 찾을 단어(쉼표, 분류보다 우선) / 뺄 단어(같이 있으면 제외). 정규식 없음.
 *   월 금액을 비우면 예산 없이 실적만.
 *
 *  개인용만: '개인' 탭(사용자만 고침, 여기서는 읽기만) → 계획 탭 한 방향.
 *   항목·월 금액 = 개인 탭 값(회색, 덮어씀). 나머지 칸 = 계획 탭에서 입력(노랑, 항목 이름 기준 보존).
 *   개인 탭에서 사라진 이름은 맨 아래 흐린 글자로 남김(K열 '없음'). K열이 빈 줄 = 직접 추가한 줄(그대로 둠).
 *   개인 탭이 없으면(판매용) 아무것도 하지 않음.
 *  아직 계산·대시보드는 이 탭을 읽지 않음(2단계에서 바꿈).
 */
const PT = {
  TAB: '계획', SRC: '개인',   // SRC = 개인용 원본 탭 (판매용엔 없음 → 연동 안 함)
  HEAD: ['구분', '대상', '항목', '월 금액', '날짜', '끝나는 달', '연결 분류', '찾을 단어', '뺄 단어', '메모', '연동'],
  FIRST: 2, ROWS: 200, COLS: 11,
  KINDS: ['수입', '추가수입', '고정', '변동', '저축'],
  WHO: ['나', '배우자', '아이', '공통'],
  SEC_WHO: { '소비성 지출': '공통' },   // 개인 탭 섹션 → 대상. 사람 이름이 들어간 섹션은 코드에 두지 않고 스크립트 속성 PT_SEC_WHO(JSON)에 (2026-11-16: 판매용 공용 파일 개인정보 제거)
  SAVE_SEC: '저축성지출',
  SAVE_RE: /청약|주식|저축|연금|적금|투자/,
  LINK: '개인', GONE: '없음',
  GRAY: '#F1F3F4', YELLOW: '#FFF2CC', DIM: '#9AA0A6',
  EXTRA: ['배달', '출퇴근 톨비', '출퇴근교통비'],   // 개인 탭에 금액이 없어도 실적만 보는 줄로 넣을 연결 단어 항목
};

/* ---------- 순수 함수 (node 테스트) ---------- */

/** '분유(?!케이스|포트)|트루맘|cat:외식·카페' → {cat, find, not} (쉼표 구분 글자) */
function ptFromAlias_(a) {
  a = String(a || '').trim();
  if (!a) return { cat: '', find: '', not: '' };
  if (/^cat:/.test(a)) return { cat: a.slice(4).trim(), find: '', not: '' };
  const parts = [], nots = [];
  let depth = 0, cur = '';
  for (const ch of a) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === '|' && depth === 0) { parts.push(cur); cur = ''; } else cur += ch;
  }
  parts.push(cur);
  const words = parts.map(p => {
    const m = p.match(/^(.*?)\(\?!(.+)\)$/);
    if (m) { m[2].split('|').forEach(w => nots.push(w.trim())); p = m[1]; }
    return p.replace(/\\/g, '').trim();
  }).filter(Boolean);
  const uniq = xs => xs.filter((x, i) => x && xs.indexOf(x) === i);
  return { cat: '', find: uniq(words).join(', '), not: uniq(nots).join(', ') };
}

/** 이름 속 '(~28.5.4)', '(26.6~28.5)', '(~27.4)' → 'yyyy-MM' (없으면 '') */
function ptEnd_(raw) {
  const m = String(raw || '').match(/~\s*(\d{2,4})\.(\d{1,2})/);
  if (!m) return '';
  const y = m[1].length === 2 ? 2000 + Number(m[1]) : Number(m[1]);
  return y + '-' + String(m[2]).padStart(2, '0');
}

/** 이름 속 괄호 안 메모 ('월세(자동출금?)' → '자동출금?'). 날짜·끝나는 달 표기는 뺌 */
function ptMemo_(raw) {
  const out = [];
  String(raw || '').replace(/\(([^)]*)\)/g, (_, x) => {
    const t = x.replace(/~?\s*\d{2,4}\.\d{1,2}(\.\d{1,2})?/g, '').replace(/매월\s*\d{1,2}\s*일/, '').replace(/[~\s]+/g, ' ').trim();
    if (t && t !== '?') out.push(t);
    return '';
  });
  return out.join(' · ');
}

/**
 * 개인 탭 값 → 계획 항목 목록 [{kind, who, name, plan, day, end, memo}]
 *  금액·이름은 parsePlan_(계획.gs)과 같은 규칙. 저축성지출(D·E열) 칸을 더 읽음.
 */
/** 섹션 → 대상 표: 기본 + 스크립트 속성 PT_SEC_WHO (예: {"○○ 지출":"배우자"}) */
function ptSecWho_() {
  let x = {};
  try {
    const all = typeof ledgerProps_ === 'function' ? ledgerProps_() : typeof PropertiesService !== 'undefined' ? PropertiesService.getScriptProperties().getProperties() : {};
    x = JSON.parse(all.PT_SEC_WHO || '{}') || {};
  } catch (e) {}
  return Object.assign({}, PT.SEC_WHO, x && typeof x === 'object' ? x : {});
}
function ptItems_(v, incRange) {
  const plan = parsePlan_(v, incRange);
  if (plan.error) return plan;
  const num = x => { const s = String(x == null ? '' : x).replace(/[₩￦,\s원]/g, ''); return /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : null; };
  // 원래 이름(괄호 포함) 찾기: A열 또는 D열에서 정리한 이름이 같은 첫 칸
  const rawOf = (name, col) => { for (const r of v) { const s = String(r[col] || '').trim(); if (s && planName_(s).name === name) return s; } return name; };
  const items = [];
  plan.income.forEach((it, i) => {
    const raw = it.name === '급여' ? '급여' : rawOf(it.label || it.name, 3);
    items.push({ kind: i === 0 && it.name === '급여' ? '수입' : '추가수입', who: '나', name: it.name, plan: it.plan, day: it.day || null, end: ptEnd_(raw), memo: ptMemo_(raw) });
  });
  const exp = (it, kind) => {
    const raw = rawOf(it.name, 0);
    items.push({ kind, who: ptSecWho_()[it.sec] || '공통', name: it.name, plan: it.plan, day: it.day || null, end: ptEnd_(raw), memo: ptMemo_(raw) });
  };
  // 개인 탭 순서대로 (섹션별 → 그 안에서 위에서 아래)
  const all = plan.fixed.map(it => [it, 'f']).concat(plan.spend.map(it => [it, 's']));
  const rowOf = it => v.findIndex(r => planName_(String(r[0] || '').trim()).name === it.name);
  all.sort((a, b) => rowOf(a[0]) - rowOf(b[0])).forEach(([it, t]) => exp(it, t === 's' ? '변동' : PT.SAVE_RE.test(it.name) ? '저축' : '고정'));
  // 저축성지출: D열 제목 아래, '총합' 건너뜀, 빈 칸에서 끝
  const h = v.findIndex(r => String(r[3] || '').trim() === PT.SAVE_SEC);
  if (h >= 0) for (let j = h + 1; j < v.length; j++) {
    const a = String(v[j][3] || '').trim();
    if (!a) break;
    if (a === '총합') continue;
    const amt = num(v[j][4]);
    if (!(amt > 0)) continue;
    const p = planName_(a);
    items.push({ kind: '저축', who: '공통', name: p.name, plan: amt, day: p.day, end: ptEnd_(a), memo: ptMemo_(a) });
  }
  return items;
}

/**
 * 계획 탭 행 만들기 (순수)
 *  items: ptItems_ 결과, old: 지금 계획 탭 값(2행부터, 11칸), alias: {이름: 단어}, rec: {이름: {day, pay}} (정기결제 탭)
 *  반환 {rows: [[11칸]], kinds: ['link'|'user'|'gone']}
 */
function ptBuild_(items, old, alias, rec) {
  const key = s => String(s || '').trim();
  const oldRows = old.filter(r => r.some(x => key(x)));
  const byName = {};
  oldRows.forEach((r, i) => { const k = key(r[2]); if (k && !(k in byName)) byName[k] = i; });
  const used = {};
  const rows = [], kinds = [];
  const aliasOf = name => {
    if (alias[name] != null) return alias[name];
    const k = Object.keys(alias).filter(x => name.indexOf(x) >= 0).sort((x, y) => y.length - x.length)[0];
    return k ? alias[k] : '';
  };
  items.forEach(it => {
    const i = byName[it.name];
    let r;
    if (i != null && !used[i]) {
      used[i] = true;
      r = oldRows[i].slice(0, PT.COLS);
      while (r.length < PT.COLS) r.push('');
      r[2] = it.name; r[3] = it.plan;
      if (!key(r[4]) && it.day) r[4] = it.day;
    } else {
      const L = ptFromAlias_(aliasOf(it.name)), R = rec[it.name] || {};
      r = [it.kind, it.who, it.name, it.plan, it.day || R.day || '', it.end, L.cat, L.find, L.not, [it.memo, R.pay].filter(Boolean).join(' · '), ''];
    }
    r[10] = PT.LINK;
    rows.push(r); kinds.push('link');
  });
  const inItems = {}; items.forEach(it => { inItems[it.name] = true; });
  // 직접 추가한 줄(연동 표시 없음) → 그대로. 예전에 연동됐는데 개인 탭에서 사라진 줄 → 맨 아래 흐리게
  const gone = [];
  oldRows.forEach((r, i) => {
    if (used[i]) return;
    const rr = r.slice(0, PT.COLS); while (rr.length < PT.COLS) rr.push('');
    if (key(rr[10]) === PT.LINK || key(rr[10]) === PT.GONE) { if (!inItems[key(rr[2])]) { rr[10] = PT.GONE; gone.push(rr); } }
    else { rows.push(rr); kinds.push('user'); }
  });
  gone.forEach(r => { rows.push(r); kinds.push('gone'); });
  return { rows, kinds };
}

/** 처음 만들 때만: 개인 탭에 금액이 없는 연결 단어 항목(배달 등)을 실적만 보는 줄로 */
function ptExtraRows_(items, alias) {
  const have = {}; items.forEach(it => { have[it.name] = true; });
  return PT.EXTRA.filter(n => !have[n] && alias[n] != null).map(n => {
    const L = ptFromAlias_(alias[n]);
    return ['변동', '공통', n, '', '', '', L.cat, L.find, L.not, '', ''];
  });
}

/* ---------- 시트 ---------- */

function ptTab_(ss) {
  let sh = ss.getSheetByName(PT.TAB);
  if (sh) return sh;
  sh = ss.insertSheet(PT.TAB, 0);
  const F = PT.FIRST, N = PT.ROWS;
  sh.getRange(1, 1, 1, PT.COLS).setValues([PT.HEAD]).setFontWeight('bold').setBackground('#F3F3F3')
    .setBorder(null, null, true, null, null, null, '#9AA0A6', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  sh.setFrozenRows(1);
  const list = (vals, strict) => SpreadsheetApp.newDataValidation().requireValueInList(vals, true).setAllowInvalid(!strict).build();
  sh.getRange(F, 1, N, 1).setDataValidation(list(PT.KINDS, true));
  sh.getRange(F, 2, N, 1).setDataValidation(list(PT.WHO, false));
  sh.getRange(F, 4, N, 1).setNumberFormat('#,##0');
  sh.getRange(F, 5, N, 1).setNumberFormat('0').setDataValidation(SpreadsheetApp.newDataValidation().requireNumberBetween(1, 31).setAllowInvalid(false).build());
  sh.getRange(F, 6, N, 1).setNumberFormat('@');
  sh.getRange(F, 7, N, 1).setDataValidation(list(CAT_ORDER.filter(c => c !== '배송비'), false));
  sh.getRange(F, 1, N, 10).setBackground(PT.YELLOW);
  [56, 64, 150, 96, 48, 80, 96, 240, 140, 160].forEach((w, i) => sh.setColumnWidth(i + 1, w));
  sh.getRange(F, 4, N, 2).setHorizontalAlignment('right');
  sh.hideColumns(PT.COLS);
  return sh;
}

/** 정기결제 탭 → {항목: {day, pay}} ('20일', '14일(추정)' 모두 숫자만) */
function ptRec_(ss) {
  const out = {};
  const sh = ss.getSheetByName(typeof REC !== 'undefined' ? REC.TAB : '정기결제');
  if (!sh || sh.getLastRow() < 2) return out;
  sh.getRange(2, 1, sh.getLastRow() - 1, 6).getDisplayValues().forEach(r => {
    const name = String(r[1]).trim(); if (!name) return;
    const d = String(r[3]).match(/(\d{1,2})\s*일/);
    out[name] = { day: d ? Number(d[1]) : null, pay: String(r[5]).trim() };
  });
  return out;
}

/** 개인 탭 → 계획 탭. force가 아니면 개인 탭 값이 바뀐 때만 씀. 반환 {ok, rows, changed} */
function planTabSync_(ss, force) {
  const src = ss.getSheetByName(PT.SRC);
  if (!src || typeof parsePlan_ !== 'function') return { ok: false, why: 'no personal tab' };
  const v = memo_('planV', () => src.getRange(1, 1, Math.min(src.getLastRow(), 200), 6).getDisplayValues());
  const pp = PropertiesService.getScriptProperties();
  const hash = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, JSON.stringify(v)));
  const fresh = !ss.getSheetByName(PT.TAB);
  if (!force && !fresh && pp.getProperty('PLAN_TAB_HASH') === hash) return { ok: true, changed: false };
  const items = ptItems_(v, planIncRange_(src, v));
  if (items.error) return { ok: false, why: items.error };
  const sh = ptTab_(ss);
  const last = sh.getLastRow();
  const old = last >= PT.FIRST ? sh.getRange(PT.FIRST, 1, last - PT.FIRST + 1, PT.COLS).getValues() : [];
  const alias = planAlias_(ss);
  const B = ptBuild_(items, old, alias, fresh ? ptRec_(ss) : {});
  if (fresh) ptExtraRows_(items, alias).forEach(r => { B.rows.push(r); B.kinds.push('user'); });
  const n = B.rows.length, clearN = Math.max(n, old.length);
  if (clearN) sh.getRange(PT.FIRST, 1, clearN, PT.COLS).clearContent().setFontColor(null).setBackground(PT.YELLOW);
  if (n) {
    sh.getRange(PT.FIRST, 1, n, PT.COLS).setValues(B.rows);
    B.kinds.forEach((k, i) => {
      const row = PT.FIRST + i;
      if (k === 'link') sh.getRange(row, 3, 1, 2).setBackground(PT.GRAY);
      if (k === 'gone') sh.getRange(row, 1, 1, 10).setFontColor(PT.DIM).setBackground(null);
    });
  }
  pp.setProperty('PLAN_TAB_HASH', hash);
  return { ok: true, changed: true, rows: n };
}

/* ---------- 2단계: 계산이 계획 탭을 읽음 (2026-11-15) ---------- */

/** 계획 탭 값(2행부터 11칸 표시값) → {income, fixed, spend, warn} (순수 · 판매용과 같은 함수)
 *  수입·추가수입 → income(추가수입은 extra = 예산 제외) · 고정·저축 → fixed · 변동 → spend(금액 없으면 실적만)
 *  끝나는 달이 지난 달에는 계산에서 뺌(computePlanCompare_·planBudget_). K열 '없음' 줄은 건너뜀 */
function ptParse_(v) {
  const num = x => { const s = String(x == null ? '' : x).replace(/[₩￦,\s원]/g, ''); return /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : null; };
  const list = s => String(s == null ? '' : s).split(/\s*[,，]\s*/).map(x => x.trim()).filter(Boolean);
  const out = { income: [], fixed: [], spend: [], warn: [] }, seen = {};
  v.forEach((r, i) => {
    const row = i + PT.FIRST;
    if (String(r[10] || '').trim() === PT.GONE) return;
    const kind = String(r[0] || '').trim(), who = String(r[1] || '').trim(), raw = String(r[2] || '').trim(), amt = num(r[3]);
    if (!kind && !raw && amt == null) return;
    if (!raw) { out.warn.push(row + '행 항목 없음'); return; }
    let name = raw;
    if (seen[name]) name = name + ' (' + (who || row) + ')';
    seen[name] = true;
    const d = num(r[4]), e = String(r[5] || '').trim().match(/^(\d{4})-(\d{1,2})$/);
    const it = { name, who, kind, sec: kind, day: d >= 1 && d <= 31 ? Math.floor(d) : null, plan: amt > 0 ? amt : null,
      end: e ? e[1] + '-' + e[2].padStart(2, '0') : '', cats: list(r[6]), find: list(r[7]), not: list(r[8]), extra: kind === '추가수입' };
    if (kind === '변동') { out.spend.push(it); return; }
    if (!(amt > 0)) { out.warn.push(row + '행 금액 없음'); return; }
    if (kind === '수입' || kind === '추가수입') out.income.push(it);
    else if (kind === '고정' || kind === '저축') out.fixed.push(it);
    else out.warn.push(row + '행 구분 없음');
  });
  return out;
}

/** 연결 칸 → 찾기 {re:{test,source}, not} 또는 {cat, not}. 찾을 단어 > 연결 분류 > 항목 이름 단어 (대소문자 무시, 글자 포함) */
function ptRe_(o, name) {
  const lc = s => String(s == null ? '' : s).toLowerCase();
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const N = (o.not || []).map(lc).filter(Boolean);
  const not = s => { const t = lc(s); return N.some(w => t.indexOf(w) >= 0); };
  let F = (o.find || []).map(lc).filter(Boolean);
  if (!F.length && o.cat) return { cat: o.cat, not };
  if (!F.length) F = String(name).split(/[\s/+]+/).map(w => w.replace(/[0-9()~.]/g, '')).filter(w => w.length > 1).map(lc);
  if (!F.length) F = [lc(name)];
  return { re: { test: s => { const t = lc(s); return F.some(w => t.indexOf(w) >= 0) && !N.some(w => t.indexOf(w) >= 0); }, source: F.map(esc).join('|') }, not };
}

/** 계획 탭이 있고 항목이 있으면 {plan, alias, tab:true} (alias[이름] = 연결 칸 객체 → planRe_가 ptRe_로 처리), 없으면 null → 예전처럼 개인 탭 */
/** 대시보드 한 번 안에서 계획 탭 끝 줄·표시값은 한 번만 읽음 (2026-11-16 속도). 쓰면 ptDispDrop_ */
function ptLast_(sh) { return memo_('ptLast', () => sh.getLastRow()); }
function ptDisp_(sh) { return memo_('ptDisp', () => { const last = ptLast_(sh); return last < PT.FIRST ? [] : sh.getRange(PT.FIRST, 1, last - PT.FIRST + 1, PT.COLS).getDisplayValues(); }); }
function ptDispDrop_() { if (typeof MEMO_ !== 'undefined' && MEMO_) delete MEMO_.ptDisp; }
function planSource_(ss) {
  return memo_('planSrc', () => {
    const sh = ss.getSheetByName(PT.TAB);
    if (!sh || ptLast_(sh) < PT.FIRST) return null;
    const p = ptParse_(ptDisp_(sh));
    if (!(p.income.length + p.fixed.length + p.spend.length)) return null;
    return { plan: p, alias: ptAlias_(p), tab: true };
  });
}
function ptAlias_(p) {
  const a = {};
  p.income.concat(p.fixed, p.spend).forEach(it => { a[it.name] = { link: true, find: it.find, not: it.not, cat: it.cats[0] || '' }; });
  return a;
}
/** 대시보드 편집용 (2026-11-16): 계획 탭 줄 목록 [{row, kind, name, amt, day, end, find, not, lock}] (lock = 개인 탭에서 오는 금액) */
function ptEditList_(ss) {
  const sh = ss.getSheetByName(PT.TAB);
  if (!sh || ptLast_(sh) < PT.FIRST) return [];
  return ptDisp_(sh).map((r, i) => ({
    row: PT.FIRST + i, kind: String(r[0]).trim(), name: String(r[2]).trim(), amt: Number(String(r[3]).replace(/[^\d.-]/g, '')) || 0,
    day: String(r[4]).trim(), end: String(r[5]).trim(), find: String(r[7]).trim(), not: String(r[8]).trim(), lock: String(r[10]).trim() === PT.LINK,
  })).filter(x => x.name && String(x.kind) && x.kind !== PT.GONE);
}
/** 대시보드에서 계획 줄 고치기: o = {day, end, find, not, amt?}. 줄 번호와 항목 이름이 둘 다 맞을 때만 씀. 개인 탭에서 오는 금액(K '개인')은 안 바꿈 */
function ptSetRow_(ss, row, name, o) {
  const sh = ss.getSheetByName(PT.TAB);
  row = Number(row);
  if (!sh || !(row >= PT.FIRST && row <= sh.getLastRow())) throw new Error('잘못된 줄');
  const cur = sh.getRange(row, 1, 1, PT.COLS).getDisplayValues()[0];
  if (String(cur[2]).trim() !== String(name).trim()) throw new Error('계획 탭이 바뀌었음 — 새로고침');
  const day = String(o.day == null ? '' : o.day).trim(), end = String(o.end == null ? '' : o.end).trim();
  if (day && !(/^\d{1,2}$/.test(day) && +day >= 1 && +day <= 31)) throw new Error('날짜는 1~31');
  if (end && !/^\d{4}-\d{1,2}$/.test(end)) throw new Error('끝나는 달은 2028-05 형식');
  const words = s => String(s == null ? '' : s).split(/\s*[,，]\s*/).map(x => x.trim()).filter(Boolean).join(', ');
  sh.getRange(row, 5).setValue(day ? +day : '').setFontColor(null);
  sh.getRange(row, 6).setNumberFormat('@').setValue(end ? end.replace(/-(\d)$/, '-0$1') : '');
  sh.getRange(row, 8, 1, 2).setValues([[words(o.find), words(o.not)]]);
  if (o.amt != null && String(cur[10]).trim() !== PT.LINK) { const a = Math.round(Number(o.amt)); if (!(a >= 0)) throw new Error('금액 확인'); sh.getRange(row, 4).setValue(a || ''); }
  return { ok: 1 };
}
/** 그 달에 살아 있는 항목인지 (끝나는 달 이후면 false) */
const ptLive_ = (it, m) => !it.end || it.end >= m;

/** 월 예산 (그 달 기준, 순수)
 *  수입 줄이 있으면 = 수입(추가수입 제외) − 고정 − 저축 / 없으면 = 변동 계획 합 (수입을 안 적는 사람) / 둘 다 0이면 null */
function ptBudget_(p, m) {
  const sum = xs => xs.filter(it => ptLive_(it, m)).reduce((a, it) => a + (it.plan || 0), 0);
  const inc = sum(p.income.filter(it => !it.extra)), spend = sum(p.spend);
  const limit = inc > 0 ? inc - sum(p.fixed) : spend;
  if (!(limit > 0)) return null;
  return { limit: Math.round(limit), free: Math.round(limit - spend), spend };
}

/** 한 번만: 계획 탭으로 옮긴 뒤 안 쓰는 칸 숨김 (정기결제 탭, 가계부설정 J·K열 연결 단어). 지우지 않음 */
function ptTidyV1_(ss) {
  if (!ss.getSheetByName(PT.TAB)) throw new Error('계획 탭 없음');
  const rec = ss.getSheetByName(typeof REC !== 'undefined' ? REC.TAB : '정기결제');
  if (rec) rec.hideSheet();
  const set = ss.getSheetByName(typeof LEDGER !== 'undefined' ? LEDGER.SET : '가계부설정');
  if (set && typeof PLAN !== 'undefined' && PLAN.ALIAS_COL) set.hideColumns(PLAN.ALIAS_COL, 2);
}

/** 개인 탭을 고치면 바로 계획 탭에 반영 (단순 트리거 — 따로 설치 필요 없음). 계획 탭을 고치면 대시보드 저장본만 지움 */
function onEdit(e) {
  try {
    const sh = e && e.range && e.range.getSheet();
    if (!sh) return;
    const n = sh.getName();
    if (n === PT.SRC) planTabSync_(sh.getParent(), false);
    if ((n === PT.SRC || (typeof AC !== 'undefined' && n === AC.TAB)) && typeof acSync_ === 'function' && sh.getParent().getSheetByName(AC.TAB)) acSync_(sh.getParent(), null);   // 대출 기준 잔액이 바뀐 순간 기록
    if ((n === PT.SRC || n === PT.TAB || n === '계좌' || n === '설정') && typeof dashCacheClear_ === 'function') dashCacheClear_();
  } catch (err) { console.error('onEdit: ' + err.message); }
}

/**
 * 계획 탭 날짜 자동 채우기 (2026-11-15, 예전 정기결제 탭의 '(추정)'을 옮김)
 *  날짜 칸이 비었거나 전에 자동으로 넣은 값 그대로인 항목만: 이번 달 결제가 계획 금액과 맞게 확인되면(정기결제 st = paid) 그 결제일을 회색 글자로 넣음.
 *  사람이 다른 값으로 고치면 그 뒤로는 건드리지 않음 (자동으로 넣은 값은 스크립트 속성 PT_AUTO_DAY에 기억)
 */
function ptAutoDays_(ss, recRows) {
  const sh = ss.getSheetByName(PT.TAB);
  if (!sh || !recRows || ptLast_(sh) < PT.FIRST) return 0;
  const pp = PropertiesService.getScriptProperties();
  let auto = {}; try { auto = JSON.parse(pp.getProperty('PT_AUTO_DAY') || '{}'); } catch (e) {}
  const by = {}; recRows.forEach(r => { by[r.name] = r; });
  const n = ptLast_(sh) - PT.FIRST + 1, v = sh.getRange(PT.FIRST, 3, n, 3).getValues();
  let ch = 0;
  v.forEach((r, i) => {
    const name = String(r[0]).trim(), a = by[name];
    if (!a || a.st !== 'paid' || !a.dayAuto) return;
    const cur = r[2] === '' || r[2] == null ? '' : Number(r[2]);
    if (cur !== '' && cur !== auto[name]) return;   // 사람이 적은 날짜
    if (cur === a.dayAuto) return;
    sh.getRange(PT.FIRST + i, 5).setValue(a.dayAuto).setFontColor('#9AA0A6');
    auto[name] = a.dayAuto; ch++;
  });
  if (ch) { pp.setProperty('PT_AUTO_DAY', JSON.stringify(auto)); ptDispDrop_(); }
  return ch;
}
