(function(){
  if(window.__krawModernAdminLoaded)return;
  window.__krawModernAdminLoaded=true;

  function addStyle(){
    if(document.getElementById('krawModernAdminStyle'))return;
    const s=document.createElement('style');s.id='krawModernAdminStyle';s.textContent=`
      #admin.kraw-modern-admin{background:#f4f7fb;min-height:calc(100vh - 64px);position:relative}
      #admin.kraw-modern-admin>.main{max-width:none;margin:0 0 0 220px;padding:18px 22px 34px}
      #admin.kraw-modern-admin>.main>h2,#admin.kraw-modern-admin .tabs{display:none!important}
      .kraw-admin-side{position:fixed;left:0;top:64px;bottom:0;width:220px;background:linear-gradient(180deg,#071a33,#0e2d53);color:#fff;padding:22px 14px;z-index:4;display:flex;flex-direction:column;box-shadow:8px 0 28px rgba(10,36,68,.08)}
      .kraw-admin-brand{text-align:center;padding:2px 8px 24px;border-bottom:1px solid rgba(255,255,255,.1);margin-bottom:16px}.kraw-admin-brand .chef{font-size:34px}.kraw-admin-brand b{display:block;font-size:27px;letter-spacing:5px;margin-top:4px}.kraw-admin-brand small{font-size:10px;letter-spacing:2px;opacity:.85}
      .kraw-admin-nav{display:grid;gap:7px}.kraw-admin-nav button{border:0;background:transparent;color:#e9f2ff;text-align:left;padding:12px 13px;border-radius:9px;font-weight:700;cursor:pointer;font-size:14px}.kraw-admin-nav button:hover,.kraw-admin-nav button.on{background:#2d5f9f;color:#fff}.kraw-admin-nav button span{display:inline-block;width:25px}
      .kraw-admin-user{margin-top:auto;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:13px}.kraw-admin-user .avatar{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:#3c7ee8;margin-bottom:8px}.kraw-admin-user b{display:block}.kraw-admin-user small{opacity:.75}
      .kraw-admin-topcard{background:#fff;border:1px solid #e5ebf2;border-radius:12px;padding:16px 18px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:12px;box-shadow:0 4px 18px rgba(23,49,78,.05)}
      .kraw-admin-date{display:flex;gap:11px;align-items:flex-start}.kraw-admin-date .ico{font-size:23px}.kraw-admin-date b{font-size:18px}.kraw-admin-date small{display:block;color:#738096;margin-top:3px}
      .kraw-admin-state{background:#e7f7ee;color:#176d43;border-radius:10px;padding:10px 13px;font-weight:800;white-space:nowrap}
      #admin.kraw-modern-admin .stats{grid-template-columns:repeat(5,minmax(0,1fr));gap:12px}
      #admin.kraw-modern-admin .stat{border:1px solid #e4eaf1;border-radius:12px;padding:15px 16px;box-shadow:0 4px 16px rgba(23,49,78,.04);min-height:92px}
      #admin.kraw-modern-admin .stat b{font-size:25px;color:#13253b}
      .kraw-admin-groups{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:14px 0}
      .kraw-admin-group{background:#fff;border:1px solid #e1e8f0;border-radius:13px;overflow:hidden;box-shadow:0 4px 18px rgba(23,49,78,.04)}
      .kraw-admin-group-head{padding:12px 14px;font-weight:900;font-size:16px;display:flex;align-items:center;justify-content:space-between}.kraw-admin-group-head small{font-weight:700;opacity:.7}
      .kraw-admin-group[data-g="1"] .kraw-admin-group-head{background:#fff0f0;color:#9a3030}.kraw-admin-group[data-g="2"] .kraw-admin-group-head{background:#fff5e8;color:#9a5a18}.kraw-admin-group[data-g="3"] .kraw-admin-group-head{background:#edf9ef;color:#276b3d}.kraw-admin-group[data-g="4"] .kraw-admin-group-head{background:#f3edff;color:#5d3b99}
      .kraw-admin-meals{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:9px;padding:10px}.kraw-admin-meal{border:1px solid #e3e8ef;border-radius:9px;overflow:hidden;background:#fff}.kraw-admin-meal img,.kraw-admin-meal .ph{width:100%;height:84px;object-fit:cover;background:#eef3f8;display:grid;place-items:center}.kraw-admin-meal b{display:block;padding:7px 8px 2px;font-size:12px;line-height:1.25}.kraw-admin-meal small{display:block;padding:0 8px 8px;color:#77859a;font-size:10px}
      #admin.kraw-modern-admin .panel{border:1px solid #e1e8f0;border-radius:12px;box-shadow:0 4px 18px rgba(23,49,78,.04);padding:16px}
      #admin.kraw-modern-admin table{background:#fff}.kraw-admin-title{font-size:20px;font-weight:900;color:#14263c;margin:5px 0 12px}
      @media(max-width:1100px){.kraw-admin-meals{grid-template-columns:repeat(3,1fr)}.kraw-admin-groups{grid-template-columns:1fr}}
      @media(max-width:800px){.kraw-admin-side{position:static;width:auto;min-height:0;display:block}.kraw-admin-brand{display:none}.kraw-admin-nav{grid-template-columns:repeat(2,1fr)}.kraw-admin-user{display:none}#admin.kraw-modern-admin>.main{margin-left:0;padding:12px}.kraw-admin-topcard{align-items:flex-start}.kraw-admin-state{font-size:12px}.kraw-admin-meals{grid-template-columns:repeat(2,1fr)}#admin.kraw-modern-admin .stats{grid-template-columns:1fr 1fr}}
    `;document.head.appendChild(s);
  }

  function navTo(id,btn){
    const oldTabs=[...document.querySelectorAll('#admin .tabs .tab')];
    const map={ov:0,people:1,meals:2,settings:3};
    const old=oldTabs[map[id]];
    if(typeof tab==='function'&&old)tab(id,old);else ['ov','people','meals','settings'].forEach(x=>document.getElementById(x)?.classList.toggle('hide',x!==id));
    document.querySelectorAll('.kraw-admin-nav button').forEach(b=>b.classList.toggle('on',b===btn));
  }

  function ensureShell(){
    const admin=document.getElementById('admin');if(!admin)return false;
    admin.classList.add('kraw-modern-admin');addStyle();
    if(!document.getElementById('krawAdminSide')){
      const side=document.createElement('aside');side.id='krawAdminSide';side.className='kraw-admin-side';
      side.innerHTML=`<div class="kraw-admin-brand"><div class="chef">👨‍🍳</div><b>KRAW</b><small>YEMEK SEÇİM SİSTEMİ</small></div><div class="kraw-admin-nav"><button class="on" data-target="ov"><span>⌂</span>Genel Bakış</button><button data-target="people"><span>👥</span>Personeller</button><button data-target="meals"><span>🍴</span>Yemekler</button><button data-target="settings"><span>⚙</span>Admin Ayarları</button></div><div class="kraw-admin-user"><div class="avatar">👤</div><small>Hoş geldin,</small><b>${(S?.user?.full_name||'Admin')}</b><small>Yönetici</small></div>`;
      side.querySelectorAll('button[data-target]').forEach(b=>b.onclick=()=>navTo(b.dataset.target,b));
      admin.prepend(side);
    }
    const main=admin.querySelector('.main');if(main&&!document.getElementById('krawAdminTop')){
      const top=document.createElement('div');top.id='krawAdminTop';top.className='kraw-admin-topcard';
      const d=S?.today?new Date(S.today+'T12:00:00'):new Date();
      const ds=d.toLocaleDateString('tr-TR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
      top.innerHTML=`<div class="kraw-admin-date"><div class="ico">🗓️</div><div><b>${ds}</b><small>Bugünkü yemek seçimlerini ve sistemi yönetin.</small></div></div><div class="kraw-admin-state">✓ Seçimler aktif</div>`;
      main.insertBefore(top,main.firstChild);
    }
    return true;
  }

  function mealCard(m){const pic=m.image_url?`<img loading="lazy" src="${String(m.image_url).replace(/"/g,'&quot;')}" onerror="this.outerHTML='<div class=ph>🍽️</div>'">`:'<div class="ph">🍽️</div>';return `<div class="kraw-admin-meal">${pic}<b>${String(m.name||'')}</b><small>${m.group_no}. grup</small></div>`}

  function addGroupOverview(){
    if(typeof S==='undefined'||S.user?.role!=='admin')return;
    const ov=document.getElementById('ov');if(!ov)return;
    ov.querySelector('#krawAdminGroups')?.remove();
    const stats=ov.querySelector('.stats');
    const wrap=document.createElement('div');wrap.id='krawAdminGroups';wrap.className='kraw-admin-groups';
    const names={1:'Ana Yemek',2:'Yan Yemek',3:'Yoğurt / Cacık / Salata',4:'Tatlı / Meyve'};
    for(let g=1;g<=4;g++){
      const meals=(S.meals||[]).filter(m=>Number(m.group_no)===g).slice(0,5);
      const box=document.createElement('section');box.className='kraw-admin-group';box.dataset.g=String(g);
      box.innerHTML=`<div class="kraw-admin-group-head"><span>${g}. Grup - ${names[g]}</span><small>${(S.meals||[]).filter(m=>Number(m.group_no)===g).length} yemek</small></div><div class="kraw-admin-meals">${meals.map(mealCard).join('')}</div>`;
      wrap.appendChild(box);
    }
    if(stats)stats.insertAdjacentElement('afterend',wrap);else ov.prepend(wrap);
  }

  function refresh(){if(!ensureShell())return;addGroupOverview()}
  let tries=0;const t=setInterval(()=>{tries++;try{if(typeof S!=='undefined'&&S.user?.role==='admin'){refresh();if(document.getElementById('ov')?.children.length)clearInterval(t)}}catch(e){}if(tries>50)clearInterval(t)},120);
  if(typeof renderAdmin==='function'){
    const old=renderAdmin;renderAdmin=function(){const r=old.apply(this,arguments);setTimeout(refresh,0);return r};
  }
  setTimeout(refresh,180);
})();