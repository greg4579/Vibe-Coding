import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { startServer } from '../scripts/serve.mjs';

let server;
let base;
before(async () => {
  server = await startServer({ port: 0 });
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => new Promise((resolve) => server.close(resolve)));

test('serves the page and its three local assets', async () => {
  for (const file of [
    '/',
    '/assets/css/styles.css',
    '/assets/js/demo-data.js',
    '/assets/js/app.js',
  ]) {
    const response = await fetch(base + file);
    assert.equal(response.status, 200, file);
    assert((await response.text()).length > 0);
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  }
});

test('supports HEAD and rejects writes', async () => {
  const head = await fetch(base, { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
  assert.equal((await fetch(base, { method: 'POST' })).status, 405);
});

test('does not expose repository metadata or traverse outside static files', async () => {
  for (const name of ['/package.json', '/.git/config', '/assets/%2e%2e%2fREADME.md']) {
    assert.equal((await fetch(base + name)).status, 404, name);
  }
});
