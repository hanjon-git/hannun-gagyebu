/**
 * 정기결제.gs (판매용) — 계획 탭 고정지출·저축·구독의 이번 달 예정일(휴일이면 다음 영업일)과 결제 확인
 *  개인용과 다른 점: '정기결제' 탭 없음. 날짜 = 계획 탭 '날짜' 열, 휴일 = 설정 탭 공휴일 표 (2026-11-13)
 *  상태: 결제(이름으로 확인) / 동기화 전(금액·날짜로 확인) / 금액 다름 / 예정 / 오늘 / 없음 / 날짜 지남(알림 앱 없음) / 날짜 없음
 */
const REC = {
  TAB: '정기결제',
  HEAD: ['구분', '항목 (개인 탭)', '금액', '매월', '휴일이면', '결제수단', '최근 결제', '이번 달 예정', '상태'],
  SUB_RE: /유튜브|디즈니|넷플릭스|서랍|와우|원드라이브|멤버|GPT|구독/,
  RULES: ['다음 영업일', '전 영업일', '그대로'],
  HOLI: {
    2026: ['01-01', '02-16', '02-17', '02-18', '03-01', '03-02', '05-05', '05-24', '05-25', '06-03', '06-06', '07-17', '08-15', '08-17', '09-24', '09-25', '09-26', '10-03', '10-05', '10-09', '12-25'],
    2027: ['01-01', '02-06', '02-07', '02-08', '02-09', '03-01', '05-01', '05-03', '05-05', '05-13', '06-06', '07-17', '07-19', '08-15', '08-16', '09-14', '09-15', '09-16', '10-03', '10-04', '10-09', '10-11', '12-25', '12-27'],
  },
  WD: ['일', '월', '화', '수', '목', '금', '토'],
};

let REC_HOLI_ = null;   // 설정 탭 공휴일 (recForDash_가 채움)
const recYmd_ = d => d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0') + '-' + String(d.getUTCDate()).padStart(2, '0');
const recDate_ = s => new Date(Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10)));
function recOff_(s) {   // 주말·공휴일이면 true
  const d = recDate_(s), w = d.getUTCDay();
  return w === 0 || w === 6 || ((REC_HOLI_ || REC.HOLI)[s.slice(0, 4)] || []).indexOf(s.slice(5)) >= 0;
}
/** 이번 달 예정일: 매월 day일(말일 넘으면 말일) → 휴일이면 규칙대로 옮김 */
function recDue_(month, day, rule) {
  const last = new Date(Date.UTC(+month.slice(0, 4), +month.slice(5, 7), 0)).getUTCDate();
  let d = recDate_(month + '-' + String(Math.min(day, last)).padStart(2, '0'));
  const step = rule === '전 영업일' ? -1 : rule === '그대로' ? 0 : 1;
  for (let i = 0; step && i < 10 && recOff_(recYmd_(d)); i++) d = new Date(d.getTime() + step * 86400000);
  return recYmd_(d);
}
const recDays_ = (a, b) => Math.round((recDate_(a) - recDate_(b)) / 86400000);

/**
 * 순수 계산 (node 테스트 가능)
 *  o = { plan, alias, buys:[{date,name,amount}], notis:[ledgerLive_ 행], tab:{이름:{day,rule,via}}, today:'yyyy-MM-dd', notiFrom }
 *  반환 [{kind,name,plan,day,dayAuto,rule,via,last,due,st,amt}]  st = paid|sync|diff|due|today|check|miss|before|nodate
 */
