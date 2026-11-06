import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createDocument } from './dom-model.mjs';

test('exported app preserves all chapters, matching corrections, mixed recall, and repeated retries', async () => {
  const html = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');
  const document = createDocument(html);
  globalThis.document = document;
  try {
    await import('../public/assets/app.js');
    const root = document.getElementById('ecg-philips-quiz');
    const get = id => root.querySelector('#' + id);
    const mode = name => root.querySelectorAll('a[data-nc-mode]').find(node => node.dataset.ncMode === name).click();
    const chapter = number => get('nc-chapter').change(number);
    const matches = {
      2: { V1: 0, V2: 3, V3: 4, V4: 1, V5: 5, V6: 2 },
      3: { aVF: 1, I: 3, aVR: 0, II: 5, aVL: 4, III: 2 },
      4: { V3: 2, aVF: 0, I: 3, V1: 1, V5: 3, III: 0, V4: 2, aVL: 3, V2: 1, II: 0, V6: 3 },
    };
    const recallAnswers = { 2: [2, 0, 3, 2, 1], 3: [3, 1, 2, 0, 1], 4: [2, 0, 3, 1, 2] };
    // Fresh launches must begin at Chapter 1 → Learn → Lesson 1.
    assert.equal(get('nc-chapter').value, '1');
    assert(!get('nc-foundation').hidden);
    assert(get('nc-new-chapters').hidden);
    assert(!get('ecg-learn').hidden);
    assert(get('ecg-practice').hidden);
    assert(get('ecg-recall').hidden);
    assert(!get('ecg-lesson-0').hidden);
    assert(get('ecg-lesson-1').hidden);
    assert(get('ecg-lesson-2').hidden);
    assert.equal(get('ecg-lesson-count').textContent, 'Lesson 1 of 3');
    assert(get('ecg-prev-lesson').disabled);
    for (const number of [2, 3, 4]) {
      chapter(number);
      assert(get('nc-foundation').hidden);
      for (let index = 0; index < 3; index++) {
        get('nc-lesson-tabs').children[index].click();
        assert.equal(get('nc-lesson-position').textContent, `Lesson ${index + 1} of 3`);
        assert(get('nc-lesson-text').children.length >= 2);
        if (number === 2) assert.equal(get('nc-lesson-visual').querySelectorAll('[id]').length, 0);
        if (number === 3 && index === 0) {
          get('nc-lesson-visual').querySelector('.nc-visual-controls').children.find(node => node.textContent === 'aVR').click();
          assert(get('nc-lesson-visual').textContent.includes('aVR (-150°)'));
        }
        if (number === 3 && index === 1) {
          get('nc-lesson-visual').querySelector('.nc-visual-controls').children[2].click();
          assert(get('nc-lesson-visual').textContent.includes('biphasic'));
        }
        if (number === 4) {
          get('nc-lesson-visual').querySelector('.nc-visual-controls').children.find(node => node.textContent === 'Lateral').click();
          assert.equal(get('nc-lesson-visual').querySelectorAll('.nc-region-active').length, 4);
        }
      }
      get('nc-next').click();
      assert(!get('nc-practice').hidden);
      const total = get('nc-practice-items').children.length;
      for (let index = 0; index < total; index++) {
        const item = get('nc-practice-items').children[index].textContent;
        get('nc-practice-items').children[index].click();
        const target = matches[number][item];
        get('nc-practice-answers').children[(target + 1) % get('nc-practice-answers').children.length].click();
        assert(get('nc-practice-feedback').textContent.includes('Try that match'));
        get('nc-practice-answers').children[target].click();
        assert.equal(get('nc-practice-progress').textContent, `${index + 1} of ${total} matched`);
      }
      mode('learn'); mode('practice');
      assert.equal(get('nc-practice-progress').textContent, `${total} of ${total} matched`);
      get('nc-practice-reset').click();
      assert.equal(get('nc-practice-progress').textContent, `0 of ${total} matched`);
      assert(get('nc-practice-answers').children.every(node => node.disabled));
      mode('recall');
      for (const [round, answers] of [recallAnswers[number], recallAnswers[number].map(answer => (answer + 1) % 4)].entries()) {
        for (let index = 0; index < answers.length; index++) {
          get('nc-recall-options').children[answers[index]].click();
          if (index === 0) { mode('learn'); mode('recall'); assert(!get('nc-recall-action').disabled); }
          get('nc-recall-action').click();
          get('nc-recall-action').click();
        }
        assert.equal(get('nc-recall-title').textContent, round === 0 ? '5 / 5 correct' : '0 / 5 correct');
        assert.equal(get('nc-recall-action').textContent, 'Retry quiz');
        get('nc-recall-action').click();
        assert(get('nc-recall-action').disabled);
        assert.equal(get('nc-recall-progress').getAttribute('aria-valuenow'), '0');
      }
    }
    chapter(2); assert(!get('nc-recall').hidden);
    chapter(3); assert(!get('nc-recall').hidden);
    chapter(1); assert(!get('nc-foundation').hidden);
    const electrodeButtons = root.querySelectorAll('[data-electrode]');
    for (const name of ['V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'RA', 'LA', 'RL', 'LL']) {
      electrodeButtons.find(node => node.dataset.electrode === name).click();
      assert(get('ep-selected-label').textContent.startsWith(name + ' ·'));
      assert(get('ep-dot-' + name).classList.contains('ep-active-dot'));
    }
    root.querySelectorAll('a[data-section]').find(node => node.dataset.section === 'recall').click();
    for (const answers of [[1, 2, 3], [0, 0, 0]]) {
      for (const answer of answers) {
        get('pq-options').children[answer].click();
        get('pq-check').click(); get('pq-check').click();
      }
      assert.equal(get('pq-check').textContent, 'Retry quiz');
      get('pq-check').click(); assert(get('pq-check').disabled);
    }
  } finally { delete globalThis.document; }
});
