/**
 * 점검.gs — 매일 문제를 찾아 '점검기록' 탭에 하루 한 행으로 남김 (메일·알림 안 보냄). refreshLedger(매일 08시·메뉴 '지금 갱신') 끝에 실행.
 *  행 = 날짜 · 건수 · 내용(항목별 줄바꿈). 문제 없는 날도 0으로 남김(점검이 돌았다는 기록). 같은 날 다시 돌면 그날 행을 덮어씀.
 *  항목: 알림 앱(하트비트) · 금액 못 읽음 · 결제 제외됨(제외 키워드) · 동기화 전 결제 3일+ · 쇼핑몰 동기화 7일+ · 개인 탭 입금/고정지출(날짜 지남·금액 다름)
 */
const CHECK = {
  TAB: '점검기록',
  HEAD: ['날짜', '건수', '내용'],
  PEND_DAYS: 3,
  SYNC_DAYS: 7,
};

/** 순수 계산 (node 테스트용). 반환 [{key, kind, text}] */
function computeIssues_(o) {
  const out = [], add = (key, kind, text) => out.push({ key, kind, text });
  const day = s => Date.parse(String(s).slice(0, 10) + 'T00:00:00Z') / 86400000;
  const today = day(o.now);
  const short = s => { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length > 50 ? s.slice(0, 50) + '…' : s; };
  // ① 알림 앱 하트비트
  const hb = heartbeatAlert_(o.notis, o.now);
  if (hb) add('hb', '알림 앱', hb);
  // ② 결제 같은데 금액·구분을 못 읽은 알림
  o.notis.forEach((x, i) => {
    if (x.app === 'heartbeat' || x.title === 'heartbeat' || x.app === LEDGER.TEST_APP) return;
    const t = x.title + ' ' + x.text;
    if ((!x.type || !(x.amount > 0)) && /승인|출금|결제|사용|입금|이체|취소/.test(t))
      add('amt|' + (i + 2), '금액 못 읽음', x.when.slice(0, 16) + ' 알림원본 ' + (i + 2) + '행 · ' + short(t));
  });
  // ③ 카드 결제인데 제외 키워드에 걸림 (중복·테스트·카드대금·앱 신호 제외는 정상)
  o.live.forEach(x => {
    if (x.type !== '출금' || !(x.amount > 0) || !x.exWhy || /^(중복|테스트|카드대금|앱 상태)/.test(x.exWhy)) return;
    const t = x.title + ' ' + x.body;
    if (/승인|사용|결제|체크카드/.test(t) && !/이체|송금/.test(t))
      add('ex|' + x.row, '결제 제외됨', x.when.slice(0, 16) + ' ' + x.amount.toLocaleString('en-US') + '원 · 사유 ' + x.exWhy + ' · 알림원본 ' + x.row + '행');
  });
  // ④ 쿠팡·네이버 결제가 주문과 짝 없이 3일 넘음 (확장 동기화가 안 돌고 있음)
  o.notiRows.forEach(r => {
    if (/동기화 전/.test(r[3]) && today - day(r[1]) > CHECK.PEND_DAYS)
      add('pend|' + (-r[7]), '동기화 전 결제', r[1] + ' ' + r[3] + ' ' + Number(r[4]).toLocaleString('en-US') + '원 · ' + Math.floor(today - day(r[1])) + '일째 주문과 짝 없음');
  });
  // ⑤ 쇼핑몰 마지막 동기화가 7일 넘음 (기록이 아직 없으면 넘어감)
  Object.keys(o.syncAt || {}).forEach(k => {
    const age = today - day(o.syncAt[k]);
    if (age > CHECK.SYNC_DAYS) add('sync|' + k, '쇼핑몰 동기화', k + ' 마지막 동기화 ' + o.syncAt[k].slice(0, 16) + ' (' + Math.floor(age) + '일 전)');
  });
  // ⑥ 계획 탭 입금·고정지출: 날짜 지났는데 없음 / 금액 다름 (이번 달)
  const m = String(o.now).slice(0, 7), pm = o.plan && o.plan.months && o.plan.months[m], rec = (o.plan && o.plan.rec) || {};
  if (pm) pm.rows.forEach(r => {
    if (r.grp === '쓰는 돈') return;
    if (r.status === 'miss' && rec[r.name] && /^(due|today|check|sync)$/.test(rec[r.name].st)) return;   // 휴일로 밀린 예정일 전·하루 유예·금액으로 확인됨
    if (r.status === 'miss') add('plan|' + m + '|' + r.name, '계획 ' + r.grp, m + ' ' + r.name + (r.day ? ' (' + r.day + '일)' : '') + ' 계획 ' + r.plan.toLocaleString('en-US') + ' · 날짜 지났는데 ' + r.grp.replace('고정지출', '출금') + ' 없음');
    else if (r.status === 'diff') add('plan|' + m + '|' + r.name, '계획 ' + r.grp, m + ' ' + r.name + ' 계획 ' + r.plan.toLocaleString('en-US') + ' · 실제 ' + Number(r.actual).toLocaleString('en-US'));
  });
  // ⑦ 구독: 예정일(휴일 반영) 다음 날이 지났는데 결제가 안 보임 / ⑧ 휴일 목록에 올해가 없음
  Object.keys(rec).forEach(k => { const q = rec[k]; if (q.kind === '구독' && q.st === 'miss') add('rec|' + m + '|' + k, '구독', m + ' ' + k + ' 예정 ' + q.dayLabel + ' · 결제 안 보임'); });
  if (o.holi && !o.holi[String(o.now).slice(0, 4)]) add('holi|' + String(o.now).slice(0, 4), '공휴일', String(o.now).slice(0, 4) + '년 공휴일 없음 (설정 탭 공휴일 표에 추가, 지금은 주말만 반영)');
  return out;
}

