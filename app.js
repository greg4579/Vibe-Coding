/** Browser-only configuration prototype. Saved values last until reload. */
(() => {
  'use strict';
  const { rules: seed, references: referenceSeed } = window.HEART_DEMO_DATA;
  const clone = (x) => JSON.parse(JSON.stringify(x)),
    esc = (x) =>
      String(x ?? '').replace(
        /[&<>"']/g,
        (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
      );
  const priorities = {
      highest: 'Highest',
      highest_specificity_context: 'Highest · specific context',
      strong: 'Strong',
    },
    ranks = { highest: 1, highest_specificity_context: 2, strong: 3 };
  const dictionary = [...new Set(seed.flatMap((r) => r.codes))].sort();

  let saved = {
      master: true,
      pathway: true,
      pathwayId: 'post_tavr_monitoring',
      title: 'Post TAVR Monitoring',
      references: clone(referenceSeed),
      rules: clone(seed),
    },
    draft = clone(saved),
    selected = 5,
    confirmAction = null,
    revision = 1,
    activeTab = 'rules',
    editingReference = null;
  const $ = (id) => document.getElementById(id),
    dirty = () => JSON.stringify(draft) !== JSON.stringify(saved),
    rule = () => draft.rules[selected],
    effective = () => draft.master && draft.pathway;
  const options = (obj, value) =>
    Object.entries(obj)
      .map(
        ([v, l]) => `<option value="${esc(v)}" ${value === v ? 'selected' : ''}>${esc(l)}</option>`,
      )
      .join('');
  function chips(values, type) {
    return values
      .map(
        (v, i) =>
          `<span class="chip">${esc(v)}<button type="button" data-remove="${type}" data-index="${i}" aria-label="Remove ${esc(v)}">×</button></span>`,
      )
      .join('');
  }
  function issue(r) {
    if (!r.enabled) return '';
    if (!r.codes.length) return 'Select at least one DXL statement.';
    if (!r.reasons.length) return 'Add at least one reason for study.';
    if (
      r.pr !== undefined &&
      (!String(r.pr).trim() ||
        !Number.isFinite(Number(r.pr)) ||
        !String(r.qrs).trim() ||
        !Number.isFinite(Number(r.qrs)))
    )
      return 'Enter a numeric value for both measurement thresholds.';
    return '';
  }
  function renderList() {
    $('ruleList').innerHTML =
      '<h3>Rules <span style="font-weight:normal">(' +
      draft.rules.length +
      ')</span></h3>' +
      draft.rules
        .map(
          (r, i) =>
            `<div class="rulerow ${i === selected ? 'current' : ''}"><button type="button" data-select="${i}" aria-current="${i === selected ? 'true' : 'false'}"><strong>${esc(r.title)}</strong><small>${esc(priorities[r.priority])}${r.pr !== undefined ? ' · PR / QRS thresholds' : ''}${JSON.stringify(r) !== JSON.stringify(saved.rules[i]) ? ' <span class="dot">• Unsaved</span>' : ''}${!r.enabled ? ' · Off' : ''}</small></button><label class="switch"><input type="checkbox" data-toggle="${i}" aria-label="Enable ${esc(r.title)}" ${r.enabled ? 'checked' : ''} ${effective() ? '' : 'disabled'}></label></div>`,
        )
        .join('') +
      '<div class="rulehint">Switch a rule off to exclude it without removing its settings.</div>';
  }
  function renderEditor() {
    const r = rule(),
      blocked = !effective() || !r.enabled;
    $('editor').innerHTML =
      `<div class="edithead"><div><h3>${esc(r.title)}</h3><span class="tag ${blocked ? 'offtag' : ''}">${blocked ? 'Inactive' : 'Enabled rule'}</span></div><label class="switch"><input id="ruleEnabled" type="checkbox" ${r.enabled ? 'checked' : ''} ${effective() ? '' : 'disabled'}><span>Rule enabled</span></label></div>${blocked ? '<div class="disabledwhy">' + (!draft.master ? 'Clinical pathways are off for this customer.' : !draft.pathway ? 'This pathway is off.' : 'This rule is off.') + ' Saved values are retained.</div>' : ''}
 <div class="match"><b>Match requirement</b> &nbsp;Any selected DXL code <b>AND</b> any selected reason on the same ECG.</div>
 <fieldset ${blocked ? 'disabled' : ''}><div class="section"><h3>Findings</h3><label class="label" for="family">Finding family</label><input class="field" id="family" data-field="family" value="${esc(r.family)}"><div class="gap"><label class="label" for="codeInput">DXL statement codes</label><div class="chips">${chips(r.codes, 'codes')}</div><div class="addrow"><input class="field" id="codeInput" list="codeOptions" placeholder="Search an available DXL code" autocomplete="off"><datalist id="codeOptions">${dictionary
   .filter((c) => !r.codes.includes(c))
   .map((c) => `<option value="${esc(c)}"></option>`)
   .join(
     '',
   )}</datalist><button type="button" class="smallbtn" id="addCode">Add code</button></div><p class="error" id="codeError">${r.enabled && !r.codes.length ? 'Select at least one DXL statement.' : ''}</p></div></div>
 <div class="section"><h3>Reason for study</h3><label class="label" for="reasonInput">Matching words and phrases</label><div class="chips">${chips(r.reasons, 'reasons')}</div><div class="addrow"><input class="field" id="reasonInput" placeholder="Add a word or phrase" autocomplete="off"><button type="button" class="smallbtn" id="addReason">Add phrase</button></div><p class="help">Each phrase is a separate entry. At least one must match.</p><p class="error" id="reasonError">${r.enabled && !r.reasons.length ? 'Add at least one reason for study.' : ''}</p></div>
 ${r.pr !== undefined ? `<div class="section"><h3>Measurement thresholds</h3><div class="row">${['pr', 'qrs'].map((k) => `<div class="threshold"><label class="label" for="${k}">${k.toUpperCase()} ${k === 'pr' ? 'interval' : 'duration'}</label><select class="field" aria-label="${k.toUpperCase()} comparison operator"><option>Greater than or equal to (≥)</option></select><div class="measure"><input class="field" type="number" step="any" id="${k}" data-field="${k}" value="${esc(r[k])}" aria-describedby="measurementError"><span>ms</span></div></div>`).join('')}</div><p class="error" id="measurementError"></p></div>` : ''}
 <div class="section"><h3>Context and recommendation</h3><div class="row"><div><label class="label" for="context">Clinical context</label><select class="field" id="context" data-field="context">${options({ '': 'None', new: 'New', post_tavr: 'Post TAVR' }, r.context)}</select></div><div><label class="label" for="priority">Priority</label><select class="field" id="priority" data-field="priority">${options(priorities, r.priority)}</select><p class="help" id="rankHint">Display rank: ${ranks[r.priority]}</p></div></div><div class="gap"><label class="label" for="monitor">Recommended monitoring</label><select class="field" id="monitor" data-field="monitor">${options({ mobile_cardiac_telemetry: 'Mobile cardiac telemetry', extended_wear_holter: 'Extended-wear Holter' }, r.monitor)}</select></div><div class="gap"><label class="label" for="rationale">Clinical rationale</label><textarea class="field" id="rationale" data-field="rationale">${esc(r.rationale)}</textarea><p class="help">Explanatory text accompanying this rule.</p></div></div></fieldset>
 <details><summary>Rule information</summary><dl><dt>Rule ID</dt><dd>${esc(r.id)}</dd><dt>Rule set</dt><dd>2.1.0</dd><dt>Classification</dt><dd>${esc(r.classification)}</dd><dt>Reference materials</dt><dd><button class="referenceLink" type="button" data-view-references>View ${draft.references.length} pathway references</button>${
   draft.references
     .filter((x) => x.rules.includes(r.id))
     .map((x) => '<div class="gap">' + esc(x.title) + '</div>')
     .join('') || '<div class="help">No rule-specific reference links recorded.</div>'
 }</dd></dl></details>`;
  }
  function refresh() {
    const changed = dirty(),
      errors = draft.rules.filter((r) => issue(r)).length + (draft.title.trim() ? 0 : 1);
    $('pathTitle').value = draft.title;
    $('pathTitle').disabled = !draft.master;
    $('titleError').textContent = draft.title.trim() ? '' : 'Enter a pathway title.';
    $('pathSelect').options[0].textContent = draft.title.trim() || 'Untitled pathway';
    $('refCount').textContent = draft.references.length;
    $('master').checked = draft.master;
    $('masterLabel').textContent = draft.master ? 'On' : 'Off';
    $('pathway').checked = draft.pathway;
    $('pathway').disabled = !draft.master;
    $('pathLabel').textContent = draft.pathway ? 'Enabled' : 'Disabled';
    $('ruleCount').textContent =
      draft.rules.filter((r) => r.enabled).length +
      ' of 6 rules enabled' +
      (!effective() ? ' · pathway inactive' : '');
    $('save').disabled = !changed || !!errors;
    $('cancel').disabled = !changed;
    $('reset').disabled = !effective() || !rule().enabled;
    $('saveState').textContent = changed
      ? errors
        ? 'Unsaved changes · correct the highlighted fields'
        : 'Unsaved changes · applies to this pathway'
      : `All changes saved · revision ${revision}`;
    $('saveState').className = changed ? 'pending' : '';
    const m = $('measurementError');
    if (m) {
      const r = rule();
      const bad = ['pr', 'qrs'].filter(
        (k) => !String(r[k]).trim() || !Number.isFinite(Number(r[k])),
      );
      m.textContent = bad.length
        ? 'Enter a numeric value for ' + bad.map((k) => k.toUpperCase()).join(' and ') + '.'
        : '';
      bad.forEach((k) => $(k).classList.add('invalid'));
      ['pr', 'qrs']
        .filter((k) => !bad.includes(k))
        .forEach((k) => $(k).classList.remove('invalid'));
    }
  }
  function render() {
    renderList();
    renderEditor();
    renderReferences();
    setTab(activeTab);
    refresh();
  }
  function changed() {
    $('notice').textContent = '';
    renderList();
    refresh();
  }
  function confirm(title, text, label, action) {
    confirmAction = action;
    $('dialogTitle').textContent = title;
    $('dialogText').textContent = text;
    $('dialogYes').textContent = label;
    $('confirmDialog').showModal();
  }
  function add(type) {
    const id = type === 'codes' ? 'codeInput' : 'reasonInput',
      err = type === 'codes' ? 'codeError' : 'reasonError',
      input = $(id),
      v = input.value.trim(),
      r = rule();
    if (!v) {
      $(err).textContent = 'Enter ' + (type === 'codes' ? 'a code.' : 'a phrase.');
      return;
    }
    if (type === 'codes' && !dictionary.includes(v.toUpperCase())) {
      $(err).textContent = 'Choose a code from the available list.';
      return;
    }
    const value = type === 'codes' ? v.toUpperCase() : v;
    if (r[type].some((x) => x.toLowerCase() === value.toLowerCase())) {
      $(err).textContent = 'This entry is already selected.';
      return;
    }
    r[type].push(value);
    render();
    $(id).focus();
    $('notice').textContent = '';
  }
  document.addEventListener('click', (e) => {
    const select = e.target.closest('[data-select]'),
      remove = e.target.closest('[data-remove]');
    if (select) {
      selected = Number(select.dataset.select);
      render();
      return;
    }
    if (remove) {
      rule()[remove.dataset.remove].splice(Number(remove.dataset.index), 1);
      render();
      $('notice').textContent = '';
      return;
    }
    if (e.target.id === 'addCode') add('codes');
    if (e.target.id === 'addReason') add('reasons');
  });
  document.addEventListener('change', (e) => {
    if (e.target.dataset.toggle !== undefined) {
      draft.rules[Number(e.target.dataset.toggle)].enabled = e.target.checked;
      render();
      $('notice').textContent = '';
    }
    if (e.target.id === 'ruleEnabled') {
      rule().enabled = e.target.checked;
      render();
      $('notice').textContent = '';
    }
    if (e.target.id === 'master' || e.target.id === 'pathway') {
      draft[e.target.id] = e.target.checked;
      render();
      $('notice').textContent = '';
    }
  });
  document.addEventListener('input', (e) => {
    if (e.target.id === 'pathTitle') {
      draft.title = e.target.value;
      $('notice').textContent = '';
      refresh();
      return;
    }
    if (e.target.dataset.field) {
      rule()[e.target.dataset.field] = e.target.value;
      changed();
      if (e.target.id === 'priority')
        $('rankHint').textContent = 'Display rank: ' + ranks[rule().priority];
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && ['codeInput', 'reasonInput'].includes(e.target.id)) {
      e.preventDefault();
      add(e.target.id === 'codeInput' ? 'codes' : 'reasons');
    }
  });
  $('save').onclick = () => {
    if (!dirty() || !draft.title.trim() || draft.rules.some(issue)) return;
    draft.title = draft.title.trim();
    saved = clone(draft);
    revision++;
    render();
    $('notice').textContent = 'Configuration saved for this preview session.';
  };
  $('cancel').onclick = () =>
    confirm(
      'Discard unsaved changes?',
      'All pending changes in this pathway will be replaced with the last saved values.',
      'Discard changes',
      () => {
        draft = clone(saved);
        render();
        $('notice').textContent = 'Pending changes discarded.';
      },
    );
  $('reset').onclick = () =>
    confirm(
      'Restore this rule’s defaults?',
      'The selected rule will return to the supplied example values. Other rules will be unchanged. Select Save changes to apply.',
      'Restore defaults',
      () => {
        draft.rules[selected] = clone(seed[selected]);
        render();
        $('notice').textContent = 'Rule defaults restored. Select Save changes to apply.';
      },
    );
  $('dialogStay').onclick = () => {
    $('confirmDialog').close();
    confirmAction = null;
  };
  $('dialogYes').onclick = () => {
    const action = confirmAction;
    confirmAction = null;
    $('confirmDialog').close();
    if (action) action();
  };

  function setTab(tab) {
    activeTab = tab;
    const refs = tab === 'references';
    $('rulesPanel').hidden = refs;
    $('referencesPanel').hidden = !refs;
    ['rules', 'references'].forEach((t) => {
      const b = $(t + 'Tab');
      b.classList.toggle('active', t === tab);
      b.setAttribute('aria-selected', String(t === tab));
      b.tabIndex = t === tab ? 0 : -1;
    });
    $('reset').hidden = refs;
  }
  function safeUrl(value) {
    try {
      const u = new URL(value);
      return ['https:', 'http:'].includes(u.protocol) ? u.href : '';
    } catch {
      return '';
    }
  }
  function renderReferences() {
    $('referencesPanel').innerHTML =
      `<div class="refintro"><div><h3>Pathway reference materials</h3><p class="sub">Keep supporting documents with the pathway. Record the relevant section and link individual rules where applicable.</p><p class="help">A reference link does not establish support for every configured threshold or monitoring recommendation.</p></div><button class="btn" id="addReference" type="button" ${draft.master ? '' : 'disabled'}>＋ Add reference</button></div>` +
      draft.references
        .map(
          (r, i) =>
            `<article class="refcard"><div class="refbar"><div><span class="tag">${esc(r.type || 'Reference material')}</span><h3><a href="${esc(safeUrl(r.url))}" target="_blank" rel="noopener noreferrer">${esc(r.title)} ↗</a></h3><p class="refmeta">${esc(r.publisher)} · ${esc(r.year)}</p></div><button class="smallbtn" data-edit-reference="${i}" type="button" ${draft.master ? '' : 'disabled'}>Edit details</button></div><p class="reflocator"><b>Relevant section:</b> ${esc(r.locator || 'Not specified')}</p><p class="refmeta">Provided by ${esc(r.providedBy || 'Configuration administrator')}</p><p class="refmeta">Medical Affairs review: <span class="reviewtag">${esc(r.review || 'Not recorded')}</span></p><p class="refmeta"><b>Rule links:</b> ${r.rules.length ? r.rules.map((id) => esc(draft.rules.find((x) => x.id === id)?.title || id)).join('; ') : 'None selected'}</p>${r.notes ? '<p class="reflocator">' + esc(r.notes) + '</p>' : ''}</article>`,
        )
        .join('') +
      '<p class="refnotice">References are stored with this pathway and remain linked when its title changes.</p>';
  }
  function openReference(index = null) {
    editingReference = index;
    const r =
      index === null
        ? { title: '', publisher: '', year: '', url: '', locator: '', notes: '', rules: [] }
        : draft.references[index];
    $('referenceDialogTitle').textContent =
      index === null ? 'Add reference material' : 'Edit reference details';
    for (const [key, id] of Object.entries({
      title: 'refTitle',
      publisher: 'refPublisher',
      year: 'refYear',
      url: 'refUrl',
      locator: 'refLocator',
      notes: 'refNotes',
    }))
      $(id).value = r[key] || '';
    $('referenceRuleLinks').innerHTML = draft.rules
      .map(
        (x) =>
          `<label class="checkrow"><input type="checkbox" name="referenceRule" value="${esc(x.id)}" ${r.rules.includes(x.id) ? 'checked' : ''}><span>${esc(x.title)}</span></label>`,
      )
      .join('');
    $('refFormError').textContent = '';
    $('referenceDialog').showModal();
  }
  $('rulesTab').onclick = () => setTab('rules');
  $('referencesTab').onclick = () => setTab('references');
  document.querySelector('.subtabs').addEventListener('keydown', (e) => {
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
      setTab(
        e.key === 'Home'
          ? 'rules'
          : e.key === 'End'
            ? 'references'
            : activeTab === 'rules'
              ? 'references'
              : 'rules',
      );
      $(activeTab + 'Tab').focus();
    }
  });
  document.addEventListener('click', (e) => {
    const edit = e.target.closest('[data-edit-reference]');
    if (edit) openReference(Number(edit.dataset.editReference));
    if (e.target.id === 'addReference') openReference();
    if (e.target.closest('[data-view-references]')) {
      setTab('references');
      $('referencesTab').focus();
    }
  });
  $('referenceCancel').onclick = () => $('referenceDialog').close();
  $('referenceForm').onsubmit = (e) => {
    e.preventDefault();
    const url = safeUrl($('refUrl').value.trim()),
      title = $('refTitle').value.trim();
    if (!title || !url) {
      $('refFormError').textContent =
        'Enter a document title and a valid http or https source link.';
      return;
    }
    const update = {
      title,
      publisher: $('refPublisher').value.trim(),
      year: $('refYear').value.trim(),
      url,
      locator: $('refLocator').value.trim(),
      notes: $('refNotes').value.trim(),
      rules: Array.from(
        document.querySelectorAll('input[name="referenceRule"]:checked'),
        (x) => x.value,
      ),
    };
    if (editingReference === null)
      draft.references.push({
        ...update,
        id: 'ref_' + Date.now(),
        type: 'Reference material',
        providedBy: 'Configuration administrator',
        review: 'Not recorded',
      });
    else draft.references[editingReference] = { ...draft.references[editingReference], ...update };
    $('referenceDialog').close();
    render();
    $('notice').textContent = 'Reference details updated. Select Save changes to apply.';
  };

  window.addEventListener('beforeunload', (e) => {
    if (dirty()) {
      e.preventDefault();
      e.returnValue = '';
    }
  });
  render();
})();
