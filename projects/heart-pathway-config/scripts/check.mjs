import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

const root = fileURLToPath(new URL('../', import.meta.url));
const html = await readFile(path.join(root, 'index.html'), 'utf8');
for (const file of ['assets/js/demo-data.js', 'assets/js/app.js']) {
  const source = await readFile(path.join(root, file), 'utf8');
  new vm.Script(source, { filename: file });
  assert(html.includes(`./${file}`), `Missing script link: ${file}`);
}
assert(html.includes('./assets/css/styles.css'), 'Missing stylesheet');
assert(!/<script(?![^>]*src=)[^>]*>/i.test(html), 'Unexpected inline script');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(ids.length, new Set(ids).size, 'Duplicate static element IDs');
const context = { window: {} };
vm.runInNewContext(await readFile(path.join(root, 'assets/js/demo-data.js'), 'utf8'), context);
const { rules, references } = context.window.HEART_DEMO_DATA;
assert.equal(rules.length, 6);
assert.equal(references.length, 2);
assert.equal(new Set(rules.map((rule) => rule.id)).size, 6);
for (const reference of references) {
  assert.equal(new URL(reference.url).protocol, 'https:');
  assert.equal(reference.review, 'Not recorded');
}
const original = JSON.parse(
  await readFile(path.join(root, 'docs/examples/mcot_candidacy_criteria.json')),
);
for (const criterion of original.criteria) {
  const rule = rules.find((item) => item.id === criterion.id);
  assert(rule, `Missing original rule ${criterion.id}`);
  assert.equal(JSON.stringify(rule.codes), JSON.stringify(criterion.dxl_statement_codes));
  assert.equal(JSON.stringify(rule.reasons), JSON.stringify(criterion.candidate_reasons));
  assert.equal(rule.monitor, criterion.recommended_monitoring);
}
console.log(
  'Static files, script syntax, reference metadata, and original rule mappings verified.',
);
