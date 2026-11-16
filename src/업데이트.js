/**
 * 업데이트.gs — 원격 업데이트 (2026-11-16 시작)
 *  기획서: https://claude.ai/artifact/DntRUyZbu8XdSEXZpQFSUJ · 판매용_개발가이드 5장
 *  하루 1회(새벽 무작위) updDaily:
 *   index.json(코드 키 서명) 확인 → 이용권(구매자 이메일 서명) 확인 → 규칙 업데이트 →
 *   코드 자기 교체(Apps Script API) → 같은 주소로 재배포 → 점검 → 실패하면 되돌림
 *  이 파일은 거의 바꾸지 않는다. 고장 난 업데이트 모듈이 나가면 그 사본은 더는 스스로 못 고친다.
 *  서버 없음: 판매자 쪽으로 보내는 데이터 없음. 받는 곳 = jsDelivr(실패 시 GitHub 원본)
 *  ed25519 검증 = TweetNaCl-js 1.0.3(퍼블릭 도메인, Dmitry Chestnykh·Devi Mandiri 이식)의 검증 부분만. SHA-512는 Utilities
 */
const UPD = {
  REPO: 'hanjon-git/hannun-gagyebu', BRANCH: 'main', DIR: 'src',
  CODE_KEYS: ['PdWi7329kI6BQoqlFoQkdE3uw+4Wtu5HCOEvKYsRAdo='],      // 코드 서명 공개키(base64). 비어 있으면 업데이트를 하지 않음 (집 PC에서 코드 키를 만든 뒤 채움)
  LICENSE_KEY: '9OTwAIoIHOz+NLYCtS2hRW1/jCpY7PhY9t4/ZD7WSEs=',
  HOURS: [2, 3, 4, 5],     // 확인 시각 후보 (사용 중 교체를 피함)
  FMT: 1, RULES_FMT: 1,
  RULES_CHUNK: 2500,       // 스크립트 속성 값 하나 9KB 한도 → 한글 3바이트 기준 여유 있게
};

