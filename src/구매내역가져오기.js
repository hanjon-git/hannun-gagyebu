/**
 * 구매내역가져오기.gs (판매용) — '구매내역관리' 탭 틀과 행 반영 규칙
 *  쿠팡·네이버 내역은 크롬 확장 → 웹앱(수집.gs purchase_)으로 들어옴. 개인용의 드라이브 폴더 CSV 가져오기는 뺐음(드라이브 권한이 필요해서)
 */

const CFG = {
  SHEET: '구매내역관리',
  FIRST_ROW: 5,
  LAST_ROW: 300,          // 탭을 처음 만들 때 깔아 두는 행 수 (상한 아님: 모자라면 buyEnsure_가 늘림)
  SOURCES: ['쿠팡', '네이버'],
};

// 머리글 키워드 (앞에 있는 키워드가 우선)
const COLS = {
  date:   ['주문일', '결제일', '주문일자', '결제일시', '주문일시', '날짜', '일자', 'date'],
  order:  ['주문번호', '상품주문번호', 'order'],
  name:   ['상품명', '상품', '품목', 'item', 'name'],
  qty:    ['수량', 'qty', 'quantity'],
  amount: ['결제금액', '실결제금액', '주문금액', '금액', '가격', 'price', 'amount'],
  status: ['주문상태', '상태', 'status'],
};

/** 구매내역관리 탭이 없으면 만들고 수식·월별 합계·캡처 7행을 넣음 (이미 있으면 아무것도 안 함) */
function setupSheet() {
  const ss = saleSs_();
  if (ss.getSheetByName(CFG.SHEET)) return;
  const sh = ss.insertSheet(CFG.SHEET);
  const F = CFG.FIRST_ROW, L = CFG.LAST_ROW, n = L - F + 1;

  sh.getRange('A1').setValue('구매내역관리 (쿠팡·네이버)').setFontSize(14).setFontWeight('bold');
  sh.getRange('A2').setValue("노란 칸(A~G, J~K)만 입력 · 회색 칸(H·I·L) 자동 · 상태에 '취소'/'반품' 포함 시 반영금액 0 · 중복키 = 구분+주문일+주문번호+상품명+금액")
    .setFontSize(9).setFontColor('#595959');
  const heads = ['구분', '주문일', '주문번호', '상품명', '수량', '결제금액(원)', '상태', '반영금액(원)', '월키', '분류', '메모', '중복체크'];
  sh.getRange(4, 1, 1, 12).setValues([heads]).setFontWeight('bold').setFontColor('#FFFFFF').setBackground('#1F3864').setHorizontalAlignment('center');

  const fH = [], fI = [], fL = [];
  for (let r = F; r <= L; r++) {
    fH.push([`=IF(F${r}="","",IF(ISNUMBER(SEARCH("취소",G${r}))+ISNUMBER(SEARCH("반품",G${r}))>0,0,F${r}))`]);
    fI.push([`=IF(B${r}="","",YEAR(B${r})*100+MONTH(B${r}))`]);
    fL.push([`=IF(D${r}="","",IF(COUNTIFS($A$${F}:$A,A${r},$B$${F}:$B,B${r},$C$${F}:$C,C${r},$D$${F}:$D,D${r},$F$${F}:$F,F${r})>1,"중복",""))`]);
  }
  sh.getRange(F, 8, n, 1).setFormulas(fH);
  sh.getRange(F, 9, n, 1).setFormulas(fI);
  sh.getRange(F, 12, n, 1).setFormulas(fL);
  sh.getRange(F, 1, n, 7).setBackground('#FFF9DB');
  sh.getRange(F, 10, n, 2).setBackground('#FFF9DB');
  [8, 9, 12].forEach(c => sh.getRange(F, c, n, 1).setBackground('#F2F2F2'));
  sh.getRange(F, 2, n, 1).setNumberFormat('yyyy-mm-dd');
  sh.getRange(F, 3, n, 1).setNumberFormat('@');   // 주문번호(14자리)를 숫자·지수표기로 바꾸지 않도록 텍스트 고정
  sh.getRange(F, 6, n, 1).setNumberFormat('#,##0');
  sh.getRange(F, 8, n, 1).setNumberFormat('#,##0');
  sh.getRange(F, 1, n, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(CFG.SOURCES, true).setAllowInvalid(true).build());

  [8, 12, 14, 40, 6, 13, 10, 13, 9, 12, 18, 9].forEach((w, i) => sh.setColumnWidth(i + 1, w * 8));
  sh.setFrozenRows(4);
}

/**
 * 행 반영 (쿠팡 북마크·CSV 공용)
 *  - 주문번호가 있는 행: 구분+주문번호+상품명이 이미 있으면 수량·금액·상태만 갱신 (배송중→배송완료, 나중에 취소된 주문 반영)
 *  - 주문번호가 없는 행(네이버 등): 구분+주문일+상품명+금액이 같으면 건너뜀
 *  rows: [[구분, 주문일, 주문번호, 상품명, 수량, 금액, 상태], ...]
 */
