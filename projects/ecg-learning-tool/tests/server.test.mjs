import test from 'node:test';
import assert from 'node:assert/strict';
import { createHandler, resolveAssetPath, publicDirectory } from '../scripts/serve.mjs';

async function request(url, method = 'GET') {
  const result = {};
  const response = {
    writeHead(status, headers) { result.status = status; result.headers = headers; },
    end(body) { result.body = body; },
  };
  await createHandler()({ url, method }, response);
  return result;
}

test('local server serves the page and each browser module with usable types', async () => {
  for (const [path, type] of [['/', 'text/html'], ['/assets/styles.css', 'text/css'], ['/assets/app.js', 'text/javascript'], ['/assets/foundations.js', 'text/javascript'], ['/assets/chapters.js', 'text/javascript']]) {
    const result = await request(path);
    assert.equal(result.status, 200);
    assert(result.headers['Content-Type'].startsWith(type));
    assert(result.body.length > 100);
  }
});

test('missing paths and unsupported methods return explicit responses', async () => {
  assert.equal((await request('/missing')).status, 404);
  assert.equal((await request('/assets/')).status, 404);
  assert.equal((await request('/', 'POST')).status, 405);
});

test('HEAD omits its response body and malformed paths fail predictably', async () => {
  const head = await request('/', 'HEAD');
  assert.equal(head.status, 200);
  assert.equal(head.body, undefined);
  assert.equal((await request('/%ZZ')).status, 400);
});

test('encoded parent paths cannot resolve outside public/', () => {
  assert.equal(resolveAssetPath('/%2f..%2fpackage.json'), null);
  assert.equal(resolveAssetPath('/%5c..%5cpackage.json'), null);
  assert.equal(resolveAssetPath('/%00'), null);
  assert(resolveAssetPath('/').startsWith(publicDirectory));
});