/* ---------- ed25519 검증 (TweetNaCl-js 1.0.3에서 검증 경로만) ---------- */
const UPD_ED_ = (function () {
  const gf = function (init) { const r = new Float64Array(16); if (init) for (let i = 0; i < init.length; i++) r[i] = init[i]; return r; };
  const gf0 = gf(), gf1 = gf([1]),
    D = gf([0x78a3, 0x1359, 0x4dca, 0x75eb, 0xd8ab, 0x4141, 0x0a4d, 0x0070, 0xe898, 0x7779, 0x4079, 0x8cc7, 0xfe73, 0x2b6f, 0x6cee, 0x5203]),
    D2 = gf([0xf159, 0x26b2, 0x9b94, 0xebd6, 0xb156, 0x8283, 0x149a, 0x00e0, 0xd130, 0xeef3, 0x80f2, 0x198e, 0xfce7, 0x56df, 0xd9dc, 0x2406]),
    X = gf([0xd51a, 0x8f25, 0x2d60, 0xc956, 0xa7b2, 0x9525, 0xc760, 0x692c, 0xdc5c, 0xfdd6, 0xe231, 0xc0a4, 0x53fe, 0xcd6e, 0x36d3, 0x2169]),
    Y = gf([0x6658, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666]),
    I = gf([0xa0b0, 0x4a0e, 0x1b27, 0xc4ee, 0xe478, 0xad2f, 0x1806, 0x2f43, 0xd7a7, 0x3dfb, 0x0099, 0x2b4d, 0xdf0b, 0x4fc1, 0x2480, 0x2b83]),
    L = new Float64Array([0xed, 0xd3, 0xf5, 0x5c, 0x1a, 0x63, 0x12, 0x58, 0xd6, 0x9c, 0xf7, 0xa2, 0xde, 0xf9, 0xde, 0x14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x10]);
  function vn(x, xi, y, yi, n) { let d = 0; for (let i = 0; i < n; i++) d |= x[xi + i] ^ y[yi + i]; return (1 & ((d - 1) >>> 8)) - 1; }
  function set25519(r, a) { for (let i = 0; i < 16; i++) r[i] = a[i] | 0; }
  function car25519(o) { for (let i = 0; i < 16; i++) { o[i] += 65536; const c = Math.floor(o[i] / 65536); o[(i + 1) * (i < 15 ? 1 : 0)] += c - 1 + 37 * (c - 1) * (i === 15 ? 1 : 0); o[i] -= c * 65536; } }
  function sel25519(p, q, b) { const c = ~(b - 1); for (let i = 0; i < 16; i++) { const t = c & (p[i] ^ q[i]); p[i] ^= t; q[i] ^= t; } }
  function pack25519(o, n) {
    const m = gf(), t = gf(); let i, j, b;
    for (i = 0; i < 16; i++) t[i] = n[i];
    car25519(t); car25519(t); car25519(t);
    for (j = 0; j < 2; j++) {
      m[0] = t[0] - 0xffed;
      for (i = 1; i < 15; i++) { m[i] = t[i] - 0xffff - ((m[i - 1] >> 16) & 1); m[i - 1] &= 0xffff; }
      m[15] = t[15] - 0x7fff - ((m[14] >> 16) & 1); b = (m[15] >> 16) & 1; m[14] &= 0xffff; sel25519(t, m, 1 - b);
    }
    for (i = 0; i < 16; i++) { o[2 * i] = t[i] & 0xff; o[2 * i + 1] = t[i] >> 8; }
  }
  function neq25519(a, b) { const c = new Uint8Array(32), d = new Uint8Array(32); pack25519(c, a); pack25519(d, b); return vn(c, 0, d, 0, 32); }
  function par25519(a) { const d = new Uint8Array(32); pack25519(d, a); return d[0] & 1; }
  function unpack25519(o, n) { for (let i = 0; i < 16; i++) o[i] = n[2 * i] + (n[2 * i + 1] << 8); o[15] &= 0x7fff; }
  function A(o, a, b) { for (let i = 0; i < 16; i++) o[i] = (a[i] + b[i]) | 0; }
  function Z(o, a, b) { for (let i = 0; i < 16; i++) o[i] = (a[i] - b[i]) | 0; }
  function M(o, a, b) {
    const t = new Float64Array(31); let i, j;
    for (i = 0; i < 16; i++) for (j = 0; j < 16; j++) t[i + j] += a[i] * b[j];
    for (i = 0; i < 15; i++) t[i] += 38 * t[i + 16];
    for (i = 0; i < 16; i++) o[i] = t[i];
    car25519(o); car25519(o);
  }
  function S(o, a) { M(o, a, a); }
  function inv25519(o, i) { const c = gf(); let a; for (a = 0; a < 16; a++) c[a] = i[a]; for (a = 253; a >= 0; a--) { S(c, c); if (a !== 2 && a !== 4) M(c, c, i); } for (a = 0; a < 16; a++) o[a] = c[a]; }
  function pow2523(o, i) { const c = gf(); let a; for (a = 0; a < 16; a++) c[a] = i[a]; for (a = 250; a >= 0; a--) { S(c, c); if (a !== 1) M(c, c, i); } for (a = 0; a < 16; a++) o[a] = c[a]; }
  function add(p, q) {
    const a = gf(), b = gf(), c = gf(), d = gf(), e = gf(), f = gf(), g = gf(), h = gf(), t = gf();
    Z(a, p[1], p[0]); Z(t, q[1], q[0]); M(a, a, t); A(b, p[0], p[1]); A(t, q[0], q[1]); M(b, b, t);
    M(c, p[3], q[3]); M(c, c, D2); M(d, p[2], q[2]); A(d, d, d); Z(e, b, a); Z(f, d, c); A(g, d, c); A(h, b, a);
    M(p[0], e, f); M(p[1], h, g); M(p[2], g, f); M(p[3], e, h);
  }
  function cswap(p, q, b) { for (let i = 0; i < 4; i++) sel25519(p[i], q[i], b); }
  function pack(r, p) { const tx = gf(), ty = gf(), zi = gf(); inv25519(zi, p[2]); M(tx, p[0], zi); M(ty, p[1], zi); pack25519(r, ty); r[31] ^= par25519(tx) << 7; }
  function scalarmult(p, q, s) {
    set25519(p[0], gf0); set25519(p[1], gf1); set25519(p[2], gf1); set25519(p[3], gf0);
    for (let i = 255; i >= 0; --i) { const b = (s[(i / 8) | 0] >> (i & 7)) & 1; cswap(p, q, b); add(q, p); add(p, p); cswap(p, q, b); }
  }
  function scalarbase(p, s) { const q = [gf(), gf(), gf(), gf()]; set25519(q[0], X); set25519(q[1], Y); set25519(q[2], gf1); M(q[3], X, Y); scalarmult(p, q, s); }
  function modL(r, x) {
    let carry, i, j, k;
    for (i = 63; i >= 32; --i) {
      carry = 0;
      for (j = i - 32, k = i - 12; j < k; ++j) { x[j] += carry - 16 * x[i] * L[j - (i - 32)]; carry = Math.floor((x[j] + 128) / 256); x[j] -= carry * 256; }
      x[j] += carry; x[i] = 0;
    }
    carry = 0;
    for (j = 0; j < 32; j++) { x[j] += carry - (x[31] >> 4) * L[j]; carry = x[j] >> 8; x[j] &= 255; }
    for (j = 0; j < 32; j++) x[j] -= carry * L[j];
    for (i = 0; i < 32; i++) { x[i + 1] += x[i] >> 8; r[i] = x[i] & 255; }
  }
  function reduce(r) { const x = new Float64Array(64); for (let i = 0; i < 64; i++) x[i] = r[i]; for (let i = 0; i < 64; i++) r[i] = 0; modL(r, x); }
  function unpackneg(r, p) {
    const t = gf(), chk = gf(), num = gf(), den = gf(), den2 = gf(), den4 = gf(), den6 = gf();
    set25519(r[2], gf1); unpack25519(r[1], p); S(num, r[1]); M(den, num, D); Z(num, num, r[2]); A(den, r[2], den);
    S(den2, den); S(den4, den2); M(den6, den4, den2); M(t, den6, num); M(t, t, den);
    pow2523(t, t); M(t, t, num); M(t, t, den); M(t, t, den); M(r[0], t, den);
    S(chk, r[0]); M(chk, chk, den); if (neq25519(chk, num)) M(r[0], r[0], I);
    S(chk, r[0]); M(chk, chk, den); if (neq25519(chk, num)) return -1;
    if (par25519(r[0]) === (p[31] >> 7)) Z(r[0], gf0, r[0]);
    M(r[3], r[0], r[1]);
    return 0;
  }
  /** sig(64) · msg · pk(32) 는 Uint8Array, sha512(Uint8Array) → Uint8Array(64) */
  function verify(msg, sig, pk, sha512) {
    if (sig.length !== 64 || pk.length !== 32) return false;
    const p = [gf(), gf(), gf(), gf()], q = [gf(), gf(), gf(), gf()], t = new Uint8Array(32);
    if (unpackneg(q, pk)) return false;
    const m = new Uint8Array(64 + msg.length);
    m.set(sig.subarray(0, 32), 0); m.set(pk, 32); m.set(msg, 64);
    const h = new Uint8Array(64); h.set(sha512(m)); reduce(h);
    scalarmult(p, q, h); scalarbase(q, sig.subarray(32)); add(p, q); pack(t, p);
    return vn(sig, 0, t, 0, 32) === 0;
  }
  return { verify: verify };
})();

