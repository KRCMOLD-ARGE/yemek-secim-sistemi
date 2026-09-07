(function(){
  const G4API='https://uviroysnefifverluald.supabase.co/functions/v1/yemek-group4-api';
  const DAPI='https://uviroysnefifverluald.supabase.co/functions/v1/yemek-double-api';
  let today4=[],todaySecond=[];

  async function post(url,action,p={}){
    const r=await fetch(url,{method:'POST',headers:{'content-type':'application/json','apikey':KEY,'x-session-token':token},body:JSON.stringify({action,...p})});
    const x=await r.json().catch(()=>({error:'Bilgi alınamadı'}));
    if(!r.ok)throw Error(x.error||'İşlem başarısız');
    return x;
  }
  const g4api=(action,p={})=>post(G4API,action,p);
  const dapi=(action,p={})=>post(DAPI,action,p);

  function meal4For(userId){return today4.find(x=>x.user_id===userId)?.group4_meal_id||null}
  function secondFor(userId,g){const r=todaySecond.find(x=>x.user_id===userId);return r?.['group'+g+'_meal_id_2']||null}
  function secondHtml(id){return id?'<div style="margin-top:5px;color:#b77900;font-weight:800"><span style="font-size:11px">2. seçim</span><br>'+mini(id)+'</div>':''}

  function patchSecondCells(table,ppl){
    if(!table)return;
    const headers=[...table.querySelectorAll('thead th, tr:first-child th')];
    const g1=headers.findIndex(h=>(h.textContent||'').trim()==='1. Grup');
    const g3=headers.findIndex(h=>(h.textContent||'').trim()==='3. Grup');
    [...table.querySelectorAll('tbody tr, tr')].filter(tr=>tr.querySelector('td')).forEach((tr,i)=>{
      const u=ppl[i];if(!u)return;
      const cells=[...tr.querySelectorAll('td')];
      [[g1,1],[g3,3]].forEach(([idx,g])=>{
        if(idx<0||!cells[idx])return;
        cells[idx].querySelector('[data-second-choice]')?.remove();
        const id=secondFor(u.id,g);
        if(id){const wrap=document.createElement('div');wrap.dataset.secondChoice='1';wrap.innerHTML=secondHtml(id);while(wrap.firstChild)cells[idx].appendChild(wrap.firstChild)}
      });
    });
  }

  function patchAdmin(){
    if(typeof S==='undefined'||!S.user||S.user.role!=='admin')return;
    const ov=document.getElementById('ov');if(!ov)return;
    const ppl=(S.users||[]).filter(u=>u.role==='personel');
    const panels=[...ov.querySelectorAll('.panel')];
    const status=panels.find(x=>x.querySelector('h2')?.textContent?.includes('Personel Seçim Durumu'));
    const table=status?.querySelector('table');
    if(table){
      const head=table.querySelector('tr');
      if(head&&!head.querySelector('[data-g4-head]')){const th=document.createElement('th');th.dataset.g4Head='1';th.textContent='4. Grup';head.appendChild(th)}
      [...table.querySelectorAll('tr')].slice(1).forEach((tr,i)=>{
        if(!tr.querySelector('td'))return;
        let td=tr.querySelector('[data-g4-cell]');
        if(!td){td=document.createElement('td');td.dataset.g4Cell='1';tr.appendChild(td)}
        td.innerHTML=mini(meal4For(ppl[i]?.id));
      });
      patchSecondCells(table,ppl);
    }
    const summary=panels.find(x=>x.querySelector('h2')?.textContent?.includes('Bugünkü Seçim Özeti'))?.querySelector('.summary');
    if(summary){summary.querySelector('[data-admin-g4-summary]')?.remove();const box=document.createElement('div');box.innerHTML=summaryBox4();summary.appendChild(box.firstElementChild)}
    document.getElementById('group4AdminPanel')?.remove();
  }

  function summaryBox4(){
    const counts={};today4.forEach(x=>{if(x.group4_meal_id)counts[x.group4_meal_id]=(counts[x.group4_meal_id]||0)+1});
    return '<div class="sum" data-admin-g4-summary="1"><h3>4. GRUP</h3><ul>'+(S.meals||[]).filter(m=>m.group_no===4).map(m=>'<li><span>'+mini(m.id)+'</span><b>'+(counts[m.id]||0)+' kişi</b></li>').join('')+'</ul></div>'
  }

  async function refreshExtra(){
    if(typeof S==='undefined'||!S.user||S.user.role!=='admin')return false;
    try{
      const [q4,qd]=await Promise.all([g4api('bootstrap'),dapi('bootstrap')]);
      today4=q4.today_group4||[];
      todaySecond=qd.today_second||[];
      patchAdmin();
      return true;
    }catch(e){console.error('Admin ek seçimler:',e);return false}
  }

  const oldRender=renderAdmin;
  renderAdmin=function(){oldRender();setTimeout(()=>{patchAdmin();refreshExtra()},0)};
  let tries=0,t=setInterval(async()=>{tries++;if(await refreshExtra()||tries>40)clearInterval(t)},150);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshExtra()});
})();