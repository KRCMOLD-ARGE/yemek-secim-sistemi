(function(){
  if(window.__krawOrderListLoaded)return;
  window.__krawOrderListLoaded=true;

  const labels={1:'Ana Yemek',2:'Yan Yemek',3:'Yoğurt / Cacık / Salata',4:'Tatlı / Meyve'};
  let wasReady=false,manuallyClosed=false,confirming=false;
  function esc2(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function mealTitle(id){try{return (S.meals||[]).find(m=>m.id===id)?.name||'-'}catch(e){return '-'}}
  function ids(){try{return {1:P?.[1]||S.ownSelection?.group1_meal_id,2:P?.[2]||S.ownSelection?.group2_meal_id,3:P?.[3]||S.ownSelection?.group3_meal_id,4:P?.[4]||null}}catch(e){return {}}}
  function ready(){const x=ids();try{return !!(S?.user?.role==='personel'&&x[1]&&x[2]&&x[3]&&x[4])}catch(e){return false}}

  function ensureStyle(){
    if(document.getElementById('krawOrderListStyle'))return;
    const s=document.createElement('style');s.id='krawOrderListStyle';s.textContent=`
      .kraw-order-overlay{position:fixed;inset:0;z-index:12000;background:rgba(4,13,24,.68);display:flex;align-items:center;justify-content:center;padding:18px;backdrop-filter:blur(3px)}
      .kraw-order-card{position:relative;width:min(760px,96vw);max-height:88vh;overflow:auto;background:#0d2139;border:1px solid #2a4d70;border-radius:18px;color:#eef5ff;box-shadow:0 28px 90px #0009}
      .kraw-order-close{position:absolute;top:12px;right:12px;width:40px;height:40px;border:0;border-radius:10px;background:#1a3855;color:#fff;font-size:27px;line-height:1;cursor:pointer;font-weight:700;z-index:2}.kraw-order-close:hover{background:#254d73}
      .kraw-order-head{padding:20px 62px 16px 20px;background:#122b47;border-bottom:1px solid #2a4d70}.kraw-order-head h3{margin:0 0 6px;font-size:24px}.kraw-order-user{font-weight:800;color:#fff;font-size:18px}
      .kraw-order-row{display:grid;grid-template-columns:48px 1fr;gap:12px;align-items:center;padding:14px 18px;border-bottom:1px solid #203d59}
      .kraw-order-no{width:38px;height:38px;border-radius:10px;background:#183d64;display:grid;place-items:center;font-weight:900}
      .kraw-order-meal{font-weight:800;font-size:17px}.kraw-order-meal.second{color:#ffd36a;margin-top:4px}.kraw-order-label{font-size:13px;color:#9fb3c8;margin-top:3px}
      .kraw-order-actions{padding:16px 18px 18px}.kraw-order-confirm{width:100%;border:0;border-radius:11px;padding:14px 16px;background:#16965a;color:#fff;font-size:17px;font-weight:900;cursor:pointer}.kraw-order-confirm:hover{background:#12824d}.kraw-order-confirm:disabled{opacity:.6;cursor:not-allowed}
      .group[data-g="3"] .portiontag,.group[data-g="3"] .portionmini,.group[data-g="3"] .portionchoice,.group[data-g="4"] .portiontag,.group[data-g="4"] .portionmini,.group[data-g="4"] .portionchoice{display:none!important}
      @media(max-width:600px){.kraw-order-card{width:96vw}.kraw-order-head h3{font-size:20px}.kraw-order-meal{font-size:15px}.kraw-order-user{font-size:16px}}
    `;document.head.appendChild(s);
  }

  function cleanPortionControls(){try{[3,4].forEach(g=>{const group=document.querySelector('.group[data-g="'+g+'"]');if(!group)return;group.querySelectorAll('.portiontag,.portionmini,.portionchoice').forEach(el=>el.remove());group.querySelectorAll('button').forEach(btn=>{const t=(btn.textContent||'').trim();if(t==='Az'||t==='Normal')btn.remove()})})}catch(e){}}

  function removeOld(){document.getElementById('krawOrderList')?.remove();}
  function closeModal(){document.getElementById('krawOrderOverlay')?.remove();manuallyClosed=true;}
  async function confirmOrder(){
    if(confirming||typeof saveSel!=='function')return;
    const btn=document.getElementById('krawOrderConfirmBtn');
    confirming=true;if(btn){btn.disabled=true;btn.textContent='⏳ Onaylanıyor...'}
    try{await saveSel();document.getElementById('krawOrderOverlay')?.remove();manuallyClosed=true}
    catch(e){if(btn){btn.disabled=false;btn.textContent='✓ Siparişi Onayla'};console.error('Sipariş onayı:',e)}
    finally{confirming=false}
  }
  window.krawConfirmOrder=confirmOrder;

  function draw(forceOpen=false){
    try{
      cleanPortionControls();removeOld();
      const nowReady=ready();
      if(!nowReady){document.getElementById('krawOrderOverlay')?.remove();wasReady=false;manuallyClosed=false;return null}
      ensureStyle();
      if(manuallyClosed&&!forceOpen&&wasReady)return null;
      let overlay=document.getElementById('krawOrderOverlay');
      if(!overlay){
        overlay=document.createElement('div');overlay.id='krawOrderOverlay';overlay.className='kraw-order-overlay';
        const card=document.createElement('div');card.className='kraw-order-card';
        const close=document.createElement('button');close.type='button';close.className='kraw-order-close';close.setAttribute('aria-label','Kapat');close.textContent='×';close.onclick=closeModal;
        card.appendChild(close);overlay.appendChild(card);document.body.appendChild(overlay);
      }
      const card=overlay.querySelector('.kraw-order-card');
      const closeBtn=card.querySelector('.kraw-order-close');
      const x=ids();
      card.innerHTML='';card.appendChild(closeBtn);
      card.insertAdjacentHTML('beforeend',`<div class="kraw-order-head"><h3>📋 Verdiğim Siparişler</h3><div class="kraw-order-user">👤 ${esc2(S.user.full_name)}</div></div>`+
        [1,2,3,4].map(g=>{const s2=window.D2?.[g];return `<div class="kraw-order-row"><div class="kraw-order-no">${g}</div><div><div class="kraw-order-meal">1. ${esc2(mealTitle(x[g]))}</div>${s2?`<div class="kraw-order-meal second">2. ${esc2(mealTitle(s2))}</div>`:''}<div class="kraw-order-label">${labels[g]}</div></div></div>`}).join('')+
        `<div class="kraw-order-actions"><button id="krawOrderConfirmBtn" class="kraw-order-confirm" type="button" onclick="krawConfirmOrder()">✓ Siparişi Onayla</button></div>`);
      if(!wasReady||forceOpen)manuallyClosed=false;
      wasReady=true;
      return overlay;
    }catch(e){console.error('Sipariş özeti:',e);return null}
  }

  document.addEventListener('click',e=>{try{const meal=e.target.closest('.meal');if(!meal)return;const g=Number(meal.closest('.group')?.dataset?.g||0);if(g===3||g===4)setTimeout(()=>{document.getElementById('portionModal')?.remove();cleanPortionControls()},0);if([1,2,3,4].includes(g)&&ready())setTimeout(()=>draw(true),120)}catch(err){}},true);

  function hookSave(){try{if(typeof closeSuccess==='function'&&!closeSuccess.__savedOrderHook){const originalClose=closeSuccess;closeSuccess=function(){originalClose();};closeSuccess.__savedOrderHook=true}}catch(e){}}

  setInterval(()=>{ensureStyle();hookSave();cleanPortionControls();draw(false)},300);
  setTimeout(()=>draw(false),180);
})();