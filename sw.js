const CACHE='kraw-yemek-v13';
const SHELL=['./','./index.html','./app.html','./manifest.webmanifest','./icon.svg','./kraw-wallpaper.png'];

function transformIndex(html){
  return html
    .replace('.portionmodalbg{position:fixed;inset:0;background:#07111dcc;display:grid;place-items:center;padding:18px;z-index:10050}', '.portionmodalbg{position:fixed;z-index:10050;pointer-events:none}')
    .replace('.portionmodal{width:min(420px,94vw);background:#fff;color:#172033;border-radius:18px;padding:24px;box-shadow:0 24px 80px #0007;text-align:center}', '.portionmodal{width:230px;background:rgba(8,25,45,.97);color:#fff;border:1px solid #4c6f94;border-radius:14px;padding:10px;box-shadow:0 12px 32px #0009;text-align:center;pointer-events:auto;backdrop-filter:blur(8px)}')
    .replace('.portionmodal h2{margin:0 0 8px;font-size:23px}.portionmodal p{margin:0 0 18px;color:#617083;line-height:1.45}', '.portionmodal h2{display:none}.portionmodal p{margin:0 0 8px;color:#dbe8f5;line-height:1.25;font-size:12px}.portionmodal p b{display:block;color:#fff;font-size:14px;margin-bottom:2px}')
    .replace('.portionmodal .portionchoices{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}', '.portionmodal .portionchoices{display:grid;grid-template-columns:1fr 1fr;gap:6px}')
    .replace('.portionmodal .portionchoice{border:1px solid #ccd5e0;background:#f7f9fc;color:#172033;border-radius:10px;padding:14px 8px;font-weight:800;cursor:pointer}', '.portionmodal .portionchoice{border:1px solid #496989;background:#163657;color:#fff;border-radius:8px;padding:9px 6px;font-weight:800;cursor:pointer;font-size:13px}')
    .replace('.portionmodal .portionchoice.on{background:#2869dc;color:#fff;border-color:#2869dc}', '.portionmodal .portionchoice.on{background:#2b70dd;color:#fff;border-color:#7aa8ff;box-shadow:0 0 0 2px #2b70dd44}')
    .replace("function askPortion(groupNo,mealName){const old=document.getElementById('portionModal');if(old)old.remove();const bg=document.createElement('div');bg.id='portionModal';bg.className='portionmodalbg';const box=document.createElement('div');box.className='portionmodal';const h=document.createElement('h2');h.textContent='🍽️ Porsiyon Tercihi';const p=document.createElement('p');p.innerHTML='<b>'+esc(mealName||GLABEL[groupNo])+'</b> için porsiyonunuz nasıl olsun?';const choices=document.createElement('div');choices.className='portionchoices';['az','normal'].forEach(v=>{const b=document.createElement('button');b.type='button';b.className='portionchoice'+(portionChoices[groupNo]===v?' on':'');b.textContent=PLABEL[v];b.addEventListener('click',()=>{portionChoices[groupNo]=v;bg.remove()});choices.appendChild(b)});box.append(h,p,choices);bg.appendChild(box);document.body.appendChild(bg)}", "function askPortion(groupNo,mealName){const old=document.getElementById('portionModal');if(old)old.remove();const anchor=document.querySelector('.group[data-g=\\\"'+groupNo+'\\\"] .meal.sel');const bg=document.createElement('div');bg.id='portionModal';bg.className='portionmodalbg';const box=document.createElement('div');box.className='portionmodal';const h=document.createElement('h2');h.textContent='Porsiyon';const p=document.createElement('p');p.innerHTML='<b>'+esc(mealName||GLABEL[groupNo])+'</b>Az mı, normal mi?';const choices=document.createElement('div');choices.className='portionchoices';['az','normal'].forEach(v=>{const b=document.createElement('button');b.type='button';b.className='portionchoice'+(portionChoices[groupNo]===v?' on':'');b.textContent=PLABEL[v];b.addEventListener('click',()=>{portionChoices[groupNo]=v;bg.remove()});choices.appendChild(b)});box.append(h,p,choices);bg.appendChild(box);document.body.appendChild(bg);requestAnimationFrame(()=>{if(!anchor)return;const r=anchor.getBoundingClientRect();const bw=bg.offsetWidth||230;const bh=bg.offsetHeight||96;let left=r.left+(r.width-bw)/2;let top=r.top+(r.height-bh)/2;left=Math.max(8,Math.min(left,window.innerWidth-bw-8));top=Math.max(8,Math.min(top,window.innerHeight-bh-8));bg.style.left=left+'px';bg.style.top=top+'px'})}")
    .replace('@media(max-width:900px){.person::before{background-size:235px 96px;background-position:center 12px;opacity:.20}.person .main{width:calc(100% - 24px)!important}}', '@media(max-width:900px){.person::before{background-size:235px 96px;background-position:center 12px;opacity:.20}.person .main{width:calc(100% - 24px)!important}.portionmodal{width:200px;padding:8px}.portionmodal .portionchoice{padding:8px 5px}}');
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
