/* Shared by the wiring, cut list and wire label pages: the official schematics as data, which one fits the
   reader's Gaggia, and the variant switcher. WD comes from wiring-data.json (built by research/tools/gg_wiring.py),
   with the add-on schematics (the Shelly, keys ending -sh) built from it by addons.py. */
  var WD=%%WIRING_DATA%%;
  var VARS=WD.variants;
  var ORDERV=['si-gcp-120','si-gc-120','si-gc-230','cw-gcp-120','cw-gcp-230','cw-gc-120','cw-gc-230','cw-gcp-120-sh','cw-gcp-230-sh'].filter(function(k){return VARS[k]});
  var SWATCH={red:'#C2412F',orange:'#E08A1E',blue:'#2F5FB3',green:'#2D7A4C',white:'#F4F4F2',black:'#1B1D20',yellow:'#E3C21A',purple:'#7A4FC0',brown:'#7A4A2A',gray:'#8C939A',pink:'#D9479B'};
  var SYSNAME={L:'Line',H:'Heater line',N:'Neutral',E:'Earth',LV:'Switch signals and SSR control',LVG:'Switch signals and SSR control'};
  function GM(){return window.GaggiaMachine||null}
  /* the variant for a profile: Pro-family models share the Pro schematics; there is no stock-integration drawing for 230 V Pros */
  function variantFor(p){
    if(!p)return null;
    var fam=p.model?(p.model==='GC'?'gc':'gcp'):null,v=p.volts;
    if(!fam||!v)return null;
    var path=p.path==='CW'?'cw':p.path==='SI'?'si':null;
    if(!path)return null;
    var k=path+'-'+fam+'-'+v;
    if(!VARS[k]&&path==='si')k='cw-'+fam+'-'+v;
    /* with the Shelly chosen, a schematic that has a Shelly version opens on it */
    if(p.shelly&&VARS[k+'-sh'])k+='-sh';
    return VARS[k]?k:null;
  }
  /* with only part of the profile set (say model and voltage, no install path), open on the closest schematic:
     same family and voltage, stock wiring first; a schematic the reader picked before stays if it still fits */
  function nearestFor(p,prev){
    if(!p)return null;
    var fam=p.model?(p.model==='GC'?'GC':'GCP'):null;
    /* a Shelly schematic only when the Shelly is chosen, and then instead of the one it's built on */
    function shOk(k){return VARS[k].shelly?!!p.shelly:!(p.shelly&&VARS[k+'-sh'])}
    function ok(k){var v=VARS[k];return (!fam||v.fam===fam)&&(!p.volts||v.volts===p.volts)&&(!p.path||v.path===p.path||(p.path==='SI'&&v.path==='CW'))&&shOk(k)}
    if(!fam&&!p.volts&&!p.shelly)return null;
    if(prev&&VARS[prev]&&ok(prev))return prev;
    /* with the Shelly chosen, its schematics come first */
    var order=p.shelly?ORDERV.filter(function(k){return VARS[k].shelly}).concat(ORDERV.filter(function(k){return !VARS[k].shelly})):ORDERV;
    for(var i=0;i<order.length;i++)if(ok(order[i]))return order[i];
    return null;
  }
  function famName(f){return f==='GC'||f==='gc'?'Classic':'Pro family'}
  function vlabel(k){var v=VARS[k];return (v.path==='SI'?'Stock wiring':'Custom wiring')+', '+famName(v.fam)+' '+v.volts+' V'+(v.shelly?', with a Shelly':'')}
  /* the switcher: data-wv buttons; picking one doesn't change the reader's saved Gaggia unless they ask */
  function switcher(el,cur,onpick){
    var prof=GM()&&GM().get(),mine=variantFor(prof);
    var g={SI:[],CW:[],SH:[]};
    ORDERV.forEach(function(k){g[VARS[k].shelly?'SH':VARS[k].path].push(k)});
    /* the Shelly schematics are listed once the reader has chosen the Shelly, or while one is on show */
    if(!(prof&&prof.shelly)&&!(VARS[cur]&&VARS[cur].shelly))g.SH=[];
    var NM={SI:['Stock','Stock wiring integration'],CW:['Custom','Custom wiring'],SH:['Shelly','Custom wiring with a Shelly']};
    el.innerHTML=['SI','CW','SH'].map(function(p){
      if(!g[p].length)return '';
      return '<div class="mrow"><span class="mk">'+NM[p][0]+'</span><div class="mseg" role="group" aria-label="'+NM[p][1]+'">'+g[p].map(function(k){var v=VARS[k];return '<button type="button" data-wv="'+k+'" aria-pressed="'+(k===cur)+'">'+famName(v.fam)+' '+v.volts+' V'+(k===mine?' <span class="mine-dot" title="Your Gaggia">●</span>':'')+'</button>'}).join('')+'</div></div>';
    }).join('');
    Array.prototype.forEach.call(el.querySelectorAll('[data-wv]'),function(b){b.addEventListener('click',function(){onpick(b.getAttribute('data-wv'))})});
  }
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function swatch(c){return '<span class="swatch" style="background:'+(SWATCH[c]||'transparent')+'"></span>'}
