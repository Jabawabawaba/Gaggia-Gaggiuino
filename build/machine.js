/* Site-wide "your Gaggia" profile: model, mains voltage, Eco board (230 V Classic Pro only) and install path.
   Every field is optional. Elements with data-when="model:GCP,EVO;volts:120;path:SI" show only when every
   condition matches. A field the user hasn't set never hides anything: with no model, every model's notes
   show; with no voltage, both voltages' notes show and the wording stays generic. Nothing is filled in for them.
   Condition keys:
     model:GC,GCP,EVO,E24   the machine (GC = original Classic; GCP, EVO, E24 = the Classic Pro family)
     fam:GC | fam:GCP       Classic or Classic Pro family (Pro, Eco, Evo, E24)
     volts:120 | volts:230
     eco:yes | eco:no       230 V Pro-family machines with the Eco board (auto-off PCB, push-button power switch)
     opv9                   US Evo Pro and E24: 9 bar OPV that has to go up to 10-12 bar
     ground                 120 V original Classic: often a 2-pin cord, needs grounding
     path:SI | path:CW      stock wiring integration or custom wiring, as picked
     wpath:SI | wpath:CW    the wiring the pages use: a 230 V Pro-family machine has no official stock-integration drawing,
                            so it gets custom wiring even when stock wiring is picked
     set:model,volts,path   true only once every named field is picked (for wording that replaces a combined version)
     unset:model,volts,path true while any named field is still open (for the combined version itself)
     !key:...               the opposite of key:..., but only once that field is decided (e.g. !opv9: a known machine without the 9 bar OPV)
   Elements with data-mtext="gfci|outlet|volts" get voltage-specific wording.
   Inside an element with class m-showall, data-when never hides anything: that's the "Show all models" view.
   txt(x) turns text into what applies: a plain string as is, or a list of segments, each a string (always kept)
   or [text, when] (kept only when the condition matches), joined with spaces. */
