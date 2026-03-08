// ──────────────────────────────────────────────────────────
//  App  —  routing, settings, localStorage
// ──────────────────────────────────────────────────────────

const App = (() => {
  const VERSION = 'V1.3.1';

  const DEFAULT_SETTINGS = {
    enabledTools: {
      // RT
      bed:true, treatmentgap:true, hypofrac:true,
      // Calc
      childpugh:true, roach:true, albi:true, meld:true,
      calvert:true, cockcroftgault:true, bsa:true, cisplatin:true,
      // Score
      gpa:true, sins:true, tokuhashi:true, rpa:true, ecogkps:true
    }
  };

  let state = { page:'tools', toolsTab:'rt', settings:null, cisplatinDoses:[] };

  // ── Storage ──────────────────────────────────────────────
  function loadSettings() {
    try {
      const s = localStorage.getItem('sela_settings');
      state.settings = s ? Object.assign({}, DEFAULT_SETTINGS, JSON.parse(s)) : Object.assign({}, DEFAULT_SETTINGS);
      state.settings.enabledTools = Object.assign({}, DEFAULT_SETTINGS.enabledTools, state.settings.enabledTools);
    } catch { state.settings = Object.assign({}, DEFAULT_SETTINGS); }
    try {
      const d = localStorage.getItem('sela_cisplatin');
      state.cisplatinDoses = d ? JSON.parse(d) : [];
    } catch { state.cisplatinDoses = []; }
  }
  function saveSettings() { localStorage.setItem('sela_settings', JSON.stringify(state.settings)); }
  function getCisplatinDoses() { return state.cisplatinDoses; }
  function saveCisplatinDoses(doses) {
    state.cisplatinDoses = doses;
    localStorage.setItem('sela_cisplatin', JSON.stringify(doses));
  }

  // ── Routing ──────────────────────────────────────────────
  function navigate(page) {
    state.page = page;
    render();
    updateNav();
  }
  function setToolsTab(tab) { state.toolsTab = tab; render(); }

  function updateNav() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      const p = btn.getAttribute('data-page');
      btn.style.color = p === state.page ? 'var(--accent)' : 'var(--t3)';
    });
  }

  // ── Page renders ─────────────────────────────────────────
  function pageWrap(content) {
    return `<div class="px-4 pt-4 pb-2">${content}</div>`;
  }

  function renderTools() {
    const tab = state.toolsTab;
    const tabs = [
      { id:'rt',    label:'放療 RT' },
      { id:'calc',  label:'計算'    },
      { id:'score', label:'評分'    },
    ];
    const tabBar = `<div class="tab-bar">${
      tabs.map(t => `<button class="tab-btn${tab===t.id?' active':''}" onclick="App.setToolsTab('${t.id}')">${t.label}</button>`).join('')
    }</div>`;

    let content;
    if (tab === 'rt')    content = ToolsRT.render(state.settings);
    else if (tab === 'calc')  content = ToolsCalc.render(state.settings);
    else content = ToolsScore.render(state.settings);

    return pageWrap(tabBar + content);
  }

  function renderSettings() {
    const en = state.settings.enabledTools;
    const rtTools = [
      {key:'bed',label:'BED / EQD2'},{key:'treatmentgap',label:'Treatment Gap'},
      {key:'hypofrac',label:'Hypofractionation Converter'},
    ];
    const calcTools = [
      {key:'childpugh',label:'Child-Pugh + BCLC'},{key:'roach',label:"Roach Formula + D'Amico"},
      {key:'albi',label:'ALBI Score'},{key:'meld',label:'MELD Score'},
      {key:'calvert',label:'Calvert Formula'},{key:'cockcroftgault',label:'Cockcroft-Gault (CrCl)'},
      {key:'bsa',label:'BSA Calculator'},{key:'cisplatin',label:'Cisplatin 累積劑量'},
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
          <button onclick="App.applyPreset('all')"     class="flex-1 py-2 text-xs rounded-lg font-medium" style="background:var(--bg);color:var(--t1);border:1px solid var(--border);">全開</button>
          <button onclick="App.applyPreset('radonc')"  class="flex-1 py-2 text-xs rounded-lg font-medium" style="background:var(--acc-bg);color:var(--accent);border:1px solid var(--border);">放腫核心</button>
          <button onclick="App.applyPreset('minimal')" class="flex-1 py-2 text-xs rounded-lg font-medium" style="background:var(--bg);color:var(--t2);border:1px solid var(--border);">精簡</button>
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
      <div class="rounded-xl p-4 mb-3 text-xs leading-relaxed" style="background:var(--bg);color:var(--t2);border:1px solid var(--border);">
        本工具僅供臨床參考，所有醫療決策請依據最新指引及臨床判斷。劑量限制數據以原始文獻為準。
      </div>
      <div class="text-center text-xs mono pb-2" style="color:var(--t3);">SELA RadOnc ${VERSION}</div>
    `);
  }

  // ── Render dispatch ──────────────────────────────────────
  function render() {
    const main = document.getElementById('app-main');
    switch(state.page) {
      case 'tools':       main.innerHTML = renderTools(); break;
      case 'staging':     main.innerHTML = pageWrap(Staging.render()); break;
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
      customConstraints:  JSON.parse(localStorage.getItem('sela_custom_constraints')||'[]'),
      starredConstraints: JSON.parse(localStorage.getItem('sela_starred_constraints')||'[]'),
      overrideConstraints:JSON.parse(localStorage.getItem('sela_override_constraints')||'{}'),
    };
    const blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    const a = Object.assign(document.createElement('a'),{
      href:URL.createObjectURL(blob),
      download:`sela-radonc-${new Date().toISOString().slice(0,10)}.json`
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
        if (d.customConstraints)   localStorage.setItem('sela_custom_constraints', JSON.stringify(d.customConstraints));
        if (d.starredConstraints)  localStorage.setItem('sela_starred_constraints', JSON.stringify(d.starredConstraints));
        if (d.overrideConstraints) localStorage.setItem('sela_override_constraints', JSON.stringify(d.overrideConstraints));
        alert('✅ 匯入成功'); render();
      } catch { alert('❌ 匯入失敗：格式錯誤'); }
    };
    reader.readAsText(file);
  }

  function init() { loadSettings(); render(); updateNav(); }

  return { navigate, setToolsTab, applyPreset, exportData, importData, handleImport, getCisplatinDoses, saveCisplatinDoses, init };
})();

document.addEventListener('DOMContentLoaded', App.init);
