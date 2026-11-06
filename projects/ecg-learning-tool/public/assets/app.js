import './foundations.js';
import { chapters, freshRecall } from './chapters.js';

// Chapters 2–4: navigation, visual teaching aids, practice, and recall state.
(() => {
  const root = document.getElementById('ecg-philips-quiz');
  const get = id => root.querySelector('#' + id);
  const make = (tag, text, className) => { const node = document.createElement(tag); if (text !== undefined) node.textContent = text; if (className) node.className = className; return node; };
  const state = Object.fromEntries([2,3,4].map(ch => [ch,{mode:'learn',lesson:0,placed:new Set(),active:null,message:'Choose an item to begin.',recall:freshRecall(),angle:'II',direction:'Toward',region:'Inferior'}]));
  let current = 1;
  const button = (text, className, onClick) => { const node = make('button',text,className + ' cursor-interaction'); node.type='button'; node.addEventListener('click',onClick); return node; };
  const svgNode = (tag, attrs, text) => { const node = document.createElementNS('http://www.w3.org/2000/svg',tag); Object.entries(attrs || {}).forEach(([key,value])=>node.setAttribute(key,value)); if(text!==undefined)node.textContent=text; return node; };
  const textOn = (svg,x,y,text,anchor='middle',color='#16324a') => svg.append(svgNode('text',{x,y,'text-anchor':anchor,fill:color,'font-family':'Arial,sans-serif','font-size':17},text));
  const arrowOn = (svg,x1,y1,x2,y2,color='#0066a1') => {
    svg.append(svgNode('line',{x1,y1,x2,y2,stroke:color,'stroke-width':4}));
    const angle=Math.atan2(y2-y1,x2-x1), a=angle+2.6,b=angle-2.6;
    svg.append(svgNode('path',{d:'M'+x2+' '+y2+'L'+(x2+12*Math.cos(a))+' '+(y2+12*Math.sin(a))+'L'+(x2+12*Math.cos(b))+' '+(y2+12*Math.sin(b))+'Z',fill:color}));
  };
  function placementVisual(container, lesson) {
    const svg = get('ep-chest-diagram').cloneNode(true);
    svg.removeAttribute('aria-labelledby'); svg.setAttribute('aria-label','Chest electrode positions; highlighted sites: '+lesson.highlights.join(', '));
    [svg,...svg.querySelectorAll('[id]')].forEach(node => {
      if (node.id && node.id.startsWith('ep-dot-')) node.classList.toggle('ep-active-dot',lesson.highlights.includes(node.id.slice(7)));
      node.removeAttribute('id');
    });
    container.append(svg);
    container.append(make('p','Highlighted sites use filled circles. Front view; patient’s right is your left. Schematic positions.','nc-visual-caption'));
    const legend=make('div',undefined,'nc-placement-legend'); lesson.legend.forEach(line=>legend.append(make('p',line))); container.append(legend);
  }
  function axesVisual(container) {
    const s=state[current], leads={I:0,II:60,III:120,aVR:-150,aVL:-30,aVF:90};
    const svg=svgNode('svg',{viewBox:'0 0 400 310',role:'img','aria-label':'Frontal limb lead compass; selected positive direction '+s.angle});
    svg.append(svgNode('circle',{cx:200,cy:145,r:93,fill:'#f1f8fc',stroke:'#c3d4e0','stroke-width':1}));
    Object.entries(leads).forEach(([name,angle])=>{const a=angle*Math.PI/180;svg.append(svgNode('line',{x1:200,y1:145,x2:200+95*Math.cos(a),y2:145+95*Math.sin(a),stroke:'#b1c7d7','stroke-width':1}));});
    const angle=leads[s.angle]*Math.PI/180;arrowOn(svg,200,145,200+95*Math.cos(angle),145+95*Math.sin(angle));
    svg.append(svgNode('circle',{cx:200,cy:145,r:4,fill:'#003d73'}));
    textOn(svg,340,151,'I 0°');textOn(svg,284,257,'II +60°');textOn(svg,116,257,'III +120°');textOn(svg,200,298,'aVF +90°');textOn(svg,65,80,'aVR −150°');textOn(svg,335,80,'aVL −30°');
    container.append(svg);
    const controls=make('div',undefined,'nc-visual-controls');
    Object.keys(leads).forEach(name=>{const b=button(name,'ecg-lesson-link',()=>{s.angle=name;container.replaceChildren();axesVisual(container);});b.setAttribute('aria-pressed',String(s.angle===name));controls.append(b);});
    container.append(controls,make('p','Arrow = positive direction of '+s.angle+' ('+(leads[s.angle]>0?'+':'')+leads[s.angle]+'°). Patient’s left appears on your right.','nc-visual-caption'));
  }
  function directionVisual(container) {
    const s=state[current];
    const svg=svgNode('svg',{viewBox:'0 0 400 320',role:'img','aria-label':'Simplified ventricular depolarization '+s.direction.toLowerCase()+' the positive pole and corresponding net QRS polarity'});
    textOn(svg,200,28,'Example lead: negative → positive');
    svg.append(svgNode('line',{x1:60,y1:100,x2:340,y2:100,stroke:'#a4bccd','stroke-width':1.5}));textOn(svg,43,106,'−');textOn(svg,357,106,'+');
    const end=s.direction==='Toward'?[290,100]:s.direction==='Away'?[110,100]:[200,180];arrowOn(svg,200,100,end[0],end[1]);
    textOn(svg,200,213,'Simplified QRS appearance');
    svg.append(svgNode('line',{x1:45,y1:268,x2:355,y2:268,stroke:'#a4bccd','stroke-width':1}));
    const wave=s.direction==='Toward'?'M55 268H177L194 230L207 283L223 268H345':s.direction==='Away'?'M55 268H177L194 253L207 306L223 268H345':'M55 268H177L194 244L207 292L223 268H345';
    svg.append(svgNode('path',{d:wave,fill:'none',stroke:'#0066a1','stroke-width':3}));container.append(svg);
    const controls=make('div',undefined,'nc-visual-controls');
    ['Toward','Away','Perpendicular'].forEach(name=>{const b=button(name,'ecg-lesson-link',()=>{s.direction=name;container.replaceChildren();directionVisual(container);});b.setAttribute('aria-pressed',String(s.direction===name));controls.append(b);});
    const caption={Toward:'Toward positive: positive net QRS.',Away:'Away from positive: negative net QRS.',Perpendicular:'Perpendicular: little net QRS; a balanced biphasic complex is one possible appearance.'};
    container.append(controls,make('p',caption[s.direction],'nc-visual-caption'));
  }
  const regionFor = lead => ({I:'Lateral',II:'Inferior',III:'Inferior',aVL:'Lateral',aVF:'Inferior',V1:'Septal',V2:'Septal',V3:'Anterior',V4:'Anterior',V5:'Lateral',V6:'Lateral'}[lead] || 'Separate view');
  function regionVisual(container) {
    const s=state[current], table=make('table',undefined,'nc-report');table.setAttribute('aria-label','Common 3 by 4 report layout; highlighted conventional group '+s.region);
    const body=make('tbody');
    [['I','aVR','V1','V4'],['II','aVL','V2','V5'],['III','aVF','V3','V6']].forEach(row=>{const tr=make('tr');row.forEach(lead=>{const cell=make('td',lead);if(regionFor(lead)===s.region){cell.className='nc-region-active';cell.append(make('span',s.region,'nc-region-name'));}tr.append(cell);});body.append(tr);});table.append(body);container.append(table);
    const controls=make('div',undefined,'nc-visual-controls');['Inferior','Septal','Anterior','Lateral'].forEach(name=>{const b=button(name,'ecg-lesson-link',()=>{s.region=name;container.replaceChildren();regionVisual(container);});b.setAttribute('aria-pressed',String(name===s.region));controls.append(b);});
    container.append(controls,make('p','Common report layout · traditional group labels. aVR remains a separate rightward/superior view in this exercise.','nc-visual-caption'));
  }
  function renderLearn() {
    const ch=chapters[current],s=state[current],lesson=ch.lessons[s.lesson];
    get('nc-learn-title').textContent=ch.title;get('nc-lesson-title').textContent=lesson.title;
    get('nc-lesson-tabs').replaceChildren();ch.lessons.forEach((item,i)=>{const b=button((i+1)+'. '+item.tab,'ecg-lesson-link',()=>{s.lesson=i;if(item.region)s.region=item.region;renderLearn();});b.setAttribute('aria-pressed',String(i===s.lesson));get('nc-lesson-tabs').append(b);});
    get('nc-lesson-text').replaceChildren();lesson.paragraphs.forEach(text=>get('nc-lesson-text').append(make('p',text)));
    get('nc-lesson-cue').textContent=lesson.cue;get('nc-lesson-point').textContent=lesson.point;
    get('nc-lesson-position').textContent='Lesson '+(s.lesson+1)+' of 3';get('nc-previous').disabled=s.lesson===0;get('nc-next').textContent=s.lesson===2?'Start practice':'Next lesson';
    const visual=get('nc-lesson-visual');visual.replaceChildren();
    if(lesson.visual==='placement')placementVisual(visual,lesson);else if(lesson.visual==='axes')axesVisual(visual);else if(lesson.visual==='direction')directionVisual(visual);else regionVisual(visual);
    get('nc-sources').replaceChildren();ch.sources.forEach(([title,url])=>{const link=make('a',title);link.href=url;link.target='_blank';link.rel='noopener noreferrer';get('nc-sources').append(link);});
  }
  function renderPractice() {
    const ch=chapters[current],s=state[current];get('nc-practice-title').textContent=ch.practiceTitle;get('nc-practice-intro').textContent=ch.practiceIntro;
    get('nc-practice-progress').textContent=s.placed.size+' of '+ch.items.length+' matched';get('nc-practice-selected').textContent=s.active?'Selected: '+s.active:'Choose an item';
    get('nc-practice-items').replaceChildren();
    ch.items.forEach(item=>{const b=button(item,'ecg-lead',()=>{s.active=item;s.message=item+' selected. Choose its match.';renderPractice();});b.disabled=s.placed.has(item);b.setAttribute('aria-pressed',String(item===s.active));b.setAttribute('aria-label',item+(s.placed.has(item)?', matched':''));get('nc-practice-items').append(b);});
    get('nc-practice-answers').replaceChildren();ch.choices.forEach((choice,i)=>{const b=button(choice,'nc-match',()=>{
      if(s.active===null)return;
      const item=s.active,expected=ch.matches[item];
      if(expected!==i){s.message='Review '+item+': '+ch.choices[expected]+'. Try that match.';renderPractice();return;}
      s.placed.add(item);s.active=null;s.message=s.placed.size===ch.items.length?'All pairs matched. Try Recall without the lesson, or restart practice.':item+' → '+choice+'. Choose another item.';renderPractice();
      const next=[...get('nc-practice-items').children].find(node=>!node.disabled);if(next)next.focus();else get('nc-practice-reset').focus();
    });b.disabled=s.active===null;get('nc-practice-answers').append(b);});
    get('nc-practice-feedback').textContent=s.message;
  }
  function renderRecall() {
    const ch=chapters[current],r=state[current].recall,question=ch.recall[r.index],total=ch.recall.length;
    get('nc-recall-options').replaceChildren();get('nc-recall-feedback').replaceChildren();
    const completed=r.finished?total:r.index+(r.checked?1:0);get('nc-recall-bar').style.width=(completed/total*100)+'%';get('nc-recall-progress').setAttribute('aria-valuenow',completed);
    get('nc-recall-action').disabled=false;
    if(r.finished){
      get('nc-recall-origin').textContent='Mixed recall complete';get('nc-recall-title').textContent=r.score+' / '+total+' correct';
      get('nc-recall-feedback').hidden=false;
      const report='Chapter '+current+' recall: '+r.score+'/'+total+(r.missed.length?'; revisit '+r.missed.join('; '):'; ready to continue')+'.';
      get('nc-recall-feedback').append(make('strong','Round summary'),make('span',report));get('nc-recall-status').textContent='Retry resets this round. Your learning and practice remain available.';get('nc-recall-action').textContent='Retry quiz';return;
    }
    get('nc-recall-origin').textContent=question.chapter===current?'This chapter':'Earlier chapter '+question.chapter+' · recall';get('nc-recall-title').textContent=question.text;
    question.options.forEach((option,i)=>{const b=button('', 'pq-option',()=>{if(r.checked)return;r.selected=option;renderRecall();});b.append(make('span','ABCD'[i],'pq-letter'),make('span',option));b.setAttribute('aria-pressed',String(r.selected===option));b.disabled=r.checked;if(r.checked&&option===question.answer)b.dataset.result='correct';else if(r.checked&&option===r.selected)b.dataset.result='incorrect';get('nc-recall-options').append(b);});
    get('nc-recall-action').disabled=!r.checked&&r.selected===null;get('nc-recall-action').textContent=r.checked?(r.index===total-1?'See results':'Next question'):'Check answer';
    get('nc-recall-status').textContent='Question '+(r.index+1)+' of '+total+(r.checked?' · '+r.score+' correct so far':'');
    get('nc-recall-feedback').hidden=!r.checked;if(r.checked)get('nc-recall-feedback').append(make('strong',r.selected===question.answer?'Correct':'Review this concept'),make('span',question.explanation));
  }
  function renderMode() {
    const s=state[current];get('nc-chapter-label').textContent='CHAPTER '+current+' · '+chapters[current].title.toUpperCase();get('nc-mode-label').textContent=s.mode==='learn'?'Learn · about 5–7 min per chapter':s.mode==='practice'?'Practice · guided matching':'Recall · 3 current + 2 earlier';
    ['learn','practice','recall'].forEach(mode=>get('nc-'+mode).hidden=mode!==s.mode);
    root.querySelectorAll('a[data-nc-mode]').forEach(link=>{if(link.dataset.ncMode===s.mode)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
    if(s.mode==='learn')renderLearn();else if(s.mode==='practice')renderPractice();else renderRecall();
  }
  function chooseChapter(value) {
    current=Number(value);const old=current===1;get('nc-foundation').hidden=!old;get('nc-new-chapters').hidden=old;
    get('nc-chapter').value=String(current);
    if(!old)renderMode();
  }
  get('nc-chapter').addEventListener('change',event=>chooseChapter(event.target.value));
  root.querySelectorAll('a[data-nc-mode]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();state[current].mode=link.dataset.ncMode;renderMode();}));
  get('nc-previous').addEventListener('click',()=>{const s=state[current];if(s.lesson>0)s.lesson--;const lesson=chapters[current].lessons[s.lesson];if(lesson.region)s.region=lesson.region;renderLearn();});
  get('nc-next').addEventListener('click',()=>{const s=state[current];if(s.lesson<2){s.lesson++;const lesson=chapters[current].lessons[s.lesson];if(lesson.region)s.region=lesson.region;renderLearn();}else{s.mode='practice';renderMode();}});
  get('nc-practice-reset').addEventListener('click',()=>{const s=state[current];s.placed.clear();s.active=null;s.message='Choose an item to begin.';renderPractice();get('nc-practice-items').firstElementChild.focus();});
  get('nc-recall-action').addEventListener('click',()=>{
    const s=state[current],r=s.recall,ch=chapters[current];
    if(r.finished){s.recall=freshRecall();renderRecall();get('nc-recall-options').firstElementChild.focus();return;}
    if(!r.checked){if(r.selected===null)return;r.checked=true;const question=ch.recall[r.index];if(r.selected===question.answer)r.score++;else r.missed.push('Q'+(r.index+1)+' (chapter '+question.chapter+')');}
    else if(r.index<ch.recall.length-1){r.index++;r.selected=null;r.checked=false;}else r.finished=true;
    renderRecall();
  });
  chooseChapter(1);
})();