/* ---------- 바이트·해시 ---------- */
const updU8_ = a => Uint8Array.from(a, b => b & 255);
const updB64_ = s => updU8_(Utilities.base64Decode(String(s).replace(/-/g, '+').replace(/_/g, '/')));
const updUtf8_ = s => updU8_(Utilities.newBlob(String(s)).getBytes());
const updSha512_ = u8 => updU8_(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_512, Array.from(u8, b => (b > 127 ? b - 256 : b))));
const updHex_ = a => Array.from(a, b => ((b & 255) < 16 ? '0' : '') + (b & 255).toString(16)).join('');
const updSha256_ = s => updHex_(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(s), Utilities.Charset.UTF_8));
function updVerify_(text, sigB64, keysB64) {
  const m = updUtf8_(text), s = updB64_(sigB64);
  return keysB64.some(k => { try { return UPD_ED_.verify(m, s, updB64_(k), updSha512_); } catch (e) { return false; } });
}
/** 구매자 이메일 정규화 — 판매용/tools/license.js norm()과 같아야 함 */
function updNorm_(e) {
  e = String(e || '').trim().toLowerCase();
  const p = e.split('@');
  if (p.length !== 2 || !p[0] || !p[1]) return '';
  let u = p[0], d = p[1];
  if (d === 'googlemail.com') d = 'gmail.com';
  if (d === 'gmail.com') u = u.split('+')[0].replace(/\./g, '');
  return u + '@' + d;
}

