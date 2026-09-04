const CACHE='kraw-yemek-v14';
const SHELL=['./','./index.html','./app.html','./manifest.webmanifest','./icon.svg','./kraw-wallpaper.png'];

function transformIndex(html){
  let out=html
    .replace('.portionmodalbg{position:fixed;inset:0;background:#07111dcc;display:grid;place-items:center;padding:18px;z-index:10050}', '.portionmodalbg{position:fixed;z-index:10050;pointer-events:none}')
    .replace('.portionmodal{width:min(420px,94vw);background:#fff;color:#172033;border-radius:18px;padding:24px;box-shadow:0 24px 80px #0007;text-align:center}', '.portionmodal{width:230px;background:rgba(8,25,45,.97);color:#fff;border:1px solid #4c6f94;border-radius:14px;padding:10px;box-shadow:0 12px 32px #0009;text-align:center;pointer-events:auto;backdrop-filter:blur(8px)}')
    .replace('.portionmodal h2{margin:0 0 8px;font-size:23px}.portionmodal p{margin:0 0 18px;color:#617083;line-height:1.45}', '.portionmodal h2{display:none}.portionmodal p{margin:0 0 8px;color:#dbe8f5;line-height:1.25;font-size:12px}.portionmodal p b{display:block;color:#fff;font-size:14px;margin-bottom:2px}')
    .replace('.portionmodal .portionchoices{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}', '.portionmodal .portionchoices{display:grid;grid-template-columns:1fr 1fr;gap:6px}')
    .replace('.portionmodal .portionchoice{border:1px solid #ccd5e0;background:#f7f9fc;color:#172033;border-radius:10px;padding:14px 8px;font-weight:800;cursor:pointer}', '.portionmodal .portionchoice{border:1px solid #496989;background:#163657;color:#fff;border-radius:8px;padding:9px 6px;font-weight:800;cursor:pointer;font-size:13px}')
    .replace('.portionmodal .portionchoice.on{background:#2869dc;color:#fff;border-color:#2869dc}', '.portionmodal .portionchoice.on{background:#2b70dd;color:#fff;border-color:#7aa8ff;box-shadow:0 0 0 2px #2b70dd44}')
    .replace("function askPortion(groupNo,mealName){const old=document.getElementById('portionModal');if(old)old.remove();const bg=document.createElement('div');bg.id='portionModal';bg.className='portionmodalbg';const box=document.createElement('div');box.className='portionmodal';const h=document.createElement('h2');h.textContent='🍽️ Porsiyon Tercihi';const p=document.createElement('p');p.innerHTML='<b>'+esc(mealName||GLABEL[groupNo])+'</b> için porsiyonunuz nasıl olsun?';const choices=document.createElement('div');choices.className='portionchoices';['az','normal'].forEach(v=>{const b=document.createElement('button');b.type='button';b.className='portionchoice'+(portionChoices[groupNo]===v?' on':'');b.textContent=PLABEL[v];b.addEventListener('click',()=>{portionChoices[groupNo]=v;bg.remove()});choices.appendChild(b)});box.append(h,p,choices);bg.appendChild(box);document.body.appendChild(bg)}", "function askPortion(groupNo,mealName){const old=document.getElementById('portionModal');if(old)old.remove();const anchor=document.querySelector('.group[data-g=\\\"'+groupNo+'\\\"] .meal.sel');const bg=document.createElement('div');bg.id='portionModal';bg.className='portionmodalbg';const box=document.createElement('div');box.className='portionmodal';const h=document.createElement('h2');h.textContent='Porsiyon';const p=document.createElement('p');p.innerHTML='<b>'+esc(mealName||GLABEL[groupNo])+'</b>Az mı, normal mi?';const choices=document.createElement('div');choices.className='portionchoices';['az','normal'].forEach(v=>{const b=document.createElement('button');b.type='button';b.className='portionchoice'+(portionChoices[groupNo]===v?' on':'');b.textContent=PLABEL[v];b.addEventListener('click',()=>{portionChoices[groupNo]=v;bg.remove()});choices.appendChild(b)});box.append(h,p,choices);bg.appendChild(box);document.body.appendChild(bg);requestAnimationFrame(()=>{if(!anchor)return;const r=anchor.getBoundingClientRect();const bw=bg.offsetWidth||230;const bh=bg.offsetHeight||96;let left=r.left+(r.width-bw)/2;let top=r.top+(r.height-bh)/2;left=Math.max(8,Math.min(left,window.innerWidth-bw-8));top=Math.max(8,Math.min(top,window.innerHeight-bh-8));bg.style.left=left+'px';bg.style.top=top+'px'})}")
    .replace('@media(max-width:900px){.person::before{background-size:235px 96px;background-position:center 12px;opacity:.20}.person .main{width:calc(100% - 24px)!important}}', '@media(max-width:900px){.person::before{background-size:235px 96px;background-position:center 12px;opacity:.20}.person .main{width:calc(100% - 24px)!important}.portionmodal{width:200px;padding:8px}.portionmodal .portionchoice{padding:8px 5px}}');

  const summaryAddon=`<script>
(function(){
  const frame=document.getElementById('appFrame');
  function installOrderSummary(){
    try{
      const d=frame.contentDocument;
      if(!d||d.getElementById('ownOrderSummaryInstaller'))return;
      const marker=d.createElement('div');marker.id='ownOrderSummaryInstaller';marker.style.display='none';d.body.appendChild(marker);
      const st=d.createElement('style');
      st.textContent='.ownorder{background:#102943;border:1px solid #2a4d70;border-radius:12px;padding:14px;margin-top:12px;color:#eef5ff}.ownorder h3{margin:0 0 5px;font-size:17px}.ownorder .owner{font-size:15px;font-weight:800;color:#fff;margin-bottom:10px}.ownorder .orow{display:grid;grid-template-columns:34px 1fr;gap:9px;align-items:center;padding:8px 0;border-top:1px solid #284765}.ownorder .onum{width:30px;height:30px;border-radius:8px;background:#183d64;display:grid;place-items:center;font-weight:900}.ownorder .omeal{font-weight:800}.ownorder .olabel{font-size:11px;color:#9fb3c8;margin-top:2px}.ownorder .done{display:inline-block;margin-top:8px;padding:5px 9px;border-radius:999px;background:#0b5b46;color:#d8fff0;font-size:12px;font-weight:800}';
      d.head.appendChild(st);
      const sc=d.createElement('script');
      sc.textContent=`(function(){
        function ownMealName(id){try{return (S.meals||[]).find(m=>m.id===id)?.name||''}catch(e){return ''}}
        function drawOwnOrder(){
          try{
            if(typeof S==='undefined'||!S.user||S.user.role!=='personel')return;
            const host=document.querySelector('.guestwrap');if(!host)return;
            let card=document.getElementById('ownOrderCard');
            const ready=!!(P&&P[1]&&P[2]&&P[3]&&P[4]);
            if(!ready){if(card)card.remove();return}
            if(!card){card=document.createElement('div');card.id='ownOrderCard';card.className='ownorder';const list=document.getElementById('guestList');host.insertBefore(card,list||null)}
            const labels={1:'Ana Yemek',2:'Yan Yemek',3:'Yoğurt / Cacık / Salata',4:'Tatlı / Meyve'};
            card.innerHTML='<h3>🍽️ Bugünkü Siparişim</h3><div class="owner">👤 '+esc(S.user.full_name)+'</div>'+[1,2,3,4].map(g=>'<div class="orow"><div class="onum">'+g+'</div><div><div class="omeal">'+esc(ownMealName(P[g]))+'</div><div class="olabel">'+labels[g]+'</div></div></div>').join('')+'<span class="done">✓ Seçimler tamamlandı</span>';
          }catch(e){console.error('Sipariş özeti:',e)}
        }
        const _renderPerson=renderPerson;renderPerson=function(){_renderPerson();setTimeout(drawOwnOrder,30)};
        const _pick=pick;pick=function(g,id){_pick(g,id);setTimeout(drawOwnOrder,30)};
        if(typeof window.pick4==='function'){const _pick4=window.pick4;window.pick4=function(id){_pick4(id);setTimeout(drawOwnOrder,30)}}
        if(typeof saveSel==='function'){const _saveSel=saveSel;saveSel=async function(){await _saveSel();setTimeout(drawOwnOrder,50)}}
        let n=0;const t=setInterval(()=>{n++;drawOwnOrder();if(n>80)clearInterval(t)},250);
      })();`;
      d.body.appendChild(sc);
    }catch(e){console.error(e)}
  }
  frame.addEventListener('load',()=>setTimeout(installOrderSummary,50));
  setTimeout(installOrderSummary,300);
})();
<\/script>`;
  out=out.replace('</body>',summaryAddon+'</body>');
  return out;
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
