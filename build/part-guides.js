/* Part guides: a stepped, animated drawing for each part, with the steps written out beside it.
   Each step lists moves for the drawing's data-k pieces as [key, {x,y,r,s,sx,sy,o,d}, delay ms, duration ms]; the state
   after a step is everything before it plus its own moves, so any step can be shown on its own and replayed.
   x,y move (user units), r turns (deg), s/sx/sy scale, o is opacity, d the hidden share of a drawn path (1 hidden, 0 drawn).
   loop names the data-loop pieces that run during the step, text sets a readout, count runs a number up.
   Steps and wording follow Your Gaggia (machine.js); the tap block or T-fitting and stock or custom wiring can also be
   switched on the guide itself. Reduced motion shows each step's end state without movement. */
(function(){
  var GM=window.GaggiaMachine,RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var EASE='cubic-bezier(.45,0,.2,1)';
  function $(id){return document.getElementById(id)}
  function m(w){return !w||!GM||GM.matches(w)}
  function T(x){if(x==null)return '';if(typeof x==='string')return x;if(GM)return GM.txt(x);return x.map(function(s){return typeof s==='string'?s:s[0]}).join(' ')}
  function prof(){return (GM&&GM.get())||{}}
  function famOf(){var p=prof();return p.model?(p.model==='GC'?'GC':'GCP'):null}
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

  var PH={
    tc:'https://github.com/user-attachments/assets/7eef096a-bcce-4d98-8a7d-ae898c3afec3',
    xf:'https://github.com/GAGGIUINO/gaggiuino.github.io/assets/117388662/78d801f3-9c4f-4c17-8105-74e32711af09',
    xfp:'https://github.com/GAGGIUINO/gaggiuino.github.io/assets/117388662/f294cdb2-000b-4583-b258-8dd53854a2ec',
    ptbA:'https://github.com/user-attachments/assets/14188d93-508f-4ab4-b003-80f8aeb243a8',
    inl:'https://github.com/user-attachments/assets/12e2f8d8-5313-4f5d-b932-4b213ebf22e8',
    ptbC:'https://github.com/user-attachments/assets/8cf1157b-b990-41c1-9770-24d7ac5af067',
    ptbF:'https://github.com/user-attachments/assets/53026edc-2026-4144-9714-200cdb2ebf51',
    teeGC:'https://user-images.githubusercontent.com/117388662/239457706-7ee5d101-d209-41b4-a3d3-ce159e98032f.png',
    teeGCP:'https://user-images.githubusercontent.com/117388662/246573952-ca092066-d107-46e6-85f1-e2a7b19865e0.png',
    foam:'https://user-images.githubusercontent.com/117388662/239457402-b58dfe55-6572-45b7-8960-2a4d1f9d5753.png',
    cwGCP:'https://github.com/gaggiuino/gaggiuino.github.io/blob/main/docs/schematics/custom-3pln/GCP_wiring_PCBv3_1_120v.png',
    cwGC:'https://github.com/gaggiuino/gaggiuino.github.io/blob/main/docs/schematics/custom-3pln/GC_wiring_PCBv3_1_120v.png'
  };

  /* ---------------- the guides ---------------- */
  var G={};
  G.tc={svg:'pg-tc',
    base:{close:{o:1},route:{o:0},j4v:{o:0},oldpaste:{o:0},j:{o:0},tc:{x:150,o:0},paste:{sx:0},syr:{o:0},nosp:{o:0},rlead:{d:1},tcw:{y:44},ma:{o:0},mb:{o:0}},
    steps:{all:[
      {t:'Unplug the brew thermostat',
       d:['Pull its two connectors, Ba and Bb, straight off the thermostat.',['On stock wiring they get joined later by a short jumper, J.','wpath:SI'],['On custom wiring they come out with the old harness.','wpath:CW'],
          'It\'s easier with the boiler tipped up: take off the steam knob and wand, then the four cap screws up from under the frame.'],
       a:[['ba',{x:110,y:-34},0,800],['bb',{x:110,y:34},90,800],['j',{o:1},1000,350]]},
      {t:'Unscrew the thermostat',d:'Turn it out of the side of the boiler with a spanner on its hex. The old paste stays in the hole: leave it there.',
       a:[['bt',{x:130},0,1300],['oldpaste',{o:1},250,400],['bt',{o:0},1200,300]],loop:['spinR']},
      {t:'Paste on the thread',d:'Coat the thermocouple\'s thread with thermal paste rated for 180 °C or more, or reuse the old thermostat\'s if it\'s still soft. The official guide lists Thermal Grizzly Kryonaut, Noctua NT-H2, SYY-157 and GELID GC-Extreme.',
       a:[['tc',{o:1},0,300],['syr',{o:1},250,250],['syr',{x:32},500,1300],['paste',{sx:1},500,1300],['syr',{o:0},1850,250]]},
      {t:'Screw it in, barely finger tight',d:'Turn it in gently by its hex and stop as soon as it seats. No spanner: the M4 thread is small and the boiler\'s thread is soft metal. Let the lead turn with the probe so it doesn\'t twist.',
       a:[['tc',{x:0},0,1500],['nosp',{o:1},1550,350]],loop:['spinF'],ph:PH.tc},
      {t:'Route the lead',d:'Around the front of the boiler and back to the control box on the right, clear of the pump area. Mains wires run on the left side and above this lead; low-voltage wires and sensors stay on the right.',
       a:[['close',{o:0},0,300],['route',{o:1},200,300],['rlead',{d:0},500,1900]]},
      {t:'Clamp it in J4 and check it',d:['Fold each bare wire over before it goes in the clamp, keep the insulation out of it, and put + and − where they were on your bench test. Lead colors vary between makers, so trust that test: the reading must rise when you warm the probe.','With a meter: either wire to the boiler reads open (OL), because the probe is ungrounded; the two wires together read a few ohms.'],
       a:[['route',{o:0},0,300],['j4v',{o:1},200,300],['tcw',{y:0},500,900],['sc1',{r:360},500,1000],['sc2',{r:360},650,1000],['ma',{o:1},1500,300],['mb',{o:1},1900,300]],
       chk:[['b7','Thermocouple lead to boiler body'],['c7','Thermocouple loop']]}
    ]}};

  G.ps={vars:[{k:'ptb',l:'Tap block'},{k:'tee',l:'T-fitting'}],def:function(){return 'ptb'},
    svgs:{ptb:'pg-ptb',tee:'pg-tee'},
    base:{
      ptb:{Lw:{o:1},R:{o:.35},or1:{y:70,o:0},sen:{y:44},qt:{o:0},gap:{o:0},lcaps:{o:1},ptb:{x:150,y:60},pc6:{y:40,o:0},tube:{y:50,o:0},dim:{o:0},inl:{x:-38},ss:{x:0,o:1},ls:{x:80,o:0},mag:{o:0},water:{o:0},gauge:{o:0},drip:{o:0},sasm:{x:0,y:0,s:1}},
      tee:{dim:{o:0},cut:{o:0},huGCP:{y:0},hlGCP:{y:0},huGC:{y:0},hlGC:{y:0},tee:{x:60,o:0},cl1:{o:0},brGCP:{d:1},brGC:{d:1},brw:{d:1},cl2:{o:0},tsen:{x:40,o:0},foam:{o:0}}
    },
    steps:{
      ptb:[
        {t:'O-ring into the sensor fitting',d:'Press the flat white O-ring into the sensor\'s fitting until it sits flush at the bottom of the thread. The sensor\'s own base O-ring often can\'t reach the fitting\'s face, so this one makes the seal.',
         a:[['or1',{o:1},0,300],['or1',{y:0},0,1000]],loop:['pulseR'],ph:PH.xf},
        {t:'Sensor in: hand tight, then at most a quarter turn',d:'Screw the sensor into the fitting by hand until it stops. A quarter turn more with a spanner is the most it ever gets: more crushes the O-ring.',
         a:[['sen',{y:0},0,1500],['qt',{o:1},1500,300],['gap',{o:1},1800,300]],loop:['spinS']},
        {t:'Push-in fitting into the block',d:'Screw the small push-in fitting into the block\'s port, hand tight. Then look along the block\'s water bore: the fitting\'s thread may poke in by less than 1 mm (a quarter of the hole), no more.',
         a:[['Lw',{o:.35},0,300],['R',{o:1},0,300],['pc6',{o:1},150,200],['pc6',{y:0},300,1100],['mag',{o:1},1450,350]],loop:['spinP'],ph:PH.ptbA},
        {t:'40 mm of tube, cut square',d:'Cut 40 mm of the 4 × 6 mm PTFE tube with both ends square and push it into the block\'s fitting until it stops, past the teeth and the O-ring inside.',
         a:[['mag',{o:0},0,250],['tube',{o:1},0,250],['tube',{y:0},250,900],['dim',{o:1},1200,300]],ph:PH.ptbA},
        {t:'Take off the inlet fitting',d:[['The group\'s inlet fitting (the metal OPV on the original Classic)','unset:model'],['The inlet fitting, where the pump\'s hose meets the group,','set:model;fam:GCP'],['The metal OPV on the group\'s inlet','set:model;fam:GC'],'comes off with its two M5 screws. Boiler cold and cord out; keep a towel under it for the water that runs out.'],
         a:[['dim',{o:0},0,200],['ss',{x:60},0,1000],['ss',{o:0},900,250],['inl',{x:40},1100,900],['drip',{o:1},1600,300]],loop:['drip'],ph:PH.inl},
        {t:'Clamp the block in',d:'Fit the block between the group and the inlet fitting with the longer M5 screws (the official parts list uses 25 mm), the block\'s O-ring and the fitting\'s own O-ring both facing the group. Tighten the two screws evenly.',
         a:[['drip',{o:0},0,200],['ptb',{x:0,y:0},200,1300],['inl',{x:0},1550,800],['ls',{o:1},2350,200],['ls',{x:0},2350,900]],loop:['pulseO'],ph:PH.ptbC},
        {t:'Sensor onto the tube',d:'Push the sensor\'s fitting onto the tube until the tube is fully home. The sensor mustn\'t touch any metal.',
         a:[['Lw',{o:1},0,300],['lcaps',{o:0},0,250],['qt',{o:0},0,250],['gap',{o:0},0,250],['sasm',{x:170,y:184,s:.55},250,1500]],ph:PH.ptbF},
        {t:'Fill it and test it',d:'With the machine back together: run Flush for 10 seconds with the group open to fill the block, then flush against a blank basket to see the pressure. Then unplug and touch a dry paper towel to each joint to find any leak.',
         a:[['water',{o:1},0,900],['gauge',{o:1},500,300]],count:['pval',0,9,' bar',800,1600],chk:[['g15','Pressure sensor plumbing snug and dry']]}
      ],
      tee:[
        {t:'Cut the line',d:[['Classic Pro family: cut the braided hose between the pump and the boiler about 65 mm above the boiler connection.','fam:GCP'],['Original Classic: cut the PTFE tube between the pump and the boiler, nearer the boiler but high enough that the T stands mostly upright.','fam:GC'],'Cut it square.'],
         a:[['dim',{o:1},0,300],['cut',{o:1},300,300],['huGCP',{y:-8},800,600],['hlGCP',{y:8},800,600],['huGC',{y:-8},800,600],['hlGC',{y:8},800,600],['cut',{o:0},1500,250]]},
        {t:'Fit the T',d:[['Classic Pro family: slide a loose clamp onto each cut end, push the barbed T in (a rubber glove helps grip, and a little water-based lube if it won\'t go), and set the clamps over the middle of each barb.','fam:GCP'],['Original Classic: push each tube fully into the push-to-connect T, past both the teeth and the O-ring inside.','fam:GC']],
         a:[['dim',{o:0},0,250],['tee',{o:1},0,200],['tee',{x:0},100,1000],['cl1',{o:1},1200,350]],ph:'tee'},
        {t:'Run the branch',d:['200 to 250 mm from the T to the sensor\'s fitting:',['braided hose, clamped at both ends.','fam:GCP'],['PTFE tube, pushed fully home at both ends.','fam:GC']],
         a:[['brGCP',{d:0},0,1300],['brGC',{d:0},0,1300],['cl2',{o:1},1300,350]]},
        {t:'Seal the sensor',d:'Flat white O-ring flush in the sensor\'s fitting, then the sensor in hand tight plus at most a quarter turn, as on the tap block.',
         a:[['tsen',{o:1},0,250],['tsen',{x:0},150,1000]],ph:PH.xf},
        {t:'Park it low',d:'At the base of the machine, lower than the T, and not touching metal. If its readings turn out noisy, wrap it in foam or fix it to the frame.',
         a:[['foam',{o:1},0,600]],ph:PH.foam},
        {t:'Fill the line',d:'Once the install is finished, run [UT] Tube Fill from the community profiles in the web UI. It fills the branch slowly and pushes the air out.',
         a:[['brw',{d:0},0,2000]],loop:['bub'],chk:[['g15','Pressure sensor plumbing snug and dry']]}
      ]
    }};

  G.fuse={vars:[{k:'SI',l:'Stock wiring'},{k:'CW',l:'Custom wiring'}],def:function(){return (GM&&GM.wpath&&GM.wpath())||'SI'},
    svgs:{SI:'pg-fuse',CW:'pg-fuse'},
    base:{
      SI:{stl:{o:1,y:0},st:{o:1},nf:{o:0,r:-90},fpaste:{sy:0},of:{o:1},snip:{o:0},nw1:{d:1},nw2:{d:1},sp1:{o:0,x:-130,y:-64},sp2:{o:0,x:-32,y:-40},xt:{o:0},fm:{o:0}},
      CW:{stl:{o:1,y:0},st:{o:1},nf:{o:0,r:-90},fpaste:{sy:0},of:{o:1},ow:{o:1},snip:{o:0},cw1:{d:1},cw2:{d:1},cwl:{o:0},spc:{o:0},fm:{o:0}}
    },
    steps:{
      SI:[
        {t:'Steam thermostat out',d:'Pull its two leads off (on stock wiring these are Sa and Sb, which go to the SSR) and unscrew the thermostat from the top of the boiler.',
         a:[['stl',{y:40},0,800],['stl',{o:0},500,300],['st',{o:0},700,600]],loop:['spinR']},
        {t:'Fuse in, hand tight',d:'A thin film of the same 180 °C paste on its stud and face, then screw it into the steam thermostat\'s hole by hand until it seats. Its body is ceramic: no spanner.',
         a:[['fpaste',{sy:1},0,900],['nf',{o:1},900,250],['nf',{r:0},900,1300]],loop:['spinF']},
        {t:'Cut the stock fuse out',d:'The 184 °C one-shot fuse sits across the top of the boiler with its wires crimped to it. Cut each wire just behind the old crimp, keeping all the length you can, and lift the fuse out.',
         a:[['snip',{o:1},0,300],['of',{o:0},500,600],['snip',{o:0},1200,200]]},
        {t:'New spades on the wires',d:'Crimp an uninsulated 6.3 mm female spade onto each end\'s wire (two wires in one spade if two shared an end) with an open-barrel crimper, and cover it with silicone sleeve: insulated spades melt this close to the boiler. If a wire won\'t reach, lengthen it with 18 AWG silicone wire and a butt splice.',
         a:[['sp1',{o:1},0,400],['sp2',{o:1},150,400]]},
        {t:'Onto the fuse',d:'Push one end\'s wires onto each spade of the new fuse. Either way round works: like the fuse it replaces, it\'s a switch in series.',
         a:[['sp1',{x:0,y:0},0,1100],['sp2',{x:0,y:0},0,1100],['nw1',{d:0},0,1100],['nw2',{d:0},0,1100],['xt',{o:1},1150,300]]},
        {t:'Check it',d:'Unplugged, a meter across its two spades reads under 1 Ω. On stock wiring the whole machine runs through it, so if it ever trips everything goes dark: unplug, let it cool, find out why (an SSR stuck on, a boiler run dry), and only then press its button.',
         a:[['fm',{o:1},0,350]],loop:['press'],chk:[['c3','Boiler thermal fuse, across it']]}
      ],
      CW:[
        {t:'Steam thermostat out',d:'Its leads go with the old harness. Unscrew the thermostat from the top of the boiler.',
         a:[['stl',{y:40},0,800],['stl',{o:0},500,300],['st',{o:0},700,600]],loop:['spinR']},
        {t:'Fuse in, hand tight',d:'A thin film of the same 180 °C paste on its stud and face, then screw it into the steam thermostat\'s hole by hand until it seats. Its body is ceramic: no spanner.',
         a:[['fpaste',{sy:1},0,900],['nf',{o:1},900,250],['nf',{r:0},900,1300]],loop:['spinF']},
        {t:'Wire it instead of the stock fuse',d:[['Classic Pro family: AC17, from the SSR, goes on one spade and AC18, to the heater splice, on the other, instead of AC11 and AC12 to the stock fuse.','fam:GCP'],['Original Classic: AC6 and AC7 go on its right spade and the element lead AC8 on its left (AC8 and AC9 on a 120 V machine), instead of the stock fuse\'s ends.','fam:GC'],'Uninsulated 6.3 mm spades under silicone sleeve, and the stock fuse comes out.'],
         a:[['of',{o:0},0,600],['ow',{o:0},0,600],['cw1',{d:0},400,1100],['cw2',{d:0},500,1100],['spc',{o:1},1500,300],['cwl',{o:1},1500,300]],ph:'cw'},
        {t:'Check it',d:'Unplugged, a meter across its two spades reads under 1 Ω. In custom wiring it sits in the heater line, so if it ever trips the boiler stops heating: unplug, let it cool, find out why (an SSR stuck on, a boiler run dry), and only then press its button.',
         a:[['fm',{o:1},0,350]],loop:['press'],chk:[['c3','Boiler thermal fuse, across it'],['g6','Boiler thermal fuse in the heater line']]}
      ]
    }};

  /* ---------------- engine ---------------- */
  function num(v,d){return v==null?d:v}
  function tf(s){return 'translate('+num(s.x,0)+'px,'+num(s.y,0)+'px) rotate('+num(s.r,0)+'deg) scale('+num(s.sx,num(s.s,1))+','+num(s.sy,num(s.s,1))+')'}
  function clone(o){var r={};for(var k in o){r[k]={};for(var p in o[k])r[k][p]=o[k][p]}return r}
  function merge(st,k,props){if(!st[k])st[k]={};for(var p in props)st[k][p]=props[p]}
  var CH={x:'t',y:'t',r:'t',s:'t',sx:'t',sy:'t',o:'o',d:'d'};
  function chanVal(s,c){s=s||{};return c==='t'?tf(s):c==='o'?String(num(s.o,1)):String(num(s.d,0))}
  function prop(c){return c==='t'?'transform':c==='o'?'opacity':'strokeDashoffset'}

  function Guide(id,def){
    this.id=id;this.def=def;this.root=$('pg-'+id+'-g');if(!this.root)return;
    this.list=this.root.querySelector('.pg-steps');this.now=this.root.querySelector('.pg-now');
    this.pos=this.root.querySelector('.pg-pos');this.anims=[];this.timers=[];this.i=0;this.played=false;this.pick=null;
    var self=this;
    this.root.querySelector('.pg-prev').addEventListener('click',function(){self.go(self.i-1,true)});
    this.root.querySelector('.pg-next').addEventListener('click',function(){self.go(self.i+1,true)});
    this.root.querySelector('.pg-again').addEventListener('click',function(){self.go(self.i,true)});
    this.list.addEventListener('click',function(e){var b=e.target.closest('button[data-i]');if(b)self.go(Number(b.getAttribute('data-i')),true,true)});
    this.root.addEventListener('keydown',function(e){if(e.target.closest('.pg-steps,.pg-ctl,.pg-fig')&&(e.key==='ArrowRight'||e.key==='ArrowLeft')&&!e.altKey&&!e.metaKey){e.preventDefault();self.go(self.i+(e.key==='ArrowRight'?1:-1),true)}});
    var vb=this.root.querySelector('.pg-vars');
    if(vb&&def.vars){vb.innerHTML=def.vars.map(function(v){return '<button type="button" class="chip" data-var="'+v.k+'" aria-pressed="false">'+esc(v.l)+'</button>'}).join('');
      vb.addEventListener('click',function(e){var b=e.target.closest('[data-var]');if(!b)return;self.pick=b.getAttribute('data-var');self.setup(true)})}
    this.setup(false);
    if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){if(es[0].isIntersecting&&!self.played){self.played=true;self.go(self.i,true);io.disconnect()}},{threshold:.45});io.observe(this.root.querySelector('.pg-fig'))}
  }
  Guide.prototype.variant=function(){var d=this.def;if(!d.vars)return 'all';return this.pick||d.def()};
  Guide.prototype.setup=function(play){
    var d=this.def,v=this.variant(),self=this;
    this.v=v;
    var svgId=d.svgs?d.svgs[v]:d.svg;
    Array.prototype.forEach.call(this.root.querySelectorAll('.pg-fig>svg'),function(s){s.style.display=s.id===svgId?'':'none'});
    this.svg=$(svgId);
    Array.prototype.forEach.call(this.root.querySelectorAll('[data-var]'),function(b){b.setAttribute('aria-pressed',String(b.getAttribute('data-var')===v))});
    Array.prototype.forEach.call((this.root.closest('section')||this.root).querySelectorAll('[data-pv]'),function(e){e.hidden=e.getAttribute('data-pv').split(',').indexOf(v)<0});
    /* drawing variants: wiring path and family (the Pro family is drawn when no model is set) */
    var fam=famOf()||'GCP';
    Array.prototype.forEach.call(this.svg.querySelectorAll('[data-v]'),function(e){var dv=e.getAttribute('data-v');e.style.display=(d.vars?dv===v:m('wpath:'+dv))?'':'none'});
    Array.prototype.forEach.call(this.svg.querySelectorAll('[data-fam]'),function(e){e.style.display=e.getAttribute('data-fam')===fam?'':'none'});
    var drawn=this.root.querySelector('.pg-drawn');if(drawn)drawn.hidden=!!famOf()||!this.svg.querySelector('[data-fam]');
    /* pieces */
    this.el={};
    Array.prototype.forEach.call(this.svg.querySelectorAll('[data-k]'),function(e){
      var k=e.getAttribute('data-k');
      if(e.closest('[data-fam]')&&e.closest('[data-fam]').style.display==='none'&&self.el[k])return;
      self.el[k]=e;
      var o=e.getAttribute('data-origin');
      e.style.transformBox=e.getAttribute('data-box')==='view'?'view-box':'fill-box';
      e.style.transformOrigin=o||'center';
    });
    this.base=d.base[v]||d.base;
    this.steps=(d.steps[v]||d.steps.all).filter(function(s){return m(s.when)});
    this.states=[];var st=clone(this.base);
    for(var i=0;i<this.steps.length;i++){(this.steps[i].a||[]).forEach(function(op){merge(st,op[0],op[1])});this.states.push(clone(st))}
    this.renderList();
    this.i=Math.min(this.i,this.steps.length-1);
    if(play&&this.played)this.go(0,true);else this.show(this.played?this.i:-1,this.played?this.i:0);
  };
  Guide.prototype.stateBefore=function(i){return i<=0?this.base:this.states[i-1]};
  Guide.prototype.apply=function(st){
    for(var k in this.el){var e=this.el[k],s=st[k]||{};
      e.style.transform=tf(s);e.style.opacity=String(num(s.o,1));
      if(e.classList.contains('draw')){e.style.strokeDashoffset=String(num(s.d,0));if(num(s.d,0)>=1)e.style.opacity='0'}
    }
  };
  Guide.prototype.stop=function(){
    this.anims.forEach(function(a){try{a.cancel()}catch(e){}});this.anims=[];
    this.timers.forEach(function(t){clearTimeout(t);cancelAnimationFrame(t)});this.timers=[];
    Array.prototype.forEach.call(this.svg.querySelectorAll('[data-loop]'),function(e){e.classList.remove('run')});
    Array.prototype.forEach.call(this.svg.querySelectorAll('[data-run]'),function(e){e.classList.remove('on')});
  };
  /* show the state at step "at" (−1 = before the first) with step "cur" highlighted, no movement */
  Guide.prototype.show=function(at,cur){
    this.stop();this.apply(at<0?this.base:this.states[at]);this.i=cur;this.mark();
    if(at>=0)this.extras(this.steps[at],false);
  };
  Guide.prototype.extras=function(step,anim){
    var self=this;
    (step.loop||[]).forEach(function(n){Array.prototype.forEach.call(self.svg.querySelectorAll('[data-loop="'+n+'"]'),function(e){e.classList.add('run')});
      Array.prototype.forEach.call(self.svg.querySelectorAll('[data-run="'+n+'"]'),function(e){e.classList.add('on')})});
    if(step.count){var c=step.count,el=this.svg.querySelector('[data-k="'+c[0]+'"]');
      if(el){
        if(!anim||RM){el.textContent=c[2]+c[3]}
        else{el.textContent=c[1]+c[3];var t0=null;
          var tick=function(ts){if(t0===null)t0=ts;var p=Math.min(1,Math.max(0,(ts-t0-c[4])/c[5]));el.textContent=(c[1]+(c[2]-c[1])*(1-Math.pow(1-p,2))).toFixed(1).replace(/\.0$/,'')+c[3];if(p<1)self.timers.push(requestAnimationFrame(tick))};
          self.timers.push(requestAnimationFrame(tick))}
      }}
  };
  Guide.prototype.go=function(i,anim,fromList){
    if(i<0||i>=this.steps.length)return;
    this.stop();var step=this.steps[i],before=this.stateBefore(i),after=this.states[i],self=this;
    this.i=i;this.played=true;this.mark(fromList);
    this.apply(after);
    if(anim&&!RM&&this.svg.animate){
      var cur=clone(before),lines={};
      (step.a||[]).forEach(function(op){
        var k=op[0],e=self.el[k];if(!e)return;
        var nxt=clone(cur);merge(nxt,k,op[1]);
        var chans={};for(var p in op[1])chans[CH[p]]=1;
        for(var c in chans){
          if(c==='d'&&!e.classList.contains('draw'))continue;
          var key=k+'|'+c;if(!lines[key])lines[key]={e:e,c:c,pts:[[0,chanVal(cur[k],c)]]};
          lines[key].pts.push([op[2],chanVal(cur[k],c)],[op[2]+op[3],chanVal(nxt[k],c)]);
        }
        cur=nxt;
      });
      for(var key in lines){var L=lines[key],end=L.pts[L.pts.length-1][0]||1,kf=[];
        L.pts.forEach(function(pt,j){var f={offset:Math.min(1,pt[0]/end)};f[prop(L.c)]=pt[1];f.easing=EASE;
          if(kf.length&&f.offset<kf[kf.length-1].offset)f.offset=kf[kf.length-1].offset;kf.push(f)});
        try{this.anims.push(L.e.animate(kf,{duration:end,fill:'both'}))}catch(err){}
        if(L.c==='d'&&L.pts[0][1]==='1'&&L.pts.length>1){var t0=L.pts[1][0];try{this.anims.push(L.e.animate([{opacity:0,offset:0},{opacity:0,offset:Math.min(1,t0/end)},{opacity:1,offset:Math.min(1,t0/end)},{opacity:1,offset:1}],{duration:end,fill:'both'}))}catch(err){}}
      }
    }
    this.extras(step,anim);
  };
  Guide.prototype.renderList=function(){
    var self=this,n=this.steps.length;
    this.list.innerHTML=this.steps.map(function(s,i){
      var ph=s.ph==='tee'?(famOf()==='GC'?PH.teeGC:PH.teeGCP):s.ph==='cw'?(famOf()==='GC'?PH.cwGC:PH.cwGCP):s.ph;
      var phl=s.ph==='cw'?'Official drawing':'Official photo';
      var chk=(s.chk||[]).map(function(c){return '<a href="power-on-checks.html#'+c[0]+'">'+c[0]+' '+esc(c[1])+'</a>'}).join(' · ');
      return '<li data-n="'+(i+1)+'"><button type="button" class="pg-sb" data-i="'+i+'"><span class="pg-n">'+(i+1)+'</span><span class="pg-t">'+esc(s.t)+'</span></button>'
        +'<p>'+esc(T(s.d))+'</p>'+((ph||chk)?'<p class="pg-links">'+(ph?'<a href="'+ph+'" target="_blank" rel="noopener">'+phl+'</a>':'')+(ph&&chk?' · ':'')+(chk?'Check: '+chk:'')+'</p>':'')+'</li>';
    }).join('');
    this.n=n;
  };
  Guide.prototype.mark=function(fromList){
    var i=this.i,s=this.steps[i];
    Array.prototype.forEach.call(this.list.children,function(li,j){li.classList.toggle('cur',j===i);var b=li.querySelector('button');if(j===i)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current')});
    this.pos.textContent='Step '+(i+1)+' of '+this.steps.length;
    this.root.querySelector('.pg-prev').disabled=i<=0;this.root.querySelector('.pg-next').disabled=i>=this.steps.length-1;
    if(this.now&&s)this.now.innerHTML='<b>'+(i+1)+'. '+esc(s.t)+'</b> '+esc(T(s.d));
    if(fromList&&window.innerWidth<=860){var f=this.root.querySelector('.pg-fig');if(f&&f.getBoundingClientRect().top<0&&f.scrollIntoView)f.scrollIntoView({block:'start',behavior:RM?'auto':'smooth'})}
  };

  /* where each part goes, following Your Gaggia */
  function where(){
    var w={tc:['In the brew thermostat\'s hole in the side of the boiler. The same on every Classic and Pro-family model.'],
      ps:[['Tap block: clamped between the group and its inlet fitting (the metal OPV on the original Classic).','unset:model'],['Tap block: clamped between the group and its inlet fitting.','set:model;fam:GCP'],['Tap block: clamped between the group and the metal OPV on its inlet.','set:model;fam:GC'],
          'It fits every Classic and Pro-family model. T-fitting: cut into the line from the pump to the boiler.'],
      fuse:['In the steam thermostat\'s hole in the top of the boiler, in place of the stock 184 °C one-shot fuse.']};
    for(var k in w){var e=$('pg-'+k+'-where');if(e)e.textContent=T(w[k])}
  }

  var guides={};
  function init(){
    where();
    ['tc','ps','fuse'].forEach(function(k){guides[k]=new Guide(k,G[k])});
    window.addEventListener('gaggia-machine',function(){where();for(var k in guides)if(guides[k].root)guides[k].setup(false)});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
