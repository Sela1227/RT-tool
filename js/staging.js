// ── Staging — AJCC 9th Edition (2024) ─────────────────────
const Staging = (() => {

  // ── Icons ───────────────────────────────────────────────
  const IC = {
    lung: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M9 3 L9 10"/><path d="M9 7 C7 7 4 8 3 10 C2 12 2 15 4 15 C6 15 7 13 7 11 L7 7"/><path d="M9 7 C11 7 14 8 15 10 C16 12 16 15 14 15 C12 15 11 13 11 11 L11 7"/></svg>`,
    rectum: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M6 2 C4 4 4 7 5 9 C6 11 6 13 5 15"/><path d="M12 2 C14 4 14 7 13 9 C12 11 12 13 13 15"/><path d="M6 9 C8 10 10 10 12 9"/></svg>`,
    prostate: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="9" r="5"/><path stroke-linecap="round" d="M9 4 L9 2 M14 9 L16 9 M9 14 L9 16 M4 9 L2 9"/></svg>`,
    hcc: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M3 8 C3 5 5 3 9 3 C13 3 16 5 16 9 C16 13 13 15 9 15 C5 15 3 13 3 10 Z"/><path d="M6 9 C6 7 8 6 9 7 C10 8 11 10 9 11 C8 11.5 7 11 6 9"/></svg>`,
    breast: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 12 C2 8 4 5 6 5 C8 5 9 7 9 7 C9 7 10 5 12 5 C14 5 16 8 16 12 C16 14 14 15 9 15 C4 15 2 14 2 12Z"/></svg>`,
    esophagus: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M9 2 C9 2 7 4 7 7 C7 10 9 11 9 14"/><path d="M9 2 C9 2 11 4 11 7 C11 10 9 11 9 14 C9 16 9 16 9 16"/><line x1="6.5" y1="6" x2="11.5" y2="6"/></svg>`,
    stomach: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M6 4 C4 4 3 6 3 8 C3 12 5 15 9 15 C13 15 15 12 15 9 C15 7 14 5 12 4 C10 3 8 4 6 4Z"/><path d="M6 4 C6 4 7 6 9 6"/></svg>`,
    pancreas: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 9 C4 7 7 8 9 8 C11 8 14 7 16 7"/><path d="M2 9 C2 11 4 12 6 11 C8 10 11 11 14 11 C15 11 16 10 16 9"/></svg>`,
    hn: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="9" cy="6" r="3.5"/><path d="M5.5 9.5 C4 11 3 14 3 16"/><path d="M12.5 9.5 C14 11 15 14 15 16"/><path d="M7 9.5 L9 16 L11 9.5"/></svg>`,
  };

  // ── Helpers ─────────────────────────────────────────────




  // ─── 1. LUNG ─────────────────────────────────────────────
  function renderLung() {
    return U.cardWrap('lung', IC.lung, '肺癌 AJCC 9th', `
      ${U.fld('lung-t','T 分類',[
        ['1a','T1a ≤1 cm'],['1b','T1b >1–2 cm'],['1c','T1c >2–3 cm'],
        ['2a','T2a >3–4 cm'],['2b','T2b >4–5 cm'],
        ['3','T3 >5–7 cm / 胸壁/膈神經/心包'],
        ['4','T4 >7 cm / 縱膈/心臟/大血管/氣管/喉返神經/食道/椎體/隆突']],'1a')}
      ${U.fld('lung-n','N 分類',[
        ['0','N0'],
        ['1','N1 同側支氣管旁 / 肺門'],
        ['2a','N2a 單站同側縱膈 / 隆突下'],
        ['2b','N2b 多站同側縱膈'],
        ['3','N3 對側縱膈 / 對側肺門 / 鎖骨上']],'0')}
      ${U.fld('lung-m','M 分類',[
        ['0','M0'],
        ['1a','M1a 對側肺結節 / 胸膜或心包結節 / 惡性積液'],
        ['1b','M1b 單一胸外轉移'],
        ['1c','M1c 多處胸外轉移（≥2 器官）']],'0')}
      <div id="lung-result"></div>
      ${U.calcBtn("StageLung()")}
    `);
  }
  window.StageLung = function() {
    const T = selVal('lung-t'), N = selVal('lung-n'), M = selVal('lung-m');
    let stage = '';
    const T34 = T==='3'||T==='4';
    const T12 = !T34;

    // AJCC 9th Edition (2024) — Lung
    if (M==='1c') stage='IV B';                       // M1c → IVB
    else if (M==='1a'||M==='1b') stage='IV A';         // M1a/b → IVA
    else if (N==='3') {
      stage = T34 ? 'III C' : 'III B';                // T3-4 N3→IIIC; T1-2 N3→IIIB
    } else if (N==='2a'||N==='2b') {
      stage = T34 ? 'III B' : 'III A';                // T3-4 N2→IIIB; T1-2 N2→IIIA
    } else if (N==='1') {
      stage = T34 ? 'III A' : 'II B';                 // T3-4 N1→IIIA; T1-2 N1→IIB
    } else {
      // N0
      if (T==='1a') stage='I A1';
      else if (T==='1b') stage='I A2';
      else if (T==='1c') stage='I A3';
      else if (T==='2a') stage='I B';
      else if (T==='2b') stage='II A';
      else if (T==='3') stage='II B';
      else stage='III A';                              // T4 N0→IIIA
    }
    const e = gel('lung-result');
    if(e) e.outerHTML = U.stageResult(stage, `T${T} N${N} M${M}`);
  };

  // ─── 2. RECTUM ───────────────────────────────────────────
  function renderRectum() {
    return U.cardWrap('rectum', IC.rectum, '直腸癌 AJCC 9th', `
      ${U.fld('rec-t','T 分類',[['is','Tis'],['1','T1 黏膜下'],['2','T2 固有肌層'],['3','T3 穿過肌層'],['4a','T4a 腹膜臟層'],['4b','T4b 鄰近器官/結構']],'2')}
      ${U.fld('rec-n','N 分類',[['0','N0'],['1a','N1a 1顆區域淋巴結'],['1b','N1b 2-3顆'],['1c','N1c 腫瘤沉積，無淋巴結'],['2a','N2a 4-6顆'],['2b','N2b ≥7顆']],'0')}
      ${U.fld('rec-m','M 分類',[['0','M0'],['1a','M1a 單一遠端器官'],['1b','M1b 多處遠端器官'],['1c','M1c 腹膜轉移']],'0')}
      <div id="rectum-result"></div>
      ${U.calcBtn("StageRectum()")}
    `);
  }
  window.StageRectum = function() {
    const T=selVal('rec-t'), N=sel('rec-n'), M=sel('rec-m');
    let stage='';
    if (M!=='0') { stage = M==='1a'||M==='1b' ? 'IV A' : 'IV B'; }
    else if (N.startsWith('2')) {
      stage = T==='4b' ? 'III C' : (T==='3'||T==='4a') ? 'III C' : 'III B';
    } else if (N==='1a'||N==='1b'||N==='1c') {
      stage = T==='4b' ? 'III C' : (T==='4a') ? 'III B' : (T==='3') ? 'III B' : 'III A';
    } else {
      if (T==='is'||T==='1') stage='I';
      else if (T==='2') stage='I';
      else if (T==='3') stage='II A';
      else if (T==='4a') stage='II B';
      else stage='II C';
    }
    const e=gel('rectum-result'); if(e) e.outerHTML=U.stageResult(stage,`T${T} N${N} M${M}`);
  };

  // ─── 3. PROSTATE ─────────────────────────────────────────
  function renderProstate() {
    return U.cardWrap('prostate', IC.prostate, '前列腺癌 AJCC 9th', `
      ${U.fld('pros-t','T 分類',[['1','T1 臨床不可捫及'],['2a','T2a ≤半葉'],['2b','T2b >半葉，單側'],['2c','T2c 雙側'],['3a','T3a 囊外延伸'],['3b','T3b 精囊侵犯'],['4','T4 鄰近結構侵犯']],'2a')}
      ${U.fld('pros-n','N',[['0','N0'],['1','N1 區域淋巴結']],'0')}
      ${U.fld('pros-m','M',[['0','M0'],['1','M1 遠端轉移']],'0')}
      ${U.fld('pros-g','Grade Group',[['1','GG1 (Gleason 6)'],['2','GG2 (Gleason 3+4)'],['3','GG3 (Gleason 4+3)'],['4','GG4 (Gleason 8)'],['5','GG5 (Gleason 9-10)']],'1')}
      ${U.fld('pros-psa','PSA 分層',[['low','<10 ng/mL'],['mid','10-20 ng/mL'],['high','>20 ng/mL']],'low')}
      <div id="prostate-result"></div>
      ${U.calcBtn("StageProstate()")}
    `);
  }
  window.StageProstate = function() {
    const T=selVal('pros-t'), N=sel('pros-n'), M=sel('pros-m'), G=parseInt(sel('pros-g')), PSA=sel('pros-psa');
    let stage='';
    if (M==='1') stage='IV B';
    else if (N==='1') stage='IV A';
    else if (T==='4') stage='IV A';
    else if (T==='3a'||T==='3b') {
      stage = G>=4 ? 'IV A' : G===3 ? 'III C' : 'III B';
    } else {
      if (G>=4) stage = PSA==='high' ? 'III C' : 'III C';
      else if (G===3) stage = PSA==='high' ? 'III A' : 'II C';
      else if (G===2) stage = PSA==='high' ? 'III A' : PSA==='mid' ? 'II B' : 'II A';
      else stage = PSA==='high' ? 'II A' : PSA==='mid' ? 'II A' : 'I';
    }
    const e=gel('prostate-result'); if(e) e.outerHTML=U.stageResult(stage,`T${T} N${N} M${M}<br>GG${G}, PSA ${PSA}`);
  };

  // ─── 4. HCC ──────────────────────────────────────────────
  function renderHCC() {
    return U.cardWrap('hcc', IC.hcc, 'HCC (肝細胞癌) AJCC 9th', `
      ${U.fld('hcc-t','T 分類',[['1a','T1a 單顆 ≤2cm，無血管侵犯'],['1b','T1b 單顆 >2cm，無血管侵犯'],['2','T2 單顆伴血管侵犯 / 多顆 ≤5cm'],['3','T3 多顆 >5cm / 主要血管分支侵犯'],['4','T4 直接侵犯鄰近器官（膽囊除外）']],'1b')}
      ${U.fld('hcc-n','N',[['0','N0'],['1','N1 區域淋巴結']],'0')}
      ${U.fld('hcc-m','M',[['0','M0'],['1','M1 遠端轉移']],'0')}
      <div id="hcc-result"></div>
      ${U.calcBtn("StageHCC()")}
    `);
  }
  window.StageHCC = function() {
    const T=selVal('hcc-t'), N=sel('hcc-n'), M=sel('hcc-m');
    let stage='';
    if (M==='1') stage='IV B';
    else if (N==='1') stage='IV A';
    else if (T==='4') stage='III B';
    else if (T==='3') stage='III A';
    else if (T==='2') stage='II';
    else if (T==='1b') stage='I B';
    else stage='I A';
    const e=gel('hcc-result'); if(e) e.outerHTML=U.stageResult(stage,`T${T} N${N} M${M}`);
  };

  // ─── 5. BREAST ───────────────────────────────────────────
  function renderBreast() {
    return U.cardWrap('breast', IC.breast, '乳癌 AJCC 9th（解剖學）', `
      ${U.fld('br-t','T 分類',[['is','Tis'],['1mi','T1mi ≤0.1cm'],['1a','T1a 0.1-0.5cm'],['1b','T1b 0.5-1cm'],['1c','T1c 1-2cm'],['2','T2 2-5cm'],['3','T3 >5cm'],['4a','T4a 胸壁侵犯'],['4b','T4b 皮膚侵犯'],['4c','T4c 4a+4b'],['4d','T4d 炎性乳癌']],'1c')}
      ${U.fld('br-n','N（病理）',[['0','pN0'],['1mi','pN1mi 微轉移 0.2-2mm'],['1a','pN1a 1-3顆腋窩LN'],['1b','pN1b 內乳LN'],['1c','pN1c 1-3顆腋窩+內乳'],['2a','pN2a 4-9顆腋窩'],['2b','pN2b 內乳LN，無腋窩'],['3a','pN3a ≥10顆腋窩'],['3b','pN3b 內乳+≥4腋窩'],['3c','pN3c 鎖骨上']],'1a')}
      ${U.fld('br-m','M',[['0','M0'],['1','M1 遠端轉移']],'0')}
      <div id="breast-result"></div>
      ${U.calcBtn("StageBreast()")}
    `);
  }
  window.StageBreast = function() {
    const T=selVal('br-t'), N=sel('br-n'), M=sel('br-m');
    let stage='';
    if (M==='1') stage='IV';
    else if (N.startsWith('3')) stage='III C';
    else if (T==='4a'||T==='4b'||T==='4c'||T==='4d') stage = N==='0'?'III B':'III C';
    else if (T==='3') stage = N==='0'?'III A':N.startsWith('1')?'III A':'III B';
    else if (N.startsWith('2')) stage = T==='0'||T==='is'?'III A':'III A';
    else if (N==='1a'||N==='1b'||N==='1c') {
      stage = (T==='1mi'||T==='1a'||T==='1b'||T==='1c')?'II A':(T==='2'?'II B':'III A');
    } else {
      if (T==='is') stage='0';
      else if (T==='1mi'||T==='1a'||T==='1b'||T==='1c') stage='I A';
      else if (T==='2') stage='II A';
      else stage='II B';
    }
    const e=gel('breast-result'); if(e) e.outerHTML=U.stageResult(stage,`T${T} N${N} M${M}`);
  };

  // ─── 6. ESOPHAGUS ────────────────────────────────────────
  function renderEso() {
    return U.cardWrap('eso', IC.esophagus, '食道癌 AJCC 9th', `
      ${U.fld('eso-hist','組織型別',[['scc','SCC'],['adeno','Adenocarcinoma']],'scc')}
      ${U.fld('eso-t','T 分類',[['is','Tis'],['1a','T1a 黏膜固有層/肌層'],['1b','T1b 黏膜下層'],['2','T2 固有肌層'],['3','T3 外膜'],['4a','T4a 胸膜/心包/奇靜脈/膈肌'],['4b','T4b 主動脈/氣管/脊椎']],'2')}
      ${U.fld('eso-n','N',[['0','N0'],['1','N1 1-2顆'],['2','N2 3-6顆'],['3','N3 ≥7顆']],'0')}
      ${U.fld('eso-m','M',[['0','M0'],['1','M1']],'0')}
      <div id="eso-result"></div>
      ${U.calcBtn("StageEso()")}
    `);
  }
  window.StageEso = function() {
    const T=selVal('eso-t'), N=sel('eso-n'), M=sel('eso-m');
    let stage='';
    if (M==='1') stage='IV B';
    else if (T==='4b') stage='IV A';
    else if (N==='3') stage= T==='4a'?'IV A':'III C';
    else if (N==='2') stage= T==='4a'?'IV A':(T==='3'?'III B':'III A');
    else if (N==='1') stage= T==='4a'?'IV A':(T==='3'?'III A':(T==='2'?'II B':'II A'));
    else {
      if (T==='is') stage='0';
      else if (T==='1a') stage='I';
      else if (T==='1b') stage='I';
      else if (T==='2') stage='II';
      else if (T==='3') stage='II';
      else if (T==='4a') stage='III A';
      else stage='IV A';
    }
    const e=gel('eso-result'); if(e) e.outerHTML=U.stageResult(stage,`T${T} N${N} M${M}`);
  };

  // ─── 7. STOMACH ──────────────────────────────────────────
  function renderStomach() {
    return U.cardWrap('stomach', IC.stomach, '胃癌 AJCC 9th', `
      ${U.fld('sto-t','T 分類',[['is','Tis'],['1a','T1a 黏膜固有層'],['1b','T1b 黏膜下層'],['2','T2 固有肌層'],['3','T3 漿膜下'],['4a','T4a 穿透漿膜'],['4b','T4b 侵犯鄰近器官']],'2')}
      ${U.fld('sto-n','N',[['0','N0'],['1','N1 1-2顆'],['2','N2 3-6顆'],['3a','N3a 7-15顆'],['3b','N3b ≥16顆']],'0')}
      ${U.fld('sto-m','M',[['0','M0'],['1','M1']],'0')}
      <div id="stomach-result"></div>
      ${U.calcBtn("StageStomach()")}
    `);
  }
  window.StageStomach = function() {
    const T=selVal('sto-t'), N=sel('sto-n'), M=sel('sto-m');
    let stage='';
    if (M==='1') stage='IV';
    else if (T==='4b') stage= N==='0'?'III B':'III C';
    else if (N==='3b') stage= (T==='4a'?'III C':(T==='3'||T==='4b')?'III C':'III B');
    else if (N==='3a') stage= T==='4a'?'III C':(T==='3'?'III B':(T==='2'?'III A':'II B'));
    else if (N==='2') stage= T==='4a'?'III B':(T==='3'?'III A':(T==='2'?'II B':'II A'));
    else if (N==='1') stage= T==='4a'?'III A':(T==='3'?'II B':(T==='2'?'II A':'I B'));
    else {
      if (T==='is') stage='0';
      else if (T==='1a') stage='I A';
      else if (T==='1b') stage='I A';
      else if (T==='2') stage='I B';
      else if (T==='3') stage='II A';
      else if (T==='4a') stage='II B';
      else stage='III B';
    }
    const e=gel('stomach-result'); if(e) e.outerHTML=U.stageResult(stage,`T${T} N${N} M${M}`);
  };

  // ─── 8. PANCREAS ─────────────────────────────────────────
  function renderPancreas() {
    return U.cardWrap('pancreas', IC.pancreas, '胰臟癌 AJCC 9th', `
      ${U.fld('pan-t','T 分類',[['1a','T1a ≤0.5cm'],['1b','T1b 0.5-1cm'],['1c','T1c 1-2cm'],['2','T2 2-4cm'],['3','T3 >4cm / 十二指腸/膽管'],['4','T4 腹腔幹/腸繫膜上動脈']],'2')}
      ${U.fld('pan-n','N',[['0','N0'],['1','N1 1-3顆區域LN'],['2','N2 ≥4顆區域LN']],'0')}
      ${U.fld('pan-m','M',[['0','M0'],['1','M1']],'0')}
      <div id="pancreas-result"></div>
      ${U.calcBtn("StagePancreas()")}
    `);
  }
  window.StagePancreas = function() {
    const T=selVal('pan-t'), N=sel('pan-n'), M=sel('pan-m');
    let stage='';
    if (M==='1') stage='IV';
    else if (T==='4') stage='III';
    else if (N==='2') stage='III';
    else if (N==='1') stage= (T==='1a'||T==='1b'||T==='1c')?'II B':'II B';
    else {
      if (T==='1a'||T==='1b'||T==='1c') stage='I A';
      else if (T==='2') stage='I B';
      else stage='II A';
    }
    const e=gel('pancreas-result'); if(e) e.outerHTML=U.stageResult(stage,`T${T} N${N} M${M}`);
  };

  // ─── 9. HEAD & NECK ──────────────────────────────────────
  const HN_SITES = [
    ['npc','鼻咽'],['oral','口腔'],['oropharynx','口咽 p16+'],['larynx','喉'],['hypopharynx','下咽'],
  ];
  let hnSite = 'npc';

  function renderHNFields() {
    if (hnSite==='npc') return renderNPC();
    if (hnSite==='oral') return renderOral();
    if (hnSite==='oropharynx') return renderOroph();
    if (hnSite==='larynx') return renderLarynx();
    if (hnSite==='hypopharynx') return renderHypoph();
    return '';
  }

  function renderHN() {
    const siteBtns = HN_SITES.map(([s,l]) =>
      `<button id="hn-site-${s}" onclick="HNSite('${s}')" class="fpill${s===hnSite?' on':''}">${l}</button>`
    ).join('');
    return U.cardWrap('hn', IC.hn, '頭頸癌 AJCC 9th', `
      <div class="flex flex-wrap gap-1.5 mb-3">${siteBtns}</div>
      <div id="hn-fields">${renderHNFields()}</div>
    `);
  }

  window.HNSite = function(site) {
    hnSite = site;
    document.querySelectorAll('[id^="hn-site-"]').forEach(b => {
      b.classList.toggle('on', b.id === 'hn-site-' + site);
    });
    const f = gel('hn-fields');
    if (f) f.innerHTML = renderHNFields();
  };

  function renderNPC() {
    return `
      ${U.fld('npc-t','T',[['1','T1 鼻咽/口咽/鼻腔'],['2','T2 咽旁/軟組織'],['3','T3 顱底/頸椎/翼板/鼻竇'],['4','T4 顱內/腦神經/眼眶/下咽']],'1')}
      ${U.fld('npc-n','N',[['0','N0'],['1','N1 同側頸部/咽後 ≤6cm'],['2','N2 雙側頸部 ≤6cm'],['3','N3 >6cm 或鎖骨上']],'0')}
      ${U.fld('npc-m','M',[['0','M0'],['1','M1']],'0')}
      <div id="npc-result"></div>
      ${U.calcBtn("StageNPC()")}`;
  }
  window.StageNPC = function() {
    const T=selVal('npc-t'), N=sel('npc-n'), M=sel('npc-m');
    let stage='';
    if (M==='1') stage='IV B';
    else if (T==='4'||N==='3') stage='IV A';
    else if (T==='3'||N==='2') stage='III';
    else if (T==='2'||N==='1') stage='II';
    else stage='I';
    const e=gel('npc-result'); if(e) e.outerHTML=U.stageResult(stage,`T${T} N${N} M${M}`);
  };

  function renderOral() {
    return `
      ${U.fld('oral-t','T',[['1','T1 ≤2cm, DOI≤5mm'],['2','T2 ≤2cm DOI>5mm / 2-4cm DOI≤10mm'],['3','T3 >4cm / DOI>10mm'],['4a','T4a 鄰近結構（皮質骨/下牙槽神經/口底/皮膚）'],['4b','T4b 咀嚼間隙/翼板/顱底/頸內動脈']],'1')}
      ${U.fld('oral-n','N（臨床）',[['0','N0'],['1','N1 同側單顆 ≤3cm, ENE-'],['2a','N2a 同側單顆 3-6cm'],['2b','N2b 同側多顆 ≤6cm'],['2c','N2c 雙/對側 ≤6cm'],['3a','N3a >6cm, ENE-'],['3b','任何 ENE+']],'0')}
      ${U.fld('oral-m','M',[['0','M0'],['1','M1']],'0')}
      <div id="oral-result"></div>
      ${U.calcBtn("StageOral()")}`;
  }
  window.StageOral = function() {
    const T=selVal('oral-t'), N=sel('oral-n'), M=sel('oral-m');
    let stage='';
    if (M==='1') stage='IV C';
    else if (T==='4b'||N==='3a'||N==='3b') stage='IV B';
    else if (T==='4a'||N.startsWith('2')) stage='IV A';
    else if (N==='1') stage='III';
    else { stage = T==='1'?'I':T==='2'?'II':'III'; }
    const e=gel('oral-result'); if(e) e.outerHTML=U.stageResult(stage,`T${T} N${N} M${M}`);
  };

  function renderOroph() {
    return `
      ${U.fld('orp-t','T',[['1','T1 ≤2cm'],['2','T2 2-4cm'],['3','T3 >4cm / 會厭谷'],['4','T4 喉/外舌肌/翼肌/硬顎/下顎骨']],'1')}
      ${U.fld('orp-n','N（臨床，p16+）',[['0','N0'],['1','N1 同側單顆/多顆 ≤6cm'],['2','N2 對側/雙側 ≤6cm'],['3','N3 >6cm']],'0')}
      ${U.fld('orp-m','M',[['0','M0'],['1','M1']],'0')}
      <div id="orp-result"></div>
      ${U.calcBtn("StageOroph()")}`;
  }
  window.StageOroph = function() {
    const T=selVal('orp-t'), N=sel('orp-n'), M=sel('orp-m');
    let stage='';
    if (M==='1') stage='IV';
    else if (N==='3') stage='III';
    else if (T==='4'||N==='2') stage='III';
    else if (T==='3'||N==='1') stage='II';
    else stage='I';
    const e=gel('orp-result'); if(e) e.outerHTML=U.stageResult(stage,`T${T} N${N} M${M}`);
  };

  function renderLarynx() {
    return `
      ${U.fld('lar-t','T（聲門上）',[['1','T1 單側聲門上，正常聲帶活動'],['2','T2 多部位或聲門'],['3','T3 固定/外附著/基後區'],['4a','T4a 穿透甲狀軟骨/喉外組織'],['4b','T4b 椎前/頸動脈/縱膈']],'1')}
      ${U.fld('lar-n','N',[['0','N0'],['1','N1 同側單顆 ≤3cm'],['2a','N2a 同側單顆 3-6cm'],['2b','N2b 同側多顆 ≤6cm'],['2c','N2c 雙/對側 ≤6cm'],['3a','N3a >6cm'],['3b','ENE+']],'0')}
      ${U.fld('lar-m','M',[['0','M0'],['1','M1']],'0')}
      <div id="larynx-result"></div>
      ${U.calcBtn("StageLarynx()")}`;
  }
  window.StageLarynx = function() {
    const T=selVal('lar-t'), N=sel('lar-n'), M=sel('lar-m');
    let stage='';
    if (M==='1') stage='IV C';
    else if (T==='4b'||N==='3a'||N==='3b') stage='IV B';
    else if (T==='4a'||N.startsWith('2')) stage='IV A';
    else if (T==='3'||N==='1') stage='III';
    else stage=T==='1'?'I':'II';
    const e=gel('larynx-result'); if(e) e.outerHTML=U.stageResult(stage,`T${T} N${N} M${M}`);
  };

  function renderHypoph() {
    return `
      ${U.fld('hyp-t','T',[['1','T1 單部位，無固定'],['2','T2 多部位/鄰近 / 固定聲帶'],['3','T3 固定/食道/中央頸部'],['4a','T4a 甲狀/環狀軟骨/舌骨/頸部軟組織'],['4b','T4b 椎前/縱膈/頸動脈']],'1')}
      ${U.fld('hyp-n','N',[['0','N0'],['1','N1 同側單顆 ≤3cm'],['2a','N2a 同側單顆 3-6cm'],['2b','N2b 同側多顆 ≤6cm'],['2c','N2c 雙/對側 ≤6cm'],['3a','N3a >6cm'],['3b','ENE+']],'0')}
      ${U.fld('hyp-m','M',[['0','M0'],['1','M1']],'0')}
      <div id="hypoph-result"></div>
      ${U.calcBtn("StageHypoph()")}`;
  }
  window.StageHypoph = function() {
    const T=selVal('hyp-t'), N=sel('hyp-n'), M=sel('hyp-m');
    let stage='';
    if (M==='1') stage='IV C';
    else if (T==='4b'||N==='3a'||N==='3b') stage='IV B';
    else if (T==='4a'||N.startsWith('2')) stage='IV A';
    else if (T==='3'||N==='1') stage='III';
    else stage=T==='1'?'I':'II';
    const e=gel('hypoph-result'); if(e) e.outerHTML=U.stageResult(stage,`T${T} N${N} M${M}`);
  };

  // ── Active cancer filter ─────────────────────────────────
  let activeCancer = 'lung';

  const CANCER_LIST = [
    { id:'lung',     label:'肺癌',  render: renderLung },
    { id:'rectum',   label:'直腸',  render: renderRectum },
    { id:'prostate', label:'前列腺', render: renderProstate },
    { id:'hcc',      label:'HCC',   render: renderHCC },
    { id:'breast',   label:'乳癌',  render: renderBreast },
    { id:'eso',      label:'食道',  render: renderEso },
    { id:'stomach',  label:'胃癌',  render: renderStomach },
    { id:'pancreas', label:'胰臟',  render: renderPancreas },
    { id:'hn',       label:'頭頸',  render: renderHN },
  ];

  window.StagingFilter = function(id) {
    activeCancer = id;
    document.querySelectorAll('[id^="sf-"]').forEach(b => {
      b.classList.toggle('on', b.id === 'sf-' + id);
    });
    const panel = gel('staging-panel');
    const found = CANCER_LIST.find(c => c.id === id);
    if (panel && found) {
      panel.innerHTML = found.render();
      // Auto-expand the card
      const body = gel(id + '-body');
      const chev = gel(id + '-chev');
      if (body) body.classList.remove('hidden');
      if (chev) chev.style.transform = 'rotate(180deg)';
    }
  };

  function render() {
    const filterBar = `
      <div style="position:sticky;top:64px;z-index:40;background:var(--bg);margin:0 -16px;padding:10px 16px 8px;border-bottom:1px solid var(--border);">
        <div class="flex flex-wrap gap-1.5">
          ${CANCER_LIST.map(c => `<button id="sf-${c.id}" onclick="StagingFilter('${c.id}')" class="fpill${c.id===activeCancer?' on':''}">${c.label}</button>`).join('')}
        </div>
      </div>`;

    const initial = CANCER_LIST.find(c => c.id === activeCancer);

    return `
      <div class="mb-3 pt-1">
        <div class="text-base font-semibold" style="color:var(--t1);">腫瘤分期</div>
      </div>
      ${filterBar}
      <div id="staging-panel" class="mt-3">
        ${initial ? initial.render() : ''}
      </div>

    `;
  }

  function afterRender() {
    const body = gel(activeCancer + '-body');
    const chev = gel(activeCancer + '-chev');
    if (body) body.classList.remove('hidden');
    if (chev) chev.style.transform = 'rotate(180deg)';
  }

  return { render, afterRender };
})();