/* ---------- 받기 ---------- */
function updUrls_(path, ref) {
  const enc = String(path).split('/').map(encodeURIComponent).join('/');
  return ['https://cdn.jsdelivr.net/gh/' + UPD.REPO + '@' + ref + '/' + enc, 'https://raw.githubusercontent.com/' + UPD.REPO + '/' + ref + '/' + enc];
}
function updFetch_(path, ref) {
  let last = '';
  for (const u of updUrls_(path, ref)) {
    try {
      const r = UrlFetchApp.fetch(u, { muteHttpExceptions: true, followRedirects: true });
      if (r.getResponseCode() === 200) return r.getContentText('UTF-8');
      last = r.getResponseCode() + ' ' + u;
    } catch (e) { last = e.message; }
  }
  throw new Error('받기 실패: ' + path + ' (' + last + ')');
}
/** index.json = {body: "<JSON 문자열>", sig: "<base64>"} — body에만 서명 */
function updIndex_() {
  const o = JSON.parse(updFetch_('index.json', UPD.BRANCH));
  if (!o || typeof o.body !== 'string' || !updVerify_(o.body, o.sig, UPD.CODE_KEYS)) throw new Error('index 서명 틀림');
  const b = JSON.parse(o.body);
  if (b.fmt !== UPD.FMT) throw new Error('index 형식 ' + b.fmt + ' (이 사본은 ' + UPD.FMT + ')');
  return b;
}

/* ---------- 이용권 ---------- */
function updEmail_() { try { return updNorm_(Session.getEffectiveUser().getEmail()); } catch (e) { return ''; } }
/** 키 = 'HN1.' + 일련번호(5자리) + '.' + base64url(서명('HN1|일련번호|이메일')) */
function updLicense_(idx, email) {
  const key = PropertiesService.getScriptProperties().getProperty('LICENSE') || '';
  const m = /^HN1\.(\d{5})\.([A-Za-z0-9_-]{80,90})$/.exec(key.trim());
  if (!m) return { ok: false, why: key ? 'form' : 'none' };
  if (!email) return { ok: false, why: 'email' };
  if (!updVerify_('HN1|' + m[1] + '|' + email, m[2], [UPD.LICENSE_KEY])) return { ok: false, why: 'mismatch', serial: m[1] };
  if (idx && (idx.revoked || []).indexOf(m[1]) >= 0) return { ok: false, why: 'revoked', serial: m[1] };
  return { ok: true, serial: m[1] };
}
/** 배포 순번: 시험 사본(일련번호 목록)은 항상 먼저, 나머지는 이메일+빌드 해시로 0~99 */
function updEligible_(idx, lic, email) {
  if ((idx.test || []).indexOf(lic.serial) >= 0) return true;
  const pct = idx.pct == null ? 100 : +idx.pct;
  return parseInt(updSha256_(email + '|' + idx.build).slice(0, 4), 16) % 100 < pct;
}

