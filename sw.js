const CACHE='kraw-yemek-v17';
const SHELL=['./','./index.html','./app.html','./manifest.webmanifest','./icon.svg','./kraw-wallpaper.png'];

function transformApp(html){
  const addon=`
<style>
#myOrderList{background:#102943;border:1px solid #2a4d70;border-radius:12px;padding:14px;margin-top:12px;color:#eef5ff}
#myOrderList h3{margin:0 0 6px;font-size:18px}
#myOrderList .orderperson{font-weight:800;color:#fff;margin-bottom:10px}
#myOrderList ul{list-style:none;padding:0;margin:0}
#myOrderList li{display:flex;justify-content:space-between;gap:10px;padding:9px 0;border-top:1px solid #284765}
#myOrderList .ogroup{color:#9fb3c8;font-size:12px}
#myOrderList .omeal{font-weight:800;text-align:right}
#myOrderList .orderok{margin-top:10px;padding:7px 9px;border-radius:8px;background:#0b5b46;color:#d8fff0;font-size:12px;font-weight:800;text-align:center}
</style>
<script>
(function(){
  function mealNameLocal(id){
    try{return (S.meals||[]).find(m=>m.id===id)?.name||'-'}catch(e){return '-'}
  }
  function drawMyOrderList(){
    try{
      if(typeof S==='undefined'||!S.user||S.user.role!=='personel')return;
      const host=document.querySelector('.guestwrap');
      if(!host)return;
      let box=document.getElementById('myOrderList');
      const ready=typeof P!=='undefined'&&P[1]&&P[2]&&P[3]&&P[4]&&S.ownSelection;
      if(!ready){if(box)box.remove();return}
      if(!box){
        box=document.createElement('div');
        box.id='myOrderList';
        const guestList=document.getElementById('guestList');
        host.insertBefore(box,guestList||null);
      }
      box.innerHTML=
        '<h3>📋 Bugünkü Siparişim</h3>'+ 
        '<div class="orderperson">👤 '+esc(S.user.full_name)+'</div>'+ 
        '<ul>'+ 
        '<li><span class="ogroup">1. Grup<br>Ana Yemek</span><span class="omeal">'+esc(mealNameLocal(P[1]))+'</span></li>'+ 
        '<li><span class="ogroup">2. Grup<br>Yan Yemek</span><span class="omeal">'+esc(mealNameLocal(P[2]))+'</span></li>'+ 
        '<li><span class="ogroup">3. Grup</span><span class="omeal">'+esc(mealNameLocal(P[3]))+'</span></li>'+ 
        '<li><span class="ogroup">4. Grup</span><span class="omeal">'+esc(mealNameLocal(P[4]))+'</span></li>'+ 
        '</ul><div class="orderok">✓ Sipariş tamamlandı</div>';
    }catch(e){console.error('Sipariş listesi:',e)}
  }

  function attach(){
    try{
      if(typeof renderPerson==='function'&&!renderPerson.__orderWrapped){
        const rp=renderPerson;
        renderPerson=function(){rp();setTimeout(drawMyOrderList,40)};
        renderPerson.__orderWrapped=true;
      }
      if(typeof saveSel==='function'&&!saveSel.__orderWrapped){
        const ss=saveSel;
        saveSel=async function(){await ss();setTimeout(drawMyOrderList,300)};
        saveSel.__orderWrapped=true;
      }
      if(typeof pick==='function'&&!pick.__orderWrapped){
        const pk=pick;
        pick=function(g,id){pk(g,id);setTimeout(drawMyOrderList,40)};
        pick.__orderWrapped=true;
      }
      if(typeof window.pick4==='function'&&!window.pick4.__orderWrapped){
        const p4=window.pick4;
        window.pick4=function(id){p4(id);setTimeout(drawMyOrderList,40)};
        window.pick4.__orderWrapped=true;
      }
      drawMyOrderList();
    }catch(e){console.error(e)}
  }
  let n=0;
  const t=setInterval(()=>{n++;attach();if(n>120)clearInterval(t)},250);
})();
</script>`;
  return html.replace('</body>',addon+'</body>');
}

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET') return;

  const url=new URL(req.url);
  if(url.hostname.includes('supabase.co')) return;

  if(url.pathname.endsWith('/app.html')){
    event.respondWith(
      fetch(req,{cache:'no-store'})
        .then(async res=>{
          const text=await res.text();
          const transformed=transformApp(text);
          return new Response(transformed,{status:res.status,statusText:res.statusText,headers:res.headers});
        })
        .catch(()=>caches.match(req))
    );
    return;
  }

  if(req.mode==='navigate'){
    event.respondWith(
      fetch(req,{cache:'no-store'})
        .then(res=>{
          if(res&&res.ok){
            const copy=res.clone();
            caches.open(CACHE).then(cache=>cache.put(req,copy));
          }
          return res;
        })
        .catch(()=>caches.match(req).then(r=>r||caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    fetch(req)
      .then(res=>{
        if(res&&res.ok){
          const copy=res.clone();
          caches.open(CACHE).then(cache=>cache.put(req,copy));
        }
        return res;
      })
      .catch(()=>caches.match(req))
  );
});
