import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json', '.txt':'text/plain; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp', '.ico':'image/x-icon', '.woff':'font/woff', '.woff2':'font/woff2' };

export function createStaticServer(root = path.join(projectRoot, 'out')) {
  root = path.resolve(root);
  return http.createServer((req, res) => {
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405, { Allow: 'GET, HEAD' }); res.end(); return;
    }
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
    catch { res.writeHead(400); res.end('Invalid URL'); return; }
    const target = path.resolve(root, '.' + pathname);
    if (target !== root && !target.startsWith(root + path.sep)) {
      res.writeHead(403); res.end('Forbidden'); return;
    }
    let file = target;
    try {
      if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
      if (!fs.statSync(file).isFile()) throw new Error('Not a file');
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(req.method === 'HEAD' ? undefined : fs.existsSync(path.join(root, '404.html')) ? fs.readFileSync(path.join(root, '404.html')) : 'Page not found');
      return;
    }
    const content = fs.readFileSync(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Content-Length': content.length, 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : content);
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (!fs.existsSync(path.join(projectRoot, 'out', 'index.html'))) {
    console.error('CURA build is missing. Run npm run build first, then npm start.');
    process.exit(1);
  }
  const portFlag = process.argv.findIndex(arg => arg === '--port' || arg === '-p');
  const port = Number(portFlag >= 0 ? process.argv[portFlag + 1] : process.env.PORT || 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    console.error('Choose a port from 1 to 65535.'); process.exit(1);
  }
  const server = createStaticServer();
  server.on('error', error => {
    console.error(error.code === 'EADDRINUSE' ? `Port ${port} is busy. Run: npm start -- --port ${port + 1}` : error.message);
    process.exitCode = 1;
  });
  server.listen(port, '0.0.0.0', () => console.log(`CURA is ready: http://localhost:${port}\nPress Ctrl+C to stop.`));
  process.on('SIGINT', () => server.close(() => process.exit(0)));
}
