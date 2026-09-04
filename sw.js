const CACHE='kraw-yemek-v19';
const SHELL=['./','./index.html','./app.html','./manifest.webmanifest','./icon.svg','./kraw-wallpaper.png','./order-list.js'];

self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)));self.skipWaiting();});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))));self.clients.claim();});
self.addEventListener('fetch',event=>{
  const req=event.request;if(req.method!=='GET')return;const url=new URL(req.url);if(url.hostname.includes('supabase.co'))return;
  if(url.pathname.endsWith('/app.html')){event.respondWith(fetch(req,{cache:'no-store'}).then(async res=>{let html=await res.text();if(!html.includes('order-list.js'))html=html.replace('</body>','<script src="./order-list.js"></script></body>');return new Response(html,{status:res.status,statusText:res.statusText,headers:res.headers})}).catch(()=>caches.match('./app.html')));return;}
  if(req.mode==='navigate'){event.respondWith(fetch(req,{cache:'no-store'}).then(res=>{if(res&&res.ok){const copy=res.clone();caches.open(CACHE).then(cache=>cache.put(req,copy))}return res}).catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));return;}
  event.respondWith(fetch(req).then(res=>{if(res&&res.ok){const copy=res.clone();caches.open(CACHE).then(cache=>cache.put(req,copy))}return res}).catch(()=>caches.match(req)));
});
