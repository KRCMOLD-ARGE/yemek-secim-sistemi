(function(){
  if(window.__krawAdminDeleteOrderLoaded)return;
  window.__krawAdminDeleteOrderLoaded=true;
  const APIX='https://uviroysnefifverluald.supabase.co/functions/v1/yemek-admin-order-api';

  async function adminOrderApi(action,p={}){
    const r=await fetch(APIX,{method:'POST',headers:{'content-type':'application/json','apikey':KEY,'x-session-token':token},body:JSON.stringify({action,...p})});
    const x=await r.json().catch(()=>({error:'Admin sipariş işlemi başarısız'}));
    if(!r.ok)throw Error(x.error||'Admin sipariş işlemi başarısız');
    return x;
  }

  async function deleteOrder(userId,name){
    if(!confirm((name||'Bu personel')+' için bugünkü sipariş tamamen silinsin mi?'))return;
    try{
      await adminOrderApi('delete_person_order',{user_id:userId});
      await boot();
    }catch(e){alert(e.message)}
  }
  window.krawAdminDeleteOrder=deleteOrder;

  function patch(){
    if(typeof S==='undefined'||S.user?.role!=='admin')return;
    const ov=document.getElementById('ov');if(!ov)return;
    const status=[...ov.querySelectorAll('.panel')].find(x=>x.querySelector('h2')?.textContent?.includes('Personel Seçim Durumu'));
    const table=status?.querySelector('table');if(!table)return;
    const ppl=(S.users||[]).filter(u=>u.role==='personel');
    const today=S.todaySelections||[];
    const head=table.querySelector('tr');
    if(head&&!head.querySelector('[data-order-delete-head]')){const th=document.createElement('th');th.dataset.orderDeleteHead='1';th.textContent='İşlem';head.appendChild(th)}
    [...table.querySelectorAll('tr')].slice(1).forEach((tr,i)=>{
      let td=tr.querySelector('[data-order-delete-cell]');
      if(!td){td=document.createElement('td');td.dataset.orderDeleteCell='1';tr.appendChild(td)}
      const u=ppl[i],has=!!today.find(x=>x.user_id===u?.id);
      td.innerHTML=has&&u?'<button class="btn red" type="button">Siparişi Sil</button>':'';
      const b=td.querySelector('button');if(b)b.onclick=()=>deleteOrder(u.id,u.full_name);
    });
  }

  const oldRender=renderAdmin;
  renderAdmin=function(){oldRender();setTimeout(patch,0)};
  setTimeout(patch,120);
})();