function computeRec_(o) {
  const m = o.today.slice(0, 7), tab = o.tab || {};
  // 고정 중 구독 이름은 '구독'(휴일 그대로), 변동이어도 날짜가 있거나 구독 이름이면 정기결제 (2026-11-15: 예전엔 주석 안에 들어가 변동 쪽이 빠져 있었음)
  const items = o.plan.fixed.map(x => ({ kind: REC.SUB_RE.test(x.name) ? '구독' : '고정', x })).concat(o.plan.spend.filter(x => x.plan > 0 && (REC.SUB_RE.test(x.name) || x.day)).map(x => ({ kind: '구독', x })));
  const outs = o.notis.filter(x => x.type === '출금' && !x.excluded && x.amount > 0);
  const viaOf = r => r.src ? (r.src === '네이버' ? '네이버페이' : r.src) : /카드\s*\d{4}/.test(r.text) ? '카드 ' + r.text.match(/카드\s*(\d{4})/)[1] : '';
  const used = {}, claimed = {};
  const rows = items.map(({ kind, x }) => {
    const re = planRe_(o.alias, x.name).re;
    const hist = [];
    if (re) {
      outs.forEach(n => { if (re.test(n.text)) hist.push({ date: n.when.slice(0, 10), amount: n.amount, text: n.text, key: 'n' + n.row }); });
      if (kind === '구독') o.buys.forEach(b => { if (b.amount > 0 && re.test(b.name)) hist.push({ date: b.date, amount: b.amount, src: b.src, text: b.name, key: 'b' + b.date + b.name }); });   // 고정지출은 상품 이름과 겹쳐서(예: LG 제품) 알림만
    }
    hist.sort((a, b) => a.date < b.date ? -1 : 1);
    // 한 결제는 한 항목에만: 계획 탭 순서대로 먼저 맞는 항목이 가져감 (예: 통신사 결제은 '핸드폰'이 가져가고 '인터넷'은 기록 없음 — 개인 탭 대비와 같은 방식)
    for (let i = hist.length - 1; i >= 0; i--) { if (claimed[hist[i].key]) hist.splice(i, 1); else claimed[hist[i].key] = true; }
    const t = tab[x.name] || {};
    // 날짜 추정: 마지막 결제일 (2026-11-13 사용자: 출금되면 알 수 있으니 직접 안 적음 → 한 번만 나가도 추정, 탭 D열에 'N일(추정)'으로 적고 다음 결제 때마다 갱신. 사람이 '(추정)' 없이 적으면 그 값 고정)
    const dayAuto = hist.length ? +hist[hist.length - 1].date.slice(8) : '';
    const day = (t.day && !t.auto ? t.day : null) || x.day || dayAuto || t.day || null;
    const rule = REC.RULES.indexOf(t.rule) >= 0 ? t.rule : (kind === '구독' ? '그대로' : '다음 영업일');
    const lastH = hist[hist.length - 1];
    const via = t.via || (lastH ? viaOf(lastH) : '');
    const due = day ? recDue_(m, day, rule) : '';
    const inM = hist.filter(h => h.date.slice(0, 7) === m && !used[h.key]);   // 한 결제는 한 항목에만 (개인 탭 순서대로 먼저 맞는 항목 — 개인 탭 대비와 같은 방식)
    let st, amt = null;
    if (inM.length) {
      amt = inM.reduce((s, h) => s + h.amount, 0); inM.forEach(h => { used[h.key] = true; });
      st = Math.abs(amt - x.plan) <= Math.max(100, x.plan * 0.02) ? 'paid' : 'diff';
    } else st = '';
    return { kind, name: x.name, plan: x.plan, day, dayAuto, dayFixed: !!(x.day || (t.day && !t.auto)), rule, via, due, st, amt, last: lastH ? lastH.date.slice(5).replace('-', '/') + ' ' + lastH.amount.toLocaleString('en-US') : '' };
  });
  // 이름으로 못 찾은 것: 같은 금액(±1%)이 예정일 ±3일 안에 나갔으면 '동기화 전' (예: 카드 알림 '네이버파이낸셜 9,900' = 디즈니)
  rows.forEach(r => {
    if (r.st || !r.due) return;
    const n = outs.filter(n => !used['n' + n.row] && n.when.slice(0, 7) === m && Math.abs(n.amount - r.plan) <= r.plan * 0.01 && Math.abs(recDays_(n.when.slice(0, 10), r.due)) <= 3)
      .sort((a, b) => (Math.abs(a.amount - r.plan) - Math.abs(b.amount - r.plan)) || (Math.abs(recDays_(a.when.slice(0, 10), r.due)) - Math.abs(recDays_(b.when.slice(0, 10), r.due))))[0];   // 금액이 가장 가까운 것 → 날짜가 가까운 것
    if (n) { used['n' + n.row] = true; r.st = 'sync'; r.amt = n.amount; r.last = n.when.slice(5, 10).replace('-', '/') + ' ' + n.amount.toLocaleString('en-US'); if (!r.via) r.via = viaOf(n); }
  });
  rows.forEach(r => {
    if (r.st) return;
    if (!r.due) r.st = 'nodate';
    else if (o.notiFrom && r.due < o.notiFrom) r.st = 'before';
    else if (r.due > o.today) r.st = 'due';
    else if (!o.notiFrom && r.due < o.today) r.st = 'past';   // 알림 앱이 없으면 결제 여부를 모름
    else if (r.due === o.today) r.st = 'today';
    else if (recDays_(o.today, r.due) <= 1) r.st = 'check';   // 예정일 다음 날까지는 '확인 중'(알림·처리 지연)
    else r.st = 'miss';
  });
  return rows;
}
const REC_ST = { paid: '✓ 결제', sync: '✓ 결제 (동기화 전)', diff: '금액 다름', due: '예정', today: '오늘', check: '확인 중', miss: '없음', before: '알림 전', nodate: '날짜 없음', past: '날짜 지남' };

