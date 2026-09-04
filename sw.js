const CACHE='kraw-yemek-v36';
const SHELL=['./','./index.html','./app.html','./manifest.webmanifest','./icon.svg','./kraw-wallpaper.png','./order-list.js','./double-select.js','./all-meals-fix.js','./admin-group4.js','./group-tabs.js'];

self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)));self.skipWaiting();});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))));self.clients.claim();});
self.addEventListener('fetch',event=>{
  const req=event.request;if(req.method!=='GET')return;const url=new URL(req.url);if(url.hostname.includes('supabase.co'))return;

  if(url.pathname.endsWith('/app.html')){
    event.respondWith(fetch(req,{cache:'no-store'}).then(async res=>{
      let html=await res.text();
      const scripts=['order-list.js','double-select.js','all-meals-fix.js','admin-group4.js','group-tabs.js'];
      scripts.forEach(name=>{if(!html.includes(name))html=html.replace('</body>','<script src="./'+name+'?v=36"></script></body>')});
      return new Response(html,{status:res.status,statusText:res.statusText,headers:res.headers});
    }).catch(()=>caches.match('./app.html')));
    return;
  }

  const isIndex=url.pathname.endsWith('/index.html')||url.pathname.endsWith('/yemek-secim-sistemi/');
  if(isIndex){
    event.respondWith(fetch(req,{cache:'no-store'}).then(async res=>{
      let html=await res.text();
      html=html.replace('m.group_no!==1||allowed.includes(CAT[m.name])','m.group_no!==1||!CAT[m.name]||allowed.includes(CAT[m.name])');
      html=html.replace('src="app.html"','src="app.html?v=36"');
      const out=new Response(html,{status:res.status,statusText:res.statusText,headers:res.headers});
      if(res.ok){const copy=out.clone();caches.open(CACHE).then(cache=>cache.put(req,copy))}
      return out;
    }).catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));
    return;
  }

  if(req.mode==='navigate'){
    event.respondWith(fetch(req,{cache:'no-store'}).then(res=>{if(res&&res.ok){const copy=res.clone();caches.open(CACHE).then(cache=>cache.put(req,copy))}return res}).catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));
    return;
  }

  const fresh=['/order-list.js','/double-select.js','/all-meals-fix.js','/admin-group4.js','/group-tabs.js'].some(x=>url.pathname.endsWith(x));
  event.respondWith(fetch(req,{cache:fresh?'no-store':'default'}).then(res=>{if(res&&res.ok){const copy=res.clone();caches.open(CACHE).then(cache=>cache.put(req,copy))}return res}).catch(()=>caches.match(req)));
});