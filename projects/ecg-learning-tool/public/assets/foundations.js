// Chapter 1: lessons, electrode diagrams, guided sorting, and retryable recall.
(() => {
  const root = document.getElementById('ecg-philips-quiz');
  const get = id => root.querySelector('#' + id);
  const sectionNames = ['learn', 'practice', 'recall'];
  function showSection(name) {
    if (!sectionNames.includes(name)) return;
    sectionNames.forEach(section => { get('ecg-' + section).hidden = section !== name; });
    get('nc-foundation').querySelectorAll('.ecg-navigation a').forEach(link => {
      if (link.dataset.section === name) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }
  root.querySelectorAll('a[data-section]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      showSection(link.dataset.section);
    });
  });
  let lesson = 0;
  function showLesson(next) {
    lesson = next;
    for (let i = 0; i < 3; i++) get('ecg-lesson-' + i).hidden = i !== lesson;
    root.querySelectorAll('[data-lesson]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.lesson) === lesson)));
    get('ecg-prev-lesson').disabled = lesson === 0;
    get('ecg-next-lesson').textContent = lesson === 2 ? 'Start practice' : 'Next lesson';
    get('ecg-lesson-count').textContent = 'Lesson ' + (lesson + 1) + ' of 3';
  }
  root.querySelectorAll('[data-lesson]').forEach(button => button.addEventListener('click', () => showLesson(Number(button.dataset.lesson))));
  get('ecg-prev-lesson').addEventListener('click', () => { if (lesson > 0) showLesson(lesson - 1); });
  get('ecg-next-lesson').addEventListener('click', () => {
    if (lesson < 2) showLesson(lesson + 1);
    else showSection('practice');
  });
  const electrodeData = {
    V1: {group:'chest', position:'4th intercostal space, at the right border of the sternum.', tip:'An intercostal space is the gap between two ribs. V1 belongs on the patient’s right.'},
    V2: {group:'chest', position:'4th intercostal space, at the left border of the sternum.', tip:'V1 and V2 sit on opposite sides of the sternum. Identify the fourth intercostal space on each side.'},
    V3: {group:'chest', position:'Midway between the V2 and V4 electrode positions.', tip:'Locate V4 before placing V3; V3 is halfway between V2 and V4.'},
    V4: {group:'chest', position:'5th intercostal space, on the left midclavicular line.', tip:'The midclavicular line runs vertically through the midpoint of the collarbone.'},
    V5: {group:'chest', position:'Left anterior axillary line, at the same horizontal level as V4.', tip:'The anterior axillary line follows the front fold of the armpit. Keep V5 level with V4.'},
    V6: {group:'chest', position:'Left midaxillary line, at the same horizontal level as V4 and V5.', tip:'The midaxillary line runs down from the middle of the armpit. V6 is on the side of the chest.'},
    RA: {group:'limb', position:'Right forearm, between the elbow and wrist.', tip:'RA means right arm. Right and left always refer to the patient.'},
    LA: {group:'limb', position:'Left forearm, between the elbow and wrist.', tip:'LA means left arm. On a front view, it appears on your right.'},
    RL: {group:'limb', position:'Right lower leg, between the knee and ankle.', tip:'RL is the reference electrode. It does not represent a seventh limb lead.'},
    LL: {group:'limb', position:'Left lower leg, between the knee and ankle.', tip:'LL means left leg. These are standard limb sites for a diagnostic 12-lead ECG.'}
  };
  const lastElectrode = {chest:'V1', limb:'RA'};
  function selectElectrode(name) {
    const electrode = electrodeData[name];
    if (!electrode) return;
    lastElectrode[electrode.group] = name;
    for (const group of ['chest','limb']) {
      get('ep-' + group + '-view').hidden = group !== electrode.group;
      get('ep-' + group + '-tab').setAttribute('aria-pressed', String(group === electrode.group));
    }
    root.querySelectorAll('[data-electrode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.electrode === name)));
    for (const key of Object.keys(electrodeData)) get('ep-dot-' + key).classList.toggle('ep-active-dot', key === name);
    get('ep-selected-label').textContent = name + ' · ' + electrode.group + ' electrode';
    get('ep-landmark').textContent = electrode.position;
    get('ep-tip').textContent = electrode.tip;
    const chest = electrode.group === 'chest';
    get('ep-output-title').textContent = chest ? '6 chest electrodes → 6 chest leads' : '4 limb electrodes → 6 limb leads';
    get('ep-output-leads').replaceChildren();
    (chest ? ['V1','V2','V3','V4','V5','V6'] : ['I','II','III','aVR','aVL','aVF']).forEach(lead => {
      const tag = document.createElement('span'); tag.textContent = lead; get('ep-output-leads').append(tag);
    });
    get('ep-output-note').textContent = chest ? 'Horizontal plane. V4, V5, and V6 stay at the same horizontal level.' : 'Frontal plane. RA, LA, and LL provide the voltages for these views; RL is the reference electrode.';
  }
  root.querySelectorAll('[data-electrode]').forEach(button => button.addEventListener('click', () => selectElectrode(button.dataset.electrode)));
  get('ep-chest-tab').addEventListener('click', () => selectElectrode(lastElectrode.chest));
  get('ep-limb-tab').addEventListener('click', () => selectElectrode(lastElectrode.limb));
  selectElectrode('V1');
  const leadNames = ['aVL', 'V3', 'II', 'V6', 'aVR', 'V1', 'III', 'V5', 'aVF', 'V2', 'I', 'V4'];
  const placed = new Set();
  let activeLead = null;
  function renderPractice() {
    get('ecg-lead-bank').replaceChildren();
    leadNames.forEach(name => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'ecg-lead cursor-interaction';
      button.textContent = name;
      button.disabled = placed.has(name);
      button.setAttribute('aria-label', name + (placed.has(name) ? ', placed' : ''));
      button.setAttribute('aria-pressed', String(activeLead === name));
      button.addEventListener('click', () => {
        if (placed.has(name)) return;
        activeLead = name;
        [...get('ecg-lead-bank').children].forEach(b => b.setAttribute('aria-pressed', String(b.textContent === name)));
        get('ecg-target-limb').disabled = false;
        get('ecg-target-chest').disabled = false;
        get('ecg-practice-feedback').textContent = name + ' selected. Choose its family.';
      });
      get('ecg-lead-bank').append(button);
    });
    get('ecg-target-limb').disabled = activeLead === null;
    get('ecg-target-chest').disabled = activeLead === null;
    get('ecg-practice-count').textContent = placed.size + ' of 12 placed';
    get('ecg-placed').hidden = placed.size === 0;
    for (const family of ['limb', 'chest']) {
      const list = get('ecg-placed-' + family);
      list.replaceChildren();
      placed.forEach(name => {
        if ((name.startsWith('V') ? 'chest' : 'limb') === family) {
          const tag = document.createElement('span'); tag.textContent = name; list.append(tag);
        }
      });
    }
  }
  function placeLead(family) {
    if (activeLead === null || placed.has(activeLead)) return;
    const expected = activeLead.startsWith('V') ? 'chest' : 'limb';
    if (family !== expected) {
      get('ecg-practice-feedback').textContent = activeLead + ' is a ' + expected + ' lead. ' + (expected === 'limb' ? 'Limb leads view the frontal plane.' : 'Chest leads view the horizontal plane.') + ' Try the other family.';
      return;
    }
    const name = activeLead;
    placed.add(name); activeLead = null;
    renderPractice();
    get('ecg-practice-feedback').textContent = placed.size === 12 ? 'All 12 leads placed. Try Recall without the lesson, or restart this exercise.' : name + ' placed: ' + family + ' leads · ' + (family === 'limb' ? 'frontal' : 'horizontal') + ' plane. Choose another lead.';
    const next = [...get('ecg-lead-bank').children].find(button => !button.disabled);
    if (next) next.focus();
    else get('ecg-reset-practice').focus();
  }
  get('ecg-target-limb').addEventListener('click', () => placeLead('limb'));
  get('ecg-target-chest').addEventListener('click', () => placeLead('chest'));
  get('ecg-reset-practice').addEventListener('click', () => {
    placed.clear(); activeLead = null;
    renderPractice();
    get('ecg-practice-feedback').textContent = 'Select a lead to begin.';
    get('ecg-lead-bank').firstElementChild.focus();
  });
  renderPractice();
  const questions = [
    {text:'How many electrodes are used to record a standard 12-lead ECG?', options:['6 electrodes','10 electrodes','12 electrodes','14 electrodes'], correct:1, explanation:'Four limb electrodes plus six chest electrodes provide 12 electrical views. A lead is a view; an electrode is a physical contact.'},
    {text:'Which set contains all six limb leads?', options:['I, II, III, IV, aVR, aVF','V1, V2, V3, V4, V5, V6','I, II, III, aVR, aVL, aVF','I, II, aVR, aVL, V5, V6'], correct:2, explanation:'The limb leads are I, II, III, aVR, aVL, and aVF. Remember aVL: there is no standard limb lead called IV.'},
    {text:'Which plane do the chest leads V1–V6 view?', options:['The frontal plane','The sagittal plane','The same plane as the limb leads','The horizontal (transverse) plane'], correct:3, explanation:'V1–V6 view the heart in the horizontal plane. The limb leads view it in the frontal plane.'}
  ];
  let index = 0, selected = null, checked = false, score = 0, finished = false;
  const missed = [];
  function render() {
    selected = null; checked = false;
    get('pq-question').textContent = questions[index].text;
    get('pq-count').textContent = 'Question ' + (index + 1) + ' of 3';
    get('pq-progress').style.width = (index / 3 * 100) + '%';
    root.querySelector('[role="progressbar"]').setAttribute('aria-valuenow', index);
    get('pq-options').replaceChildren();
    questions[index].options.forEach((label, i) => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'pq-option cursor-interaction';
      button.setAttribute('aria-pressed', 'false');
      const letter = document.createElement('span'); letter.className = 'pq-letter'; letter.textContent = 'ABCD'[i];
      const text = document.createElement('span'); text.textContent = label;
      button.append(letter, text);
      button.addEventListener('click', () => {
        if (checked) return;
        selected = i;
        [...get('pq-options').children].forEach((b, j) => b.setAttribute('aria-pressed', String(i === j)));
        get('pq-check').disabled = false;
        get('pq-status').textContent = 'Answer selected';
      });
      get('pq-options').append(button);
    });
    get('pq-feedback').hidden = true;
    get('pq-feedback').replaceChildren();
    get('pq-check').hidden = false;
    get('pq-check').disabled = true;
    get('pq-check').textContent = 'Check answer';
    get('pq-status').textContent = 'Select one answer';
  }
  get('pq-check').addEventListener('click', () => {
    if (finished) {
      index = 0;
      score = 0;
      missed.length = 0;
      finished = false;
      render();
      get('pq-options').firstElementChild.focus();
      return;
    }
    if (!checked) {
      if (selected === null) return;
      checked = true;
      const correct = selected === questions[index].correct;
      if (correct) score++; else missed.push(index + 1);
      [...get('pq-options').children].forEach((b, j) => {
        b.disabled = true;
        if (j === questions[index].correct) b.dataset.result = 'correct';
        else if (j === selected) b.dataset.result = 'incorrect';
      });
      const verdict = document.createElement('strong'); verdict.textContent = correct ? 'Correct' : 'Review this concept';
      get('pq-feedback').replaceChildren(verdict, document.createTextNode(questions[index].explanation));
      get('pq-feedback').hidden = false;
      get('pq-status').textContent = score + ' correct so far';
      get('pq-check').textContent = index < 2 ? 'Next question' : 'See results';
    } else if (index < 2) {
      index++; render();
    } else {
      finished = true;
      get('pq-count').textContent = 'Recall complete';
      get('pq-progress').style.width = '100%';
      root.querySelector('[role="progressbar"]').setAttribute('aria-valuenow', '3');
      get('pq-question').textContent = score + ' / 3 correct';
      get('pq-options').replaceChildren();
      const title = document.createElement('strong'); title.textContent = 'Round summary';
      const report = 'Chapter 1 recall: ' + score + '/3' + (missed.length ? '; review questions ' + missed.join(', ') : '; ready to continue') + '.';
      get('pq-feedback').replaceChildren(title, document.createTextNode(report));
      get('pq-status').textContent = 'Retry the quiz or switch sections to keep reviewing.';
      get('pq-check').hidden = false;
      get('pq-check').disabled = false;
      get('pq-check').textContent = 'Retry quiz';
    }
  });
  render();
  showSection('learn');
  showLesson(0);
})();
