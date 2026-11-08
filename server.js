// Máy chủ lưu dữ liệu tiệm giặt – không cần cài thêm thư viện, chỉ cần Node.js 18+
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os');
const PORT = process.env.PORT || 3000;
const PIN = process.env.APP_PIN || '';
const DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const FILE = path.join(DIR, 'db.json');
fs.mkdirSync(DIR, { recursive: true });

let db = { rev: 0, data: null };
try { db = JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch (e) {}

function persist() {
  const tmp = FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(db));
  fs.renameSync(tmp, FILE); // ghi nguyên tử, không mất dữ liệu nếu mất điện giữa chừng
  const bk = path.join(DIR, 'backup-' + new Date().toISOString().slice(0, 10) + '.json');
  let old = true;
  try { old = Date.now() - fs.statSync(bk).mtimeMs > 3600e3; } catch (e) {}
  if (old) fs.copyFileSync(FILE, bk); // bản sao lưu theo ngày, cập nhật tối đa 1 lần/giờ
  fs.readdirSync(DIR).filter(f => f.startsWith('backup-')).sort().slice(0, -30)
    .forEach(f => fs.unlinkSync(path.join(DIR, f))); // giữ 30 bản gần nhất
}

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.json': 'application/json', '.webmanifest': 'application/manifest+json' };
const send = (res, code, body, type = 'application/json') => { res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store' }); res.end(body); };

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/api/data') {
    if (PIN && req.headers['x-pin'] !== PIN) return send(res, 401, '{"error":"PIN sai"}');
    if (req.method === 'GET') return send(res, 200, JSON.stringify(db));
    if (req.method === 'PUT') {
      let n = 0; const chunks = [];
      req.on('data', c => { n += c.length; if (n > 50e6) req.destroy(); else chunks.push(c); });
      req.on('end', () => {
        try {
          const d = JSON.parse(Buffer.concat(chunks).toString());
          if (!d || !Array.isArray(d.orders) || !d.cfg) throw new Error('bad');
          db = { rev: db.rev + 1, data: d };
          persist();
          send(res, 200, JSON.stringify({ rev: db.rev }));
        } catch (e) { send(res, 400, '{"error":"Dữ liệu không hợp lệ"}'); }
      });
      return;
    }
    return send(res, 405, '{}');
  }
  let p = url.pathname === '/' ? '/index.html' : url.pathname;
  const f = path.join(__dirname, 'public', path.normalize(p).replace(/^(\.\.[\/\\])+/, ''));
  if (!f.startsWith(path.join(__dirname, 'public'))) return send(res, 403, 'Forbidden', 'text/plain');
  fs.readFile(f, (e, buf) => e ? send(res, 404, 'Not found', 'text/plain') : send(res, 200, buf, MIME[path.extname(f)] || 'application/octet-stream'));
}).listen(PORT, '0.0.0.0', () => {
  console.log('Tiệm giặt đang chạy:');
  console.log('  Trên máy này:   http://localhost:' + PORT);
  Object.values(os.networkInterfaces()).flat().filter(i => i.family === 'IPv4' && !i.internal)
    .forEach(i => console.log('  iPhone/máy khác cùng Wi-Fi: http://' + i.address + ':' + PORT));
  console.log(PIN ? '  Đã bật mã PIN.' : '  CHƯA đặt PIN (đặt biến APP_PIN để bảo vệ dữ liệu).');
  console.log('  Dữ liệu lưu tại: ' + DIR);
});