/** 하루 한 행 (순수): [날짜, 건수, 내용(항목별 줄바꿈)] — 문제 없으면 0, 빈칸 */
function dayRow_(issues, date) {
  return [date, issues.length, issues.map(x => '[' + x.kind + '] ' + x.text).join('\n')];
}

function runChecks_(ss, tz) {
  const date = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  const nowS = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd HH:mm:ss');
  const notis = readNotis_(ss.getSheetByName(LEDGER.NOTI), tz);
  const live = ledgerLive_(ss, tz);
  const { rows } = readRows_(ss, false);
  const planP = planCompare_(ss, tz, rows.concat(manualRows_(ss)));
  const issues = computeIssues_({
    now: nowS, notis, live,
    notiRows: dashNotiRows_(ss, tz),
    syncAt: dashSyncAt_(ss),
    plan: planP,
    holi: typeof saleHoli_ === 'function' ? saleHoli_(ss) : null,
  });
  if (planP && planP.recRows && typeof recWrite_ === 'function') { try { recWrite_(ss, planP.recRows); } catch (e) {} }   // 정기결제 탭 G~I
  let sh = ss.getSheetByName(CHECK.TAB);
  if (typeof hideRecordTabsOnce_ === 'function') hideRecordTabsOnce_(ss);
  if (!sh) { sh = ss.insertSheet(CHECK.TAB); if (typeof hideTab_ === 'function') hideTab_(sh); }
  if (sh.getRange(1, 1).getDisplayValue() !== CHECK.HEAD[0]) {   // 새 탭 또는 옛 형식 → 머리글부터
    sh.clear();
    sh.getRange(1, 1, 1, CHECK.HEAD.length).setValues([CHECK.HEAD]).setFontWeight('bold').setBackground('#385723').setFontColor('#FFFFFF');
    sh.setFrozenRows(1); sh.setColumnWidth(1, 90); sh.setColumnWidth(2, 50); sh.setColumnWidth(3, 640);
  }
  const last = sh.getLastRow();
  let r = last + 1;
  if (last >= 2 && sh.getRange(last, 1).getDisplayValue() === date) r = last;   // 같은 날 다시 돌면 그 행을 덮어씀
  if (r > sh.getMaxRows()) sh.insertRowsAfter(sh.getMaxRows(), 100);
  const row = dayRow_(issues, date);
  sh.getRange(r, 1, 1, 3).setNumberFormats([['@', '0', '@']]).setValues([row]).setWrap(true).setVerticalAlignment('top');
  sh.getRange(r, 2).setFontColor(issues.length ? '#D93025' : '#9AA0A6');
  return issues.length;
}
