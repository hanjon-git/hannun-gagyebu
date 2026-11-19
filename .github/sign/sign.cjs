// 한눈가계부 원격 서명 (2026-11-19). 판매용\tools\sign.js와 같은 index.json을 만듦 (body.fmt = 2, ed25519)
//  node .github/sign/sign.cjs check|sign   입력 = req/(request.json, bundle.js, meta.json[, rules.json]) + 환경변수 IN_BUILD·IN_SHA12·IN_DRY
//  sign은 환경 'release' 승인 뒤에만 도는 작업에서 CODE_KEY(PEM, 암호로 잠김)·CODE_KEY_PASS를 받음
const crypto = require('crypto'), fs = require('fs'), path = require('path');
const R = 'req', mode = process.argv[2];
const die = m => { console.log('::error::' + m); process.exit(1); };
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const rd = f => fs.readFileSync(path.join(R, f));
const q = JSON.parse(rd('request.json').toString('utf8')), meta = JSON.parse(rd('meta.json').toString('utf8')), text = rd('bundle.js').toString('utf8');
const B = String(process.env.IN_BUILD || ''), S12 = String(process.env.IN_SHA12 || ''), dry = process.env.IN_DRY === 'true';
const h = sha(Buffer.from(text, 'utf8'));
if (!/^\d+$/.test(B) || String(q.build) !== B || meta.build !== +B) die('빌드 번호가 요청·빌드 기록·입력에서 서로 다름');
if (h !== meta.sha256 || h !== q.sha256 || h.slice(0, 12) !== S12) die('번들 해시가 요청과 다름');
if (!/^[0-9][0-9.]*$/.test(String(q.ver))) die('버전 형식');
const pct = Number(q.pct); if (!Number.isFinite(pct) || pct < 0 || pct > 100) die('배포 % 형식');
const five = a => Array.isArray(a) && a.every(s => /^\d{5}$/.test(s));
if (!five(q.test) || !five(q.revoked)) die('시험·해지 목록 형식');
let rules = null;
if (q.rules) { const t = rd('rules.json').toString('utf8'); if (sha(Buffer.from(t, 'utf8')) !== q.rules.sha256) die('규칙 파일 해시'); rules = { t, fmt: JSON.parse(t).fmt || 1 }; }
const sum = ['## build ' + B + ' (' + q.ver + ') · 배포 ' + pct + '%' + (dry ? ' · 시험(게시 안 함)' : ' · 게시'),
  '- 번들 sha256 앞 12자: `' + h.slice(0, 12) + '` (출시 도구가 보고한 값과 같은지 보고 승인)',
  '- 번들 ' + Math.round(meta.bytes / 1024) + 'KB · 시험 사본 ' + q.test.length + '개' + (q.downgrade ? ' · 되돌림' : '') + (q.stop ? ' · 중단' : ''),
  q.summary ? '- 내용: ' + String(q.summary).slice(0, 300) : ''].filter(Boolean).join('\n') + '\n';
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, sum);
console.log(sum);
if (mode === 'check') process.exit(0);
if (mode !== 'sign') die('check 또는 sign');
const pem = process.env.CODE_KEY || '', pass = process.env.CODE_KEY_PASS;
if (!/PRIVATE KEY/.test(pem)) die('환경 비밀값 CODE_KEY가 없음');
let key; try { key = crypto.createPrivateKey(/ENCRYPTED/.test(pem) ? { key: pem, passphrase: pass || '' } : pem); } catch (e) { die('키를 열 수 없음 (CODE_KEY_PASS 확인)'); }
const now = new Date();
const body = {
  fmt: 2, build: +B, ver: String(q.ver), tag: 'b' + B, date: now.toISOString().slice(0, 10), at: now.toISOString(),
  pct: pct, test: q.test, downgrade: !!q.downgrade, stop: !!q.stop,
  bundle: { file: 'bundle.js', sha256: meta.sha256, bytes: meta.bytes, entries: meta.entries, minShell: meta.shell },
  rules: rules ? { file: 'rules.json', fmt: rules.fmt, sha256: q.rules.sha256 } : null, revoked: q.revoked,
};
const bodyText = JSON.stringify(body);
const sig = crypto.sign(null, Buffer.from(bodyText, 'utf8'), key).toString('base64');
const pubs = fs.readFileSync(path.join(__dirname, 'code_public.txt'), 'utf8').trim().split(/\s+/);
const pubKey = crypto.createPublicKey({ key: Buffer.concat([Buffer.from('302a300506032b6570032100', 'hex'), Buffer.from(pubs[0], 'base64')]), format: 'der', type: 'spki' });
if (!crypto.verify(null, Buffer.from(bodyText, 'utf8'), pubKey, Buffer.from(sig, 'base64'))) die('서명 자체 확인 실패 (공개키와 키가 짝이 아님)');
fs.rmSync('src', { recursive: true, force: true });
fs.writeFileSync('bundle.js', text);
if (rules) fs.writeFileSync('rules.json', rules.t);
fs.writeFileSync('index.json', JSON.stringify({ body: bodyText, sig: sig }) + '\n');
console.log('서명 완료: build ' + B + ' (' + q.ver + ') 배포 ' + pct + '%');
