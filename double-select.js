(function(){
  if(window.__krawSingleSelectCleanupLoaded)return;
  window.__krawSingleSelectCleanupLoaded=true;
  window.D2={1:null,2:null,3:null,4:null};
  function cleanup(){
    document.querySelectorAll('.double-note,.double-badge').forEach(el=>el.remove());
    document.querySelectorAll('.meal.double-second').forEach(el=>el.classList.remove('double-second'));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',cleanup,{once:true});
  else cleanup();
})();