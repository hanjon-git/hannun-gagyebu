/**
 * 시작하기.gs (판매용) — 시트 맨 앞 '시작하기' 탭: 설치 순서 안내 + 단계별 상태(자동)
 *  상태는 스크립트 속성으로 판단: SS_ID(설치) · WEBAPP_URL(웹앱 주소) · SYNC_coupang/naver(확장 동기화) + 계획 탭 내용
 *  사본을 만들면 스크립트 속성은 따라오지 않음 → 처음 열 때(onOpen) 상태가 '아직'으로 다시 계산됨
 *  onOpen(단순 트리거)에서도 돌아야 하므로 승인이 필요한 서비스(ScriptApp 등)는 쓰지 않음
 */
const GUIDE = {
  TAB: '시작하기',
  HEAD: ['단계', '할 일', '어떻게', '상태'],
  FIRST: 4,
  EXT_URL: 'https://drive.google.com/drive/folders/1d5ShOii_e6dYLN9NTQ7V6k-Lbn8LV_4r',   // 확장 zip이 있는 공유 폴더 (zip을 바꿔 올려도 폴더 주소는 그대로). 웹스토어 등록 후 그 주소로 바꿀 것
  STEPS: [
    ['1', '설치', "메뉴 '가계부 → 설치 (처음 한 번)' → 승인 필요 창에서 계속 → 내 구글 계정 선택 → '확인되지 않은 앱' 화면이면 고급 → 이동 → 권한 목록에서 '모두 선택' 체크 → 계속", 'install'],
    ['2', '웹앱 배포', "메뉴 '확장 프로그램 → Apps Script' → 오른쪽 위 '배포 → 새 배포' → 유형 선택(톱니)에서 '웹 앱' → 실행: 나 / 액세스 권한: 모든 사용자 → 배포 → 나온 '웹 앱 URL'(…/exec) 복사", 'url'],
    ['3', '주소·연결코드 받기', "이 시트로 돌아와 메뉴 '가계부 → 대시보드 주소 · 연결코드 보기' → 2에서 복사한 URL 붙여넣기 → 대시보드 주소는 폰으로 보내 즐겨찾기, 연결코드는 4에서 사용", 'url'],
    ['4', '크롬 확장 연결', "PC 크롬에 '가계부 구매 동기화' 확장 설치 — 아래 주소에서 zip 내려받기 → 압축 풀기(푼 폴더는 지우지 말 것) → 주소창에 chrome://extensions → 오른쪽 위 '개발자 모드' 켜기 → '압축해제된 확장 프로그램 로드' → 푼 폴더 선택.\n그다음 퍼즐 아이콘 → 가계부 구매 동기화 → 연결코드 붙여넣기 → 저장 → '지금 동기화' (쿠팡·네이버 로그인 창이 뜨면 로그인)\n확장 받는 곳: " + 'https://drive.google.com/drive/folders/1d5ShOii_e6dYLN9NTQ7V6k-Lbn8LV_4r', 'sync'],
    ['5', '계획 채우기 (선택)', "'계획' 탭 빈 줄에 수입·고정지출·예산을 적으면 대시보드에 예산·계획 대비가 보임. 비워도 내역·달력·분석은 보임", 'plan'],
    ['', '매일 쓰기', "PC에서 이 시트를 열면 하루 한 번 쿠팡·네이버를 자동으로 가져옴. 현금 지출은 대시보드 내역 탭의 + 로 추가. 분류가 틀리면 대시보드에서 분류 태그를 눌러 바꿈", ''],
    ['', '문제가 생기면', "대시보드가 안 열림 → 2단계 액세스가 '모든 사용자'인지 확인, 메뉴 '웹앱 주소 다시 넣기' / 확장이 '연결코드가 맞지 않음' → 3단계에서 다시 복사 / 주소·코드가 남에게 보였으면 메뉴 '키·토큰 새로 만들기'", ''],
  ],
};

