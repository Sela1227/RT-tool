// ──────────────────────────────────────────────────────────
//  UIConstraints  —  Dose constraint lookup
// ──────────────────────────────────────────────────────────

const UIConstraints = (() => {

  let query = '';
  let techFilter = 'All';
  let sourceFilter = 'All';
  let showModal = false;
  let modalData = null; // {id, mode:'edit'|'add'}

  // LocalStorage helpers
  const lsGet = (k, def) => { try { return JSON.parse(localStorage.getItem(k)) || def; } catch { return def; } };
  const lsSet = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  function getStarred()    { return lsGet('sela_starred_constraints', []); }
  function getOverrides()  { return lsGet('sela_override_constraints', {}); }
  function getCustom()     { return lsGet('sela_custom_constraints', []); }

  const TECHS = ['All','Conventional','SBRT_1fx','SBRT_3fx','SBRT_5fx'];
  const SOURCES = ['All','RTOG','QUANTEC','TG-101','Custom'];
  const TECH_LABELS = { All:'全部', Conventional:'Conventional', SBRT_1fx:'SBRT 1fx', SBRT_3fx:'SBRT 3fx', SBRT_5fx:'SBRT 5fx' };
  const SOURCE_COLORS = { RTOG:'badge-rtog', QUANTEC:'badge-quantec', 'TG-101':'badge-tg101', Custom:' style="color:var(--t1);"' };

  function getAllData() {
    const overrides = getOverrides();
    const custom = getCustom();
    return [
      ...CONSTRAINTS_DATA.map(d => ({ ...d, overrideVal: overrides[d.id] || null, isCustom: false })),
      ...custom.map(d => ({ ...d, isCustom: true }))
    ];
  }

  function render() {
    return `
      <h2 class="text-lg font-bold mb-3">劑量限制查詢</h2>

      <!-- Search -->
      <div class="relative mb-3">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 style="color:var(--t3);"" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input type="text" id="con-search" placeholder="搜尋器官、參數..." value="${query}"
          class="w-full pl-9 pr-4 py-2.5 border style="border-color:var(--border);" rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 "
          oninput="ConSearch(this.value)">
      </div>

      <!-- Tech filter -->
      <div class="flex gap-1.5 overflow-x-auto pb-1 mb-2" style="-webkit-overflow-scrolling:touch">
        ${TECHS.map(t => `
          <button onclick="ConTech('${t}')" data-tech="${t}"
            class="con-tech-btn flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${t===techFilter?'text-white" style="background:var(--accent);border-color:var(--accent);':' " style="color:var(--t2);border-color:var(--border);"  class="'}">
            ${TECH_LABELS[t]}
          </button>`).join('')}
      </div>

      <!-- Source filter -->
      <div class="flex gap-1.5 overflow-x-auto pb-2 mb-3" style="-webkit-overflow-scrolling:touch">
        ${SOURCES.map(s => `
          <button onclick="ConSource('${s}')" data-source="${s}"
            class="con-src-btn flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${s===sourceFilter?'text-white" style="background:var(--accent);border-color:var(--accent);"  class="':' " style="color:var(--t2);border-color:var(--border);"  class="'}">
            ${s}
          </button>`).join('')}
      </div>

      <!-- Results -->
      <div id="con-results">${renderResults()}</div>

      <!-- FAB Add -->
      <button onclick="ConOpenAdd()" class="fixed bottom-24 right-4 w-12 h-12  text-white rounded-full shadow-lg flex items-center justify-center text-2xl transition-colors z-40">+</button>

      <!-- Modal -->
      <div id="con-modal"></div>
    </div>`;
  }

  function renderResults() {
    const starred = getStarred();
    let data = getAllData();

    // Filter
    if(techFilter !== 'All') data = data.filter(d => d.tech === techFilter);
    if(sourceFilter !== 'All') {
      if(sourceFilter === 'Custom') data = data.filter(d => d.isCustom);
      else data = data.filter(d => d.source === sourceFilter);
    }
    if(query) {
      const q = query.toLowerCase();
      data = data.filter(d =>
        d.organ?.toLowerCase().includes(q) ||
        d.param?.toLowerCase().includes(q) ||
        d.source?.toLowerCase().includes(q) ||
        d.notes?.toLowerCase().includes(q)
      );
    }

    // Sort: starred first
    data.sort((a,b) => {
      const as = starred.includes(String(a.id)) ? 0 : 1;
      const bs = starred.includes(String(b.id)) ? 0 : 1;
      return as - bs || a.organ?.localeCompare(b.organ);
    });

    if(!data.length) return '<div class="text-center style="color:var(--t3);" text-sm py-8">無符合結果</div>';

    return data.map(d => renderCard(d, starred)).join('');
  }

  function renderCard(d, starred) {
    const isStarred = starred.includes(String(d.id));
    const override = d.overrideVal;
    const displayVal = override ? override.val : d.limit;
    const displayUnit = override ? (override.unit || d.unit) : d.unit;
    const techLabel = TECH_LABELS[d.tech] || d.tech;
    const srcColor = SOURCE_COLORS[d.isCustom ? 'Custom' : d.source] || ' style="color:var(--t2);"';

    return `
    <div class=" rounded-xl  mb-2 px-4 py-3">
      <div class="flex items-start justify-between gap-2">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap mb-1">
            <span class="font-semibold text-sm text-gray-800">${d.organ}</span>
            <span class="text-xs px-2 py-0.5 rounded-full ${srcColor}">${d.isCustom ? 'Custom' : d.source}</span>
            <span class="text-xs style="color:var(--t3);"">${techLabel}</span>
          </div>
          <div class="flex items-baseline gap-1">
            <span class="text-xs style="color:var(--t2);"">${d.param}</span>
            <span class="font-bold mono ">${displayVal} ${displayUnit}</span>
            ${override ? `<span class="text-xs style="color:var(--t3);" line-through ml-1">${d.limit} ${d.unit}</span>` : ''}
          </div>
          ${d.notes ? `<div class="text-xs style="color:var(--t3);" mt-0.5">${d.notes}</div>` : ''}
        </div>
        <div class="flex flex-col items-end gap-1 flex-shrink-0">
          <button onclick="ConToggleStar('${d.id}')" class="text-${isStarred?'yellow-400':'gray-300'} hover:text-yellow-400 transition-colors text-lg leading-none">☆</button>
          <button onclick="ConOpenEdit('${d.id}', ${d.isCustom})" class="text-xs style="color:var(--t3);" hover: transition-colors">編輯</button>
          ${d.isCustom ? `<button onclick="ConDelete('${d.id}')" class="text-xs text-red-300 hover:text-red-500 transition-colors">刪除</button>` : ''}
        </div>
      </div>
    </div>`;
  }

  function bindEvents() {
    setTimeout(() => {
      const el = document.getElementById('con-search');
      if(el) el.value = query;
    }, 50);
  }

  function refreshResults() {
    const el = document.getElementById('con-results');
    if(el) el.innerHTML = renderResults();
  }

  window.ConSearch = function(q) { query = q; refreshResults(); };
  window.ConTech = function(t) {
    techFilter = t;
    document.querySelectorAll('.con-tech-btn').forEach(b => {
      const active = b.dataset.tech === t;
      b.className = b.className.replace(/text-white" style="background:var(--accent);border-color:var(--accent);| " style="color:var(--t2);border-color:var(--border);"  class="/g,'');
      if(active) b.classList.add('','text-white','border-gray-500');
      else b.classList.add('','style="color:var(--t2);"','style="border-color:var(--border);"');
    });
    refreshResults();
  };

  window.ConSource = function(s) {
    sourceFilter = s;
    document.querySelectorAll('.con-src-btn').forEach(b => {
      const active = b.dataset.source === s;
      b.className = b.className.replace(/text-white" style="background:var(--accent);border-color:var(--accent);"  class="| " style="color:var(--t2);border-color:var(--border);"  class="/g,'');
      if(active) b.classList.add('bg-gray-700','text-white','border-gray-700');
      else b.classList.add('','style="color:var(--t2);"','style="border-color:var(--border);"');
    });
    refreshResults();
  };

  window.ConToggleStar = function(id) {
    const starred = getStarred();
    const idx = starred.indexOf(String(id));
    if(idx>=0) starred.splice(idx,1); else starred.push(String(id));
    lsSet('sela_starred_constraints', starred);
    refreshResults();
  };

  window.ConOpenEdit = function(id, isCustom) {
    let d;
    if(isCustom) {
      const custom = getCustom();
      d = custom.find(c => String(c.id) === String(id));
    } else {
      d = CONSTRAINTS_DATA.find(c => c.id === parseInt(id));
    }
    if(!d) return;
    const overrides = getOverrides();
    const ov = overrides[id] || {};
    const modal = document.getElementById('con-modal');
    if(!modal) return;
    modal.innerHTML = `
    <div class="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onclick="if(event.target===this)ConCloseModal()">
      <div class=" rounded-t-2xl w-full max-w-md p-5 max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold">${isCustom?'編輯自訂':'覆蓋內建'}條目</h3>
          <button onclick="ConCloseModal()" class="style="color:var(--t3);" hover:style="color:var(--t2);" text-xl">✕</button>
        </div>
        <div class="text-sm style="color:var(--t2);" mb-4">${d.organ} — ${d.param}</div>
        ${isCustom ? `
          <div class="space-y-3">
            ${mInput('器官','edit-organ',d.organ)}
            ${mInput('參數 (e.g. Dmax)','edit-param',d.param)}
            ${mInput('限制值','edit-limit',d.limit,'number')}
            ${mInput('單位','edit-unit',d.unit)}
            ${mSelect('技術','edit-tech',d.tech,['Conventional','SBRT_1fx','SBRT_3fx','SBRT_5fx'])}
            ${mInput('備註','edit-notes',d.notes||'')}
          </div>
          <button onclick="ConSaveCustomEdit('${id}')" class="w-full mt-4  text-white rounded-xl py-3 font-medium transition-colors">儲存</button>
        ` : `
          <div class="space-y-3">
            <div class="text-xs style="color:var(--t2);"">覆蓋值（空白則移除覆蓋）</div>
            ${mInput('新限制值','edit-val', ov.val||d.limit,'number')}
            ${mInput('新單位（可留空）','edit-unit', ov.unit||d.unit)}
            <div class=" rounded-lg p-3 text-xs style="color:var(--t2);"">
              原始值：${d.limit} ${d.unit}（${d.source}）
            </div>
          </div>
          <div class="flex gap-2 mt-4">
            <button onclick="ConSaveOverride('${id}')" class="flex-1  text-white rounded-xl py-3 font-medium transition-colors">儲存覆蓋</button>
            <button onclick="ConRemoveOverride('${id}')" class="flex-1  style="color:var(--t2);" rounded-xl py-3 font-medium hover:bg-gray-200 transition-colors">移除覆蓋</button>
          </div>
        `}
      </div>
    </div>`;
  };

  window.ConOpenAdd = function() {
    const modal = document.getElementById('con-modal');
    if(!modal) return;
    modal.innerHTML = `
    <div class="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onclick="if(event.target===this)ConCloseModal()">
      <div class=" rounded-t-2xl w-full max-w-md p-5 max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold">新增自訂條目</h3>
          <button onclick="ConCloseModal()" class="style="color:var(--t3);" hover:style="color:var(--t2);" text-xl">✕</button>
        </div>
        <div class="space-y-3">
          ${mInput('器官','edit-organ','')}
          ${mInput('參數 (e.g. Dmax, V20)','edit-param','')}
          ${mInput('限制值','edit-limit','','number')}
          ${mInput('單位 (Gy, %, cc)','edit-unit','')}
          ${mSelect('技術','edit-tech','Conventional',['Conventional','SBRT_1fx','SBRT_3fx','SBRT_5fx'])}
          ${mInput('來源','edit-source','院內 Protocol')}
          ${mInput('備註','edit-notes','')}
        </div>
        <button onclick="ConSaveNew()" class="w-full mt-4  text-white rounded-xl py-3 font-medium transition-colors">新增</button>
      </div>
    </div>`;
  };

  function mInput(label, id, val, type='text') {
    return `<div><label class="text-xs style="color:var(--t2);" mb-1 block">${label}</label><input type="${type}" id="${id}" value="${val}" class="inp"></div>`;
  }
  function mSelect(label, id, current, opts) {
    const options = opts.map(o => `<option value="${o}" ${o===current?'selected':''}>${o}</option>`).join('');
    return `<div><label class="text-xs style="color:var(--t2);" mb-1 block">${label}</label><select id="${id}" class="inp">${options}</select></div>`;
  }

  window.ConCloseModal = function() {
    const el = document.getElementById('con-modal');
    if(el) el.innerHTML = '';
  };

  window.ConSaveOverride = function(id) {
    const val = document.getElementById('edit-val')?.value;
    const unit = document.getElementById('edit-unit')?.value;
    if(!val) return ConRemoveOverride(id);
    const overrides = getOverrides();
    overrides[id] = { val: parseFloat(val), unit };
    lsSet('sela_override_constraints', overrides);
    ConCloseModal();
    refreshResults();
  };

  window.ConRemoveOverride = function(id) {
    const overrides = getOverrides();
    delete overrides[id];
    lsSet('sela_override_constraints', overrides);
    ConCloseModal();
    refreshResults();
  };

  window.ConSaveNew = function() {
    const organ = document.getElementById('edit-organ')?.value;
    const param = document.getElementById('edit-param')?.value;
    const limit = parseFloat(document.getElementById('edit-limit')?.value);
    const unit  = document.getElementById('edit-unit')?.value;
    const tech  = document.getElementById('edit-tech')?.value;
    const source= document.getElementById('edit-source')?.value || 'Custom';
    const notes = document.getElementById('edit-notes')?.value || '';
    if(!organ||!param||!limit) return alert('請填寫器官、參數、限制值');
    const custom = getCustom();
    const id = 'c' + Date.now();
    custom.push({ id, organ, param, limit, unit, tech, source, notes });
    lsSet('sela_custom_constraints', custom);
    ConCloseModal();
    refreshResults();
  };

  window.ConSaveCustomEdit = function(id) {
    const custom = getCustom();
    const idx = custom.findIndex(c => String(c.id) === String(id));
    if(idx<0) return;
    custom[idx] = {
      ...custom[idx],
      organ: document.getElementById('edit-organ')?.value || custom[idx].organ,
      param: document.getElementById('edit-param')?.value || custom[idx].param,
      limit: parseFloat(document.getElementById('edit-limit')?.value) || custom[idx].limit,
      unit:  document.getElementById('edit-unit')?.value || custom[idx].unit,
      tech:  document.getElementById('edit-tech')?.value || custom[idx].tech,
      notes: document.getElementById('edit-notes')?.value || '',
    };
    lsSet('sela_custom_constraints', custom);
    ConCloseModal();
    refreshResults();
  };

  window.ConDelete = function(id) {
    if(!confirm('確定刪除此自訂條目？')) return;
    const custom = getCustom().filter(c => String(c.id) !== String(id));
    lsSet('sela_custom_constraints', custom);
    refreshResults();
  };

  return { render, bindEvents };
})();
