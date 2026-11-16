/**
 * 소비분석.gs — '구매내역_가져오기.gs'와 같은 Apps Script 프로젝트에 넣어서 사용
 * (CFG, toDate_, toast_ 같은 공용 값·함수는 구매내역_가져오기.gs에 있음)
 */

/* ================= 소비분석 탭 ================= */
/*
 * refreshAnalysis(): 매 가져오기 끝에 자동 실행 + 메뉴에서 수동 실행
 *   1) 구매내역관리 J열(분류)이 비어 있는 행만 상품명 키워드로 자동 분류 (직접 입력한 분류는 그대로 둠)
 *   2) '소비분석' 탭을 지우고 다시 계산해 표·차트를 그림 (쿠팡·네이버 모두 포함, A열 구분 기준)
 */
const ANA = { SHEET: '소비분석', BIG: 100000, LATE_DAYS: 30 };   // LATE_DAYS: 예상일이 이 일수 이내로 지났으면 주황, 더 지났으면 회색 '중단?'
const CAT_ORDER = ['식품', '외식·카페', '배달', '육아', '가전·디지털', '인테리어·가구', '생활·주방', '뷰티·위생', '미용', '의류', '교통', '차량', '건강', '여행', '구독', '세금', '기타', '배송비'];
// 분류별 고정 색 (모든 차트에서 같은 분류 = 같은 색)
const CAT_COLOR = { '식품': '#34A853', '외식·카페': '#A0522D', '배달': '#F76707', '육아': '#FBBC04', '가전·디지털': '#4285F4', '인테리어·가구': '#A142F4', '생활·주방': '#24C1E0', '뷰티·위생': '#F06292', '미용': '#C2255C', '의류': '#FF922B', '교통': '#0B7285', '차량': '#8D6E63', '건강': '#EA4335', '여행': '#0CA678', '구독': '#5C7CFA', '세금': '#343A40', '기타': '#9AA0A6', '배송비': '#5F6368' };
const CAT_RULES = [
  // 예외 우선 규칙 (아래 일반 규칙보다 먼저 검사)
  // 2026-11-04 전수 점검(고유 품목 498개)에서 찾은 오분류 교정
  // 2026-11-07 네이버페이(쇼핑 외 결제) 반영: 외식·카페·여행·구독·미용·세금 신설
  ['외식·카페', /텐퍼센트|스타벅스|starbucks|이디야|메가커피|메가MGC|컴포즈커피|투썸|빽다방|폴바셋|블루보틀|커피빈|할리스|(?<!홈)카페(?!트)|배달의민족|요기요|쿠팡이츠/i],
  ['여행', /airbnb|에어비앤비|카모아|렌트카|단기렌트|숙박|야놀자|여기어때|아고다|agoda|트립닷컴|부킹닷컴/i],
  ['구독', /멤버십|구독권|월간 이용권|플레이스토어|google play|넷플릭스|netflix|유튜브 프리미엄|디즈니\+|티빙|와우 멤버십|네이버플러스|멜론|스포티파이|spotify/i],
  ['미용', /디자이너|헤어샵|미용실|네일샵|바버샵/],
  ['세금', /재산세|주민세|자동차세|지방세|취득세|과태료|범칙금|wetax|위택스/i],
  ['뷰티·위생', /치실|치약|칫솔|팬티라이너|청결티슈/],
  ['건강', /보호대/],
  ['의류', /자켓|재킷|티셔츠|양말|면팬티|여성 팬티|briefs|underwear|수영복|원피스|래쉬가드|와플가운|(^|\s)브라(\s|,|$)/],
  ['차량', /워셔액|연료첨가제|유막|tar remover|차량용|차량 헤드레스트|와이퍼/],
  ['생활·주방', /수세미 거치대|변기솔|채칼|양념통|전용캡슐 타워|보드마카/],
  ['인테리어·가구', /욕실 시계|벽시계|샤워기 거치대|케이블타이|도어스토퍼|스툴|쿠션|니퍼|압착기/],
  ['건강', /철분|영양제/],
  ['뷰티·위생', /샴푸|메이크업 브러쉬/],
  ['생활·주방', /그라탕그릇|오븐용기/],
  ['가전·디지털', /커피머신|분유포트|거품기|티 메이커|전기방석|잔광|콘덴서/],
  ['생활·주방', /과일 세정제|김치통|양면 도마|세탁기 커플링|커플러|급수캡|핫팩|먼지제거|선물용 가방/],
  ['뷰티·위생', /면도기|생리대|sanitary|overnight panti|멀티밤|자일리톨/],
  ['식품', /부채살|다짐육|medium wave|과일|피타브레드|양어깨살/],
  ['생활·주방', /냄비/],
  // 일반 규칙
  ['육아', /분유|트루맘|뉴클래스|기저귀|젖병|젖꼭지|노리개|유아|아기|신생아|베이비|baby|Baby|우주복|속싸개|스와들|하이체어|아기띠|치발기|착유|모유|베베|범퍼|모빌|딸랑|rattle|촉감|아기식판|Teenieping|hairpin|유모차|마더케이|헤겐|물티슈|체온계|블랭킷|blanket|깜짝볼|probiotic|토퍼|가제손수건|니플|유두|수유|산모|출산|임산부|산후|맘스|moms|Depend|디펜드/],
  ['식품', /샘물|생수|쌀|김치|도시락김|김치볶음|김치찌개|고등어|mackerel|소고기|beef|닭|호주산 램|양고기|lamb|새우|토마토|tomato|오이|cucumber|브로콜리|broccoli|아보카도|바나나|사과|참외|수박|melon|키위|딸기|한라봉|레몬|lemon|오렌지|파인|감자|양파|당근|애호박|시금치|상추|lettuce|루꼴라|arugula|파슬리|마늘|크림치즈|cream cheese|치즈|우유|요플레|요구르트|계란|초란|eggs|피자|pizza|파스타|스파게티|마카로니|푸질리|파스타면|진라면|짜장면|Chapaghetti|빵|버거번|와플|팬케이크|파라타|소스|고추장|양념|소금|후추|큐민|코리앤더|카다멈|향신료|스파이스|clove|월계수|올리브유|들기름|피넛|잼|스프레드|spread|pistachio|피스타치오|아몬드|호박씨|분태|그래놀라|콘후레이크|퀴노아|바스마티|BASMATI|rice|대추야자|DATES|Dates|곶감|캡슐커피|캡슐|커피믹스|밀크티|시럽|카라멜|초콜렛|비스킷|푸딩|쿠킹크림|cooking cream|코니숑|cornichon|Cheetos|Fritos|타히니|프룬|건자두|쌈|볶음밥|kataif|dumpling|패티|tomato puree|오이소박이|쿠킹|칵테일/],
  ['가전·디지털', /오븐|공기청정기|선풍기|청소기|모니터|SSD|HDD|케이블|충전기|충전|멀티탭|연장|콘센트|마우스|키보드|키패드|이어폰|스피커|마이크|HDMI|DP to|USB|SATA|건전지|에어태그|드라이기|토스터|toaster|그릴|조명|LED|전구|카메라|Wi-Fi|거치대|삼각대|맥세이프|휴대폰 케이스|스트랩|재봉|sewing|코털|압착기|니퍼/],
  ['인테리어·가구', /커튼|압축봉|선반|행거|옷걸이|수납|정리함|정리대|보관함|칸막이|리빙박스|가구|레벨러|슬라이더|거실장|템바보드|발판|사다리|카페트|매트|쿠션|이불|침대패드|테이블보|식탁보|시계|방음|흡음|도어|현관|창문|엠보시트|필름|다운라이트|매입등|장스탠드|비데|수전|하수구|배수구|트랩|거름망|샤워기|욕실화|거실화|실내화|슬리퍼|공구|렌치|커터칼|케이블타이|피스|접착제|퍼티|우드픽스|테이프|단열|뽁뽁이|자석|카트|가운|빨래바구니|세탁바구니|도어패킹|캠핑/],
  ['생활·주방', /휴지|화장지|티슈|키친타|타월|타올|행주|롤백|위생|종이호일|쓰레기봉투|휴지통|세제|섬유유연제|detergent|유연제|락스|청소|클리너|얼룩|연마제|수세미|브러쉬|솔|스퀴지|살충제|장갑|궁중팬|프라이팬|후라이팬|도마|그릇|접시|용기|밀폐|양념통|텀블러|물병|물컵|수저|채칼|레이들|shopping bag|명함|보드마카|여권케이스|목베개/],
  ['뷰티·위생', /샴푸|PDRN|바디워시|클렌저|클렌징|로션|폼|헤어|칫솔|치약|치실|floss|플랙커스|라이너|청결티슈|페미닌|왁스|메이크업|립스틱|팩트|아이브로우|네일|hand cream|각질|흉터|겔 시트|시카|식초/],
  ['건강', /철분|영양제|비타민|칼슘|엽산|압박|보호대|대일밴드|마사지/],
  // 위 규칙에 안 걸린 옷·차량용품 (일반 규칙 맨 끝: '팬티'·'스타킹' 같은 넓은 단어가 다른 분류를 먼저 뺏지 않게)
  ['의류', /셔츠|점퍼|패딩|코트|바지|팬츠|레깅스|니트|가디건|스웨터|속옷|팬티|브라탑|스타킹|잠옷|파자마/],
  ['차량', /자동차|차량|세차|타이어|블랙박스|엔진오일/],
];