function upsertPurchases_(ss, rows) {
  if (!ss.getSheetByName(CFG.SHEET)) setupSheet();
  const sh = ss.getSheetByName(CFG.SHEET);
  const F = CFG.FIRST_ROW, n = Math.max(buyLast_(sh, F) - F + 1, 0);
  const cur = n ? sh.getRange(F, 1, n, 7).getDisplayValues() : [];
  const okey = r => [String(r[0]).trim(), String(r[2] || '').trim(), String(r[3]).trim()].join('|');
  const byOrder = new Map(), keys = new Set();
  cur.forEach((r, i) => { if (!r[0]) return; keys.add(rowKey_(r)); if (String(r[2]).trim()) byOrder.set(okey(r), i); });
  const next = n;   // 마지막 데이터 다음 행부터 이어 씀
  const add = [], upd = [];
  let same = 0;
  rows.forEach(r => {
    if (String(r[2] || '').trim()) {
      const k = okey(r);
      if (byOrder.has(k)) {
        const i = byOrder.get(k);
        if (i < 0) { same++; return; }                      // 같은 업로드 안에서 중복
        const c = cur[i];
        const changed = toNum_(c[5]) !== toNum_(r[5]) || String(c[6]).trim() !== String(r[6] || '').trim()
          || (r[4] !== '' && toNum_(c[4]) !== toNum_(r[4]));
        if (changed) { upd.push([i, r]); c[4] = String(r[4]); c[5] = String(r[5]); c[6] = String(r[6] || ''); } else same++;
        return;
      }
      byOrder.set(k, -1);
    } else {
      const k = rowKey_(r);
      if (keys.has(k)) { same++; return; }
      keys.add(k);
    }
    add.push(r);
  });
  if (add.length) buyEnsure_(sh, F, F + next + add.length - 1);
  upd.forEach(([i, r]) => sh.getRange(F + i, 5, 1, 3).setValues([[r[4], r[5], r[6] || '']]));
  if (add.length) sh.getRange(F + next, 1, add.length, 7).setValues(add);
  return { added: add.length, updated: upd.length, same };
}

/* ---------- 순수 로직 (테스트 가능) ---------- */

// table: 2차원 배열(첫 행 머리글). 반환: {rows:[[구분,주문일,주문번호,상품명,수량,금액,상태]...]} 또는 {error}
function mapTable(table, src) {
  // 머리글 행: 앞쪽 10행 중 키워드가 가장 많이 맞는 행
  let hRow = -1, best = 0;
  for (let i = 0; i < Math.min(10, table.length); i++) {
    const score = Object.keys(COLS).filter(k => findCol_(table[i], COLS[k]) >= 0).length;
    if (score > best) { best = score; hRow = i; }
  }
  if (hRow < 0) return { error: '머리글을 찾지 못함' };
  const h = table[hRow];
  const idx = {};
  Object.keys(COLS).forEach(k => idx[k] = findCol_(h, COLS[k]));
  const missing = ['date', 'name', 'amount'].filter(k => idx[k] < 0);
  if (missing.length) return { error: '필수 열 없음: ' + missing.join(',') + ' / 머리글=' + h.join('|') };

  const rows = [];
  for (let i = hRow + 1; i < table.length; i++) {
    const r = table[i];
    const d = toDate_(r[idx.date]);
    const name = String(r[idx.name] == null ? '' : r[idx.name]).trim();
    const amt = toNum_(r[idx.amount]);
    if (!d || !name || amt === null) continue;   // 합계행·빈행 제외
    rows.push([
      src, d,
      idx.order >= 0 ? String(r[idx.order]).trim() : '',
      name,
      idx.qty >= 0 ? (toNum_(r[idx.qty]) ?? '') : '',
      amt,
      idx.status >= 0 ? String(r[idx.status]).trim() : '',
    ]);
  }
  return { rows };
}

function findCol_(header, words) {
  const hs = header.map(x => String(x).replace(/\s+/g, '').toLowerCase());
  for (const w of words) {
    const j = hs.findIndex(x => x === w.toLowerCase());
    if (j >= 0) return j;
  }
  for (const w of words) {
    const j = hs.findIndex(x => x.includes(w.toLowerCase()));
    if (j >= 0) return j;
  }
  return -1;
}

// 날짜 → 'yyyy-MM-dd' 문자열. Date 객체를 시트에 직접 쓰면 스크립트/시트 시간대 차이로 하루 밀릴 수 있어 문자열로 씀
function toDate_(v) {
  if (v instanceof Date && !isNaN(v)) return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const m = String(v || '').match(/(\d{4})\D{1,3}(\d{1,2})\D{1,3}(\d{1,2})/);
  if (!m) return null;
  return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;
}

