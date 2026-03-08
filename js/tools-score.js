// ──────────────────────────────────────────────────────────
//  ToolsScore  —  5 scoring tools
// ──────────────────────────────────────────────────────────

const ToolsScore = (() => {

  const inp = (id) => document.getElementById(id);
  const val = (id) => parseFloat(document.getElementById(id)?.value) || 0;
  const setHTML = (id, html) => { const el = document.getElementById(id); if(el) el.innerHTML = html; };

  function resultCard(content, type='info') {
    const colors = { info:'bg-blue-50 border-blue-200 text-blue-800', ok:'bg-green-50 border-green-200 text-green-800', warn:'bg-amber-50 border-amber-200 text-amber-800', danger:'bg-red-50 border-red-200 text-red-800' };
    return `<div class="mt-3 p-3 rounded-lg border text-sm leading-relaxed ${colors[type]}">${content}</div>`;
  }

  function cardWrap(id, icon, title, body) {
    return `
    <div class="bg-white rounded-xl mb-3 overflow-hidden" style="border:1px solid #E2DFD8;">
      <button onclick="toggleCard('${id}')" class="w-full px-4 py-3 flex items-center justify-between text-left">
        <div class="flex items-center gap-2.5">
          <span class="flex-shrink-0 w-5 h-5 flex items-center justify-center" style="color:#5A5750;">${icon}</span>
          <span class="font-medium text-sm" style="color:#1A1A1A;">${title}</span>
        </div>
          <span class="font-medium text-sm text-gray-800">${title}</span>
        </div>
        <svg id="${id}-chev" class="w-4 h-4 text-gray-400 flex-shrink-0" style="transition:transform 0.2s" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
      </button>
      <div id="${id}-body" class="hidden px-4 pb-4">${body}</div>
    </div>`;
  }

  function selectRow(label, id, options) {
    const opts = options.map(([v,t]) => `<option value="${v}">${t}</option>`).join('');
    return `<div class="mb-2"><label class="text-xs text-gray-500 mb-1 block">${label}</label><select id="${id}" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white">${opts}</select></div>`;
  }

  function inputRow(label, id, placeholder, unit='') {
    return `<div class="mb-2"><label class="text-xs text-gray-500 mb-1 block">${label}${unit?` <span class="text-gray-400">(${unit})</span>`:''}</label><input type="number" id="${id}" placeholder="${placeholder}" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white"></div>`;
  }

  function calcBtn(fn) {
    return `<button onclick="${fn}" class="w-full mt-3 rounded-lg py-2 text-sm font-medium transition-colors" style="background:#222220;color:#fff;">計算</button>`;
  }

  // ── 1. GPA Score (DS-GPA) ───────────────────────────────
  function renderGPA() {
    const body = `
      ${selectRow('原發癌種','gpa-type',[
        ['nsclc','NSCLC'],['sclc','SCLC'],['breast','Breast'],
        ['melanoma','Melanoma'],['gi','GI'],['renal','Renal']
      ])}
      <div id="gpa-inputs"></div>
      ${calcBtn('calcGPA()')}
      <div id="gpa-result"></div>`;
    return cardWrap('gpa',`<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M9 2 L10.5 7 L16 7 L11.5 10.5 L13 15.5 L9 12.5 L5 15.5 L6.5 10.5 L2 7 L7.5 7 Z"/>
</svg>`,'GPA Score (DS-GPA)',body);
  }

  // GPA scoring tables by cancer type
  const GPA_CONFIG = {
    nsclc: {
      items: [
        { label:'KPS', id:'gpa-kps', opts:[['0','< 70 (0)'],['1','70-80 (1)'],['1.5','90-100 (1.5)']] },
        { label:'年齡', id:'gpa-age', opts:[['0','≥ 60 (0)'],['0.5','50-59 (0.5)'],['1','< 50 (1)']] },
        { label:'顱外轉移', id:'gpa-ecm', opts:[['0','有 (0)'],['1','無 (1)']] },
        { label:'腦轉移數目', id:'gpa-bm', opts:[['0','≥ 5 (0)'],['0.5','2-4 (0.5)'],['1','1 (1)']] },
      ],
      survival: {'0-1.0':'7 mo','1.5-2.0':'11 mo','2.5-3.0':'17 mo','3.5-4.0':'26 mo'}
    },
    sclc: {
      items: [
        { label:'KPS', id:'gpa-kps', opts:[['0','< 70 (0)'],['1','70-80 (1)'],['1.5','90-100 (1.5)']] },
        { label:'腦轉移數目', id:'gpa-bm', opts:[['0','≥ 5 (0)'],['0.5','2-4 (0.5)'],['1','1 (1)']] },
      ],
      survival: {'0-1.0':'2.8 mo','1.5-2.0':'5.3 mo','2.5-3.0':'9.0 mo'}
    },
    breast: {
      items: [
        { label:'KPS', id:'gpa-kps', opts:[['0','< 60 (0)'],['0.5','60-70 (0.5)'],['1','80 (1)'],['1.5','90-100 (1.5)']] },
        { label:'腦轉移數目', id:'gpa-bm', opts:[['0','≥ 5 (0)'],['0.5','2-4 (0.5)'],['1','1 (1)']] },
        { label:'Subtype', id:'gpa-sub', opts:[['0','Basal (0)'],['1','Luminal A (1)'],['1.5','HER2 (1.5)'],['2','HR+/HER2+ (2)']] },
      ],
      survival: {'0-1.0':'3.4 mo','1.5-2.0':'7.7 mo','2.5-3.0':'15.1 mo','3.5-4.0':'25.3 mo'}
    },
    melanoma: {
      items: [
        { label:'KPS', id:'gpa-kps', opts:[['0','< 70 (0)'],['1','70-80 (1)'],['2','90-100 (2)']] },
        { label:'腦轉移數目', id:'gpa-bm', opts:[['0','≥ 5 (0)'],['1','2-4 (1)'],['2','1 (2)']] },
      ],
      survival: {'0-1.0':'3.4 mo','1.5-2.0':'4.7 mo','2.5-3.0':'8.8 mo','3.5-4.0':'13.2 mo'}
    },
    gi: {
      items: [
        { label:'KPS', id:'gpa-kps', opts:[['0','< 70 (0)'],['1','70-80 (1)'],['1.5','90-100 (1.5)']] },
        { label:'腦轉移數目', id:'gpa-bm', opts:[['0','≥ 5 (0)'],['0.5','2-4 (0.5)'],['1','1 (1)']] },
      ],
      survival: {'0-1.0':'3.1 mo','1.5-2.0':'4.4 mo','2.5-3.0':'6.9 mo'}
    },
    renal: {
      items: [
        { label:'KPS', id:'gpa-kps', opts:[['0','< 70 (0)'],['1','70-80 (1)'],['2','90-100 (2)']] },
        { label:'腦轉移數目', id:'gpa-bm', opts:[['0','≥ 5 (0)'],['1','2-4 (1)'],['2','1 (2)']] },
        { label:'顱外轉移', id:'gpa-ecm', opts:[['0','有 (0)'],['1','無 (1)']] },
      ],
      survival: {'0-1.0':'3.3 mo','1.5-2.0':'7.3 mo','2.5-3.0':'11.3 mo','3.5-4.0':'14.8 mo'}
    }
  };

  window.updateGPAInputs = function() {
    const type = inp('gpa-type')?.value || 'nsclc';
    const cfg = GPA_CONFIG[type];
    const html = cfg.items.map(item => selectRow(item.label, item.id, item.opts)).join('');
    setHTML('gpa-inputs', html);
  };

  window.calcGPA = function() {
    const type = inp('gpa-type')?.value || 'nsclc';
    const cfg = GPA_CONFIG[type];
    let score = 0;
    cfg.items.forEach(item => { score += parseFloat(inp(item.id)?.value||0); });
    const maxScore = cfg.items.reduce((s,i) => s + parseFloat(i.opts[i.opts.length-1][0]), 0);
    // Find survival
    let survival = '?';
    for(const [range, surv] of Object.entries(cfg.survival)) {
      const [lo,hi] = range.split('-').map(Number);
      if(score >= lo && score <= (hi||lo)) { survival = surv; break; }
    }
    const pct = score/maxScore;
    const type2 = pct>=0.75?'ok':pct>=0.5?'warn':'danger';
    setHTML('gpa-result', resultCard(`
      <div class="text-center">
        <div class="mono text-2xl font-bold">${score.toFixed(1)} / ${maxScore}</div>
        <div class="text-sm mt-1">中位存活：<span class="font-bold">${survival}</span></div>
      </div>
    `, type2));
  };

  // ── 2. SINS Score ───────────────────────────────────────
  function renderSINS() {
    const body = `
      ${selectRow('1. 位置','sins-loc',[['3','交界處 (O/C, C/T, T/L, L/S) — 3'],['2','活動節 (C/L spine) — 2'],['1','半固定節 (T-spine) — 1'],['0','固定節 (S1-S5) — 0']])}
      ${selectRow('2. 疼痛','sins-pain',[['3','是 (與活動相關) — 3'],['1','偶爾疼痛 — 1'],['0','無痛 — 0']])}
      ${selectRow('3. 骨質','sins-bone',[['2','溶骨性 — 2'],['1','混合性 — 1'],['0','成骨性 — 0']])}
      ${selectRow('4. 脊椎排列','sins-align',[['4','脫位/移位 — 4'],['2','脊椎後彎/側彎 — 2'],['0','正常 — 0']])}
      ${selectRow('5. 椎體受侵犯','sins-vb',[['2','>50% 塌陷 — 2'],['1','<50% 塌陷 — 1'],['1','無塌陷但>50% 受侵 — 1'],['0','無上述 — 0']])}
      ${selectRow('6. 後外側受侵','sins-poster',[['3','雙側 — 3'],['1','單側 — 1'],['0','無 — 0']])}
      ${calcBtn('calcSINS()')}
      <div id="sins-result"></div>`;
    return cardWrap('sins',`<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
  <rect x="6" y="2" width="6" height="4" rx="1"/>
  <rect x="6" y="7" width="6" height="4" rx="1"/>
  <rect x="6" y="12" width="6" height="4" rx="1"/>
  <line x1="9" y1="6" x2="9" y2="7"/>
  <line x1="9" y1="11" x2="9" y2="12"/>
</svg>`,'SINS Score（脊椎不穩定）',body);
  }

  window.calcSINS = function() {
    const items = ['sins-loc','sins-pain','sins-bone','sins-align','sins-vb','sins-poster'];
    const total = items.reduce((s,id) => s + (parseFloat(inp(id)?.value)||0), 0);
    const stab = total<=6 ? {label:'穩定 (Stable)', type:'ok', desc:'觀察 ± 輔助器具'} :
                 total<=12 ? {label:'潛在不穩定 (Potentially Unstable)', type:'warn', desc:'建議骨科會診'} :
                 {label:'不穩定 (Unstable)', type:'danger', desc:'手術評估'};
    setHTML('sins-result', resultCard(`
      <div class="text-center">
        <div class="mono text-2xl font-bold">${total} / 18</div>
        <div class="text-sm font-bold mt-1">${stab.label}</div>
        <div class="text-xs text-gray-600 mt-1">${stab.desc}</div>
      </div>
    `, stab.type));
  };

  // ── 3. Tokuhashi Score ──────────────────────────────────
  function renderTokuhashi() {
    const body = `
      ${selectRow('1. 一般狀況 (KPS)','toku-gc',[['0','差 (KPS 10-40%) — 0'],['1','中 (KPS 50-70%) — 1'],['2','好 (KPS 80-100%) — 2']])}
      ${selectRow('2. 脊椎外骨轉移數目','toku-bone',[['0','≥ 3 處 — 0'],['1','1-2 處 — 1'],['2','無 — 2']])}
      ${selectRow('3. 主要器官轉移','toku-organ',[['0','不可切除 — 0'],['1','可切除 — 1'],['2','無 — 2']])}
      ${selectRow('4. 原發部位','toku-primary',[['0','肺/骨肉瘤/胃/膀胱/食道/胰 — 0'],['1','肝/膽/不明原發 — 1'],['2','其他 — 2'],['3','腎/子宮 — 3'],['4','直腸 — 4'],['5','甲狀腺/乳/前列腺/類癌 — 5']])}
      ${selectRow('5. 脊髓癱瘓 (Frankel)','toku-palsy',[['0','完全癱 (A,B) — 0'],['1','不完全癱 (C,D) — 1'],['2','無 (E) — 2']])}
      ${calcBtn('calcTokuhashi()')}
      <div id="toku-result"></div>`;
    return cardWrap('tokuhashi',`<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
  <rect x="6" y="2" width="6" height="4" rx="1"/>
  <rect x="6" y="7" width="6" height="4" rx="1"/>
  <rect x="6" y="12" width="6" height="4" rx="1"/>
  <line x1="9" y1="6" x2="9" y2="7"/>
  <line x1="9" y1="11" x2="9" y2="12"/>
  <polyline points="11,5 14,9 11,13"/>
</svg>`,'Tokuhashi Score（脊椎轉移）',body);
  }

  window.calcTokuhashi = function() {
    const items = ['toku-gc','toku-bone','toku-organ','toku-primary','toku-palsy'];
    const total = items.reduce((s,id) => s + (parseFloat(inp(id)?.value)||0), 0);
    const prog = total<=8 ? {label:'< 6 個月', type:'danger'} :
                 total<=11 ? {label:'≥ 6 個月', type:'warn'} :
                 {label:'≥ 12 個月', type:'ok'};
    const rec = total<=8 ? '保守治療（支持性）' : total<=11 ? '後方減壓固定術或 RT' : '腫瘤完全或部分切除術';
    setHTML('toku-result', resultCard(`
      <div class="text-center">
        <div class="mono text-2xl font-bold">${total} / 15</div>
        <div class="text-sm font-bold mt-1">預期存活：${prog.label}</div>
        <div class="text-xs text-gray-600 mt-1">建議：${rec}</div>
      </div>
    `, prog.type));
  };

  // ── 4. RPA Class ────────────────────────────────────────
  function renderRPA() {
    const body = `
      ${selectRow('KPS','rpa-kps',[['high','≥ 70'],['low','< 70']])}
      ${selectRow('年齡','rpa-age',[['lt65','< 65 歲'],['gte65','≥ 65 歲']])}
      ${selectRow('原發灶控制','rpa-primary',[['ctrl','已控制'],['noctrl','未控制']])}
      ${selectRow('顱外轉移','rpa-ecm',[['no','無'],['yes','有']])}
      ${calcBtn('calcRPA()')}
      <div id="rpa-result"></div>`;
    return cardWrap('rpa',`<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
  <path d="M4 16 C4 10 6 4 9 3 C12 4 14 10 14 16"/>
  <path d="M6.5 10 C6.5 10 7.5 8 9 8 C10.5 8 11.5 10 11.5 10"/>
  <line x1="9" y1="8" x2="9" y2="6"/>
</svg>`,'RPA Class（腦轉移）',body);
  }

  window.calcRPA = function() {
    const kps = inp('rpa-kps')?.value;
    const age = inp('rpa-age')?.value;
    const prim = inp('rpa-primary')?.value;
    const ecm = inp('rpa-ecm')?.value;
    let cls, survival, type;
    if(kps==='high' && age==='lt65' && prim==='ctrl' && ecm==='no') {
      cls=1; survival='7.1 個月'; type='ok';
    } else if(kps==='low') {
      cls=3; survival='2.3 個月'; type='danger';
    } else {
      cls=2; survival='4.2 個月'; type='warn';
    }
    setHTML('rpa-result', resultCard(`
      <div class="text-center">
        <div class="text-3xl font-bold">Class ${cls}</div>
        <div class="text-sm mt-1">中位存活：<span class="font-bold">${survival}</span></div>
      </div>
    `, type));
  };

  // ── 5. ECOG ↔ KPS ────────────────────────────────────────
  function renderECOGKPS() {
    const table = [
      [0, 100, '完全正常活動，無任何症狀'],
      [1, 80-90, '有症狀但可自理，>50%清醒時可行走'],
      [2, 60-70, '生活可自理，>50%清醒時可行走'],
      [3, 40-50, '生活部分自理，>50%時間臥床'],
      [4, 20-30, '完全失能，完全臥床'],
    ];
    const rows = [
      [0,  100, '完全正常'],
      [1,  90,  '有症狀，能正常活動'],
      [1,  80,  '有症狀，部分需協助'],
      [2,  70,  '可自理，無法工作'],
      [2,  60,  '需偶爾協助'],
      [3,  50,  '需相當協助，頻繁就醫'],
      [3,  40,  '失能，需特殊照護'],
      [4,  30,  '重度失能，住院指徵'],
      [4,  20,  '病重，需積極支持'],
      [4,  10,  '病危'],
    ].map(([ecog,kps,desc]) => `
      <tr class="border-b border-gray-50 hover:bg--50 transition-colors">
        <td class="py-1.5 px-2 text-center font-bold mono style="color:#1A1A1A;"">${ecog}</td>
        <td class="py-1.5 px-2 text-center mono">${kps}</td>
        <td class="py-1.5 px-2 text-xs text-gray-600">${desc}</td>
      </tr>
    `).join('');

    const body = `
      <div class="mb-3">
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="text-xs text-gray-500 mb-1 block">輸入 ECOG (0-4)</label>
            <input type="number" id="ek-ecog" min="0" max="4" placeholder="0-4" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" oninput="convertECOG()">
          </div>
          <div>
            <label class="text-xs text-gray-500 mb-1 block">輸入 KPS (10-100)</label>
            <input type="number" id="ek-kps" min="10" max="100" step="10" placeholder="10-100" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" oninput="convertKPS()">
          </div>
        </div>
        <div id="ek-result" class="mt-2"></div>
      </div>
      <table class="w-full text-sm">
        <thead><tr class="text-xs text-gray-500 border-b border-gray-200">
          <th class="py-1 px-2">ECOG</th><th class="py-1 px-2">KPS</th><th class="py-1 px-2 text-left">描述</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
    return cardWrap('ecogkps',`<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="9" cy="3.5" r="1.5"/>
  <line x1="9" y1="5" x2="9" y2="11"/>
  <polyline points="6,8 9,11 12,8"/>
  <line x1="7" y1="13" x2="9" y2="11"/>
  <line x1="11" y1="13" x2="9" y2="11"/>
  <line x1="5.5" y1="16" x2="7" y2="13"/>
  <line x1="12.5" y1="16" x2="11" y2="13"/>
</svg>`,'ECOG ↔ KPS 換算',body);
  }

  const ECOG_MAP = [[0,100],[0,90],[1,80],[1,70],[2,60],[2,50],[3,40],[3,30],[4,20],[4,10]];
  window.convertECOG = function() {
    const ecog = parseInt(inp('ek-ecog')?.value);
    if(isNaN(ecog)||ecog<0||ecog>4) return;
    const kpsVals = ECOG_MAP.filter(([e])=>e===ecog).map(([,k])=>k);
    const kpsStr = kpsVals.join(' / ');
    setHTML('ek-result', `<div class="text-xs bg--50 rounded-lg px-3 py-2">ECOG ${ecog} → KPS <span class="font-bold mono">${kpsStr}</span></div>`);
  };
  window.convertKPS = function() {
    const kps = parseInt(inp('ek-kps')?.value);
    if(isNaN(kps)||kps<10||kps>100) return;
    const closest = ECOG_MAP.reduce((a,b) => Math.abs(b[1]-kps)<Math.abs(a[1]-kps)?b:a);
    setHTML('ek-result', `<div class="text-xs bg--50 rounded-lg px-3 py-2">KPS ${kps} → ECOG <span class="font-bold mono">${closest[0]}</span></div>`);
  };

  // ── Render all ──────────────────────────────────────────
  function render(settings) {
    const en = settings?.enabledTools || {};
    const tools = [
      {key:'gpa', fn: renderGPA},
      {key:'sins', fn: renderSINS},
      {key:'tokuhashi', fn: renderTokuhashi},
      {key:'rpa', fn: renderRPA},
      {key:'ecogkps', fn: renderECOGKPS},
    ];
    const html = tools.filter(t => en[t.key] !== false).map(t => t.fn()).join('');
    // Initialize GPA inputs after render
    setTimeout(() => { if(typeof updateGPAInputs==='function') updateGPAInputs(); }, 50);
    return html || '<div class="text-center text-gray-400 text-sm py-8">所有評分工具已關閉</div>';
  }

  return { render };
})();
