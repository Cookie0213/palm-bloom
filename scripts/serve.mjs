// Local preview server. Uses Node built-ins only; never exposes the source tree.
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat, realpath } from 'node:fs/promises';
import { resolve, relative, sep, extname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const defaultRoot = fileURLToPath(new URL('../dist/', import.meta.url));
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8',
  '.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8',
  '.json':'application/json; charset=utf-8','.webp':'image/webp','.png':'image/png',
  '.jpg':'image/jpeg','.svg':'image/svg+xml','.mp4':'video/mp4','.wasm':'application/wasm',
  '.bin':'application/octet-stream','.task':'application/octet-stream'};
const outside = (root, candidate) => {
  const r = relative(root, candidate);
  return r === '..' || r.startsWith('..' + sep) || resolve(root, r) !== candidate;
};

export function createLocalServer({ root = defaultRoot } = {}) {
  root = resolve(root);
  return createServer(async (req, res) => {
    const fail = (status, message, headers = {}) => {
      res.writeHead(status, {'Content-Type':'text/plain; charset=utf-8', ...headers});
      res.end(req.method === 'HEAD' ? undefined : message);
    };
    if (!['GET', 'HEAD'].includes(req.method)) return fail(405, 'Method not allowed', {Allow:'GET, HEAD'});
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
    catch { return fail(400, 'Invalid URL'); }
    if (pathname.includes('\0') || pathname.includes('\\')) return fail(400, 'Invalid path');
    let target = resolve(root, '.' + pathname);
    if (outside(root, target)) return fail(403, 'Forbidden');
    try {
      let info = await stat(target);
      if (info.isDirectory()) { target = resolve(target, 'index.html'); info = await stat(target); }
      const [actualRoot, actualTarget] = await Promise.all([realpath(root), realpath(target)]);
      if (!info.isFile() || outside(actualRoot, actualTarget)) return fail(403, 'Forbidden');
      let start = 0, end = info.size - 1, status = 200;
      const headers = {'Content-Type':mime[extname(target)] || 'application/octet-stream',
        'Accept-Ranges':'bytes', 'Cache-Control':'no-cache', 'X-Content-Type-Options':'nosniff'};
      if (req.headers.range) {
        const m = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
        const invalid = () => fail(416, 'Invalid range', {'Content-Range':`bytes */${info.size}`});
        if (!m || (!m[1] && !m[2]) || !info.size) return invalid();
        if (!m[1]) {
          const suffix = Number(m[2]);
          if (!Number.isSafeInteger(suffix) || suffix <= 0) return invalid();
          start = Math.max(0, info.size - suffix);
        } else {
          start = Number(m[1]);
          end = m[2] ? Math.min(Number(m[2]), info.size - 1) : end;
        }
        if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start > end) return invalid();
        status = 206; headers['Content-Range'] = `bytes ${start}-${end}/${info.size}`;
      }
      headers['Content-Length'] = Math.max(0, end - start + 1);
      res.writeHead(status, headers);
      if (req.method === 'HEAD' || !info.size) return res.end();
      const stream = createReadStream(actualTarget, {start, end});
      stream.on('error', () => res.destroy());
      res.on('close', () => stream.destroy());
      stream.pipe(res);
    } catch (error) {
      fail(error.code === 'ENOENT' || error.code === 'ENOTDIR' ? 404 : 500, 'File unavailable');
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const port = Number(process.argv[2] || 8080);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    console.error('Port must be an integer between 1 and 65535.'); process.exit(1);
  }
  const server = createLocalServer();
  server.on('error', error => {
    console.error(error.code === 'EADDRINUSE'
      ? `Port ${port} is in use. Try: node scripts/serve.mjs ${port + 1}` : error.message);
    process.exitCode = 1;
  });
  server.listen(port, '127.0.0.1', () => {
    console.log(`Palm Bloom: http://localhost:${port}\nKeep this window open. Stop with Ctrl+C.`);
  });
}
