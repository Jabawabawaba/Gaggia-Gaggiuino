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
    /* New hardware: every wire and tag hidden, the parts the install adds lit, the stock parts left in place */
    var nhw=false,NEWHW=['pcb','screen','ssr','tc','psens','rf','shelly','encl'];
    function nhwIds(){return mp&&view==='mine'?NEWHW.filter(function(p){return mp.parts[p]&&hasPart(p)}):[]}
    /* What stays: on the Out of the box drawing, the factory wires and parts the install keeps, everything that comes
       out hidden; with no factory drawing (230 V Pro), the stock leads and machine parts on your wiring's map */
    var stw=false,NOTSTAY=['x1a','x1b','n1a','l4b','sn','s6'];
    function stwOn(){return stw&&!A&&(view==='box'||!facOf(key))}
    function stwSets(){
      var f=view==='box'&&facOf(key),W={},P=[];
      if(f){
        var SI=realV.path==='SI';
        (f.stay||[]).forEach(function(id){W[id]='same'});
        if(SI)(f.go||[]).forEach(function(id){W[id]='end'});
        else Object.keys(f.becomes||{}).forEach(function(id){W[id]=f.becomes[id]?'end':'idle'});
        P=Object.keys(f.parts).filter(function(p){return (f.out||[]).indexOf(p)<0});
      }else if(mp){
        v.runs.forEach(function(r){if(r.stock&&hasRun(r.id))W[r.id]='end'});
        P=Object.keys(mp.parts).filter(function(p){return NEWHW.indexOf(p)<0&&NOTSTAY.indexOf(p)<0&&!/^f:/.test(p)&&hasPart(p)});
      }
      return {w:W,p:P,f:f};
    }
    /* End labels: with a wire, part, socket or layer picked, each lit run's own label sits on the wire just short of each
       end (Plug-and-Play: the official end label, e.g. G1d; elsewhere the run's ID at both ends) */
    function endLab(r,i){return (r&&r.lab&&r.lab[i])||(r&&r.id)||''}
    function endLabels(lit){
      var old=svg.querySelector('.elab');if(old)old.remove();
      if(!lit)return;
      var ns='http://www.w3.org/2000/svg',g=document.createElementNS(ns,'g'),h='',C=[],box=[];g.setAttribute('class','elab');g.setAttribute('aria-hidden','true');
      Object.keys(lit).forEach(function(id){
        if(!lit[id])return;
        var tg=svg.querySelector('.tag[data-run="'+id+'"]');if(tg){try{var tb=tg.getBBox();box.push([tb.x,tb.y,tb.x+tb.width,tb.y+tb.height])}catch(e){}}
        var w=svg.querySelector('.run[data-run="'+id+'"] .wire');if(!w||!w.getTotalLength)return;
        var r=runOf(id),L=w.getTotalLength();if(!L)return;
        [0,1].forEach(function(i){
          var t=endLab(r,i);if(!t)return;
          var d=Math.min(26,L*0.3),pt=w.getPointAtLength(i?L-d:d),wd=t.length*6+8;
          C.push({x:pt.x,y:pt.y,w:wd,t:t,pri:/^[A-Z0-9][A-Za-z0-9-]{0,7}$/.test(t)?0:1,wr:w,L:L,i:i});
        });
      });
      /* official-style labels first. Two plugs on one spot (a piggyback) share a label: "N1f + X1c". A label that would
         overlap one already placed, or a wire's own tag, slides along its wire, then steps to one side of it; it's
         only left out when nothing fits */
      C.sort(function(a,b){return a.pri-b.pri});
      var P=[],hit=function(c){var b=[c.x-c.w/2-1.5,c.y-6.5,c.x+c.w/2+1.5,c.y+6.5];return box.some(function(o){return b[0]<o[2]&&b[2]>o[0]&&b[1]<o[3]&&b[3]>o[1]})?null:b};
      C.forEach(function(c){
        var near=P.filter(function(q){return Math.abs(q.x0-c.x)<5&&Math.abs(q.y0-c.y)<5})[0];
        if(near){if(near.t.split(' + ').indexOf(c.t)<0&&c.pri===0&&near.pri===0){near.t+=' + '+c.t;near.w=near.t.length*6+8}return}
        /* the same end twice, a little apart (three legs at one splice, two leads off one lamp): one label does */
        if(P.some(function(q){return q.t===c.t&&Math.abs(q.x0-c.x)<60&&Math.abs(q.y0-c.y)<60}))return;
        c.x0=c.x;c.y0=c.y;
        var b=hit(c),k,ds=[40,54,68,82],off=[[0,-15],[0,15],[-c.w/2-10,0],[c.w/2+10,0],[0,-29],[0,29]];
        for(k=0;!b&&k<ds.length;k++){
          if(ds[k]>c.L*0.46)break;
          var p=c.wr.getPointAtLength(c.i?c.L-ds[k]:ds[k]);b=hit({x:p.x,y:p.y,w:c.w});if(b){c.x=p.x;c.y=p.y}
        }
        for(k=0;!b&&k<off.length;k++){b=hit({x:c.x0+off[k][0],y:c.y0+off[k][1],w:c.w});if(b){c.x=c.x0+off[k][0];c.y=c.y0+off[k][1]}}
        if(!b)return;
        box.push(b);P.push(c);
      });
      P.forEach(function(c){
        h+='<g transform="translate('+c.x.toFixed(1)+','+c.y.toFixed(1)+')"><rect x="'+(-c.w/2)+'" y="-6" width="'+c.w+'" height="12" rx="3"/><text y="3.6" text-anchor="middle">'+esc(c.t)+'</text></g>';
      });
      g.innerHTML=h;svg.appendChild(g);
    }
    /* The wire picker: every run on the drawing in the runbook's install order, grouped by step, as a dropdown that
       doubles as a walkthrough (the arrows follow the same order). Out of the box lists the factory wires. */
    var pick=null;
    /* Whole wires: the official harness is made as assemblies (L4 is one piece with three legs), drawn here leg by leg.
       asmOf groups the legs back up: L4a-L4b, L4a-L4c and L4d-L4c are all "L4"; the J7 and J9 leads group by socket. */
    var ASMN={J7:'J7 switch cable',J9:'J9 SSR control leads'},ASMW={X1:'the lamp leads',P2:'the pump fuse leads'};
    function asmKey(id){
      var r=runOf(id),m,k=null;if(!r)return null;
      String(id).split('-').some(function(t){m=/^([A-Z]{1,2}\d)[a-z]$/.exec(t);if(m)k=m[1];return !!m});
      if(!k&&/^LV\d/.test(id)){(r.term||[]).map(jOf).some(function(j){if(j&&ASMN[j])k=j;return !!k});if(!k)v.runs.some(function(o){if(o.id===id||!/^LV\d/.test(o.id)||!(o.term||[]).some(function(t){return (r.term||[]).indexOf(t)>=0}))return false;(o.term||[]).map(jOf).some(function(j){if(j&&ASMN[j])k=j;return !!k});return !!k})}
      return k;
    }
    function lcs2(t){return t.charAt(0).toUpperCase()+t.slice(1)}
    function asmIds(k){return order.filter(function(id){return asmKey(id)===k})}
    function asmName(k){return ASMN[k]||(k+', '+(ASMW[k]||'the whole wire'))}
    function pickAsm(k){var ids=asmIds(k);if(ids.length<2)return;nhw=false;flow=false;stw=false;sel={t:'set',ids:ids,label:asmName(k),asm:k};layer='all';paint();center()}
    function pickPlan(){
      var tw={},ids=Object.keys(realMp.ends);ids.forEach(function(id){tw[id]=1});
      var f=facOf(key),S={tw:tw,twOrder:ids,tparts:realMp.parts,fparts:f?f.parts:{}};
      var P=installPlan(S),ord=[];P.plan.forEach(function(g){g.runs.forEach(function(id){ord.push(id)})});
      return {plan:P.plan,rank:P.rank,order:ord};
    }
    function pickUI(){
      var w=el('m-wire');if(!w)return;
      var h='<option value="">Pick a wire…</option>',txt=function(id){var r=runOf(id);return id+' · '+(r?(r.short||(r.frm+' → '+r.to)):((mp.cables||{})[id]||''))};
      var seen={};
      if(view==='mine'&&pick){
        pick.plan.forEach(function(g){if(!g.runs.length)return;h+='<optgroup label="'+esc(g.s?stepName(g.s):'Other runs')+'">'+g.runs.map(function(id){var k=asmKey(id),n=k&&!seen[k]?asmIds(k).length:0;if(k)seen[k]=1;return (n>1?'<option value="asm:'+esc(k)+'">'+esc(ASMN[k]?ASMN[k]+' · all '+n+' wires':k+' · '+(ASMW[k]||'the whole wire')+', all '+n+' legs')+'</option>':'')+'<option value="'+esc(id)+'">'+esc(txt(id))+'</option>'}).join('')+'</optgroup>'});
      }else order.forEach(function(id){h+='<option value="'+esc(id)+'">'+esc(txt(id))+'</option>'});
      w.innerHTML=h;
      var lb=el('m-wire-l');if(lb)lb.textContent=view==='box'?'Factory wire':'Wire, in install order';
    }
    /* what was on a new run's ends out of the box: the factory wires whose ends this run takes over */
    function beforeOf(id){
      var rel=(WM[key]&&WM[key].rel)||{},f=facOf(key),out=[];if(!f)return null;
      Object.keys(rel).forEach(function(fid){(rel[fid].ends||[]).forEach(function(e){if((e.now||[]).indexOf(id)>=0)out.push({f:fid,t:e.t})})});
      return out;
    }
    function lcs(t){t=String(t);return /^[A-Z][a-z]/.test(t)?t.charAt(0).toLowerCase()+t.slice(1):t}
    function walkHtml(r){
      var h='',st=pick&&pick.rank[r.id]&&pick.rank[r.id].step,i=order.indexOf(r.id);
      if(view!=='mine')return '';
      if(st)h+='<p class="d-step"><span class="k">When</span> <a href="runbook.html#'+esc(st.id)+'">'+esc(stepName(st))+'</a>'+(i>=0?' <span style="color:var(--muted)">· wire '+(i+1)+' of '+order.length+' in install order</span>':'')+'</p>';
      var b=r.cable?null:beforeOf(r.id),f=facOf(key);
      if(b){
        var by={};b.forEach(function(x){(by[x.t]=by[x.t]||[]).push(x.f)});
        var ks=Object.keys(by),fg=(realV.flags||[]).filter(function(x){return (r.term||[]).indexOf(String(x.id).toLowerCase())>=0});
        h+='<div class="d-ba"><div><span class="k">Before, out of the box</span>'+(ks.length?'<ul>'+ks.map(function(t){return '<li>At '+esc(lcs(t))+': '+by[t].map(function(fid){var fr=f.runs[fid]||{};return '<button type="button" class="rchip" data-mbox="'+esc(fid)+'" title="See it out of the box">'+esc(fid)+'</button> <span style="color:var(--muted)">'+esc((fr.frm||'')+' → '+(fr.to||''))+'</span>'}).join('; ')+'</li>'}).join('')+'</ul>':fg.length?'<ul>'+fg.map(function(x){return '<li>Stock connector '+esc(x.id)+': '+esc(String(x.l1||'').replace(/^stock:\s*/,''))+(x.hot?' (at the boiler)':'')+'</li>'}).join('')+'</ul>':'<p>Nothing sat on these ends at the factory. '+(r.stock?'This is the machine\'s own lead with a new end.':'It\'s a new connection, to a part the install adds or a spade that was empty.')+'</p>')+'</div>'+
          '<div><span class="k">After</span><ul><li>'+esc((r.lab&&r.lab[0]?r.lab[0]+' on ':'On ')+r.frm)+': '+esc(lcs((r.ends||[])[0]||'plugged in'))+'</li><li>'+esc((r.lab&&r.lab[1]?r.lab[1]+' on ':'On ')+r.to)+': '+esc(lcs((r.ends||[])[1]||'plugged in'))+'</li></ul></div></div>';
      }
      var ak=asmKey(r.id),an=ak?asmIds(ak).length:0;
      if(i>=0&&order.length>1)h+='<p class="d-walk">'+(an>1?'<button type="button" class="chip" data-masm="'+esc(ak)+'">'+esc(ASMN[ak]?'All of the '+ASMN[ak]:ASMW[ak]?'All of '+ASMW[ak]:'The whole '+ak+' wire')+'</button>':'')+'<button type="button" class="chip" data-mstep="-1">‹ Previous wire</button><button type="button" class="chip" data-mstep="1">Next wire ›</button></p>';
      return h;
    }
    /* Electricity flow: pick what the machine is doing and the map shows which wires carry current (moving dots, in
       the direction from line to neutral), which are live but carry none, and which parts are on. Plug-and-Play only. */
    var flow=false,fmode='on';
    function flowPick(){return typeof FLOWM!=='undefined'&&typeof FLOW!=='undefined'&&realV?FLOWM.pick(realV,facOf(key),view==='box'):null}
    function flowOK(){return !!flowPick()}
    function flowOn(){return flow&&!A&&flowOK()}
    function flowRes(){
      var P=flowPick();if(!P.modes.some(function(m){return m[0]===fmode}))fmode=P.modes[1][0];
      var M=P.model(fmode),Rz=FLOW.solve(M),parts={};
      /* on: a load with most of the supply across it, or a contact passing current (a fuse or thermostat counts only for a real load current) */
      Object.keys(Rz.loads).forEach(function(k){if(M.parts[k]&&Rz.loads[k]>0.3)parts[M.parts[k]]=1});
      Object.keys(Rz.sw).forEach(function(k){if(M.parts[k]&&(!(M.passive||{})[k]||Rz.sw[k]>0.02))parts[M.parts[k]]=1});
      M.closed.forEach(function(c){if(/^power/.test(c.id)&&M.parts[c.id])parts[M.parts[c.id]]=1});
      if(mp.parts.sock)parts.sock=1;
      return {P:P,M:M,R:Rz,parts:parts};
    }
    /* stock wiring: the map draws only what the install touches, so the factory wires go under it while the flow shows.
       They sit where they did out of the box; a moved connector's last stretch isn't redrawn. */
    function flowUnder(on){
      var old=svg.querySelector('.fxw');
      if(!on){if(old)old.remove();return}
      if(old)return;
      var f=facOf(key);if(!f||!f.svg)return;
      var tmp=document.createElement('div');tmp.innerHTML=f.svg;
      var g=document.createElementNS('http://www.w3.org/2000/svg','g');g.setAttribute('class','fxw');
      Array.prototype.forEach.call(tmp.querySelectorAll('.wires > .run'),function(r){var c=document.importNode(r,true);c.setAttribute('class',c.getAttribute('class').replace(/\brun\b/,'frun'));c.removeAttribute('tabindex');g.appendChild(c)});
      /* the factory crimp splices those wires meet at aren't on this map either */
      Array.prototype.forEach.call(tmp.querySelectorAll('.parts > .part'),function(r){if(!/^J\d+$/.test(r.getAttribute('data-part')||''))return;var c=document.importNode(r,true);c.setAttribute('class','fpart');g.appendChild(c)});
      var w=svg.querySelector('.wires');if(w)w.parentNode.insertBefore(g,w);else svg.appendChild(g);
    }
    function flowPaint(){
      var fo=flowOn(),FR=fo?flowRes():null,fb=el('m-flow'),bar=el('mflow');
      svg.classList.toggle('elec',fo);el('mapsec').classList.toggle('flowing',fo);
      if(fb){fb.hidden=!realMp||!flowOK();fb.setAttribute('aria-pressed',String(fo))}
      if(bar){bar.hidden=!fo;if(fo)bar.innerHTML='<span class="mj-k">The machine is</span>'+FR.P.modes.map(function(m){return '<button type="button" class="chip" data-mfm="'+m[0]+'" aria-pressed="'+(fmode===m[0])+'">'+esc(m[1])+'</button>'}).join('')}
      flowUnder(fo&&FR.M.kind==='stock');
      Array.prototype.forEach.call(svg.querySelectorAll('.run,.tag,.frun'),function(g){
        var id=g.getAttribute('data-run'),c=FR&&FR.R.cur[id],lv=FR&&FR.R.live[id],sig=FR&&FR.M.state.pw&&FR.M.kind!=='factory'&&!!(mp.cables||{})[id];
        g.classList.toggle('ecur',!!c);g.classList.toggle('erev',c===-1);g.classList.toggle('elive',!!lv&&!c);g.classList.toggle('ebig',!!c&&(FR.R.amp[id]||0)>0.02);
        if(fo){g.classList.toggle('off',!(c||lv||sig));g.classList.remove('sel')}
      });
      if(fo){
        svg.classList.add('dim');
        Array.prototype.forEach.call(svg.querySelectorAll('.part'),function(g){var id=g.getAttribute('data-part');g.classList.toggle('off',!FR.parts[id]);g.classList.remove('sel');g.classList.toggle('eon',!!FR.parts[id])});
        Array.prototype.forEach.call(svg.querySelectorAll('.stk'),function(g){g.classList.remove('on')});
      }else Array.prototype.forEach.call(svg.querySelectorAll('.part.eon'),function(g){g.classList.remove('eon')});
      if(FLOW.pulses){if(fo)FLOW.pulses(svg,FR.M,FR.R);else FLOW.pulses(svg)}
      return FR;
    }
    function flowCard(FR){
      var d=el('mdetail'),tx=FLOWM.text(FR.M,fmode),lab=FR.P.modes.filter(function(m){return m[0]===fmode})[0][1];
      var all=FR.M.runs.map(function(r){return r.id}),fz=facOf(key);
      function sysOf(id){var r=runOf(id)||(fz&&fz.runs&&fz.runs[id]);return r?r.sys:''}
      var cur=all.filter(function(id){return FR.R.cur[id]}),live=all.filter(function(id){return FR.R.live[id]&&!FR.R.cur[id]});
      var mains=cur.filter(function(id){var y=sysOf(id);return y!=='LV'&&y!=='LVG'}),lv=cur.filter(function(id){return mains.indexOf(id)<0});
      var pn=Object.keys(FR.parts).filter(function(p){return mp.parts[p]}).map(function(p){return mp.parts[p].name});
      function ids(a){return a.length?'<div class="ids eids">'+a.map(function(id){return '<span>'+esc(id)+'</span>'}).join('')+'</div>':'<span style="color:var(--muted)">None</span>'}
      d.className='mdetail';d.style.borderLeftColor='var(--accent)';
      d.innerHTML='<div class="d-head"><span class="d-route">Electricity flow: '+esc(lab)+'</span><span class="d-acts"><button type="button" class="chip" data-mflow>Back to the wiring</button></span></div>'+
        '<p class="d-what">'+esc(tx[0])+'</p><p>'+esc(tx[1])+'</p><p>'+esc(tx[2])+'</p>'+
        '<div class="d-grid stw-grid"><div><span class="k">Mains wires carrying current ('+mains.length+')</span>'+ids(mains)+'</div>'+
        (FR.M.kind==='factory'?'':'<div><span class="k">Low-voltage signals flowing ('+lv.length+')</span>'+ids(lv)+'</div>')+
        '<div><span class="k">Live at mains voltage, no current ('+live.length+')</span>'+ids(live)+'</div>'+
        '<div><span class="k">Parts on or passing current</span><span>'+(pn.length?esc(pn.join(', ')):'None')+'</span></div></div>'+
        (FR.M.kind==='stock'?'<p style="color:var(--muted)">F numbers are the machine\'s own factory wires, drawn where they sat out of the box (see Out of the box for each one). Where the install moved a stock connector, the last stretch of its wire isn\'t redrawn: the stock connector marks on the map show where it went.</p>':'')+
        '<p style="color:var(--muted)">This is a picture of the circuit as the official drawing wires it, not a meter. Mains is alternating current: the dots run from line to neutral only to show the path. The earth wires carry nothing unless there\'s a fault. '+(FR.M.kind==='factory'?'':'The sensor and screen cables are read by the PCB all the time it\'s on. ')+'A dimmed wire isn\'t proof of a dead one: '+(FR.M.kind==='factory'?'':'the SSR and the PCB\'s outputs switch off electronically, and ')+'a reversed outlet puts line on the neutral side. Always unplug before you touch a wire.</p>';
    }
    function nhwBadges(){
      if(!svg||svg.querySelector('.nhb'))return;
      var ns='http://www.w3.org/2000/svg',g=document.createElementNS(ns,'g');g.setAttribute('class','nhb');g.setAttribute('aria-hidden','true');
      nhwIds().forEach(function(id){
        var r=svg.querySelector('.part[data-part="'+id+'"] > .phit');if(!r)return;
        var x=+r.getAttribute('x'),y=+r.getAttribute('y'),sm=+r.getAttribute('width')<60||+r.getAttribute('height')<40,t=document.createElementNS(ns,'g');
        t.setAttribute('transform','translate('+(sm?x-2:x+4)+','+(sm?y-21:y+4)+')');
        t.innerHTML='<rect width="38" height="17" rx="8.5"/><text x="19" y="12.5" text-anchor="middle">NEW</text>';
        g.appendChild(t);
      });
      svg.appendChild(g);
    }
    /* phones: Whole map fits the drawing to the screen (class whole on the scroller, kept through the animation) */
    var whole=false;
    function zoomUI(){var sc=el('mscroll');sc.classList.toggle('whole',whole);if(whole)sc.scrollLeft=0;el('mhint').hidden=whole;
      Array.prototype.forEach.call(document.querySelectorAll('[data-mzoom]'),function(b){b.setAttribute('aria-pressed',String((b.getAttribute('data-mzoom')==='whole')===whole))})}
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
      order=listOrder();pick=null;
      if(realMp&&view==='mine'){try{pick=pickPlan();if(pick.order.length)order=pick.order}catch(e){pick=null}}
      pickUI();
      el('mapsec').hidden=!realMp;
      viewUI();
      /* the stock-wiring line in the caption: viewUI swaps the caption for Out of the box and puts it back after */
      var mc=el('mcapsi');if(mc)mc.hidden=!(v&&v.path==='SI');
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
        n.innerHTML='As it leaves the factory: '+Object.keys(f.runs).length+' wires'+(nj?' and '+nj+' crimp splices':'')+', traced from '+(f.src?'<a href="'+esc(f.src)+'" target="_blank" rel="noopener">'+esc(f.srcname)+'</a>':esc(f.srcname))+'. Colors are that drawing\'s; the docs note they vary by year and model. '+(f.noearth?esc(f.noearth)+' ':'')+(realV.fam==='GCP'&&/^(EVO|E24)$/.test(((GM()&&GM().get())||{}).model||'')?'That drawing is of the Classic Pro: on most Evo Pros and E24s each switch\'s connectors sit together in one block, and the colors may differ. ':'')+(realV.path==='SI'?'Show the change takes off only what this stock-wiring install changes.':'Show the change swaps it for the Plug-and-Play harness'+(f.becomes&&Object.keys(f.becomes).length?'; the lamps\' own leads and the pump fuse\'s lead stay, with new connectors on their ends.':'.'));}
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
      var nh=nhw&&view==='mine'&&!A;if(nh)nhwBadges();
      var st=stwOn(),SS=st?stwSets():null;
      svg.classList.toggle('nhw',nh);svg.classList.toggle('stw',st);svg.classList.toggle('stwcw',st&&!!SS.f&&realV.path!=='SI');el('mapsec').classList.toggle('nhw',nh||st);
      var nb=el('m-nhw');if(nb){nb.hidden=!realMp||!NEWHW.some(function(p){return realMp.parts[p]});nb.setAttribute('aria-pressed',String(nh))}
      var sb=el('m-stw');if(sb){sb.hidden=!realMp;sb.setAttribute('aria-pressed',String(st))}
      Array.prototype.forEach.call(svg.querySelectorAll('.run,.tag'),function(g){var c=SS&&SS.w[g.getAttribute('data-run')];g.classList.toggle('sy',!!c);g.classList.toggle('sye',c==='end');g.classList.toggle('syi',c==='idle')});
      Array.prototype.forEach.call(svg.querySelectorAll('.part'),function(g){g.classList.toggle('sp',!!SS&&SS.p.indexOf(g.getAttribute('data-part'))>=0)});
      svg.classList.toggle('dim',any&&!nh&&!(st&&!sel));svg.classList.toggle('wcol',wcol);
      Array.prototype.forEach.call(svg.querySelectorAll('.run,.tag'),function(g){
        var id=g.getAttribute('data-run');
        g.classList.toggle('off',!lit[id]);
        g.classList.toggle('sel',!!(sel&&((sel.t==='run'&&sel.id===id)||(sel.t==='set'&&sel.ids.indexOf(id)>=0))));
      });
      Array.prototype.forEach.call(svg.querySelectorAll('.part'),function(g){
        var id=g.getAttribute('data-part');
        g.classList.toggle('off',!!sel&&!partsLit[id]&&!(sel.t==='part'&&sel.id===id));
        g.classList.toggle('sel',!!(sel&&sel.t==='part'&&sel.id===id));
        g.classList.toggle('nh',NEWHW.indexOf(id)>=0);
      });
      endLabels(any&&!nh&&!st?lit:null);
      var mw=el('m-wire');if(mw){var wv=sel&&sel.t==='run'?sel.id:sel&&sel.asm?'asm:'+sel.asm:'';if(mw.value!==wv)mw.value=wv;if(mw.value!==wv)mw.value=''}
      var has={};Array.prototype.forEach.call(svg.querySelectorAll('.run'),function(g){var id=g.getAttribute('data-run');LAYERS.forEach(function(l){if(l[0]!=='all'&&inLayer(id,l[0]))has[l[0]]=1})});
      el('mchips').innerHTML=LAYERS.filter(function(l){return l[0]==='all'||has[l[0]]}).map(function(l){
        return '<button type="button" class="chip" data-mlayer="'+l[0]+'" aria-pressed="'+(layer===l[0]&&!sel)+'">'+(l[2]?'<span class="sw" style="background:'+l[2]+'"></span>':'')+l[1]+'</button>';
      }).join('');
      Array.prototype.forEach.call(document.querySelectorAll('[data-wc]'),function(b){b.setAttribute('aria-pressed',String((b.getAttribute('data-wc')==='draw')===wcol))});
      var i=sel&&sel.t==='run'?order.indexOf(sel.id):-1;
      el('m-step').textContent=i>=0?(i+1)+' of '+order.length:order.length+(v.path==='F'?' wires':' runs');
      Array.prototype.forEach.call(svg.querySelectorAll('.jhit'),function(r){r.classList.toggle('on',!!(sel&&sel.j===r.getAttribute('data-j')))});
      var js=jList(),jc=el('mjchips');
      jc.hidden=!js.length||view!=='mine';
      jc.innerHTML=js.length?'<span class="mj-k">On the PCB</span>'+js.map(function(J){return '<button type="button" class="chip" data-mj="'+J+'" aria-pressed="'+!!(sel&&sel.j===J)+'" title="'+esc(JN[J]||'')+'">'+J+'</button>'}).join(''):'';
      var FR=flowPaint();
      legend();detail();summary();
      if(FR){endLabels(null);flowCard(FR);
        var nc=Object.keys(FR.R.cur).length,nl=Object.keys(FR.R.live).filter(function(id){return !FR.R.cur[id]}).length;
        el('msel').innerHTML='<span class="rt">Electricity flow</span>: '+nc+(nc===1?' wire carries':' wires carry')+' current'+(nl?', '+nl+' more '+(nl===1?'is':'are')+' live':'');
        el('mlegend').innerHTML='<span><i class="lg-ecur"></i>Carrying current: the dots move from line to neutral, thick for a heavy current (heater, pump, valve), thin for a small one</span><span><i class="lg-epulse"></i>A bright pulse follows the current\'s path from line to neutral; as it arrives the next one sets off</span><span><i class="lg-elive"></i>Live at mains voltage, no current</span><span><i class="lg-eoff"></i>Not powered in this state</span>';
      }
    }
    /* one line above the map, so on a phone the pick shows without scrolling down to the card */
    function summary(){
      var e=el('msel'),r=sel&&sel.t==='run'?runOf(sel.id):null;
      if(nhw&&view==='mine'&&!sel){e.innerHTML='<span class="rt">New hardware</span>: '+nhwIds().length+' parts the install adds, wires hidden';return}
      if(stwOn()&&!sel){var S0=stwSets(),nw=Object.keys(S0.w).length;var np=S0.p.filter(function(p){return !/^J\d+$/.test(p)}).length;e.innerHTML='<span class="rt">What stays</span>: '+np+' parts and '+(nw?nw+(S0.f?' factory wires':' stock leads'):'no factory wires')+', what comes out hidden';return}
      if(!sel){e.textContent='';return}
      if(sel.t==='set'){e.innerHTML=(sel.label?'<span class="rt">'+esc(sel.label)+'</span>: ':'')+sel.ids.map(function(id){return '<b>'+esc(id)+'</b>'}).join(' ');return}
      if(sel.t==='part'){var p=mp.parts[sel.id]||{name:sel.id},n=Object.keys(mp.ends).filter(function(id){return ends(id).indexOf(sel.id)>=0}).length;e.innerHTML='<span class="rt">'+esc(p.name)+'</span>: '+(n?n+(n===1?' run lands here':' runs land here'):'nothing new connects here');return}
      if(!r){e.innerHTML='<b>'+esc(sel.id)+'</b><span class="rt">'+esc((mp.cables||{})[sel.id]||'')+'</span>';return}
      if(r.factory){e.innerHTML='<b>'+esc(r.id)+'</b><span class="rt">'+esc(r.frm+' → '+r.to)+'</span> · factory wire, '+esc(cname(r.color));return}
      e.innerHTML='<b>'+esc(r.id)+'</b><span class="rt">'+esc(r.short||(r.frm+' → '+r.to))+'</span> · '+esc(lenTxt(r));
    }
    function legend(){
      var h;
      if(stwOn()){var S1=stwSets(),SI1=realV.path==='SI',ty={};Object.keys(S1.w).forEach(function(id){ty[S1.w[id]]=1});
        el('mlegend').innerHTML='<span><i class="lg-sp"></i>Part that stays</span>'+(ty.same?'<span><i class="lg-sy"></i>Factory wire that stays as it is</span>':'')+(ty.end?'<span><i class="lg-sye"></i>'+(S1.f?(SI1?'Stays, one end moves':'Stays, with a new end'):'Stock lead that stays')+'</span>':'')+(ty.idle?'<span><i class="lg-syi"></i>Stays on the unused brew lamp</span>':'')+'<span>What comes out is hidden</span>';return}
      if(nhw&&view==='mine'){el('mlegend').innerHTML='<span><i class="lg-nh"></i>New with the install</span><span><i class="lg-nh0"></i>Stock part, stays in the machine</span>';return}
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
      if(!sel&&stwOn()){
        var S2=stwSets(),f2=S2.f,SI2=realV.path==='SI',ids2=function(c){return Object.keys(S2.w).filter(function(id){return S2.w[id]===c})};
        var nm=function(p){return (mp.parts[p]||{name:p}).name},btn=function(id){return '<button type="button" data-mrun="'+esc(id)+'">'+esc(id)+'</button>'};
        var same=ids2('same'),end=ids2('end'),idle=ids2('idle'),h='';
        var isJ=function(p){return /^J\d+$/.test(p)},pm=S2.p.filter(function(p){return !isJ(p)}),pj=S2.p.filter(isJ);
        h+='<div><span class="k">'+pm.length+' parts stay</span><span>'+pm.map(function(p){return '<button type="button" class="lnk" data-mpart="'+esc(p)+'">'+esc(nm(p))+'</button>'}).join(', ')+(pj.length?', and the '+pj.length+' factory crimp splices':'')+'</span></div>';
        if(same.length)h+='<div><span class="k">'+same.length+' factory wires stay as they are</span><div class="ids">'+same.map(btn).join('')+'</div></div>';
        if(end.length)h+='<div><span class="k">'+(f2?(SI2?end.length+' stay, with one end moved':end.length+' stay, with a new end'):end.length+' stock leads stay')+'</span><div class="ids">'+end.map(function(id){
          if(!f2)return btn(id);
          if(!SI2)return '<button type="button" data-mrun="'+esc(id)+'">'+esc(id)+' → '+esc(f2.becomes[id])+'</button>';
          var r=f2.runs[id],mv=(r.lab||[]).filter(function(l){return l&&(f2.moves||[]).indexOf(l)>=0});
          return '<button type="button" data-mrun="'+esc(id)+'">'+esc(id)+(mv.length?' · '+esc(mv.join(', ')):'')+'</button>'}).join('')+'</div></div>';
        if(idle.length)h+='<div><span class="k">On the unused brew lamp</span><div class="ids">'+idle.map(btn).join('')+'</div></div>';
        var oj=f2?(f2.out||[]).filter(isJ).length:0,outP=f2?(f2.out||[]).filter(function(p){return !isJ(p)}).map(function(p){return lc1(nm(p))}).concat(oj?[oj+' factory crimp splices']:[]).concat(SI2?[]:['the stock 184 °C fuse on the boiler (the 185 °C resettable fuse takes over)']):[],goN=f2?Object.keys(f2.runs).length-Object.keys(S2.w).length:0;
        if(f2&&!Object.keys(S2.w).length)h+='<div><span class="k">Factory wires</span><span>None stay: the new harness replaces every one.</span></div>';
        d.className='mdetail';d.style.borderLeftColor='var(--accent)';
        d.innerHTML='<div class="d-head"><span class="d-route">What stays from the original build</span><span class="d-acts"><button type="button" class="chip" data-mstw>Show everything</button></span></div>'+
          '<div class="d-grid stw-grid">'+h+'</div>'+
          '<p style="color:var(--muted)">'+(f2?'Comes out: '+esc(outP.concat(goN?[goN+' factory wires']:[]).join(', ').replace(/, ([^,]*)$/,' and $1'))+'. '+(SI2?'A wire with a moved end stays in the machine; only its stock connector comes off that spade and goes where the install says. ':Object.keys(S2.w).length?'The new harness replaces every other factory wire. ':'')+'Tap a wire for what happens to it, or a part for the wires on it.':'There\'s no drawing of this machine as it leaves the factory, so this shows the stock leads that stay on your wiring\'s map. Every other wire is new.')+'</p>';
        return;
      }
      if(!sel&&nhw&&view==='mine'){
        var ni=nhwIds();d.className='mdetail';d.style.borderLeftColor='var(--accent)';
        d.innerHTML='<div class="d-head"><span class="d-route">New hardware</span><span class="d-acts"><button type="button" class="chip" data-mnhw>Show the wiring</button></span></div>'+
          '<ul class="nhlist">'+ni.map(function(id){var pi=typeof partInfo==='function'?partInfo(id,realV):null,w=pi&&pi.w?pi.w:(mp.parts[id].note||''),m=/^(.+?[.:])\s/.exec(w+' ');w=m?m[1].replace(/:$/,'.'):w;return '<li><button type="button" class="lnk" data-mpart="'+esc(id)+'">'+esc(mp.parts[id].name)+'</button><span>'+esc(w)+'</span></li>'}).join('')+'</ul>'+
          '<p style="color:var(--muted)">Everything else on the drawing is stock and stays where it is. Tap a part for what it does and what lands on it.</p>';
        return;
      }
      if(!sel){d.className='mdetail empty';d.style.borderLeftColor='';d.innerHTML='<p style="color:var(--muted)">'+(v.path==='F'?'Tap a factory wire to see it on its own, what it does and what the install puts in its place, then Compare to switch between the two. Tap a part to see every factory wire that lands on it.':'Tap a wire or its tag to see that run on its own, with where it starts and ends, the wire and what goes on each end. Tap a part to see every run that lands on it, or a socket on the PCB (J7, say) to see every wire it connects to. Step through with the arrows to go run by run.')+'</p>';return}
      var acts='<span class="d-acts">'+(sel.t==='run'&&runOf(sel.id)?'<a href="#r-'+esc(sel.id)+'" data-jump="'+esc(sel.id)+'">Show in the list</a>':'')+(stwOn()?'<button type="button" class="chip" data-mclear>Back to what stays</button>':nhw&&view==='mine'?'<button type="button" class="chip" data-mclear>All new hardware</button>':'<button type="button" class="chip" data-mclear>Show everything</button>')+'</span>';
      if(sel.t==='set'&&sel.j){
        var J=sel.j,row=function(id,joined){
          var r=runOf(id);if(!r)return '<div><span class="k">'+esc(id)+'</span><span>'+esc((mp.cables||{})[id]||'')+'. It comes with its part: plug it in by pin.</span></div>';
          var a=(r.term||[]).map(jOf).indexOf(J),far=a===1?r.frm:r.to,pin=a<0?'':String(a===1?r.to:r.frm).replace(/^.*\bJ\d+\s*/,'');
          return '<div><span class="k">'+(joined?'Joined: ':'')+'<button type="button" class="lnk" data-mrun="'+esc(id)+'">'+esc(id)+'</button>'+(pin?' · '+esc(J+' '+pin):'')+'</span><span>'+swatch(r.color)+esc(joined?r.frm+' → '+r.to:'to '+far)+'</span></div>';
        };
        d.className='mdetail';d.style.borderLeftColor='var(--accent)';
        d.innerHTML='<div class="d-head"><span class="d-id">'+esc(J)+'</span><span class="d-route">'+esc(JN[J]||'')+'</span>'+acts+'</div>'+
          '<div class="d-grid">'+sel.ids.filter(function(id){return sel.joined.indexOf(id)<0}).map(function(id){return row(id,false)}).join('')+sel.joined.map(function(id){return row(id,true)}).join('')+'</div>'+
          '<p style="color:var(--muted)">'+(sel.joined.length?'Joined runs share an end with one of '+esc(J)+'\'s runs, so they\'re on the same connection. ':'')+'Tap an ID to see that run on its own.</p>';
        return;
      }
      if(sel.t==='set'&&sel.asm){
        var ar=sel.ids.map(runOf),a0=ar[0]||{},cnt={},lb=[];
        ar.forEach(function(r){[0,1].forEach(function(i){var t=r.lab&&r.lab[i];if(t){if(!cnt[t]){cnt[t]=0;lb.push(t)}cnt[t]++}})});
        var sh=lb.filter(function(t){return cnt[t]>1});
        d.className='mdetail';d.style.borderLeftColor=SYSC[a0.sys]||'var(--accent)';
        d.innerHTML='<div class="d-head"><span class="d-id">'+esc(sel.asm)+'</span><span class="d-route">'+esc(ASMN[sel.asm]||lcs2(ASMW[sel.asm]||'the whole wire'))+', '+sel.ids.length+(ASMN[sel.asm]?' wires':' legs')+'</span>'+acts+'</div>'+
          '<p>'+(ASMN[sel.asm]?'These leads go on together at the one socket.':'One piece of the harness. The drawing and the install order take it a leg at a time, and this shows all of it at once.')+(sh.length?' '+esc(sh.join(' and '))+(sh.length>1?' are shared ends: each is':' is a shared end:')+' one connector with two wires crimped into it.':'')+'</p>'+
          '<div class="d-grid">'+ar.map(function(r){return '<div><span class="k"><button type="button" class="lnk" data-mrun="'+esc(r.id)+'">'+esc(r.id)+'</button> · '+lenTxt(r)+'</span><span>'+swatch(r.color)+esc(r.frm+' → '+r.to)+'</span></div>'}).join('')+'</div>'+
          '<p style="color:var(--muted)">Tap a leg to see it on its own, with what goes on each end and when it goes in.</p>';
        return;
      }
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
        d.innerHTML='<div class="d-head"><span class="d-route">'+esc(p.name)+'</span>'+acts+'</div>'+(pi?'<p class="d-what">'+esc(pi.w)+'</p>'+(pi.p?'<p class="d-pcb"><span class="k">With Gaggiuino</span> '+esc(pi.p)+'</p>':'')+(pi.img?'<p class="d-pcb">'+esc(pi.img.n)+' <a href="'+esc(pi.img.u)+'" target="_blank" rel="noopener">'+esc(pi.img.t)+'</a>.</p>':''):'')+(p.note?'<p>'+esc(p.note.charAt(0).toUpperCase()+p.note.slice(1))+'.</p>':'')+
          (ids.length?'<div><span class="k">'+ids.length+(ids.length===1?' run lands':' runs land')+' here</span><div class="ids" style="margin-top:4px">'+ids.map(function(id){return '<button type="button" data-mrun="'+esc(id)+'"'+(isOpt(id)?' class="o" title="Optional run"':'')+'>'+id+(isOpt(id)?' · optional':'')+'</button>'}).join('')+'</div></div>':'<p style="color:var(--muted)">Nothing new connects here; it\'s drawn so you can find your way around.</p>');
        return;
      }
      var r=runOf(sel.id);
      if(r&&r.factory){
        var fz=facOf(key),goes=fz.go.indexOf(r.id)>=0,lab=(r.lab||[]).filter(Boolean),mv=lab.filter(function(l){return (fz.moves||[]).indexOf(l)>=0});
        d.className='mdetail';d.style.borderLeftColor=SYSC[r.sys]||'var(--accent)';
        d.innerHTML='<div class="d-head"><span class="d-id">'+esc(r.id)+'</span><span class="d-route">'+esc(r.frm)+' → '+esc(r.to)+'</span>'+acts.replace(/<a [^>]*>Show in the list<\/a>/,'<button type="button" class="chip cmpb" data-mcmp="'+esc(r.id)+'">Compare with your wiring</button>')+'</div>'+
          '<div class="d-grid"><div><span class="k">Circuit</span><span><span class="sysdot" style="background:'+(SYSC[r.sys]||'var(--muted)')+'"></span>'+esc(r.sys==='H'?'Heater circuit':SYSN[r.sys]||r.sys)+'</span></div>'+
          '<div><span class="k">Factory color</span><span>'+swatch(r.color)+esc(cname(r.color))+'</span></div>'+
          '<div><span class="k">With this install</span><span>'+(realV.path==='SI'?(goes?'Its '+esc(mv.join(' and '))+(mv.length>1?' ends come':' end comes')+' off':'Stays as it is'):fz.becomes&&r.id in fz.becomes?(fz.becomes[r.id]?'Stays, with a new end: it becomes '+esc(fz.becomes[r.id]):'Stays on the unused brew lamp: nothing connects to it'):'Comes out: the new harness replaces it')+'</span></div></div>'+
          (r.what?'<p>'+esc(r.what)+'.</p>':'')+(lab.length?'<p style="color:var(--muted)">In the stock wiring guide: '+[0,1].filter(function(i){return r.lab[i]}).map(function(i){return esc(r.lab[i])+' is its end at '+esc(lc1(i?r.to:r.frm))}).join('; ')+'.</p>':'')+afterHtml(r.id);
        return;
      }
      if(!r){
        var nm=(mp.cables||{})[sel.id]||sel.id,pins=(v.cables||[]).filter(function(c){return (sel.id==='TC'&&/Thermocouple/.test(c.frm))||(sel.id==='PS'&&/Pressure/.test(c.frm))||(sel.id==='SCR'&&/J1/.test(c.frm+c.to))});
        d.className='mdetail';d.style.borderLeftColor=SYSC.S;
        d.innerHTML='<div class="d-head"><span class="d-id">'+esc(sel.id)+'</span><span class="d-route">'+esc(nm)+'</span>'+acts+'</div><p>This cable comes with its part. Plug it in by pin, not by color:</p>'+
          '<div class="d-grid">'+pins.map(function(c){return '<div><span class="k">'+esc(c.frm)+'</span><span>'+swatch(c.color)+esc(c.to)+'</span></div>'}).join('')+'</div>'+walkHtml({id:sel.id,cable:true});
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
        (r.what?'<p>'+esc(r.what)+'.</p>':'')+(r.note?'<p>'+esc(r.note)+'</p>':'')+walkHtml(r);
    }
    function center(){
      if(!svg||!sel)return;
      var sc=el('mscroll');if(sc.scrollWidth<=sc.clientWidth+2)return;
      var gs=sel.t==='set'?sel.ids.map(function(id){return svg.querySelector('.run[data-run="'+id+'"]')}):[sel.t==='run'?svg.querySelector('.run[data-run="'+sel.id+'"]'):svg.querySelector('.part[data-part="'+sel.id+'"]')];
      try{var x0=1e9,x1=-1e9;gs.forEach(function(g){if(!g)return;var bb=g.getBBox();x0=Math.min(x0,bb.x);x1=Math.max(x1,bb.x+bb.width)});var ratio=svg.clientWidth/1400;sc.scrollTo({left:Math.max(0,(x0+x1)/2*ratio-sc.clientWidth/2),behavior:'smooth'})}catch(e){}
    }
    /* a PCB socket (J1 to J13): every run that lands on it, and every run joined to those at a shared end (a jumper
       that shares a spade, the rest of a neutral or line node), so the socket shows all it connects to */
    var JN={J1:'Screen',J4:'Thermocouple',J5:'Extra IO',J6:'Pressure sensor',J7:'Switches',J9:'SSR control',J10:'AC neutral',J11:'AC line',J12:'Pump',J13:'3-way valve'},JC={J1:'SCR',J4:'TC',J6:'PS'};
    function jOf(t){var m=/^(?:pcb )?(j\d+)\b/.exec(String(t||''));return m?m[1].toUpperCase():null}
    function jNet(J){
      if(!v||v.path==='F')return {direct:[],joined:[]};
      var runs=v.runs.filter(function(r){return hasRun(r.id)}),direct=runs.filter(function(r){return (r.term||[]).some(function(t){return jOf(t)===J})}).map(function(r){return r.id});
      if(JC[J]&&hasRun(JC[J]))direct.push(JC[J]);
      var S=direct.slice(),grow=true;
      while(grow){
        grow=false;
        var ts={};runs.forEach(function(r){if(S.indexOf(r.id)>=0)(r.term||[]).forEach(function(t){if(t&&!jOf(t))ts[t]=1})});
        runs.forEach(function(r){if(S.indexOf(r.id)<0&&(r.term||[]).some(function(t){return ts[t]})){S.push(r.id);grow=true}});
      }
      return {direct:direct,joined:S.filter(function(id){return direct.indexOf(id)<0})};
    }
    function jList(){if(!v||v.path==='F'||!svg)return [];return Array.prototype.map.call(svg.querySelectorAll('.jhit'),function(r){return r.getAttribute('data-j')}).filter(function(J){return jNet(J).direct.length}).sort(function(a,b){return +a.slice(1)-+b.slice(1)})}
    function pickJ(J){
      nhw=false;
      if(sel&&sel.j===J){sel=null;paint();return}
      var n=jNet(J);if(!n.direct.length)return;
      sel={t:'set',ids:n.direct.concat(n.joined),label:J+', '+(JN[J]||'socket'),j:J,joined:n.joined};layer='all';paint();center();
    }
    function pickRun(id,toggle){nhw=false;flow=false;sel=(toggle&&sel&&sel.t==='run'&&sel.id===id)?null:{t:'run',id:id};paint();center()}
    function fitWhole(){if(el('mscroll').scrollWidth>el('mscroll').clientWidth+2&&!whole){whole=true;zoomUI()}}
    function pickPart(id){sel=(sel&&sel.t==='part'&&sel.id===id)?null:{t:'part',id:id};paint();center()}
    function stepBy(n){
      if(!order.length)return;
      var i=sel&&sel.t==='run'?order.indexOf(sel.id):-1;
      i=i<0?(n>0?0:order.length-1):(i+n+order.length)%order.length;
      pickRun(order[i],false);
    }
    function init(){
      el('mscroll').addEventListener('click',function(e){
        if(A){var fg=A==='cmp'&&e.target.closest('.st-fw [data-run]');if(fg&&fg.getAttribute('data-run')!==cmp)compare(fg.getAttribute('data-run'),'play');return}
        if(flowOn())return;
        var g=e.target.closest('[data-run]');if(g){pickRun(g.getAttribute('data-run'),true);return}
        var jh=e.target.closest('[data-j]');if(jh&&view==='mine'){pickJ(jh.getAttribute('data-j'));return}
        var p=e.target.closest('[data-part]');if(p){pickPart(p.getAttribute('data-part'));return}
        if(sel){sel=null;paint()}
      });
      el('mchips').addEventListener('click',function(e){var b=e.target.closest('[data-mlayer]');if(!b)return;layer=b.getAttribute('data-mlayer');sel=null;paint()});
      el('mjchips').addEventListener('click',function(e){var b=e.target.closest('[data-mj]');if(b)pickJ(b.getAttribute('data-mj'))});
      el('mapsec').addEventListener('click',function(e){
        var w=e.target.closest('[data-wc]');if(w){wcol=w.getAttribute('data-wc')==='draw';persist();paint();return}
        if(e.target.closest('[data-mclear]')){sel=null;paint();return}
        var am=e.target.closest('[data-masm]');if(am){pickAsm(am.getAttribute('data-masm'));return}
        var fbn=e.target.closest('#m-flow,[data-mflow]');if(fbn){flow=!flowOn();nhw=false;stw=false;sel=null;layer='all';paint();if(flow)fitWhole();return}
        var fmb=e.target.closest('[data-mfm]');if(fmb){fmode=fmb.getAttribute('data-mfm');paint();return}
        var nb=e.target.closest('#m-nhw,[data-mnhw]');if(nb){nhw=!nhw;stw=false;flow=false;sel=null;layer='all';if(nhw&&view!=='mine'){stopAnim();view='mine';drawn=null;show(key,showOpt)}else paint();if(nhw)fitWhole();return}
        var sw=e.target.closest('#m-stw,[data-mstw]');if(sw){stw=!stw;nhw=false;flow=false;sel=null;layer='all';if(stw&&view!=='box'&&facOf(key)){stopAnim();view='box';drawn=null;show(key,showOpt)}else paint();if(stw)fitWhole();return}
        var mpn=e.target.closest('[data-mpart]');if(mpn){pickPart(mpn.getAttribute('data-mpart'));return}
        var ms=e.target.closest('[data-mstep]');if(ms){stepBy(+ms.getAttribute('data-mstep'));return}
        var mb=e.target.closest('[data-mbox]');if(mb){var fid=mb.getAttribute('data-mbox');stw=false;nhw=false;stopAnim();view='box';drawn=null;show(key,showOpt);pickRun(fid,false);return}
        var r=e.target.closest('[data-mrun]');if(r){pickRun(r.getAttribute('data-mrun'),false);return}
        var c=e.target.closest('[data-mcmp]');if(c){compare(c.getAttribute('data-mcmp'),'play');el('mapsec').scrollIntoView({behavior:'smooth',block:'start'});return}
        if(e.target.closest('[data-cmpx]')){closeCmp();return}
        var gx=e.target.closest('[data-mgo]');if(gx){var rid=gx.getAttribute('data-mgo');stopAnim();view='mine';drawn=null;show(key,showOpt);pickRun(rid,false);return}
      });
      el('mzoom').addEventListener('click',function(e){var b=e.target.closest('[data-mzoom]');if(!b)return;whole=b.getAttribute('data-mzoom')==='whole';zoomUI();if(!whole)center()});
      el('m-wire').addEventListener('change',function(){var id=this.value;if(/^asm:/.test(id))pickAsm(id.slice(4));else if(id)pickRun(id,false);else{sel=null;paint()}});
      el('m-prev').addEventListener('click',function(){stepBy(-1)});
      el('m-next').addEventListener('click',function(){stepBy(1)});
      el('mview').addEventListener('click',function(e){
        var b=e.target.closest('[data-mview]');if(b){var w=b.getAttribute('data-mview');if(w==='mine'&&facOf(key))stw=false;if(w==='box')nhw=false;if(w!==view||A){view=w;drawn=null;show(key,showOpt)}else paint();return}
        if(e.target.closest('#m-play'))play();
      });
      ChangePlayer.wire();
      el('mcmp').addEventListener('click',function(e){
        var b=e.target.closest('button');if(!b||A!=='cmp')return;
        if(b.hasAttribute('data-cmpv')){ChangePlayer.seek(b.getAttribute('data-cmpv')==='box'?0:ChangePlayer.end());cmpUI()}
        else if(b.id==='cmp-play'){ChangePlayer.seek(0);ChangePlayer.play()}
        else if(b.id==='cmp-prev')cmpStep(-1);
        else if(b.id==='cmp-next')cmpStep(1);
        else if(b.id==='cmp-close')closeCmp();
      });
    }
    function closeCmp(){var id=cmp;stopAnim();view='box';drawn=null;show(key,showOpt);if(id){sel={t:'run',id:id};paint()}}
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
    /* ---------- Show the change, and Compare ----------
       One stage holds both drawings on the same layout: the factory harness over the schematic's own parts and runs.
       Show the change takes the factory wires off one at a time, then puts the new runs in one at a time, both in the
       runbook's order, with each step named (ChangePlayer runs it: pause, a quarter speed, back and forward a step,
       or drag to any point). On stock wiring only what the install changes comes off; the rest dims and stays.
       Compare does the same for one factory wire: that wire, then what the install puts at each of its ends
       (WM[key].rel, from wiring_map.py), with everything else faint, and a switch between the two. */
    var A=null,cmp=null,NS='http://www.w3.org/2000/svg',mk=ChangePlayer.mk;
    function stopAnim(){
      if(!A)return;
      ChangePlayer.stop();A=null;cmp=null;
      el('mscroll').classList.remove('fit');el('mapsec').classList.remove('animating','comparing');el('mcmp').hidden=true;
    }
    function colOf(g){return wcol?(g.style.getPropertyValue('--wc')||'#888'):(SYSC[(/ s-([A-Z]+)/.exec(' '+g.getAttribute('class'))||[])[1]]||'var(--accent)')}
    function stage(label){
      var f=facOf(key),T=WM[key];
      var P=new DOMParser(),fs=P.parseFromString(f.svg,'image/svg+xml').documentElement,ts=P.parseFromString(T.svg,'image/svg+xml').documentElement;
      var st=mk('svg',{viewBox:'0 0 1400 900','class':'dia stage'+(wcol?' wcol':''),role:'img','aria-label':label});
      var defs=mk('defs',{},st),fl=mk('filter',{id:'ma-glow',x:'-50%',y:'-50%',width:'200%',height:'200%'},defs);mk('feGaussianBlur',{stdDeviation:'3.2'},fl);
      var gTP=mk('g',{'class':'st-tp'},st),gFP=mk('g',{'class':'st-fp'},st),gST=mk('g',{'class':'st-stk'},st),gFW=mk('g',{'class':'st-fw'},st),gTW=mk('g',{'class':'st-tw'},st),gTG=mk('g',{'class':'st-tg'},st),gFX=mk('g',{'class':'st-fx'},st);
      function imp(n,parent){var c=document.importNode(n,true);parent.appendChild(c);return c}
      var S={st:st,fx:gFX,f:f,fparts:{},tparts:{},stk:[],fw:{},tw:{},tags:{},twOrder:[]};
      Array.prototype.forEach.call(ts.querySelectorAll('.parts > .part'),function(g){S.tparts[g.getAttribute('data-part')]=imp(g,gTP)});
      Array.prototype.forEach.call(fs.querySelectorAll('.parts > .part'),function(g){S.fparts[g.getAttribute('data-part')]=imp(g,gFP)});
      Array.prototype.forEach.call(ts.querySelectorAll('.stocks > path'),function(pth){var c=imp(pth,gST);S.stk.push({el:c,part:c.getAttribute('data-part'),to:c.getAttribute('data-to')})});
      Array.prototype.forEach.call(fs.querySelectorAll('.wires > .run'),function(g){S.fw[g.getAttribute('data-run')]=imp(g,gFW)});
      Array.prototype.forEach.call(ts.querySelectorAll('.wires > .run'),function(g){var id=g.getAttribute('data-run');S.tw[id]=imp(g,gTW);S.twOrder.push(id)});
      Array.prototype.forEach.call(ts.querySelectorAll('.tags > .tag'),function(g){S.tags[g.getAttribute('data-run')]=imp(g,gTG)});
      return S;
    }
    function mount(S,cls){
      var sc=el('mscroll');sc.innerHTML='';sc.appendChild(S.st);if(cls==='animating')sc.classList.add('fit');sc.scrollLeft=0;svg=null;el('mapsec').classList.add(cls);
      el('m-play').hidden=true;
      Array.prototype.forEach.call(document.querySelectorAll('[data-mview]'),function(b){b.setAttribute('aria-pressed','false')});
    }
    function capH(k,main){return '<span class="ma-k">'+esc(k)+'</span>'+esc(main)}
    function stepName(s){return s?'Phase '+s.phase+': '+s.t:''}
    function runText(id){var r=realV.runs.filter(function(x){return x.id===id})[0];if(r)return r.short||(r.frm+' → '+r.to);return (realMp.cables||{})[id]||''}
    /* every run on the drawing in the wire list's order, then the cables, then optional runs */
    function allOrder(S){
      var lo=[];['L','H','N','E','LV','LMP'].forEach(function(sy){realV.runs.forEach(function(r){if(!r.opt&&(sy==='LV'?(r.sys==='LV'||r.sys==='LVG'):r.sys===sy)&&S.tw[r.id]&&lo.indexOf(r.id)<0)lo.push(r.id)})});
      realV.runs.forEach(function(r){if(S.tw[r.id]&&lo.indexOf(r.id)<0&&!r.opt)lo.push(r.id)});
      S.twOrder.forEach(function(id){if(!runOfReal(id)&&lo.indexOf(id)<0)lo.push(id)});
      realV.runs.forEach(function(r){if(S.tw[r.id]&&lo.indexOf(r.id)<0)lo.push(r.id)});
      return lo;
    }
    function runOfReal(id){for(var i=0;i<realV.runs.length;i++)if(realV.runs[i].id===id)return realV.runs[i];return null}
    /* the runbook's order for this drawing: [{s: step or null, runs: [...], parts: [...]}] and each run's place in it */
    var TAKES_OUT={p3a:1};
    function installPlan(S){
      var seq=typeof REFS!=='undefined'&&REFS.order?REFS.order({v:realV,hasRun:function(id){return !!S.tw[id]},hasPart:function(id){return !!S.tparts[id]}}):[];
      /* a step that takes something out (the brew thermostat) points at what goes in its place, but doesn't fit it */
      var claimed={};seq.forEach(function(st){if(TAKES_OUT[st.id])return;st.runs.forEach(function(id){if(!(id in claimed))claimed[id]=st})});
      var lo=allOrder(S),fb=seq.filter(function(st){return st.id==='p4i'})[0]||null,done={},plan=[],rank={};
      /* a run no step names goes with the last step that names a part it lands on (J9's wires with Plug everything into the PCB) */
      if(!fb)lo.forEach(function(id){if(id in claimed)return;var e=realMp.ends[id]||[];for(var i=seq.length-1;i>=0;i--)if(seq[i].parts.some(function(p){return e.indexOf(p)>=0})){claimed[id]=seq[i];break}});
      function isNew(p){return S.tparts[p]&&!S.fparts[p]}
      seq.forEach(function(st,si){
        var ids=st.runs.filter(function(id){return claimed[id]===st&&!done[id]});
        lo.forEach(function(id){if(claimed[id]===st&&!done[id]&&ids.indexOf(id)<0)ids.push(id)});
        if(st===fb)ids=ids.concat(lo.filter(function(id){return !(id in claimed)&&!done[id]&&ids.indexOf(id)<0}));
        var parts=st.parts.filter(isNew);
        if(!ids.length&&!parts.length)return;
        ids.forEach(function(id,k){done[id]=1;rank[id]={k:si*1000+k,step:st}});
        plan.push({s:st,runs:ids,parts:parts});
      });
      var rest=lo.filter(function(id){return !done[id]});
      if(rest.length){rest.forEach(function(id,k){rank[id]={k:1e8+k,step:null}});plan.push({s:null,runs:rest,parts:[]})}
      return {plan:plan,rank:rank,seq:seq,fb:fb};
    }
    /* which runbook step takes each factory wire off: the brew thermostat (and on Plug-and-Play the steam one) at its
       own step, otherwise the step of the first new run that takes its place */
    function removalPlan(S,ip){
      var f=S.f,rel=WM[key].rel||{},SI=realV.path==='SI',p3a=ip.seq.filter(function(st){return st.id==='p3a'})[0];
      var list=f.go.filter(function(id){return S.fw[id]}).map(function(id,ix){
        var R=rel[id]||{ends:[]},best=1e9,step=null;
        R.ends.forEach(function(e){if(p3a&&(e.k==='bt'||(e.k==='st'&&!SI))){best=ip.seq.indexOf(p3a)*1000;step=p3a}});
        var cand=[];(R.mv||[]).forEach(function(m){cand=cand.concat(m.to)});
        if(R.nb)cand.push(R.nb);
        if(!cand.length&&(R.mv||[]).length){
          /* a stock connector that's parked or moves to another spade: the step for the switch it sits on */
          var fe=f.ends[id]||[];ip.seq.some(function(st,si){if(st.parts.some(function(p){return fe.indexOf(p)>=0})){if(si*1000<best){best=si*1000;step=st}return true}return false});
        }
        if(!cand.length&&best===1e9)R.ends.forEach(function(e){cand=cand.concat(e.now)});
        cand.forEach(function(rid){var x=ip.rank[rid];if(x&&x.k<best){best=x.k;step=x.step}});
        if(best===1e9)step=ip.fb;
        return {id:id,k:best,ix:ix,step:step};
      });
      list.sort(function(a,b){return a.k-b.k||a.ix-b.ix});
      return list;
    }
    function play(){
      var f=facOf(key);if(!f)return;
      stopAnim();
      var S=stage('The factory wiring turning into '+(realV.name||'this schematic')),SI=realV.path==='SI';
      mount(S,'animating');A='play';
      var b=new ChangePlayer.Builder(S.fx,colOf),RM=b.RM,t=0,ip=installPlan(S),rem=removalPlan(S,ip),nAll=Object.keys(f.runs).length;
      var G=RM?.15:.22;
      /* starting frame: only the factory drawing */
      Object.keys(S.tparts).forEach(function(id){b.fade(S.tparts[id],0,.001,0,0)});
      S.stk.forEach(function(x){b.fade(x.el,0,.001,0,0)});
      b.say(0,capH('Out of the box',nAll+' factory wires, as the machine leaves the factory'));
      b.step(0,1.2,'Out of the box');t=1.2;
      if(SI){
        var stayIds=f.stay||[],keep=f.keep||[];
        b.say(t,capH('Out of the box','This install changes '+rem.length+' of them, one at a time. The rest stay'));
        stayIds.forEach(function(id){var g=S.fw[id];if(g){b.clsFrom(g,t,'st-stay');b.fade(g,t,.6,null,.5)}});
        keep.forEach(function(id){if(S.fparts[id])b.fade(S.fparts[id],t,.6,null,.45)});
        b.step(t,t+1.1,'The wires that stay');t+=1.1;
      }
      /* off, one at a time */
      var outs={},left={};(f.out||[]).forEach(function(p){if(S.fparts[p]){outs[p]=1;left[p]=0}});
      rem.forEach(function(x){(f.ends[x.id]||[]).forEach(function(p){if(outs[p])left[p]++})});
      var rel=WM[key].rel||{};
      rem.forEach(function(x,i){
        var r=f.runs[x.id],lab=r.lab||['',''],R=rel[x.id]||{},mv=R.mv||[],fromB=SI?(mv.length?mv[0].end===1:!!lab[1]&&!lab[0]):false,s0=t;
        var tail=SI&&mv.length?' · '+mv.map(function(m){return 'its '+m.lab+' end comes off'}).join(', '):(!SI&&R.nb!=null?(R.nb?' · the lead stays, as '+R.nb+', with new ends':' · the lead stays, on the unused brew lamp'):'');
        b.say(t,capH('Off '+(i+1)+' of '+rem.length+(x.step?' · '+stepName(x.step):''),x.id+' · '+lc1(r.frm)+' → '+lc1(r.to)+tail));
        t=b.wireOut(S.fw[x.id],t,{fromB:fromB});
        (f.ends[x.id]||[]).forEach(function(p){if(outs[p]&&--left[p]===0){b.partOut(S.fparts[p],t-.1,.55);t+=.45;delete outs[p]}});
        t+=G;b.step(s0,t,x.id);
      });
      var still=Object.keys(outs);
      if(still.length){var s1=t;b.say(t,capH('Off','The '+still.map(function(p){return lc1((f.parts[p]||{name:p}).name)}).join(', ')+(still.length>1?' come':' comes')+' out'));still.forEach(function(p,i){b.partOut(S.fparts[p],t+i*.08,.6)});t+=.8+still.length*.08;b.step(s1,t,'Parts out')}
      /* the machine's own parts stay; the drawing switches to the install's version of them */
      var common=Object.keys(S.fparts).filter(function(id){return S.tparts[id]}),s2=t;
      b.say(t,capH('In','The machine\'s own parts stay where they are. Now the new wiring, in the runbook\'s order'));
      common.forEach(function(id){b.fade(S.tparts[id],t,.7,0,null);b.fade(S.fparts[id],t,.7,null,0)});
      t+=.9;b.step(s2,t,'Parts');
      /* in, one at a time */
      var arrived={},RING={pcb:1,screen:1,ssr:1,tc:1,psens:1,rf:1,shelly:1};common.forEach(function(id){arrived[id]=1});
      function bring(p,s){if(arrived[p]||!S.tparts[p]||S.fparts[p])return s;arrived[p]=1;b.partIn(S.tparts[p],s,.55,!!RING[p]);return s+(RING[p]?.6:.3)}
      var nIn=0,total=0;ip.plan.forEach(function(pl){total+=pl.runs.length});
      var stkShown={};
      ip.plan.forEach(function(pl){
        if(pl.parts.length){
          var need=pl.parts.filter(function(p){return !arrived[p]});
          if(need.length&&!pl.runs.length){var s3=t;b.say(t,capH(stepName(pl.s),need.map(function(p){return (realMp.parts[p]||{name:p}).name}).join(', ')));need.forEach(function(p){t=bring(p,t)});t+=G;b.step(s3,t,pl.s?pl.s.id:'')}
          else need.forEach(function(p){if(!pl.runs.length)t=bring(p,t)});
        }
        pl.runs.forEach(function(id){
          var g=S.tw[id];if(!g)return;nIn++;
          var s0=t;
          b.say(t,capH('In '+nIn+' of '+total+(pl.s?' · '+stepName(pl.s):' · Also on the map'),id+' · '+runText(id)));
          (pl.parts||[]).forEach(function(p){t=bring(p,t)});
          (realMp.ends[id]||[]).forEach(function(p){t=bring(p,t)});
          var tEnd=b.wireIn(g,t,{tag:S.tags[id]});
          S.stk.forEach(function(x,k){if(!stkShown[k]&&(realMp.ends[id]||[]).indexOf(x.part)>=0){stkShown[k]=1;b.fade(x.el,tEnd-.3,.5,0,null)}});
          t=tEnd+G;b.step(s0,t,id);
        });
      });
      var lateParts=Object.keys(S.tparts).filter(function(p){return !arrived[p]&&!S.fparts[p]});
      if(lateParts.length){var s4=t;b.say(t,capH('In','The rest of the new parts'));lateParts.forEach(function(p,i){bring(p,t+i*.08)});t+=.8+lateParts.length*.08;b.step(s4,t,'Parts in')}
      var lateStk=S.stk.filter(function(x,k){return !stkShown[k]});
      if(lateStk.length){var s5=t;b.say(t,capH('Stock wiring','Dashed: where each moved or parked stock connector came off'));lateStk.forEach(function(x){b.fade(x.el,t,.6,0,null)});t+=.9;b.step(s5,t,'Stock leads')}
      /* the whole thing lights once, then rests */
      var nRun=S.twOrder.filter(function(id){return !/\bcab\b/.test(S.tw[id].getAttribute('class'))}).length,s6=t;
      if(!RM)b.cls(S.st,t,t+1.8,'flowing');
      b.say(t,capH('Your wiring',nRun+' runs'+(nRun<S.twOrder.length?' and the sensor and screen cables':'')+(SI?'. Grey: the factory wires that stay':'')));
      t+=RM?.6:1.9;b.step(s6,t,'Your wiring');
      ChangePlayer.start(b,t,{replay:play,done:function(){view='mine';drawn=null;show(key,showOpt)}});
      viewUI();
    }
    /* the factory wire's card: what the install puts at each of its ends */
    function afterHtml(fid){
      var R=(WM[key].rel||{})[fid],f=facOf(key),SI=realV.path==='SI';if(!R)return '';
      var rel=related(fid),items=[];
      function chips(ids){return ids.length?ids.map(function(id){return '<button type="button" class="rchip" data-mgo="'+esc(id)+'" title="See it in your wiring">'+esc(id)+'</button>'}).join(' '):''}
      var mvEnd={};(R.mv||[]).forEach(function(m){mvEnd[m.end]=1});
      R.ends.forEach(function(e,i){
        var h;
        if(e.k==='splice')h=SI?'stays, with its other wires':'comes out with the factory harness';
        else if(e.k==='bt')h='comes out, and the thermocouple goes in its hole; the PCB takes over brew temperature';
        else if(e.k==='st')h=SI?'its Sa and Sb connectors move to the SSR, so it can stay, unplugged, or come out':'comes out, and the 185 °C resettable fuse goes in its hole';
        else if(e.k==='fuse')h='the stock fuse comes out only when the 185 °C resettable fuse goes in the steam thermostat\'s hole to take its place, never without one. Wired to it now: '+chips(e.now);
        else if(e.k==='pfuse')h='the pump fuse stays; its leads are now '+chips(e.now);
        else if(e.now.length)h='now '+chips(e.now);
        else if(mvEnd[i])return;
        else h=SI?'stays where it is':'nothing new lands here';
        items.push('<li><b>'+esc(e.t)+':</b> '+h+'</li>');
      });
      (R.mv||[]).forEach(function(m){
        var mm=/^stock: (.*); now: (.*)$/.exec(m.note||''),txt=mm?'comes '+mm[1]+'; now '+mm[2]:(m.note||'moves');
        items.push('<li><b>Its '+esc(m.lab)+' end:</b> '+esc(txt).replace(/now on (wire )?([A-Za-z0-9-]+)$/,function(all,w,id){return m.to.indexOf(id)>=0?'now on '+chips([id]):all})+'</li>');
      });
      if(R.nb)items.push('<li><b>The lead itself:</b> stays, as '+chips([R.nb])+'</li>');
      return '<div class="d-after"><span class="k">After the install</span><ul>'+items.join('')+'</ul>'+(rel.length||A!=='cmp'?'<p class="d-rel">'+(rel.length?'Tap a run to see it in your wiring. ':'')+(A==='cmp'?'':'Compare plays this wire\'s change on its own.')+'</p>':'')+'</div>';
    }
    function related(fid){
      var R=(WM[key].rel||{})[fid],out=[];if(!R)return out;
      function add(id){if(id&&out.indexOf(id)<0&&realMp.ends[id])out.push(id)}
      (R.mv||[]).forEach(function(m){m.to.forEach(add)});add(R.nb);R.ends.forEach(function(e){e.now.forEach(add)});
      return out;
    }
    function compare(fid,at){
      var f=facOf(key);if(!f||!f.runs[fid])return;
      var keepAt=at;stopAnim();
      var S=stage('Factory wire '+fid+' and what the install puts in its place'),SI=realV.path==='SI',goes=f.go.indexOf(fid)>=0;
      mount(S,'comparing');A='cmp';cmp=fid;
      var b=new ChangePlayer.Builder(S.fx,colOf),t=0,R=(WM[key].rel||{})[fid]||{ends:[]},rel=related(fid),r=f.runs[fid];
      var FAINT=.14,mv=R.mv||[],labs=mv.map(function(m){return 'f:'+m.lab});
      Object.keys(S.fw).forEach(function(id){if(id!==fid)b.fade(S.fw[id],0,.001,FAINT,FAINT)});
      Object.keys(S.tparts).forEach(function(id){b.fade(S.tparts[id],0,.001,0,0)});
      S.stk.forEach(function(x){b.fade(x.el,0,.001,0,0)});
      Object.keys(S.tags).forEach(function(id){b.fade(S.tags[id],0,.001,0,0)});
      S.twOrder.forEach(function(id){if(rel.indexOf(id)<0)b.fade(S.tw[id],0,.001,0,0)});
      b.say(0,capH('Out of the box',fid+' · '+lc1(r.frm)+' → '+lc1(r.to)));
      b.step(0,.9,'Out of the box');t=.9;
      var s1=t;
      if(goes){
        var fromB=SI?(mv.length?mv[0].end===1:false):false;
        b.say(t,capH('The change',SI?(mv.length?mv.map(function(m){return 'Its '+m.lab+' end comes off'}).join(', '):'It comes off'):(R.nb!=null?(R.nb?'It stays, with a new end':'It stays on the unused brew lamp'):'It comes out with the factory harness')));
        t=b.wireOut(S.fw[fid],t,{fromB:fromB})+.15;
      }else{b.say(t,capH('The change','It stays as it is'));b.clsFrom(S.fw[fid],t,'st-stay');t+=.8}
      b.step(s1,t,fid);
      /* everything else changes at once, faintly */
      var s2=t,stayIds=f.stay||[];
      Object.keys(S.fw).forEach(function(id){if(id===fid)return;if(stayIds.indexOf(id)>=0){b.clsFrom(S.fw[id],t,'st-stay')}else b.fade(S.fw[id],t,.7,FAINT,0)});
      (f.out||[]).forEach(function(p){if(S.fparts[p]&&!S.tparts[p])b.partOut(S.fparts[p],t,.6)});
      Object.keys(S.fparts).forEach(function(id){if(S.tparts[id]){b.fade(S.tparts[id],t,.7,0,null);b.fade(S.fparts[id],t,.7,null,0)}});
      var relParts={};rel.forEach(function(id){(realMp.ends[id]||[]).forEach(function(p){relParts[p]=1})});labs.forEach(function(p){relParts[p]=1});
      Object.keys(S.tparts).forEach(function(id){if(!S.fparts[id])b.fade(S.tparts[id],t,.7,0,relParts[id]?null:.35)});
      S.twOrder.forEach(function(id){if(rel.indexOf(id)<0)b.fade(S.tw[id],t+.2,.7,0,FAINT)});
      b.say(t,capH('The change',rel.length?'The rest of the machine changes too (faint). What lands where '+fid+' was:':'The rest of the machine changes too (faint)'));
      t+=1;b.step(s2,t,'The rest');
      rel.forEach(function(id){
        var s0=t;b.say(t,capH('After the install',id+' · '+runText(id)));
        var e=b.wireIn(S.tw[id],t,{tag:S.tags[id]});
        S.stk.forEach(function(x){if(labs.indexOf(x.part)>=0&&(realMp.ends[id]||[]).indexOf(x.part)>=0)b.fade(x.el,e-.3,.5,0,null)});
        t=e+.2;b.step(s0,t,id);
      });
      var lateStk=S.stk.filter(function(x){return labs.indexOf(x.part)>=0&&!rel.some(function(id){return (realMp.ends[id]||[]).indexOf(x.part)>=0})});
      if(lateStk.length){var s3=t;lateStk.forEach(function(x){b.fade(x.el,t,.6,0,null)});b.say(t,capH('After the install','Dashed: where the stock connector went'));t+=.9;b.step(s3,t,'Stock lead')}
      var s4=t;b.say(t,capH('After the install',rel.length?rel.length+(rel.length===1?' run':' runs')+' where '+fid+' was':(goes?'Nothing new lands where it was':'Unchanged')));t+=.8;b.step(s4,t,'After');
      ChangePlayer.start(b,t,{paused:keepAt!=='play',at:keepAt==='after'?t:0,noDone:true,replay:function(){ChangePlayer.seek(0,true);ChangePlayer.play()},onState:cmpUI});
      if(keepAt==='play')ChangePlayer.play();
      cmpUI();
      /* Close up on a phone: scroll to the wire */
      var sc=el('mscroll');if(sc.scrollWidth>sc.clientWidth+2)try{var bb=S.fw[fid].getBBox(),ratio=S.st.clientWidth/1400;sc.scrollLeft=Math.max(0,(bb.x+bb.width/2)*ratio-sc.clientWidth/2)}catch(e){}
      /* the card */
      var d=el('mdetail');d.className='mdetail';d.style.borderLeftColor=SYSC[r.sys]||'var(--accent)';
      d.innerHTML='<div class="d-head"><span class="d-id">'+esc(fid)+'</span><span class="d-route">'+esc(r.frm)+' → '+esc(r.to)+'</span></div>'+
        '<div class="d-grid"><div><span class="k">Out of the box</span><span>'+swatch(r.color)+esc(cname(r.color))+', '+esc(r.sys==='H'?'heater circuit':lc1(SYSN[r.sys]||r.sys))+(r.what?'. '+esc(r.what):'')+'</span></div></div>'+afterHtml(fid);
      el('msel').innerHTML='<b>'+esc(fid)+'</b><span class="rt">Compare: out of the box and after the install</span>';
    }
    function cmpUI(){
      if(A!=='cmp')return;
      var t=ChangePlayer.time(),end=ChangePlayer.end();
      Array.prototype.forEach.call(document.querySelectorAll('[data-cmpv]'),function(b){var w=b.getAttribute('data-cmpv');b.setAttribute('aria-pressed',String(w==='box'?t<=.9:t>=end-1e-3))});
      var f=facOf(key),ids=Object.keys(f.runs),i=ids.indexOf(cmp);
      el('cmp-id').textContent=cmp+' · '+(i+1)+' of '+ids.length;el('mcmp').hidden=false;
    }
    function cmpStep(n){var ids=Object.keys(facOf(key).runs),i=ids.indexOf(cmp);compare(ids[(i+n+ids.length)%ids.length],ChangePlayer.time()>=ChangePlayer.end()-1e-3?'after':'box')}
    return {show:show,init:init,focus:focus,deep:deep};
  })();
