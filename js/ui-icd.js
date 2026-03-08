// ── UIICD — ICD-10 lookup ──────────────────────────────────
const UIICD = (() => {
  const CATS = ['全部','CNS','Head&Neck','Thorax','GI','GU','Gynecology','Breast','Lymphoma','Bone&STS','Skin','Metastasis'];
  const CAT_COLOR = {
    CNS:          'background:#D8E6F2;color:#2B5278',
    'Head&Neck':  'background:#F2DEDE;color:#7A2828',
    Thorax:       'background:#D8EEF8;color:#1A5C7A',
    GI:           'background:#F8F4D0;color:#6A4A10',
    GU:           'background:#CCF4F8;color:#0A6070',
    Gynecology:   'background:#F8E4F2;color:#72186A',
    Breast:       'background:#F8E0E4;color:#8A1030',
    Lymphoma:     'background:#E8E0F8;color:#3C1A7A',
    'Bone&STS':   'background:#D8EDE2;color:#1A4731',
    Skin:         'background:#F8F2E0;color:#5A3A10',
    Metastasis:   'background:#F8DEDE;color:#6A1818',
  };
  let cat = '全部', q = '';

  function render() {
    return `<div>
      <div style="position:sticky;top:64px;z-index:40;background:var(--bg);margin:0 -16px;padding:10px 16px 8px;border-bottom:1px solid var(--border);">
        <div class="relative mb-2">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style="color:var(--t3);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" stroke-width="2"/>
            <line x1="16.5" y1="16.5" x2="21" y2="21" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <input id="icd-search" type="text" placeholder="搜尋代碼、中文、英文…" value="${q}"
            class="inp" style="padding-left:36px;" oninput="ICDSearch(this.value)">
        </div>
        <div class="flex" style="flex-wrap:wrap;gap:5px;">
          ${CATS.map(c2 => `<button onclick="ICDCat('${c2}')" data-cat="${c2}" class="fpill${c2===cat?' on':''}">${c2}</button>`).join('')}
        </div>
      </div>
      <div class="mt-3" id="icd-results">${renderResults()}</div>
    </div>`;
  }

  function renderResults() {
    let data = ICD10_DATA;
    if (cat !== '全部') data = data.filter(d => d.cat === cat);
    if (q) {
      const lq = q.toLowerCase();
      data = data.filter(d =>
        d.code.toLowerCase().includes(lq) ||
        d.zh.toLowerCase().includes(lq) ||
        d.en.toLowerCase().includes(lq)
      );
    }
    if (!data.length) return `<div class="text-center text-sm py-8" style="color:var(--t3);">無符合結果</div>`;
    return data.map(d => `
      <div class="card mb-2 px-4 py-3 flex items-start justify-between gap-2">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-0.5 flex-wrap">
            <span class="mono font-bold text-sm" style="color:var(--t1);">${d.code}</span>
            <span class="text-xs px-2 py-0.5 rounded-full" style="${CAT_COLOR[d.cat]||'background:var(--bg);color:var(--t2)'}">${d.cat}</span>
          </div>
          <div class="text-sm font-medium leading-snug" style="color:var(--t1);">${d.zh}</div>
          <div class="text-xs mt-0.5 leading-snug truncate" style="color:var(--t3);">${d.en}</div>
        </div>
        <button onclick="ICDCopy('${d.code}')" id="copy-${d.code.replace(/\./g,'')}"
          class="flex-shrink-0 p-1.5 rounded-lg" style="color:var(--t3);background:var(--bg);">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <rect x="9" y="9" width="13" height="13" rx="2"/>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
          </svg>
        </button>
      </div>`).join('');
  }

  function bindEvents() {}

  window.ICDSearch = function(val) {
    q = val;
    const el = document.getElementById('icd-results');
    if (el) el.innerHTML = renderResults();
  };

  window.ICDCat = function(c2) {
    cat = c2;
    const el = document.getElementById('icd-results');
    if (el) el.innerHTML = renderResults();
    document.querySelectorAll('[data-cat]').forEach(b => {
      b.classList.toggle('on', b.dataset.cat === cat);
    });
  };

  window.ICDCopy = function(code) {
    navigator.clipboard?.writeText(code).then(() => {
      const btn = document.getElementById('copy-' + code.replace(/\./g,''));
      if (btn) {
        btn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" style="color:#2E6645;"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>';
        setTimeout(() => {
          btn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>';
        }, 1500);
      }
    });
  };

  return { render, bindEvents };
})();