/* ---------- 규칙 (데이터, 코드 아님) ---------- */
function updRules_(idx) {
  const r = idx.rules, p = PropertiesService.getScriptProperties();
  if (!r || r.fmt !== UPD.RULES_FMT || p.getProperty('RULES_SHA') === r.sha256) return 'same';
  const text = updFetch_(r.file, idx.tag);
  if (updSha256_(text) !== r.sha256) throw new Error('규칙 해시 틀림');
  JSON.parse(text);
  const parts = [];
  for (let i = 0; i < text.length; i += UPD.RULES_CHUNK) parts.push(text.slice(i, i + UPD.RULES_CHUNK));
  const old = +p.getProperty('RULES_N') || 0, set = { RULES_N: String(parts.length), RULES_SHA: r.sha256 };
  parts.forEach((s, i) => { set['RULES_' + i] = s; });
  p.setProperties(set);
  for (let i = parts.length; i < old; i++) p.deleteProperty('RULES_' + i);
  return 'new';
}
/** 받은 규칙 (없으면 null). 구매자가 직접 넣은 규칙이 항상 우선 — 쓰는 쪽에서 합칠 때 */
function updRulesGet_() {
  return memo_('updRules', () => {
    const p = PropertiesService.getScriptProperties(), n = +p.getProperty('RULES_N') || 0;
    if (!n) return null;
    let s = '';
    for (let i = 0; i < n; i++) s += p.getProperty('RULES_' + i) || '';
    try { return JSON.parse(s); } catch (e) { return null; }
  });
}

/* ---------- Apps Script API (구매자 자신의 프로젝트) ---------- */
function updApi_(method, path, body) {
  const r = UrlFetchApp.fetch('https://script.googleapis.com/v1/projects/' + ScriptApp.getScriptId() + path, {
    method: method, contentType: 'application/json', muteHttpExceptions: true,
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
    payload: body ? JSON.stringify(body) : undefined,
  });
  const c = r.getResponseCode(), t = r.getContentText();
  if (c >= 200 && c < 300) return t ? JSON.parse(t) : {};
  const e = new Error('API ' + c + ': ' + t.slice(0, 200));
  if (c === 403 && /Apps Script API|has not been used|is disabled|not enabled/i.test(t)) e.api = 'off';
  throw e;
}
function updDeployId_() {
  const m = /\/s\/([A-Za-z0-9_-]+)\/exec/.exec(PropertiesService.getScriptProperties().getProperty('WEBAPP_URL') || '');
  return m ? m[1] : '';
}
const updScopes_ = files => {
  const f = files.find(x => x.type === 'JSON' && x.name === 'appsscript');
  try { return (JSON.parse(f.source).oauthScopes || []).slice().sort().join(' '); } catch (e) { return ''; }
};
function updRedeploy_(dep, desc) {
  const v = updApi_('post', '/versions', { description: desc }).versionNumber;
  updApi_('put', '/deployments/' + dep, { deploymentConfig: { scriptId: ScriptApp.getScriptId(), versionNumber: v, manifestFileName: 'appsscript', description: desc } });
  return v;
}
/** 새 코드가 웹앱으로 뜨는지 + 새 코드의 업데이트 모듈이 살아 있는지 (?k=키&do=ping) */
function updPing_(build) {
  const r = UrlFetchApp.fetch(PropertiesService.getScriptProperties().getProperty('WEBAPP_URL') + '?k=' + encodeURIComponent(saleKey_()) + '&do=ping', { muteHttpExceptions: true, followRedirects: true });
  let j = null;
  try { j = JSON.parse(r.getContentText()); } catch (e) {}
  if (!j || !j.ok || j.build !== build || j.self !== true) throw new Error('점검 실패: ' + r.getResponseCode() + ' ' + r.getContentText().slice(0, 120));
}
/** 새 코드가 스스로 돌리는 점검: 서명 검증(RFC 8032 시험값 1)과 업데이트 함수 */
function updSelfTest_() {
  try {
    const pk = '11qYAYKxCrfVS/7TyWQHOg7hcvPapiMlrwIaaPcHURo=';
    const sig = '5VZDAMNgrHKQhuLMgG6CioSHfx645dl02HPgZSJJAVVfuIIVkKM7rMYeOXAc+bRr0lv18FlbviRlUUFDjnoQCw==';
    if (!updVerify_('', sig, [pk]) || updVerify_('x', sig, [pk])) return false;
    return [updDaily, updIndex_, updCode_, updApi_, updRedeploy_].every(f => typeof f === 'function');
  } catch (e) { return false; }
}

