(function(){
  if(window.__krawGroupTabsLoaded)return;
  window.__krawGroupTabsLoaded=true;
  const LABELS={1:'Ana Yemek',2:'Yan Yemek',3:'Yoğurt / Cacık / Salata',4:'Tatlı / Meyve'};
  let activeGroup=1;

  function ensureStyle(){
    if(document.getElementById('krawGroupTabsStyle'))return;
    const s=document.createElement('style');s.id='krawGroupTabsStyle';s.textContent=`
      .kraw-group-tabs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:14px 0 10px;position:sticky;top:72px;z-index:20;background:#061427;padding:8px;border:1px solid #1d3c5e;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.18)}
      .kraw-group-tab{border:1px solid #315474;color:#fff;border-radius:9px;padding:10px 8px;font-weight:900;cursor:pointer;min-height:50px;display:flex;align-items:center;justify-content:center;gap:7px;text-align:center;transition:.18s ease;box-shadow:inset 0 0 0 1px rgba(255,255,255,.04)}
      .kraw-group-tab[data-g="1"]{background:linear-gradient(135deg,#173f72,#215b9e);border-color:#2f72bd}
      .kraw-group-tab[data-g="2"]{background:linear-gradient(135deg,#184f39,#25724f);border-color:#35946b}
      .kraw-group-tab[data-g="3"]{background:linear-gradient(135deg,#7b431b,#b45e20);border-color:#d47a32}
      .kraw-group-tab[data-g="4"]{background:linear-gradient(135deg,#4e327f,#7450ad);border-color:#916fd0}
      .kraw-group-tab[data-g="1"].on{background:linear-gradient(135deg,#2563eb,#1d4ed8);border-color:#60a5fa;box-shadow:0 0 0 2px rgba(96,165,250,.22)}
      .kraw-group-tab[data-g="2"].on{background:linear-gradient(135deg,#16a34a,#15803d);border-color:#4ade80;box-shadow:0 0 0 2px rgba(74,222,128,.22)}
      .kraw-group-tab[data-g="3"].on{background:linear-gradient(135deg,#f97316,#ea580c);border-color:#fb923c;box-shadow:0 0 0 2px rgba(251,146,60,.22)}
      .kraw-group-tab[data-g="4"].on{background:linear-gradient(135deg,#8b5cf6,#7c3aed);border-color:#a78bfa;box-shadow:0 0 0 2px rgba(167,139,250,.22)}
      .kraw-group-tab.done:not(.on){filter:saturate(1.15);box-shadow:inset 0 0 0 1px rgba(255,255,255,.12)}
      .kraw-group-tab .tick{display:none;color:#d9ffe8}.kraw-group-tab.done .tick{display:inline}
      #groups.kraw-tabbed>.group{display:none!important;margin-top:10px}#groups.kraw-tabbed>.group.kraw-active-group{display:block!important}
      .kraw-confirm-wrap{position:sticky;bottom:10px;z-index:18;margin-top:14px}.kraw-confirm-main{width:100%;border:0;border-radius:11px;padding:14px 16px;background:#16965a;color:#fff;font-size:17px;font-weight:900;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.28)}.kraw-confirm-main:hover{background:#12824d}
      @media(max-width:760px){.kraw-group-tabs{grid-template-columns:repeat(2,1fr);top:68px}.kraw-group-tab{font-size:13px;min-height:46px}.kraw-group-tab span.lbl{display:block}}
    `;document.head.appendChild(s);
  }

  function selected(g){try{return !!(P?.[g]||window.D2?.[g])}catch(e){return false}}
  function missingGroups(){const out=[];for(let g=1;g<=4;g++){if(!P?.[g])out.push(g)}return out}

  function setActive(g){activeGroup=Number(g)||1;paint()}
  window.krawSetMealGroup=setActive;

  function ensureTabs(){
    if(typeof S==='undefined'||S.user?.role!=='personel')return;
    const groups=document.getElementById('groups');if(!groups)return;
    let tabs=document.getElementById('krawGroupTabs');
    if(!tabs){tabs=document.createElement('div');tabs.id='krawGroupTabs';tabs.className='kraw-group-tabs';groups.parentNode.insertBefore(tabs,groups)}
    tabs.innerHTML=[1,2,3,4].map(g=>`<button type="button" class="kraw-group-tab" data-g="${g}" onclick="krawSetMealGroup(${g})"><span class="tick">✓</span><span class="lbl">${g}. Grup<br>${LABELS[g]}</span></button>`).join('');
    groups.classList.add('kraw-tabbed');
  }

  function paint(){
    ensureStyle();ensureTabs();
    const groups=document.getElementById('groups');if(!groups)return;
    [1,2,3,4].forEach(g=>{
      const el=groups.querySelector('.group[data-g="'+g+'"]');if(el)el.classList.toggle('kraw-active-group',g===activeGroup);
      const b=document.querySelector('#krawGroupTabs .kraw-group-tab[data-g="'+g+'"]');if(b){b.classList.toggle('on',g===activeGroup);b.classList.toggle('done',!!P?.[g])}
    });
    const save=document.getElementById('saveBtn');if(save){save.textContent='✓ Siparişi Onayla';save.onclick=window.krawValidateAndConfirm}
  }

  window.krawValidateAndConfirm=async function(){
    const miss=missingGroups();
    if(miss.length){
      const names=miss.map(g=>g+'. Grup ('+LABELS[g]+')');
      const text='Siparişi onaylamak için şu gruplardan seçim yapmalısınız: '+names.join(', ')+'.';
      try{message('pm',text,true)}catch(e){alert(text)}
      setActive(miss[0]);
      document.getElementById('krawGroupTabs')?.scrollIntoView({behavior:'smooth',block:'start'});
      return;
    }
    try{document.getElementById('pm').innerHTML=''}catch(e){}
    if(typeof window.krawConfirmOrder==='function')return window.krawConfirmOrder();
    if(typeof saveSel==='function')return saveSel();
  };

  document.addEventListener('click',e=>{
    const meal=e.target.closest?.('.meal');if(!meal)return;
    const g=Number(meal.closest('.group')?.dataset?.g||0);if(g>=1&&g<=4)setTimeout(paint,40);
  },true);

  let tries=0;const t=setInterval(()=>{tries++;try{if(typeof S!=='undefined'&&S.user?.role==='personel'){const miss=missingGroups();if(tries<4&&miss.length)activeGroup=miss[0];paint()}if(tries>200)clearInterval(t)}catch(e){}},250);
  setTimeout(paint,120);
})();