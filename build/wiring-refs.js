  /* ---------- back-links from the wiring map ----------
     For whatever is picked on the map (a run, a part or a set of runs), every place on the site whose instructions
     link to it. Found from those pages' own link data, so the two directions can't drift apart: the part guides'
     step map fields (part-guides-data.js), the runbook's (runbook-phases.js), the troubleshooting symptoms'
     (trouble-data.js) and the power-on checks' MAPS (checks-map.js, titles pulled from checks.tpl.html at build).
     Each target is resolved against the drawing on show, exactly as the map resolves a link to it. Whole-map and
     layer links are left out: they point at everything. */
  var REFS=(function(){
    var PGD=(function(){
      var GM=window.GaggiaMachine;
      function prof(){return (GM&&GM.get())||{}}
      function famOf(){var p=prof();return p.model?(p.model==='GC'?'GC':'GCP'):null}
%%INCLUDE:part-guides-data.js%%
      return G;
    })();
    var RB=(function(){
%%INCLUDE:official-links.js%%
%%INCLUDE:runbook-phases.js%%
      return PHASES;
    })();
    var TR=(function(){
%%INCLUDE:trouble-data.js%%
      return T;
    })();
    var CK=(function(){
%%INCLUDE:checks-map.js%%
      return MAPS;
    })();
    var CKT=%%CHECK_INDEX%%;
    var GNAME={tc:'Thermocouple',ps:'Pressure sensor',fuse:'Resettable fuse',wire:'Making the wires',ssr:'SSR',sw:'Switches'};
    var VNAME={ptb:'tap block',tee:'T-fitting',SI:'stock wiring',CW:'custom wiring',GCP:'Pro family',GC:'original Classic'};
    function GMo(){return window.GaggiaMachine||null}
    function e(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
    /* a machine.js condition, with the install path, family and voltage taken from the drawing on show */
    function okFor(w,v){
      if(!w)return true;
      return w.split(';').every(function(cl){
        var neg=cl.charAt(0)==='!',c=neg?cl.slice(1):cl,i=c.indexOf(':'),k=c.slice(0,i),vals=c.slice(i+1).split(','),r;
        if(k==='wpath'||k==='path')r=vals.indexOf(v.path)>=0;
        else if(k==='fam')r=vals.indexOf(v.fam)>=0;
        else if(k==='volts')r=vals.indexOf(String(v.volts))>=0;
        else{var m=GMo();return !m||m.matches(cl)}
        return neg?!r:r;
      });
    }
    /* the checks' own condition tokens (as in checks.tpl.html) */
    function okCheck(when,v){
      if(!when)return true;
      var m=GMo(),p=m&&m.get(),model=p&&p.model;
      return when.split(' ').every(function(tok){return tok.split('|').some(function(a){
        if(a==='SI'||a==='CW')return v.path===a;
        if(a==='GC'||a==='GCP')return v.fam===a;
        if(a==='120'||a==='230')return String(v.volts)===a;
        if(a==='ECO'){var x=m&&m.eco&&m.eco();return x!==false}
        return !model||model===a;
      })});
    }
    function targets(map){if(map==null)return [];return typeof map==='string'?[[null,map]]:map}
    function resolve(t,c){
      var out={runs:[],part:null};
      String(t||'').split(';').forEach(function(x){
        var i=x.indexOf(':');if(i<0)return;var k=x.slice(0,i),val=x.slice(i+1);
        if(k==='run')val.split('|').some(function(id){if(c.hasRun(id)){out.runs.push(id);return true}return false});
        else if(k==='part')val.split('|').some(function(id){if(c.hasPart(id)){out.part=id;return true}return false});
        else if(k==='runs')val.split(',').forEach(function(id){if(c.hasRun(id))out.runs.push(id)});
        else if(k==='short')val.split(',').forEach(function(p){c.v.runs.forEach(function(r){if(r.short&&r.short.indexOf(p)===0&&c.hasRun(r.id))out.runs.push(r.id)})});
      });
      return out;
    }
    /* does a resolved target cover the pick? A part covers the runs that land on it, except the PCB, where everything lands */
    function covers(res,sel,c){
      var runs=res.runs.slice();
      if(res.part&&res.part!=='pcb')runs=runs.concat(c.landing(res.part));
      if(sel.t==='run')return runs.indexOf(sel.id)>=0;
      if(sel.t==='part'){if(res.part===sel.id)return true;if(sel.id==='pcb')return false;var l=c.landing(sel.id);return res.runs.some(function(r){return l.indexOf(r)>=0})}
      if(sel.t==='set')return runs.some(function(r){return sel.ids.indexOf(r)>=0});
      return false;
    }
    function hit(map,sel,c){return targets(map).some(function(x){return okFor(x[2],c.v)&&covers(resolve(x[1],c),sel,c)})}
    function tslug(i){var s='t-'+TR[i].s.toLowerCase().replace(/\{[a-z]+\}/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60),n=0;for(var j=0;j<i;j++)if(TR[j].s===TR[i].s)n++;return n?s+'-'+(n+1):s}
    function fillT(s){var m=GMo();return String(s).replace(/\{gfci\}/g,m?m.text('gfci'):'GFCI or RCD').replace(/\{outlet\}/g,m?m.text('outlet'):'GFCI- or RCD-protected outlet').replace(/\{volts\}/g,m?m.text('volts'):'your mains voltage')}
    function html(sel,c){
      if(!sel||!c.v)return '';
      var v=c.v,groups=[];
      /* part guides: one link per guide, to the first step that covers it */
      var pg=[];
      Object.keys(PGD).forEach(function(k){
        var d=PGD[k],vars=d.vars?d.vars.map(function(x){return x.k}):['all'];
        vars.forEach(function(vk){
          if((vk==='SI'||vk==='CW')&&vk!==v.path)return;
          if((vk==='GC'||vk==='GCP')&&(vk!==v.fam||(d.mpath&&d.mpath!==v.path)))return;
          var all=(d.steps[vk]||d.steps.all||[]),m=GMo(),shown=all.filter(function(s){return !s.when||!m||m.matches(s.when)});
          for(var i=0;i<shown.length;i++){var s=shown[i];if(okFor(s.when,v)&&hit(s.map,sel,c)){
            var lab=GNAME[k]+(vars.length>1&&k==='ps'?' ('+VNAME[vk]+')':'')+', step '+(i+1)+': '+s.t;
            pg.push('<a href="part-guides.html#'+k+(vars.length>1?'/'+vk:'')+'/'+(i+1)+'">'+e(lab)+'</a>');break}}
        });
      });
      /* every new wire: how to make it, and the boiler-end step when it has one */
      if(sel.t==='run'){
        var r=c.runOf(sel.id);
        if(r&&!r.stock){
          var bare=!!(r.k&&(['b','mb'].indexOf(r.k[0])>=0||['b','mb'].indexOf(r.k[1])>=0)),ws=(PGD.wire.steps.all||[]).filter(function(s){var m=GMo();return !s.when||!m||m.matches(s.when)}),bi=-1;
          ws.forEach(function(s,i){if(bi<0&&/^Bare spades/.test(s.t))bi=i});
          pg.push(bare&&bi>=0?'<a href="part-guides.html#wire/'+(bi+1)+'">'+e('Making the wires, step '+(bi+1)+': '+ws[bi].t)+'</a>':'<a href="part-guides.html#wire">Making the wires</a>');
        }
      }
      if(pg.length)groups.push(['Part guides',pg]);
      /* runbook steps */
      var rb=[];
      RB.forEach(function(p,pi){p.steps.forEach(function(s){
        if(s.map==null||!okFor(s.w,v))return;
        var m=GMo();if(s.w&&m&&!m.matches(s.w))return;
        if(hit(s.map,sel,c)){var t=Array.isArray(s.t)?s.t.map(function(x){return typeof x==='string'?x:x[0]}).join(' '):s.t;rb.push('<a href="runbook.html#'+s.id+'">'+e('Phase '+pi+': '+fillT(t))+'</a>')}
      })});
      if(rb.length)groups.push(['Runbook',rb]);
      /* power-on checks for this schematic */
      var ck=[];
      CKT.forEach(function(x){
        if(!(x[0] in CK)||!okCheck(x[2],v))return;
        var t=CK[x[0]];if(typeof t==='function')t=t(v);if(!t)return;
        if(covers(resolve(t,c),sel,c))ck.push('<a href="power-on-checks.html#'+x[0]+'" title="'+e(x[1])+'">'+x[0]+'</a>');
      });
      if(ck.length)groups.push(['Power-on checks',ck]);
      /* troubleshooting */
      var tr=[];
      TR.forEach(function(t,i){
        if(t.map==null||!okFor(t.w,v))return;
        if(hit(t.map,sel,c))tr.push('<a href="troubleshooting.html#'+tslug(i)+'">'+e(fillT(t.s))+'</a>');
      });
      if(tr.length)groups.push(['Troubleshooting',tr]);
      if(!groups.length)return '';
      return '<div class="d-refs"><span class="k">Elsewhere on the site</span><ul>'+groups.map(function(g){
        return '<li><span class="rg">'+g[0]+'</span>'+g[1].join(g[0]==='Power-on checks'?' ':'<span class="sep"> · </span>')+'</li>';
      }).join('')+'</ul></div>';
    }
    return {html:html};
  })();