function classify(name) {
  const n = String(name || '').trim();
  if (n === '배송비') return '배송비';
  for (const [c, re] of CAT_RULES) if (re.test(n)) return c;
  return '기타';
}

/** 순수 계산: rows = [{src, date:'yyyy-MM-dd', order, name, amount, cat}] (취소=금액 0 포함 가능) */
function computeAnalysis(rows, todayStr) {
  const paid = rows.filter(r => r.amount > 0);
  const sum = a => a.reduce((s, x) => s + x, 0);
  const total = sum(paid.map(r => r.amount));
  const curMonth = todayStr.slice(0, 7);
  // 월 목록: 데이터 첫 달 ~ max(데이터 마지막 달, 이번 달)
  const ms = paid.map(r => r.date.slice(0, 7)).sort();
  const months = [];
  if (ms.length) {
    let [y, m] = ms[0].split('-').map(Number);
    const end = [ms[ms.length - 1], curMonth].sort()[1];
    while (true) { const k = `${y}-${String(m).padStart(2, '0')}`; months.push(k); if (k >= end) break; m++; if (m > 12) { m = 1; y++; } }
  }
  const monthly = months.map(mo => {
    const r = paid.filter(x => x.date.slice(0, 7) === mo);
    const o = { month: mo, total: sum(r.map(x => x.amount)) };
    CAT_ORDER.forEach(c => { o[c] = sum(r.filter(x => x.cat === c).map(x => x.amount)); });
    CFG.SOURCES.forEach(s => { o[s] = sum(r.filter(x => x.src === s).map(x => x.amount)); });
    return o;
  });
  const fullMonths = monthly.filter(o => o.month < curMonth && o.total > 0);
  // 주문 단위: 쿠팡은 주문번호, 주문번호가 없는 출처(네이버)는 같은 날 묶음
  const orders = new Map();
  paid.forEach(r => { const k = r.src + '|' + (r.order || r.date); const o = orders.get(k) || { amount: 0, date: r.date }; o.amount += r.amount; orders.set(k, o); });
  const ov = [...orders.values()];
  const amts = ov.map(o => o.amount).sort((a, b) => a - b);
  const median = amts.length ? (amts.length % 2 ? amts[(amts.length - 1) / 2] : (amts[amts.length / 2 - 1] + amts[amts.length / 2]) / 2) : 0;
  const big = paid.filter(r => r.amount >= ANA.BIG);
  const kpi = {
    total, monthlyAvg: fullMonths.length ? sum(fullMonths.map(o => o.total)) / fullMonths.length : 0, fullMonths: fullMonths.length,
    lines: paid.length, orders: ov.length, avgOrder: ov.length ? total / ov.length : 0, medianOrder: median,
    bigShare: total ? sum(big.map(r => r.amount)) / total : 0, bigLines: big.length,
    bySrc: CFG.SOURCES.map(s => [s, sum(paid.filter(r => r.src === s).map(r => r.amount))]),
  };
  const cats = CAT_ORDER.map(c => { const r = paid.filter(x => x.cat === c); return { cat: c, amount: sum(r.map(x => x.amount)), lines: r.length }; })
    .filter(o => o.lines > 0 || o.cat === '기타').sort((a, b) => b.amount - a.amount).map(o => ({ ...o, share: total ? o.amount / total : 0 }));
  const WD = ['월', '화', '수', '목', '금', '토', '일'];
  const weekday = WD.map((label, i) => {
    const os = ov.filter(o => (new Date(o.date + 'T00:00:00Z').getUTCDay() + 6) % 7 === i);
    const a = sum(os.map(o => o.amount));
    return { label, amount: a, orders: os.length, perOrder: os.length ? a / os.length : 0 };
  });
  const EDGES = [[0, 10000, '1만원 미만'], [10000, 30000, '1–3만원'], [30000, 50000, '3–5만원'], [50000, 100000, '5–10만원'], [100000, Infinity, '10만원 이상']];
  const buckets = EDGES.map(([lo, hi, label]) => { const s = ov.filter(o => o.amount >= lo && o.amount < hi); const a = sum(s.map(o => o.amount)); return { label, orders: s.length, amount: a, share: total ? a / total : 0 }; });
  const byKey = new Map();
  paid.filter(r => r.name !== '배송비').forEach(r => { const k = String(r.name).split(',')[0].trim(); const v = byKey.get(k) || []; v.push(r); byKey.set(k, v); });
  const DAY = 864e5;
  const repeat = [...byKey.entries()].map(([item, v]) => {
    const days = [...new Set(v.map(r => r.date))].sort();
    if (days.length < 3) return null;
    const t = days.map(d => Date.parse(d + 'T00:00:00Z'));
    const gaps = t.slice(1).map((x, i) => (x - t[i]) / DAY);
    const gap = Math.round(sum(gaps) / gaps.length);
    const nextT = t[t.length - 1] + gap * DAY;
    const next = new Date(nextT).toISOString().slice(0, 10);
    const late = Math.round((Date.parse(todayStr + 'T00:00:00Z') - nextT) / DAY);   // 예상일에서 며칠 지났는지 (음수 = 아직 안 옴)
    const state = late < 0 ? '' : late <= ANA.LATE_DAYS ? `살 때 지남 (${late}일)` : '중단?';
    return { item, times: days.length, total: sum(v.map(r => r.amount)), gap, last: days[days.length - 1], next, late, state };
  }).filter(Boolean).sort((a, b) => b.total - a.total);
  const top = paid.filter(r => r.name !== '배송비').sort((a, b) => b.amount - a.amount).slice(0, 10);
  return { kpi, months, monthly, cats, weekday, buckets, repeat, top };
}

