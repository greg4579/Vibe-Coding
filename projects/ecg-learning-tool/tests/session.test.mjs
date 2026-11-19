import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { session, sessions, restore, addDays, localDate, mountSession } from '../public/assets/session.js';
import { createDocument } from './dom-model.mjs';

test('session dates use New York and review offsets cross months', () => {
  assert.equal(localDate(new Date('2026-11-10T02:00:00Z')), '2026-11-09');
  assert.equal(addDays('2026-11-29', 7), '2026-12-06');
  assert.equal(session.questions.length, 4);
});

test('invalid or incomplete saved state cannot bypass closed-book recall', () => {
  for (const raw of ['bad JSON', 'null', JSON.stringify({ stage:2 }), JSON.stringify({ stage:3, answers:['a','b','c','d'], ratings:['','','',''], teachbacks:['','','',''] })]) assert.equal(restore(raw).stage, 0);
});

test('guided session withholds answers, requires attempts and teach-back, saves and restores', async () => {
  const html = await readFile(new URL('../public/index.html',import.meta.url),'utf8');
  const document = createDocument(html);
  const get = id => document.getElementById(id);
  const session = sessions['2026-11-10'];
  let saved;
  const storage = { getItem:()=>saved, setItem:(_key,value)=>{saved=value;} };
  mountSession(document,storage,'?session=2026-11-10');
  assert.equal(get('ds-session').hidden,false);
  assert.equal(get('ecg-chapters-panel').hidden, true);
  assert.equal(get('ecg-guided-tab').getAttribute('aria-selected'), 'true');
  assert(!get('ds-content').textContent.includes(session.questions[0][2]));
  const next = () => get('ds-content').querySelector('button');
  const answer = i => { const input=get('ds-answer-'+i); input.value='Attempt '+i; for(const handler of input.events.input)handler(); };
  assert(next().disabled);answer(0);assert(next().disabled);answer(1);next().click();
  assert(get('ds-answer-2'));assert(!get('ds-content').textContent.includes(session.questions[2][2]));
  answer(2);answer(3);next().click();
  assert(get('ds-content').textContent.includes(session.questions[0][2]));
  for(let i=0;i<4;i++)get('ds-rating-'+i).change(i===0?'missed':'unprompted');
  assert(next().disabled);
  const teach=get('ds-teachback-0');assert.equal(teach.hidden,false);teach.value='Corrected concept in my own words.';for(const handler of teach.events.input)handler();
  assert.equal(next().disabled,false);next().click();
  assert(get('ds-content').textContent.includes('Current retention: unknown'));
  assert(get('ds-content').textContent.includes('Recheck missed/prompted concepts'));
  assert.equal(restore(saved).stage,3);
  assert.match(get('ds-content').querySelector('textarea').value, /1\. Attempt 0 \[missed\]/);
  const reloaded=createDocument(html);mountSession(reloaded,storage,'?session=2026-11-10');
  assert(reloaded.getElementById('ds-content').textContent.includes('Responses recorded'));
  get('ds-close').click();
  assert.equal(get('ds-session').hidden, true);
  assert.equal(get('ds-chooser').hidden, false);
  assert.equal(get('ds-picker').focused, true);
  assert.equal(get('ecg-chapters-panel').hidden, true);
  get('ecg-chapters-tab').click();
  assert.equal(get('ecg-chapters-panel').hidden, false);
  assert.equal(get('nc-foundation').hidden, false);
});

test('unavailable storage leaves guided recall usable and warns about persistence', async () => {
  const document=createDocument(await readFile(new URL('../public/index.html',import.meta.url),'utf8'));
  mountSession(document,undefined,'?session=2026-11-10');
  assert(document.getElementById('ds-storage').textContent.includes('unavailable'));
  assert(document.getElementById('ds-answer-0'));
});



test('dated sessions preserve independent storage and old deep links', async () => {
  const html = await readFile(new URL('../public/index.html',import.meta.url),'utf8');
  const keys=[];
  const storage={getItem:key=>{keys.push(key);return null;},setItem:()=>{}};
  const old=createDocument(html);mountSession(old,storage,'?session=2026-11-09');
  const current=createDocument(html);mountSession(current,storage,'?session=2026-11-10');
  assert.deepEqual(keys,['ecg-guided-session-2026-11-09','ecg-guided-session-2026-11-10']);
  assert(old.getElementById('ds-day').textContent.includes('November 9'));
  assert(current.getElementById('ds-day').textContent.includes('November 10'));
  assert(current.getElementById('ds-content').textContent.includes('three-day recall'));
});

test('the picker opens all 11 sessions and keeps cumulative recall closed book', async () => {
  const html = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');
  const document = createDocument(html);
  const get = id => document.getElementById(id);
  mountSession(document, undefined, '?session=constructor');
  assert.equal(get('ds-session').hidden, true);
  assert.equal(get('nc-foundation').hidden, false);
  assert.equal(get('ecg-guided-panel').hidden, true);
  const chapterTab = get('ecg-chapters-tab');
  const practiceTab = get('ecg-guided-tab');
  chapterTab.events.keydown[0]({ key: 'ArrowRight', preventDefault() {} });
  assert.equal(get('ecg-guided-panel').hidden, false);
  assert.equal(practiceTab.getAttribute('aria-selected'), 'true');
  assert.equal(chapterTab.getAttribute('tabindex'), '-1');
  assert.equal(practiceTab.focused, true);
  const picker = get('ds-picker');
  assert.equal(picker.value, '2026-11-19');
  assert.deepEqual(picker.children.map(option => option.value),
    Array.from({ length: 11 }, (_, index) => '2026-11-' + String(19 - index).padStart(2, '0')));
  const open = date => {
    get('ds-close').click();
    picker.change(date);
    get('ds-open').click();
  };
  for (const option of picker.children) {
    open(option.value);
    assert(get('ds-content').textContent.includes(sessions[option.value].questions[0][1]));
  }
  for (const day of ['2026-11-12', '2026-11-19']) {
    open(day);
    for (const index of [0, 1]) {
      const answer = get('ds-answer-' + index);
      answer.value = 'My answer for ' + day;
      for (const handler of answer.events.input) handler();
    }
    get('ds-content').querySelector('button').click();
    const body = get('ds-content').textContent;
    assert(body.includes('Continue from memory'));
    assert(!body.includes('References'));
    for (const [, , answer] of sessions[day].questions) assert(!body.includes(answer));
  }
  chapterTab.click();
  assert.equal(get('ecg-guided-panel').hidden, true);
  practiceTab.click();
  assert(get('ds-answer-2'));
  open('2026-11-12');
  assert(get('ds-answer-2'));
  open('2026-11-18');
  assert.equal(get('ds-answer-0').value, '');
});