function saleGuideTab_(ss) {
  let sh = ss.getSheetByName(GUIDE.TAB);
  if (sh) return sh;
  sh = ss.insertSheet(GUIDE.TAB, 0);
  sh.getRange('A1').setValue('가계부 시작하기').setFontSize(16).setFontWeight('bold');
  sh.getRange(3, 1, 1, GUIDE.HEAD.length).setValues([GUIDE.HEAD]).setFontWeight('bold').setBackground('#F3F3F3');
  sh.getRange(GUIDE.FIRST, 1, GUIDE.STEPS.length, 3).setValues(GUIDE.STEPS.map(s => s.slice(0, 3)));
  sh.getRange(GUIDE.FIRST, 1, GUIDE.STEPS.length, 4).setWrap(true).setVerticalAlignment('top');
  sh.getRange(GUIDE.FIRST, 2, GUIDE.STEPS.length, 1).setFontWeight('bold');
  sh.getRange(GUIDE.FIRST, 1, GUIDE.STEPS.length, 1).setHorizontalAlignment('center');
  [50, 140, 620, 170].forEach((w, i) => sh.setColumnWidth(i + 1, w));
  sh.setFrozenRows(3);
  return sh;
}

/** 단계별 상태 {install, url, sync, plan} (속성·계획 탭만 봄 → onOpen에서도 동작) */
function saleGuideState_(ss) {
  const p = PropertiesService.getScriptProperties();
  const last = ['coupang', 'naver'].map(k => Number(p.getProperty('SYNC_' + k)) || 0).reduce((a, b) => Math.max(a, b), 0);
  let plan = false;
  try { const sh = ss.getSheetByName(PT.TAB); plan = !!(sh && sh.getLastRow() >= PT.FIRST && sh.getRange(PT.FIRST, 1, sh.getLastRow() - PT.FIRST + 1, 4).getDisplayValues().some(r => r[0] && r[2])); } catch (e) {}
  return {
    install: !!p.getProperty('SS_ID') && p.getProperty('SS_ID') === ss.getId(),
    url: !!p.getProperty('WEBAPP_URL'),
    sync: last ? Utilities.formatDate(new Date(last), 'Asia/Seoul', 'M/d HH:mm') : '',
    plan,
  };
}
function saleGuideStatus_(ss) {
  try {
    const sh = ss.getSheetByName(GUIDE.TAB);
    if (!sh) return;
    const s = saleGuideState_(ss);
    let next = true;   // 아직 안 된 첫 필수 단계 = 지금
    const st = GUIDE.STEPS.map(x => {
      const k = x[3];
      if (!k) return '';
      const done = k === 'install' ? s.install : k === 'url' ? s.url : k === 'sync' ? !!s.sync : s.plan;
      if (done) return 'done';
      if (next && k !== 'plan') { next = false; return 'now'; }
      return 'todo';
    });
    const out = st.map((v, i) => [v === 'done' ? (GUIDE.STEPS[i][3] === 'sync' ? '완료 ' + s.sync : '완료') : v === 'now' ? '지금' : v === 'todo' ? '아직' : '']);
    const r = sh.getRange(GUIDE.FIRST, 4, out.length, 1);
    r.setValues(out).setFontWeight('bold');
    r.setFontColors(st.map(v => [v === 'done' ? '#2F9E44' : v === 'now' ? '#E8590C' : '#9AA0A6']));
    sh.getRange(GUIDE.FIRST, 1, out.length, 4).setBackgrounds(st.map(v => Array(4).fill(v === 'done' ? '#E6F4EA' : v === 'now' ? '#FEEFE3' : null)));
    // 2행: 필수 단계 칸 (■ 색) + 끝낸 수 / 전체
    const req = st.filter((v, i) => GUIDE.STEPS[i][3] && GUIDE.STEPS[i][3] !== 'plan');
    const C = { done: '#34A853', now: '#F9AB00', todo: '#DADCE0' };
    const txt = req.map(() => '■').join(' '), b = SpreadsheetApp.newRichTextValue().setText(txt);
    req.forEach((v, i) => b.setTextStyle(i * 2, i * 2 + 1, SpreadsheetApp.newTextStyle().setForegroundColor(C[v]).setFontSize(18).build()));
    sh.getRange(2, 1).setValue('');   // 예전 안내 문장 자리
    sh.getRange(2, 2).setRichTextValue(b.build()).setVerticalAlignment('middle');
    sh.getRange(2, 3).setValue(req.filter(v => v === 'done').length + ' / ' + req.length).setFontSize(14).setFontWeight('bold').setFontColor('#202124').setVerticalAlignment('middle');
  } catch (e) {}
}
