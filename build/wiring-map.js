  /* ---------- the wiring map ----------
     WM holds one drawing per schematic (built by wiring_map.py): the SVG, its parts and which parts each run joins.
     Tap a wire or its tag for that run, a part for everything that lands on it; the layer chips, the stepper and the
     wire-color switch work on whatever is showing. Out of the box swaps in the factory harness on the same layout
     (WM[key].fac, from factory-data.json), and Show the change plays it turning into the schematic's own wiring. */
  var WM=%%WIRING_MAPS%%;
  var MAP=(function(){
    var LAYERS=[['all','All',null],['line','Line and heater','var(--w-l)'],['N','Neutral','var(--w-n)'],['E','Earth','var(--w-e)'],['lv','Low voltage','var(--w-lv)'],['lmp','Lamp leads','var(--w-lmp)'],['opt','Optional','var(--w-opt)']];
    var SYSC={L:'var(--w-l)',H:'var(--w-h)',N:'var(--w-n)',E:'var(--w-e)',LV:'var(--w-lv)',LVG:'var(--w-lvg)',S:'var(--w-s)',LMP:'var(--w-lmp)'};
    var SYSN={L:'Line',H:'Heater line',N:'Neutral',E:'Earth',LV:'Low voltage: switch signal or SSR control',LVG:'Low voltage: ground for the switches or SSR',S:'Sensor or screen cable',LMP:'Lamp lead'};
    var PK='gaggia-wiring-map-v1',key=null,v=null,mp=null,svg=null,layer='all',sel=null,wcol=false,order=[],showOpt=false;
    /* view: mine (the schematic's own wiring) or box (out of the box); drawn: what #mscroll holds now */
    var view='mine',drawn=null,realV=null,realMp=null;
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
      if(l==='lmp')return s==='LMP';
      return s===l;
    }
    function lenTxt(r){return r.mm?r.mm+' mm':(r.stock?'Stock lead, no length to cut':'Measure on your machine')}
    /* the order the list uses, so the stepper walks the runs the way the page lists them */
    function listOrder(){
      var rs=v.runs.filter(function(r){return showOpt||!r.opt});
      if(v.path==='F'){var fo=[];['L','H','N','E','LMP'].forEach(function(s){rs.forEach(function(r){if(r.sys===s)fo.push(r.id)})});return fo}
      if(v.path==='SI')return rs.filter(function(r){return r.sys!=='LV'&&r.sys!=='LVG'}).concat(rs.filter(function(r){return r.sys==='LV'||r.sys==='LVG'})).map(function(r){return r.id});
      var out=[];['L','H','N','E','LV'].forEach(function(s){rs.forEach(function(r){if(s==='LV'?(r.sys==='LV'||r.sys==='LVG'):r.sys===s)out.push(r.id)})});
      return out;
    }
    /* the factory harness for a schematic (the Shelly maps share their base's) */
    function facOf(k){var f=WM[k]&&WM[k].fac;if(f&&f.same)f=WM[f.same]&&WM[f.same].fac;return f||null}
    function cname(c){return {yellowgreen:'yellow-green',lightblue:'light blue'}[c]||c}
    function lc1(t){return t.charAt(0).toLowerCase()+t.slice(1)}
    function boxV(k){var f=facOf(k);return {key:k,path:'F',fam:VARS[k].fam,volts:VARS[k].volts,cables:[],runs:Object.keys(f.runs).map(function(id){var r=f.runs[id];return {id:id,sys:r.sys,color:r.color,frm:r.frm,to:r.to,what:r.what,lab:r.lab||['',''],factory:true}})}}
    function show(k,opt){
      showOpt=!!opt;
      var f=facOf(k);if(!f&&view==='box')view='mine';
      var want=k+'|'+view;
      if(want!==drawn){
        stopAnim();drawn=want;key=k;realV=VARS[k];realMp=WM[k];sel=null;layer='all';
        if(view==='box'){v=boxV(k);mp={svg:f.svg,parts:f.parts,ends:f.ends,cables:{}}}else{v=realV;mp=realMp}
        el('mscroll').innerHTML=mp?mp.svg:'';svg=el('mscroll').querySelector('svg');
      }
      order=listOrder();
      el('mapsec').hidden=!realMp;
      el('mcapsi').hidden=!(v&&v.path==='SI');
      viewUI();
      if(mp)paint();
    }
    /* the Your wiring / Out of the box switch, the play button and the line under them */
    function viewUI(){
      var f=key&&facOf(key),box=view==='box';
      var fn=!f&&key&&WM[key]&&WM[key].facnote;
      el('mview').hidden=!f&&!fn;
      el('mview').querySelector('.mseg2').hidden=!f;
      Array.prototype.forEach.call(document.querySelectorAll('[data-mview]'),function(b){b.setAttribute('aria-pressed',String(b.getAttribute('data-mview')===view&&!A))});
      el('m-play').hidden=!f||!box||!!A;
      var n=el('mview-note');
      if(!f){n.innerHTML=fn?esc(fn.text)+(fn.src?' <a href="'+esc(fn.src)+'" target="_blank" rel="noopener">'+esc(fn.srcname)+'</a>.':''):'';return}
      var nj=Object.keys(f.parts).filter(function(p){return /^J\d+$/.test(p)}).length;
      if(box){
        n.innerHTML='As it leaves the factory: '+Object.keys(f.runs).length+' wires'+(nj?' and '+nj+' crimp splices':'')+', traced from '+(f.src?'<a href="'+esc(f.src)+'" target="_blank" rel="noopener">'+esc(f.srcname)+'</a>':esc(f.srcname))+'. Colors are that drawing\'s; the docs note they vary by year and model. '+(f.noearth?esc(f.noearth)+' ':'')+(realV.fam==='GCP'&&/^(EVO|E24)$/.test(((GM()&&GM().get())||{}).model||'')?'That drawing is of the Classic Pro: on most Evo Pros and E24s each switch\'s connectors sit together in one block, and the colors may differ. ':'')+(realV.path==='SI'?'Show the change takes off only what this stock-wiring install changes.':'Show the change swaps it for the Plug-and-Play harness.');}
      else n.textContent='Out of the box shows how this machine is wired before the install, and plays the change.';
      var fc=el('mfigcap');if(fc){if(fc._t==null)fc._t=fc.innerHTML;fc.innerHTML=box?'Drawn on the same layout as this schematic\'s map, so each part sits where it will be after the install. Thick lines carry mains; nothing runs at low voltage until the install adds it. '+(nj?'A factory crimp splice joins several wires in one sleeve. ':'Where two wires meet, they share one connector on a spade. ')+'The factory drawing is the reference; yours may differ by year and model.':fc._t}
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
      el('m-step').textContent=i>=0?(i+1)+' of '+order.length:order.length+(v.path==='F'?' wires':' runs');
      legend();detail();summary();
    }
    /* one line above the map, so on a phone the pick shows without scrolling down to the card */
    function summary(){
      var e=el('msel'),r=sel&&sel.t==='run'?runOf(sel.id):null;
      if(!sel){e.textContent='';return}
      if(sel.t==='set'){e.innerHTML=(sel.label?'<span class="rt">'+esc(sel.label)+'</span>: ':'')+sel.ids.map(function(id){return '<b>'+esc(id)+'</b>'}).join(' ');return}
      if(sel.t==='part'){var p=mp.parts[sel.id]||{name:sel.id},n=Object.keys(mp.ends).filter(function(id){return ends(id).indexOf(sel.id)>=0}).length;e.innerHTML='<span class="rt">'+esc(p.name)+'</span>: '+(n?n+(n===1?' run lands here':' runs land here'):'nothing new connects here');return}
      if(!r){e.innerHTML='<b>'+esc(sel.id)+'</b><span class="rt">'+esc((mp.cables||{})[sel.id]||'')+'</span>';return}
      if(r.factory){e.innerHTML='<b>'+esc(r.id)+'</b><span class="rt">'+esc(r.frm+' → '+r.to)+'</span> · factory wire, '+esc(cname(r.color));return}
      e.innerHTML='<b>'+esc(r.id)+'</b><span class="rt">'+esc(r.short||(r.frm+' → '+r.to))+'</span> · '+esc(lenTxt(r));
    }
    function legend(){
      var h;
      if(v.path==='F'){
        h=wcol?'<span><i class="c" style="background:#7A4A2A"></i>The factory drawing\'s wire colors</span>':[['L','Line'],['H','Heater circuit, through the thermostats'],['N','Neutral'],['E','Earth'],['LMP','Lamp lead']].filter(function(x){return v.runs.some(function(r){return r.sys===x[0]})}).map(function(x){return '<span><i class="lg-'+x[0]+'"></i>'+x[1]+'</span>'}).join('');
        el('mlegend').innerHTML=h+(Object.keys(mp.parts).some(function(p){return /^J\d+$/.test(p)})?'<span><i class="lg-fsp"></i>Factory crimp splice</span>':'');return;
      }
      if(wcol)h='<span><i class="c" style="background:#C2412F"></i>The drawing\'s own wire colors, as listed for each run</span>';
      else h=[['L','Line'],['H','Heater line'],['N','Neutral'],['E','Earth'],['LV','Switch signal, SSR control'],['LVG','Low-voltage ground']].map(function(x){return '<span><i class="lg-'+x[0]+'"></i>'+x[1]+'</span>'}).join('')+(mp&&mp.cables&&Object.keys(mp.cables).length?'<span><i class="lg-S"></i>Sensor and screen cables</span>':'');
      if(v.path==='SI')h+='<span><i class="lg-stk0"></i>Stock lead that stays on its spade</span><span><i class="lg-stk"></i>Where a moved or parked stock connector came off</span>';
      if(v.runs.some(function(r){return r.opt}))h+='<span><i style="border-top-style:dashed"></i>Optional run</span>';
      el('mlegend').innerHTML=h;
    }
    /* the card, then the back-links: where else the site covers what's picked (wiring-refs.js) */
    function detail(){
      detail0();
      if(!sel||typeof REFS==='undefined'||v.path==='F')return;
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
        var pi=typeof partInfo==='function'&&v.path!=='F'?partInfo(sel.id,realV):null;
        if(v.path==='F'){
          d.innerHTML='<div class="d-head"><span class="d-route">'+esc(p.name)+'</span>'+acts+'</div>'+(p.note?'<p class="d-what">'+esc(p.note)+'</p>':'')+
            (ids.length?'<div><span class="k">'+ids.length+(ids.length===1?' factory wire lands':' factory wires land')+' here</span><div class="ids" style="margin-top:4px">'+ids.map(function(id){return '<button type="button" data-mrun="'+esc(id)+'">'+esc(id)+'</button>'}).join('')+'</div></div>':'<p style="color:var(--muted)">No factory wire lands here.</p>');
          return;
        }
        d.innerHTML='<div class="d-head"><span class="d-route">'+esc(p.name)+'</span>'+acts+'</div>'+(pi?'<p class="d-what">'+esc(pi.w)+'</p>'+(pi.p?'<p class="d-pcb"><span class="k">With Gaggiuino</span> '+esc(pi.p)+'</p>':''):'')+(p.note?'<p>'+esc(p.note.charAt(0).toUpperCase()+p.note.slice(1))+'.</p>':'')+
          (ids.length?'<div><span class="k">'+ids.length+(ids.length===1?' run lands':' runs land')+' here</span><div class="ids" style="margin-top:4px">'+ids.map(function(id){return '<button type="button" data-mrun="'+esc(id)+'"'+(isOpt(id)?' class="o" title="Optional run"':'')+'>'+id+(isOpt(id)?' · optional':'')+'</button>'}).join('')+'</div></div>':'<p style="color:var(--muted)">Nothing new connects here; it\'s drawn so you can find your way around.</p>');
        return;
      }
      var r=runOf(sel.id);
      if(r&&r.factory){
        var fz=facOf(key),goes=fz.go.indexOf(r.id)>=0,lab=(r.lab||[]).filter(Boolean),mv=lab.filter(function(l){return (fz.moves||[]).indexOf(l)>=0});
        d.className='mdetail';d.style.borderLeftColor=SYSC[r.sys]||'var(--accent)';
        d.innerHTML='<div class="d-head"><span class="d-id">'+esc(r.id)+'</span><span class="d-route">'+esc(r.frm)+' → '+esc(r.to)+'</span>'+acts.replace(/<a [^>]*>Show in the list<\/a>/,'')+'</div>'+
          '<div class="d-grid"><div><span class="k">Circuit</span><span><span class="sysdot" style="background:'+(SYSC[r.sys]||'var(--muted)')+'"></span>'+esc(r.sys==='H'?'Heater circuit':SYSN[r.sys]||r.sys)+'</span></div>'+
          '<div><span class="k">Factory color</span><span>'+swatch(r.color)+esc(cname(r.color))+'</span></div>'+
          '<div><span class="k">With this install</span><span>'+(realV.path==='SI'?(goes?'Its '+esc(mv.join(' and '))+(mv.length>1?' ends come':' end comes')+' off':'Stays as it is'):'Comes out: the new harness replaces it')+'</span></div></div>'+
          (r.what?'<p>'+esc(r.what)+'.</p>':'')+(lab.length?'<p style="color:var(--muted)">In the stock wiring guide: '+[0,1].filter(function(i){return r.lab[i]}).map(function(i){return esc(r.lab[i])+' is its end at '+esc(lc1(i?r.to:r.frm))}).join('; ')+'.</p>':'');
        return;
      }
      if(!r){
        var nm=(mp.cables||{})[sel.id]||sel.id,pins=(v.cables||[]).filter(function(c){return (sel.id==='TC'&&/Thermocouple/.test(c.frm))||(sel.id==='PS'&&/Pressure/.test(c.frm))||(sel.id==='SCR'&&/J1/.test(c.frm+c.to))});
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
        '<div><span class="k">'+(r.lab&&r.lab[0]?esc(r.lab[0])+' at ':'End at ')+esc(r.frm)+'</span><span>'+esc((r.ends||[])[0]||'—')+'</span></div>'+
        '<div><span class="k">'+(r.lab&&r.lab[1]?esc(r.lab[1])+' at ':'End at ')+esc(r.to)+'</span><span>'+esc((r.ends||[])[1]||'—')+'</span></div>'+
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
      el('mview').addEventListener('click',function(e){
        var b=e.target.closest('[data-mview]');if(b){var w=b.getAttribute('data-mview');if(w!==view||A){view=w;drawn=null;show(key,showOpt)}return}
        if(e.target.closest('#m-play'))play();
      });
      el('mctl').addEventListener('click',function(e){
        var b=e.target.closest('button');if(!b||!A)return;
        if(b.id==='ma-pause'){A.paused=!A.paused;ctlUI()}
        else if(b.id==='ma-replay')play();
        else if(b.id==='ma-skip'){A.t=A.end;A.paused=false}
        else if(b.id==='ma-done'){view='mine';drawn=null;show(key,showOpt)}
        else if(b.hasAttribute('data-speed')){A.speed=Number(b.getAttribute('data-speed'))||1;ctlUI()}
      });
    }
    /* from the list: show one run on the map */
    function focus(id){if(!mp)return;pickRun(id,false);el('mapsec').scrollIntoView({behavior:'smooth',block:'start'})}
    function hasRun(id){return !!(svg&&svg.querySelector('.run[data-run="'+id+'"]'))}
    function hasPart(id){return !!(svg&&svg.querySelector('.part[data-part="'+id+'"]'))}
    /* a link from another page (see maplink.js): run=TC, part=ssr (| between alternatives, the first on this drawing wins),
       runs=L1a-L1b,LV1 or short=J9 R1,J9 GND (every run whose name starts that way) for a set, layer=E for a layer.
       Returns false when nothing it asked for is on this drawing; the whole map shows instead. */
    function deep(q){
      if(view!=='mine'){view='mine';show(key,showOpt)}
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
    /* ---------- Show the change ----------
       One stage holds both drawings on the same layout: the factory harness on top of the schematic's own parts and
       runs. A small timeline (seconds at 1x) unplugs the factory wires that go, swaps the parts, draws the new runs in
       circuit by circuit and ends on the finished map. On stock wiring only what the install changes comes off; the
       factory wires that stay dim and remain. Reduced motion gets the same steps as fades. */
    var A=null,NS='http://www.w3.org/2000/svg';
    function reduced(){try{return window.matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){return false}}
    function stopAnim(){
      if(!A)return;
      cancelAnimationFrame(A.raf);A=null;
      var sc=el('mscroll');sc.classList.remove('fit');el('mctl').hidden=true;el('ma-cap').hidden=true;el('mapsec').classList.remove('animating');
    }
    function ctlUI(){
      if(!A)return;
      var done=A.t>=A.end;
      el('ma-pause').hidden=done;el('ma-pause').textContent=A.paused?'Play':'Pause';el('ma-pause').setAttribute('aria-pressed',String(A.paused));
      el('ma-skip').hidden=done;el('ma-done').hidden=!done;
      Array.prototype.forEach.call(el('mctl').querySelectorAll('[data-speed]'),function(b){b.setAttribute('aria-pressed',String(Number(b.getAttribute('data-speed'))===A.speed))});
    }
    function ease(p){return p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2}
    function clamp(p){return p<0?0:p>1?1:p}
    function mk(tag,attrs,parent){var n=document.createElementNS(NS,tag);for(var k in attrs)n.setAttribute(k,attrs[k]);if(parent)parent.appendChild(n);return n}
    /* a part's box, from its tap target */
    function boxOf(g){var h=g.querySelector('.phit');if(!h)return null;var x=+h.getAttribute('x'),y=+h.getAttribute('y'),w=+h.getAttribute('width'),hh=+h.getAttribute('height');return {x:x,y:y,w:w,h:hh,cx:x+w/2,cy:y+hh/2}}
    function setScale(g,b,k){if(b)g.setAttribute('transform','translate('+b.cx+' '+b.cy+') scale('+k+') translate('+(-b.cx)+' '+(-b.cy)+')')}
    function play(){
      var f=facOf(key);if(!f)return;
      stopAnim();
      var sc=el('mscroll'),T=WM[key],SI=realV.path==='SI',RM=reduced();
      var P=new DOMParser(),fs=P.parseFromString(f.svg,'image/svg+xml').documentElement,ts=P.parseFromString(T.svg,'image/svg+xml').documentElement;
      var st=mk('svg',{viewBox:'0 0 1400 900','class':'dia stage'+(wcol?' wcol':''),role:'img','aria-label':'The factory wiring turning into '+(realV.name||'this schematic')});
      var defs=mk('defs',{},st),fl=mk('filter',{id:'ma-glow',x:'-50%',y:'-50%',width:'200%',height:'200%'},defs);mk('feGaussianBlur',{stdDeviation:'3.2'},fl);
      var gTP=mk('g',{'class':'st-tp'},st),gFP=mk('g',{'class':'st-fp'},st),gST=mk('g',{'class':'st-stk'},st),gFW=mk('g',{'class':'st-fw'},st),gTW=mk('g',{'class':'st-tw'},st),gTG=mk('g',{'class':'st-tg'},st),gFX=mk('g',{'class':'st-fx'},st);
      function imp(n,parent){var c=document.importNode(n,true);parent.appendChild(c);return c}
      var fparts={},tparts={};
      Array.prototype.forEach.call(ts.querySelectorAll('.parts > .part'),function(g){tparts[g.getAttribute('data-part')]=imp(g,gTP)});
      Array.prototype.forEach.call(fs.querySelectorAll('.parts > .part'),function(g){fparts[g.getAttribute('data-part')]=imp(g,gFP)});
      var stk=[];Array.prototype.forEach.call(ts.querySelectorAll('.stocks > path'),function(pth){stk.push(imp(pth,gST))});
      var fw={},tw=[],tags={};
      Array.prototype.forEach.call(fs.querySelectorAll('.wires > .run'),function(g){fw[g.getAttribute('data-run')]=imp(g,gFW)});
      Array.prototype.forEach.call(ts.querySelectorAll('.wires > .run'),function(g){tw.push(imp(g,gTW))});
      Array.prototype.forEach.call(ts.querySelectorAll('.tags > .tag'),function(g){tags[g.getAttribute('data-run')]=imp(g,gTG)});
      sc.innerHTML='';sc.appendChild(st);sc.classList.add('fit');sc.scrollLeft=0;svg=null;el('mapsec').classList.add('animating');
      el('m-play').hidden=true;el('mctl').hidden=false;el('ma-cap').hidden=false;
      Array.prototype.forEach.call(document.querySelectorAll('[data-mview]'),function(b){b.setAttribute('aria-pressed','false')});
      /* starting frame: only the factory drawing */
      Object.keys(tparts).forEach(function(id){tparts[id].style.opacity=0});
      stk.forEach(function(pth){pth.style.opacity=0});
      Object.keys(tags).forEach(function(id){tags[id].style.opacity=0});
      /* every stroke keeps its own length: a cable's legs differ */
      function plen(pth){if(pth._L==null){try{pth._L=pth.getTotalLength()}catch(e){pth._L=400}}return pth._L}
      function strokes(g){return Array.prototype.slice.call(g.querySelectorAll('.case,.wire,.halo'))}
      function lenOf(g){var m=0;Array.prototype.forEach.call(g.querySelectorAll('.wire'),function(w){m=Math.max(m,plen(w))});return m||400}
      function dash(pth,frac,sign){var L=plen(pth);pth.style.strokeDasharray=L+' '+L;pth.style.strokeDashoffset=sign*L*frac}
      tw.forEach(function(g){g._L=lenOf(g);strokes(g).forEach(function(pth){dash(pth,1,1)});if(RM)g.style.opacity=0});
      var tl=[],cap=[];
      function at(s,d,fn){tl.push({s:s,d:Math.max(d,.001),fn:fn,p:-1})}
      function say(s,txt){cap.push({s:s,txt:txt})}
      var colOf=function(g){return wcol?(g.style.getPropertyValue('--wc')||'#888'):(SYSC[(/ s-([A-Z]+)/.exec(' '+g.getAttribute('class'))||[])[1]]||'var(--accent)')};
      function comet(g,c){var k=mk('g',{'class':'ma-comet'},gFX);mk('circle',{r:'7','class':'mc-glow',filter:'url(#ma-glow)',style:'fill:'+c},k);mk('circle',{r:'2.6','class':'mc-core'},k);k.style.opacity=0;return k}
      function ring(x,y,c,s,big){var n=null;at(s,.55,function(p){if(!n)n=mk('circle',{cx:x,cy:y,r:'4','class':'ma-ring',style:'stroke:'+c},gFX);n.setAttribute('r',4+(big?22:12)*ease(p));n.style.opacity=(1-p)*.9;if(p>=1&&n.parentNode)n.parentNode.removeChild(n)})}
      /* a wire leaves: it lights, then unzips from the end that lets go */
      function wireOut(g,s,fromB){
        var L=lenOf(g),ps=strokes(g),halo=g.querySelector('.halo'),wire=g.querySelector('.wire'),c=colOf(g),k=null;
        if(RM){at(s,.4,function(p){g.style.opacity=1-p});return}
        at(s,.3,function(p){halo.style.stroke=c;halo.style.opacity=.45*p});
        at(s+.3,.6,function(p){
          var e=ease(p);ps.forEach(function(pth){dash(pth,e,fromB?1:-1)});
          if(!k)k=comet(g,c);var pt=wire.getPointAtLength(fromB?L*(1-e):L*e);k.setAttribute('transform','translate('+pt.x+' '+pt.y+')');k.style.opacity=p<.95?1:0;
          if(p>=1){g.style.opacity=0;if(k.parentNode)k.parentNode.removeChild(k)}
        });
        try{var q=wire.getPointAtLength(fromB?0:L);ring(q.x,q.y,c,s+.88,false)}catch(e){}
      }
      /* a run arrives: drawn from its first end with a bright head, then a pulse where it lands */
      function wireIn(g,s){
        var L=plen(g.querySelector('.wire')),ps=strokes(g),wire=g.querySelector('.wire'),c=colOf(g),k=null,dur=Math.min(1.1,.45+g._L/1400),id=g.getAttribute('data-run');
        if(RM){at(s,.5,function(p){g.style.opacity=p;if(p>=1)ps.forEach(function(pth){pth.style.strokeDasharray='';pth.style.strokeDashoffset=''});if(tags[id])tags[id].style.opacity=p});return s+.5}
        at(s,dur,function(p){
          var e=ease(p);ps.forEach(function(pth){pth.style.strokeDashoffset=plen(pth)*(1-e)});
          if(!k)k=comet(g,c);var pt=wire.getPointAtLength(L*e);k.setAttribute('transform','translate('+pt.x+' '+pt.y+')');k.style.opacity=p<.97?1:0;
          if(p>=1){ps.forEach(function(pth){pth.style.strokeDasharray='';pth.style.strokeDashoffset=''});if(k.parentNode)k.parentNode.removeChild(k)}
        });
        try{var q=wire.getPointAtLength(L);ring(q.x,q.y,c,s+dur-.05,false)}catch(e){}
        if(tags[id])at(s+dur*.6,.35,function(p){tags[id].style.opacity=p});
        return s+dur;
      }
      function partOut(g,s,d){var b=boxOf(g);at(s,d,function(p){var e=ease(p);g.style.opacity=1-e;if(!RM)setScale(g,b,1-.12*e)})}
      function partIn(g,s,d,ringIt){var b=boxOf(g);if(!RM)setScale(g,b,.9);at(s,d,function(p){var e=ease(p);g.style.opacity=e;if(!RM)setScale(g,b,.9+.1*e)});if(ringIt&&b&&!RM){var n=null;at(s+d*.4,.7,function(p){if(!n)n=mk('rect',{x:b.x,y:b.y,width:b.w,height:b.h,rx:'10','class':'ma-pring'},gFX);var gr=10*ease(p);n.setAttribute('x',b.x-gr);n.setAttribute('y',b.y-gr);n.setAttribute('width',b.w+2*gr);n.setAttribute('height',b.h+2*gr);n.style.opacity=(1-p)*.85;if(p>=1&&n.parentNode)n.parentNode.removeChild(n)})}}
      function fade(g,s,d,a,b2){at(s,d,function(p){g.style.opacity=a+(b2-a)*ease(p)})}
      /* ---- the script ---- */
      var t=0,nGo=f.go.length,nT=tw.length;
      say(0,'Out of the box: '+Object.keys(f.runs).length+' factory wires');
      t=1.0;
      var stayIds=f.stay||[],keep=f.keep||[];
      if(SI){
        say(t,'This install changes '+nGo+' of them; the rest stay');
        stayIds.forEach(function(id){var g=fw[id];if(g)at(t,.6,function(p){g.classList.toggle('st-stay',p>0);g.style.opacity=1-.5*ease(p)})});
        keep.forEach(function(id){if(fparts[id])fade(fparts[id],t,.6,1,.45)});
        t+=.9;
      }
      say(t,SI?'Unplugging the stock connectors that move':'Unplugging the factory harness');
      /* leave in a sweep, top left to bottom right; on stock wiring each lets go at its stock connector's end */
      var goes=f.go.map(function(id){var g=fw[id],b=null;try{b=g.querySelector('.wire').getBBox()}catch(e){}return {id:id,g:g,k:b?(b.x+b.width/2)+(b.y+b.height/2)*1.2:0}}).filter(function(x){return x.g}).sort(function(a,b){return a.k-b.k});
      var step=RM?0:Math.min(.09,2.6/Math.max(1,goes.length));
      goes.forEach(function(x,i){var r=f.runs[x.id],lab=r.lab||['',''],fromB=SI?!!lab[1]&&!lab[0]:false;wireOut(x.g,t+i*step,fromB)});
      t+=goes.length*step+(RM?.5:1.0);
      /* parts: factory-only parts that leave go first, then the new ones arrive */
      var outs=(f.out||[]).filter(function(id){return fparts[id]});
      var common=Object.keys(fparts).filter(function(id){return tparts[id]});
      var ins=Object.keys(tparts).filter(function(id){return !fparts[id]});
      var rank=function(id){return ({pcb:0,screen:1,ssr:2,tc:3,psens:4,rf:5,shelly:6})[id]!==undefined?({pcb:0,screen:1,ssr:2,tc:3,psens:4,rf:5,shelly:6})[id]:7};
      ins.sort(function(a,b){return rank(a)-rank(b)});
      if(outs.length){say(t,SI?'The brew thermostat comes out':'Out: the thermostats'+(outs.some(function(id){return /^J/.test(id)})?' and the factory splices':''));outs.forEach(function(id,i){partOut(fparts[id],t+i*(RM?0:.08),.6)});t+=.6+outs.length*(RM?0:.08)+.2}
      common.forEach(function(id){fade(tparts[id],t,.6,0,1);fade(fparts[id],t,.6,1,0)});
      say(t,'In: '+(ins.indexOf('pcb')>=0?'the Gaggiuino PCB':'the new parts')+(ins.indexOf('ssr')>=0?', SSR':'')+(ins.indexOf('tc')>=0?', thermocouple':'')+(ins.indexOf('rf')>=0?', 185 °C fuse':'')+(SI?' and the moved stock connectors':''));
      ins.forEach(function(id,i){partIn(tparts[id],t+i*(RM?0:.1),.55,['pcb','screen','ssr','tc','psens','rf','shelly'].indexOf(id)>=0)});
      t+=.55+ins.length*(RM?0:.1)+.3;
      /* runs, circuit by circuit */
      var GROUPS=[['L','Line'],['H','Heater line'],['N','Neutral'],['E','Earth'],['LV','Low voltage'],['S','Sensor and screen cables']];
      var bySys={};tw.forEach(function(g){var m=/ s-([A-Z]+)/.exec(' '+g.getAttribute('class'));var s2=m?m[1]:'S';if(s2==='LVG')s2='LV';(bySys[s2]=bySys[s2]||[]).push(g)});
      var label=SI?'Wiring in the stock wiring integration':'Wiring in the Plug-and-Play harness';
      GROUPS.forEach(function(gr){
        var list=bySys[gr[0]];if(!list||!list.length)return;
        say(t,label+': '+gr[1].toLowerCase());
        var gap=RM?0:Math.min(.13,2/list.length),last=t;
        list.forEach(function(g,i){var endT=wireIn(g,t+i*gap);last=Math.max(last,endT)});
        t=(RM?last:t+list.length*gap+.45)+.1;
      });
      if(stk.length){say(t,'Dashed: where each moved stock connector came off');stk.forEach(function(pth){fade(pth,t,.6,0,1)});t+=.8}
      /* the whole thing lights once, then rests */
      if(!RM)at(t,1.8,function(p){st.classList.toggle('flowing',p>0&&p<1)});
      var nRun=tw.filter(function(g){return !/\bcab\b/.test(g.getAttribute('class'))}).length;
      say(t,'Your wiring: '+nRun+' runs'+(nRun<nT?' and the sensor and screen cables':'')+(SI?'. Grey: the factory wires that stay':''));
      t+=RM?.5:1.9;
      tl.sort(function(a,b){return a.s-b.s});cap.sort(function(a,b){return a.s-b.s});
      A={t:0,end:t,tl:tl,cap:cap,paused:false,speed:A&&A.speed||1,last:null,raf:0,ci:-1,stage:st};
      ctlUI();
      function frame(now){
        if(!A)return;
        var dt=A.last==null?0:Math.min(.1,(now-A.last)/1000);A.last=now;
        if(!A.paused)A.t=Math.min(A.end,A.t+dt*A.speed);
        for(var i=0;i<A.tl.length;i++){var it=A.tl[i];if(it.s>A.t)break;var p=clamp((A.t-it.s)/it.d);if(p!==it.p){it.p=p;it.fn(p)}}
        var ci=-1;for(var j=0;j<A.cap.length;j++)if(A.cap[j].s<=A.t)ci=j;
        if(ci!==A.ci){A.ci=ci;el('ma-cap').textContent=ci>=0?A.cap[ci].txt:''}
        el('ma-bar').style.width=(100*A.t/A.end).toFixed(1)+'%';
        if(A.t>=A.end){ctlUI();return}
        A.raf=requestAnimationFrame(frame);
      }
      A.raf=requestAnimationFrame(frame);
      viewUI();
    }
    return {show:show,init:init,focus:focus,deep:deep};
  })();
