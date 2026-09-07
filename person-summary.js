(function(){
  if(window.__krawPersonSummaryLoaded)return;
  window.__krawPersonSummaryLoaded=true;

  const LABELS={1:'Ana Yemek',2:'Yan Yemek',3:'Yoğurt / Cacık / Salata',4:'Tatlı / Meyve'};
  let lastSig='';

  function escP(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function mealName(id){try{return (S.meals||[]).find(m=>String(m.id)===String(id))?.name||'—'}catch(e){return '—'}}
  function trNow(){
    const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Istanbul',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date());
    const get=t=>parts.find(p=>p.type===t)?.value||'';
    return {date:get('year')+'-'+get('month')+'-'+get('day'),hour:Number(get('hour')||0),minute:Number(get('minute')||0)};
  }
  function currentId(g){
    try{
      if(P?.[g])return P[g];
      if(g===1)return S?.ownSelection?.group1_meal_id||null;
      if(g===2)return S?.ownSelection?.group2_meal_id||null;
      if(g===3)return S?.ownSelection?.group3_meal_id||null;
      if(g===4){
        const sel=document.querySelector('#groups .group[data-g="4"] .meal.sel');
        const oc=sel?.getAttribute('onclick')||'';
        const m=oc.match(/pick4\(['\"]([^'\"]+)['\"]\)/);
        return m?.[1]||null;
      }
    }catch(e){}
    return null;
  }
  function hasSaved(){return !!S?.ownSelection}
  function hasAnyOrder(){return hasSaved()||[1,2,3,4].some(g=>!!currentId(g))}
  function hasComplete(){return !!(S?.user?.role==='personel'&&[1,2,3,4].every(g=>!!currentId(g)))}
  function editLocked(){const n=trNow();return hasSaved()&&n.hour>=11}
  function sig(){return [1,2,3,4].map(g=>currentId(g)||'').concat([window.D2?.[1]||'',window.D2?.[3]||'',hasSaved()?'1':'0',editLocked()?'1':'0']).join('|')}

  function style(){
    if(document.getElementById('krawPersonSummaryStyle'))return;
    const s=document.createElement('style');s.id='krawPersonSummaryStyle';s.textContent=`
      .kraw-side-summary{margin-top:12px;background:#0d2139;border:1px solid #2a4d70;border-radius:12px;overflow:hidden;color:#eef5ff;box-shadow:0 10px 28px rgba(0,0,0,.18)}
      .kraw-side-summary-head{padding:13px 14px;background:#122b47;border-bottom:1px solid #2a4d70;display:flex;justify-content:space-between;align-items:center;gap:10px}.kraw-side-summary-head b{font-size:16px}.kraw-side-summary-head small{display:block;color:#a9bdd2;margin-top:2px}
      .kraw-side-row{display:grid;grid-template-columns:30px 1fr;gap:8px;padding:10px 12px;border-bottom:1px solid #1e3b57}.kraw-side-no{width:26px;height:26px;border-radius:7px;background:#183d64;display:grid;place-items:center;font-weight:900;font-size:12px}.kraw-side-meal{font-weight:800;font-size:13px;line-height:1.35}.kraw-side-meal.second{color:#ffd36a;margin-top:2px}.kraw-side-label{font-size:11px;color:#9fb3c8;margin-top:2px}
      .kraw-side-foot{padding:11px 12px}.kraw-side-deadline{font-size:12px;text-align:center;padding:8px 9px;border-radius:8px;margin-bottom:9px;background:#173a5a;color:#dcecff}.kraw-side-deadline.locked{background:#4a1f27;color:#ffdce1;border:1px solid #74313d}.kraw-side-edit{width:100%;border:0;border-radius:9px;padding:11px 12px;background:#2869dc;color:#fff;font-weight:900;cursor:pointer}.kraw-side-edit:disabled{background:#526377;color:#cbd5e1;cursor:not-allowed}
      .kraw-lock-msg{position:fixed;z-index:14000;top:14px;left:50%;transform:translateX(-50%);width:min(560px,calc(100vw - 24px));background:#fff3f4;color:#8b1f2d;border:1px solid #f0bdc4;border-radius:12px;padding:12px 14px;box-shadow:0 12px 40px rgba(0,0,0,.25);font-weight:800;text-align:center}
    `;document.head.appendChild(s);
  }

  function showLockMsg(){
    document.getElementById('krawLockMsg')?.remove();
    const n=document.createElement('div');n.id='krawLockMsg';n.className='kraw-lock-msg';n.textContent='⏰ Saat 11:00 geçtiği için bugünkü yemek siparişiniz artık değiştirilemez.';document.body.appendChild(n);setTimeout(()=>n.remove(),3200);
  }

  function ensureCard(){
    if(typeof S==='undefined'||S.user?.role!=='personel')return null;
    const guestHead=document.querySelector('.guesthead');if(!guestHead)return null;
    let card=document.getElementById('krawSideSummary');
    if(!card){card=document.createElement('div');card.id='krawSideSummary';card.className='kraw-side-summary';guestHead.insertAdjacentElement('afterend',card)}
    return card;
  }

  function render(){
    try{
      if(typeof S==='undefined'||S.user?.role!=='personel')return;
      style();
      const card=ensureCard();if(!card)return;
      if(!hasAnyOrder()){card.style.display='none';lastSig='';return}
      card.style.display='block';
      const locked=editLocked();
      const x={1:currentId(1),2:currentId(2),3:currentId(3),4:currentId(4)};
      card.innerHTML=`<div class="kraw-side-summary-head"><div><b>📋 Seçtiklerim</b><small>${hasSaved()?'Kayıtlı sipariş':hasComplete()?'Onay bekliyor':'Seçim devam ediyor'}</small></div></div>`+
        [1,2,3,4].map(g=>{const s2=(g===1||g===3)?window.D2?.[g]:null;return `<div class="kraw-side-row"><div class="kraw-side-no">${g}</div><div><div class="kraw-side-meal">${x[g]?escP(mealName(x[g])):'Henüz seçilmedi'}</div>${s2?`<div class="kraw-side-meal second">+ ${escP(mealName(s2))}</div>`:''}<div class="kraw-side-label">${LABELS[g]}</div></div></div>`}).join('')+
        `<div class="kraw-side-foot"><div class="kraw-side-deadline ${locked?'locked':''}">${locked?'🔒 Değişiklik süresi doldu (11:00)':'🕚 Değişiklikler bugün saat 11:00’e kadar yapılabilir.'}</div><button type="button" class="kraw-side-edit" ${locked?'disabled':''}>${locked?'Değişiklik Kapalı':'Yemekleri Değiştir'}</button></div>`;
      const b=card.querySelector('.kraw-side-edit');if(b&&!locked)b.onclick=()=>{window.krawSetMealGroup?.(1);document.getElementById('krawGroupTabs')?.scrollIntoView({behavior:'smooth',block:'start'})};
      lastSig=sig();
    }catch(e){console.error('Personel sipariş özeti:',e)}
  }

  document.addEventListener('click',e=>{
    if(typeof S==='undefined'||S.user?.role!=='personel'||!editLocked())return;
    const meal=e.target.closest?.('.meal');
    const confirmBtn=e.target.closest?.('#saveBtn,#krawOrderConfirmBtn,.kraw-final-confirm button');
    if(meal||confirmBtn){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();showLockMsg();render()}
  },true);

  document.addEventListener('click',e=>{
    if(typeof S==='undefined'||S.user?.role!=='personel')return;
    if(e.target.closest?.('.meal,#saveBtn,#krawOrderConfirmBtn,.kraw-final-confirm button'))setTimeout(render,180);
  },false);

  document.addEventListener('visibilitychange',()=>{if(!document.hidden)render()});
  let tries=0;const t=setInterval(()=>{tries++;render();if(S?.user?.role==='personel'&&document.querySelector('.guesthead')&&hasAnyOrder())clearInterval(t);if(tries>80)clearInterval(t)},150);
  setInterval(()=>{if(sig()!==lastSig)render()},2500);
  setTimeout(render,250);
})();