function toNum_(v) {
  if (typeof v === 'number') return v;
  const s = String(v == null ? '' : v).replace(/[^\d.-]/g, '');
  if (s === '' || s === '-' || isNaN(+s)) return null;
  return +s;
}

function rowKey_(r) {
  // 주문번호가 있으면 키에 포함 (같은 날 같은 상품·금액을 다른 주문으로 산 경우 구분)
  return [String(r[0]).trim(), toDate_(r[1]) || '', String(r[2] || '').trim(), String(r[3]).trim(), toNum_(r[5])].join('|');
}

function toast_(msg) {
  try { saleSs_().toast(msg, '가계부', 8); } catch (e) {}
}

/* ---------- 구매내역관리 행 수 (고정 상한 없음) ----------
 * 예전에는 5~1000행 고정이었음. 이제 데이터 마지막 행까지 읽고, 쓸 때 모자라면 행·수식·서식·드롭다운을 늘림.
 * 첫 실행 때 옛 수식($A$5:$A$1000처럼 1000행에 묶인 범위)을 열 끝까지($A$5:$A)로 바꿈.
 * 이 두 함수는 알림수집기.gs에 같은 코드가 buy만 달리 있음 → 한쪽을 고치면 다른 쪽도.
 */
function buyLast_(sh, F) {
  const m = sh.getMaxRows();
  if (m < F) return F - 1;
  const v = sh.getRange(F, 1, m - F + 1, 4).getValues();   // A~D
  for (let i = v.length - 1; i >= 0; i--) if (String(v[i][0]).trim() !== '' || String(v[i][3]).trim() !== '') return F + i;
  return F - 1;
}
/** 대시보드용 (2026-11-16 속도): 줄 끝 찾기와 A~J 표시값을 한 번에 읽음 → {n, disp}. 예전엔 A~D 값(끝까지) + A~J 표시값(n줄) 두 번 */
function buyRead_(sh, F) {
  return memo_('buyRead', () => {
    const m = sh.getMaxRows();
    if (m < F) return { n: 1, disp: [] };
    const d = sh.getRange(F, 1, m - F + 1, 10).getDisplayValues();
    let i = d.length - 1;
    while (i >= 0 && String(d[i][0]).trim() === '' && String(d[i][3]).trim() === '') i--;
    const n = Math.max(i + 1, 1);
    return { n, disp: d.slice(0, n) };
  });
}
function buyEnsure_(sh, F, needLast) {
  const fix = f => String(f).replace(/(\$[A-Z]+\$\d+:\$[A-Z]+)\$1000\b/g, '$1');
  const m0 = sh.getMaxRows();
  // 1) 옛 1000행 고정 수식 → 열 끝까지 (L열 중복체크, N~R 월별 합계)
  if (/\$1000\b/.test(sh.getRange(F, 12).getFormula())) {
    const lr = sh.getRange(F, 12, m0 - F + 1, 1), lf = lr.getFormulas();
    if (lf.every(r => r[0] !== '')) lr.setFormulas(lf.map(r => [fix(r[0])]));
    else lf.forEach((r, i) => { if (r[0]) sh.getRange(F + i, 12).setFormula(fix(r[0])); });
    const nv = sh.getRange(F, 14, m0 - F + 1, 1).getValues();
    let k = 0; while (k < nv.length && String(nv[k][0]).trim() !== '') k++;
    if (k) {
      const rr = sh.getRange(F, 15, k, 4), rf = rr.getFormulas();
      if (rf.every(r => r.every(c => c !== ''))) rr.setFormulas(rf.map(r => r.map(fix)));
    }
  }
  // 2) needLast 행까지 수식(H·I·L)·서식·드롭다운이 있게 (여유 200행)
  const hf = sh.getRange(F, 8, m0 - F + 1, 1).getFormulas();
  let formLast = F - 1;
  for (let i = hf.length - 1; i >= 0; i--) if (hf[i][0]) { formLast = F + i; break; }
  if (formLast < F || needLast <= formLast) return;
  const target = needLast + 200;
  if (target > m0) sh.insertRowsAfter(m0, target - m0);
  const cnt = target - formLast, src = sh.getRange(formLast, 1, 1, 12), dst = sh.getRange(formLast + 1, 1, cnt, 12);
  src.copyTo(dst, SpreadsheetApp.CopyPasteType.PASTE_FORMAT, false);
  src.copyTo(dst, SpreadsheetApp.CopyPasteType.PASTE_DATA_VALIDATION, false);
  [8, 9, 12].forEach(c => sh.getRange(formLast, c).copyTo(sh.getRange(formLast + 1, c, cnt, 1), SpreadsheetApp.CopyPasteType.PASTE_FORMULA, false));
}
