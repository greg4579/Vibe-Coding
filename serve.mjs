import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
};

/** Local preview server. Only the static application files are exposed. */
export async function startServer({ root = projectRoot, host = '127.0.0.1', port = 4173 } = {}) {
  const server = createServer(async (request, response) => {
    const reply = (status, text) => {
      response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end(request.method === 'HEAD' ? undefined : text);
    };
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.setHeader('Allow', 'GET, HEAD');
      return reply(405, 'Method not allowed');
    }
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    } catch {
      return reply(400, 'Invalid path');
    }
    if (pathname === '/') pathname = '/index.html';
    if (pathname.split(/[\\/]/).includes('..')) return reply(404, 'Not found');
    if (pathname !== '/index.html' && !pathname.startsWith('/assets/')) {
      return reply(404, 'Not found');
    }
    const target = path.resolve(root, `.${pathname}`);
    const relative = path.relative(root, target);
    if (relative.startsWith('..') || path.isAbsolute(relative) || pathname.includes('\0')) {
      return reply(404, 'Not found');
    }
    try {
      if (!(await stat(target)).isFile()) return reply(404, 'Not found');
      const bytes = await readFile(target);
      response.writeHead(200, {
        'Content-Type': mime[path.extname(target)] || 'application/octet-stream',
        'Content-Length': bytes.byteLength,
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      });
      response.end(request.method === 'HEAD' ? undefined : bytes);
    } catch (error) {
      reply(
        error.code === 'ENOENT' || error.code === 'ENOTDIR' ? 404 : 500,
        'Unable to serve file',
      );
    }
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, resolve);
  });
  return server;
}

const isMain =
  process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (isMain) {
  const value = (flag, fallback) => {
    const at = process.argv.indexOf(flag);
    return at === -1 ? fallback : process.argv[at + 1];
  };
  const port = Number(value('--port', process.env.PORT || '4173'));
  if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('Invalid port');
  const host = value('--host', '127.0.0.1');
  const root = path.resolve(projectRoot, value('--dir', '.'));
  const server = await startServer({ root, host, port });
  console.log(`HEART prototype: http://${host}:${server.address().port}`);
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, () => server.close(() => process.exit(0)));
  }
}
