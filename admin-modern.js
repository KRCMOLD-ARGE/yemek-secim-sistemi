(function(){
  if(window.__krawModernAdminV3)return;
  window.__krawModernAdminV3=true;

  const NAMES={1:'Ana Yemek',2:'Yan Yemek',3:'Yoğurt / Cacık / Salata',4:'Tatlı / Meyve'};

  function cleanupAdminShell(){
    try{
      if(S?.user?.role==='admin')return;
      document.body.classList.remove('kraw-admin-mode');
      document.getElementById('kaSide')?.remove();
      document.getElementById('kaHead')?.remove();
      document.getElementById('kaSectionTitle')?.remove();
      document.getElementById('admin')?.classList.remove('kraw-admin-v2');
      const main=document.querySelector('#admin>.main');
      if(main){main.style.marginLeft='';main.style.padding=''}
      const personMain=document.querySelector('#person .main');
      if(personMain){personMain.style.marginLeft='';personMain.style.paddingLeft='';personMain.style.width=''}
    }catch(e){}
  }

  function css(){
    if(document.getElementById('krawAdminV3Style'))return;
    const s=document.createElement('style');s.id='krawAdminV3Style';s.textContent=`
      body.kraw-admin-mode{background:#f4f7fb!important;overflow-x:hidden}
      body.kraw-admin-mode #app>.top{display:none!important}
      #admin.kraw-admin-v2{display:block!important;min-height:100vh;background:#f4f7fb!important;color:#14243a}
      #admin.kraw-admin-v2>.main{max-width:none!important;margin:0 0 0 228px!important;padding:18px 22px 36px!important}
      #admin.kraw-admin-v2>.main>h2,#admin.kraw-admin-v2>.main>.tabs{display:none!important}
      .ka-side{position:fixed;z-index:50;left:0;top:0;bottom:0;width:228px;padding:24px 14px 16px;background:linear-gradient(180deg,#081b35 0%,#102f55 100%);color:#fff;display:flex;flex-direction:column;box-shadow:8px 0 30px rgba(15,35,60,.10)}
      .ka-brand{text-align:center;padding:5px 10px 23px;border-bottom:1px solid #ffffff18;margin-bottom:16px}.ka-brand .logo{font-size:33px}.ka-brand strong{display:block;font-size:28px;letter-spacing:6px;margin-top:3px}.ka-brand small{font-size:10px;letter-spacing:2px;color:#c9d8eb}
      .ka-nav{display:grid;gap:7px}.ka-nav button{border:0;background:transparent;color:#eaf2ff;padding:13px 14px;border-radius:9px;text-align:left;font-weight:800;cursor:pointer;font-size:14px}.ka-nav button:hover,.ka-nav button.on{background:#2d5f9f;color:#fff}.ka-nav i{font-style:normal;width:27px;display:inline-block;font-size:17px}
      .ka-logout{margin-top:auto;width:100%;border:1px solid #ffffff26;background:#d93645;color:#fff;padding:12px 14px;border-radius:10px;font-weight:900;cursor:pointer;text-align:left}.ka-logout:hover{background:#bd2736}.ka-logout i{font-style:normal;width:27px;display:inline-block}
      .ka-profile{margin-top:10px;background:#ffffff0d;border:1px solid #ffffff14;border-radius:13px;padding:14px}.ka-avatar{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:#3f7fe3;font-size:20px;margin-bottom:8px}.ka-profile small{color:#c5d4e7}.ka-profile b{display:block;margin:2px 0 4px}
      .ka-head{background:#fff;border:1px solid #e2e9f1;border-radius:13px;padding:16px 18px;display:flex;justify-content:space-between;gap:15px;align-items:center;box-shadow:0 4px 18px rgba(20,47,78,.05);margin-bottom:14px}.ka-date{display:flex;gap:12px;align-items:flex-start}.ka-date .icon{font-size:24px}.ka-date b{font-size:19px}.ka-date small{display:block;color:#718096;margin-top:3px}.ka-live{background:#e7f7ee;color:#176d43;padding:10px 14px;border-radius:10px;font-weight:900;white-space:nowrap}
      #admin.kraw-admin-v2 .stats{grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:12px!important;margin-bottom:14px!important}.ka-stat,#admin.kraw-admin-v2 .stat{background:#fff;border:1px solid #e2e9f1;border-radius:13px;padding:14px 16px;min-height:94px;box-shadow:0 4px 16px rgba(20,47,78,.04)}#admin.kraw-admin-v2 .stat b{font-size:26px!important;color:#14243a}
      .ka-groups{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:14px 0 16px}.ka-group{background:#fff;border:1px solid #e1e8f0;border-radius:13px;overflow:hidden;box-shadow:0 4px 18px rgba(20,47,78,.04)}.ka-group-head{padding:12px 14px;display:flex;justify-content:space-between;align-items:center;font-weight:900}.ka-group[data-g="1"] .ka-group-head{background:#fff0f0;color:#9c3333}.ka-group[data-g="2"] .ka-group-head{background:#fff5e8;color:#9a5b18}.ka-group[data-g="3"] .ka-group-head{background:#edf9ef;color:#276b3d}.ka-group[data-g="4"] .ka-group-head{background:#f3edff;color:#5e3b9b}.ka-group-head span:last-child{font-size:12px;font-weight:700;opacity:.75}
      .ka-meals{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:9px;padding:10px}.ka-meal{border:1px solid #e3e9ef;border-radius:9px;overflow:hidden;background:#fff;min-width:0}.ka-meal img,.ka-meal .ph{width:100%;height:88px;object-fit:cover;background:#eef3f8;display:grid;place-items:center}.ka-meal b{display:block;padding:7px 8px 2px;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ka-meal small{display:block;padding:0 8px 8px;color:#7b8798;font-size:10px}
      #admin.kraw-admin-v2 .panel{background:#fff!important;border:1px solid #e1e8f0!important;border-radius:13px!important;box-shadow:0 4px 18px rgba(20,47,78,.04)!important;padding:16px!important;margin-bottom:14px!important}#admin.kraw-admin-v2 .panel h2{font-size:19px;color:#14243a}
      #admin.kraw-admin-v2 table{background:#fff;border-radius:10px;overflow:hidden}#admin.kraw-admin-v2 th{background:#f7f9fc;color:#42526a;font-size:12px}#admin.kraw-admin-v2 td{font-size:12px}
      #admin.kraw-admin-v2 .summary{grid-template-columns:repeat(4,1fr)!important}
      #admin.kraw-admin-v2 #people,#admin.kraw-admin-v2 #meals,#admin.kraw-admin-v2 #guests,#admin.kraw-admin-v2 #settings{padding-top:0}
      .ka-section-title{font-size:22px;font-weight:900;margin:3px 0 14px;color:#14243a}
      .ka-empty{padding:32px;text-align:center;color:#6b7789;background:#fff;border:1px dashed #cfd8e5;border-radius:12px}
      @media(max-width:1180px){.ka-meals{grid-template-columns:repeat(3,1fr)}.ka-groups{grid-template-columns:1fr}#admin.kraw-admin-v2 .stats{grid-template-columns:repeat(3,1fr)!important}}
      @media(max-width:820px){.ka-side{position:static;width:auto;height:auto}.ka-brand,.ka-profile{display:none}.ka-nav{grid-template-columns:1fr 1fr}.ka-logout{margin-top:10px}#admin.kraw-admin-v2>.main{margin-left:0!important;padding:12px!important}.ka-head{align-items:flex-start}.ka-meals{grid-template-columns:repeat(2,1fr)}#admin.kraw-admin-v2 .stats{grid-template-columns:1fr 1fr!important}}
    `;document.head.appendChild(s);
  }

  function escA(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function mealCard(m){const pic=m.image_url?`<img loading="lazy" src="${escA(m.image_url)}" onerror="this.outerHTML='<div class=ph>🍽️</div>'">`:'<div class="ph">🍽️</div>';return `<div class="ka-meal">${pic}<b title="${escA(m.name)}">${escA(m.name)}</b><small>${m.group_no}. grup</small></div>`}
  function mealName(id){const m=(S.meals||[]).find(x=>String(x.id)===String(id));return m?escA(m.name):'—'}

  function nav(id,btn){
    ['ov','people','meals','guests','settings'].forEach(x=>document.getElementById(x)?.classList.toggle('hide',x!==id));
    document.querySelectorAll('.ka-nav button').forEach(x=>x.classList.toggle('on',x===btn));
    const titles={ov:'Genel Bakış',people:'Personeller',meals:'Yemekler',guests:'Misafirler',settings:'Admin Ayarları'};
    const t=document.getElementById('kaSectionTitle');if(t)t.textContent=titles[id]||'';
    if(id==='guests')renderGuests();
  }

  function ensureGuestsSection(){
    const main=document.querySelector('#admin>.main');if(!main)return null;
    let g=document.getElementById('guests');
    if(!g){g=document.createElement('section');g.id='guests';g.className='hide';const settings=document.getElementById('settings');main.insertBefore(g,settings||null)}
    return g;
  }

  function renderGuests(){
    const host=ensureGuestsSection();if(!host)return;
    const guests=S.todayGuests||[];
    const ppl=(S.users||[]).filter(u=>u.role==='personel');
    if(!guests.length){host.innerHTML='<div class="panel"><div class="between"><h2>Bugünkü Misafirler</h2><button class="btn ghost" type="button" onclick="boot()">↻ Yenile</button></div><div class="ka-empty">Bugün için kayıtlı misafir bulunmuyor.</div></div>';return}
    host.innerHTML=`<div class="panel"><div class="between"><h2>Bugünkü Misafirler</h2><button class="btn ghost" type="button" onclick="boot()">↻ Yenile</button></div><table><tr><th>#</th><th>Personel</th><th>Misafir</th><th>1. Grup</th><th>2. Grup</th><th>3. Grup</th><th>4. Grup</th></tr>${guests.map((g,i)=>{const u=ppl.find(x=>x.id===g.user_id);return `<tr><td>${i+1}</td><td><b>${escA(u?.full_name||'')}</b></td><td>${escA(g.guest_name||'Misafir')}</td><td>${mealName(g.group1_meal_id)}</td><td>${mealName(g.group2_meal_id)}</td><td>${mealName(g.group3_meal_id)}</td><td>${mealName(g.group4_meal_id)}</td></tr>`}).join('')}</table></div>`;
  }

  function shell(){
    if(!S?.user||S.user.role!=='admin'){cleanupAdminShell();return false;}
    css();document.body.classList.add('kraw-admin-mode');
    const admin=document.getElementById('admin');if(!admin)return false;admin.classList.add('kraw-admin-v2');
    ensureGuestsSection();
    let side=document.getElementById('kaSide');
    if(!side){side=document.createElement('aside');side.id='kaSide';side.className='ka-side';admin.prepend(side)}
    side.innerHTML=`<div class="ka-brand"><div class="logo">👨‍🍳</div><strong>KRAW</strong><small>YEMEK SEÇİM SİSTEMİ</small></div><div class="ka-nav"><button class="on" data-id="ov"><i>⌂</i>Genel Bakış</button><button data-id="people"><i>👥</i>Personeller</button><button data-id="meals"><i>🍴</i>Yemekler</button><button data-id="guests"><i>♙</i>Misafirler</button><button data-id="settings"><i>⚙</i>Admin Ayarları</button></div><button type="button" class="ka-logout" id="kaLogout"><i>↪</i>Çıkış Yap</button><div class="ka-profile"><div class="ka-avatar">👤</div><small>Hoş geldin,</small><b>${escA(S.user.full_name||'Admin')}</b><small>Yönetici</small></div>`;
    side.querySelectorAll('.ka-nav button').forEach(b=>b.onclick=()=>nav(b.dataset.id,b));
    side.querySelector('#kaLogout').onclick=()=>logout();
    const main=admin.querySelector('.main');if(!main)return false;
    if(!document.getElementById('kaHead')){
      const h=document.createElement('div');h.id='kaHead';h.className='ka-head';main.insertBefore(h,main.firstChild);
      const title=document.createElement('div');title.id='kaSectionTitle';title.className='ka-section-title';title.textContent='Genel Bakış';h.insertAdjacentElement('afterend',title);
    }
    const d=S.today?new Date(S.today+'T12:00:00'):new Date();const ds=d.toLocaleDateString('tr-TR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
    document.getElementById('kaHead').innerHTML=`<div class="ka-date"><div class="icon">🗓️</div><div><b>${escA(ds)}</b><small>Bugünkü yemek seçimlerini ve sistemi yönetin.</small></div></div><div class="ka-live">● Seçimler aktif</div>`;
    renderGuests();
    return true;
  }

  function groups(){
    if(!shell())return;
    const ov=document.getElementById('ov');if(!ov)return;
    let wrap=document.getElementById('kaGroups');if(wrap)wrap.remove();wrap=document.createElement('div');wrap.id='kaGroups';wrap.className='ka-groups';
    for(let g=1;g<=4;g++){
      const all=(S.meals||[]).filter(m=>Number(m.group_no)===g);const show=all.slice(0,5);const box=document.createElement('section');box.className='ka-group';box.dataset.g=g;box.innerHTML=`<div class="ka-group-head"><span>${g}. Grup - ${NAMES[g]}</span><span>${all.length} yemek</span></div><div class="ka-meals">${show.map(mealCard).join('')}</div>`;wrap.appendChild(box);
    }
    const stats=ov.querySelector('.stats');if(stats)stats.insertAdjacentElement('afterend',wrap);else ov.prepend(wrap);
  }

  function refresh(){
    try{
      if(S?.user?.role!=='admin'){cleanupAdminShell();return;}
      shell();groups();
    }catch(e){console.error('Modern admin:',e)}
  }

  const original=window.renderAdmin;
  if(typeof original==='function')window.renderAdmin=function(){const r=original.apply(this,arguments);setTimeout(refresh,0);return r};
  const originalBoot=window.boot;
  if(typeof originalBoot==='function')window.boot=async function(){const r=await originalBoot.apply(this,arguments);setTimeout(refresh,0);return r};
  let tries=0;const t=setInterval(()=>{tries++;refresh();if(S?.user?.role==='admin'&&document.getElementById('ov')?.children.length)clearInterval(t);if(tries>60)clearInterval(t)},100);
  setTimeout(refresh,150);
})();