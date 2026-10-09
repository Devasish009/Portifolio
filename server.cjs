const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, 'dist');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.glb': 'model/gltf-binary' };
http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); } catch { res.writeHead(400).end(); return; }
  const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  const compressed = path.extname(file) === '.glb' && /\bgzip\b/.test(req.headers['accept-encoding'] || '') && fs.existsSync(file + '.gz');
  fs.readFile(compressed ? file + '.gz' : file, (error, data) => {
    if (error) { res.writeHead(404).end('Not found'); return; }
    const headers = { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Content-Length': data.length };
    if (path.extname(file) === '.glb') headers.Vary = 'Accept-Encoding';
    if (compressed) headers['Content-Encoding'] = 'gzip';
    res.writeHead(200, headers); res.end(data);
  });
}).listen(4173, '127.0.0.1', () => console.log('Local: http://127.0.0.1:4173'));
