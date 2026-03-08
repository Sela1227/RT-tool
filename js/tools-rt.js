// ── ToolsRT — 放療計算工具 (8 tools, all inside IIFE) ─────
const ToolsRT = (() => {

  const v  = id => parseFloat(document.getElementById(id)?.value) || 0;
  const el = id => document.getElementById(id);
  const setH = (id, html) => { const e = el(id); if (e) e.outerHTML = html; };

  window.stepAdj = function(id, delta, min, max) {
    const inp = el(id); if (!inp) return;
    const val = Math.min(max, Math.max(min, parseFloat(((parseFloat(inp.value)||0)+delta).toFixed(4))));
    inp.value = val; inp.dispatchEvent(new Event('input'));
  };
  window.stepClamp = function(inp, min, max) {
    const val = parseFloat(inp.value);
    if (!isNaN(val)) inp.value = Math.min(max, Math.max(min, val));
  };
  window.pillSelect = function(groupId, btn) {
    document.querySelectorAll(`[data-group="${groupId}"]`).forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const h = el(groupId); if (h) h.value = btn.dataset.val;
  };
  window.RTToggle = function(id) {
    const b = el(id+'-body'), c = el(id+'-chev');
    if (!b) return;
    const open = !b.classList.contains('hidden');
    b.classList.toggle('hidden', open);
    if (c) c.style.transform = open ? '' : 'rotate(180deg)';
  };

  function stepper(id, label, def, min, max, step, unit='') {
    return `<div class="mb-3">
      <div class="text-xs mb-1.5" style="color:var(--t2);">${label}</div>
      <div class="flex items-center gap-2">
        <button class="step-btn" onclick="stepAdj('${id}',${-step},${min},${max})">−</button>
        <input type="number" id="${id}" value="${def}" min="${min}" max="${max}" step="${step}"
          class="inp text-center mono flex-1" style="font-size:15px;" oninput="stepClamp(this,${min},${max})">
        <button class="step-btn" onclick="stepAdj('${id}',${step},${min},${max})">+</button>
        ${unit?`<span class="text-xs mono" style="color:var(--t2);min-width:28px;">${unit}</span>`:''}
      </div>
    </div>`;
  }

  function pills(id, label, opts, def) {
    return `<div class="mb-3">
      <div class="text-xs mb-1.5" style="color:var(--t2);">${label}</div>
      <div class="flex flex-wrap gap-1.5">
        ${opts.map(([val,txt])=>`<button class="pill-opt${val==def?' active':''}" data-val="${val}" data-group="${id}" onclick="pillSelect('${id}',this)">${txt}</button>`).join('')}
      </div>
      <input type="hidden" id="${id}" value="${def}">
    </div>`;
  }

  function cardWrap(id, icon, title, body) {
    return `<div class="card mb-3 overflow-hidden">
      <button onclick="RTToggle('${id}')" class="w-full px-4 py-3 flex items-center justify-between text-left">
        <div class="flex items-center gap-2.5">
          <span class="flex-shrink-0 w-5 h-5 flex items-center justify-center" style="color:var(--t2);">${icon}</span>
          <span class="font-medium text-sm" style="color:var(--t1);">${title}</span>
        </div>
        <svg id="${id}-chev" class="w-4 h-4 flex-shrink-0" style="color:var(--t3);transition:transform .2s" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <div id="${id}-body" class="hidden px-4 pb-4">${body}</div>
    </div>`;
  }

  // ─── 1. BED / EQD2 ───────────────────────────────────────
  function renderBED() {
    return cardWrap('bed',
      `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 14 C3 8 6 4 9 4 C12 4 15 8 16 14"/><line x1="2" y1="14" x2="16" y2="14"/></svg>`,
      'BED / EQD2',
      `<div class="text-xs mb-3" style="color:var(--t3);">一組方案自動顯示三種組織的 BED 與 EQD2</div>
      ${stepper('bed-dpf','每次劑量 (Dose/fx)',2,0.5,20,0.5,'Gy')}
      ${stepper('bed-n','分次數 (Fractions)',25,1,60,1,'fx')}
      <button class="calc-btn" onclick="calcBED()">計算</button>
      <div id="bed-result"></div>`
    );
  }
  window.calcBED = function() {
    const d=v('bed-dpf'), n=v('bed-n'); if(!d||!n) return;
    const total=d*n;
    const rows=[{name:'腫瘤',ab:10,note:'α/β=10'},{name:'晚期反應',ab:3,note:'α/β=3'},{name:'脊髓/神經',ab:1.5,note:'α/β=1.5'}].map(t=>{
      const bed=total*(1+d/t.ab), eqd2=bed/(1+2/t.ab);
      return `<tr><td class="py-2 pr-2"><div style="font-weight:500;font-size:13px;color:var(--t1);">${t.name}</div><div style="color:var(--t3);font-size:11px;">${t.note}</div></td>
        <td class="py-2 text-center mono" style="font-size:16px;font-weight:500;color:var(--t1);">${bed.toFixed(1)}</td>
        <td class="py-2 text-center mono" style="font-size:16px;font-weight:500;color:var(--accent);">${eqd2.toFixed(1)}</td></tr>`;
    }).join('');
    setH('bed-result',`<div class="result-panel" id="bed-result">
      <div class="text-xs mb-2" style="color:var(--t2);">方案：<span class="mono">${total.toFixed(1)} Gy / ${n} fx (${d} Gy/fx)</span></div>
      <table class="w-full" style="border-collapse:collapse;">
        <thead><tr style="border-bottom:1px solid var(--border);">
          <th class="pb-2 text-left text-xs" style="color:var(--t3);font-weight:500;">組織</th>
          <th class="pb-2 text-center text-xs" style="color:var(--t3);font-weight:500;">BED</th>
          <th class="pb-2 text-center text-xs" style="color:var(--accent);font-weight:500;">EQD2</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table></div>`);
  };

  // ─── 2. Treatment Gap ────────────────────────────────────
  function renderTreatmentGap() {
    return cardWrap('gap',
      `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="2" y="4" width="5" height="11" rx="1"/><rect x="11" y="4" width="5" height="11" rx="1"/><line x1="8" y1="9.5" x2="10" y2="9.5" stroke-dasharray="1 1.5"/></svg>`,
      'Treatment Gap Correction',
      `${stepper('gap-days','中斷天數',5,1,30,1,'天')}
      ${pills('gap-site','腫瘤部位',[['hn','頭頸（0.6 Gy/天）'],['other','其他（0.5 Gy/天）']],'hn')}
      ${stepper('gap-custom','自訂補充劑量/天（0=使用預設）',0,0,2,0.1,'Gy')}
      <button class="calc-btn" onclick="calcGap()">計算</button>
      <div id="gap-result"></div>`
    );
  }
  window.calcGap = function() {
    const days=v('gap-days'), site=el('gap-site')?.value||'hn', custom=v('gap-custom');
    const rate=custom>0?custom:(site==='hn'?0.6:0.5);
    const extra=days*rate;
    setH('gap-result',`<div class="result-panel" id="gap-result">
      <div class="sec-label mb-1">補充劑量</div>
      <div class="flex items-end gap-2"><span class="result-val">${extra.toFixed(1)}</span><span class="text-sm mb-0.5" style="color:var(--t2);">Gy 追加</span></div>
      <div class="mt-2 text-xs" style="color:var(--t2);">${days} 天 × ${rate} Gy/天</div>
    </div>`);
  };

  // ─── 3. Hypofractionation ────────────────────────────────
  function renderHypofrac() {
    return cardWrap('hypo',
      `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="2,14 5,8 8,11 11,5 14,9 16,4"/><line x1="2" y1="16" x2="16" y2="16"/></svg>`,
      'Hypofractionation Converter',
      `<div class="sec-label mb-2">原始方案</div>
      ${stepper('hypo-dpf1','每次劑量',2,0.5,20,0.5,'Gy')}
      ${stepper('hypo-n1','分次數',25,1,60,1,'fx')}
      <div class="sec-label mb-2 mt-1">目標方案</div>
      ${stepper('hypo-dpf2','每次劑量',3,0.5,20,0.5,'Gy')}
      ${pills('hypo-ab','α/β',[['10','10（腫瘤）'],['3','3（晚期）'],['1.5','1.5（神經）']],'10')}
      <button class="calc-btn" onclick="calcHypo()">計算等效分次數</button>
      <div id="hypo-result"></div>`
    );
  }
  window.calcHypo = function() {
    const d1=v('hypo-dpf1'), n1=v('hypo-n1'), d2=v('hypo-dpf2');
    const ab=parseFloat(el('hypo-ab')?.value)||10;
    if(!d1||!n1||!d2) return;
    const bed=d1*n1*(1+d1/ab), n2=bed/(d2*(1+d2/ab));
    setH('hypo-result',`<div class="result-panel" id="hypo-result">
      <div class="sec-label mb-3">等效結果（α/β=${ab}）</div>
      <div class="grid grid-cols-2 gap-3">
        <div style="background:var(--bg);border-radius:10px;padding:12px;">
          <div class="text-xs mb-1" style="color:var(--t3);">原始</div>
          <div class="mono" style="font-size:18px;font-weight:500;color:var(--t1);">${(d1*n1).toFixed(0)} Gy</div>
          <div class="text-xs mt-0.5" style="color:var(--t2);">${n1}fx × ${d1}Gy</div>
        </div>
        <div style="background:var(--acc-bg);border-radius:10px;padding:12px;border:1px solid var(--border);">
          <div class="text-xs mb-1" style="color:var(--t2);">目標</div>
          <div class="mono" style="font-size:18px;font-weight:500;color:var(--accent);">${(d2*n2).toFixed(1)} Gy</div>
          <div class="text-xs mt-0.5" style="color:var(--t2);">${n2.toFixed(1)}fx × ${d2}Gy</div>
        </div>
      </div>
      <div class="mt-2 text-xs" style="color:var(--t3);">BED = ${bed.toFixed(1)} Gy</div>
    </div>`);
  };

  // ─── 4. Electron Depth Dose ──────────────────────────────
  const E_DATA = {
    '4':{r50:1.5,rp:2.0,dmax:0.8},'6':{r50:2.3,rp:3.0,dmax:1.3},
    '9':{r50:3.5,rp:4.5,dmax:2.0},'12':{r50:4.7,rp:6.0,dmax:2.5},
    '15':{r50:5.9,rp:7.5,dmax:2.5},'18':{r50:7.1,rp:9.0,dmax:2.0},'20':{r50:7.9,rp:10.0,dmax:2.0}
  };
  function renderElectron() {
    return cardWrap('electron',
      `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="9" cy="9" r="2"/><path d="M9 2v2M9 14v2M2 9h2M14 9h2M4.22 4.22l1.42 1.42M12.36 12.36l1.42 1.42M4.22 13.78l1.42-1.42M12.36 5.64l1.42-1.42"/></svg>`,
      '電子線劑量計算',
      `<div class="text-xs mb-3" style="color:var(--t3);">IAEA TRS-398 近似值 — 臨床請依實機測量</div>
      ${pills('el-energy','能量',[['4','4MeV'],['6','6MeV'],['9','9MeV'],['12','12MeV'],['15','15MeV'],['18','18MeV'],['20','20MeV']],'9')}
      ${stepper('el-depth','查詢深度',2.0,0,15,0.5,'cm')}
      ${stepper('el-mu','Monitor Units',100,1,999,1,'MU')}
      ${stepper('el-of','Output Factor (cGy/MU)',1.00,0.5,1.5,0.01,'')}
      <button class="calc-btn" onclick="calcElectron()">計算</button>
      <div id="el-result"></div>`
    );
  }
  window.calcElectron = function() {
    const en=el('el-energy')?.value||'9', d=v('el-depth'), mu=v('el-mu'), of=v('el-of');
    const ep=E_DATA[en]; if(!ep) return;
    let pdd;
    if(d<=ep.dmax)     pdd=100*(1-0.03*(ep.dmax-d));
    else if(d<=ep.r50) pdd=100*Math.exp(-0.693*(d-ep.dmax)/(ep.r50-ep.dmax));
    else if(d<=ep.rp)  pdd=100*Math.max(0,(ep.rp-d)/(ep.rp-ep.r50)*50);
    else               pdd=0;
    pdd=Math.min(100,Math.max(0,pdd));
    const dose=(mu*of*pdd/100).toFixed(1), rx=(mu*of).toFixed(1);
    const bar=p=>`<div style="height:6px;border-radius:3px;background:var(--border);overflow:hidden;margin-top:4px;"><div style="width:${Math.round(p)}%;height:100%;background:var(--accent);border-radius:3px;"></div></div>`;
    setH('el-result',`<div class="result-panel" id="el-result">
      <div class="grid grid-cols-2 gap-3 mb-3">
        <div style="background:var(--bg);border-radius:10px;padding:12px;">
          <div class="text-xs mb-0.5" style="color:var(--t3);">PDD at ${d} cm</div>
          <div class="mono font-bold" style="font-size:20px;color:var(--t1);">${pdd.toFixed(1)}%</div>${bar(pdd)}
        </div>
        <div style="background:var(--acc-bg);border-radius:10px;padding:12px;border:1px solid var(--border);">
          <div class="text-xs mb-0.5" style="color:var(--t2);">劑量 (cGy)</div>
          <div class="mono font-bold" style="font-size:20px;color:var(--accent);">${dose}</div>
          <div class="text-xs mt-1" style="color:var(--t3);">Dmax: ${rx} cGy</div>
        </div>
      </div>
      <div class="text-xs" style="color:var(--t2);">${en} MeV — Dmax <span class="mono">${ep.dmax}</span> · R₅₀ <span class="mono">${ep.r50}</span> · Rp <span class="mono">${ep.rp}</span> cm · 治療深度目標 ≈ <span class="mono">${(parseInt(en)/4).toFixed(1)}</span> cm</div>
    </div>`);
  };

  // ─── 5. MU Calculator ────────────────────────────────────
  function renderMU() {
    return cardWrap('mu-calc',
      `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="14" height="9" rx="1.5"/><line x1="6" y1="5" x2="6" y2="2"/><line x1="12" y1="5" x2="12" y2="2"/><line x1="6" y1="10" x2="12" y2="10"/><line x1="9" y1="7.5" x2="9" y2="12.5"/></svg>`,
      'MU 計算（光子線）',
      `<div class="text-xs mb-3" style="color:var(--t3);">Dose ÷ (PDD × OF × Sc × Wedge × Tray × DR)</div>
      ${stepper('mu-dose','處方劑量',200,1,5000,10,'cGy')}
      ${stepper('mu-pdd','PDD / TMR (%)',90,10,110,0.5,'%')}
      ${stepper('mu-of','Field Output Factor',1.00,0.7,1.2,0.01,'')}
      ${stepper('mu-sc','Sc（Collimator Scatter）',1.00,0.8,1.2,0.01,'')}
      ${stepper('mu-wedge','Wedge Factor',1.00,0.1,1.0,0.01,'')}
      ${stepper('mu-tray','Tray Factor',1.00,0.8,1.0,0.01,'')}
      ${stepper('mu-dr','Dose Rate',1.00,0.5,1.5,0.01,'cGy/MU')}
      <button class="calc-btn" onclick="calcMU()">計算 MU</button>
      <div id="mu-result"></div>`
    );
  }
  window.calcMU = function() {
    const dose=v('mu-dose'), pdd=v('mu-pdd')/100, of=v('mu-of');
    const sc=v('mu-sc'), wedge=v('mu-wedge'), tray=v('mu-tray'), dr=v('mu-dr');
    if(!dose||!pdd||!dr) return;
    const comp=pdd*of*sc*wedge*tray*dr, mu=comp>0?dose/comp:0;
    setH('mu-result',`<div class="result-panel" id="mu-result">
      <div class="flex items-end gap-2 mb-3">
        <span class="mono font-bold" style="font-size:32px;color:var(--t1);">${Math.round(mu)}</span>
        <span class="text-sm mb-1" style="color:var(--t2);">MU</span>
      </div>
      <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-xs" style="color:var(--t2);">
        <div>處方: <span class="mono">${dose} cGy</span></div>
        <div>Composite: <span class="mono">${comp.toFixed(4)}</span></div>
        <div>PDD/TMR: <span class="mono">${(pdd*100).toFixed(1)}%</span></div>
        <div>Wedge×Tray: <span class="mono">${(wedge*tray).toFixed(3)}</span></div>
      </div>
    </div>`);
  };

  // ─── 6. SSD Correction ───────────────────────────────────
  function renderSSD() {
    return cardWrap('ssd-corr',
      `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="9" y1="2" x2="9" y2="16" stroke-dasharray="2 1.5"/><path d="M5 5 L9 2 L13 5"/><path d="M5 13 L9 16 L13 13"/><circle cx="9" cy="9" r="1.5"/></svg>`,
      'SSD 修正（Mayneord F-factor）',
      `<div class="text-xs mb-3" style="color:var(--t3);">修正不同 SSD 下的 PDD</div>
      ${stepper('ssd-ref','參考 SSD',100,50,200,5,'cm')}
      ${stepper('ssd-new','實際 SSD',110,50,200,5,'cm')}
      ${stepper('ssd-depth','深度 d',10,1,30,0.5,'cm')}
      ${stepper('ssd-dmax','Dmax 深度',1.5,0.3,5,0.1,'cm')}
      <button class="calc-btn" onclick="calcSSD()">計算 F-factor</button>
      <div id="ssd-result"></div>`
    );
  }
  window.calcSSD = function() {
    const f1=v('ssd-ref'), f2=v('ssd-new'), d=v('ssd-depth'), dm=v('ssd-dmax');
    if(!f1||!f2||!d) return;
    const F=Math.pow((f2+dm)/(f1+dm),2)*Math.pow((f1+d)/(f2+d),2);
    setH('ssd-result',`<div class="result-panel" id="ssd-result">
      <div class="sec-label mb-1">Mayneord F-factor</div>
      <div class="flex items-end gap-2 mb-2"><span class="mono font-bold" style="font-size:28px;color:var(--t1);">${F.toFixed(4)}</span></div>
      <div class="text-xs" style="color:var(--t2);">${F>1?'實際 SSD 較長 → PDD 提高':'實際 SSD 較短 → PDD 降低'}</div>
      <div class="text-xs mt-1" style="color:var(--t3);">PDD(${f2}cm) ≈ PDD(${f1}cm) × ${F.toFixed(3)}</div>
    </div>`);
  };

  // ─── 7. Inverse Square Law ───────────────────────────────
  function renderISL() {
    return cardWrap('isl',
      `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M9 3 L15 15"/><path d="M9 3 L3 15"/><line x1="3" y1="15" x2="15" y2="15"/><circle cx="9" cy="3" r="1" fill="currentColor"/></svg>`,
      '平方反比定律（ISL）',
      `${stepper('isl-d1','已知距離 d₁',100,1,500,5,'cm')}
      ${stepper('isl-dose1','d₁ 的劑量率',100,1,9999,10,'cGy/min')}
      ${stepper('isl-d2','求 d₂',150,1,500,5,'cm')}
      <button class="calc-btn" onclick="calcISL()">計算</button>
      <div id="isl-result"></div>`
    );
  }
  window.calcISL = function() {
    const d1=v('isl-d1'), dose1=v('isl-dose1'), d2=v('isl-d2');
    if(!d1||!dose1||!d2) return;
    const dose2=dose1*Math.pow(d1/d2,2);
    setH('isl-result',`<div class="result-panel" id="isl-result">
      <div class="flex items-end gap-2 mb-2">
        <span class="mono font-bold" style="font-size:28px;color:var(--accent);">${dose2.toFixed(2)}</span>
        <span class="text-sm mb-1" style="color:var(--t2);">cGy/min at ${d2} cm</span>
      </div>
      <div class="text-xs" style="color:var(--t2);">比值: (${d1}/${d2})² = <span class="mono">${Math.pow(d1/d2,2).toFixed(4)}</span></div>
    </div>`);
  };

  // ─── 8. HVL Shielding ────────────────────────────────────
  function renderHVL() {
    return cardWrap('hvl',
      `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="7" y="2" width="4" height="14" rx="1" fill="currentColor" fill-opacity=".12"/><line x1="2" y1="9" x2="7" y2="9" stroke-width="2"/><line x1="11" y1="9" x2="16" y2="9" stroke-width="1" stroke-dasharray="2 1.5"/></svg>`,
      '屏蔽 / HVL 計算',
      `${stepper('hvl-val','HVL 厚度',3.0,0.1,20,0.1,'cm')}
      ${stepper('hvl-d0','入射劑量（相對）',100,1,9999,10,'')}
      ${stepper('hvl-thick','屏蔽厚度',10,0,100,1,'cm')}
      <button class="calc-btn" onclick="calcHVL()">計算穿透劑量</button>
      <div id="hvl-result"></div>`
    );
  }
  window.calcHVL = function() {
    const hvl=v('hvl-val'), d0=v('hvl-d0'), thick=v('hvl-thick');
    if(!hvl||!d0) return;
    const n=thick/hvl, trans=d0*Math.pow(0.5,n), atten=(1-trans/d0)*100, tvl=hvl*(Math.log(10)/Math.log(2));
    setH('hvl-result',`<div class="result-panel" id="hvl-result">
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
      <div class="text-xs" style="color:var(--t2);">HVL 層數: <span class="mono">${n.toFixed(2)}</span> · TVL ≈ <span class="mono">${tvl.toFixed(1)}</span> cm</div>
    </div>`);
  };

  // ─── Render ───────────────────────────────────────────────
  function render(settings) {
    const en = settings?.enabledTools || {};
    const allTools = [
      {key:'bed',       fn:renderBED,       label:'BED/EQD2'},
      {key:'treatmentgap',fn:renderTreatmentGap,label:'Gap 修正'},
      {key:'hypofrac',  fn:renderHypofrac,  label:'分次換算'},
      {key:'electron',  fn:renderElectron,  label:'電子線'},
      {key:'mu-calc',   fn:renderMU,        label:'MU 計算'},
      {key:'ssd-corr',  fn:renderSSD,       label:'SSD 修正'},
      {key:'isl',       fn:renderISL,       label:'ISL'},
      {key:'hvl',       fn:renderHVL,       label:'HVL 屏蔽'},
    ];
    const visible = allTools.filter(t => en[t.key] !== false);
    if (!visible.length) return `<div class="text-center text-sm py-8" style="color:var(--t3);">放療工具已全部關閉</div>`;
    const index = `<div class="flex flex-wrap gap-1.5 mb-3">${
      visible.map(t=>`<button onclick="jumpTo('${t.key}')" class="text-xs px-2.5 py-1 rounded-full" style="background:var(--acc-bg);color:var(--accent);border:1px solid var(--border);">${t.label}</button>`).join('')
    }</div>`;
    return index + visible.map(t => t.fn()).join('');
  }

  return { render };
})();
