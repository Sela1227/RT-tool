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
    const allTools = [
      { key:'bed',          fn: renderBED,           label:'BED/EQD2' },
      { key:'treatmentgap', fn: renderTreatmentGap,  label:'Gap 修正' },
      { key:'hypofrac',     fn: renderHypofrac,      label:'分次換算' },
      { key:'electron',     fn: renderElectron,      label:'電子線' },
      { key:'mu-calc',      fn: renderMU,            label:'MU 計算' },
      { key:'ssd-corr',     fn: renderSSD,           label:'SSD 修正' },
      { key:'isl',          fn: renderISL,           label:'ISL' },
      { key:'hvl',          fn: renderHVL,           label:'HVL 屏蔽' },
    ];
    const visible = allTools.filter(t => en[t.key] !== false);
    if (!visible.length) return `<div class="text-center text-sm py-8" style="color:var(--t3);">放療工具已全部關閉</div>`;

    const index = `<div class="flex flex-wrap gap-1.5 mb-3">${
      visible.map(t => `<button onclick="jumpTo('${t.key}')"
        class="text-xs px-2.5 py-1 rounded-full"
        style="background:var(--acc-bg);color:var(--accent);border:1px solid var(--border);">${t.label}</button>`
      ).join('')
    }</div>`;

    return index + visible.map(t => t.fn()).join('');
  }

  return { render };
})();

  // ── 4. Electron Depth Dose Calculator ────────────────────
  const ELEC_ICON = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="9" cy="9" r="2"/><path d="M9 2v2M9 14v2M2 9h2M14 9h2"/>
    <path d="M4.22 4.22l1.42 1.42M12.36 12.36l1.42 1.42M4.22 13.78l1.42-1.42M12.36 5.64l1.42-1.42"/>
  </svg>`;

  // R50, Rp, Dmax approximations by energy
  const ELECTRON_ENERGY = {
    '4': { r50: 1.5, rp: 2.0, dmax: 0.8,  name:'4 MeV' },
    '6': { r50: 2.3, rp: 3.0, dmax: 1.3,  name:'6 MeV' },
    '9': { r50: 3.5, rp: 4.5, dmax: 2.0,  name:'9 MeV' },
    '12':{ r50: 4.7, rp: 6.0, dmax: 2.5,  name:'12 MeV' },
    '15':{ r50: 5.9, rp: 7.5, dmax: 2.5,  name:'15 MeV' },
    '18':{ r50: 7.1, rp: 9.0, dmax: 2.0,  name:'18 MeV' },
    '20':{ r50: 7.9,rp:10.0, dmax: 2.0,   name:'20 MeV' },
  };

  function renderElectron() {
    const energyOpts = Object.entries(ELECTRON_ENERGY).map(([k,v]) => [k, v.name]);
    const body = `
      <div class="text-xs mb-3 px-1" style="color:var(--t3);">依 IAEA TRS-398；水中近似值，臨床使用請依本機測量資料</div>
      ${pills('el-energy','電子線能量（MeV）', energyOpts, '9')}
      ${stepper('el-depth','查詢深度 (cm)',2.0,0,15,0.5,'cm')}
      ${stepper('el-mu','Monitor Units',100,1,999,1,'MU')}
      ${stepper('el-of','Output Factor (cGy/MU)',1.00,0.5,1.5,0.01,'')}
      <button class="calc-btn" onclick="calcElectron()">計算</button>
      <div id="el-result"></div>
      <div class="mt-2 text-xs" style="color:var(--t3);">📌 實用規則：R₅₀ ≈ E/3.2，Rp ≈ E/2.0，治療深度 ≈ E/4</div>`;
    return cardWrap('electron', ELEC_ICON, '電子線劑量計算', body);
  }

  window.calcElectron = function() {
    const en   = el('el-energy')?.value || '9';
    const d    = v('el-depth');
    const mu   = v('el-mu');
    const of   = v('el-of');
    const ep   = ELECTRON_ENERGY[en];
    if (!ep) return;

    // Percent depth dose approximation (Gaussian-like model)
    // PDD at depth d relative to dmax
    let pdd;
    if (d <= ep.dmax) {
      pdd = 100 * (1 - 0.03 * (ep.dmax - d));
    } else if (d <= ep.r50) {
      pdd = 100 * Math.exp(-0.693 * (d - ep.dmax) / (ep.r50 - ep.dmax));
    } else if (d <= ep.rp) {
      pdd = 100 * Math.max(0, (ep.rp - d) / (ep.rp - ep.r50) * 50);
    } else {
      pdd = 0;
    }
    pdd = Math.min(100, Math.max(0, pdd));
    const dose = (mu * of * pdd / 100).toFixed(1);
    const rx = (mu * of).toFixed(1);

    const bar = (val) => {
      const pct = Math.round(val);
      return `<div style="height:6px;border-radius:3px;background:var(--border);overflow:hidden;margin-top:4px;">
        <div style="width:${pct}%;height:100%;background:var(--accent);border-radius:3px;transition:width .3s;"></div></div>`;
    };

    setH('el-result', `
    <div class="result-panel" id="el-result">
      <div class="sec-label mb-3">深度 ${d} cm 的劑量估算</div>
      <div class="grid grid-cols-2 gap-3 mb-3">
        <div style="background:var(--bg);border-radius:10px;padding:12px;">
          <div class="text-xs mb-0.5" style="color:var(--t3);">PDD at ${d} cm</div>
          <div class="mono font-bold" style="font-size:20px;color:var(--t1);">${pdd.toFixed(1)}%</div>
          ${bar(pdd)}
        </div>
        <div style="background:var(--acc-bg);border-radius:10px;padding:12px;border:1px solid var(--border);">
          <div class="text-xs mb-0.5" style="color:var(--t2);">劑量 (cGy)</div>
          <div class="mono font-bold" style="font-size:20px;color:var(--accent);">${dose}</div>
          <div class="text-xs mt-1" style="color:var(--t3);">Dmax: ${rx} cGy</div>
        </div>
      </div>
      <div class="text-xs leading-relaxed" style="color:var(--t2);">
        ${ep.name} 特性：
        Dmax ≈ <span class="mono">${ep.dmax}</span> cm ·
        R₅₀ ≈ <span class="mono">${ep.r50}</span> cm ·
        Rp ≈ <span class="mono">${ep.rp}</span> cm ·
        治療深度目標 ≈ <span class="mono">${(parseInt(en)/4).toFixed(1)}</span> cm
      </div>
    </div>`);
  };

  // ── 5. MU Calculator (photon, SSD/SAD) ───────────────────
  const MU_ICON = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="5" width="14" height="9" rx="1.5"/>
    <line x1="6" y1="5" x2="6" y2="2"/><line x1="12" y1="5" x2="12" y2="2"/>
    <line x1="6" y1="10" x2="12" y2="10"/><line x1="9" y1="7.5" x2="9" y2="12.5"/>
  </svg>`;

  function renderMU() {
    const body = `
      <div class="text-xs mb-3 px-1" style="color:var(--t3);">光子線手動 MU 估算（SSD 或 SAD 技術）</div>
      ${stepper('mu-dose','處方劑量 (cGy)',200,1,5000,10,'cGy')}
      ${stepper('mu-pdd','PDD / TMR (%)',90,10,110,0.5,'%')}
      ${stepper('mu-of','Field Size Output Factor',1.00,0.7,1.2,0.01,'')}
      ${stepper('mu-sc','Sc (Collimator Scatter)',1.00,0.8,1.2,0.01,'')}
      ${stepper('mu-wedge','Wedge Factor (1.0=無 wedge)',1.00,0.1,1.0,0.01,'')}
      ${stepper('mu-tray','Tray Factor (1.0=無托盤)',1.00,0.8,1.0,0.01,'')}
      ${stepper('mu-dr','Dose Rate (cGy/MU)',1.00,0.5,1.5,0.01,'cGy/MU')}
      <button class="calc-btn" onclick="calcMU()">計算 MU</button>
      <div id="mu-result"></div>`;
    return cardWrap('mu-calc', MU_ICON, 'MU 計算（光子線）', body);
  }

  window.calcMU = function() {
    const dose   = v('mu-dose');
    const pdd    = v('mu-pdd') / 100;
    const of     = v('mu-of');
    const sc     = v('mu-sc');
    const wedge  = v('mu-wedge');
    const tray   = v('mu-tray');
    const dr     = v('mu-dr');
    if (!dose || !pdd || !dr) return;

    const composite = pdd * of * sc * wedge * tray * dr;
    const mu = composite > 0 ? dose / composite : 0;

    setH('mu-result', `
    <div class="result-panel" id="mu-result">
      <div class="flex items-end gap-2 mb-3">
        <span class="mono font-bold" style="font-size:32px;color:var(--t1);">${Math.round(mu)}</span>
        <span class="text-sm mb-1" style="color:var(--t2);">MU</span>
      </div>
      <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-xs" style="color:var(--t2);">
        <div>處方: <span class="mono">${dose} cGy</span></div>
        <div>Composite Factor: <span class="mono">${composite.toFixed(4)}</span></div>
        <div>PDD/TMR: <span class="mono">${(pdd*100).toFixed(1)}%</span></div>
        <div>Output Factor: <span class="mono">${of}</span></div>
        <div>Wedge: <span class="mono">${wedge}</span></div>
        <div>Tray: <span class="mono">${tray}</span></div>
      </div>
    </div>`);
  };

  // ── 6. SSD Correction (Mayneord Factor) ──────────────────
  const SSD_ICON = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
    <line x1="9" y1="2" x2="9" y2="16" stroke-dasharray="2 1.5"/>
    <path d="M5 5 L9 2 L13 5"/><path d="M5 13 L9 16 L13 13"/>
    <circle cx="9" cy="9" r="1.5"/>
  </svg>`;

  function renderSSD() {
    const body = `
      <div class="text-xs mb-3 px-1" style="color:var(--t3);">Mayneord F-factor，修正不同 SSD 下的 PDD</div>
      ${stepper('ssd-ref','參考 SSD (cm)',100,50,200,5,'cm')}
      ${stepper('ssd-new','實際 SSD (cm)',110,50,200,5,'cm')}
      ${stepper('ssd-depth','深度 d (cm)',10,1,30,0.5,'cm')}
      ${stepper('ssd-dmax','Dmax 深度 (cm)',1.5,0.3,5,0.1,'cm')}
      <button class="calc-btn" onclick="calcSSD()">計算 F-factor</button>
      <div id="ssd-result"></div>`;
    return cardWrap('ssd-corr', SSD_ICON, 'SSD 修正（Mayneord F-factor）', body);
  }

  window.calcSSD = function() {
    const f1 = v('ssd-ref'), f2 = v('ssd-new');
    const d  = v('ssd-depth'), dm = v('ssd-dmax');
    if (!f1||!f2||!d) return;
    const F = Math.pow((f2+dm)/(f1+dm), 2) * Math.pow((f1+d)/(f2+d), 2);
    const note = F > 1 ? '實際 SSD 較長 → PDD 提高' : '實際 SSD 較短 → PDD 降低';

    setH('ssd-result', `
    <div class="result-panel" id="ssd-result">
      <div class="flex items-end gap-2 mb-2">
        <span class="sec-label mb-0">F-factor</span>
      </div>
      <div class="flex items-end gap-2">
        <span class="mono font-bold" style="font-size:28px;color:var(--t1);">${F.toFixed(4)}</span>
      </div>
      <div class="mt-2 text-xs" style="color:var(--t2);">${note}</div>
      <div class="mt-1 text-xs" style="color:var(--t3);">PDD(${f2}cm SSD) ≈ PDD(${f1}cm SSD) × ${F.toFixed(3)}</div>
    </div>`);
  };

  // ── 7. Inverse Square Law ─────────────────────────────────
  const ISL_ICON = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
    <path d="M9 3 L15 15"/><path d="M9 3 L3 15"/>
    <line x1="3" y1="15" x2="15" y2="15"/>
    <circle cx="9" cy="3" r="1" fill="currentColor"/>
  </svg>`;

  function renderISL() {
    const body = `
      ${stepper('isl-d1','已知距離 d₁ (cm)',100,1,500,5,'cm')}
      ${stepper('isl-dose1','d₁ 的劑量率 (cGy/min)',100,1,9999,10,'cGy/min')}
      ${stepper('isl-d2','求 d₂ (cm)',150,1,500,5,'cm')}
      <button class="calc-btn" onclick="calcISL()">計算</button>
      <div id="isl-result"></div>`;
    return cardWrap('isl', ISL_ICON, '平方反比定律 (ISL)', body);
  }

  window.calcISL = function() {
    const d1 = v('isl-d1'), dose1 = v('isl-dose1'), d2 = v('isl-d2');
    if (!d1||!dose1||!d2) return;
    const dose2 = dose1 * Math.pow(d1/d2, 2);
    const ratio  = Math.pow(d1/d2, 2);
    setH('isl-result', `
    <div class="result-panel" id="isl-result">
      <div class="flex items-end gap-2 mb-2">
        <span class="mono font-bold" style="font-size:28px;color:var(--accent);">${dose2.toFixed(2)}</span>
        <span class="text-sm mb-1" style="color:var(--t2);">cGy/min at ${d2} cm</span>
      </div>
      <div class="text-xs" style="color:var(--t2);">
        比值: (${d1}/${d2})² = <span class="mono">${ratio.toFixed(4)}</span>
      </div>
    </div>`);
  };

  // ── 8. Tissue Equivalent Thickness (Photon HVL) ──────────
  const HVL_ICON = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
    <rect x="7" y="2" width="4" height="14" rx="1" fill="currentColor" fill-opacity=".1" stroke="currentColor"/>
    <line x1="2" y1="9" x2="7" y2="9" stroke-width="2"/>
    <line x1="11" y1="9" x2="16" y2="9" stroke-width="1" stroke-dasharray="2 1.5"/>
    <line x1="2" y1="7" x2="2" y2="11"/><line x1="16" y1="8" x2="16" y2="10"/>
  </svg>`;

  function renderHVL() {
    const body = `
      <div class="text-xs mb-3 px-1" style="color:var(--t3);">計算屏蔽厚度需要的半值層 (HVL) 與劑量衰減</div>
      ${stepper('hvl-val','HVL 厚度',3.0,0.1,20,0.1,'cm')}
      ${pills('hvl-mat','材質',[['pb','鉛 (Lead)'],['conc','混凝土'],['water','水/組織']],'pb')}
      ${stepper('hvl-d0','入射劑量 (相對單位)',100,1,9999,10,'')}
      ${stepper('hvl-thick','屏蔽厚度',10,0,100,1,'cm')}
      <button class="calc-btn" onclick="calcHVL()">計算穿透劑量</button>
      <div id="hvl-result"></div>`;
    return cardWrap('hvl', HVL_ICON, '屏蔽 / HVL 計算', body);
  }

  window.calcHVL = function() {
    const hvl    = v('hvl-val');
    const d0     = v('hvl-d0');
    const thick  = v('hvl-thick');
    if (!hvl||!d0) return;
    const n      = thick / hvl;          // number of HVLs
    const trans  = d0 * Math.pow(0.5, n);
    const atten  = (1 - trans/d0) * 100;
    const tvl    = hvl * (Math.log(10)/Math.log(2));

    setH('hvl-result', `
    <div class="result-panel" id="hvl-result">
      <div class="grid grid-cols-2 gap-3 mb-3">
        <div style="background:var(--bg);border-radius:10px;padding:12px;">
          <div class="text-xs mb-0.5" style="color:var(--t3);">穿透劑量</div>
          <div class="mono font-bold" style="font-size:20px;color:var(--t1);">${trans.toFixed(2)}</div>
        </div>
        <div style="background:var(--acc-bg);border-radius:10px;padding:12px;border:1px solid var(--border);">
          <div class="text-xs mb-0.5" style="color:var(--t2);">衰減</div>
          <div class="mono font-bold" style="font-size:20px;color:var(--accent);">${atten.toFixed(1)}%</div>
        </div>
      </div>
      <div class="text-xs" style="color:var(--t2);">
        HVL 層數: <span class="mono">${n.toFixed(2)}</span> ·
        TVL ≈ <span class="mono">${tvl.toFixed(1)}</span> cm
      </div>
    </div>`);
  };

