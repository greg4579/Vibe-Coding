import { afterEach, beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM, VirtualConsole } from 'jsdom';

const root = new URL('../', import.meta.url);
const html = await readFile(new URL('index.html', root), 'utf8');
const data = await readFile(new URL('assets/js/demo-data.js', root), 'utf8');
const app = await readFile(new URL('assets/js/app.js', root), 'utf8');
let dom;
let errors;
const $ = (id) => dom.window.document.getElementById(id);
const all = (selector) => [...dom.window.document.querySelectorAll(selector)];
const input = (id, value) => {
  $(id).value = value;
  $(id).dispatchEvent(new dom.window.Event('input', { bubbles: true }));
};
const toggle = (id, value) => {
  $(id).checked = value;
  $(id).dispatchEvent(new dom.window.Event('change', { bubbles: true }));
};
const applyReference = () => {
  $('referenceForm').dispatchEvent(
    new dom.window.Event('submit', { bubbles: true, cancelable: true }),
  );
};

beforeEach(() => {
  errors = [];
  const console = new VirtualConsole();
  console.on('jsdomError', (error) => errors.push(error.message));
  dom = new JSDOM(html, {
    url: 'http://localhost/',
    runScripts: 'outside-only',
    virtualConsole: console,
  });
  // jsdom models DOM events, not browser layout or native dialog presentation.
  dom.window.HTMLDialogElement.prototype.showModal = function () {
    this.open = true;
  };
  dom.window.HTMLDialogElement.prototype.close = function () {
    this.open = false;
  };
  dom.window.eval(data);
  dom.window.eval(app);
});
afterEach(() => {
  dom.window.close();
  assert.deepEqual(errors, []);
});

test('initial state presents the six rules and two references', () => {
  assert.equal(all('.rulerow').length, 6);
  assert.equal($('refCount').textContent, '2');
  assert.equal($('pr').value, '20');
  assert($('save').disabled);
});

test('saving an edited title retains stable identity and linked content', () => {
  input('pathTitle', 'Updated monitoring title');
  assert(!$('save').disabled);
  $('save').click();
  assert.equal($('pathSelect').selectedOptions[0].textContent, 'Updated monitoring title');
  assert.equal($('pathSelect').value, 'post_tavr_monitoring');
  assert.equal(all('.rulerow').length, 6);
  assert.equal(all('.refcard').length, 2);
  assert($('save').disabled);
});

test('empty title validation and Cancel restore the saved title', () => {
  input('pathTitle', '  ');
  assert($('save').disabled);
  assert.equal($('titleError').textContent, 'Enter a pathway title.');
  $('cancel').click();
  $('dialogYes').click();
  assert.equal($('pathTitle').value, 'Post TAVR Monitoring');
});

test('parent and individual switches preserve disabled settings', () => {
  toggle('master', false);
  assert($('pathway').disabled);
  assert($('pr').closest('fieldset').disabled);
  toggle('master', true);
  toggle('pathway', false);
  assert($('pr').closest('fieldset').disabled);
  toggle('pathway', true);
  toggle('ruleEnabled', false);
  assert($('pr').closest('fieldset').disabled);
  toggle('ruleEnabled', true);
  assert.equal($('pr').value, '20');
});

test('threshold restoration affects draft only until saved', () => {
  input('pr', '25');
  $('save').click();
  $('reset').click();
  $('dialogYes').click();
  assert.equal($('pr').value, '20');
  $('cancel').click();
  $('dialogYes').click();
  assert.equal($('pr').value, '25');
});

test('empty enabled measurement and finding lists block save', () => {
  input('pr', '');
  assert($('save').disabled);
  input('pr', '20');
  while (all('[data-remove="codes"]').length) all('[data-remove="codes"]')[0].click();
  assert($('save').disabled);
  assert.match($('codeError').textContent, /at least one/);
});

test('reason editing rejects duplicates and escapes user markup', () => {
  input('reasonInput', 'SYNCOPE');
  $('addReason').click();
  assert.match($('reasonError').textContent, /already selected/);
  input('reasonInput', '<img src=x onerror=alert(1)>');
  $('addReason').click();
  assert.equal(all('#editor img').length, 0);
  assert.match($('editor').textContent, /<img src=x onerror=alert\(1\)>/);
});

test('reference rule associations appear without establishing review', () => {
  $('referencesTab').click();
  all('[data-edit-reference]')[1].click();
  input('refLocator', 'Page 3, selected scenario');
  all('input[name="referenceRule"]').at(-1).checked = true;
  applyReference();
  assert.match(all('.refcard')[1].textContent, /New or worsening AV conduction delay/);
  assert.equal(all('.reviewtag')[1].textContent, 'Not recorded');
  $('save').click();
  $('rulesTab').click();
  assert.match(all('#editor dd').at(-1).textContent, /Decision Guide/);
});

test('reference validation rejects script URLs; new references stay pending', () => {
  $('referencesTab').click();
  $('addReference').click();
  input('refTitle', 'New source');
  input('refUrl', 'javascript:alert(1)');
  applyReference();
  assert.match($('refFormError').textContent, /valid http or https/);
  assert.equal(all('.refcard').length, 2);
  input('refUrl', 'https://example.org/reference');
  applyReference();
  assert.equal(all('.refcard').length, 3);
  assert(!$('save').disabled);
  $('cancel').click();
  $('dialogYes').click();
  assert.equal(all('.refcard').length, 2);
});

test('keyboard tab navigation updates selected panel state', () => {
  $('rulesTab').dispatchEvent(
    new dom.window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
  );
  assert.equal($('referencesTab').getAttribute('aria-selected'), 'true');
  assert(!$('referencesPanel').hidden);
  $('referencesTab').dispatchEvent(
    new dom.window.KeyboardEvent('keydown', { key: 'Home', bubbles: true }),
  );
  assert(!$('rulesPanel').hidden);
});
