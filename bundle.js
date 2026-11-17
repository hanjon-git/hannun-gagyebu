// 한눈가계부 번들 build 9 · 껍데기 1+ · 파일 16개 (가계부.js, 계좌.js, 계획.js, 계획탭.js, 구매내역가져오기.js, 대시보드.js, 버전.js, 보관.js, 설정.js, 소비분석.js, 수입.js, 수집.js, 시작하기.js, 점검.js, 정기결제.js, 판매.js) · HTML 1개
var __HN_HTML = {"dashboard":"<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n<base target=\"_top\">\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n<script>   /* 폰트: 브라우저에 저장해 둔 내장 Pretendard가 있으면 바로 씀 (없으면 화면을 그린 뒤 받아서 저장) */\n  var FONT_KEY = 'dashFont_v1', FONT_OK = false;\n  try { var fc = localStorage.getItem(FONT_KEY); if (fc) { var fs = document.createElement('style'); fs.textContent = fc; document.head.appendChild(fs); FONT_OK = true; } } catch (e) {}\n</script>\n<script src=\"https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.js\"></script>\n<style>\n  :root{\n    --bg:#F4F5F7; --card:#FFFFFF; --ink:#191F28; --sub:#6B7684; --line:#E5E8EB; --soft:#F2F4F6;\n    --navy:#1F3864; --accent:#3182F6; --orange:#E8590C; --gray:#8B95A1; --green:#2F9E44;\n  }\n  *{box-sizing:border-box}\n  html,body{margin:0;background:var(--bg);color:var(--ink);\n    font-family:PretendardEmbed,Pretendard,-apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Malgun Gothic','Noto Sans KR','Noto Sans CJK KR',sans-serif;\n    font-size:0.875rem;-webkit-font-smoothing:antialiased}\n  .wrap{max-width:1240px;margin:0 auto;padding:1.25rem 1.25rem 2.5rem}\n  header{display:flex;align-items:flex-end;justify-content:space-between;gap:0.75rem;flex-wrap:wrap;margin-bottom:0.875rem}\n  h1{font-size:1.375rem;margin:0;letter-spacing:-.3px}\n  .smp{display:inline-block;margin-left:0.5rem;padding:0.125rem 0.5rem;border-radius:999px;background:#E8EAED;color:#5F6368;font-size:0.75rem;font-weight:700;vertical-align:middle;letter-spacing:0}\n  .smp[hidden]{display:none}   /* display:inline-block이 hidden 속성을 이기지 않게 (2026-11-17: 실제 기록이 있어도 '예시'가 보이던 문제) */\n  .stamp{color:var(--sub);font-size:0.75rem;margin-top:0.25rem}\n  .actions{display:flex;gap:0.5rem}\n  .btn{border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:0.625rem;padding:0.5rem 0.75rem;font:inherit;font-size:0.8125rem;cursor:pointer;text-decoration:none}\n  .btn:hover{background:var(--soft)}\n  .filters{display:flex;gap:0.5rem;flex-wrap:nowrap;align-items:center;margin-bottom:0.875rem}\n  .filters .seg{flex:none;height:2.25rem;align-items:center;flex-wrap:nowrap}\n  .filters .seg button{height:1.875rem;padding:0 0.6875rem;white-space:nowrap}\n  #fCat{flex:1 1 auto;min-width:0;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;\n    -webkit-mask-image:linear-gradient(90deg,#000 88%,transparent);mask-image:linear-gradient(90deg,#000 88%,transparent)}\n  #fCat::-webkit-scrollbar{display:none}\n  #fCat.end{-webkit-mask-image:none;mask-image:none}\n  #fCat button{flex:none}\n  #fCat.drag{cursor:grabbing;user-select:none}\n  @media (hover:hover){#fCat{cursor:grab}}\n  .psel-wrap.srcsel{display:none}\n  .seg{display:inline-flex;background:#E9ECEF;border-radius:0.625rem;padding:0.1875rem;gap:2px;flex-wrap:wrap}\n  .seg button{border:0;background:transparent;font:inherit;font-size:0.8125rem;padding:0.375rem 0.6875rem;border-radius:0.5rem;color:#4E5968;cursor:pointer}\n  .seg button.on{background:var(--card);color:var(--ink);font-weight:700;box-shadow:0 1px 2px rgba(0,0,0,.08)}\n  .lbl{font-size:0.75rem;color:var(--sub);margin-right:0.375rem}\n  .psel-wrap{position:relative;display:inline-flex}\n  .psel{appearance:none;-webkit-appearance:none;border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:0.625rem;height:2.25rem;padding:0 2.125rem 0 0.875rem;font:inherit;font-size:0.8125rem;font-weight:700;cursor:pointer}\n  .psel:hover{background:var(--soft)}\n  .psel-wrap:after{content:'';position:absolute;right:0.875rem;top:50%;width:0.375rem;height:0.375rem;margin-top:-5px;border-right:2px solid var(--sub);border-bottom:2px solid var(--sub);transform:rotate(45deg);pointer-events:none}\n  .pbar{display:flex;flex-wrap:wrap;gap:0.5rem 0.625rem;align-items:center;width:100%}\n  .nav{display:inline-flex;align-items:center;gap:2px;background:var(--card);border:1px solid var(--line);border-radius:0.625rem;padding:2px;height:2.25rem;box-sizing:border-box}\n  .nb{border:0;background:transparent;font-size:1.0625rem;line-height:1;width:2rem;height:1.875rem;cursor:pointer;border-radius:0.5rem;color:var(--ink)}\n  .nb:hover{background:var(--soft)}.nb:disabled{opacity:.25;cursor:default;background:transparent}\n  .cal{position:relative}\n  .calbtn{display:inline-flex;align-items:center;gap:0.5rem;border:0;background:transparent;height:1.875rem;padding:0 0.625rem;border-radius:0.5rem;font:inherit;font-size:0.8125rem;font-weight:700;color:var(--ink);cursor:pointer;font-variant-numeric:tabular-nums;min-width:9.375rem;justify-content:center}\n  .calbtn:hover{background:var(--soft)}\n  .ico{position:relative;width:0.875rem;height:0.8125rem;border:1.6px solid var(--sub);border-top-width:0.25rem;border-radius:0.1875rem;box-sizing:border-box;flex:none}\n  .pop{position:absolute;top:2.625rem;left:50%;transform:translateX(-50%);z-index:20;width:17.5rem;background:var(--card);border:1px solid var(--line);border-radius:0.875rem;box-shadow:0 0.5rem 1.5rem rgba(0,0,0,.12);padding:0.75rem}\n  .pop .ph{display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem}\n  .pop .ph b{font-size:0.875rem}\n  .mg{display:grid;grid-template-columns:repeat(4,1fr);gap:0.25rem}\n  .mc{border:0;background:transparent;height:2.375rem;border-radius:0.5625rem;font:inherit;font-size:0.8125rem;color:var(--ink);cursor:pointer}\n  .mc:hover{background:var(--soft)}\n  .mc.in{background:#EBF4FF;color:#1C7ED6;font-weight:700}\n  .mc.on{background:#1F3864;color:#fff;font-weight:700}\n  .mc:disabled{color:#C9CDD2;cursor:default;background:transparent}\n  .pf{margin-top:0.625rem;font-size:0.75rem;color:var(--sub);text-align:center}\n  .g-row{display:flex;justify-content:space-between;align-items:center;gap:0.5rem}\n  .g-k{font-size:0.8125rem;color:var(--sub);display:inline-flex;align-items:center;gap:0.25rem}\n  .g-k b{color:var(--ink)}\n  .pill{font-size:0.6875rem;font-weight:700;padding:2px 0.5rem;border-radius:999px;white-space:nowrap}\n  .pill.ok{background:#EBFBEE;color:#2F9E44}.pill.warn{background:#FFF4E6;color:#E8590C}.pill.over{background:#FFF5F5;color:#E03131}\n  .edit{border:0;background:transparent;color:var(--gray);cursor:pointer;font-size:0.8125rem;padding:2px 0.25rem;border-radius:0.375rem}\n  .edit:hover{background:var(--soft);color:var(--ink)}\n  .gbar{position:relative;height:0.5rem;background:var(--soft);border-radius:0.25rem;margin:0.5rem 0 2px}\n  .gbar .fill{height:100%;border-radius:0.25rem}\n  .gbar .today{position:absolute;top:-3px;width:2px;height:0.875rem;background:var(--ink);opacity:.6}\n  .gbar .today span{position:absolute;top:0.9375rem;left:50%;transform:translateX(-50%);font-size:0.625rem;color:var(--sub);white-space:nowrap}\n  .gp .gbar{margin-bottom:0.25rem}\n  .brow{display:grid;grid-template-columns:2.75rem 1fr;gap:0.25rem 0.625rem;align-items:center;margin-top:0.625rem}\n  .brow .lb{font-size:0.75rem;color:var(--sub);font-weight:600}\n  .brow .nums{display:flex;justify-content:space-between;align-items:baseline;font-variant-numeric:tabular-nums}\n  .brow .nums b{font-size:1.125rem;font-weight:800;letter-spacing:-.3px}.brow .nums span{font-size:0.75rem;color:var(--sub)}\n  .brow .gbar{grid-column:2;margin:0}\n  .brow .ft{grid-column:2;display:flex;justify-content:space-between;font-size:0.75rem;color:var(--sub);font-weight:600;margin-top:-2px}\n  .brow .gbar.in{height:1.375rem;border-radius:0.4375rem}.brow .gbar.in .fill{border-radius:0.4375rem}   /* 막대 안 % (2026-11-13) */\n  .gbar.in .tx{position:absolute;inset:0;display:flex;align-items:center;padding:0 0.5rem;font-size:0.75rem;font-weight:700;color:var(--ink);font-variant-numeric:tabular-nums;white-space:nowrap}\n  .gbar.in .tx.w{color:#fff}\n  .brow .infoln{grid-column:2;display:flex;justify-content:space-between;gap:0.5rem;font-size:0.75rem;color:var(--sub);font-weight:600;white-space:nowrap}\n  .ft .ok{color:#2F9E44}.ft .warn{color:#E8590C}.ft .over{color:#E03131}\n  .g-k small{font-size:0.6875rem;color:var(--sub);font-weight:500;margin-left:0.25rem}\n  .gauge{margin-bottom:0.75rem}\n  .k{font-size:0.75rem;color:var(--sub)}\n  .k i{font-style:normal;color:var(--gray)}\n  b.ok{color:#2F9E44}b.warn{color:#E8590C}b.over{color:#E03131}\n  .g-ends{display:flex;justify-content:space-between;align-items:flex-end;margin-top:0.375rem}\n  .g-ends>div{display:flex;flex-direction:column}\n  .g-ends b{font-size:1.25rem;font-weight:800;letter-spacing:-.4px;font-variant-numeric:tabular-nums}\n  .g-ends .r{text-align:right}\n  .dtitle{display:flex;justify-content:space-between;align-items:center}\n  .dtitle h2{margin-bottom:0}\n  .addbtn{flex:none;width:2rem;height:2rem;margin-bottom:0.5rem;border-radius:0.625rem;border:1px solid var(--line);background:var(--card);font-size:1.25rem;line-height:1;cursor:pointer;color:var(--ink)}\n  .apop{width:18rem}\n  .apop .row{display:flex;gap:0.375rem;margin-bottom:0.5rem}\n  .apop input[type=date]{flex:1.25}\n  .apop input{flex:1;min-width:0;border:1px solid var(--line);border-radius:0.625rem;padding:0.5rem 0.625rem;font:inherit;font-size:0.875rem}\n  .apop input.amt{text-align:right;font-weight:700}\n  .apop .more{border:1px dashed var(--line);border-radius:999px;padding:0.3125rem 0.5rem;font:inherit;font-size:0.75rem;color:var(--sub);background:var(--card)}\n  .apop .go{width:100%;margin-top:0.625rem;border:0;border-radius:0.625rem;background:var(--ink);color:#fff;padding:0.625rem;font:inherit;font-weight:700;cursor:pointer}\n  .apop .go:disabled{opacity:.5}\n  .apop .del{width:100%;margin-top:0.5rem;border:0;background:none;color:#E03131;font:inherit;font-size:0.75rem;cursor:pointer}\n  .t1{display:block;background:var(--card);border-radius:0.875rem;box-shadow:0 1px 2px rgba(0,0,0,.04)}\n  .t1 .gp{padding:0.75rem 1rem}\n  .pwarn{margin-top:0.625rem;padding-top:0.5rem;border-top:1px dashed var(--line);font-size:0.75rem;font-weight:700;color:#E8590C;cursor:pointer}\n  .t1 .sp{padding:0.625rem 1rem;border-left:1px solid var(--line);display:flex;flex-direction:column;justify-content:center;gap:0.25rem}\n  .sr{display:flex;justify-content:space-between;align-items:baseline;gap:0.5rem}\n  .sr b{font-size:0.9375rem;font-variant-numeric:tabular-nums;white-space:nowrap}\n  .limin{width:6rem;height:1.5rem;border:1px solid var(--line);border-radius:0.375rem;padding:0 0.375rem;font:inherit;font-size:0.8125rem;font-weight:700;text-align:right}\n  .pl-row{cursor:pointer;border-top:1px solid var(--line);padding-top:0.375rem;margin-top:2px}\n  .pl-row b{font-size:0.8125rem}.pl-row b.warn{color:#E8590C}\n  .tscr{overflow:visible}\n  /* 내역 (2026-11-13): 높이 제한 없이 끝까지. 열 폭은 비율 고정(금액이 잘리지 않게), 최신순이면 날짜별로 끊고 머리줄에 건수·합계 */\n  .tscr table{table-layout:fixed}\n  .tscr td{overflow-wrap:anywhere}\n  .tscr tr.dg td{background:var(--soft);font-weight:700;font-size:0.8125rem;padding:0.5rem 0.625rem;border-bottom:0}\n  .tscr tr.dg td span{float:right;font-weight:500;color:var(--sub);font-size:0.75rem}\n  .tscr thead th{position:sticky;top:0;background:var(--card);z-index:1}\n  .pv .pvh{display:flex;justify-content:space-between;align-items:center;gap:0.5rem}\n  .pv .pvh h2{margin:0}.pv .pvh .st{font-size:0.8125rem;color:var(--sub)}.pv .pvh .st b{color:#E8590C}\n  .pt{width:100%;border-collapse:collapse;margin-top:0.625rem;font-size:0.8125rem}\n  .pt th{font-size:0.75rem;color:var(--sub);font-weight:600;text-align:right;padding:0.375rem;border-bottom:1px solid var(--line)}\n  .pt th:first-child,.pt td:first-child{text-align:left}\n  .pt td{padding:0.4375rem 0.375rem;border-bottom:1px solid var(--soft);text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}\n  .pt td:first-child{white-space:normal}\n  .pt .grp td{background:var(--soft);font-weight:700;color:#333D4B;text-align:left;font-size:0.75rem}\n  .pt .dd{color:var(--sub);font-size:0.75rem}\n  .pt tfoot td{font-weight:700;border-top:1px solid var(--line);border-bottom:0}\n  .s-ok{color:#2F9E44;font-weight:700}.s-over{color:#E8590C;font-weight:700}.s-under{color:#2F9E44}.s-wait{color:#ADB5BD}\n  .pm{display:none;font-size:0.6875rem;color:var(--sub)}\n  .tagbtn{border:0;cursor:pointer;font:inherit}\n  .tagbtn:after{content:' ▾';font-size:0.5625rem;opacity:.6}\n  .cpop{position:absolute;z-index:30;width:15.75rem;background:var(--card);border:1px solid var(--line);border-radius:0.875rem;box-shadow:0 0.5rem 1.5rem rgba(0,0,0,.14);padding:0.75rem}\n  .ckn{color:#E8590C;font-weight:800}\n  #chkSheet ~ .cpop,.cpop{z-index:60}\n  .ckt{width:100%;border-collapse:collapse;font-size:0.875rem}.ckt td{padding:0.5rem 0.25rem 0.25rem}.ckt td.d{color:var(--sub);font-size:0.75rem;white-space:nowrap}.ckt td.n{text-align:right;font-variant-numeric:tabular-nums}\n  .ckt tr.a td{padding:0 0.25rem 0.625rem;border-bottom:1px solid var(--soft)}.ckt tr.a td:last-child{text-align:right}.ckt .tag{margin-left:0.375rem}.ckno{background:var(--soft);color:var(--sub);border:0;cursor:pointer;font:inherit}\n  .cpop .t{font-size:0.75rem;color:var(--sub);margin-bottom:0.5rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n  .cpop .cg{display:flex;flex-wrap:wrap;gap:0.375rem}\n  .cpop .exb{display:block;width:100%;margin-top:0.625rem;border:0;border-top:1px solid var(--line);background:transparent;padding:0.5rem 0 0;font:inherit;font-size:0.75rem;color:#E03131;text-align:left;cursor:pointer}\n  .cpop .cg button{border:1px solid var(--line);background:var(--card);border-radius:999px;padding:0.3125rem 0.625rem;font:inherit;font-size:0.75rem;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:0.3125rem}\n  .cpop .cg button.on{border-color:var(--ink);background:var(--soft)}\n  .cpop label{display:flex;align-items:center;gap:0.375rem;font-size:0.75rem;color:#4E5968;margin-top:0.625rem;cursor:pointer}\n  .toast{position:fixed;left:50%;bottom:1.5rem;transform:translateX(-50%);background:#191F28;color:#fff;font-size:0.8125rem;padding:0.625rem 1rem;border-radius:0.625rem;z-index:40}\n  .up{color:#E03131;font-weight:700}.down{color:#1971C2;font-weight:700}\n  .grid{display:grid;grid-template-columns:repeat(12,1fr);gap:0.75rem}\n  .card{background:var(--card);border-radius:0.875rem;padding:1rem;box-shadow:0 1px 2px rgba(0,0,0,.04);min-width:0}\n  .card h2{font-size:0.9375rem;margin:0 0 2px}\n  .card .hint{font-size:0.75rem;color:var(--sub);margin-bottom:0.625rem}\n  /* 탭 (2026-11-13): 요약은 위에 고정, 아래는 달력·분석·내역·계획 중 하나만 */\n  .tabs{position:sticky;top:0;z-index:15;display:flex;gap:0.375rem;background:var(--bg);margin:0 -1.25rem;padding:0.625rem 1.25rem}\n  .tabs button{flex:1;border:1px solid var(--line);background:var(--card);border-radius:0.625rem;height:2.375rem;font:inherit;font-size:0.875rem;font-weight:600;color:var(--sub);cursor:pointer}\n  .tabs button.on{background:var(--ink);color:#fff;border-color:var(--ink)}\n  .grid:not([data-show=\"달력\"]) [data-tab=\"달력\"],.grid:not([data-show=\"분석\"]) [data-tab=\"분석\"],.grid:not([data-show=\"내역\"]) [data-tab=\"내역\"],.grid:not([data-show=\"계획\"]) [data-tab=\"계획\"],.grid:not([data-show=\"자산\"]) [data-tab=\"자산\"]{display:none!important}\n  .asn{font-size:1.75rem;font-weight:800;font-variant-numeric:tabular-nums;margin:0.125rem 0 0.75rem}\n  .asbar{display:flex;height:0.625rem;border-radius:0.375rem;overflow:hidden;background:var(--soft)}\n  .asr{display:flex;justify-content:space-between;align-items:center;margin-top:0.5rem;font-size:0.875rem}\n  .asr b{font-variant-numeric:tabular-nums}\n  .ast{width:100%;border-collapse:collapse;font-size:0.875rem}\n  .ast td{padding:0.625rem 0.25rem;border-bottom:1px solid var(--line)}\n  .ast td.n{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}\n  .ast tr.g td{background:var(--soft);font-weight:700;font-size:0.8125rem;padding:0.5rem 0.625rem}\n  .ast .s{font-size:0.6875rem;color:var(--sub);margin-left:0.25rem}\n  .ast .neg,.asr .neg{color:#E8344E}\n  .asr .dot{display:inline-block;margin-right:0.375rem}\n  tr.pe{cursor:pointer}\n  .was{color:var(--sub);text-decoration:line-through;font-size:0.6875rem;font-weight:400;line-height:1.2}\n  .mh{display:flex;justify-content:space-between;align-items:baseline;gap:0.5rem}.mh h2{margin:0;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mh span{color:var(--sub);font-size:0.8125rem;white-space:nowrap}\n  .ef{display:grid;grid-template-columns:5.5rem 1fr;gap:0.5rem 0.75rem;align-items:center;font-size:0.875rem;margin:0.75rem 0}.ef .l{color:var(--sub)}   /* 고치기 창 칸 (2026-11-16: .mf와 이름이 겹쳐 돈 흐름 카드가 두 칸으로 깨졌음) */\n  .ef input,.ef select{border:1px solid var(--line);border-radius:0.5rem;padding:0.5rem 0.625rem;font:inherit;font-size:0.9375rem;min-width:0;background:var(--card);color:inherit}.ef input.big{font-size:1.25rem;font-weight:800;text-align:right;font-variant-numeric:tabular-nums}\n  .ef .lock{color:var(--sub);font-variant-numeric:tabular-nums}\n  .mb{display:flex;gap:0.5rem}.mb button{flex:1;border:0;border-radius:0.625rem;padding:0.75rem;font:inherit;font-weight:700;cursor:pointer}.mb .go{background:#191F28;color:#fff}.mb .ex{background:var(--soft);color:#E8590C}.mb .rs{background:var(--soft);color:var(--sub)}.mb button:disabled{opacity:.5}\n  .bell{position:relative;width:2.25rem;padding:0;display:inline-flex;align-items:center;justify-content:center}.bell svg{width:1.125rem;height:1.125rem}\n  .bell i{position:absolute;top:-0.375rem;right:-0.375rem;min-width:1.125rem;height:1.125rem;border-radius:999px;background:#E8590C;color:#fff;font-size:0.6875rem;font-weight:700;font-style:normal;line-height:1.125rem;text-align:center;padding:0 0.25rem;box-sizing:border-box}\n  .nt{width:100%;border-collapse:collapse;font-size:0.875rem}.nt td{padding:0.75rem 0.25rem;border-bottom:1px solid var(--soft);cursor:pointer}.nt td.t{max-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.nt td.v{text-align:right;font-variant-numeric:tabular-nums;font-weight:700;white-space:nowrap;width:1%}\n  .nt .dot{display:inline-block;width:0.5rem;height:0.5rem;border-radius:50%;margin-right:0.5rem;vertical-align:middle}.nt tr.g td{color:var(--sub)}.nt tr.g td.v{font-weight:500}.nt td.c{color:#E8590C}.nt tr.nb1 td{border-bottom:0;padding-bottom:0.375rem}.nt tr.nb2 td{padding-top:0}.nbar{height:0.375rem;border-radius:999px;background:var(--line);overflow:hidden}.nbar i{display:block;height:100%;background:#E8590C;border-radius:999px}.nbl{display:flex;justify-content:space-between;margin-top:0.3125rem;font-size:0.75rem;color:var(--sub);font-variant-numeric:tabular-nums}\n  /* 달력 탭: 날짜별 합계, 누르면 그날 내역 (PC = 왼쪽 달력 · 오른쪽 내역) */\n  .calc .ch{display:flex;justify-content:space-between;align-items:center}\n  .calc .ch h2{margin:0}\n  .calc .cnav{border:0;background:transparent;font-size:1.125rem;color:var(--sub);width:2.125rem;height:1.875rem;border-radius:0.5rem;cursor:pointer}\n  .calc .cnav:hover{background:var(--soft)}.calc .cnav:disabled{opacity:.25;cursor:default;background:transparent}\n  .calc .csum{font-size:0.75rem;color:var(--sub);text-align:center;margin-top:2px}\n  .calc .cg7{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;margin-top:0.375rem}\n  .calc .wd{font-size:0.6875rem;color:var(--sub);text-align:center;padding:2px 0 0.25rem}\n  .calc .su{color:#E03131}.calc .sa{color:#3182F6}\n  .calc .cd{height:3rem;border:0;background:transparent;border-radius:0.5625rem;text-align:center;position:relative;padding:0.25rem 0 0;font:inherit;color:var(--ink);cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:flex-start}\n  .calc .cd:hover{background:var(--soft)}.calc .cd:disabled{cursor:default;background:transparent}\n  .calc .cd b{display:block;font-size:0.75rem;font-weight:600}\n  .calc .cd em{display:block;font-style:normal;font-size:0.5938rem;margin-top:0.25rem;letter-spacing:-.3px;font-variant-numeric:tabular-nums}\n  .calc .cd em.hi{color:#E8590C;font-weight:700}\n  .calc .cd.fu b{color:#C9CDD2}.calc .cd.td b{text-decoration:underline}\n  .calc .cd.sel{background:#EAF2FE;outline:1.5px solid var(--accent)}\n  .calc .cdot{position:absolute;top:0.375rem;left:calc(50% + 0.6875rem);width:0.3125rem;height:0.3125rem;border-radius:50%;background:var(--green)}\n  .calc .lg{display:flex;gap:0.75rem;font-size:0.6875rem;color:var(--sub);margin-top:0.5rem;flex-wrap:wrap}\n  .calc .lg i{display:inline-block;width:0.3125rem;height:0.3125rem;border-radius:50%;background:var(--green);margin-right:0.25rem;vertical-align:middle}\n  .calc .lg em{font-style:normal;color:#E8590C;font-weight:700}\n  .dl{margin-top:0.75rem;border-top:1px solid var(--line);padding-top:0.625rem}\n  .dl h3{font-size:0.875rem;margin:0 0 0.375rem}.dl h3 span{font-weight:500;color:var(--sub);font-size:0.75rem;margin-left:0.25rem}\n  .dr{display:grid;grid-template-columns:1fr auto;gap:2px 0.5rem;padding:0.4375rem 0;border-top:1px solid var(--soft);font-size:0.8125rem;align-items:center}\n  .dr .nm{min-width:0;overflow-wrap:anywhere}.dr .c{font-size:0.6875rem;color:var(--sub)}.dr .n{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}\n  .dr .cx{text-decoration:line-through;color:var(--gray)}\n  .dr .tag{margin-left:0.25rem}\n  .dsub{grid-column:1/-1;background:var(--soft);border-radius:0.5rem;padding:0.375rem 0.5625rem;display:grid;grid-template-columns:1fr auto;gap:0.25rem 0.5rem;font-size:0.75rem;align-items:center}\n  .dsub .n{text-align:right;font-variant-numeric:tabular-nums}\n  .dl .empty{padding:0.875rem 0}\n  .dt{table-layout:fixed;width:100%}.dt td{overflow-wrap:anywhere;font-size:0.8125rem}\n  /* 입금 (2026-11-13): 종류 태그는 칠한 배경 + 흰 글씨 (분류 태그와 구분), 달력 수입 = 초록 + */\n  .tag.inv{color:#fff!important}\n  .calc .cd em.in{color:#2F9E44;font-weight:700;margin-top:1px}\n  .amt-in{color:#2F9E44;font-weight:700}\n  .mf h2{margin:0 0 0.625rem}\n  .f3{display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem;margin-bottom:0.5rem}\n  .f3 div{background:var(--soft);border-radius:0.75rem;padding:0.625rem 0.75rem;min-width:0}\n  .f3 .k{font-size:0.75rem;color:var(--sub);font-weight:600}\n  .f3 b{display:block;font-size:1.0625rem;margin-top:0.125rem;font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden}\n  .f3 i{display:block;font-style:normal;font-size:0.6875rem;color:var(--sub);margin-top:0.125rem;white-space:nowrap}\n  .f3 .neg{color:#E03131}\n  .tl{width:100%;border-collapse:collapse;font-size:0.8125rem}\n  .tl td{padding:0.4375rem 0.25rem;border-top:1px solid var(--soft);border-bottom:0;vertical-align:middle}\n  .tl td.n{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}\n  .tl .c{font-size:0.6875rem;color:var(--sub)}\n  .sw{display:inline-flex;background:var(--soft);border-radius:0.625rem;padding:0.125rem;margin-left:0.5rem}\n  .sw button{border:0;background:transparent;font:inherit;font-size:0.8125rem;padding:0.3125rem 0.75rem;border-radius:0.5rem;color:var(--sub);cursor:pointer}\n  .sw button.on{background:var(--card);color:var(--ink);font-weight:700;box-shadow:0 1px 2px rgba(0,0,0,.08)}\n  .tp{position:absolute;z-index:40;width:16.5rem;background:var(--card);border:1px solid var(--line);border-radius:0.875rem;box-shadow:0 8px 24px rgba(0,0,0,.14);padding:0.75rem}\n  .tp .t{font-weight:700;font-size:0.8125rem;margin-bottom:0.375rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n  .tp .r{display:flex;align-items:center;gap:0.5rem;padding:0.4375rem 0.25rem;border-radius:0.5rem;font-size:0.8125rem;cursor:pointer}\n  .tp .r:hover{background:var(--soft)}.tp .r.on{background:#EAF2FE;font-weight:700}\n  .tp .r .m{margin-left:auto;font-size:0.6875rem;color:var(--sub)}\n  .tp .r .x{border:0;background:transparent;color:var(--gray);font-size:0.875rem;width:1.25rem;cursor:pointer}\n  .tp .add{display:flex;gap:0.375rem;margin-top:0.5rem;border-top:1px solid var(--line);padding-top:0.5rem}\n  .tp .add input{flex:1;min-width:0;border:1px solid var(--line);border-radius:0.5rem;padding:0.375rem 0.5rem;font:inherit;font-size:0.8125rem}\n  .tp .add select{border:1px solid var(--line);border-radius:0.5rem;font:inherit;font-size:0.75rem;padding:0 0.25rem;background:var(--card)}\n  .tp .add button{border:0;background:var(--ink);color:#fff;border-radius:0.5rem;font:inherit;font-size:0.75rem;padding:0 0.625rem;cursor:pointer}\n  /* 영수증 (2026-11-13): 사진 → 읽은 결과 확인 창(아래에서 올라옴) → 저장 */\n  .camb{flex:none;width:2rem;height:2rem;margin-bottom:0.5rem;border-radius:0.625rem;border:1px solid var(--line);background:var(--card);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;padding:0}\n  .camb:hover{background:var(--soft)}\n  .cpop.camp{width:11rem;padding:0.375rem}.camp button{display:block;width:100%;text-align:left;border:0;background:transparent;font:inherit;font-size:0.875rem;padding:0.625rem 0.75rem;border-radius:0.5rem;cursor:pointer;color:var(--ink)}\n  .camp button+button{border-top:1px solid var(--line);border-radius:0}.camp button:hover{background:var(--soft)}\n  .rdim{position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:48}\n  .rsheet{position:fixed;left:50%;transform:translateX(-50%);width:min(36rem,100%);bottom:0;z-index:49;background:var(--card);border-radius:1rem 1rem 0 0;box-shadow:0 -8px 24px rgba(0,0,0,.18);padding:1rem 1rem 1.25rem;max-height:88vh;overflow:auto;box-sizing:border-box}\n  .rsheet .rh{display:flex;gap:0.375rem;align-items:center;margin-bottom:0.375rem}\n  .rsheet .rh input{border:1px solid var(--line);border-radius:0.5rem;padding:0.375rem 0.5rem;font:inherit;font-size:0.875rem;min-width:0}\n  .rsheet .rh #rcStore{flex:1;font-weight:700}\n  .rsheet select{width:100%;border:1px solid var(--line);border-radius:0.5rem;padding:0.375rem 0.5rem;font:inherit;font-size:0.8125rem;background:var(--card);margin-bottom:0.625rem}\n  .rsheet .chk{display:grid;grid-template-columns:repeat(3,1fr);gap:0.375rem;margin-bottom:0.375rem}\n  .rsheet .chk div{background:var(--soft);border-radius:0.625rem;padding:0.5rem 0.625rem;min-width:0}\n  .rsheet .chk span{display:block;font-size:0.6875rem;color:var(--sub)}.rsheet .chk b,.rsheet .chk input{font-size:0.9375rem;font-weight:700;font-variant-numeric:tabular-nums}\n  .rsheet .chk input{width:100%;border:0;background:transparent;padding:0;font-family:inherit;color:var(--ink)}\n  .rsheet .st{font-size:0.8125rem;font-weight:700;margin:0 0 0.375rem}.rsheet .st.ok{color:#2F9E44}.rsheet .st.no{color:#E8590C}\n  .rsheet td.tap{cursor:pointer}.rsheet td.tap:hover{background:var(--soft)}.rsheet .ph{color:var(--gray)}\n  .tsw{position:relative;display:inline-block;max-width:100%}\n  .tsw:after{content:'▾';position:absolute;right:0.375rem;top:50%;transform:translateY(-50%);font-size:0.5625rem;pointer-events:none;opacity:.6}\n  .rsheet select.tagsel{appearance:none;-webkit-appearance:none;width:auto;border:0;margin:0;border-radius:0.375rem;font:inherit;font-size:0.6875rem;font-weight:700;line-height:1.4;padding:0.125rem 1.125rem 0.125rem 0.375rem;cursor:pointer;max-width:100%}\n  .rask{position:fixed;left:50%;top:30%;transform:translateX(-50%);width:min(20rem,calc(100% - 2rem));z-index:59;background:var(--card);border-radius:1rem;box-shadow:0 12px 32px rgba(0,0,0,.2);padding:1rem;box-sizing:border-box}\n  .rask .t{font-weight:700;font-size:0.9375rem;margin-bottom:0.5rem}\n  .rask #raIn{width:100%;box-sizing:border-box;border:1px solid var(--line);border-radius:0.625rem;padding:0.625rem 0.75rem;font:inherit;font-size:1rem}\n  .rask .neg{display:flex;align-items:center;gap:0.375rem;font-size:0.8125rem;color:var(--sub);margin-top:0.5rem}\n  .rask .bb{display:flex;gap:0.5rem;margin-top:0.875rem}.rask .bb button{flex:1;height:2.5rem;border-radius:0.625rem;border:1px solid var(--line);background:var(--card);font:inherit;font-size:0.875rem;font-weight:700;cursor:pointer}\n  .rask .bb .ok{background:var(--ink);color:#fff;border-color:var(--ink)}.rask .bb .del{color:#E03131}\n  .rsheet tr.ri{cursor:pointer}.rsheet tr.ri:hover td{background:var(--soft)}\n  .rsheet .ed td{background:#F7F9FC}\n  .rsheet .ed .row{display:flex;gap:0.375rem;margin:0.25rem 0}.rsheet .ed input,.rsheet .ed select{border:1px solid var(--line);border-radius:0.5rem;padding:0.375rem 0.5rem;font:inherit;font-size:0.8125rem;min-width:0;margin:0;background:var(--card)}\n  .rsheet .ed .nm{flex:1}.rsheet .ed .am{width:6.5rem;text-align:right}.rsheet .ed select{width:auto;flex:1}\n  .rsheet .ed button{border:1px solid var(--line);background:var(--card);border-radius:0.5rem;font:inherit;font-size:0.75rem;padding:0 0.75rem;cursor:pointer}\n  .rsheet .addit{border:1px dashed var(--line);background:transparent;border-radius:0.625rem;width:100%;padding:0.5rem;font:inherit;font-size:0.8125rem;color:var(--sub);margin-top:0.5rem;cursor:pointer}\n  .rsheet .btns{display:flex;gap:0.5rem;margin-top:0.875rem}.rsheet .btns button{flex:1;height:2.75rem;border-radius:0.75rem;font:inherit;font-size:0.9375rem;font-weight:700;border:1px solid var(--line);background:var(--card);cursor:pointer}\n  .rsheet .btns .go{background:var(--ink);color:#fff;border-color:var(--ink)}.rsheet .btns button:disabled{opacity:.5}\n  .rsheet .wait{padding:2rem 0;text-align:center;color:var(--sub);font-size:0.875rem}\n  .srcl{white-space:nowrap;font-size:0.6875rem;color:var(--sub);margin-left:0.25rem}\n  @media (min-width:900px){\n    .calc.pc2{display:grid;grid-template-columns:1.15fr 1fr;gap:0 1.75rem;align-items:start}\n    .calc.pc2 .dl{margin-top:0;border-top:0;padding-top:0;border-left:1px solid var(--line);padding-left:1.5rem;align-self:stretch}\n    .calc .cd{height:4.125rem;padding-top:0.4375rem}.calc .cd b{font-size:0.8125rem}.calc .cd em{font-size:0.6875rem;margin-top:0.4375rem}\n  }\n  .c12{grid-column:span 12}.c7{grid-column:span 7}.c5{grid-column:span 5}.c6{grid-column:span 6}\n  .chart{position:relative;height:18.75rem}\n  .chart.sm{height:12.5rem}\n  .catwrap{display:grid;grid-template-columns:11.25rem 1fr;gap:0.875rem;align-items:center}\n  .donut{position:relative;height:11.25rem}\n  .donut .mid{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none}\n  .donut .mid b{font-size:1rem}.donut .mid span{font-size:0.6875rem;color:var(--sub)}\n  .catlist{display:flex;flex-direction:column;gap:2px}\n  .cat{display:grid;grid-template-columns:0.75rem 1fr auto 3.25rem;gap:0.5rem;align-items:center;padding:0.375rem 0.5rem;border-radius:0.5rem;cursor:pointer}\n  .cat:hover,.cat.on{background:var(--soft)}\n  .dot{width:0.625rem;height:0.625rem;border-radius:50%}\n  .cat .nm{font-weight:600}\n  .cat .am{font-variant-numeric:tabular-nums}\n  .cat .sh{color:var(--sub);text-align:right;font-size:0.75rem}\n  /* 분석: 직전 같은 기간 비교 (2026-11-16 사용자 C) */\n  .cmp .r1{display:flex;align-items:center;gap:0.5rem;font-size:0.8125rem;color:var(--sub);flex-wrap:wrap}.cmp .r1 b{color:var(--ink);font-size:0.9375rem}\n  .cmp .r1 .pill{margin-left:auto;background:var(--soft);color:var(--sub)}\n  .cmp .r2{display:flex;align-items:baseline;gap:0.5rem;margin:0.5rem 0 0.75rem}.cmp .r2 .d{font-size:1.625rem;font-weight:800;font-variant-numeric:tabular-nums}.cmp .r2 .pc{font-size:0.9375rem}\n  .cmp .bl{display:grid;grid-template-columns:2.25rem 1fr 6rem;gap:0.5rem;align-items:center;font-size:0.8125rem;margin-top:0.375rem}\n  .cmp .bl .k{color:var(--sub)}.cmp .bl .v{text-align:right;font-variant-numeric:tabular-nums;font-weight:600}.cmp .bl .v.p{color:var(--sub);font-weight:500}\n  .cmp .bl .t,.cc .pb .t{height:0.5rem;background:var(--soft);border-radius:4px;overflow:hidden}.cmp .bl .t i,.cc .pb .t i{display:block;height:100%;border-radius:4px}\n  .cc h2{margin-bottom:0.75rem}.cc .lg{display:flex;gap:0.75rem;font-size:0.75rem;color:var(--sub);margin:0 0 0.5rem}.cc .lg i{display:inline-block;width:0.75rem;height:0.375rem;border-radius:3px;margin-right:0.25rem;vertical-align:middle}\n  .cc .row{padding:0.5rem 0;border-top:1px solid var(--line);cursor:pointer}.cc .row:first-of-type{border-top:0}\n  .cc .hd{display:flex;align-items:center;gap:0.5rem;font-weight:600;font-size:0.875rem}.cc .hd .dot{width:0.625rem;height:0.625rem;border-radius:50%;flex:none}.cc .hd .dd{margin-left:auto;font-variant-numeric:tabular-nums}\n  .cc .pb{display:grid;grid-template-columns:1fr 5.5rem;gap:0.5rem;align-items:center;font-size:0.75rem;margin-top:0.25rem}.cc .pb .v{text-align:right;font-variant-numeric:tabular-nums}.cc .pb .v.p{color:var(--sub)}\n  .cmp .zero,.cc .zero{color:var(--sub);font-weight:700}\n  .bar{grid-column:2/5;height:0.25rem;background:var(--soft);border-radius:2px;overflow:hidden;margin-top:-2px}\n  .bar i{display:block;height:100%}\n  .two{display:grid;grid-template-columns:1fr 1fr;gap:1rem}\n  .two h3{font-size:0.8125rem;margin:0 0 0.375rem;color:#333D4B}\n  .rep{display:flex;flex-direction:column}\n  .rp{display:grid;grid-template-columns:1fr auto;gap:2px 0.625rem;padding:0.5625rem 2px;border-bottom:1px solid var(--line)}\n  .rp:last-child{border-bottom:0}\n  .rp .t{font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n  .rp .m{font-size:0.75rem;color:var(--sub);grid-column:1}\n  .badge{grid-row:1/3;grid-column:2;align-self:center;font-size:0.75rem;font-weight:700;padding:0.25rem 0.5rem;border-radius:999px;white-space:nowrap}\n  .b-late{background:#FFF4E6;color:var(--orange)}\n  .b-stop{background:#F1F3F5;color:var(--gray)}\n  .b-next{background:#EBF4FF;color:#1C7ED6}\n  .dhead{display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap;margin-bottom:0.625rem}\n  .search{flex:1;min-width:11.25rem;border:1px solid var(--line);border-radius:0.625rem;padding:0.5rem 0.75rem;font:inherit}\n  .chip{display:inline-flex;align-items:center;gap:0.375rem;background:#EBF4FF;color:#1C7ED6;border-radius:999px;padding:0.3125rem 0.625rem;font-size:0.75rem;font-weight:700;cursor:pointer}\n  table{width:100%;border-collapse:collapse}\n  th{font-size:0.75rem;color:var(--sub);font-weight:600;text-align:left;padding:0.5rem 0.375rem;border-bottom:1px solid var(--line)}\n  td{padding:0.5625rem 0.375rem;border-bottom:1px solid var(--soft);vertical-align:top}\n  td.n,th.n{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}\n  td.d{white-space:nowrap;color:#4E5968}\n  .tag{display:inline-block;font-size:0.6875rem;padding:2px 0.375rem;border-radius:0.375rem;font-weight:700;white-space:nowrap}\n  .cx{color:var(--gray);text-decoration:line-through}\n  .alert{color:#E03131;font-size:0.8125rem;font-weight:600;margin:0 0 0.5rem}\n  .srcm{display:none;white-space:nowrap;font-size:0.6875rem;color:var(--sub);margin-left:0.25rem}\n  .tfoot{display:flex;justify-content:space-between;align-items:center;margin-top:0.625rem;color:var(--sub);font-size:0.8125rem}\n  .empty{color:var(--sub);padding:1.25rem;text-align:center}\n  .items{display:grid;grid-template-columns:1fr 1fr;gap:0 1.5rem}\n  .it{display:grid;grid-template-columns:1.375rem 1fr auto;gap:2px 0.5rem;align-items:center;padding:0.5rem 2px;border-bottom:1px solid var(--soft)}\n  .it .rk{color:var(--sub);font-size:0.75rem;font-weight:700}\n  .it .nm{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600}\n  .it .am{font-variant-numeric:tabular-nums;text-align:right}\n  .it .mt{grid-column:2/4;font-size:0.75rem;color:var(--sub);display:flex;gap:0.5rem;align-items:center}\n  .it .mt .bar{flex:1;grid-column:auto;margin:0}\n  .catsel{display:inline-flex;align-items:center;gap:0.375rem}\n  .catsel .dot{display:inline-block}\n  @media (max-width: 900px){\n    .c7,.c5,.c6{grid-column:span 12}\n  }\n  @media (max-width: 520px){\n    /* 폰: 390px 폭 기준 비율로 전체 크기 (글자·여백·칸이 화면 폭에 비례, 360px = 0.92배 · 430px = 1.10배) */\n    html{font-size:calc(100vw / 24.375)}\n    .wrap{padding:0.875rem 0.75rem 2rem}\n    .tabs{margin:0 -0.75rem;padding:0.625rem 0.75rem}\n    h1{font-size:1.1875rem}\n    .catwrap{grid-template-columns:1fr}\n    .donut{height:10.625rem}\n    .two{grid-template-columns:1fr}\n    .items{grid-template-columns:1fr}\n    .chart{height:16.25rem}\n    .hide-m{display:none}\n    .srcm{display:inline}\n    td,th{padding:0.5rem 0.25rem}\n    .pop{left:auto;right:0;transform:none;width:min(18.75rem,calc(100vw - 1.5rem))}\n    /* 폰: 1줄 = 기간 + 달력 + 구분(드롭다운), 2줄 = 분류 밀기 */\n    .filters{flex-wrap:wrap;gap:0.5rem 0.375rem}\n    .filters .psel{padding:0 1.625rem 0 0.625rem}\n    .filters .psel-wrap:after{right:0.6875rem}\n    #fSrc{display:none}.psel-wrap.srcsel{display:inline-flex}\n    .nav.cal{flex:1;min-width:0}\n    .nav.cal .nb{width:1.625rem;flex:none}\n    .calbtn{flex:1;min-width:0;padding:0 0.25rem;gap:0.375rem}\n    .calbtn .ico{display:none}\n    #pLabel{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n    #pLabel .cnt{display:none}\n    #fCat{flex:1 1 100%;-webkit-mask-image:linear-gradient(90deg,#000 82%,transparent);mask-image:linear-gradient(90deg,#000 82%,transparent)}\n    .t1{grid-template-columns:1fr}.t1 .sp{border-left:0;border-top:1px solid var(--line)}\n    .pm{display:block}.pt .dd,.pt .hm{display:none}.pt td,.pt th{padding:0.4375rem 0.1875rem}\n  }\n  /* ---------- 앱 화면 (2026-11-16 사용자: 한눈가계부, 폰 = 아래 탭바 · PC = 왼쪽 메뉴, 필터는 쓰는 탭에만, 달력 필터 칩) ---------- */\n  :root{--bg:#F2F4F6}\n  body{background:var(--bg)}\n  .card{border-radius:1.125rem;box-shadow:none}\n  .card h2{font-size:1rem;font-weight:700}\n  #reload,#sheet{display:none}\n  .actions{gap:0.25rem;align-items:center}\n  .actions .bell,.actions .more{border:0;background:transparent;width:2.5rem;height:2.5rem;padding:0;border-radius:50%;display:inline-flex;align-items:center;justify-content:center}\n  .actions .bell:active,.actions .more:active{background:#E5E8EB}\n  .more{font-size:1.25rem;letter-spacing:1px;color:var(--ink);cursor:pointer}\n  .bell svg{width:1.375rem;height:1.375rem}\n  h1 .pt{display:none}\n  .tabs svg,.snav svg{fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}\n  .mn{position:fixed;z-index:50;background:var(--card);border-radius:0.875rem;box-shadow:0 8px 24px rgba(0,0,0,.14);padding:0.375rem;min-width:9rem}\n  .mn button,.mn a{display:block;width:100%;text-align:left;border:0;background:transparent;font:inherit;font-size:0.9375rem;color:var(--ink);padding:0.75rem 0.875rem;border-radius:0.625rem;cursor:pointer;text-decoration:none}\n  .mn button:active,.mn a:active{background:var(--soft)}\n  .fchip{display:inline-flex;align-items:center;gap:0.375rem;background:#E8F3FF;color:#1B64DA;border:0;border-radius:999px;padding:0.375rem 0.75rem;font:inherit;font-size:0.8125rem;font-weight:600;margin:0 0 0.625rem;cursor:pointer}\n  .fchip[hidden]{display:none}\n  .fchip i{font-style:normal;font-size:1rem;line-height:1;opacity:.7}\n  body:not([data-tab=\"달력\"]) #gauge{display:none}\n  body[data-tab=\"달력\"] .filters>*:not(#fWho),body[data-tab=\"자산\"] .filters>*:not(#fWho){display:none!important}\n  body[data-tab=\"계획\"] .filters>*:not(#fWho):not(.nav){display:none!important}\n  body[data-tab=\"계획\"] .filters .nav{flex:1}\n  .side{display:none}\n  @media (max-width: 899px){\n    header{position:sticky;top:0;z-index:20;background:rgba(242,244,246,.94);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);margin:-0.875rem -0.75rem 0.25rem;padding:0.875rem 0.75rem 0.625rem;align-items:center;flex-wrap:nowrap}\n    h1 .brand{font-size:1.375rem;font-weight:800;letter-spacing:-.02em}\n    header .stamp{font-size:0.6875rem}\n    .wrap{padding-bottom:6rem}\n    .tabs{position:fixed;bottom:0;left:0;right:0;top:auto;margin:0;z-index:30;background:rgba(255,255,255,.96);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border-top:1px solid #E5E8EB;padding:0.25rem 0.5rem calc(0.5rem + env(safe-area-inset-bottom));gap:0}\n    .tabs button{border:0;background:transparent;height:3.5rem;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.1875rem;font-size:0.6875rem;color:#ADB5BD;border-radius:0}\n    .tabs button.on{background:transparent;color:var(--ink);border-color:transparent}\n    .tabs button svg{width:1.5rem;height:1.5rem}\n    .tabs button.on svg{stroke-width:2.2}\n    .toast{bottom:calc(5.25rem + env(safe-area-inset-bottom))}\n  }\n  @media (min-width: 900px){\n    .tabs{display:none}\n    .side{display:flex;flex-direction:column;position:fixed;left:0;top:0;bottom:0;width:13.5rem;background:var(--card);border-right:1px solid var(--line);padding:1.25rem 0.875rem;z-index:30}\n    .side .nm{font-size:1.125rem;font-weight:800;letter-spacing:-.02em;padding:0 0.5rem 1.25rem}\n    .snav{display:flex;flex-direction:column;gap:0.25rem}\n    .snav button{display:flex;align-items:center;gap:0.75rem;height:2.75rem;border:0;background:transparent;border-radius:0.75rem;padding:0 0.75rem;font:inherit;font-size:0.9375rem;font-weight:600;color:var(--sub);cursor:pointer;text-align:left}\n    .snav button:hover,.snav button.on{background:var(--soft)}.snav button.on{color:var(--ink)}\n    .snav svg{width:1.375rem;height:1.375rem}\n    .side .bud{margin-top:auto;background:#F7F8FA;border-radius:0.875rem;padding:0.875rem}\n    .side .bud .k{font-size:0.75rem;color:var(--sub);font-weight:600}\n    .side .bud b{display:block;font-size:1.0625rem;margin-top:0.25rem;font-variant-numeric:tabular-nums}\n    .side .bud i{display:block;font-style:normal;font-size:0.6875rem;color:var(--sub);font-variant-numeric:tabular-nums}\n    .side .bud .bar{height:0.375rem;background:var(--line);border-radius:3px;margin-top:0.5rem;overflow:hidden}.side .bud .bar s{display:block;height:100%;border-radius:3px}\n    .side .lk{display:flex;gap:0.25rem;margin-top:0.75rem}.side .lk button,.side .lk a{flex:1;text-align:center;font:inherit;font-size:0.75rem;font-weight:600;color:var(--sub);padding:0.5rem 0;border:0;border-radius:0.5rem;background:var(--soft);text-decoration:none;cursor:pointer}\n    .wrap{margin-left:13.5rem;max-width:none;padding:1.25rem 1.75rem 2.5rem}\n    header{align-items:center;margin-bottom:1rem}\n    h1 .brand{display:none}h1 .pt{display:inline;font-size:1.5rem;font-weight:800;letter-spacing:-.02em}\n    .actions .more{display:none}\n    #ccCard{columns:2;column-gap:2.5rem}#ccCard h2,#ccCard .lg{column-span:all}#ccCard .row{break-inside:avoid}\n  }\n</style>\n</head>\n<body>\n<div class=\"wrap\">\n  <header>\n    <div>\n      <h1><span class=\"brand\">한눈가계부</span><span class=\"pt\" id=\"pageT\"></span><span class=\"smp\" id=\"smp\" hidden>예시</span></h1>\n      <div class=\"stamp\" id=\"stamp\"></div>\n    </div>\n    <div class=\"actions\">\n      <button class=\"btn bell\" id=\"bell\" aria-label=\"알림\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9\"/><path d=\"M13.7 21a2 2 0 01-3.4 0\"/></svg><i id=\"bellN\" hidden></i></button>\n      <button class=\"btn\" id=\"reload\">새로고침</button>\n      <a class=\"btn\" id=\"sheet\" target=\"_blank\">시트 열기</a>\n      <button class=\"btn more\" id=\"moreBtn\" aria-label=\"더보기\">⋯</button>\n    </div>\n  </header>\n\n  <div class=\"filters\">\n    <span class=\"seg\" id=\"fWho\" style=\"display:none\"></span>\n    <span class=\"psel-wrap\"><select class=\"psel\" id=\"fPeriod\"></select></span>\n    <span class=\"nav cal\"><button class=\"nb\" id=\"prevW\" title=\"이전 기간\">‹</button><button class=\"calbtn\" id=\"calBtn\" title=\"달력에서 기간 고르기\"><span class=\"ico\"></span><span id=\"pLabel\"></span></button><button class=\"nb\" id=\"nextW\" title=\"다음 기간\">›</button>\n      <div class=\"pop\" id=\"calPop\" hidden></div></span>\n    <span class=\"seg\" id=\"fSrc\"></span>\n    <span class=\"psel-wrap srcsel\"><select class=\"psel\" id=\"fSrcSel\"></select></span>\n    <span class=\"seg\" id=\"fCat\"></span>\n  </div>\n\n  <div class=\"gauge\" id=\"gauge\"></div>\n\n  <div class=\"tabs\" id=\"tabs\"></div>\n  <aside class=\"side\"><div class=\"nm\">한눈가계부</div><nav class=\"snav\" id=\"sideNav\"></nav><div class=\"bud\" id=\"sideBud\"></div><div class=\"lk\"><button id=\"sReload\">새로고침</button><a id=\"sSheet\" target=\"_blank\">시트 열기</a></div></aside>\n  <button class=\"fchip\" id=\"fchip\" hidden></button>\n\n  <div class=\"grid\" id=\"grid\">\n    <section class=\"card c12 calc pc2\" data-tab=\"달력\" id=\"calCard\">\n      <div id=\"calBox\"></div>\n      <div class=\"dl\" id=\"dayBox\"></div>\n    </section>\n\n    <section class=\"card c12 cmp\" data-tab=\"분석\" id=\"cmpCard\"></section>\n    <section class=\"card c12 cc\" data-tab=\"분석\" id=\"ccCard\"></section>\n\n    <section class=\"card c12\" data-tab=\"분석\">\n      <h2 id=\"mTitle\">월별 지출</h2>\n      <div class=\"hint\" id=\"mHint\"></div>\n      <div class=\"chart\"><canvas id=\"cMonth\"></canvas></div>\n    </section>\n\n    <section class=\"card c12\" data-tab=\"분석\" id=\"itemCard\" style=\"display:none\">\n      <h2 id=\"itTitle\"></h2>\n      <div class=\"items\" id=\"items\"></div>\n    </section>\n\n    <section class=\"card c12\" data-tab=\"분석\">\n      <h2>분류별</h2>\n            <div class=\"catwrap\">\n        <div class=\"donut\"><canvas id=\"cCat\"></canvas><div class=\"mid\"><b id=\"catTotal\"></b><span>합계</span></div></div>\n        <div class=\"catlist\" id=\"catList\"></div>\n      </div>\n    </section>\n\n    <section class=\"card c12\" data-tab=\"분석\">\n      <div class=\"two\">\n        <div><h3>요일별</h3><div class=\"chart sm\"><canvas id=\"cWd\"></canvas></div></div>\n        <div><h3>주문 금액대별 비중</h3><div class=\"chart sm\"><canvas id=\"cBk\"></canvas></div></div>\n      </div>\n    </section>\n\n    <section class=\"card c12\" data-tab=\"분석\">\n      <h2>반복 구매</h2>\n      <div class=\"rep\" id=\"rep\"></div>\n    </section>\n\n    <section class=\"card c12\" data-tab=\"내역\">\n      <div class=\"dtitle\" style=\"justify-content:flex-start\"><h2>상세 내역</h2><span class=\"sw\" id=\"flowSw\"></span><button class=\"camb\" id=\"camBtn\" title=\"영수증 사진\" style=\"display:none;margin-left:auto;margin-right:0.375rem\"><svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"#191F28\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 8a2 2 0 0 1 2-2h2l1.5-2h7L17 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"/><circle cx=\"12\" cy=\"13\" r=\"3.5\"/></svg></button><button class=\"addbtn\" id=\"addBtn\" title=\"직접 추가 (현금 등)\">+</button><input type=\"file\" id=\"rcIn\" accept=\"image/*\" hidden><input type=\"file\" id=\"rcCam\" accept=\"image/*\" capture=\"environment\" hidden></div>\n      <div class=\"dhead\">\n        <input class=\"search\" id=\"q\" placeholder=\"검색\">\n        <span id=\"chips\"></span>\n        <span class=\"seg\" id=\"fSort\"></span>\n      </div>\n      <div class=\"tscr\"><table>\n        <colgroup id=\"dcols\"></colgroup>\n        <thead id=\"dth\"></thead>\n        <tbody id=\"tb\"></tbody>\n      </table></div>\n      <div class=\"tfoot\"><span id=\"tsum\"></span><button class=\"btn\" id=\"more\">더 보기</button></div>\n    </section>\n    <section class=\"card c12 mf\" data-tab=\"계획\" id=\"flowCard\"></section>\n    <section class=\"card c12 mf\" data-tab=\"계획\" id=\"cardCard\"></section>\n    <section class=\"card c12\" data-tab=\"계획\" id=\"planCard\">\n      <div class=\"pv\" id=\"planBox\"><div class=\"pvh\"><h2>계획 대비</h2><span class=\"st\" id=\"planSt\"></span></div><div id=\"planBody\"></div></div>\n    </section>\n    <section class=\"card c12\" data-tab=\"자산\" id=\"assetTop\"></section>\n    <section class=\"card c12\" data-tab=\"자산\" id=\"assetList\"></section>\n  </div>\n</div>\n\n<script>var T_START = Date.now(), PERF_ID = '<?= perfId ?>', CACHE_AGE = Number('<?= cacheAge ?>') || 0, DKEY = '<?= dkey ?>';\n  /* 판매용: 서버 함수는 api(키, 이름, 인자) 하나로만 부름 (판매.gs). 아래 GSR()이 google.script.run을 감쌈 */\n  var GS_NAMES = ['getDashboardJson', 'getDashFont', 'logPerf', 'addManual', 'editManual', 'setCategory', 'setBudget', 'setIncomeType', 'addIncomeType', 'delIncomeType', 'ocrReceipt', 'saveReceipt', 'excludeNoti', 'setNotiAmount', 'setPlanRow', 'setAcctRow'];\n  function GSR() {\n    function wrap(r) {\n      var o = { withSuccessHandler: function (f) { return wrap(r.withSuccessHandler(f)); }, withFailureHandler: function (f) { return wrap(r.withFailureHandler(f)); } };\n      GS_NAMES.forEach(function (n) { o[n] = function () { return r.api(DKEY, n, Array.prototype.slice.call(arguments)); }; });\n      return o;\n    }\n    return wrap(google.script.run);\n  }</script>\n<script>var DATA = <?!= payload ?>;</script>\n<script><?!= lib ?></script>\n<script>\n(function () {\n  var COLOR = CAT_COLOR;\n  var won = function (n) { return Math.round(n).toLocaleString('ko-KR') + '원'; };\n  var num = function (n) { return Math.round(n).toLocaleString('ko-KR'); };\n  var man = function (n) { return n >= 1e4 ? (Math.round(n / 1e3) / 10).toLocaleString('ko-KR') + '만' : num(n); };\n  var esc = function (s) { return String(s).replace(/[&<>\"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c]; }); };\n  var addMonth = function (ym, d) { var y = +ym.slice(0, 4), m = +ym.slice(5, 7) - 1 + d; y += Math.floor(m / 12); m = ((m % 12) + 12) % 12; return y + '-' + String(m + 1).padStart(2, '0'); };\n\n  var PERIODS = [['m1', '이번 달'], ['prev', '지난달'], ['r3', '최근 3개월'], ['r6', '최근 6개월'], ['r12', '최근 12개월'], ['all', '전체'], ['custom', '직접 지정']];\n  var ME = '나', LINKS = [];   // 함께 쓰기: 연결된 사람 [{n, rows, limit}] (판매.gs saleShareFetch_)\n  var S = { who: null, period: 'm1', ym: null, from: null, to: null, src: '전체', cat: null, q: '', sort: 'date', limit: 30, tab: '달력', cm: null, cmKey: '', day: null, flow: '지출' };\n  var TABS = ['달력', '분석', '내역', '계획', '자산'], TAB_KEY = 'dashTab_v1';\n  try { var t0 = localStorage.getItem(TAB_KEY); if (TABS.indexOf(t0) >= 0) S.tab = t0; } catch (e) {}\n  var W, FIRST;   // W = 지금 보고 있는 기간 {from, to, n, cmp}, FIRST = 데이터 첫 달. 열 때 기본은 항상 '이번 달'\n  var charts = {};\n  var ROWS, TODAY, CUR, NFULL = '';   // NFULL = 카드·계좌 알림이 1일부터 다 있는 첫 달 (비교·평균 기준)\n  var NS = '카드·계좌';\n\n  function load(d) {\n    DATA = d; TODAY = d.today; CUR = TODAY.slice(0, 7);\n    document.getElementById('smp').hidden = !d.sample;   // 판매.gs saleSample_: 기록 0줄일 때 예시\n    ROWS = d.rows.map(function (r) { return { src: r[0], date: r[1], order: r[2], name: r[3], amount: +r[4] || 0, cat: r[5] || '기타', status: r[6] || '', row: r[7], a0: r[9] || 0 }; });\n    ME = d.me || '나'; LINKS = (d.links || []).filter(function (l) { return !l.err; });\n    (d.links || []).forEach(function (l) { if (l.err) toast(l.n + ' ' + l.err); });\n    LINKS.forEach(function (l, li) { (l.rows || []).forEach(function (r, i) {   // 상대 줄: 보기만 (row = 'p…' → 분류 바꾸기 안 됨)\n      ROWS.push({ src: r[0], date: r[1], order: r[2], name: r[3], amount: +r[4] || 0, cat: r[5] || '기타', status: r[6] || '', row: 'p' + li + '_' + i, owner: l.n }); }); });\n    if (!LINKS.length) S.who = 'me';\n    else if (!S.who || (S.who !== 'me' && S.who !== 'all' && !LINKS.some(function (l) { return l.n === S.who; }))) { var sw = null; try { sw = localStorage.getItem('dashWho_v1'); } catch (e) {} S.who = sw && (sw === 'me' || sw === 'all' || LINKS.some(function (l) { return l.n === sw; })) ? sw : 'all'; }\n    var nf = d.notiFrom || ''; NFULL = !nf ? '' : nf.slice(8, 10) === '01' ? nf.slice(0, 7) : addMonth(nf.slice(0, 7), 1);\n    FIRST = ROWS.reduce(function (a, r) { var m = r.date.slice(0, 7); return m < a ? m : a; }, CUR);\n\n    document.getElementById('stamp').textContent = (+d.stamp.slice(5, 7)) + '/' + (+d.stamp.slice(8, 10)) + ' ' + d.stamp.slice(11) + ' 기준'\n      + (d.upd ? ' · v' + d.upd.ver + ' (' + d.upd.build + ')' + (d.upd.msg && d.upd.msg !== '최신' ? ' · ' + d.upd.msg : '') : '');\n    if (d.sheetUrl) { document.getElementById('sheet').href = d.sheetUrl; document.getElementById('sSheet').href = d.sheetUrl; }\n    render();\n  }\n\n  var mdiff = function (a, b) { return (+b.slice(0, 4) - +a.slice(0, 4)) * 12 + (+b.slice(5, 7) - +a.slice(5, 7)); };\n  var ymText = function (m, short) { return short ? m.slice(2, 4) + '.' + (+m.slice(5)) : m.slice(0, 4) + '년 ' + (+m.slice(5)) + '월'; };\n  var rangeText = function (f, t, n) { return f === t ? ymText(f) : ymText(f, 1) + ' ~ ' + ymText(t, 1) + ' (' + n + '개월)'; };\n  var rangeHtml = function (f, t, n) { return f === t ? ymText(f) : ymText(f, 1) + ' ~ ' + ymText(t, 1) + '<span class=\"cnt\"> (' + n + '개월)</span>'; };   // 달력 칸용: 폰에서는 (N개월) 숨김\n\n  // 기간 정의: '최근 N개월' = 끝난 달 N개(이번 달 제외). 비교 = 바로 앞의 같은 길이 기간.\n  // 이번 달이 들어 있으면 비교 기간의 마지막 달도 같은 날짜까지만 (11/1~5일 ↔ 10/1~5일)\n  function win() {\n    var p = S.period, from, to;\n    if (p === 'm1') from = to = CUR;\n    else if (p === 'prev') from = to = addMonth(CUR, -1);\n    else if (p === 'month') from = to = S.ym;\n    else if (p.charAt(0) === 'r') { to = addMonth(CUR, -1); from = addMonth(CUR, -(+p.slice(1))); }\n    else if (p === 'custom') { from = S.from < S.to ? S.from : S.to; to = S.from < S.to ? S.to : S.from; }\n    else { from = FIRST; to = CUR; }\n    var n = mdiff(from, to) + 1, cut = to === CUR ? TODAY.slice(8, 10) : null;\n    var cmp = p === 'all' ? null : { from: addMonth(from, -n), to: addMonth(to, -n), cut: cut };\n    return { from: from, to: to, n: n, cut: cut, cmp: cmp, label: rangeText(from, to, n) };\n  }\n  function inWin(r, w) {\n    var m = r.date.slice(0, 7);\n    return m >= w.from && m <= w.to && (!w.cut || m < w.to || r.date.slice(8, 10) <= w.cut);\n  }\n  function inPeriod(r) { return inWin(r, { from: W.from, to: W.to }); }\n  // ‹ › : 보고 있는 기간을 같은 길이만큼 앞뒤로 이동 (한 달짜리는 월 단위로)\n  function shift(k) {\n    var f = addMonth(W.from, k * W.n), t = addMonth(W.to, k * W.n);\n    if (W.n === 1) { S.period = 'month'; S.ym = f; } else { S.period = 'custom'; S.from = f; S.to = t; }\n    if (S.period === 'month' && S.ym === CUR) S.period = 'm1';\n    if (S.period === 'month' && S.ym === addMonth(CUR, -1)) S.period = 'prev';\n    S.limit = 30; render();\n  }\n  // 달력: 지금 기간을 보여주고, 누르면 월 달력으로 직접 지정 (시작 달 → 끝 달, 같은 달 두 번 = 그 달만)\n  var CAL = { open: false, year: 0, pick: null };\n  function calOpen() { CAL.open = true; CAL.year = +W.to.slice(0, 4); CAL.pick = null; drawCal(); }\n  function calClose() { CAL.open = false; drawCal(); }\n  function drawCal() {\n    var el = document.getElementById('calPop');\n    if (!CAL.open) { el.hidden = true; return; }\n    var y = CAL.year, h = '<div class=\"ph\"><button class=\"nb\" data-y=\"-1\"' + (y <= +FIRST.slice(0, 4) ? ' disabled' : '') + '>‹</button><b>' + y + '년</b>'\n      + '<button class=\"nb\" data-y=\"1\"' + (y >= +CUR.slice(0, 4) ? ' disabled' : '') + '>›</button></div><div class=\"mg\">';\n    for (var i = 1; i <= 12; i++) {\n      var m = y + '-' + String(i).padStart(2, '0'), cls = '';\n      if (CAL.pick) cls = m === CAL.pick ? 'on' : '';\n      else if (m === W.from || m === W.to) cls = 'on';\n      else if (m > W.from && m < W.to) cls = 'in';\n      h += '<button class=\"mc ' + cls + '\" data-m=\"' + m + '\"' + (m < FIRST || m > CUR ? ' disabled' : '') + '>' + i + '월</button>';\n    }\n    el.innerHTML = h + '</div><div class=\"pf\">' + (CAL.pick ? ymText(CAL.pick) + ' 부터 · 끝 달을 고르세요' : '시작 달 → 끝 달 순서로 (같은 달 두 번 = 한 달)') + '</div>';\n    el.hidden = false;\n  }\n  function calPick(m) {\n    if (!CAL.pick) { CAL.pick = m; drawCal(); return; }\n    var f = CAL.pick < m ? CAL.pick : m, t = CAL.pick < m ? m : CAL.pick;\n    if (f === t) { S.period = f === CUR ? 'm1' : f === addMonth(CUR, -1) ? 'prev' : 'month'; S.ym = f; }\n    else { S.period = 'custom'; S.from = f; S.to = t; }\n    CAL.open = false; drawCal(); S.limit = 30; render();\n  }\n\n  // 함께 쓰기: 나 / 상대 / 합쳐서. 합쳐서는 서로 보낸 돈(상대 이름이 들어간 줄)을 뺌\n  function byWho(r) {\n    if (!LINKS.length || S.who === 'me') return !r.owner;\n    if (S.who !== 'all') return r.owner === S.who;\n    var other = r.owner ? [ME] : LINKS.map(function (l) { return l.n; });\n    return !other.some(function (n) { return n && n.length >= 2 && r.name.indexOf(n) >= 0; });\n  }\n  function whoLimit(mine) {\n    if (!LINKS.length || S.who === 'me') return mine;\n    var pl = LINKS.filter(function (l) { return S.who === 'all' || l.n === S.who; }).reduce(function (a, l) { return a + (+l.limit || 0); }, 0);\n    return S.who === 'all' ? mine + pl : pl;\n  }\n  var whoTag = function (r) { return LINKS.length && S.who === 'all' ? '<span class=\"srcl\">' + esc(r.owner || ME) + '</span>' : ''; };\n  function bySrc(r) { return byWho(r) && (S.src === '전체' || r.src === S.src); }\n\n  function seg(id, items, key) {\n    var el = document.getElementById(id);\n    el.innerHTML = items.map(function (it) { return '<button data-v=\"' + it[0] + '\" class=\"' + ((S[key] || '') === it[0] ? 'on' : '') + '\">' + it[1] + '</button>'; }).join('');\n    el.onclick = function (e) {\n      var b = e.target.closest('button'); if (!b) return;\n      S[key] = b.dataset.v || null; S.limit = 30;\n      render();\n    };\n  }\n\n  function render() {\n    W = win();\n    var ps = document.getElementById('fPeriod');\n    ps.innerHTML = PERIODS.map(function (x) { return '<option value=\"' + x[0] + '\">' + x[1] + '</option>'; }).join('')\n      + (S.period === 'month' ? '<option value=\"month\">' + ymText(S.ym) + '</option>' : '');   // ‹ › 나 막대로 고른 달\n    ps.value = S.period;\n    ps.onchange = function () {\n      if (ps.value === 'custom') { ps.value = S.period; calOpen(); return; }   // 직접 지정 = 달력 열기\n      S.period = ps.value; S.limit = 30; render();\n    };\n    document.getElementById('pLabel').innerHTML = rangeHtml(W.from, W.to, W.n);\n    document.getElementById('prevW').disabled = W.from <= FIRST;\n    document.getElementById('nextW').disabled = W.to >= CUR;\n    var fw = document.getElementById('fWho');\n    fw.style.display = LINKS.length ? '' : 'none';\n    if (LINKS.length) { seg('fWho', [['me', esc(ME)]].concat(LINKS.map(function (l) { return [esc(l.n), esc(l.n)]; })).concat([['all', '합쳐서']]), 'who'); try { localStorage.setItem('dashWho_v1', S.who); } catch (e) {} }\n    seg('fSrc', [['전체', '전체']].concat(CFG.SOURCES.map(function (s) { return [s, s]; })), 'src');\n    var ss = document.getElementById('fSrcSel');\n    ss.innerHTML = ['전체'].concat(CFG.SOURCES).map(function (x) { return '<option value=\"' + x + '\">' + x + '</option>'; }).join('');\n    ss.value = S.src; ss.onchange = function () { S.src = ss.value; S.limit = 30; render(); };\n    seg('fSort', [['date', '최신순'], ['amount', '금액순']], 'sort');\n    var all = ROWS.filter(bySrc).filter(inPeriod);\n    var ALL = computeAnalysis(all, TODAY);                      // 분류 목록·비중은 항상 전체 기준\n    var catItems = [['', '전체']].concat(ALL.cats.map(function (o) { return [o.cat, '<span class=\"catsel\"><span class=\"dot\" style=\"background:' + COLOR[o.cat] + '\"></span>' + esc(o.cat) + (o.cat === '기타' ? ' ' + o.lines : '') + '</span>']; }));   // 기타는 항상 보이고 건수 표시\n    if (S.cat && !ALL.cats.some(function (o) { return o.cat === S.cat; })) catItems.push([S.cat, esc(S.cat)]);\n    seg('fCat', catItems, 'cat');\n    catScroll();\n    var base = S.cat ? all.filter(byCat) : all;\n    var A = computeAnalysis(base, TODAY);\n    var trend = ROWS.filter(bySrc).filter(byCat);\n    top(A, trend, ALL);\n    cmpBlock(ROWS.filter(bySrc));\n    monthChart(computeAnalysis(trend, TODAY));\n    itemBlock(base);\n    catBlock(ALL);\n    repBlock(A);\n    smallCharts(A);\n    detail(base);\n    planBlock();\n    tabBar();\n    calBlock();\n    flowBlock();\n    assetBlock();\n    if (document.getElementById('chkSheet')) chkOpen();\n    bellRender();\n  }\n\n  /* ---------- 영수증 (2026-11-13, 영수증.gs) ---------- */\n  var RC = null;\n  function rcShrink(file, cb) {   // 긴 변 2400px JPEG로 줄여서 보냄\n    var img = new Image(), url = URL.createObjectURL(file);\n    img.onload = function () {\n      var k = Math.min(1, 2400 / Math.max(img.width, img.height)), c = document.createElement('canvas');\n      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);\n      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);\n      cb(c.toDataURL('image/jpeg', 0.85).split(',')[1]);\n    };\n    img.onerror = function () { URL.revokeObjectURL(url); toast('사진을 열 수 없음'); };\n    img.src = url;\n  }\n  function rcClose() { var a = document.getElementById('rcDim'), b = document.getElementById('rcSheet'); if (a) a.remove(); if (b) b.remove(); RC = null; }\n  function rcShell(html) {\n    var b = document.getElementById('rcSheet');\n    if (!b) { document.body.insertAdjacentHTML('beforeend', '<div class=\"rdim\" id=\"rcDim\"></div><div class=\"rsheet\" id=\"rcSheet\"></div>'); b = document.getElementById('rcSheet'); document.getElementById('rcDim').onclick = function () { if (!RC || !RC.busy) rcClose(); }; }\n    b.innerHTML = html; return b;\n  }\n  function rcSum() { return RC.items.reduce(function (a, it) { return a + (+it.amount || 0); }, 0); }\n  function rcLinkAmt() { var c = (RC.cands || []).find(function (x) { return String(x.row) === String(RC.link); }); return c ? c.amount : null; }\n  function rcDraw() {\n    var sum = rcSum(), card = rcLinkAmt(), tot = +RC.total || 0;\n    var diffs = [];\n    if (tot && sum !== tot) diffs.push('영수증 합계와 ' + num(Math.abs(sum - tot)) + '원 차이');\n    if (card != null && sum !== card) diffs.push('카드와 ' + num(Math.abs(sum - card)) + '원 차이');\n    var cats = CAT_ORDER.filter(function (c) { return c !== '배송비'; });\n    var h = '<div class=\"rh\"><input id=\"rcStore\" value=\"' + esc(RC.store || '') + '\" placeholder=\"가게\"><input id=\"rcDate\" type=\"date\" value=\"' + RC.date + '\"></div>'\n      + '<select id=\"rcLink\"><option value=\"\">카드·계좌 결제와 연결 안 함</option>' + (RC.cands || []).map(function (c) {\n        return '<option value=\"' + c.row + '\"' + (String(c.row) === String(RC.link) ? ' selected' : '') + '>' + mdTxt(c.when) + ' ' + c.when.slice(11, 16) + ' ' + esc(c.name) + ' ' + num(c.amount) + '</option>'; }).join('') + '</select>'\n      + '<div class=\"chk\"><div><span>품목 합계</span><b>' + num(sum) + '</b></div><div><span>영수증 합계</span><input id=\"rcTot\" inputmode=\"numeric\" value=\"' + (tot ? num(tot) : '') + '\" placeholder=\"—\"></div>'\n      + '<div><span>카드</span><b>' + (card != null ? num(card) : '—') + '</b></div></div>'\n      + '<div class=\"st ' + (diffs.length ? 'no' : 'ok') + '\">' + (diffs.length ? diffs.join(' · ') : '✓ 일치') + '</div>'\n      + '<table class=\"dt\"><colgroup><col style=\"width:30%\"><col><col style=\"width:24%\"></colgroup><tbody>'\n      + RC.items.map(function (it, i) {   // 분류 = 드롭다운, 이름·금액 = 눌러서 따로 고치기\n        return '<tr><td><span class=\"tsw\" style=\"color:' + COLOR[it.cat] + '\"><select class=\"tagsel\" data-i=\"' + i + '\" style=\"background:' + COLOR[it.cat] + '1F;color:' + COLOR[it.cat] + '\">'\n          + cats.map(function (c) { return '<option' + (c === it.cat ? ' selected' : '') + '>' + c + '</option>'; }).join('') + '</select></span></td>'\n          + '<td class=\"tap\" data-f=\"name\" data-i=\"' + i + '\">' + (it.name ? esc(it.name) : '<span class=\"ph\">이름</span>') + '</td>'\n          + '<td class=\"n tap\" data-f=\"amount\" data-i=\"' + i + '\">' + (it.amount ? num(it.amount) : '<span class=\"ph\">금액</span>') + '</td></tr>';\n      }).join('') + '</tbody></table>'\n      + '<button class=\"addit\" data-act=\"add\">+ 품목</button>'\n      + '<div class=\"btns\"><button data-act=\"cancel\">취소</button><button class=\"go\" data-act=\"save\"' + (RC.items.length ? '' : ' disabled') + '>저장</button></div>';\n    var b = rcShell(h);\n    b.oninput = function (e) {\n      var t = e.target;\n      if (t.id === 'rcStore') RC.store = t.value;\n      if (t.id === 'rcTot') { var v = t.value.replace(/[^0-9]/g, ''); RC.total = +v || null; }\n    };\n    b.onchange = function (e) {\n      var t = e.target;\n      if (t.id === 'rcDate') RC.date = t.value;\n      if (t.id === 'rcLink') { RC.link = t.value || null; rcDraw(); }\n      if (t.id === 'rcTot') rcDraw();\n      if (t.classList.contains('tagsel')) { var it = RC.items[+t.dataset.i]; it.cat = t.value; if (RC.edited.indexOf(it.name) < 0) RC.edited.push(it.name); rcDraw(); }\n    };\n    b.onclick = function (e) {\n      e.stopPropagation();\n      var act = e.target.closest('[data-act]'), a = act && act.dataset.act;\n      if (a === 'cancel') { rcClose(); return; }\n      if (a === 'add') { RC.items.push({ name: '', amount: 0, cat: '기타' }); var k = RC.items.length - 1; rcDraw(); rcAsk(k, 'name', function () { rcAsk(k, 'amount'); }); return; }\n      if (a === 'save') { rcSave(); return; }\n      var td = e.target.closest('td.tap'); if (td) rcAsk(+td.dataset.i, td.dataset.f);\n    };\n  }\n  // 품목 한 칸 고치기 창: 이름(글자) 또는 금액(숫자만, 할인 = 빼기)\n  function rcAsk(i, f, next) {\n    var it = RC.items[i]; if (!it) return;\n    var amt = f === 'amount', neg = it.amount < 0;\n    document.body.insertAdjacentHTML('beforeend', '<div class=\"rdim\" id=\"raDim\" style=\"z-index:58\"></div><div class=\"rask\" id=\"raBox\"><div class=\"t\">' + (amt ? '금액' : '품목 이름') + '</div>'\n      + '<input id=\"raIn\" ' + (amt ? 'inputmode=\"numeric\" pattern=\"[0-9]*\" autocomplete=\"off\"' : 'autocomplete=\"off\"') + ' value=\"' + (amt ? (it.amount ? Math.abs(it.amount).toLocaleString('ko-KR') : '') : esc(it.name)) + '\">'\n      + (amt ? '<label class=\"neg\"><input type=\"checkbox\" id=\"raNeg\"' + (neg ? ' checked' : '') + '> 할인 (빼기)</label>' : '')\n      + '<div class=\"bb\">' + (amt ? '' : '<button data-r=\"del\" class=\"del\">삭제</button>') + '<button data-r=\"no\">취소</button><button data-r=\"ok\" class=\"ok\">확인</button></div></div>');\n    var box = document.getElementById('raBox'), inp = document.getElementById('raIn');\n    setTimeout(function () { inp.focus(); inp.select(); }, 0);\n    if (amt) inp.oninput = function () { var v = this.value.replace(/[^0-9]/g, ''); this.value = v ? (+v).toLocaleString('ko-KR') : ''; };\n    var close = function () { box.remove(); document.getElementById('raDim').remove(); };\n    var ok = function () {\n      if (amt) { var v = +inp.value.replace(/[^0-9]/g, '') || 0; it.amount = document.getElementById('raNeg').checked ? -v : v; }\n      else it.name = inp.value.trim();\n      close();\n      if (!it.name && !it.amount && !next) RC.items.splice(i, 1);\n      rcDraw(); if (next) next();\n    };\n    inp.onkeydown = function (e) { if (e.key === 'Enter') ok(); if (e.key === 'Escape') { close(); rcDraw(); } };\n    document.getElementById('raDim').onclick = function (e) { e.stopPropagation(); close(); if (!it.name && !it.amount) RC.items.splice(i, 1); rcDraw(); };\n    box.onclick = function (e) {\n      e.stopPropagation();\n      var r = e.target.closest('[data-r]'); if (!r) return;\n      if (r.dataset.r === 'ok') ok();\n      else if (r.dataset.r === 'del') { close(); RC.items.splice(i, 1); rcDraw(); }\n      else { close(); if (!it.name && !it.amount) RC.items.splice(i, 1); rcDraw(); }\n    };\n  }\n  function rcSave() {\n    var o = { date: RC.date, store: RC.store, link: RC.link ? +RC.link : null, edited: RC.edited,\n      items: RC.items.filter(function (it) { return it.name && it.amount; }) };\n    if (!o.items.length) { toast('품목이 없음'); return; }\n    if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(o.date)) { toast('날짜를 확인'); return; }\n    var go = document.querySelector('#rcSheet [data-act=\"save\"]'); if (go) go.disabled = true; RC.busy = true;\n    var done = function (rows) {\n      (rows || []).forEach(function (r) { ROWS.push({ src: r[0], date: r[1], order: r[2], name: r[3], amount: +r[4] || 0, cat: r[5] || '기타', status: r[6] || '', row: r[7] }); });\n      if (o.link) ROWS = ROWS.filter(function (r) { return r.row !== -o.link; });\n      rcClose(); toast('영수증 저장 · ' + (rows || []).length + '개 품목'); render();\n    };\n    if (!(window.google && google.script && google.script.run)) { done(o.items.map(function (it, i) { return ['영수증', o.date, 'Rtest', it.name, it.amount, it.cat, '', 2000000 + i]; })); return; }\n    GSR().withSuccessHandler(done).withFailureHandler(function (err) { RC.busy = false; if (go) go.disabled = false; toast('저장 실패: ' + err.message); }).saveReceipt(o);\n  }\n  function rcStart(file) {\n    rcShell('<div class=\"wait\">영수증 읽는 중…</div>');\n    RC = { busy: true };\n    rcShrink(file, function (b64) {\n      var ok = function (p) {\n        RC = { store: p.store || '', date: p.date, total: p.total || null, items: (p.items || []).map(function (it) { return { name: it.name, amount: it.amount, cat: it.cat || '기타' }; }),\n          cands: p.cands || [], link: p.cands && p.cands[0] ? p.cands[0].row : null, edit: -1, edited: [] };\n        rcDraw();\n        if (!RC.items.length) toast('품목을 못 읽음 · + 품목으로 입력');\n      };\n      if (!(window.google && google.script && google.script.run)) { ok(window.RC_TEST || { date: TODAY, items: [] }); return; }\n      GSR().withSuccessHandler(ok).withFailureHandler(function (err) { rcClose(); toast('읽기 실패: ' + err.message); }).ocrReceipt(b64);\n    });\n  }\n\n  /* ---------- 입금·돈 흐름·카드 (2026-11-13, 수입.gs) ---------- */\n  var MODE_COLOR = { '수입': '#2F9E44', '제외': '#868E96', '환불': '#1C7ED6', '미정': '#E8590C' };\n  var mdTxt = function (d) { return (+d.slice(5, 7)) + '/' + (+d.slice(8, 10)); };\n  var wdTxt = function (d) { return '일월화수목금토'.charAt(new Date(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8, 10)).getDay()); };\n  function incAll() { return (DATA.inc && DATA.inc.rows) || []; }\n  function incTypes() { return (DATA.inc && DATA.inc.types) || []; }\n  function incTag(r, label) {\n    return '<button class=\"tag tagbtn inv\" data-inc=\"' + esc(r.sender) + '\" data-date=\"' + r.date + '\" style=\"background:' + (MODE_COLOR[r.mode] || '#868E96') + '\">' + esc(label || r.type) + '</button>';\n  }\n  // 칸보다 긴 숫자는 글자를 줄여 한 줄에 맞춤 (2026-11-16: 돈 흐름 '남은 돈 -1,752,954'가 칸 밖으로 나감)\n  function fitNums(root) {\n    if (!root) return;\n    root.querySelectorAll('.f3 b').forEach(function (b) {\n      b.style.fontSize = '';\n      var fs = parseFloat(getComputedStyle(b).fontSize), min = 10;\n      while (b.scrollWidth > b.clientWidth + 1 && fs > min) { fs -= 0.5; b.style.fontSize = fs + 'px'; }\n    });\n  }\n  function flowBlock() {\n    var m = planMonth(), rows = incAll().filter(function (r) { return r.date.slice(0, 7) === m; });\n    var sumMode = function (md) { return rows.filter(function (r) { return r.mode === md; }).reduce(function (a, r) { return a + r.amount; }, 0); };\n    var inc = sumMode('수입'), refund = sumMode('환불');\n    var spend = ROWS.filter(function (r) { return !r.owner && r.amount > 0 && r.date.slice(0, 7) === m; }).reduce(function (a, r) { return a + r.amount; }, 0);   // 돈 흐름 = 내 입금 기준이라 내 지출만\n    var out = spend + ((DATA.fixedOut || {})[m] || 0) - refund, left = inc - out;\n    var pm = DATA.plan && DATA.plan.months && DATA.plan.months[m], pin = pm ? pm.rows.filter(function (r) { return r.grp === '입금'; }).reduce(function (a, r) { return a + r.plan; }, 0) : 0;\n    if (!DATA.notiFrom) {   // 판매용 기본판(알림 앱 없음): 입금·고정지출을 모르니 계획 기준 예상\n      var pfx = pm ? pm.rows.filter(function (r) { return r.grp === '고정지출' || r.grp === '저축'; }).reduce(function (a, r) { return a + r.plan; }, 0) : 0, est = pin - pfx - spend;\n      document.getElementById('flowCard').style.display = pin || pfx ? '' : 'none';   // 계획 탭이 비었으면 숨김\n      document.getElementById('flowCard').innerHTML = '<h2>' + (+m.slice(5)) + '월 돈 흐름 <span class=\"c\" style=\"font-weight:500;margin-left:6px\">계획 기준</span></h2><div class=\"f3\">'\n        + '<div><span class=\"k\">들어올 돈</span><b>' + num(pin) + '</b></div>'\n        + '<div><span class=\"k\">나갈 돈</span><b>' + num(pfx + spend) + '</b></div>'\n        + '<div><span class=\"k\">남을 돈</span><b class=\"' + (est < 0 ? 'neg' : '') + '\">' + (est < 0 ? '-' : '') + num(Math.abs(est)) + '</b></div></div>';\n      document.getElementById('cardCard').style.display = 'none';\n      return;\n    }\n    var h = '<h2>' + (+m.slice(5)) + '월 돈 흐름</h2><div class=\"f3\">'\n      + '<div><span class=\"k\">들어온 돈</span><b>' + num(inc) + '</b>' + (pin ? '<i>/ ' + num(pin) + '</i>' : '') + '</div>'\n      + '<div><span class=\"k\">나간 돈</span><b>' + num(out) + '</b></div>'\n      + '<div><span class=\"k\">남은 돈</span><b class=\"' + (left < 0 ? 'neg' : '') + '\">' + (left < 0 ? '-' : '') + num(Math.abs(left)) + '</b></div></div><table class=\"tl\">';\n    incTypes().forEach(function (t) {\n      var a = rows.filter(function (r) { return r.type === t[0]; }).reduce(function (x, r) { return x + r.amount; }, 0);\n      if (!a && t[1] !== '수입') return;\n      h += '<tr><td><span class=\"tag inv\" style=\"background:' + MODE_COLOR[t[1]] + '\">' + esc(t[0]) + '</span></td><td class=\"n\">' + num(a) + '</td></tr>';\n    });\n    document.getElementById('flowCard').innerHTML = h + '</table>';\n    fitNums(document.getElementById('flowCard'));\n    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fitNums(document.getElementById('flowCard')); });   // 글꼴이 늦게 들어오면 폭이 바뀜\n    // 카드 출금 예정\n    var cd = DATA.card;\n    document.getElementById('cardCard').style.display = cd && cd.bills ? '' : 'none';   // 예전 저장본(카드 일정 없음) → 뒤에서 새로 받으면 다시 보임\n    if (!cd || !cd.bills) return;\n    var c = '<h2>카드 ' + esc(cd.card || '') + '</h2><table class=\"tl\">';\n    cd.bills.forEach(function (b) {\n      c += '<tr><td>' + mdTxt(b.due) + ' (' + wdTxt(b.due) + ')</td><td class=\"n\">' + (b.state === 'wait' ? '<span class=\"c\">알림 대기</span>' : '<b>' + num(b.amt) + '</b> <span class=\"c\">추정</span>') + '</td></tr>';\n    });\n    (cd.inst || []).forEach(function (o) { c += '<tr><td class=\"c\">할부 · ' + esc(o.name) + '</td><td class=\"n c\">' + o.k + '/' + o.n + '회 ' + num(o.amt) + '</td></tr>'; });\n    document.getElementById('cardCard').innerHTML = c + '</table>';\n  }\n  // 입금 종류 고르기 · 추가 · 삭제 (시트 '입금분류' 탭에 저장)\n  function typePop(btn) {\n    closeCp();\n    var sender = btn.dataset.inc, date = btn.dataset.date, cur = (incAll().find(function (r) { return r.sender === sender; }) || {}).type;\n    var el = document.createElement('div'); el.className = 'tp';\n    var draw = function () {\n      el.innerHTML = '<div class=\"t\">' + esc(sender) + '</div>' + incTypes().map(function (t) {\n        return '<div class=\"r' + (t[0] === cur ? ' on' : '') + '\" data-t=\"' + esc(t[0]) + '\">' + esc(t[0]) + '<span class=\"m\">' + t[1] + '</span>'\n          + (t[1] === '미정' ? '<span style=\"width:1.25rem\"></span>' : '<button class=\"x\" data-del=\"' + esc(t[0]) + '\">×</button>') + '</div>';\n      }).join('') + '<div class=\"add\"><input id=\"tpN\" placeholder=\"새 종류\" maxlength=\"20\"><select id=\"tpM\"><option>수입</option><option>제외</option><option>환불</option></select><button id=\"tpGo\">추가</button></div>';\n    };\n    draw();\n    document.body.appendChild(el);\n    var b = btn.getBoundingClientRect();\n    el.style.top = (b.bottom + window.scrollY + 6) + 'px';\n    el.style.left = Math.max(8, Math.min(b.left + window.scrollX, document.documentElement.clientWidth - el.offsetWidth - 8)) + 'px';\n    var run = function (fn, args, ok) {\n      if (!(window.google && google.script && google.script.run)) { ok(); return; }\n      var g = GSR().withSuccessHandler(ok).withFailureHandler(function (err) { toast('저장 실패: ' + err.message); });\n      g[fn].apply(g, args);\n    };\n    var setType = function (t) {\n      var md = (incTypes().find(function (x) { return x[0] === t; }) || [t, '미정'])[1];\n      incAll().forEach(function (r) { if (r.sender === sender) { r.type = t; r.mode = md; } });\n      run('setIncomeType', [sender, t, date], function () {});\n      closeCp(); toast(sender + ' → ' + t); render();\n    };\n    el.onclick = function (e) {\n      e.stopPropagation();\n      var del = e.target.closest('[data-del]');\n      if (del) {\n        var nm = del.dataset.del;\n        run('delIncomeType', [nm], function () {\n          DATA.inc.types = incTypes().filter(function (x) { return x[0] !== nm; });\n          incAll().forEach(function (r) { if (r.type === nm) { r.type = '확인 필요'; r.mode = '미정'; } });\n          closeCp(); toast(nm + ' 삭제'); render();\n        });\n        return;\n      }\n      if (e.target.id === 'tpGo') {\n        var n = el.querySelector('#tpN').value.trim(), md = el.querySelector('#tpM').value;\n        if (!n) { el.querySelector('#tpN').focus(); return; }\n        if (incTypes().some(function (x) { return x[0] === n; })) { toast('이미 있는 종류'); return; }\n        run('addIncomeType', [n, md], function () { var at = incTypes().length - 1; DATA.inc.types.splice(Math.max(0, at), 0, [n, md]); setType(n); });\n        return;\n      }\n      var r = e.target.closest('.r'); if (r && !e.target.closest('input,select')) setType(r.dataset.t);\n    };\n    CP = el;\n  }\n  function incDetail() {\n    var q = S.q.trim().toLowerCase();\n    var list = incAll().filter(function (r) { return inPeriod(r) && (!q || r.sender.toLowerCase().indexOf(q) >= 0); });\n    list.sort(S.sort === 'amount' ? function (a, b) { return b.amount - a.amount; } : function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : b.amount - a.amount; });\n    var GRP = S.sort === 'date', cols = GRP ? [['종류', 30, ''], ['보낸 사람', 0, ''], ['금액', 26, 'n']] : [['날짜', 17, ''], ['종류', 28, ''], ['보낸 사람', 0, ''], ['금액', 24, 'n']];\n    document.getElementById('dcols').innerHTML = cols.map(function (c) { return '<col' + (c[1] ? ' style=\"width:' + c[1] + '%\"' : '') + '>'; }).join('');\n    document.getElementById('dth').innerHTML = '<tr>' + cols.map(function (c) { return '<th' + (c[2] ? ' class=\"' + c[2] + '\"' : '') + '>' + c[0] + '</th>'; }).join('') + '</tr>';\n    var gcur = '', gsum = {};\n    list.forEach(function (r) { var o = gsum[r.date] || (gsum[r.date] = { n: 0, s: 0 }); o.n++; o.s += r.amount; });\n    document.getElementById('tb').innerHTML = list.map(function (r) {\n      var gh = '';\n      if (GRP && r.date !== gcur) { gcur = r.date; gh = '<tr class=\"dg\"><td colspan=\"' + cols.length + '\">' + (+gcur.slice(5, 7)) + '월 ' + (+gcur.slice(8, 10)) + '일 (' + wdTxt(gcur) + ')<span>' + gsum[gcur].n + '건 · ' + num(gsum[gcur].s) + '원</span></td></tr>'; }\n      return gh + '<tr>' + (GRP ? '' : '<td class=\"d\">' + mdTxt(r.date) + '</td>') + '<td>' + incTag(r) + '</td><td>' + esc(r.sender) + '</td><td class=\"n' + (r.mode === '수입' ? ' amt-in' : '') + '\">+' + won(r.amount) + '</td></tr>';\n    }).join('') || '<tr><td colspan=\"' + cols.length + '\" class=\"empty\">이 기간에 입금이 없어요</td></tr>';\n    var inc = list.filter(function (r) { return r.mode === '수입'; }).reduce(function (a, r) { return a + r.amount; }, 0);\n    document.getElementById('tsum').textContent = list.length + '건 · 수입 ' + won(inc);\n    document.getElementById('more').style.display = 'none';\n  }\n\n  // 탭: 고른 탭만 보이게 (마지막에 본 탭은 이 브라우저에 기억)\n  var TAB_ICON = {\n    '달력': '<rect x=\"3.5\" y=\"5\" width=\"17\" height=\"15.5\" rx=\"3\"/><path d=\"M3.5 10h17M8 3v4M16 3v4\"/>',\n    '분석': '<path d=\"M5 20V11M12 20V5M19 20v-6\"/>',\n    '내역': '<path d=\"M8 6.5h12M8 12h12M8 17.5h12M4 6.5h.01M4 12h.01M4 17.5h.01\"/>',\n    '계획': '<rect x=\"5\" y=\"4\" width=\"14\" height=\"17\" rx=\"2.5\"/><path d=\"M9 4.5V3h6v1.5M8.5 12.5l2.2 2.2 4.8-4.8\"/>',\n    '자산': '<rect x=\"3\" y=\"6.5\" width=\"18\" height=\"13\" rx=\"3\"/><path d=\"M3 10h18M16.5 14.5h1.5\"/>',\n  };\n  function tabBar() {\n    var h = TABS.map(function (t) { return '<button data-t=\"' + t + '\" class=\"' + (S.tab === t ? 'on' : '') + '\"><svg viewBox=\"0 0 24 24\">' + TAB_ICON[t] + '</svg><span>' + t + '</span></button>'; }).join('');\n    document.getElementById('tabs').innerHTML = h;\n    document.getElementById('sideNav').innerHTML = h;\n    document.getElementById('grid').setAttribute('data-show', S.tab);\n    document.body.setAttribute('data-tab', S.tab);\n    document.getElementById('pageT').textContent = S.tab;\n    // 달력은 위 필터가 안 보여도 분류·출처가 걸려 있으면 그대로 적용됨 → 칩으로 표시 (누르면 해제)\n    var fc = document.getElementById('fchip'), on = S.tab === '달력' && (S.cat || S.src !== '전체');\n    fc.hidden = !on;\n    if (on) fc.innerHTML = [S.src !== '전체' ? esc(S.src) : '', S.cat ? esc(S.cat) : ''].filter(Boolean).join(' · ') + '<i>×</i>';\n  }\n  function setTab(t) {\n    if (TABS.indexOf(t) < 0) return;\n    S.tab = t; try { localStorage.setItem(TAB_KEY, t); } catch (e) {}\n    tabBar();\n    if (t === '계획') fitNums(document.getElementById('flowCard'));\n    if (t === '분석') Object.keys(charts).forEach(function (k) { charts[k].resize(); });   // 숨겨져 있던 차트 크기 다시 맞춤\n  }\n\n  // 달력: 기간이 한 달이면 그 달, 여러 달이면 마지막 달부터. ‹ › 는 달력 안에서만 한 달씩 (위 기간은 그대로)\n  // 숫자 = 그날 지출 합계 (위 구분·분류 선택 그대로 적용). 주황 = 하루 예산(월 예산 ÷ 그 달 일수)보다 많이 쓴 날\n  function calBlock() {\n    var key = W.from + '~' + W.to;\n    if (S.cmKey !== key) { S.cmKey = key; S.cm = W.to; S.day = null; }\n    var cm = S.cm, y = +cm.slice(0, 4), mo = +cm.slice(5, 7), first = new Date(y, mo - 1, 1).getDay(), dim = new Date(y, mo, 0).getDate();\n    var rows = ROWS.filter(bySrc).filter(byCat).filter(function (r) { return r.date.slice(0, 7) === cm; });\n    var day = {}, shop = {}, tot = 0;\n    rows.forEach(function (r) { if (r.amount > 0) { day[r.date] = (day[r.date] || 0) + r.amount; tot += r.amount; } if (r.src === '쿠팡' || r.src === '네이버') shop[r.date] = 1; });\n    var limit = +((DATA.gauge || {}).limit) || 0, perDay = limit / dim;\n    var incD = {}, showInc = !S.cat && S.src === '전체';   // 입금 중 처리 '수입'만 (분류·구분을 고르면 숨김)\n    if (showInc) incAll().forEach(function (r) { if (r.mode === '수입' && r.date.slice(0, 7) === cm) incD[r.date] = (incD[r.date] || 0) + r.amount; });\n    if (!S.day || S.day.slice(0, 7) !== cm) {\n      var has = Object.keys(day).sort();\n      S.day = cm === CUR ? TODAY : (has.length ? has[has.length - 1] : cm + '-01');\n    }\n    var nd = cm === CUR ? +TODAY.slice(8, 10) : dim;\n    var h = '<div class=\"ch\"><button class=\"cnav\" data-cm=\"-1\"' + (cm <= FIRST ? ' disabled' : '') + '>‹</button><h2>' + (y !== +CUR.slice(0, 4) ? y + '년 ' : '') + mo + '월' + (S.cat ? ' · ' + esc(S.cat) : '') + '</h2>'\n      + '<button class=\"cnav\" data-cm=\"1\"' + (cm >= CUR ? ' disabled' : '') + '>›</button></div>'\n      + '<div class=\"csum\">' + num(tot) + '원 · 하루 평균 ' + num(nd ? tot / nd : 0) + '원</div><div class=\"cg7\">';\n    '일월화수목금토'.split('').forEach(function (w, i) { h += '<div class=\"wd ' + (i === 0 ? 'su' : i === 6 ? 'sa' : '') + '\">' + w + '</div>'; });\n    for (var i = 0; i < first; i++) h += '<div></div>';\n    for (var d = 1; d <= dim; d++) {\n      var ds = cm + '-' + String(d).padStart(2, '0'), wd = (first + d - 1) % 7, v = day[ds], fu = ds > TODAY;\n      h += '<button class=\"cd' + (fu ? ' fu' : '') + (ds === TODAY ? ' td' : '') + (ds === S.day ? ' sel' : '') + '\" data-d=\"' + ds + '\"' + (fu ? ' disabled' : '') + '>'\n        + '<b class=\"' + (wd === 0 ? 'su' : wd === 6 ? 'sa' : '') + '\">' + d + '</b>' + (shop[ds] ? '<i class=\"cdot\"></i>' : '')\n        + (v ? '<em class=\"' + (!S.cat && perDay && v > perDay ? 'hi' : '') + '\">' + num(v) + '</em>' : '') + (incD[ds] ? '<em class=\"in\">+' + num(incD[ds]) + '</em>' : '') + '</button>';\n    }\n    h += '</div>';\n    document.getElementById('calBox').innerHTML = h;\n    dayList(rows);\n  }\n  // 그날 내역: 쿠팡·네이버는 주문 하나에 상품이 여럿이면 묶어서, 분류 태그를 누르면 상세 표와 같은 분류 바꾸기\n  // 그날 내역: 내역 탭과 같은 표 (분류 | 상품 | 금액), 구분(쿠팡·네이버·카드·계좌·직접)은 이름 옆 연한 글씨. 분류 태그 = 분류 바꾸기\n  function dayList(mrows) {\n    var ds = S.day, rs = mrows.filter(function (r) { return r.date === ds; }).sort(function (a, b) { return b.amount - a.amount; });\n    var t = rs.reduce(function (a, r) { return a + (r.amount > 0 ? r.amount : 0); }, 0), wdn = '일월화수목금토'.charAt(new Date(+ds.slice(0, 4), +ds.slice(5, 7) - 1, +ds.slice(8, 10)).getDay());\n    var h = '<h3>' + (+ds.slice(5, 7)) + '월 ' + (+ds.slice(8, 10)) + '일 (' + wdn + ')<span>' + num(t) + '원 · ' + rs.length + '건</span></h3>';\n    var ins = !S.cat && S.src === '전체' ? incAll().filter(function (r) { return r.date === ds && r.mode === '수입'; }) : [];\n    if (!rs.length && !ins.length) { document.getElementById('dayBox').innerHTML = h + '<div class=\"empty\">이날 지출이 없어요</div>'; return; }\n    h += '<table class=\"dt\"><colgroup><col style=\"width:26%\"><col><col style=\"width:24%\"></colgroup><tbody>' + ins.map(function (r) {\n      return '<tr><td>' + incTag(r, '입금') + '</td><td>' + esc(r.sender) + '</td><td class=\"n amt-in\">+' + num(r.amount) + '</td></tr>';\n    }).join('') + rs.map(function (r) {\n      var cx = r.amount === 0;\n      return '<tr><td><button class=\"tag tagbtn\" data-row=\"' + r.row + '\" style=\"background:' + COLOR[r.cat] + '1F;color:' + COLOR[r.cat] + '\">' + esc(r.cat) + '</button></td>'\n        + '<td' + (cx ? ' class=\"cx\"' : '') + '>' + esc(r.name) + '<span class=\"srcl\">' + esc(r.src) + '</span>' + whoTag(r) + '</td>'\n        + '<td class=\"n\">' + (cx ? '<span class=\"srcl\">' + esc(r.status || '취소') + '</span>' : num(r.amount)) + (r.a0 ? '<div class=\"was\">' + num(r.a0) + '</div>' : '') + '</td></tr>';\n    }).join('') + '</tbody></table>';\n    document.getElementById('dayBox').innerHTML = h;\n  }\n  // 분류 줄을 다시 그려도 고른 분류가 보이게 가운데로 (폰 1줄 스크롤용), 끝까지 밀면 흐림 해제\n  function catScroll() {\n    var el = document.getElementById('fCat'), on = el.querySelector('button.on');\n    if (el.scrollWidth > el.clientWidth && on) el.scrollLeft = Math.max(0, on.offsetLeft - el.offsetLeft - (el.clientWidth - on.offsetWidth) / 2);\n    catEnd();\n  }\n  function catEnd() { var el = document.getElementById('fCat'); el.classList.toggle('end', el.scrollLeft + el.clientWidth >= el.scrollWidth - 2); }\n  function byCat(r) { return !S.cat || r.cat === S.cat; }\n\n  // 위쪽 요약: 왼쪽 = 이번 달 예산(기간 선택과 무관), 오른쪽 = 선택 기간 지출·직전 대비·월평균\n  function top(A, srcRows, ALL) {\n    var G = DATA.gauge || { limit: 0, noti: null };\n    var limit = whoLimit(+G.limit || 0), day = +TODAY.slice(8, 10);\n    var mo = +CUR.slice(5, 7), dim = new Date(+CUR.slice(0, 4), mo, 0).getDate();\n    var spend = G.noti && S.who === 'me' ? G.noti.spend : ROWS.filter(function (r) { return byWho(r) && r.date.slice(0, 7) === CUR; }).reduce(function (a, r) { return a + r.amount; }, 0);\n    var left = limit - spend;\n    // 해당일 기준: 오늘 쓸 수 있는 돈 = (예산 − 어제까지 쓴 돈) ÷ 오늘 포함 남은 날\n    var curRows = ROWS.filter(function (r) { return byWho(r) && r.date.slice(0, 7) === CUR && r.amount > 0; });\n    var todaySp = curRows.filter(function (r) { return r.date === TODAY; }).reduce(function (a, r) { return a + r.amount; }, 0);\n    var before = spend - todaySp, remD = dim - day + 1, todayAllow = Math.max(0, (limit - before) / remD), noLeft = limit > 0 && todayAllow <= 0, tr = noLeft ? 2 : todayAllow ? todaySp / todayAllow : 0;   // noLeft = 이번 달 예산을 이미 다 씀 (2026-11-16: '/ 0 · 0%'로 여유처럼 보이던 문제)\n    var tst = tr > 1 ? ['over', '초과', '#E03131'] : tr > 0.9 ? ['warn', '빠듯', '#E8590C'] : ['ok', '여유', '#2F9E44'];\n    var f100 = function (n) { return num(Math.floor(n / 100) * 100); };\n\n    var edit = '<button class=\"edit\" id=\"editLimit\" title=\"예산 바꾸기\">✎</button>';\n    var leftTxt = left >= 0 ? num(left) : '-' + num(-left);\n    // 선택 기간 숫자\n    // 카드·계좌는 알림을 받기 시작한 뒤에만 있음 → 그 전 달과 비교·평균할 때는 양쪽 다 구매만 (같은 기준끼리)\n    var sumW = function (w, buyOnly) { return srcRows.filter(function (r) { return r.amount > 0 && inWin(r, w) && (!buyOnly || r.src !== NS); }).reduce(function (s, r) { return s + r.amount; }, 0); };\n    var short = W.n === 1 ? (+W.from.slice(5)) + '월' : ymText(W.from, 1) + '~' + ymText(W.to, 1);\n    var label = (S.cat ? S.cat + ' ' : '') + short;\n    var dHtml = '—', cmpTxt = '';\n    if (W.cmp && W.cmp.from >= FIRST) {\n      var bo = !!NFULL && W.cmp.from < NFULL && S.src !== NS;\n      var cur = sumW({ from: W.from, to: W.to, cut: W.cut }, bo), before = sumW(W.cmp, bo), d = before ? (cur - before) / before : null;\n      if (d !== null) dHtml = '<span class=\"' + (d >= 0 ? 'up' : 'down') + '\">' + (d >= 0 ? '+' : '') + (d * 100).toFixed(0) + '%</span>';\n      cmpTxt = (W.n === 1 ? (+W.cmp.from.slice(5)) + '월' : ymText(W.cmp.from, 1) + '~' + ymText(W.cmp.to, 1)) + (W.cut ? ' ' + (+W.cut) + '일까지' : '') + (bo ? ' · 구매만' : '');\n    }\n    var f12 = addMonth(CUR, -12) < FIRST ? FIRST : addMonth(CUR, -12), n12 = mdiff(f12, CUR);\n    var af = NFULL && NFULL > f12 ? NFULL : f12, nfm = mdiff(af, CUR), avgBo = !!NFULL && nfm < 1;   // 카드·계좌까지 다 있는 끝난 달이 없으면 구매만\n    var avg12 = avgBo ? (n12 > 0 ? sumW({ from: f12, to: addMonth(CUR, -1) }, true) / n12 : 0) : (NFULL ? nfm : n12) > 0 ? sumW({ from: af, to: addMonth(CUR, -1) }) / (NFULL ? nfm : n12) : 0;\n    var nsum = A.kpi.total && S.src !== NS ? base0(srcRows).filter(function (r) { return r.src === NS; }).reduce(function (s, r) { return s + r.amount; }, 0) : 0;\n    var stat = [[label + ' 지출', num(A.kpi.total), nsum ? '카드·계좌 ' + man(nsum) : ''], ['직전 대비', dHtml, cmpTxt], [(S.cat ? S.cat + ' ' : '') + '월평균', S.src === NS && avgBo ? '—' : man(avg12), avgBo && S.src !== NS ? '구매만' : '']];\n    var h = '<div class=\"t1\"><div class=\"gp\">'\n      + (function () {\n          if (!limit) return '<div class=\"g-row\"><span class=\"g-k\"><b>' + mo + '월</b></span></div><div class=\"brow\"><span class=\"lb\">이번 달</span><div class=\"nums\"><b>' + num(spend) + '</b></div></div>';\n          var allow = limit * day / dim, mst = spend > allow ? ['over', '#E8590C'] : ['ok', '#2F9E44'];   // 이번 달: 오늘까지 계획보다 많이 썼으면 주황 (2026-11-13 빨강 → 주황)\n          var mr = Math.min(100, spend / limit * 100), trp = Math.min(100, tr * 100);\n          // 막대 안 %: 검은 글씨 위에 흰 글씨를 칠해진 폭만큼만 겹침 → 비율과 상관없이 읽힘\n          var bar = function (w, color, label) { return '<div class=\"gbar in\"><div class=\"fill\" style=\"width:' + w.toFixed(1) + '%;background:' + color + '\"></div>'\n            + '<div class=\"tx\">' + label + '</div><div class=\"tx w\" aria-hidden=\"true\" style=\"clip-path:inset(0 ' + (100 - w).toFixed(1) + '% 0 0)\">' + label + '</div></div>'; };\n          // 계좌 줄: 생활계좌 마지막 알림 잔액 · 카드 미결제(승인 합계) · 누적(카드 알림 값). 어디서도 빼지 않음 — 카드대금은 다른 통장에서 나감\n          var kb = DATA.kbBal, cd = DATA.card;\n          // 카드 = 다음 출금 예정(추정)이 있는 첫 결제일 (수입.gs dashCardBills_). 없으면 예전처럼 승인 합계\n          var nb = cd && cd.bills ? cd.bills.filter(function (b) { return b.state !== 'wait'; })[0] : null;\n          var cTxt = nb ? '카드 ' + mdTxt(nb.due) + ' ' + num(nb.amt) : cd ? '카드 ' + num(cd.unpaid) : '';\n          var info = (kb != null || cTxt) ? '<div class=\"brow\"><span class=\"lb\">계좌</span><div class=\"infoln\"><span>' + (kb != null ? '생활 ' + num(kb) : '') + '</span><span>' + cTxt + '</span></div></div>' : '';\n          return '<div class=\"g-row\"><span class=\"g-k\" id=\"limK\"><b>' + mo + '월</b>' + (G.src === '계획' ? '' : edit) + '</span><span class=\"pill ' + tst[0] + '\">오늘 ' + tst[1] + '</span></div>'\n            + '<div class=\"brow\"><span class=\"lb\">이번 달</span><div class=\"nums\"><b>' + num(spend) + '</b><span>/ ' + num(limit) + '</span></div>'\n            + bar(mr, mst[1], Math.round(spend / limit * 100) + '%') + '</div>'\n            + info\n            + '<div class=\"brow\"><span class=\"lb\">오늘</span><div class=\"nums\"><b>' + num(todaySp) + '</b>' + (noLeft ? '<span style=\"color:#E03131;font-weight:700\">−' + num(spend - limit) + '</span>' : '<span>/ ' + f100(todayAllow) + '</span>') + '</div>'\n            + bar(trp, tst[2], noLeft ? '초과' : Math.round(tr * 100) + '%') + '</div>';\n        })()\n      + '</div></div>';\n    document.getElementById('gauge').innerHTML = h;\n    // PC 왼쪽 메뉴 아래 이번 달 요약 (게이지와 같은 숫자·색)\n    var sb = document.getElementById('sideBud');\n    if (sb) { var allowS = limit * day / dim; sb.innerHTML = '<span class=\"k\">이번 달</span><b>' + num(spend) + '</b>' + (limit ? '<i>/ ' + num(limit) + '</i><div class=\"bar\"><s style=\"width:' + Math.min(100, spend / limit * 100).toFixed(1) + '%;background:' + (spend > allowS ? '#E8590C' : '#2F9E44') + '\"></s></div>' : ''); }   // 예산 없음(계획 탭 비어 있음) → 금액만 (2026-11-17)\n  }\n\n  // 계획 대비 (계획.gs가 계산한 월별 결과). 단일 월을 고르면 그 달, 여러 달이면 마지막 달\n  var PST = { ok: ['입금 ✓', 's-ok'], diff: ['금액 다름', 's-over'], wait: ['아직', 's-wait'], miss: ['없음', 's-over'], none: ['알림 전', 's-wait'], over: ['초과', 's-over'], under: ['이내', 's-under'], nodata: ['기록 없음', 's-wait'] };\n  function base0(rows) { return rows.filter(function (r) { return r.amount > 0 && inPeriod(r); }); }\n  function planMonth() { return W.n === 1 ? W.from : W.to; }\n  function planData() { var P = DATA.plan; if (!P) return null; if (P.error) return { error: P.error }; return (P.months || {})[planMonth()] || null; }\n  function planCount(d) {\n    var c = function (g, f) { return d.rows.filter(function (r) { return r.grp === g && f(r); }).length; };\n    return { inOk: c('입금', function (r) { return r.actual != null; }), inAll: c('입금', function () { return true; }),\n      fxOk: c('고정지출', function (r) { return r.actual != null; }), fxAll: c('고정지출', function () { return true; }),\n      warn: d.rows.filter(function (r) { return r.status === 'over' || r.status === 'diff' || r.status === 'miss'; }).length };\n  }\n  function planLine() {\n    var d = planData(); if (!d) return '';\n    if (d.error) return '<div class=\"sr pl-row\" id=\"planLine\"><span class=\"k\">계획 대비</span><b class=\"warn\">읽기 오류</b></div>';\n    var n = planCount(d);\n    return '<div class=\"sr pl-row\" id=\"planLine\"><span class=\"k\">계획 대비 <i>입금 ' + n.inOk + '/' + n.inAll + ' · 출금 ' + n.fxOk + '/' + n.fxAll + '</i></span>'\n      + (n.warn ? '<b class=\"warn\">확인 ' + n.warn + ' ▾</b>' : '<b style=\"color:var(--sub)\">▾</b>') + '</div>';\n  }\n  function planBlock() {\n    var d = planData(), body = document.getElementById('planBody'), st = document.getElementById('planSt'), m = planMonth();\n    if (!d) { st.textContent = ''; body.innerHTML = '<div class=\"empty\">' + (DATA.plan && DATA.plan.empty ? '시트 계획 탭을 채우면 보입니다' : DATA.plan ? '최근 12개월만 비교' : '계획 없음') + '</div>'; return; }\n    if (d.error) { st.innerHTML = '<b>읽기 오류</b>'; body.innerHTML = '<div class=\"empty\">' + esc(d.error) + '</div>'; return; }\n    var n = planCount(d);\n    st.innerHTML = (+m.slice(5)) + '월 · 입금 ' + n.inOk + '/' + n.inAll + ' · 출금 ' + n.fxOk + '/' + n.fxAll + (n.warn ? ' · 확인 <b>' + n.warn + '</b>' : '');\n    var grp = '', h = '<table class=\"pt\"><thead><tr><th>항목</th><th class=\"dd\">날짜</th><th class=\"hm\">계획</th><th>실제</th><th>차이</th><th></th></tr></thead><tbody>';\n    // 정기결제 탭(정기결제.gs): 이번 달이면 예정일(휴일 반영)·예정/오늘/없음/동기화 전으로 상태를 보완 — 결제가 확인된 줄(입금 ✓·출금 ✓·금액 다름·초과·이내)은 그대로\n    var REC = (DATA.plan && DATA.plan.rec && DATA.plan.recMonth === m) ? DATA.plan.rec : {};\n    d.rows.forEach(function (r) {\n      if (r.grp !== grp) { grp = r.grp; h += '<tr class=\"grp\"><td colspan=\"6\">' + grp + '</td></tr>'; }\n      var x = r.actual == null || r.plan == null ? null : r.actual - r.plan, s = PST[r.status] || ['', ''], pl = r.plan == null ? '' : num(r.plan);\n      if (r.status === 'ok' && r.grp !== '입금') s = ['출금 ✓', 's-ok'];\n      if (r.status === 'none' && !DATA.notiFrom) s = ['', ''];   // 알림 앱이 없으면 결제 여부를 모름 → 예정일만\n      var q = r.grp !== '입금' ? REC[r.name] : null, dayTxt = r.day ? r.day + '일' : '', act = r.actual == null ? '<span class=\"s-wait\">—</span>' : num(r.actual);\n      if (q) {\n        if (q.dayLabel) dayTxt = q.dayLabel;\n        if (q.label && r.actual == null && (r.status === 'wait' || r.status === 'nodata' || r.status === 'miss' || r.status === 'none') && !q.nodateKeep) s = [q.label, q.cls];\n        if (q.syncAmt != null && r.actual == null) act = '<span class=\"s-wait\">' + num(q.syncAmt) + '</span>';\n      }\n      h += '<tr class=\"pe\" data-n=\"' + esc(r.name) + '\"><td>' + esc(r.name) + '</td><td class=\"dd\">' + dayTxt + '</td><td class=\"hm\">' + pl + '</td>'\n        + '<td>' + act + (pl ? '<div class=\"pm\">계획 ' + pl + '</div>' : '') + '</td>'\n        + '<td>' + (x ? '<span class=\"' + (x > 0 ? 's-over' : 's-under') + '\">' + (x > 0 ? '+' : '') + num(x) + '</span>' : '') + '</td><td class=\"' + s[1] + '\">' + s[0] + '</td></tr>';\n    });\n    // 합계 (2026-11-16): 고정·저축 / 쓰는 돈(예산 = 게이지와 같은 숫자). 쓰는 돈 아래 '계획 밖' = 예산 − 쓰는 돈 계획 합, 실제 = 이달 지출 − 항목에 잡힌 지출\n    var S1 = function (a, f) { return a.reduce(function (t, r) { return t + (f(r) || 0); }, 0); };\n    var fxR = d.rows.filter(function (r) { return r.grp !== '입금' && r.grp !== '쓰는 돈' && r.plan != null; }), spAll = d.rows.filter(function (r) { return r.grp === '쓰는 돈'; });\n    var fxP = S1(fxR, function (r) { return r.plan; }), fxA = S1(fxR, function (r) { return r.actual; }), spP = S1(spAll, function (r) { return r.plan; }), spA = S1(spAll, function (r) { return r.actual; });\n    var incP = S1(d.rows.filter(function (r) { return r.grp === '입금' && !r.extra; }), function (r) { return r.plan; });\n    var bud = m === CUR && DATA.gauge && +DATA.gauge.limit > 0 ? +DATA.gauge.limit : incP > 0 ? incP - fxP : spP;\n    var used = ROWS.filter(function (r) { return !r.owner && r.date.slice(0, 7) === m; }).reduce(function (a, r) { return a + r.amount; }, 0);\n    var free = bud > 0 ? bud - spP : 0, freeA = Math.max(0, used - spA);\n    if (free || freeA) h += '<tr><td>계획 밖</td><td class=\"dd\"></td><td class=\"hm\">' + (free ? num(free) : '') + '</td><td>' + (freeA ? num(freeA) : '<span class=\"s-wait\">—</span>') + (free ? '<div class=\"pm\">계획 ' + num(free) + '</div>' : '') + '</td>'\n      + '<td>' + (free && freeA > free ? '<span class=\"s-over\">+' + num(freeA - free) + '</span>' : '') + '</td><td></td></tr>';\n    var ft = function (t, p, a, pl) { return '<tr><td>' + t + '</td><td class=\"dd\"></td><td class=\"hm\">' + num(p) + '</td><td>' + num(a) + '<div class=\"pm\">' + pl + ' ' + num(p) + '</div></td><td></td><td></td></tr>'; };\n    h += '</tbody><tfoot>' + (fxR.length ? ft('고정·저축', fxP, fxA, '계획') : '') + ft('쓰는 돈', bud > 0 ? bud : spP, used, bud > 0 ? '예산' : '계획') + '</tfoot></table>';\n    body.innerHTML = h;\n  }\n\n  /* ---------- 자산 (계좌.gs, 2026-11-15) ---------- */\n  function assetBlock() {\n    var A = DATA.assets, top = document.getElementById('assetTop'), list = document.getElementById('assetList');\n    if (!top) return;\n    if (!A || A.error) { top.innerHTML = '<div class=\"empty\">' + esc(A && A.error ? A.error : '—') + '</div>'; list.innerHTML = ''; return; }\n    var tot = A.assets + A.debt || 1, neg = function (v) { return '<span class=\"neg\">-' + num(v) + '</span>'; };\n    top.innerHTML = '<div class=\"k\" style=\"color:var(--sub);font-size:0.8125rem\">순자산</div><div class=\"asn\">' + (A.net < 0 ? '-' : '') + num(Math.abs(A.net)) + '</div>'\n      + '<div class=\"asbar\"><i style=\"width:' + (A.assets * 100 / tot).toFixed(1) + '%;background:var(--accent)\"></i><i style=\"width:' + (A.debt * 100 / tot).toFixed(1) + '%;background:#E8344E\"></i></div>'\n      + '<div class=\"asr\"><span><span class=\"dot\" style=\"background:var(--accent)\"></span>자산</span><b>' + num(A.assets) + '</b></div>'\n      + '<div class=\"asr\"><span><span class=\"dot\" style=\"background:#E8344E\"></span>부채</span><b class=\"neg\">-' + num(A.debt) + '</b></div>';\n    var h = '<table class=\"ast\">', g = function (t, v, isNeg) { h += '<tr class=\"g\"><td>' + t + '</td><td class=\"n\">' + (isNeg ? neg(v) : num(v)) + '</td></tr>'; };\n    if (A.accts.length) {\n      g('통장', A.accts.reduce(function (a, x) { return a + (x.bal || 0); }, 0));\n      A.accts.forEach(function (x) { h += '<tr class=\"pe\" data-k=\"bank\" data-r=\"' + x.row + '\" data-key=\"' + esc(x.tail) + '\"><td>' + esc(x.bank) + ' ' + esc(x.tail) + '<span class=\"s\">' + esc(x.role) + '</span>' + (x.at ? '<div class=\"s\" style=\"margin:0.125rem 0 0\">' + esc(x.at) + '</div>' : '') + '</td><td class=\"n\">' + (x.bal == null ? '<span class=\"s\">—</span>' : num(x.bal)) + '</td></tr>'; });\n    }\n    if (A.others.length) {\n      g('기타 자산', A.others.reduce(function (a, x) { return a + x.amt; }, 0));\n      A.others.forEach(function (x) { h += '<tr><td>' + esc(x.name) + '</td><td class=\"n\">' + num(x.amt) + '</td></tr>'; });\n    }\n    if (A.loans.length) {\n      g('대출', A.debt, true);\n      A.loans.forEach(function (x) { h += '<tr class=\"pe\" data-k=\"loan\" data-r=\"' + x.row + '\" data-key=\"' + esc(x.name) + '\"><td>' + esc(x.name) + (x.end ? '<span class=\"s\">' + esc(x.end) + '</span>' : '') + '</td><td class=\"n\">' + neg(x.cur) + '</td></tr>'; });\n    }\n    list.innerHTML = h + '</table>';\n  }\n\n  function mk(id, cfg) { if (charts[id]) charts[id].destroy(); charts[id] = new Chart(document.getElementById(id), cfg); return charts[id]; }\n\n  // 분류 하나만 볼 때: 막대 위 금액 + 월평균 점선\n  var barLabels = { id: 'barLabels', afterDatasetsDraw: function (c) {\n    var ctx = c.ctx; ctx.save(); ctx.font = '600 11px ' + Chart.defaults.font.family; ctx.fillStyle = '#333D4B'; ctx.textAlign = 'center';\n    c.getDatasetMeta(0).data.forEach(function (el, i) { var v = c.data.datasets[0].data[i]; if (v > 0) ctx.fillText(man(v), el.x, el.y - 6); });\n    ctx.restore();\n  } };\n  var avgLine = { id: 'avgLine', afterDatasetsDraw: function (c) {\n    var avg = c.config.options.avgValue; if (!avg) return;\n    var y = c.scales.y.getPixelForValue(avg), a = c.chartArea, ctx = c.ctx;\n    ctx.save(); ctx.strokeStyle = '#868E96'; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(a.left, y); ctx.lineTo(a.right, y); ctx.stroke();\n    ctx.setLineDash([]); ctx.fillStyle = '#495057'; ctx.font = '600 11px ' + Chart.defaults.font.family; ctx.textAlign = 'right'; ctx.fillText('월평균 ' + man(avg), a.right, y - 5);\n    ctx.restore();\n  } };\n\n  function monthChart(A) {\n    document.getElementById('mTitle').textContent = S.cat ? S.cat + ' 월별 지출' : '월별 지출';\n    document.getElementById('mHint').style.display = 'none';\n    var oneYear = A.months.length && A.months[0].slice(0, 4) === A.months[A.months.length - 1].slice(0, 4);\n    var labels = A.months.map(function (m) { return oneYear ? (+m.slice(5)) + '월' : m.slice(2).replace('-', '.'); });\n    var ds = CAT_ORDER.filter(function (c) { return A.monthly.some(function (o) { return o[c] > 0; }); }).map(function (c) {\n      return { label: c, data: A.monthly.map(function (o) { return o[c]; }), backgroundColor: A.months.map(function (m) { return m >= W.from && m <= W.to ? COLOR[c] : COLOR[c] + '38'; }), stack: 's', maxBarThickness: 46 };\n    });\n    mk('cMonth', {\n      type: 'bar', data: { labels: labels, datasets: ds },\n      plugins: S.cat ? [barLabels, avgLine] : [],\n      options: {\n        avgValue: S.cat ? A.kpi.monthlyAvg : 0,\n        layout: { padding: { top: S.cat ? 18 : 0 } },\n        maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },\n        scales: { x: { stacked: true, grid: { display: false }, ticks: { maxRotation: 0, autoSkip: true } }, y: { stacked: true, ticks: { callback: function (v) { return man(v); } }, grid: { color: '#F1F3F5' } } },\n        plugins: {\n          legend: { display: !S.cat, position: 'bottom', labels: { usePointStyle: true, pointStyle: 'circle', boxWidth: 8, padding: 14 } },\n          tooltip: { filter: function (i) { return i.raw > 0; }, callbacks: { label: function (c) { return ' ' + c.dataset.label + ' ' + won(c.raw); }, footer: function (items) { return S.cat ? '' : '합계 ' + won(A.monthly[items[0].dataIndex].total); } } },\n        },\n        onClick: function (e, els) { if (!els.length) return; var m = A.months[els[0].index]; S.period = m === CUR ? 'm1' : m === addMonth(CUR, -1) ? 'prev' : 'month'; S.ym = m; S.limit = 30; render(); },\n      },\n    });\n  }\n\n  function itemBlock(rows) {\n    var card = document.getElementById('itemCard');\n    if (!S.cat) { card.style.display = 'none'; return; }\n    card.style.display = '';\n    var m = {};\n    rows.forEach(function (r) {\n      if (r.amount <= 0 || r.name === '배송비') return;\n      var k = String(r.name).split(',')[0].trim();\n      var o = m[k] || (m[k] = { item: k, amount: 0, days: {} }); o.amount += r.amount; o.days[r.date] = 1;\n    });\n    var list = Object.keys(m).map(function (k) { return { item: k, amount: m[k].amount, times: Object.keys(m[k].days).length }; }).sort(function (a, b) { return b.amount - a.amount; });\n    var total = list.reduce(function (s, o) { return s + o.amount; }, 0), top = list.slice(0, 10), max = top.length ? top[0].amount : 1;\n    document.getElementById('itTitle').textContent = S.cat + ' 많이 산 품목 TOP ' + top.length + ' (전체 ' + list.length + '종)';\n    document.getElementById('items').innerHTML = top.map(function (o, i) {\n      return '<div class=\"it\"><span class=\"rk\">' + (i + 1) + '</span><span class=\"nm\" title=\"' + esc(o.item) + '\">' + esc(o.item) + '</span><span class=\"am\">' + won(o.amount) + '</span>'\n        + '<div class=\"mt\"><span>' + o.times + '회 · ' + (total ? (o.amount / total * 100).toFixed(1) : 0) + '%</span><div class=\"bar\"><i style=\"width:' + (o.amount / max * 100) + '%;background:' + COLOR[S.cat] + '\"></i></div></div></div>';\n    }).join('') || '<div class=\"empty\">' + (S.cat === '기타' ? '분류 안 된 상품 없음' : '이 기간에 ' + esc(S.cat) + ' 지출이 없어요') + '</div>';\n  }\n\n  function catBlock(A) {\n    var total = A.kpi.total;\n    document.getElementById('catTotal').textContent = man(total) + '원';\n    mk('cCat', {\n      type: 'doughnut',\n      data: { labels: A.cats.map(function (o) { return o.cat; }), datasets: [{ data: A.cats.map(function (o) { return o.amount; }), backgroundColor: A.cats.map(function (o) { return !S.cat || S.cat === o.cat ? COLOR[o.cat] : COLOR[o.cat] + '40'; }), borderWidth: 2, borderColor: '#fff' }] },\n      options: { maintainAspectRatio: false, cutout: '64%', plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return ' ' + c.label + ' ' + won(c.raw); } } } },\n        onClick: function (e, els) { if (!els.length) return; var c = A.cats[els[0].index].cat; S.cat = S.cat === c ? null : c; S.limit = 30; render(); } },\n    });\n    var max = A.cats.length ? A.cats[0].amount : 1;\n    var el = document.getElementById('catList');\n    el.innerHTML = A.cats.map(function (o) {\n      return '<div class=\"cat' + (S.cat === o.cat ? ' on' : '') + '\" data-c=\"' + esc(o.cat) + '\"><span class=\"dot\" style=\"background:' + COLOR[o.cat] + '\"></span><span class=\"nm\">' + esc(o.cat) + ' <span style=\"color:var(--sub);font-weight:400;font-size:12px\">' + o.lines + '개</span></span><span class=\"am\">' + won(o.amount) + '</span><span class=\"sh\">' + (o.share * 100).toFixed(1) + '%</span>'\n        + '<div class=\"bar\"><i style=\"width:' + (o.amount / max * 100) + '%;background:' + COLOR[o.cat] + '\"></i></div></div>';\n    }).join('') || '<div class=\"empty\">이 기간에 지출이 없어요</div>';\n    el.onclick = function (e) { var d = e.target.closest('.cat'); if (!d) return; var c = d.dataset.c; S.cat = S.cat === c ? null : c; S.limit = 30; render(); };\n  }\n\n  // 직전 같은 길이 기간과 비교 (2026-11-16 사용자 C). 이번 달이면 직전도 같은 날까지. 직전 기간에 카드·계좌 기록이 없으면 양쪽 다 구매만\n  function cmpBlock(rows) {\n    var card = document.getElementById('cmpCard'), cc = document.getElementById('ccCard');\n    var C = W.cmp, gone = !C || C.from < FIRST || (S.src === NS && NFULL && C.from < NFULL);\n    card.style.display = cc.style.display = gone ? 'none' : '';\n    if (gone) { card.innerHTML = cc.innerHTML = ''; return; }\n    var bo = !!NFULL && C.from < NFULL && S.src !== NS, cur = { from: W.from, to: W.to, cut: W.cut };\n    var ok = function (r) { return r.amount > 0 && (!bo || r.src !== NS); };\n    var sum = function (w, cat) { return rows.reduce(function (s, r) { return ok(r) && (!cat || r.cat === cat) && inWin(r, w) ? s + r.amount : s; }, 0); };\n    var lab = function (w) {\n      if (w.from === w.to) { var m = +w.from.slice(5); return w.cut ? m + '.1 ~ ' + m + '.' + (+w.cut) : m + '월'; }\n      return ymText(w.from, 1) + ' ~ ' + ymText(w.to, 1) + (w.cut ? '.' + (+w.cut) : '');\n    };\n    var sg = function (n) { return n > 0 ? '+' + num(n) : n < 0 ? '−' + num(-n) : '0'; };\n    var cl = function (n) { return n > 0 ? 'up' : n < 0 ? 'down' : 'zero'; };\n    var a = sum(cur, S.cat), b = sum(C, S.cat), d = a - b, mx = Math.max(a, b) || 1;\n    card.innerHTML = '<div class=\"r1\"><b>' + (S.cat ? esc(S.cat) + ' ' : '') + lab(cur) + '</b><span>' + lab(C) + ' 대비</span>' + (bo ? '<span class=\"pill\">구매만</span>' : '') + '</div>'\n      + '<div class=\"r2\"><span class=\"d ' + cl(d) + '\">' + sg(d) + '원</span>' + (b ? '<span class=\"pc ' + cl(d) + '\">' + (d >= 0 ? '+' : '−') + Math.abs(d / b * 100).toFixed(1) + '%</span>' : '') + '</div>'\n      + '<div class=\"bl\"><span class=\"k\">이번</span><span class=\"t\"><i style=\"width:' + (a / mx * 100) + '%;background:#191F28\"></i></span><span class=\"v\">' + won(a) + '</span></div>'\n      + '<div class=\"bl\"><span class=\"k\">직전</span><span class=\"t\"><i style=\"width:' + (b / mx * 100) + '%;background:#ADB5BD\"></i></span><span class=\"v p\">' + won(b) + '</span></div>';\n    if (S.cat) { cc.style.display = 'none'; cc.innerHTML = ''; return; }   // 분류 하나를 고르면 위 카드가 그 분류 비교\n    var by = {};\n    rows.forEach(function (r) {\n      if (!ok(r)) return;\n      var k = inWin(r, cur) ? 0 : inWin(r, C) ? 1 : -1; if (k < 0) return;\n      (by[r.cat] = by[r.cat] || [0, 0])[k] += r.amount;\n    });\n    var list = Object.keys(by).map(function (c) { return { c: c, a: by[c][0], b: by[c][1], d: by[c][0] - by[c][1] }; })\n      .sort(function (x, y) { return Math.abs(y.d) - Math.abs(x.d) || y.a - x.a; });\n    var m2 = Math.max.apply(null, list.map(function (o) { return Math.max(o.a, o.b); }).concat([1]));\n    cc.innerHTML = '<h2>분류별 비교</h2><div class=\"lg\"><span><i style=\"background:#191F28\"></i>이번</span><span><i style=\"background:#ADB5BD\"></i>직전</span></div>'\n      + (list.map(function (o) {\n        return '<div class=\"row\" data-c=\"' + esc(o.c) + '\"><div class=\"hd\"><span class=\"dot\" style=\"background:' + (COLOR[o.c] || '#868E96') + '\"></span>' + esc(o.c) + '<span class=\"dd ' + cl(o.d) + '\">' + sg(o.d) + '</span></div>'\n          + '<div class=\"pb\"><span class=\"t\"><i style=\"width:' + (o.a / m2 * 100) + '%;background:' + (COLOR[o.c] || '#868E96') + '\"></i></span><span class=\"v\">' + num(o.a) + '</span></div>'\n          + '<div class=\"pb\"><span class=\"t\"><i style=\"width:' + (o.b / m2 * 100) + '%;background:#ADB5BD\"></i></span><span class=\"v p\">' + num(o.b) + '</span></div></div>';\n      }).join('') || '<div class=\"empty\">두 기간 모두 지출이 없어요</div>');\n    cc.onclick = function (e) { var r = e.target.closest('.row'); if (!r) return; S.cat = r.dataset.c; S.limit = 30; render(); };\n  }\n\n  function repBlock(A) {\n    var list = A.repeat.slice().sort(function (a, b) { return rank(a) - rank(b) || b.total - a.total; }).slice(0, 10);\n    function rank(o) { return o.late < 0 ? 1 : o.late <= ANA.LATE_DAYS ? 0 : 2; }\n    document.getElementById('rep').innerHTML = list.map(function (o) {\n      var b = o.late < 0 ? '<span class=\"badge b-next\">D-' + (-o.late) + ' · ' + o.next.slice(5).replace('-', '/') + '</span>'\n        : o.late <= ANA.LATE_DAYS ? '<span class=\"badge b-late\">살 때 지남 ' + o.late + '일</span>'\n        : '<span class=\"badge b-stop\">중단?</span>';\n      return '<div class=\"rp\"><div class=\"t\" title=\"' + esc(o.item) + '\">' + esc(o.item) + '</div>' + b + '<div class=\"m\">' + o.times + '회 · 평균 ' + o.gap + '일 간격 · 마지막 ' + o.last.slice(5).replace('-', '/') + ' · 총 ' + won(o.total) + '</div></div>';\n    }).join('') || '<div class=\"empty\">3회 이상 산 품목이 없어요</div>';\n  }\n\n  function smallCharts(A) {\n    mk('cWd', {\n      type: 'bar', data: { labels: A.weekday.map(function (o) { return o.label; }), datasets: [{ data: A.weekday.map(function (o) { return o.amount; }), backgroundColor: '#4C6EF5', borderRadius: 6, maxBarThickness: 34 }] },\n      options: { maintainAspectRatio: false, scales: { x: { grid: { display: false } }, y: { ticks: { callback: function (v) { return man(v); } }, grid: { color: '#F1F3F5' } } },\n        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { var o = A.weekday[c.dataIndex]; return ' ' + won(o.amount) + ' · 주문 ' + o.orders + '건 · 주문당 ' + won(o.perOrder); } } } } },\n    });\n    mk('cBk', {\n      type: 'bar', data: { labels: A.buckets.map(function (o) { return o.label; }), datasets: [{ data: A.buckets.map(function (o) { return o.share * 100; }), backgroundColor: '#20C997', borderRadius: 6, maxBarThickness: 34 }] },\n      options: { indexAxis: 'y', maintainAspectRatio: false, scales: { x: { ticks: { callback: function (v) { return v + '%'; } }, grid: { color: '#F1F3F5' } }, y: { grid: { display: false } } },\n        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { var o = A.buckets[c.dataIndex]; return ' 지출의 ' + (o.share * 100).toFixed(1) + '% · 주문 ' + o.orders + '건 · ' + won(o.amount); } } } } },\n    });\n  }\n\n  function detail(base) {\n    var sw = document.getElementById('flowSw');\n    if (!DATA.notiFrom) S.flow = '지출';   // 알림 앱이 없으면 입금 내역 없음 → 전환 버튼 숨김\n    sw.style.display = DATA.notiFrom ? '' : 'none';\n    sw.innerHTML = ['지출', '입금'].map(function (f) { return '<button data-f=\"' + f + '\" class=\"' + (S.flow === f ? 'on' : '') + '\">' + f + '</button>'; }).join('');\n    if (S.flow === '입금') { document.getElementById('chips').innerHTML = ''; incDetail(); return; }\n    var q = S.q.trim().toLowerCase();\n    var list = base.filter(function (r) { return (!S.cat || r.cat === S.cat) && (!q || r.name.toLowerCase().indexOf(q) >= 0); });\n    list.sort(S.sort === 'amount' ? function (a, b) { return b.amount - a.amount; } : function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : b.amount - a.amount; });\n    var chips = [];\n    if (S.cat) chips.push('<span class=\"chip\" data-x=\"cat\">' + esc(S.cat) + ' ✕</span>');\n    var ce = document.getElementById('chips'); ce.innerHTML = chips.join(' ');\n    ce.onclick = function (e) { var c = e.target.closest('.chip'); if (!c) return; S[c.dataset.x] = null; render(); };\n    // 열: 최신순이면 날짜 열 대신 날짜 머리줄, 폰이면 구분 열 없음(이름 옆 작은 글씨)\n    var GRP = S.sort === 'date', M = window.innerWidth <= 520, gcur = '', wk7 = '일월화수목금토', gsum = {};\n    var cols = [], W_ = M ? { d: 17, s: 0, c: 26, a: 24 } : { d: 11, s: 9, c: 13, a: 14 };\n    if (!GRP) cols.push(['주문일', W_.d, '']);\n    if (!M) cols.push(['구분', W_.s, '']);\n    cols.push(['분류', W_.c, ''], ['상품', 0, ''], ['금액', W_.a, 'n']);\n    document.getElementById('dcols').innerHTML = cols.map(function (c) { return '<col' + (c[1] ? ' style=\"width:' + c[1] + '%\"' : '') + '>'; }).join('');\n    document.getElementById('dth').innerHTML = '<tr>' + cols.map(function (c) { return '<th' + (c[2] ? ' class=\"' + c[2] + '\"' : '') + '>' + c[0] + '</th>'; }).join('') + '</tr>';\n    if (GRP) list.forEach(function (r) { var o = gsum[r.date] || (gsum[r.date] = { n: 0, s: 0 }); o.n++; o.s += r.amount > 0 ? r.amount : 0; });\n    document.getElementById('tb').innerHTML = list.map(function (r) {\n      var cx = r.amount === 0, gh = '';\n      if (GRP && r.date !== gcur) { gcur = r.date; var dt = new Date(+gcur.slice(0, 4), +gcur.slice(5, 7) - 1, +gcur.slice(8, 10));\n        gh = '<tr class=\"dg\"><td colspan=\"' + cols.length + '\">' + (+gcur.slice(5, 7)) + '월 ' + (+gcur.slice(8, 10)) + '일 (' + wk7.charAt(dt.getDay()) + ')<span>' + gsum[gcur].n + '건 · ' + num(gsum[gcur].s) + '원</span></td></tr>'; }\n      return gh + '<tr>' + (GRP ? '' : '<td class=\"d\">' + (M ? r.date.slice(5).replace('-', '.') : r.date.slice(2).replace(/-/g, '.')) + '</td>') + (M ? '' : '<td>' + esc(r.src) + '</td>')\n        + '<td><button class=\"tag tagbtn\" data-row=\"' + r.row + '\" style=\"background:' + COLOR[r.cat] + '1F;color:' + COLOR[r.cat] + '\">' + esc(r.cat) + '</button></td>'\n        + '<td' + (cx ? ' class=\"cx\"' : '') + '>' + esc(r.name) + '<span class=\"srcm\">' + esc(r.src) + '</span>' + whoTag(r) + (cx && r.status ? ' <span class=\"tag\" style=\"background:#F1F3F5;color:#868E96;text-decoration:none\">' + esc(r.status) + '</span>' : '') + '</td><td class=\"n\">' + (cx ? '0원' : won(r.amount)) + (r.a0 ? '<div class=\"was\">' + won(r.a0) + '</div>' : '') + '</td></tr>';\n    }).join('') || '<tr><td colspan=\"' + cols.length + '\" class=\"empty\">조건에 맞는 내역이 없어요</td></tr>';\n    var paid = list.filter(function (r) { return r.amount > 0; });\n    document.getElementById('tsum').textContent = list.length.toLocaleString() + '건 · ' + won(paid.reduce(function (s, r) { return s + r.amount; }, 0));\n    document.getElementById('more').style.display = 'none';\n  }\n\n  // 분류 바꾸기: 상세 표의 분류 태그를 누르면 팝업 → 고르면 시트 J열에 저장 (같은 상품 모두 옵션)\n  var CP = null;\n  function catPop(btn) {\n    closeCp();\n    var row = +btn.dataset.row, r = ROWS.find(function (x) { return x.row === row; }); if (!r || r.owner) return;\n    if (r.src === MSRC) { addPop(btn, r); return; }\n    var same = ROWS.filter(function (x) { return x.src === r.src && x.name === r.name; });\n    var el = document.createElement('div'); el.className = 'cpop';\n    el.innerHTML = '<div class=\"t\">' + esc(r.name) + '</div><div class=\"cg\">' + CAT_ORDER.filter(function (c) { return c !== '배송비'; }).map(function (c) {\n      return '<button data-c=\"' + c + '\" class=\"' + (c === r.cat ? 'on' : '') + '\"><span class=\"dot\" style=\"background:' + COLOR[c] + '\"></span>' + c + '</button>'; }).join('') + '</div>'\n      + (same.length > 1 ? '<label><input type=\"checkbox\" id=\"cpAll\" checked> 같은 상품 ' + same.length + '건 모두</label>' : '')\n      + (r.src === NS ? '<button class=\"exb\" id=\"cpEx\">이 결제 빼기 (광고·내 계좌 이동 등)</button>' : '');\n    document.body.appendChild(el);\n    var b = btn.getBoundingClientRect();\n    el.style.top = (b.bottom + window.scrollY + 6) + 'px';\n    el.style.left = Math.max(8, Math.min(b.left + window.scrollX, document.documentElement.clientWidth - 260)) + 'px';\n    el.onclick = function (e) {\n      e.stopPropagation();\n      var c = e.target.closest('button'); if (!c) return;\n      if (c.id === 'cpEx') {   // 판매용: 알림 결제를 지출에서 뺌 → 알림원본 N열 '제외'\n        ROWS = ROWS.filter(function (x) { return x !== r; });\n        if (window.google && google.script && google.script.run) GSR().withFailureHandler(function (err) { toast('저장 실패: ' + err.message); }).excludeNoti([[r.row, r.name]]);\n        closeCp(); toast('뺐어요: ' + r.name); render(); return;\n      }\n      var all = document.getElementById('cpAll'), list = all && all.checked ? same : [r];\n      var cat = c.dataset.c, from = r.cat;\n      list.forEach(function (x) { x.cat = cat; CHK_DONE[x.row] = 1; });\n      if (window.google && google.script && google.script.run) GSR()\n        .withSuccessHandler(function (r) { if (r && r.skip) toast(r.skip + '건은 시트가 바뀌어 못 바꿈 → 새로고침'); })\n        .withFailureHandler(function (err) { toast('저장 실패: ' + err.message); })\n        .setCategory(list.map(function (x) { return [x.row, x.name]; }), cat);\n      closeCp(); toast(from + ' → ' + cat + (list.length > 1 ? ' · ' + list.length + '건' : '')); render();\n    };\n    CP = el;\n  }\n  // 직접 추가 (현금 등 알림이 안 오는 지출) → '직접입력' 탭. 분류 칩은 최근 90일 많이 쓴 5개 + '다른 분류'\n  var MSRC = '직접', MBASE = 1000000;\n  function topCats(n) {\n    var from = addMonth(CUR, -3), c = {};\n    ROWS.forEach(function (r) { if (!r.owner && r.amount > 0 && r.date.slice(0, 7) >= from && r.cat !== '배송비') c[r.cat] = (c[r.cat] || 0) + 1; });\n    var t = Object.keys(c).sort(function (a, b) { return c[b] - c[a]; });\n    CAT_ORDER.forEach(function (x) { if (t.indexOf(x) < 0 && x !== '배송비') t.push(x); });\n    return t.slice(0, n);\n  }\n  function guessCat(t) { var m = typeof merchantCat_ === 'function' ? merchantCat_(t) : null; if (m) return m; var c = typeof classify === 'function' ? classify(t) : '기타'; return c === '기타' ? null : c; }\n  function addPop(btn, r) {\n    closeCp();\n    var el = document.createElement('div'); el.className = 'cpop apop';\n    var top = topCats(5), cat = r ? r.cat : top[0], picked = !!r;\n    function chips() { var t = top.slice(); if (t.indexOf(cat) < 0) t[t.length - 1] = cat;\n      return t.map(function (c) { return '<button data-c=\"' + c + '\" class=\"' + (c === cat ? 'on' : '') + '\"><span class=\"dot\" style=\"background:' + COLOR[c] + '\"></span>' + c + '</button>'; }).join('')\n        + '<select class=\"more\" id=\"adMore\"><option value=\"\">다른 분류</option>' + CAT_ORDER.filter(function (c) { return c !== '배송비'; }).map(function (c) { return '<option>' + c + '</option>'; }).join('') + '</select>'; }\n    el.innerHTML = '<div class=\"row\"><input type=\"date\" id=\"adD\" value=\"' + (r ? r.date : TODAY) + '\"><input class=\"amt\" id=\"adA\" inputmode=\"numeric\" placeholder=\"금액\" value=\"' + (r ? num(r.amount) : '') + '\"></div>'\n      + '<div class=\"row\"><input id=\"adN\" placeholder=\"내용 (예: 시장 반찬)\" value=\"' + (r ? esc(r.name) : '') + '\"></div>'\n      + '<div class=\"cg\" id=\"adC\">' + chips() + '</div><button class=\"go\" id=\"adGo\">' + (r ? '저장' : '추가') + '</button>' + (r ? '<button class=\"del\" id=\"adDel\">삭제</button>' : '');\n    document.body.appendChild(el);\n    var b = btn.getBoundingClientRect();\n    el.style.top = (b.bottom + window.scrollY + 6) + 'px';\n    el.style.left = Math.max(8, Math.min((r ? b.left : b.right - 288) + window.scrollX, document.documentElement.clientWidth - 296)) + 'px';\n    var redraw = function () { document.getElementById('adC').innerHTML = chips(); };\n    var amtEl = el.querySelector('#adA');\n    amtEl.oninput = function () { var v = this.value.replace(/[^0-9]/g, ''); this.value = v ? (+v).toLocaleString('ko-KR') : ''; };\n    el.querySelector('#adN').oninput = function () { if (picked) return; var g = guessCat(this.value); if (g && g !== cat) { cat = g; redraw(); } };\n    el.onchange = function (e) { if (e.target.id === 'adMore' && e.target.value) { cat = e.target.value; picked = true; redraw(); } };\n    function run(fn, args, ok) {\n      var go = el.querySelector('#adGo'); go.disabled = true;\n      if (!(window.google && google.script && google.script.run)) { ok(MBASE + 2); return; }\n      var g = GSR().withSuccessHandler(ok).withFailureHandler(function (err) { go.disabled = false; toast('저장 실패: ' + err.message); });\n      g[fn].apply(g, args);\n    }\n    el.onclick = function (e) {\n      e.stopPropagation();\n      var c = e.target.closest('.cg button');\n      if (c) { cat = c.dataset.c; picked = true; redraw(); return; }\n      if (e.target.id === 'adDel') {\n        run('editManual', [r.row, r.name, null, true], function () { ROWS.splice(ROWS.indexOf(r), 1); closeCp(); toast('삭제'); render(); });\n        return;\n      }\n      if (e.target.id !== 'adGo') return;\n      var o = { date: el.querySelector('#adD').value, name: el.querySelector('#adN').value.trim(), amount: +amtEl.value.replace(/[^0-9]/g, ''), cat: cat };\n      if (!o.amount) { amtEl.focus(); toast('금액을 입력'); return; }\n      if (!o.name) { el.querySelector('#adN').focus(); toast('내용을 입력'); return; }\n      if (!/^\\d{4}-\\d{2}-\\d{2}$/.test(o.date)) { toast('날짜를 확인'); return; }\n      if (r) run('editManual', [r.row, r.name, o, false], function () { r.date = o.date; r.name = o.name; r.amount = o.amount; r.cat = o.cat; closeCp(); toast('저장'); render(); });\n      else run('addManual', [o], function (row) {\n        ROWS.push({ src: MSRC, date: o.date, order: 'M' + (row - MBASE), name: o.name, amount: o.amount, cat: o.cat, status: '', row: row });\n        closeCp(); toast('추가 · ' + o.name + ' ' + num(o.amount) + '원'); render();\n        if (DATA.sample) document.getElementById('reload').click();   // 첫 기록 → 예시 걷고 실제로 다시 불러옴\n      });\n    };\n    CP = el;\n    if (!r) setTimeout(function () { amtEl.focus(); }, 0);\n  }\n  document.getElementById('addBtn').addEventListener('click', function (e) { e.stopPropagation(); addPop(this); });\n  // 카메라 버튼 → [사진 찍기 / 앨범에서 고르기] (안드로이드 크롬은 accept만 주면 사진 선택기가 바로 열림 → 찍기는 capture로 따로)\n  document.getElementById('camBtn').addEventListener('click', function (e) {\n    e.stopPropagation(); closeCp();\n    var el = document.createElement('div'); el.className = 'cpop camp';\n    el.innerHTML = '<button data-in=\"rcCam\">사진 찍기</button><button data-in=\"rcIn\">앨범에서 고르기</button>';\n    document.body.appendChild(el);\n    var r = this.getBoundingClientRect();\n    el.style.top = (r.bottom + window.scrollY + 6) + 'px'; el.style.left = Math.max(8, r.right + window.scrollX - el.offsetWidth) + 'px';\n    el.onclick = function (ev) { ev.stopPropagation(); var b = ev.target.closest('button'); if (!b) return; closeCp(); document.getElementById(b.dataset.in).click(); };\n    CP = el;\n  });\n  ['rcIn', 'rcCam'].forEach(function (id) { document.getElementById(id).addEventListener('change', function () { var f = this.files && this.files[0]; this.value = ''; if (f) rcStart(f); }); });\n  /* ---------- 확인 (2026-11-15): 사람에게 보낸 이체 ---------- */\n  var CHK_DONE = {};\n  function chkList() { return (DATA.check || []).filter(function (x) { return !CHK_DONE[x.row] && ROWS.some(function (r) { return r.row === x.row; }); }); }\n  function chkOpen() {\n    var L = chkList(); if (!L.length) { chkClose(); return; }\n    var b = document.getElementById('chkSheet');\n    if (!b) { document.body.insertAdjacentHTML('beforeend', '<div class=\"rdim\" id=\"chkDim\"></div><div class=\"rsheet\" id=\"chkSheet\"></div>'); b = document.getElementById('chkSheet'); document.getElementById('chkDim').onclick = chkClose;\n      b.addEventListener('click', function (e) {\n        var t = e.target.closest('.tagbtn'); if (t) { e.stopPropagation(); catPop(t); return; }\n        var n = e.target.closest('[data-not]'); if (!n) return;\n        var id = +n.dataset.not; CHK_DONE[id] = 1; ROWS = ROWS.filter(function (r) { return r.row !== id; });\n        if (window.google && google.script && google.script.run) GSR().withFailureHandler(function (err) { toast('저장 실패: ' + err.message); }).excludeNoti([[id, (DATA.check.find(function (c) { return c.row === id; }) || {}).key]]);\n        render();\n      }); }\n    var sum = L.reduce(function (a, x) { return a + x.amount; }, 0);\n    b.innerHTML = '<h2 style=\"margin:0 0 0.75rem\">확인 ' + L.length + ' <span class=\"ckn\" style=\"font-size:0.875rem;margin-left:0.375rem\">' + num(sum) + '</span></h2><table class=\"ckt\">' + L.map(function (x) {\n      var r = ROWS.find(function (y) { return y.row === x.row; }) || {};\n      return '<tr><td class=\"d\">' + mdTxt(x.date) + '</td><td>' + esc(x.name) + (x.acct ? '<span class=\"srcl\">' + esc(x.acct) + '</span>' : '') + '</td><td class=\"n\">' + num(x.amount) + '</td></tr>'\n        + '<tr class=\"a\"><td></td><td colspan=\"2\"><button class=\"tag tagbtn\" data-row=\"' + x.row + '\" style=\"background:' + COLOR[r.cat] + '1F;color:' + COLOR[r.cat] + '\">' + esc(r.cat || '기타') + '</button><button class=\"tag ckno\" data-not=\"' + x.row + '\">아님</button></td></tr>';\n    }).join('') + '</table>';\n  }\n  /* ---------- 알림 (2026-11-16): 위 종 아이콘. 주황 = 할 일(배지 수), 회색 = 참고 ---------- */\n  var BELL_DAYS = 3;   // 카드 출금 며칠 전부터 · 반복 구매 며칠 전부터 · 동기화 며칠 지나면\n  function dDiff(a, b) { return Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / 864e5); }\n  function notices() {\n    var L = [];\n    if (DATA.alert) L.push({ o: 1, t: DATA.alert, v: '' });\n    var CK = chkList();\n    if (CK.length) L.push({ o: 1, t: '확인', v: CK.length + '건 · ' + num(CK.reduce(function (a, x) { return a + x.amount; }, 0)), go: 'chk' });\n    var P = DATA.plan, d = P && P.months ? P.months[CUR] : null, REC = P && P.rec && P.recMonth === CUR ? P.rec : {};\n    if (d && d.rows) d.rows.forEach(function (r) {\n      if (r.grp === '쓰는 돈') { if (r.status === 'over' && r.plan != null) L.push({ o: 1, t: r.name + ' 계획 초과', v: '+' + num(r.actual - r.plan), c: 1, go: '계획' }); return; }\n      // 덜 빠진 자동이체 (2026-11-17): 날짜 있는 고정·저축 항목에 맞춘 출금 합계가 계획보다 적음 → 부족액 + 막대\n      if ((r.grp === '고정지출' || r.grp === '저축') && r.day && r.actual != null && r.plan > 0 && r.actual < r.plan) { L.push({ o: 1, t: r.name, v: '−' + num(r.plan - r.actual), c: 1, go: '계획', bar: [r.actual, r.plan] }); return; }\n      if (r.actual != null) return;\n      var q = r.grp !== '입금' ? REC[r.name] : null, miss = q && q.label ? q.label === '없음' : r.status === 'miss';\n      if (miss) L.push({ o: 1, t: r.name + (r.grp === '입금' ? ' 입금 없음' : ' 출금 없음'), v: r.day ? (+CUR.slice(5)) + '/' + r.day + ' 지남' : '', go: '계획' });\n    });\n    var A = DATA.assets, pay = A && A.accts ? A.accts.filter(function (a) { return /카드/.test(a.role) && a.bal != null; })[0] : null;   // 카드대금 통장\n    if (pay && DATA.card && DATA.card.bills) DATA.card.bills.forEach(function (b) {\n      if (!(b.amt > 0) || b.due < TODAY || dDiff(TODAY, b.due) > BELL_DAYS || b.amt <= pay.bal) return;\n      L.push({ o: 1, t: '카드 ' + mdTxt(b.due) + ' 출금 · ' + pay.role + ' 잔액 부족', v: '−' + num(b.amt - pay.bal), c: 1, go: '자산' });\n    });\n    try {\n      computeAnalysis(ROWS.filter(function (r) { return !r.owner && (r.src === '쿠팡' || r.src === '네이버') && !/^\\d{8}NP/.test(r.order || ''); }), TODAY).repeat   // 쇼핑 품목만 (가게 결제 알림 제외 · 2026-11-17 네이버 결제형 주문 'yyyyMMddNP…'(매장 결제·구독) 제외)\n        .filter(function (o) { return Math.abs(o.late) <= BELL_DAYS; }).sort(function (a, b) { return b.late - a.late; }).slice(0, 5)\n        .forEach(function (o) { L.push({ o: 0, t: o.item, v: o.late < 0 ? 'D' + o.late : o.late ? '지남 ' + o.late + '일' : '오늘', go: '분석' }); });\n    } catch (e) {}\n    var SY = DATA.sync || {};\n    Object.keys(SY).forEach(function (k) { var n = dDiff(String(SY[k]).slice(0, 10), TODAY); if (n >= BELL_DAYS) L.push({ o: 0, t: k + ' 동기화', v: n + '일 전' }); });\n    return L.filter(function (x) { return x.o; }).concat(L.filter(function (x) { return !x.o; }));\n  }\n  function bellRender() {\n    var n = notices().filter(function (x) { return x.o; }).length, el = document.getElementById('bellN');\n    if (el) { el.hidden = !n; el.textContent = n; }\n    if (document.getElementById('bellSheet')) bellOpen();\n  }\n  function bellOpen() {\n    var L = notices(), b = document.getElementById('bellSheet');\n    if (!b) {\n      document.body.insertAdjacentHTML('beforeend', '<div class=\"rdim\" id=\"bellDim\"></div><div class=\"rsheet\" id=\"bellSheet\"></div>'); b = document.getElementById('bellSheet');\n      document.getElementById('bellDim').onclick = bellClose;\n      b.addEventListener('click', function (e) {\n        var tr = e.target.closest('tr[data-i]'); if (!tr) return;\n        var x = notices()[+tr.dataset.i]; if (!x || !x.go) return;\n        bellClose();\n        if (x.go === 'chk') chkOpen(); else { setTab(x.go); document.getElementById('tabs').scrollIntoView({ behavior: 'smooth', block: 'start' }); }\n      });\n    }\n    var n = L.filter(function (x) { return x.o; }).length;\n    b.innerHTML = '<h2 style=\"margin:0 0 0.5rem\">알림' + (n ? ' <span class=\"ckn\" style=\"font-size:0.875rem;margin-left:0.25rem\">' + n + '</span>' : '') + '</h2>'\n      + (L.length ? '<table class=\"nt\">' + L.map(function (x, i) {\n        return '<tr data-i=\"' + i + '\" class=\"' + (x.o ? 'o' : 'g') + (x.bar ? ' nb1' : '') + '\"><td class=\"t\"><span class=\"dot\" style=\"background:' + (x.o ? '#E8590C' : '#BDC1C6') + '\"></span>' + esc(x.t) + '</td><td class=\"v' + (x.c ? ' c' : '') + '\">' + esc(x.v) + '</td></tr>'\n          + (x.bar ? '<tr data-i=\"' + i + '\" class=\"o nb2\"><td colspan=\"2\"><div class=\"nbar\"><i style=\"width:' + Math.min(100, Math.round(x.bar[0] / x.bar[1] * 100)) + '%\"></i></div><div class=\"nbl\"><span>' + num(x.bar[0]) + '</span><span>' + num(x.bar[1]) + '</span></div></td></tr>' : '');\n      }).join('') + '</table>' : '<div class=\"empty\">—</div>');\n  }\n  function bellClose() { var a = document.getElementById('bellDim'), b = document.getElementById('bellSheet'); if (a) a.remove(); if (b) b.remove(); }\n  document.getElementById('bell').onclick = function (e) { e.stopPropagation(); bellOpen(); };\n  document.getElementById('planBody').addEventListener('click', planTap);\n  (function () { var al = document.getElementById('assetList'); if (al) al.addEventListener('click', assetTap); })();\n\n  /* ---------- 편집 창 (2026-11-16): 내역 금액·빼기 / 계획 줄 / 자산. 아래에서 올라오는 창 하나를 같이 씀 ---------- */\n  function edOpen(html, bind) {\n    edClose();\n    document.body.insertAdjacentHTML('beforeend', '<div class=\"rdim\" id=\"edDim\"></div><div class=\"rsheet\" id=\"edSheet\">' + html + '</div>');\n    document.getElementById('edDim').onclick = edClose;\n    var b = document.getElementById('edSheet'); bind(b);\n    var f = b.querySelector('input.big') || b.querySelector('input'); if (f) setTimeout(function () { f.focus(); if (f.select) f.select(); }, 50);\n  }\n  function edClose() { var a = document.getElementById('edDim'), b = document.getElementById('edSheet'); if (a) a.remove(); if (b) b.remove(); }\n  function edRun(fn, args, ok) {\n    var bs = document.querySelectorAll('#edSheet .mb button'); bs.forEach(function (x) { x.disabled = true; });\n    if (!(window.google && google.script && google.script.run)) { ok(); return; }\n    GSR().withSuccessHandler(ok).withFailureHandler(function (err) { bs.forEach(function (x) { x.disabled = false; }); toast('저장 실패: ' + err.message); })[fn].apply(null, args);\n  }\n  var numIn = function (el) { el.oninput = function () { var v = this.value.replace(/[^0-9]/g, ''); this.value = v ? (+v).toLocaleString('ko-KR') : ''; }; };\n  var numOf = function (el) { var v = el.value.replace(/[^0-9]/g, ''); return v === '' ? null : +v; };\n  // 내역 줄을 누르면 (카드·계좌 줄만): 금액 고치기 · 빼기\n  function rowTap(e) {\n    var tr = e.target.closest('tr'); if (!tr) return;\n    var t = tr.querySelector('.tagbtn[data-row]'); if (!t) return;\n    var id = +t.dataset.row, r = ROWS.find(function (x) { return x.row === id; });\n    if (!r || r.owner || !(id < 0)) return;\n    var a0 = r.a0 || r.amount;\n    edOpen('<div class=\"mh\"><h2>' + esc(r.name) + '</h2><span>' + mdTxt(r.date) + ' · ' + esc(r.src) + '</span></div>'\n      + '<div class=\"ef\"><span class=\"l\">금액</span><input class=\"big\" inputmode=\"numeric\" id=\"edAmt\" value=\"' + num(r.amount) + '\"><span class=\"l\">원래</span><span class=\"lock\">' + num(a0) + '</span></div>'\n      + '<div class=\"mb\"><button class=\"ex\" id=\"edEx\">빼기</button>' + (r.a0 ? '<button class=\"rs\" id=\"edRs\">원래대로</button>' : '') + '<button class=\"go\" id=\"edGo\">저장</button></div>', function (b) {\n      numIn(b.querySelector('#edAmt'));\n      b.querySelector('#edEx').onclick = function () { edRun('excludeNoti', [[[id, r.name]]], function () { ROWS = ROWS.filter(function (x) { return x.row !== id; }); CHK_DONE[id] = 1; edClose(); toast('뺌 · ' + r.name); render(); }); };\n      var rs = b.querySelector('#edRs'); if (rs) rs.onclick = function () { edRun('setNotiAmount', [id, null], function () { r.amount = a0; r.a0 = 0; edClose(); render(); }); };\n      b.querySelector('#edGo').onclick = function () {\n        var v = numOf(b.querySelector('#edAmt')); if (v == null) { toast('금액을 입력'); return; }\n        if (v === r.amount) { edClose(); return; }\n        edRun('setNotiAmount', [id, v === a0 ? null : v], function () { r.amount = v; r.a0 = v === a0 ? 0 : a0; edClose(); toast('저장 · ' + num(v)); render(); });\n      };\n    });\n  }\n\n  // 계획 줄을 누르면: 날짜·끝나는 달·찾을 단어·뺄 단어 (개인 탭에서 오는 금액은 잠김)\n  function planTap(e) {\n    var tr = e.target.closest('tr.pe'); if (!tr) return;\n    var n = tr.dataset.n, P = (DATA.planTab || []).find(function (x) { return x.name === n; }) || (DATA.planTab || []).find(function (x) { return n.indexOf(x.name + ' (') === 0; });\n    if (!P) { toast('계획 탭에서 못 찾음'); return; }\n    var inp = function (id, v, ph) { return '<input id=\"' + id + '\" value=\"' + esc(v || '') + '\"' + (ph ? ' placeholder=\"' + ph + '\"' : '') + '>'; };\n    edOpen('<div class=\"mh\"><h2>' + esc(P.name) + '</h2><span>' + esc(P.kind) + '</span></div><div class=\"ef\">'\n      + '<span class=\"l\">월 금액</span>' + (P.lock ? '<span class=\"lock\">' + (P.amt ? num(P.amt) : '—') + ' · 개인 탭</span>' : '<input class=\"big\" inputmode=\"numeric\" id=\"pAmt\" value=\"' + (P.amt ? num(P.amt) : '') + '\">')\n      + '<span class=\"l\">날짜</span>' + inp('pDay', P.day, '1~31') + '<span class=\"l\">끝나는 달</span>' + inp('pEnd', P.end, '2028-05')\n      + '<span class=\"l\">찾을 단어</span>' + inp('pFind', P.find) + '<span class=\"l\">뺄 단어</span>' + inp('pNot', P.not)\n      + '</div><div class=\"mb\"><button class=\"go\" id=\"pGo\">저장</button></div>', function (b) {\n      var am = b.querySelector('#pAmt'); if (am) numIn(am);\n      b.querySelector('#pDay').setAttribute('inputmode', 'numeric');\n      b.querySelector('#pGo').onclick = function () {\n        var o = { day: b.querySelector('#pDay').value.trim(), end: b.querySelector('#pEnd').value.trim(), find: b.querySelector('#pFind').value, not: b.querySelector('#pNot').value };\n        if (am) o.amt = numOf(am) || 0;\n        edRun('setPlanRow', [P.row, P.name, o], function () { Object.assign(P, o, am ? { amt: o.amt } : {}); edClose(); toast('저장 · 다시 계산 중'); var rb = document.getElementById('reload'); if (rb && !rb.disabled) rb.click(); });\n      };\n    });\n  }\n  // 자산 줄을 누르면: 통장 = 용도·메모 / 대출 = 계획 항목·지금 잔액(개인 탭에서 오면 잠김)\n  function assetTap(e) {\n    var tr = e.target.closest('tr.pe'); if (!tr) return;\n    var k = tr.dataset.k, row = +tr.dataset.r, key = tr.dataset.key, A = DATA.assets || {};\n    if (k === 'bank') {\n      var x = (A.accts || []).find(function (a) { return a.row === row; }); if (!x) return;\n      edOpen('<div class=\"mh\"><h2>' + esc(x.bank + ' ' + x.tail) + '</h2><span>통장</span></div><div class=\"ef\">'\n        + '<span class=\"l\">용도</span><select id=\"aRole\">' + ['생활', '저축', '카드대금', '기타'].map(function (r) { return '<option' + (r === x.role ? ' selected' : '') + '>' + r + '</option>'; }).join('') + '</select>'\n        + '<span class=\"l\">메모</span><input id=\"aMemo\" value=\"' + esc(x.memo || '') + '\"></div><div class=\"mb\"><button class=\"go\" id=\"aGo\">저장</button></div>', function (b) {\n        b.querySelector('#aGo').onclick = function () {\n          var o = { role: b.querySelector('#aRole').value, memo: b.querySelector('#aMemo').value };\n          edRun('setAcctRow', ['bank', row, key, o], function () { x.role = o.role; x.memo = o.memo; edClose(); toast('저장'); render(); });\n        };\n      });\n      return;\n    }\n    var L = (A.loans || []).find(function (a) { return a.row === row; }); if (!L) return;\n    var names = (DATA.planTab || []).map(function (p) { return p.name; }); if (L.item && names.indexOf(L.item) < 0) names.unshift(L.item);\n    edOpen('<div class=\"mh\"><h2>' + esc(L.name) + '</h2><span>대출</span></div><div class=\"ef\">'\n      + '<span class=\"l\">지금 잔액</span>' + (L.lock ? '<span class=\"lock\">기준 ' + num(L.base) + ' · 개인 탭</span>' : '<input class=\"big\" inputmode=\"numeric\" id=\"aBase\" value=\"' + num(L.cur) + '\">')\n      + '<span class=\"l\">기준일</span><span class=\"lock\">' + (L.lock ? esc(L.since || '') : '저장하면 ' + mdTxt(TODAY)) + '</span>'\n      + '<span class=\"l\">계획 항목</span><select id=\"aItem\"><option value=\"\"></option>' + names.map(function (n) { return '<option' + (n === L.item ? ' selected' : '') + '>' + esc(n) + '</option>'; }).join('') + '</select>'\n      + '</div><div class=\"mb\"><button class=\"go\" id=\"aGo\">저장</button></div>', function (b) {\n      var bi = b.querySelector('#aBase'); if (bi) numIn(bi);\n      b.querySelector('#aGo').onclick = function () {\n        var o = { item: b.querySelector('#aItem').value }; if (bi) { var v = numOf(bi); if (v == null) { toast('잔액을 입력'); return; } if (v !== L.cur) o.base = v; }\n        edRun('setAcctRow', ['loan', row, key, o], function () { L.item = o.item; edClose(); toast('저장 · 다시 계산 중'); var rb = document.getElementById('reload'); if (rb && !rb.disabled) rb.click(); });\n      };\n    });\n  }\n\n  function chkClose() { var a = document.getElementById('chkDim'), b = document.getElementById('chkSheet'); if (a) a.remove(); if (b) b.remove(); }\n\n  function closeCp() { if (CP) { CP.remove(); CP = null; } }\n  function toast(t) { var el = document.createElement('div'); el.className = 'toast'; el.textContent = t; document.body.appendChild(el); setTimeout(function () { el.remove(); }, 2200); }\n  // 예산 바꾸기: ✎ → 입력칸 → 저장 = 가계부설정 B4\n  document.getElementById('gauge').addEventListener('click', function (e) {\n    if (e.target.closest('#planLine')) { setTab('계획'); document.getElementById('tabs').scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }\n    if (e.target.closest('#editLimit')) {\n      var cur = (DATA.gauge && DATA.gauge.limit) || 800000;\n      document.getElementById('limK').innerHTML = (+CUR.slice(5, 7)) + '월 예산 <input class=\"limin\" id=\"limIn\" inputmode=\"numeric\" value=\"' + num(cur) + '\"><button class=\"edit\" id=\"limOk\">저장</button>';\n      var inp = document.getElementById('limIn'); inp.focus(); inp.select();\n      inp.onkeydown = function (k) { if (k.key === 'Enter') saveLimit(); if (k.key === 'Escape') render(); };\n    } else if (e.target.closest('#limOk')) saveLimit();\n  });\n  function saveLimit() {\n    var n = Math.round(+String(document.getElementById('limIn').value).replace(/[^\\d]/g, ''));\n    if (!(n >= 10000 && n <= 100000000)) { toast('1만~1억 사이로 입력'); return; }\n    var done = function () { DATA.gauge = DATA.gauge || { noti: null }; DATA.gauge.limit = n; render(); toast('예산 ' + num(n) + '원'); };\n    if (window.google && google.script && google.script.run) GSR().withSuccessHandler(done).withFailureHandler(function (err) { toast('저장 실패: ' + err.message); }).setBudget(n);\n    else done();\n  }\n\n  document.getElementById('tb').addEventListener('click', function (e) { var b = e.target.closest('.tagbtn'); if (!b) { rowTap(e); return; } e.stopPropagation(); if (b.dataset.inc != null) typePop(b); else catPop(b); });\n  document.getElementById('flowSw').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b || S.flow === b.dataset.f) return; S.flow = b.dataset.f; detail(ROWS.filter(bySrc).filter(inPeriod)); });\n  document.getElementById('dayBox').addEventListener('click', function (e) { var b = e.target.closest('.tagbtn'); if (!b) { rowTap(e); return; } e.stopPropagation(); if (b.dataset.inc != null) typePop(b); else catPop(b); });\n  document.getElementById('tabs').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) setTab(b.dataset.t); });\n  document.getElementById('sideNav').addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) setTab(b.dataset.t); });\n  document.getElementById('fchip').onclick = function () { S.cat = null; S.src = '전체'; S.limit = 30; render(); };\n  document.getElementById('sReload').onclick = function () { document.getElementById('reload').click(); };\n  // ⋯ 메뉴: 새로고침 · 시트 열기\n  var MN = null;\n  function mnClose() { if (MN) { MN.remove(); MN = null; } }\n  document.getElementById('moreBtn').onclick = function (e) {\n    e.stopPropagation(); if (MN) { mnClose(); return; }\n    var r = this.getBoundingClientRect(); MN = document.createElement('div'); MN.className = 'mn';\n    MN.style.top = (r.bottom + 6) + 'px'; MN.style.right = Math.max(8, document.documentElement.clientWidth - r.right) + 'px';\n    MN.innerHTML = '<button data-m=\"r\">새로고침</button><a data-m=\"s\" target=\"_blank\" href=\"' + (document.getElementById('sheet').href || '#') + '\">시트 열기</a>';\n    MN.onclick = function (ev) { var m = ev.target.closest('[data-m]'); if (!m) return; if (m.dataset.m === 'r') document.getElementById('reload').click(); mnClose(); };\n    document.body.appendChild(MN);\n  };\n  document.addEventListener('click', function (e) { if (MN && !MN.contains(e.target)) mnClose(); });\n  // 폰 뒤로가기 (2026-11-16): 열린 창 닫기 → 달력으로 → 그다음에 나감. 기록 칸을 하나만 두고(가드) 뒤로가기마다 다시 채움\n  var HIST = null; try { HIST = window.google && google.script && google.script.history ? google.script.history : null; } catch (e) {}\n  var GUARD = false;\n  function layerOpen() { return !!(document.getElementById('edSheet') || document.getElementById('chkSheet') || document.getElementById('bellSheet') || CP || CAL.open || MN); }\n  function layerClose() {\n    if (document.getElementById('edSheet')) edClose(); else if (document.getElementById('chkSheet')) chkClose(); else if (document.getElementById('bellSheet')) bellClose();\n    else if (CP) closeCp(); else if (CAL.open) calClose(); else mnClose();\n  }\n  function guard() { if (!HIST || GUARD) return; try { HIST.push({ g: 1 }); GUARD = true; } catch (e) { HIST = null; } }\n  if (HIST) {\n    try {\n      HIST.setChangeHandler(function (e) {\n        if (e && e.state && e.state.g) { GUARD = true; return; }   // 앞으로 가기로 가드에 다시 온 경우\n        GUARD = false;\n        if (layerOpen()) layerClose(); else if (S.tab !== '달력') setTab('달력');\n        if (layerOpen() || S.tab !== '달력') guard();   // 아직 돌아갈 곳이 있을 때만 다시 채움 → 달력에서 빈 뒤로가기 없음\n      });\n    } catch (e) { HIST = null; }\n    document.addEventListener('click', function () { setTimeout(function () { if (layerOpen() || S.tab !== '달력') guard(); }, 0); }, true);\n  }\n  document.getElementById('calBox').addEventListener('click', function (e) {\n    var b = e.target.closest('button'); if (!b || b.disabled) return;\n    if (b.dataset.cm) { var m = addMonth(S.cm, +b.dataset.cm); if (m < FIRST || m > CUR) return; S.cm = m; S.day = null; calBlock(); return; }\n    if (b.dataset.d) { S.day = b.dataset.d; calBlock(); }\n  });\n  document.addEventListener('click', closeCp);\n\n  document.getElementById('fCat').addEventListener('scroll', catEnd);\n  // PC: 분류 줄을 마우스로 끌어서 옆으로 이동, 휠도 가로로 (폰은 원래 손가락으로 밀림)\n  (function () {\n    var el = document.getElementById('fCat'), d = null, moved = false;\n    el.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse' || e.button !== 0) return; d = { x: e.clientX, s: el.scrollLeft }; moved = false; });\n    window.addEventListener('pointermove', function (e) {\n      if (!d) return;\n      var dx = e.clientX - d.x;\n      if (!moved && Math.abs(dx) > 4) { moved = true; el.classList.add('drag'); }\n      if (moved) el.scrollLeft = d.s - dx;\n    });\n    window.addEventListener('pointerup', function () { if (!d) return; d = null; el.classList.remove('drag'); });\n    el.addEventListener('click', function (e) { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);   // 끈 뒤에는 칩 클릭으로 치지 않음\n    el.addEventListener('wheel', function (e) {\n      if (el.scrollWidth <= el.clientWidth || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;\n      el.scrollLeft += e.deltaY; e.preventDefault();\n    }, { passive: false });\n  })();\n  document.getElementById('calBtn').onclick = function (e) { e.stopPropagation(); CAL.open ? calClose() : calOpen(); };\n  document.getElementById('calPop').onclick = function (e) {\n    e.stopPropagation();\n    var b = e.target.closest('button'); if (!b || b.disabled) return;\n    if (b.dataset.y) { CAL.year += +b.dataset.y; drawCal(); } else if (b.dataset.m) calPick(b.dataset.m);\n  };\n  document.addEventListener('click', function () { if (CAL.open) calClose(); });\n  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && CAL.open) calClose(); });\n  document.getElementById('prevW').onclick = function () { shift(-1); };\n  document.getElementById('nextW').onclick = function () { shift(1); };\n  document.getElementById('q').addEventListener('input', function (e) { S.q = e.target.value; S.limit = 30; detail(ROWS.filter(bySrc).filter(inPeriod)); });\n  document.getElementById('more').onclick = function () { S.limit += 30; detail(ROWS.filter(bySrc).filter(inPeriod)); };\n  document.getElementById('reload').onclick = function () {\n    if (!(window.google && google.script && google.script.run)) return;\n    if (this.disabled) return;\n    var b = this, t0 = Date.now(), st = document.getElementById('stamp'), sr = document.getElementById('sReload'), st0 = st.textContent;\n    b.disabled = true; sr.disabled = true; sr.textContent = '불러오는 중…'; st.textContent = st0 + ' · 불러오는 중…';\n    var done = function () { b.disabled = false; sr.disabled = false; sr.textContent = '새로고침'; };\n    GSR().withSuccessHandler(function (json) { done(); load(JSON.parse(json)); perf({ type: '새로고침', trip: Date.now() - t0 }); })\n      .withFailureHandler(function (err) { done(); st.textContent = st0; toast('불러오기 실패: ' + err.message); }).getDashboardJson();\n  };\n\n  Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;\n  var RS = parseFloat(getComputedStyle(document.documentElement).fontSize) / 16 || 1;   // 폰 비율 (390px 폭 = 1)\n  Chart.defaults.font.size = Math.round(12 * RS);\n  var RW = window.innerWidth <= 520;   // 폰↔PC 폭이 바뀌면 내역 열 다시 (화면 회전·창 크기)\n  window.addEventListener('resize', function () { var m = window.innerWidth <= 520; if (m !== RW) { RW = m; render(); } });\n  Chart.defaults.color = '#6B7684';\n  load(DATA);\n  if (HIST && S.tab !== '달력') guard();   // 다른 탭으로 열렸으면 뒤로가기 = 달력\n  // 속도 측정: 처음 열기 = 이 페이지 스크립트 시작부터 화면 다 그릴 때까지 (서버 쪽 시간은 대시보드.gs가 따로 잼)\n  function perf(c) { try { if (window.google && google.script && google.script.run) GSR().logPerf(PERF_ID, c); } catch (e) {} }\n  (function () {\n    var c = { type: CACHE_AGE ? '처음 열기(저장본)' : '처음 열기', start: T_START, render: Date.now() - T_START };\n    setTimeout(function () {\n      try { var tm = performance.timing; c.nav = { fetchToResp: tm.responseStart - tm.fetchStart, resp: tm.responseEnd - tm.responseStart, toDom: tm.domContentLoadedEventEnd - tm.fetchStart, cacheAgeSec: Math.round(CACHE_AGE / 1000), font: FONT_OK ? 'saved' : 'fetch' }; } catch (e) {}\n      perf(c); PERF_ID = '';\n    }, 300);\n  })();\n  // 저장본으로 그렸으면 뒤에서 새로 계산해 바뀐 게 있으면 다시 그림 (1분 안에 만든 저장본이면 생략)\n  if (CACHE_AGE > 60000 && window.google && google.script && google.script.run) {\n    var st = document.getElementById('stamp'), st0 = st.textContent, tb = Date.now(), before = JSON.stringify(DATA);\n    st.textContent = st0 + ' · 갱신 중…';\n    GSR().withSuccessHandler(function (json) {\n      perf({ type: '뒤에서 갱신', trip: Date.now() - tb });\n      if (json !== before) load(JSON.parse(json)); else st.textContent = st0;\n    }).withFailureHandler(function () { st.textContent = st0; }).getDashboardJson();\n  }\n  // 폰트: 저장본이 없으면 화면을 그린 뒤 받아서 넣고 저장 → 차트를 그 글꼴로 다시 그림\n  if (!FONT_OK && window.google && google.script && google.script.run) {\n    GSR().withSuccessHandler(function (css) {\n      if (!css) return;\n      var el = document.createElement('style'); el.textContent = css; document.head.appendChild(el);\n      try { localStorage.setItem(FONT_KEY, css); } catch (e) {}\n      try { document.fonts.load('600 12px PretendardEmbed').then(function () { Chart.defaults.font.family = getComputedStyle(document.body).fontFamily; render(); }); } catch (e) {}\n    }).getDashFont();\n  }\n})();\n</script>\n</body>\n</html>"};
var HtmlService = (function (H) {
  function has(n) { return Object.prototype.hasOwnProperty.call(__HN_HTML, n); }
  return { createHtmlOutput: function () { return H.createHtmlOutput.apply(H, arguments); }, createTemplate: function (s) { return H.createTemplate(s); },
    createTemplateFromFile: function (n) { return has(n) ? H.createTemplate(__HN_HTML[n]) : H.createTemplateFromFile(n); },
    createHtmlOutputFromFile: function (n) { return has(n) ? H.createHtmlOutput(__HN_HTML[n]) : H.createHtmlOutputFromFile(n); },
    getUserAgent: function () { return H.getUserAgent(); }, XFrameOptionsMode: H.XFrameOptionsMode, SandboxMode: H.SandboxMode };
})(globalThis.HtmlService);

;// ===== 가계부.js =====
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
  // 수신시각은 시트에 보이는 글자 그대로 (2026-11-17: 날짜 값을 시간대로 바꾸면 시트·스크립트 시간대가 어긋날 때 9시간 밀림)
  const disp = sh.getRange(2, 1, v.length, 1).getDisplayValues();
  const dshow = s => { const m = /^(\d{4}-\d{2}-\d{2})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?/.exec(String(s).trim()); return m ? m[1] + ' ' + m[2].padStart(2, '0') + ':' + m[3] + ':' + (m[4] || '00') : ''; };
  return v.map((r, i) => {
    const recv = r[0] instanceof Date ? (dshow(disp[i][0]) || Utilities.formatDate(r[0], tz, 'yyyy-MM-dd HH:mm:ss')) : String(r[0] || '');
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

;// ===== 계좌.js =====
/**
 * 계좌.gs — '계좌' 탭 + 대시보드 '자산' (2026-11-15, 판매용_개발가이드 5-2장)
 *
 *  탭 구성 (A~F, 숨김 G = 대출 기준 '금액|시각ms')
 *   통장    3~10행: 끝자리 · 은행 · 용도 · 메모 (노랑, 직접) · 잔액 · 갱신 (알림 잔액 자동)
 *   기타 자산 14~21행: 이름 · 금액
 *   대출    25~32행: 이름 · 기준 잔액 · 기준일(자동) · 계획 항목(노랑, 드롭다운) · 현재(자동)
 *  개인용: 기타 자산·대출의 이름·금액은 개인 탭 '보유 현금'·'대출 잔액' 칸에서 자동(회색). 판매용(개인 탭 없음)은 직접 입력.
 *  대출 현재 = 기준 잔액 − 기준 시각 이후 '계획 항목' 출금 합 (항목 이름에 '이자'가 있으면 차감 안 함).
 *   기준 시각 = 기준 잔액이 바뀐 순간 (G열에 기록). 금리는 쓰지 않음(사용자 결정).
 */
const AC = {
  TAB: '계좌',
  BANK: { r0: 1, first: 3, n: 8, head: ['끝자리', '은행', '용도', '메모', '잔액', '갱신'] },
  OTHER: { r0: 12, first: 14, n: 8, head: ['이름', '금액', '', '', '', ''] },
  LOAN: { r0: 23, first: 25, n: 8, head: ['이름', '기준 잔액', '기준일', '계획 항목', '현재', ''] },
  ROLES: ['생활', '저축', '카드대금', '기타'],
  SRC_ASSET: '보유 현금', SRC_LOAN: '대출 잔액',
  SKIP_ASSET: /잔액/,           // '카뱅잔액'처럼 알림 잔액이 있는 통장은 통장 칸에서 셈
  INTEREST: /이자/,
  GRAY: '#F1F3F4', YELLOW: '#FFF2CC',
};

/* ---------- 순수 ---------- */

/** 개인 탭 값(표시값·수식) → {others:[[이름,금액]], loans:[[이름,금액]]}. 머리 글자를 찾아 그 아래 빈 칸까지 */
function acFromPersonal_(v, f) {
  const num = x => { const s = String(x == null ? '' : x).replace(/[₩￦,\s원]/g, ''); return /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : null; };
  const block = (head, skip) => {
    let r0 = -1, c0 = -1;
    for (let r = 0; r < Math.min(10, v.length) && r0 < 0; r++) for (let c = 0; c < v[r].length; c++) if (String(v[r][c]).trim() === head) { r0 = r; c0 = c; break; }
    if (r0 < 0) return [];
    const out = [];
    for (let r = r0 + 1; r < v.length; r++) {
      const name = String(v[r][c0] || '').trim();
      if (!name) { if (out.length || r > r0 + 3) break; continue; }   // 머리 바로 아래 빈 칸 몇 줄은 건너뜀
      const amt = num(v[r][c0 + 1]);
      if (amt == null || (f && /^=/.test(String(f[r][c0 + 1] || ''))) || (skip && skip.test(name))) continue;   // 합계 수식 줄·잔액 줄 건너뜀
      out.push([name, amt]);
    }
    return out;
  };
  return { others: block(AC.SRC_ASSET, AC.SKIP_ASSET), loans: block(AC.SRC_LOAN) };
}

/** 대출 이름 → 가장 비슷한 계획 항목 (글자 앞부분 2글자 이상 겹침 · 숫자 일치) */
function acGuessItem_(loan, names) {
  const core = s => String(s).replace(/대출|할부|이자|\s/g, '');
  const L = core(loan), d = (loan.match(/\d+$/) || [''])[0];
  let best = '', score = 0;
  names.forEach(n => {
    const N = core(n);
    if ((n.match(/\d+$/) || [''])[0] !== d) return;
    let k = 0; while (k < Math.min(L.length, N.length) && L[k] === N[k]) k++;
    if (k >= 2 && k > score) { score = k; best = n; }
  });
  return best;
}

/**
 * 대출 현재 잔액 (순수)
 *  loan {base, since(ms), item}, plan item {name, plan}, re = planRe_ 결과, notis = ledgerLive_ 행
 *  이름에 '이자' → base. 아니면 since 이후 출금 중 re가 맞고 금액이 계획 ±50% 안인 것의 합을 뺌
 */
function acLoanNow_(loan, item, re, notis) {
  if (!item || !re || !re.re || AC.INTEREST.test(item.name)) return { cur: loan.base, paid: 0, n: 0 };
  const after = x => new Date(String(x.when).replace(' ', 'T') + '+09:00').getTime() > loan.since;
  const word = x => x.type === '출금' && !x.excluded && x.amount > 0 && re.re.test(x.text);
  const near = x => !item.plan || Math.abs(x.amount - item.plan) <= item.plan * 0.5;
  let acc = notis.filter(x => word(x) && near(x));
  // 덜 빠진 달의 나머지 출금 (2026-11-17, planTopUp_()가 true일 때만 — 개인용 개인_진입.js): 같은 달 합계가 계획 금액을 넘지 않는 만큼 작은 출금도 상환으로 셈 (예: 297,377 + 22,603 = 319,980)
  if (item.plan && typeof planTopUp_ === 'function' && planTopUp_()) {
    const mon = x => String(x.when).slice(0, 7), sum = {};
    acc.forEach(x => { sum[mon(x)] = (sum[mon(x)] || 0) + x.amount; });
    notis.filter(x => word(x) && !near(x) && !(typeof notiNotFixed_ === 'function' && notiNotFixed_(x))).sort((a, b) => (a.when < b.when ? -1 : a.when > b.when ? 1 : 0)).forEach(x => {
      const m = mon(x);
      if (sum[m] == null || sum[m] + x.amount > item.plan) return;
      sum[m] += x.amount; acc.push(x);
    });
  }
  const hits = acc.filter(after);
  const paid = hits.reduce((a, x) => a + x.amount, 0);
  return { cur: Math.max(0, loan.base - paid), paid, n: hits.length };
}

/* ---------- 시트 ---------- */

function acTab_(ss) {
  let sh = ss.getSheetByName(AC.TAB);
  if (sh) return { sh, fresh: false };
  const at = ss.getSheetByName(typeof PT !== 'undefined' ? PT.TAB : '계획');
  sh = ss.insertSheet(AC.TAB, at ? at.getIndex() : 0);
  const sec = (S, title) => {
    sh.getRange(S.r0, 1).setValue(title).setFontWeight('bold').setFontSize(11);
    sh.getRange(S.r0 + 1, 1, 1, 6).setValues([S.head]).setFontWeight('bold').setBackground('#F3F3F3')
      .setBorder(null, null, true, null, null, null, '#9AA0A6', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  };
  sec(AC.BANK, '통장'); sec(AC.OTHER, '기타 자산'); sec(AC.LOAN, '대출');
  const B = AC.BANK, O = AC.OTHER, L = AC.LOAN;
  sh.getRange(B.first, 1, B.n, 4).setBackground(AC.YELLOW);
  sh.getRange(B.first, 1, B.n, 1).setNumberFormat('@');
  sh.getRange(B.first, 3, B.n, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(AC.ROLES, true).setAllowInvalid(false).build());
  sh.getRange(B.first, 5, B.n, 1).setNumberFormat('#,##0');
  sh.getRange(O.first, 1, O.n, 2).setBackground(AC.YELLOW);
  sh.getRange(O.first, 2, O.n, 1).setNumberFormat('#,##0');
  sh.getRange(L.first, 1, L.n, 2).setBackground(AC.YELLOW);
  sh.getRange(L.first, 4, L.n, 1).setBackground(AC.YELLOW);
  sh.getRange(L.first, 2, L.n, 1).setNumberFormat('#,##0');
  sh.getRange(L.first, 5, L.n, 1).setNumberFormat('#,##0');
  [110, 120, 100, 170, 120, 90].forEach((w, i) => sh.setColumnWidth(i + 1, w));
  sh.hideColumns(7);
  // 통장: 예전 가계부설정 계좌 용도 표(M9:P)에서 옮김
  const old = typeof acctRolesOld_ === 'function' ? acctRolesOld_(ss) : [];
  if (old.length) sh.getRange(B.first, 1, Math.min(old.length, B.n), 4).setValues(old.slice(0, B.n).map(a => [a.tail, a.bank, a.role, a.memo]));
  return { sh, fresh: true };
}

/** 개인 탭 → 기타 자산·대출 이름·금액(회색), 대출 기준 시각(G) 갱신. live(알림)가 있으면 잔액·현재까지 계산해 씀. 반환 대시보드용 값
 *  2026-11-16 속도: 탭을 한 번에 읽고, 값은 바뀐 칸만 씀. 서식(글자 형식·드롭다운·회색)은 모양(줄 수·계획 항목)이 바뀐 때만 → 대시보드 한 번에 쓰기 12번 → 보통 0~2번 */
function acSync_(ss, live) {
  const { sh } = acTab_(ss);
  const O = AC.OTHER, L = AC.LOAN, B = AC.BANK;
  const V = sh.getRange(1, 1, L.first + L.n - 1, 7).getValues();
  const part = S => V.slice(S.first - 1, S.first - 1 + S.n);
  const src = ss.getSheetByName(typeof PT !== 'undefined' ? PT.SRC : '개인');
  const plan = typeof planSource_ === 'function' ? planSource_(ss) : null;
  const items = plan ? plan.plan.fixed.concat(plan.plan.spend, plan.plan.income) : [];
  const itemNames = items.map(it => it.name);
  const same = (a, b) => a.length === b.length && a.every((r, i) => r.length === b[i].length && r.every((x, j) => acCell_(x) === acCell_(b[i][j])));
  const put = (r, c, old, nv) => { if (!same(old, nv)) sh.getRange(r, c, nv.length, nv[0].length).setValues(nv); };
  let loanV = part(L).map(r => r.slice());
  const loanOld = part(L).map(r => r.slice());
  let nOther = -1, nLoan = -1, others = part(O).filter(r => String(r[0]).trim() && r[1] !== '').map(r => ({ name: String(r[0]).trim(), amt: Number(r[1]) || 0 }));
  if (src) {
    const rng = src.getRange(1, 1, Math.min(src.getLastRow(), 60), Math.min(src.getLastColumn(), 26));
    const P = acFromPersonal_(rng.getDisplayValues(), rng.getFormulas());
    const ov = P.others.slice(0, O.n).map(r => [r[0], r[1]]);
    while (ov.length < O.n) ov.push(['', '']);
    put(O.first, 1, part(O).map(r => [r[0], r[1]]), ov);
    others = ov.filter(r => String(r[0]).trim() && r[1] !== '').map(r => ({ name: String(r[0]).trim(), amt: Number(r[1]) || 0 }));
    const byName = {}; loanV.forEach(r => { if (String(r[0]).trim()) byName[String(r[0]).trim()] = r; });
    loanV = P.loans.slice(0, L.n).map(([n, a]) => { const o = byName[n]; return [n, a, o ? o[2] : '', o && o[3] ? o[3] : acGuessItem_(n, itemNames), o ? o[4] : '', '', o ? o[6] : '']; });
    while (loanV.length < L.n) loanV.push(['', '', '', '', '', '', '']);
    nOther = P.others.length; nLoan = P.loans.length;
  }
  // 서식: 모양이 바뀐 때만 (속성 AC_SIG에 기록)
  const sig = JSON.stringify([nOther, nLoan, itemNames]);
  const pp = PropertiesService.getScriptProperties(), props = typeof ledgerProps_ === 'function' ? ledgerProps_() : pp.getProperties();
  if (props.AC_SIG !== sig) {
    sh.getRange(B.first, 6, B.n, 1).setNumberFormat('@'); sh.getRange(L.first, 3, L.n, 1).setNumberFormat('@');   // '11/15'이 날짜로 바뀌지 않게
    if (itemNames.length) sh.getRange(L.first, 4, L.n, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(itemNames, true).setAllowInvalid(true).build());
    if (src) {
      sh.getRange(O.first, 1, O.n, 2).setBackground(null);
      if (nOther) sh.getRange(O.first, 1, nOther, 2).setBackground(AC.GRAY);
      sh.getRange(L.first, 1, L.n, 2).setBackground(null);
      if (nLoan) sh.getRange(L.first, 1, nLoan, 2).setBackground(AC.GRAY);
    }
    pp.setProperty('AC_SIG', sig); props.AC_SIG = sig;
  }
  // 기준 시각: 기준 잔액이 바뀌었으면 지금
  const now = Date.now(), tz = ss.getSpreadsheetTimeZone() || 'Asia/Seoul';
  loanV.forEach(r => {
    if (r[2] instanceof Date) r[2] = Utilities.formatDate(r[2], tz, 'MM/dd');
    if (!String(r[0]).trim()) { r[2] = ''; r[6] = ''; return; }
    const g = String(r[6] || '').split('|');
    if (g[0] !== String(r[1])) { r[6] = r[1] + '|' + now; r[2] = Utilities.formatDate(new Date(now), tz, 'MM/dd'); }
  });
  // 통장 잔액 + 대출 현재 (알림이 있을 때만)
  const bankV = part(B).map(r => r.slice(0, 6));
  if (live) {
    const bal = {};
    live.forEach(x => { const b = parseBalance_('', x.title, x.body); if (!b) return; const t = (b.acct.match(/(\d{2,})$/) || [])[1]; if (t && (!bal[t] || bal[t].when < x.when)) bal[t] = { bal: b.bal, when: x.when }; });
    bankV.forEach(r => {
      const tail = String(r[0]).trim(); if (!tail) { r[4] = ''; r[5] = ''; return; }
      const k = Object.keys(bal).find(t => acctTailEq_(t, tail)), b = k ? bal[k] : null;
      r[4] = b ? b.bal : ''; r[5] = b ? b.when.slice(5, 10).replace('-', '/') : '';
    });
    put(B.first, 5, part(B).map(r => [r[4], r[5]]), bankV.map(r => [r[4], r[5]]));
    const byItem = {}; items.forEach(it => { byItem[it.name] = it; });
    loanV.forEach(r => {
      if (!String(r[0]).trim()) { r[4] = ''; return; }
      const since = Number(String(r[6]).split('|')[1]) || now, it = byItem[String(r[3]).trim()];
      r[4] = acLoanNow_({ base: Number(r[1]) || 0, since }, it, it ? planRe_(plan.alias, it.name) : null, live).cur;
    });
  }
  put(L.first, 1, loanOld.map(r => [r[0], r[1], r[2], r[3], r[4], r[5], r[6]]), loanV.map(r => [r[0], r[1], r[2], r[3], r[4], '', r[6]]));
  const accts = bankV.map((r, i) => ({ row: B.first + i, tail: String(r[0]).trim(), bank: String(r[1]).trim(), role: String(r[2]).trim(), memo: String(r[3] || '').trim(), bal: r[4] === '' ? null : Number(r[4]), at: r[5] || '' })).filter(x => x.tail);
  const endOf = {}; items.forEach(it => { endOf[it.name] = it.end || ''; });
  const loans = loanV.map((r, i) => ({ row: L.first + i, name: String(r[0]).trim(), cur: Number(r[4] === '' ? r[1] : r[4]) || 0, base: Number(r[1]) || 0, since: r[2], item: String(r[3]).trim(), end: endOf[String(r[3]).trim()] || '', lock: !!src })).filter(x => x.name);   // lock = 개인 탭에서 오는 기준 잔액
  const assets = accts.reduce((a, x) => a + (x.bal || 0), 0) + others.reduce((a, x) => a + x.amt, 0), debt = loans.reduce((a, x) => a + x.cur, 0);
  return { accts, others, loans, assets, debt, net: assets - debt };
}
/** 칸 비교용: 날짜는 MM/dd 글자로, 숫자 글자 '1,000'과 숫자 1000은 같게 (순수) */
function acCell_(x) {
  if (x instanceof Date) return Utilities.formatDate(x, 'Asia/Seoul', 'MM/dd');
  if (x === null || x === undefined) return '';
  return typeof x === 'number' ? String(x) : String(x).trim();
}

/** 대시보드용 (getDashboardJson) */
/** 대시보드에서 계좌 탭 고치기 (2026-11-16). kind 'bank': o = {role, memo} / 'loan': o = {item, base?}. 줄 번호와 끝자리·이름이 맞을 때만. 개인 탭에서 오는 기준 잔액은 안 바꿈 */
function acSetRow_(ss, kind, row, key, o) {
  const sh = ss.getSheetByName(AC.TAB), R = kind === 'bank' ? AC.BANK : kind === 'loan' ? AC.LOAN : null;
  row = Number(row);
  if (!sh || !R || !(row >= R.first && row < R.first + R.n)) throw new Error('잘못된 줄');
  if (String(sh.getRange(row, 1).getDisplayValue()).trim() !== String(key).trim()) throw new Error('계좌 탭이 바뀌었음 — 새로고침');
  o = o || {};
  if (kind === 'bank') {
    if (o.role != null && o.role !== '' && AC.ROLES.indexOf(o.role) < 0) throw new Error('용도 확인');
    if (o.role != null) sh.getRange(row, 3).setValue(o.role);
    if (o.memo != null) sh.getRange(row, 4).setValue(String(o.memo).slice(0, 100));
  } else {
    if (o.item != null) sh.getRange(row, 4).setValue(String(o.item));
    const fromSrc = !!ss.getSheetByName(typeof PT !== 'undefined' ? PT.SRC : '개인');
    if (o.base != null && !fromSrc) { const b = Math.round(Number(o.base)); if (!(b >= 0)) throw new Error('금액 확인'); sh.getRange(row, 2).setValue(b); }   // 기준 시각은 acSync_가 '기준 잔액이 바뀜'을 보고 지금으로
  }
  return { ok: 1 };
}
function acDash_(ss, tz) {
  try { return acSync_(ss, typeof ledgerLive_ === 'function' ? ledgerLive_(ss, tz) : null); }
  catch (e) { return { error: e.message }; }
}

/** 한 번만: 계좌 탭으로 옮긴 옛 칸 숨김 (가계부설정 M~P 계좌 표, 월마감 Q~S 잔액). 지우지 않음 */
function acTidyV1_(ss) {
  if (!ss.getSheetByName(AC.TAB)) throw new Error('계좌 탭 없음');
  const set = ss.getSheetByName(typeof LEDGER !== 'undefined' ? LEDGER.SET : '가계부설정');
  if (set && typeof ACCT !== 'undefined') set.hideColumns(ACCT.COL, 4);
  const close = ss.getSheetByName(typeof LEDGER !== 'undefined' ? LEDGER.CLOSE : '월마감');
  if (close) close.hideColumns(17, 3);
}


;// ===== 계획.js =====
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
    plan.fixed.filter(live).forEach(it => { const a = pick(it, '출금'); rows.push({ grp: it.sec === '저축' ? '저축' : '고정지출', name: it.name, day: it.day, plan: it.plan, actual: a, status: fixedStatus(it, a), it }); });
    // 덜 빠진 출금 채우기 (2026-11-17, planTopUp_()가 true일 때 — 판매.js): 단어로 맞은 출금이 계획보다 적으면,
    //  모든 항목이 한 건씩 가져간 뒤 남은 같은 달 출금 중 찾을 단어가 맞는 것을 날짜 순으로 계획 금액까지 더함 (금액만으로 맞추는 경로는 그대로)
    if (typeof planTopUp_ === 'function' && planTopUp_()) rows.forEach(row => {
      const it = row.it;
      if (!it || row.actual == null || !(row.actual < row.plan)) return;
      const r = re(it.name); if (!r.re) return;
      const other = x => plan.fixed.some(o => o !== it && live(o) && o.plan === x.amount && (re(o.name).re || { test: () => false }).test(x.text));
      nm.map((x, i) => [x, i]).filter(([x, i]) => !used[i] && x.type === '출금' && x.amount > 0 && !(typeof notiNotFixed_ === 'function' && notiNotFixed_(x)) && r.re.test(x.text) && !other(x))
        .sort((a, b) => (a[0].when < b[0].when ? -1 : a[0].when > b[0].when ? 1 : 0)).forEach(([x, i]) => {
          if (row.actual + x.amount > row.plan) return;
          used[i] = true; row.actual += x.amount;
        });
      row.status = fixedStatus(it, row.actual);
    });
    rows.forEach(row => { delete row.it; });
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


;// ===== 계획탭.js =====
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
  ACCT_COL: 12, ACCT_HEAD: '통장',   // 2026-11-17 통장 칸: 숨긴 K열 뒤 L열 (A~K 11칸 순서·판매용 사본과 안 부딪히게). ptAcctOn_()가 true일 때만 (개인용)
};
const ptAcctUse_ = () => typeof ptAcctOn_ === 'function' && !!ptAcctOn_();

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
  const acctOld = ptAcctUse_() && old.length && sh.getMaxColumns() >= PT.ACCT_COL ? sh.getRange(PT.FIRST, PT.ACCT_COL, old.length, 1).getDisplayValues() : null;   // 통장 칸은 줄이 옮겨져도 항목 이름을 따라감
  if (clearN) sh.getRange(PT.FIRST, 1, clearN, PT.COLS).clearContent().setFontColor(null).setBackground(PT.YELLOW);
  if (n) {
    sh.getRange(PT.FIRST, 1, n, PT.COLS).setValues(B.rows);
    B.kinds.forEach((k, i) => {
      const row = PT.FIRST + i;
      if (k === 'link') sh.getRange(row, 3, 1, 2).setBackground(PT.GRAY);
      if (k === 'gone') sh.getRange(row, 1, 1, 10).setFontColor(PT.DIM).setBackground(null);
    });
  }
  if (acctOld) {
    const by = {}; old.forEach((r, i) => { const k = String(r[2] || '').trim(), a = String(acctOld[i][0] || '').trim(); if (k && a && !(k in by)) by[k] = a; });
    const auto = ptAcctAuto_();
    const vals = []; for (let i = 0; i < clearN; i++) { const k = i < n ? String(B.rows[i][2] || '').trim() : ''; vals.push([k && by[k] ? by[k] : '']); }
    const rg = sh.getRange(PT.FIRST, PT.ACCT_COL, clearN, 1);
    rg.setNumberFormat('@').setValues(vals);
    rg.setFontColors(vals.map((v, i) => [v[0] && i < n && auto[String(B.rows[i][2] || '').trim()] === v[0] ? PT.DIM : null]));
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
/** 시트 수정 때 (진입 함수 onEdit는 양쪽 전용 파일에 있고 이 함수를 부름, 2026-11-17 공용 폴더) */
function planOnEdit_(e) {
  try {
    const sh = e && e.range && e.range.getSheet();
    if (!sh) return;
    const n = sh.getName();
    if (n === PT.SRC) planTabSync_(sh.getParent(), false);
    if ((n === PT.SRC || (typeof AC !== 'undefined' && n === AC.TAB)) && typeof acSync_ === 'function' && sh.getParent().getSheetByName(AC.TAB)) acSync_(sh.getParent(), null);   // 대출 기준 잔액이 바뀐 순간 기록
    if ((n === PT.SRC || n === PT.TAB || n === '계좌' || n === '설정') && typeof dashCacheClear_ === 'function') dashCacheClear_();
  } catch (err) { console.error('planOnEdit_: ' + err.message); }
}

/**
 * 통장 칸 (L열, 2026-11-17 · ptAcctOn_()가 true일 때만): 노랑 + 드롭다운(계좌 탭 통장 끝자리)
 *  자동 채움(회색) = 그 항목에 맞춰진 가장 최근 출금 알림의 통장. 사람이 고친 값은 건드리지 않음 (자동 값은 스크립트 속성 PT_AUTO_ACCT)
 *  알림에 통장이 없는 항목(카드 결제)은 비워 둠
 */
function ptAcctAuto_() { try { return JSON.parse(PropertiesService.getScriptProperties().getProperty('PT_AUTO_ACCT') || '{}') || {}; } catch (e) { return {}; } }
function ptAcctTails_(ss) {   // 계좌 탭 통장 끝자리 목록
  const sh = typeof AC !== 'undefined' ? ss.getSheetByName(AC.TAB) : null;
  if (!sh) return [];
  return sh.getRange(AC.BANK.first, 1, AC.BANK.n, 1).getDisplayValues().map(r => String(r[0]).trim()).filter(Boolean);
}
function ptAcctPrep_(ss, sh, tails) {
  const sig = tails.join(','), pp = PropertiesService.getScriptProperties();
  if (String(sh.getRange(1, PT.ACCT_COL).getDisplayValue()).trim() === PT.ACCT_HEAD && pp.getProperty('PT_ACCT_SIG') === sig) return;
  if (sh.getMaxColumns() < PT.ACCT_COL) sh.insertColumnsAfter(sh.getMaxColumns(), PT.ACCT_COL - sh.getMaxColumns());
  sh.getRange(1, PT.ACCT_COL).setValue(PT.ACCT_HEAD).setFontWeight('bold').setBackground('#F3F3F3')
    .setBorder(null, null, true, null, null, null, '#9AA0A6', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  const rg = sh.getRange(PT.FIRST, PT.ACCT_COL, PT.ROWS, 1);
  rg.setNumberFormat('@').setBackground(PT.YELLOW);
  if (tails.length) rg.setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(tails, true).setAllowInvalid(true).build());
  sh.setColumnWidth(PT.ACCT_COL, 64);
  pp.setProperty('PT_ACCT_SIG', sig);
}
/** {항목 이름: 통장 끝자리} (계획 탭 L열 표시값) */
function ptAcctRead_(ss) {
  return memo_('ptAcct', () => {
    const sh = ss.getSheetByName(PT.TAB), out = {};
    if (!sh || ptLast_(sh) < PT.FIRST || sh.getMaxColumns() < PT.ACCT_COL) return out;
    const n = ptLast_(sh) - PT.FIRST + 1, names = ptDisp_(sh), a = sh.getRange(PT.FIRST, PT.ACCT_COL, n, 1).getDisplayValues();
    names.forEach((r, i) => { const k = String(r[2] || '').trim(), t = String(a[i][0] || '').trim(); if (k && t && !(k in out)) out[k] = t; });
    return out;
  });
}
/** want = {항목 이름: 통장 끝자리} (자동 값). 빈 칸이거나 전에 자동으로 넣은 값 그대로인 칸만 바꿈. 반환 바꾼 칸 수 */
function ptAutoAcct_(ss, want) {
  if (!ptAcctUse_()) return 0;
  const sh = ss.getSheetByName(PT.TAB);
  if (!sh || ptLast_(sh) < PT.FIRST) return 0;
  ptAcctPrep_(ss, sh, ptAcctTails_(ss));
  const auto = ptAcctAuto_(), n = ptLast_(sh) - PT.FIRST + 1;
  const names = ptDisp_(sh), cur = sh.getRange(PT.FIRST, PT.ACCT_COL, n, 1).getDisplayValues();
  let ch = 0;
  names.forEach((r, i) => {
    const k = String(r[2] || '').trim(), w = want[k], c = String(cur[i][0] || '').trim();
    if (!k || !w || c === w) return;
    if (c !== '' && c !== auto[k]) return;   // 사람이 적은 통장
    sh.getRange(PT.FIRST + i, PT.ACCT_COL).setNumberFormat('@').setValue(w).setFontColor(PT.DIM);
    auto[k] = w; ch++;
  });
  if (ch) { PropertiesService.getScriptProperties().setProperty('PT_AUTO_ACCT', JSON.stringify(auto)); if (typeof MEMO_ !== 'undefined' && MEMO_) delete MEMO_.ptAcct; }
  return ch;
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


;// ===== 구매내역가져오기.js =====
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
    fH.push([buyHFormula_(r)]);
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
/** 구매내역관리 H(반영금액) 수식 — 상태에 취소·반품이면 0, 메모(K)에 '환불 12,345'가 있으면 F − 환불액(0 아래면 0), 없으면 F (2026-11-17)
 *  처음 설치·buyEnsure_·수집.js rcEnsure_가 같은 수식을 씀. 5행·마지막 수식 줄이 이 수식과 다르면 H열 전체를 다시 씀 */
function buyHFormula_(r) {
  return `=IF(F${r}="","",IF(ISNUMBER(SEARCH("취소",G${r}))+ISNUMBER(SEARCH("반품",G${r}))>0,0,IFERROR(MAX(0,F${r}-VALUE(SUBSTITUTE(REGEXEXTRACT(K${r}&"","환불\\s*([0-9,]+)"),",",""))),F${r})))`;
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
  if (formLast >= F && (hf[0][0] !== buyHFormula_(F) || hf[formLast - F][0] !== buyHFormula_(formLast))) {   // H 수식이 바뀌었으면(2026-11-17 부분환불) 5행~마지막 수식 줄 전부 새 수식
    const nf = []; for (let r = F; r <= formLast; r++) nf.push([buyHFormula_(r)]);
    sh.getRange(F, 8, nf.length, 1).setFormulas(nf);
  }
  if (formLast < F || needLast <= formLast) return;
  const target = needLast + 200;
  if (target > m0) sh.insertRowsAfter(m0, target - m0);
  const cnt = target - formLast, src = sh.getRange(formLast, 1, 1, 12), dst = sh.getRange(formLast + 1, 1, cnt, 12);
  src.copyTo(dst, SpreadsheetApp.CopyPasteType.PASTE_FORMAT, false);
  src.copyTo(dst, SpreadsheetApp.CopyPasteType.PASTE_DATA_VALIDATION, false);
  [8, 9, 12].forEach(c => sh.getRange(formLast, c).copyTo(sh.getRange(formLast + 1, c, cnt, 1), SpreadsheetApp.CopyPasteType.PASTE_FORMULA, false));
}


;// ===== 대시보드.js =====
/**
 * 대시보드.gs — HTML 소비 대시보드 (같은 Apps Script 프로젝트에 넣어서 사용)
 *   필요한 파일: 구매내역_가져오기.gs, 소비분석.gs, 대시보드.gs, dashboard.html
 *
 *   PC  : 시트 메뉴 '구매내역 → 대시보드 열기' (시트 위에 큰 창으로 뜸)
 *   폰  : 웹앱으로 배포한 URL을 브라우저로 열기 (배포: 편집기 오른쪽 위 '배포 → 새 배포 → 웹 앱',
 *         실행 사용자 '나', 액세스 권한 '나만')  → 소비분석 탭 A3에 링크가 생김
 *
 *   숫자 계산은 소비분석.gs의 computeAnalysis를 그대로 브라우저로 보내서 씀 → 시트 탭과 같은 숫자
 */
const DASH = {
  TITLE: '한눈가계부',   // 2026-11-16 사용자: 이름
  NOTI_SRC: '카드·계좌',   // 알림(은행·카드)에서 온 행의 구분 이름
  LIVING_ACCT: '',          // 생활계좌 (알림 앱판: 설정에서). 비면 잔액 줄 숨김
  MANUAL_SRC: '직접',      // 대시보드 '+'로 직접 넣은 행(현금 등)의 구분 이름
  MANUAL_TAB: '직접입력',  // 저장 탭: A 날짜 · B 내용 · C 금액 · D 분류 · E 입력시각 (삭제하면 그 행을 비움 → 행 번호 유지)
  MANUAL_BASE: 1000000,    // 대시보드 행 번호 = 이 값 + 직접입력 탭 행 (구매내역관리 행·알림원본 음수와 안 겹치게)
  CARD: '',                // 신용카드 끝자리 (알림 앱판: 설정에서). 비면 카드 줄 숨김
};

/* ---------- 속도 (2026-11-13) ----------
 * ① 한 번만 읽기: getDashboardJson_ 한 번 실행 안에서 같은 탭(구매내역·알림원본·개인 탭·연결 단어)을 다시 읽지 않음 (memo_)
 * ② 결과 저장: 계산한 JSON을 스크립트 캐시에 둠(최대 6시간). 대시보드를 열면 캐시로 바로 그리고, 화면이 뒤에서 새로 계산해 바뀐 게 있으면 다시 그림.
 *    분류 바꾸기·직접 추가·예산 바꾸기 때 캐시를 지움. '새로고침' 버튼은 항상 새로 계산.
 * ③ 폰트: 처음 HTML에서 뺌 → 화면을 먼저 그리고 getDashFont로 받아 브라우저(localStorage)에 저장, 다음부터는 저장본을 바로 씀
 */
/* 기록용 탭 자동 숨김 (2026-11-13 사용자: 안 봐도 되는 기록 탭이 너무 많음). 숨겨도 코드는 그대로 읽고 씀.
 * 처음 한 번 숨기고(스크립트 속성 HIDE_TABS_V1), 이후 새로 만드는 기록 탭도 숨김. 사람이 '보기 → 숨겨진 시트'로 다시 보이게 하면 그대로 둠(매일 다시 숨기지 않음).
 * 보이게 두는 탭: 개인·정기결제·가계부설정·월마감(사람이 고치는 탭)과 그 밖의 사용자 탭 */
const HIDE_TABS = ['입금분류', '알림원본', '점검기록', '속도기록', '소비분석', '직접입력', '가게분류', '구매내역관리', '가계부설정', '월마감', '보관_구매', '보관_알림', '공휴일', '계획(예전)', '설정(예전)'];
function hideTab_(sh) { try { if (sh && !sh.isSheetHidden()) sh.hideSheet(); } catch (e) {} }
/** 판매용: 기록 탭은 처음 보일 때 한 번만 숨김 (나중에 생긴 탭도). 고객이 다시 보이게 하면 그대로 둠 */
function hideRecordTabsOnce_(ss) {
  try {
    const p = PropertiesService.getScriptProperties();
    const done = JSON.parse(p.getProperty('HIDDEN_TABS') || '[]');
    let ch = false;
    HIDE_TABS.forEach(n => { if (done.indexOf(n) >= 0) return; const sh = ss.getSheetByName(n); if (!sh) return; hideTab_(sh); done.push(n); ch = true; });
    if (ch) p.setProperty('HIDDEN_TABS', JSON.stringify(done));
  } catch (e) {}
}

let MEMO_ = null;
function memo_(k, fn) { if (!MEMO_) return fn(); if (!(k in MEMO_)) MEMO_[k] = fn(); return MEMO_[k]; }
const DASH_CACHE = { KEY: 'dashJson_v1', CHUNK: 30000, TTL: 21600 };   // 캐시 값 하나 최대 100KB → 한글 3바이트 기준 30,000자씩 나눔
function dashCachePut_(json, at) {   // at: 저장본 시각을 그대로 두고 보관 기간만 늘릴 때
  try {
    const K = DASH_CACHE.KEY, n = Math.ceil(json.length / DASH_CACHE.CHUNK), o = {};
    for (let i = 0; i < n; i++) o[K + '_' + i] = json.substr(i * DASH_CACHE.CHUNK, DASH_CACHE.CHUNK);
    o[K + '_at'] = String(at != null ? at : Date.now()); o[K + '_n'] = String(n);
    CacheService.getScriptCache().putAll(o, DASH_CACHE.TTL);
  } catch (e) {}
}
function dashCacheGet_() {
  try {
    const K = DASH_CACHE.KEY, c = CacheService.getScriptCache(), n = Number(c.get(K + '_n'));
    if (!n) return null;
    const keys = []; for (let i = 0; i < n; i++) keys.push(K + '_' + i);
    const m = c.getAll(keys.concat([K + '_at']));
    let s = '';
    for (const k of keys) { if (m[k] == null) return null; s += m[k]; }
    return { json: s, at: Number(m[K + '_at']) || 0 };
  } catch (e) { return null; }
}
/** 저장본을 '오래됨'으로 표시 (2026-11-16 속도 P2: 지우지 않음 → 다음 열기도 저장본으로 바로 그리고, 화면이 뒤에서 새로 계산해 바꿈) */
function dashCacheClear_() { try { CacheService.getScriptCache().put(DASH_CACHE.KEY + '_at', '0', DASH_CACHE.TTL); } catch (e) {} }
/** 4시간마다 미리 계산 (속도 P2, 개인용 2026-11-16 이식). 판매용은 드라이브 권한을 늘리지 않으려고 '시트가 바뀌었는지' 확인 없이 매번 계산 (하루 6번 × 약 4초) */
function dashWarm() {
  getDashboardJson_();
  return 'warm';
}
function dashJsonDay_(json) { const m = String(json).slice(0, 40).match(/"today":"(\d{4}-\d{2}-\d{2})"/); return m ? m[1] : ''; }
/** 한 번만: 4시간 트리거 설치 (예전 30분 트리거는 지움) */
function dashWarmSetup_() {
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'dashWarm').forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('dashWarm').timeBased().everyHours(4).create();
}
/* ---------- 가게분류 탭 (2026-11-13): 카드·계좌 결제의 분류를 대시보드에서 바꾸면 그 가게를 기억 → 같은 가게의 다른 결제도 같은 분류 ----------
 * A 가게 · B 분류 · C 마지막 수정. 사람이 직접 고치거나 줄을 지워도 됨. 우선순위: 그 결제의 분류 수정(알림원본 N) > 이 탭 > 배달·교통 > 가계부 분류 > 가게 이름 규칙 > 상품 규칙
 * 맞추기: 띄어쓰기·대소문자 무시, 같거나 한쪽이 다른 쪽으로 시작(4글자 이상) — 은행 알림의 잘린 이름('신주옥미강남')도 '신주옥미 강남점'에 맞음 */
const MERCHANT_TAB = '가게분류';
const mkey_ = s => String(s || '').replace(/\s+/g, '').toLowerCase();
function merchantMemoMap_() {
  return memo_('merchantMemo', () => {
    const out = [];
    try {
      const sh = dashSs_().getSheetByName(MERCHANT_TAB);
      const last = sh ? sh.getLastRow() : 0;
      if (last >= 2) sh.getRange(2, 1, last - 1, 2).getDisplayValues().forEach(r => {
        const k = mkey_(r[0]), c = String(r[1]).trim();
        if (k && CAT_ORDER.indexOf(c) >= 0) out.push([k, c]);
      });
    } catch (e) {}
    return out;
  });
}
function merchantMemoFind_(name) {
  const k = mkey_(name);
  if (!k || /동기화전/.test(k)) return '';
  let best = '', bl = 0;
  merchantMemoMap_().forEach(([m, c]) => {
    const hit = m === k || (Math.min(m.length, k.length) >= 4 && (m.indexOf(k) === 0 || k.indexOf(m) === 0));
    if (hit && m.length > bl) { best = c; bl = m.length; }
  });
  return best;
}
function merchantMemoSave_(names, cat) {
  try {
    const ss = dashSs_();
    let sh = ss.getSheetByName(MERCHANT_TAB);
    if (!sh) {
      sh = ss.insertSheet(MERCHANT_TAB); hideTab_(sh);
      sh.getRange(1, 1, 1, 3).setValues([['가게', '분류', '마지막 수정']]).setFontWeight('bold').setBackground('#385723').setFontColor('#FFFFFF');
      sh.setFrozenRows(1); sh.setColumnWidth(1, 220);
    }
    const tz = ss.getSpreadsheetTimeZone() || 'Asia/Seoul', now = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd HH:mm');
    const n = sh.getLastRow() - 1, cur = n > 0 ? sh.getRange(2, 1, n, 1).getDisplayValues().map(r => mkey_(r[0])) : [];
    const uniq = {}; names.forEach(x => { const k = mkey_(x); if (k && !/동기화전/.test(k)) uniq[k] = String(x).trim(); });
    Object.keys(uniq).forEach(k => {
      const i = cur.indexOf(k);
      if (i >= 0) sh.getRange(i + 2, 2, 1, 2).setValues([[cat, now]]);
      else { sh.appendRow([uniq[k], cat, now]); cur.push(k); }
    });
  } catch (e) {}
}
/** 처음 한 번: 지금까지 알림원본 N열로 고친 분류를 가게분류 탭에 옮겨 둠 (탭이 없을 때만, 대시보드를 열 때) */
function merchantMemoSeed_(ss, tz) {
  try {
    if (ss.getSheetByName(MERCHANT_TAB) || typeof ledgerLive_ !== 'function') return;
    const by = {};
    ledgerLive_(ss, tz).forEach(x => { if (x.type === '출금' && CAT_ORDER.indexOf(x.fix) >= 0) { by[x.fix] = by[x.fix] || []; by[x.fix].push(notiName_(x)); } });
    const cats = Object.keys(by);
    if (!cats.length) { merchantMemoSave_([], ''); return; }
    cats.forEach(c => merchantMemoSave_(by[c], c));
  } catch (e) {}
}

/** 화면이 그려진 뒤 부름: 내장 폰트 CSS (<style> 태그 뺀 글자) */
function getDashFont_() { return dashFont_().replace(/^\s*<style>/, '').replace(/<\/style>\s*$/, ''); }

function openDashboard() {
  SpreadsheetApp.getUi();   // 메뉴에서만
  SpreadsheetApp.getUi().showModalDialog(dashOutput_().setWidth(1280).setHeight(880), DASH.TITLE);
}

function dashOutput_() {
  // 속도 측정(2026-11-09): 구간별 ms를 캐시에 두고, 화면이 다 그려진 뒤 브라우저가 logPerf로 화면 쪽 시간과 합쳐 '속도기록' 탭에 남김
  const P = { start: Date.now() };
  const t = HtmlService.createTemplateFromFile('dashboard');
  const cached = dashCacheGet_();
  let json = cached ? cached.json : getDashboardJson_(P); P.json = Date.now() - P.start;
  P.cache = cached ? (cached.at ? 'hit' : 'stale') : 'miss'; t.cacheAge = cached ? Math.max(0, Date.now() - cached.at) : 0;
  if (cached) {   // 자정이 지난 저장본: 날짜만 오늘로 바꿔 그리고(오늘 막대), 화면이 뒤에서 새로 계산 (속도 P2)
    const tz = dashSs_().getSpreadsheetTimeZone() || 'Asia/Seoul', today = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd'), d = dashJsonDay_(json);
    if (d && d !== today) { json = json.replace('"today":"' + d + '"', '"today":"' + today + '"'); t.cacheAge = Math.max(t.cacheAge, 3600000); P.cache = 'oldday'; }
  }
  let k = Date.now(); t.payload = json; t.lib = dashLib_(); P.lib = Date.now() - k;
  t.font = ''; P.font = 0;   // 폰트는 화면을 그린 뒤 따로 받음 (getDashFont_)
  P.id = Utilities.getUuid().slice(0, 8); t.perfId = P.id; t.dkey = saleKey_();
  k = Date.now(); const out = t.evaluate(); P.eval = Date.now() - k;
  P.end = Date.now(); P.total = P.end - P.start;
  P.dataKB = Math.round(json.length / 1024); P.fontKB = Math.round(String(t.font || '').length / 1024);
  try { CacheService.getScriptCache().put('perf_' + P.id, JSON.stringify(P), 900); } catch (e) {}
  return out;
}

/** 브라우저가 화면을 다 그린 뒤 부름 → '속도기록' 탭 한 줄. 실패해도 화면에는 영향 없음 */
function logPerf_(id, c) {
  try {
    const ss = dashSs_();
    const tz = ss.getSpreadsheetTimeZone() || Session.getScriptTimeZone() || 'Asia/Seoul';
    let P = {};
    try { P = JSON.parse((id && CacheService.getScriptCache().get('perf_' + id)) || '{}'); } catch (e) {}
    if (!id) { try { P = JSON.parse(CacheService.getScriptCache().get('perf_build') || '{}'); } catch (e) {} }   // 뒤에서 갱신·새로고침: 마지막 계산의 단계 시간
    c = c || {};
    let sh = ss.getSheetByName('속도기록');
    if (!sh) {
      sh = ss.insertSheet('속도기록'); hideTab_(sh);
      sh.getRange(1, 1, 1, 12).setValues([['시각', '종류', '서버 합계', '시트 읽기·계산', 'HTML 만들기', '서버→화면 시작', '화면 그리기', '새로고침 왕복', '데이터KB', '폰트KB', '시트 읽기 세부', '화면 세부']])
        .setFontWeight('bold').setBackground('#385723').setFontColor('#FFFFFF');
      sh.setFrozenRows(1);
    }
    const gap = P.end && c.start ? c.start - P.end : '';   // 서버 끝 → 화면 스크립트 시작 (전송·구글 iframe. 폰·서버 시계 차이가 섞임)
    sh.appendRow([Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd HH:mm:ss'), c.type || '', P.total || '', P.json || '', (P.lib || 0) + (P.font || 0) + (P.eval || 0) || '',
      gap, c.render || '', c.trip || '', P.dataKB || '', P.fontKB || '',
      JSON.stringify(Object.keys(P).filter(k => ['start', 'end', 'id', 'total', 'json', 'dataKB', 'fontKB'].indexOf(k) < 0).reduce((o, k) => { o[k] = P[k]; return o; }, {})),   // 단계별 ms 전부
      JSON.stringify(c.nav || {})]);
  } catch (e) {}
}


/** 내장 폰트(font.html: Pretendard 가변 폰트 일부 글자, base64). 없거나 실패하면 '' → dashboard.html이 CDN 링크로 대체 */
function dashFont_() {
  try { return HtmlService.createHtmlOutputFromFile('font').getContent(); } catch (e) { return ''; }
}

function dashSs_() { return memo_('ss', saleSs_); }

/** 브라우저로 보낼 데이터 (읽기만 함). '새로고침' 버튼도 이 함수를 부름. 행 끝 = 시트 행 번호(분류 바꾸기용) */
function getDashboardJson_(P) {
  MEMO_ = {};
  let lap = Date.now();
  const own = !(P && typeof P === 'object'); if (own) P = { bg: 1 };   // 뒤에서 갱신·새로고침·미리 계산도 단계 시간을 남김 (2026-11-16)
  const tick = k => { const n = Date.now(); P[k] = n - lap; lap = n; };   // 속도 측정 (dashOutput_에서만 P가 옴)
  const ss = dashSs_();
  const tz = ss.getSpreadsheetTimeZone() || Session.getScriptTimeZone() || 'Asia/Seoul';   // 시트 시간대가 비어 있으면 스크립트 시간대 → 서울
  tick('open');   // 2026-11-16 속도: 예전 'rows'에 섞여 있던 단계를 나눠 잼
  if (typeof saleMigrateV2_ === 'function') { try { saleMigrateV2_(ss); } catch (e) { console.error('새 탭 구조: ' + e.message); } }   // 판매.gs: 한 번만
  if (typeof saleApplySettings_ === 'function') saleApplySettings_();   // 판매용: 설정 탭 생활계좌·카드·결제일
  hideRecordTabsOnce_(ss);
  if (!ledgerProps_()['DASH_WARM_V2'] && (typeof SHARE_OUT_ === 'undefined' || !SHARE_OUT_)) { try { dashWarmSetup_(); PropertiesService.getScriptProperties().setProperty('DASH_WARM_V2', '1'); } catch (e) { console.error('미리 계산 트리거: ' + e.message); } }   // 한 번만 (이미 설치한 사람용)
  tick('once');
  const { rows } = readRows_(ss, false); tick('rows');
  const manual = manualRows_(ss); tick('manual');
  merchantMemoSeed_(ss, tz);
  const notiRows = dashNotiRows_(ss, tz); tick('noti');
  const gauge = typeof ledgerGauge_ === 'function' ? ledgerGauge_(ss, tz) : { limit: 800000, noti: null }; tick('gauge');   // 가계부.gs가 있으면 한도·알림 기준 지출
  const plan = typeof planCompare_ === 'function' ? planCompare_(ss, tz, rows.concat(manual)) : null; tick('plan');   // 계획.gs: 개인 탭 대비 (최근 12개월)
  const alert = typeof ledgerAlert_ === 'function' ? ledgerAlert_(ss, tz) : ''; tick('alert');          // 알림 앱 하트비트 감시 (문제 있을 때만 문구)
  const data = {
    today: Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd'),
    stamp: Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd HH:mm'),
    upd: typeof updStatus_ === 'function' ? updStatus_() : null,   // 버전·업데이트 상태 (판매용, 문의 대응)
    sheetUrl: ss.getUrl(),
    rows: rows.map(r => [r.src, r.date, r.order, r.name, r.amount, r.cat, r.status, r.row]).concat(notiRows).concat(manual.map(r => [r.src, r.date, r.order, r.name, r.amount, r.cat, '', r.row]))
      .concat(typeof rcptRows_ === 'function' ? rcptRows_(ss) : []),   // 영수증.gs: 영수증 품목
    gauge, plan, alert,
  };
  // 게이지 '쓴 돈' = 이번 달 대시보드 행 합계(구매 + 카드·계좌). 화면 숫자와 게이지가 같은 기준이 되게 알림 합계는 쓰지 않음
  if (data.gauge) { data.notiFrom = data.gauge.notiFrom || ''; data.gauge.noti = null; }
  const pb = typeof planBudget_ === 'function' ? planBudget_(ss) : null;   // 예산 = 개인 탭 기준 (없으면 가계부설정 B4)
  if (data.gauge) { if (pb) { data.gauge.limit = pb.limit; data.gauge.src = '계획'; data.gauge.plan = pb; } else { data.gauge.limit = 0; data.gauge.src = 'none'; } }   // 판매용: 예산 = 계획 탭 쓰는 돈 합 (없으면 숨김)
  tick('budget');
  const kb = dashKbBal_(ss, tz); tick('kb');
  if (typeof acDash_ === 'function') { data.assets = acDash_(ss, tz); tick('assets'); }   // 계좌.gs: 자산 탭
  const card = dashCard_(ss, tz);
  if (card) data.card = card;
  const bills = typeof dashCardBills_ === 'function' ? dashCardBills_(ss, tz) : null;   // 수입.gs: 카드 출금 예정·할부
  if (bills) data.card = Object.assign(data.card || {}, bills);
  if (typeof dashIncome_ === 'function') data.inc = dashIncome_(ss, tz);                  // 수입.gs: 입금 종류
  if (typeof ledgerLive_ === 'function') data.fixedOut = dashFixedOut_(ledgerLive_(ss, tz), dashIsFixed_(ss));
  tick('inc');
  if (kb) { data.kbBal = kb.bal; data.kbAt = kb.when; }
  data.sync = dashSyncAt_(ss);   // 알림(종): 쿠팡·네이버 마지막 동기화
  if (typeof ptEditList_ === 'function') { try { data.planTab = ptEditList_(ss); } catch (e) {} }   // 계획 줄 고치기용
  if (typeof ledgerLive_ === 'function') { try { data.check = dashCheck_(ledgerLive_(ss, tz), dashIsFixed_(ss), Utilities.formatDate(new Date(), tz, 'yyyy-MM')); } catch (e) {} }   // 확인: 사람에게 보낸 이체
  if (!data.notiFrom && typeof ledgerLive_ === 'function') data.notiFrom = ledgerLive_(ss, tz).map(x => x.when.slice(0, 10)).filter(Boolean).sort()[0] || '';
  data.me = typeof saleMyName_ === 'function' ? saleMyName_() : '나';
  if (typeof saleShareFetch_ === 'function') { try { data.links = saleShareFetch_(); } catch (e) { data.links = []; } }   // 판매.gs 함께 쓰기
  if (!data.rows.length && typeof saleSample_ === 'function' && (typeof SHARE_OUT_ === 'undefined' || !SHARE_OUT_)) { try { saleSample_(ss, tz, data); } catch (e) { console.error('예시: ' + e.message); } }   // 판매.gs: 기록 0줄이면 예시
  tick('rest');
  if (own && (typeof SHARE_OUT_ === 'undefined' || !SHARE_OUT_)) { try { CacheService.getScriptCache().put('perf_build', JSON.stringify(P), 900); } catch (e) {} }
  const out = safeJson_(data);
  if (typeof SHARE_OUT_ === 'undefined' || !SHARE_OUT_) dashCachePut_(out);
  MEMO_ = null;
  return out;
}

/**
 * 알림(은행·카드) 출금 → 대시보드 행. 넣는 것: 출금 중 제외(내 계좌 이체·카드대금·중복 알림) 아님,
 * 쿠팡·네이버 주문과 짝 없음(짝 있으면 구매 행이 이미 있음), 고정지출 아님(가계부 분류 고정·할부·공과금·통신, 개인 탭 고정 항목과 맞는 것)
 * 행 번호 = -(알림원본 행) → 분류 바꾸기는 알림원본 N열에 저장
 */
function dashNotiRows_(ss, tz) {
  if (typeof ledgerLive_ !== 'function') return [];
  const linked = typeof rcptLinked_ === 'function' ? rcptLinked_(ss) : {};   // 영수증과 연결된 결제는 품목으로 대신 (이중 집계 방지)
  return buildNotiRows_(ledgerLive_(ss, tz), dashIsFixed_(ss), dashSyncAt_(ss)).filter(r => !linked[-r[7]]);
}
function dashIsFixed_(ss) { return memo_('isFixed', () => typeof planFixedTest_ === 'function' ? planFixedTest_(ss) : () => false);
}
/** 신용카드(DASH.CARD) 승인 알림 → {unpaid: 승인 합계(취소 뺌), n: 건수, cum: 마지막 '누적 ○원', cumAt} 또는 null
 *  카드대금 출금으로 0부터 다시 세는 규칙은 첫 대금 출금 알림을 본 뒤 추가 (2026-11-13: 지금은 알림 시작 11/7 이후 전부) */
function dashCard_(ss, tz) {
  if (typeof ledgerLive_ !== 'function' || !DASH.CARD) return null;
  try {
    const re = new RegExp('카드\\s*' + DASH.CARD);
    let unpaid = 0, n = 0, cum = null, cumAt = '';
    ledgerLive_(ss, tz).forEach(x => {
      if (!re.test(x.body) || x.excluded || !(x.amount > 0)) return;
      if (x.type === '출금') { unpaid += x.amount; n++; } else if (x.type === '취소') unpaid -= x.amount;
      const m = String(x.body).match(/누적\s*([\d,]+)\s*원/);
      if (m && x.when >= cumAt) { cum = Number(m[1].replace(/,/g, '')); cumAt = x.when; }
    });
    return n || cum != null ? { unpaid, n, cum, cumAt } : null;
  } catch (e) { return null; }
}
/** 생활계좌 마지막 알림 잔액 {bal, when} 또는 null (알림원본 시각 순으로 마지막) */
function dashKbBal_(ss, tz) {
  if (typeof readNotis_ !== 'function' || typeof parseBalance_ !== 'function' || !DASH.LIVING_ACCT) return null;
  try {
    let last = null;
    readNotis_(ss.getSheetByName(LEDGER.NOTI), tz).forEach(x => {
      const b = parseBalance_(x.app, x.title, x.text);
      const t = b ? (b.acct.match(/(\d{2,})$/) || [])[1] : '';   // 생활계좌 = 계좌 탭 끝자리 (예전 '국민 123' 표기도 끝자리로 비교)
      if (b && (b.acct === DASH.LIVING_ACCT || acctTailEq_(t, (String(DASH.LIVING_ACCT).match(/(\d{2,})$/) || [])[1])) && (!last || x.when >= last.when)) last = { bal: b.bal, when: x.when };
    });
    return last;
  } catch (e) { return null; }
}
/** 알림수집기가 기록한 쇼핑몰별 마지막 동기화 시각 (가계부설정 M6:N7) → {쿠팡:'yyyy-MM-dd HH:mm:ss', 네이버:…} */
function dashSyncAt_(ss) { return memo_('syncAt', () => dashSyncAtRaw_(ss)); }
function dashSyncAtRaw_(ss) {
  const o = {};
  try {
    Object.assign(o, saleSyncRead_(ss));
  } catch (e) {}
  return o;
}
const NOTI_FIXED_CAT = ['고정·할부', '공과금·통신', '수입'];
const NOTI_SHOP_RE = /쿠팡|coupang|네이버|naver|N페이|npay/i, NOTI_EATS_RE = /쿠팡이츠|coupangeats|coupang\.mobile\.eats/i;
/**
 * 가게 이름용 분류 (카드·계좌 알림의 가게 이름, '+' 직접 입력 내용). 상품명 규칙(CAT_RULES)보다 먼저 검사.
 * 상품명 규칙에 넣지 않은 이유: '비비고 김밥'·'냉동 피자' 같은 쿠팡 상품은 식품이어야 해서 (2026-11-07 '김밥천국 점심'이 식품으로 잡힘)
 */
const DELIVERY_RE = /쿠팡이츠|coupangeats|coupang\.mobile\.eats|배달의민족|배민|요기요|땡겨요|위메프오/i;   // 배달 앱 (2026-11-08 '배달' 분류)
const TRANSIT_RE = /티머니|tmoney|캐시비|이즐|레일플러스|버스|지하철|도시철도|택시|카카오\s?T(?![a-z])|카카오모빌리티|우티|코레일|KTX|SRT|에스알/i;   // 대중교통·택시 (2026-11-08 '교통' 분류). 주유·주차·하이패스는 차량
const MERCHANT_RULES = [
  ['배달', DELIVERY_RE],
  ['교통', TRANSIT_RE],
  ['외식·카페', /김밥|분식|식당|국밥|순대|치킨|통닭|피자|버거|맥도날드|롯데리아|맘스터치|서브웨이|떡볶이|중국집|반점|짜장|짬뽕|마라|초밥|스시|돈까스|돈가스|고깃집|삼겹|갈비|곱창|막창|족발|보쌈|냉면|칼국수|국수|파스타|뷔페|횟집|포차|호프|주점|이자카야|점심|저녁|회식|커피|카페|베이커리|제과|빵집|파리바게뜨|뚜레쥬르|도넛|던킨|배스킨|설빙|공차|스타벅스|메가커피|컴포즈|이디야|투썸|빽다방|텐퍼센트/i],
  ['가전·디지털', /하이마트|전자랜드|삼성스토어|LG베스트샵|애플스토어|일렉트로마트/i],   // '하이마트'가 아래 '마트'(식품)에 걸리지 않게 먼저
  ['식품', /(?<!하이|일렉트로)마트|편의점|GS25|(^|[^A-Za-z])CU([^A-Za-z]|$)|세븐일레븐|미니스톱|시장|반찬|정육|청과|하나로|홈플러스|코스트코|트레이더스|컬리|장보기/i],
  ['건강', /약국|병원|의원|치과|안과|소아과/],
  ['차량', /주유|충전소|주차|하이패스|세차|정비|카센터|타이어/i],
  ['미용', /미용실|헤어|네일|바버|이발/],
  ['생활·주방', /다이소|세탁소|코인빨래/],
  ['뷰티·위생', /올리브영|롭스|화장품/],
  ['여행', /호텔|모텔|펜션|리조트|숙박|항공|공항/],
];
function merchantCat_(t) {
  const s = String(t || '');
  for (const [c, re] of MERCHANT_RULES) if (re.test(s)) return c;
  return null;
}
const NOTI_CAT_MAP = { '외식·카페': '외식·카페', '장보기': '식품', '의료': '건강', '교통·차량': '차량', '육아': '육아' };
function buildNotiRows_(live, isFixed, syncAt) {
  syncAt = syncAt || {};
  const out = [];
  live.forEach(x => {
    if (!(x.type === '출금' && x.amount > 0 && x.mon && !x.excluded && !x.matched) || notiIsFixed_(x, isFixed)) return;
    let name = notiName_(x), cat = notiCat_(x);
    if (NOTI_SHOP_RE.test(x.text) && !NOTI_EATS_RE.test(x.text)) {
      // 쿠팡·네이버 결제 알림인데 주문과 짝이 없음: 마지막 동기화 뒤의 것만 '동기화 전'으로 임시 포함(다음 동기화 때 주문과 짝지어지면 빠짐), 그 전 것은 구매 행에 이미 있으니 뺌
      const shop = /네이버|naver|N페이|npay/i.test(x.text) ? '네이버' : '쿠팡';
      if (!(syncAt[shop] && x.when > syncAt[shop])) return;
      name = shop + ' 결제 (동기화 전)'; cat = '기타';
    }
    out.push([DASH.NOTI_SRC, x.when.slice(0, 10), 'N' + x.row, name, x.amount, cat, '', -x.row].concat(x.amount0 != null && x.amount0 !== x.amount ? [0, x.amount0] : []));   // 10번째 = 고치기 전 금액 (9번째는 영수증 묶음 자리)
  });
  return out;
}
/**
 * 고정지출(대시보드 지출에서 빼고 계획 탭에서 셈): 개인 탭 고정 항목과 맞음, 또는 가계부 분류가 고정·공과금이면서 대시보드 분류가 '기타'뿐인 것
 *  2026-11-13 수정: 전에는 가계부 분류만 보고 뺐음 → 카드 '3개월 할부' 결제(분류 단어 '할부')·KTX(단어 'KT')·'수도권 주차장'(단어 '수도')이 지출에서 통째로 빠졌음
 */
function notiIsFixed_(x, isFixed) {
  if (x.cat === '수입') return true;
  if (notiNotFixed_(x)) return false;
  if (isFixed(x.text, x.amount)) return true;
  return NOTI_FIXED_CAT.indexOf(x.cat) >= 0 && notiCat_(x) === '기타';
}
/** 고정지출이 될 수 없는 결제: 카드 할부 구매('3개월'), 대중교통·택시·배달 (연결 단어 'KT'·'할부'가 KTX·할부 구매에 걸리던 문제, 2026-11-13) */
function notiNotFixed_(x) {
  const t = [x.text, x.body, x.alt].map(v => String(v || '')).join(' ');
  const n = +((t.match(/(\d{1,2})\s*개월/) || [])[1] || 0);
  return n >= 2 || TRANSIT_RE.test(t) || DELIVERY_RE.test(t);
}
/** 월별 고정지출 알림 합계 {월: 금액} (계획 탭 '나간 돈') */
function dashFixedOut_(live, isFixed) {
  const out = {};
  live.forEach(x => { if (x.type === '출금' && x.amount > 0 && x.mon && !x.excluded && !x.matched && notiIsFixed_(x, isFixed)) out[x.mon] = (out[x.mon] || 0) + x.amount; });
  return out;
}
/** 알림 글에서 가게 이름만 남김 (이름 가림·날짜·계좌·금액·잔액 제거) */
function notiLabel_(x) {
  const p = String(x.party || '').trim();
  if (p) return p;
  const amt = Number(x.amount).toLocaleString('en-US');
  let s = String(x.body || '')
    .replace(/\[수신[^\]]*\]/g, ' ')
    .replace(/잔액[\s\S]*$/, ' ')
    .replace(/[가-힣A-Za-z]\*[가-힣A-Za-z*]*님/g, ' ')
    .replace(/\d{1,2}\/\d{1,2}\s+\d{1,2}:\d{2}/g, ' ')
    .replace(/[\d*]{2,}-[\d*-]+/g, ' ')
    .replace(/\(\d{3,4}\)/g, ' ')
    .split(amt + '원').join(' ').split(amt).join(' ')
    .replace(/\s+/g, ' ').trim()
    .replace(/\s*(FBS|체크카드|신용카드|전자금융|자동이체|CMS|타행|인터넷)?\s*(출금|사용|승인|결제)\s*$/, '').trim()
    .replace(/^[가-힣A-Za-z]*(체크|카드)\s+/, '')   // KB Pay 앞의 카드 이름 'KB국민체크'
    .replace(/\s*\([^)]*$/, '').trim();   // 잘린 괄호 '충전(' / 끝의 '체크카드출금' 같은 말 제거
  return s || String(x.title || '').trim() || '(알림)';
}
/** 가게 이름: 같은 결제의 두 알림(은행·KB Pay) 중 더 긴 이름 (은행 쪽은 잘려 오는 경우가 많음: '파리바게뜨신' vs '파리바게뜨 신흥사거') */
/**
 * 확인 (2026-11-15): 계좌에서 사람 이름으로 나간 이체 = 지출인지 모름 → 사람이 분류를 고르거나 '아님'
 *  대상: 출금 · 이번 달/지난달 · 제외·주문 짝·고정(계획 항목) 아님 · 아직 손대지 않음(알림원본 N열 빔). '아님' = excludeNoti_ (key = 알림 이름으로 행 확인)
 *  이체 표시: 'NN출금'(스마트폰·인터넷·모바일·폰뱅킹) 또는 '→ 이름' (카드·체크카드·자동이체(FBS) 출금은 가게 결제라 뺌)
 */
const CHECK_RE = /(스마트폰|인터넷|모바일|폰뱅킹|ATM)\s*출금|→\s*\S/;
function dashCheck_(live, isFixed, mon) {
  const prev = (() => { const y = +mon.slice(0, 4), m = +mon.slice(5, 7) - 1; return m ? y + '-' + String(m).padStart(2, '0') : (y - 1) + '-12'; })();
  return live.filter(x => x.type === '출금' && x.amount > 0 && (x.mon === mon || x.mon === prev) && !x.excluded && !x.matched && !x.fix
      && CHECK_RE.test(x.body || x.text) && !/체크카드출금|FBS출금|자동이체/.test(x.body || x.text) && !notiIsFixed_(x, isFixed))
    .sort((a, b) => a.when < b.when ? 1 : -1)
    .map(x => ({ row: -x.row, date: x.when.slice(0, 10), key: notiName_(x), name: notiName_(x).replace(/\s*(스마트폰|인터넷|모바일|폰뱅킹)$/, ''), amount: x.amount, acct: (String(x.body || '').match(/\((\d{4})\)/) || String(x.body || '').match(/\*{2,}(\d{2,})/) || [])[1] || '' }));
}
function notiName_(x) {
  const a = notiLabel_(x), b = x.alt ? notiLabel_({ body: x.alt, amount: x.amount }) : '';
  return b && b !== '(알림)' && b.length > a.length ? b : a;
}
/** 알림 분류: 직접 고친 값(대시보드 분류 칸) > 배달·교통 > 가계부 분류를 대시보드 분류로 바꾼 값 > 가게 이름 규칙 > 상품 분류 규칙 */
function notiCat_(x) {
  if (CAT_ORDER.indexOf(x.fix) >= 0) return x.fix;
  const mm = merchantMemoFind_(notiName_(x));   // 가게분류 탭 (대시보드에서 한 번 고친 가게)
  if (mm) return mm;
  const all = [notiLabel_(x), x.title, x.body, x.party, x.alt].map(v => String(v || '')).join(' ');
  if (DELIVERY_RE.test(all)) return '배달';   // 가계부 분류(외식)보다 먼저
  if (TRANSIT_RE.test(all)) return '교통';    // 가계부 분류 '교통·차량'보다 먼저 (주유·주차는 아래에서 차량)
  if (NOTI_CAT_MAP[x.auto]) return NOTI_CAT_MAP[x.auto];
  const t = notiName_(x) + ' ' + String(x.body || '') + ' ' + String(x.alt || '');
  return merchantCat_(t) || classify(t);
}

/* ---------- 직접 입력 (현금 등 알림이 안 오는 지출) ---------- */
function manualTab_(ss, create) {
  let sh = ss.getSheetByName(DASH.MANUAL_TAB);
  if (sh || !create) return sh;
  sh = ss.insertSheet(DASH.MANUAL_TAB); hideTab_(sh);
  sh.getRange(1, 1, 1, 5).setValues([['날짜', '내용', '금액', '분류', '입력시각']]).setFontWeight('bold').setBackground('#385723').setFontColor('#FFFFFF');
  sh.setFrozenRows(1);
  sh.getRange('A:A').setNumberFormat('@'); sh.getRange('C:C').setNumberFormat('#,##0');
  return sh;
}
function manualRows_(ss) {
  const sh = manualTab_(ss, false);
  if (!sh || sh.getLastRow() < 2) return [];
  return sh.getRange(2, 1, sh.getLastRow() - 1, 4).getDisplayValues().map((r, i) => ({
    src: DASH.MANUAL_SRC, date: String(r[0]).trim(), order: 'M' + (i + 2), name: String(r[1]).trim(),
    amount: Number(String(r[2]).replace(/[^0-9.-]/g, '')) || 0, cat: CAT_ORDER.indexOf(r[3]) >= 0 ? r[3] : '기타', row: DASH.MANUAL_BASE + i + 2,
  })).filter(r => /^\d{4}-\d{2}-\d{2}$/.test(r.date) && r.amount > 0);
}
function manualCheck_(o) {
  const date = String(o && o.date || ''), name = String(o && o.name || '').trim().slice(0, 100), amount = Math.round(Number(o && o.amount));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('날짜 형식');
  if (!(amount >= 1 && amount <= 100000000)) throw new Error('금액은 1원~1억');
  if (!name) throw new Error('내용을 입력');
  if (CAT_ORDER.indexOf(o.cat) < 0) throw new Error('없는 분류: ' + o.cat);
  return { date, name, amount, cat: o.cat };
}
/** 대시보드 '+' → 직접입력 탭 한 행 추가. 반환 = 대시보드 행 번호 */
function addManual_(o) {
  dashCacheClear_();
  const v = manualCheck_(o);
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const sh = manualTab_(dashSs_(), true);
    sh.appendRow([v.date, v.name, v.amount, v.cat, Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss')]);
    return DASH.MANUAL_BASE + sh.getLastRow();
  } finally { lock.releaseLock(); }
}
/** 직접 입력 고치기·지우기 (del=true면 그 행을 비움). 행의 내용이 oldName과 다르면 거부 */
function editManual_(row, oldName, o, del) {
  dashCacheClear_();
  const r = Number(row) - DASH.MANUAL_BASE;
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const sh = manualTab_(dashSs_(), false);
    if (!sh || !(r >= 2 && r <= sh.getLastRow())) throw new Error('행 없음 → 새로고침');
    if (String(sh.getRange(r, 2).getDisplayValue()).trim() !== String(oldName).trim()) throw new Error('시트가 바뀜 → 새로고침');
    if (del) { sh.getRange(r, 1, 1, 5).clearContent(); return { deleted: true }; }
    const v = manualCheck_(o);
    sh.getRange(r, 1, 1, 4).setValues([[v.date, v.name, v.amount, v.cat]]);
    return { ok: true };
  } finally { lock.releaseLock(); }
}

/**
 * 대시보드에서 분류 바꾸기 → 구매내역관리 J열 (직접 고친 분류는 자동 분류가 덮어쓰지 않음)
 *  list = [[행번호, 상품명], ...]. 그 행의 상품명(D열)이 다르면(행이 밀렸으면) 건너뜀
 */
function setCategory_(list, cat) {
  dashCacheClear_();
  if (CAT_ORDER.indexOf(cat) < 0) throw new Error('없는 분류: ' + cat);
  if (!Array.isArray(list) || !list.length || list.length > 1000) throw new Error('잘못된 요청');
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const sh = dashSs_().getSheetByName(CFG.SHEET);
    const F = CFG.FIRST_ROW, L = Math.max(buyLast_(sh, F), F);
    const names = sh.getRange(F, 4, L - F + 1, 1).getDisplayValues();
    const ok = [], okN = [], okM = [];
    let skip = 0, live = null, mt = null, rt = null;
    const okR = [], memR = [];
    const memN = [];
    list.forEach(x => {
      const row = Number(x[0]);
      if (typeof RCPT !== 'undefined' && row > RCPT.BASE) {                  // 영수증 품목 → 영수증 E열
        if (!rt) rt = rcptTab_(dashSs_(), false);
        const r = row - RCPT.BASE;
        if (rt && r >= 2 && r <= rt.getLastRow() && String(rt.getRange(r, 3).getDisplayValue()).trim() === String(x[1]).trim()) { okR.push('E' + r); memR.push(String(x[1])); } else skip++;
        return;
      }
      if (row > DASH.MANUAL_BASE) {                                       // 직접 입력 행 → 직접입력 D열
        if (!mt) mt = manualTab_(dashSs_(), false);
        const r = row - DASH.MANUAL_BASE;
        if (mt && r >= 2 && r <= mt.getLastRow() && String(mt.getRange(r, 2).getDisplayValue()).trim() === String(x[1]).trim()) okM.push('D' + r); else skip++;
        return;
      }
      if (row < 0) {                                                     // 카드·계좌 행 → 알림원본 N열(분류 수정)
        if (!live) live = ledgerLive_(dashSs_(), 'Asia/Seoul');
        const n = live.find(o => o.row === -row);
        if (n && (notiName_(n) === String(x[1]) || notiLabel_(n) === String(x[1]))) { okN.push('N' + (-row)); memN.push(notiName_(n)); } else skip++;   // 화면 이름 = notiName_ (2026-11-13 수정: @30부터 이름이 달라 못 바꾸던 문제)
        return;
      }
      if (row >= F && row <= L && names[row - F][0] === String(x[1])) ok.push('J' + row); else skip++;
    });
    if (ok.length) sh.getRangeList(ok).setValue(cat);
    if (okN.length) dashSs_().getSheetByName(LEDGER.NOTI).getRangeList(okN).setValue(cat);
    if (okM.length) mt.getRangeList(okM).setValue(cat);
    if (okR.length) { rt.getRangeList(okR).setValue(cat); merchantMemoSave_(memR, cat); }   // 품목 이름별 기억
    if (memN.length) merchantMemoSave_(memN, cat);   // 가게분류 탭에 기억 → 같은 가게의 다른 결제도 이 분류
    return { done: ok.length + okN.length + okM.length + okR.length, skip };
  } finally { lock.releaseLock(); }
}

/** 대시보드 '이 결제 빼기' (카드·계좌 알림만) → 알림원본 N열 '제외'. list = [[행번호(음수), 화면 이름], …] */
/** 대시보드 자산 고치기 (개인용 2026-11-16 이식, 계좌.gs acSetRow_) */
function setAcctRow_(kind, row, key, o) {
  dashCacheClear_();
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try { return acSetRow_(dashSs_(), kind, row, key, o); } finally { lock.releaseLock(); }
}
/** 대시보드 계획 줄 고치기 (계획탭.gs ptSetRow_) */
function setPlanRow_(row, name, o) {
  dashCacheClear_();
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try { return ptSetRow_(dashSs_(), row, name, o || {}); } finally { lock.releaseLock(); }
}
/** 대시보드 내역 → 금액 고치기: 알림원본 Q '금액 수정'. amount = null이면 원래대로. 원래 금액(F)은 그대로 */
function setNotiAmount_(id, amount) {
  dashCacheClear_();
  const r = -Number(id);
  const sh = dashSs_().getSheetByName(LEDGER.NOTI);
  if (!(r >= 2 && r <= sh.getLastRow()) || sh.getRange(r, 5).getValue() !== '출금') throw new Error('잘못된 줄');
  const v = amount == null || amount === '' ? '' : Math.round(Number(amount));
  if (v !== '' && !(v >= 0 && v <= 100000000)) throw new Error('금액 확인');
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    if (!String(sh.getRange(1, LEDGER.AMT_COL).getValue()).trim()) sh.getRange(1, LEDGER.AMT_COL).setValue('금액 수정').setFontWeight('bold');
    sh.getRange(r, LEDGER.AMT_COL).setValue(v);
    return { ok: 1 };
  } finally { lock.releaseLock(); }
}
function excludeNoti_(list) {
  dashCacheClear_();
  if (!Array.isArray(list) || !list.length || list.length > 200) throw new Error('잘못된 요청');
  const lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    const ss = dashSs_(), live = ledgerLive_(ss, 'Asia/Seoul'), ok = [];
    let skip = 0;
    list.forEach(x => {
      const row = Number(x[0]), n = row < 0 ? live.find(o => o.row === -row) : null;
      if (n && (notiName_(n) === String(x[1]) || notiLabel_(n) === String(x[1]))) ok.push('N' + (-row)); else skip++;
    });
    if (ok.length) ss.getSheetByName(LEDGER.NOTI).getRangeList(ok).setValue(LEDGER.FIX_EX);
    return { done: ok.length, skip };
  } finally { lock.releaseLock(); }
}

/** 대시보드에서 예산 바꾸기 → 가계부설정 B4 */
function setBudget_(n) {
  dashCacheClear_();
  n = Math.round(Number(n));
  if (!(n >= 10000 && n <= 100000000)) throw new Error('1만~1억 사이로 입력');
  const name = typeof LEDGER !== 'undefined' ? LEDGER.SET : '가계부설정';
  const st = dashSs_().getSheetByName(name);
  if (!st) throw new Error("'" + name + "' 탭이 없습니다 (setupLedger 먼저 실행)");
  st.getRange('B4').setValue(n);
  return n;
}

/** computeAnalysis와 그 설정값을 브라우저용 코드로 */
function dashLib_() {
  const ser = (name, list) => 'var ' + name + ' = [' + list.map(([c, re]) => '[' + JSON.stringify(c) + ',' + re.toString() + ']').join(',') + '];\n';
  const rules = ser('CAT_RULES', CAT_RULES) + ser('MERCHANT_RULES', MERCHANT_RULES) + merchantCat_.toString() + ';\n';   // '+' 창 분류 자동 추천용 (가게 이름 규칙 → 상품 규칙)
  return 'var CFG = ' + safeJson_({ SOURCES: CFG.SOURCES.concat([DASH.NOTI_SRC, DASH.MANUAL_SRC]).concat(typeof RCPT !== 'undefined' ? [RCPT.SRC] : []) }) + ';\n'
    + rules.split('</').join('<\\/') + classify.toString() + ';\n'
    + 'var ANA = ' + safeJson_(ANA) + ';\n'
    + 'var CAT_ORDER = ' + safeJson_(CAT_ORDER) + ';\n'
    + 'var CAT_COLOR = ' + safeJson_(CAT_COLOR) + ';\n'
    + computeAnalysis.toString() + ';\n';
}

// <script> 안에 넣어도 안전한 JSON (상품명에 '</script>' 같은 글자가 있어도 깨지지 않게)
function safeJson_(x) {
  return JSON.stringify(x).split('<').join(String.fromCharCode(92) + 'u003c');   // JSON 안의 '<'를 유니코드 이스케이프로 (값은 그대로, HTML 파서만 피함)
}


;// ===== 버전.js =====
const HN_BUILD = 9;   // 출시 때 release_prep가 올림. 직접 고치지 말 것


;// ===== 보관.js =====
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
    const shown = noti.getRange(2, 1, n, 1).getDisplayValues();   // 날짜는 보이는 글자 그대로 (시간대 밀림 방지, 2026-11-17)
    const dates = v.map((r, i) => { let s = String(shown[i][0]).slice(0, 10); if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) s = r[0] instanceof Date ? Utilities.formatDate(r[0], tz, 'yyyy-MM-dd') : String(r[0]).slice(0, 10); return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : ''; });
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


;// ===== 설정.js =====
/**
 * 설정.gs — '설정' 탭 (2026-11-15, 판매용_개발가이드 5-2장). 가계부설정에서 쓰던 것 중 사람이 고치는 것만 위에서 아래로.
 *  연결 상태 : 쿠팡·네이버 마지막 동기화 (알림수집기가 숨긴 가계부설정 M6:N7에 계속 기록 → 여기선 수식으로 보여 줌)
 *  제외      : 단어 · 사유 (알림 글에 단어가 있으면 지출·입금에서 뺌)
 *  분류      : 단어(쉼표로 여러 개) · 분류 (위가 우선)
 *  예산은 계획 탭에서 계산(수입 − 고정 − 저축)하므로 여기 없음.
 */
const ST = {
  TAB: '설정',
  CONN: '연결 상태', CARD: '카드', EX: '제외', CAT: '분류',
  EX_ROWS: 20, CAT_ROWS: 40,
  YELLOW: '#FFF2CC',
};

/* ---------- 순수 ---------- */

/** 'A, B' 또는 'A|B' → 정규식 글자 (각 단어는 글자 그대로) */
function stWordsRe_(s) {
  const esc = w => w.replace(/[.*+?^${}()[\]\\]/g, '\\$&');
  return String(s || '').split(/\s*[,|]\s*/).map(w => w.trim()).filter(Boolean).map(esc).join('|');
}
/** 탭 값(A·B 두 칸) → {exclude, rules}. 제목 줄('제외'·'분류') 다음 머리 줄 다음부터 다음 제목까지 */
function stParse_(v) {
  const out = { exclude: [], rules: [] };
  let sec = '';
  v.forEach(r => {
    const a = String(r[0] == null ? '' : r[0]).trim(), b = String(r[1] == null ? '' : r[1]).trim();
    if (a === ST.CONN || a === ST.CARD || a === ST.EX || a === ST.CAT) { sec = a; return; }
    if (!a || a === '단어' || a === '항목') return;
    if (sec === ST.EX) out.exclude.push([a, b]);
    if (sec === ST.CAT) { const re = stWordsRe_(a); if (re) out.rules.push([re, b || '기타']); }
  });
  return out;
}

/* ---------- 시트 ---------- */

/** 없으면 만들고 가계부설정 D:E(제외)·G:H(분류)를 옮김.
 *  판매용: saleStConn_(예전 탭)·saleStCard_(예전 탭)가 있으면 '연결 상태' 줄과 '카드' 칸을 그 값으로. 예전 배치 설정 탭(A1 '항목')은 '설정(예전)'으로 이름을 바꿔 숨기고 새로 만듦 */
function stTab_(ss) {
  let sh = ss.getSheetByName(ST.TAB);
  let prev = null;
  if (sh && String(sh.getRange(1, 1).getDisplayValue()).trim() === '항목') { prev = sh; prev.setName(ST.TAB + '(예전)'); prev.hideSheet(); sh = null; }
  if (sh) return sh;
  const after = ss.getSheetByName(typeof AC !== 'undefined' ? AC.TAB : '계좌') || ss.getSheetByName(typeof PT !== 'undefined' ? PT.TAB : '계획');
  sh = ss.insertSheet(ST.TAB, after ? after.getIndex() : 0);
  const old = ss.getSheetByName(typeof LEDGER !== 'undefined' ? LEDGER.SET : '가계부설정');
  let ex = [], cat = [];
  if (old && old.getLastRow() >= 6) {
    old.getRange(6, 4, old.getLastRow() - 5, 5).getDisplayValues().forEach(r => {
      if (String(r[0]).trim() && !/^\(/.test(String(r[0]).trim())) ex.push([String(r[0]).trim(), String(r[1]).trim()]);   // '(내 이름…)' 안내 줄 제외
      if (String(r[3]).trim()) cat.push([String(r[3]).trim().split('|').map(w => w.trim()).filter(Boolean).join(', '), String(r[4]).trim()]);
    });
  } else if (typeof LEDGER !== 'undefined') { ex = LEDGER.DEFAULT_EXCLUDE.slice(); cat = LEDGER.DEFAULT_RULES.map(r => [String(r[0]).split('|').join(', '), r[1]]); }
  const hd = r => r.setFontWeight('bold').setBackground('#F3F3F3').setBorder(null, null, true, null, null, null, '#9AA0A6', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  const title = (row, t) => sh.getRange(row, 1).setValue(t).setFontWeight('bold').setFontSize(11);
  let r = 1;
  title(r, ST.CONN); hd(sh.getRange(r + 1, 1, 1, 2)).setValues([['항목', '값']]);
  const set = old ? "'" + old.getName() + "'!" : '';
  const conn = typeof saleStConn_ === 'function' ? saleStConn_(prev) : [['쿠팡', old ? '=IFERROR(' + set + 'N6,"")' : ''], ['네이버', old ? '=IFERROR(' + set + 'N7,"")' : '']];
  sh.getRange(r + 2, 1, conn.length, 2).setValues(conn);
  sh.getRange(r + 2, 2, conn.length, 1).setFontColor('#5F6368');
  if (typeof saleStConn_ !== 'function') sh.getRange(r + 2, 2, conn.length, 1).setNumberFormat('yyyy-mm-dd hh:mm');   // 개인용: 동기화 시각 수식이 숫자로 보이지 않게
  r += 3 + conn.length;
  if (typeof saleStCard_ === 'function') {   // 판매용: 카드·내 이름 (알림 앱을 쓸 때)
    const card = saleStCard_(prev);
    title(r, ST.CARD); hd(sh.getRange(r + 1, 1, 1, 2)).setValues([['항목', '값']]);
    sh.getRange(r + 2, 1, card.length, 2).setValues(card);
    sh.getRange(r + 2, 2, card.length, 1).setBackground(ST.YELLOW).setNumberFormat('@');
    r += 3 + card.length;
  }
  title(r, ST.EX); hd(sh.getRange(r + 1, 1, 1, 2)).setValues([['단어', '사유']]);
  const exR = sh.getRange(r + 2, 1, ST.EX_ROWS, 2).setBackground(ST.YELLOW);
  if (ex.length) sh.getRange(r + 2, 1, Math.min(ex.length, ST.EX_ROWS), 2).setValues(ex.slice(0, ST.EX_ROWS));
  r += 2 + ST.EX_ROWS + 1;
  title(r, ST.CAT); hd(sh.getRange(r + 1, 1, 1, 2)).setValues([['단어', '분류']]);
  sh.getRange(r + 2, 1, ST.CAT_ROWS, 2).setBackground(ST.YELLOW);
  if (cat.length) sh.getRange(r + 2, 1, Math.min(cat.length, ST.CAT_ROWS), 2).setValues(cat.slice(0, ST.CAT_ROWS));
  const cats = cat.map(x => x[1]).concat(typeof LEDGER !== 'undefined' ? LEDGER.DEFAULT_RULES.map(x => x[1]) : []).filter((x, i, a) => x && a.indexOf(x) === i);
  if (cats.length) sh.getRange(r + 2, 2, ST.CAT_ROWS, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(cats, true).setAllowInvalid(true).build());
  sh.setColumnWidth(1, 360); sh.setColumnWidth(2, 220);
  return sh;
}

/** 설정 탭에서 A열 이름이 label인 줄의 B값 (없으면 '') / 쓰기 */
function stGet_(ss, label) {
  const sh = ss.getSheetByName(ST.TAB);
  if (!sh || sh.getLastRow() < 1) return '';
  const v = sh.getRange(1, 1, Math.min(sh.getLastRow(), 40), 2).getDisplayValues();
  const r = v.find(x => String(x[0]).trim() === label);
  return r ? String(r[1]).trim() : '';
}
function stSet_(ss, label, value) {
  const sh = ss.getSheetByName(ST.TAB);
  if (!sh || sh.getLastRow() < 1) return false;
  const v = sh.getRange(1, 1, Math.min(sh.getLastRow(), 40), 1).getDisplayValues();
  const i = v.findIndex(x => String(x[0]).trim() === label);
  if (i < 0) return false;
  sh.getRange(i + 1, 2).setValue(value);
  return true;
}

/** 읽기: 설정 탭이 있으면 {exclude, rules}, 없으면 null (→ 가계부설정에서) */
function stRead_(ss) {
  const sh = ss.getSheetByName(ST.TAB);
  const last = sh ? sh.getLastRow() : 0;
  if (last < 2) return null;
  return stParse_(sh.getRange(1, 1, last, 2).getDisplayValues());
}

/** 한 번만 (2026-11-15): 이미 만든 개인용 설정 탭의 동기화 시각 칸 형식 */
function stFmtV1_(ss) {
  const sh = ss.getSheetByName(ST.TAB);
  if (!sh || typeof saleStConn_ === 'function') return;
  const v = sh.getRange(1, 1, Math.min(sh.getLastRow(), 10), 1).getDisplayValues();
  v.forEach((r, i) => { if (/^(쿠팡|네이버)$/.test(String(r[0]).trim())) sh.getRange(i + 1, 2).setNumberFormat('yyyy-mm-dd hh:mm'); });
}
/** 한 번만: 설정 탭을 만들고 가계부설정 탭 숨김 (지우지 않음 — 알림수집기가 M6:N7에 동기화 시각을 계속 씀) */
function stTidyV1_(ss) {
  stTab_(ss);
  const old = ss.getSheetByName(typeof LEDGER !== 'undefined' ? LEDGER.SET : '가계부설정');
  if (old) old.hideSheet();
}

/** 한 번만: 탭 색·순서 정리 (가계부 입력 탭 = 노랑, 자동 계획 = 회색, 개인용 = 초록, 생활 문서 = 연회색으로 맨 뒤). 월마감 안내 2줄 숨김 */
function tabTidyV1_(ss) {
  const mine = !!ss.getSheetByName(typeof PT !== 'undefined' ? PT.SRC : '개인');   // 개인용: 계획 탭은 자동(회색)
  const color = { '시작하기': '#1A73E8', '계획': mine ? '#9AA0A6' : '#F9AB00', '계좌': '#F9AB00', '설정': '#F9AB00', '개인': '#188038', '월마감': '#188038' };
  const known = Object.keys(color).concat(['가계부설정', '정기결제']);
  ss.getSheets().forEach(sh => {
    const n = sh.getName();
    if (color[n]) sh.setTabColor(color[n]);
    else if (!sh.isSheetHidden() && known.indexOf(n) < 0) sh.setTabColor('#DADCE0');   // 생활 문서 등
  });
  // 보이는 생활 문서 탭을 맨 뒤로
  const life = ss.getSheets().filter(sh => !sh.isSheetHidden() && !color[sh.getName()] && known.indexOf(sh.getName()) < 0);
  life.forEach(sh => { ss.setActiveSheet(sh); ss.moveActiveSheet(ss.getNumSheets()); });
  const close = ss.getSheetByName(typeof LEDGER !== 'undefined' ? LEDGER.CLOSE : '월마감');
  if (close) close.hideRows(2, 2);
}


;// ===== 소비분석.js =====
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


;// ===== 수입.js =====
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


;// ===== 수집.js =====
/**
 * 수집.gs (판매용) — 웹앱 입구: 크롬 확장(쿠팡·네이버)·알림 앱이 보내는 데이터를 받음
 *  개인용에서는 별도 프로젝트(알림수집기)였음. 판매용은 시트에 붙은 프로젝트 하나로 합쳐 배포 1회.
 *  웹앱 액세스 '모든 사용자' + 비밀 토큰(스크립트 속성 TOKEN, 설치 때 자동 생성). 대시보드는 별도 키(DKEY)로 보호 (판매.gs doGet)
 *  원칙: 알림은 원문을 먼저 그대로 저장하고, 금액·구분 추출은 그다음.
 */
const NOTI = {
  TAB: '알림원본',
  HEAD: ['수신시각', '앱', '제목', '내용', '구분', '금액', '상대(추정)', '중복키', '추출메모'],
  BUY_TAB: '구매내역관리',
  BUY_FIRST: 5,
  MAX_ROWS: 3000,           // 구매내역 한 번에 받는 최대 행 (비정상 요청 차단)
  BUY_SRC: { coupang: '쿠팡', naver: '네이버' },   // kind → 구매내역관리 A열 구분
  // 동기화 필요 여부(kind=need, 크롬 확장이 쇼핑몰을 열기 전에 물어봄): 마지막 동기화 뒤 그 쇼핑몰 결제·취소 알림이 있거나 SYNC_MAX_DAYS일이 지났으면 필요
  SHOP_RE: { coupang: /쿠팡|coupang/i, naver: /네이버|naver|N페이|npay/i },
  EATS_RE: /쿠팡이츠|coupangeats|coupang\.mobile\.eats/i,   // 쿠팡이츠는 쿠팡 주문목록에 없음 → 동기화 이유가 아님
  SYNC_MAX_DAYS: 7,
};

/** 토큰 (없으면 만듦). 화면·로그에 찍지 않음 — 연결코드로만 보여줌 (판매.gs) */
function saleToken_() {
  const props = PropertiesService.getScriptProperties();
  let t = props.getProperty('TOKEN');
  if (!t) { t = Utilities.getUuid().replace(/-/g, ''); props.setProperty('TOKEN', t); }
  return t;
}

function doPost(e) { return receive_(e); }

function receive_(e) {
  let p = {};
  try {
    p = params_(e);
    const token = PropertiesService.getScriptProperties().getProperty('TOKEN');
    if (!token || p.token !== token) {
      if (NOTI.BUY_SRC[p.kind] && p.format === 'json') return out_({ ok: false, error: 'token' });
      return p.kind === 'coupang' ? page_(false, '토큰이 맞지 않습니다', ['시트 메뉴 가계부 → 관리 → 대시보드 주소 · 연결코드에서 연결코드를 다시 복사하세요.']) : out_({ ok: false, error: 'token' });
    }
    if (NOTI.BUY_SRC[p.kind]) return purchase_(p, NOTI.BUY_SRC[p.kind]);
    if (p.kind === 'need') return needSync_();
    const text = String(p.text || '').trim(), title = String(p.title || '').trim();
    if (!text && !title) return out_({ ok: false, error: 'empty' });
    // 광고 푸시는 저장하지 않음 (정보통신망법상 광고 알림은 제목·내용 앞에 '(광고)' 표기)
    if (/^\s*[(\[]\s*광고\s*[)\]]/.test(title) || /^\s*[(\[]\s*광고\s*[)\]]/.test(text)) return out_({ ok: true, skipped: 'ad' });
    const app = String(p.app || '').trim();
    const tz = 'Asia/Seoul';
    const when = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd HH:mm:ss');
    const key = [app, title, text].join('|');
    const lock = LockService.getScriptLock(); lock.waitLock(10000);
    try {
      const sh = tab_();
      // 같은 알림이 다시 표시되는 경우(업데이트·재알림)만 건너뜀: 같은 내용이 2분 안에 또 오면 중복.
      // (같은 가게에서 같은 금액을 하루에 두 번 결제한 건 시간이 떨어져 있으니 둘 다 기록)
      const last = sh.getLastRow();
      if (last > 1) {
        const n = Math.min(50, last - 1);
        const recent = sh.getRange(last - n + 1, 1, n, 8).getValues();
        const now = Date.parse(when.replace(' ', 'T') + '+09:00');
        const t = v => (v instanceof Date ? v.getTime() : Date.parse(String(v).replace(' ', 'T') + '+09:00'));   // 시트가 날짜로 바꿔 저장해도 처리
        if (recent.some(r => r[7] === key && Math.abs(now - t(r[0])) < 120000))
          return out_({ ok: true, dup: true });
      }
      const x = parseNoti(title, text);
      sh.appendRow([when, app, title, text, x.type, x.amount, x.party, key, x.note]);
    } finally { lock.releaseLock(); }
    return out_({ ok: true });
  } catch (err) {
    const msg = String(err && err.message || err);
    if (NOTI.BUY_SRC[p.kind] && p.format === 'json') return out_({ ok: false, error: msg });
    return p.kind === 'coupang' ? page_(false, '반영 실패', [msg]) : out_({ ok: false, error: msg });
  }
}

/** JSON 본문, 폼, 주소(쿼리) 어느 방식으로 보내도 받음 */
function params_(e) {
  const p = Object.assign({}, (e && e.parameter) || {});
  const body = e && e.postData && e.postData.contents;
  if (body) {
    try { Object.assign(p, JSON.parse(body)); }
    catch (err) {
      // JSON이 아니면(알림 문구에 따옴표·줄바꿈이 섞여 깨진 경우 포함) 본문 전체를 알림으로 봄: 첫 줄 = 제목, 나머지 = 내용
      if (!p.text && !p.title && !/^[\w%]+=/.test(body)) {
        const i = body.indexOf('\n');
        if (i > 0) { p.title = body.slice(0, i); p.text = body.slice(i + 1); } else p.text = body;
      }
    }
  }
  return p;
}

function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

function tab_() {
  const ss = saleSs_();
  let sh = ss.getSheetByName(NOTI.TAB);
  if (!sh) {
    sh = ss.insertSheet(NOTI.TAB);
    sh.getRange(1, 1, 1, NOTI.HEAD.length).setValues([NOTI.HEAD]).setFontWeight('bold').setBackground('#1F3864').setFontColor('#FFFFFF');
    sh.setFrozenRows(1);
    sh.getRange('F:F').setNumberFormat('#,##0');
    [150, 110, 160, 420, 60, 90, 160, 80, 160].forEach((w, i) => sh.setColumnWidth(i + 1, w));
    sh.hideColumns(8);
  }
  return sh;
}

/**
 * 알림 문구 → {type: 출금/입금/취소/'', amount, party, note}
 *  은행·카드마다 문구가 달라서 1차 규칙은 일반형. 실제 알림이 쌓이면 규칙을 보완하고 reparseAll() 실행.
 */
function parseNoti(title, text) {
  const s = (String(title || '') + ' ' + String(text || '')).replace(/\s+/g, ' ').trim();
  // 금액 후보: '12,345원' 형태. '잔액'·'누적'·'한도' 바로 뒤 금액은 제외
  const re = /([0-9]{1,3}(?:,[0-9]{3})+|[0-9]+)\s*원/g;
  let m, amount = '', note = '';
  while ((m = re.exec(s)) !== null) {
    const before = s.slice(Math.max(0, m.index - 6), m.index);
    if (/잔액|누적|한도|잔고/.test(before)) continue;
    amount = +m[1].replace(/,/g, '');
    break;
  }
  if (amount === '') note = '금액 못 찾음';
  let type = '';
  if (/취소/.test(s)) type = '취소';
  else if (/입금|받았|들어왔/.test(s)) type = '입금';
  else if (/받아주세요|님이\s*[0-9,]+\s*원을?\s*보냈/.test(s)) type = '입금';   // 2026-11-15: 카카오페이 받은 돈('○○ 님이 …원을 보냈어요')
  else if (/출금|승인|결제|이체|사용|보냈|빠져나/.test(s)) type = '출금';
  else note = (note ? note + ', ' : '') + '구분 못 찾음';
  // 상대(가맹점·받는 사람) 추정: 대괄호·괄호 안 이름, 또는 '→' 뒤
  let party = '';
  const arrow = s.match(/(?:→|->|to)\s*([^\s|,]+)/);
  if (arrow) party = arrow[1];
  return { type, amount, party, note };
}

/** 규칙을 고친 뒤 기존 행 전체 다시 계산 (원문 C·D열 기준) */
function reparseAll() {
  const sh = tab_(), last = sh.getLastRow();
  if (last < 2) return;
  const src = sh.getRange(2, 3, last - 1, 2).getValues();
  const outv = src.map(r => { const x = parseNoti(r[0], r[1]); return [x.type, x.amount, x.party]; });
  const notes = src.map(r => [parseNoti(r[0], r[1]).note]);
  sh.getRange(2, 5, outv.length, 3).setValues(outv);
  sh.getRange(2, 9, notes.length, 1).setValues(notes);
}

/* ---------------- 구매내역 (크롬 확장 kind=coupang|naver, 쿠팡 북마크 kind=coupang / payload) ---------------- */

function purchase_(p, src) {
  const raw = p.payload;
  if (!raw) throw new Error('전달된 데이터가 없습니다');
  const d = JSON.parse(raw);
  if (d.v !== 1 || !Array.isArray(d.rows)) throw new Error('데이터 형식이 맞지 않습니다');
  if (d.rows.length > NOTI.MAX_ROWS) throw new Error('행이 너무 많습니다: ' + d.rows.length);
  const cut = (v, n) => String(v == null ? '' : v).trim().slice(0, n);
  const rows = d.rows
    .map(r => [src, rcDate_(r[0]), cut(r[1], 40), cut(r[2], 300), rcNum_(r[3]) ?? '', rcNum_(r[4]) ?? 0, cut(r[5], 40)])
    .filter(r => r[1] && r[3]);
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  let u;
  try {
    const sh = saleSs_().getSheetByName(NOTI.BUY_TAB);
    if (!sh) throw new Error("'" + NOTI.BUY_TAB + "' 탭이 없습니다");
    u = rcUpsert_(sh, rows);
  } finally { lock.releaseLock(); }
  console.log(src + ' ' + rows.length + '행: 신규 ' + u.added + ' / 갱신 ' + u.updated + ' / 변동 없음 ' + u.same);
  markSync_(p.kind, src);
  if (p.format === 'json') return out_({ ok: true, rows: rows.length, added: u.added, updated: u.updated, same: u.same });   // 크롬 확장용
  return page_(true, '쿠팡 ' + (d.from || '') + ' 이후 ' + rows.length + '행 확인', [
    '신규 추가 ' + u.added + '행',
    '상태·금액 갱신 ' + u.updated + '행 (예: 배송중→배송완료, 취소)',
    '변동 없음 ' + u.same + '행',
    '대시보드에 바로 반영',
  ]);
}

/** 쿠팡·네이버 내역을 받은 시각 기록: 스크립트 속성 SYNC_<kind>(확장의 kind=need용) + 설정 탭(대시보드용) */
function markSync_(kind, src) {
  const ts = Date.now();
  PropertiesService.getScriptProperties().setProperty('SYNC_' + kind, String(ts));
  try { saleSyncWrite_(src, Utilities.formatDate(new Date(ts), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss')); saleGuideStatus_(saleSs_()); }
  catch (e) { console.log('동기화 시각 기록 실패: ' + e.message); }
}

/** kind=need: 쇼핑몰별 동기화 필요 여부 {ok, need:{coupang:{need, why, last}, naver:{…}}} — 확장이 필요 없을 때 쇼핑몰을 열지 않게(로그인 요청·접속 차단 줄이기) */
function needSync_() {
  const props = PropertiesService.getScriptProperties(), now = Date.now();
  const sh = saleSs_().getSheetByName(NOTI.TAB);
  let rows = [];
  if (sh && sh.getLastRow() > 1) { const n = Math.min(400, sh.getLastRow() - 1); rows = sh.getRange(sh.getLastRow() - n + 1, 1, n, 6).getValues(); }
  const t = v => (v instanceof Date ? v.getTime() : Date.parse(String(v).replace(' ', 'T') + '+09:00'));
  const out = {};
  Object.keys(NOTI.BUY_SRC).forEach(id => {
    const last = Number(props.getProperty('SYNC_' + id)) || 0;
    let why = '';
    if (!last) why = '기록 없음';
    else if (now - last > NOTI.SYNC_MAX_DAYS * 864e5) why = NOTI.SYNC_MAX_DAYS + '일 지남';
    else if (!sh && Utilities.formatDate(new Date(last), 'Asia/Seoul', 'yyyy-MM-dd') < Utilities.formatDate(new Date(now), 'Asia/Seoul', 'yyyy-MM-dd')) why = '오늘 아직';   // 판매용 기본판(알림 앱 없음): 결제 알림으로 알 수 없으니 하루 한 번
    else if (rows.some(r => { const h = [r[1], r[2], r[3]].join(' '); return t(r[0]) > last && (r[4] === '출금' || r[4] === '취소') && NOTI.SHOP_RE[id].test(h) && !NOTI.EATS_RE.test(h); })) why = '새 결제 알림';
    out[id] = { need: !!why, why, last: last ? Utilities.formatDate(new Date(last), 'Asia/Seoul', 'yyyy-MM-dd HH:mm') : '' };
  });
  return out_({ ok: true, need: out });
}

/**
 * 구매내역관리 A~G 반영 — 시트 쪽 upsertPurchases_와 같은 규칙
 *  주문번호 있음: 구분+주문번호+상품명이 있으면 수량·금액·상태(E~G)만 갱신 / 주문번호 없음: 구분+주문일+주문번호+상품명+금액 같으면 건너뜀
 */
function rcUpsert_(sh, rows) {
  const F = NOTI.BUY_FIRST, n = Math.max(rcLast_(sh, F) - F + 1, 0);
  const cur = n ? sh.getRange(F, 1, n, 7).getDisplayValues() : [];
  const okey = r => [String(r[0]).trim(), String(r[2] || '').trim(), String(r[3]).trim()].join('|');
  const byOrder = new Map(), keys = new Set();
  cur.forEach((r, i) => { if (!r[0]) return; keys.add(rcKey_(r)); if (String(r[2]).trim()) byOrder.set(okey(r), i); });
  const next = n;   // 마지막 데이터 다음 행부터 이어 씀
  const add = [], upd = [];
  let same = 0;
  rows.forEach(r => {
    if (String(r[2] || '').trim()) {
      const k = okey(r);
      if (byOrder.has(k)) {
        const i = byOrder.get(k);
        if (i < 0) { same++; return; }                      // 같은 요청 안에서 중복
        const c = cur[i];
        const changed = rcNum_(c[5]) !== rcNum_(r[5]) || String(c[6]).trim() !== String(r[6] || '').trim()
          || (r[4] !== '' && rcNum_(c[4]) !== rcNum_(r[4]));
        if (changed) { upd.push([i, r]); c[4] = String(r[4]); c[5] = String(r[5]); c[6] = String(r[6] || ''); } else same++;
        return;
      }
      byOrder.set(k, -1);
    } else {
      const k = rcKey_(r);
      if (keys.has(k)) { same++; return; }
      keys.add(k);
    }
    add.push(r);
  });
  if (add.length) rcEnsure_(sh, F, F + next + add.length - 1);
  upd.forEach(([i, r]) => sh.getRange(F + i, 5, 1, 3).setValues([[r[4], r[5], r[6] || '']]));
  if (add.length) sh.getRange(F + next, 1, add.length, 7).setValues(add);
  return { added: add.length, updated: upd.length, same };
}

function rcDate_(v) {
  if (v instanceof Date && !isNaN(v)) return Utilities.formatDate(v, 'Asia/Seoul', 'yyyy-MM-dd');
  const m = String(v || '').match(/(\d{4})\D{1,3}(\d{1,2})\D{1,3}(\d{1,2})/);
  if (!m) return null;
  return m[1] + '-' + m[2].padStart(2, '0') + '-' + m[3].padStart(2, '0');
}

function rcNum_(v) {
  if (typeof v === 'number') return v;
  const s = String(v == null ? '' : v).replace(/[^\d.-]/g, '');
  if (s === '' || s === '-' || isNaN(+s)) return null;
  return +s;
}

function rcKey_(r) {
  return [String(r[0]).trim(), rcDate_(r[1]) || '', String(r[2] || '').trim(), String(r[3]).trim(), rcNum_(r[5])].join('|');
}

function page_(ok, title, lines) {
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const sheetUrl = saleSs_().getUrl();
  const html = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><base target="_top">'
    + '<style>body{font-family:-apple-system,"Malgun Gothic",sans-serif;background:#F4F5F7;margin:0;padding:40px 16px;color:#191F28}'
    + '.c{max-width:520px;margin:0 auto;background:#fff;border-radius:16px;padding:28px;box-shadow:0 1px 3px rgba(0,0,0,.06)}'
    + 'h1{font-size:20px;margin:0 0 14px}li{margin:6px 0}a{display:inline-block;margin:16px 8px 0 0;padding:10px 14px;border-radius:10px;background:#1F3864;color:#fff;text-decoration:none}'
    + 'a.s{background:#E9ECEF;color:#191F28}</style></head><body><div class="c">'
    + '<h1>' + (ok ? '✅ ' : '⚠️ ') + esc(title) + '</h1><ul>' + lines.map(l => '<li>' + esc(l) + '</li>').join('') + '</ul>'
    + '<a href="' + sheetUrl + '">시트 열기</a><a class="s" href="https://mc.coupang.com/ssr/desktop/order/list">쿠팡 주문목록으로</a></div></body></html>';
  return HtmlService.createHtmlOutput(html).setTitle('쿠팡 → 시트').addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/* ---------- 구매내역관리 행 수 (고정 상한 없음) ----------
 * 예전에는 5~1000행 고정이었음. 이제 데이터 마지막 행까지 읽고, 쓸 때 모자라면 행·수식·서식·드롭다운을 늘림.
 * 첫 실행 때 옛 수식($A$5:$A$1000처럼 1000행에 묶인 범위)을 열 끝까지($A$5:$A)로 바꿈.
 * 이 두 함수는 구매내역_가져오기.gs(buy…)에 같은 코드가 rc만 달리 있음 → 한쪽을 고치면 다른 쪽도.
 */
function rcLast_(sh, F) {
  const m = sh.getMaxRows();
  if (m < F) return F - 1;
  const v = sh.getRange(F, 1, m - F + 1, 4).getValues();   // A~D
  for (let i = v.length - 1; i >= 0; i--) if (String(v[i][0]).trim() !== '' || String(v[i][3]).trim() !== '') return F + i;
  return F - 1;
}
function rcEnsure_(sh, F, needLast) {
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
  if (formLast >= F && (hf[0][0] !== buyHFormula_(F) || hf[formLast - F][0] !== buyHFormula_(formLast))) {   // H 수식이 바뀌었으면(2026-11-17 부분환불) 5행~마지막 수식 줄 전부 새 수식
    const nf = []; for (let r = F; r <= formLast; r++) nf.push([buyHFormula_(r)]);
    sh.getRange(F, 8, nf.length, 1).setFormulas(nf);
  }
  if (formLast < F || needLast <= formLast) return;
  const target = needLast + 200;
  if (target > m0) sh.insertRowsAfter(m0, target - m0);
  const cnt = target - formLast, src = sh.getRange(formLast, 1, 1, 12), dst = sh.getRange(formLast + 1, 1, cnt, 12);
  src.copyTo(dst, SpreadsheetApp.CopyPasteType.PASTE_FORMAT, false);
  src.copyTo(dst, SpreadsheetApp.CopyPasteType.PASTE_DATA_VALIDATION, false);
  [8, 9, 12].forEach(c => sh.getRange(formLast, c).copyTo(sh.getRange(formLast + 1, c, cnt, 1), SpreadsheetApp.CopyPasteType.PASTE_FORMULA, false));
}


;// ===== 시작하기.js =====
/**
 * 시작하기.gs (판매용) — 시트 맨 앞 '시작하기' 탭: 설치 순서 안내 + 단계별 상태(자동)
 *  상태는 스크립트 속성으로 판단: SS_ID(설치) · WEBAPP_URL(웹앱 주소) · SYNC_coupang/naver(확장 동기화) + 계획 탭 내용
 *  사본을 만들면 스크립트 속성은 따라오지 않음 → 처음 열 때(onOpen) 상태가 '아직'으로 다시 계산됨
 *  onOpen(단순 트리거)에서도 돌아야 하므로 승인이 필요한 서비스(ScriptApp 등)는 쓰지 않음
 */
const GUIDE = {
  TAB: '시작하기',
  OPTIONAL: ['app', 'plan'],   // 필수 칸(■)·'지금' 표시에서 빠지는 단계
  HEAD: ['단계', '할 일', '어떻게', '상태'],
  FIRST: 4,
  EXT_URL: 'https://drive.google.com/drive/folders/1d5ShOii_e6dYLN9NTQ7V6k-Lbn8LV_4r',   // 확장 zip이 있는 공유 폴더 (zip을 바꿔 올려도 폴더 주소는 그대로). 웹스토어 등록 후 그 주소로 바꿀 것
  STEPS: [
    ['1', '설치', "메뉴 '가계부 → 설치 (처음 한 번)' → 승인 필요 창에서 계속 → 내 구글 계정 선택 → '확인되지 않은 앱' 화면이면 고급 → 이동 → 권한 목록에서 '모두 선택' 체크 → 계속", 'install'],
    ['2', '이용권 키 넣기', "메뉴 '가계부 → 관리 → 이용권 키 넣기' → 구매 때 받은 이용권 키 붙여넣기 → '이용권 확인됨'이 나오면 끝. 이 키가 있어야 고친 내용·새 기능이 자동으로 들어옴", 'license'],
    ['3', '웹앱 배포', "메뉴 '확장 프로그램 → Apps Script' → 오른쪽 위 '배포 → 새 배포' → 유형 선택(톱니)에서 '웹 앱' → 실행: 나 / 액세스 권한: 모든 사용자 → 배포 → 나온 '웹 앱 URL'(…/exec) 복사", 'url'],
    ['4', '주소·연결코드 받기', "이 시트로 돌아와 메뉴 '가계부 → 관리 → 대시보드 주소 · 연결코드' → 3에서 복사한 URL 붙여넣기 → 대시보드 주소는 폰으로 보내 즐겨찾기, 연결코드는 5·6에서 사용", 'url'],
    ['5', '크롬 확장 연결', "PC 크롬에 '가계부 구매 동기화' 확장 설치 — 아래 주소에서 zip 내려받기 → 압축 풀기(푼 폴더는 지우지 말 것) → 주소창에 chrome://extensions → 오른쪽 위 '개발자 모드' 켜기 → '압축해제된 확장 프로그램 로드' → 푼 폴더 선택.\n그다음 퍼즐 아이콘 → 가계부 구매 동기화 → 연결코드 붙여넣기 → 저장 → '지금 동기화' (쿠팡·네이버 로그인 창이 뜨면 로그인)\n확장 받는 곳: " + 'https://drive.google.com/drive/folders/1d5ShOii_e6dYLN9NTQ7V6k-Lbn8LV_4r', 'sync'],
    ['6', '알림 앱 연결 (안드로이드, 선택)', "구매 안내의 '알림 앱 설치' 링크로 '한눈가계부 알림' 설치 → 처음 화면에서 동의 → 처음 설정 순서대로 → 4의 '알림 앱 연결' 글을 폰으로 보내 '설정 링크 붙여넣기' 칸에 붙여넣기 → 쓰는 은행·카드 앱 체크 → '테스트 전송'. 이 탭 상태가 완료로 바뀌면 연결된 것", 'app'],
    ['7', '계획 채우기 (선택)', "'계획' 탭 빈 줄에 수입·고정지출·예산을 적으면 대시보드에 예산·계획 대비가 보임. 비워도 내역·달력·분석은 보임", 'plan'],
    ['', '매일 쓰기', "PC에서 이 시트를 열면 하루 한 번 쿠팡·네이버를 자동으로 가져옴. 현금 지출은 대시보드 내역 탭의 + 로 추가. 분류가 틀리면 대시보드에서 분류 태그를 눌러 바꿈", ''],
    ['', '문제가 생기면', "대시보드가 안 열림 → 3단계 액세스가 '모든 사용자'인지 확인, 메뉴 '가계부 → 관리 → 웹앱 주소 다시 넣기' / 확장이 '연결코드가 맞지 않음' → 4단계에서 다시 복사 / 주소·코드가 남에게 보였으면 메뉴 '가계부 → 관리 → 키·토큰 새로 만들기' / 대시보드 위 버전 옆에 '새 사본 필요'·'업데이트 실패'가 보이면 판매자에게 문의", ''],
  ],
};

function saleGuideTab_(ss) {
  let sh = ss.getSheetByName(GUIDE.TAB);
  if (sh) { saleGuideSync_(sh); return sh; }
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

/** 이미 있는 탭의 안내 글이 지금 STEPS와 다르면 다시 씀 (업데이트로 단계가 바뀐 경우) */
function saleGuideSync_(sh) {
  const n = GUIDE.STEPS.length, last = Math.max(sh.getLastRow(), GUIDE.FIRST + n - 1);
  const cur = sh.getRange(GUIDE.FIRST, 1, last - GUIDE.FIRST + 1, 3).getValues();
  const want = GUIDE.STEPS.map(x => x.slice(0, 3));
  if (cur.length === n && cur.every((r, i) => r.map(String).join('\u0001') === want[i].join('\u0001'))) return false;
  sh.getRange(GUIDE.FIRST, 1, cur.length, 4).clearContent().setBackground(null);
  sh.getRange(GUIDE.FIRST, 1, n, 3).setValues(want);
  sh.getRange(GUIDE.FIRST, 1, n, 4).setWrap(true).setVerticalAlignment('top');
  sh.getRange(GUIDE.FIRST, 2, n, 1).setFontWeight('bold');
  sh.getRange(GUIDE.FIRST, 1, n, 1).setHorizontalAlignment('center');
  return true;
}

/** 단계별 상태 {install, license, url, sync, app, plan} (속성·계획 탭만 봄 → onOpen에서도 동작) */
function saleGuideState_(ss) {
  const p = PropertiesService.getScriptProperties();
  const last = ['coupang', 'naver'].map(k => Number(p.getProperty('SYNC_' + k)) || 0).reduce((a, b) => Math.max(a, b), 0);
  let plan = false;
  try { const sh = ss.getSheetByName(PT.TAB); plan = !!(sh && sh.getLastRow() >= PT.FIRST && sh.getRange(PT.FIRST, 1, sh.getLastRow() - PT.FIRST + 1, 4).getDisplayValues().some(r => r[0] && r[2])); } catch (e) {}
  let app = false;
  try { const nt = ss.getSheetByName(NOTI.TAB); app = !!(nt && nt.getLastRow() > 1); } catch (e) {}
  return {
    license: /^HN1\.\d{5}\./.test(p.getProperty('LICENSE') || ''),
    app,
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
    saleGuideSync_(sh);
    const s = saleGuideState_(ss);
    let next = true;   // 아직 안 된 첫 필수 단계 = 지금
    const st = GUIDE.STEPS.map(x => {
      const k = x[3];
      if (!k) return '';
      const done = k === 'sync' ? !!s.sync : !!s[k];
      if (done) return 'done';
      if (next && GUIDE.OPTIONAL.indexOf(k) < 0) { next = false; return 'now'; }
      return 'todo';
    });
    const out = st.map((v, i) => [v === 'done' ? (GUIDE.STEPS[i][3] === 'sync' ? '완료 ' + s.sync : '완료') : v === 'now' ? '지금' : v === 'todo' ? '아직' : '']);
    const r = sh.getRange(GUIDE.FIRST, 4, out.length, 1);
    r.setValues(out).setFontWeight('bold');
    r.setFontColors(st.map(v => [v === 'done' ? '#2F9E44' : v === 'now' ? '#E8590C' : '#9AA0A6']));
    sh.getRange(GUIDE.FIRST, 1, out.length, 4).setBackgrounds(st.map(v => Array(4).fill(v === 'done' ? '#E6F4EA' : v === 'now' ? '#FEEFE3' : null)));
    // 2행: 필수 단계 칸 (■ 색) + 끝낸 수 / 전체
    const req = st.filter((v, i) => GUIDE.STEPS[i][3] && GUIDE.OPTIONAL.indexOf(GUIDE.STEPS[i][3]) < 0);
    const C = { done: '#34A853', now: '#F9AB00', todo: '#DADCE0' };
    const txt = req.map(() => '■').join(' '), b = SpreadsheetApp.newRichTextValue().setText(txt);
    req.forEach((v, i) => b.setTextStyle(i * 2, i * 2 + 1, SpreadsheetApp.newTextStyle().setForegroundColor(C[v]).setFontSize(18).build()));
    sh.getRange(2, 1).setValue('');   // 예전 안내 문장 자리
    sh.getRange(2, 2).setRichTextValue(b.build()).setVerticalAlignment('middle');
    sh.getRange(2, 3).setValue(req.filter(v => v === 'done').length + ' / ' + req.length).setFontSize(14).setFontWeight('bold').setFontColor('#202124').setVerticalAlignment('middle');
  } catch (e) {}
}


;// ===== 점검.js =====
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
    if (x.type !== '출금' || !(x.amount > 0) || !x.exWhy || /^(중복|테스트|카드대금|앱 상태|승인 취소됨|취소\(승인과 짝\))/.test(x.exWhy)) return;
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
  // ⑨ 구매내역 상태 '부분환불'인데 메모(K)에 '환불 금액'이 없음 → H(반영금액)가 전액으로 셈 (2026-11-17)
  (o.buys || []).forEach(r => {
    if (!/부분환불/.test(r[6]) || /환불\s*[0-9,]*[0-9]/.test(r[10] || '')) return;
    const amt = Number(String(r[5]).replace(/[^0-9.-]/g, '')) || 0;
    add('prf|' + String(r[2]).trim() + '|' + String(r[3]).trim(), '부분환불', String(r[1]).slice(0, 10) + ' ' + short(r[3]) + ' ' + amt.toLocaleString('en-US'));
  });
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
    buys: checkBuys_(ss),
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

/** 구매내역관리 A~K (표시값) — ⑨ 부분환불 점검용 */
function checkBuys_(ss) {
  const sh = ss.getSheetByName(CFG.SHEET);
  if (!sh) return [];
  const F = CFG.FIRST_ROW, n = buyRead_(sh, F).n;
  return n ? sh.getRange(F, 1, n, 11).getDisplayValues() : [];
}


;// ===== 정기결제.js =====
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


;// ===== 판매.js =====
/** @OnlyCurrentDoc */
/**
 * 판매.gs — 판매용 공통 (2026-11-13 시작)
 *  메뉴 '가계부' · 설치 · '계획'·'설정' 탭 · 웹앱 입구(doGet) · 대시보드 키 · 화면→서버 호출 창구(api)
 *
 *  보이는 탭 = 계획(고객이 입력) · 설정(상태·공휴일). 나머지 기록 탭은 숨김.
 *  보안
 *   - 웹앱 액세스 '모든 사용자'(확장·알림 앱이 구글 로그인 없이 보내야 함), 실행 '나'
 *   - 데이터 받기 = 토큰(TOKEN), 대시보드 = 키(DKEY). 둘 다 스크립트 속성에만 저장, 코드·로그에 없음
 *   - 화면에서 부르는 서버 함수는 api(키, 이름, 인자) 하나뿐. 나머지 공개 함수는 메뉴용(getUi 필요 → 웹앱에서 부르면 실패)
 */
const SALE = {
  VER: '0.4.3',
  PLAN: '계획', SET: '설정',
  PLAN_GUIDE: '아래 빈 줄에 그냥 입력하세요. 지울 때는 줄 내용만 지우면 됩니다. 순서는 상관없습니다.',
  PLAN_HEAD: ['구분', '대상', '항목', '월 금액', '날짜', '끝나는 달', '쿠팡·네이버 연결 분류', '메모'],
  PLAN_FIRST: 3, PLAN_ROWS: 200,
  KINDS: ['수입', '지출', '저축'],
  WHO: ['나', '배우자', '아이', '공통'],
  REST: '나머지 전부',
  SET_HEAD: ['항목', '값'],
  SET_ROWS: ['대시보드 주소', '연결코드', '쿠팡', '네이버', '버전'],   // A2~A6
  APP_ROW: 8,    // 알림 앱(안드로이드) 설정 머리글 행, 9~12행 값
  APP_KEYS: ['생활계좌 (예: 국민 123)', '신용카드 끝자리 (예: 1234)', '카드 결제일 (1~31)', '내 이름 (내 계좌 이동 판단)'],   // 예전 설정 탭 (옮길 때만)
  CARD_KEYS: ['신용카드 끝자리', '카드 결제일', '내 이름'],   // 새 설정 탭 '카드' 칸
  HOLI_ROW: 14,  // 공휴일 표 머리글 행 (A14:B14), 15행부터 날짜·이름
  // 공휴일 기본값 (한국천문연구원 월력요항 기준으로 개인용에서 쓰던 목록). 고객이 설정 탭에 직접 추가
  HOLI: [
    ['2026-01-01', '신정'], ['2026-02-16', '설날 연휴'], ['2026-02-17', '설날'], ['2026-02-18', '설날 연휴'], ['2026-03-01', '삼일절'], ['2026-03-02', '대체공휴일'],
    ['2026-05-05', '어린이날'], ['2026-05-24', '부처님오신날'], ['2026-05-25', '대체공휴일'], ['2026-06-03', '지방선거'], ['2026-06-06', '현충일'], ['2026-07-17', '제헌절'],
    ['2026-08-15', '광복절'], ['2026-08-17', '대체공휴일'], ['2026-09-24', '추석 연휴'], ['2026-09-25', '추석'], ['2026-09-26', '추석 연휴'], ['2026-10-03', '개천절'],
    ['2026-10-05', '대체공휴일'], ['2026-10-09', '한글날'], ['2026-12-25', '성탄절'],
    ['2027-01-01', '신정'], ['2027-02-06', '설날 연휴'], ['2027-02-07', '설날'], ['2027-02-08', '설날 연휴'], ['2027-02-09', '대체공휴일'], ['2027-03-01', '삼일절'],
    ['2027-05-01', '공휴일'], ['2027-05-03', '대체공휴일'], ['2027-05-05', '어린이날'], ['2027-05-13', '부처님오신날'], ['2027-06-06', '현충일'], ['2027-07-17', '제헌절'],
    ['2027-07-19', '대체공휴일'], ['2027-08-15', '광복절'], ['2027-08-16', '대체공휴일'], ['2027-09-14', '추석 연휴'], ['2027-09-15', '추석'], ['2027-09-16', '추석 연휴'],
    ['2027-10-03', '개천절'], ['2027-10-04', '대체공휴일'], ['2027-10-09', '한글날'], ['2027-10-11', '대체공휴일'], ['2027-12-25', '성탄절'], ['2027-12-27', '대체공휴일'],
  ],
  DAILY_HOUR: 7,
};

/* ---------- 공통 ---------- */
function saleSs_() {
  let ss = null;
  try { ss = SpreadsheetApp.getActiveSpreadsheet(); } catch (e) {}
  if (ss) return ss;
  const id = PropertiesService.getScriptProperties().getProperty('SS_ID');
  if (!id) throw new Error('설치가 아직 안 됨 (시트 메뉴 가계부 → 설치)');
  return SpreadsheetApp.openById(id);
}
function saleProp_(k, make) {
  const p = PropertiesService.getScriptProperties();
  let v = p.getProperty(k);
  if (!v && make) { v = make(); p.setProperty(k, v); }
  return v || '';
}
const saleKey_ = () => saleProp_('DKEY', () => Utilities.getUuid().replace(/-/g, '').slice(0, 20));
function saleWebUrl_() {
  return saleProp_('WEBAPP_URL');   // 배포 후 고객이 한 번 붙여넣음. ScriptApp.getService().getUrl()은 실제 배포 주소와 다른 값을 돌려줘서(2026-11-13 시험: 404) 쓰지 않음
}
/** 연결코드 = 웹앱 주소 + 토큰을 한 줄로 (크롬 확장·알림 앱에 붙여넣기) */
function saleConnCode_() {
  const u = saleWebUrl_();
  if (!u) return '';
  return 'KB1.' + Utilities.base64EncodeWebSafe(JSON.stringify({ u: u, t: saleToken_(), s: saleSs_().getId() })).replace(/=+$/, '');   // s = 이 시트 (확장이 이 시트를 열 때 동기화)
}
/** 알림 앱(안드로이드, noti-collector-sale SetupLink.kt) 설정 링크 — 폰에서 글째 붙여넣기 */
function saleAppLink_() {
  const u = saleWebUrl_();
  return u ? 'noticollector://setup?u=' + encodeURIComponent(u) + '&t=' + saleToken_() : '';
}
function saleDashUrl_() { const u = saleWebUrl_(); return u ? u + '?k=' + saleKey_() : ''; }

/* ---------- 함께 쓰기 (2026-11-15): 각자 시트를 쓰고 읽기 전용 코드로 서로 연결 → 대시보드에서 나 / 상대 / 합쳐서 ----------
 *  RKEY = 읽기 전용 키(대시보드 키 DKEY와 별개). 내 코드 = 'KBR1.' + base64url({u: 웹앱 주소, r: RKEY, n: 내 이름})
 *  상대 시트는 ?r=RKEY&do=share 로 내 지출 줄·예산만 받음 (고치기 불가). LINKS = [{n, u, r}] (스크립트 속성)
 *  끊기 = 내 쪽 목록에서 지움 / 상대 접근 막기 = '키·토큰 새로 만들기'(RKEY도 바뀜)
 */
const saleRKey_ = () => saleProp_('RKEY', () => Utilities.getUuid().replace(/-/g, '').slice(0, 20));
const saleMyName_ = () => PropertiesService.getScriptProperties().getProperty('MYNAME') || '나';
function saleLinks_() { try { return JSON.parse(PropertiesService.getScriptProperties().getProperty('LINKS') || '[]'); } catch (e) { return []; } }
function saleShareCode_() {
  const u = saleWebUrl_();
  return u ? 'KBR1.' + Utilities.base64EncodeWebSafe(JSON.stringify({ u: u, r: saleRKey_(), n: saleMyName_() })).replace(/=+$/, '') : '';
}
/** 'KBR1.…' → {u, r, n} (순수) */
function saleShareParse_(code) {
  const m = String(code || '').trim().match(/^KBR1\.([A-Za-z0-9_-]+)$/);
  if (!m) return null;
  try {
    const s = m[1] + '==='.slice((m[1].length + 3) % 4);
    const o = JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(s)).getDataAsString());
    return o && /^https:\/\/script\.google\.com\/.*\/exec$/.test(o.u) && /^[a-f0-9]{20}$/.test(o.r) ? { u: o.u, r: o.r, n: String(o.n || '상대').slice(0, 20) } : null;
  } catch (e) { return null; }
}
let SHARE_OUT_ = false;   // 상대에게 내보낼 때는 내 쪽 연결을 다시 부르지 않음 (서로 부르는 무한 반복 방지)
/** ?r=RKEY&do=share → {ok, v, name, today, limit, rows} */
function saleShareOut_() {
  let d = null;
  const c = typeof dashCacheGet_ === 'function' ? dashCacheGet_() : null;
  try { d = JSON.parse(c && c.json || 'null'); } catch (e) {}
  if (!d) { SHARE_OUT_ = true; try { d = JSON.parse(getDashboardJson_()); } finally { SHARE_OUT_ = false; } }
  const out = { ok: true, v: 1, name: saleMyName_(), today: d.today, limit: d.gauge ? +d.gauge.limit || 0 : 0, rows: d.rows || [] };
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}
/** 대시보드용: 연결된 사람들의 지출 [{n, rows, limit} | {n, err}] (병렬로 받음) */
function saleShareFetch_() {
  if (SHARE_OUT_) return [];
  const L = saleLinks_();
  if (!L.length) return [];
  const res = UrlFetchApp.fetchAll(L.map(l => ({ url: l.u + '?do=share&r=' + l.r, muteHttpExceptions: true, followRedirects: true })));
  return L.map((l, i) => {
    try {
      const o = JSON.parse(res[i].getContentText());
      return o && o.ok ? { n: l.n, rows: o.rows || [], limit: +o.limit || 0 } : { n: l.n, err: '코드가 바뀜' };
    } catch (e) { return { n: l.n, err: '연결 안 됨' }; }
  });
}

/* ---------- 메뉴 ---------- */
function onEdit(e) { return planOnEdit_(e); }

/** 덜 빠진 자동이체 채우기 켜기 (계획.js computePlanCompare_ · 공용 계좌.js acLoanNow_, 2026-11-17 사용자 '판매용에도 넣어') */
function planTopUp_() { return true; }   // 계획탭.js(공용) — 진입 함수는 전용 파일에만 (2026-11-17)
function onOpen() {
  // 메뉴 하나 (2026-11-15): 설치 전엔 '설치'가 맨 위, 그다음 대시보드, 나머지는 관리 안
  const ui = SpreadsheetApp.getUi(), p = PropertiesService.getScriptProperties();
  let installed = false;
  try { installed = p.getProperty('SS_ID') === SpreadsheetApp.getActiveSpreadsheet().getId(); } catch (e) {}
  const m = ui.createMenu('가계부');
  if (!installed) m.addItem('설치 (처음 한 번)', 'saleSetup');
  m.addItem('대시보드 열기', 'openDashboard')
    .addSubMenu(ui.createMenu('관리')
      .addItem('대시보드 주소 · 연결코드', 'saleShowCodes')
      .addItem('함께 쓰기', 'saleShareDialog')
      .addItem('지금 정리', 'saleRefresh')
      .addItem('설치 다시', 'saleSetup')
      .addItem('웹앱 주소 다시 넣기', 'saleResetUrl')
      .addItem('키·토큰 새로 만들기', 'saleRekey')
      .addSeparator()
      .addItem('이용권 키 넣기', 'updLicenseMenu')
      .addItem('업데이트 지금 확인', 'updNowMenu')
      .addItem('자동 업데이트 켜기·끄기', 'updToggleMenu'))
    .addToUi();
  try {   // 시작하기 탭: 사본을 처음 열면 만들고(승인 전에도 됨), 상태는 '아직'부터
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!ss.getSheetByName(GUIDE.TAB)) { saleGuideTab_(ss).activate(); ss.moveActiveSheet(1); }
    saleGuideStatus_(ss);
  } catch (e) {}
}

/** 설치: 탭 만들기·숨기기, 토큰·키, 매일 자동 정리. 여러 번 눌러도 있는 것은 그대로 둠 */
function saleSetup() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  PropertiesService.getScriptProperties().setProperty('SS_ID', ss.getId());
  if (ss.getSpreadsheetTimeZone() !== 'Asia/Seoul') ss.setSpreadsheetTimeZone('Asia/Seoul');
  saleGuideTab_(ss);
  saleMigrateV2_(ss);
  salePlanTab_(ss);
  saleSetTab_(ss);
  setupSheet();                                   // 구매내역관리 (숨김)
  saleToken_(); saleKey_();
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'saleDaily').forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('saleDaily').timeBased().everyDays(1).atHour(SALE.DAILY_HOUR).create();
  dashWarmSetup_(); PropertiesService.getScriptProperties().setProperty('DASH_WARM_V2', '1');   // 대시보드 4시간마다 미리 계산
  if (typeof updEnsure_ === 'function') updEnsure_();   // 원격 업데이트 확인 (새벽 무작위 시각, 껍데기 업데이트.gs — 번들 방식일 때만 있음)
  hideRecordTabsOnce_(ss);
  ['시트1', 'Sheet1'].forEach(n => { const s = ss.getSheetByName(n); if (s && ss.getSheets().length > 1 && s.getLastRow() === 0) ss.deleteSheet(s); });
  ss.getSheetByName(GUIDE.TAB).activate(); ss.moveActiveSheet(1);
  saleSetWrite_(ss);
  saleGuideStatus_(ss);
  const url = saleWebUrl_();
  ui.alert('설치 완료', url ? '메뉴 가계부 → 관리 → 대시보드 주소 · 연결코드' : "'시작하기' 탭 2번(이용권 키)부터 이어서 하세요.", ui.ButtonSet.OK);
}

function saleResetUrl() {
  SpreadsheetApp.getUi();   // 메뉴에서만
  PropertiesService.getScriptProperties().deleteProperty('WEBAPP_URL');
  saleShowCodes();
}

/** 키·토큰이 남에게 보였을 때: 새로 만들면 예전 대시보드 주소·연결코드는 바로 막힘 */
function saleRekey() {
  const ui = SpreadsheetApp.getUi();
  if (ui.alert('키·토큰 새로 만들기', '지금 쓰는 대시보드 주소와 연결코드가 막힙니다. 폰 즐겨찾기와 크롬 확장에 새 값을 다시 넣어야 합니다. 계속할까요?', ui.ButtonSet.YES_NO) !== ui.Button.YES) return;
  const p = PropertiesService.getScriptProperties();
  p.deleteProperty('DKEY'); p.deleteProperty('TOKEN'); p.deleteProperty('RKEY');   // 함께 쓰기 코드도 바뀜 → 상대 연결 끊김
  saleKey_(); saleToken_(); saleRKey_();
  try { dashCacheClear_(); } catch (e) {}
  saleShowCodes();
}

/** 대시보드 주소·연결코드 창. 웹앱 주소를 자동으로 못 찾으면 붙여넣기 받음 */
function saleShowCodes() {
  const ui = SpreadsheetApp.getUi();
  let url = saleWebUrl_();
  if (!url) {
    const r = ui.prompt('웹앱 주소', '배포 후 나온 웹 앱 URL(…/exec)을 붙여넣으세요', ui.ButtonSet.OK_CANCEL);
    if (r.getSelectedButton() !== ui.Button.OK) return;
    const v = String(r.getResponseText()).trim();
    if (!/^https:\/\/script\.google\.com\/.*\/exec$/.test(v)) { ui.alert('주소 형식이 맞지 않습니다 (…/exec 로 끝나야 함)'); return; }
    PropertiesService.getScriptProperties().setProperty('WEBAPP_URL', v);
    url = v;
  }
  saleSetWrite_(SpreadsheetApp.getActiveSpreadsheet());
  saleGuideStatus_(SpreadsheetApp.getActiveSpreadsheet());
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const box = (label, v) => '<div style="margin:0 0 14px"><b>' + label + '</b><textarea readonly onclick="this.select()" style="width:100%;height:58px;margin-top:4px;font:12px monospace">' + esc(v) + '</textarea></div>';
  const html = '<div style="font:13px sans-serif">' + box('대시보드 주소 (폰 즐겨찾기)', saleDashUrl_()) + box('연결코드 (크롬 확장에 붙여넣기)', saleConnCode_()) + box('알림 앱 연결 (안드로이드, 쓸 때만 · 폰 앱에 붙여넣기)', saleAppLink_())
    + '<div style="color:#666">두 값은 비밀번호처럼 다루세요. 다른 사람에게 보내지 마세요.</div></div>';
  ui.showModalDialog(HtmlService.createHtmlOutput(html).setWidth(460).setHeight(400), '대시보드 주소 · 연결코드');
}

function saleRefresh() {
  SpreadsheetApp.getUi();   // 메뉴에서만
  saleDaily();
  toast_('정리 완료');
}

/** 매일 자동 (설치 때 트리거): 쿠팡·네이버 분류 → (알림 앱을 쓰면) 알림 정리 → 점검 */
function saleDaily() {
  const ss = saleSs_();
  const tz = ss.getSpreadsheetTimeZone() || 'Asia/Seoul';
  const err = [];
  const step = (name, fn) => { try { fn(); } catch (e) { err.push(name + ': ' + e.message); console.error(name + ' 실패: ' + e.message); } };
  step('새 탭 구조', () => saleMigrateV2_(ss));
  step('설정 탭', () => saleSetWrite_(ss));
  if (typeof saleArchive_ === 'function') step('보관', () => saleArchive_(ss, tz));
  if (typeof refreshAnalysis === 'function') step('분류', () => refreshAnalysis());
  if (ss.getSheetByName(LEDGER.NOTI)) { step('알림 정리', () => refreshLedger()); step('계좌 목록', () => saleAcctHint_(ss, tz)); }
  else if (typeof runChecks_ === 'function') step('점검', () => runChecks_(ss, tz));
  step('탭 숨김', () => hideRecordTabsOnce_(ss));
  step('시작하기', () => saleGuideStatus_(ss));
  if (typeof updEnsure_ === 'function') step('업데이트 예약', () => updEnsure_());   // 이미 설치한 사본에도 트리거가 생기게
  step('캐시', () => dashCacheClear_());
  return err;
}

/* ---------- 웹앱 입구 ---------- */
function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.k) {
    if (p.k !== saleKey_()) return HtmlService.createHtmlOutput('<p style="font:15px sans-serif;padding:24px">주소가 맞지 않습니다. 시트 메뉴 가계부 → 관리 → 대시보드 주소 · 연결코드에서 다시 복사하세요.</p>');
    if (p.do === 'ping') return ContentService.createTextOutput(JSON.stringify({ ok: true, build: HN_BUILD, self: typeof updSelfTest_ === 'function' && updSelfTest_() })).setMimeType(ContentService.MimeType.JSON);   // 업데이트 직후 점검 (업데이트.gs updPing_)
    if (p.do === 'check') return saleCheckOut_();   // 점검용: 매일 정리를 지금 돌리고 결과(오류·건수)를 JSON으로
    return dashOutput_().setTitle(DASH.TITLE).addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }
  if (p.r) {   // 함께 쓰기: 읽기 전용
    if (p.r !== saleRKey_() || p.do !== 'share') return ContentService.createTextOutput('{"ok":false}').setMimeType(ContentService.MimeType.JSON);
    return saleShareOut_();
  }
  if (p.token || p.kind) return receive_(e);
  return HtmlService.createHtmlOutput('<p style="font:15px sans-serif;padding:24px">가계부</p>');
}

/** ?k=키&do=check → 매일 정리 실행 + 대시보드 데이터 계산 결과 요약 (개인 데이터 내용은 안 보냄, 건수만) */
function saleCheckOut_() {
  const t0 = Date.now(), out = { ver: SALE.VER };
  try { out.dailyErrors = saleDaily(); } catch (e) { out.dailyErrors = ['saleDaily: ' + e.message]; }
  try {
    const d = JSON.parse(getDashboardJson_());
    const plan = d.plan || {};
    out.rows = (d.rows || []).length;
    out.bySrc = (d.rows || []).reduce((a, r) => { a[r[0]] = (a[r[0]] || 0) + 1; return a; }, {});
    out.plan = plan.error ? 'error: ' + plan.error : plan.empty ? 'empty' : Object.keys(plan.months || {}).length + 'months';
    out.planWarn = plan.warn || [];
    out.gauge = d.gauge ? { limit: d.gauge.limit, src: d.gauge.src } : null;
    out.notiFrom = d.notiFrom || '';
    out.alert = d.alert || '';
  } catch (e) { out.dashError = e.message; }
  const ss = saleSs_();
  out.tabs = ss.getSheets().map(s => s.getName() + (s.isSheetHidden() ? '(숨김)' : ''));
  out.triggers = ScriptApp.getProjectTriggers().map(t => t.getHandlerFunction());
  out.ms = Date.now() - t0;
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}

/** 화면 → 서버 호출 창구. 키가 맞을 때만, 정해진 함수만 */
const SALE_API = {
  getDashboardJson: () => getDashboardJson_(), getDashFont: () => getDashFont_(), logPerf: (a, b) => logPerf_(a, b),
  addManual: o => addManual_(o), editManual: (r, n, o, d) => editManual_(r, n, o, d), setCategory: (l, c) => setCategory_(l, c), setBudget: n => setBudget_(n),
  excludeNoti: l => excludeNoti_(l),
  setNotiAmount: (i, a) => setNotiAmount_(i, a), setPlanRow: (r, n, o) => setPlanRow_(r, n, o), setAcctRow: (k, r, key, o) => setAcctRow_(k, r, key, o),
  setIncomeType: (s, t, d) => setIncomeType_(s, t, d), addIncomeType: (n, m) => addIncomeType_(n, m), delIncomeType: n => delIncomeType_(n),
};
function api(k, name, args) {
  if (!k || k !== saleKey_()) throw new Error('키가 맞지 않음');
  const f = SALE_API[name];
  if (!f) throw new Error('없는 기능: ' + name);
  return f.apply(null, Array.isArray(args) ? args : []);
}

/* ---------- 계획 탭 (2026-11-15: 개인용과 같은 계획탭.gs 구조로 바꿈 — 판매용_개발가이드 5-2장) ---------- */
/** 예전 배치(1행 안내·2행 머리 8칸: 구분 수입/지출/저축)를 새 배치(10칸: 수입·추가수입·고정·변동·저축 + 찾을·뺄 단어)로 옮김 */
function salePlanTab_(ss) {
  const sh = ss.getSheetByName(PT.TAB);
  if (sh && String(sh.getRange(2, 1).getDisplayValue()).trim() === '구분' && String(sh.getRange(2, 8).getDisplayValue()).trim() === '메모') {
    const n = sh.getLastRow() - 2;
    const v = n > 0 ? sh.getRange(3, 1, n, 8).getDisplayValues() : [];
    sh.setName(PT.TAB + '(예전)'); sh.hideSheet();
    const nsh = ptTab_(ss);
    const rows = v.filter(r => r.some(x => String(x).trim())).map(r => {
      const k = String(r[0]).trim(), cats = String(r[6]).trim();
      const kind = k === '수입' ? '수입' : k === '저축' ? '저축' : k === '지출' ? (cats ? '변동' : '고정') : k;
      return [kind, r[1], r[2], r[3], r[4], r[5], cats, '', '', r[7], ''];
    });
    if (rows.length) nsh.getRange(PT.FIRST, 1, rows.length, PT.COLS).setValues(rows);
    return nsh;
  }
  return ptTab_(ss);
}
/** 계획 탭 → {income, fixed, spend, warn} (계획탭.gs ptParse_) 또는 null */
function salePlan_(ss) {
  return memo_('salePlan', () => { const S = planSource_(ss); return S ? S.plan : null; });
}

/* ---------- 설정 탭 (2026-11-15: 설정.gs 구조 — 연결 상태 · 카드 · 제외 · 분류. 생활계좌 = 계좌 탭, 공휴일 = 숨긴 '공휴일' 탭) ---------- */
const SALE_HOLI_TAB = '공휴일';
/** 설정.gs stTab_가 부름: '연결 상태' 줄 (예전 설정 탭이 있으면 그 값) */
function saleStConn_(prev) {
  const old = {};
  if (prev) prev.getRange(1, 1, Math.min(prev.getLastRow(), 20), 2).getDisplayValues().forEach(r => { old[String(r[0]).trim()] = String(r[1]).trim(); });
  return SALE.SET_ROWS.map(k => [k, old[k] || '']);
}
/** 설정.gs stTab_가 부름: '카드' 칸 (예전 '알림 앱' 칸 값을 옮김. 생활계좌는 계좌 탭으로) */
function saleStCard_(prev) {
  const old = {};
  if (prev) prev.getRange(1, 1, Math.min(prev.getLastRow(), 20), 2).getDisplayValues().forEach(r => { old[String(r[0]).trim()] = String(r[1]).trim(); });
  return SALE.CARD_KEYS.map((k, i) => [k, old[SALE.APP_KEYS[i + 1]] || '']);
}
function saleSetTab_(ss) {
  const prevHoli = saleHoliOld_(ss);
  const sh = stTab_(ss);
  saleHoliTab_(ss, prevHoli);
  return sh;
}
/** 예전 설정 탭(14행부터 공휴일)의 날짜 — 고객이 추가한 날 보존용 */
function saleHoliOld_(ss) {
  const sh = ss.getSheetByName(SALE.SET);
  if (!sh || String(sh.getRange(1, 1).getDisplayValue()).trim() !== '항목' || sh.getLastRow() <= SALE.HOLI_ROW) return null;
  return sh.getRange(SALE.HOLI_ROW + 1, 1, sh.getLastRow() - SALE.HOLI_ROW, 2).getDisplayValues().filter(r => /^\d{4}-\d{2}-\d{2}$/.test(String(r[0]).trim()));
}
function saleHoliTab_(ss, rows) {
  let sh = ss.getSheetByName(SALE_HOLI_TAB);
  if (sh) return sh;
  sh = ss.insertSheet(SALE_HOLI_TAB);
  const v = rows && rows.length ? rows : SALE.HOLI;
  sh.getRange(1, 1, 1, 2).setValues([['날짜', '이름']]).setFontWeight('bold').setBackground('#F3F3F3');
  sh.getRange(2, 1, v.length, 1).setNumberFormat('@');
  sh.getRange(2, 1, v.length, 2).setValues(v);
  sh.hideSheet();
  return sh;
}
/** 알림 앱 설정 {acct(생활계좌 끝자리), card, payDay, myName} — 비면 '' (그 기능 숨김) */
function saleSettings_() {
  return memo_('saleSet', () => {
    const o = { acct: '', card: '', payDay: 0, myName: '' };
    try {
      const ss = saleSs_();
      const ac = typeof AC !== 'undefined' ? ss.getSheetByName(AC.TAB) : null;
      if (ac) { const r = ac.getRange(AC.BANK.first, 1, AC.BANK.n, 3).getDisplayValues().find(x => String(x[2]).trim() === '생활' && String(x[0]).trim()); if (r) o.acct = String(r[0]).trim(); }
      o.card = (stGet_(ss, SALE.CARD_KEYS[0]).match(/\d{4}/) || [''])[0];
      const d = +stGet_(ss, SALE.CARD_KEYS[1]); o.payDay = d >= 1 && d <= 31 ? Math.floor(d) : 0;
      o.myName = stGet_(ss, SALE.CARD_KEYS[2]);
    } catch (e) {}
    return o;
  });
}
function saleAcctHint_() {}   // 계좌 탭이 잔액을 바로 보여줘서 필요 없음 (2026-11-15)
function saleApplySettings_() {
  const s = saleSettings_();
  DASH.LIVING_ACCT = s.acct; DASH.CARD = s.card;
  if (s.payDay && typeof INC !== 'undefined') INC.PAY_DAY = s.payDay;
}
/** 연결 상태 칸 쓰기 — 주소·연결코드는 설치·주소 보기 때 */
function saleSetWrite_(ss) {
  saleSetTab_(ss);
  const u = saleWebUrl_();   // 키·토큰이 든 주소는 칸에 적지 않음 (시트를 공유해도 새지 않게) → 메뉴 창에서만 보여줌
  stSet_(ss, SALE.SET_ROWS[0], u ? '연결됨' : '');
  stSet_(ss, SALE.SET_ROWS[1], '');
  stSet_(ss, SALE.SET_ROWS[4], SALE.VER + ' (' + HN_BUILD + ')');
}
/** 쇼핑몰 마지막 동기화 (수집.gs markSync_) */
function saleSyncWrite_(src, when) { try { stSet_(saleSs_(), src, when); } catch (e) {} }
function saleSyncRead_(ss) {
  const o = {};
  ['쿠팡', '네이버'].forEach(k => { const v = stGet_(ss, k); if (/^\d{4}-\d{2}-\d{2}/.test(v)) o[k] = v; });
  return o;
}
/** 공휴일 {연도: ['MM-DD', …]} — 숨긴 '공휴일' 탭 (없으면 기본값) */
function saleHoli_(ss) {
  return memo_('saleHoli', () => {
    const out = {};
    const add = d => { const m = String(d).trim().match(/^(\d{4})-(\d{2})-(\d{2})$/); if (m) (out[m[1]] = out[m[1]] || []).push(m[2] + '-' + m[3]); };
    const sh = ss && ss.getSheetByName(SALE_HOLI_TAB);
    if (sh && sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, 1).getDisplayValues().forEach(r => add(r[0]));
    else SALE.HOLI.forEach(r => add(r[0]));
    return out;
  });
}
/** 한 번만 (2026-11-15): 새 탭 구조로 — 계획(10칸)·설정(연결 상태·카드·제외·분류)·공휴일(숨김)·계좌·탭 색 */
function saleMigrateV2_(ss) {
  const p = PropertiesService.getScriptProperties();
  if (p.getProperty('SALE_V2')) return;
  salePlanTab_(ss);
  saleSetTab_(ss);
  if (typeof acTab_ === 'function') {
    const t = acTab_(ss);   // 예전 설정 탭 '생활계좌'(예: 국민 123) → 계좌 탭 통장 첫 줄
    const prev = ss.getSheetByName(SALE.SET + '(예전)');
    const r = prev ? prev.getRange(1, 1, Math.min(prev.getLastRow(), 20), 2).getDisplayValues().find(x => String(x[0]).trim() === SALE.APP_KEYS[0]) : null;
    const m = r ? String(r[1]).match(/^\s*(\S*?)\s*(\d{3,})\s*$/) : null;
    if (t.fresh && m) t.sh.getRange(AC.BANK.first, 1, 1, 3).setValues([[m[2], m[1], '생활']]);
  }
  if (typeof tabTidyV1_ === 'function') tabTidyV1_(ss);
  const g = ss.getSheetByName(GUIDE.TAB); if (g) { ss.setActiveSheet(g); ss.moveActiveSheet(1); }   // 시작하기는 맨 앞
  p.setProperty('SALE_V2', '1');
  if (typeof MEMO_ !== 'undefined' && MEMO_) MEMO_ = {};
}

/* ---------- 함께 쓰기 창 (시트 메뉴). 아래 공개 함수들은 getUi()로 시트 안에서만 돌게 함 (웹앱에서 부르면 실패) ---------- */
function saleShareDialog() {
  const ui = SpreadsheetApp.getUi();
  if (!saleWebUrl_()) { ui.alert('먼저 메뉴 가계부 → 관리 → 대시보드 주소 · 연결코드에서 웹앱 주소를 넣으세요'); return; }
  const h = HtmlService.createHtmlOutput(SHARE_HTML_).setWidth(460).setHeight(400);
  ui.showModalDialog(h, '함께 쓰기');
}
function saleShareData() {
  SpreadsheetApp.getUi();
  return { name: saleMyName_(), code: saleShareCode_(), links: saleLinks_().map(l => l.n) };
}
function saleShareName(n) {
  SpreadsheetApp.getUi();
  n = String(n || '').trim().slice(0, 20);
  if (!n) throw new Error('이름');
  PropertiesService.getScriptProperties().setProperty('MYNAME', n);
  return saleShareData();
}
function saleShareLink(code) {
  SpreadsheetApp.getUi();
  const o = saleShareParse_(code);
  if (!o) throw new Error('코드 형식');
  if (o.r === saleRKey_()) throw new Error('내 코드');
  const res = UrlFetchApp.fetch(o.u + '?do=share&r=' + o.r, { muteHttpExceptions: true, followRedirects: true });
  let ok = false; try { ok = JSON.parse(res.getContentText()).ok; } catch (e) {}
  if (!ok) throw new Error('연결 안 됨');
  const L = saleLinks_().filter(l => l.u !== o.u);
  L.push(o);
  PropertiesService.getScriptProperties().setProperty('LINKS', JSON.stringify(L));
  try { dashCacheClear_(); } catch (e) {}
  return saleShareData();
}
function saleShareUnlink(i) {
  SpreadsheetApp.getUi();
  const L = saleLinks_(); L.splice(Number(i), 1);
  PropertiesService.getScriptProperties().setProperty('LINKS', JSON.stringify(L));
  try { dashCacheClear_(); } catch (e) {}
  return saleShareData();
}
const SHARE_HTML_ = `<style>
body{font-family:Arial,'Noto Sans KR',sans-serif;margin:0;color:#191F28}.l{font-size:13px;color:#6B7684;margin:12px 0 6px}
.r{display:flex;gap:8px}input{flex:1;border:1px solid #E5E8EB;border-radius:8px;padding:9px 11px;font:13px inherit;min-width:0}
input.c{font-family:monospace}button{border:1px solid #E5E8EB;border-radius:8px;padding:9px 13px;font-weight:700;background:#fff;cursor:pointer}
button.k{background:#191F28;color:#fff;border-color:#191F28}.m{display:flex;justify-content:space-between;align-items:center;border-top:1px solid #E5E8EB;padding:10px 0 0;margin-top:10px;font-size:14px}
.m i{font-style:normal;color:#2F9E44;font-size:12px;margin-left:6px}#e{color:#E8590C;font-size:12px;min-height:16px;margin-top:8px}
</style>
<div class="l">내 이름</div><div class="r"><input id="nm"><button id="sv">저장</button></div>
<div class="l">내 코드</div><div class="r"><input id="cd" class="c" readonly><button id="cp">복사</button></div>
<div class="l">상대 코드</div><div class="r"><input id="pc" class="c" placeholder="붙여넣기"><button id="ln" class="k">연결</button></div>
<div id="e"></div><div id="ls"></div>
<script>
var R=google.script.run;function $(i){return document.getElementById(i)}
function err(x){$('e').textContent=x&&x.message?x.message:''}
function show(d){err();$('nm').value=d.name;$('cd').value=d.code;$('ls').innerHTML=d.links.map(function(n,i){return '<div class="m"><span>'+n.replace(/</g,'&lt;')+'<i>연결됨</i></span><button data-i="'+i+'">끊기</button></div>'}).join('')}
R.withSuccessHandler(show).withFailureHandler(err).saleShareData();
$('sv').onclick=function(){R.withSuccessHandler(show).withFailureHandler(err).saleShareName($('nm').value)};
$('cp').onclick=function(){$('cd').select();document.execCommand('copy');$('cp').textContent='복사됨'};
$('ln').onclick=function(){$('ln').disabled=true;R.withSuccessHandler(function(d){$('ln').disabled=false;$('pc').value='';show(d)}).withFailureHandler(function(x){$('ln').disabled=false;err(x)}).saleShareLink($('pc').value)};
$('ls').onclick=function(e){var b=e.target.closest('button');if(b)R.withSuccessHandler(show).withFailureHandler(err).saleShareUnlink(+b.dataset.i)};
</script>`;

/* ---------- 예시 데이터 (2026-11-16, 판매용 업그레이드 기획 S1) ----------
 *  내 기록(구매·알림·직접 입력)이 0줄일 때만 대시보드에 보여 줌. 시트에는 쓰지 않음.
 *  행 번호는 'x…' 글자 → 분류 바꾸기·빼기가 걸리지 않음. 실제 기록이 1줄이라도 생기면 다음 불러오기부터 사라짐.
 *  계획 탭·계좌 탭에 사람이 적은 게 있으면 그건 그대로 쓰고, 비어 있는 것만 예시로 채움 */
const SAMPLE_ = {
  CP: [['생수 2L 12병', '식품', 6900], ['냉동 만두 1kg 2봉', '식품', 15900], ['계란 30구', '식품', 8900], ['닭가슴살 1kg', '식품', 12900], ['우유 900ml 2개', '식품', 5600],
    ['기저귀 4단계 66매', '육아', 32900], ['물티슈 캡형 100매 10팩', '육아', 15800], ['주방세제 1L 3개', '생활·주방', 9900], ['키친타월 6롤', '생활·주방', 7900],
    ['샴푸 1L 2개', '뷰티·위생', 18900], ['USB-C 충전 케이블 2m', '가전·디지털', 8900]],
  NV: [['배추김치 2kg', '식품', 19800], ['면 티셔츠 2장', '의류', 24000], ['원목 수납 선반 3단', '인테리어·가구', 39000], ['유아 빨대컵', '육아', 12000]],
  PLAN: [['수입', '나', '급여', 3200000, 25, '', ''], ['수입', '아이', '아동수당', 100000, 25, '', ''],
    ['고정', '공통', '월세', 550000, 25, '', ''], ['고정', '나', '휴대폰', 55000, 10, '', ''], ['고정', '공통', '자동차 할부', 320000, 15, '2029-02', ''], ['고정', '공통', '넷플릭스', 17000, 15, '', ''],
    ['변동', '공통', '장보기', 500000, '', '', '식품, 생활·주방'], ['변동', '나', '점심·커피', 150000, '', '', '외식·카페'], ['변동', '아이', '육아용품', 200000, '', '', '육아'], ['변동', '공통', '그 외', 200000, '', '', SALE.REST],
    ['저축', '나', '적금', 300000, 5, '2027-06', '']],
  ACCT: { accts: [{ tail: '123', bank: '국민', role: '생활', bal: 812000, at: '' }, { tail: '456', bank: '카카오', role: '비상금', bal: 2400000, at: '' }], others: [], loans: [{ name: '자동차 할부', cur: 9200000, base: 9200000, since: '', item: '자동차 할부', end: '2029-02' }] },
};
/** 오늘이 속한 달과 앞 3달, 오늘까지 → [{src,date,order,name,amount,cat,row}] (같은 날짜면 늘 같은 결과) */
function saleSampleRows_(today) {
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const pick = a => a[Math.floor(rnd() * a.length)];
  const out = []; let ord = 0;
  const y = +today.slice(0, 4), m0 = +today.slice(5, 7) - 1;
  for (let k = 3; k >= 0; k--) {
    const d0 = new Date(y, m0 - k, 1), ym = d0.getFullYear() + '-' + String(d0.getMonth() + 1).padStart(2, '0');
    const last = k === 0 ? +today.slice(8, 10) : new Date(d0.getFullYear(), d0.getMonth() + 1, 0).getDate();
    for (let d = 1; d <= last; d++) {
      const ds = ym + '-' + String(d).padStart(2, '0');
      if (rnd() < 0.4) { const o = 'X' + (++ord); for (let i = 0, n = 1 + Math.floor(rnd() * 3); i < n; i++) { const it = pick(SAMPLE_.CP); out.push({ src: '쿠팡', date: ds, order: o, name: it[0], amount: it[2], cat: it[1], row: 'x' + out.length }); } }
      if (rnd() < 0.12) { const it = pick(SAMPLE_.NV); out.push({ src: '네이버', date: ds, order: 'X' + (++ord), name: it[0], amount: it[2], cat: it[1], row: 'x' + out.length }); }
    }
  }
  return out;
}
/** getDashboardJson_ 끝에서 부름: data를 예시로 채움 (data.sample = 1) */
function saleSample_(ss, tz, data) {
  const today = data.today, rows = saleSampleRows_(today);
  data.rows = rows.map(r => [r.src, r.date, r.order, r.name, r.amount, r.cat, '배송완료', r.row]);
  let realPlan = null; try { realPlan = salePlan_(ss); } catch (e) {}
  if (realPlan) data.plan = planCompare_(ss, tz, rows);
  else {
    const plan = ptParse_(SAMPLE_.PLAN.map(r => [r[0], r[1], r[2], String(r[3]), String(r[4]), r[5], r[6], '', '', '', '']));
    const alias = {}; PLAN.DEFAULT_ALIAS.forEach(r => { alias[r[0]] = r[1]; });   // planAlias_와 같은 방식, 계획만 예시
    plan.income.concat(plan.fixed, plan.spend).forEach(it => { if ((it.find || []).length || (it.cats || []).length) alias[it.name] = { find: it.find || [], not: it.not || [], cats: it.cats || [] }; });
    const stub = { getSheetByName: () => null }, months = [];
    for (let i = 11; i >= 0; i--) { const d = new Date(+today.slice(0, 4), +today.slice(5, 7) - 1 - i, 1); months.push(d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0')); }
    const buys = rows.map(r => ({ date: r.date, name: r.name, amount: r.amount, cat: r.cat, src: r.src }));
    // 수입·고정·저축은 날짜가 지난 것을 낸 것으로 (예시 알림, excluded라 쓰는 돈에는 안 들어감)
    const notis = [], from = months[8] + '-01';
    months.slice(8).forEach(ym => {
      const last = new Date(+ym.slice(0, 4), +ym.slice(5, 7), 0).getDate();
      [['입금', plan.income], ['출금', plan.fixed]].forEach(([type, items]) => items.filter(it => it.day && it.plan > 0 && (!it.end || ym <= it.end)).forEach(it => {
        const ds = ym + '-' + String(Math.min(it.day, last)).padStart(2, '0');
        if (ds < today) notis.push({ type, amount: it.plan, when: ds + ' 09:00:00', text: it.name, body: it.name, mon: ym, excluded: true, matched: false });
      }));
    });
    const rec = typeof recForDash_ === 'function' ? recForDash_(stub, plan, alias, buys, notis, today, from) : null;   // stub → 계획 탭 날짜 채우기도 안 함
    data.plan = { months: computePlanCompare_(plan, alias, buys, notis, months, from, today), notiFrom: from, rec: rec ? rec.map : null, recMonth: today.slice(0, 7), recRows: rec ? rec.rows : null, warn: [] };
    const pb = ptBudget_(plan, today.slice(0, 7));
    data.gauge = Object.assign(data.gauge || {}, pb ? { limit: pb.limit, src: '계획', plan: pb } : { limit: 0, src: 'none' });
  }
  const a = data.assets;
  if (!a || a.error || !((a.accts || []).length || (a.others || []).length || (a.loans || []).length)) {
    const s = JSON.parse(JSON.stringify(SAMPLE_.ACCT)), at = (+today.slice(5, 7)) + '/' + (+today.slice(8, 10));
    s.accts.forEach(x => { x.at = at; });
    s.assets = s.accts.reduce((t, x) => t + x.bal, 0); s.debt = s.loans.reduce((t, x) => t + x.cur, 0); s.net = s.assets - s.debt;
    data.assets = s;
  }
  data.sample = 1; data.alert = ''; data.links = []; data.check = [];
}


;return { build: HN_BUILD, ver: SALE.VER,
  slots: typeof HN_SLOTS !== "undefined" ? HN_SLOTS : {},
  selfTest: function () { return typeof SALE === "object" && typeof getDashboardJson_ === "function" && (typeof updSelfTest_ !== "function" || updSelfTest_() === true); },
  fn: {
    "acCell_": typeof acCell_ === 'function' ? acCell_ : undefined,
    "acDash_": typeof acDash_ === 'function' ? acDash_ : undefined,
    "acFromPersonal_": typeof acFromPersonal_ === 'function' ? acFromPersonal_ : undefined,
    "acGuessItem_": typeof acGuessItem_ === 'function' ? acGuessItem_ : undefined,
    "acLoanNow_": typeof acLoanNow_ === 'function' ? acLoanNow_ : undefined,
    "acSetRow_": typeof acSetRow_ === 'function' ? acSetRow_ : undefined,
    "acSync_": typeof acSync_ === 'function' ? acSync_ : undefined,
    "acTab_": typeof acTab_ === 'function' ? acTab_ : undefined,
    "acTidyV1_": typeof acTidyV1_ === 'function' ? acTidyV1_ : undefined,
    "acctTailEq_": typeof acctTailEq_ === 'function' ? acctTailEq_ : undefined,
    "addIncomeType_": typeof addIncomeType_ === 'function' ? addIncomeType_ : undefined,
    "addManual_": typeof addManual_ === 'function' ? addManual_ : undefined,
    "api": typeof api === 'function' ? api : undefined,
    "archiveCutoff_": typeof archiveCutoff_ === 'function' ? archiveCutoff_ : undefined,
    "archiveMove_": typeof archiveMove_ === 'function' ? archiveMove_ : undefined,
    "archiveRuns_": typeof archiveRuns_ === 'function' ? archiveRuns_ : undefined,
    "buildNotiRows_": typeof buildNotiRows_ === 'function' ? buildNotiRows_ : undefined,
    "buyEnsure_": typeof buyEnsure_ === 'function' ? buyEnsure_ : undefined,
    "buyHFormula_": typeof buyHFormula_ === 'function' ? buyHFormula_ : undefined,
    "buyLast_": typeof buyLast_ === 'function' ? buyLast_ : undefined,
    "buyRead_": typeof buyRead_ === 'function' ? buyRead_ : undefined,
    "checkBuys_": typeof checkBuys_ === 'function' ? checkBuys_ : undefined,
    "classify": typeof classify === 'function' ? classify : undefined,
    "computeAnalysis": typeof computeAnalysis === 'function' ? computeAnalysis : undefined,
    "computeBalances_": typeof computeBalances_ === 'function' ? computeBalances_ : undefined,
    "computeIssues_": typeof computeIssues_ === 'function' ? computeIssues_ : undefined,
    "computeLedger": typeof computeLedger === 'function' ? computeLedger : undefined,
    "computePlanCompare_": typeof computePlanCompare_ === 'function' ? computePlanCompare_ : undefined,
    "computeRec_": typeof computeRec_ === 'function' ? computeRec_ : undefined,
    "dashCacheClear_": typeof dashCacheClear_ === 'function' ? dashCacheClear_ : undefined,
    "dashCacheGet_": typeof dashCacheGet_ === 'function' ? dashCacheGet_ : undefined,
    "dashCachePut_": typeof dashCachePut_ === 'function' ? dashCachePut_ : undefined,
    "dashCardBills_": typeof dashCardBills_ === 'function' ? dashCardBills_ : undefined,
    "dashCard_": typeof dashCard_ === 'function' ? dashCard_ : undefined,
    "dashCheck_": typeof dashCheck_ === 'function' ? dashCheck_ : undefined,
    "dashFixedOut_": typeof dashFixedOut_ === 'function' ? dashFixedOut_ : undefined,
    "dashFont_": typeof dashFont_ === 'function' ? dashFont_ : undefined,
    "dashIncome_": typeof dashIncome_ === 'function' ? dashIncome_ : undefined,
    "dashIsFixed_": typeof dashIsFixed_ === 'function' ? dashIsFixed_ : undefined,
    "dashJsonDay_": typeof dashJsonDay_ === 'function' ? dashJsonDay_ : undefined,
    "dashKbBal_": typeof dashKbBal_ === 'function' ? dashKbBal_ : undefined,
    "dashLib_": typeof dashLib_ === 'function' ? dashLib_ : undefined,
    "dashNotiRows_": typeof dashNotiRows_ === 'function' ? dashNotiRows_ : undefined,
    "dashOutput_": typeof dashOutput_ === 'function' ? dashOutput_ : undefined,
    "dashSs_": typeof dashSs_ === 'function' ? dashSs_ : undefined,
    "dashSyncAtRaw_": typeof dashSyncAtRaw_ === 'function' ? dashSyncAtRaw_ : undefined,
    "dashSyncAt_": typeof dashSyncAt_ === 'function' ? dashSyncAt_ : undefined,
    "dashWarm": typeof dashWarm === 'function' ? dashWarm : undefined,
    "dashWarmSetup_": typeof dashWarmSetup_ === 'function' ? dashWarmSetup_ : undefined,
    "dayRow_": typeof dayRow_ === 'function' ? dayRow_ : undefined,
    "delIncomeType_": typeof delIncomeType_ === 'function' ? delIncomeType_ : undefined,
    "doGet": typeof doGet === 'function' ? doGet : undefined,
    "doPost": typeof doPost === 'function' ? doPost : undefined,
    "editManual_": typeof editManual_ === 'function' ? editManual_ : undefined,
    "err": typeof err === 'function' ? err : undefined,
    "excludeNoti_": typeof excludeNoti_ === 'function' ? excludeNoti_ : undefined,
    "findCol_": typeof findCol_ === 'function' ? findCol_ : undefined,
    "getDashFont_": typeof getDashFont_ === 'function' ? getDashFont_ : undefined,
    "getDashboardJson_": typeof getDashboardJson_ === 'function' ? getDashboardJson_ : undefined,
    "heartbeatAlert_": typeof heartbeatAlert_ === 'function' ? heartbeatAlert_ : undefined,
    "hideRecordTabsOnce_": typeof hideRecordTabsOnce_ === 'function' ? hideRecordTabsOnce_ : undefined,
    "hideTab_": typeof hideTab_ === 'function' ? hideTab_ : undefined,
    "incCardCalc_": typeof incCardCalc_ === 'function' ? incCardCalc_ : undefined,
    "incDay_": typeof incDay_ === 'function' ? incDay_ : undefined,
    "incPayMonth_": typeof incPayMonth_ === 'function' ? incPayMonth_ : undefined,
    "incPlanRe_": typeof incPlanRe_ === 'function' ? incPlanRe_ : undefined,
    "incRowsCalc_": typeof incRowsCalc_ === 'function' ? incRowsCalc_ : undefined,
    "incSave_": typeof incSave_ === 'function' ? incSave_ : undefined,
    "incSender_": typeof incSender_ === 'function' ? incSender_ : undefined,
    "incSettings_": typeof incSettings_ === 'function' ? incSettings_ : undefined,
    "incTab_": typeof incTab_ === 'function' ? incTab_ : undefined,
    "incTypeOf_": typeof incTypeOf_ === 'function' ? incTypeOf_ : undefined,
    "incWindow_": typeof incWindow_ === 'function' ? incWindow_ : undefined,
    "incYm_": typeof incYm_ === 'function' ? incYm_ : undefined,
    "ledgerAlert_": typeof ledgerAlert_ === 'function' ? ledgerAlert_ : undefined,
    "ledgerCloseTab_": typeof ledgerCloseTab_ === 'function' ? ledgerCloseTab_ : undefined,
    "ledgerGauge_": typeof ledgerGauge_ === 'function' ? ledgerGauge_ : undefined,
    "ledgerLive_": typeof ledgerLive_ === 'function' ? ledgerLive_ : undefined,
    "ledgerProps_": typeof ledgerProps_ === 'function' ? ledgerProps_ : undefined,
    "ledgerSettingsTab_": typeof ledgerSettingsTab_ === 'function' ? ledgerSettingsTab_ : undefined,
    "logPerf_": typeof logPerf_ === 'function' ? logPerf_ : undefined,
    "manualCheck_": typeof manualCheck_ === 'function' ? manualCheck_ : undefined,
    "manualRows_": typeof manualRows_ === 'function' ? manualRows_ : undefined,
    "manualTab_": typeof manualTab_ === 'function' ? manualTab_ : undefined,
    "mapTable": typeof mapTable === 'function' ? mapTable : undefined,
    "markSync_": typeof markSync_ === 'function' ? markSync_ : undefined,
    "memo_": typeof memo_ === 'function' ? memo_ : undefined,
    "merchantCat_": typeof merchantCat_ === 'function' ? merchantCat_ : undefined,
    "merchantMemoFind_": typeof merchantMemoFind_ === 'function' ? merchantMemoFind_ : undefined,
    "merchantMemoMap_": typeof merchantMemoMap_ === 'function' ? merchantMemoMap_ : undefined,
    "merchantMemoSave_": typeof merchantMemoSave_ === 'function' ? merchantMemoSave_ : undefined,
    "merchantMemoSeed_": typeof merchantMemoSeed_ === 'function' ? merchantMemoSeed_ : undefined,
    "mkey_": typeof mkey_ === 'function' ? mkey_ : undefined,
    "needSync_": typeof needSync_ === 'function' ? needSync_ : undefined,
    "notiCat_": typeof notiCat_ === 'function' ? notiCat_ : undefined,
    "notiIsFixed_": typeof notiIsFixed_ === 'function' ? notiIsFixed_ : undefined,
    "notiLabel_": typeof notiLabel_ === 'function' ? notiLabel_ : undefined,
    "notiName_": typeof notiName_ === 'function' ? notiName_ : undefined,
    "notiNotFixed_": typeof notiNotFixed_ === 'function' ? notiNotFixed_ : undefined,
    "onEdit": typeof onEdit === 'function' ? onEdit : undefined,
    "onOpen": typeof onOpen === 'function' ? onOpen : undefined,
    "openDashboard": typeof openDashboard === 'function' ? openDashboard : undefined,
    "out_": typeof out_ === 'function' ? out_ : undefined,
    "page_": typeof page_ === 'function' ? page_ : undefined,
    "params_": typeof params_ === 'function' ? params_ : undefined,
    "parseBalance_": typeof parseBalance_ === 'function' ? parseBalance_ : undefined,
    "parseNoti": typeof parseNoti === 'function' ? parseNoti : undefined,
    "planAlias_": typeof planAlias_ === 'function' ? planAlias_ : undefined,
    "planBudget_": typeof planBudget_ === 'function' ? planBudget_ : undefined,
    "planCompare_": typeof planCompare_ === 'function' ? planCompare_ : undefined,
    "planFixedFn_": typeof planFixedFn_ === 'function' ? planFixedFn_ : undefined,
    "planFixedTest_": typeof planFixedTest_ === 'function' ? planFixedTest_ : undefined,
    "planOnEdit_": typeof planOnEdit_ === 'function' ? planOnEdit_ : undefined,
    "planRe_": typeof planRe_ === 'function' ? planRe_ : undefined,
    "planSource_": typeof planSource_ === 'function' ? planSource_ : undefined,
    "planTabSync_": typeof planTabSync_ === 'function' ? planTabSync_ : undefined,
    "planTopUp_": typeof planTopUp_ === 'function' ? planTopUp_ : undefined,
    "ptAcctAuto_": typeof ptAcctAuto_ === 'function' ? ptAcctAuto_ : undefined,
    "ptAcctPrep_": typeof ptAcctPrep_ === 'function' ? ptAcctPrep_ : undefined,
    "ptAcctRead_": typeof ptAcctRead_ === 'function' ? ptAcctRead_ : undefined,
    "ptAcctTails_": typeof ptAcctTails_ === 'function' ? ptAcctTails_ : undefined,
    "ptAcctUse_": typeof ptAcctUse_ === 'function' ? ptAcctUse_ : undefined,
    "ptAlias_": typeof ptAlias_ === 'function' ? ptAlias_ : undefined,
    "ptAutoAcct_": typeof ptAutoAcct_ === 'function' ? ptAutoAcct_ : undefined,
    "ptAutoDays_": typeof ptAutoDays_ === 'function' ? ptAutoDays_ : undefined,
    "ptBudget_": typeof ptBudget_ === 'function' ? ptBudget_ : undefined,
    "ptBuild_": typeof ptBuild_ === 'function' ? ptBuild_ : undefined,
    "ptDispDrop_": typeof ptDispDrop_ === 'function' ? ptDispDrop_ : undefined,
    "ptDisp_": typeof ptDisp_ === 'function' ? ptDisp_ : undefined,
    "ptEditList_": typeof ptEditList_ === 'function' ? ptEditList_ : undefined,
    "ptEnd_": typeof ptEnd_ === 'function' ? ptEnd_ : undefined,
    "ptExtraRows_": typeof ptExtraRows_ === 'function' ? ptExtraRows_ : undefined,
    "ptFromAlias_": typeof ptFromAlias_ === 'function' ? ptFromAlias_ : undefined,
    "ptItems_": typeof ptItems_ === 'function' ? ptItems_ : undefined,
    "ptLast_": typeof ptLast_ === 'function' ? ptLast_ : undefined,
    "ptLive_": typeof ptLive_ === 'function' ? ptLive_ : undefined,
    "ptMemo_": typeof ptMemo_ === 'function' ? ptMemo_ : undefined,
    "ptParse_": typeof ptParse_ === 'function' ? ptParse_ : undefined,
    "ptRe_": typeof ptRe_ === 'function' ? ptRe_ : undefined,
    "ptRec_": typeof ptRec_ === 'function' ? ptRec_ : undefined,
    "ptSecWho_": typeof ptSecWho_ === 'function' ? ptSecWho_ : undefined,
    "ptSetRow_": typeof ptSetRow_ === 'function' ? ptSetRow_ : undefined,
    "ptTab_": typeof ptTab_ === 'function' ? ptTab_ : undefined,
    "ptTidyV1_": typeof ptTidyV1_ === 'function' ? ptTidyV1_ : undefined,
    "purchase_": typeof purchase_ === 'function' ? purchase_ : undefined,
    "rcDate_": typeof rcDate_ === 'function' ? rcDate_ : undefined,
    "rcEnsure_": typeof rcEnsure_ === 'function' ? rcEnsure_ : undefined,
    "rcKey_": typeof rcKey_ === 'function' ? rcKey_ : undefined,
    "rcLast_": typeof rcLast_ === 'function' ? rcLast_ : undefined,
    "rcNum_": typeof rcNum_ === 'function' ? rcNum_ : undefined,
    "rcUpsert_": typeof rcUpsert_ === 'function' ? rcUpsert_ : undefined,
    "readLedgerSettingsRaw_": typeof readLedgerSettingsRaw_ === 'function' ? readLedgerSettingsRaw_ : undefined,
    "readLedgerSettings_": typeof readLedgerSettings_ === 'function' ? readLedgerSettings_ : undefined,
    "readNotisRaw_": typeof readNotisRaw_ === 'function' ? readNotisRaw_ : undefined,
    "readNotis_": typeof readNotis_ === 'function' ? readNotis_ : undefined,
    "readOrders_": typeof readOrders_ === 'function' ? readOrders_ : undefined,
    "readRows_": typeof readRows_ === 'function' ? readRows_ : undefined,
    "recDate_": typeof recDate_ === 'function' ? recDate_ : undefined,
    "recDays_": typeof recDays_ === 'function' ? recDays_ : undefined,
    "recDue_": typeof recDue_ === 'function' ? recDue_ : undefined,
    "recForDash_": typeof recForDash_ === 'function' ? recForDash_ : undefined,
    "recOff_": typeof recOff_ === 'function' ? recOff_ : undefined,
    "recTab_": typeof recTab_ === 'function' ? recTab_ : undefined,
    "recWrite_": typeof recWrite_ === 'function' ? recWrite_ : undefined,
    "recYmd_": typeof recYmd_ === 'function' ? recYmd_ : undefined,
    "receive_": typeof receive_ === 'function' ? receive_ : undefined,
    "refreshAnalysis": typeof refreshAnalysis === 'function' ? refreshAnalysis : undefined,
    "refreshLedger": typeof refreshLedger === 'function' ? refreshLedger : undefined,
    "reparseAll": typeof reparseAll === 'function' ? reparseAll : undefined,
    "rowKey_": typeof rowKey_ === 'function' ? rowKey_ : undefined,
    "runChecks_": typeof runChecks_ === 'function' ? runChecks_ : undefined,
    "safeJson_": typeof safeJson_ === 'function' ? safeJson_ : undefined,
    "saleAcctHint_": typeof saleAcctHint_ === 'function' ? saleAcctHint_ : undefined,
    "saleAppLink_": typeof saleAppLink_ === 'function' ? saleAppLink_ : undefined,
    "saleApplySettings_": typeof saleApplySettings_ === 'function' ? saleApplySettings_ : undefined,
    "saleArchive_": typeof saleArchive_ === 'function' ? saleArchive_ : undefined,
    "saleCheckOut_": typeof saleCheckOut_ === 'function' ? saleCheckOut_ : undefined,
    "saleConnCode_": typeof saleConnCode_ === 'function' ? saleConnCode_ : undefined,
    "saleDaily": typeof saleDaily === 'function' ? saleDaily : undefined,
    "saleDashUrl_": typeof saleDashUrl_ === 'function' ? saleDashUrl_ : undefined,
    "saleGuideState_": typeof saleGuideState_ === 'function' ? saleGuideState_ : undefined,
    "saleGuideStatus_": typeof saleGuideStatus_ === 'function' ? saleGuideStatus_ : undefined,
    "saleGuideSync_": typeof saleGuideSync_ === 'function' ? saleGuideSync_ : undefined,
    "saleGuideTab_": typeof saleGuideTab_ === 'function' ? saleGuideTab_ : undefined,
    "saleHoliOld_": typeof saleHoliOld_ === 'function' ? saleHoliOld_ : undefined,
    "saleHoliTab_": typeof saleHoliTab_ === 'function' ? saleHoliTab_ : undefined,
    "saleHoli_": typeof saleHoli_ === 'function' ? saleHoli_ : undefined,
    "saleKey_": typeof saleKey_ === 'function' ? saleKey_ : undefined,
    "saleLinks_": typeof saleLinks_ === 'function' ? saleLinks_ : undefined,
    "saleMigrateV2_": typeof saleMigrateV2_ === 'function' ? saleMigrateV2_ : undefined,
    "saleMyName_": typeof saleMyName_ === 'function' ? saleMyName_ : undefined,
    "salePlanTab_": typeof salePlanTab_ === 'function' ? salePlanTab_ : undefined,
    "salePlan_": typeof salePlan_ === 'function' ? salePlan_ : undefined,
    "saleProp_": typeof saleProp_ === 'function' ? saleProp_ : undefined,
    "saleRKey_": typeof saleRKey_ === 'function' ? saleRKey_ : undefined,
    "saleRefresh": typeof saleRefresh === 'function' ? saleRefresh : undefined,
    "saleRekey": typeof saleRekey === 'function' ? saleRekey : undefined,
    "saleResetUrl": typeof saleResetUrl === 'function' ? saleResetUrl : undefined,
    "saleSampleRows_": typeof saleSampleRows_ === 'function' ? saleSampleRows_ : undefined,
    "saleSample_": typeof saleSample_ === 'function' ? saleSample_ : undefined,
    "saleSetTab_": typeof saleSetTab_ === 'function' ? saleSetTab_ : undefined,
    "saleSetWrite_": typeof saleSetWrite_ === 'function' ? saleSetWrite_ : undefined,
    "saleSettings_": typeof saleSettings_ === 'function' ? saleSettings_ : undefined,
    "saleSetup": typeof saleSetup === 'function' ? saleSetup : undefined,
    "saleShareCode_": typeof saleShareCode_ === 'function' ? saleShareCode_ : undefined,
    "saleShareData": typeof saleShareData === 'function' ? saleShareData : undefined,
    "saleShareDialog": typeof saleShareDialog === 'function' ? saleShareDialog : undefined,
    "saleShareFetch_": typeof saleShareFetch_ === 'function' ? saleShareFetch_ : undefined,
    "saleShareLink": typeof saleShareLink === 'function' ? saleShareLink : undefined,
    "saleShareName": typeof saleShareName === 'function' ? saleShareName : undefined,
    "saleShareOut_": typeof saleShareOut_ === 'function' ? saleShareOut_ : undefined,
    "saleShareParse_": typeof saleShareParse_ === 'function' ? saleShareParse_ : undefined,
    "saleShareUnlink": typeof saleShareUnlink === 'function' ? saleShareUnlink : undefined,
    "saleShowCodes": typeof saleShowCodes === 'function' ? saleShowCodes : undefined,
    "saleSs_": typeof saleSs_ === 'function' ? saleSs_ : undefined,
    "saleStCard_": typeof saleStCard_ === 'function' ? saleStCard_ : undefined,
    "saleStConn_": typeof saleStConn_ === 'function' ? saleStConn_ : undefined,
    "saleSyncRead_": typeof saleSyncRead_ === 'function' ? saleSyncRead_ : undefined,
    "saleSyncWrite_": typeof saleSyncWrite_ === 'function' ? saleSyncWrite_ : undefined,
    "saleToken_": typeof saleToken_ === 'function' ? saleToken_ : undefined,
    "saleWebUrl_": typeof saleWebUrl_ === 'function' ? saleWebUrl_ : undefined,
    "setAcctRow_": typeof setAcctRow_ === 'function' ? setAcctRow_ : undefined,
    "setBudget_": typeof setBudget_ === 'function' ? setBudget_ : undefined,
    "setCategory_": typeof setCategory_ === 'function' ? setCategory_ : undefined,
    "setIncomeType_": typeof setIncomeType_ === 'function' ? setIncomeType_ : undefined,
    "setNotiAmount_": typeof setNotiAmount_ === 'function' ? setNotiAmount_ : undefined,
    "setPlanRow_": typeof setPlanRow_ === 'function' ? setPlanRow_ : undefined,
    "setupSheet": typeof setupSheet === 'function' ? setupSheet : undefined,
    "show": typeof show === 'function' ? show : undefined,
    "stFmtV1_": typeof stFmtV1_ === 'function' ? stFmtV1_ : undefined,
    "stGet_": typeof stGet_ === 'function' ? stGet_ : undefined,
    "stParse_": typeof stParse_ === 'function' ? stParse_ : undefined,
    "stRead_": typeof stRead_ === 'function' ? stRead_ : undefined,
    "stSet_": typeof stSet_ === 'function' ? stSet_ : undefined,
    "stTab_": typeof stTab_ === 'function' ? stTab_ : undefined,
    "stTidyV1_": typeof stTidyV1_ === 'function' ? stTidyV1_ : undefined,
    "stWordsRe_": typeof stWordsRe_ === 'function' ? stWordsRe_ : undefined,
    "tabTidyV1_": typeof tabTidyV1_ === 'function' ? tabTidyV1_ : undefined,
    "tab_": typeof tab_ === 'function' ? tab_ : undefined,
    "toDate_": typeof toDate_ === 'function' ? toDate_ : undefined,
    "toNum_": typeof toNum_ === 'function' ? toNum_ : undefined,
    "toast_": typeof toast_ === 'function' ? toast_ : undefined,
    "upsertPurchases_": typeof upsertPurchases_ === 'function' ? upsertPurchases_ : undefined,
    "writeAnalysis_": typeof writeAnalysis_ === 'function' ? writeAnalysis_ : undefined,
    "writeLedgerClose_": typeof writeLedgerClose_ === 'function' ? writeLedgerClose_ : undefined
  } };
