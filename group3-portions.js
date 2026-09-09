(function(){
  if(window.__krawGroup3PortionsLoaded)return;
  window.__krawGroup3PortionsLoaded=true;

  window.G3Portion=window.G3Portion||{1:null,2:null};
  let lastFirst=null,lastSecond=null,asking=false;

  function key(slot){
    try{return 'kraw_group3_portion_'+slot+'_'+(S?.user?.id||'user')+'_'+(S?.today||'today')}catch(e){return 'kraw_group3_portion_'+slot}
  }
  function load(){
    try{
      window.G3Portion[1]=localStorage.getItem(key(1))||window.G3Portion[1]||null;
      window.G3Portion[2]=localStorage.getItem(key(2))||window.G3Portion[2]||null;
    }catch(e){}
  }
  function save(slot,val){
    window.G3Portion[slot]=val;
    try{localStorage.setItem(key(slot),val)}catch(e){}
    document.dispatchEvent(new CustomEvent('kraw-group3-portion-change',{detail:{slot,value:val}}));
  }
  function mealName(id){try{return (S?.meals||[]).find(m=>String(m.id)===String(id))?.name||'3. grup seçimi'}catch(e){return '3. grup seçimi'}}
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function style(){
    if(document.getElementById('krawG3PortionStyle'))return;
    const s=document.createElement('style');s.id='krawG3PortionStyle';s.textContent=`
      .g3portionbg{position:fixed;inset:0;background:#07111dcc;display:grid;place-items:center;padding:18px;z-index:15100}
      .g3portionbox{width:min(420px,94vw);background:#fff;color:#172033;border-radius:18px;padding:24px;box-shadow:0 24px 80px #0007;text-align:center}
      .g3portionbox h2{margin:0 0 8px;font-size:23px}.g3portionbox p{margin:0 0 18px;color:#617083;line-height:1.45}
      .g3portionchoices{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
      .g3portionchoice{border:1px solid #ccd5e0;background:#f7f9fc;color:#172033;border-radius:10px;padding:14px 8px;font-weight:800;cursor:pointer}
      .g3portionchoice.on{background:#2869dc;color:#fff;border-color:#2869dc}
    `;document.head.appendChild(s);
  }
  function ask(slot,id){
    if(asking||!id)return;
    asking=true;style();
    document.getElementById('g3PortionModal')?.remove();
    const current=window.G3Portion[slot]||'normal';
    const bg=document.createElement('div');bg.id='g3PortionModal';bg.className='g3portionbg';
    bg.innerHTML=`<div class="g3portionbox"><h2>🍽️ Porsiyon Tercihi</h2><p><b>${esc(mealName(id))}</b> için porsiyonunuz nasıl olsun?</p><div class="g3portionchoices"><button type="button" class="g3portionchoice ${current==='az'?'on':''}" data-v="az">Az</button><button type="button" class="g3portionchoice ${current!=='az'?'on':''}" data-v="normal">Normal</button></div></div>`;
    bg.querySelectorAll('.g3portionchoice').forEach(b=>b.onclick=()=>{save(slot,b.dataset.v==='az'?'az':'normal');bg.remove();asking=false});
    document.body.appendChild(bg);
  }
  function syncAndAsk(){
    try{
      if(typeof S==='undefined'||S.user?.role!=='personel')return;
      load();
      const first=P?.[3]?String(P[3]):null;
      const second=window.D2?.[3]?String(window.D2[3]):null;
      if(first&&first!==lastFirst){lastFirst=first;window.G3Portion[1]=null;try{localStorage.removeItem(key(1))}catch(e){};setTimeout(()=>ask(1,first),20)}
      if(!first)lastFirst=null;
      if(second&&second!==lastSecond){lastSecond=second;window.G3Portion[2]=null;try{localStorage.removeItem(key(2))}catch(e){};setTimeout(()=>ask(2,second),40)}
      if(!second)lastSecond=null;
    }catch(e){console.error('3. grup porsiyon:',e)}
  }

  // 3. grup yemek kartına basılır basılmaz kontrol et; polling sadece yedek mekanizma.
  document.addEventListener('click',e=>{
    const meal=e.target.closest?.('.group[data-g="3"] .meal');
    if(meal)setTimeout(syncAndAsk,15);
  },true);
  document.addEventListener('kraw-group3-selection-change',()=>setTimeout(syncAndAsk,10));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)syncAndAsk()});

  load();
  setInterval(syncAndAsk,250);
  setTimeout(syncAndAsk,120);
})();