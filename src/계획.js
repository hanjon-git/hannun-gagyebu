/**
 * 계획.gs (판매용) — '계획' 탭(판매.gs salePlan_)과 실제 기록 비교 → 대시보드 '계획' 탭
 *
 *  계획 탭 한 줄 = 구분(수입/지출/저축) · 대상 · 항목 · 월 금액 · 날짜 · 끝나는 달 · 쿠팡·네이버 연결 분류 · 메모
 *    수입            → '입금'  : 알림 앱이 있으면 입금 알림과 맞춤
 *    지출(분류 없음) → '고정지출', 저축 → '저축' : 알림 앱이 있으면 출금 알림과 맞춤 (항목 이름·아래 기본 단어·금액)
 *    지출(분류 있음) → '쓰는 돈' : 쿠팡·네이버·직접 입력(·카드 알림) 중 그 분류의 합. '나머지 전부' = 다른 항목이 안 가져간 모든 분류
 *    알림 앱이 없으면(기본판) 입금·고정지출·저축은 예정일만 보여줌 ('알림 전')
 *  개인용과 다른 점: 개인 탭 블록 읽기·가계부설정 연결 단어 표 대신 계획 탭 한 장 (2026-11-13)
 */
const PLAN = {
  TAB: '계획',
  // 항목 이름에 이 단어가 있으면 알림에서 이 단어들로 찾음 (예: '휴대폰' → 통신사 이름). 없으면 항목 이름 그대로
  DEFAULT_ALIAS: [
    ['급여', '급여|월급|급료|상여'], ['월급', '급여|월급|급료|상여'], ['아동수당', '아동수당|사회보장|보건복지'], ['부모급여', '부모급여|사회보장|보건복지'],
    ['월세', '월세|임대'], ['관리비', '관리비|공과금|가스|전기|수도'], ['공과금', '관리비|공과금|가스|전기|수도'],
    ['휴대폰', 'SKT|KT|LG U|LGU|통신|알뜰'], ['핸드폰', 'SKT|KT|LG U|LGU|통신|알뜰'], ['인터넷', '인터넷|브로드밴드|LG U|LGU|KT|SK'],
    ['보험', '보험|손해|생명'], ['정수기', '정수기|코웨이|청호|SK매직|쿠쿠'], ['학자금', '장학재단|학자금'], ['자동차세', '자동차세|위택스|wetax'],
    ['넷플릭스', '넷플릭스|netflix'], ['유튜브', '유튜브|youtube|google'], ['디즈니', '디즈니|disney'], ['와우', '와우|wow'],
    ['네이버멤버', '네이버플러스|네이버멤버|naver plus'], ['청약', '청약'], ['적금', '적금'], ['주식', '증권'],
  ],
};

