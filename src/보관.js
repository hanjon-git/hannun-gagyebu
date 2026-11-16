/**
 * 보관.gs (판매용) — 오래된 기록을 숨김 '보관' 탭으로 옮겨 대시보드 속도를 일정하게 (2026-11-13)
 *  매일 정리(saleDaily) 때: 이번 달 포함 최근 ARCHIVE.KEEP개월보다 오래된 줄을 옮김
 *   구매내역관리(B열 주문일) → '보관_구매' · 알림원본(A열 수신시각) → '보관_알림'
 *  옮긴 줄은 원래 탭에서 지움(값은 보관 탭에 그대로). 직접입력은 줄 번호가 대시보드 행 번호라서 옮기지 않음(양이 적음)
 *  대시보드·분석은 원래 탭만 읽음 → 13개월보다 오래된 달은 대시보드에 안 보임
 */
const ARCHIVE = { KEEP: 13, BUY: '보관_구매', NOTI: '보관_알림' };

/** 남길 첫 달 'yyyy-MM' (순수) — 예: 2026-11, 13개월 → 2025-11 */
function archiveCutoff_(today, keep) {
  const y = +today.slice(0, 4), m = +today.slice(5, 7) - (keep - 1);
  const d = new Date(Date.UTC(y, m - 1, 1));
  return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0');
}
/** 옮길 줄 번호(0부터) 묶음 [[시작, 개수], …] 아래쪽부터 (순수). dates = 각 줄의 'yyyy-MM-dd'(없으면 '') */
function archiveRuns_(dates, cutoff) {
  const runs = [];
  let s = -1;
  for (let i = 0; i <= dates.length; i++) {
    const old = i < dates.length && dates[i] && dates[i].slice(0, 7) < cutoff;
    if (old && s < 0) s = i;
    if (!old && s >= 0) { runs.push([s, i - s]); s = -1; }
  }
  return runs.reverse();
}

function saleArchive_(ss, tz) {
  const today = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  const cutoff = archiveCutoff_(today, ARCHIVE.KEEP);
  let moved = 0;
  // 구매내역관리: 5행부터, A~K 값(H·I·L은 수식이라 값으로만 보관)
  const buy = ss.getSheetByName(CFG.SHEET);
  if (buy) {
    const F = CFG.FIRST_ROW, last = buyLast_(buy, F);
    if (last >= F) {
      const v = buy.getRange(F, 1, last - F + 1, 11).getValues();
      const dates = v.map(r => { const d = toDate_(r[1]); return d && r[0] ? d : ''; });
      moved += archiveMove_(ss, buy, F, v, dates, cutoff, ARCHIVE.BUY, ['구분', '주문일', '주문번호', '상품명', '수량', '결제금액', '상태', '반영금액', '월키', '분류', '메모']);
    }
  }
  // 알림원본: 2행부터, A~P
  const noti = ss.getSheetByName(LEDGER.NOTI);
  if (noti && noti.getLastRow() >= 2) {
    const n = noti.getLastRow() - 1, w = Math.max(noti.getLastColumn(), 9);
    const v = noti.getRange(2, 1, n, w).getValues();
    const dates = v.map(r => { const s = r[0] instanceof Date ? Utilities.formatDate(r[0], tz, 'yyyy-MM-dd') : String(r[0]).slice(0, 10); return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : ''; });
    moved += archiveMove_(ss, noti, 2, v, dates, cutoff, ARCHIVE.NOTI, noti.getRange(1, 1, 1, w).getValues()[0]);
  }
  return moved;
}
function archiveMove_(ss, sh, first, v, dates, cutoff, tabName, head) {
  const runs = archiveRuns_(dates, cutoff);
  if (!runs.length) return 0;
  let ar = ss.getSheetByName(tabName);
  if (!ar) {
    ar = ss.insertSheet(tabName);
    ar.getRange(1, 1, 1, head.length).setValues([head]).setFontWeight('bold');
    ar.setFrozenRows(1);
    if (typeof hideTab_ === 'function') hideTab_(ar);
  }
  const rows = [];
  runs.slice().reverse().forEach(([s, n]) => { for (let i = s; i < s + n; i++) rows.push(v[i].slice(0, head.length)); });
  ar.getRange(ar.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
  runs.forEach(([s, n]) => sh.deleteRows(first + s, n));   // 아래쪽 묶음부터 지워서 위쪽 줄 번호가 안 밀림
  return rows.length;
}
