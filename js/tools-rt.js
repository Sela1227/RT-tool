// ──────────────────────────────────────────────────────────
//  ToolsRT  —  放療計算工具
//  BED/EQD2（三組織）/ Treatment Gap / Hypofractionation
// ──────────────────────────────────────────────────────────

const ToolsRT = (() => {

  // ── Shared helpers ───────────────────────────────────────
  const v = id => parseFloat(document.getElementById(id)?.value) || 0;
  const el = id => document.getElementById(id);
  const setH = (id, html) => { const e = el(id); if (e) e.outerHTML = html; };

  // Stepper: tap − / + to adjust value
  window.stepAdj = function(id, delta, min, max) {
    const inp = el(id); if (!inp) return;
    let val = parseFloat(inp.value) || 0;
    val = Math.min(max, Math.max(min, parseFloat((val + delta).toFixed(4))));
    inp.value = val;
    inp.dispatchEvent(new Event('input'));
  };
  window.stepClamp = function(inp, min, max) {
    let val = parseFloat(inp.value);
    if (!isNaN(val)) inp.value = Math.min(max, Math.max(min, val));
  };

  function stepper(id, label, defVal, min, max, step, unit = '') {
    return `
    <div class="mb-3">
      <div class="text-xs mb-1.5" style="color:var(--t2);">${label}</div>
      <div class="flex items-center gap-2">
        <button class="step-btn" onclick="stepAdj('${id}',${-step},${min},${max})">−</button>
        <input type="number" id="${id}" value="${defVal}" min="${min}" max="${max}" step="${step}"
          class="inp text-center mono flex-1" style="font-size:15px;"
          oninput="stepClamp(this,${min},${max})">
        <button class="step-btn" onclick="stepAdj('${id}',${step},${min},${max})">+</button>
        ${unit ? `<span class="text-xs mono" style="color:var(--t2);min-width:24px;">${unit}</span>` : ''}
      </div>
    </div>`;
  }

  // Pill selector (tap to choose one)
  function pills(id, label, opts, defVal, onchange='') {
    const btns = opts.map(([val, txt]) =>
      `<button class="pill-opt${val==defVal?' active':''}" data-val="${val}" data-group="${id}"
         onclick="pillSelect('${id}',this)">${txt}</button>`
    ).join('');
    return `
    <div class="mb-3">
      <div class="text-xs mb-1.5" style="color:var(--t2);">${label}</div>
      <div class="flex gap-1.5">${btns}</div>
      <input type="hidden" id="${id}" value="${defVal}">
    </div>`;
  }

  window.pillSelect = function(groupId, btn) {
    document.querySelectorAll(`[data-group="${groupId}"]`).forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const hidden = el(groupId);
    if (hidden) hidden.value = btn.dataset.val;
  };

  function cardWrap(id, icon, title, body) {
    return `
    <div class="card mb-3 overflow-hidden">
      <button onclick="RTToggle('${id}')" class="w-full px-4 py-3 flex items-center justify-between text-left">
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
  }

  window.RTToggle = function(id) {
    const b = el(id+'-body'), c = el(id+'-chev');
    if (!b) return;
    const open = !b.classList.contains('hidden');
    b.classList.toggle('hidden', open);
    if (c) c.style.transform = open ? '' : 'rotate(180deg)';
  };

  // ── 1. BED / EQD2 ─────────────────────────────────────────
  const BED_ICON = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
    <path d="M2 14 C3 8 6 4 9 4 C12 4 15 8 16 14"/>
    <line x1="2" y1="14" x2="16" y2="14"/>
    <line x1="9" y1="4" x2="9" y2="2"/>
  </svg>`;

  function renderBED() {
    const body = `
      <div class="text-xs mb-3 px-1" style="color:var(--t3);">填入一組方案，自動顯示三種組織的 BED 與 EQD2</div>
      ${stepper('bed-dpf','每次劑量 (Dose/fx)',2,0.5,20,0.5,'Gy')}
      ${stepper('bed-n','分次數 (Fractions)',25,1,60,1,'fx')}
      <button class="calc-btn" onclick="calcBED()">計算</button>
      <div id="bed-result"></div>`;
    return cardWrap('bed', BED_ICON, 'BED / EQD2', body);
  }

  window.calcBED = function() {
    const d = v('bed-dpf'), n = v('bed-n');
    if (!d || !n) return;
    const total = d * n;
    const tissues = [
      { name: '腫瘤', ab: 10, note: 'α/β = 10' },
      { name: '晚期反應', ab: 3,  note: 'α/β = 3' },
      { name: '脊髓/神經', ab: 1.5, note: 'α/β = 1.5' },
    ];
    const rows = tissues.map(t => {
      const bed  = total * (1 + d / t.ab);
      const eqd2 = bed / (1 + 2 / t.ab);
      return `
      <tr>
        <td class="py-2 pr-2" style="color:var(--t2);font-size:12px;">
          <div style="font-weight:500;color:var(--t1);">${t.name}</div>
          <div style="color:var(--t3);font-size:11px;">${t.note}</div>
        </td>
        <td class="py-2 text-center mono" style="font-size:16px;font-weight:500;color:var(--t1);">${bed.toFixed(1)}</td>
        <td class="py-2 text-center mono" style="font-size:16px;font-weight:500;color:var(--accent);">${eqd2.toFixed(1)}</td>
      </tr>`;
    }).join('');

    const html = `
    <div class="result-panel" id="bed-result">
      <div class="flex justify-between mb-3">
        <div style="color:var(--t2);font-size:11px;">方案：<span class="mono" style="color:var(--t1);">${total.toFixed(1)} Gy / ${n} fx (${d} Gy/fx)</span></div>
      </div>
      <table class="w-full" style="border-collapse:collapse;">
        <thead>
          <tr style="border-bottom:1px solid var(--border);">
            <th class="pb-2 text-left text-xs" style="color:var(--t3);font-weight:500;">組織</th>
            <th class="pb-2 text-center text-xs" style="color:var(--t3);font-weight:500;">BED (Gy)</th>
            <th class="pb-2 text-center text-xs" style="color:var(--accent);font-weight:500;">EQD2 (Gy)</th>
          </tr>
        </thead>
        <tbody style="border-bottom:1px solid var(--border);">${rows}</tbody>
      </table>
    </div>`;
    setH('bed-result', html);
  };

  // ── 2. Treatment Gap Correction ───────────────────────────
  const GAP_ICON = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
    <rect x="2" y="4" width="5" height="11" rx="1"/>
    <rect x="11" y="4" width="5" height="11" rx="1"/>
    <line x1="8" y1="9.5" x2="10" y2="9.5" stroke-dasharray="1 1.5"/>
  </svg>`;

  function renderTreatmentGap() {
    const body = `
      ${stepper('gap-days','中斷天數',5,1,30,1,'天')}
      ${pills('gap-site','腫瘤部位',[
        ['hn','頭頸部（0.6 Gy/天）'],
        ['other','其他（0.5 Gy/天）'],
      ],'hn')}
      ${stepper('gap-custom','自訂補充劑量/天（0 = 使用預設）',0,0,2,0.1,'Gy')}
      <button class="calc-btn" onclick="calcGap()">計算</button>
      <div id="gap-result"></div>`;
    return cardWrap('gap', GAP_ICON, 'Treatment Gap Correction', body);
  }

  window.calcGap = function() {
    const days = v('gap-days');
    const site = el('gap-site')?.value || 'hn';
    const custom = v('gap-custom');
    const rate = custom > 0 ? custom : (site === 'hn' ? 0.6 : 0.5);
    const extra = days * rate;

    const html = `
    <div class="result-panel" id="gap-result">
      <div class="sec-label mb-2">補充劑量估算</div>
      <div class="flex items-end gap-2">
        <span class="result-val">${extra.toFixed(1)}</span>
        <span class="text-sm mb-0.5" style="color:var(--t2);">Gy 追加</span>
      </div>
      <div class="mt-2 text-xs" style="color:var(--t2);">
        ${days} 天 × ${rate} Gy/天（${site === 'hn' ? '頭頸部' : '其他'}）
      </div>
    </div>`;
    setH('gap-result', html);
  };

  // ── 3. Hypofractionation Converter ────────────────────────
  const HYPO_ICON = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="2,14 5,8 8,11 11,5 14,9 16,4"/>
    <line x1="2" y1="16" x2="16" y2="16"/>
  </svg>`;

  function renderHypofrac() {
    const body = `
      <div class="text-xs mb-3 px-1" style="color:var(--t3);">輸入原始方案，計算等效 BED 並換算至新方案</div>
      <div class="sec-label mb-2">原始方案</div>
      ${stepper('hypo-dpf1','每次劑量',2,0.5,20,0.5,'Gy')}
      ${stepper('hypo-n1','分次數',25,1,60,1,'fx')}
      <div class="sec-label mb-2 mt-1">目標方案</div>
      ${stepper('hypo-dpf2','每次劑量',3,0.5,20,0.5,'Gy')}
      ${pills('hypo-ab','α/β 組織',[
        ['10','10（腫瘤）'],['3','3（晚期）'],['1.5','1.5（神經）'],
      ],'10')}
      <button class="calc-btn" onclick="calcHypo()">計算等效分次數</button>
      <div id="hypo-result"></div>`;
    return cardWrap('hypo', HYPO_ICON, 'Hypofractionation Converter', body);
  }

  window.calcHypo = function() {
    const d1 = v('hypo-dpf1'), n1 = v('hypo-n1'), d2 = v('hypo-dpf2');
    const ab = parseFloat(el('hypo-ab')?.value) || 10;
    if (!d1 || !n1 || !d2) return;
    const bed = d1 * n1 * (1 + d1 / ab);
    const n2  = bed / (d2 * (1 + d2 / ab));
    const total1 = d1 * n1, total2 = d2 * n2;

    const html = `
    <div class="result-panel" id="hypo-result">
      <div class="sec-label mb-3">等效結果（α/β = ${ab}）</div>
      <div class="grid grid-cols-2 gap-3">
        <div style="background:var(--bg);border-radius:10px;padding:12px;">
          <div class="text-xs mb-1" style="color:var(--t3);">原始方案</div>
          <div class="mono" style="font-size:18px;font-weight:500;color:var(--t1);">${total1.toFixed(0)} Gy</div>
          <div class="text-xs mt-0.5" style="color:var(--t2);">${n1} fx × ${d1} Gy</div>
        </div>
        <div style="background:var(--acc-bg);border-radius:10px;padding:12px;border:1px solid var(--border);">
          <div class="text-xs mb-1" style="color:var(--t2);">目標方案</div>
          <div class="mono" style="font-size:18px;font-weight:500;color:var(--accent);">${total2.toFixed(1)} Gy</div>
          <div class="text-xs mt-0.5" style="color:var(--t2);">${n2.toFixed(1)} fx × ${d2} Gy</div>
        </div>
      </div>
      <div class="mt-2 text-xs" style="color:var(--t3);">BED = ${bed.toFixed(1)} Gy（α/β=${ab}）</div>
    </div>`;
    setH('hypo-result', html);
  };

  // ── Render all ───────────────────────────────────────────
  function render(settings) {
    const en = settings?.enabledTools || {};
    const tools = [
      { key:'bed',          fn: renderBED },
      { key:'treatmentgap', fn: renderTreatmentGap },
      { key:'hypofrac',     fn: renderHypofrac },
    ];
    const html = tools.filter(t => en[t.key] !== false).map(t => t.fn()).join('');
    return html || `<div class="text-center text-sm py-8" style="color:var(--t3);">放療工具已全部關閉<br><span class="text-xs">請在設定頁開啟</span></div>`;
  }

  return { render };
})();
