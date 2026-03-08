// ──────────────────────────────────────────────────────────
//  UIConstraints  —  Dose constraint lookup with organ groups
// ──────────────────────────────────────────────────────────

const UIConstraints = (() => {

  let query = '';
  let techFilter = 'All';
  let sourceFilter = 'All';
  let groupFilter = 'All';
  let modalData = null;

  const lsGet = (k,def) => { try { return JSON.parse(localStorage.getItem(k))||def; } catch { return def; } };
  const lsSet = (k,v) => localStorage.setItem(k, JSON.stringify(v));
  function getStarred()   { return lsGet('sela_starred_constraints', []); }
  function getOverrides() { return lsGet('sela_override_constraints', {}); }
  function getCustom()    { return lsGet('sela_custom_constraints', []); }

  const TECHS = ['All','Conventional','SBRT_1fx','SBRT_3fx','SBRT_5fx'];
  const TECH_LABELS = { All:'全部', Conventional:'Conv', SBRT_1fx:'SBRT 1fx', SBRT_3fx:'3fx', SBRT_5fx:'5fx' };

  // Organ groups for region filtering
  const ORGAN_GROUPS = {
    All:    null,
    CNS:    ['Spinal Cord','Brainstem','Brain','Optic Nerve','Optic Chiasm','Retina','Lens'],
    HN:     ['Cochlea','Parotid (bilateral)','Parotid (one)','Mandible','Brachial Plexus'],
    Thorax: ['Lung','Heart','Pericardium','Esophagus','Trachea/Bronchus','Great Vessels','Chest Wall'],
    Abdomen:['Liver','Liver (normal)','Kidney','Kidney (bilateral)','Kidney (contralateral)','Stomach','Duodenum','Small Bowel'],
    Pelvis: ['Rectum','Colon','Bladder','Femoral Head','Femoral Head (bilateral)'],
    Other:  ['Skin'],
  };
  const GROUP_LABELS = { All:'全部', CNS:'CNS', HN:'頭頸', Thorax:'胸腔', Abdomen:'腹部', Pelvis:'骨盆', Other:'其他' };

  const SOURCE_BADGE = { RTOG:'badge-rtog', QUANTEC:'badge-quantec', 'TG-101':'badge-tg101', NCCN:'badge-nccn' };

  function getAllData() {
    const overrides = getOverrides(), custom = getCustom();
    return [
      ...CONSTRAINTS_DATA.map(d => ({ ...d, overrideVal: overrides[d.id]||null, isCustom: false })),
      ...custom.map(d => ({ ...d, isCustom: true }))
    ];
  }

  function filterData(data) {
    const starred = getStarred();
    let list = data.filter(d => {
      if (techFilter !== 'All' && d.tech !== techFilter) return false;
      if (sourceFilter !== 'All') {
        const src = d.isCustom ? 'Custom' : d.source;
        if (!src?.includes(sourceFilter)) return false;
      }
      if (groupFilter !== 'All') {
        const organs = ORGAN_GROUPS[groupFilter] || [];
        if (!organs.some(o => d.organ?.includes(o) || o.includes(d.organ))) return false;
      }
      if (query) {
        const q = query.toLowerCase();
        if (!d.organ?.toLowerCase().includes(q) && !d.param?.toLowerCase().includes(q) && !d.source?.toLowerCase().includes(q)) return false;
      }
      return true;
    });
    // Sort: starred first, then by organ
    list.sort((a,b) => {
      const as = starred.includes(String(a.id)) ? 0 : 1;
      const bs = starred.includes(String(b.id)) ? 0 : 1;
      return as - bs || a.organ?.localeCompare(b.organ);
    });
    return list;
  }

  function renderResults() {
    const data = getAllData();
    const list = filterData(data);
    const starred = getStarred();
    const overrides = getOverrides();
    if (!list.length) return `<div class="text-center py-8 text-sm" style="color:var(--t3);">無符合條目</div>`;

    // Group results by organ for cleaner display
    const grouped = {};
    list.forEach(d => {
      const key = d.organ || '其他';
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(d);
    });

    return Object.entries(grouped).map(([organ, items]) => `
    <div class="mb-3">
      <div class="text-xs font-semibold px-1 mb-1.5" style="color:var(--t2);">${organ}</div>
      ${items.map(d => {
        const isStarred = starred.includes(String(d.id));
        const ov = overrides[d.id];
        const badge = d.isCustom ? '<span class="badge-custom">自訂</span>' : `<span class="${SOURCE_BADGE[d.source]||'badge-custom'}">${d.source}</span>`;
        return `
        <div class="card mb-1.5 px-3 py-2.5">
          <div class="flex items-start justify-between gap-2">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="font-medium text-sm" style="color:var(--t1);">${d.param}</span>
                ${badge}
                <span class="text-xs" style="color:var(--t3);">${TECH_LABELS[d.tech]||d.tech}</span>
              </div>
              <div class="flex items-baseline gap-1.5 mt-1">
                ${ov ? `<span class="mono font-bold text-base line-through" style="color:var(--t3);">${d.limit}</span>
                         <span class="mono font-bold text-base" style="color:var(--accent);">${ov}</span>` :
                        `<span class="mono font-bold text-base" style="color:var(--t1);">${d.limit}</span>`}
                <span class="text-xs" style="color:var(--t2);">${d.unit}</span>
              </div>
              ${d.notes ? `<div class="text-xs mt-0.5" style="color:var(--t3);">${d.notes}</div>` : ''}
            </div>
            <div class="flex gap-1 flex-shrink-0 mt-0.5">
              <button onclick="ConToggleStar('${d.id}')" class="w-7 h-7 flex items-center justify-center rounded-lg" style="background:var(--bg);">
                <span style="font-size:13px;">${isStarred ? '★' : '☆'}</span>
              </button>
              <button onclick="ConOpenEdit('${d.id}','${d.isCustom?'custom':'override'}')" class="w-7 h-7 flex items-center justify-center rounded-lg text-xs" style="background:var(--bg);color:var(--t2);">✏</button>
            </div>
          </div>
        </div>`;
      }).join('')}
    </div>`).join('');
  }

  function refreshResults() {
    const el = document.getElementById('con-results');
    if (el) el.innerHTML = renderResults();
  }

  function render() {
    return `
      <div style="position:sticky;top:64px;z-index:40;background:var(--bg);margin:0 -16px;padding:10px 16px 8px;border-bottom:1px solid var(--border);">

        <!-- Search -->
        <div class="relative mb-2">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style="color:var(--t3);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input type="text" id="con-search" placeholder="搜尋器官、參數…" value="${query}"
            class="inp" style="padding-left:36px;" oninput="ConSearch(this.value)">
        </div>

        <!-- Region group filter -->
        <div class="mb-1.5">
          <div class="text-xs mb-1" style="color:var(--t3);">部位</div>
          <div class="flex gap-1.5 overflow-x-auto" style="-webkit-overflow-scrolling:touch;scrollbar-width:none;">
            ${Object.entries(GROUP_LABELS).map(([k,lbl]) =>
              `<button onclick="ConGroup('${k}')" data-group="${k}"
                class="con-grp-btn flex-shrink-0 text-xs px-3 py-1.5 rounded-full"
                style="${k===groupFilter ? 'background:var(--accent);color:#fff;border:1px solid var(--accent);' : 'background:var(--card);color:var(--t2);border:1px solid var(--border);'}">${lbl}</button>`
            ).join('')}
          </div>
        </div>

        <!-- Tech filter -->
        <div class="mb-1.5">
          <div class="text-xs mb-1" style="color:var(--t3);">技術</div>
          <div class="flex gap-1.5 overflow-x-auto" style="-webkit-overflow-scrolling:touch;scrollbar-width:none;">
            ${TECHS.map(t =>
              `<button onclick="ConTech('${t}')" data-tech="${t}"
                class="con-tech-btn flex-shrink-0 text-xs px-3 py-1.5 rounded-full"
                style="${t===techFilter ? 'background:var(--accent);color:#fff;border:1px solid var(--accent);' : 'background:var(--card);color:var(--t2);border:1px solid var(--border);'}">${TECH_LABELS[t]}</button>`
            ).join('')}
          </div>
        </div>

        <!-- Source filter -->
        <div>
          <div class="text-xs mb-1" style="color:var(--t3);">來源</div>
          <div class="flex gap-1.5 overflow-x-auto" style="-webkit-overflow-scrolling:touch;scrollbar-width:none;">
            ${['All','RTOG','QUANTEC','TG-101','NCCN','Custom'].map(s =>
              `<button onclick="ConSource('${s}')" data-source="${s}"
                class="con-src-btn flex-shrink-0 text-xs px-3 py-1.5 rounded-full"
                style="${s===sourceFilter ? 'background:var(--accent);color:#fff;border:1px solid var(--accent);' : 'background:var(--card);color:var(--t2);border:1px solid var(--border);'}">${s}</button>`
            ).join('')}
          </div>
        </div>
      </div>

      <!-- Results -->
      <div class="mt-3" id="con-results">${renderResults()}</div>

      <!-- Modal -->
      <div id="con-modal" class="hidden fixed inset-0 z-50 flex items-end justify-center" style="background:rgba(0,0,0,.4);">
        <div id="con-modal-inner" class="w-full max-w-md rounded-t-2xl p-5 pb-8" style="background:var(--card);max-height:85vh;overflow-y:auto;"></div>
      </div>

      <!-- FAB Add -->
      <button onclick="ConOpenAdd()" class="fixed bottom-24 right-4 w-12 h-12 text-white rounded-full flex items-center justify-center text-2xl z-40" style="background:var(--accent);box-shadow:0 4px 12px rgba(0,0,0,.2);">+</button>
    `;
  }

  // ── Event handlers ───────────────────────────────────────
  window.ConSearch = function(q) { query = q; refreshResults(); };
  window.ConGroup  = function(g) {
    groupFilter = g;
    document.querySelectorAll('.con-grp-btn').forEach(b => {
      const active = b.dataset.group === g;
      b.style.background = active ? 'var(--accent)' : 'var(--card)';
      b.style.color = active ? '#fff' : 'var(--t2)';
      b.style.borderColor = active ? 'var(--accent)' : 'var(--border)';
    });
    refreshResults();
  };
  window.ConTech = function(t) {
    techFilter = t;
    document.querySelectorAll('.con-tech-btn').forEach(b => {
      const active = b.dataset.tech === t;
      b.style.background = active ? 'var(--accent)' : 'var(--card)';
      b.style.color = active ? '#fff' : 'var(--t2)';
      b.style.borderColor = active ? 'var(--accent)' : 'var(--border)';
    });
    refreshResults();
  };
  window.ConSource = function(s) {
    sourceFilter = s;
    document.querySelectorAll('.con-src-btn').forEach(b => {
      const active = b.dataset.source === s;
      b.style.background = active ? 'var(--accent)' : 'var(--card)';
      b.style.color = active ? '#fff' : 'var(--t2)';
      b.style.borderColor = active ? 'var(--accent)' : 'var(--border)';
    });
    refreshResults();
  };
  window.ConToggleStar = function(id) {
    const starred = getStarred();
    const idx = starred.indexOf(String(id));
    if (idx>=0) starred.splice(idx,1); else starred.push(String(id));
    lsSet('sela_starred_constraints', starred);
    refreshResults();
  };

  // ── Modal helpers ────────────────────────────────────────
  function mInput(label, id, val='') {
    return `<div class="mb-3"><div class="text-xs mb-1" style="color:var(--t2);">${label}</div>
    <input type="text" id="${id}" value="${val}" class="inp"></div>`;
  }
  function mSel(label, id, opts, def='') {
    return `<div class="mb-3"><div class="text-xs mb-1" style="color:var(--t2);">${label}</div>
    <select id="${id}" class="inp">${opts.map(([v,t])=>`<option value="${v}" ${v===def?'selected':''}>${t}</option>`).join('')}</select></div>`;
  }

  window.ConOpenEdit = function(id, mode) {
    const all = getAllData();
    const d = all.find(x => String(x.id) === String(id));
    if (!d) return;
    modalData = { id, mode };
    const modal = document.getElementById('con-modal-inner');
    if (!modal) return;
    if (mode === 'custom') {
      modal.innerHTML = `
        <div class="flex justify-between items-center mb-4">
          <div class="font-semibold" style="color:var(--t1);">編輯自訂條目</div>
          <button onclick="ConCloseModal()" style="color:var(--t3);font-size:20px;">×</button>
        </div>
        ${mInput('器官', 'edit-organ', d.organ)}
        ${mInput('參數', 'edit-param', d.param)}
        <div class="grid grid-cols-2 gap-2">
          ${mInput('限制值', 'edit-limit', d.limit)}
          ${mInput('單位', 'edit-unit', d.unit)}
        </div>
        ${mSel('技術', 'edit-tech', [['Conventional','Conventional'],['SBRT_1fx','SBRT 1fx'],['SBRT_3fx','SBRT 3fx'],['SBRT_5fx','SBRT 5fx']], d.tech)}
        ${mInput('備註', 'edit-notes', d.notes||'')}
        <button onclick="ConSaveCustomEdit('${id}')" class="calc-btn">儲存</button>`;
    } else {
      modal.innerHTML = `
        <div class="flex justify-between items-center mb-4">
          <div class="font-semibold" style="color:var(--t1);">覆蓋數值：${d.organ} ${d.param}</div>
          <button onclick="ConCloseModal()" style="color:var(--t3);font-size:20px;">×</button>
        </div>
        <div class="mb-3 text-xs" style="color:var(--t2);">原始值：<span class="mono font-bold">${d.limit} ${d.unit}</span></div>
        ${mInput('覆蓋限制值', 'edit-override', d.overrideVal||d.limit)}
        <div class="flex gap-2">
          <button onclick="ConSaveOverride('${id}')" class="calc-btn flex-1">儲存覆蓋</button>
          <button onclick="ConClearOverride('${id}')" class="flex-1 py-2 text-sm rounded-lg" style="background:var(--bg);color:var(--t2);border:1px solid var(--border);">清除覆蓋</button>
        </div>`;
    }
    document.getElementById('con-modal').classList.remove('hidden');
  };

  window.ConOpenAdd = function() {
    modalData = { mode: 'add' };
    const modal = document.getElementById('con-modal-inner');
    if (!modal) return;
    modal.innerHTML = `
      <div class="flex justify-between items-center mb-4">
        <div class="font-semibold" style="color:var(--t1);">新增自訂條目</div>
        <button onclick="ConCloseModal()" style="color:var(--t3);font-size:20px;">×</button>
      </div>
      ${mInput('器官', 'edit-organ', '')}
      ${mInput('參數', 'edit-param', '')}
      <div class="grid grid-cols-2 gap-2">
        ${mInput('限制值', 'edit-limit', '')}
        ${mInput('單位', 'edit-unit', 'Gy')}
      </div>
      ${mSel('技術', 'edit-tech', [['Conventional','Conventional'],['SBRT_1fx','SBRT 1fx'],['SBRT_3fx','SBRT 3fx'],['SBRT_5fx','SBRT 5fx']], 'Conventional')}
      ${mInput('來源', 'edit-source', '')}
      ${mInput('備註', 'edit-notes', '')}
      <button onclick="ConSaveNew()" class="calc-btn">新增</button>`;
    document.getElementById('con-modal').classList.remove('hidden');
  };

  window.ConCloseModal = function() {
    document.getElementById('con-modal')?.classList.add('hidden');
    modalData = null;
  };
  window.ConSaveOverride = function(id) {
    const val = parseFloat(document.getElementById('edit-override')?.value);
    if (isNaN(val)) return alert('請輸入有效數值');
    const ov = getOverrides(); ov[id] = val;
    lsSet('sela_override_constraints', ov); ConCloseModal(); refreshResults();
  };
  window.ConClearOverride = function(id) {
    const ov = getOverrides(); delete ov[id];
    lsSet('sela_override_constraints', ov); ConCloseModal(); refreshResults();
  };
  window.ConSaveCustomEdit = function(id) {
    const custom = getCustom();
    const idx = custom.findIndex(c => String(c.id) === String(id));
    if (idx < 0) return;
    custom[idx] = { ...custom[idx],
      organ: document.getElementById('edit-organ')?.value || custom[idx].organ,
      param: document.getElementById('edit-param')?.value || custom[idx].param,
      limit: parseFloat(document.getElementById('edit-limit')?.value) || custom[idx].limit,
      unit:  document.getElementById('edit-unit')?.value  || custom[idx].unit,
      tech:  document.getElementById('edit-tech')?.value  || custom[idx].tech,
      notes: document.getElementById('edit-notes')?.value || '',
    };
    lsSet('sela_custom_constraints', custom); ConCloseModal(); refreshResults();
  };
  window.ConSaveNew = function() {
    const organ = document.getElementById('edit-organ')?.value;
    const param = document.getElementById('edit-param')?.value;
    const limit = parseFloat(document.getElementById('edit-limit')?.value);
    const unit  = document.getElementById('edit-unit')?.value || 'Gy';
    const tech  = document.getElementById('edit-tech')?.value || 'Conventional';
    const source= document.getElementById('edit-source')?.value || 'Custom';
    const notes = document.getElementById('edit-notes')?.value || '';
    if (!organ||!param||isNaN(limit)) return alert('請填寫器官、參數、限制值');
    const custom = getCustom();
    const id = 'c' + Date.now();
    custom.push({ id, organ, param, limit, unit, tech, source, notes });
    lsSet('sela_custom_constraints', custom); ConCloseModal(); refreshResults();
  };
  window.ConDelete = function(id) {
    if (!confirm('確定刪除此自訂條目？')) return;
    const custom = getCustom().filter(c => String(c.id) !== String(id));
    lsSet('sela_custom_constraints', custom); refreshResults();
  };

  function bindEvents() {}  // event listeners are inline

  return { render, bindEvents };
})();
