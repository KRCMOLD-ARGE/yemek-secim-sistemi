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

  function ensureStableStyle(){
    if(document.getElementById('krawAdminStableChoiceStyle'))return;
    const s=document.createElement('style');s.id='krawAdminStableChoiceStyle';s.textContent=`
      #ov table td{vertical-align:top!important}
      #ov table td:nth-child(6),#ov table td:nth-child(7),#ov table td:nth-child(8),#ov table td:nth-child(9){min-height:96px!important}
      #ov table td .portionmini{display:block!important;margin-top:2px!important;margin-bottom:2px!important}
      [data-second-choice]{min-height:48px;display:block;position:relative;margin-top:6px!important}
      [data-second-choice] .kraw-second-label{display:block;font-size:11px;line-height:14px;color:#b77900;font-weight:900;margin-bottom:3px}
      [data-second-choice] .kraw-second-portion{display:block;font-size:11px;line-height:14px;color:#dc2626;font-weight:900;margin-top:3px;min-height:14px}
      [data-g4-cell]{min-width:130px}
    `;document.head.appendChild(s);
  }

  function meal4For(userId){return today4.find(x=>x.user_id===userId)?.group4_meal_id||null}
  function secondRow(userId){return todaySecond.find(x=>x.user_id===userId)||null}
  function secondFor(userId,g){const r=secondRow(userId);return r?.['group'+g+'_meal_id_2']||null}
  function portionCacheKey(userId){return 'kraw_admin_second_portion_'+(S?.today||'today')+'_'+userId}
  function secondPortionFor(userId){
    const r=secondRow(userId)||{};
    const raw=r.group1_portion_2||r.group1_portion_size_2||r.portion_size_group1_2||r.second_portion||null;
    if(raw){
      const val=String(raw).toLowerCase()==='az'?'Az':'Normal';
      try{localStorage.setItem(portionCacheKey(userId),val)}catch(e){}
      return val;
    }
    try{
      const cached=localStorage.getItem(portionCacheKey(userId));
      if(cached==='Az'||cached==='Normal')return cached;
    }catch(e){}
    return null;
  }

  function placeFirstPortionBeforeSecond(cell,wrap){
    if(!cell||!wrap)return;
    const p=[...cell.children].find(el=>el.classList?.contains('portionmini'));
    if(p&&p.nextElementSibling!==wrap)cell.insertBefore(p,wrap);
  }

  function patchSecondCells(table,ppl){
    if(!table)return;
    ensureStableStyle();
    const headers=[...table.querySelectorAll('tr:first-child th')];
    const g1=headers.findIndex(h=>(h.textContent||'').trim()==='1. Grup');
    const g3=headers.findIndex(h=>(h.textContent||'').trim()==='3. Grup');
    [...table.querySelectorAll('tr')].slice(1).forEach((tr,i)=>{
      if(!tr.querySelector('td'))return;
      const u=ppl[i];if(!u)return;
      const cells=[...tr.querySelectorAll('td')];
      [[g1,1],[g3,3]].forEach(([idx,g])=>{
        if(idx<0||!cells[idx])return;
        let wrap=cells[idx].querySelector('[data-second-choice="'+g+'"]');
        if(!wrap){
          wrap=document.createElement('div');
          wrap.dataset.secondChoice=String(g);
          cells[idx].appendChild(wrap);
        }
        if(g===1)placeFirstPortionBeforeSecond(cells[idx],wrap);
        const id=secondFor(u.id,g);
        if(!id){
          wrap.style.visibility='hidden';
          wrap.innerHTML='<span class="kraw-second-label">2. seçim</span><div style="height:22px"></div><span class="kraw-second-portion">&nbsp;</span>';
          return;
        }
        wrap.style.visibility='visible';
        const portion=g===1?secondPortionFor(u.id):null;
        const newHtml='<span class="kraw-second-label">2. seçim</span>'+mini(id)+(g===1?'<span class="kraw-second-portion">'+(portion||'&nbsp;')+'</span>':'');
        if(wrap.innerHTML!==newHtml)wrap.innerHTML=newHtml;
      });
    });
  }

  function patchAdmin(){
    if(typeof S==='undefined'||!S.user||S.user.role!=='admin')return;
    ensureStableStyle();
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
        const html=mini(meal4For(ppl[i]?.id));
        if(td.innerHTML!==html)td.innerHTML=html;
      });
      patchSecondCells(table,ppl);
    }
    const summary=panels.find(x=>x.querySelector('h2')?.textContent?.includes('Bugünkü Seçim Özeti'))?.querySelector('.summary');
    if(summary){
      const old=summary.querySelector('[data-admin-g4-summary]');
      const html=summaryBox4();
      if(old){if(old.outerHTML!==html)old.outerHTML=html}else{const box=document.createElement('div');box.innerHTML=html;summary.appendChild(box.firstElementChild)}
    }
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
    }catch(e){console.error('Admin ek seçimler:',e);patchAdmin();return false}
  }

  const oldRender=renderAdmin;
  renderAdmin=function(){oldRender();setTimeout(()=>{patchAdmin();refreshExtra()},0)};
  let tries=0,t=setInterval(async()=>{tries++;if(await refreshExtra()||tries>40)clearInterval(t)},150);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshExtra()});
})();