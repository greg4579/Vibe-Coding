import { after, afterEach, before, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { startServer, projectRoot } from '../scripts/serve.mjs';

let server;
let browser;
let page;
let base;
let errors;
before(async () => {
  server = await startServer({ port: 0 });
  base = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.CHROMIUM_EXECUTABLE_PATH }
      : {}),
  });
});
beforeEach(async () => {
  errors = [];
  page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(base);
  await page.locator('.rulerow').last().waitFor();
});
afterEach(async () => {
  await page?.close();
  assert.deepEqual(errors, [], 'Browser JavaScript errors');
});
after(async () => {
  await browser?.close();
  if (server) await new Promise((resolve) => server.close(resolve));
});

test('loads the approved six-rule design', async () => {
  assert.equal(await page.locator('.rulerow').count(), 6);
  assert.equal(await page.locator('#pathTitle').inputValue(), 'Post TAVR Monitoring');
  assert.equal(await page.locator('#pr').inputValue(), '20');
  assert(await page.locator('#save').isDisabled());
  assert(await page.getByRole('button', { name: '＋ Add pathway', exact: true }).isDisabled());
});

test('saves a title without replacing rules or references; reload resets the demo', async () => {
  await page.locator('#pathTitle').fill('Renamed monitoring pathway');
  await page.locator('#save').click();
  assert.equal(
    await page.locator('#pathSelect option:checked').textContent(),
    'Renamed monitoring pathway',
  );
  assert.equal(await page.locator('#pathSelect').inputValue(), 'post_tavr_monitoring');
  assert.equal(await page.locator('.rulerow').count(), 6);
  assert.equal(await page.locator('#refCount').textContent(), '2');
  await page.reload();
  assert.equal(await page.locator('#pathTitle').inputValue(), 'Post TAVR Monitoring');
});

test('a blank title blocks save and Cancel restores saved values', async () => {
  await page.locator('#pathTitle').fill('   ');
  assert(await page.locator('#save').isDisabled());
  assert.equal(await page.locator('#titleError').textContent(), 'Enter a pathway title.');
  await page.locator('#cancel').click();
  await page.locator('#dialogYes').click();
  assert.equal(await page.locator('#pathTitle').inputValue(), 'Post TAVR Monitoring');
});

test('parent switches preserve values and control editing', async () => {
  await page.locator('#master').uncheck();
  assert(await page.locator('#pathway').isDisabled());
  assert(await page.locator('#pr').isDisabled());
  await page.locator('#master').check();
  await page.locator('#pathway').uncheck();
  assert(await page.locator('#pr').isDisabled());
  await page.locator('#pathway').check();
  assert.equal(await page.locator('#pr').inputValue(), '20');
  assert(await page.locator('#pr').isEnabled());
});

test('individual rule disablement preserves measurement values', async () => {
  await page.locator('#ruleEnabled').uncheck();
  assert(await page.locator('#pr').isDisabled());
  await page.locator('#ruleEnabled').check();
  assert.equal(await page.locator('#pr').inputValue(), '20');
});

test('threshold edits save; default restore stays pending until saved', async () => {
  await page.locator('#pr').fill('25');
  await page.locator('#save').click();
  await page.locator('#reset').click();
  await page.locator('#dialogYes').click();
  assert.equal(await page.locator('#pr').inputValue(), '20');
  assert(await page.locator('#save').isEnabled());
  await page.locator('#cancel').click();
  await page.locator('#dialogYes').click();
  assert.equal(await page.locator('#pr').inputValue(), '25');
});

test('missing measurements and empty finding lists block save', async () => {
  await page.locator('#pr').fill('');
  assert(await page.locator('#save').isDisabled());
  await page.locator('#pr').fill('20');
  while (await page.locator('[data-remove="codes"]').count()) {
    await page.locator('[data-remove="codes"]').first().click();
  }
  assert(await page.locator('#save').isDisabled());
  assert.match(await page.locator('#codeError').textContent(), /at least one/);
});

test('reason entry rejects duplicates and renders markup as plain text', async () => {
  const text = '<img src=x onerror=alert(1)>';
  await page.locator('#reasonInput').fill(text);
  await page.locator('#addReason').click();
  assert.equal(await page.locator('#editor img').count(), 0);
  assert(await page.locator('.chip').filter({ hasText: text }).isVisible());
  await page.locator('#reasonInput').fill('SYNCOPE');
  await page.locator('#addReason').click();
  assert.match(await page.locator('#reasonError').textContent(), /already selected/);
});

test('reference editing records rule links without assuming approval', async () => {
  await page.locator('#referencesTab').click();
  assert.equal(await page.locator('.refcard').count(), 2);
  await page.locator('[data-edit-reference="1"]').click();
  await page.locator('#refLocator').fill('Page 3, selected post-TAVR scenario');
  await page.locator('input[name="referenceRule"]').last().check();
  await page.getByRole('button', { name: 'Apply reference', exact: true }).click();
  assert.match(
    await page.locator('.refcard').last().textContent(),
    /New or worsening AV conduction delay/,
  );
  assert.equal(await page.locator('.reviewtag').last().textContent(), 'Not recorded');
  await page.locator('#save').click();
  await page.locator('#rulesTab').click();
  await page.locator('summary').click();
  assert.match(await page.locator('#editor dd').last().textContent(), /Decision Guide/);
});

test('new references remain pending and unsafe URL schemes are rejected', async () => {
  await page.locator('#referencesTab').click();
  await page.locator('#addReference').click();
  await page.locator('#refTitle').fill('Additional supporting source');
  await page.locator('#refUrl').fill('javascript:alert(1)');
  await page.getByRole('button', { name: 'Apply reference', exact: true }).click();
  assert.match(await page.locator('#refFormError').textContent(), /valid http or https/);
  await page.locator('#refUrl').fill('https://example.org/reference');
  await page.getByRole('button', { name: 'Apply reference', exact: true }).click();
  assert.equal(await page.locator('.refcard').count(), 3);
  assert(await page.locator('#save').isEnabled());
  await page.locator('#cancel').click();
  await page.locator('#dialogYes').click();
  assert.equal(await page.locator('.refcard').count(), 2);
});

test('reference tabs support keyboard navigation', async () => {
  await page.locator('#rulesTab').focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('#referencesTab').getAttribute('aria-selected'), 'true');
  assert(await page.locator('#referencesPanel').isVisible());
  await page.keyboard.press('Home');
  assert(await page.locator('#rulesPanel').isVisible());
});

test('the document fits a mobile viewport without page overflow', async () => {
  await page.setViewportSize({ width: 390, height: 844 });
  const fits = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
  assert(fits, 'Page extends beyond the mobile viewport');
  await page.locator('#referencesTab').click();
  assert(await page.locator('.refcard').first().isVisible());
});

test('opens directly from disk without a server or build', async () => {
  await page.goto(pathToFileURL(path.join(projectRoot, 'index.html')).href);
  await page.locator('#pr').waitFor();
  assert.equal(await page.locator('.rulerow').count(), 6);
});
