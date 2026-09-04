(function(){
  if(window.__krawDoubleSelectLoaded)return;
  window.__krawDoubleSelectLoaded=true;

  const API='https://uviroysnefifverluald.supabase.co/functions/v1/yemek-double-api';
  window.D2=window.D2||{1:null,2:null,3:null,4:null};
  let booted=false,installed=false,savingSecond=false;

  async function api2(action,p={}){
    const r=await fetch(API,{method:'POST',headers:{'content-type':'application/json','apikey':KEY,'x-session-token':token},body:JSON.stringify({action,...p})});
    const x=await r.json().catch(()=>({error:'İkinci seçim bilgisi alınamadı'}));
    if(!r.ok)throw Error(x.error||'İkinci seçim işlemi başarısız');
    return x;
  }

  function ensureStyle(){
    if(document.getElementById('doubleSelectStyle'))return;
    const s=document.createElement('style');s.id='doubleSelectStyle';s.textContent=`
      .meal.double-second{outline:3px solid #f5b942!important;box-shadow:0 0 0 2px rgba(245,185,66,.2) inset}
      .meal.double-second .radio{border:5px solid #f5b942!important}
      .double-badge{position:absolute;top:8px;right:8px;background:#f5b942;color:#172033;border-radius:999px;padding:4px 7px;font-size:11px;font-weight:900;z-index:2;box-shadow:0 2px 8px #0005}
      .meal{position:relative}
      .double-note{font-size:12px;color:#b8cee4;margin-left:8px;font-weight:600}
    `;document.head.appendChild(s);
  }

  function mealEl(g,id){
    const group=document.querySelector('.group[data-g="'+g+'"]');
    if(!group)return null;
    return [...group.querySelectorAll('.meal')].find(el=>{
      const oc=el.getAttribute('onclick')||'';
      return oc.includes("'"+id+"'")||oc.includes('"'+id+'"');
    })||null;
  }

  function paint(){
    try{
      ensureStyle();
      [1,2,3,4].forEach(g=>{
        const group=document.querySelector('.group[data-g="'+g+'"]');
        if(!group)return;
        const h=group.querySelector('h3');
        if(h&&!h.querySelector('.double-note')){const n=document.createElement('span');n.className='double-note';n.textContent='En fazla 2 seçim';h.appendChild(n)}
        group.querySelectorAll('.meal').forEach(el=>{el.classList.remove('double-second');el.querySelectorAll('.double-badge').forEach(b=>b.remove())});
        const second=window.D2?.[g];
        if(second){const el=mealEl(g,second);if(el){el.classList.add('sel','double-second');const b=document.createElement('span');b.className='double-badge';b.textContent='2. seçim';el.appendChild(b)}}
      });
    }catch(e){console.error('İki seçim görünümü:',e)}
  }

  function renderAll(){try{renderPerson();setTimeout(paint,20)}catch(e){setTimeout(paint,20)}}

  function choose(g,id,basePick){
    g=Number(g);
    const first=P?.[g]||null,second=window.D2?.[g]||null;
    if(first===id){
      if(second){P[g]=second;window.D2[g]=null;renderAll()}
      return;
    }
    if(second===id){window.D2[g]=null;renderAll();return}
    if(!first){P[g]=id;renderAll();return}
    if(!second){
      if((g===1||g===2)&&typeof basePick==='function'){
        const keep=first;
        try{basePick(g,id)}catch(e){}
        P[g]=keep;
      }
      window.D2[g]=id;
      renderAll();
      return;
    }
    alert(g+'. grupta en fazla 2 yemek seçebilirsiniz. Önce seçili yemeklerden birini kaldırın.');
  }

  async function loadSecond(){
    if(booted||typeof S==='undefined'||!S.user||S.user.role!=='personel')return;
    try{const x=await api2('bootstrap');window.D2={1:x.second?.[1]||null,2:x.second?.[2]||null,3:x.second?.[3]||null,4:x.second?.[4]||null};booted=true;setTimeout(paint,50)}catch(e){console.error('İkinci seçim:',e)}
  }

  async function saveSecond(){
    if(savingSecond||typeof S==='undefined'||S.user?.role!=='personel')return;
    savingSecond=true;
    try{await api2('save',{group1_meal_id_2:window.D2[1]||null,group2_meal_id_2:window.D2[2]||null,group3_meal_id_2:window.D2[3]||null,group4_meal_id_2:window.D2[4]||null})}catch(e){console.error('İkinci seçim kaydı:',e);message('pm','İkinci seçimler kaydedilemedi: '+e.message,true)}finally{savingSecond=false}
  }

  function install(){
    if(installed||typeof pick!=='function'||typeof window.pick4!=='function'||typeof saveSel!=='function')return;
    const basePick=pick,basePick4=window.pick4,baseSave=saveSel;
    pick=function(g,id){choose(Number(g),id,basePick)};
    window.pick4=function(id){choose(4,id,basePick4)};
    saveSel=async function(){const r=await baseSave();setTimeout(saveSecond,250);return r};
    installed=true;
    setTimeout(paint,50);
  }

  setInterval(()=>{loadSecond();install();paint()},300);
})();
