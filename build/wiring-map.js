  /* ---------- the wiring map ----------
     WM holds one drawing per schematic (built by wiring_map.py): the SVG, its parts and which parts each run joins.
     Tap a wire or its tag for that run, a part for everything that lands on it; the layer chips, the stepper and the
     wire-color switch work on whatever is showing. */
  var WM=%%WIRING_MAPS%%;
  var MAP=(function(){
    var LAYERS=[['all','All',null],['line','Line and heater','var(--w-l)'],['N','Neutral','var(--w-n)'],['E','Earth','var(--w-e)'],['lv','Low voltage','var(--w-lv)'],['opt','Optional','var(--w-opt)']];
    var SYSC={L:'var(--w-l)',H:'var(--w-h)',N:'var(--w-n)',E:'var(--w-e)',LV:'var(--w-lv)',LVG:'var(--w-lvg)',S:'var(--w-s)'};
    var SYSN={L:'Line',H:'Heater line',N:'Neutral',E:'Earth',LV:'Low voltage: switch signal or SSR control',LVG:'Low voltage: ground for the switches or SSR',S:'Sensor or screen cable'};
    var PK='gaggia-wiring-map-v1',key=null,v=null,mp=null,svg=null,layer='all',sel=null,wcol=false,order=[],showOpt=false;
    try{var sv=JSON.parse(localStorage.getItem(PK)||'null');if(sv)wcol=!!sv.wcol}catch(e){}
    function persist(){try{localStorage.setItem(PK,JSON.stringify({wcol:wcol}))}catch(e){}}
    function el(id){return document.getElementById(id)}
    function runOf(id){for(var i=0;i<v.runs.length;i++)if(v.runs[i].id===id)return v.runs[i];return null}
    function sysOf(id){var r=runOf(id);return r?r.sys:'S'}
    function isOpt(id){var r=runOf(id);return !!(r&&r.opt)}
    function inLayer(id,l){
      var s=sysOf(id);
      if(l==='all')return true;
      if(l==='opt')return isOpt(id);
      if(l==='line')return s==='L'||s==='H';
      if(l==='lv')return s==='LV'||s==='LVG'||s==='S';
      return s===l;
    }
    function lenTxt(r){return r.mm?r.mm+' mm':(r.stock?'Stock lead, no length to cut':'Measure on your machine')}
    /* the order the list uses, so the stepper walks the runs the way the page lists them */
    function listOrder(){
      var rs=v.runs.filter(function(r){return showOpt||!r.opt});
      if(v.path==='SI')return rs.filter(function(r){return r.sys!=='LV'&&r.sys!=='LVG'}).concat(rs.filter(function(r){return r.sys==='LV'||r.sys==='LVG'})).map(function(r){return r.id});
      var out=[];['L','H','N','E','LV'].forEach(function(s){rs.forEach(function(r){if(s==='LV'?(r.sys==='LV'||r.sys==='LVG'):r.sys===s)out.push(r.id)})});
      return out;
    }
    function show(k,opt){
      showOpt=!!opt;
      if(k!==key){key=k;v=VARS[k];mp=WM[k];sel=null;layer='all';
        el('mscroll').innerHTML=mp?mp.svg:'';svg=el('mscroll').querySelector('svg');}
      order=listOrder();
      el('mapsec').hidden=!mp;
      el('mcapsi').hidden=!(v&&v.path==='SI');
      if(mp)paint();
    }
    function ends(id){return (mp.ends[id]||[])}
    function paint(){
      if(!svg)return;
      var any=layer!=='all'||!!sel,lit={},partsLit={};
      Array.prototype.forEach.call(svg.querySelectorAll('.run'),function(g){
        var id=g.getAttribute('data-run'),on;
        if(sel&&sel.t==='run')on=id===sel.id;
        else if(sel&&sel.t==='set')on=sel.ids.indexOf(id)>=0;
        else if(sel&&sel.t==='part')on=ends(id).indexOf(sel.id)>=0;
        else on=inLayer(id,layer);
        lit[id]=on;if(on&&sel)ends(id).forEach(function(p){partsLit[p]=1});
      });
      /* a stock connector's lead lights with it, and so does the part that lead came off or stays on */
      Array.prototype.forEach.call(svg.querySelectorAll('.stk'),function(g){
        var f=g.getAttribute('data-part'),t=g.getAttribute('data-to'),on=!!sel&&(partsLit[f]||(sel.t==='part'&&(sel.id===f||sel.id===t)));
        g.classList.toggle('on',!!on);if(on){partsLit[t]=1;partsLit[f]=1}
      });
      svg.classList.toggle('dim',any);svg.classList.toggle('wcol',wcol);
      Array.prototype.forEach.call(svg.querySelectorAll('.run,.tag'),function(g){
        var id=g.getAttribute('data-run');
        g.classList.toggle('off',!lit[id]);
        g.classList.toggle('sel',!!(sel&&((sel.t==='run'&&sel.id===id)||(sel.t==='set'&&sel.ids.indexOf(id)>=0))));
      });
      Array.prototype.forEach.call(svg.querySelectorAll('.part'),function(g){
        var id=g.getAttribute('data-part');
        g.classList.toggle('off',!!sel&&!partsLit[id]&&!(sel.t==='part'&&sel.id===id));
        g.classList.toggle('sel',!!(sel&&sel.t==='part'&&sel.id===id));
      });
      var has={};Array.prototype.forEach.call(svg.querySelectorAll('.run'),function(g){var id=g.getAttribute('data-run');LAYERS.forEach(function(l){if(l[0]!=='all'&&inLayer(id,l[0]))has[l[0]]=1})});
      el('mchips').innerHTML=LAYERS.filter(function(l){return l[0]==='all'||has[l[0]]}).map(function(l){
        return '<button type="button" class="chip" data-mlayer="'+l[0]+'" aria-pressed="'+(layer===l[0]&&!sel)+'">'+(l[2]?'<span class="sw" style="background:'+l[2]+'"></span>':'')+l[1]+'</button>';
      }).join('');
      Array.prototype.forEach.call(document.querySelectorAll('[data-wc]'),function(b){b.setAttribute('aria-pressed',String((b.getAttribute('data-wc')==='draw')===wcol))});
      var i=sel&&sel.t==='run'?order.indexOf(sel.id):-1;
      el('m-step').textContent=i>=0?(i+1)+' of '+order.length:order.length+' runs';
      legend();detail();summary();
    }
    /* one line above the map, so on a phone the pick shows without scrolling down to the card */
    function summary(){
      var e=el('msel'),r=sel&&sel.t==='run'?runOf(sel.id):null;
      if(!sel){e.textContent='';return}
      if(sel.t==='set'){e.innerHTML=(sel.label?'<span class="rt">'+esc(sel.label)+'</span>: ':'')+sel.ids.map(function(id){return '<b>'+esc(id)+'</b>'}).join(' ');return}
      if(sel.t==='part'){var p=mp.parts[sel.id]||{name:sel.id},n=Object.keys(mp.ends).filter(function(id){return ends(id).indexOf(sel.id)>=0}).length;e.innerHTML='<span class="rt">'+esc(p.name)+'</span>: '+(n?n+(n===1?' run lands here':' runs land here'):'nothing new connects here');return}
      if(!r){e.innerHTML='<b>'+esc(sel.id)+'</b><span class="rt">'+esc((mp.cables||{})[sel.id]||'')+'</span>';return}
      e.innerHTML='<b>'+esc(r.id)+'</b><span class="rt">'+esc(r.short||(r.frm+' → '+r.to))+'</span> · '+esc(lenTxt(r));
    }
    function legend(){
      var h;
      if(wcol)h='<span><i class="c" style="background:#C2412F"></i>The drawing\'s own wire colors, as listed for each run</span>';
      else h=[['L','Line'],['H','Heater line'],['N','Neutral'],['E','Earth'],['LV','Switch signal, SSR control'],['LVG','Low-voltage ground']].map(function(x){return '<span><i class="lg-'+x[0]+'"></i>'+x[1]+'</span>'}).join('')+(mp&&mp.cables&&Object.keys(mp.cables).length?'<span><i class="lg-S"></i>Sensor and screen cables</span>':'');
      if(v.path==='SI')h+='<span><i class="lg-stk0"></i>Stock lead that stays on its spade</span><span><i class="lg-stk"></i>Where a moved or parked stock connector came off</span>';
      if(v.runs.some(function(r){return r.opt}))h+='<span><i style="border-top-style:dashed"></i>Optional run</span>';
      el('mlegend').innerHTML=h;
    }
    /* the card, then the back-links: where else the site covers what's picked (wiring-refs.js) */
    function detail(){
      detail0();
      if(!sel||typeof REFS==='undefined')return;
      var c={v:v,hasRun:hasRun,hasPart:hasPart,runOf:runOf,landing:function(p){return Object.keys(mp.ends).filter(function(id){return ends(id).indexOf(p)>=0&&hasRun(id)})}};
      var h=REFS.html(sel,c);if(h)el('mdetail').insertAdjacentHTML('beforeend',h);
    }
    function detail0(){
      var d=el('mdetail');
      if(!sel){d.className='mdetail empty';d.style.borderLeftColor='';d.innerHTML='<p style="color:var(--muted)">Tap a wire or its tag to see that run on its own, with where it starts and ends, the wire and what goes on each end. Tap a part to see every run that lands on it. Step through with the arrows to go run by run.</p>';return}
      var acts='<span class="d-acts">'+(sel.t==='run'&&runOf(sel.id)?'<a href="#r-'+esc(sel.id)+'" data-jump="'+esc(sel.id)+'">Show in the list</a>':'')+'<button type="button" class="chip" data-mclear>Show everything</button></span>';
      if(sel.t==='set'){
        d.className='mdetail';d.style.borderLeftColor='var(--accent)';
        d.innerHTML='<div class="d-head"><span class="d-route">'+esc(sel.label||'The runs that page pointed to')+'</span>'+acts+'</div><div><span class="k">'+sel.ids.length+' runs, in order</span><div class="ids" style="margin-top:4px">'+sel.ids.map(function(id){return '<button type="button" data-mrun="'+esc(id)+'">'+esc(id)+'</button>'}).join('')+'</div></div><p style="color:var(--muted)">Tap one to see it on its own.</p>';
        return;
      }
      if(sel.t==='part'){
        var p=mp.parts[sel.id]||{name:sel.id},ids=Object.keys(mp.ends).filter(function(id){return ends(id).indexOf(sel.id)>=0});
        d.className='mdetail';d.style.borderLeftColor='var(--accent)';
        var pi=typeof partInfo==='function'?partInfo(sel.id,v):null;
        d.innerHTML='<div class="d-head"><span class="d-route">'+esc(p.name)+'</span>'+acts+'</div>'+(pi?'<p class="d-what">'+esc(pi.w)+'</p>'+(pi.p?'<p class="d-pcb"><span class="k">With Gaggiuino</span> '+esc(pi.p)+'</p>':''):'')+(p.note?'<p>'+esc(p.note.charAt(0).toUpperCase()+p.note.slice(1))+'.</p>':'')+
          (ids.length?'<div><span class="k">'+ids.length+(ids.length===1?' run lands':' runs land')+' here</span><div class="ids" style="margin-top:4px">'+ids.map(function(id){return '<button type="button" data-mrun="'+esc(id)+'"'+(isOpt(id)?' class="o" title="Optional run"':'')+'>'+id+(isOpt(id)?' · optional':'')+'</button>'}).join('')+'</div></div>':'<p style="color:var(--muted)">Nothing new connects here; it\'s drawn so you can find your way around.</p>');
        return;
      }
      var r=runOf(sel.id);
      if(!r){
        var nm=(mp.cables||{})[sel.id]||sel.id,pins=(v.cables||[]).filter(function(c){return (sel.id==='TC'&&/Thermocouple/.test(c.frm))||(sel.id==='PS'&&/Pressure/.test(c.frm))||(sel.id==='SCR'&&/Display/.test(c.frm+c.to))});
        d.className='mdetail';d.style.borderLeftColor=SYSC.S;
        d.innerHTML='<div class="d-head"><span class="d-id">'+esc(sel.id)+'</span><span class="d-route">'+esc(nm)+'</span>'+acts+'</div><p>This cable comes with its part. Plug it in by pin, not by color:</p>'+
          '<div class="d-grid">'+pins.map(function(c){return '<div><span class="k">'+esc(c.frm)+'</span><span>'+swatch(c.color)+esc(c.to)+'</span></div>'}).join('')+'</div>';
        return;
      }
      var bare=!!(r.k&&(['b','mb'].indexOf(r.k[0])>=0||['b','mb'].indexOf(r.k[1])>=0));
      d.className='mdetail';d.style.borderLeftColor=SYSC[r.sys]||'var(--accent)';
      d.innerHTML='<div class="d-head"><span class="d-id">'+esc(r.id)+'</span><span class="d-route">'+esc(r.frm)+' → '+esc(r.to)+'</span>'+acts+'</div>'+
        '<div class="d-grid"><div><span class="k">Circuit</span><span><span class="sysdot" style="background:'+(SYSC[r.sys]||'var(--muted)')+'"></span>'+esc(SYSN[r.sys]||r.sys)+'</span></div>'+
        '<div><span class="k">Wire</span><span>'+swatch(r.color)+esc(r.wire||'')+(r.color?', '+esc(r.color):'')+'</span></div>'+
        '<div><span class="k">Length</span><span>'+lenTxt(r)+'</span></div>'+
        '<div><span class="k">End at '+esc(r.frm)+'</span><span>'+esc((r.ends||[])[0]||'—')+'</span></div>'+
        '<div><span class="k">End at '+esc(r.to)+'</span><span>'+esc((r.ends||[])[1]||'—')+'</span></div>'+
        '<div><span class="k">Notes</span><span>'+(r.stock?'Stock lead. ':'')+(r.opt?'Optional run. ':'')+(bare?'An end at the boiler or valve: bare spade under silicone. ':'')+(!r.stock&&!r.opt&&!bare?'—':'')+'</span></div></div>'+
        (r.what?'<p>'+esc(r.what)+'.</p>':'')+(r.note?'<p>'+esc(r.note)+'</p>':'');
    }
    function center(){
      if(!svg||!sel)return;
      var sc=el('mscroll');if(sc.scrollWidth<=sc.clientWidth+2)return;
      var gs=sel.t==='set'?sel.ids.map(function(id){return svg.querySelector('.run[data-run="'+id+'"]')}):[sel.t==='run'?svg.querySelector('.run[data-run="'+sel.id+'"]'):svg.querySelector('.part[data-part="'+sel.id+'"]')];
      try{var x0=1e9,x1=-1e9;gs.forEach(function(g){if(!g)return;var bb=g.getBBox();x0=Math.min(x0,bb.x);x1=Math.max(x1,bb.x+bb.width)});var ratio=svg.clientWidth/1400;sc.scrollTo({left:Math.max(0,(x0+x1)/2*ratio-sc.clientWidth/2),behavior:'smooth'})}catch(e){}
    }
    function pickRun(id,toggle){sel=(toggle&&sel&&sel.t==='run'&&sel.id===id)?null:{t:'run',id:id};paint();center()}
    function pickPart(id){sel=(sel&&sel.t==='part'&&sel.id===id)?null:{t:'part',id:id};paint();center()}
    function stepBy(n){
      if(!order.length)return;
      var i=sel&&sel.t==='run'?order.indexOf(sel.id):-1;
      i=i<0?(n>0?0:order.length-1):(i+n+order.length)%order.length;
      pickRun(order[i],false);
    }
    function init(){
      el('mscroll').addEventListener('click',function(e){
        var g=e.target.closest('[data-run]');if(g){pickRun(g.getAttribute('data-run'),true);return}
        var p=e.target.closest('[data-part]');if(p){pickPart(p.getAttribute('data-part'));return}
        if(sel){sel=null;paint()}
      });
      el('mchips').addEventListener('click',function(e){var b=e.target.closest('[data-mlayer]');if(!b)return;layer=b.getAttribute('data-mlayer');sel=null;paint()});
      el('mapsec').addEventListener('click',function(e){
        var w=e.target.closest('[data-wc]');if(w){wcol=w.getAttribute('data-wc')==='draw';persist();paint();return}
        if(e.target.closest('[data-mclear]')){sel=null;paint();return}
        var r=e.target.closest('[data-mrun]');if(r){pickRun(r.getAttribute('data-mrun'),false);return}
      });
      el('m-prev').addEventListener('click',function(){stepBy(-1)});
      el('m-next').addEventListener('click',function(){stepBy(1)});
    }
    /* from the list: show one run on the map */
    function focus(id){if(!mp)return;pickRun(id,false);el('mapsec').scrollIntoView({behavior:'smooth',block:'start'})}
    function hasRun(id){return !!(svg&&svg.querySelector('.run[data-run="'+id+'"]'))}
    function hasPart(id){return !!(svg&&svg.querySelector('.part[data-part="'+id+'"]'))}
    /* a link from another page (see maplink.js): run=TC, part=ssr (| between alternatives, the first on this drawing wins),
       runs=AC1,AC2 or short=J9 R1,J9 GND (every run whose name starts that way) for a set, layer=E for a layer.
       Returns false when nothing it asked for is on this drawing; the whole map shows instead. */
    function deep(q){
      if(!mp)return false;
      var found=null,ids=[],asked=!!(q.run||q.part||q.runs||q.short||q.layer);
      if(q.run)q.run.split('|').some(function(id){if(hasRun(id)){found={t:'run',id:id};return true}return false});
      if(!found&&q.part)q.part.split('|').some(function(id){if(hasPart(id)){found={t:'part',id:id};return true}return false});
      if(!found&&(q.runs||q.short)){
        if(q.runs)q.runs.split(',').forEach(function(id){if(hasRun(id)&&ids.indexOf(id)<0)ids.push(id)});
        if(q.short)q.short.split(',').forEach(function(p){v.runs.forEach(function(r){if(r.short&&r.short.indexOf(p)===0&&hasRun(r.id)&&ids.indexOf(r.id)<0)ids.push(r.id)})});
        if(ids.length===1)found={t:'run',id:ids[0]};else if(ids.length)found={t:'set',ids:ids,label:q.label||''};
      }
      sel=found;layer='all';
      if(!found&&q.layer&&Array.prototype.some.call(svg.querySelectorAll('.run'),function(g){return inLayer(g.getAttribute('data-run'),q.layer)})){layer=q.layer;found=true;sel=null}
      paint();center();
      if(found===true){var ln=LAYERS.filter(function(l){return l[0]===q.layer})[0];el('msel').innerHTML=(q.label?'<span class="rt">'+esc(q.label)+'</span>: ':'')+esc(ln?ln[1]:'')+' runs lit'}
      if(asked&&!found)el('msel').innerHTML='<span class="rt">'+esc(q.label?q.label+': not':'Not')+' on this drawing, so the whole map is showing.</span>';
      return !asked||!!found;
    }
    return {show:show,init:init,focus:focus,deep:deep};
  })();
