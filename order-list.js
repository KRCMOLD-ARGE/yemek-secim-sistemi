(function(){
  if(window.__krawOrderListLoaded)return;
  window.__krawOrderListLoaded=true;

  const labels={1:'Ana Yemek',2:'Yan Yemek',3:'Yoğurt / Cacık / Salata',4:'Tatlı / Meyve'};
  let confirming=false,manuallyClosed=false,lastSignature='';

  function esc2(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function mealTitle(id){try{return (S.meals||[]).find(m=>m.id===id)?.name||'-'}catch(e){return '-'}}
  function ids(){try{return {1:P?.[1]||null,2:P?.[2]||null,3:P?.[3]||null,4:P?.[4]||null}}catch(e){return {}}}
  function ready(){const x=ids();return !!(S?.user?.role==='personel'&&x[1]&&x[2]&&x[3]&&x[4])}
  function signature(){const x=ids();return [x[1]||'',window.D2?.[1]||'',x[2]||'',x[3]||'',window.D2?.[3]||'',x[4]||''].join('|')}

  function ensureStyle(){
    if(document.getElementById('krawOrderListStyle'))return;
    const s=document.createElement('style');s.id='krawOrderListStyle';s.textContent=`
      .kraw-order-overlay{position:fixed;inset:0;z-index:12000;background:rgba(4,13,24,.68);display:flex;align-items:center;justify-content:center;padding:18px;backdrop-filter:blur(2px)}
      .kraw-order-card{position:relative;width:min(760px,96vw);max-height:88vh;overflow:auto;background:#0d2139;border:1px solid #2a4d70;border-radius:18px;color:#eef5ff;box-shadow:0 28px 90px #0009}
      .kraw-order-close{position:absolute;top:12px;right:12px;width:40px;height:40px;border:0;border-radius:10px;background:#1a3855;color:#fff;font-size:27px;line-height:1;cursor:pointer;font-weight:700;z-index:2}
      .kraw-order-head{padding:20px 62px 16px 20px;background:#122b47;border-bottom:1px solid #2a4d70}.kraw-order-head h3{margin:0 0 6px;font-size:24px}.kraw-order-user{font-weight:800;color:#fff;font-size:18px}
      .kraw-order-row{display:grid;grid-template-columns:48px 1fr;gap:12px;align-items:center;padding:14px 18px;border-bottom:1px solid #203d59}
      .kraw-order-no{width:38px;height:38px;border-radius:10px;background:#183d64;display:grid;place-items:center;font-weight:900}
      .kraw-order-meal{font-weight:800;font-size:17px}.kraw-order-meal.second{color:#ffd36a;margin-top:4px}.kraw-order-label{font-size:13px;color:#9fb3c8;margin-top:3px}
      .kraw-order-hint,.kraw-order-ok{margin:12px 18px 0;padding:10px 12px;border-radius:9px;text-align:center}.kraw-order-hint{background:#173a5a;color:#dcecff}.kraw-order-ok{background:#0b5b46;border:1px solid #16745c;color:#d8fff0;font-weight:800}
      .kraw-order-actions{padding:14px 18px 18px}.kraw-order-confirm{width:100%;border:0;border-radius:11px;padding:14px 16px;background:#16965a;color:#fff;font-size:17px;font-weight:900;cursor:pointer}.kraw-order-confirm:disabled{opacity:.6;cursor:not-allowed}
      @media(max-width:600px){.kraw-order-card{width:96vw}.kraw-order-head h3{font-size:20px}.kraw-order-meal{font-size:15px}.kraw-order-user{font-size:16px}}
    `;document.head.appendChild(s);
  }

  function closeModal(){document.getElementById('krawOrderOverlay')?.remove();manuallyClosed=true;}

  function draw(force=false,saved=false){
    try{
      if(!ready()){document.getElementById('krawOrderOverlay')?.remove();lastSignature='';return}
      ensureStyle();
      const sig=signature();
      if(manuallyClosed&&!force)return;
      let overlay=document.getElementById('krawOrderOverlay');
      if(!overlay){overlay=document.createElement('div');overlay.id='krawOrderOverlay';overlay.className='kraw-order-overlay';overlay.innerHTML='<div class="kraw-order-card"></div>';document.body.appendChild(overlay)}
      const card=overlay.querySelector('.kraw-order-card');
      const x=ids();
      card.innerHTML=`<button type="button" class="kraw-order-close" aria-label="Kapat">×</button><div class="kraw-order-head"><h3>📋 Sipariş Listem</h3><div class="kraw-order-user">👤 ${esc2(S.user.full_name)}</div></div>`+
        [1,2,3,4].map(g=>{const s2=(g===1||g===3)?window.D2?.[g]:null;return `<div class="kraw-order-row"><div class="kraw-order-no">${g}</div><div><div class="kraw-order-meal">1. ${esc2(mealTitle(x[g]))}</div>${s2?`<div class="kraw-order-meal second">2. ${esc2(mealTitle(s2))}</div>`:''}<div class="kraw-order-label">${labels[g]}</div></div></div>`}).join('')+
        (saved?'<div class="kraw-order-ok">✅ Siparişiniz kaydedildi. İsterseniz seçimleri değiştirip tekrar onaylayabilirsiniz.</div>':'<div class="kraw-order-hint">Seçtiğiniz yemekleri kontrol edin.</div>')+
        `<div class="kraw-order-actions"><button id="krawOrderConfirmBtn" class="kraw-order-confirm" type="button">${S.ownSelection?'✓ Siparişi Güncelle':'✓ Siparişi Onayla'}</button></div>`;
      card.querySelector('.kraw-order-close').onclick=closeModal;
      card.querySelector('#krawOrderConfirmBtn').onclick=confirmOrder;
      lastSignature=sig;manuallyClosed=false;
    }catch(e){console.error('Sipariş listesi:',e)}
  }

  async function confirmOrder(){
    if(confirming||!ready())return;
    const btn=document.getElementById('krawOrderConfirmBtn')||document.getElementById('saveBtn');
    confirming=true;if(btn){btn.disabled=true;btn.textContent='⏳ Onaylanıyor...'}
    try{
      const x=ids();
      const result=await api('save_selection',{group1_meal_id:x[1],group2_meal_id:x[2],group3_meal_id:x[3]});
      if(!result?.ok)throw Error('Kayıt doğrulanamadı.');
      S.ownSelection=result.selection||S.ownSelection;
      if(typeof window.krawSaveLimitedSecond==='function')await window.krawSaveLimitedSecond();
      try{document.getElementById('pm').innerHTML=''}catch(e){}
      manuallyClosed=false;
      draw(true,true);
    }catch(e){
      try{message('pm','Sipariş kaydedilemedi: '+e.message,true)}catch(_){alert('Sipariş kaydedilemedi: '+e.message)}
    }finally{
      confirming=false;
      const b=document.getElementById('saveBtn');if(b){b.disabled=false;b.textContent='✓ Siparişi Onayla'}
    }
  }
  window.krawConfirmOrder=confirmOrder;

  // Sipariş listesi artık 4. grup seçimi sırasında otomatik açılmaz.
  // Personel 4. grubu seçtikten sonra ekrandaki "Siparişi Onayla" düğmesine basar;
  // kayıt başarılı olursa liste açılır.
})();