/** 구매내역관리 탭 → 분석용 행. fill=true면 J열(분류) 빈칸을 자동 분류로 채워 시트에 기록 */
function readRows_(ss, fill) {
  const src = ss.getSheetByName(CFG.SHEET);
  if (!src) throw new Error('탭이 없습니다: ' + CFG.SHEET);
  const F = CFG.FIRST_ROW;
  if (fill) buyEnsure_(src, F, buyLast_(src, F) + 400);           // 매일 07시: 옛 1000행 고정 수식 정리 + 데이터 뒤로 늘 400행 이상 여유 (가져오기 중에 늘리지 않게 미리)
  const B = fill ? null : buyRead_(src, F);   // 대시보드: 줄 끝·A~J 한 번에 (readOrders_와 같이 씀)
  const n = fill ? Math.max(buyLast_(src, F) - F + 1, 1) : B.n;
  const disp = fill ? src.getRange(F, 1, n, 10).getDisplayValues() : B.disp;
  const vals = src.getRange(F, 8, n, 1).getValues();             // H 반영금액
  const jcol = disp.map(r => [r[9]]);
  let filled = 0;
  // 빈칸은 자동 분류. '기타'도 매번 다시 검사 → 규칙을 늘리면 다음 갱신 때 자동으로 옮겨감 (직접 고른 다른 분류는 그대로)
  disp.forEach((r, i) => {
    if (!r[3] || (r[9] && r[9] !== '기타')) return;
    const c = classify(r[3]);
    if (!r[9] || c !== '기타') { jcol[i][0] = c; filled++; }
  });
  if (fill && filled) src.getRange(F, 10, n, 1).setValues(jcol);
  if (fill) src.getRange(F, 10, n, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(CAT_ORDER, true).setAllowInvalid(true).build());   // J열 분류 드롭다운
  const rows = [];
  disp.forEach((r, i) => {
    if (!r[0] || !r[3]) return;
    const d = toDate_(r[1]); if (!d) return;
    rows.push({ src: r[0], date: d, order: String(r[2] || '').trim(), name: r[3], amount: Number(vals[i][0]) || 0, cat: jcol[i][0] || classify(r[3]), status: r[6], row: F + i });   // row = 시트 행 번호 (대시보드 분류 바꾸기용)
  });
  return { rows, filled: fill ? filled : 0 };
}

