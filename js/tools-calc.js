// ── ToolsCalc — 8 clinical calculators ───────────────────
// Depends on utils.js (gel, numVal, selVal, U.*, toggleCard, stepAdj, stepClamp, pillSelect)
const ToolsCalc = (() => {

  // Inline text input helper (no stepper)
  function inp(id, label, unit='') {
    return `<div class="mb-3">
      <div class="text-xs mb-1.5" style="color:var(--t2);">${label}</div>
      <div class="flex items-center gap-2">
        <input type="number" id="${id}" class="inp flex-1">
        ${unit ? `<span class="text-xs flex-shrink-0" style="color:var(--t2);min-width:32px;">${unit}</span>` : ''}
      </div>
    </div>`;
  }

  // Compact pill-opt row for score inputs (11px font)
  function cpRow(id, label, opts) {
    const btns = opts.map(([s,t]) =>
      `<button class="pill-opt${s==='1'?' active':''}" data-val="${s}" data-group="${id}"
         onclick="pillSelect('${id}',this)" style="font-size:11px;">${t}</button>`
    ).join('');
    return `<div class="mb-2.5">
      <div class="text-xs mb-1.5" style="color:var(--t2);">${label}</div>
      <div class="flex gap-1">${btns}</div>
      <input type="hidden" id="${id}" value="1">
    </div>`;
  }

  function resultBox(html, id='') {
    return `<div class="result-panel mt-3"${id ? ` id="${id}"` : ''}>${html}</div>`;
  }

  // Calvert: toggle CG fields vs direct GFR input
  window.calvModeChange = function(val) {
    const cg = gel('calv-cg-fields'), dr = gel('calv-direct-field');
    if (cg) cg.style.display = val === 'cg' ? '' : 'none';
    if (dr) dr.style.display = val === 'direct' ? '' : 'none';
  };

  // ── 1. Child-Pugh + BCLC ──────────────────────────────────
  const CPICON = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
    <path d="M9 3 C5 3 3 5.5 3 8 C3 11.5 5.5 13.5 9 15 C12.5 13.5 15 11.5 15 8 C15 5.5 13 3 9 3Z"/>
    <line x1="9" y1="8" x2="9" y2="12"/><line x1="7" y1="10" x2="11" y2="10"/>
  </svg>`;

  function renderChildPugh() {
    const body = `
      ${cpRow('cp-bili','總膽紅素',[['1','< 2 mg/dL'],['2','2–3'],['3','> 3']])}
      ${cpRow('cp-alb','白蛋白',[['1','> 3.5 g/dL'],['2','2.8–3.5'],['3','< 2.8']])}
      ${cpRow('cp-pt','PT / INR',[['1','INR < 1.7'],['2','INR 1.7–2.3'],['3','INR > 2.3']])}
      ${cpRow('cp-asc','腹水',[['1','無'],['2','輕度（利尿劑控制）'],['3','重度（難控制）']])}
      ${cpRow('cp-enc','肝性腦病',[['1','無'],['2','I–II 級'],['3','III–IV 級']])}
      ${U.calcBtn('calcCP()')}
      <div id="cp-result"></div>`;
    return U.cardWrap('childpugh', CPICON, 'Child-Pugh + BCLC', body);
  }
  window.calcCP = function() {
    const total = ['cp-bili','cp-alb','cp-pt','cp-asc','cp-enc']
      .reduce((s, id) => s + (parseInt(gel(id)?.value) || 1), 0);
    let grade='C', surv1='28–45%', surv3='';
    if (total<=6)  { grade='A'; surv1='95–100%'; surv3='81%'; }
    else if (total<=9) { grade='B'; surv1='75–80%'; surv3='45%'; }
    const bclc = grade==='A' ? '0 / A / B（依腫瘤）' : grade==='B' ? 'B / C（依腫瘤）' : 'C（最佳支持）';
    const e = gel('cp-result');
    if (e) e.outerHTML = resultBox(`
      <div class="flex items-start justify-between">
        <div>
          <div class="sec-label mb-1">Child-Pugh</div>
          <div class="result-val">Grade ${grade}</div>
          <div class="mono text-sm mt-1" style="color:var(--t2);">${total} 分</div>
        </div>
        <div class="text-right text-xs" style="color:var(--t2);line-height:1.7;">
          1yr: ${surv1}<br>${surv3?'3yr: '+surv3+'<br>':''}BCLC: ${bclc}
        </div>
      </div>`, 'cp-result');
  };

  // ── 2. Roach Formula ──────────────────────────────────────
  const ROICON = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
    <circle cx="9" cy="9" r="6"/><circle cx="9" cy="9" r="2.5"/>
    <line x1="9" y1="1" x2="9" y2="4"/><line x1="9" y1="14" x2="9" y2="17"/>
    <line x1="1" y1="9" x2="4" y2="9"/><line x1="14" y1="9" x2="17" y2="9"/>
  </svg>`;

  function renderRoach() {
    const body = `
      ${U.stepper('ro-psa','PSA (ng/mL)',10,0.1,200,0.5,'ng/mL')}
      ${U.pills('ro-gs','Gleason Score',[['6','≤6'],['7','3+4'],['8','4+3'],['9','8'],['10','9–10']],'6')}
      ${U.calcBtn('calcRoach()')}
      <div id="ro-result"></div>`;
    return U.cardWrap('roach', ROICON, "Roach Formula + D'Amico", body);
  }
  window.calcRoach = function() {
    const psa = numVal('ro-psa'), gs = parseInt(selVal('ro-gs')) || 6;
    const ln  = (2/3)*psa + (gs-6)*10;
    const sv  = psa/3 + Math.max(gs-6,0)*10;
    let risk='低危', riskColor='color:var(--t2)';
    if (psa>20||gs>=8||ln>=15) { risk='高危'; riskColor='color:var(--danger)'; }
    else if (psa>10||gs===7||sv>=15) { risk='中危'; riskColor='color:var(--warn);'; }
    const e = gel('ro-result');
    if (e) e.outerHTML = resultBox(`
      <div class="flex justify-between items-start">
        <div>
          <div class="sec-label mb-1">D'Amico 危險分組</div>
          <div class="result-val" style="${riskColor}">${risk}</div>
        </div>
        <div class="text-right text-xs" style="color:var(--t2);line-height:1.9;">
          LN 風險: <span class="mono">${ln.toFixed(0)}%</span><br>
          SV 風險: <span class="mono">${sv.toFixed(0)}%</span>
        </div>
      </div>`, 'ro-result');
  };

  // ── 3. ALBI Score ─────────────────────────────────────────
  const ALBI_ICON = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="11" width="3" height="5" rx=".5"/><rect x="7.5" y="7" width="3" height="9" rx=".5"/>
    <rect x="13" y="4" width="3" height="12" rx=".5"/><polyline points="3.5,11 9,7 14.5,4"/>
  </svg>`;

  function renderALBI() {
    const body = `
      ${U.stepper('albi-bili','Total Bilirubin (μmol/L)',17,1,500,1,'μmol/L')}
      ${U.stepper('albi-alb','Albumin (g/L)',38,10,60,0.5,'g/L')}
      ${U.calcBtn('calcALBI()')}
      <div id="albi-result"></div>`;
    return U.cardWrap('albi', ALBI_ICON, 'ALBI Score', body);
  }
  window.calcALBI = function() {
    const bili = numVal('albi-bili'), alb = numVal('albi-alb');
    const score = (Math.log10(bili)*0.66) + (alb*(-0.085));
    let grade='3', note='嚴重肝功能損害';
    if (score<=-2.60)  { grade='1'; note='肝功能良好'; }
    else if (score<=-1.39) { grade='2'; note='中度肝功能損害'; }
    const e = gel('albi-result');
    if (e) e.outerHTML = resultBox(`
      <div class="flex items-center justify-between">
        <div>
          <div class="sec-label mb-1">ALBI Grade</div>
          <div class="result-val">Grade ${grade}</div>
        </div>
        <div class="text-right text-xs" style="color:var(--t2);line-height:1.8;">
          Score: <span class="mono">${score.toFixed(2)}</span><br>${note}
        </div>
      </div>`, 'albi-result');
  };

  // ── 4. MELD Score ─────────────────────────────────────────
  const MELDICON = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
    <path d="M2 14 A7 7 0 0 1 16 14"/><line x1="9" y1="14" x2="13.5" y2="7.5"/>
    <line x1="2" y1="14" x2="16" y2="14"/>
  </svg>`;

  function renderMELD() {
    const body = `
      ${U.stepper('meld-cr','Creatinine (mg/dL)',1.0,0.1,15,0.1,'mg/dL')}
      ${U.stepper('meld-bili','Total Bilirubin (mg/dL)',1.5,0.1,50,0.1,'mg/dL')}
      ${U.stepper('meld-inr','INR',1.1,0.5,15,0.1,'')}
      ${U.pills('meld-dial','透析（過去 2 週）',[['0','否'],['1','是']],'0')}
      ${U.calcBtn('calcMELD()')}
      <div id="meld-result"></div>`;
    return U.cardWrap('meld', MELDICON, 'MELD Score', body);
  }
  window.calcMELD = function() {
    let cr = numVal('meld-cr'), bili = numVal('meld-bili'), inr = numVal('meld-inr');
    const dial = parseInt(selVal('meld-dial')) || 0;
    if (dial) cr = 4.0;
    cr = Math.max(1, Math.min(4, cr)); bili = Math.max(1, bili); inr = Math.max(1, inr);
    const score = Math.round(3.78*Math.log(bili) + 11.2*Math.log(inr) + 9.57*Math.log(cr) + 6.43);
    let risk='低', mort3m='< 4%';
    if (score>=40){ risk='極高'; mort3m='71.3%'; }
    else if (score>=30){ risk='高'; mort3m='52.6%'; }
    else if (score>=20){ risk='中'; mort3m='19.6%'; }
    else if (score>=10){ risk='中低'; mort3m='6%'; }
    const e = gel('meld-result');
    if (e) e.outerHTML = resultBox(`
      <div class="flex items-center justify-between">
        <div>
          <div class="sec-label mb-1">MELD Score</div>
          <div class="result-val">${score}</div>
        </div>
        <div class="text-right text-xs" style="color:var(--t2);line-height:1.8;">
          風險: ${risk}<br>3月死亡率: ${mort3m}
        </div>
      </div>`, 'meld-result');
  };

  // ── 5. Calvert Formula ────────────────────────────────────
  const CALVICON = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
    <path d="M6 3 L6 8 C6 12 4 14 4 14 L14 14 C14 14 12 12 12 8 L12 3"/>
    <line x1="4.5" y1="3" x2="13.5" y2="3"/><circle cx="9" cy="10" r="1.5"/>
  </svg>`;

  function renderCalvert() {
    const body = `
      ${U.stepper('calv-auc','目標 AUC',5,1,10,0.5,'mg/mL·min')}
      <div class="mb-3">
        <div class="text-xs mb-1.5" style="color:var(--t2);">GFR 計算方式</div>
        <div class="flex flex-wrap gap-1.5">
          <button class="pill-opt active" data-val="cg" data-group="calv-mode"
            onclick="pillSelect('calv-mode',this);calvModeChange('cg')">Cockcroft-Gault</button>
          <button class="pill-opt" data-val="direct" data-group="calv-mode"
            onclick="pillSelect('calv-mode',this);calvModeChange('direct')">直接輸入</button>
        </div>
        <input type="hidden" id="calv-mode" value="cg">
      </div>
      <div id="calv-cg-fields">
        ${U.stepper('calv-age','年齡',60,18,100,1,'歲')}
        ${U.stepper('calv-wt','體重',65,30,200,1,'kg')}
        ${U.stepper('calv-cr2','Creatinine',1.0,0.2,15,0.1,'mg/dL')}
        ${U.pills('calv-sex','性別',[['M','男'],['F','女']],'M')}
      </div>
      <div id="calv-direct-field" style="display:none;">
        ${U.stepper('calv-gfr','GFR / CrCl',60,5,200,1,'mL/min')}
      </div>
      ${U.calcBtn('calcCalvert()')}
      <div id="calv-result"></div>`;
    return U.cardWrap('calvert', CALVICON, 'Calvert Formula (Carboplatin)', body);
  }
  window.calcCalvert = function() {
    const auc  = numVal('calv-auc');
    const mode = selVal('calv-mode') || 'cg';
    let gfr;
    if (mode === 'direct') {
      gfr = numVal('calv-gfr');
    } else {
      const age = numVal('calv-age'), wt = numVal('calv-wt'), cr = numVal('calv-cr2');
      const sex = selVal('calv-sex') || 'M';
      gfr = ((140-age)*wt) / (72*cr) * (sex==='F' ? 0.85 : 1);
    }
    const dose = auc * (gfr + 25);
    const e = gel('calv-result');
    if (e) e.outerHTML = resultBox(`
      <div class="flex items-center justify-between">
        <div>
          <div class="sec-label mb-1">Carboplatin 劑量</div>
          <div class="result-val">${dose.toFixed(0)} <span style="font-size:14px;font-weight:400;">mg</span></div>
        </div>
        <div class="text-right text-xs" style="color:var(--t2);line-height:1.8;">
          GFR: ${gfr.toFixed(0)} mL/min<br>AUC: ${auc}
        </div>
      </div>`, 'calv-result');
  };

  // ── 6. Cockcroft-Gault ────────────────────────────────────
  const CGICON = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
    <path d="M5 4 C5 4 3 6 3 9 C3 12 5 14 9 14 C13 14 15 12 15 9 C15 6 13 4 13 4"/>
    <path d="M6 6 C6 6 5 7.5 5 9 C5 11 6.5 13 9 13"/>
    <line x1="9" y1="2" x2="9" y2="5"/><line x1="7.5" y1="2" x2="10.5" y2="2"/>
  </svg>`;

  function renderCG() {
    const body = `
      ${U.stepper('cg-age','年齡',65,18,100,1,'歲')}
      ${U.stepper('cg-wt','體重',65,30,200,1,'kg')}
      ${U.stepper('cg-cr','Creatinine',1.0,0.2,15,0.1,'mg/dL')}
      ${U.pills('cg-sex','性別',[['M','男'],['F','女']],'M')}
      ${U.calcBtn('calcCG()')}
      <div id="cg-result"></div>`;
    return U.cardWrap('cockcroftgault', CGICON, 'Cockcroft-Gault (CrCl)', body);
  }
  window.calcCG = function() {
    const age=numVal('cg-age'), wt=numVal('cg-wt'), cr=numVal('cg-cr');
    const sex = selVal('cg-sex') || 'M';
    const crcl = ((140-age)*wt) / (72*cr) * (sex==='F' ? 0.85 : 1);
    let ckd='G1', cisp='適用';
    if (crcl<15){ ckd='G5'; cisp='禁忌'; }
    else if (crcl<30){ ckd='G4'; cisp='禁忌'; }
    else if (crcl<45){ ckd='G3b'; cisp='謹慎'; }
    else if (crcl<60){ ckd='G3a'; cisp='謹慎'; }
    const e = gel('cg-result');
    if (e) e.outerHTML = resultBox(`
      <div class="flex items-center justify-between">
        <div>
          <div class="sec-label mb-1">CrCl</div>
          <div class="result-val">${crcl.toFixed(0)} <span style="font-size:13px;font-weight:400;">mL/min</span></div>
        </div>
        <div class="text-right text-xs" style="color:var(--t2);line-height:1.8;">
          CKD 分期: ${ckd}<br>Cisplatin: ${cisp}
        </div>
      </div>`, 'cg-result');
  };

  // ── 7. BSA Calculator ─────────────────────────────────────
  const BSAICON = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="9" cy="3.5" r="1.5"/><path d="M5 8 C5 8 4 11 4 14"/><path d="M13 8 C13 8 14 11 14 14"/>
    <path d="M5 8 L9 10 L13 8"/><line x1="6.5" y1="11" x2="5.5" y2="15"/><line x1="11.5" y1="11" x2="12.5" y2="15"/>
  </svg>`;

  function renderBSA() {
    const body = `
      ${U.stepper('bsa-ht','身高',168,100,220,1,'cm')}
      ${U.stepper('bsa-wt','體重',65,20,200,1,'kg')}
      ${U.calcBtn('calcBSA()')}
      <div id="bsa-result"></div>`;
    return U.cardWrap('bsa', BSAICON, 'BSA Calculator', body);
  }
  window.calcBSA = function() {
    const ht=numVal('bsa-ht'), wt=numVal('bsa-wt');
    const dubois  = 0.007184 * Math.pow(ht,0.725) * Math.pow(wt,0.425);
    const mostell = Math.sqrt((ht*wt)/3600);
    const bmi = wt / ((ht/100)**2);
    const e = gel('bsa-result');
    if (e) e.outerHTML = resultBox(`
      <div class="sec-label mb-2">BSA (m²)</div>
      <div class="grid grid-cols-2 gap-2">
        <div style="background:var(--bg);border-radius:9px;padding:10px;">
          <div class="text-xs mb-0.5" style="color:var(--t3);">DuBois</div>
          <div class="mono font-medium" style="font-size:18px;color:var(--t1);">${dubois.toFixed(2)}</div>
        </div>
        <div style="background:var(--acc-bg);border-radius:9px;padding:10px;border:1px solid var(--border);">
          <div class="text-xs mb-0.5" style="color:var(--t2);">Mosteller</div>
          <div class="mono font-medium" style="font-size:18px;color:var(--accent);">${mostell.toFixed(2)}</div>
        </div>
      </div>
      <div class="mt-2 text-xs" style="color:var(--t3);">BMI: <span class="mono">${bmi.toFixed(1)}</span> kg/m²</div>
    `, 'bsa-result');
  };

  // ── 8. Cisplatin Tracker ──────────────────────────────────
  const CISPICON = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
    <line x1="9" y1="2" x2="9" y2="5"/><rect x="6" y="5" width="6" height="9" rx="3"/>
    <line x1="6.5" y1="10" x2="11.5" y2="10"/><path d="M7 14 L6 16 M11 14 L12 16"/>
  </svg>`;

  function renderCisplatin() {
    const doses = App.getCisplatinDoses();
    const total = doses.reduce((s,d) => s+(d.totalMg||0), 0);
    const warn  = total >= 300;
    const rows  = doses.length ? doses.map((d,i) => `
      <div class="flex items-center justify-between py-1.5 border-b last:border-0" style="border-color:var(--border);font-size:12px;">
        <div style="color:var(--t2);">${d.date}</div>
        <div class="mono" style="color:var(--t1);">${d.dpm2} mg/m² × ${d.bsa} = <strong>${(d.totalMg||0).toFixed(0)}</strong> mg</div>
        <button onclick="removeCisplatin(${i})" style="color:var(--t3);padding:2px 6px;font-size:16px;border:none;background:none;cursor:pointer;">×</button>
      </div>`).join('')
      : `<div class="text-xs py-3 text-center" style="color:var(--t3);">尚無記錄</div>`;

    const body = `
      <div id="cisplatin-body">
        ${warn ? `<div class="mb-3 p-3 rounded-xl" style="background:var(--warn-bg);border:1px solid #F0C48A;">
          <div class="text-xs font-semibold" style="color:var(--warn);">⚠ 累積劑量 ≥ 300 mg/m²，注意腎毒性/耳毒性</div>
        </div>` : ''}
        <div class="mb-3">
          <div class="sec-label mb-1">累積總量</div>
          <div class="result-val">${total.toFixed(0)} <span style="font-size:13px;font-weight:400;">mg</span></div>
        </div>
        <div class="mb-3 rounded-xl overflow-hidden" style="border:1px solid var(--border);">${rows}</div>
        <div class="sec-label mb-2">新增一次</div>
        ${U.stepper('cisp-bsa','BSA (m²)',1.7,0.5,3,0.05,'m²')}
        ${U.stepper('cisp-dose','Cisplatin (mg/m²)',40,10,120,5,'mg/m²')}
        <input type="date" id="cisp-date" class="inp mb-3" value="${new Date().toISOString().slice(0,10)}">
        <button class="calc-btn" onclick="addCisplatin()">新增記錄</button>
        <button onclick="clearCisplatin()" class="w-full mt-2 py-2 text-xs rounded-lg" style="background:var(--bg);color:var(--t2);border:1px solid var(--border);">清除所有記錄</button>
      </div>`;
    return U.cardWrap('cisplatin', CISPICON, 'Cisplatin 累積劑量', body);
  }
  window.addCisplatin = function() {
    const date  = gel('cisp-date')?.value || new Date().toISOString().slice(0,10);
    const bsa   = numVal('cisp-bsa'), dpm2 = numVal('cisp-dose');
    if (!bsa||!dpm2) return alert('請填寫 BSA 和劑量');
    const doses = App.getCisplatinDoses();
    doses.push({ date, bsa, dpm2, totalMg: bsa*dpm2 });
    App.saveCisplatinDoses(doses);
    App.navigate('tools');
  };
  window.removeCisplatin = function(idx) {
    const doses = App.getCisplatinDoses(); doses.splice(idx,1);
    App.saveCisplatinDoses(doses); App.navigate('tools');
  };
  window.clearCisplatin = function() {
    if (confirm('確定清除所有記錄？')) { App.saveCisplatinDoses([]); App.navigate('tools'); }
  };

  // ── getTools / render API ─────────────────────────────────
  const ALL_CALC = [
    {key:'childpugh',      label:'Child-Pugh',  fn:renderChildPugh},
    {key:'roach',          label:'Roach',        fn:renderRoach},
    {key:'albi',           label:'ALBI',         fn:renderALBI},
    {key:'meld',           label:'MELD',         fn:renderMELD},
    {key:'calvert',        label:'Calvert',      fn:renderCalvert},
    {key:'cockcroftgault', label:'CrCl',         fn:renderCG},
    {key:'bsa',            label:'BSA',          fn:renderBSA},
    {key:'cisplatin',      label:'Cisplatin',    fn:renderCisplatin},
  ];

  function getTools(settings) {
    const en = settings?.enabledTools || {};
    return ALL_CALC.filter(t => en[t.key] !== false);
  }

  function render(settings, activeTool) {
    const visible = getTools(settings);
    if (!visible.length) return `<div class="text-center text-sm py-8" style="color:var(--t3);">計算工具已全部關閉</div>`;
    const tool = visible.find(t => t.key === activeTool) || visible[0];
    return tool.fn();
  }

  return { render, getTools };
})();
