(function(){
  const G4API='https://uviroysnefifverluald.supabase.co/functions/v1/yemek-group4-api';
  let today4=[];
  async function g4api(action,p={}){const r=await fetch(G4API,{method:'POST',headers:{'content-type':'application/json','apikey':KEY,'x-session-token':token},body:JSON.stringify({action,...p})});const x=await r.json().catch(()=>({error:'4. grup bilgisi alınamadı'}));if(!r.ok)throw Error(x.error||'4. grup işlemi başarısız');return x}
  function meal4For(userId){return today4.find(x=>x.user_id===userId)?.group4_meal_id||null}
  function patchAdmin(){
    if(typeof S==='undefined'||!S.user||S.user.role!=='admin')return;
    const ov=document.getElementById('ov');if(!ov)return;
    const ppl=(S.users||[]).filter(u=>u.role==='personel');
    const panels=[...ov.querySelectorAll('.panel')];
    const status=panels.find(x=>x.querySelector('h2')?.textContent?.includes('Personel Seçim Durumu'));
    const table=status?.querySelector('table');
    if(table){
      const head=table.querySelector('tr');if(head&&!head.querySelector('[data-g4-head]')){const th=document.createElement('th');th.dataset.g4Head='1';th.textContent='4. Grup';head.appendChild(th)}
      [...table.querySelectorAll('tr')].slice(1).forEach((tr,i)=>{if(tr.querySelector('[data-g4-cell]'))return;const td=document.createElement('td');td.dataset.g4Cell='1';td.innerHTML=mini(meal4For(ppl[i]?.id));tr.appendChild(td)});
    }
    const old=document.getElementById('group4AdminPanel');if(old)old.remove();
    let summary=panels.find(x=>x.querySelector('h2')?.textContent?.includes('Bugünkü Seçim Özeti'))?.querySelector('.summary');
    if(summary&&!summary.querySelector('[data-admin-g4-summary]')){const box=document.createElement('div');box.dataset.adminG4Summary='1';box.innerHTML=summaryBox4();summary.appendChild(box.firstElementChild)}
  }
  function summaryBox4(){const counts={};today4.forEach(x=>{if(x.group4_meal_id)counts[x.group4_meal_id]=(counts[x.group4_meal_id]||0)+1});return '<div class="sum" data-admin-g4-summary="1"><h3>4. GRUP</h3><ul>'+(S.meals||[]).filter(m=>m.group_no===4).map(m=>'<li><span>'+mini(m.id)+'</span><b>'+(counts[m.id]||0)+' kişi</b></li>').join('')+'</ul></div>'}
  const oldRender=renderAdmin;renderAdmin=function(){oldRender();setTimeout(patchAdmin,0)};
  async function init(){if(typeof S==='undefined'||!S.user)return false;if(S.user.role!=='admin')return true;try{const q=await g4api('bootstrap');today4=q.today_group4||[];patchAdmin()}catch(e){console.error('Admin 4. grup:',e)}return true}
  let tries=0,t=setInterval(async()=>{tries++;if(await init()||tries>30)clearInterval(t)},120);
})();