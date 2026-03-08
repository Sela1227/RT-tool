// ──────────────────────────────────────────────────────────
//  UIICD  —  ICD-10 lookup page
// ──────────────────────────────────────────────────────────

const UIICD = (() => {

  const CATS = ['全部','CNS','Head&Neck','Thorax','GI','GU','Gynecology','Breast','Lymphoma','Bone&STS','Skin','Metastasis'];
  let currentCat = '全部';
  let currentQuery = '';

  function render() {
    return `
    <div class="p-4">
      <h2 class="text-lg font-bold mb-3">ICD-10 診斷碼查詢</h2>

      <!-- Search -->
      <div class="relative mb-3">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input type="text" id="icd-search" placeholder="搜尋代碼、中文、英文..." value="${currentQuery}"
          class="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white"
          oninput="ICDSearch(this.value)">
      </div>

      <!-- Category tabs -->
      <div class="flex gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-hide" style="-webkit-overflow-scrolling:touch">
        ${CATS.map(c => `
          <button onclick="ICDCat('${c}')" data-cat="${c}"
            class="icd-cat-btn flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${c===currentCat ? 'border-gray-800 text-white" style="background:#222220;' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}">
            ${c}
          </button>`).join('')}
      </div>

      <!-- Results -->
      <div id="icd-results">${renderResults()}</div>
    </div>`;
  }

  function renderResults() {
    let data = ICD10_DATA;
    if(currentCat !== '全部') data = data.filter(d => d.cat === currentCat);
    if(currentQuery) {
      const q = currentQuery.toLowerCase();
      data = data.filter(d =>
        d.code.toLowerCase().includes(q) ||
        d.zh.toLowerCase().includes(q) ||
        d.en.toLowerCase().includes(q)
      );
    }
    if(!data.length) return '<div class="text-center text-gray-400 text-sm py-8">無符合結果</div>';

    const catColors = {
      CNS:'bg-purple-100 text-purple-700',
      'Head&Neck':'bg-blue-100 text-blue-700',
      Thorax:'bg-sky-100 text-sky-700',
      GI:'bg-yellow-100 text-yellow-700',
      GU:'bg-cyan-100 text-cyan-700',
      Gynecology:'bg-pink-100 text-pink-700',
      Breast:'bg-rose-100 text-rose-700',
      Lymphoma:'bg-violet-100 text-violet-700',
      'Bone&STS':'bg-gray-100 text-gray-700',
      Skin:'bg-amber-100 text-amber-700',
      Metastasis:'bg-red-100 text-red-700',
    };

    return data.map(d => `
      <div class="bg-white rounded-xl shadow-sm mb-2 px-4 py-3 flex items-start justify-between gap-2">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-0.5 flex-wrap">
            <span class="mono font-bold  text-sm">${d.code}</span>
            <span class="text-xs px-2 py-0.5 rounded-full ${catColors[d.cat]||'bg-gray-100 text-gray-600'}">${d.cat}</span>
          </div>
          <div class="text-sm font-medium text-gray-800 leading-snug">${d.zh}</div>
          <div class="text-xs text-gray-500 mt-0.5 leading-snug truncate">${d.en}</div>
        </div>
        <button onclick="ICDCopy('${d.code}')" id="copy-${d.code.replace(/\./g,'')}"
          class="flex-shrink-0 text-xs text-gray-400 transition-colors p-1 rounded-lg hover:bg-gray-100">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
        </button>
      </div>
    `).join('');
  }

  function bindEvents() {
    // events bound via inline handlers; restore state
    setTimeout(() => {
      const si = document.getElementById('icd-search');
      if(si) { si.value = currentQuery; si.focus && si.focus(); }
    }, 50);
  }

  window.ICDSearch = function(q) {
    currentQuery = q;
    const el = document.getElementById('icd-results');
    if(el) el.innerHTML = renderResults();
  };

  window.ICDCat = function(cat) {
    currentCat = cat;
    const el = document.getElementById('icd-results');
    if(el) el.innerHTML = renderResults();
    document.querySelectorAll('.icd-cat-btn').forEach(b => {
      const active = b.dataset.cat === cat;
      b.className = b.className.replace(/border-gray-800 text-white" style="background:#222220;|bg-white text-gray-600 border-gray-200 hover:border-gray-300/g, '');
      if(active) b.classList.add('','text-white','border-gray-500');
      else b.classList.add('bg-white','text-gray-600','border-gray-200','hover:border-gray-300');
    });
  };

  window.ICDCopy = function(code) {
    navigator.clipboard?.writeText(code).then(() => {
      const btnId = 'copy-'+code.replace(/\./g,'');
      const btn = document.getElementById(btnId);
      if(btn) {
        const orig = btn.innerHTML;
        btn.innerHTML = '<svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>';
        setTimeout(() => { btn.innerHTML = orig; }, 1500);
      }
    });
  };

  return { render, bindEvents };
})();
