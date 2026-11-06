import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const publicDirectory = fileURLToPath(new URL('../public/', import.meta.url));
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
};

export function resolveAssetPath(requestUrl, root = publicDirectory) {
  const rootPath = resolve(root);
  const pathname = decodeURIComponent(new URL(requestUrl, 'http://localhost').pathname);
  if (pathname.includes('\\') || pathname.includes('\0')) return null;
  const target = resolve(rootPath, '.' + (pathname === '/' ? '/index.html' : pathname));
  return target.startsWith(rootPath + sep) ? target : null;
}

export function createHandler(root = publicDirectory) {
  return async (request, response) => {
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' });
      response.end('Method not allowed');
      return;
    }
    let target;
    try { target = resolveAssetPath(request.url, root); }
    catch { response.writeHead(400); response.end('Bad request'); return; }
    if (!target) { response.writeHead(403); response.end('Forbidden'); return; }
    try {
      if (!(await stat(target)).isFile()) throw new Error('Not a file');
      const data = await readFile(target);
      response.writeHead(200, {
        'Content-Type': types[extname(target)] || 'application/octet-stream',
        'Content-Length': data.length,
        'Cache-Control': 'no-store',
      });
      response.end(request.method === 'HEAD' ? undefined : data);
    } catch {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
    }
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const port = Number(process.env.PORT || 8090);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be an integer from 1 to 65535.');
  const server = createServer(createHandler());
  server.on('error', error => { console.error(error.message); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`ECG Learning Tool: http://127.0.0.1:${port}`));
  process.on('SIGINT', () => server.close());
}
