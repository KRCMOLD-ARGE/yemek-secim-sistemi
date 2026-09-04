const CACHE='kraw-yemek-v12';
const SHELL=['./','./index.html','./app.html','./manifest.webmanifest','./icon.svg','./kraw-wallpaper.png'];

function transformIndex(html){
  return html
    .replace('.portionmodalbg{position:fixed;inset:0;background:#07111dcc;display:grid;place-items:center;padding:18px;z-index:10050}', '.portionmodalbg{position:fixed;left:0;right:0;bottom:18px;display:flex;justify-content:center;align-items:flex-end;padding:0 14px;z-index:10050;pointer-events:none}')
    .replace('.portionmodal{width:min(420px,94vw);background:#fff;color:#172033;border-radius:18px;padding:24px;box-shadow:0 24px 80px #0007;text-align:center}', '.portionmodal{width:min(620px,96vw);background:rgba(12,33,57,.97);color:#fff;border:1px solid #35577a;border-radius:16px;padding:12px 14px;box-shadow:0 14px 40px #0008;text-align:left;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:12px;pointer-events:auto;backdrop-filter:blur(10px)}')
    .replace('.portionmodal h2{margin:0 0 8px;font-size:23px}.portionmodal p{margin:0 0 18px;color:#617083;line-height:1.45}', '.portionmodal h2{display:none}.portionmodal p{margin:0;color:#dbe8f5;line-height:1.35;font-size:14px}.portionmodal p b{color:#fff;font-size:16px}')
    .replace('.portionmodal .portionchoices{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}', '.portionmodal .portionchoices{display:flex;gap:8px;min-width:220px}')
    .replace('.portionmodal .portionchoice{border:1px solid #ccd5e0;background:#f7f9fc;color:#172033;border-radius:10px;padding:14px 8px;font-weight:800;cursor:pointer}', '.portionmodal .portionchoice{flex:1;border:1px solid #486789;background:#163657;color:#fff;border-radius:10px;padding:11px 16px;font-weight:800;cursor:pointer;min-width:95px}')
    .replace('.portionmodal .portionchoice.on{background:#2869dc;color:#fff;border-color:#2869dc}', '.portionmodal .portionchoice.on{background:#2b70dd;color:#fff;border-color:#6da0ff;box-shadow:0 0 0 2px #2b70dd55}')
    .replace('@media(max-width:900px){.person::before{background-size:235px 96px;background-position:center 12px;opacity:.20}.person .main{width:calc(100% - 24px)!important}}', '@media(max-width:900px){.person::before{background-size:235px 96px;background-position:center 12px;opacity:.20}.person .main{width:calc(100% - 24px)!important}.portionmodal{grid-template-columns:1fr;gap:8px}.portionmodal .portionchoices{width:100%;min-width:0}.portionmodalbg{bottom:10px;padding:0 10px}}');
}

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch',event=>{
  const req=event.request;
  const url=new URL(req.url);
  if(req.method!=='GET')return;
  if(url.hostname.includes('supabase.co'))return;

  if(req.mode==='navigate'){
    event.respondWith(
      fetch(req).then(async res=>{
        const text=await res.text();
        const transformed=transformIndex(text);
        const out=new Response(transformed,{status:res.status,statusText:res.statusText,headers:res.headers});
        const copy=out.clone();
        caches.open(CACHE).then(cache=>cache.put('./index.html',copy));
        return out;
      }).catch(()=>caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached=>{
      const network=fetch(req).then(res=>{
        if(res&&res.ok){
          const copy=res.clone();
          caches.open(CACHE).then(cache=>cache.put(req,copy));
        }
        return res;
      }).catch(()=>cached);
      return cached||network;
    })
  );
});
