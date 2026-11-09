// Dated sessions are curated content. Written answers are self-assessed, never AI-graded.
export const session = {
  id: '2026-11-09',
  questions: [
    ['Chapter 1 · delayed recall', 'Name all six limb leads and their viewing plane. Then name the chest leads and their viewing plane.', 'I, II, III, aVR, aVL, aVF: frontal plane. V1–V6: horizontal (transverse) plane. There is no standard limb lead IV. These planes describe electrical perspectives, not electrode counts.'],
    ['Chapter 1 · mental model', 'How can 10 electrodes produce 12 leads? Explain the difference between an electrode and a lead.', 'An electrode is a skin sensor. A lead records a defined voltage difference, giving an electrical perspective. Four limb electrodes and six chest electrodes support six limb leads and six chest leads; the electrodes are shared in forming voltage differences.'],
    ['Chapter 2 · placement recall', 'From memory, describe the standard positions of V1 and V2. Include the intercostal space, sternal border, and whose right and left you mean.', 'V1: fourth intercostal space at the patient’s right sternal border. V2: fourth intercostal space at the patient’s left sternal border. Intercostal spaces are gaps between ribs.'],
    ['Chapter 2 · hypothetical application', 'V1 was recorded at the correct height but on the patient’s left sternal border. A colleague proposes moving the V1 waveform to the other side of the screen. Explain why that does not correct the recording and what must change.', 'Screen position does not change the voltage already recorded. The V1 electrode belongs at the fourth intercostal space at the patient’s right sternal border; correct the physical placement and acquire a new recording. Placement can change waveforms, so a difference alone cannot establish a new cardiac abnormality.'],
  ],
};
export const localDate = (now = new Date()) => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year:'numeric', month:'2-digit', day:'2-digit' }).format(now);
export function addDays(day, amount) {
  const date = new Date(day + 'T12:00:00Z');
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0,10);
}
export function restore(raw) {
  const blank = { stage: 0, answers: ['', '', '', ''], ratings: ['', '', '', ''], teachbacks: ['', '', '', ''], completedOn: null };
  try {
    const data = JSON.parse(raw);
    if (!data || ![0,1,2,3].includes(data.stage)) return blank;
    for (const key of ['answers','ratings','teachbacks']) {
      if (!Array.isArray(data[key]) || data[key].length !== 4 || !data[key].every(value => typeof value === 'string')) return blank;
    }
    if (!data.ratings.every(value => ['', 'unprompted', 'prompted', 'missed'].includes(value))) return blank;
    if (data.stage > 0 && data.answers.slice(0,2).some(value => !value.trim())) return blank;
    if (data.stage > 1 && data.answers.some(value => !value.trim())) return blank;
    if (data.stage === 3 && (data.ratings.some(value => !value) || data.ratings.some((value,i) => value !== 'unprompted' && !data.teachbacks[i].trim()) || !/^\d{4}-\d{2}-\d{2}$/.test(data.completedOn))) return blank;
    return data;
  } catch { return blank; }
}
export function mountSession(document, storage, search = '') {
  const get = id => document.getElementById(id);
  const container = get('ds-content');
  const key = 'ecg-guided-session-' + session.id;
  let data = restore(null), saved = true;
  try { data = restore(storage.getItem(key)); } catch { saved = false; }
  const make = (tag, text, className) => { const node = document.createElement(tag); if (text !== undefined) node.textContent = text; if(className) node.className = className; return node; };
  const save = () => {
    try { storage.setItem(key, JSON.stringify(data)); saved = true; } catch { saved = false; }
    get('ds-storage').textContent = saved ? 'Responses saved in this browser only. They do not sync with ChatGPT or other devices. Self-assessment is not verified grading.' : 'Browser storage is unavailable. Responses remain on this page only; copy them before leaving. Self-assessment is not verified grading.';
  };
  const button = (label, action) => { const node = make('button',label,'pq-primary cursor-interaction'); node.type='button'; node.addEventListener('click',action); return node; };
  const sources = () => {
    const p = make('p','References · ');
    for (const [label,url] of [['LITFL: lead positioning','https://litfl.com/ecg-lead-positioning/'], ['LITFL: V1/V2 misplacement','https://litfl.com/misplacement-of-v1-and-v2/']]) {
      const a = make('a',label); a.href=url; a.target='_blank'; a.rel='noopener noreferrer'; p.append(a,make('span',' · '));
    }
    container.append(p,make('p','Clinical content confidence: high. Current retention: unknown. No chapter is marked retained from this session.'));
  };
  function render() {
    container.replaceChildren();
    if(data.stage === 3) {
      container.append(make('h3','Responses recorded · '+data.completedOn),make('p','Current chapter: 2 — Electrode placement. Chapter 1 — Electrodes, leads, and viewing planes remains in review.'));
      const strengths = data.ratings.map((value,i) => value === 'unprompted' ? 'Q'+(i+1) : '').filter(Boolean);
      const revisit = data.ratings.map((value,i) => value !== 'unprompted' ? 'Q'+(i+1) : '').filter(Boolean);
      container.append(make('p','Self-reported unprompted recall: '+(strengths.join(', ') || 'none')+'. These are not independently graded strengths.'));
      container.append(make('p','Needs recall: '+(revisit.join(', ') || 'all concepts still need a separate-day check')+'.'));
      if(revisit.length) container.append(make('p','Recheck missed/prompted concepts next session (target '+addDays(data.completedOn,1)+'), then around '+addDays(data.completedOn,3)+' and '+addDays(data.completedOn,7)+'.'));
      container.append(make('p','Chapter targets from introduction: Chapter 1 (Nov 6): Nov 7, 9, 13, 20, Dec 6; Chapter 2 (Nov 7): Nov 8, 10, 14, 21, Dec 7. Monthly maintenance follows. These are targets, not evidence that reviews occurred.'));
      container.append(make('p','Two correct unprompted recalls on separate days are needed before retention can be established; keep reviewing afterward. Course day 7, November 12, is cumulative recall without new teaching.'));
      container.append(button('Review my responses',()=>{data.stage=2;save();render();})); sources(); return;
    }
    const reviewing = data.stage === 2;
    container.append(make('h3',reviewing ? 'Compare and explain · self-assessment' : data.stage === 0 ? '1 · Retrieve first — about 2 minutes' : '2 · Apply placement — about 3 minutes'));
    if(data.stage === 0) container.append(make('p','Answer without opening the chapters. If you need help, write “unsure” before continuing; record that as prompted or missed during comparison. No prior chat answers or quiz scores have been imported.'));
    if(data.stage === 1) {
      container.append(make('p','Reproducible placement needs an anatomical level, a landmark, and the patient’s side. A lead label states the intended view; it does not prove where the electrode was placed. Screen layout and physical placement are different things.'));
      container.append(make('p','Moving an electrode changes the measurement. A waveform difference can reflect placement or a cardiac change, and both can coexist. Read this once, then answer from memory.'));
    }
    const next = button(reviewing ? 'Save session summary' : data.stage === 0 ? 'Save recall · continue' : 'Save application · compare answers',()=>{
      data.stage++; if(data.stage===3) data.completedOn=localDate(); save();render();get('ds-title').focus();
    });
    const valid = () => reviewing ? data.ratings.every((value,i) => value && (value === 'unprompted' || data.teachbacks[i].trim())) : data.answers.slice(data.stage === 0 ? 0 : 2, data.stage === 0 ? 2 : 4).every(value => value.trim());
    const update = () => { next.disabled = !valid(); save(); };
    const indices = reviewing ? [0,1,2,3] : data.stage===0 ? [0,1] : [2,3];
    for(const i of indices) {
      const [origin,prompt,answer] = session.questions[i];
      const card = make('article',undefined,'ds-question');
      card.append(make('p',origin,'ecg-note'));
      const label=make('label',(i+1)+'. '+prompt);label.setAttribute('for','ds-answer-'+i);
      const input=make('textarea');input.id='ds-answer-'+i;input.value=data.answers[i];input.readOnly=reviewing;
      input.addEventListener('input',()=>{data.answers[i]=input.value;update();});card.append(label,input);
      if(reviewing) {
        card.append(make('p','Answer and reasoning: '+answer));
        const ratingLabel=make('label','How did you retrieve this?');ratingLabel.setAttribute('for','ds-rating-'+i);
        const rating=make('select');rating.id='ds-rating-'+i;
        for(const [value,text] of [['','Choose an assessment'],['unprompted','Correct without help'],['prompted','Needed a prompt or looked back'],['missed','Incorrect or unsure']]) { const option=make('option',text);option.value=value;rating.append(option); }
        rating.value=data.ratings[i];
        const teachLabel=make('label','Teach it back: briefly explain the corrected concept in your own words.');teachLabel.setAttribute('for','ds-teachback-'+i);
        const teach=make('textarea');teach.id='ds-teachback-'+i;teach.value=data.teachbacks[i];
        const needsTeachback=()=>{teachLabel.hidden=teach.hidden=!data.ratings[i] || data.ratings[i]==='unprompted';};needsTeachback();
        rating.addEventListener('change',()=>{data.ratings[i]=rating.value;needsTeachback();update();});teach.addEventListener('input',()=>{data.teachbacks[i]=teach.value;update();});card.append(ratingLabel,rating,teachLabel,teach);
      }
      container.append(card);
    }
    next.disabled=!valid();container.append(next);
    if(data.stage>0)sources();
  }
  const bar = get('ecg-philips-quiz').querySelector('.nc-chapter-bar');
  let previous = [];
  const open = () => {
    if(!get('ds-session').hidden)return;
    previous = ['nc-foundation','nc-new-chapters'].map(id=>[id,get(id).hidden]);
    for(const [id] of previous)get(id).hidden=true;
    bar.hidden=true;get('ds-session').hidden=false;render();save();get('ds-title').focus();
  };
  get('ds-open').addEventListener('click',open);
  get('ds-close').addEventListener('click',()=>{get('ds-session').hidden=true;bar.hidden=false;for(const [id,hidden] of previous)get(id).hidden=hidden;get('ds-open').focus();});
  if(new URLSearchParams(search).get('session')===session.id)open();
}
if(typeof document !== 'undefined') {
  let storage;try { storage=globalThis.localStorage; } catch { /* fall back to page-only state */ }
  mountSession(document,storage,globalThis.location?.search || '');
}
