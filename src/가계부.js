/**
 * 가계부.gs — 폰 알림(알림원본 탭)을 가계부로 정리 + 월말 잔액 대조로 정밀도 측정 (시트에 붙은 프로젝트에 새 파일로 추가)
 *
 *  알림원본 A~I열은 별도 프로젝트 '알림수집기'가 씀. 이 파일은 J열부터만 씀:
 *    J 월 · K 제외(사유) · L 매칭(쿠팡·네이버 주문) · M 자동분류 · N 분류 수정(직접 입력, 비우면 M 사용) · O 계좌 · P 잔액(알림에 찍힌 값)
 *  가계부설정 탭: 변동지출 한도, 제외 키워드(내 계좌 간 이체·카드대금), 분류 규칙 → 표를 고치면 다음 갱신부터 반영
 *  월마감 탭: 월말 계좌잔액(D)은 알림 잔액 합계(O)가 자동으로 들어감(직접 적으면 그 값 우선), 카드 미결제액(E)만 입력 → 미기록·정밀도 자동
 *            Q~S = 계좌별 최근 잔액 (알림에 잔액이 찍히는 계좌만)
 *
 *  설치: 이 파일 추가 → 저장 → 함수 setupLedger 실행 (탭 2개 + 매일 08시 갱신 + 시트 열 때 '가계부' 메뉴)
 */
const LEDGER = {
  AMT_COL: 17,           // 알림원본 Q '금액 수정' (대시보드에서 고친 금액, 2026-11-16)
  NOTI: '알림원본',
  SET: '가계부설정',
  CLOSE: '월마감',
  FIRST: 5,                 // 월마감 데이터 시작 행
  MATCH_DAYS: 1,            // 주문일과 알림일 차이 허용 (일)
  TEST_APP: 'hannun.noticollector',   // 판매용 알림 앱(applicationId 확정 2026-11-16, D:\\claude\\noti-collector-sale) '테스트 전송' → 집계 제외. applicationId 확정 시 같이 바꿀 것
  FIX_EX: '제외',           // 대시보드 '이 결제 빼기' → 알림원본 N열에 이 값
  // 판매용: 광고·이벤트 알림 의심 (거래 문구가 없을 때만). 예: '친구에게 1,000원 받았어요! 이벤트' (2026-11-13)
  AD_RE: /\(광고\)|이벤트|쿠폰|혜택|당첨|응모|추첨|프로모션|특가|캐시백 지급|포인트 지급/,
  TX_RE: /승인|출금|입금|이체|체크카드|일시불|할부|결제\s*완료|결제되었|원\s*사용|취소/,
  RESEND_SEC: 600,          // 같은 앱·같은 구분·같은 금액·같은 잔액이 이 초 안에 연달아 오면 재전송 중복 (앱이 응답을 못 받고 다시 보낸 경우)
  HB_MAX_H: 26, HB_LAG_H: 12, // 하트비트 감시: 마지막 신호가 26시간 넘게 없음 / 리스너 활동(아무 앱 알림이나 받은 시각)이 12시간 넘게 뒤처짐 (앱 쪽 제안 6시간은 조용한 밤에 오경보 가능)
  DUP_SEC: 120,             // 같은 결제가 은행·카드 앱 두 곳에서 알림으로 오는 경우: 다른 앱·같은 구분·같은 금액·이 초 안이면 뒤의 것을 제외
  DEFAULT_LIMIT: 800000,
  DEFAULT_EXCLUDE: [        // [키워드, 사유]  — 내 이름/내 다른 계좌 별칭, 실제 카드대금 출금 문구는 알림이 쌓인 뒤 직접 추가
    ['카드대금', '카드대금(승인 알림으로 이미 집계)'],
    ['카드결제대금', '카드대금(승인 알림으로 이미 집계)'],
    ['heartbeat', '앱 상태 신호'],
  ],
  DEFAULT_RULES: [          // [키워드(정규식 가능), 분류]  — 위에서부터 먼저 맞는 것
    ['급여|월급|상여', '수입'],
    ['부모급여|아동수당|양육수당', '수입'],
    ['보험', '고정·할부'],
    ['할부', '고정·할부'],
    ['관리비|도시가스|전기요금|수도|한전', '공과금·통신'],
    ['SKT|KT|LG U|LGU|통신|인터넷', '공과금·통신'],
    ['주유|SK에너지|GS칼텍스|S-OIL|에쓰오일|현대오일|충전소|하이패스|주차', '교통·차량'],
    ['택시|카카오T|버스|지하철|코레일|SRT|티머니', '교통·차량'],
    ['스타벅스|커피|카페|투썸|이디야|메가|빽다방|배달의민족|배민|요기요|쿠팡이츠|식당|치킨|피자|버거', '외식·카페'],
    ['이마트|홈플러스|롯데마트|코스트코|트레이더스|GS25|CU|세븐일레븐|이마트24|마트|편의점|컬리|마켓', '장보기'],
    ['병원|의원|약국|치과|한의원', '의료'],
    ['어린이집|유치원|키즈|소아', '육아'],
    ['쿠팡|coupang|COUPANG|Coupang', '쇼핑(쿠팡)'],
    ['네이버|NAVER|Naver|N페이|NPAY|Npay', '쇼핑(네이버)'],
  ],
  NOTI_HEAD: ['월', '제외', '매칭(주문)', '자동분류', '분류 수정'],
  BANK: { 'com.kbstar.kbbank': '국민', 'com.kbstar.starpush': '국민', 'com.kakaobank.channel': '카카오뱅크', 'viva.republica.toss': '토스',
          'com.shinhan.sbanking': '신한', 'com.wooribank.smart.npib': '우리', 'com.kebhana.hanapush': '하나', 'nh.smart.banking': '농협', 'com.ibk.android.ionebank': '기업' },
};

