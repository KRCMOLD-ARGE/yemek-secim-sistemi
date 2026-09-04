(function(){
  if(window.__krawOrderListLoaded)return;
  window.__krawOrderListLoaded=true;

  const labels={1:'Ana Yemek',2:'Yan Yemek',3:'Yoğurt / Cacık / Salata',4:'Tatlı / Meyve'};
  function esc2(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function mealTitle(id){try{return (S.meals||[]).find(m=>m.id===id)?.name||'-'}catch(e){return '-'}}
  function ids(){try{return {1:P?.[1]||S.ownSelection?.group1_meal_id,2:P?.[2]||S.ownSelection?.group2_meal_id,3:P?.[3]||S.ownSelection?.group3_meal_id,4:P?.[4]||null}}catch(e){return {}}}
  function ready(){const x=ids();try{return !!(S?.user?.role==='personel'&&S.ownSelection&&x[1]&&x[2]&&x[3]&&x[4])}catch(e){return false}}

  function ensureStyle(){
    if(document.getElementById('krawOrderListStyle'))return;
    const s=document.createElement('style');s.id='krawOrderListStyle';s.textContent=`
      .kraw-order-list{margin:16px 0 26px;background:#0d2139;border:1px solid #2a4d70;border-radius:14px;overflow:hidden;color:#eef5ff;box-shadow:0 10px 28px #0003}
      .kraw-order-head{padding:14px 16px;background:#122b47;border-bottom:1px solid #2a4d70}.kraw-order-head h3{margin:0 0 4px;font-size:18px}.kraw-order-user{font-weight:800;color:#fff}
      .kraw-order-row{display:grid;grid-template-columns:44px 1fr;gap:10px;align-items:center;padding:12px 14px;border-bottom:1px solid #203d59}
      .kraw-order-no{width:34px;height:34px;border-radius:9px;background:#183d64;display:grid;place-items:center;font-weight:900}
      .kraw-order-meal{font-weight:800;font-size:15px}.kraw-order-label{font-size:12px;color:#9fb3c8;margin-top:2px}
      .kraw-order-done{margin:12px 14px 14px;padding:9px 12px;background:#0b5b46;border:1px solid #16745c;border-radius:9px;color:#d8fff0;font-weight:800;text-align:center}
    `;document.head.appendChild(s);
  }

  function draw(){
    try{
      const old=document.getElementById('krawOrderList');
      if(!ready()){if(old)old.remove();return}
      ensureStyle();
      const savebar=document.querySelector('.savebar');if(!savebar)return;
      let box=old;
      if(!box){box=document.createElement('div');box.id='krawOrderList';box.className='kraw-order-list';savebar.insertAdjacentElement('afterend',box)}
      const x=ids();
      box.innerHTML=`<div class="kraw-order-head"><h3>📋 Verdiğim Siparişler</h3><div class="kraw-order-user">👤 ${esc2(S.user.full_name)}</div></div>`+
        [1,2,3,4].map(g=>`<div class="kraw-order-row"><div class="kraw-order-no">${g}</div><div><div class="kraw-order-meal">${esc2(mealTitle(x[g]))}</div><div class="kraw-order-label">${labels[g]}</div></div></div>`).join('')+
        `<div class="kraw-order-done">✓ Siparişiniz kaydedildi</div>`;
    }catch(e){console.error('Sipariş listesi:',e)}
  }

  function hookSave(){
    try{
      if(typeof saveSel==='function'&&!saveSel.__savedOrderHook){
        const original=saveSel;
        saveSel=async function(){await original();setTimeout(draw,500)};
        saveSel.__savedOrderHook=true;
      }
    }catch(e){}
  }

  setInterval(()=>{hookSave();draw()},300);
  setTimeout(draw,150);
})();
