// ──────────────────────────────────────────────────────────
//  App  —  routing, settings, localStorage
// ──────────────────────────────────────────────────────────

const App = (() => {
  const VERSION = 'V1.2.2';

  const DEFAULT_SETTINGS = {
    enabledTools: {
      bed:true, childpugh:true, roach:true, albi:true, meld:true,
      treatmentgap:true, hypofrac:true, calvert:true, cockcroftgault:true,
      bsa:true, cisplatin:true,
      gpa:true, sins:true, tokuhashi:true, rpa:true, ecogkps:true
    }
  };

  let state = { page:'tools', toolsTab:'calc', settings:null, cisplatinDoses:[] };

  // ── Storage ─────────────────────────────────────────────
  function loadSettings() {
    try {
      const s = localStorage.getItem('sela_settings');
      state.settings = s ? Object.assign({}, DEFAULT_SETTINGS, JSON.parse(s)) : Object.assign({}, DEFAULT_SETTINGS);
      // ensure all keys present
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

  // ── Routing ─────────────────────────────────────────────
  function navigate(page) {
    state.page = page;
    render();
    updateNav();
  }

  function setToolsTab(tab) { state.toolsTab = tab; render(); }

  function updateNav() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      const p = btn.getAttribute('data-page');
      if(p === state.page) {
        btn.style.color = '#1A1A1A';
      } else {
        btn.style.color = '#9E9A93';
      }
    });
  }

  // ── Render ───────────────────────────────────────────────
  function render() {
    const main = document.getElementById('app-main');
    switch(state.page) {
      case 'tools':       main.innerHTML = renderTools(); break;
      case 'staging':     main.innerHTML = renderStaging(); break;
      case 'constraints': main.innerHTML = UIConstraints.render(); UIConstraints.bindEvents(); break;
      case 'icd':         main.innerHTML = UIICD.render(); UIICD.bindEvents(); break;
      case 'settings':    main.innerHTML = renderSettings(); bindSettingsEvents(); break;
      default:            main.innerHTML = renderTools();
    }
  }

  function renderTools() {
    const tab = state.toolsTab;
    return `
    <div class="p-4">
      <div class="flex rounded-xl p-1 mb-4" style="background:#E8E5DF;">
        <button onclick="App.setToolsTab('calc')" class="flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab==='calc'?'tab-active':'tab-inactive'}">計算工具</button>
        <button onclick="App.setToolsTab('score')" class="flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab==='score'?'tab-active':'tab-inactive'}">評分工具</button>
      </div>
      ${tab==='calc' ? ToolsCalc.render(state.settings) : ToolsScore.render(state.settings)}
    </div>`;
  }

  function renderStaging() {
    return `
    <div class="p-4 flex flex-col items-center justify-center" style="min-height:60vh">
      <div class="text-6xl mb-4">🚧</div>
      <div class="text-lg font-bold text-gray-700">分期工具</div>
      <div class="text-sm text-gray-500 mt-2 mono">開發中 — V1.3</div>
      <div class="mt-6 text-xs text-gray-400 text-center leading-relaxed">
        AJCC 9th: Lung / Rectum<br>Prostate / HCC / Breast
      </div>
    </div>`;
  }

  function renderSettings() {
    const en = state.settings.enabledTools;
    const calcTools = [
      {key:'bed',label:'BED / EQD2'},{key:'childpugh',label:'Child-Pugh + BCLC'},
      {key:'roach',label:"Roach Formula + D'Amico"},{key:'albi',label:'ALBI Score'},
      {key:'meld',label:'MELD Score'},{key:'treatmentgap',label:'Treatment Gap Correction'},
      {key:'hypofrac',label:'Hypofractionation Converter'},{key:'calvert',label:'Calvert Formula'},
      {key:'cockcroftgault',label:'Cockcroft-Gault (CrCl)'},{key:'bsa',label:'BSA Calculator'},
      {key:'cisplatin',label:'Cisplatin 累積劑量'},
    ];
    const scoreTools = [
      {key:'gpa',label:'GPA Score (DS-GPA)'},{key:'sins',label:'SINS Score'},
      {key:'tokuhashi',label:'Tokuhashi Score'},{key:'rpa',label:'RPA Class'},
      {key:'ecogkps',label:'ECOG ↔ KPS'},
    ];
    const toggle = (t) => `
      <div class="flex items-center justify-between py-2.5 border-b last:border-0" style="border-color:#F0EDE8;">
        <span class="text-sm" style="color:#1A1A1A;">${t.label}</span>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" class="sr-only peer tool-toggle" data-key="${t.key}" ${en[t.key]!==false?'checked':''}>
          <div class="w-10 h-5 rounded-full transition-colors" style="background:#D5D2CC;" 
               onclick="this.style.background=this.previousElementSibling.checked?'#222220':'#D5D2CC'"
               ></div>
          <div class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all peer-checked:translate-x-5"></div>
        </label>
      </div>`;
    return `
    <div class="p-4 space-y-4">
      <h2 class="text-lg font-bold">設定</h2>
      <div class="bg-white rounded-xl p-4" style="border:1px solid #E2DFD8;">
        <div class="section-label mb-3">快速預設</div>
        <div class="flex gap-2">
          <button onclick="App.applyPreset('all')" class="flex-1 py-2 text-xs rounded-lg font-semibold transition-colors" style="background:#F2F0EC;color:#1A1A1A;">全開</button>
          <button onclick="App.applyPreset('radonc')" class="flex-1 py-2 text-xs rounded-lg font-semibold transition-colors" style="background:#F2F0EC;color:#1A1A1A;">放腫核心</button>
          <button onclick="App.applyPreset('minimal')" class="flex-1 py-2 text-xs rounded-lg font-semibold transition-colors" style="background:#F2F0EC;color:#1A1A1A;">精簡</button>
        </div>
      </div>
      <div class="bg-white rounded-xl p-4" style="border:1px solid #E2DFD8;">
        <div class="section-label mb-2">計算工具</div>
        ${calcTools.map(toggle).join('')}
      </div>
      <div class="bg-white rounded-xl p-4" style="border:1px solid #E2DFD8;">
        <div class="section-label mb-2">評分工具</div>
        ${scoreTools.map(toggle).join('')}
      </div>
      <div class="bg-white rounded-xl p-4" style="border:1px solid #E2DFD8;">
        <div class="section-label mb-3">資料管理</div>
        <div class="flex gap-2">
          <button onclick="App.exportData()" class="flex-1 py-2 text-xs rounded-lg font-semibold" style="background:#F2F0EC;color:#1A1A1A;">匯出 JSON</button>
          <button onclick="App.importData()" class="flex-1 py-2 text-xs rounded-lg font-semibold" style="background:#F2F0EC;color:#1A1A1A;">匯入 JSON</button>
        </div>
        <input type="file" id="import-file" accept=".json" class="hidden" onchange="App.handleImport(event)">
      </div>
      <div class="rounded-xl p-4 text-xs leading-relaxed" style="background:#ECEAE5;color:#5A5750;">
        本工具僅供臨床參考，所有醫療決策請依據最新指引及臨床判斷。計算結果不能取代專業醫療意見。劑量限制數據以原始文獻為準，使用前請核對最新版本。
      </div>
      <div class="text-center text-xs mono pb-2" style="color:#B5B2AB;">SELA RadOnc ${VERSION}</div>
    </div>`;
  }

  function bindSettingsEvents() {
    document.querySelectorAll('.tool-toggle').forEach(el => {
      el.addEventListener('change', (e) => {
        state.settings.enabledTools[e.target.dataset.key] = e.target.checked;
        saveSettings();
      });
    });
  }

  function applyPreset(preset) {
    const en = state.settings.enabledTools;
    const all = Object.keys(en);
    const radonc = ['bed','childpugh','roach','albi','meld','treatmentgap','hypofrac','gpa','sins','tokuhashi','rpa','ecogkps'];
    const minimal = ['bed','childpugh','roach','gpa','rpa','ecogkps'];
    if(preset==='all')     all.forEach(k => en[k]=true);
    if(preset==='radonc')  all.forEach(k => en[k]=radonc.includes(k));
    if(preset==='minimal') all.forEach(k => en[k]=minimal.includes(k));
    saveSettings();
    render();
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
    const a = Object.assign(document.createElement('a'),{href:URL.createObjectURL(blob),download:`sela-radonc-${new Date().toISOString().slice(0,10)}.json`});
    a.click(); URL.revokeObjectURL(a.href);
  }

  function importData() { document.getElementById('import-file')?.click(); }

  function handleImport(e) {
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const d = JSON.parse(ev.target.result);
        if(d.settings) { state.settings = Object.assign({}, DEFAULT_SETTINGS, d.settings); saveSettings(); }
        if(d.cisplatinDoses) saveCisplatinDoses(d.cisplatinDoses);
        if(d.customConstraints)   localStorage.setItem('sela_custom_constraints', JSON.stringify(d.customConstraints));
        if(d.starredConstraints)  localStorage.setItem('sela_starred_constraints', JSON.stringify(d.starredConstraints));
        if(d.overrideConstraints) localStorage.setItem('sela_override_constraints', JSON.stringify(d.overrideConstraints));
        alert('✅ 匯入成功');
        render();
      } catch { alert('❌ 匯入失敗：格式錯誤'); }
    };
    reader.readAsText(file);
  }

  function init() {
    loadSettings();
    render();
    updateNav();
  }

  return { navigate, setToolsTab, applyPreset, exportData, importData, handleImport, getCisplatinDoses, saveCisplatinDoses, init };
})();

document.addEventListener('DOMContentLoaded', App.init);