/**
 * 알림 한 건 → {acct: '카카오뱅크 1234', bal: 1000000} 또는 null (잔액이 안 찍힌 알림)
 *  잔액: '잔액' 바로 뒤 숫자 ('잔액 1,000,000원', '잔액1,000,000' 둘 다)
 *  계좌: 앱 → 은행 이름 + 알림에 보이는 끝자리 (괄호 안 4자리 '(1234)' 또는 가린 계좌번호 끝 숫자 '***123')
 */
function parseBalance_(app, title, text) {
  const s = String(title || '') + ' ' + String(text || '');
  const m = s.match(/잔액\s*:?\s*(-?[0-9]{1,3}(?:,[0-9]{3})+|-?[0-9]+)/);
  if (!m) return null;
  const bank = LEDGER.BANK[app] || String(app || '').split('.').slice(-1)[0] || '?';
  const tail = (s.match(/\((\d{4})\)/) || s.match(/[\d*]{2,}-[\d*]{2,}-\**(\d{2,})/) || [])[1] || '';
  return { acct: bank + (tail ? ' ' + tail : ''), bal: Number(m[1].replace(/,/g, '')) };
}

/**
 * 순수 계산: 알림 → 계좌별 잔액 (월말 계좌잔액 자동화)
 *  반환 perNoti: 알림원본 O·P 값, byMonth: {월: 그 달 말 기준 계좌별 마지막 잔액 합}, latest: [[계좌, 잔액, 시각]]
 *  거래가 없으면 알림도 없지만 잔액도 그대로 → 마지막으로 본 잔액을 계속 씀
 */
function computeBalances_(notis, months) {
  const perNoti = notis.map(x => { const b = parseBalance_(x.app, x.title, x.text); return b ? [b.acct, b.bal] : ['', '']; });
  const seen = notis.map((x, i) => ({ when: x.when, acct: perNoti[i][0], bal: perNoti[i][1] })).filter(x => x.acct && /^\d{4}-\d{2}/.test(x.when))
    .sort((a, b) => a.when < b.when ? -1 : a.when > b.when ? 1 : 0);
  const byMonth = {};
  months.forEach(m => {
    const last = {};
    seen.forEach(x => { if (x.when.slice(0, 7) <= m) last[x.acct] = x.bal; });
    const k = Object.keys(last);
    if (k.length) byMonth[m] = k.reduce((a, c) => a + last[c], 0);
  });
  const lastRow = {};
  seen.forEach(x => { lastRow[x.acct] = [x.acct, x.bal, x.when.slice(0, 16)]; });
  return { perNoti, byMonth, latest: Object.keys(lastRow).sort().map(k => lastRow[k]) };
}

