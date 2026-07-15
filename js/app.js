// ──────────────────────────────────────────────────────────
//  App  —  routing, settings, localStorage
// ──────────────────────────────────────────────────────────

const App = (() => {
  const VERSION = 'V3.6.2';

  const DEFAULT_SETTINGS = {
    enabledTools: {
      // RT
      bed:true, treatmentgap:true, hypofrac:true,
      electron:true, 'mu-calc':true, 'ssd-corr':true, isl:true, hvl:true,
      // Calc
      childpugh:true, roach:true, albi:true, meld:true, psadt:true,
      anc:true, nccnprostate:true,
      calvert:true, cockcroftgault:true, bsa:true, cisplatin:true,
      // Score
      gpa:true, sins:true, tokuhashi:true, rpa:true, ecogkps:true
    }
  };

  let state = { page:'tools', toolsTab:'rt', settings:null, cisplatinDoses:[], activeTools:{rt:'bed', calc:'childpugh', score:'gpa'}, activePreset: null };

  // ── Storage ──────────────────────────────────────────────
  // Kit 坑 #69: localStorage key 是資料層 ID。V3.6.2 從 sela_* 改名 rttool_* 時
  // 沒寫 migration，舊使用者資料等同消失。此為一次性補救（key 已凍結，不再更名）。
  function migrateLegacyKeys() {
    if (localStorage.getItem('rttool_migrated_v320')) return;
    const MAP = {
      sela_settings:             'rttool_settings',
      sela_cisplatin:            'rttool_cisplatin',
      sela_custom_constraints:   'rttool_custom_constraints',
      sela_starred_constraints:  'rttool_starred_constraints',
      sela_override_constraints: 'rttool_override_constraints',
    };
    try {
      for (const [oldK, newK] of Object.entries(MAP)) {
        const v = localStorage.getItem(oldK);
        // 只在新 key 不存在時搬（不覆蓋使用者改名後的新資料）
        if (v !== null && localStorage.getItem(newK) === null) {
          localStorage.setItem(newK, v);
        }
      }
      localStorage.setItem('rttool_migrated_v320', '1');
    } catch { /* 隱私模式等禁寫情境：略過，不影響使用 */ }
  }

  function loadSettings() {
    migrateLegacyKeys();
    try {
      const s = localStorage.getItem('rttool_settings');
      state.settings = s ? Object.assign({}, DEFAULT_SETTINGS, JSON.parse(s)) : Object.assign({}, DEFAULT_SETTINGS);
      state.settings.enabledTools = Object.assign({}, DEFAULT_SETTINGS.enabledTools, state.settings.enabledTools);
    } catch { state.settings = Object.assign({}, DEFAULT_SETTINGS); }
    try {
      const d = localStorage.getItem('rttool_cisplatin');
      state.cisplatinDoses = d ? JSON.parse(d) : [];
    } catch { state.cisplatinDoses = []; }
  }
  function saveSettings() { localStorage.setItem('rttool_settings', JSON.stringify(state.settings)); }
  function getCisplatinDoses() { return state.cisplatinDoses; }
  function saveCisplatinDoses(doses) {
    state.cisplatinDoses = doses;
    localStorage.setItem('rttool_cisplatin', JSON.stringify(doses));
  }

  // ── Routing ──────────────────────────────────────────────
  function navigate(page) {
    state.page = page;
    render();
    updateNav();
  }
  function setToolsTab(tab) { state.toolsTab = tab; render(); }
  function setActiveTool(tab, key) { state.activeTools[tab] = key; render(); }

  function updateNav() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      const p = btn.getAttribute('data-page');
      btn.classList.toggle('nav-active', p === state.page);
      btn.style.color = '';  // clear any legacy inline color
    });
  }

  // ── Page renders ─────────────────────────────────────────
  // Sticky bar helper — sticks below the 64px fixed header
  function stickyBar(html) {
    return `<div class="page-sticky-bar" style="position:sticky;top:64px;z-index:40;background:var(--bg);margin:0 -16px;padding:10px 16px 8px;border-bottom:1px solid var(--border);">${html}</div>`;
  }

  function pillBtn(label, active, onclick) {
    return `<button onclick="${onclick}" class="fpill${active?' on':''}">${label}</button>`;
  }

  function pillRow(items, activeKey, onclickFn) {
    return `<div class="flex" style="flex-wrap:wrap;gap:6px;">
      ${items.map(i => pillBtn(i.label, i.key === activeKey, `${onclickFn}('${i.key}')`)).join('')}
    </div>`;
  }

  function pageWrap(content) {
    return `<div class="px-4 pt-4 pb-2">${content}</div>`;
  }

  function renderTools() {
    const tab = state.toolsTab;
    const active = state.activeTools;

    const tabIco = {
      rt:    `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 17c2-6 4-9 6-9s3 3 6 3 4-2 6-2"/><line x1="3" y1="21" x2="21" y2="21"/></svg>`,
      calc:  `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="4" y="3" width="16" height="18" rx="2"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="8" y2="11"/><line x1="12" y1="11" x2="12" y2="11"/><line x1="16" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="8" y2="15"/><line x1="12" y1="15" x2="12" y2="15"/></svg>`,
      score: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3 6-6"/><path d="M20 6v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h9"/></svg>`,
    };
    const tabs = [
      {id:'rt', label:'放療'}, {id:'calc', label:'計算'}, {id:'score', label:'評分'},
    ];
    const tabBar = `<div class="flex gap-1.5">${
      tabs.map(t => `<button onclick="App.setToolsTab('${t.id}')" class="fpill flex items-center gap-1${tab===t.id?' on':''}"><span style="display:inline-flex;vertical-align:middle;">${tabIco[t.id]}</span>${t.label}</button>`).join('')
    }</div>`;

    let tools, content;
    if (tab === 'rt') {
      tools = ToolsRT.getTools(state.settings);
      const activeKey = tools.find(t=>t.key===active.rt) ? active.rt : (tools[0]?.key||'bed');
      const toolPills = pillRow(tools, activeKey, 'AppSetTool_rt');
      content = ToolsRT.render(state.settings, activeKey);
      return `<div class="px-4 pt-4 pb-2">${stickyBar(tabBar + '<div style="margin-top:8px;">' + toolPills + '</div>')}<div class="pt-3">${content}</div></div>`;
    } else if (tab === 'calc') {
      tools = ToolsCalc.getTools(state.settings);
      const activeKey = tools.find(t=>t.key===active.calc) ? active.calc : (tools[0]?.key||'childpugh');
      const toolPills = pillRow(tools, activeKey, 'AppSetTool_calc');
      content = ToolsCalc.render(state.settings, activeKey);
      return `<div class="px-4 pt-4 pb-2">${stickyBar(tabBar + '<div style="margin-top:8px;">' + toolPills + '</div>')}<div class="pt-3">${content}</div></div>`;
    } else {
      tools = ToolsScore.getTools(state.settings);
      const activeKey = tools.find(t=>t.key===active.score) ? active.score : (tools[0]?.key||'gpa');
      const toolPills = pillRow(tools, activeKey, 'AppSetTool_score');
      content = ToolsScore.render(state.settings, activeKey);
      return `<div class="px-4 pt-4 pb-2">${stickyBar(tabBar + '<div style="margin-top:8px;">' + toolPills + '</div>')}<div class="pt-3">${content}</div></div>`;
    }
  }

  function renderSettings() {
    const en = state.settings.enabledTools;
    const rtTools = [
      {key:'bed',label:'BED / EQD2'},{key:'treatmentgap',label:'Treatment Gap'},
      {key:'hypofrac',label:'Hypofractionation Converter'},
      {key:'electron',label:'電子線劑量計算'},{key:'mu-calc',label:'MU 計算（光子線）'},
      {key:'ssd-corr',label:'SSD 修正（Mayneord）'},{key:'isl',label:'平方反比定律'},
      {key:'hvl',label:'屏蔽 / HVL 計算'},{key:'eqd2acc',label:'EQD2 累加 / 再程評估'},{key:'equivsq',label:'等效方形野'},
    ];
    const calcTools = [
      {key:'childpugh',label:'Child-Pugh + BCLC'},{key:'roach',label:"Roach Formula + D'Amico"},
      {key:'albi',label:'ALBI Score'},{key:'meld',label:'MELD Score'},
      {key:'calvert',label:'Calvert Formula'},{key:'cockcroftgault',label:'Cockcroft-Gault (CrCl)'},
      {key:'bsa',label:'BSA Calculator'},{key:'cisplatin',label:'Cisplatin 累積劑量'},{key:'psadt',label:'PSA Doubling Time'},{key:'anc',label:'ANC 計算'},{key:'nccnprostate',label:'NCCN 攝護腺風險'},
    ];
    const scoreTools = [
      {key:'gpa',label:'GPA Score (DS-GPA)'},{key:'sins',label:'SINS Score'},
      {key:'tokuhashi',label:'Tokuhashi Score'},{key:'rpa',label:'RPA Class'},
      {key:'ecogkps',label:'ECOG ↔ KPS'},
    ];

    const toggle = (t) => `
      <div class="flex items-center justify-between py-2.5" style="border-bottom:1px solid var(--border);">
        <span class="text-sm" style="color:var(--t1);">${t.label}</span>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" class="sr-only peer tool-toggle" data-key="${t.key}" ${en[t.key]!==false?'checked':''}>
          <div class="w-10 h-5 rounded-full transition-colors" style="background:#C8D2DF;"></div>
          <div class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all peer-checked:translate-x-5" style="box-shadow:0 1px 3px rgba(0,0,0,.2);"></div>
        </label>
      </div>`;

    const section = (title, tools) => `
      <div class="card p-4 mb-3">
        <div class="sec-label mb-3">${title}</div>
        ${tools.map(toggle).join('')}
      </div>`;

    return pageWrap(`
      <div class="text-base font-semibold mb-3" style="color:var(--t1);">設定</div>
      <div class="card p-4 mb-3">
        <div class="sec-label mb-3">快速預設</div>
        <div class="flex gap-2">
          ${[['all','全開'],['radonc','放腫核心'],['minimal','精簡']].map(([k,lbl]) => {
            const on = state.activePreset === k;
            const s = on ? 'background:var(--accent);color:#fff;border:1px solid var(--accent);' : 'background:var(--bg);color:var(--t2);border:1px solid var(--border);';
            return `<button onclick="App.applyPreset('${k}')" class="flex-1 py-2 text-xs rounded-lg font-medium" style="${s}">${lbl}</button>`;
          }).join('')}
        </div>
      </div>
      ${section('放療工具', rtTools)}
      ${section('計算工具', calcTools)}
      ${section('評分工具', scoreTools)}
      <div class="card p-4 mb-3">
        <div class="sec-label mb-3">資料管理</div>
        <div class="flex gap-2">
          <button onclick="App.exportData()" class="flex-1 py-2 text-xs rounded-lg font-medium" style="background:var(--bg);color:var(--t1);border:1px solid var(--border);">匯出 JSON</button>
          <button onclick="App.importData()" class="flex-1 py-2 text-xs rounded-lg font-medium" style="background:var(--acc-bg);color:var(--accent);border:1px solid var(--border);">匯入 JSON</button>
        </div>
        <input type="file" id="import-file" accept=".json" class="hidden" onchange="App.handleImport(event)">
      </div>
      <div class="text-center text-xs mono pb-2" style="color:var(--t3);">RT-Tool ${VERSION}</div>
    `);
  }

  // ── Render dispatch ──────────────────────────────────────
  function render() {
    const main = document.getElementById('app-main');
    switch(state.page) {
      case 'tools': {
        main.innerHTML = renderTools();
        // Auto-expand the active tool card (body starts hidden in U.cardWrap)
        const tab = state.toolsTab;
        const allTools = [
          ...ToolsRT.getTools(state.settings),
          ...ToolsCalc.getTools(state.settings),
          ...ToolsScore.getTools(state.settings),
        ];
        const activeKey = (() => {
          if (tab==='rt')    { const t=ToolsRT.getTools(state.settings);    return (t.find(x=>x.key===state.activeTools.rt)    ? state.activeTools.rt    : t[0]?.key) || 'bed'; }
          if (tab==='calc')  { const t=ToolsCalc.getTools(state.settings);  return (t.find(x=>x.key===state.activeTools.calc)  ? state.activeTools.calc  : t[0]?.key) || 'childpugh'; }
                               { const t=ToolsScore.getTools(state.settings); return (t.find(x=>x.key===state.activeTools.score) ? state.activeTools.score : t[0]?.key) || 'gpa'; }
        })();
        toggleCard(activeKey);
        // Score tools needing post-DOM init
        if (tab === 'score') {
          setTimeout(() => {
            if (activeKey === 'gpa') { if (typeof updateGPAInputs === 'function') updateGPAInputs(); }
            if (activeKey === 'ecogkps') { if (typeof showECOG === 'function') showECOG(); }
          }, 0);
        }
        break;
      }
      case 'staging':     main.innerHTML = pageWrap(Staging.render()); Staging.afterRender(); break;
      case 'constraints': {
        main.innerHTML = pageWrap(UIConstraints.render());
        UIConstraints.bindEvents();
        break;
      }
      case 'icd': {
        main.innerHTML = pageWrap(UIICD.render());
        UIICD.bindEvents();
        break;
      }
      case 'settings':    main.innerHTML = renderSettings(); bindSettingsEvents(); break;
      default:            main.innerHTML = renderTools();
    }
  }

  function bindSettingsEvents() {
    document.querySelectorAll('.tool-toggle').forEach(el => {
      const track = el.nextElementSibling;
      if (track) track.style.background = el.checked ? 'var(--accent)' : '#C8D2DF';
      el.addEventListener('change', (e) => {
        state.settings.enabledTools[e.target.dataset.key] = e.target.checked;
        if (track) track.style.background = e.target.checked ? 'var(--accent)' : '#C8D2DF';
        saveSettings();
      });
    });
  }

  function applyPreset(preset) {
    state.activePreset = preset;
    const en = state.settings.enabledTools;
    const all = Object.keys(en);
    const radonc  = ['bed','treatmentgap','hypofrac','childpugh','roach','albi','meld','gpa','sins','tokuhashi','rpa','ecogkps'];
    const minimal = ['bed','childpugh','roach','gpa','rpa','ecogkps'];
    if (preset==='all')     all.forEach(k => en[k]=true);
    if (preset==='radonc')  all.forEach(k => en[k]=radonc.includes(k));
    if (preset==='minimal') all.forEach(k => en[k]=minimal.includes(k));
    saveSettings(); render();
  }

  function exportData() {
    const data = {
      version: VERSION, exportDate: new Date().toISOString(),
      settings: state.settings, cisplatinDoses: state.cisplatinDoses,
      customConstraints:  JSON.parse(localStorage.getItem('rttool_custom_constraints')||'[]'),
      starredConstraints: JSON.parse(localStorage.getItem('rttool_starred_constraints')||'[]'),
      overrideConstraints:JSON.parse(localStorage.getItem('rttool_override_constraints')||'{}'),
    };
    const blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    const a = Object.assign(document.createElement('a'),{
      href:URL.createObjectURL(blob),
      download:`rt-tool-${new Date().toISOString().slice(0,10)}.json`
    });
    a.click(); URL.revokeObjectURL(a.href);
  }
  function importData() { document.getElementById('import-file')?.click(); }
  function handleImport(e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const d = JSON.parse(ev.target.result);
        if (d.settings) { state.settings = Object.assign({}, DEFAULT_SETTINGS, d.settings); saveSettings(); }
        if (d.cisplatinDoses) saveCisplatinDoses(d.cisplatinDoses);
        if (d.customConstraints)   localStorage.setItem('rttool_custom_constraints', JSON.stringify(d.customConstraints));
        if (d.starredConstraints)  localStorage.setItem('rttool_starred_constraints', JSON.stringify(d.starredConstraints));
        if (d.overrideConstraints) localStorage.setItem('rttool_override_constraints', JSON.stringify(d.overrideConstraints));
        alert('匯入成功'); render();
      } catch { alert('匯入失敗：格式錯誤'); }
    };
    reader.readAsText(file);
  }

  function init() { loadSettings(); render(); updateNav(); }

  return { navigate, setToolsTab, setActiveTool, applyPreset, exportData, importData, handleImport, getCisplatinDoses, saveCisplatinDoses, init };
})();

// Global helper: open a card and scroll to it
window.jumpTo = function(id) {
  const body = document.getElementById(id+'-body');
  if (body && !body.classList.contains('open')) toggleCard(id);
  // Scroll after DOM settles
  setTimeout(() => {
    const target = document.getElementById(id+'-body');
    if (target) target.parentElement?.scrollIntoView({behavior:'smooth', block:'start'});
  }, 30);
};

window.AppSetTool_rt    = k => App.setActiveTool('rt',    k);
window.AppSetTool_calc  = k => App.setActiveTool('calc',  k);
window.AppSetTool_score = k => App.setActiveTool('score', k);

document.addEventListener('DOMContentLoaded', App.init);
