// ──────────────────────────────────────────────────────────
//  ToolsCalc  —  11 calculation tools
// ──────────────────────────────────────────────────────────

const ToolsCalc = (() => {

  // ── Shared helpers ──────────────────────────────────────
  const inp = (id) => document.getElementById(id);
  const val = (id) => parseFloat(document.getElementById(id)?.value) || 0;
  const setHTML = (id, html) => { const el = document.getElementById(id); if(el) el.innerHTML = html; };

  function resultCard(content, type='info') {
    const colors = { info:'bg-blue-50 border-blue-200 text-blue-800', ok:'bg-green-50 border-green-200 text-green-800', warn:'bg-amber-50 border-amber-200 text-amber-800', danger:'bg-red-50 border-red-200 text-red-800' };
    return `<div class="mt-3 p-3 rounded-lg border text-sm leading-relaxed ${colors[type]}">${content}</div>`;
  }

  function toggleCard(id) {
    const body = document.getElementById(id+'-body');
    const chevron = document.getElementById(id+'-chev');
    if(!body) return;
    const hidden = body.classList.toggle('hidden');
    if(chevron) chevron.style.transform = hidden ? '' : 'rotate(180deg)';
  }
  window.toggleCard = toggleCard;

  function cardWrap(id, icon, title, body) {
    return `
    <div class="bg-white rounded-xl shadow-sm mb-3 overflow-hidden">
      <button onclick="toggleCard('${id}')" class="w-full px-4 py-3 flex items-center justify-between text-left">
        <div class="flex items-center gap-2">
          <span class="text-lg">${icon}</span>
          <span class="font-medium text-sm text-gray-800">${title}</span>
        </div>
        <svg id="${id}-chev" class="w-4 h-4 text-gray-400 flex-shrink-0" style="transition:transform 0.2s" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
      </button>
      <div id="${id}-body" class="hidden px-4 pb-4">${body}</div>
    </div>`;
  }

  function inputRow(label, id, placeholder, unit='', type='number') {
    return `
    <div class="mb-2">
      <label class="text-xs text-gray-500 mb-1 block">${label}${unit ? ` <span class="text-gray-400">(${unit})</span>` : ''}</label>
      <input type="${type}" id="${id}" placeholder="${placeholder}" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white">
    </div>`;
  }

  function selectRow(label, id, options) {
    const opts = options.map(([v,t]) => `<option value="${v}">${t}</option>`).join('');
    return `
    <div class="mb-2">
      <label class="text-xs text-gray-500 mb-1 block">${label}</label>
      <select id="${id}" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white">${opts}</select>
    </div>`;
  }

  function calcBtn(fn) {
    return `<button onclick="${fn}" class="w-full mt-3 bg-orange-500 text-white rounded-lg py-2 text-sm font-medium hover:bg-orange-600 active:bg-orange-700 transition-colors">計算</button>`;
  }

  // ── 1. BED / EQD2 ───────────────────────────────────────
  function renderBED() {
    const body = `
      ${inputRow('總劑量 D','bed-D','e.g. 60','Gy')}
      ${inputRow('分次數 N','bed-N','e.g. 30','次')}
      <div class="mb-2">
        <label class="text-xs text-gray-500 mb-1 block">α/β ratio</label>
        <div class="flex gap-2">
          <button onclick="setBedAB(10)" class="ab-btn flex-1 text-xs py-1.5 rounded-lg border border-gray-200 hover:border-orange-400 hover:text-orange-500 transition-colors" data-ab="10">10 (腫瘤)</button>
          <button onclick="setBedAB(3)" class="ab-btn flex-1 text-xs py-1.5 rounded-lg border border-gray-200 hover:border-orange-400 hover:text-orange-500 transition-colors" data-ab="3">3 (晚期)</button>
          <button onclick="setBedAB(1.5)" class="ab-btn flex-1 text-xs py-1.5 rounded-lg border border-gray-200 hover:border-orange-400 hover:text-orange-500 transition-colors" data-ab="1.5">1.5</button>
          <input type="number" id="bed-ab" placeholder="自訂" class="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-300" value="10">
        </div>
      </div>
      ${calcBtn('calcBED()')}
      <div id="bed-result"></div>`;
    return cardWrap('bed','⚡','BED / EQD2',body);
  }

  window.setBedAB = function(v) {
    const el = inp('bed-ab'); if(el) el.value = v;
    document.querySelectorAll('.ab-btn').forEach(b => {
      b.classList.toggle('border-orange-400', parseFloat(b.dataset.ab) === v);
      b.classList.toggle('text-orange-500', parseFloat(b.dataset.ab) === v);
    });
  };

  window.calcBED = function() {
    const D = val('bed-D'), N = val('bed-N'), ab = val('bed-ab');
    if(!D||!N||!ab) return setHTML('bed-result', resultCard('請填寫所有欄位','warn'));
    const d = D/N;
    const BED = D*(1+d/ab);
    const EQD2 = BED/(1+2/ab);
    setHTML('bed-result', resultCard(`
      <div class="grid grid-cols-3 gap-2 text-center">
        <div><div class="text-xs text-gray-500">劑量/次</div><div class="font-bold mono">${d.toFixed(2)} Gy</div></div>
        <div><div class="text-xs text-gray-500">BED</div><div class="font-bold mono">${BED.toFixed(1)} Gy</div></div>
        <div><div class="text-xs text-gray-500">EQD2</div><div class="font-bold mono">${EQD2.toFixed(1)} Gy</div></div>
      </div>
      <div class="mt-2 text-xs text-gray-500 text-center">α/β = ${ab} Gy</div>
    `,'ok'));
  };

  // ── 2. Child-Pugh + BCLC ────────────────────────────────
  function renderChildPugh() {
    function cpSelect(label, id, opts) {
      return selectRow(label, id, opts);
    }
    const body = `
      ${cpSelect('腹水','cp-asc',[['1','無 (1分)'],['2','輕度 (2分)'],['3','中重度 (3分)']])}
      ${cpSelect('肝性腦病','cp-enc',[['1','無 (1分)'],['2','Grade 1-2 (2分)'],['3','Grade 3-4 (3分)']])}
      ${inputRow('總膽紅素','cp-bili','μmol/L','μmol/L')}
      ${inputRow('白蛋白','cp-alb','g/L','g/L')}
      ${inputRow('PT 延長時間','cp-pt','秒','sec')}
      ${calcBtn('calcChildPugh()')}
      <div id="cp-result"></div>`;
    return cardWrap('childpugh','🫁','Child-Pugh + BCLC',body);
  }

  window.calcChildPugh = function() {
    const asc = parseInt(inp('cp-asc')?.value)||1;
    const enc = parseInt(inp('cp-enc')?.value)||1;
    const bili = val('cp-bili'), alb = val('cp-alb'), pt = val('cp-pt');
    if(!bili||!alb||!pt) return setHTML('cp-result', resultCard('請填寫所有欄位','warn'));

    let biliScore = bili < 34 ? 1 : bili < 51 ? 2 : 3;
    let albScore = alb > 35 ? 1 : alb > 28 ? 2 : 3;
    let ptScore = pt < 4 ? 1 : pt < 6 ? 2 : 3;
    const total = asc + enc + biliScore + albScore + ptScore;
    const grade = total <= 6 ? 'A' : total <= 9 ? 'B' : 'C';
    const survival = { A: '1yr≈100%, 2yr≈85%', B: '1yr≈81%, 2yr≈57%', C: '1yr≈45%, 2yr≈35%' };
    const bclc = grade === 'A' ? 'BCLC 0/A 可考慮' : grade === 'B' ? 'BCLC B 限制' : 'BCLC C/D 不宜肝切除';
    const type = grade === 'A' ? 'ok' : grade === 'B' ? 'warn' : 'danger';
    setHTML('cp-result', resultCard(`
      <div class="text-center mb-2">
        <span class="text-3xl font-bold">${total}</span><span class="text-gray-500 text-sm ml-1">分</span>
        <span class="ml-3 text-2xl font-bold text-${grade==='A'?'green':grade==='B'?'amber':'red'}-600">Grade ${grade}</span>
      </div>
      <div class="text-xs text-gray-600 text-center">${survival[grade]}</div>
      <div class="mt-1 text-xs text-center font-medium">${bclc}</div>
      <div class="mt-2 text-xs text-gray-400 text-center">膽紅素${biliScore} + 白蛋白${albScore} + PT${ptScore} + 腹水${asc} + 腦病${enc}</div>
    `, type));
  };

  // ── 3. Roach Formula + D'Amico ──────────────────────────
  function renderRoach() {
    const body = `
      ${inputRow('PSA','roach-psa','ng/mL','ng/mL')}
      ${inputRow('Gleason 總分','roach-gs','e.g. 7','')}
      ${selectRow('T stage','roach-t',[['T1','T1'],['T2a','T2a'],['T2b','T2b'],['T2c','T2c'],['T3','T3'],['T4','T4']])}
      ${calcBtn('calcRoach()')}
      <div id="roach-result"></div>`;
    return cardWrap('roach','🎯','Roach Formula + D\'Amico',body);
  }

  window.calcRoach = function() {
    const psa = val('roach-psa'), gs = val('roach-gs');
    const t = inp('roach-t')?.value || 'T1';
    if(!psa||!gs) return setHTML('roach-result', resultCard('請填寫所有欄位','warn'));
    const lnRisk = (2/3)*psa + (gs-6)*10;
    const svRisk = psa + (gs-6)*10;
    // D'Amico
    const tHigh = ['T3','T4'].includes(t);
    const tInt  = ['T2b','T2c'].includes(t);
    let damico, type;
    if(psa>20||gs>=8||tHigh) { damico='High Risk'; type='danger'; }
    else if(psa>10||gs===7||tInt) { damico='Intermediate Risk'; type='warn'; }
    else { damico='Low Risk'; type='ok'; }
    setHTML('roach-result', resultCard(`
      <div class="grid grid-cols-2 gap-3 text-center mb-2">
        <div><div class="text-xs text-gray-500">淋巴結風險</div><div class="font-bold mono text-lg">${lnRisk.toFixed(0)}%</div></div>
        <div><div class="text-xs text-gray-500">精囊侵犯風險</div><div class="font-bold mono text-lg">${svRisk.toFixed(0)}%</div></div>
      </div>
      <div class="text-center font-bold text-sm">${damico}</div>
      <div class="text-xs text-gray-400 text-center mt-1">PSA ${psa} / GS ${gs} / ${t}</div>
    `, type));
  };

  // ── 4. ALBI Score ───────────────────────────────────────
  function renderALBI() {
    const body = `
      ${inputRow('總膽紅素','albi-bili','μmol/L','μmol/L')}
      ${inputRow('白蛋白','albi-alb','g/L','g/L')}
      ${calcBtn('calcALBI()')}
      <div id="albi-result"></div>`;
    return cardWrap('albi','📊','ALBI Score',body);
  }

  window.calcALBI = function() {
    const bili = val('albi-bili'), alb = val('albi-alb');
    if(!bili||!alb) return setHTML('albi-result', resultCard('請填寫所有欄位','warn'));
    const score = (Math.log10(bili)*0.66) + (alb*(-0.0852));
    const grade = score <= -2.60 ? 1 : score <= -1.39 ? 2 : 3;
    const desc = ['','良好 (適合積極治療)','中等','差 (Child C 相近)'];
    const types = ['','ok','warn','danger'];
    setHTML('albi-result', resultCard(`
      <div class="text-center">
        <div class="mono text-2xl font-bold">${score.toFixed(3)}</div>
        <div class="text-sm font-bold mt-1">Grade ${grade} — ${desc[grade]}</div>
      </div>
    `, types[grade]));
  };

  // ── 5. MELD Score ───────────────────────────────────────
  function renderMELD() {
    const body = `
      ${inputRow('總膽紅素','meld-bili','mg/dL','mg/dL')}
      ${inputRow('肌酸酐 Creatinine','meld-cr','mg/dL','mg/dL')}
      ${inputRow('INR','meld-inr','e.g. 1.2','')}
      ${calcBtn('calcMELD()')}
      <div id="meld-result"></div>`;
    return cardWrap('meld','🩸','MELD Score',body);
  }

  window.calcMELD = function() {
    let bili = val('meld-bili'), cr = val('meld-cr'), inr = val('meld-inr');
    if(!bili||!cr||!inr) return setHTML('meld-result', resultCard('請填寫所有欄位','warn'));
    bili = Math.max(bili, 1); cr = Math.min(Math.max(cr, 1), 4); inr = Math.max(inr, 1);
    let score = Math.round(3.78*Math.log(bili) + 11.2*Math.log(inr) + 9.57*Math.log(cr) + 6.43);
    score = Math.max(6, Math.min(40, score));
    const type = score < 10 ? 'ok' : score < 20 ? 'warn' : 'danger';
    const risk = score < 10 ? '3個月死亡率 <10%' : score < 20 ? '3個月死亡率 ~25%' : score < 30 ? '3個月死亡率 ~50%' : '3個月死亡率 >70%';
    setHTML('meld-result', resultCard(`
      <div class="text-center">
        <div class="mono text-3xl font-bold">${score}</div>
        <div class="text-sm mt-1">${risk}</div>
      </div>
    `, type));
  };

  // ── 6. Treatment Gap Correction ────────────────────────
  function renderTreatmentGap() {
    const body = `
      ${selectRow('腫瘤類型','tg-type',[['hn','頭頸部 (0.6 Gy/天)'],['other','其他 (0.5 Gy/天)'],['custom','自訂']])}
      <div id="tg-custom-row" class="hidden">
        ${inputRow('自訂補償因子','tg-custom','Gy/天','Gy/天')}
      </div>
      ${inputRow('中斷天數','tg-days','天','天')}
      ${calcBtn('calcTreatmentGap()')}
      <div id="tg-result"></div>`;
    return cardWrap('treatmentgap','📅','Treatment Gap Correction',body);
  }

  window.calcTreatmentGap = function() {
    const type = inp('tg-type')?.value;
    const days = val('tg-days');
    let factor = type==='hn' ? 0.6 : type==='other' ? 0.5 : val('tg-custom');
    if(!days||!factor) return setHTML('tg-result', resultCard('請填寫所有欄位','warn'));
    const extra = factor * days;
    const cr = inp('tg-custom-row');
    if(cr) cr.classList.toggle('hidden', type !== 'custom');
    setHTML('tg-result', resultCard(`
      <div class="text-center">
        <div class="text-xs text-gray-500">需額外補償劑量</div>
        <div class="mono text-2xl font-bold text-orange-600">${extra.toFixed(1)} Gy</div>
        <div class="text-xs text-gray-500">${days}天 × ${factor} Gy/天</div>
      </div>
    `,'warn'));
  };

  // ── 7. Hypofractionation Converter ─────────────────────
  function renderHypofrac() {
    const body = `
      <div class="text-xs text-gray-500 mb-3">輸入原始處方與 α/β，計算等效新處方</div>
      <div class="grid grid-cols-2 gap-2">
        <div>${inputRow('原始總劑量','hf-D','Gy','Gy')}</div>
        <div>${inputRow('原始分次數','hf-N','次','次')}</div>
      </div>
      ${inputRow('α/β ratio','hf-ab','e.g. 10','')}
      <div class="border-t border-gray-100 my-3"></div>
      <div class="text-xs text-gray-500 mb-2">新處方（填其中一個）</div>
      <div class="grid grid-cols-2 gap-2">
        <div>${inputRow('新分次數','hf-Nnew','次','次')}</div>
        <div>${inputRow('新劑量/次','hf-dnew','Gy/fx','Gy')}</div>
      </div>
      ${calcBtn('calcHypofrac()')}
      <div id="hf-result"></div>`;
    return cardWrap('hypofrac','🔄','Hypofractionation Converter',body);
  }

  window.calcHypofrac = function() {
    const D=val('hf-D'), N=val('hf-N'), ab=val('hf-ab');
    const Nnew=val('hf-Nnew'), dnew=val('hf-dnew');
    if(!D||!N||!ab) return setHTML('hf-result', resultCard('請填寫原始處方與α/β','warn'));
    const BED = D*(1 + D/(N*ab));
    let resultHtml = '';
    if(Nnew) {
      // Given new N, find new d
      const a=Nnew/ab, b=Nnew, c=-BED;
      const disc = b*b - 4*a*c;
      const dn = (-b + Math.sqrt(disc))/(2*a);
      resultHtml = `<b>${Nnew}次</b> × <b>${dn.toFixed(2)} Gy</b> = ${(Nnew*dn).toFixed(1)} Gy total`;
    } else if(dnew) {
      // Given new d, find new N
      const Nn = BED / (dnew*(1+dnew/ab));
      resultHtml = `<b>${Nn.toFixed(1)}次</b> × <b>${dnew} Gy</b> = ${(Nn*dnew).toFixed(1)} Gy total`;
    } else {
      return setHTML('hf-result', resultCard('請填寫新分次數或新劑量/次','warn'));
    }
    setHTML('hf-result', resultCard(`
      <div class="text-xs text-gray-500 mb-1">原始 BED = ${BED.toFixed(1)} Gy (α/β=${ab})</div>
      <div class="text-sm">等效新處方：${resultHtml}</div>
    `,'ok'));
  };

  // ── 8. Calvert Formula ──────────────────────────────────
  function renderCalvert() {
    const body = `
      ${inputRow('目標 AUC','calvert-auc','e.g. 5','mg/mL·min')}
      <div class="border-t border-gray-100 my-3 text-xs text-gray-500">Cockcroft-Gault 估算 GFR</div>
      ${inputRow('年齡','calvert-age','歲','歲')}
      ${inputRow('體重','calvert-wt','kg','kg')}
      ${selectRow('性別','calvert-sex',[['M','男'],['F','女']])}
      ${inputRow('血清肌酸酐','calvert-scr','mg/dL','mg/dL')}
      ${calcBtn('calcCalvert()')}
      <div id="calvert-result"></div>`;
    return cardWrap('calvert','💊','Calvert Formula (Carboplatin)',body);
  }

  window.calcCalvert = function() {
    const auc=val('calvert-auc'), age=val('calvert-age'), wt=val('calvert-wt'), scr=val('calvert-scr');
    const sex = inp('calvert-sex')?.value;
    if(!auc||!age||!wt||!scr) return setHTML('calvert-result', resultCard('請填寫所有欄位','warn'));
    let crcl = ((140-age)*wt)/(72*scr);
    if(sex==='F') crcl *= 0.85;
    const dose = auc*(crcl+25);
    setHTML('calvert-result', resultCard(`
      <div class="grid grid-cols-2 gap-3 text-center">
        <div><div class="text-xs text-gray-500">估算 GFR (CG)</div><div class="font-bold mono">${crcl.toFixed(0)} mL/min</div></div>
        <div><div class="text-xs text-gray-500">Carboplatin 劑量</div><div class="font-bold mono text-lg text-orange-600">${dose.toFixed(0)} mg</div></div>
      </div>
      <div class="text-xs text-gray-400 text-center mt-1">AUC ${auc} × (${crcl.toFixed(0)} + 25)</div>
    `,'ok'));
  };

  // ── 9. Cockcroft-Gault ──────────────────────────────────
  function renderCG() {
    const body = `
      ${inputRow('年齡','cg-age','歲','歲')}
      ${inputRow('體重','cg-wt','kg','kg')}
      ${selectRow('性別','cg-sex',[['M','男'],['F','女']])}
      ${inputRow('血清肌酸酐','cg-scr','mg/dL','mg/dL')}
      ${calcBtn('calcCG()')}
      <div id="cg-result"></div>`;
    return cardWrap('cockcroftgault','🧪','Cockcroft-Gault (CrCl)',body);
  }

  window.calcCG = function() {
    const age=val('cg-age'), wt=val('cg-wt'), scr=val('cg-scr');
    const sex = inp('cg-sex')?.value;
    if(!age||!wt||!scr) return setHTML('cg-result', resultCard('請填寫所有欄位','warn'));
    let crcl = ((140-age)*wt)/(72*scr);
    if(sex==='F') crcl *= 0.85;
    const cisplatin = crcl >= 50 ? '✅ 適用 Cisplatin (≥50)' : '⚠️ 謹慎使用 Cisplatin (<50)';
    const ckd = crcl>=90?'G1 正常':crcl>=60?'G2 輕度':crcl>=30?'G3 中度':crcl>=15?'G4 重度':'G5 腎衰竭';
    const type = crcl>=60?'ok':crcl>=30?'warn':'danger';
    setHTML('cg-result', resultCard(`
      <div class="text-center mb-2">
        <div class="mono text-2xl font-bold">${crcl.toFixed(1)} mL/min</div>
        <div class="text-xs text-gray-500 mt-1">CKD Stage: ${ckd}</div>
      </div>
      <div class="text-sm text-center">${cisplatin}</div>
    `, type));
  };

  // ── 10. BSA Calculator ──────────────────────────────────
  function renderBSA() {
    const body = `
      ${inputRow('身高','bsa-ht','cm','cm')}
      ${inputRow('體重','bsa-wt','kg','kg')}
      ${calcBtn('calcBSA()')}
      <div id="bsa-result"></div>`;
    return cardWrap('bsa','📏','BSA Calculator',body);
  }

  window.calcBSA = function() {
    const ht=val('bsa-ht'), wt=val('bsa-wt');
    if(!ht||!wt) return setHTML('bsa-result', resultCard('請填寫所有欄位','warn'));
    const dubois = 0.007184 * Math.pow(ht, 0.725) * Math.pow(wt, 0.425);
    const mosteller = Math.sqrt(ht*wt/3600);
    const bmi = wt/Math.pow(ht/100, 2);
    const bmiCat = bmi<18.5?'體重過輕':bmi<24?'正常':bmi<27?'過重':'肥胖';
    setHTML('bsa-result', resultCard(`
      <div class="grid grid-cols-3 gap-2 text-center">
        <div><div class="text-xs text-gray-500">DuBois</div><div class="font-bold mono">${dubois.toFixed(2)} m²</div></div>
        <div><div class="text-xs text-gray-500">Mosteller</div><div class="font-bold mono">${mosteller.toFixed(2)} m²</div></div>
        <div><div class="text-xs text-gray-500">BMI</div><div class="font-bold mono">${bmi.toFixed(1)}</div><div class="text-xs text-gray-400">${bmiCat}</div></div>
      </div>
    `,'ok'));
  };

  // ── 11. Cisplatin 累積劑量 ──────────────────────────────
  function renderCisplatin() {
    const doses = App.getCisplatinDoses();
    const total = doses.reduce((s,d)=>s+d.totalMg,0);
    const warn = total >= 300;
    const rows = doses.length ? doses.map((d,i) => `
      <div class="flex items-center justify-between text-xs py-1 border-b border-gray-50 last:border-0">
        <span class="text-gray-500">${d.date}</span>
        <span class="mono">${d.bsa.toFixed(2)} m²</span>
        <span class="mono">${d.dpm2} mg/m²</span>
        <span class="mono font-medium">${d.totalMg.toFixed(0)} mg</span>
        <button onclick="removeCisplatin(${i})" class="text-red-400 hover:text-red-600 ml-1">✕</button>
      </div>
    `).join('') : '<div class="text-xs text-gray-400 text-center py-2">尚未記錄</div>';

    const body = `
      <div class="mb-3">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs text-gray-500">累積劑量</span>
          ${warn ? '<span class="text-xs text-red-500 font-bold">⚠️ ≥300 mg/m²</span>' : ''}
        </div>
        <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div class="h-2 rounded-full transition-all ${warn?'bg-red-500':'bg-orange-400'}" style="width:${Math.min(total/300*100,100).toFixed(0)}%"></div>
        </div>
        <div class="mono text-right text-sm font-bold mt-1 ${warn?'text-red-600':'text-gray-700'}">${total.toFixed(0)} / 300 mg</div>
      </div>
      <div class="mb-3 text-xs">${rows}</div>
      <div class="border-t border-gray-100 pt-3">
        <div class="text-xs text-gray-500 mb-2">新增記錄</div>
        <div class="grid grid-cols-2 gap-2">
          ${inputRow('日期','cisp-date','YYYY-MM-DD','','date')}
          ${inputRow('BSA','cisp-bsa','m²','m²')}
          ${inputRow('劑量','cisp-dose','mg/m²','mg/m²')}
        </div>
        <button onclick="addCisplatin()" class="w-full mt-2 bg-orange-500 text-white rounded-lg py-2 text-sm font-medium hover:bg-orange-600 transition-colors">新增</button>
        ${doses.length ? `<button onclick="clearCisplatin()" class="w-full mt-2 text-xs text-gray-400 hover:text-red-500 transition-colors">清除所有記錄</button>` : ''}
      </div>`;
    return cardWrap('cisplatin','💉','Cisplatin 累積劑量',body);
  }

  window.addCisplatin = function() {
    const date = inp('cisp-date')?.value || new Date().toISOString().slice(0,10);
    const bsa = val('cisp-bsa'), dpm2 = val('cisp-dose');
    if(!bsa||!dpm2) return alert('請填寫 BSA 和劑量');
    const doses = App.getCisplatinDoses();
    doses.push({ date, bsa, dpm2, totalMg: bsa*dpm2 });
    App.saveCisplatinDoses(doses);
    // re-render card body
    const body = document.getElementById('cisplatin-body');
    if(body) { const tmp = document.createElement('div'); tmp.innerHTML = renderCisplatin(); body.innerHTML = tmp.querySelector('#cisplatin-body').innerHTML; }
    else App.navigate('tools');
  };

  window.removeCisplatin = function(idx) {
    const doses = App.getCisplatinDoses();
    doses.splice(idx,1);
    App.saveCisplatinDoses(doses);
    App.navigate('tools');
  };

  window.clearCisplatin = function() {
    if(confirm('確定清除所有記錄？')) { App.saveCisplatinDoses([]); App.navigate('tools'); }
  };

  // ── Render all ──────────────────────────────────────────
  function render(settings) {
    const en = settings?.enabledTools || {};
    const tools = [
      {key:'bed', fn: renderBED},
      {key:'childpugh', fn: renderChildPugh},
      {key:'roach', fn: renderRoach},
      {key:'albi', fn: renderALBI},
      {key:'meld', fn: renderMELD},
      {key:'treatmentgap', fn: renderTreatmentGap},
      {key:'hypofrac', fn: renderHypofrac},
      {key:'calvert', fn: renderCalvert},
      {key:'cockcroftgault', fn: renderCG},
      {key:'bsa', fn: renderBSA},
      {key:'cisplatin', fn: renderCisplatin},
    ];
    const html = tools.filter(t => en[t.key] !== false).map(t => t.fn()).join('');
    return html || '<div class="text-center text-gray-400 text-sm py-8">所有計算工具已關閉<br><span class="text-xs">請前往設定頁開啟</span></div>';
  }

  return { render };
})();
