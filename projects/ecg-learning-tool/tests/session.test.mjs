import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { session, restore, addDays, localDate, mountSession } from '../public/assets/session.js';
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
  let saved;
  const storage = { getItem:()=>saved, setItem:(_key,value)=>{saved=value;} };
  mountSession(document,storage,'?session=2026-11-09');
  assert.equal(get('ds-session').hidden,false);
  assert.equal(get('nc-foundation').hidden,true);
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
  const reloaded=createDocument(html);mountSession(reloaded,storage,'?session=2026-11-09');
  assert(reloaded.getElementById('ds-content').textContent.includes('Responses recorded'));
  get('ds-close').click();assert.equal(get('nc-foundation').hidden,false);
});

test('unavailable storage leaves guided recall usable and warns about persistence', async () => {
  const document=createDocument(await readFile(new URL('../public/index.html',import.meta.url),'utf8'));
  mountSession(document,undefined,'?session=2026-11-09');
  assert(document.getElementById('ds-storage').textContent.includes('unavailable'));
  assert(document.getElementById('ds-answer-0'));
});
