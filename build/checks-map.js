  /* Shared by checks.tpl.html and the wiring page's back-links (wiring-refs.js). */
  function idl(v,res){var out=[];res.forEach(function(re){v.runs.forEach(function(r){if(re.test(r.short)&&out.indexOf(r.id)<0)out.push(r.id)})});return out}
  /* where each check sits on the wiring map (see maplink.js); a function gets the schematic, so path checks light
     the same runs their text names */
  function rs(res){return function(v){var a=idl(v,res);return a.length?'runs:'+a.join(','):''}}
  var SWL='short:J7,Brew sw 2 →,Steam sw P(3-4) →,Brew sw P(1-2) →';
  /* each switch's signal wire plus the ground and its jumper */
  var GJ='J7 GND,Brew sw 2 →,Steam sw P(3-4) →,Brew sw P(1-2) →',BRL='short:J7 B,'+GJ,STL='short:J7 S,'+GJ;
  function E(v){return v.path==='CW'?'layer:E':null}
  var MAPS={a3:'',a4:E,b1:E,b2:E,b3:E,b5:E,b7:'run:TC',
    c1:'part:boiler',c2:'part:boiler',c3:'part:boiler',c4:'part:pump',c5:'part:pump',c6:'part:sol',c7:'run:TC',c8:function(v){return v.path==='SI'?'runs:3,P':'part:pump'},
    d3:'short:J7',d4:'short:J7',d5:'short:J12',d6:'short:J13',
    e1:rs([/^Socket L/,/^Power sw (4|P\(7-8\)) → SSR load R/,/^SSR load R → J11/]),e2:rs([/^Socket L/,/^Power sw (4|P\(7-8\)) → SSR load R/,/^SSR load R → J11/]),
    e3:rs([/^Socket N → Pump fuse spade/,/^Pump fuse spade → J10/,/^Socket N → J10/]),e4:rs([/^SSR load L → Fuse/,/^Fuse left →/,/^SSR load L → Reset fuse/,/^Reset fuse left →/]),
    e5:rs([/^BN2 element splice → Socket N/,/^Element (TR|BR) → BN2/]),e6:rs([/^J13 3 →/]),e7:rs([/^J12 P →/]),e8:rs([/^BN2 element splice → Valve N/,/^BN2 element splice → Socket N/]),
    e9:rs([/^Pump N → Pump fuse/,/^Pump fuse → Pump N/,/^Pump fuse spade → Pump fuse/,/^Pump fuse → Pump fuse spade/,/^Socket N → Pump fuse spade/,/^Valve N → Pump fuse spade/]),
    e11:'run:L',e12:'run:L',e13:'run:N',e14:'run:N',e15:'runs:Sb,J',e16:'part:boiler',e17:'run:3',e18:'run:P',e19:'part:swS',
    e21:'run:L',e22:'run:L',e23:'run:N',e24:'runs:J,Sb',e25:'part:boiler',e26:'run:3',e27:'run:P',e28:'part:sol',
    f1:BRL,f2:BRL,f3:STL,f4:STL,f5:'short:J9 R1',f6:'short:J9 GND',f7:SWL,f8:SWL,f9:SWL,
    g1:'part:boiler',g4:'part:ssr',g5:'runs:J,Sa,Sb',g6:'part:rf|boiler',g7:'part:f:S5|housing',g8:'part:swB',g10:'part:pcb',g11:'layer:lv',g12:'run:TC',g13:'run:SCR',g16:'',g17:'part:pcb',g18:'run:TC',
    h1:E,h2:E,
    /* the Shelly add-on */
    d8:'part:s6',d9:'short:J7',d10:'part:shelly',e30:rs([/^Socket L → Shelly L/]),e31:rs([/^Shelly O →/,/^BN2 S6 → SSR load R/,/^SSR load R → J11/]),
    e32:'part:shelly',e33:rs([/^Socket L → Power sw 5/,/^Power sw 4 → Shelly SW/]),e34:rs([/^Socket L → Power sw 5/,/^Power sw 4 → Shelly SW/]),e35:rs([/^Socket N → Shelly N/]),
    g19:'part:encl',g20:'part:shelly',g21:'part:encl',g22:'part:swP',h7:'part:shelly'};
