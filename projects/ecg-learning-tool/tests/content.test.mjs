import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chapters, freshRecall } from '../public/assets/chapters.js';
import { createDocument } from './dom-model.mjs';

test('every new chapter has three lessons and two earlier-chapter recall questions', () => {
  assert.deepEqual(Object.keys(chapters), ['2', '3', '4']);
  for (const [number, chapter] of Object.entries(chapters)) {
    assert.equal(chapter.lessons.length, 3);
    assert.equal(chapter.recall.length, 5);
    assert.equal(chapter.recall.filter(question => question.chapter < Number(number)).length, 2);
    assert(chapter.sources.every(([title, url]) => title && new URL(url).protocol === 'https:'));
  }
});

test('every recall question has four unique options and one exact correct answer', () => {
  for (const chapter of Object.values(chapters)) {
    for (const question of chapter.recall) {
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options).size, 4);
      assert.equal(question.options.filter(answer => answer === question.answer).length, 1);
      assert(question.explanation.length > 20);
    }
  }
});

test('placement, lead-angle, and conventional region answer keys stay clinically consistent', () => {
  const placement = chapters[2];
  for (const [lead, fragment] of Object.entries({ V1: 'right sternal', V2: 'left sternal', V3: 'V2 and V4', V4: 'midclavicular', V5: 'anterior axillary', V6: 'midaxillary' })) {
    assert(placement.choices[placement.matches[lead]].includes(fragment));
  }
  const angles = { I: '0°', II: '+60°', III: '+120°', aVR: '−150°', aVL: '−30°', aVF: '+90°' };
  for (const [lead, angle] of Object.entries(angles)) assert.equal(chapters[3].choices[chapters[3].matches[lead]], angle);
  const regions = { II: 'Inferior', III: 'Inferior', aVF: 'Inferior', I: 'Lateral', aVL: 'Lateral', V5: 'Lateral', V6: 'Lateral', V1: 'Septal', V2: 'Septal', V3: 'Anterior', V4: 'Anterior' };
  for (const [lead, region] of Object.entries(regions)) assert.equal(chapters[4].choices[chapters[4].matches[lead]], region);
  assert(!chapters[4].items.includes('aVR'));
});

test('matching keys cover every item and reference valid choices', () => {
  for (const chapter of Object.values(chapters)) {
    assert.equal(new Set(chapter.items).size, chapter.items.length);
    assert.deepEqual(Object.keys(chapter.matches).sort(), [...chapter.items].sort());
    for (const index of Object.values(chapter.matches)) assert(Number.isInteger(index) && index >= 0 && index < chapter.choices.length);
  }
});

test('retry state starts empty and does not share its missed-question array', () => {
  const first = freshRecall(), second = freshRecall();
  first.missed.push('previous mistake');
  assert.equal(second.score, 0);
  assert.equal(second.selected, null);
  assert.equal(second.finished, false);
  assert.deepEqual(second.missed, []);
});

test('standalone HTML has unique IDs, working fragment targets, and only local runtime assets', async () => {
  const html = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');
  const document = createDocument(html);
  const ids = document.root.querySelectorAll('[id]').map(node => node.id);
  assert.equal(ids.length, new Set(ids).size);
  for (const link of document.root.querySelectorAll('a')) {
    const href = link.getAttribute('href');
    if (href?.startsWith('#')) assert(ids.includes(href.slice(1)), href);
  }
  for (const node of [...document.root.querySelectorAll('script'), ...document.root.querySelectorAll('link')]) {
    const path = node.getAttribute('src') || node.getAttribute('href');
    assert(path.startsWith('./assets/'), path);
    await readFile(new URL('../public/' + path.slice(2), import.meta.url));
  }
  assert.equal(document.root.querySelectorAll('h1').length, 1);
  assert(!html.includes('data-lucide'));
});
