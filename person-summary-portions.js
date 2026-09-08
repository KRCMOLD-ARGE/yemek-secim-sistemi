(function(){
  if(window.__krawPersonSummaryPortionsLoaded)return;
  window.__krawPersonSummaryPortionsLoaded=true;

  window.__krawLivePortions=window.__krawLivePortions||{1:null,2:null};
  let pendingGroup=null;

  function label(v){return String(v||'').toLowerCase()==='az'?'Az':'Normal'}
  function savedPortion(g){
    try{
      const rows=S?.today_portions||[];
      const r=rows.find(x=>String(x.user_id)===String(S?.user?.id));
      if(!r)return null;
      const raw=g===1?r.portion_size:r.portion_size_group2;
      return raw?label(raw):null;
    }catch(e){return null}
  }
  function firstPortion(g){return window.__krawLivePortions[g]||savedPortion(g)||null}
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
    const meal=e.target.closest?.('.meal');
    if(meal){const g=Number(meal.closest('.group[data-g]')?.dataset?.g||0);if(g===1||g===2)pendingGroup=g}
    const pc=e.target.closest?.('.portionchoice');
    if(pc&&pendingGroup){window.__krawLivePortions[pendingGroup]=(pc.textContent||'').trim()==='Az'?'Az':'Normal';setTimeout(patch,80)}
    const sp=e.target.closest?.('.secondportionchoice');
    if(sp){setTimeout(patch,80)}
    if(e.target.closest?.('#saveBtn,#krawOrderConfirmBtn,.kraw-final-confirm button'))setTimeout(patch,250);
  },true);

  document.addEventListener('visibilitychange',()=>{if(!document.hidden)patch()});
  setInterval(patch,1800);
  setTimeout(patch,350);
})();