/** 항목 이름 → 찾는 방법 {re} · {cat:[분류…]} · {all:true} (연결 분류 우선, 없으면 기본 단어, 없으면 이름 속 단어) */
function planRe_(alias, name) {
  const o = alias[name];
  if (o && typeof o === 'object') {   // 계획 탭 연결 칸 (계획탭.gs, 2026-11-15): 찾을 단어 > 연결 분류('나머지 전부' 포함) > 아래 기본 단어
    if ((o.find || []).length) return ptRe_(o, name);
    const not = ptRe_({ not: o.not || [] }, name).not;
    if ((o.cats || []).indexOf(SALE.REST) >= 0) return { all: true, not };
    if ((o.cats || []).length) return { cat: o.cats, not };
  }
  const key = typeof alias[name] === 'string' ? name : Object.keys(alias).filter(k => typeof alias[k] === 'string' && !/^cat:/.test(alias[k]) && name.indexOf(k) >= 0).sort((x, y) => y.length - x.length)[0];   // 다른 항목의 연결 분류는 이름이 겹쳐도 안 씀
  const a = key ? alias[key] : name.split(/[\s/+·]+/).map(w => w.replace(/[0-9()~.]/g, '')).filter(w => w.length > 1).join('|') || name;
  if (/^cat:/.test(a)) {
    const cats = a.slice(4).split('|').map(s => s.trim()).filter(Boolean);
    return cats.indexOf(SALE.REST) >= 0 ? { all: true } : { cat: cats };
  }
  try { return { re: new RegExp(a, 'i') }; } catch (e) { return { re: new RegExp(a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }; }
}

/** 고정지출에 해당하는 알림인지 (찾는 단어가 맞고 금액이 계획의 ±50% 안) → 대시보드 변동지출에서 뺄 때 사용 */
function planFixedTest_(ss) {
  try {
    const plan = salePlan_(ss);
    if (!plan) return () => false;
    return planFixedFn_(plan, planAlias_(ss));
  } catch (e) { return () => false; }
}
function planFixedFn_(plan, alias) {
  const list = plan.fixed.map(it => ({ r: planRe_(alias, it.name), plan: it.plan })).filter(o => o.r.re && o.plan > 0);
  return (text, amount) => list.some(o => o.r.re.test(text) && Math.abs(amount - o.plan) <= o.plan * 0.5);
}

/**
 * 순수 계산: 월별 계획 대비
 *  plan: salePlanParse_ 결과, alias: {항목이름: '단어|단어' 또는 'cat:분류|분류'}
 *  buys: [{date:'yyyy-MM-dd', name, amount, cat}] · notis: [{when, type, amount, text, excluded, matched, cat}]
 *  반환 {월: {rows:[{grp,name,day,plan,actual,status}], sum:{plan,actual}}}
 */
function computePlanCompare_(plan, alias, buys, notis, months, notiFrom, today) {
  const re = name => planRe_(alias, name);
  const res = {};
  months.forEach(m => {
    const last = new Date(Date.UTC(+m.slice(0, 4), +m.slice(5, 7), 0)).getUTCDate();
    const isPast = m < today.slice(0, 7), isNow = m === today.slice(0, 7);
    const dayOf = d => m + '-' + String(Math.min(d, last)).padStart(2, '0');
    const nm = notis.filter(x => String(x.when).slice(0, 7) === m);
    const live = it => !it.end || m <= it.end;   // 끝나는 달이 지난 항목은 뺌
    const used = {};
    const rows = [];
    // 입금·고정지출: 알림 한 건씩 맞추기 (단어 우선, 없으면 금액 같은 것)
    const pick = (it, type) => {
      const r = re(it.name);
      const cand = nm.map((x, i) => [x, i]).filter(([x, i]) => !used[i] && x.type === type && x.amount > 0 && !(type === '출금' && typeof notiNotFixed_ === 'function' && notiNotFixed_(x)));   // 할부 구매·교통·배달은 고정지출 아님
      // 2026-11-16: 같은 단어를 쓰는 다른 항목의 금액과 정확히 같은 알림은 그 항목 몫으로 남김 (학자금대출1·2) · 금액이 같은 알림 먼저, 다음 날짜 가까운 순
      const other = x => x.amount !== it.plan && (type === '입금' ? plan.income : plan.fixed).some(o => o !== it && live(o) && o.plan === x.amount && (re(o.name).re || { test: () => false }).test(x.text));
      let hit = cand.filter(([x]) => r.re && r.re.test(x.text) && (x.amount === it.plan || type === '출금' || Math.abs(x.amount - it.plan) <= it.plan * 0.5) && !other(x));
      const own = alias[it.name] && typeof alias[it.name] === 'object' && (alias[it.name].find || []).length;   // 계획 탭에 찾을 단어를 적은 항목은 단어로만 찾음 (2026-11-16 사용자 결정 A: 금액만 같은 사람 이체를 저축·고정으로 잘못 잡던 문제)
      if (!hit.length && !own && it.day) hit = cand.filter(([x]) => x.amount === it.plan);   // 금액만으로는: 찾을 단어가 없고 날짜가 정해진 항목만
      const dd = x => it.day ? Math.abs(+String(x.when).slice(8, 10) - it.day) : 0;
      hit.sort((a, b) => ((b[0].amount === it.plan) - (a[0].amount === it.plan)) || dd(a[0]) - dd(b[0]));
      const h = hit[0];
      if (h) { used[h[1]] = true; return h[0].amount; }
      return null;
    };
    const fixedStatus = (it, actual) => {
      if (actual != null) return actual === it.plan ? 'ok' : 'diff';
      const due = it.day ? dayOf(it.day) : m + '-' + String(last).padStart(2, '0');
      if (!notiFrom || due < notiFrom) return 'none';                     // 알림 시작 전
      return isPast || (isNow && it.day && due < today) ? 'miss' : 'wait';
    };
    plan.income.filter(live).forEach(it => { const a = pick(it, '입금'); rows.push({ grp: '입금', name: it.name, extra: it.extra ? 1 : undefined, day: it.day, plan: it.plan, actual: a, status: fixedStatus(it, a) }); });
    plan.fixed.filter(live).forEach(it => { const a = pick(it, '출금'); rows.push({ grp: it.sec === '저축' ? '저축' : '고정지출', name: it.name, day: it.day, plan: it.plan, actual: a, status: fixedStatus(it, a) }); });
    // 쓰는 돈: 구매 + 주문과 매칭 안 된 출금 알림
    const mb = buys.filter(b => b.date.slice(0, 7) === m && b.amount > 0);
    const mn = nm.filter(x => x.type === '출금' && !x.excluded && !x.matched && x.amount > 0);
    // 한 기록은 한 항목에만: 단어로 찾는 항목이 먼저 가져가고, cat: 항목(분류 전체)은 남은 것만
    const takenB = {}, takenN = {}, spendRows = [];
    const pri = r => r.all ? 2 : r.cat ? 1 : 0;   // 단어 항목 → 분류 항목 → '나머지 전부' 순서로 가져감
    plan.spend.filter(live).map((it, i) => ({ it, i, r: re(it.name) })).sort((a, b) => pri(a.r) - pri(b.r) || a.i - b.i).forEach(({ it, i, r }) => {
      const hitB = [], hitN = [];
      const nt = s => !!(r.not && r.not(s));   // 뺄 단어
      mb.forEach((b, k) => { if (!takenB[k] && ((r.all || r.cat) ? (r.all || r.cat.indexOf(b.cat) >= 0) && !nt(b.name) : r.re.test(b.name))) { takenB[k] = true; hitB.push(b); } });
      const dlv = x => !x.fix && typeof DELIVERY_RE !== 'undefined' && DELIVERY_RE.test(x.text);   // 배달 앱 결제는 '배달' 분류 (가계부 분류가 외식이어도 cat:외식·카페에 안 넣음, 2026-11-08)
      // cat: 항목은 대시보드에 보이는 분류(dcat = notiCat_)로 셈 (2026-11-09: 가계부 분류와 달라 파리바게뜨가 점심+커피에서 빠지던 문제). dcat이 없으면(테스트) 예전 방식
      const catOf = x => x.dcat || (dlv(x) ? '배달' : x.cat);
      mn.forEach((x, k) => { if (!takenN[k] && ((r.all || r.cat) ? (r.all || r.cat.indexOf(catOf(x)) >= 0) && !nt(x.text) : r.re.test(x.text))) { takenN[k] = true; hitN.push(x); } });
      const any = hitB.length + hitN.length;
      const a = hitB.reduce((s, b) => s + b.amount, 0) + hitN.reduce((s, x) => s + x.amount, 0);
      spendRows[i] = { grp: '쓰는 돈', name: it.name, day: it.day, plan: it.plan, actual: any ? a : null, status: !any ? 'nodata' : it.plan == null ? 'track' : a > it.plan ? 'over' : 'under' };   // 금액 없는 줄 = 실적만
    });
    spendRows.forEach(r => { if (r) rows.push(r); });
    const sp = rows.filter(r => r.grp !== '입금' && r.plan != null);   // 실적만 줄은 합계에서 뺌
    res[m] = { rows, sum: { plan: sp.reduce((s, r) => s + r.plan, 0), actual: sp.reduce((s, r) => s + (r.actual || 0), 0) } };
  });
  return res;
}

/** 찾는 단어: 기본 단어 + 계획 탭 '연결 분류'(cat:) */
function planAlias_(ss) {
  return memo_('alias', () => {
    const map = {};
    PLAN.DEFAULT_ALIAS.forEach(r => { map[r[0]] = r[1]; });
    const plan = salePlan_(ss);   // 연결 칸이 있는 항목만 (없으면 위 기본 단어·이름으로)
    if (plan) plan.income.concat(plan.fixed, plan.spend).forEach(it => { if ((it.find || []).length || (it.cats || []).length) map[it.name] = { find: it.find || [], not: it.not || [], cats: it.cats || [] }; });
    return map;
  });
}

/** 대시보드 예산 = 이번 달 '쓰는 돈'(지출 + 연결 분류) 계획 합. 없으면 null (예산 카드 숨김) */
function planBudget_(ss) {
  try {
    const plan = salePlan_(ss);
    if (!plan) return null;
    return ptBudget_(plan, Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone() || 'Asia/Seoul', 'yyyy-MM'));   // 계획탭.gs: 수입이 있으면 수입 − 고정 − 저축, 없으면 변동 합
  } catch (e) { return null; }
}