/** 개인용의 '정기결제' 탭 대신: 날짜·규칙은 계획 탭에서 (휴일이면 고정지출 다음 영업일, 구독 그대로) */
function recTab_() { return {}; }
function recWrite_() {}

/** 계획.gs planCompare_가 부름 → 대시보드용 {rows, map}. map[이름] = {dayLabel, label, cls, over(덮어쓸지), syncAmt} */
function recForDash_(ss, plan, alias, buys, notis, today, notiFrom) {
  try {
    REC_HOLI_ = typeof saleHoli_ === 'function' ? saleHoli_(ss) : null;
    const first = computeRec_({ plan, alias, buys, notis, tab: {}, today, notiFrom });   // 탭이 없을 때 넣을 추정값
    const auto = {}; first.forEach(r => { auto[r.name] = { dayAuto: r.dayAuto, via: r.via }; });
    const tab = recTab_(ss, plan, auto);
    const rows = computeRec_({ plan, alias, buys, notis, tab, today, notiFrom });
    if (typeof ptAutoDays_ === 'function') { try { ptAutoDays_(ss, rows); } catch (e) {} }   // 계획 탭 빈 날짜 채우기
    const map = {};
    rows.forEach(r => {
      const d = r.due ? recDate_(r.due) : null, dd = d ? +r.due.slice(8) : 0;
      const dayLabel = d ? (r.day && dd !== Math.min(r.day, 31) ? dd + '일(' + REC.WD[d.getUTCDay()] + ')' : dd + '일') : '';
      const L = { sync: ['동기화 전', 's-under'], due: ['예정 ' + (d ? (+r.due.slice(5, 7)) + '/' + dd : ''), 's-wait'], today: ['오늘', 's-over'], check: ['확인 중', 's-wait'], miss: ['없음', 's-over'], nodate: ['날짜 없음', 's-wait'], past: ['날짜 지남', 's-wait'] }[r.st];
      map[r.name] = { kind: r.kind, st: r.st, dayLabel, label: L ? L[0] : '', cls: L ? L[1] : '', syncAmt: r.st === 'sync' ? r.amt : null, nodateKeep: r.kind === '고정' && r.st === 'nodate' };
    });
    return { rows, map };
  } catch (e) { return null; }
}