function refreshAnalysis() {
  const ss = saleSs_();
  const { rows, filled } = readRows_(ss, true);
  const tz = ss.getSpreadsheetTimeZone() || Session.getScriptTimeZone() || 'Asia/Seoul';   // 시트 시간대가 비어 있으면 스크립트 시간대 → 서울
  const today = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  const A = computeAnalysis(rows, today);
  let url = null;
  try { url = ScriptApp.getService().getUrl(); } catch (e) {}   // 웹앱 배포 전이면 null
  writeAnalysis_(ss, A, Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd HH:mm'), filled, url);
}

/** 간단 탭: KPI + 표만 (차트·요일·금액대는 HTML 대시보드에서) */
function writeAnalysis_(ss, A, stamp, filled, url) {
  let sh = ss.getSheetByName(ANA.SHEET);
  if (!sh) sh = ss.insertSheet(ANA.SHEET, ss.getSheetByName(CFG.SHEET).getIndex());
  sh.getCharts().forEach(c => sh.removeChart(c));
  sh.clear();
  const WON = '#,##0', PCT = '0.0%';
  const head = (r, c, labels) => sh.getRange(r, c, 1, labels.length).setValues([labels]).setFontWeight('bold').setBackground('#1F3864').setFontColor('#FFFFFF');
  const title = (r, t) => sh.getRange(r, 1).setValue(t).setFontWeight('bold').setFontSize(12);

  sh.getRange('A1').setValue('소비분석 (쿠팡·네이버 구매내역)').setFontSize(14).setFontWeight('bold');
  sh.getRange('A2').setValue(`갱신 ${stamp} · 매일 07시 자동 갱신 · 분류는 대시보드에서 바꾸기` + (filled ? ` · 이번에 자동 분류 ${filled}행` : ''))
    .setFontSize(9).setFontColor('#595959');

  // KPI
  const K = A.kpi;
  const kl = ['총지출(취소 제외)', `월평균(${K.fullMonths}개월)`, '주문 수', '주문당 평균', '주문 중앙값', '10만원↑ 비중'].concat(K.bySrc.map(s => s[0] + ' 합계'));
  const kv = [K.total, K.monthlyAvg, K.orders, K.avgOrder, K.medianOrder, K.bigShare].concat(K.bySrc.map(s => s[1]));
  head(4, 1, kl);
  sh.getRange(5, 1, 1, kv.length).setValues([kv]).setFontSize(12).setFontWeight('bold');
  sh.getRange(5, 1, 1, kv.length).setNumberFormat(WON);
  sh.getRange(5, 3).setNumberFormat('#,##0"건"');
  sh.getRange(5, 6).setNumberFormat(PCT);

  // 월별 × 분류
  let r = 7; title(r, '월별 지출 (분류별)'); r++;
  const mh = ['월'].concat(CAT_ORDER, ['합계'], CFG.SOURCES);
  head(r, 1, mh);
  const mrows = A.monthly.map(o => [o.month].concat(CAT_ORDER.map(c => o[c]), [o.total], CFG.SOURCES.map(s => o[s])));
  if (mrows.length) {
    sh.getRange(r + 1, 1, mrows.length, 1).setNumberFormat('@');   // 값 쓰기 전에 텍스트로 고정 (날짜 변환 방지)
    sh.getRange(r + 1, 1, mrows.length, mh.length).setValues(mrows);
    sh.getRange(r + 1, 2, mrows.length, mh.length - 1).setNumberFormat(WON);
  }
  r += mrows.length + 3;

  // 분류
  title(r, '분류별 합계'); r++;
  head(r, 1, ['분류', '금액', '비중', '상품 수']);
  const crows = A.cats.map(o => [o.cat, o.amount, o.share, o.lines]);
  if (crows.length) {
    sh.getRange(r + 1, 1, crows.length, 4).setValues(crows);
    sh.getRange(r + 1, 2, crows.length, 1).setNumberFormat(WON);
    sh.getRange(r + 1, 3, crows.length, 1).setNumberFormat(PCT);
    crows.forEach((o, i) => sh.getRange(r + 1 + i, 1).setFontColor(CAT_COLOR[o[0]] || '#000000').setFontWeight('bold'));
  }
  r += crows.length + 3;

  // 반복 구매
  title(r, `반복 구매 품목 (서로 다른 날 3회 이상) · 예상일이 ${ANA.LATE_DAYS}일 이내로 지났으면 주황, 그보다 오래 지났으면 회색 '중단?'`); r++;
  head(r, 1, ['품목', '횟수', '총액', '평균 간격(일)', '마지막 구매', '다음 예상', '상태']);
  const rrows = A.repeat.map(o => [o.item, o.times, o.total, o.gap, o.last, o.next, o.state]);
  if (rrows.length) {
    sh.getRange(r + 1, 5, rrows.length, 2).setNumberFormat('@');
    sh.getRange(r + 1, 1, rrows.length, 7).setValues(rrows);
    sh.getRange(r + 1, 3, rrows.length, 1).setNumberFormat(WON);
    A.repeat.forEach((o, i) => {
      if (o.late < 0) return;
      const cell = sh.getRange(r + 1 + i, 6, 1, 2);
      if (o.late <= ANA.LATE_DAYS) cell.setFontColor('#C55A11').setFontWeight('bold');
      else cell.setFontColor('#9E9E9E');
    });
  }
  r += rrows.length + 3;

  // 상위 10
  title(r, '금액이 큰 상품 10개'); r++;
  head(r, 1, ['순위', '주문일', '구분', '분류', '금액', '상품']);   // 긴 상품명은 맨 오른쪽 → 오른쪽 빈 칸으로 이어져 전부 보임
  const trows = A.top.map((o, i) => [i + 1, o.date, o.src, o.cat, o.amount, o.name]);
  if (trows.length) {
    sh.getRange(r + 1, 2, trows.length, 1).setNumberFormat('@');
    sh.getRange(r + 1, 1, trows.length, 6).setValues(trows);
    sh.getRange(r + 1, 5, trows.length, 1).setNumberFormat(WON);
  }

  sh.setColumnWidth(1, 300);
  for (let c = 2; c <= Math.max(13, CAT_ORDER.length + 4); c++) sh.setColumnWidth(c, 105);
  sh.setFrozenRows(3);
}