/** 대시보드용: 계획 대비 (최근 12개월) */
function planCompare_(ss, tz, buyRows) {
  try {
    const plan = salePlan_(ss);
    if (!plan) return { empty: true, months: {} };
    const alias = planAlias_(ss);
    const today = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
    const notis = (typeof ledgerLive_ === 'function' ? ledgerLive_(ss, tz) : []).map(x => Object.assign({}, x, { dcat: typeof notiCat_ === 'function' ? notiCat_(x) : '' }));   // dcat = 대시보드 분류
    const notiFrom = notis.map(x => x.when.slice(0, 10)).filter(Boolean).sort()[0] || '';
    const buys = buyRows.map(r => ({ date: r.date, name: String(r.name), amount: r.amount, cat: r.cat, src: r.src }));
    const months = [];
    for (let i = 11; i >= 0; i--) { const d = new Date(+today.slice(0, 4), +today.slice(5, 7) - 1 - i, 1); months.push(d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0')); }
    const rec = typeof recForDash_ === 'function' ? recForDash_(ss, plan, alias, buys, notis, today, notiFrom) : null;   // 정기결제.gs: 예정일·휴일
    return { months: computePlanCompare_(plan, alias, buys, notis, months, notiFrom, today), notiFrom, rec: rec ? rec.map : null, recMonth: today.slice(0, 7), recRows: rec ? rec.rows : null, warn: plan.warn };
  } catch (e) {
    return { error: '계획 비교 오류: ' + e.message };
  }
}
