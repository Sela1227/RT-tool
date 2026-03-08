// ──────────────────────────────────────────────────────────
//  UIConstraints  —  Dose constraint lookup with organ groups
// ──────────────────────────────────────────────────────────

const UIConstraints = (() => {

  let query = '';
  let techFilter = 'All';
  let sourceFilter = 'All';
  let groupFilter = 'All';
  let conTab = 'recs';   // 'recs' | 'limits'
  let recCancer = '全部';
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
    const tabBar = `
      <div style="position:sticky;top:64px;z-index:40;background:var(--bg);margin:0 -16px;padding:10px 16px 0;border-bottom:1px solid var(--border);">
        <div class="flex gap-1.5">
          <button onclick="ConTab('recs')" class="fpill${conTab==='recs'?' on':''}">劑量建議</button>
          <button onclick="ConTab('limits')" class="fpill${conTab==='limits'?' on':''}">劑量限制</button>
        </div>
      </div>`;

    if (conTab === 'recs') {
      return tabBar + renderRecsPage();
    } else {
      return tabBar + renderLimitsPage();
    }
  }

  // ── Recs page ─────────────────────────────────────────────
  function renderRecsPage() {
    const CANCERS = ['全部','Lung','Breast','Prostate','Rectum','Liver','Esophagus','Stomach','Pancreas','H&N','CNS','Lymphoma','Bone/Mets'];
    const catBtns = CANCERS.map(k => {
      const active = k === recCancer;
      return `<button onclick="ConRecCancer('${k}')" class="fpill${active?' on':''}">${k}</button>`;
    }).join('');

    let data = DOSE_RECS;
    if (recCancer !== '全部') data = data.filter(d => d.cancer === recCancer);

    // Group by cancer
    const grouped = {};
    data.forEach(d => { (grouped[d.cancer] = grouped[d.cancer]||[]).push(d); });

    const TECH_BADGE = { 'SBRT':'background:#DDE5EF;color:#2C5282', 'IMRT/VMAT':'background:#E0EDE5;color:#1A4731', 'IMRT':'background:#E0EDE5;color:#1A4731', 'IMRT SIB':'background:#EDE8FF;color:#44337A', '3DCRT':'background:#EDECEA;color:#4A4640', 'WBI':'background:#FEF3E2;color:#7B341E', 'fSRS':'background:#DDE5EF;color:#2C5282', 'SRS':'background:#DDE5EF;color:#2C5282', 'PBSI/IORT':'background:#FCE8D8;color:#7B341E', '電子線/IMRT':'background:#E0EDE5;color:#1A4731', 'SBRT/SRS':'background:#DDE5EF;color:#2C5282' };

    const cards = Object.entries(grouped).map(([cancer, items]) => `
      <div class="mb-3">
        <div class="text-xs font-semibold mb-1.5 uppercase tracking-wide" style="color:var(--t3);">${cancer}</div>
        ${items.map(d => {
          const bs = TECH_BADGE[d.tech] || 'background:#EDECEA;color:#4A4640';
          return `<div class="rounded-xl mb-2 p-3" style="background:var(--card);border:1px solid var(--border);">
            <div class="flex items-start justify-between gap-2 mb-1">
              <div class="text-sm font-medium leading-snug" style="color:var(--t1);">${d.site}</div>
              <span class="flex-shrink-0 text-xs px-2 py-0.5 rounded-full" style="${bs}">${d.tech}</span>
            </div>
            <div class="flex items-center gap-3 mb-1">
              <span class="mono font-bold text-base" style="color:var(--t1);">${d.dose} Gy</span>
              <span class="text-xs" style="color:var(--t2);">${typeof d.fx === 'number' ? d.fx+'fx' : d.fx+' fx'}</span>
            </div>
            ${d.note ? `<div class="text-xs leading-relaxed" style="color:var(--t3);">${d.note}</div>` : ''}
            <div class="text-xs mt-1" style="color:var(--t3);">${d.source}</div>
          </div>`;
        }).join('')}
      </div>`).join('');

    return `
      <div style="position:sticky;top:108px;z-index:39;background:var(--bg);margin:0 -16px;padding:8px 16px 6px;border-bottom:1px solid var(--border);">
        <div class="flex" style="flex-wrap:wrap;gap:5px;">
          ${catBtns}
        </div>
      </div>
      <div class="mt-3">
        ${cards || '<div class="text-center py-8 text-sm" style="color:var(--t3);">無資料</div>'}
      </div>
      <div class="mt-2 text-xs p-3 rounded-xl mb-2" style="background:var(--bg);color:var(--t2);border:1px solid var(--border);">
        劑量建議僅供參考，請依最新 NCCN Guidelines 及多專科會議決策。
      </div>`;
  }

  // ── Limits page (original constraints) ──────────────────
  function pillSty(active) {
    return active
      ? 'background:var(--accent);color:#fff;border:1px solid var(--accent);'
      : 'background:var(--card);color:var(--t2);border:1px solid var(--border);';
  }

  function renderLimitsPage() {
    return `
      <div style="position:sticky;top:108px;z-index:39;background:var(--bg);margin:0 -16px;padding:8px 16px 6px;border-bottom:1px solid var(--border);">
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
          <div class="flex" style="flex-wrap:wrap;gap:5px;">
            ${Object.entries(GROUP_LABELS).map(([k,lbl]) => {
              return `<button onclick="ConGroup('${k}')" data-group="${k}" class="fpill con-grp-btn ${pillSty(k===groupFilter)}">${lbl}</button>`;
            }).join('')}
          </div>
        </div>
        <!-- Tech filter -->
        <div class="mb-1.5">
          <div class="text-xs mb-1" style="color:var(--t3);">技術</div>
          <div class="flex" style="flex-wrap:wrap;gap:5px;">
            ${TECHS.map(t => {
              return `<button onclick="ConTech('${t}')" data-tech="${t}" class="fpill con-tech-btn ${pillSty(t===techFilter)}">${TECH_LABELS[t]}</button>`;
            }).join('')}
          </div>
        </div>
        <!-- Source filter -->
        <div>
          <div class="text-xs mb-1" style="color:var(--t3);">來源</div>
          <div class="flex" style="flex-wrap:wrap;gap:5px;">
            ${['All','RTOG','QUANTEC','TG-101','NCCN','Custom'].map(s => {
              return `<button onclick="ConSource('${s}')" data-source="${s}" class="fpill con-src-btn ${pillSty(s===sourceFilter)}">${s}</button>`;
            }).join('')}
          </div>
        </div>
      </div>
      <div class="mt-3" id="con-results">${renderResults()}</div>
      <!-- Modal -->
      <div id="con-modal" class="hidden fixed inset-0 z-50 flex items-end justify-center" style="background:rgba(0,0,0,.4);">
        <div id="con-modal-inner" class="w-full max-w-md rounded-t-2xl p-5 pb-8" style="background:var(--card);max-height:85vh;overflow-y:auto;"></div>
      </div>
      <!-- FAB Add -->
      <button onclick="ConOpenAdd()" class="fixed w-12 h-12 text-white rounded-full flex items-center justify-center text-2xl z-40" style="bottom:88px;right:max(16px, calc(50% - 14rem + 16px));background:var(--accent);box-shadow:0 4px 12px rgba(0,0,0,.2);">+</button>`;
  }

  // ── Event handlers ───────────────────────────────────────
  window.ConTab = function(tab) {
    conTab = tab;
    App.navigate('constraints');
  };

  window.ConRecCancer = function(cancer) {
    recCancer = cancer;
    App.navigate('constraints');
  };

  window.ConSearch = function(q) { query = q; refreshResults(); };
  window.ConGroup  = function(g) {
    groupFilter = g;
    document.querySelectorAll('.con-grp-btn').forEach(b => { b.classList.toggle('on', b.dataset.group === g); });
    refreshResults();
  };
  window.ConTech = function(t) {
    techFilter = t;
    document.querySelectorAll('.con-tech-btn').forEach(b => { b.classList.toggle('on', b.dataset.tech === t); });
    refreshResults();
  };
  window.ConSource = function(s) {
    sourceFilter = s;
    document.querySelectorAll('.con-src-btn').forEach(b => { b.classList.toggle('on', b.dataset.source === s); });
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
