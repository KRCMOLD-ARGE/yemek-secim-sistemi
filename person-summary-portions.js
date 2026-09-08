(function(){
  if(window.__krawPersonSummaryPortionsLoaded)return;
  window.__krawPersonSummaryPortionsLoaded=true;

  const PORTION_API='https://uviroysnefifverluald.supabase.co/functions/v1/yemek-portion-api';
  window.__krawLivePortions=window.__krawLivePortions||{1:null,2:null};
  let apiPortions={1:null,2:null};

  function label(v){return String(v||'').toLowerCase()==='az'?'Az':'Normal'}
  function mealName(id){try{return (S?.meals||[]).find(m=>String(m.id)===String(id))?.name||''}catch(e){return ''}}

  async function loadApiPortions(){
    try{
      if(S?.user?.role!=='personel')return;
      const r=await fetch(PORTION_API,{method:'POST',headers:{'content-type':'application/json','apikey':KEY,'x-session-token':token},body:JSON.stringify({action:'bootstrap'})});
      const q=await r.json().catch(()=>null);if(!r.ok||!q)return;
      if(q.portions){apiPortions[1]=q.portions[1]?label(q.portions[1]):null;apiPortions[2]=q.portions[2]?label(q.portions[2]):null}
      if(Array.isArray(q.today_portions))S.today_portions=q.today_portions;
      patch();
    }catch(e){console.error('Porsiyon özeti bootstrap:',e)}
  }

  function savedPortion(g){
    try{
      const rows=S?.today_portions||[];
      const r=rows.find(x=>String(x.user_id)===String(S?.user?.id));
      if(!r)return null;
      const raw=g===1?r.portion_size:r.portion_size_group2;
      return raw?label(raw):null;
    }catch(e){return null}
  }
  function firstPortion(g){return window.__krawLivePortions[g]||apiPortions[g]||savedPortion(g)||null}
  function secondPortion(){
    try{
      if(window.D2Portion?.[1])return label(window.D2Portion[1]);
      const k='kraw_second_portion_'+(S?.user?.id||'user')+'_'+(S?.today||'today');
      const v=localStorage.getItem(k);return v?label(v):null;
    }catch(e){return null}
  }
  function ensureStyle(){
    if(document.getElementById('krawPersonSummaryPortionStyle'))return;
    const s=document.createElement('style');s.id='krawPersonSummaryPortionStyle';s.textContent=`
      #krawSideSummary .kraw-summary-portion{font-size:11px;font-weight:900;color:#ff6b6b;margin-top:2px;line-height:1.2}
      #krawSideSummary .kraw-summary-portion.second{color:#ffd36a}
    `;document.head.appendChild(s);
  }
  function patch(){
    try{
      if(S?.user?.role!=='personel')return;
      ensureStyle();
      const card=document.getElementById('krawSideSummary');if(!card)return;
      const rows=[...card.querySelectorAll('.kraw-side-row')];
      rows.forEach((row,i)=>{
        row.querySelectorAll('.kraw-summary-portion').forEach(x=>x.remove());
        const g=i+1;if(g!==1&&g!==2)return;
        const first=row.querySelector('.kraw-side-meal:not(.second)');
        const p1=firstPortion(g);
        if(first&&p1){const d=document.createElement('div');d.className='kraw-summary-portion';d.textContent=p1;first.insertAdjacentElement('afterend',d)}
        if(g===1){
          const second=row.querySelector('.kraw-side-meal.second');
          const p2=secondPortion();
          if(second&&p2){const d=document.createElement('div');d.className='kraw-summary-portion second';d.textContent=p2;second.insertAdjacentElement('afterend',d)}
        }
      });
    }catch(e){console.error('Personel özet porsiyon:',e)}
  }

  document.addEventListener('click',e=>{
    const pc=e.target.closest?.('.portionchoice');
    if(pc){
      const modal=pc.closest('.portionmodal');
      const txt=(modal?.querySelector('p')?.textContent||'').trim();
      const chosen=(pc.textContent||'').trim()==='Az'?'Az':'Normal';
      const g1=mealName(P?.[1]),g2=mealName(P?.[2]);
      if(g1&&txt.includes(g1))window.__krawLivePortions[1]=chosen;
      else if(g2&&txt.includes(g2))window.__krawLivePortions[2]=chosen;
      setTimeout(patch,50);
    }
    if(e.target.closest?.('.secondportionchoice'))setTimeout(patch,50);
    if(e.target.closest?.('#saveBtn,#krawOrderConfirmBtn,.kraw-final-confirm button'))setTimeout(loadApiPortions,350);
  },true);

  document.addEventListener('visibilitychange',()=>{if(!document.hidden)loadApiPortions()});
  setInterval(patch,1000);
  setInterval(loadApiPortions,5000);
  setTimeout(()=>{patch();loadApiPortions()},300);
})();