/** 알림원본 A~I + N(분류 수정) 읽기 */
function readNotis_(sh, tz) {
  return memo_('notis', () => readNotisRaw_(sh, tz));   // 대시보드 한 번 실행 안에서는 한 번만 읽음
}
function readNotisRaw_(sh, tz) {
  if (!sh) return [];
  const all = sh.getDataRange().getValues();   // 2026-11-16 속도: 끝 줄·A~I·N·Q를 따로 읽던 것(5번)을 한 번에
  if (all.length < 2) return [];
  const v = all.slice(1);
  const fix = v.map(r => [r[13] == null ? '' : r[13]]);   // N 분류 수정 (사람이 쓴 값, 보존)
  const amtFix = v.map(r => [r[LEDGER.AMT_COL - 1] == null ? '' : r[LEDGER.AMT_COL - 1]]);   // Q 금액 수정 (대시보드에서, 2026-11-16)
  return v.map((r, i) => {
    const recv = r[0] instanceof Date ? Utilities.formatDate(r[0], tz, 'yyyy-MM-dd HH:mm:ss') : String(r[0] || '');
    const text = String(r[3] || '');
    const tag = text.match(/\[수신 (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\]\s*$/);   // 앱이 늦게 보낸 알림: 폰이 받은 시각 = 결제 시각
    return {
      when: tag ? tag[1] : recv, recv,
      app: String(r[1] || ''), title: String(r[2] || ''), text,
      type: String(r[4] || ''), amount: Number(r[5]) || 0, party: String(r[6] || ''), fix: String(fix[i][0] || ''),
      amountFix: amtFix[i] && amtFix[i][0] !== '' && Number(amtFix[i][0]) >= 0 ? Number(amtFix[i][0]) : null,
    };
  });
}

/**
 * 하트비트 감시 (순수 계산). 문제 없으면 '' , 있으면 짧은 문구
 *  ① 마지막 하트비트가 HB_MAX_H시간 넘게 없음 ② 리스너가 '연결됨'이 아님 ③ 리스너 활동이 하트비트보다 HB_LAG_H시간 넘게 뒤처짐
 *  하트비트가 한 번도 없으면: 첫 알림이 HB_MAX_H시간보다 오래됐을 때만 경고 (앱 설치 첫날은 조용히)
 */
function heartbeatAlert_(notis, now) {
  const sec = s => Date.parse(String(s).slice(0, 19).replace(' ', 'T') + 'Z') / 1000;
  const H = 3600, hb = notis.filter(x => x.app === 'heartbeat' || x.title === 'heartbeat').sort((a, b) => a.recv < b.recv ? -1 : 1);
  if (!hb.length) {
    const first = notis.map(x => x.recv).filter(Boolean).sort()[0];
    return first && sec(now) - sec(first) > LEDGER.HB_MAX_H * H ? '알림 앱 신호 없음' : '';
  }
  const last = hb[hb.length - 1], age = (sec(now) - sec(last.recv)) / H;
  if (age > LEDGER.HB_MAX_H) return '알림 앱 신호 ' + Math.floor(age) + '시간 없음';
  const st = (last.text.match(/리스너 ([^,]+)/) || [])[1];
  if (st && st.trim() !== '연결됨') return '알림 앱 ' + st.trim();
  const act = (last.text.match(/리스너 활동 (\d{4}-\d{2}-\d{2} \d{2}:\d{2})/) || [])[1];
  if (act && (sec(last.recv) - sec(act + ':00')) / H > LEDGER.HB_LAG_H) return '알림 앱 수신 멈춤 의심 (' + act.slice(5) + ' 이후)';
  return '';
}
function ledgerAlert_(ss, tz) {
  try { return heartbeatAlert_(readNotis_(ss.getSheetByName(LEDGER.NOTI), tz), Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd HH:mm:ss')); }
  catch (e) { return ''; }
}

/** 대시보드용: 시트 J~N을 기다리지 않고 지금 계산한 알림 목록 (한 번 실행 안에서는 재사용) */
let LEDGER_LIVE_ = null;
function ledgerLive_(ss, tz) {
  if (LEDGER_LIVE_) return LEDGER_LIVE_;
  if (!ss.getSheetByName(LEDGER.NOTI)) return (LEDGER_LIVE_ = []);   // 알림 앱을 안 쓰면 알림 계산 없음 (가계부설정 탭도 만들지 않음)
  const notis = readNotis_(ss.getSheetByName(LEDGER.NOTI), tz);
  const L = computeLedger(notis, readOrders_(ss), readLedgerSettings_(ss));
  LEDGER_LIVE_ = notis.map((x, i) => ({
    when: x.when, type: x.type, amount: x.amountFix != null ? x.amountFix : x.amount, amount0: x.amount, text: [x.app, x.title, x.text, x.party].join(' '),
    mon: L.cols[i][0], excluded: !!L.cols[i][1], exWhy: L.cols[i][1], matched: !!L.cols[i][2], cat: x.fix || L.cols[i][3],
    row: i + 2, title: x.title, body: x.text, party: x.party, fix: x.fix, auto: L.cols[i][3],
    alt: L.partner && L.partner[i] != null ? notis[L.partner[i]].text : '',   // 같은 결제의 다른 앱 알림 본문 (가게 이름이 더 온전할 수 있음)
  }));
  return LEDGER_LIVE_;
}

/** 스크립트 속성 전체를 한 번에 (2026-11-16 속도, 개인용 이식) */
function ledgerProps_() { return memo_('props', () => PropertiesService.getScriptProperties().getProperties()); }

/** 메인: 알림원본 J~N 갱신 + 월마감 행·매칭 금액 갱신 */
function refreshLedger() {
  const ss = saleSs_();
  const tz = ss.getSpreadsheetTimeZone() || Session.getScriptTimeZone() || 'Asia/Seoul';
  const set = readLedgerSettings_(ss);
  const sh = ss.getSheetByName(LEDGER.NOTI);
  const orders = readOrders_(ss);
  const notis = readNotis_(sh, tz);
  const L = computeLedger(notis, orders, set);
  if (sh && notis.length) {
    const head = sh.getRange(1, 10, 1, 5);
    head.setValues([LEDGER.NOTI_HEAD]).setFontWeight('bold').setBackground('#385723').setFontColor('#FFFFFF');
    sh.getRange(2, 10, notis.length, 1).setNumberFormat('@');
    sh.getRange(2, 10, notis.length, 4).setValues(L.cols);
    sh.getRange(2, 14, notis.length, 1).setBackground('#FFF2CC');   // 직접 입력 칸 표시
  }
  const thisMonth = Utilities.formatDate(new Date(), tz, 'yyyy-MM');
  const mlist = Object.keys(L.months).concat([thisMonth]).filter(m => /^\d{4}-\d{2}$/.test(m)).sort();
  const B = computeBalances_(notis, mlist);
  if (sh && notis.length) {
    sh.getRange(1, 15, 1, 2).setValues([['계좌', '잔액']]).setFontWeight('bold').setBackground('#385723').setFontColor('#FFFFFF');
    sh.getRange(2, 15, notis.length, 2).setValues(B.perNoti);
    sh.getRange(2, 16, notis.length, 1).setNumberFormat('#,##0');
  }
  writeLedgerClose_(ss, L.months, thisMonth, B);
  if (typeof runChecks_ === 'function') { try { runChecks_(ss, tz); } catch (e) { console.error('점검 실패: ' + e.message); } }   // 점검기록 탭 (점검.gs)
  return L;
}

/**
 * 순수 계산 (시트 접근 없음 → node 테스트 가능)
 *  notis: [{when,app,title,text,type,amount,party,fix}]  orders: [{src,order,date,total}]
 *  반환 cols: 알림원본 J~M 값, months: {월: {orders, matched}}
 */
function computeLedger(notis, orders, set) {
  const day = s => Date.parse(String(s).slice(0, 10) + 'T00:00:00Z') / 86400000;
  const hay = x => [x.app, x.title, x.text, x.party].join(' ');
  const used = {};
  // 같은 결제의 두 번째 알림 찾기 (예: 국민은행 '체크카드출금 20,500' + KB Pay '20,500원 사용', 3초 차이)
  const sec = s => Date.parse(String(s).slice(0, 19).replace(' ', 'T') + 'Z') / 1000;
  const dupOf = {}, partner = {}, dupWhy = {};
  const balOf = x => { const b = parseBalance_(x.app, x.title, x.text); return b ? b.bal : null; };
  notis.forEach((x, i) => {
    if ((x.type !== '출금' && x.type !== '취소' && x.type !== '입금') || !(x.amount > 0)) return;
    // ① 재전송 중복: 바로 앞의 같은 앱 알림이 같은 구분·금액·잔액이고 10분 안 (잔액이 같으면 새 거래가 아님)
    for (let j = i - 1; j >= 0 && j >= i - 20; j--) {
      const y = notis[j];
      if (y.app !== x.app) continue;
      const bx = balOf(x);
      if (y.type === x.type && y.amount === x.amount && bx != null && bx === balOf(y) && Math.abs(sec(x.when) - sec(y.when)) <= LEDGER.RESEND_SEC) { dupOf[i] = j; dupWhy[i] = '중복(재전송)'; }
      break;
    }
    if (dupOf[i] != null || x.type === '입금') return;
    // ② 같은 결제가 은행·카드 두 앱에서 옴
    for (let j = i - 1; j >= 0 && j >= i - 20; j--) {
      const y = notis[j];
      if (Math.abs(sec(x.when) - sec(y.when)) > LEDGER.DUP_SEC) continue;
      if (y.type === x.type && y.amount === x.amount && y.app !== x.app && dupOf[j] == null && partner[j] == null) { dupOf[i] = j; partner[j] = i; dupWhy[i] = '중복(같은 결제 알림)'; break; }
    }
  });
  // ③ 승인 취소 짝 (2026-11-16, 카카오T 가승인 → 취소 → 실결제): 취소 알림과 같은 앱·같은 금액·같은 가게의 바로 앞 출금(7일 안)을 둘 다 뺌
  const shopKey = x => String(x.text || '').replace(/^.*?\d{1,2}:\d{2}\s*/, '').replace(/\s*누적.*$/, '').replace(/\s*잔액.*$/, '').trim();
  const cancelOf = {}, cancelled = {};
  notis.forEach((x, i) => {
    if (x.type !== '취소' || !(x.amount > 0) || dupOf[i] != null) return;
    const k = shopKey(x);
    for (let j = i - 1; j >= 0; j--) {
      const y = notis[j];
      if (sec(x.when) - sec(y.when) > 7 * 86400) break;
      if (y.type === '출금' && y.amount === x.amount && y.app === x.app && dupOf[j] == null && cancelled[j] == null && shopKey(y) === k) { cancelled[j] = i; cancelOf[i] = j; break; }
    }
  });
  const cols = notis.map((x, i) => {
    const mon = /^\d{4}-\d{2}/.test(x.when) ? x.when.slice(0, 7) : '';
    if (cancelled[i] != null) return [mon, '승인 취소됨', '', '기타'];
    if (cancelOf[i] != null) return [mon, '취소(승인과 짝)', '', '기타'];
    const h = hay(x) + (partner[i] != null ? ' ' + hay(notis[partner[i]]) : '') + (dupOf[i] != null ? ' ' + hay(notis[dupOf[i]]) : '');   // 두 알림 글자를 합쳐 분류 (가게 이름이 한쪽에만 있을 수 있음)
    if (dupOf[i] != null) {
      const r = set.rules.find(r => { try { return new RegExp(r[0]).test(h); } catch (e) { return h.indexOf(r[0]) >= 0; } });
      return [mon, dupWhy[i], '', r ? r[1] : (x.type === '입금' ? '입금(기타)' : '기타')];
    }
    const ex = x.app === LEDGER.TEST_APP ? ['', '테스트(앱)'] : x.fix === LEDGER.FIX_EX ? ['', '직접 제외']
      : (LEDGER.AD_RE.test(h) && !LEDGER.TX_RE.test(h)) ? ['', '광고·이벤트 의심'] : set.exclude.find(e => e[0] && h.indexOf(e[0]) >= 0);
    let match = '', cat = '';
    if (!ex && x.type === '출금' && x.amount > 0 && mon) {
      // 같은 금액 + 주문일 ±MATCH_DAYS 안 + 아직 안 쓴 주문. 알림에 쇼핑몰 이름이 있으면 그 쪽 우선, 다음은 날짜 가까운 순
      const d = day(x.when);
      const cand = orders.filter(o => !used[o.src + '|' + o.order] && o.total === x.amount && Math.abs(day(o.date) - d) <= LEDGER.MATCH_DAYS);
      const named = src => new RegExp(src === '쿠팡' ? '쿠팡|coupang' : '네이버|naver|N페이|NPAY', 'i').test(h);
      cand.sort((a, b) => (named(b.src) - named(a.src)) || (Math.abs(day(a.date) - d) - Math.abs(day(b.date) - d)));
      const o = cand[0];
      if (o) { used[o.src + '|' + o.order] = true; match = o.src + ' ' + o.order; cat = '쇼핑(' + o.src + ')'; }
    }
    if (!cat) {
      const r = set.rules.find(r => { try { return new RegExp(r[0]).test(h); } catch (e) { return h.indexOf(r[0]) >= 0; } });
      cat = r ? r[1] : (x.type === '입금' ? '입금(기타)' : '기타');
    }
    return [mon, ex ? ex[1] || '제외' : '', match, cat];
  });
  const months = {};
  orders.forEach(o => {
    const m = String(o.date).slice(0, 7);
    if (!months[m]) months[m] = { orders: 0, matched: 0 };
    months[m].orders += o.total;
    if (used[o.src + '|' + o.order]) months[m].matched += o.total;
  });
  cols.forEach(c => { if (!c[0]) return; if (!months[c[0]]) months[c[0]] = { orders: 0, matched: 0 }; months[c[0]].hasNoti = true; });
  return { cols, months, partner };   // partner[i] = 같은 결제의 두 번째 알림 행(예: 은행 알림 i의 KB Pay 알림) — 대시보드 가게 이름용
}

/** 구매내역관리 → 주문 단위 합계 (결제 시점 금액 = F열 결제금액 합, 배송비 행 포함, 취소 전 금액) */
function readOrders_(ss) {
  const src = ss.getSheetByName(CFG.SHEET);
  if (!src) return [];
  const disp = buyRead_(src, CFG.FIRST_ROW).disp;   // readRows_와 같은 읽기 재사용 (A~J, 여기선 A~G만 씀)
  const by = {};
  disp.forEach(r => {
    const s = String(r[0]).trim(), o = String(r[2]).trim(), d = toDate_(r[1]);
    if (!s || !o || !d) return;
    const k = s + '|' + o;
    if (!by[k]) by[k] = { src: s, order: o, date: d, total: 0 };
    by[k].total += toNum_(r[5]) || 0;
    if (d < by[k].date) by[k].date = d;
  });
  return Object.keys(by).map(k => by[k]);
}

function readLedgerSettings_(ss) { return memo_('ledgerSet', () => readLedgerSettingsRaw_(ss)); }
function readLedgerSettingsRaw_(ss) {
  const sh = ledgerSettingsTab_(ss);
  const last = Math.max(sh.getLastRow(), 6);
  const v = sh.getRange(1, 1, last, 8).getValues();
  const limit = Number(v[3][1]) || LEDGER.DEFAULT_LIMIT;           // B4
  const exclude = [], rules = [];
  for (let i = 5; i < last; i++) {                                    // 6행부터
    if (String(v[i][3]).trim()) exclude.push([String(v[i][3]).trim(), String(v[i][4]).trim()]);   // D·E
    if (String(v[i][6]).trim()) rules.push([String(v[i][6]).trim(), String(v[i][7]).trim() || '기타']);   // G·H
  }
  const S = typeof stRead_ === 'function' ? stRead_(ss) : null;   // 설정 탭(설정.gs) 제외·분류가 있으면 그걸로
  if (S) { exclude.length = 0; rules.length = 0; S.exclude.forEach(x => exclude.push(x)); S.rules.forEach(x => rules.push(x)); }
  const me = typeof saleSettings_ === 'function' ? saleSettings_().myName : '';
  if (me) exclude.push([me, '내 계좌 이동']);   // 설정 탭 '내 이름' (판매용)
  return { limit, exclude, rules };
}

/** 끝자리 비교: 은행이 앞자리를 가려 3자리만 보여도 맞게 ('1234' ↔ '234') (순수, 개인용과 같음) */
function acctTailEq_(a, b) {
  a = String(a || ''); b = String(b || '');
  return Math.min(a.length, b.length) >= 3 && (a.slice(-b.length) === b || b.slice(-a.length) === a);
}

/** 가계부설정 탭 (없을 때만 기본값으로 생성) */
function ledgerSettingsTab_(ss) {
  let sh = ss.getSheetByName(LEDGER.SET);
  if (sh) return sh;
  sh = ss.insertSheet(LEDGER.SET);
  if (typeof hideTab_ === 'function') hideTab_(sh);   // 판매용: 알림 앱을 쓰기 시작할 때 생기는 탭 → 숨김
  const hd = r => r.setFontWeight('bold').setBackground('#385723').setFontColor('#FFFFFF');
  sh.getRange('A1').setValue('가계부 설정').setFontSize(14).setFontWeight('bold');
  sh.getRange('A2').setValue('표를 고치면 다음 갱신(매일 08시 또는 메뉴 가계부 → 지금 갱신)부터 반영. 노란 칸이 입력 칸.').setFontColor('#595959');
  hd(sh.getRange('A3:B3')).setValues([['항목', '값']]);
  sh.getRange('A4:B4').setValues([['변동지출 한도 (월)', LEDGER.DEFAULT_LIMIT]]);
  sh.getRange('B4').setNumberFormat('#,##0').setBackground('#FFF2CC');
  hd(sh.getRange('D5:E5')).setValues([['제외 키워드 (포함되면 지출·입금에서 뺌)', '사유']]);
  sh.getRange(6, 4, LEDGER.DEFAULT_EXCLUDE.length, 2).setValues(LEDGER.DEFAULT_EXCLUDE);
  sh.getRange(6 + LEDGER.DEFAULT_EXCLUDE.length, 4).setValue('(내 이름·내 다른 계좌 별칭을 여기에 추가 → 내부이체)').setFontColor('#A6A6A6');
  hd(sh.getRange('G5:H5')).setValues([['분류 키워드 (| 로 여러 개, 위가 우선)', '분류']]);
  sh.getRange(6, 7, LEDGER.DEFAULT_RULES.length, 2).setValues(LEDGER.DEFAULT_RULES);
  sh.getRange(6, 4, 60, 2).setBackground('#FFF2CC');
  sh.getRange(6, 7, 60, 2).setBackground('#FFF2CC');
  [150, 110, 20, 260, 220, 20, 420, 120].forEach((w, i) => sh.setColumnWidth(i + 1, w));
  sh.setFrozenRows(5);
  return sh;
}

/** 월마감 탭 틀 (없을 때만) */
function ledgerCloseTab_(ss) {
  let sh = ss.getSheetByName(LEDGER.CLOSE);
  if (sh) return sh;
  sh = ss.insertSheet(LEDGER.CLOSE);
  if (typeof hideTab_ === 'function') hideTab_(sh);
  sh.getRange('A1').setValue('월마감 — 잔액 대조로 기록 정밀도 확인').setFontSize(14).setFontWeight('bold');
  sh.getRange('A2').setValue('노란 칸만 입력: 월말 기준 알림 오는 모든 계좌 잔액 합계(D) + 신용카드 아직 안 빠져나간 이용액(E). 월초(B·C)는 전월 월말이 자동으로 들어감(첫 달만 직접 입력).').setFontColor('#595959');
  sh.getRange('A3').setValue('미기록 = (월초 계좌 − 월초 카드미결제) + 입금 − 순지출 − (월말 계좌 − 월말 카드미결제).  0에 가까울수록 알림이 빠짐없이 들어온 것. 음수면 알림 안 온 입금이 있거나 잔액 입력 확인.').setFontColor('#595959');
  const head = ['월', '월초 계좌잔액', '월초 카드미결제', '월말 계좌잔액', '월말 카드미결제', '알림 입금', '알림 출금', '알림 취소', '순지출', '미기록', '정밀도', '쿠팡·네이버 주문', '알림과 매칭', '매칭률'];
  sh.getRange(4, 1, 1, head.length).setValues([head]).setFontWeight('bold').setBackground('#1F3864').setFontColor('#FFFFFF').setWrap(true);
  [70, 110, 110, 110, 110, 100, 100, 90, 100, 100, 70, 120, 110, 70].forEach((w, i) => sh.setColumnWidth(i + 1, w));
  sh.setFrozenRows(4);
  return sh;
}

/** 월마감: 없는 월 행 추가(수식 포함), 쿠팡·네이버 주문/매칭 금액(L·M) 갱신. 사람이 입력한 B~E는 건드리지 않음 */
function writeLedgerClose_(ss, months, thisMonth, bal) {
  const sh = ledgerCloseTab_(ss), F = LEDGER.FIRST;
  if (!months[thisMonth]) months[thisMonth] = { orders: 0, matched: 0 };
  const last = sh.getLastRow();
  const have = [];   // A열 월 목록 (위에서부터 빈칸 전까지. 오른쪽 Q~S 표 때문에 getLastRow가 더 길 수 있음)
  if (last >= F) for (const r of sh.getRange(F, 1, last - F + 1, 1).getDisplayValues()) { if (!r[0]) break; have.push(r[0]); }
  // 알림이 있는 첫 달부터만 행을 만듦 (그 전 달은 알림 기록이 없어 대조 의미 없음). 알림이 없으면 이번 달부터
  const all = Object.keys(months).filter(m => /^\d{4}-\d{2}$/.test(m)).sort();
  const start = have[0] || all.filter(m => months[m].hasNoti)[0] || thisMonth;
  const want = all.filter(m => m >= start && m <= thisMonth && have.indexOf(m) < 0);
  const rowsNow = have.slice();
  want.forEach(m => {
    const r = F + rowsNow.length;
    const N = "'" + LEDGER.NOTI + "'!";
    const sum = t => `=SUMIFS(${N}F:F,${N}J:J,$A${r},${N}E:E,"${t}",${N}K:K,"")`;
    sh.getRange(r, 1).setNumberFormat('@').setValue(m);
    if (r > F) sh.getRange(r, 2, 1, 2).setFormulas([[`=D${r - 1}`, `=E${r - 1}`]]);
    sh.getRange(r, 6, 1, 6).setFormulas([[sum('입금'), sum('출금'), sum('취소'), `=G${r}-H${r}`,
      `=IF(COUNT(B${r}:E${r})<4,"",(B${r}-C${r})+F${r}-I${r}-(D${r}-E${r}))`,
      `=IF(J${r}="","",IF(J${r}<0,"확인",IF(I${r}+J${r}=0,"",I${r}/(I${r}+J${r}))))`]]);
    sh.getRange(r, 14).setFormula(`=IF(L${r}=0,"",M${r}/L${r})`);
    rowsNow.push(m);
  });
  if (!rowsNow.length) return;
  const n = rowsNow.length;
  sh.getRange(F, 12, n, 2).setValues(rowsNow.map(m => [(months[m] || {}).orders || 0, (months[m] || {}).matched || 0]));
  sh.getRange(F, 2, n, 9).setNumberFormat('#,##0');
  sh.getRange(F, 12, n, 2).setNumberFormat('#,##0');
  sh.getRange(F, 11, n, 1).setNumberFormat('0.0%');
  sh.getRange(F, 14, n, 1).setNumberFormat('0%');
  sh.getRange(F, 4, n, 2).setBackground('#FFF2CC');
  sh.getRange(F, 2, 1, 2).setBackground('#FFF2CC');   // 첫 달 월초는 직접 입력
  if (!bal) return;
  // O = 그 달 말 기준 알림 잔액 합(자동). D가 비어 있으면 =O 수식을 넣음 → 직접 적은 값이 있으면 그 값 우선
  sh.getRange(4, 15).setValue('알림 잔액(자동)').setFontWeight('bold').setBackground('#1F3864').setFontColor('#FFFFFF').setWrap(true);
  sh.getRange(F, 15, n, 1).setValues(rowsNow.map(m => [bal.byMonth[m] != null ? bal.byMonth[m] : ''])).setNumberFormat('#,##0');
  const d = sh.getRange(F, 4, n, 1).getFormulas(), dv = sh.getRange(F, 4, n, 1).getValues();
  rowsNow.forEach((m, i) => { if (!d[i][0] && dv[i][0] === '' && bal.byMonth[m] != null) sh.getRange(F + i, 4).setFormula('=O' + (F + i)); });
  // Q~S: 계좌별 최근 잔액
  sh.getRange(4, 17, 1, 3).setValues([['계좌 (알림 기준)', '최근 잔액', '시각']]).setFontWeight('bold').setBackground('#1F3864').setFontColor('#FFFFFF');
  const old = Math.max(sh.getLastRow() - F + 1, 1);
  sh.getRange(F, 17, old, 3).clearContent();
  if (bal.latest.length) {
    sh.getRange(F, 17, bal.latest.length, 3).setValues(bal.latest);
    sh.getRange(F, 18, bal.latest.length, 1).setNumberFormat('#,##0');
    sh.getRange(F + bal.latest.length, 17, 1, 2).setValues([['합계', bal.latest.reduce((a, r) => a + r[1], 0)]]).setFontWeight('bold');
    sh.getRange(F + bal.latest.length, 18).setNumberFormat('#,##0');
  }
  [110, 20, 140, 110, 120].forEach((w, i) => sh.setColumnWidth(15 + i, w));
}

/** 대시보드용: 이번 달 한도와 알림 기준 변동지출 (알림이 아직 없으면 null) */
function ledgerGauge_(ss, tz) {
  const limit = readLedgerSettings_(ss).limit;   // B4 (2026-11-16 속도: 이미 읽은 설정·알림 재사용)
  const notis = readNotis_(ss.getSheetByName(LEDGER.NOTI), tz);
  if (!notis.length) return { limit, noti: null };
  const mon = Utilities.formatDate(new Date(), tz, 'yyyy-MM');
  // 알림이 이번 달 중간에 시작됐으면(1일부터 기록이 없으면) 이번 달은 구매 기준 유지 → 다음 달부터 알림 기준
  const first = String(notis[0].recv).slice(0, 10);
  if (first > mon + '-01') return { limit, noti: null, notiFrom: first };
  let spend = 0, count = 0;
  ledgerLive_(ss, tz).forEach(x => {                                       // 시트 J~N 대신 지금 계산 (08시 갱신 전에도 최신)
    if (x.mon !== mon || x.excluded || x.cat === '고정·할부' || x.cat === '수입') return;
    if (x.type === '출금') { spend += x.amount; count++; }
    else if (x.type === '취소') spend -= x.amount;
  });
  return { limit, noti: { spend, count } };
}