/* ---------- 코드 교체 ---------- */
function updCode_(idx) {
  const p = PropertiesService.getScriptProperties();
  const cur = HN_BUILD;
  if (idx.build === cur) return 'same';
  if (idx.build < cur && !idx.downgrade) return 'older';
  if (p.getProperty('UPD_BAD') === String(idx.build)) return 'bad:' + idx.build;
  const dep = updDeployId_();
  if (!dep) return 'no-webapp';
  const now = updApi_('get', '/content').files || [];
  if (updScopes_(now) !== (idx.scopes || []).slice().sort().join(' ')) { p.setProperty('UPD_NEED', String(idx.build)); return 'scopes'; }
  const have = {};
  now.forEach(f => { have[f.type + ':' + f.name] = f.source; });
  const next = idx.files.map(f => {
    const old = have[f.type + ':' + f.name];
    if (old != null && updSha256_(old) === f.sha256) return { name: f.name, type: f.type, source: old };
    const src = updFetch_(UPD.DIR + '/' + f.path, idx.tag);
    if (updSha256_(src) !== f.sha256) throw new Error('파일 해시 틀림: ' + f.path);
    return { name: f.name, type: f.type, source: src };
  });
  const backup = now.map(f => ({ name: f.name, type: f.type, source: f.source }));
  updApi_('put', '/content', { files: next });
  try {
    updRedeploy_(dep, '한눈가계부 ' + (idx.ver || '') + ' (' + idx.build + ')');
    updPing_(idx.build);
  } catch (e) {
    let back = 'ok';
    try { updApi_('put', '/content', { files: backup }); updRedeploy_(dep, '되돌림 (' + cur + ')'); } catch (e2) { back = e2.message; }
    p.setProperty('UPD_BAD', String(idx.build));
    return 'rolled-back:' + e.message.slice(0, 120) + (back === 'ok' ? '' : ' / 되돌림 실패: ' + back.slice(0, 120));
  }
  p.deleteProperty('UPD_NEED');
  return 'updated:' + idx.build;
}

