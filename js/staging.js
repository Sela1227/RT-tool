// ──────────────────────────────────────────────────────────
//  Staging  —  AJCC 9th edition (2024)
//  Lung / Rectum / Prostate / HCC / Breast (Anatomic)
// ──────────────────────────────────────────────────────────

const Staging = (() => {

  // ── Shared SVG icons ─────────────────────────────────────
  const ICONS = {
    lung: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
      <path d="M9 3 L9 10"/>
      <path d="M9 6 C9 6 5 5 3 8 C2 10 2 14 4 15 C6 16 7 14 7 12 L7 10"/>
      <path d="M9 6 C9 6 13 5 15 8 C16 10 16 14 14 15 C12 16 11 14 11 12 L11 10"/>
    </svg>`,
    rectum: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
      <path d="M9 2 C9 2 13 4 13 8 C13 12 11 14 9 16"/>
      <path d="M9 2 C9 2 5 4 5 8 C5 12 7 14 9 16"/>
      <line x1="6.5" y1="8" x2="11.5" y2="8"/>
    </svg>`,
    prostate: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
      <ellipse cx="9" cy="9" rx="5.5" ry="4.5"/>
      <line x1="9" y1="4.5" x2="9" y2="2"/>
      <circle cx="9" cy="9" r="2"/>
    </svg>`,
    hcc: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
      <path d="M3 12 C3 12 4 5 9 4 C14 5 15 12 15 12 C15 15 12 16 9 16 C6 16 3 15 3 12Z"/>
      <path d="M7 10 C7 8 8 7 9 7 C10 7 11 8 11 10"/>
    </svg>`,
    breast: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
      <path d="M3 14 C3 14 3 8 7 6 C9 5 11 6 12 8 C13 10 13 14 13 14"/>
      <path d="M3 14 Q8 18 13 14"/>
      <circle cx="9" cy="11" r="1.5"/>
    </svg>`,
  };

  // ── Card toggle helper ────────────────────────────────────
  function stagingCard(id, icon, title, body) {
    return `
    <div class="bg-white rounded-xl mb-3 overflow-hidden" style="border:1px solid #E2DFD8;">
      <button onclick="StagingToggle('${id}')" class="w-full px-4 py-3 flex items-center justify-between text-left">
        <div class="flex items-center gap-2.5">
          <span class="flex-shrink-0 w-5 h-5 flex items-center justify-center" style="color:#5A5750;">${icon}</span>
          <span class="font-medium text-sm" style="color:#1A1A1A;">${title}</span>
        </div>
        <svg id="${id}-chev" class="w-4 h-4 flex-shrink-0" style="color:#B5B2AB;transition:transform 0.2s" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <div id="${id}-body" class="hidden px-4 pb-4">${body}</div>
    </div>`;
  }

  window.StagingToggle = function(id) {
    const body = document.getElementById(id+'-body');
    const chev = document.getElementById(id+'-chev');
    if (!body) return;
    const open = body.classList.toggle('hidden');
    if (chev) chev.style.transform = open ? '' : 'rotate(180deg)';
  };

  // ── Result box ───────────────────────────────────────────
  function resultBox(stage, details, notes='') {
    return `
    <div class="mt-4 rounded-xl p-4" style="background:#F2F0EC;border:1px solid #E2DFD8;">
      <div class="flex items-start justify-between gap-3">
        <div>
          <div class="text-xs section-label mb-1">AJCC 9th</div>
          <div class="text-2xl font-bold mono" style="color:#1A1A1A;">${stage}</div>
        </div>
        <div class="text-right text-xs" style="color:#5A5750; line-height:1.6;">${details}</div>
      </div>
      ${notes ? `<div class="mt-3 pt-3 text-xs leading-relaxed" style="border-top:1px solid #E2DFD8;color:#5A5750;">${notes}</div>` : ''}
    </div>`;
  }

  function calcBtn(fn, label='判定分期') {
    return `<button onclick="${fn}" class="w-full mt-3 rounded-lg py-2.5 text-sm font-medium transition-colors" style="background:#1A1A1A;color:#fff;">${label}</button>`;
  }

  function sel(id, label, opts) {
    const options = opts.map(([v,t]) => `<option value="${v}">${t}</option>`).join('');
    return `
    <div class="mb-3">
      <div class="text-xs mb-1.5" style="color:#5A5750;">${label}</div>
      <select id="${id}" class="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none" style="border-color:#E2DFD8;background:#fff;color:#1A1A1A;">
        ${options}
      </select>
    </div>`;
  }

  function row(items) {
    return `<div class="grid grid-cols-2 gap-2">${items.join('')}</div>`;
  }

  const getV = id => document.getElementById(id)?.value || '';
  const setR = (id, html) => { const el = document.getElementById(id); if(el) el.outerHTML = html; };

  // ── 1. LUNG ───────────────────────────────────────────────
  // AJCC 9th Lung: T/N/M → Stage
  function renderLung() {
    const body = `
      ${sel('lung-t','T — 原發腫瘤',[
        ['Tx','Tx — 無法評估'],
        ['T0','T0 — 無原發腫瘤'],
        ['Tis','Tis — 原位癌'],
        ['T1a','T1a — ≤1 cm，肺內或臟層肋膜'],
        ['T1b','T1b — >1～2 cm'],
        ['T1c','T1c — >2～3 cm'],
        ['T2a','T2a — >3～4 cm 或侵犯臟層肋膜/主支氣管（不含隆突）'],
        ['T2b','T2b — >4～5 cm'],
        ['T3','T3 — >5～7 cm 或胸壁/心包/膈神經侵犯，或同葉另一腫瘤'],
        ['T4','T4 — >7 cm 或縱膈/心臟/大血管/隆突/椎體侵犯，或對葉另一腫瘤'],
      ])}
      ${sel('lung-n','N — 區域淋巴結',[
        ['N0','N0 — 無淋巴結轉移'],
        ['N1','N1 — 同側支氣管周/肺門淋巴結'],
        ['N2a1','N2a1 — 單站同側縱膈（無N1）'],
        ['N2a2','N2a2 — 單站同側縱膈（含N1）'],
        ['N2b','N2b — 多站同側縱膈'],
        ['N3','N3 — 對側縱膈/肺門，或鎖骨上淋巴結'],
      ])}
      ${sel('lung-m','M — 遠端轉移',[
        ['M0','M0 — 無遠端轉移'],
        ['M1a','M1a — 對側肺另一腫瘤，胸膜/心包結節，惡性胸膜/心包積液'],
        ['M1b','M1b — 單一胸外器官單一病灶'],
        ['M1c','M1c — 單一胸外器官多個病灶，或多個胸外器官'],
      ])}
      <div id="lung-result"></div>
      ${calcBtn('StagingLung()')}`;
    return stagingCard('lung', ICONS.lung, 'Lung — AJCC 9th', body);
  }

  window.StagingLung = function() {
    const T = getV('lung-t'), N = getV('lung-n'), M = getV('lung-m');
    let stage = '—', note = '';

    if (M === 'M1b') { stage = 'IVA'; }
    else if (M === 'M1c') { stage = 'IVB'; }
    else if (M === 'M1a') { stage = 'IVA'; }
    else if (T === 'Tis') { stage = '0'; }
    else if (T === 'T0' || T === 'Tx') { stage = '—'; note = '無法分期'; }
    else {
      const tNum = {'T1a':1,'T1b':1,'T1c':1,'T2a':2,'T2b':2,'T3':3,'T4':4}[T] || 0;
      const nNum = {'N0':0,'N1':1,'N2a1':2,'N2a2':2,'N2b':2,'N3':3}[N] || 0;
      if (nNum === 3) {
        stage = 'IIIB';
        if (T === 'T3' || T === 'T4') stage = 'IIIC';
      } else if (nNum === 2) {
        if (T === 'T4') stage = 'IIIB';
        else if (T === 'T3') stage = 'IIIA';
        else if (tNum <= 2) { stage = N === 'N2a1' ? 'IIA' : 'IIIA'; }
      } else if (nNum === 1) {
        if (T === 'T4') stage = 'IIIA';
        else if (T === 'T3') stage = 'IIB';
        else if (T === 'T2b') stage = 'IIB';
        else if (T === 'T2a') stage = 'IIB';
        else stage = 'IIB';
      } else { // N0
        if (T === 'T4') stage = 'IIIA';
        else if (T === 'T3') stage = 'IIB';
        else if (T === 'T2b') stage = 'IB';
        else if (T === 'T2a') stage = 'IB';
        else if (T === 'T1c') stage = 'IA3';
        else if (T === 'T1b') stage = 'IA2';
        else if (T === 'T1a') stage = 'IA1';
      }
    }

    const el = document.getElementById('lung-result');
    if (el) el.outerHTML = resultBox(`Stage ${stage}`, `T: ${T}<br>N: ${N}<br>M: ${M}`, note);
  };

  // ── 2. RECTUM ─────────────────────────────────────────────
  function renderRectum() {
    const body = `
      ${sel('rec-t','T — 原發腫瘤',[
        ['Tx','Tx — 無法評估'],
        ['T0','T0 — 無腫瘤'],
        ['Tis','Tis — 原位癌（黏膜內）'],
        ['T1','T1 — 侵犯黏膜下層'],
        ['T2','T2 — 侵犯固有肌層'],
        ['T3','T3 — 穿透固有肌層達直腸周脂肪'],
        ['T4a','T4a — 穿透腹膜臟層'],
        ['T4b','T4b — 直接侵犯或黏附其他器官'],
      ])}
      ${sel('rec-n','N — 區域淋巴結',[
        ['N0','N0 — 無淋巴結轉移'],
        ['N1a','N1a — 1 個區域淋巴結'],
        ['N1b','N1b — 2–3 個區域淋巴結'],
        ['N1c','N1c — 腫瘤沉積，無區域淋巴結'],
        ['N2a','N2a — 4–6 個區域淋巴結'],
        ['N2b','N2b — ≥7 個區域淋巴結'],
      ])}
      ${sel('rec-m','M — 遠端轉移',[
        ['M0','M0 — 無遠端轉移'],
        ['M1a','M1a — 單一器官（肝/肺/卵巢/非區域淋巴結），無腹膜'],
        ['M1b','M1b — 多器官，無腹膜'],
        ['M1c','M1c — 腹膜轉移（含或不含其他器官）'],
      ])}
      <div id="rec-result"></div>
      ${calcBtn('StagingRectum()')}`;
    return stagingCard('rectum', ICONS.rectum, 'Rectum — AJCC 9th', body);
  }

  window.StagingRectum = function() {
    const T = getV('rec-t'), N = getV('rec-n'), M = getV('rec-m');
    let stage = '—', note = '';

    if (M !== 'M0') {
      stage = M === 'M1a' ? 'IVA' : M === 'M1b' ? 'IVB' : 'IVC';
    } else if (T === 'Tis') { stage = '0'; }
    else {
      const hasN = N !== 'N0';
      const n2 = N === 'N2a' || N === 'N2b';
      if (T === 'T1' || T === 'T2') {
        stage = hasN ? (n2 ? 'IIIB' : 'IIIA') : (T === 'T1' ? 'I' : 'I');
      } else if (T === 'T3') {
        stage = n2 ? 'IIIC' : hasN ? 'IIIB' : 'IIA';
      } else if (T === 'T4a') {
        stage = n2 ? 'IIIC' : hasN ? 'IIIC' : 'IIB';
      } else if (T === 'T4b') {
        stage = hasN ? 'IIIC' : 'IIC';
      }
    }

    const el = document.getElementById('rec-result');
    if (el) el.outerHTML = resultBox(`Stage ${stage}`, `T: ${T}<br>N: ${N}<br>M: ${M}`, note);
  };

  // ── 3. PROSTATE ───────────────────────────────────────────
  function renderProstate() {
    const body = `
      ${sel('pro-t','T — 臨床/病理 T',[
        ['T1a','T1a — TURP 偶發，≤5%'],
        ['T1b','T1b — TURP 偶發，>5%'],
        ['T1c','T1c — 穿刺診斷（PSA 升高）'],
        ['T2a','T2a — 侵犯單側葉 ≤1/2'],
        ['T2b','T2b — 侵犯單側葉 >1/2'],
        ['T2c','T2c — 侵犯兩側葉'],
        ['T3a','T3a — 囊外延伸或顯微鏡下膀胱頸侵犯'],
        ['T3b','T3b — 精囊侵犯'],
        ['T4','T4 — 侵犯膀胱/直腸/肛提肌/骨盆壁'],
      ])}
      ${sel('pro-n','N — 區域淋巴結',[
        ['N0','N0 — 無淋巴結轉移'],
        ['N1','N1 — 區域淋巴結轉移'],
      ])}
      ${sel('pro-m','M — 遠端轉移',[
        ['M0','M0 — 無遠端轉移'],
        ['M1a','M1a — 非區域淋巴結'],
        ['M1b','M1b — 骨骼轉移'],
        ['M1c','M1c — 其他部位（含或不含骨轉移）'],
      ])}
      ${sel('pro-psa','PSA（ng/mL）',[
        ['lt10','< 10'],
        ['10to20','10–20'],
        ['gt20','> 20'],
        ['any','未知/不適用'],
      ])}
      ${sel('pro-gg','Grade Group（Gleason）',[
        ['1','GG1 — Gleason ≤6'],
        ['2','GG2 — Gleason 3+4=7'],
        ['3','GG3 — Gleason 4+3=7'],
        ['4','GG4 — Gleason 8'],
        ['5','GG5 — Gleason 9–10'],
      ])}
      <div id="pro-result"></div>
      ${calcBtn('StagingProstate()')}`;
    return stagingCard('prostate', ICONS.prostate, 'Prostate — AJCC 9th', body);
  }

  window.StagingProstate = function() {
    const T = getV('pro-t'), N = getV('pro-n'), M = getV('pro-m');
    const psa = getV('pro-psa'), gg = parseInt(getV('pro-gg'));
    let stage = '—', note = '';

    if (M !== 'M0') { stage = 'IVB'; }
    else if (N === 'N1') { stage = 'IVA'; }
    else {
      const tNum = {'T1a':1,'T1b':1,'T1c':1,'T2a':2,'T2b':2,'T2c':2,'T3a':3,'T3b':3,'T4':4}[T] || 0;
      if (tNum === 4) { stage = 'IVA'; note='T4 直接定義為 Stage IVA（N0M0）'; }
      else if (tNum === 3) {
        if (psa === 'gt20' || gg >= 4) stage = 'IIIC';
        else if (T === 'T3b') stage = 'IIIB';
        else stage = 'IIIA';
      } else {
        // Clinical stage grouping (simplified anatomic)
        if (psa === 'gt20' || gg >= 4) stage = 'IIIC';
        else if (psa === '10to20' || gg === 3) stage = 'IIB';
        else if (T === 'T2b' || T === 'T2c') stage = 'IIB';
        else if (T === 'T2a') stage = 'IIA';
        else stage = 'I'; // T1/T2a, PSA<10, GG1
      }
    }
    note = note || 'AJCC 9th 含 PSA 及 Grade Group 分層';

    const el = document.getElementById('pro-result');
    if (el) el.outerHTML = resultBox(`Stage ${stage}`, `T: ${T}<br>N: ${N}<br>M: ${M}<br>PSA: ${psa}<br>GG: ${gg}`, note);
  };

  // ── 4. HCC ────────────────────────────────────────────────
  function renderHCC() {
    const body = `
      ${sel('hcc-t','T — 原發腫瘤',[
        ['T1a','T1a — 單一腫瘤 ≤2 cm，有或無血管侵犯'],
        ['T1b','T1b — 單一腫瘤 >2 cm，無血管侵犯'],
        ['T2','T2 — 單一腫瘤 >2 cm 有血管侵犯，或多發腫瘤均 ≤5 cm'],
        ['T3','T3 — 多發腫瘤，至少一個 >5 cm'],
        ['T4','T4 — 侵犯門靜脈/肝靜脈主幹，或直接侵犯鄰近器官（膽囊除外），或穿透臟層腹膜'],
      ])}
      ${sel('hcc-n','N — 區域淋巴結',[
        ['N0','N0 — 無淋巴結轉移'],
        ['N1','N1 — 區域淋巴結轉移'],
      ])}
      ${sel('hcc-m','M — 遠端轉移',[
        ['M0','M0 — 無遠端轉移'],
        ['M1','M1 — 遠端轉移'],
      ])}
      <div id="hcc-result"></div>
      ${calcBtn('StagingHCC()')}`;
    return stagingCard('hcc', ICONS.hcc, 'HCC — AJCC 9th', body);
  }

  window.StagingHCC = function() {
    const T = getV('hcc-t'), N = getV('hcc-n'), M = getV('hcc-m');
    let stage = '—', note = '';

    if (M === 'M1') { stage = 'IVB'; }
    else if (N === 'N1') { stage = 'IVA'; }
    else {
      const map = { 'T1a':'IA', 'T1b':'IB', 'T2':'II', 'T3':'IIIA', 'T4':'IIIB' };
      stage = map[T] || '—';
    }
    note = 'AJCC 9th HCC 分期不含 Child-Pugh，請另行評估肝功能';

    const el = document.getElementById('hcc-result');
    if (el) el.outerHTML = resultBox(`Stage ${stage}`, `T: ${T}<br>N: ${N}<br>M: ${M}`, note);
  };

  // ── 5. BREAST (Anatomic) ──────────────────────────────────
  function renderBreast() {
    const body = `
      ${sel('br-t','T — 原發腫瘤',[
        ['Tx','Tx — 無法評估'],
        ['T0','T0 — 無原發腫瘤'],
        ['Tis','Tis — 原位癌（DCIS）'],
        ['T1mi','T1mi — 微侵犯 ≤0.1 cm'],
        ['T1a','T1a — >0.1～0.5 cm'],
        ['T1b','T1b — >0.5～1 cm'],
        ['T1c','T1c — >1～2 cm'],
        ['T2','T2 — >2～5 cm'],
        ['T3','T3 — >5 cm'],
        ['T4a','T4a — 胸壁侵犯（肋骨/肋間肌/前鋸肌）'],
        ['T4b','T4b — 皮膚水腫/潰瘍/衛星結節'],
        ['T4c','T4c — T4a + T4b'],
        ['T4d','T4d — 發炎性乳癌（Inflammatory）'],
      ])}
      ${sel('br-n','N — 臨床 N（cN）',[
        ['N0','N0 — 無淋巴結轉移'],
        ['N1','N1 — 可移動同側第 I/II 腋下淋巴結'],
        ['N2a','N2a — 固定同側腋下淋巴結'],
        ['N2b','N2b — 臨床明顯同側內乳淋巴結（無腋下）'],
        ['N3a','N3a — 同側鎖骨下（第 III 腋下）淋巴結'],
        ['N3b','N3b — 同側內乳 + 腋下淋巴結'],
        ['N3c','N3c — 同側鎖骨上淋巴結'],
      ])}
      ${sel('br-m','M — 遠端轉移',[
        ['M0','M0 — 無遠端轉移'],
        ['M1','M1 — 遠端轉移（臨床或影像確認）'],
      ])}
      <div class="mt-1 mb-2 text-xs" style="color:#9E9A93;">※ 此為 Anatomic Stage；Prognostic Stage 需加入 ER/PR/HER2/Grade</div>
      <div id="br-result"></div>
      ${calcBtn('StagingBreast()')}`;
    return stagingCard('breast', ICONS.breast, 'Breast — AJCC 9th (Anatomic)', body);
  }

  window.StagingBreast = function() {
    const T = getV('br-t'), N = getV('br-n'), M = getV('br-m');
    let stage = '—', note = '';

    if (M === 'M1') { stage = 'IV'; }
    else if (T === 'Tis') { stage = '0'; }
    else if (T === 'T4d') { stage = 'IIIB'; note = '發炎性乳癌至少 IIIB'; }
    else {
      const tNum = {'T1mi':1,'T1a':1,'T1b':1,'T1c':1,'T2':2,'T3':3,'T4a':4,'T4b':4,'T4c':4,'T4d':4}[T] || 0;
      const nNum = {'N0':0,'N1':1,'N2a':2,'N2b':2,'N3a':3,'N3b':3,'N3c':3}[N] || 0;
      if (tNum === 4) { stage = nNum >= 1 ? 'IIIC' : 'IIIB'; }
      else if (nNum === 3) { stage = 'IIIC'; }
      else if (nNum === 2) { stage = tNum <= 3 ? 'IIIA' : 'IIIB'; }
      else if (nNum === 1) {
        if (tNum <= 1) stage = 'IIA';
        else if (tNum === 2) stage = 'IIB';
        else stage = 'IIIA';
      } else { // N0
        if (tNum <= 1) stage = 'IA';
        else if (tNum === 2) stage = 'IIA';
        else stage = 'IIB';
      }
    }

    const el = document.getElementById('br-result');
    if (el) el.outerHTML = resultBox(`Stage ${stage}`, `T: ${T}<br>N: ${N}<br>M: ${M}`, note || 'Anatomic staging only');
  };

  // ── Main render ──────────────────────────────────────────
  function render() {
    return `
    <div class="p-4">
      <div class="mb-3">
        <div class="text-base font-semibold" style="color:#1A1A1A;">腫瘤分期</div>
        <div class="text-xs mt-0.5" style="color:#9E9A93;">AJCC 9th Edition (2024)</div>
      </div>
      ${renderLung()}
      ${renderRectum()}
      ${renderProstate()}
      ${renderHCC()}
      ${renderBreast()}
      <div class="mt-2 text-xs leading-relaxed rounded-xl p-3" style="background:#ECEAE5;color:#5A5750;">
        分期結果僅供參考，請依 AJCC 9th 原始文獻及多專科會議決策為準。Breast Prognostic Stage 需加入生物標記資料。
      </div>
    </div>`;
  }

  return { render };
})();
