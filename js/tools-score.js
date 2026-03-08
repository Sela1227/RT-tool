// ──────────────────────────────────────────────────────────
//  ToolsScore  —  V1.2.3
// ──────────────────────────────────────────────────────────
const ToolsScore = (() => {
  const inp = (id) => document.getElementById(id);
  const setHTML = (id, html) => { const el = document.getElementById(id); if(el) el.innerHTML = html; };

  function resultCard(content, type='info') {
    const s = {
      info:   'background:#E8ECF4;border-color:#B0BAD0;color:#1E2A3A;',
      ok:     'background:#E4EDE4;border-color:#8FB890;color:#1A3020;',
      warn:   'background:#EEE8D8;border-color:#C8B878;color:#3A2E0E;',
      danger: 'background:#EDE4E4;border-color:#C09090;color:#3A1A1A;',
    };
    return `<div class="mt-3 p-3 rounded-xl border text-sm leading-relaxed" style="${s[type]||s.info}">${content}</div>`;
  }

  function cardWrap(id, icon, title, body) {
    return `<div class="rounded-2xl mb-3 overflow-hidden" style="background:#F0F2F6;border:1px solid #C8CDD8;">
      <button onclick="toggleCard('${id}')" class="w-full px-4 py-3.5 flex items-center justify-between text-left">
        <div class="flex items-center gap-3">
          <span class="flex-shrink-0 w-5 h-5 flex items-center justify-center" style="color:#4A5568;">${icon}</span>
          <span class="font-medium text-sm" style="color:#1E2530;">${title}</span>
        </div>
        <svg id="${id}-chev" class="w-4 h-4 flex-shrink-0" style="color:#9AA0AA;transition:transform 0.2s" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
      </button>
      <div id="${id}-body" class="hidden px-4 pb-4" style="border-top:1px solid #C8CDD8;padding-top:14px;">${body}</div>
    </div>`;
  }

  // btnGroup — same pattern as calc
  function btnGroup(label, id, options, cols=0) {
    const flexClass = cols ? '' : 'flex';
    const btns = options.map(o => `<button type="button" data-grp="${id}" data-val="${o.v}"
        onclick="selBtn('${id}',this)"
        class="${cols?'':'flex-1'} text-center py-2 px-1 rounded-xl text-xs font-medium transition-all"
        style="background:#E4E8F0;border:1.5px solid transparent;color:#4A5568;line-height:1.35;">
        <div>${o.label}</div>${o.sub?`<div style="color:#9AA0AA;font-size:10px;">${o.sub}</div>`:''}
      </button>`).join('');
    const wrap = cols
      ? `<div id="${id}-grp" class="grid gap-1.5" style="grid-template-columns:repeat(${cols},1fr);">${btns}</div>`
      : `<div id="${id}-grp" class="flex gap-1.5">${btns}</div>`;
    return `<div class="mb-3">
      <label class="text-xs font-medium mb-1.5 block" style="color:#6B7280;">${label}</label>
      ${wrap}
      <input type="hidden" id="${id}" value="${options[0].v}">
    </div>`;
  }

  function calcBtn(fn) {
    return `<button onclick="${fn}" class="w-full mt-1 rounded-xl py-2.5 text-sm font-semibold" style="background:#2C3A50;color:#FFFFFF;">計算</button>`;
  }

  // ── 1. GPA Score ───────────────────────────────────────
  function renderGPA() {
    const body = `
      ${btnGroup('原發癌種','gpa-type',[
        {v:'nsclc',label:'NSCLC'},{v:'sclc',label:'SCLC'},{v:'breast',label:'Breast'},
        {v:'melanoma',label:'Melanoma'},{v:'gi',label:'GI'},{v:'renal',label:'Renal'}])}
      <div id="gpa-inputs"></div>
      ${calcBtn('calcGPA()')}
      <div id="gpa-result"></div>`;
    return cardWrap('gpa',`<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M9 2 L10.5 7 L16 7 L11.5 10.5 L13 15.5 L9 12.5 L5 15.5 L6.5 10.5 L2 7 L7.5 7 Z"/>
</svg>`,'GPA Score (DS-GPA)',body);
  }

  const GPA_CONFIG = {
    nsclc:{items:[
      {label:'KPS',id:'gpa-kps',opts:[{v:'0',label:'< 70',sub:'0'},{v:'1',label:'70–80',sub:'1'},{v:'1.5',label:'90–100',sub:'1.5'}]},
      {label:'年齡',id:'gpa-age',opts:[{v:'0',label:'≥ 60',sub:'0'},{v:'0.5',label:'50–59',sub:'0.5'},{v:'1',label:'< 50',sub:'1'}]},
      {label:'顱外轉移',id:'gpa-ecm',opts:[{v:'0',label:'有',sub:'0'},{v:'1',label:'無',sub:'1'}]},
      {label:'腦轉移數',id:'gpa-bm',opts:[{v:'0',label:'≥ 5',sub:'0'},{v:'0.5',label:'2–4',sub:'0.5'},{v:'1',label:'1',sub:'1'}]},
    ],survival:{'0-1.0':'7 mo','1.5-2.0':'11 mo','2.5-3.0':'17 mo','3.5-4.0':'26 mo'}},
    sclc:{items:[
      {label:'KPS',id:'gpa-kps',opts:[{v:'0',label:'< 70',sub:'0'},{v:'1',label:'70–80',sub:'1'},{v:'1.5',label:'90–100',sub:'1.5'}]},
      {label:'腦轉移數',id:'gpa-bm',opts:[{v:'0',label:'≥ 5',sub:'0'},{v:'0.5',label:'2–4',sub:'0.5'},{v:'1',label:'1',sub:'1'}]},
    ],survival:{'0-1.0':'2.8 mo','1.5-2.0':'5.3 mo','2.5-3.0':'9.0 mo'}},
    breast:{items:[
      {label:'KPS',id:'gpa-kps',opts:[{v:'0',label:'< 60',sub:'0'},{v:'0.5',label:'60–70',sub:'0.5'},{v:'1',label:'80',sub:'1'},{v:'1.5',label:'90–100',sub:'1.5'}]},
      {label:'腦轉移數',id:'gpa-bm',opts:[{v:'0',label:'≥ 5',sub:'0'},{v:'0.5',label:'2–4',sub:'0.5'},{v:'1',label:'1',sub:'1'}]},
      {label:'Subtype',id:'gpa-sub',opts:[{v:'0',label:'Basal',sub:'0'},{v:'1',label:'Lum.A',sub:'1'},{v:'1.5',label:'HER2',sub:'1.5'},{v:'2',label:'HR+HER2+',sub:'2'}]},
    ],survival:{'0-1.0':'3.4 mo','1.5-2.0':'7.7 mo','2.5-3.0':'15.1 mo','3.5-4.0':'25.3 mo'}},
    melanoma:{items:[
      {label:'KPS',id:'gpa-kps',opts:[{v:'0',label:'< 70',sub:'0'},{v:'1',label:'70–80',sub:'1'},{v:'2',label:'90–100',sub:'2'}]},
      {label:'腦轉移數',id:'gpa-bm',opts:[{v:'0',label:'≥ 5',sub:'0'},{v:'1',label:'2–4',sub:'1'},{v:'2',label:'1',sub:'2'}]},
    ],survival:{'0-1.0':'3.4 mo','1.5-2.0':'4.7 mo','2.5-3.0':'8.8 mo','3.5-4.0':'13.2 mo'}},
    gi:{items:[
      {label:'KPS',id:'gpa-kps',opts:[{v:'0',label:'< 70',sub:'0'},{v:'1',label:'70–80',sub:'1'},{v:'1.5',label:'90–100',sub:'1.5'}]},
      {label:'腦轉移數',id:'gpa-bm',opts:[{v:'0',label:'≥ 5',sub:'0'},{v:'0.5',label:'2–4',sub:'0.5'},{v:'1',label:'1',sub:'1'}]},
    ],survival:{'0-1.0':'3.1 mo','1.5-2.0':'4.4 mo','2.5-3.0':'6.9 mo'}},
    renal:{items:[
      {label:'KPS',id:'gpa-kps',opts:[{v:'0',label:'< 70',sub:'0'},{v:'1',label:'70–80',sub:'1'},{v:'2',label:'90–100',sub:'2'}]},
      {label:'腦轉移數',id:'gpa-bm',opts:[{v:'0',label:'≥ 5',sub:'0'},{v:'1',label:'2–4',sub:'1'},{v:'2',label:'1',sub:'2'}]},
      {label:'顱外轉移',id:'gpa-ecm',opts:[{v:'0',label:'有',sub:'0'},{v:'1',label:'無',sub:'1'}]},
    ],survival:{'0-1.0':'3.3 mo','1.5-2.0':'7.3 mo','2.5-3.0':'11.3 mo','3.5-4.0':'14.8 mo'}},
  };

  window.updateGPAInputs = function() {
    const type = inp('gpa-type')?.value||'nsclc';
    const cfg  = GPA_CONFIG[type];
    const html = cfg.items.map(item => btnGroup(item.label, item.id, item.opts)).join('');
    setHTML('gpa-inputs', html);
    // init button groups in gpa-inputs
    setTimeout(()=>{
      document.querySelectorAll('#gpa-inputs [data-grp]').forEach(btn=>{
        const grp=btn.dataset.grp;
        if(!document.querySelector(`#gpa-inputs [data-grp="${grp}"][style*="2C3A50"]`)){
          const first=document.querySelector(`#gpa-inputs [data-grp="${grp}"]`);
          if(first) selBtn(grp,first);
        }
      });
    },20);
  };

  window.calcGPA = function() {
    const type=inp('gpa-type')?.value||'nsclc', cfg=GPA_CONFIG[type];
    let score=0;
    cfg.items.forEach(item=>{score+=parseFloat(inp(item.id)?.value||0);});
    const maxScore=cfg.items.reduce((s,i)=>s+parseFloat(i.opts[i.opts.length-1].v),0);
    let survival='?';
    for(const [range,surv] of Object.entries(cfg.survival)){
      const [lo,hi]=range.split('-').map(Number);
      if(score>=lo&&score<=(hi||lo)){survival=surv;break;}
    }
    const pct=score/maxScore;
    setHTML('gpa-result',resultCard(`<div class="text-center">
      <div class="mono text-2xl font-bold">${score.toFixed(1)} / ${maxScore}</div>
      <div class="text-sm mt-1">中位存活：<span class="font-bold">${survival}</span></div>
    </div>`,pct>=0.75?'ok':pct>=0.5?'warn':'danger'));
  };

  // ── 2. SINS Score ─ 6 items, all clickable ─────────────
  function renderSINS() {
    const body = `
      ${btnGroup('1. 位置','sins-loc',[
        {v:'3',label:'交界處',sub:'O/C C/T T/L L/S · 3'},
        {v:'2',label:'活動節',sub:'C / L spine · 2'},
        {v:'1',label:'半固定節',sub:'T spine · 1'},
        {v:'0',label:'固定節',sub:'S1–S5 · 0'}],2)}
      ${btnGroup('2. 疼痛','sins-pain',[
        {v:'3',label:'活動相關痛',sub:'3'},{v:'1',label:'偶爾痛',sub:'1'},{v:'0',label:'無痛',sub:'0'}])}
      ${btnGroup('3. 骨質','sins-bone',[
        {v:'2',label:'溶骨性',sub:'2'},{v:'1',label:'混合性',sub:'1'},{v:'0',label:'成骨性',sub:'0'}])}
      ${btnGroup('4. 脊椎排列','sins-align',[
        {v:'4',label:'脫位/移位',sub:'4'},{v:'2',label:'後彎/側彎',sub:'2'},{v:'0',label:'正常',sub:'0'}])}
      ${btnGroup('5. 椎體塌陷','sins-vb',[
        {v:'2',label:'> 50%',sub:'2'},{v:'1',label:'< 50%',sub:'1'},{v:'0',label:'無',sub:'0'}])}
      ${btnGroup('6. 後外側侵犯','sins-poster',[
        {v:'3',label:'雙側',sub:'3'},{v:'1',label:'單側',sub:'1'},{v:'0',label:'無',sub:'0'}])}
      ${calcBtn('calcSINS()')}
      <div id="sins-result"></div>`;
    return cardWrap('sins',`<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
  <rect x="6" y="2" width="6" height="4" rx="1"/>
  <rect x="6" y="7" width="6" height="4" rx="1"/>
  <rect x="6" y="12" width="6" height="4" rx="1"/>
  <line x1="9" y1="6" x2="9" y2="7"/>
  <line x1="9" y1="11" x2="9" y2="12"/>
</svg>`,'SINS Score（脊椎不穩定）',body);
  }
  window.calcSINS=function(){
    const total=['sins-loc','sins-pain','sins-bone','sins-align','sins-vb','sins-poster']
      .reduce((s,id)=>s+(parseFloat(inp(id)?.value)||0),0);
    const interp=total<=6?{label:'穩定 (0–6)',type:'ok'}:total<=12?{label:'可能不穩定 (7–12)',type:'warn'}:{label:'不穩定 (13–18)',type:'danger'};
    const rec=total<=6?'可考慮 RT 而無需手術固定':total<=12?'建議外科評估':' 建議手術固定後再 RT';
    setHTML('sins-result',resultCard(`<div class="text-center">
      <div class="mono text-3xl font-bold">${total} / 18</div>
      <div class="font-bold mt-1">${interp.label}</div>
      <div class="text-xs mt-0.5">${rec}</div>
    </div>`,interp.type));
  };

  // ── 3. Tokuhashi Score ─ 5 items, clickable ────────────
  function renderTokuhashi() {
    const body = `
      ${btnGroup('1. 全身狀況 (KPS)','toku-gc',[
        {v:'0',label:'差 (<40%)',sub:'0'},{v:'1',label:'中等 (40–70%)',sub:'1'},{v:'2',label:'良好 (>70%)',sub:'2'}])}
      ${btnGroup('2. 脊椎外骨轉移','toku-bone',[
        {v:'0',label:'≥ 3 處',sub:'0'},{v:'1',label:'1–2 處',sub:'1'},{v:'2',label:'無',sub:'2'}])}
      ${btnGroup('3. 主要器官轉移','toku-organ',[
        {v:'0',label:'不可切除',sub:'0'},{v:'1',label:'可切除',sub:'1'},{v:'2',label:'無',sub:'2'}])}
      ${btnGroup('4. 原發部位','toku-primary',[
        {v:'0',label:'肺/骨/胃…',sub:'0'},{v:'1',label:'肝/膽/不明',sub:'1'},{v:'2',label:'其他',sub:'2'},
        {v:'3',label:'腎/子宮',sub:'3'},{v:'4',label:'直腸',sub:'4'},{v:'5',label:'甲/乳/前/類',sub:'5'}],3)}
      ${btnGroup('5. 脊髓狀態 (Frankel)','toku-palsy',[
        {v:'0',label:'完全癱 A/B',sub:'0'},{v:'1',label:'不完全 C/D',sub:'1'},{v:'2',label:'無 (E)',sub:'2'}])}
      ${calcBtn('calcTokuhashi()')}
      <div id="toku-result"></div>`;
    return cardWrap('tokuhashi',`<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
  <rect x="6" y="2" width="6" height="4" rx="1"/>
  <rect x="6" y="7" width="6" height="4" rx="1"/>
  <rect x="6" y="12" width="6" height="4" rx="1"/>
  <line x1="9" y1="6" x2="9" y2="7"/>
  <line x1="9" y1="11" x2="9" y2="12"/>
  <polyline points="11,5 14,9 11,13"/>
</svg>`,'Tokuhashi Score（脊椎轉移）',body);
  }
  window.calcTokuhashi=function(){
    const total=['toku-gc','toku-bone','toku-organ','toku-primary','toku-palsy']
      .reduce((s,id)=>s+(parseFloat(inp(id)?.value)||0),0);
    const prog=total<=8?{label:'< 6 個月',type:'danger'}:total<=11?{label:'≥ 6 個月',type:'warn'}:{label:'≥ 12 個月',type:'ok'};
    const rec=total<=8?'支持性治療':total<=11?'後方減壓固定術或 RT':'完全/部分切除術';
    setHTML('toku-result',resultCard(`<div class="text-center">
      <div class="mono text-2xl font-bold">${total} / 15</div>
      <div class="font-bold mt-1">預期存活：${prog.label}</div>
      <div class="text-xs mt-0.5">建議：${rec}</div>
    </div>`,prog.type));
  };

  // ── 4. RPA Class ─ 4 items, clickable ─────────────────
  function renderRPA() {
    const body = `
      ${btnGroup('KPS','rpa-kps',[{v:'high',label:'≥ 70'},{v:'low',label:'< 70'}])}
      ${btnGroup('年齡','rpa-age',[{v:'lt65',label:'< 65 歲'},{v:'gte65',label:'≥ 65 歲'}])}
      ${btnGroup('原發灶控制','rpa-primary',[{v:'ctrl',label:'已控制'},{v:'noctrl',label:'未控制'}])}
      ${btnGroup('顱外轉移','rpa-ecm',[{v:'no',label:'無'},{v:'yes',label:'有'}])}
      ${calcBtn('calcRPA()')}
      <div id="rpa-result"></div>`;
    return cardWrap('rpa',`<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
  <path d="M4 16 C4 10 6 4 9 3 C12 4 14 10 14 16"/>
  <path d="M6.5 10 C6.5 10 7.5 8 9 8 C10.5 8 11.5 10 11.5 10"/>
  <line x1="9" y1="8" x2="9" y2="6"/>
</svg>`,'RPA Class（腦轉移）',body);
  }
  window.calcRPA=function(){
    const kps=inp('rpa-kps')?.value, age=inp('rpa-age')?.value;
    const prim=inp('rpa-primary')?.value, ecm=inp('rpa-ecm')?.value;
    let cls,survival,type;
    if(kps==='high'&&age==='lt65'&&prim==='ctrl'&&ecm==='no'){cls=1;survival='7.1 個月';type='ok';}
    else if(kps==='low'){cls=3;survival='2.3 個月';type='danger';}
    else{cls=2;survival='4.2 個月';type='warn';}
    setHTML('rpa-result',resultCard(`<div class="text-center">
      <div class="text-3xl font-bold">Class ${cls}</div>
      <div class="text-sm mt-1">中位存活：<span class="font-bold">${survival}</span></div>
    </div>`,type));
  };

  // ── 5. ECOG ↔ KPS ─ ECOG clickable, KPS numeric ────────
  function renderECOGKPS() {
    const rows = [
      [0,100,'完全正常活動'],
      [1,90,'有症狀，能正常活動'],
      [1,80,'有症狀，部分需協助'],
      [2,70,'可自理，無法工作'],
      [2,60,'需偶爾協助'],
      [3,50,'需相當協助，頻繁就醫'],
      [3,40,'失能，需特殊照護'],
      [4,30,'重度失能，住院指徵'],
      [4,20,'病重，需積極支持'],
      [4,10,'病危'],
    ].map(([ecog,kps,desc])=>`<tr style="border-bottom:1px solid #D0D4DC;">
      <td class="py-1.5 px-2 text-center font-bold mono text-sm">${ecog}</td>
      <td class="py-1.5 px-2 text-center mono">${kps}</td>
      <td class="py-1.5 px-2 text-xs" style="color:#4A5568;">${desc}</td>
    </tr>`).join('');

    const body = `
      ${btnGroup('ECOG','ek-ecog',[
        {v:'0',label:'0'},{v:'1',label:'1'},{v:'2',label:'2'},{v:'3',label:'3'},{v:'4',label:'4'}])}
      <div id="ek-result" class="mb-3"></div>
      <table class="w-full text-sm" style="border-radius:10px;overflow:hidden;border:1px solid #C8CDD8;">
        <thead><tr style="background:#DDE2EC;">
          <th class="py-1.5 px-2 text-xs font-semibold" style="color:#4A5568;">ECOG</th>
          <th class="py-1.5 px-2 text-xs font-semibold" style="color:#4A5568;">KPS</th>
          <th class="py-1.5 px-2 text-xs font-semibold text-left" style="color:#4A5568;">描述</th>
        </tr></thead>
        <tbody style="background:#F0F2F6;">${rows}</tbody>
      </table>`;
    return cardWrap('ecogkps',`<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="9" cy="3.5" r="1.5"/>
  <line x1="9" y1="5" x2="9" y2="11"/>
  <polyline points="6,8 9,11 12,8"/>
  <line x1="7" y1="13" x2="9" y2="11"/>
  <line x1="11" y1="13" x2="9" y2="11"/>
  <line x1="5.5" y1="16" x2="7" y2="13"/>
  <line x1="12.5" y1="16" x2="11" y2="13"/>
</svg>`,'ECOG ↔ KPS 換算',body);
  }

  const ECOG_MAP=[[0,100],[0,90],[1,80],[1,70],[2,60],[2,50],[3,40],[3,30],[4,20],[4,10]];
  window.showECOG = function(btn) {
    // Called from btnGroup onclick via selBtn
    setTimeout(()=>{
      const ecog=parseInt(document.getElementById('ek-ecog')?.value);
      if(isNaN(ecog)) return;
      const kpsVals=ECOG_MAP.filter(([e])=>e===ecog).map(([,k])=>k).join(' / ');
      setHTML('ek-result',`<div class="text-xs rounded-xl px-3 py-2" style="background:#E4E8F0;color:#1E2530;">ECOG ${ecog} → KPS <span class="font-bold mono">${kpsVals}</span></div>`);
    },10);
  };

  // ── Render all ──────────────────────────────────────────
  function render(settings) {
    const en=settings?.enabledTools||{};
    const tools=[
      {key:'gpa',fn:renderGPA},{key:'sins',fn:renderSINS},
      {key:'tokuhashi',fn:renderTokuhashi},{key:'rpa',fn:renderRPA},
      {key:'ecogkps',fn:renderECOGKPS},
    ];
    const html=tools.filter(t=>en[t.key]!==false).map(t=>t.fn()).join('');
    setTimeout(()=>{
      updateGPAInputs();
      document.querySelectorAll('[data-grp]').forEach(btn=>{
        const grp=btn.dataset.grp;
        if(!document.querySelector(`[data-grp="${grp}"][style*="2C3A50"]`)){
          const first=document.querySelector(`[data-grp="${grp}"]`);
          if(first) selBtn(grp,first);
        }
      });
      // wire ECOG btn group to show result
      document.querySelectorAll('[data-grp="ek-ecog"]').forEach(btn=>{
        btn.addEventListener('click', ()=>showECOG());
      });
      // wire gpa-type change
      document.querySelectorAll('[data-grp="gpa-type"]').forEach(btn=>{
        btn.addEventListener('click',()=>setTimeout(updateGPAInputs,10));
      });
    },50);
    return html||`<div class="text-center text-sm py-8" style="color:#9AA0AA;">所有評分工具已關閉</div>`;
  }
  return {render};
})();
