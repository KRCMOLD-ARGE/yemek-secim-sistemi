(function(){
  if(window.__krawAllMealsFixLoaded)return;
  window.__krawAllMealsFixLoaded=true;

  let allMeals=[];
  let loading=false;

  async function refreshAllMeals(){
    if(loading||typeof api!=='function'||typeof S==='undefined'||!S.user||S.user.role!=='personel')return;
    loading=true;
    try{
      const fresh=await api('bootstrap');
      if(Array.isArray(fresh?.meals)) allMeals=fresh.meals.filter(m=>m.active!==false);
    }catch(e){console.error('Tüm yemekler alınamadı:',e)}
    finally{loading=false}
  }

  function cardHtml(m){
    const selected=(typeof P!=='undefined'&&String(P[1]||'')===String(m.id));
    return `<div class="meal ${selected?'sel':''}" data-allmeal="1" data-meal-id="${esc(m.id)}" onclick="pick(1,'${esc(m.id)}')">${img(m)}<div class="cap"><span class="radio"></span><b>${esc(m.name)}</b></div></div>`;
  }

  function ensureAllVisible(){
    try{
      if(typeof S==='undefined'||S.user?.role!=='personel'||!allMeals.length)return;

      const known=new Map((S.meals||[]).map(m=>[String(m.id),m]));
      allMeals.forEach(m=>{if(!known.has(String(m.id)))(S.meals||[]).push(m)});

      const group=document.querySelector('.group[data-g="1"]');
      const grid=group?.querySelector('.grid');
      if(!grid)return;

      const existingIds=new Set();
      [...grid.querySelectorAll('.meal')].forEach(el=>{
        const oc=el.getAttribute('onclick')||'';
        const mm=oc.match(/['\"]([0-9a-fA-F-]{20,})['\"]/);
        if(mm?.[1])existingIds.add(mm[1]);
        const did=el.getAttribute('data-meal-id');if(did)existingIds.add(did);
      });

      allMeals.filter(m=>Number(m.group_no)===1).forEach(m=>{
        if(!existingIds.has(String(m.id)))grid.insertAdjacentHTML('beforeend',cardHtml(m));
      });
    }catch(e){console.error('Yemek görünümü düzeltilemedi:',e)}
  }

  setTimeout(refreshAllMeals,150);
  setInterval(()=>{refreshAllMeals();ensureAllVisible()},1200);
})();
