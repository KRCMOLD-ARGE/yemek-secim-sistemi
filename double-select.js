(function(){
  if(window.__krawLimitedDoubleSelectLoaded)return;
  window.__krawLimitedDoubleSelectLoaded=true;

  const API='https://uviroysnefifverluald.supabase.co/functions/v1/yemek-double-api';
  const DOUBLE_GROUPS=new Set([1,3]);
  window.D2=window.D2||{1:null,2:null,3:null,4:null};
  window.D2Portion=window.D2Portion||{1:'normal'};
  window.D2[2]=null;window.D2[4]=null;
  let installed=false,booted=false,basePick=null,paintQueued=false;

  async function api2(action,p={}){
    const r=await fetch(API,{method:'POST',headers:{'content-type':'application/json','apikey':KEY,'x-session-token':token},body:JSON.stringify({action,...p})});
    const x=await r.json().catch(()=>({error:'İkinci seçim bilgisi alınamadı'}));
    if(!r.ok)throw Error(x.error||'İkinci seçim işlemi başarısız');
    return x;
  }

  function notifyG3(){
    try{document.dispatchEvent(new CustomEvent('kraw-group3-selection-change'))}catch(e){}
  }

  function portionStorageKey(){
    try{return 'kraw_second_portion_'+(S?.user?.id||'user')+'_'+(S?.today||'today')}catch(e){return 'kraw_second_portion'}
  }
  function saveSecondPortionLocal(){try{localStorage.setItem(portionStorageKey(),window.D2Portion[1]||'normal')}catch(e){}}
  function loadSecondPortionLocal(){try{window.D2Portion[1]=localStorage.getItem(portionStorageKey())||'normal'}catch(e){window.D2Portion[1]='normal'}}

  function ensureStyle(){
    if(document.getElementById('limitedDoubleStyle'))return;
    const s=document.createElement('style');s.id='limitedDoubleStyle';s.textContent=`
      .meal.double-first{outline:3px solid #2d78ff!important;box-shadow:0 0 0 2px rgba(45,120,255,.20) inset}
      .meal.double-first .radio{border:5px solid #2d78ff!important}
      .meal.double-second{outline:3px solid #f5b942!important;box-shadow:0 0 0 2px rgba(245,185,66,.22) inset}
      .meal.double-second .radio{border:5px solid #f5b942!important}
      .double-badge{position:absolute;top:8px;right:8px;border-radius:999px;padding:4px 7px;font-size:11px;font-weight:900;z-index:2;box-shadow:0 2px 8px #0005}
      .double-badge.first{background:#2d78ff;color:#fff}
      .double-badge.second{background:#f5b942;color:#172033}
      .meal{position:relative}.double-note{font-size:12px;color:#b8cee4;margin-left:8px;font-weight:700}
      .secondportionbg{position:fixed;inset:0;background:#07111dcc;display:grid;place-items:center;padding:18px;z-index:15050}
      .secondportionbox{width:min(420px,94vw);background:#fff;color:#172033;border-radius:18px;padding:24px;box-shadow:0 24px 80px #0007;text-align:center}
      .secondportionbox h2{margin:0 0 8px;font-size:23px}.secondportionbox p{margin:0 0 18px;color:#617083;line-height:1.45}
      .secondportionchoices{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.secondportionchoice{border:1px solid #ccd5e0;background:#f7f9fc;color:#172033;border-radius:10px;padding:14px 8px;font-weight:800;cursor:pointer}.secondportionchoice.on{background:#2869dc;color:#fff;border-color:#2869dc}
    `;document.head.appendChild(s);
  }

  function extractId(meal){
    const oc=meal.getAttribute('onclick')||'';
    const m=oc.match(/['\"]([0-9a-fA-F-]{20,})['\"]/);
    return m?.[1]||null;
  }

  function findMeal(g,id){
    const group=document.querySelector('.group[data-g="'+g+'"]');if(!group)return null;
    return [...group.querySelectorAll('.meal')].find(el=>extractId(el)===String(id))||null;
  }

  function addBadge(el,text,type){
    if(!el)return;
    const b=document.createElement('span');b.className='double-badge '+type;b.textContent=text;el.appendChild(b);
  }

  async function saveSecondNow(){
    if(typeof S==='undefined'||S.user?.role!=='personel')return;
    saveSecondPortionLocal();
    try{
      await api2('save',{
        group1_meal_id_2:window.D2[1]||null,
        group2_meal_id_2:null,
        group3_meal_id_2:window.D2[3]||null,
        group4_meal_id_2:null,
        group1_portion_2:window.D2[1]?(window.D2Portion[1]||'normal'):null
      });
    }catch(e){
      console.warn('İkinci porsiyon sunucuya kaydedilemedi:',e);
    }
  }

  function askSecondPortion(mealName){
    ensureStyle();
    document.getElementById('secondPortionModal')?.remove();
    const bg=document.createElement('div');bg.id='secondPortionModal';bg.className='secondportionbg';
    bg.innerHTML=`<div class="secondportionbox"><h2>🍽️ Porsiyon Tercihi</h2><p><b>${String(mealName||'2. yemek').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}</b> için porsiyonunuz nasıl olsun?</p><div class="secondportionchoices"><button type="button" class="secondportionchoice ${window.D2Portion[1]==='az'?'on':''}" data-v="az">Az</button><button type="button" class="secondportionchoice ${window.D2Portion[1]!=='az'?'on':''}" data-v="normal">Normal</button></div></div>`;
    bg.querySelectorAll('.secondportionchoice').forEach(b=>b.onclick=async()=>{
      window.D2Portion[1]=b.dataset.v==='az'?'az':'normal';
      saveSecondPortionLocal();
      bg.remove();
      await saveSecondNow();
    });
    document.body.appendChild(bg);
  }

  function paintNow(){
    paintQueued=false;ensureStyle();
    [1,3].forEach(g=>{
      const group=document.querySelector('.group[data-g="'+g+'"]');if(!group)return;
      const h=group.querySelector('h3');
      if(h&&!h.querySelector('.double-note')){const n=document.createElement('span');n.className='double-note';n.textContent='En fazla 2 seçim';h.appendChild(n)}
      group.querySelectorAll('.meal.double-first,.meal.double-second').forEach(el=>el.classList.remove('double-first','double-second'));
      group.querySelectorAll('.double-badge').forEach(el=>el.remove());
      const first=P?.[g];
      if(first){const el=findMeal(g,first);if(el){el.classList.add('sel','double-first');addBadge(el,'1. seçim','first')}}
      const second=window.D2[g];
      if(second){const el=findMeal(g,second);if(el){el.classList.add('sel','double-second');addBadge(el,'2. seçim','second')}}
    });
    [2,4].forEach(g=>{const group=document.querySelector('.group[data-g="'+g+'"]');if(group)group.querySelectorAll('.double-note,.double-badge').forEach(el=>el.remove())});
  }
  function schedulePaint(){if(paintQueued)return;paintQueued=true;requestAnimationFrame(paintNow)}

  function redraw(){try{renderPerson()}catch(e){}schedulePaint()}

  function choose(g,id){
    g=Number(g);id=String(id);
    const first=P?.[g]?String(P[g]):null;
    const second=window.D2[g]?String(window.D2[g]):null;
    if(first===id){
      if(second){P[g]=second;window.D2[g]=null}else P[g]=null;
      redraw();
      if(g===3)setTimeout(notifyG3,10);
      return;
    }
    if(second===id){
      window.D2[g]=null;schedulePaint();saveSecondNow();
      if(g===3)setTimeout(notifyG3,10);
      return;
    }
    if(!first){
      basePick(g,id);setTimeout(schedulePaint,20);
      if(g===3)setTimeout(notifyG3,25);
      return;
    }
    if(!second){
      window.D2[g]=id;schedulePaint();
      if(g===1){const m=(S.meals||[]).find(x=>String(x.id)===id);setTimeout(()=>askSecondPortion(m?.name||'2. yemek'),20)}
      else {saveSecondNow();setTimeout(notifyG3,25)}
      return;
    }
    alert(g+'. grupta en fazla 2 yemek seçebilirsiniz. Değiştirmek istediğiniz seçime tekrar basarak önce kaldırın.');
  }

  function capture(e){
    const meal=e.target.closest?.('.meal');if(!meal)return;
    const group=meal.closest('.group[data-g]');if(!group)return;
    const g=Number(group.dataset.g||0);if(!DOUBLE_GROUPS.has(g))return;
    const id=extractId(meal);if(!id)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();choose(g,id);
  }

  async function load(){
    if(booted||typeof S==='undefined'||S.user?.role!=='personel')return;
    try{
      const x=await api2('bootstrap');
      window.D2[1]=x.second?.[1]||null;
      window.D2[3]=x.second?.[3]||null;
      window.D2[2]=null;window.D2[4]=null;
      const serverPortion=x.second?.group1_portion_2||x.group1_portion_2||null;
      if(serverPortion)window.D2Portion[1]=String(serverPortion).toLowerCase()==='az'?'az':'normal';
      else loadSecondPortionLocal();
      booted=true;schedulePaint();
    }catch(e){console.error('İkinci seçim:',e)}
  }

  window.krawSaveLimitedSecond=async function(){
    if(typeof S==='undefined'||S.user?.role!=='personel')return {ok:true};
    saveSecondPortionLocal();
    return api2('save',{
      group1_meal_id_2:window.D2[1]||null,
      group2_meal_id_2:null,
      group3_meal_id_2:window.D2[3]||null,
      group4_meal_id_2:null,
      group1_portion_2:window.D2[1]?(window.D2Portion[1]||'normal'):null
    });
  };

  function install(){
    if(installed||typeof pick!=='function')return;
    basePick=pick;document.addEventListener('click',capture,true);installed=true;schedulePaint();
  }

  let tries=0;const t=setInterval(async()=>{tries++;await load();install();if((booted&&installed)||tries>50)clearInterval(t)},100);
  document.addEventListener('click',e=>{const meal=e.target.closest?.('.meal');if(meal)setTimeout(schedulePaint,30)},true);
  setTimeout(schedulePaint,120);
})();