// ── UIICD — ICD-10 lookup ──────────────────────────────────
const UIICD = (() => {
  const CATS = ['全部','CNS','Head&Neck','Thorax','GI','GU','Gynecology','Breast','Lymphoma','Bone&STS','Skin','Metastasis'];
  const CAT_COLOR = {
    CNS:          'background:#DDE5EF;color:#3A5A80',
    'Head&Neck':  'background:#FDE8E8;color:#9B2C2C',
    Thorax:       'background:#E0F2FE;color:#075985',
    GI:           'background:#FEF9C3;color:#78350F',
    GU:           'background:#CFFAFE;color:#0E7490',
    Gynecology:   'background:#FCE7F3;color:#831843',
    Breast:       'background:#FFE4E6;color:#9F1239',
    Lymphoma:     'background:#EDE9FE;color:#4C1D95',
    'Bone&STS':   'background:#E0EDE5;color:#1A4731',
    Skin:         'background:#FFF7ED;color:#78350F',
    Metastasis:   'background:#FEE2E2;color:#7F1D1D',
  };
  let cat = '全部', q = '';

  function render() {
    return `<div class="p-4">
      <div class="text-base font-semibold mb-3" style="color:var(--t1);">ICD-10 診斷碼查詢</div>
      <div class="relative mb-3">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style="color:var(--t3);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" stroke-width="2"/>
          <line x1="16.5" y1="16.5" x2="21" y2="21" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <input id="icd-search" type="text" placeholder="搜尋代碼、中文、英文…" value="${q}"
          class="inp" style="padding-left:36px;" oninput="ICDSearch(this.value)">
      </div>
      <div class="flex gap-1.5 overflow-x-auto pb-2 mb-3" style="-webkit-overflow-scrolling:touch;">
        ${CATS.map(c2 => `<button onclick="ICDCat('${c2}')" data-cat="${c2}"
          class="icd-cat-btn flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-medium"
          style="border:1px solid ${c2===cat ? 'var(--accent)':'var(--border)'};background:${c2===cat ? 'var(--accent)':'var(--card)'};color:${c2===cat ? '#fff':'var(--t2)'};">
          ${c2}</button>`).join('')}
      </div>
      <div id="icd-results">${renderResults()}</div>
    </div>`;
  }

  function renderResults() {
    let data = ICD10_DATA;
    if(cat !== '全部') data = data.filter(d => d.cat === cat);
    if(q) {
      const lq = q.toLowerCase();
      data = data.filter(d =>
        d.code.toLowerCase().includes(lq) ||
        d.zh.toLowerCase().includes(lq) ||
        d.en.toLowerCase().includes(lq)
      );
    }
    if(!data.length) return `<div class="text-center text-sm py-8" style="color:var(--t3);">無符合結果</div>`;
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
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke-linecap="round"/>
          </svg>
        </button>
      </div>`).join('');
  }

  function bindEvents() {
    setTimeout(() => {
      const si = document.getElementById('icd-search');
      if(si) si.value = q;
    }, 30);
  }

  window.ICDSearch = q2 => {
    q = q2;
    const el = document.getElementById('icd-results');
    if(el) el.innerHTML = renderResults();
  };

  window.ICDCat = c2 => {
    cat = c2;
    const el = document.getElementById('icd-results');
    if(el) el.innerHTML = renderResults();
    document.querySelectorAll('.icd-cat-btn').forEach(b => {
      const active = b.dataset.cat === cat;
      b.style.background  = active ? 'var(--accent)' : 'var(--card)';
      b.style.color       = active ? '#fff' : 'var(--t2)';
      b.style.borderColor = active ? 'var(--accent)' : 'var(--border)';
    });
  };

  window.ICDCopy = code => {
    navigator.clipboard?.writeText(code).then(() => {
      const btn = document.getElementById('copy-'+code.replace(/\./g,''));
      if(!btn) return;
      const orig = btn.innerHTML;
      btn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" style="color:#2E6645;"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>';
      setTimeout(()=>{ btn.innerHTML = orig; }, 1500);
    });
  };

  return { render, bindEvents };
})();
