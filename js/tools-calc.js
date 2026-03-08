// ──────────────────────────────────────────────────────────
//  ToolsCalc  —  V1.2.3
// ──────────────────────────────────────────────────────────
const ToolsCalc = (() => {
  const inp  = (id) => document.getElementById(id);
  const val  = (id) => parseFloat(document.getElementById(id)?.value) || 0;
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

  function toggleCard(id) {
    const body = document.getElementById(id+'-body');
    const chev = document.getElementById(id+'-chev');
    if(!body) return;
    const hidden = body.classList.toggle('hidden');
    if(chev) chev.style.transform = hidden ? '' : 'rotate(180deg)';
  }
  window.toggleCard = toggleCard;

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

  function numRow(label, id, placeholder, unit='', type='number') {
    return `<div class="mb-3">
      <label class="text-xs font-medium mb-1.5 block" style="color:#6B7280;">${label}${unit ? ` <span style="color:#9AA0AA;">(${unit})</span>` : ''}</label>
      <input type="${type}" id="${id}" placeholder="${placeholder}" class="w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none" style="background:#FFFFFF;border:1px solid #C0C5D0;color:#1E2530;">
    </div>`;
  }

  function btnGroup(label, id, options) {
    const btns = options.map(o => `<button type="button" data-grp="${id}" data-val="${o.v}"
        onclick="selBtn('${id}',this)"
        class="flex-1 text-center py-2 px-1 rounded-xl text-xs font-medium transition-all"
        style="background:#E4E8F0;border:1.5px solid transparent;color:#4A5568;line-height:1.35;">
        <div>${o.label}</div>${o.sub ? `<div style="color:#9AA0AA;font-size:10px;">${o.sub}</div>` : ''}
      </button>`).join('');
    return `<div class="mb-3">
      <label class="text-xs font-medium mb-1.5 block" style="color:#6B7280;">${label}</label>
      <div id="${id}-grp" class="flex gap-1.5">${btns}</div>
      <input type="hidden" id="${id}" value="${options[0].v}">
    </div>`;
  }

  window.selBtn = function(id, btn) {
    document.querySelectorAll(`[data-grp="${id}"]`).forEach(b => {
      b.style.background = '#E4E8F0';
      b.style.borderColor = 'transparent';
      b.style.color = '#4A5568';
    });
    btn.style.background = '#2C3A50';
    btn.style.borderColor = '#2C3A50';
    btn.style.color = '#FFFFFF';
    const hid = document.getElementById(id);
    if(hid) hid.value = btn.dataset.val;
  };

  function calcBtn(fn, label='計算') {
    return `<button onclick="${fn}" class="w-full mt-1 rounded-xl py-2.5 text-sm font-semibold" style="background:#2C3A50;color:#FFFFFF;">${label}</button>`;
  }

  // ── 1. BED / EQD2  ─ show 3 α/β at once ───────────────
  function renderBED() {
    const body = `<div class="grid grid-cols-2 gap-2">
        ${numRow('總劑量 D','bed-D','e.g. 60','Gy')}
        ${numRow('分次數 N','bed-N','e.g. 30','次')}
      </div>
      <div id="bed-result"></div>`;
    return cardWrap('bed',`<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
  <path d="M2 14 C2 14 4 4 9 4 C14 4 16 14 16 14"/>
  <line x1="2" y1="14" x2="16" y2="14"/>
  <line x1="9" y1="4" x2="9" y2="2"/>
</svg>`,'BED / EQD2',body);
  }

  window.calcBED = function() {
    const D=val('bed-D'), N=val('bed-N');
    if(!D||!N) { setHTML('bed-result',''); return; }
    const d=D/N;
    const rows=[10,3,1.5].map(ab=>{
      const BED=D*(1+d/ab), EQD2=BED/(1+2/ab);
      return `<tr style="border-bottom:1px solid #C8CDD8;">
        <td class="py-2 px-2 text-xs font-semibold mono" style="color:#6B7280;">α/β=${ab}</td>
        <td class="py-2 px-2 text-center mono font-bold">${BED.toFixed(1)}</td>
        <td class="py-2 px-2 text-center mono font-bold">${EQD2.toFixed(1)}</td>
      </tr>`;
    }).join('');
    setHTML('bed-result',`<div class="mt-3 rounded-xl overflow-hidden" style="border:1px solid #C8CDD8;">
      <div class="grid grid-cols-3 text-center text-xs py-1.5" style="background:#DDE2EC;color:#4A5568;border-bottom:1px solid #C8CDD8;">
        <div>α/β</div><div>BED (Gy)</div><div>EQD2 (Gy)</div>
      </div>
      <table class="w-full" style="background:#F0F2F6;">${rows}</table>
      <div class="text-center text-xs py-1.5" style="color:#9AA0AA;background:#E4E8F0;">${d.toFixed(2)} Gy/fx</div>
    </div>`);
  };

  // ── 2. Child-Pugh  ─ all clickable ─────────────────────
  function renderChildPugh() {
    const body = `
      ${btnGroup('腹水','cp-asc',[
        {v:'1',label:'無',sub:'1分'},{v:'2',label:'輕度',sub:'2分'},{v:'3',label:'中重度',sub:'3分'}])}
      ${btnGroup('肝性腦病','cp-enc',[
        {v:'1',label:'無',sub:'1分'},{v:'2',label:'Gr. 1–2',sub:'2分'},{v:'3',label:'Gr. 3–4',sub:'3分'}])}
      ${btnGroup('總膽紅素','cp-bili',[
        {v:'1',label:'< 34',sub:'μmol/L · 1分'},{v:'2',label:'34–51',sub:'μmol/L · 2分'},{v:'3',label:'> 51',sub:'μmol/L · 3分'}])}
      ${btnGroup('白蛋白','cp-alb',[
        {v:'1',label:'> 35',sub:'g/L · 1分'},{v:'2',label:'28–35',sub:'g/L · 2分'},{v:'3',label:'< 28',sub:'g/L · 3分'}])}
      ${btnGroup('PT 延長','cp-pt',[
        {v:'1',label:'< 4 sec',sub:'1分'},{v:'2',label:'4–6 sec',sub:'2分'},{v:'3',label:'> 6 sec',sub:'3分'}])}
      ${calcBtn('calcChildPugh()')}
      <div id="cp-result"></div>`;
    return cardWrap('childpugh',`<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
  <path d="M9 3 C5 3 3 5.5 3 8 C3 11.5 5.5 13.5 9 15 C12.5 13.5 15 11.5 15 8 C15 5.5 13 3 9 3Z"/>
  <line x1="9" y1="8" x2="9" y2="12"/>
  <line x1="7" y1="10" x2="11" y2="10"/>
</svg>`,'Child-Pugh + BCLC',body);
  }

  window.calcChildPugh = function() {
    const vals=['cp-asc','cp-enc','cp-bili','cp-alb','cp-pt'].map(id=>parseInt(inp(id)?.value)||1);
    const total=vals.reduce((a,b)=>a+b,0);
    const grade=total<=6?'A':total<=9?'B':'C';
    const survival={A:'1yr≈100%，2yr≈85%',B:'1yr≈81%，2yr≈57%',C:'1yr≈45%，2yr≈35%'};
    const bclc=grade==='A'?'BCLC 0/A — 可積極治療':grade==='B'?'BCLC B — 中間期':'BCLC C/D — 不宜手術';
    const type=grade==='A'?'ok':grade==='B'?'warn':'danger';
    setHTML('cp-result',resultCard(`
      <div class="flex items-center justify-between mb-1">
        <span class="text-2xl font-bold mono">${total} 分</span>
        <span class="text-2xl font-bold">Grade ${grade}</span>
      </div>
      <div class="text-xs">${survival[grade]}</div>
      <div class="text-xs font-medium mt-0.5">${bclc}</div>
    `,type));
  };

  // ── 3. Roach  ─ GS + T clickable, PSA numeric ──────────
  function renderRoach() {
    const body = `
      ${numRow('PSA','roach-psa','ng/mL','ng/mL')}
      ${btnGroup('Gleason 總分','roach-gs',[
        {v:'6',label:'6'},{v:'7',label:'7'},{v:'8',label:'8'},{v:'9',label:'9'},{v:'10',label:'10'}])}
      ${btnGroup('T Stage','roach-t',[
        {v:'T1',label:'T1'},{v:'T2a',label:'T2a'},{v:'T2b',label:'T2b'},
        {v:'T2c',label:'T2c'},{v:'T3',label:'T3'},{v:'T4',label:'T4'}])}
      ${calcBtn('calcRoach()')}
      <div id="roach-result"></div>`;
    return cardWrap('roach',`<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
  <circle cx="9" cy="9" r="6"/>
  <circle cx="9" cy="9" r="2.5"/>
  <line x1="9" y1="1" x2="9" y2="4"/>
  <line x1="9" y1="14" x2="9" y2="17"/>
  <line x1="1" y1="9" x2="4" y2="9"/>
  <line x1="14" y1="9" x2="17" y2="9"/>
</svg>`,"Roach Formula + D'Amico",body);
  }

  window.calcRoach = function() {
    const psa=val('roach-psa'), gs=parseFloat(inp('roach-gs')?.value)||6, t=inp('roach-t')?.value||'T1';
    if(!psa) return setHTML('roach-result',resultCard('請填寫 PSA','warn'));
    const lnRisk=Math.max(0,(2/3)*psa+(gs-6)*10), svRisk=Math.max(0,psa+(gs-6)*10);
    const tHigh=['T3','T4'].includes(t), tInt=['T2b','T2c'].includes(t);
    let damico,type;
    if(psa>20||gs>=8||tHigh){damico='High Risk';type='danger';}
    else if(psa>10||gs===7||tInt){damico='Intermediate Risk';type='warn';}
    else{damico='Low Risk';type='ok';}
    setHTML('roach-result',resultCard(`
      <div class="grid grid-cols-2 gap-3 text-center mb-2">
        <div><div class="text-xs" style="color:#6B7280;">LN 風險</div><div class="font-bold mono text-lg">${lnRisk.toFixed(0)}%</div></div>
        <div><div class="text-xs" style="color:#6B7280;">SV 侵犯風險</div><div class="font-bold mono text-lg">${svRisk.toFixed(0)}%</div></div>
      </div>
      <div class="text-center font-bold">${damico}</div>
    `,type));
  };

  // ── 4. ALBI Score ───────────────────────────────────────
  function renderALBI() {
    const body=`${numRow('總膽紅素','albi-bili','μmol/L','μmol/L')}${numRow('白蛋白','albi-alb','g/L','g/L')}${calcBtn('calcALBI()')}<div id="albi-result"></div>`;
    return cardWrap('albi',`<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <rect x="2" y="11" width="3" height="5" rx="0.5"/>
  <rect x="7.5" y="7" width="3" height="9" rx="0.5"/>
  <rect x="13" y="4" width="3" height="12" rx="0.5"/>
  <polyline points="3.5,11 9,7 14.5,4"/>
</svg>`,'ALBI Score',body);
  }
  window.calcALBI=function(){
    const bili=val('albi-bili'),alb=val('albi-alb');
    if(!bili||!alb) return setHTML('albi-result',resultCard('請填寫所有欄位','warn'));
    const score=(Math.log10(bili)*0.66)+(alb*(-0.0852));
    const grade=score<=-2.60?1:score<=-1.39?2:3;
    setHTML('albi-result',resultCard(`<div class="text-center">
      <div class="mono text-2xl font-bold">${score.toFixed(3)}</div>
      <div class="font-bold mt-1">Grade ${grade} — ${['','良好','中等','差 (Child C 相近)'][grade]}</div>
    </div>`,['','ok','warn','danger'][grade]));
  };

  // ── 5. MELD Score ───────────────────────────────────────
  function renderMELD() {
    const body=`${numRow('總膽紅素','meld-bili','mg/dL','mg/dL')}${numRow('肌酸酐','meld-cr','mg/dL','mg/dL')}${numRow('INR','meld-inr','e.g. 1.2','')}${calcBtn('calcMELD()')}<div id="meld-result"></div>`;
    return cardWrap('meld',`<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
  <path d="M2 14 A7 7 0 0 1 16 14"/>
  <line x1="9" y1="14" x2="13.5" y2="7.5"/>
  <line x1="2" y1="14" x2="16" y2="14"/>
</svg>`,'MELD Score',body);
  }
  window.calcMELD=function(){
    let bili=val('meld-bili'),cr=val('meld-cr'),inr=val('meld-inr');
    if(!bili||!cr||!inr) return setHTML('meld-result',resultCard('請填寫所有欄位','warn'));
    bili=Math.max(bili,1);cr=Math.min(Math.max(cr,1),4);inr=Math.max(inr,1);
    const score=Math.max(6,Math.min(40,Math.round(3.78*Math.log(bili)+11.2*Math.log(inr)+9.57*Math.log(cr)+6.43)));
    const risk=score<10?'3個月死亡率 <10%':score<20?'~25%':score<30?'~50%':'>70%';
    setHTML('meld-result',resultCard(`<div class="text-center"><div class="mono text-3xl font-bold">${score}</div><div class="text-sm mt-1">${risk}</div></div>`,score<10?'ok':score<20?'warn':'danger'));
  };

  // ── 6. Treatment Gap ─ type clickable ──────────────────
  function renderTreatmentGap() {
    const body=`
      ${btnGroup('腫瘤類型','tg-type',[
        {v:'hn',label:'頭頸部',sub:'0.6 Gy/天'},
        {v:'other',label:'其他',sub:'0.5 Gy/天'},
        {v:'custom',label:'自訂',sub:''}])}
      <div id="tg-custom-row" class="hidden">${numRow('補償因子','tg-custom','Gy/天','Gy/天')}</div>
      ${numRow('中斷天數','tg-days','天','天')}
      ${calcBtn('calcTreatmentGap()')}
      <div id="tg-result"></div>`;
    return cardWrap('treatmentgap',`<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
  <rect x="2" y="4" width="5" height="11" rx="1"/>
  <rect x="11" y="4" width="5" height="11" rx="1"/>
  <line x1="8" y1="9" x2="10" y2="9" stroke-dasharray="1 1.5"/>
  <line x1="9" y1="6" x2="9" y2="12"/>
</svg>`,'Treatment Gap Correction',body);
  }
  window.calcTreatmentGap=function(){
    const type=inp('tg-type')?.value, days=val('tg-days');
    const cr=document.getElementById('tg-custom-row');
    if(cr) cr.classList.toggle('hidden',type!=='custom');
    let factor=type==='hn'?0.6:type==='other'?0.5:val('tg-custom');
    if(!days||!factor) return setHTML('tg-result',resultCard('請填寫所有欄位','warn'));
    setHTML('tg-result',resultCard(`<div class="text-center">
      <div class="text-xs" style="color:#6B7280;">需額外補償劑量</div>
      <div class="mono text-2xl font-bold">${(factor*days).toFixed(1)} Gy</div>
      <div class="text-xs" style="color:#6B7280;">${days}天 × ${factor} Gy/天</div>
    </div>`,'warn'));
  };

  // ── 7. Hypofractionation ────────────────────────────────
  function renderHypofrac() {
    const body=`<div class="grid grid-cols-2 gap-2">
        ${numRow('原始總劑量','hf-D','Gy','Gy')}${numRow('原始分次數','hf-N','次','次')}</div>
      ${numRow('α/β ratio','hf-ab','e.g. 10','')}
      <div class="my-3" style="border-top:1px solid #C8CDD8;"></div>
      <div class="text-xs mb-2" style="color:#6B7280;">新處方（填其中一個）</div>
      <div class="grid grid-cols-2 gap-2">
        ${numRow('新分次數','hf-Nnew','次','次')}${numRow('新劑量/次','hf-dnew','Gy/fx','Gy')}</div>
      ${calcBtn('calcHypofrac()')}<div id="hf-result"></div>`;
    return cardWrap('hypofrac',`<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="2,13 5,8 8,11 11,5 14,8 16,4"/>
  <line x1="2" y1="16" x2="16" y2="16"/>
</svg>`,'Hypofractionation Converter',body);
  }
  window.calcHypofrac=function(){
    const D=val('hf-D'),N=val('hf-N'),ab=val('hf-ab'),Nnew=val('hf-Nnew'),dnew=val('hf-dnew');
    if(!D||!N||!ab) return setHTML('hf-result',resultCard('請填寫原始處方與α/β','warn'));
    const BED=D*(1+D/(N*ab));
    let html='';
    if(Nnew){const a=Nnew/ab,b=Nnew,c=-BED,dn=(-b+Math.sqrt(b*b-4*a*c))/(2*a);html=`${Nnew}次 × <b>${dn.toFixed(2)} Gy</b> = ${(Nnew*dn).toFixed(1)} Gy`;}
    else if(dnew){const Nn=BED/(dnew*(1+dnew/ab));html=`<b>${Nn.toFixed(1)}次</b> × ${dnew} Gy = ${(Nn*dnew).toFixed(1)} Gy`;}
    else return setHTML('hf-result',resultCard('請填寫新分次數或新劑量/次','warn'));
    setHTML('hf-result',resultCard(`<div class="text-xs mb-1" style="color:#6B7280;">BED = ${BED.toFixed(1)} Gy (α/β=${ab})</div><div class="text-sm">等效新處方：${html}</div>`,'ok'));
  };

  // ── 8. Calvert Formula ──────────────────────────────────
  function renderCalvert() {
    const body=`${numRow('目標 AUC','calvert-auc','e.g. 5','mg/mL·min')}
      <div class="my-2 text-xs" style="color:#6B7280;border-top:1px solid #C8CDD8;padding-top:10px;">Cockcroft-Gault 估算 GFR</div>
      <div class="grid grid-cols-2 gap-2">${numRow('年齡','calvert-age','歲','歲')}${numRow('體重','calvert-wt','kg','kg')}</div>
      ${btnGroup('性別','calvert-sex',[{v:'M',label:'男'},{v:'F',label:'女'}])}
      ${numRow('血清肌酸酐','calvert-scr','mg/dL','mg/dL')}
      ${calcBtn('calcCalvert()')}<div id="calvert-result"></div>`;
    return cardWrap('calvert',`<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
  <path d="M6 3 L6 8 C6 12 4 14 4 14 L14 14 C14 14 12 12 12 8 L12 3"/>
  <line x1="4.5" y1="3" x2="13.5" y2="3"/>
  <circle cx="9" cy="10" r="1.5"/>
</svg>`,'Calvert Formula (Carboplatin)',body);
  }
  window.calcCalvert=function(){
    const auc=val('calvert-auc'),age=val('calvert-age'),wt=val('calvert-wt'),scr=val('calvert-scr'),sex=inp('calvert-sex')?.value;
    if(!auc||!age||!wt||!scr) return setHTML('calvert-result',resultCard('請填寫所有欄位','warn'));
    let crcl=((140-age)*wt)/(72*scr); if(sex==='F') crcl*=0.85;
    const dose=auc*(crcl+25);
    setHTML('calvert-result',resultCard(`<div class="grid grid-cols-2 gap-3 text-center">
      <div><div class="text-xs" style="color:#6B7280;">GFR (CG)</div><div class="font-bold mono">${crcl.toFixed(0)} mL/min</div></div>
      <div><div class="text-xs" style="color:#6B7280;">Carboplatin</div><div class="font-bold mono text-lg">${dose.toFixed(0)} mg</div></div>
    </div><div class="text-xs text-center mt-1" style="color:#9AA0AA;">AUC ${auc} × (${crcl.toFixed(0)} + 25)</div>`,'ok'));
  };

  // ── 9. Cockcroft-Gault ──────────────────────────────────
  function renderCG() {
    const body=`<div class="grid grid-cols-2 gap-2">${numRow('年齡','cg-age','歲','歲')}${numRow('體重','cg-wt','kg','kg')}</div>
      ${btnGroup('性別','cg-sex',[{v:'M',label:'男'},{v:'F',label:'女'}])}
      ${numRow('血清肌酸酐','cg-scr','mg/dL','mg/dL')}
      ${calcBtn('calcCG()')}<div id="cg-result"></div>`;
    return cardWrap('cockcroftgault',`<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
  <path d="M5 4 C5 4 3 6 3 9 C3 12 5 14 9 14 C13 14 15 12 15 9 C15 6 13 4 13 4"/>
  <path d="M6 6 C6 6 5 7.5 5 9 C5 11 6.5 13 9 13"/>
  <line x1="9" y1="2" x2="9" y2="5"/>
  <line x1="7.5" y1="2" x2="10.5" y2="2"/>
</svg>`,'Cockcroft-Gault (CrCl)',body);
  }
  window.calcCG=function(){
    const age=val('cg-age'),wt=val('cg-wt'),scr=val('cg-scr'),sex=inp('cg-sex')?.value;
    if(!age||!wt||!scr) return setHTML('cg-result',resultCard('請填寫所有欄位','warn'));
    let crcl=((140-age)*wt)/(72*scr); if(sex==='F') crcl*=0.85;
    const ckd=crcl>=90?'G1 正常':crcl>=60?'G2 輕度':crcl>=30?'G3 中度':crcl>=15?'G4 重度':'G5 腎衰竭';
    setHTML('cg-result',resultCard(`<div class="text-center mb-1.5">
      <div class="mono text-2xl font-bold">${crcl.toFixed(1)} mL/min</div>
      <div class="text-xs mt-0.5">${ckd}</div>
    </div>
    <div class="text-sm text-center">${crcl>=50?'✓ 可用 Cisplatin (≥50)':'⚠ Cisplatin 需謹慎 (<50)'}</div>`,crcl>=60?'ok':crcl>=30?'warn':'danger'));
  };

  // ── 10. BSA Calculator ──────────────────────────────────
  function renderBSA() {
    const body=`<div class="grid grid-cols-2 gap-2">${numRow('身高','bsa-ht','cm','cm')}${numRow('體重','bsa-wt','kg','kg')}</div>${calcBtn('calcBSA()')}<div id="bsa-result"></div>`;
    return cardWrap('bsa',`<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="9" cy="4" r="2"/>
  <path d="M5 8 C5 8 4 11 4 14"/>
  <path d="M13 8 C13 8 14 11 14 14"/>
  <path d="M5 8 L9 10 L13 8"/>
  <line x1="6.5" y1="11" x2="5.5" y2="15"/>
  <line x1="11.5" y1="11" x2="12.5" y2="15"/>
</svg>`,'BSA Calculator',body);
  }
  window.calcBSA=function(){
    const ht=val('bsa-ht'),wt=val('bsa-wt');
    if(!ht||!wt) return setHTML('bsa-result',resultCard('請填寫所有欄位','warn'));
    const db=0.007184*Math.pow(ht,0.725)*Math.pow(wt,0.425), mo=Math.sqrt(ht*wt/3600), bmi=wt/Math.pow(ht/100,2);
    setHTML('bsa-result',resultCard(`<div class="grid grid-cols-3 gap-2 text-center">
      <div><div class="text-xs" style="color:#6B7280;">DuBois</div><div class="font-bold mono">${db.toFixed(2)} m²</div></div>
      <div><div class="text-xs" style="color:#6B7280;">Mosteller</div><div class="font-bold mono">${mo.toFixed(2)} m²</div></div>
      <div><div class="text-xs" style="color:#6B7280;">BMI</div><div class="font-bold mono">${bmi.toFixed(1)}</div><div class="text-xs" style="color:#9AA0AA;">${bmi<18.5?'過輕':bmi<24?'正常':bmi<27?'過重':'肥胖'}</div></div>
    </div>`,'ok'));
  };

  // ── 11. Cisplatin ───────────────────────────────────────
  function renderCisplatin() {
    const doses=App.getCisplatinDoses(), total=doses.reduce((s,d)=>s+d.totalMg,0), warn=total>=300;
    const rows=doses.length?doses.map((d,i)=>`<div class="flex items-center justify-between text-xs py-1.5" style="border-bottom:1px solid #D0D4DC;">
        <span style="color:#6B7280;">${d.date}</span>
        <span class="mono">${d.bsa.toFixed(2)}m²</span>
        <span class="mono">${d.dpm2}mg/m²</span>
        <span class="mono font-semibold">${d.totalMg.toFixed(0)}mg</span>
        <button onclick="removeCisplatin(${i})" style="color:#C09090;" class="ml-1">✕</button>
      </div>`).join(''):`<div class="text-xs text-center py-2" style="color:#9AA0AA;">尚未記錄</div>`;
    const body=`<div class="mb-3">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-xs" style="color:#6B7280;">累積劑量</span>
          ${warn?'<span class="text-xs font-bold" style="color:#C05050;">⚠ ≥300 mg/m²</span>':''}
        </div>
        <div class="h-2 rounded-full overflow-hidden" style="background:#D0D4DC;">
          <div class="h-2 rounded-full transition-all" style="width:${Math.min(total/300*100,100).toFixed(0)}%;background:${warn?'#C05050':'#2C3A50'};"></div>
        </div>
        <div class="mono text-right text-sm font-bold mt-1" style="color:${warn?'#C05050':'#1E2530'};">${total.toFixed(0)} / 300 mg</div>
      </div>
      <div class="mb-3">${rows}</div>
      <div class="pt-3" style="border-top:1px solid #C8CDD8;">
        <div class="text-xs mb-2" style="color:#6B7280;">新增記錄</div>
        <div class="grid grid-cols-3 gap-2">
          ${numRow('日期','cisp-date','','','date')}
          ${numRow('BSA','cisp-bsa','m²','m²')}
          ${numRow('劑量','cisp-dose','mg/m²','mg/m²')}
        </div>
        <button onclick="addCisplatin()" class="w-full mt-1 rounded-xl py-2.5 text-sm font-semibold" style="background:#2C3A50;color:#FFF;">新增</button>
        ${doses.length?`<button onclick="clearCisplatin()" class="w-full mt-2 text-xs" style="color:#9AA0AA;">清除所有記錄</button>`:''}
      </div>`;
    return cardWrap('cisplatin',`<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
  <line x1="9" y1="2" x2="9" y2="5"/>
  <rect x="6" y="5" width="6" height="9" rx="3"/>
  <line x1="6.5" y1="10" x2="11.5" y2="10"/>
  <path d="M7 14 L6 16 M11 14 L12 16"/>
</svg>`,'Cisplatin 累積劑量',body);
  }
  window.addCisplatin=function(){
    const date=inp('cisp-date')?.value||new Date().toISOString().slice(0,10);
    const bsa=val('cisp-bsa'),dpm2=val('cisp-dose');
    if(!bsa||!dpm2) return alert('請填寫 BSA 和劑量');
    const doses=App.getCisplatinDoses(); doses.push({date,bsa,dpm2,totalMg:bsa*dpm2});
    App.saveCisplatinDoses(doses);
    const body=document.getElementById('cisplatin-body');
    if(body){const tmp=document.createElement('div');tmp.innerHTML=renderCisplatin();body.innerHTML=tmp.querySelector('#cisplatin-body').innerHTML;}
    else App.navigate('tools');
  };
  window.removeCisplatin=function(idx){const d=App.getCisplatinDoses();d.splice(idx,1);App.saveCisplatinDoses(d);App.navigate('tools');};
  window.clearCisplatin=function(){if(confirm('確定清除所有記錄？')){App.saveCisplatinDoses([]);App.navigate('tools');}};

  // ── Render all ──────────────────────────────────────────
  function render(settings) {
    const en=settings?.enabledTools||{};
    const tools=[
      {key:'bed',fn:renderBED},{key:'childpugh',fn:renderChildPugh},
      {key:'roach',fn:renderRoach},{key:'albi',fn:renderALBI},
      {key:'meld',fn:renderMELD},{key:'treatmentgap',fn:renderTreatmentGap},
      {key:'hypofrac',fn:renderHypofrac},{key:'calvert',fn:renderCalvert},
      {key:'cockcroftgault',fn:renderCG},{key:'bsa',fn:renderBSA},{key:'cisplatin',fn:renderCisplatin},
    ];
    const html=tools.filter(t=>en[t.key]!==false).map(t=>t.fn()).join('');
    setTimeout(()=>{
      ['bed-D','bed-N'].forEach(id=>{const el=document.getElementById(id);if(el)el.addEventListener('input',calcBED);});
      document.querySelectorAll('[data-grp]').forEach(btn=>{
        const grp=btn.dataset.grp;
        if(!document.querySelector(`[data-grp="${grp}"][style*="2C3A50"]`)){
          const first=document.querySelector(`[data-grp="${grp}"]`);
          if(first) selBtn(grp,first);
        }
      });
    },50);
    return html||`<div class="text-center text-sm py-8" style="color:#9AA0AA;">所有計算工具已關閉</div>`;
  }
  return {render};
})();
