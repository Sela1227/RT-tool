// ── ToolsRT — 放療計算工具 (8 tools) ─────────────────────
// Depends on utils.js (gel, numVal, U.*, stepAdj, stepClamp, pillSelect, toggleCard)
const ToolsRT = (() => {

  // ─── 1. BED / EQD2 ───────────────────────────────────────
  function renderBED() {
    const body = `
      ${U.stepper('bed-dpf','每次劑量 (Dose/fx)',2,0.5,20,0.5,'Gy')}
      ${U.stepper('bed-n','分次數 (Fractions)',25,1,60,1,'fx')}
      <div class="mb-3">
        <div class="text-xs mb-1.5" style="color:var(--t2);">自訂 α/β（選填，會加入結果列）</div>
        <div class="flex items-center gap-2">
          <button class="step-btn" onclick="stepAdj('bed-custom-ab',-.1,0.1,30)">−</button>
          <input type="number" id="bed-custom-ab" placeholder="—" step="0.1" min="0.1" max="30"
            class="inp text-center mono flex-1" style="font-size:15px;" oninput="calcBED()">
          <button class="step-btn" onclick="stepAdj('bed-custom-ab',.1,0.1,30)">+</button>
          <span class="text-xs mono flex-shrink-0" style="color:var(--t2);min-width:28px;"></span>
        </div>
      </div>
      <div id="bed-result"></div>
      ${U.calcBtn('calcBED()')}`;
    return U.cardWrap('bed',
      `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 14 C3 8 6 4 9 4 C12 4 15 8 16 14"/><line x1="2" y1="14" x2="16" y2="14"/></svg>`,
      'BED / EQD2', body);
  }
  window.calcBED = function() {
    const dpf = numVal('bed-dpf'), n = numVal('bed-n');
    const totalD = dpf * n;
    const customInput = gel('bed-custom-ab');
    const customAB = customInput && customInput.value !== '' ? parseFloat(customInput.value) : null;
    const makeRow = (ab, highlight) => {
      const bed = totalD * (1 + dpf/ab);
      const eqd2 = bed / (1 + 2/ab);
      const c1 = highlight ? 'var(--accent)' : 'var(--t2)';
      const c2 = highlight ? 'var(--accent)' : 'var(--t1)';
      const bg = highlight ? 'background:var(--acc-bg);' : '';
      return `<tr style="${bg}">
        <td class="py-1 text-xs${highlight?' font-semibold':''}" style="color:${c1};">α/β = ${ab}</td>
        <td class="py-1 text-xs text-right mono font-semibold" style="color:${c2};">${bed.toFixed(1)} Gy</td>
        <td class="py-1 text-xs text-right mono font-semibold" style="color:${c2};">${eqd2.toFixed(1)} Gy</td>
      </tr>`;
    };
    const rows = [10, 3, 1.5].map(ab => makeRow(ab, false)).join('')
      + (customAB && customAB > 0 ? makeRow(customAB, true) : '');
    const html = `<div class="result-panel" id="bed-result">
      <div class="text-xs mb-2" style="color:var(--t3);">Total ${totalD} Gy / ${n} fx (${dpf} Gy/fx)</div>
      <table class="w-full"><thead><tr>
        <th class="text-left text-xs pb-1" style="color:var(--t3);">α/β</th>
        <th class="text-right text-xs pb-1" style="color:var(--t3);">BED</th>
        <th class="text-right text-xs pb-1" style="color:var(--t3);">EQD2</th>
      </tr></thead><tbody>${rows}</tbody></table>
    </div>`;
    const e = gel('bed-result'); if (e) e.outerHTML = html;
  };

  // ─── 2. Treatment Gap Correction ─────────────────────────
  function renderGap() {
    const body = `
      ${U.stepper('gap-total','處方總劑量',70,10,120,1,'Gy')}
      ${U.stepper('gap-days','中斷天數',5,1,30,1,'days')}
      ${U.pills('gap-site','部位',[['hn','H&N (0.6)'],['other','其他 (0.5)']],'hn')}
      <div id="gap-custom-row">${U.stepper('gap-custom-rate','每日補償劑量率',0.6,0.1,1.5,0.1,'Gy/day')}</div>
      <div id="gap-result"></div>
      ${U.calcBtn('calcGap()')}`;
    return U.cardWrap('gap',
      `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 9h5M11 9h5" stroke-linecap="round"/><path d="M8.5 5v8M9.5 5v8" stroke-linecap="round"/></svg>`,
      'Treatment Gap Correction', body);
  }
  window.calcGap = function() {
    const total = numVal('gap-total'), days = numVal('gap-days');
    const site = gel('gap-site')?.value || 'hn';
    const rate = site === 'hn' ? 0.6 : 0.5;
    const extra = (rate * days).toFixed(1);
    const newTotal = (total + parseFloat(extra)).toFixed(1);
    const html = `<div class="result-panel">
      <div class="sec-label mb-1">補償劑量</div>
      <div class="result-val">+${extra} Gy</div>
      <div class="text-xs mt-1" style="color:var(--t2);">新處方總劑量：${newTotal} Gy（${days} 天 × ${rate} Gy/天）</div>
    </div>`;
    const e = gel('gap-result'); if (e) e.outerHTML = html;
  };

  // ─── 3. Hypofractionation Converter ──────────────────────
  function renderHypo() {
    const body = `
      ${U.stepper('hyp-d','原總劑量',60,1,120,1,'Gy')}
      ${U.stepper('hyp-n','原分次數',30,1,60,1,'fx')}
      ${U.pills('hyp-ab','α/β',[['10','α/β=10'],['3','α/β=3'],['1.5','α/β=1.5'],['custom','自訂']],10,'onHypAbChange')}
      <div id="hyp-custom-row" class="hidden">${U.stepper('hyp-custom-ab','自訂 α/β',2,0.1,20,0.1)}</div>
      ${U.stepper('hyp-new-n','目標分次數',5,1,60,1,'fx')}
      <div id="hyp-result"></div>
      ${U.calcBtn('calcHypo()')}`;
    return U.cardWrap('hypo',
      `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M3 15 L7 5 L11 12 L13 8 L16 15"/></svg>`,
      'Hypofractionation Converter', body);
  }
  window.calcHypo = function() {
    const d = numVal('hyp-d'), n = numVal('hyp-n'), newN = numVal('hyp-new-n');
    const abMode = gel('hyp-ab')?.value || '10';
    const ab = abMode === 'custom' ? numVal('hyp-custom-ab') : parseFloat(abMode);

    const dpf = d / n;
    const bed = d * (1 + dpf/ab);
    const newDpf = (-ab + Math.sqrt(ab*ab + 4*ab*(bed/newN))) / 2;
    const newTotal = (newDpf * newN).toFixed(2);
    const html = `<div class="result-panel">
      <div class="text-xs mb-2" style="color:var(--t3);">BED = ${bed.toFixed(1)} Gy (α/β=${ab})</div>
      <div class="sec-label mb-1">等效新方案</div>
      <div class="result-val">${newTotal} Gy</div>
      <div class="text-xs mt-1" style="color:var(--t2);">${newN} fx × ${newDpf.toFixed(3)} Gy/fx</div>
    </div>`;
    const e = gel('hyp-result'); if (e) e.outerHTML = html;
  };

  // ─── 4. Electron Dose ────────────────────────────────────
  function renderElectron() {
    const body = `
      ${U.stepper('el-energy','電子線能量',9,4,20,1,'MeV')}
      ${U.stepper('el-dose','處方劑量',50,1,80,1,'Gy')}
      ${U.stepper('el-ssd','治療 SSD',100,80,120,1,'cm')}
      <div id="el-result"></div>
      ${U.calcBtn('calcElectron()')}`;
    return U.cardWrap('electron',
      `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="9" r="2.5"/><path d="M9 2v3M9 13v3M2 9h3M13 9h3" stroke-linecap="round"/><path d="M4.2 4.2l2.1 2.1M11.7 11.7l2.1 2.1M4.2 13.8l2.1-2.1M11.7 6.3l2.1-2.1" stroke-linecap="round"/></svg>`,
      '電子線劑量計算', body);
  }
  window.calcElectron = function() {
    const E = numVal('el-energy'), dose = numVal('el-dose'), ssd = numVal('el-ssd');
    const r50  = (E / 3.3).toFixed(1);
    const rp   = (E / 2.0).toFixed(1);
    const d100 = (E / 4.0).toFixed(1);
    const d90  = (E / 4.5).toFixed(1);
    const d80  = (E / 5.0).toFixed(1);
    const ssdFactor = (100/ssd) * (100/ssd);
    const muPer100 = (ssdFactor * 100).toFixed(0);
    const html = `<div class="result-panel">
      <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <div style="color:var(--t2);">R₅₀ (50% isodose depth)</div><div class="mono text-right">${r50} cm</div>
        <div style="color:var(--t2);">Rₚ (practical range)</div><div class="mono text-right">${rp} cm</div>
        <div style="color:var(--t2);">D₁₀₀ (Dmax depth)</div><div class="mono text-right">${d100} cm</div>
        <div style="color:var(--t2);">D₉₀ depth</div><div class="mono text-right">${d90} cm</div>
        <div style="color:var(--t2);">D₈₀ depth</div><div class="mono text-right">${d80} cm</div>
        <div style="color:var(--t2);">SSD factor (${ssd} cm)</div><div class="mono text-right">${ssdFactor.toFixed(4)}</div>
      </div>
    </div>`;
    const e = gel('el-result'); if (e) e.outerHTML = html;
  };

  // ─── 5. MU Calculation ───────────────────────────────────
  function renderMU() {
    const body = `
      ${U.stepper('mu-dose','處方劑量',200,10,1000,1,'cGy')}
      ${U.stepper('mu-of','Output Factor',1.000,0.500,1.500,0.001)}
      ${U.stepper('mu-sc','Sc (頭散射)',1.000,0.900,1.100,0.001)}
      ${U.stepper('mu-sp','Sp (體模散射)',1.000,0.900,1.100,0.001)}
      ${U.stepper('mu-pdd','PDD (%)',95.0,50,105,0.1,'%')}
      ${U.stepper('mu-isf','ISL 因子',1.000,0.500,2.000,0.001)}
      ${U.stepper('mu-cf','其他修正係數',1.000,0.500,2.000,0.001)}
      <div id="mu-result"></div>
      ${U.calcBtn('calcMU()')}`;
    return U.cardWrap('mu-calc',
      `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="2" y="3" width="14" height="12" rx="2"/><path d="M6 9h6M9 6v6"/></svg>`,
      'MU 計算（光子線）', body);
  }
  window.calcMU = function() {
    const dose = numVal('mu-dose'), of = numVal('mu-of'), sc = numVal('mu-sc');
    const sp = numVal('mu-sp'), pdd = numVal('mu-pdd'), isf = numVal('mu-isf'), cf = numVal('mu-cf');
    const mu = dose / (of * sc * sp * (pdd/100) * isf * cf);
    const html = `<div class="result-panel">
      <div class="sec-label mb-1">Monitor Units</div>
      <div class="result-val">${mu.toFixed(1)} MU</div>
      <div class="text-xs mt-1" style="color:var(--t2);">= ${dose} / (${of}×${sc}×${sp}×${(pdd/100).toFixed(3)}×${isf}×${cf})</div>
    </div>`;
    const e = gel('mu-result'); if (e) e.outerHTML = html;
  };

  // ─── 6. SSD Correction ───────────────────────────────────
  function renderSSD() {
    const body = `
      ${U.stepper('ssd-cal','校正 SSD (SAD)',100,80,150,1,'cm')}
      ${U.stepper('ssd-treat','治療 SSD',110,80,150,1,'cm')}
      ${U.stepper('ssd-dose','原處方劑量',200,1,1000,1,'cGy')}
      <div id="ssd-result"></div>
      ${U.calcBtn('calcSSD()')}`;
    return U.cardWrap('ssd-corr',
      `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M9 2 L9 16"/><path d="M4 6 L14 6"/><path d="M2 12 L16 12"/></svg>`,
      'SSD 修正（Mayneord）', body);
  }
  window.calcSSD = function() {
    const ssdCal = numVal('ssd-cal'), ssdTreat = numVal('ssd-treat'), dose = numVal('ssd-dose');
    const f = ((ssdTreat / ssdCal) ** 2);
    const corrDose = (dose * f).toFixed(1);
    const html = `<div class="result-panel">
      <div class="sec-label mb-1">修正後劑量</div>
      <div class="result-val">${corrDose} cGy</div>
      <div class="text-xs mt-1" style="color:var(--t2);">Mayneord factor: ${f.toFixed(4)}（${ssdTreat}/${ssdCal}）²</div>
    </div>`;
    const e = gel('ssd-result'); if (e) e.outerHTML = html;
  };

  // ─── 7. ISL ──────────────────────────────────────────────
  function renderISL() {
    const body = `
      ${U.stepper('isl-d1','已知距離 d₁',100,1,500,1,'cm')}
      ${U.stepper('isl-i1','已知劑量率 I₁',200,1,10000,1,'cGy/min')}
      ${U.stepper('isl-d2','目標距離 d₂',120,1,500,1,'cm')}
      <div id="isl-result"></div>
      ${U.calcBtn('calcISL()')}`;
    return U.cardWrap('isl',
      `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="4" cy="9" r="2"/><path d="M6 9 L12 9" stroke-linecap="round"/><path d="M13 6 L16 9 L13 12" stroke-linecap="round"/></svg>`,
      '平方反比定律', body);
  }
  window.calcISL = function() {
    const d1 = numVal('isl-d1'), i1 = numVal('isl-i1'), d2 = numVal('isl-d2');
    const i2 = i1 * (d1/d2)**2;
    const html = `<div class="result-panel">
      <div class="sec-label mb-1">I₂ 劑量率</div>
      <div class="result-val">${i2.toFixed(2)} cGy/min</div>
      <div class="text-xs mt-1" style="color:var(--t2);">I₂ = ${i1} × (${d1}/${d2})² = ${i2.toFixed(2)}</div>
    </div>`;
    const e = gel('isl-result'); if (e) e.outerHTML = html;
  };

  // ─── 8. HVL Shielding ────────────────────────────────────
  function renderHVL() {
    const body = `
      ${U.stepper('hvl-val','HVL 值',1.0,0.01,50,0.01,'cm')}
      ${U.stepper('hvl-thick','屏蔽厚度',5.0,0,100,0.1,'cm')}
      ${U.stepper('hvl-dose','入射劑量率',100,1,100000,1,'cGy/min')}
      <div id="hvl-result"></div>
      ${U.calcBtn('calcHVL()')}`;
    return U.cardWrap('hvl',
      `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="7" y="2" width="4" height="14" rx="1"/><path d="M2 9 L7 9M11 9 L16 9" stroke-linecap="round"/></svg>`,
      '屏蔽 / HVL 計算', body);
  }
  window.calcHVL = function() {
    const hvl = numVal('hvl-val'), thick = numVal('hvl-thick'), dose = numVal('hvl-dose');
    const nHVL = thick / hvl;
    const transmitted = dose / (2**nHVL);
    const tf = (transmitted/dose*100).toFixed(2);
    const html = `<div class="result-panel">
      <div class="sec-label mb-1">穿透劑量率</div>
      <div class="result-val">${transmitted.toFixed(3)} cGy/min</div>
      <div class="text-xs mt-1" style="color:var(--t2);">${nHVL.toFixed(2)} HVL → 穿透率 ${tf}%</div>
    </div>`;
    const e = gel('hvl-result'); if (e) e.outerHTML = html;
  };

  window.onHypAbChange = function(val) {
    const cr = gel('hyp-custom-row');
    if (cr) cr.classList.toggle('hidden', val !== 'custom');
  };

  // ── getTools / render API ─────────────────────────────────

  // ─── 9. EQD2 Accumulator (Reirradiation) ─────────────────
  function renderEQD2Acc() {
    const courseRow = (n, label) => `
      <div class="mb-4">
        <div class="sec-label mb-2">${label}</div>
        <div class="flex gap-2">
          <div class="flex-1">${U.stepper('acc-dpf'+n,'Dose/fx',2,0.1,20,0.5,'Gy')}</div>
          <div class="flex-1">${U.stepper('acc-n'+n,'Fractions',25,1,60,1,'fx')}</div>
        </div>
        <div class="flex gap-2 items-center mt-1">
          <div class="text-xs flex-shrink-0" style="color:var(--t2);width:60px;">α/β</div>
          <input type="number" id="acc-ab${n}" value="${n===1?3:3}" step="0.5" min="0.5" max="20"
            class="inp text-center mono" style="font-size:13px;width:80px;" placeholder="α/β">
          <span class="text-xs" style="color:var(--t3);">（腫瘤建議 3 Gy）</span>
        </div>
      </div>`;
    const body = `
      ${courseRow(1,'第一療程')}
      <div style="height:1px;background:var(--border);margin:0 0 16px;"></div>
      ${courseRow(2,'第二療程（再程 / 補做）')}
      ${U.calcBtn('calcEQD2Acc()')}
      <div id="acc-result"></div>`;
    return U.cardWrap('eqd2acc',
      `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M3 14h3l2-4 2 8 2-10 2 6h3"/></svg>`,
      'EQD2 累加 / 再程評估', body);
  }
  window.calcEQD2Acc = function() {
    const row = (n) => {
      const dpf = numVal('acc-dpf'+n), fr = numVal('acc-n'+n);
      const ab  = parseFloat(gel('acc-ab'+n)?.value) || 3;
      const total = dpf * fr;
      const bed  = total * (1 + dpf/ab);
      const eqd2 = bed / (1 + 2/ab);
      return { dpf, fr, ab, total, bed, eqd2 };
    };
    const r1 = row(1), r2 = row(2);
    const sumTotal = r1.total + r2.total;
    const sumEQD2  = r1.eqd2  + r2.eqd2;
    const sumBED   = r1.bed   + r2.bed;

    let warn = '', warnColor = 'var(--t2)';
    if (sumEQD2 > 100 && r1.ab === r2.ab) {
      warn = '⚠️ 累計 EQD2 > 100 Gy，再程需嚴格評估 OAR 耐受度';
      warnColor = 'var(--danger)';
    } else if (sumEQD2 > 70) {
      warn = '注意累計劑量，需核對脊髓、直腸、膀胱等 OAR 限制';
      warnColor = '#7A4B20';
    }

    const eRow = (label, v1, v2, sum) => `<tr>
      <td class="py-1 text-xs" style="color:var(--t2);">${label}</td>
      <td class="py-1 text-xs text-right mono" style="color:var(--t1);">${v1}</td>
      <td class="py-1 text-xs text-right mono" style="color:var(--t1);">${v2}</td>
      <td class="py-1 text-xs text-right mono font-semibold" style="color:var(--accent);">${sum}</td>
    </tr>`;

    const e = gel('acc-result');
    if (e) e.outerHTML = `<div class="result-panel mt-3" id="acc-result">
      <table class="w-full mb-2">
        <thead><tr>
          <th class="text-left text-xs pb-1" style="color:var(--t3);">　</th>
          <th class="text-right text-xs pb-1" style="color:var(--t3);">療程 1</th>
          <th class="text-right text-xs pb-1" style="color:var(--t3);">療程 2</th>
          <th class="text-right text-xs pb-1" style="color:var(--accent);">合計</th>
        </tr></thead>
        <tbody>
          ${eRow('Total (Gy)',r1.total.toFixed(1),r2.total.toFixed(1),sumTotal.toFixed(1)+' Gy')}
          ${eRow('BED (Gy)',r1.bed.toFixed(1),r2.bed.toFixed(1),sumBED.toFixed(1)+' Gy')}
          ${eRow('EQD2 (Gy)',r1.eqd2.toFixed(1),r2.eqd2.toFixed(1),sumEQD2.toFixed(1)+' Gy')}
        </tbody>
      </table>
      ${warn ? `<div class="text-xs mt-1 font-medium" style="color:${warnColor};">${warn}</div>` : ''}
    </div>`;
  };

  // ─── 10. Equivalent Square Field ──────────────────────────
  function renderEquivSquare() {
    const body = `
      ${U.stepper('esf-x','照野寬 X (cm)',10,1,50,0.5,'cm')}
      ${U.stepper('esf-y','照野長 Y (cm)',15,1,50,0.5,'cm')}
      ${U.calcBtn('calcEquivSquare()')}
      <div id="esf-result"></div>`;
    return U.cardWrap('equivsq',
      `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="2" y="4" width="14" height="10" rx="1"/><line x1="9" y1="4" x2="9" y2="14"/></svg>`,
      '等效方形野 (Equivalent Square)', body);
  }
  window.calcEquivSquare = function() {
    const x = numVal('esf-x'), y = numVal('esf-y');
    // Sterling approximation: Seq = 4·A/P = 2·X·Y/(X+Y)
    const seq = (2 * x * y / (x + y)).toFixed(2);
    // Side of square with same area
    const sqrtArea = Math.sqrt(x * y).toFixed(2);
    const perimeter = 2*(x+y);
    const area = (x*y).toFixed(1);

    const e = gel('esf-result');
    if (e) e.outerHTML = `<div class="result-panel mt-3" id="esf-result">
      <div class="flex justify-between items-start mb-3">
        <div>
          <div class="sec-label mb-1">等效方形邊長</div>
          <div class="result-val">${seq} <span style="font-size:13px;font-weight:400;">cm</span></div>
          <div class="text-xs mt-0.5" style="color:var(--t3);">Sterling 公式 2XY/(X+Y)</div>
        </div>
        <div class="text-right">
          <div class="sec-label mb-1">等面積方邊</div>
          <div class="result-val text-lg">${sqrtArea} <span style="font-size:13px;font-weight:400;">cm</span></div>
          <div class="text-xs mt-0.5" style="color:var(--t3);">√(X×Y)</div>
        </div>
      </div>
      <div class="text-xs" style="color:var(--t2);">
        原始照野：${x} × ${y} cm　面積：${area} cm²　周長：${perimeter} cm
      </div>
    </div>`;
  };

  const ALL_TOOLS = [
    {key:'bed',          label:'BED/EQD2',      fn:renderBED},
    {key:'treatmentgap', label:'Gap 修正',       fn:renderGap},
    {key:'hypofrac',     label:'分次換算',        fn:renderHypo},
    {key:'electron',     label:'電子線',         fn:renderElectron},
    {key:'mu-calc',      label:'MU 計算',        fn:renderMU},
    {key:'ssd-corr',     label:'SSD 修正',       fn:renderSSD},
    {key:'isl',          label:'ISL',            fn:renderISL},
    {key:'hvl',          label:'HVL 屏蔽',       fn:renderHVL},
    {key:'eqd2acc',      label:'EQD2 累加',       fn:renderEQD2Acc},
    {key:'equivsq',      label:'等效方形野',        fn:renderEquivSquare},
  ];

  function getTools(settings) {
    const en = settings?.enabledTools || {};
    return ALL_TOOLS.filter(t => en[t.key] !== false);
  }

  function render(settings, activeTool) {
    const visible = getTools(settings);
    if (!visible.length) return `<div class="text-center text-sm py-8" style="color:var(--t3);">放療工具已全部關閉</div>`;
    const tool = visible.find(t => t.key === activeTool) || visible[0];
    return tool.fn();
  }

  return { render, getTools };
})();
