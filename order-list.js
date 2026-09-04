(function(){
  if(window.__krawOrderListLoaded)return;
  window.__krawOrderListLoaded=true;

  const labels={1:'Ana Yemek',2:'Yan Yemek',3:'Yoğurt / Cacık / Salata',4:'Tatlı / Meyve'};
  let wasReady=false;
  function esc2(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function mealTitle(id){try{return (S.meals||[]).find(m=>m.id===id)?.name||'-'}catch(e){return '-'}}
  function ids(){try{return {1:P?.[1]||S.ownSelection?.group1_meal_id,2:P?.[2]||S.ownSelection?.group2_meal_id,3:P?.[3]||S.ownSelection?.group3_meal_id,4:P?.[4]||null}}catch(e){return {}}}
  function ready(){const x=ids();try{return !!(S?.user?.role==='personel'&&x[1]&&x[2]&&x[3]&&x[4])}catch(e){return false}}
  function isSaved(){try{return !!S.ownSelection}catch(e){return false}}

  function ensureStyle(){
    if(document.getElementById('krawOrderListStyle'))return;
    const s=document.createElement('style');s.id='krawOrderListStyle';s.textContent=`
      .kraw-order-list{margin:14px 0 18px;background:#0d2139;border:1px solid #2a4d70;border-radius:14px;overflow:hidden;color:#eef5ff;box-shadow:0 10px 28px #0003}
      .kraw-order-head{padding:14px 16px;background:#122b47;border-bottom:1px solid #2a4d70}.kraw-order-head h3{margin:0 0 4px;font-size:18px}.kraw-order-user{font-weight:800;color:#fff}
      .kraw-order-row{display:grid;grid-template-columns:44px 1fr;gap:10px;align-items:center;padding:12px 14px;border-bottom:1px solid #203d59}
      .kraw-order-no{width:34px;height:34px;border-radius:9px;background:#183d64;display:grid;place-items:center;font-weight:900}
      .kraw-order-meal{font-weight:800;font-size:15px}.kraw-order-meal.second{color:#ffd36a;margin-top:4px}.kraw-order-label{font-size:12px;color:#9fb3c8;margin-top:2px}
      .kraw-order-done{margin:12px 14px 14px;padding:9px 12px;background:#0b5b46;border:1px solid #16745c;border-radius:9px;color:#d8fff0;font-weight:800;text-align:center}
      .kraw-order-pending{margin:12px 14px 14px;padding:9px 12px;background:#174d79;border:1px solid #2d6c9f;border-radius:9px;color:#e8f4ff;font-weight:800;text-align:center}
      .group[data-g="3"] .portiontag,.group[data-g="3"] .portionmini,.group[data-g="3"] .portionchoice,.group[data-g="4"] .portiontag,.group[data-g="4"] .portionmini,.group[data-g="4"] .portionchoice{display:none!important}
    `;document.head.appendChild(s);
  }

  function cleanPortionControls(){try{[3,4].forEach(g=>{const group=document.querySelector('.group[data-g="'+g+'"]');if(!group)return;group.querySelectorAll('.portiontag,.portionmini,.portionchoice').forEach(el=>el.remove());group.querySelectorAll('button').forEach(btn=>{const t=(btn.textContent||'').trim();if(t==='Az'||t==='Normal')btn.remove()})})}catch(e){}}

  function draw(forceScroll=false){
    try{
      cleanPortionControls();
      const nowReady=ready();
      const old=document.getElementById('krawOrderList');
      if(!nowReady){if(old)old.remove();wasReady=false;return null}
      ensureStyle();
      const datebar=document.getElementById('datebar');if(!datebar)return null;
      let box=old;
      if(!box){box=document.createElement('div');box.id='krawOrderList';box.className='kraw-order-list';datebar.insertAdjacentElement('afterend',box)}
      const x=ids();
      const saved=isSaved();
      box.innerHTML=`<div class="kraw-order-head"><h3>📋 Verdiğim Siparişler</h3><div class="kraw-order-user">👤 ${esc2(S.user.full_name)}</div></div>`+
        [1,2,3,4].map(g=>{const s2=window.D2?.[g];return `<div class="kraw-order-row"><div class="kraw-order-no">${g}</div><div><div class="kraw-order-meal">1. ${esc2(mealTitle(x[g]))}</div>${s2?`<div class="kraw-order-meal second">2. ${esc2(mealTitle(s2))}</div>`:''}<div class="kraw-order-label">${labels[g]}</div></div></div>`}).join('')+
        (saved?`<div class="kraw-order-done">✓ Siparişiniz kaydedildi</div>`:`<div class="kraw-order-pending">✓ Tüm seçimler tamamlandı</div>`);
      if((!wasReady||forceScroll))setTimeout(()=>box.scrollIntoView({behavior:'smooth',block:'start'}),100);
      wasReady=true;
      return box;
    }catch(e){console.error('Sipariş listesi:',e);return null}
  }

  document.addEventListener('click',e=>{try{const meal=e.target.closest('.meal');if(!meal)return;const g=Number(meal.closest('.group')?.dataset?.g||0);if(g===3||g===4)setTimeout(()=>{document.getElementById('portionModal')?.remove();cleanPortionControls();draw(false)},0)}catch(err){}},true);

  function hookSave(){try{if(typeof saveSel==='function'&&!saveSel.__savedOrderHook){const original=saveSel;saveSel=async function(){await original();setTimeout(()=>draw(false),450)};saveSel.__savedOrderHook=true}if(typeof closeSuccess==='function'&&!closeSuccess.__savedOrderHook){const originalClose=closeSuccess;closeSuccess=function(){originalClose();setTimeout(()=>draw(true),120)};closeSuccess.__savedOrderHook=true}}catch(e){}}

  setInterval(()=>{ensureStyle();hookSave();cleanPortionControls();draw(false)},250);
  setTimeout(()=>draw(false),150);
})();