(function(){
  var KEY='gaggia-machine-v1',MODELS=['GC','GCP','EVO','E24'];
  var NAMES={GC:'Classic',GCP:'Classic Pro',EVO:'Classic Evo',E24:'Classic E24'};
  var SHORT={GC:'Classic',GCP:'Pro',EVO:'Evo',E24:'E24'};
  /* the Evo and E24 carry "Pro" only in North America: Classic Evo Pro and Classic Pro E24 at 120 V */
  function shortName(m,v){return v===120?{EVO:'Evo Pro',E24:'Pro E24'}[m]||SHORT[m]:SHORT[m]}
  function longName(m,v){return v===120?{EVO:'Classic Evo Pro',E24:'Classic Pro E24'}[m]||NAMES[m]:NAMES[m]}
  var TEXT={
    gfci:{'120':'GFCI','230':'RCD','':'GFCI (RCD outside North America)'},
    outlet:{'120':'GFCI-protected outlet','230':'socket with RCD protection','':'GFCI- or RCD-protected outlet'},
    volts:{'120':'120 V','230':'230 V','':'your mains voltage'}
  };
  function pro(m){return m==='GCP'||m==='EVO'||m==='E24'}
  function clean(s){
    if(!s||typeof s!=='object')return null;
    var model=MODELS.indexOf(s.model)>=0?s.model:null;
    var v=Number(s.volts),volts=v===230?230:v===120?120:null;
    /* any 230 V Pro-family machine can go either way: most EU and UK ones have the Eco board, other markets aren't confirmed */
    var eco=pro(model)&&volts===230&&(s.eco===true||s.eco===false)?s.eco:null;
    var path=s.path==='SI'||s.path==='CW'?s.path:null;
    if(!model&&!volts&&!path)return null;
    return {model:model,volts:volts,eco:eco,path:path};
  }
  function read(){try{return clean(JSON.parse(localStorage.getItem(KEY)||'null'))}catch(e){return null}}
  var prof=read();
  /* Eco board: true, false, or null when it isn't known yet */
  function ecoOf(p){
    if(!p||!p.model||p.model==='GC')return p&&p.model==='GC'?false:null;
    if(p.volts===120)return false;
    if(p.volts!==230)return null;
    return p.eco;
  }
  /* the wiring the pages actually use (see wpath above); null until an install path is picked */
  function wpathOf(p){
    if(!p||!p.path)return null;
    if(p.path==='CW'||p.model==='GC')return p.path;
    /* stock wiring on a Pro-family machine, or on an unknown model: it holds at 120 V, becomes custom wiring at 230 V, and is open until the voltage (and model) are known */
    if(p.model)return p.volts===120?'SI':p.volts===230?'CW':null;
    return p.volts===120?'SI':null;
  }
  function conds(when){
    return String(when||'').split(';').map(function(c){
      c=c.trim();var i=c.indexOf(':');return {k:i<0?c:c.slice(0,i),vals:i<0?[]:c.slice(i+1).split(',')};
    }).filter(function(c){return c.k});
  }
  /* true unless the profile rules the element out; unknown fields never rule anything out */
  function matches(when){
    if(!when)return true;
    if(!prof)return conds(when).every(function(c){return c.k!=='set'});
    return conds(when).every(one);
  }
  /* one condition; "!key" is true when the field is decided and the condition doesn't hold, and never hides while it's open */
  function one(c){
    if(c.k.charAt(0)==='!'){var inner={k:c.k.slice(1),vals:c.vals};return !decidedOne(inner)||!one(inner)}
    return (function(c){
      if(c.k==='model')return !prof.model||c.vals.indexOf(prof.model)>=0;
      if(c.k==='fam')return !prof.model||c.vals.indexOf(pro(prof.model)?'GCP':'GC')>=0;
      if(c.k==='volts')return !prof.volts||c.vals.indexOf(String(prof.volts))>=0;
      if(c.k==='eco'){var e=ecoOf(prof);if(e===null)return true;return c.vals.indexOf(e?'yes':'no')>=0}
      if(c.k==='opv9'){if(!prof.model)return true;return (prof.model==='EVO'||prof.model==='E24')&&prof.volts!==230}
      if(c.k==='ground'){if(!prof.model)return true;return prof.model==='GC'&&prof.volts!==230}
      if(c.k==='path')return !prof.path||c.vals.indexOf(prof.path)>=0;
      if(c.k==='wpath'){var w=wpathOf(prof);return !w||c.vals.indexOf(w)>=0}
      if(c.k==='set')return c.vals.every(function(f){return !!prof[f]});
      if(c.k==='unset')return c.vals.some(function(f){return !prof[f]});
      return true;
    })(c);
  }
  /* true when the profile pins down every field the condition depends on (so a "which machines" tag adds nothing) */
  function decided(when){
    if(!prof)return false;
    return conds(when).every(decidedOne);
  }
  function decidedOne(c){
    if(!prof)return false;
    if(c.k.charAt(0)==='!')return decidedOne({k:c.k.slice(1),vals:c.vals});
    return (function(c){
      if(c.k==='model'||c.k==='fam')return !!prof.model;
      if(c.k==='volts')return !!prof.volts;
      if(c.k==='eco')return ecoOf(prof)!==null;
      if(c.k==='opv9'||c.k==='ground')return !!prof.model&&!!prof.volts;
      if(c.k==='path')return !!prof.path;
      if(c.k==='wpath')return wpathOf(prof)!==null;
      if(c.k==='set'||c.k==='unset')return true;
      return true;
    })(c);
  }
  function txt(x){
    if(x==null)return '';
    if(!Array.isArray(x))return String(x);
    return x.filter(function(seg){return typeof seg==='string'||matches(seg[1])}).map(function(seg){return typeof seg==='string'?seg:seg[0]}).join(' ');
  }
  function text(key){var t=TEXT[key];if(!t)return '';return prof&&prof.volts?t[String(prof.volts)]:t['']}
  function label(p){
    p=p||prof;if(!p)return 'Set it';
    var a=[];if(p.model)a.push(shortName(p.model,p.volts));if(p.volts)a.push(p.volts+' V');
    if(p.path)a.push(p.path==='SI'?'stock wiring':'custom wiring');
    return a.join(', ');
  }
  function missing(p){
    p=p||prof;if(!p)return [];var m=[];
    if(!p.model)m.push('model');
    if(!p.volts)m.push('mains voltage');
    if(!p.path)m.push('install path');
    return m;
  }
  function ecoOpen(p){return !!(p&&p.model&&pro(p.model)&&p.volts===230&&p.eco===null)}
  function andList(a){return a.length<2?a.join(''):a.slice(0,-1).join(', ')+' and '+a[a.length-1]}
  function summary(p){
    p=p||prof;
    if(!p)return 'Pick your model, voltage and install path. Until you do, every page shows all the model notes, each tagged with the machines it applies to.';
    var m=missing(p),e=ecoOf(p),w=wpathOf(p);
    var what=(p.model?longName(p.model,p.volts):'Gaggia')+(p.volts?' ('+p.volts+' V'+(e?', Eco board':'')+')':'');
    var how=w==='CW'||p.path==='CW'?' with custom wiring':p.path==='SI'?' with stock wiring integration':'';
    var nodraw=p.path==='SI'&&w==='CW'?' There\'s no official stock-integration drawing for a 230 V Pro-family machine.':'';
    var warn=e&&p.path==='SI'&&!nodraw?' The official guide recommends custom wiring for Eco-board machines.':'';
    var asks=[];if(m.length)asks.push('add your '+andList(m));if(ecoOpen(p))asks.push('say whether it has the Eco board');
    var more=asks.length?' '+andList(asks).replace(/^./,function(c){return c.toUpperCase()})+' to narrow them down; until then those notes all show.':'';
    return 'Pages now show the steps and notes for a '+what+how+'.'+nodraw+warn+more;
  }
  function apply(root){
    root=root||document;
    Array.prototype.forEach.call(root.querySelectorAll('[data-when]'),function(el){el.hidden=!matches(el.getAttribute('data-when'))&&!el.closest('.m-showall')});
    /* "Show all models" switches: data-showall="id of the element to open up"; they only show once a model is picked */
    Array.prototype.forEach.call(root.querySelectorAll('[data-showall]'),function(b){
      var t=document.getElementById(b.getAttribute('data-showall'));if(!t)return;
      /* count what the switch would bring back, not the pieces inside something that's already counted */
      var n=Array.prototype.filter.call(t.querySelectorAll('[data-when]'),function(el){
        if(matches(el.getAttribute('data-when')))return false;
        for(var a=el.parentElement;a&&a!==t;a=a.parentElement){if(a.hasAttribute('data-when')&&!matches(a.getAttribute('data-when')))return false}
        return true;
      }).length;
      b.hidden=!n;var on=t.classList.contains('m-showall');
      b.setAttribute('aria-pressed',String(on));
      b.textContent=on?'Show only your Gaggia':'Show all models ('+n+' more)';
    });
    Array.prototype.forEach.call(root.querySelectorAll('[data-mtext]'),function(el){var t=text(el.getAttribute('data-mtext'));if(t)el.textContent=t});
    var l=document.getElementById('mchip-l');
    if(l){var main=[];if(prof&&prof.model)main.push(shortName(prof.model,prof.volts));if(prof&&prof.volts)main.push(prof.volts+' V');
      var x=prof&&prof.path?(prof.path==='SI'?'stock wiring':'custom wiring'):'';
      l.textContent=!prof?'Set it':main.length?main.join(', '):x;
      if(main.length&&x){var sp=document.createElement('span');sp.className='mchip-x';sp.textContent=', '+x;l.appendChild(sp)}}
    var ch=document.getElementById('mchip');if(ch){ch.classList.toggle('set',!!prof);ch.setAttribute('aria-label','Your Gaggia: '+(prof?label():'not set'))}
    syncPanel();
  }
  function set(p){
    prof=p?clean(p):null;
    try{if(prof)localStorage.setItem(KEY,JSON.stringify(prof));else localStorage.removeItem(KEY)}catch(e){}
    apply();
    try{window.dispatchEvent(new CustomEvent('gaggia-machine',{detail:prof}))}catch(e){}
  }
  /* start from what's saved, never from guesses */
  function current(){return Object.assign({model:null,volts:null,eco:null,path:null},prof||{})}
  /* ---- nav panel ---- */
  function syncPanel(){
    var pan=document.getElementById('mpanel');if(!pan)return;
    var p=prof||{},e=ecoOf(p);
    Array.prototype.forEach.call(pan.querySelectorAll('[data-mmodel]'),function(b){b.setAttribute('aria-pressed',String(b.getAttribute('data-mmodel')===p.model))});
    Array.prototype.forEach.call(pan.querySelectorAll('[data-mvolt]'),function(b){b.setAttribute('aria-pressed',String(Number(b.getAttribute('data-mvolt'))===p.volts))});
    Array.prototype.forEach.call(pan.querySelectorAll('[data-meco]'),function(b){b.setAttribute('aria-pressed',String(p.eco!==null&&p.eco!==undefined&&(b.getAttribute('data-meco')==='yes')===p.eco))});
    Array.prototype.forEach.call(pan.querySelectorAll('[data-mpath]'),function(b){b.setAttribute('aria-pressed',String(b.getAttribute('data-mpath')===p.path))});
    var er=document.getElementById('m-eco-row');if(er)er.hidden=!(pro(p.model)&&p.volts===230);
    var en=document.getElementById('m-eco-note');if(en)en.hidden=!(e===true);
    var s=document.getElementById('m-summary');if(s)s.textContent=summary();
  }
  function wire(){
    var chip=document.getElementById('mchip'),pan=document.getElementById('mpanel');
    var nt=document.getElementById('nav-toggle'),nl=document.getElementById('nav-links');
    /* the page list and the Your Gaggia panel open over the page, one at a time; a tap outside or Escape closes them */
    var scrim=document.getElementById('nav-scrim');
    function sync(){if(scrim)scrim.hidden=!((nl&&nl.classList.contains('open'))||(pan&&!pan.hidden))}
    function closeMenu(){if(nt&&nl&&nl.classList.contains('open')){nt.setAttribute('aria-expanded','false');nl.classList.remove('open');sync();return true}}
    function closePanel(){if(chip&&pan&&!pan.hidden){pan.hidden=true;chip.setAttribute('aria-expanded','false');sync();return true}}
    if(scrim)scrim.addEventListener('click',function(){closeMenu();closePanel()});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&closeMenu())nt.focus()});
    if(chip&&pan){
      chip.addEventListener('click',function(){var open=pan.hidden;pan.hidden=!open;chip.setAttribute('aria-expanded',String(open));if(open)closeMenu();sync()});
      pan.addEventListener('click',function(e){
        var b=e.target.closest('button');if(!b||b.disabled)return;
        var p=current();
        if(b.hasAttribute('data-mmodel'))p.model=b.getAttribute('data-mmodel');
        else if(b.hasAttribute('data-mvolt'))p.volts=Number(b.getAttribute('data-mvolt'));
        else if(b.hasAttribute('data-meco'))p.eco=b.getAttribute('data-meco')==='yes';
        else if(b.hasAttribute('data-mpath'))p.path=b.getAttribute('data-mpath');
        else if(b.id==='m-clear'){set(null);return}
        else if(b.id==='m-done'){pan.hidden=true;chip.setAttribute('aria-expanded','false');sync();chip.focus();return}
        else return;
        set(p);
      });
      document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!pan.hidden){pan.hidden=true;chip.setAttribute('aria-expanded','false');sync()}});
    }
    if(nt&&nl)nt.addEventListener('click',function(){var open=nt.getAttribute('aria-expanded')!=='true';nt.setAttribute('aria-expanded',String(open));nl.classList.toggle('open',open);if(open)closePanel();sync()});
    /* buttons on a page that set one field: data-setmachine="model:GCP" or "path:CW" */
    Array.prototype.forEach.call(document.querySelectorAll('[data-setmachine]'),function(b){
      b.addEventListener('click',function(){
        var p=current();
        String(b.getAttribute('data-setmachine')).split(';').forEach(function(kv){
          var i=kv.indexOf(':');if(i<0)return;var k=kv.slice(0,i).trim(),v=kv.slice(i+1).trim();
          if(k==='model')p.model=v;else if(k==='volts')p.volts=Number(v);else if(k==='eco')p.eco=v==='yes';else if(k==='path')p.path=v;
        });
        set(p);
      });
    });
    document.addEventListener('click',function(e){
      var b=e.target.closest('[data-showall]');if(!b)return;
      var t=document.getElementById(b.getAttribute('data-showall'));if(!t)return;
      t.classList.toggle('m-showall');apply();
    });
    var inViewer=typeof window.claude!=='undefined';
    var pb=document.querySelectorAll('[data-print]');
    if(!inViewer)Array.prototype.forEach.call(pb,function(b){b.hidden=false;b.addEventListener('click',function(){window.print()})});
    apply();
    hints();window.addEventListener('resize',hints);
  }
  /* "swipe sideways" under drawings and tables that are wider than the screen */
  function hints(){
    Array.prototype.forEach.call(document.querySelectorAll('.scroll,.tablewrap,.table-wrap'),function(el){
      var over=el.scrollWidth>el.clientWidth+8,h=el.nextElementSibling&&el.nextElementSibling.classList.contains('swipe-hint')?el.nextElementSibling:null;
      if(over&&!h){h=document.createElement('p');h.className='swipe-hint';h.textContent=el.querySelector('svg')?'Swipe sideways to see the whole drawing':'Swipe sideways to see every column';el.parentNode.insertBefore(h,el.nextSibling)}
      else if(!over&&h)h.remove();
    });
  }
  function openPanel(){
    var chip=document.getElementById('mchip'),pan=document.getElementById('mpanel');
    if(!chip||!pan)return;
    try{window.scrollTo({top:0,behavior:'smooth'})}catch(e){window.scrollTo(0,0)}
    if(pan.hidden)chip.click();
  }
  window.GaggiaMachine={get:function(){return prof},txt:txt,openPanel:openPanel,name:function(){return prof&&prof.model?longName(prof.model,prof.volts):null},set:set,current:current,matches:matches,decided:decided,text:text,label:label,missing:missing,summary:summary,apply:apply,eco:function(){return ecoOf(prof)},wpath:function(){return wpathOf(prof)},names:NAMES};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire);else wire();
})();
