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
    <div class="card mb-3 overflow-hidden" >
      <button onclick="StagingToggle('${id}')" class="w-full px-4 py-3 flex items-center justify-between text-left">
        <div class="flex items-center gap-2.5">
          <span class="flex-shrink-0 w-5 h-5 flex items-center justify-center" style="color:var(--t2);">${icon}</span>
          <span class="font-medium text-sm" style="color:var(--t1);">${title}</span>
        </div>
        <svg id="${id}-chev" class="w-4 h-4 flex-shrink-0" style="color:var(--t3);transition:transform 0.2s" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    <div class="result-panel mt-4">
      <div class="flex items-start justify-between gap-3">
        <div>
          <div class="text-xs sec-label mb-1">AJCC 9th</div>
          <div class="text-2xl font-bold mono" style="color:var(--t1);">${stage}</div>
        </div>
        <div class="text-right text-xs" style="color:var(--t2); line-height:1.6;">${details}</div>
      </div>
      ${notes ? `<div class="mt-3 pt-3 text-xs leading-relaxed" style="border-top:1px solid var(--border);color:var(--t2);">${notes}</div>` : ''}
    </div>`;
  }

  function calcBtn(fn, label='判定分期') {
    return `<button onclick="${fn}" class="w-full mt-3 rounded-lg py-2.5 text-sm font-medium transition-colors" style="background:var(--t1);color:#fff;">${label}</button>`;
  }

  function sel(id, label, opts) {
    const options = opts.map(([v,t]) => `<option value="${v}">${t}</option>`).join('');
    return `
    <div class="mb-3">
      <div class="text-xs mb-1.5" style="color:var(--t2);">${label}</div>
      <select id="${id}" class="inp" style="border-color:var(--border);background:var(--card);color:var(--t1);">
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

  // ── 5. BREAST (Anatomic + Prognostic) ────────────────────
  let breastTab = 'anatomic';

  window.breastSwitchTab = function(tab) {
    breastTab = tab;
    const a = document.getElementById('br-tab-anatomic');
    const p = document.getElementById('br-tab-prognostic');
    const fa = document.getElementById('br-fields-anatomic');
    const fp = document.getElementById('br-fields-prognostic');
    if (!a || !p) return;
    [a,p].forEach(b => { b.classList.remove('active'); });
    (tab === 'anatomic' ? a : p).classList.add('active');
    if (fa) fa.style.display = tab === 'anatomic' ? '' : 'none';
    if (fp) fp.style.display = tab === 'prognostic' ? '' : 'none';
  };

  function breastTNMFields(prefix) {
    return `
      ${sel(prefix+'-t','T — 原發腫瘤',[
        ['Tis','Tis — 原位癌（DCIS）'],
        ['T1mi','T1mi — 微侵犯 ≤0.1 cm'],
        ['T1a','T1a — >0.1～0.5 cm'],['T1b','T1b — >0.5～1 cm'],['T1c','T1c — >1～2 cm'],
        ['T2','T2 — >2～5 cm'],['T3','T3 — >5 cm'],
        ['T4a','T4a — 胸壁侵犯'],['T4b','T4b — 皮膚水腫/潰瘍'],
        ['T4c','T4c — T4a+T4b'],['T4d','T4d — 發炎性乳癌'],
      ])}
      ${sel(prefix+'-n','N — 臨床 N',[
        ['N0','N0 — 無轉移'],['N1','N1 — 可移動腋下 I/II'],
        ['N2a','N2a — 固定腋下'],['N2b','N2b — 內乳（無腋下）'],
        ['N3a','N3a — 鎖骨下'],['N3b','N3b — 內乳+腋下'],['N3c','N3c — 鎖骨上'],
      ])}
      ${sel(prefix+'-m','M — 遠端轉移',[
        ['M0','M0 — 無轉移'],['M1','M1 — 遠端轉移'],
      ])}`;
  }

  function getAnatomicStage(T, N, M) {
    if (M === 'M1') return 'IV';
    if (T === 'Tis') return '0';
    if (T === 'T4d') return 'IIIB';
    const tN = {'T1mi':1,'T1a':1,'T1b':1,'T1c':1,'T2':2,'T3':3,'T4a':4,'T4b':4,'T4c':4,'T4d':4}[T]||0;
    const nN = {'N0':0,'N1':1,'N2a':2,'N2b':2,'N3a':3,'N3b':3,'N3c':3}[N]||0;
    if (tN===4) return nN>=1 ? 'IIIC' : 'IIIB';
    if (nN===3) return 'IIIC';
    if (nN===2) return tN<=3 ? 'IIIA' : 'IIIB';
    if (nN===1) return tN<=1 ? 'IIA' : tN===2 ? 'IIB' : 'IIIA';
    return tN<=1 ? 'IA' : tN===2 ? 'IIA' : 'IIB';
  }

  function renderBreast() {
    const tabBar = `
    <div class="flex gap-1.5 mb-3" style="background:var(--bg);border-radius:10px;padding:4px;">
      <button id="br-tab-anatomic" class="pill-opt active" data-val="anatomic" data-group="br-tab"
        onclick="breastSwitchTab('anatomic')">Anatomic</button>
      <button id="br-tab-prognostic" class="pill-opt" data-val="prognostic" data-group="br-tab"
        onclick="breastSwitchTab('prognostic')">Prognostic</button>
    </div>`;

    const anatomicFields = `
    <div id="br-fields-anatomic">
      ${breastTNMFields('bra')}
      <div id="bra-result"></div>
      ${calcBtn('StagingBreastA()')}
    </div>`;

    const prognosticFields = `
    <div id="br-fields-prognostic" style="display:none;">
      ${breastTNMFields('brp')}
      <div class="sec-label mb-2 mt-1">生物標記</div>
      ${sel('brp-er','ER 狀態',[['pos','陽性（ER+）'],['neg','陰性（ER-）']])}
      ${sel('brp-pr','PR 狀態',[['pos','陽性（PR+）'],['neg','陰性（PR-）']])}
      ${sel('brp-her2','HER2 狀態',[['neg','陰性（HER2-）'],['pos','陽性（HER2+）']])}
      ${sel('brp-grade','組織學 Grade',[['1','Grade 1（低度）'],['2','Grade 2（中度）'],['3','Grade 3（高度）']])}
      <div id="brp-result"></div>
      ${calcBtn('StagingBreastP()')}
    </div>`;

    const body = tabBar + anatomicFields + prognosticFields;
    return stagingCard('breast', ICONS.breast, 'Breast — AJCC 9th', body);
  }

  window.StagingBreastA = function() {
    const T = getV('bra-t'), N = getV('bra-n'), M = getV('bra-m');
    const stage = getAnatomicStage(T, N, M);
    const el = document.getElementById('bra-result');
    if (el) el.outerHTML = resultBox(
      `Stage ${stage}`, `T: ${T}<br>N: ${N}<br>M: ${M}`, 'Anatomic staging'
    );
  };

  window.StagingBreastP = function() {
    const T = getV('brp-t'), N = getV('brp-n'), M = getV('brp-m');
    const er = getV('brp-er'), pr = getV('brp-pr'), her2 = getV('brp-her2');
    const grade = parseInt(getV('brp-grade')) || 1;

    const aStage = getAnatomicStage(T, N, M);
    // AJCC 9th Prognostic stage adjustments
    let pStage = aStage;
    let note = '';

    if (M === 'M1') { pStage = 'IV'; }
    else if (aStage === '0') { pStage = '0'; }
    else {
      const tN = {'Tis':0,'T1mi':1,'T1a':1,'T1b':1,'T1c':1,'T2':2,'T3':3,'T4a':4,'T4b':4,'T4c':4,'T4d':4}[T]||0;
      const nN = {'N0':0,'N1':1,'N2a':2,'N2b':2,'N3a':3,'N3b':3,'N3c':3}[N]||0;
      const erPos = er === 'pos', her2Pos = her2 === 'pos';

      // Simplified AJCC 9th Prognostic table (key adjustments)
      if (her2Pos) {
        // HER2+ generally upgrades or maintains; Grade/ER less impactful
        if (tN <= 1 && nN === 0) pStage = 'IA';
        else if (tN <= 2 && nN <= 1) pStage = 'IIA';
        else pStage = aStage;
        note = 'HER2+ 預後分期已調整';
      } else if (!erPos) {
        // ER- HER2- (Triple negative): Grade 3 → may upgrade
        if (grade === 3) {
          const upgrades = {'IA':'IB','IB':'IIA','IIA':'IIB'};
          pStage = upgrades[aStage] || aStage;
          note = 'ER- Grade 3 分期上調';
        }
      } else {
        // ER+ HER2-: Grade 1 may downgrade
        if (grade === 1 && erPos) {
          const downgrades = {'IIA':'IB','IIB':'IIA','IIIA':'IIB'};
          pStage = downgrades[aStage] || aStage;
          note = 'ER+ Grade 1 分期下調';
        }
      }
    }

    const markers = `ER:${er==='pos'?'+':'-'} PR:${pr==='pos'?'+':'-'} HER2:${her2==='pos'?'+':'-'} G${grade}`;
    const el = document.getElementById('brp-result');
    if (el) el.outerHTML = resultBox(
      `Stage ${pStage}`,
      `Anatomic: ${aStage}<br>T:${T} N:${N} M:${M}<br>${markers}`,
      note || '依 AJCC 9th Prognostic Table 8.7'
    );
  };

  // ── 6. ESOPHAGUS ─────────────────────────────────────────
  function renderEso() {
    const icon = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
      <path d="M9 2 C8 4 7 6 7 9 C7 12 8 14 9 16"/>
      <path d="M9 2 C10 4 11 6 11 9 C11 12 10 14 9 16"/>
      <line x1="7" y1="5.5" x2="11" y2="5.5"/><line x1="7" y1="9" x2="11" y2="9"/><line x1="7" y1="12.5" x2="11" y2="12.5"/>
    </svg>`;
    const body = `
      <div class="text-xs mb-2 px-1" style="color:var(--t3);">鱗狀上皮癌（SCC）— 適用全段食道</div>
      ${row([
        sel('eso-t','T 分期',[
          ['T1a','T1a — 黏膜層'],['T1b','T1b — 黏膜下層'],
          ['T2','T2 — 固有肌層'],['T3','T3 — 外膜'],
          ['T4a','T4a — 鄰近組織（胸膜/心包/橫膈）'],
          ['T4b','T4b — 主動脈/椎體/氣管'],
        ]),
        sel('eso-n','N 分期',[
          ['N0','N0 — 無'],['N1','N1 — 1–2 顆'],
          ['N2','N2 — 3–6 顆'],['N3','N3 — ≥7 顆'],
        ]),
      ])}
      ${sel('eso-m','M',[['M0','M0'],['M1','M1 — 遠端轉移']])}
      ${calcBtn('calcEso()')}
      <div id="eso-result"></div>`;
    return stagingCard('eso', icon, '食道癌', body);
  }

  window.calcEso = function() {
    const T=getV('eso-t'), N=getV('eso-n'), M=getV('eso-m');
    if(M==='M1') return setR('eso-result', resultBox('Stage IVB','T:'+T+' N:'+N+' M1','遠端轉移'));
    if(T==='T4b'||N==='N3') return setR('eso-result', resultBox('Stage IVA','T:'+T+' N:'+N+' M0','AJCC 9th SCC Esophagus'));
    const tN={'T1a':1,'T1b':1,'T2':2,'T3':3,'T4a':4}[T]||0;
    const nN={'N0':0,'N1':1,'N2':2,'N3':3}[N]||0;
    let s;
    if(tN<=1&&nN===0) s='I';
    else if(tN===2&&nN===0) s='IIA';
    else if(tN===3&&nN===0) s='IIB';
    else if(tN<=2&&nN===1) s='IIIA';
    else if(tN===3&&nN===1||tN===4&&nN===0) s='IIIA';
    else if(nN===2||(tN===4&&nN<=2)) s='IIIB';
    else s='IIIB';
    setR('eso-result', resultBox('Stage '+s,'T:'+T+' N:'+N+' M0','AJCC 9th SCC Esophagus'));
  };

  // ── 7. GASTRIC ───────────────────────────────────────────
  function renderStomach() {
    const icon = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
      <path d="M4 7 C4 5 5.5 3 7 3 C8.5 3 9 4 9 4 L13 4 C14.5 4 15.5 5.5 15 8 C14 13 11 15 8 15 C5 15 3 13 4 9 C4 8.5 4 7.5 4 7Z"/>
      <path d="M9 4 C9 4 8 6 7.5 8"/>
    </svg>`;
    const body = `
      ${row([
        sel('gas-t','T 分期',[
          ['T1a','T1a — 黏膜層'],['T1b','T1b — 黏膜下層'],
          ['T2','T2 — 固有肌層'],['T3','T3 — 漿膜下'],
          ['T4a','T4a — 漿膜（臟腹膜）'],['T4b','T4b — 侵犯鄰近器官'],
        ]),
        sel('gas-n','N 分期',[
          ['N0','N0 — 無'],['N1','N1 — 1–2 顆'],['N2','N2 — 3–6 顆'],
          ['N3a','N3a — 7–15 顆'],['N3b','N3b — ≥16 顆'],
        ]),
      ])}
      ${sel('gas-m','M',[['M0','M0'],['M1','M1 — 遠端轉移']])}
      ${calcBtn('calcGas()')}
      <div id="gas-result"></div>`;
    return stagingCard('stomach', icon, '胃癌', body);
  }

  window.calcGas = function() {
    const T=getV('gas-t'), N=getV('gas-n'), M=getV('gas-m');
    if(M==='M1') return setR('gas-result', resultBox('Stage IV','T:'+T+' N:'+N+' M1','遠端轉移'));
    const tN={'T1a':1,'T1b':1,'T2':2,'T3':3,'T4a':4,'T4b':5}[T]||0;
    const nN={'N0':0,'N1':1,'N2':2,'N3a':3,'N3b':4}[N]||0;
    let s;
    if(tN<=1&&nN===0) s='IA';
    else if((tN<=1&&nN===1)||(tN===2&&nN===0)) s='IB';
    else if((tN<=1&&nN===2)||(tN===2&&nN===1)||(tN===3&&nN===0)) s='IIA';
    else if((tN<=1&&nN===3)||(tN===2&&nN===2)||(tN===3&&nN===1)||(tN===4&&T==='T4a'&&nN===0)) s='IIB';
    else if((tN===2&&nN===3)||(tN===3&&nN===2)||(tN===4&&T==='T4a'&&nN===1)||(T==='T4b'&&nN===0)) s='IIIA';
    else if(nN===4||(tN===4&&T==='T4a'&&nN>=2)||(T==='T4b'&&nN<=2)) s='IIIB';
    else s='IIIC';
    setR('gas-result', resultBox('Stage '+s,'T:'+T+' N:'+N+' M0','AJCC 9th Gastric'));
  };

  // ── 8. PANCREAS ──────────────────────────────────────────
  function renderPancreas() {
    const icon = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
      <path d="M2 10 C2 8 3.5 7 5 7 C6 7 7 7.5 8 7.5 C10 7.5 12 6 14 6 C15.5 6 16 7 16 8 C16 10 15 11 13 11 C11 11 9 10 7 10 C5 10 4 11 3 11 C2.5 11 2 10.5 2 10Z"/>
      <path d="M5 7 C5 5.5 5.5 4 6.5 3"/>
    </svg>`;
    const body = `
      ${row([
        sel('pan-t','T 分期',[
          ['T1a','T1a — ≤0.5 cm'],['T1b','T1b — 0.5–1 cm'],
          ['T1c','T1c — 1–2 cm'],['T2','T2 — 2–4 cm'],
          ['T3','T3 — >4 cm'],
          ['T4','T4 — 侵犯腹腔軸/SMA/CHA'],
        ]),
        sel('pan-n','N 分期',[
          ['N0','N0 — 無'],['N1','N1 — 1–3 顆'],['N2','N2 — ≥4 顆'],
        ]),
      ])}
      ${sel('pan-m','M',[['M0','M0'],['M1','M1 — 遠端轉移']])}
      ${calcBtn('calcPan()')}
      <div id="pan-result"></div>`;
    return stagingCard('pancreas', icon, '胰臟癌', body);
  }

  window.calcPan = function() {
    const T=getV('pan-t'), N=getV('pan-n'), M=getV('pan-m');
    if(M==='M1') return setR('pan-result', resultBox('Stage IV','T:'+T+' N:'+N+' M1','遠端轉移'));
    let s;
    if(T==='T4'||N==='N2') s='III';
    else if(N==='N1') s='IIB';
    else if(T==='T3') s='IIA';
    else if(T==='T2') s='IB';
    else s='IA';
    setR('pan-result', resultBox('Stage '+s,'T:'+T+' N:'+N+' M0','AJCC 9th Pancreas'));
  };

  // ── 9. HEAD & NECK ───────────────────────────────────────
  function renderHN() {
    const icon = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
      <path d="M9 2 C6 2 4 4.5 4 7 C4 10 5 12 7 13 L7 15 L11 15 L11 13 C13 12 14 10 14 7 C14 4.5 12 2 9 2Z"/>
      <line x1="7" y1="9.5" x2="11" y2="9.5"/><line x1="7" y1="7" x2="11" y2="7"/>
    </svg>`;
    const T_OPTS = {
      npc:   [['T1','T1 — 鼻咽/口咽/鼻腔'],['T2','T2 — 咽旁間隙'],['T3','T3 — 顱底/頸椎/翼板/鼻竇'],['T4','T4 — 顱內/顱神經/下咽/眼眶']],
      opc_p: [['T0','T0 — 未知原發'],['T1','T1 — ≤2 cm'],['T2','T2 — 2–4 cm'],['T3','T3 — >4 cm 或侵犯會厭'],['T4','T4 — 侵犯喉/舌肌/下頷骨']],
      std:   [['T1','T1 — ≤2 cm'],['T2','T2 — 2–4 cm'],['T3','T3 — >4 cm'],['T4a','T4a — 侵犯深部組織'],['T4b','T4b — 侵犯椎前/包覆頸動脈']],
    };
    const N_OPTS = {
      npc:  [['N0','N0'],['N1','N1 — 單側 ≤6 cm，環狀以上'],['N2','N2 — 雙側 ≤6 cm'],['N3','N3 — >6 cm 或環狀以下']],
      opc_p:[['N0','N0'],['N1','N1 — 同側 ≤6 cm 1–4 顆'],['N2','N2 — 同側 ≥5 顆 或對/雙側'],['N3','N3 — >6 cm']],
      std:  [['N0','N0'],['N1','N1 — 同側單顆 ≤3 cm ENE−'],['N2a','N2a — 同側 3–6 cm 或 ENE+'],['N2b','N2b — 同側多顆 ≤6 cm'],['N2c','N2c — 雙側/對側'],['N3a','N3a — >6 cm'],['N3b','N3b — ENE+ 臨床']],
    };
    const SITES = [
      ['npc','鼻咽癌 (NPC)'],['opc_p','口咽癌 HPV+'],['opc_n','口咽癌 HPV−'],
      ['lar','喉癌（聲門上）'],['lar_g','喉癌（聲門）'],['hyp','下咽癌'],['oral','口腔癌'],
    ];
    const body = `
      ${sel('hn-site','部位', SITES)}
      <div class="tab-bar mb-3" style="margin-top:12px;">
        <button class="tab-btn active" id="hn-tab-t" onclick="HNTab('t')">T 分期</button>
        <button class="tab-btn" id="hn-tab-n" onclick="HNTab('n')">N 分期</button>
        <button class="tab-btn" id="hn-tab-m" onclick="HNTab('m')">M / 計算</button>
      </div>
      <div id="hn-t-panel">
        <div class="text-xs mb-1.5" style="color:var(--t2);">T 分期</div>
        <div id="hn-t-opts" class="grid grid-cols-2 gap-1.5 mb-3">${renderHNTOpts('npc', T_OPTS)}</div>
      </div>
      <div id="hn-n-panel" style="display:none;">
        <div class="text-xs mb-1.5" style="color:var(--t2);">N 分期</div>
        <div id="hn-n-opts" class="grid grid-cols-2 gap-1.5 mb-3">${renderHNNOpts('npc', N_OPTS)}</div>
      </div>
      <div id="hn-m-panel" style="display:none;">
        ${sel('hn-m','M 分期',[['M0','M0 — 無遠端轉移'],['M1','M1 — 遠端轉移']])}
        ${calcBtn('calcHN()')}
      </div>
      <div id="hn-result"></div>`;
    return stagingCard('hn', icon, '頭頸癌（多部位）', body);
  }

  function siteKey(site) {
    if(site==='npc') return 'npc';
    if(site==='opc_p') return 'opc_p';
    return 'std';
  }

  function renderHNTOpts(site, T_OPTS) {
    const key = siteKey(site);
    const opts = T_OPTS[key] || T_OPTS.std;
    return opts.map(([v,lbl]) => `<button onclick="HNSetT('${v}')" data-t="${v}"
      class="hn-t-btn text-xs px-2 py-2 rounded-lg text-left" style="border:1px solid var(--border);background:var(--card);color:var(--t2);">
      <span class="mono font-bold">${v}</span><br><span style="font-size:10px;">${lbl.replace(/^[^ ]+ — /,'')}</span>
    </button>`).join('');
  }

  function renderHNNOpts(site, N_OPTS) {
    const key = siteKey(site);
    const opts = N_OPTS[key] || N_OPTS.std;
    return opts.map(([v,lbl]) => `<button onclick="HNSetN('${v}')" data-n="${v}"
      class="hn-n-btn text-xs px-2 py-2 rounded-lg text-left" style="border:1px solid var(--border);background:var(--card);color:var(--t2);">
      <span class="mono font-bold">${v}</span><br><span style="font-size:10px;">${lbl.replace(/^N\d\w* — /,'').replace(/^N\d — /,'')}</span>
    </button>`).join('');
  }

  let _hnT='T1', _hnN='N0';

  window.HNTab = function(tab) {
    ['t','n','m'].forEach(t => {
      const p = document.getElementById('hn-'+t+'-panel');
      const b = document.getElementById('hn-tab-'+t);
      if(p) p.style.display = t===tab ? '' : 'none';
      if(b) { b.classList.toggle('active', t===tab); }
    });
  };

  window.HNSetT = function(v) {
    _hnT = v;
    document.querySelectorAll('.hn-t-btn').forEach(b => {
      const active = b.dataset.t === v;
      b.style.background  = active ? 'var(--accent)' : 'var(--card)';
      b.style.color       = active ? '#fff' : 'var(--t2)';
      b.style.borderColor = active ? 'var(--accent)' : 'var(--border)';
    });
  };

  window.HNSetN = function(v) {
    _hnN = v;
    document.querySelectorAll('.hn-n-btn').forEach(b => {
      const active = b.dataset.n === v;
      b.style.background  = active ? 'var(--accent)' : 'var(--card)';
      b.style.color       = active ? '#fff' : 'var(--t2)';
      b.style.borderColor = active ? 'var(--accent)' : 'var(--border)';
    });
  };

  window.updateHNSite = function() {
    const site = getV('hn-site');
    const T_OPTS = {
      npc:  [['T1','T1'],['T2','T2'],['T3','T3'],['T4','T4']],
      opc_p:[['T0','T0'],['T1','T1'],['T2','T2'],['T3','T3'],['T4','T4']],
      std:  [['T1','T1'],['T2','T2'],['T3','T3'],['T4a','T4a'],['T4b','T4b']],
    };
    const N_OPTS = {
      npc:  [['N0','N0'],['N1','N1'],['N2','N2'],['N3','N3']],
      opc_p:[['N0','N0'],['N1','N1'],['N2','N2'],['N3','N3']],
      std:  [['N0','N0'],['N1','N1'],['N2a','N2a'],['N2b','N2b'],['N2c','N2c'],['N3a','N3a'],['N3b','N3b']],
    };
    const key = siteKey(site);
    const topts = T_OPTS[key]||T_OPTS.std, nopts = N_OPTS[key]||N_OPTS.std;
    _hnT = topts[0][0]; _hnN = nopts[0][0];
    const te = document.getElementById('hn-t-opts');
    const ne = document.getElementById('hn-n-opts');
    if(te) te.innerHTML = topts.map(([v]) => `<button onclick="HNSetT('${v}')" data-t="${v}"
      class="hn-t-btn text-xs px-2 py-2 rounded-lg mono font-bold" style="border:1px solid var(--border);background:var(--card);color:var(--t2);">${v}</button>`).join('');
    if(ne) ne.innerHTML = nopts.map(([v]) => `<button onclick="HNSetN('${v}')" data-n="${v}"
      class="hn-n-btn text-xs px-2 py-2 rounded-lg mono font-bold" style="border:1px solid var(--border);background:var(--card);color:var(--t2);">${v}</button>`).join('');
  };

  window.calcHN = function() {
    const site=getV('hn-site'), T=_hnT, N=_hnN, M=getV('hn-m');
    if(M==='M1') return setR('hn-result', resultBox('Stage IVC','T:'+T+' N:'+N+' M1','遠端轉移'));
    const SITE_LABELS={'npc':'NPC','opc_p':'OPC HPV+','opc_n':'OPC HPV−','lar':'喉癌(聲門上)','lar_g':'喉癌(聲門)','hyp':'下咽癌','oral':'口腔癌'};
    let s;
    if(site==='npc') {
      if(T==='T1'&&N==='N0') s='I';
      else if((T==='T1'&&N==='N1')||(T==='T2'&&(N==='N0'||N==='N1'))) s='II';
      else if(T==='T3'||(N==='N2')) s='III';
      else s='IVA';
    } else if(site==='opc_p') {
      const tN={'T0':0,'T1':1,'T2':2,'T3':3,'T4':4}[T]||0;
      const nN={'N0':0,'N1':1,'N2':2,'N3':3}[N]||0;
      if(tN<=2&&nN<=1) s='I';
      else if(tN<=3&&nN<=2) s='II';
      else s='III';
    } else {
      if(T==='T4b'||N==='N3b') s='IVB';
      else if(T==='T4a'||N==='N3a'||N==='N2a'||N==='N2b'||N==='N2c') s='IVA';
      else if(N==='N1'||(T==='T3'&&N==='N0')) s='III';
      else if(T==='T2') s='II';
      else s='I';
    }
    setR('hn-result', resultBox('Stage '+s,'T:'+T+' N:'+N+' M0', SITE_LABELS[site]||'AJCC 9th'));
  };

  // ── Main render ──────────────────────────────────────────
  function render() {
    const JUMPS = [
      ['lung','肺癌'],['rectum','直腸'],['prostate','前列腺'],['hcc','HCC'],
      ['breast','乳癌'],['eso','食道'],['stomach','胃癌'],
      ['pancreas','胰臟'],['hn','頭頸'],
    ];
    const jump = `<div class="flex flex-wrap gap-1.5 mb-3">${
      JUMPS.map(([id,lb]) =>
        `<button onclick="jumpTo('${id}')"
          class="text-xs px-2.5 py-1 rounded-full"
          style="background:#F2F0EC;color:#1A1A1A;border:1px solid #E2DFD8;">${lb}</button>`
      ).join('')
    }</div>`;
    return `
      <div class="mb-3">
        <div class="text-base font-semibold" style="color:#1A1A1A;">腫瘤分期</div>
        <div class="text-xs mt-0.5" style="color:#9E9A93;">AJCC 9th Edition (2024)</div>
      </div>
      ${jump}
      ${renderLung()}
      ${renderRectum()}
      ${renderProstate()}
      ${renderHCC()}
      ${renderBreast()}
      ${renderEso()}
      ${renderStomach()}
      ${renderPancreas()}
      ${renderHN()}
      <div class="mt-2 text-xs leading-relaxed rounded-xl p-3 mb-2"
           style="background:#F2F0EC;color:#5A5750;border:1px solid #E2DFD8;">
        分期結果僅供參考，請依 AJCC 9th 原始文獻及多專科會議決策為準。
      </div>
    `;
  }
  // ── Extra SVG icons ──────────────────────────────────────
  const IC = {
    esophagus: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M9 2 C9 2 7 4 7 7 C7 10 9 11 9 14"/><path d="M9 2 C9 2 11 4 11 7 C11 10 9 11 9 14 C9 16 9 16 9 16"/><line x1="6.5" y1="6" x2="11.5" y2="6"/></svg>`,
    stomach: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M6 4 C4 4 3 6 3 8 C3 12 5 15 9 15 C13 15 15 12 15 9 C15 7 14 5 12 4 C10 3 8 4 6 4 Z"/><path d="M6 4 C6 4 7 6 9 6"/></svg>`,
    pancreas: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 9 C2 9 5 7 9 8 C13 9 16 7 16 7"/><path d="M2 9 C2 9 2 11 4 11 C6 11 6 9 9 10 C12 11 14 11 16 11"/><ellipse cx="4" cy="10" rx="2" ry="1.5"/></svg>`,
    hn: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="9" cy="6" r="3.5"/><path d="M5.5 9.5 C4 11 3 14 3 16"/><path d="M12.5 9.5 C14 11 15 14 15 16"/><path d="M7 9.5 L9 16 L11 9.5"/></svg>`,
  };

  // ── Shared helpers for new cards ─────────────────────────
  function sc(id, label, opts) {
    const options = opts.map(([v,t]) => `<option value="${v}">${t}</option>`).join('');
    return `<div class="mb-3"><div class="text-xs mb-1.5" style="color:#5A5750;">${label}</div><select id="${id}" class="w-full border rounded-xl px-3 py-2 text-sm outline-none" style="border-color:#E2DFD8;background:#fff;color:#1A1A1A;">${options}</select></div>`;
  }
  function cb2(fn) {
    return `<button onclick="${fn}" class="w-full mt-3 rounded-lg py-2.5 text-sm font-medium" style="background:#222220;color:#fff;">判定分期</button>`;
  }
  function rb2(stage, details, notes='') {
    return `<div class="mt-4 rounded-xl p-4" style="background:#F2F0EC;border:1px solid #E2DFD8;"><div class="flex items-start justify-between gap-3"><div><div class="text-xs font-semibold uppercase tracking-wide mb-1" style="color:#9E9A93;">AJCC 9th</div><div class="text-2xl font-bold mono" style="color:#1A1A1A;">${stage}</div></div><div class="text-right text-xs leading-relaxed" style="color:#5A5750;">${details}</div></div>${notes?`<div class="mt-3 pt-3 text-xs leading-relaxed" style="border-top:1px solid #E2DFD8;color:#5A5750;">${notes}</div>`:''}</div>`;
  }
  function card2(id, icon, title, body) {
    return `<div class="rounded-xl mb-3 overflow-hidden" style="background:#fff;border:1px solid #E2DFD8;"><button onclick="StagingToggle('${id}')" class="w-full px-4 py-3 flex items-center justify-between text-left"><div class="flex items-center gap-2.5"><span class="flex-shrink-0 w-5 h-5 flex items-center justify-center" style="color:#5A5750;">${icon}</span><span class="font-medium text-sm" style="color:#1A1A1A;">${title}</span></div><svg id="${id}-chev" class="w-4 h-4 flex-shrink-0" style="color:#9E9A93;transition:transform 0.2s" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg></button><div id="${id}-body" class="hidden px-4 pb-4">${body}</div></div>`;
  }
  const gV2 = id => document.getElementById(id)?.value || '';

  // ── 6. ESOPHAGUS ─────────────────────────────────────────
  function renderEso() {
    return card2('eso', IC.esophagus, 'Esophagus — AJCC 9th', `
      ${sc('eso-t','T — 原發腫瘤',[['Tis','Tis — 原位癌'],['T1a','T1a — 侵犯固有層/黏膜肌層'],['T1b','T1b — 侵犯黏膜下層'],['T2','T2 — 侵犯固有肌層'],['T3','T3 — 侵犯外膜'],['T4a','T4a — 可切除侵犯（胸膜/心包/橫膈等）'],['T4b','T4b — 不可切除（主動脈/椎體/氣管）']])}
      ${sc('eso-n','N — 區域淋巴結',[['N0','N0 — 無轉移'],['N1','N1 — 1–2 個'],['N2','N2 — 3–6 個'],['N3','N3 — ≥7 個']])}
      ${sc('eso-m','M',[['M0','M0 — 無轉移'],['M1','M1 — 遠端轉移']])}
      ${sc('eso-hist','組織學',[['sqcc','鱗狀細胞癌（SCC）'],['adeno','腺癌（Adeno）']])}
      ${sc('eso-grade','Grade',[['1','G1 — 高分化'],['2','G2 — 中分化'],['3','G3 — 低分化']])}
      <div id="eso-result"></div>${cb2('StagingEso()')}`);
  }
  window.StagingEso = function() {
    const T=gV2('eso-t'),N=gV2('eso-n'),M=gV2('eso-m'),hist=gV2('eso-hist'),grade=gV2('eso-grade');
    let stage='—',note='';
    if(M==='M1'){stage='IVB';}
    else if(T==='Tis'){stage='0';}
    else if(T==='T4b'){stage='IVA';note='T4b 均為 IVA';}
    else {
      const tn={'T1a':1,'T1b':1,'T2':2,'T3':3,'T4a':4}[T]||0;
      const nn={'N0':0,'N1':1,'N2':2,'N3':3}[N]||0;
      if(tn===1&&nn===0)stage='I';
      else if(tn===1&&nn===1)stage='IIB';
      else if(tn===1&&nn>=2)stage='IVA';
      else if(tn===2&&nn===0)stage=(hist==='adeno'&&grade==='1')?'IB':'IIA';
      else if(tn===2&&nn===1)stage='IIB';
      else if(tn===2&&nn===2)stage='IIIA';
      else if(tn===2&&nn===3)stage='IVA';
      else if(tn===3&&nn===0)stage='IIB';
      else if(tn===3&&nn===1)stage='IIIA';
      else if(tn===3&&nn===2)stage='IIIB';
      else if(tn===3&&nn===3)stage='IVA';
      else if(tn===4&&nn===0)stage='IIIA';
      else if(tn===4&&nn===1)stage='IIIB';
      else if(tn===4&&nn>=2)stage='IVA';
    }
    note=note||(hist==='adeno'?'腺癌':'鱗癌')+` · G${grade}`;
    const el=document.getElementById('eso-result');
    if(el)el.outerHTML=rb2(`Stage ${stage}`,`T:${T} N:${N} M:${M}`,note);
  };

  // ── 7. STOMACH ───────────────────────────────────────────
  function renderStomach() {
    return card2('stomach', IC.stomach, 'Stomach — AJCC 9th', `
      ${sc('st-t','T — 原發腫瘤',[['Tis','Tis — 原位癌'],['T1a','T1a — 固有層/黏膜肌層'],['T1b','T1b — 黏膜下層'],['T2','T2 — 固有肌層'],['T3','T3 — 穿透漿膜下結締組織'],['T4a','T4a — 侵犯漿膜'],['T4b','T4b — 侵犯鄰近結構']])}
      ${sc('st-n','N — 區域淋巴結',[['N0','N0'],['N1','N1 — 1–2 個'],['N2','N2 — 3–6 個'],['N3a','N3a — 7–15 個'],['N3b','N3b — ≥16 個']])}
      ${sc('st-m','M',[['M0','M0'],['M1','M1 — 遠端轉移（含腹膜播種）']])}
      <div id="st-result"></div>${cb2('StagingStomach()')}`);
  }
  window.StagingStomach = function() {
    const T=gV2('st-t'),N=gV2('st-n'),M=gV2('st-m');
    let stage='—';
    if(M==='M1'){stage='IV';}
    else if(T==='Tis'){stage='0';}
    else {
      const tn={'T1a':1,'T1b':1,'T2':2,'T3':3,'T4a':4,'T4b':4}[T]||0;
      const nn={'N0':0,'N1':1,'N2':2,'N3a':3,'N3b':3}[N]||0;
      const t4b=T==='T4b',n3b=N==='N3b';
      if(t4b&&nn>=1)stage='IIIC';
      else if(n3b)stage='IIIC';
      else if(tn===4&&nn===0)stage='IIIA';
      else if(tn===4)stage='IIIB';
      else if(tn===3&&nn===0)stage='IIA';
      else if(tn===3&&nn===1)stage='IIIA';
      else if(tn===3&&nn>=2)stage='IIIB';
      else if(tn===2&&nn===0)stage='IB';
      else if(tn===2&&nn===1)stage='IIA';
      else if(tn===2&&nn===2)stage='IIIA';
      else if(tn===2&&nn>=3)stage='IIIB';
      else if(tn===1&&nn===0)stage='IA';
      else if(tn===1&&nn===1)stage='IB';
      else if(tn===1&&nn===2)stage='IIA';
      else if(tn===1&&nn>=3)stage='IIB';
    }
    const el=document.getElementById('st-result');
    if(el)el.outerHTML=rb2(`Stage ${stage}`,`T:${T} N:${N} M:${M}`,'AJCC 9th Stomach');
  };

  // ── 8. PANCREAS ──────────────────────────────────────────
  function renderPancreas() {
    return card2('pancreas', IC.pancreas, 'Pancreas — AJCC 9th', `
      ${sc('pan-t','T — 原發腫瘤',[['T1a','T1a — ≤0.5 cm'],['T1b','T1b — >0.5–1 cm'],['T1c','T1c — >1–2 cm'],['T2','T2 — >2–4 cm'],['T3','T3 — >4 cm 或侵犯動脈（非主幹）'],['T4','T4 — 侵犯腹腔幹/腸系膜上動脈主幹（不可切除）']])}
      ${sc('pan-n','N — 區域淋巴結',[['N0','N0'],['N1','N1 — 1–3 個'],['N2','N2 — ≥4 個']])}
      ${sc('pan-m','M',[['M0','M0'],['M1','M1 — 遠端轉移']])}
      <div id="pan-result"></div>${cb2('StagingPancreas()')}`);
  }
  window.StagingPancreas = function() {
    const T=gV2('pan-t'),N=gV2('pan-n'),M=gV2('pan-m');
    let stage='—';
    if(M==='M1'){stage='IV';}
    else if(T==='T4'){stage='III';}
    else {
      const tn={'T1a':1,'T1b':1,'T1c':1,'T2':2,'T3':3}[T]||0;
      const nn={'N0':0,'N1':1,'N2':2}[N]||0;
      if(tn<=1&&nn===0)stage='IA';
      else if(tn===2&&nn===0)stage='IB';
      else if((tn<=2&&nn===1)||(tn===3&&nn===0))stage='IIA';
      else if(nn===1)stage='IIB';
      else if(nn>=2)stage='III';
    }
    const el=document.getElementById('pan-result');
    if(el)el.outerHTML=rb2(`Stage ${stage}`,`T:${T} N:${N} M:${M}`,'AJCC 9th Exocrine Pancreas');
  };

  // ── 9. HEAD & NECK ───────────────────────────────────────
  let hnSite = 'npc';
  const HN_SITES=[['npc','鼻咽'],['oropharynx','口咽'],['hypopharynx','下咽'],['larynx','喉'],['oral','口腔'],['nasosinus','鼻竇']];

  function hnBtnStyle(active){
    return active?'background:#222220;color:#fff;border:1px solid #222220;':'background:#fff;color:#5A5750;border:1px solid #E2DFD8;';
  }

  const HN_DATA = {
    npc:{
      t:[['T1','T1 — 侷限鼻咽，或延伸至口咽/鼻腔，無咽旁侵犯'],['T2','T2 — 侵犯咽旁間隙或翼內/外肌/翼突'],['T3','T3 — 侵犯顱底骨/頸椎或翼突/鼻竇'],['T4','T4 — 顱內延伸或顱神經/下咽/眼眶侵犯']],
      n:[['N0','N0'],['N1','N1 — 單側頸或雙側咽後 ≤6 cm，鎖骨上窩以上'],['N2','N2 — 雙側頸 ≤6 cm，鎖骨上窩以上'],['N3','N3 — >6 cm 或延伸至鎖骨上窩']],
      note:'AJCC 9th（與 8th 相同）',
    },
    oropharynx:{
      t:[['T1','T1 — ≤2 cm'],['T2','T2 — >2–4 cm'],['T3','T3 — >4 cm 或侵犯舌根/口底'],['T4a','T4a — 侵犯喉/舌外肌/翼內肌/硬顎/下頷骨'],['T4b','T4b — 侵犯翼外肌/翼突/側咽壁/顱底/頸動脈']],
      n:[['N0','N0'],['N1','N1 — 同側單個 ≤3 cm'],['N2a','N2a — 同側單個 >3–6 cm'],['N2b','N2b — 同側多個 ≤6 cm'],['N2c','N2c — 雙/對側 ≤6 cm'],['N3a','N3a — >6 cm'],['N3b','N3b — 鎖骨上窩']],
      note:'本表為 p16-（HPV-）版本。HPV+ p16+ 有獨立分期。',
    },
    hypopharynx:{
      t:[['T1','T1 — 侷限一個次解剖位 ≤2 cm'],['T2','T2 — 侵犯多個次解剖位或 >2–4 cm，無半喉固定'],['T3','T3 — >4 cm 或半喉固定或食道受侵'],['T4a','T4a — 侵犯甲狀/環狀軟骨/舌骨/甲狀腺/食道'],['T4b','T4b — 包覆頸動脈/縱膈延伸']],
      n:[['N0','N0'],['N1','N1 — 同側單個 ≤3 cm'],['N2a','N2a — 同側單個 >3–6 cm'],['N2b','N2b — 同側多個 ≤6 cm'],['N2c','N2c — 雙/對側 ≤6 cm'],['N3a','N3a — >6 cm'],['N3b','N3b — 有 ENE（臨床）']],
      note:'',
    },
    larynx:{
      t:[['T1','T1 — 聲帶侷限，活動正常'],['T2','T2 — 延伸至聲門上/下，或活動受損'],['T3','T3 — 聲帶固定，或侵犯旁聲門間隙/甲狀軟骨內板'],['T4a','T4a — 穿透甲狀軟骨外板，或侵犯氣管/頸部軟組織'],['T4b','T4b — 侵犯縱膈/頸動脈/椎前']],
      n:[['N0','N0'],['N1','N1 — 同側單個 ≤3 cm，無 ENE'],['N2a','N2a — 同側單個 >3–6 cm，無 ENE'],['N2b','N2b — 同側多個 ≤6 cm，無 ENE'],['N2c','N2c — 雙/對側 ≤6 cm'],['N3a','N3a — >6 cm'],['N3b','N3b — 有 ENE（臨床）']],
      note:'以聲門型為代表；聲門上/下型 T 定義略異',
    },
    oral:{
      t:[['T1','T1 — ≤2 cm，DOI ≤5 mm'],['T2','T2 — ≤2 cm DOI >5–10 mm；或 >2–4 cm DOI ≤10 mm'],['T3','T3 — >4 cm，或任意大小 DOI >10 mm'],['T4a','T4a — 侵犯下頷骨/上頷竇/顏面皮膚'],['T4b','T4b — 侵犯咀嚼間隙/翼突/顱底/頸動脈']],
      n:[['N0','N0'],['N1','N1 — 同側單個 ≤3 cm，無 ENE'],['N2a','N2a — 同側單個 >3–6 cm，無 ENE'],['N2b','N2b — 同側多個 ≤6 cm'],['N2c','N2c — 雙/對側 ≤6 cm'],['N3a','N3a — >6 cm'],['N3b','N3b — 有 ENE']],
      note:'DOI = Depth of Invasion（侵犯深度）',
    },
    nasosinus:{
      t:[['T1','T1 — 侷限上頷竇黏膜，無骨侵蝕'],['T2','T2 — 骨侵蝕（含硬顎/中鼻道）'],['T3','T3 — 侵犯後壁/皮下/眶底/翼板/篩竇'],['T4a','T4a — 侵犯眼眶/篩板/顱底/翼突/蝶竇/額竇'],['T4b','T4b — 侵犯眶尖/硬腦膜/腦/顱神經']],
      n:[['N0','N0'],['N1','N1 — 同側單個 ≤3 cm，無 ENE'],['N2a','N2a — 同側單個 >3–6 cm'],['N2b','N2b — 同側多個 ≤6 cm'],['N2c','N2c — 雙/對側'],['N3a','N3a — >6 cm'],['N3b','N3b — 有 ENE']],
      note:'以上頷竇為代表',
    },
  };

  function hnFields(site) {
    const d = HN_DATA[site] || HN_DATA.npc;
    return `
      ${sc('hn-t','T — 原發腫瘤', d.t)}
      ${sc('hn-n','N — 區域淋巴結', d.n)}
      ${sc('hn-m','M',[['M0','M0 — 無轉移'],['M1','M1 — 遠端轉移']])}
      <div id="hn-result"></div>
      ${cb2('StagingHN()')}
      ${d.note?`<div class="mt-3 text-xs p-3 rounded-lg" style="background:#F2F0EC;color:#5A5750;">${d.note}</div>`:''}
    `;
  }

  window.HNSite = function(site) {
    hnSite = site;
    HN_SITES.forEach(([s]) => {
      const b = document.getElementById('hn-site-'+s);
      if(b) b.style.cssText = 'font-size:0.7rem;padding:4px 10px;border-radius:9999px;cursor:pointer;'+hnBtnStyle(s===site);
    });
    const f = document.getElementById('hn-fields');
    if(f) f.innerHTML = hnFields(site);
  };

  function renderHN() {
    const siteBtns = HN_SITES.map(([s,l]) =>
      `<button id="hn-site-${s}" onclick="HNSite('${s}')"
        style="font-size:0.7rem;padding:4px 10px;border-radius:9999px;cursor:pointer;${hnBtnStyle(s===hnSite)}">${l}</button>`
    ).join('');
    return card2('hn', IC.hn, 'Head & Neck — AJCC 9th', `
      <div class="flex flex-wrap gap-1.5 mb-3">${siteBtns}</div>
      <div id="hn-fields">${hnFields(hnSite)}</div>
    `);
  }

  window.StagingHN = function() {
    const T=gV2('hn-t'),N=gV2('hn-n'),M=gV2('hn-m');
    let stage='—';
    if(M==='M1'){stage='IVC';}
    else if(T==='T4b'||N==='N3b'||N==='N3'){stage='IVB';}
    else {
      const tn={'T1':1,'T1a':1,'T1b':1,'T2':2,'T3':3,'T4a':4,'T4b':4}[T]||0;
      const nn={'N0':0,'N1':1,'N2a':1,'N2b':2,'N2c':2,'N3a':3,'N3b':3,'N3':3}[N]||0;
      if(tn<=1&&nn===0)stage='I';
      else if(tn===2&&nn===0)stage='II';
      else if((tn===3&&nn===0)||(tn<=3&&nn===1))stage='III';
      else if((tn<=2&&nn===2)||(tn===3&&nn===2)||(tn===4&&nn<=2))stage='IVA';
      else stage='IVB';
    }
    const el=document.getElementById('hn-result');
    if(el)el.outerHTML=rb2(`Stage ${stage}`,`T:${T} N:${N} M:${M}`,'AJCC 9th H&N');
  };

  return { render };
})();