/* ---------- 실행 ---------- */
function updState_(s) {
  PropertiesService.getScriptProperties().setProperty('UPD_STATE', JSON.stringify({ at: new Date().toISOString(), s: s, build: HN_BUILD }));
  console.log('업데이트: ' + s);
  return s;
}
/** 매일 트리거. 오류도 여기서 삼킴 (구글 실패 메일이 구매자에게 가지 않게) */
function updDaily() { return updRun_(); }
function updRun_() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) return updState_('busy');
  try {
    if (!UPD.CODE_KEYS.length) return updState_('no-key');
    const idx = updIndex_();
    if (idx.stop) return updState_('paused');
    const email = updEmail_(), lic = updLicense_(idx, email);
    if (!lic.ok) return updState_('license:' + lic.why);
    let rules = '';
    try { rules = updRules_(idx); } catch (e) { rules = 'rules-error:' + e.message; }
    if (PropertiesService.getScriptProperties().getProperty('UPD_OFF') === '1') return updState_('off' + (rules === 'new' ? ' · 규칙 새로' : ''));
    if (!updEligible_(idx, lic, email)) return updState_('wait:' + idx.build);
    return updState_(updCode_(idx));
  } catch (e) {
    return updState_((e.api === 'off' ? 'api-off:' : 'error:') + String(e.message).slice(0, 200));
  } finally { lock.releaseLock(); }
}
/** 트리거가 없으면 새벽 무작위 시각으로 만듦 (설치·매일 정리에서 부름) */
function updEnsure_() {
  if (ScriptApp.getProjectTriggers().some(t => t.getHandlerFunction() === 'updDaily')) return false;
  const h = UPD.HOURS[Math.floor(Math.random() * UPD.HOURS.length)];
  ScriptApp.newTrigger('updDaily').timeBased().everyDays(1).atHour(h).nearMinute(Math.floor(Math.random() * 60)).create();
  return true;
}
/** 대시보드·설정 탭에 보여줄 한 줄 */
function updStatus_() {
  let st = {};
  try { st = JSON.parse(PropertiesService.getScriptProperties().getProperty('UPD_STATE') || '{}'); } catch (e) {}
  const s = String(st.s || '');
  const msg = /^updated/.test(s) ? '최신' : s === 'same' || /^wait/.test(s) ? '최신' : s === 'off' ? '자동 업데이트 꺼짐'
    : /^license:none/.test(s) ? '이용권 키 없음' : /^license/.test(s) ? '이용권 키 확인 필요' : /^api-off/.test(s) ? 'Apps Script API 꺼짐'
    : s === 'scopes' ? '새 버전: 메뉴에서 승인 필요' : /^rolled-back/.test(s) ? '업데이트 실패, 이전 버전 유지' : s ? '확인 필요' : '';
  return { build: HN_BUILD, ver: SALE.VER, msg: msg, at: st.at || '' };
}

/* ---------- 메뉴 (관리) ---------- */
function updLicenseMenu() {
  const ui = SpreadsheetApp.getUi();
  const r = ui.prompt('이용권 키', '구매 때 받은 이용권 키를 붙여넣으세요', ui.ButtonSet.OK_CANCEL);
  if (r.getSelectedButton() !== ui.Button.OK) return;
  const v = String(r.getResponseText()).trim();
  PropertiesService.getScriptProperties().setProperty('LICENSE', v);
  const l = updLicense_(null, updEmail_());
  ui.alert(l.ok ? '이용권 확인됨' : l.why === 'mismatch' ? '이 구글 계정의 키가 아닙니다' : '키 형식이 맞지 않습니다');
}
function updNowMenu() {
  const ui = SpreadsheetApp.getUi();
  updEnsure_();
  const s = updRun_(), st = updStatus_();
  ui.alert('업데이트 확인', '버전 ' + st.ver + ' (' + st.build + ') · ' + (st.msg || s), ui.ButtonSet.OK);
}
function updToggleMenu() {
  const ui = SpreadsheetApp.getUi(), p = PropertiesService.getScriptProperties();
  const off = p.getProperty('UPD_OFF') === '1';
  if (ui.alert('자동 업데이트', off ? '지금 꺼져 있습니다. 켤까요?' : '켜져 있습니다. 끄면 새 기능·고침을 받지 않습니다 (규칙은 계속 받음). 끌까요?', ui.ButtonSet.YES_NO) !== ui.Button.YES) return;
  if (off) p.deleteProperty('UPD_OFF'); else p.setProperty('UPD_OFF', '1');
}
