(function(){
  if(window.__krawAdminCompleteSelectionsLoaded)return;
  window.__krawAdminCompleteSelectionsLoaded=true;

  const G4API='https://uviroysnefifverluald.supabase.co/functions/v1/yemek-group4-api';
  const DAPI='https://uviroysnefifverluald.supabase.co/functions/v1/yemek-double-api';
  const PAPI='https://uviroysnefifverluald.supabase.co/functions/v1/yemek-portion-api';
  let g4Rows=[],secondRows=[],portionRows=[];

  async function post(url,action){
    const r=await fetch(url,{method:'POST',headers:{'content-type':'application/json','apikey':KEY,'x-session-token':token},body:JSON.stringify({action})});
    const x=await r.json().catch(()=>({}));
    if(!r.ok)throw Error(x.error||'Bilgi alınamadı');
    return x;
  }
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function meal(id){return (S.meals||[]).find(m=>String(m.id)===String(id))||null}
  function mealHtml(id,second=false){
    const m=meal(id);if(!m)return '';
    const img=m.image_url?'<img src="'+esc(m.image_url)+'" alt="">':'';
    return '<div class="kac-meal '+(second?'second':'')+'">'+img+'<span>'+esc(m.name)+'</span></div>';
  }
  function portionLabel(v){if(v==null||v==='')return '';return String(v).toLowerCase()==='az'?'Az':'Normal'}
  function portionFor(userId,g){
    const r=portionRows.find(x=>String(x.user_id)===String(userId))||{};
    const keys=g===1?['portion_size','group1_portion','portion_size_group1']:g===2?['portion_size_group2','group2_portion']:['group3_portion','portion_size_group3'];
    for(const k of keys){if(r[k])return portionLabel(r[k])}
    return '';
  }
  function secondRow(userId){return secondRows.find(x=>String(x.user_id)===String(userId))||{}}
  function secondId(userId,g){const r=secondRow(userId);return r['group'+g+'_meal_id_2']||null}
  function secondPortion(userId,g){
    const r=secondRow(userId);
    const keys=g===1?['group1_portion_2','group1_portion_size_2','portion_size_group1_2','second_portion']:g===3?['group3_portion_2','group3_portion_size_2','portion_size_group3_2']:[];
    for(const k of keys){if(r[k])return portionLabel(r[k])}
    return '';
  }
  function g4Id(userId){return g4Rows.find(x=>String(x.user_id)===String(userId))?.group4_meal_id||null}
  function portionHtml(v){return v?'<div class="kac-portion">'+esc(v)+'</div>':''}
  function style(){
    if(document.getElementById('kacStyle'))return;
    const s=document.createElement('style');s.id='kacStyle';s.textContent=`
      #ov .kac-meal{display:flex;align-items:center;gap:7px;min-height:34px;margin:2px 0;font-size:12px}
      #ov .kac-meal img{width:34px;height:34px;object-fit:cover;border-radius:7px;flex:0 0 34px}
      #ov .kac-meal.second{margin-top:7px;color:#a56b00;font-weight:800}
      #ov .kac-second-label{font-size:10px;font-weight:900;color:#b77900;margin-top:6px}
      #ov .kac-portion{font-size:11px;font-weight:900;color:#dc2626;margin:2px 0 3px 41px}
      #ov td[data-kac-group]{min-width:145px;vertical-align:top!important}
    `;document.head.appendChild(s);
  }
  function patch(){
    try{
      if(S?.user?.role!=='admin')return;
      style();
      const ov=document.getElementById('ov');if(!ov)return;
      const panels=[...ov.querySelectorAll('.panel')];
      const status=panels.find(x=>x.querySelector('h2')?.textContent?.includes('Personel Seçim Durumu'));
      const table=status?.querySelector('table');if(!table)return;
      const ppl=(S.users||[]).filter(u=>u.role==='personel');
      const today=S.todaySelections||[];
      const head=table.querySelector('tr');if(!head)return;
      const headers=[...head.querySelectorAll('th')];
      const idx={};[1,2,3,4].forEach(g=>idx[g]=headers.findIndex(h=>(h.textContent||'').trim()===g+'. Grup'));
      [...table.querySelectorAll('tr')].slice(1).forEach((tr,i)=>{
        const u=ppl[i];if(!u)return;
        const sel=today.find(x=>String(x.user_id)===String(u.id))||null;
        const cells=[...tr.querySelectorAll('td')];
        [1,2,3,4].forEach(g=>{
          const ci=idx[g];if(ci<0||!cells[ci])return;
          const td=cells[ci];td.dataset.kacGroup=String(g);
          if(!sel&&g!==4){td.innerHTML='';return}
          const firstId=g===4?g4Id(u.id):sel?.['group'+g+'_meal_id'];
          const second=(g===1||g===3)?secondId(u.id,g):null;
          const p1=(g===1||g===2||g===3)?portionFor(u.id,g):'';
          const p2=(g===1||g===3)?secondPortion(u.id,g):'';
          let html=mealHtml(firstId,false)+portionHtml(p1);
          if(second)html+='<div class="kac-second-label">2. seçim</div>'+mealHtml(second,true)+portionHtml(p2);
          td.innerHTML=html;
        });
      });
    }catch(e){console.error('Admin tam seçim görünümü:',e)}
  }
  async function refresh(){
    if(S?.user?.role!=='admin')return;
    const jobs=[
      post(G4API,'bootstrap').then(x=>{g4Rows=x.today_group4||[]}).catch(()=>{}),
      post(DAPI,'bootstrap').then(x=>{secondRows=x.today_second||x.second_rows||[]}).catch(()=>{}),
      post(PAPI,'bootstrap').then(x=>{portionRows=x.today_portions||x.portions_rows||[]}).catch(()=>{})
    ];
    await Promise.all(jobs);patch();
  }
  const oldRender=window.renderAdmin;
  if(typeof oldRender==='function')window.renderAdmin=function(){const r=oldRender.apply(this,arguments);setTimeout(refresh,0);return r};
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh()});
  setInterval(()=>{if(S?.user?.role==='admin')refresh()},5000);
  setTimeout(refresh,300);
})();