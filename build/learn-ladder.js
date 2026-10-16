(function(){
  var svg=document.getElementById('lad-svg');if(!svg)return;
  function $(id){return document.getElementById(id)}
  var S={pwr:false,brew:false,steam:false},T=25,blown=false,brewClosed=true,steamClosed=true,run=false,timer=null,lastStatus='';
  /* opening points are Gaggia's; the closing points are illustrative */
  var BREW_OPEN=%%BREW_OPEN%%,BREW_CLOSE=%%BREW_CLOSE%%,STEAM_OPEN=%%STEAM_OPEN%%,STEAM_CLOSE=%%STEAM_CLOSE%%,FUSE=%%FUSE%%;
  $('lab-brew').textContent='opens at '+BREW_OPEN+' °C';$('lab-steam').textContent='opens at '+STEAM_OPEN+' °C';
  function blade(id,closed){var b=$(id).querySelector('.blade');b.setAttribute('transform',closed?'':'rotate(-28)')}
  function liveSet(ids,on){ids.forEach(function(i){var e=$('s-'+i);if(e&&on)e.classList.add('live')})}
  function update(){
    /* thermostats follow the temperature, with a gap between opening and closing; the fuse melts once and stays open */
    if(T>=BREW_OPEN)brewClosed=false;else if(T<=BREW_CLOSE)brewClosed=true;
    if(T>=STEAM_OPEN)steamClosed=false;else if(T<=STEAM_CLOSE)steamClosed=true;
    if(T>=FUSE)blown=true;
    var mains=S.pwr,fed=mains&&!blown;
    /* the neutral side: the steam thermostat, then the brew thermostat or the steam switch around it */
    var tbToN=brewClosed||S.steam;
    var heat=fed&&steamClosed&&tbToN;
    /* each lamp lights when its thermostat is open and the rest of its path is closed */
    var sLamp=fed&&!steamClosed&&tbToN;
    var bLamp=fed&&steamClosed&&!brewClosed&&!S.steam;
    var both=fed&&!steamClosed&&!brewClosed&&!S.steam;
    var pump=fed&&S.brew,sol=fed&&S.brew&&!S.steam;
    Array.prototype.forEach.call(svg.querySelectorAll('.w'),function(w){w.classList.remove('live')});
    liveSet(['inL','inN','railL0','railN','r1a','r1b'],mains);
    liveSet(['railL'],fed);
    /* heater: elements, steam thermostat, then the brew thermostat and/or the steam switch around it */
    liveSet(['r2a','r2b','r2c','r2d','r2g'],heat);
    liveSet(['r2e','r2f'],heat&&brewClosed);
    liveSet(['by1','by2'],heat&&S.steam);
    /* steam lamp: around the open steam thermostat, then on the same way */
    liveSet(['r2a','r2b','sl1','sl2','r2d','r2g'],sLamp);
    liveSet(['by1','by2'],sLamp&&S.steam);
    liveSet(['r2e','r2f'],sLamp&&!S.steam);
    /* brew lamp: through the closed steam thermostat, around the open brew thermostat */
    liveSet(['r2a','r2b','r2c','r2d','r2e','bl1','bl2','r2g'],bLamp);
    liveSet(['r3a','r3b'],pump);
    liveSet(['r3c','r3d','r3e','r3f'],pump);
    liveSet(['r4a','r4b','r4c'],sol);
    blade('c-pwrL',S.pwr);blade('c-pwrN',S.pwr);blade('c-brewt',brewClosed);blade('c-steamt',steamClosed);
    blade('c-steamB',S.steam);blade('c-steamA',!S.steam);blade('c-brew',S.brew);
    $('c-tfuse').classList.toggle('blown',blown);
    $('c-lamp1').classList.toggle('on',mains);$('c-el').classList.toggle('on',heat);
    $('c-slamp').classList.toggle('on',sLamp);$('c-blamp').classList.toggle('on',bLamp);
    $('c-pump').classList.toggle('on',pump);$('c-sol').classList.toggle('on',sol);
    $('lab-fuse').textContent=blown?'melted: fit a new one':'melts at '+FUSE+' °C';
    $('lad-reset').hidden=!blown;
    var parts=[];
    if(!mains)parts.push('Power is off, so nothing has a path from line to neutral.');
    else if(blown)parts.push('<b>The thermal fuse has melted.</b> Only the power lamp, wired ahead of it, still lights; nothing else has a path. It’s one-shot, so it has to be replaced, and the overheating found.');
    else{
      if(heat)parts.push('<b>Elements heating:</b> the steam thermostat is closed, and so is '+(S.steam?'the steam switch, which shorts out the brew thermostat':'the brew thermostat')+'.');
      else if(!steamClosed)parts.push('<b>Elements off:</b> the steam thermostat has opened.'+(sLamp?' The steam lamp is lit: steam is ready.':both?' Both thermostats are open, so the two lamps share the voltage in series; whether they glow isn’t documented.':''));
      else parts.push('<b>Elements off:</b> the brew thermostat has opened, so the brew lamp is lit: ready to brew.'+(S.steam?'':' Switch on steam to keep heating.'));
      if(pump)parts.push('<b>Pump running</b> through the brew switch.');
      if(sol)parts.push('<b>3-way valve open</b> to the group: its return runs through the steam switch, closed with steam off.');
      else if(pump)parts.push('The 3-way valve stays shut, because the steam switch has opened its return. That’s hot water mode: water leaves through the wand.');
    }
    var html=parts.join(' ');if(html!==lastStatus){lastStatus=html;$('lad-status').innerHTML=html}
    $('lad-tv').textContent=Math.round(T)+' °C';if(!dragT)$('lad-temp').value=String(T.toFixed(1));
    Array.prototype.forEach.call(document.querySelectorAll('[data-lsw]'),function(b){b.setAttribute('aria-pressed',String(S[b.getAttribute('data-lsw')]))});
    kick();
    return {heat:heat,pump:pump,sol:sol};
  }
  /* ---------- current flowing ----------
     Every live wire's dashes move at one speed, timed from one clock, and each wire starts its pattern where the
     wire feeding it left off, so the flow runs on through junctions and never restarts. Rows run left to right;
     the neutral wires drawn upward carry it back to the plug. */
  var FV=30,FP=16,RM=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches),seen=true,raf=0;
  var wires=Array.prototype.map.call(svg.querySelectorAll('.w'),function(w){
    var a=w.getPointAtLength(0);
    return {el:w,d0:(w.id==='s-inL'||w.id==='s-railL0'||w.id==='s-railL')?a.y:a.x,up:w.classList.contains('up')};
  });
  function flow(ms){
    raf=0;var t=ms/1000,any=false;
    for(var i=0;i<wires.length;i++){var w=wires[i];if(!w.el.classList.contains('live'))continue;any=true;
      w.el.style.strokeDashoffset=(w.up?(FV*t)%FP:((w.d0-FV*t)%FP+FP)%FP).toFixed(2)}
    if(any&&seen)raf=requestAnimationFrame(flow);
  }
  function kick(){if(!RM&&seen&&!raf)raf=requestAnimationFrame(flow)}
  if('IntersectionObserver' in window)new IntersectionObserver(function(es){seen=es[0].isIntersecting;kick()}).observe(svg);
  Array.prototype.forEach.call(document.querySelectorAll('[data-lsw]'),function(b){
    b.addEventListener('click',function(){var k=b.getAttribute('data-lsw');S[k]=!S[k];update()});
  });
  var dragT=false;
  $('lad-temp').addEventListener('input',function(){T=Number(this.value);dragT=true;update();dragT=false});
  $('lad-reset').addEventListener('click',function(){if(T>=FUSE-5)T=FUSE-40;blown=false;update()});
  /* let it run: the elements heat the boiler, the boiler loses heat, brewing pulls cold water in */
  var st={heat:false,sol:false},last=0;
  function tick(ms){
    timer=null;if(!run)return;
    var k=last?Math.min(4,(ms-last)/120):0;last=ms;
    var dT=-(T-22)*0.004;
    if(st.heat)dT+=1.1;
    if(st.pump)dT-=0.6;
    T=Math.max(20,Math.min(195,T+dT*k));
    st=update();
    timer=requestAnimationFrame(tick);
  }
  $('lad-run').addEventListener('click',function(){
    run=!run;this.setAttribute('aria-pressed',String(run));this.textContent=run?'Stop':'Let it run';
    if(timer){cancelAnimationFrame(timer);timer=null}
    if(run){st=update();last=0;timer=requestAnimationFrame(tick)}
  });
  update();
})();
