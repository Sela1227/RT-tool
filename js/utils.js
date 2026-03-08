// ── SELA Utils — shared DOM helpers + HTML builders ───────
// Loaded first; all modules depend on these globals.

// ── DOM ──────────────────────────────────────────────────
window.gel    = id => document.getElementById(id);
window.numVal = id => parseFloat(gel(id)?.value) || 0;
window.selVal = id => gel(id)?.value || '';

// ── Card toggle (unified — was RTToggle / toggleCard / StagingToggle) ──
window.toggleCard = function(id) {
  const b = gel(id+'-body'), c = gel(id+'-chev');
  if (!b) return;
  const open = b.classList.contains('hidden');
  b.classList.toggle('hidden', !open);
  if (c) c.style.transform = open ? 'rotate(180deg)' : '';
};

// ── Stepper controls ──────────────────────────────────────
window.stepAdj = function(id, delta, min, max) {
  const inp = gel(id); if (!inp) return;
  const val = Math.min(max, Math.max(min, parseFloat(((parseFloat(inp.value)||0)+delta).toFixed(4))));
  inp.value = val; inp.dispatchEvent(new Event('input'));
};
window.stepClamp = function(inp, min, max) {
  const val = parseFloat(inp.value);
  if (!isNaN(val)) inp.value = Math.min(max, Math.max(min, val));
};

// ── Pill group (α/β style — active class on button, value on hidden input) ──
window.pillSelect = function(groupId, btn) {
  document.querySelectorAll(`[data-group="${groupId}"]`).forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const h = gel(groupId); if (h) h.value = btn.dataset.val;
};

// ── U — shared HTML builder namespace ────────────────────
window.U = {

  // Numeric stepper row
  stepper(id, label, def, min, max, step, unit='') {
    return `<div class="mb-3">
      <div class="text-xs mb-1.5" style="color:var(--t2);">${label}</div>
      <div class="flex items-center gap-2">
        <button class="step-btn" onclick="stepAdj('${id}',${-step},${min},${max})">−</button>
        <input type="number" id="${id}" value="${def}" min="${min}" max="${max}" step="${step}"
          class="inp text-center mono flex-1" style="font-size:15px;" oninput="stepClamp(this,${min},${max})">
        <button class="step-btn" onclick="stepAdj('${id}',${step},${min},${max})">+</button>
        ${unit ? `<span class="text-xs mono flex-shrink-0" style="color:var(--t2);min-width:28px;">${unit}</span>` : ''}
      </div>
    </div>`;
  },

  // Pill-opt row (α/β style)
  pills(id, label, opts, def) {
    return `<div class="mb-3">
      <div class="text-xs mb-1.5" style="color:var(--t2);">${label}</div>
      <div class="flex flex-wrap gap-1.5">
        ${opts.map(([val,txt]) => `<button class="pill-opt${val==def?' active':''}" data-val="${val}" data-group="${id}" onclick="pillSelect('${id}',this)">${txt}</button>`).join('')}
      </div>
      <input type="hidden" id="${id}" value="${def}">
    </div>`;
  },

  // Select field
  fld(id, label, optArr, def='') {
    const os = optArr.map(([v,l]) => `<option value="${v}"${v===def?' selected':''}>${l}</option>`).join('');
    return `<div class="mb-3">
      <div class="text-xs mb-1.5" style="color:var(--t2);">${label}</div>
      <select id="${id}" class="inp">${os}</select>
    </div>`;
  },

  // Primary action button
  calcBtn(fn, label='計算') {
    return `<button onclick="${fn}" class="calc-btn">${label}</button>`;
  },

  // Collapsible tool card (used by RT, Calc, Score, Staging)
  cardWrap(id, icon, title, body) {
    return `<div class="card mb-3 overflow-hidden">
      <button onclick="toggleCard('${id}')" class="w-full px-4 py-3 flex items-center justify-between text-left">
        <div class="flex items-center gap-2.5">
          <span class="flex-shrink-0 w-5 h-5 flex items-center justify-center" style="color:var(--t2);">${icon}</span>
          <span class="font-medium text-sm" style="color:var(--t1);">${title}</span>
        </div>
        <svg id="${id}-chev" class="w-4 h-4 flex-shrink-0" style="color:var(--t3);transition:transform .2s"
             fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <div id="${id}-body" class="hidden px-4 pb-4">${body}</div>
    </div>`;
  },

  // Staging result panel
  stageResult(stage, details, notes='') {
    return `<div class="result-panel mt-4">
      <div class="flex items-start justify-between gap-3">
        <div>
          <div class="sec-label mb-1">AJCC 9th</div>
          <div class="result-val">${stage}</div>
        </div>
        <div class="text-right text-xs leading-relaxed" style="color:var(--t2);">${details}</div>
      </div>
      ${notes ? `<div class="mt-3 pt-3 text-xs leading-relaxed" style="border-top:1px solid var(--border);color:var(--t2);">${notes}</div>` : ''}
    </div>`;
  },

  // Generic result panel (for calc tools)
  resultPanel(html) {
    return `<div class="result-panel">${html}</div>`;
  },
};
