// ── SELA Utils — shared DOM helpers + HTML builders ───────
// Loaded first; all modules depend on these globals.

// ── DOM ──────────────────────────────────────────────────
window.gel    = id => document.getElementById(id);
window.numVal = id => parseFloat(gel(id)?.value) || 0;
window.selVal = id => gel(id)?.value || '';

// ── Vector icon set (Nordic, stroke-based, currentColor) ──
window.ICO = {
  star(filled) {
    return filled
      ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.9 6.6 19.5l1.2-6-4.5-4.2 6.1-.7z"/></svg>`
      : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"><path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.9 6.6 19.5l1.2-6-4.5-4.2 6.1-.7z"/></svg>`;
  },
  edit: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>`,
  warn: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;"><path d="M12 3l9 16H3z"/><line x1="12" y1="9" x2="12" y2="14"/><circle cx="12" cy="17.5" r="0.6" fill="currentColor"/></svg>`,
  arrows: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;"><path d="M7 8l-4 4 4 4"/><path d="M17 8l4 4-4 4"/><line x1="3" y1="12" x2="21" y2="12"/></svg>`,
};

// ── Card toggle (unified — was RTToggle / toggleCard / StagingToggle) ──
window.toggleCard = function(id) {
  const b = gel(id+'-body'), c = gel(id+'-chev');
  if (!b) return;
  const opening = !b.classList.contains('open');
  b.classList.toggle('open', opening);
  if (c) c.style.transform = opening ? 'rotate(180deg)' : 'rotate(0deg)';
  // Divider line on card header when open
  const hdr = b.previousElementSibling;
  if (hdr) hdr.classList.toggle('card-hdr-open', opening);
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
// Stable staging result — writes into persistent container (preserves id)
window.setStageResult = function(id, stage, details, notes) {
  const e = gel(id);
  if (!e) return;
  e.className = 'result-panel mt-4';
  e.innerHTML = `<div class="flex items-start justify-between gap-3">
    <div>
      <div class="sec-label mb-1">AJCC 9th</div>
      <div class="result-val">${stage}</div>
    </div>
    <div class="text-right text-xs leading-relaxed" style="color:var(--t2);">${details}</div>
  </div>${notes ? `<div class="mt-3 pt-3 text-xs leading-relaxed" style="border-top:1px solid var(--border);color:var(--t2);">${notes}</div>` : ''}`;
};
window.U = {

  // Numeric stepper row
  stepper(id, label, def, min, max, step, unit='') {
    return `<div class="mb-3">
      <div class="text-xs mb-1.5" style="color:var(--t2);">${label}</div>
      <div class="flex items-center gap-2">
        <button class="step-btn" onclick="stepAdj('${id}',${-step},${min},${max})">−</button>
        <input type="number" id="${id}" value="${def}" min="${min}" max="${max}" step="${step}"
          inputmode="decimal" class="inp text-center mono flex-1" style="font-size:15px;" oninput="stepClamp(this,${min},${max})">
        <button class="step-btn" onclick="stepAdj('${id}',${step},${min},${max})">+</button>
        ${unit ? `<span class="text-xs mono flex-shrink-0" style="color:var(--t2);min-width:28px;">${unit}</span>` : ''}
      </div>
    </div>`;
  },

  // Pill-opt row (α/β style). onChange(val): optional fn name called after selection.
  pills(id, label, opts, def, onChange='') {
    const extra = onChange ? `;${onChange}(this.dataset.val)` : '';
    return `<div class="mb-3">
      <div class="text-xs mb-1.5" style="color:var(--t2);">${label}</div>
      <div class="flex flex-wrap gap-1.5">
        ${opts.map(([val,txt]) => `<button class="pill-opt${val==def?' active':''}" data-val="${val}" data-group="${id}" onclick="pillSelect('${id}',this)${extra}">${txt}</button>`).join('')}
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
      <button onclick="toggleCard('${id}')" class="w-full px-4 py-3.5 flex items-center justify-between text-left" style="-webkit-tap-highlight-color:transparent;transition:background 0.1s;" onmousedown="this.style.background='var(--acc-bg)'" onmouseup="this.style.background=''" ontouchstart="this.style.background='var(--acc-bg)'" ontouchend="this.style.background=''">
        <div class="flex items-center gap-2.5">
          <span class="flex-shrink-0 w-5 h-5 flex items-center justify-center" style="color:var(--t2);">${icon}</span>
          <span class="font-medium" style="color:var(--t1);font-size:15px;">${title}</span>
        </div>
        <svg id="${id}-chev" class="w-4 h-4 flex-shrink-0" style="color:var(--t3);transition:transform .2s"
             fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <div id="${id}-body" class="card-body px-4 pb-4">${body}</div>
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
