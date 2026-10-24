  /* Part guides data: photo links (PH) and the guides (G). Shared by part-guides.js and the wiring page's
     back-links (wiring-refs.js), so a step's map target is written once. Needs GM, prof() and famOf() in scope. */
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
    cw:'https://github.com/gaggiuino/gaggiuino.github.io/blob/main/docs/schematics/custom-3pln/',
    ssr:'https://github.com/user-attachments/assets/94bcb6c1-6e65-4ced-957c-9c00551140b3',
    ssrW:'https://user-images.githubusercontent.com/117388662/246569790-dfc78317-caef-4bba-a528-466affb516b1.png',
    ssrWc:'https://user-images.githubusercontent.com/117388662/239403962-c0ef2429-ec12-4d81-b56b-02c91cd702d3.png',
    cci:'https://github.com/GAGGIUINO/gaggiuino.github.io/assets/117388662/83f63c3a-9919-4c99-b01e-34eacba4ff71',
    swL:'https://user-images.githubusercontent.com/117388662/243890489-77c730e4-20e3-4e6f-9cb5-6295780194fc.png',
    swLc:'https://user-images.githubusercontent.com/117388662/239404551-97d6f3e4-f62e-45c4-93d7-52d8ae373526.png',
    swLV:'https://user-images.githubusercontent.com/117388662/246567190-77c4ca27-fb2d-4105-bb41-cc5875a4cc50.png',
    swLVc:'https://user-images.githubusercontent.com/117388662/239406277-7bdd8852-5fcb-454e-9521-cd9537543144.png'
  };

  /* ---------------- the guides ---------------- */
  var G={};
  G.tc={svg:'pg-tc',
    base:{close:{o:1},route:{o:0},j4v:{o:0},oldpaste:{o:0},j:{o:0},tc:{x:150,o:0},paste:{sx:0},syr:{o:0},nosp:{o:0},rlead:{d:1},tcw:{y:44},ma:{o:0},mb:{o:0}},
    steps:{all:[
      {t:'Unplug the brew thermostat',
       d:['Pull its two connectors, Ba and Bb, straight off the thermostat.',['On stock wiring they get joined later by a short jumper, J.','wpath:SI'],['On custom wiring they come out with the old harness.','wpath:CW'],
          'It\'s easier with the boiler tipped up: take off the steam knob and wand, then the four cap screws up from under the frame.'],
       a:[['ba',{x:110,y:-34},0,800],['bb',{x:110,y:34},90,800],['j',{o:1},1000,350]],map:[['Jumper J on the wiring map','run:J','wpath:SI']]},
      {t:'Unscrew the thermostat',d:'Turn it out of the side of the boiler with a spanner on its hex. The old paste stays in the hole: leave it, unless it\'s dried out, in which case clean it out for fresh paste.',
       a:[['bt',{x:90},0,1200],['oldpaste',{o:1},250,400],['bt',{o:0},950,350]],loop:['spinR']},
      {t:'Paste on the thread',d:'Coat the thermocouple\'s thread with thermal paste rated for 180 °C or more, or reuse the old thermostat\'s if it\'s still soft. The official guide lists Thermal Grizzly Kryonaut, Noctua NT-H2, SYY-157 and GELID GC-Extreme.',
       a:[['tc',{o:1},0,300],['syr',{o:1},250,250],['syr',{x:32},500,1300],['paste',{sx:1},500,1300],['syr',{o:0},1850,250]]},
      {t:'Screw it in, barely finger tight',d:'Turn it in gently by its hex and stop as soon as it seats. No spanner: the M4 thread is small and the boiler\'s thread is soft metal. Let the lead turn with the probe so it doesn\'t twist.',
       a:[['tc',{x:0},0,1500],['nosp',{o:1},1550,350]],loop:['spinF'],ph:PH.tc},
      {t:'Route the lead',d:'Around the front of the boiler and back to the control box on the right, clear of the pump area. Mains wires run on the left side and above this lead; low-voltage wires and sensors stay on the right.',
       a:[['close',{o:0},0,300],['route',{o:1},200,300],['rlead',{d:0},500,1900]],map:'run:TC'},
      {t:'Clamp it in J4 and check it',d:['Fold each bare wire over before it goes in the clamp, keep the insulation out of it, and put + and − where they were on your bench test. Lead colors vary between makers, so trust that test: the reading must rise when you warm the probe.','With a meter: either wire to the boiler reads open (OL), because the probe is ungrounded; the two wires together read a few ohms.'],
       a:[['route',{o:0},0,300],['j4v',{o:1},200,300],['tcw',{y:0},500,900],['sc1',{r:360},500,1000],['sc2',{r:360},650,1000],['ma',{o:1},1500,300],['mb',{o:1},1900,300]],
       chk:[['b7','Thermocouple lead to boiler body'],['c7','Thermocouple loop']],map:'run:TC'}
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
         a:[['Lw',{o:1},0,300],['lcaps',{o:0},0,250],['qt',{o:0},0,250],['gap',{o:0},0,250],['sasm',{x:170,y:184,s:.55},250,1500]],ph:PH.ptbF,map:[['Its cable on the wiring map','run:PS']]},
        {t:'Fill it and test it',d:'With the machine back together: run Flush for 10 seconds with the group open to fill the block, then flush against a blank basket to see the pressure. Then unplug and touch a dry paper towel to each joint to find any leak.',
         a:[['water',{o:1},0,900],['gauge',{o:1},500,300]],count:['pval',0,9,' bar',800,1600],chk:[['g15','Pressure sensor plumbing snug and dry']]}
      ],
      tee:[
        {t:'Cut the line',d:[['Classic Pro family: cut the braided hose between the pump and the boiler about 65 mm above the boiler connection.','fam:GCP'],['Original Classic: cut the PTFE tube between the pump and the boiler, nearer the boiler but high enough that the T stands mostly upright.','fam:GC'],'Cut it square.'],
         a:[['dim',{o:1},0,300],['cut',{o:1},300,300],['huGCP',{y:-8},800,600],['hlGCP',{y:8},800,600],['huGC',{y:-8},800,600],['hlGC',{y:8},800,600],['cut',{o:0},1500,250]]},
        {t:'Fit the T',d:[['Classic Pro family: slide a loose clamp onto each cut end, push the barbed T in (a rubber glove helps grip, and a little water-based lube if it won\'t go), and set the clamps over the middle of each barb.','fam:GCP'],['Original Classic: push each tube fully into the push-to-connect T, past both the teeth and the O-ring inside.','fam:GC']],
         a:[['dim',{o:0},0,250],['tee',{o:1},0,200],['tee',{x:0},100,1000],['cl1',{o:1},1200,350]],ph:'tee'},
        {t:'Run the branch',d:['200 to 250 mm from the T to the sensor\'s fitting.',['Classic Pro family: braided hose, clamped at both ends.','fam:GCP'],['Original Classic: PTFE tube, pushed fully home at both ends.','fam:GC']],
         a:[['brGCP',{d:0},0,1300],['brGC',{d:0},0,1300],['cl2',{o:1},1300,350]]},
        {t:'Seal the sensor',d:'Flat white O-ring flush in the sensor\'s fitting, then the sensor in hand tight plus at most a quarter turn, as on the tap block.',
         a:[['tsen',{o:1},0,250],['tsen',{x:0},150,1000]],ph:'xf'},
        {t:'Park it low',d:'At the base of the machine, lower than the T, and not touching metal. If its readings turn out noisy, wrap it in foam or fix it to the frame.',
         a:[['foam',{o:1},0,600]],ph:PH.foam,map:[['Its cable on the wiring map','run:PS']]},
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
         a:[['stl',{y:40},0,800],['stl',{o:0},500,300],['st',{o:0},700,600]],loop:['spinR'],map:[['Sa and Sb on the wiring map','runs:Sa,Sb',null,'Sa and Sb, to the SSR']]},
        {t:'Fuse in, hand tight',d:'A thin film of the same 180 °C paste on its stud and face, then screw it into the steam thermostat\'s hole by hand until it seats. Its body is ceramic: no spanner.',
         a:[['fpaste',{sy:1},0,900],['nf',{o:1},900,250],['nf',{r:0},900,1300]],loop:['spinF']},
        {t:'Cut the stock fuse out',d:['The 184 °C one-shot fuse sits across the top of the boiler with its wires crimped to it. Cut each wire just behind the old crimp, keeping all the length you can, and lift the fuse out. Leave its clip in place, and any earth wire fixed to it.',['On a grounded original Classic that clip is the boiler\'s earth point.','fam:GC']],
         a:[['snip',{o:1},0,300],['of',{o:0},500,600],['snip',{o:0},1200,200]]},
        {t:'New spades on the wires',d:'Crimp an uninsulated 6.3 mm female spade onto each end\'s wire with an open-barrel crimper (a spade sized for two wires where two shared an end), and cover it with silicone sleeve: insulated spades melt this close to the boiler. If a wire won\'t reach, lengthen it with 18 AWG silicone wire and a bare BN1.25 butt splice under silicone heat shrink.',
         a:[['sp1',{o:1},0,400],['sp2',{o:1},150,400]]},
        {t:'Onto the fuse',d:'Push one end\'s wires onto each spade of the new fuse. Either way round works: like the fuse it replaces, it\'s a switch in series.',
         a:[['sp1',{x:0,y:0},0,1100],['sp2',{x:0,y:0},0,1100],['nw1',{d:0},0,1100],['nw2',{d:0},0,1100],['xt',{o:1},1150,300]]},
        {t:'Check it',d:['Unplugged, a meter across its two spades reads under 1 Ω. On stock wiring the whole machine runs through it, so if it ever trips',['everything but the power lamp goes dead:','fam:GCP;set:model'],['everything goes dark, the power lamp too:','fam:GC;set:model'],['everything goes dead (the Pro family\'s power lamp stays lit):','unset:model'],'unplug, let it cool, find out why (an SSR stuck on, a boiler run dry), and only then press its button.'],
         a:[['fm',{o:1},0,350]],loop:['press'],chk:[['c3','Boiler thermal fuse, across it']]}
      ],
      CW:[
        {t:'Steam thermostat out',d:'Its leads go with the old harness. Unscrew the thermostat from the top of the boiler.',
         a:[['stl',{y:40},0,800],['stl',{o:0},500,300],['st',{o:0},700,600]],loop:['spinR']},
        {t:'Fuse in, hand tight',d:'A thin film of the same 180 °C paste on its stud and face, then screw it into the steam thermostat\'s hole by hand until it seats. Its body is ceramic: no spanner.',
         a:[['fpaste',{sy:1},0,900],['nf',{o:1},900,250],['nf',{r:0},900,1300]],loop:['spinF']},
        {t:'Wire it instead of the stock fuse',d:[['Classic Pro family: AC17, from the SSR, goes on one spade and AC18, to the heater splice, on the other, instead of AC11 and AC12 to the stock fuse.','fam:GCP;volts:120;set:volts'],['Classic Pro family: AC16, from the SSR, goes on one spade and AC17, to the heater splice, on the other, instead of AC11 and AC12 to the stock fuse.','fam:GCP;volts:230;set:volts'],['Classic Pro family: the run from the SSR goes on one spade and the run to the heater splice on the other (AC17 and AC18 at 120 V, AC16 and AC17 at 230 V), instead of AC11 and AC12 to the stock fuse.','fam:GCP;unset:volts'],['Original Classic: AC6 and AC7 go on its right spade and the element lead AC8 on its left (AC8 and AC9 on a 120 V machine), instead of the stock fuse\'s ends.','fam:GC'],'Uninsulated 6.3 mm spades under silicone sleeve, and the stock fuse comes out; leave its clip and any earth wire on it in place.'],
         a:[['of',{o:0},0,600],['ow',{o:0},0,600],['cw1',{d:0},400,1100],['cw2',{d:0},500,1100],['spc',{o:1},1500,300],['cwl',{o:1},1500,300]],ph:'cw',map:'part:rf'},
        {t:'Check it',d:'Unplugged, a meter across its two spades reads under 1 Ω. In custom wiring it sits in the heater line, so if it ever trips the boiler stops heating: unplug, let it cool, find out why (an SSR stuck on, a boiler run dry), and only then press its button.',
         a:[['fm',{o:1},0,350]],loop:['press'],chk:[['c3','Boiler thermal fuse, across it'],['g6','Boiler thermal fuse in the heater line']]}
      ]
    }};


  /* one scene per step: fade every other scene out and this one in */
  function only(prefix,n,count){var a=[];for(var i=1;i<=count;i++)if(i!==n)a.push([prefix+i,{o:0},0,250]);a.push([prefix+n,{o:1},150,300]);return a}
  function cat(){return Array.prototype.concat.apply([],arguments)}

  G.wire={svg:'pg-wire',
    base:{wv1:{o:1},wv2:{o:0},wv3:{o:0},wv4:{o:0},wv5:{o:0},wv6:{o:0},wv7:{o:0},wv8:{o:0},waste:{y:0,o:1},cutT:{y:-34,o:0},cutB:{y:34,o:0},flag:{o:0,y:-12},wd1:{o:0},
      slug:{x:0,o:1},sjT:{y:-14,x:0,o:1},sjB:{y:14,x:0,o:1},wd2:{o:0},isp:{x:70},dimp:{o:0},cjT:{y:-18,o:0},cjB:{y:18,o:0},slv:{x:0,sy:1},bsp:{x:60},wo:{o:1},wc:{o:0},wcap:{o:1},
      ojT:{y:-18,o:0},ojB:{y:18,o:0},hgun:{o:0},tsp:{x:60},fold:{r:0},fk:{x:60,o:0},pgy:{x:-90},pa:{y:-50},bl:{x:-30},br:{x:30},bd1:{o:0},bd2:{o:0},hs:{x:0,sy:1},hg2:{o:0},
      bjT:{y:-18,x:0,o:0},bjB:{y:18,x:0,o:0},okm:{o:0}},
    steps:{all:[
      {t:'Cut and label',d:'Cut each wire to its length on the cut list (the official lengths are generous: route first, then trim), and put its label on both ends before you crimp.',
       a:cat(only('wv',1,8),[['wd1',{o:1},0,300],['cutT',{o:1},150,200],['cutB',{o:1},150,200],['cutT',{y:0},400,450],['cutB',{y:0},400,450],['waste',{y:40,o:0},950,600],['cutT',{y:-34,o:0},950,350],['cutB',{y:34,o:0},950,350],['flag',{o:1,y:0},1400,500]]),
       links:[['Cut list','cut-list.html'],['Wire labels','wire-labels.html']]},
      {t:'Strip 6 mm',d:'Strip about 6 mm of insulation. If any strands come away with it, cut the end off and strip again. A light twist keeps the strands together.',
       a:cat(only('wv',2,8),[['sjT',{y:0},400,450],['sjB',{y:0},400,450],['sjT',{x:60},900,900],['sjB',{x:60},900,900],['slug',{x:60},900,900],['slug',{o:0},1700,300],['sjT',{o:0},1700,300],['sjB',{o:0},1700,300],['wd2',{o:1},1900,300]])},
      {t:'Insulated spades and forks',d:'For ends away from the boiler. Set the connector in the crimper\'s die that matches its color (red for one 18 AWG wire; a single 22 AWG wire needs the fold-over in step 5 first), push the stripped end fully in, and squeeze until the crimper lets go. Nylon insulation is good to only 105 °C.',
       a:cat(only('wv',3,8),[['isp',{x:0},400,900],['cjT',{o:1},1100,250],['cjB',{o:1},1100,250],['cjT',{y:0},1400,450],['cjB',{y:0},1400,450],['dimp',{o:1},1800,200],['cjT',{y:-18,o:0},2000,400],['cjB',{y:18,o:0},2000,400]])},
      {t:'Bare spades at the boiler',d:'Anything on or near the boiler gets an uninsulated spade under silicone, because insulated ones melt there. Slide the silicone sleeve onto the wire first. Lay the end in with the bare copper under the front tabs and the insulation under the rear tabs, and squeeze in the open-barrel crimper\'s matching die. (The official grounding tip also allows an insulated spade with its nylon taken off.) Then slide the sleeve over and shrink it with the heat gun, or wrap it in self-fusing silicone tape.',
       a:cat(only('wv',4,8),[['bsp',{x:0},400,900],['ojT',{o:1},1100,250],['ojB',{o:1},1100,250],['ojT',{y:0},1400,450],['ojB',{y:0},1400,450],['wo',{o:0},1700,150],['wc',{o:1},1700,150],['wcap',{o:0},1700,250],['ojT',{y:-18,o:0},1900,400],['ojB',{y:18,o:0},1900,400],['slv',{x:122},2200,800],['hgun',{o:1},2900,300],['slv',{sy:.72},3100,800]]),loop:['heat']},
      {t:'Two wires, or a thin one',d:'Where two wires share a spade, strip both to the same length and twist them together. Two 18 AWG wires need a blue spade; two 22 AWG wires, like the low-voltage ground and its jumper, fill a red one. One 22 AWG wire on its own is too thin for any spade or fork: strip four times as much and fold the copper back on itself, or splice it to 18 AWG first. Kits often come with these ends already made.',
       a:cat(only('wv',5,8),[['tsp',{x:0},400,900],['fold',{r:180},1500,900],['fk',{o:1},2500,200],['fk',{x:0},2500,800]])},
      {t:'Piggyback on the pump',when:'wpath:SI',d:['Wire N ends in a piggyback spade. Unplug',['Pa','!model:GC'],['Pa (F on a 230 V original Classic)','model:GC'],'from the pump, push the piggyback onto that terminal, and plug the lead back onto the piggyback\'s tab. Either way round, the two share the terminal.'],
       a:cat(only('wv',6,8),[['pgy',{x:0},400,900],['pa',{y:0},1500,800]]),map:[['Wire N on the wiring map','run:N']]},
      {t:'A butt splice, if a wire is short',d:'A bare BN1.25 splice (a BN2 takes two 18 AWG wires a side), with silicone heat shrink slid on first. Push each wire in to the middle stop, crimp each half with an uninsulated-terminal crimper, then shrink the sleeve over it. Mains wires are crimped, not soldered.',
       a:cat(only('wv',7,8),[['bl',{x:0},400,900],['br',{x:0},400,900],['bjT',{o:1},1100,250],['bjB',{o:1},1100,250],['bjT',{y:0},1400,400],['bjB',{y:0},1400,400],['bd1',{o:1},1750,150],['bjT',{y:-18},1900,300],['bjB',{y:18},1900,300],['bjT',{x:48},2200,400],['bjB',{x:48},2200,400],['bjT',{y:0},2650,400],['bjB',{y:0},2650,400],['bd2',{o:1},3000,150],['bjT',{y:-18,o:0},3150,400],['bjB',{y:18,o:0},3150,400],['hs',{x:118},3500,800],['hg2',{o:1},4200,300],['hs',{sy:.72},4300,700]]),loop:['heat2']},
      {t:'Pull-test every crimp',d:'Pull gently on each one. If it moves, cut the connector off and crimp a new one. Then cover any bare metal that\'s left.',
       a:cat(only('wv',8,8),[['okm',{o:1},1400,400]]),loop:['tug','jig']}
    ]}};

  G.ssr={vars:[{k:'SI',l:'Stock wiring'},{k:'CW',l:'Custom wiring'}],def:function(){return (GM&&GM.wpath&&GM.wpath())||'SI'},
    svgs:{SI:'pg-ssr',CW:'pg-ssr'},
    base:{SI:null,CW:null},
    steps:{SI:null,CW:null}};
  (function(){
    var base={sv1:{o:1},sv2:{o:0},sv3:{o:0},ssr1:{x:150,o:0},clr:{o:0},scw:{x:-80},wsh:{x:50,o:0},nut:{x:60,o:0},cov:{o:1,y:0},lw1:{y:70},lw2:{y:70},cwp:{y:-60,o:0},cwm:{y:-60,o:0}};
    function steps(load,lph){return [
      {t:'Find its spot',d:'On the back wall, with room above it for the funnel piece and its screw, and not touching the pump or its housing.',
       a:[['ssr1',{o:1},0,200],['ssr1',{x:0},100,900],['clr',{o:1},1100,300]],ph:PH.ssr,map:'part:ssr'},
      {t:'Screw it to the wall',d:'An M4 (or 8-32) screw, washer and nut through a vent slot, with the SSR\'s metal base flat against the wall.',
       a:[['sv1',{o:0},0,250],['sv2',{o:1},150,300],['scw',{x:0},500,900],['wsh',{o:1},1400,200],['wsh',{x:0},1400,600],['nut',{o:1},1700,200],['nut',{x:0},1700,600]],loop:['nutspin']},
      {t:'Load wires on the big screws',d:load,
       a:[['sv2',{o:0},0,250],['sv3',{o:1},150,300],['cov',{o:0,y:-24},600,600],['lw1',{y:0},1200,900],['lw2',{y:0},1300,900],['sl1',{r:360},2200,800],['sl2',{r:360},2300,800]],ph:lph,map:'part:ssr'},
      {t:'Control wires: + and −',d:'J9 R1 goes on the + screw and J9 GND on −. This side has a polarity. The 22 AWG control wires need the fold-over, or a splice to 18 AWG, to sit in a fork.',
       a:[['cwp',{o:1},0,200],['cwm',{o:1},100,200],['cwp',{y:0},0,900],['cwm',{y:0},100,900],['sc1',{r:360},1000,800],['sc2',{r:360},1100,800]],chk:[['f5','J9 R1 pin to SSR +'],['f6','J9 GND pin to SSR −']],map:[['On the wiring map','short:J9 R1,J9 GND',null,'SSR control wires']]},
      {t:'Check it',d:'Every screw tight, no stray strands, no fork touching its neighbor, and the cover closed. On the bench test, the SSR\'s light comes on whenever the board calls for heat.',
       a:[['cov',{o:1,y:0},0,600]],loop:['blink']}
    ]}
    G.ssr.base.SI=base;G.ssr.base.CW=base;
    G.ssr.steps.SI=steps('Wires Sa and Sb, which plug onto the two leads that came off the steam thermostat, go under the two load screws, either way round. Forks under the clamp plates are the tidy way; the stock guide also allows bare wire looped under the plate.','ssrW');
    G.ssr.steps.CW=steps([['Classic Pro family: the right screw takes AC2 from the power switch and AC4 to the PCB\'s L, both in one two-wire (SV2) fork; the left screw takes AC11 to the boiler fuse (AC17 at 120 V, or AC16 at 230 V, with the optional resettable fuse).','fam:GCP'],['Original Classic: the right screw takes AC2 from the On/Off common and AC3 to the PCB\'s L in one two-wire (SV2) fork; the left screw takes AC6 to the boiler fuse (or to the optional resettable fuse, which AC6 and AC7 move to).','fam:GC']],'cw');
  })();

  G.sw={vars:[{k:'GCP',l:'Pro, Evo, E24'},{k:'GC',l:'Original Classic'}],def:function(){return famOf()||'GCP'},mpath:'SI',
    svgs:{GCP:'pg-swp',GC:'pg-swc'},
    base:{
      GCP:{blk:{o:0},bc0:{y:0},bc1:{y:0},bc2:{y:0},bc3:{y:0},bs0:{o:0},bs1:{o:0},bs2:{o:0},bs3:{o:0},swv:{o:1},swm:{o:0},b4t:{o:0},s4t:{o:0},s5t:{o:0},b4:{x:0,y:0},s4:{x:0},s5:{x:0,y:0},s5s:{o:0},b4note:{o:0},lv1:{o:0},lv2:{o:0},lv3:{o:0},lv4:{o:0},lvcap:{o:0}},
      GC:{swv:{o:1},swm:{o:0},cp12t:{o:0},c1t:{o:0},c2t:{o:0},c3t:{o:0},cp34t:{o:0},cp12:{x:0,y:0},c1:{y:0},c2:{y:0},c3:{y:0},cp34:{x:0},c1s:{o:0},c2s:{o:0},c3s:{o:0},cp34s:{o:0},park:{o:0},lv1:{o:0},lv2:{o:0},lv3:{o:0},lv4:{o:0},lvcap:{o:0}}
    },
    steps:{
      GCP:[
        {t:'Evo and E24: split the connector block',when:'model:EVO,E24',d:'Most Evo and E24 machines have one; skip this if yours has single connectors. Easier with the switch or boiler out. Press each connector\'s locking tab with a small screwdriver, pull it out the back, cover it with silicone tape or 6 mm silicone heat shrink, and label it (an oil-based marker writes on silicone). One at a time.',
         a:[['swv',{o:0},0,250],['blk',{o:1},150,300],['bc0',{y:70},500,500],['bs0',{o:1},1000,300],['bc1',{y:70},1300,500],['bs1',{o:1},1800,300],['bc2',{y:70},2100,500],['bs2',{o:1},2600,300],['bc3',{y:70},2900,500],['bs3',{o:1},3400,300]],ph:PH.cci},
        {t:'Label the three that move',d:'B4 on brew spade 4, and S4 and S5 on steam spades 4 and 5. The wire labels page prints them.',
         a:[['blk',{o:0},0,250],['swv',{o:1},150,300],['b4t',{o:1},500,300],['s4t',{o:1},750,300],['s5t',{o:1},1000,300]],links:[['Wire labels','wire-labels.html']],map:[['Brew switch on the wiring map','part:swB'],['Steam switch','part:swS']]},
        {t:'Brew: B4 onto wire L',d:'Unplug B4 from brew spade 4 and plug it onto wire L, which runs to the PCB\'s J11. Spade 4 stays empty, but it\'s live whenever brew is on and the valve is open: keep it clear.',
         a:[['b4',{x:35,y:-65},0,1100],['b4note',{o:1},1100,300]],ph:PH.swL,map:[['Wire L on the wiring map','run:L']]},
        {t:'Steam: S4 to spade 1',d:'Move S4 from steam spade 4 to spade 1. Steam spades 1, 2 and 3 now all carry mains.',
         a:[['s4',{x:-80},0,1000]],map:[['S4 on the wiring map','part:f:S4']]},
        {t:'Park S5',d:'Unplug S5. It stays live: cover its end with silicone tape or heat shrink, and tie it down where it can\'t touch anything.',
         a:[['s5',{x:-10,y:-117},0,1100],['s5s',{o:1},1100,400]],map:[['S5 on the wiring map','part:f:S5']]},
        {t:'Low-voltage wires on the freed spades',d:'Only on brew 1 and 2 and steam 4 and 5. J7 B goes on brew 1; J7 GND and a jumper share one spade on brew 2, and the jumper runs on to steam 5; J7 S on steam 4.',
         a:[['lv1',{o:1},0,500],['lv2',{o:1},300,500],['lv3',{o:1},600,300],['lv4',{o:1},800,500],['lvcap',{o:1},1100,300]],ph:PH.swLV,map:[['On the wiring map','short:J7 B,J7 GND,J7 S,Brew sw 2 →',null,'Switch signal wires']]},
        {t:'Check it',d:'Unplugged, with the J7 plug off: brew on shows continuity (close to 0 Ω) from J7 B to GND, and open with brew off; the same for steam on J7 S. Afterwards the steam lamp lights when the boiler isn\'t heating, and the brew lamp stays dark.',
         a:[['swv',{o:0},0,250],['swm',{o:1},150,300]],chk:[['f1','Brew ON'],['f2','Brew OFF'],['f3','Steam ON'],['f4','Steam OFF']]}
      ],
      GC:[
        {t:'Label the connectors',d:'P1-2 (the brew switch\'s common), 1, 2, 3 and P3-4 on the switch housing. The wire labels page prints them.',
         a:[['cp12t',{o:1},300,300],['c1t',{o:1},500,300],['c2t',{o:1},700,300],['c3t',{o:1},900,300],['cp34t',{o:1},1100,300]],links:[['Wire labels','wire-labels.html']],map:[['The switch housing on the wiring map','part:housing']]},
        {t:'P1-2 onto wire L',d:'Unplug P1-2 and plug it onto wire L, which runs to the PCB\'s J11.',
         a:[['cp12',{x:-35,y:-115},0,1100]],ph:PH.swLc,map:[['Wire L on the wiring map','run:L']]},
        {t:'Park 1, 2, 3 and P3-4',d:['All four stay live: cover each end and tie it down. Where a connector holds two wires, leave them joined in it.',['At 120 V, 2 and 3 still join wires that carry heater current (3 links the power switch to Ba, 2 links Sa to an element): don\'t cut either off.','volts:120'],['At 230 V, 3 still joins the power switch to P1-2, so L\'s feed passes through it: don\'t cut it off.','volts:230']],
         a:[['c1',{y:-34},0,800],['c3',{y:-34},100,800],['c2',{y:34},200,800],['cp34',{x:50},300,800],['c1s',{o:1},1000,300],['c3s',{o:1},1100,300],['c2s',{o:1},1200,300],['cp34s',{o:1},1300,300],['park',{o:1},1500,300]],map:[['Parked connectors on the wiring map','part:housing']]},
        {t:'Low-voltage wires on the freed spades',d:'Only on 1, 3, P(1-2) and P(3-4). J7 B on brew 1; J7 S on steam 3; J7 GND and a jumper share one spade on steam P(3-4), and the jumper runs on to brew P(1-2). Steam P(5-6) and 6 still carry mains for the valve.',
         a:[['lv1',{o:1},0,500],['lv2',{o:1},300,500],['lv3',{o:1},600,500],['lv4',{o:1},900,300],['lvcap',{o:1},1100,300]],ph:PH.swLVc,map:[['On the wiring map','short:J7 B,J7 S,J7 GND,Steam sw P(3-4) →',null,'Switch signal wires']]},
        {t:'Check it',d:'Unplugged, with the J7 plug off: brew on shows continuity (close to 0 Ω) from J7 B to GND, and open with brew off; the same for steam on J7 S. Afterwards the boiler lamp inside the housing stays dark; the power lamp works as before.',
         a:[['swv',{o:0},0,250],['swm',{o:1},150,300]],chk:[['f1','Brew ON'],['f2','Brew OFF'],['f3','Steam ON'],['f4','Steam OFF']]}
      ]
    }};

  /* ---------------- the screen, the ToFnLED, firmware and the hardware scales (official guides: Interface: Screen,
     Accessory: ToFnLED, MCU Flashing, Accessory: Hardware Scales; read October 2026) ---------------- */
  var SP={ov:'https://github.com/user-attachments/assets/888b31f2-d0e5-48d8-af31-7133bd122f70',fMag:'https://github.com/user-attachments/assets/ead5c319-6b55-48c7-8b6b-0f29e8354e0f',fGap:'https://github.com/user-attachments/assets/588d2c45-c75d-4f03-a2a2-f3a7fb753912',fPlug:'https://github.com/user-attachments/assets/028e9195-825e-48e4-b37b-14276b37e91b',
    uLid:'https://github.com/user-attachments/assets/99be6c31-095a-4fbf-ba57-a0f48e4b8bd4',uIns:'https://github.com/user-attachments/assets/6b5498d2-14ce-473d-86b5-116dd9999caa',uVent:'https://github.com/user-attachments/assets/8c1e694a-89a4-4cce-9641-f92db90aab87',uPlug:'https://github.com/user-attachments/assets/99454a58-6f10-4422-9010-ad2a61bfa8cc',
    rVent:'https://github.com/user-attachments/assets/1ecfdfb7-cd2e-49c0-895f-76fc201f7e7c',rPlug:'https://github.com/user-attachments/assets/8724315e-99c0-4e59-8242-e98b0531ee6c',posts:'https://github.com/user-attachments/assets/2d059c58-a688-409c-9bd9-183443854bc7',cover:'https://github.com/user-attachments/assets/fc37622f-ee69-4ec3-af85-874e8c00d273',
    fClip:'https://github.com/user-attachments/assets/343d150b-3509-481a-80a5-b4e811b0ea3c',fOn:'https://github.com/user-attachments/assets/2a1c65f7-1ec7-46a0-bfa5-59710317190d',fTop:'https://github.com/user-attachments/assets/44cd4587-2e95-4c72-bc0c-595ed9d91755',
    plate:'https://github.com/user-attachments/assets/d9653f52-dd7f-4593-b4bb-dfeb9fba9cd2',swiv:'https://github.com/user-attachments/assets/9bc40925-76a9-4868-bed5-2a554826f1b7',zip:'https://github.com/user-attachments/assets/bc3a08cb-6f48-489a-9d2c-367b53e5f1c9',uOn:'https://github.com/user-attachments/assets/8f151c1e-93fa-4e46-81d0-cb45a3dc9d63',
    rPl:'https://github.com/user-attachments/assets/69b796ea-27e1-4fb2-a55e-b474187ac989',rOn1:'https://github.com/user-attachments/assets/d8067907-8ccb-4b46-b1b2-455515eea056',rOn2:'https://github.com/user-attachments/assets/e498133e-9f96-4136-bac3-5a3531091e48',
    bench:'https://github.com/user-attachments/assets/5ea67541-0cf4-4064-9f87-19ad900bef8b',
    tMag:'https://user-images.githubusercontent.com/117388662/256454738-f7717135-2389-451c-b2c9-9439c2159eee.png',tOn:'https://user-images.githubusercontent.com/117388662/256464601-0d54fd7a-0f65-495e-8169-83fe9bd14a53.png',tFilm:'https://github.com/GAGGIUINO/gaggiuino.github.io/assets/117388662/007150d8-7a48-4bce-859a-5bb903692cf6',
    tTape:'https://user-images.githubusercontent.com/117388662/265826223-1f28003f-5d1a-4046-ab25-c19f5b2376f6.png',tCone:'https://github.com/GAGGIUINO/gaggiuino.github.io/assets/117388662/b59cf346-f689-4e5c-b32d-8c6abc9468b5',tCtl:'https://user-images.githubusercontent.com/117388662/274979976-ae9f02ab-8c61-438e-81ea-adfabdff183b.png',
    tT:'https://user-images.githubusercontent.com/117388662/256653622-6f84ea94-ee0c-4dbe-aae4-88dc015f8d03.png',tV:'https://user-images.githubusercontent.com/117388662/256655744-be96feb6-40d0-4f12-91cb-79502fb5027e.png',labels:'https://gaggiuino.github.io/schematics/stm32_pcbv3_1_board_labels.png',
    ledset:'https://gaggiuino.github.io/manual/gen3/mbed/003_005_settings_led.png',
    oAp:'https://github.com/user-attachments/assets/af24bb4e-1608-4b45-b78d-ccb7d15bec18',oSet:'https://github.com/user-attachments/assets/0c7114ec-6e85-4894-bfc8-d779a8de38b5',oUp:'https://github.com/user-attachments/assets/f70a4726-daa2-459b-aacc-4167444edf87',oWait:'https://github.com/user-attachments/assets/ae9f802d-d9a1-4b26-a504-dbecb29cdab7',oDone:'https://github.com/user-attachments/assets/faba0d3e-15fd-4324-a28f-f170c0950757',
    about:'https://gaggiuino.github.io/manual/gen3/mbed/003_006_settings_about.png',wFile:'https://github.com/user-attachments/assets/fee8093d-cabe-4158-bfdf-40ce2cc233a3',wPcb:'https://github.com/GAGGIUINO/gaggiuino.github.io/assets/117388662/58377fd5-49f2-47f2-98d6-7c800eb6e712',wBp:'https://user-images.githubusercontent.com/117388662/262874364-c44f2eea-6a64-4731-adb8-a0c1a16089d6.png',wGo:'https://github.com/user-attachments/assets/13df020c-9989-4ae9-ac7b-abaf5ce19d6c',
    sAdh:'https://user-images.githubusercontent.com/117388662/256964354-bca6c07c-4a85-4b3a-b499-7e2b3032d524.png',sFit:'https://user-images.githubusercontent.com/117388662/256964444-025e6320-b85b-433e-99ba-829ea5907b91.png',sChk2:'https://user-images.githubusercontent.com/117388662/256964641-3acbc0d1-9491-4017-852f-5f5b65086ada.png',sChkD:'https://user-images.githubusercontent.com/117388662/256964653-13ea4859-a5e9-4153-9c0a-796def530f7f.png',sChkF:'https://github.com/GAGGIUINO/gaggiuino.github.io/assets/117388662/3c661e2a-6888-4adb-9d01-0e69c97f2c83',
    sCut2:'https://user-images.githubusercontent.com/117388662/256964791-0b282d78-d4fb-4158-b2d2-5aa005f3e443.png',sCutD:'https://user-images.githubusercontent.com/117388662/256964801-62946762-2394-4d70-b601-50f07f1cff0c.png',sJp11:'https://user-images.githubusercontent.com/117388662/256964853-8b8c8c03-a83c-412a-989c-739abae6975f.png',
    sStr2:'https://github.com/GAGGIUINO/gaggiuino.github.io/assets/117388662/58e57bcd-a5f6-4057-839d-e0c8096b1ae9',sStrD:'https://github.com/GAGGIUINO/gaggiuino.github.io/assets/117388662/2e791cc1-157b-4c02-8e98-080b46ae99a9',sDone2:'https://github.com/GAGGIUINO/gaggiuino.github.io/assets/117388662/5d5141a2-c5ab-4270-a4cd-cc8d902273d4',sDoneD:'https://github.com/GAGGIUINO/gaggiuino.github.io/assets/117388662/92927dc9-2266-4f6e-9814-4574f6d78684',sDoneF:'https://github.com/GAGGIUINO/gaggiuino.github.io/assets/117388662/5c6976a2-43b7-4867-9a70-1909f626b2b3',
    sMag:'https://github.com/GAGGIUINO/gaggiuino.github.io/assets/117388662/170b36e7-43d6-47af-8bd2-ca8c6598fa56',sMag2:'https://user-images.githubusercontent.com/117388662/257019766-5bf71df5-d363-4e2c-8d49-f4f217209356.png',sTrayCut:'https://user-images.githubusercontent.com/117388662/257088268-c1ab40c7-4c69-4b48-a10c-3b890e8cc97b.png',sTrayAd:'https://user-images.githubusercontent.com/117388662/267475732-14dbea6c-ff72-45ff-959c-9a5ef89ce215.png',sSpacer:'https://user-images.githubusercontent.com/117388662/257087801-911f627f-ac5b-4011-802c-8ee73655e872.png',
    sXH:'https://github.com/GAGGIUINO/gaggiuino.github.io/assets/117388662/8e9a1b4d-c7b5-40e6-a3a2-208fceedeef2',sRoute:'https://github.com/GAGGIUINO/gaggiuino.github.io/assets/117388662/3a2590cf-f572-4f2c-93c0-45c246a23b9e',sPar:'https://user-images.githubusercontent.com/117388662/257089574-2004216e-7231-4c33-b8eb-ff90b93f4dfa.png',sSnap:'https://user-images.githubusercontent.com/117388662/257089656-57ecccf3-1225-4ff7-a387-01ace2999414.png',sClr:'https://user-images.githubusercontent.com/117388662/257089747-74fd447d-a299-4d65-a408-b325f09ec326.png',
    sPlates:'https://github.com/user-attachments/assets/018a0a44-ac59-4ced-9f2d-6c56f6de97ef',s2500:'https://github.com/user-attachments/assets/6487f076-fbb9-44a5-bfa1-153c4965f1c4',sSign:'https://github.com/user-attachments/assets/706d466d-bffa-43f5-b1f4-ac8d25a39c4b',sDoneT:'https://user-images.githubusercontent.com/117388662/257110758-a6eae8c8-c12e-41eb-bfa3-586ae03dd88a.png'};

  /* the screen housing: front, funnel or rear mount */
  var SCB={hb:{o:1},hbl:{o:1},gap:{o:0},scr:{y:-46,o:0},scab:{d:1},hf:{o:0,s:.94},topf:{o:0},tape1:{o:0},onF:{o:0},onU:{o:0},onR:{o:0},rcF:{d:1},rcU:{d:1},rcR:{d:1},tapeF:{o:0},ties:{o:0},gnd:{o:0},lift:{o:0},cw:{y:0,o:1},fn:{y:0,o:1},fnl:{o:1}};
  function scb(extra){var o={};for(var k in SCB)o[k]=SCB[k];for(var e in extra)o[e]=extra[e];return o}
  var S_WIRE={t:'Wire it first',d:'Plug the cable into the PCB first, as on the bench test, before it goes through anything: the two small screen connectors slip through the housing gaps, the other end often can\'t.',
       a:[['scab',{d:0},0,1200],['gap',{o:1},1000,300]],links:[['Bench test','https://gaggiuino.github.io/#/guides-stm32/pcb-guide?id=pre-install-test']]};
  var S_POSTS={t:'Screen onto the upper posts first',d:'They have a retention feature. Check the wires sit below the surface of the housing and the screen PCB, and aren\'t pinched under the connectors.',
       a:[['gap',{o:0},0,200],['scr',{o:1},0,250],['scr',{y:0},200,1000]],ph:SP.posts};
  var S_COVER={t:'Front cover: top edge first',d:'Start with the top side, the one with the thinner bezel, check no wires are in the way, then snap the lower side on. To take it off again, use the fingernail slots.',
       a:[['hbl',{o:0},0,300],['hf',{o:1},0,300],['topf',{o:1},0,300],['hf',{s:1},300,700],['topf',{o:0},1200,300]],ph:SP.cover};
  function sPlug(ph,extra){return {t:'Cable through the back, then plug in',d:'Feed the cable through the mount (if it has a hole for it) and the housing back, then plug it into the screen by the schematic, pin by pin, not by color. Keep the wires off the big components; Kapton tape can hold them.',
       a:[['gap',{o:1},0,300],['scr',{o:1},200,300]].concat(extra||[]),ph:ph}}
  G.scr={vars:[{k:'front',l:'Front mount'},{k:'funnel',l:'Funnel mount'},{k:'rear',l:'Rear mount'}],def:function(){return 'front'},svg:'pg-scr',
    base:{front:scb({mtF:{o:0,y:20},mgs:{o:0,y:-16},glue:{o:0}}),
          funnel:scb({fcov:{o:0},lid:{x:0,o:0},pry:{o:0,x:20},hsi:{o:0,y:-20},iron:{o:0,y:-20},lat:{o:0,x:-14},ap:{o:0,y:-12},sw:{o:0}}),
          rear:scb({ap:{o:0,y:-12},rm:{o:0,y:24}})},
    steps:{
      front:[S_WIRE,
        {t:'Magnets into the front mount',d:'Over a magnetic surface, glue two magnets into each pocket with super glue or epoxy so they sit flat. On a machine that isn\'t magnetic, use double-sided tape rated for 80 °C or more instead.',
         a:[['gap',{o:0},0,200],['mtF',{o:1,y:0},0,600],['glue',{o:1},600,300],['mgs',{o:1},800,200],['mgs',{y:0},800,700],['glue',{o:0},1500,200]],ph:SP.fMag},
        {t:'Wires through the housing gap',d:'Route them through the gap in the housing as the official photo shows.',a:[['gap',{o:1},0,300]],ph:SP.fGap},
        sPlug(SP.fPlug),S_POSTS,S_COVER,
        {t:'Clip the mount on',d:'Line the mount up with the housing, press the clip down gently, then push the mount forward until the clip springs back. Keep the wires centered without much slack so they don\'t get pinched.',
         a:[['mtF',{y:-120,o:0},0,1100]],ph:SP.fClip},
        {t:'Onto the machine',d:'With the cup warmer off, set it on the front of the machine, tidy the cable as the official photo shows and feed the spare length back inside. Tape the cable down with Kapton or another high-temperature tape.',
         a:[['hb',{o:0},0,400],['hf',{o:0},0,400],['scr',{o:0},0,400],['scab',{o:0},0,400],['cw',{y:-16,o:.4},0,500],['fn',{y:-16,o:.4},0,500],['fnl',{y:-16,o:.4},0,500],['onF',{o:1},400,500],['rcF',{d:0},600,1200],['tapeF',{o:1},1700,300]],
         ph:SP.fOn,map:'run:SCR',chk:[['g13','Screen cable sleeved where it passes the back vent']]},
        {t:'Funnel and cup warmer back on',d:'Once everything sits where you want it. Reconnect their earth wires: they keep the metal top bonded to earth.',
         a:[['cw',{y:0,o:1},0,600],['fn',{y:0,o:1},0,600],['fnl',{y:0,o:1},0,600],['gnd',{o:1},600,400]],ph:SP.fTop,chk:[['h1','Cup warmer and funnel earth wires reconnected'],['h2','Inlet earth pin to cup warmer plate']]}
      ],
      funnel:[S_WIRE,
        {t:'Open the funnel cover',d:'Put a screwdriver in the pry slot on the back of the funnel cover and gently slide the lid off.',
         a:[['gap',{o:0},0,200],['fcov',{o:1},0,400],['lid',{o:1},0,400],['pry',{o:1},300,300],['pry',{x:0},500,400],['lid',{x:60,o:0},900,900],['pry',{o:0},1600,300]],ph:SP.uLid},
        {t:'Heat-set insert, then the latch',d:'If the insert isn\'t already in, set it with a soldering iron. Then press the latch into the cover plate by hand: it locks the screen\'s rotation, and pressing it lets you swing the screen out of the way to fill the tank.',
         a:[['iron',{o:1},0,300],['hsi',{o:1},0,300],['iron',{y:0},300,700],['hsi',{y:0},300,700],['iron',{o:0,y:-20},1100,400],['lat',{o:1},1300,300],['lat',{x:0},1300,700]],ph:SP.uIns},
        {t:'Wires through the vent',d:'Route them through the vent as the official photo shows, sleeved where they pass its edge. Centered works, but shifting them over gives more clearance from the mains wiring.',
         a:[['rcU',{d:0},0,1400]],ph:SP.uVent,map:'run:SCR',chk:[['g13','Screen cable sleeved where it passes the back vent']]},
        sPlug(SP.uPlug),S_POSTS,S_COVER,
        {t:'Tape the wires, clip on the plate',d:'Tape the wires in place, line the adjustable plate up with the housing, press the clip down gently and push the plate forward until the clip springs back. Check the wires are in the gap, then take the tape off.',
         a:[['tape1',{o:1},0,300],['ap',{o:1,y:0},300,700],['tape1',{o:0},1300,300]],ph:SP.plate},
        {t:'The swivel',d:'Screw the swivel to the plate with the screws, washers, lock washers and lock nuts, in the washer order the official photo shows so the lock washers can\'t cut into the print. They act as springs: tighten until the angle moves by hand and stays put. If the vertical screw works loose later, a tiny drop of plastic-safe threadlocker on the insert holds it.',
         a:[['sw',{o:1},0,500]],ph:SP.swiv},
        {t:'Onto the funnel',d:'Zip-tie the wires if you like. Put the funnel and cup warmer back, reconnecting their earth wires, then set the mount on the funnel.',
         a:[['hb',{o:0},0,400],['hf',{o:0},0,400],['scr',{o:0},0,400],['scab',{o:0},0,400],['ap',{o:0},0,400],['sw',{o:0},0,400],['fcov',{o:0},0,400],['lat',{o:0},0,400],['hsi',{o:0},0,400],
            ['fnl',{o:0},0,300],['onU',{o:1},400,500],['ties',{o:1},800,300],['gnd',{o:1},1100,400]],ph:[SP.zip,SP.uOn],chk:[['h1','Cup warmer and funnel earth wires reconnected'],['h2','Inlet earth pin to cup warmer plate']]}
      ],
      rear:[S_WIRE,
        {t:'Wires through the vent',d:'Route them through the back vent in the exact spot, and on the side of the rear mount, that the official photo shows: that\'s what centers the screen.',
         a:[['gap',{o:0},0,200],['rcR',{d:0},0,1400]],ph:SP.rVent,map:'run:SCR',chk:[['g13','Screen cable sleeved where it passes the back vent']]},
        sPlug(SP.rPlug,[['rm',{o:1,y:0},0,600]]),S_POSTS,S_COVER,
        {t:'Tape the wires, clip on the plate',d:'Tape the wires in place, line the adjustable plate up with the housing, press the clip down gently and push the plate forward until the clip springs back. Check the wires are in the gap, then take the tape off.',
         a:[['tape1',{o:1},0,300],['ap',{o:1,y:0},300,700],['tape1',{o:0},1300,300]],ph:SP.plate},
        {t:'Rear mount onto the plate',d:'With the screws, washers, lock washers and lock nuts, in the washer order the official photo shows. The lock washers act as springs: tighten until the angle moves by hand and stays put.',
         a:[['rm',{y:-24},0,700]],ph:SP.rPl},
        {t:'Cup warmer on, then hook it in',d:'Put the funnel and cup warmer back first, reconnecting their earth wires; it\'s much easier without the mount in place. Then fit the mount\'s upper features into the vent, clip the bottom in, and push on the back of the latch handles until they\'re fully home.',
         a:[['hb',{o:0},0,400],['hf',{o:0},0,400],['scr',{o:0},0,400],['scab',{o:0},0,400],['ap',{o:0},0,400],['rm',{o:0},0,400],['gnd',{o:1},300,400],['onR',{o:1},800,500]],
         ph:[SP.rOn1,SP.rOn2],chk:[['h1','Cup warmer and funnel earth wires reconnected'],['h2','Inlet earth pin to cup warmer plate']]}
      ]
    }};

  /* the ToFnLED */
  G.tof={svg:'pg-tof',
    base:{tofh:{o:0,y:-30},tmag:{o:0,y:-10},tglue:{o:0},film:{o:0},filmL:{o:0},qc:{d:1},pcbT:{o:1},cone:{o:0},glow:{o:0},mtape:{o:0},tT:{o:0},tub:{o:1},fwc:{o:0},lvl:{o:0},cpk:{o:0},wat:{o:1}},
    steps:{all:[
      {t:'Magnets into the housing',d:'Scratch up the magnet pockets with a craft blade so the glue grips, add a drop of cyanoacrylate and set each magnet flat. On a machine that isn\'t magnetic, use double-sided tape rated for 80 °C or more instead.',
       a:[['tofh',{o:1,y:0},0,600],['tglue',{o:1},500,300],['tmag',{o:1},700,200],['tmag',{y:0},700,600],['tglue',{o:0},1400,300]],ph:SP.tMag},
      {t:'Cable into J2',d:'The Qwiic cable (JST-SH, 250 mm or more) plugs into J2, the Qwiic socket on the back of the PCB.',
       a:[['pcbT',{s:1.06},0,300],['pcbT',{s:1},300,300]],ph:SP.labels},
      {t:'Down the side, then over the tank',d:'Run the cable down through the gap on the right side of the machine\'s sheet metal, plug it into the ToFnLED, put the board in its housing and stick the housing above the water tank.',
       a:[['qc',{d:0},0,1600],['film',{o:1},1200,300]],ph:SP.tOn},
      {t:'Peel off the sensor\'s film',d:'The sensor may still have a clear protective film on it. It spoils the readings, so take it off.',
       a:[['filmL',{o:1},0,300],['film',{y:30,o:0},300,900],['filmL',{o:0},1400,300]],ph:SP.tFilm},
      {t:'Core firmware to match its LED',d:'Flash the core file whose name matches the board\'s LED controller: pca or ncp. Most are PCA; the official photo shows how to tell. ToF presence is detected on its own.',
       a:[['fwc',{o:1},0,400]],ph:SP.tCtl,links:[['Firmware updates','#fw']]},
      {t:'Pick a color and brightness',d:'In the LED settings, on the screen or in the web UI: Enable it, then choose the color. Some colors with some themes make the screen\'s controls harder to see.',
       a:[['fwc',{o:0},0,300],['cpk',{o:1},0,400],['glow',{o:1},300,800]],ph:SP.ledset},
      {t:'Check the tank level',d:'It shows on the home screen in percent, with a reminder below 20%. The sensor sees a cone, not a line: keep it centered and the tubing out of the cone. If reflections from the housing confuse it as the level drops, a matte piece of tape below the sensor helps.',
       a:[['cpk',{o:0},0,300],['cone',{o:1},0,500],['lvl',{o:1},400,400],['mtape',{o:1},900,400]],ph:[SP.tCone,SP.tTape]},
      {t:'Optional: one tube into the tank',d:'A 6 mm barbed T above the tank joins the intake and OPV tubes, so the tank churns less and the OPV tube is hidden. The intake should end up about 175 mm long: cut it to about 190 mm, trim to fit, and cut the end in a very shallow V so it can\'t suck onto the tank bottom. Afterwards, prime the pump with a flush through the open group, run a few flushes into a blank basket to cycle water through the OPV line, then one more flush with the group open.',
       a:[['cone',{o:0},0,300],['lvl',{o:0},0,300],['mtape',{o:0},0,300],['tub',{o:0},0,400],['tT',{o:1},300,600]],ph:[SP.tT,SP.tV]},
      {t:'Close it up',d:'Funnel and cup warmer back on with their earth wires, and the covers-on checks passed, before it goes back on mains.',a:[],chk:[['h1','Cup warmer and funnel earth wires reconnected'],['h2','Inlet earth pin to cup warmer plate']]}
    ]}};

  /* firmware updates: over Wi-Fi (OTA) or by wire */
  G.fw={vars:[{k:'ota',l:'Over Wi-Fi'},{k:'wired',l:'By wire (ST-Link)'}],def:function(){return 'ota'},svgs:{ota:'pg-fwo',wired:'pg-fww'},
    base:{ota:{about:{o:1},blk:{o:0},okv:{o:0},ap:{o:0},url:{o:0},otap:{o:0},selC:{o:0},selL:{o:0},btns:{o:0},bar:{sx:0},done:{o:0},rel:{o:1},f1:{o:.35},f2:{o:.35},f3:{o:.35}},
          wired:{cube:{o:1},tick:{o:0},bconn:{o:1},bprog:{o:1},okp:{o:0},dbg:{o:0,x:-30},usb:{d:1},w3v:{d:1},wio:{d:1},wck:{d:1},wgd:{d:1},nousb:{o:0},plug:{o:1},plx:{o:0}}},
    steps:{
      ota:[
        {t:'Check what you\'re on',d:'Settings, About: the core, screen (Mbed) and web builds. All three should match each other and the latest release.',
         a:[['about',{s:1.04},0,300],['about',{s:1},300,300]],ph:SP.about},
        {t:'Get the three files',d:'From the official latest release: the core file for PCB v4 (performance, pcb, then pca or ncp for your LED controller; without a ToFnLED either works), ui-embedded.bin and ui-web.bin (a headless build uses ui-headless.bin instead). Core over Wi-Fi needs an STM32U585 (PCB v4, or a U585 core board): on a BlackPill, flash the core by wire and do just the two screen files here. If your build is older than 2025-02-16, flash breaking update 616ea70 first.',
         a:[['f1',{o:1},0,300],['f2',{o:1},200,300],['f3',{o:1},400,300]],links:[['Releases (latest)','https://github.com/Zer0-bit/gaggiuino/releases/latest'],['Breaking update 616ea70','https://github.com/Zer0-bit/gaggiuino/releases/tag/dev-616ea70']]},
        {t:'Connect and open gaggiuino.local',d:'From a device on the same network, or join the Gaggiuino AP: its password is the network name with a zero for the o and the space taken out.',
         a:[['ap',{o:1},0,400],['url',{o:1},300,400]],loop:['wifi'],ph:SP.oAp},
        {t:'Upload the core file',d:'Settings, OTA Update: choose Core Upgrade Package, SELECT FILE, pick the core file, then UPLOAD.',
         a:[['otap',{o:1},0,300],['selC',{o:1},300,200],['btns',{o:1},400,300],['f1',{x:-60,o:0},700,700],['bar',{sx:1},900,1600]],loop:['wifi'],ph:[SP.oSet,SP.oUp]},
        {t:'Wait it out',d:'The screen stays black while it uploads, flashes and reboots. Don\'t switch off: a failed or cancelled update falls back to the old firmware on its own.',
         a:[['blk',{o:1},0,400],['blk',{o:0},2400,400],['done',{o:1},2600,300]],ph:SP.oWait},
        {t:'Then the two screen files',d:'START OVER, choose LCD Upgrade Package, and upload ui-embedded.bin; then START OVER again for ui-web.bin. Refresh the browser after ui-web. Core first, then ui-embedded, then ui-web, unless the release notes say otherwise.',
         a:[['done',{o:0},0,200],['bar',{sx:0},0,10],['selC',{o:0},0,200],['selL',{o:1},200,200],['f2',{x:-60,o:0},400,600],['bar',{sx:1},700,900],['f3',{x:-60,o:0},1700,600],['done',{o:1},2400,300]],loop:['wifi'],ph:SP.oDone},
        {t:'Check they match',d:'Back in About, all three builds should now match. If updates fail while it\'s on your home network, disconnect Gaggiuino from the network and join its AP directly. If core updates were flashed out of order, the board may need flashing by wire.',
         a:[['ap',{o:0},0,300],['okv',{o:1},300,400]],ph:SP.about}
      ],
      wired:[
        {t:'When you need it',d:'PCB v4 updates over Wi-Fi; a wire is the fallback if a core update goes wrong. PCB v3.1 and BlackPill boards are always flashed this way. It flashes the core only; the screen files go over Wi-Fi.',a:[]},
        {t:'STM32CubeProgrammer and the core file',d:'Install STM32CubeProgrammer from ST (it asks for an email sign-up) and download the core file for your board from the latest release.',
         a:[['cube',{s:1.03},0,300],['cube',{s:1},300,300]],links:[['Releases (latest)','https://github.com/Zer0-bit/gaggiuino/releases/latest']]},
        {t:'Machine unplugged, USB-C out',d:'Unplug the machine, and leave the PCB\'s own USB-C port empty. On PCB v3.1 and BlackPill boards this matters: unless the PA15 fix is confirmed, the heaters can come on while the debugger is connected. PCB v4 doesn\'t have that problem.',
         a:[['plx',{o:1},0,400],['nousb',{o:1},400,400]],links:[['PA15 check and fix (official)','https://gaggiuino.github.io/#/guides-upgrade/pcb-upgrade?id=pa15-pulldown-rework']]},
        {t:'Debugger to J27',d:'A WeAct Mini Debugger or an ST-Link, on four wires to the top row of J27: 3.3 V, SWDIO, SWCLK and GND. The bottom row (NRST, RX, TX, BOOT0) isn\'t used.',
         a:[['dbg',{o:1,x:0},0,500],['w3v',{d:0},400,600],['wio',{d:0},550,600],['wck',{d:0},700,600],['wgd',{d:0},850,600]],ph:[SP.labels,SP.wPcb,SP.wBp]},
        {t:'Pick the file, verify on',d:'In Erasing & programming, browse to the core file. Verify programming on; Skip flash erase before programming off.',
         a:[['tick',{o:1},0,300]],ph:SP.wFile},
        {t:'Connect, then Start Programming',d:'Plug the debugger into the computer, click Connect, then Start Programming.',
         a:[['usb',{d:0},0,800],['bconn',{s:.94},800,200],['bconn',{s:1},1000,200],['bprog',{s:.94},1400,200],['bprog',{s:1},1600,200],['okp',{o:1},2200,400]],ph:SP.wGo},
        {t:'Disconnect, then the screen files',d:'Acknowledge the messages, click Disconnect and unplug the debugger. If you opened the machine, close it up and pass the covers-on checks before it goes back on mains. Then, if they\'re behind, update ui-embedded.bin and ui-web.bin over Wi-Fi (skip the core upload there), and check About.',
         a:[['usb',{d:1},0,600],['okp',{o:0},600,300]],links:[['Over Wi-Fi: the screen files','#fw/ota/6']],chk:[['h1','Cup warmer and funnel earth wires reconnected'],['h5','Inlet earth pin to ST-Link GND pin'],['h6','Inlet L, then inlet N to ST-Link GND pin']]}
      ]
    }};

  /* the hardware scales */
  G.scl={svg:'pg-scl',
    base:{hL:{o:0},hR:{o:0},lcL:{o:0,y:-20},lcR:{o:0,y:-20},adhL:{o:0},adhR:{o:0},scL:{o:0},scR:{o:0},lpL:{o:0},lpR:{o:0},mgL:{o:0},mgR:{o:0},ctr:{o:0},hx:{o:0},strip:{o:0},res:{o:0},wL:{d:1},wR:{d:1},cut:{o:0},cov:{o:0},j8:{d:1},j8l:{o:0},tray:{o:0},clr:{o:0},cal:{o:0},rd:{o:0}},
    steps:{all:[
      {t:'Trim the load cells\' adhesive',d:'There\'s often glue where it shouldn\'t be. With a sharp razor blade, cut it away from the screw holes without nicking a wire or the sensing area.',
       a:[['lcL',{o:1,y:0},0,500],['lcR',{o:1,y:0},100,500],['adhL',{o:1},600,300],['adhR',{o:1},600,300],['adhL',{o:0},1300,500],['adhR',{o:0},1300,500]],ph:SP.sAdh},
      {t:'Load cells into their housings',d:'M3 × 5 mm screws on top hold each cell to its housing; M3 × 4 mm screws underneath hold the flex limiter. The load plate takes one magnetic and one stainless screw, as noted, with a gap all the way round it.',
       a:[['hL',{o:1},0,400],['hR',{o:1},0,400],['scL',{o:1},400,300],['scR',{o:1},400,300],['lpL',{o:1},800,400],['lpR',{o:1},800,400]],ph:SP.sFit},
      {t:'Fit-check the base',d:'The side housings are meant to be a little loose. Slide the board retainer to check the board or boards lock in; if it\'s tight, stop and sand it rather than force it.',
       a:[['lpL',{o:0},0,300],['lpR',{o:0},0,300],['ctr',{o:1},0,400],['hx',{o:1},300,400]],ph:[SP.sChk2,SP.sChkD,SP.sChkF]},
      {t:'Cut the load cell wires',d:'Cut them as the official photos show, leaving extra for strain relief, and keep the offcuts: they wire the stripboard. On the dualScaleBoard, also cut jumper JP11. The FPC board needs no offcuts.',
       a:[['cut',{o:1},0,400]],ph:[SP.sCut2,SP.sCutD,SP.sJp11]},
      {t:'Stripboard',d:'Solder the offcut wires and five right-angle header pins to a small piece of stripboard, plus the 1 kΩ SCK pull-up if you use two HX711 boards. The wire order changed on 2024-05-05 to match the PCB connector (D2, 5V, GND, CLK, D1 on J8); if you built before then, check it before powering up. In the housing the stripboard order looks reversed from the dualScaleBoard: that\'s intended, to line up the wiring to the PCB. The FPC board skips this step.',
       a:[['cut',{o:0},0,300],['strip',{o:1},0,400],['res',{o:1},400,300]],ph:[SP.sStr2,SP.sStrD]},
      {t:'Solder outside the housing',d:'Cut the wires to length, take the boards out to solder them (the housing would melt), then put everything back. The load cell wire colors are printed on the back of the board. On the older green HX711 boards, a 30 AWG jumper from E- to GND steadies the readings. On the FPC board, lift the lever, push the flat cable fully in (contacts down) and close the lever. Slide the center cover on and fix it with the two self-tapping screws.',
       a:[['wL',{d:0},0,900],['wR',{d:0},200,900],['cov',{o:1},1200,400]],ph:[SP.sDone2,SP.sDoneD,SP.sDoneF]},
      {t:'Magnets',d:'First make sure every bottom surface is smooth and free of print debris. Glue the magnets in with gap-filling cyanoacrylate, two small drops on the pocket wall below the surface. Flush or just below on every part except the load plates. Match their poles to the drip tray\'s so it snaps on: do the load plates last, holding each against the tray first.',
       a:[['lpL',{o:1},0,300],['lpR',{o:1},0,300],['mgL',{o:1},300,400],['mgR',{o:1},300,400]],ph:[SP.sMag,SP.sMag2]},
      {t:'Prepare the drip tray',d:'Pro family tray: cut its sides as the official photo marks, for clearance to the load cell housings, then slide the adapters on (labeled F, and L or R as you face the machine) until they seat under the tray\'s top. Classic or low-profile tray: push the spacers fully into the adapter, flat side down.',
       a:[],ph:[[SP.sTrayCut,'fam:GCP'],[SP.sTrayAd,'fam:GCP'],[SP.sSpacer,'fam:GC']]},
      {t:'Cable to J8',d:'600 mm or more of 26 AWG: cut the latches off a 5-pin JST-XH plug for the scales end and crimp a JST-PH at the PCB end. (FPC board: route the flat cable instead, and stick the FPC-to-JST board near the PCB with 80 °C double-sided tape.) Run it inside behind the water tank, or out and back in through a vent, with slack so the scales can come out. Sleeve it where it passes the housing, keep the tank from rubbing the tray, and keep it away from mains wires.',
       a:[['j8',{d:0},0,1400],['j8l',{o:1},1200,400]],ph:[SP.sXH,SP.sRoute,'https://github.com/GAGGIUINO/gaggiuino.github.io/assets/117388662/8edae9b9-3c1d-4d68-accf-dd20d7e242df'],links:[['J8 on the board labels','https://gaggiuino.github.io/schematics/stm32_pcbv3_1_board_labels.png']]},
      {t:'Check the fit',d:'In the machine: the side housings parallel to each other and the machine\'s sides; the tray or adapter snapping on magnetically with even gaps, touching neither the sides nor the tank; and at least 0.5 mm clearance under its front lip and at the sides.',
       a:[['tray',{o:1},0,500],['clr',{o:1},400,400]],ph:[SP.sPar,SP.sSnap,SP.sClr]},
      {t:'Calibrate: find each cell',d:'In the web UI, Settings, Scales: enable hardware scales, turn the other scale types off, and open Calibrate. Take both load plates off, noting which screws are the magnetic ones, and detach the side housings from the center one for room. Set both factors to 2500 and wait for Updated running settings; press each cell gently and note its sign. Set factor 2 to -2500 and press again: the cell whose sign stayed the same is LC1. Mark the cells, and adjust signs so both read positive.',
       a:[['tray',{o:0},0,300],['clr',{o:0},0,300],['lpL',{o:0},0,300],['lpR',{o:0},0,300],['rd',{o:1},300,400]],ph:[SP.sPlates,SP.s2500,SP.sSign]},
      {t:'Calibrate: weigh something known',d:'Weigh a flat-bottomed 200 to 400 g object (a tamper works) on an accurate scale. For each cell: calibration plate on, Tare, object on, then new factor = reported weight × old factor ÷ actual weight. Enter it; it should then read within 0.2 g, or repeat. Do both cells, then Save and wait for Persisted settings.',
       a:[['cal',{o:1},0,500]],count:['rdt',0,312.4,' g',500,1400]},
      {t:'Plates and tray back on',d:'Each screw back where it came from, then the tray. On a stock tray, filing about 2 mm off the 3-way valve\'s drain tube, to 130 mm, makes the tray easier to take out.',
       a:[['cal',{o:0},0,300],['rd',{o:0},0,300],['lpL',{o:1},300,400],['lpR',{o:1},300,400],['tray',{o:1},700,500]],ph:SP.sDoneT},
      {t:'Close it up',d:'If you opened the machine to run the cable, funnel and cup warmer back on with their earth wires, and pass the covers-on checks, before it goes back on mains.',a:[],chk:[['h1','Cup warmer and funnel earth wires reconnected'],['h2','Inlet earth pin to cup warmer plate']]}
    ]}};

  /* ---------------- the Shelly smart relay (an unofficial add-on, shown once it's chosen in Your Gaggia) ---------------- */
  G.shl={svg:'pg-shl',mpath:'CW',
    base:{sc1:{o:1},sc2:{o:0},sc3:{o:0},sc4:{o:0},sc5:{o:0},k1o:{o:0},k1sw:{o:0},k1ln:{o:0},k1mini:{o:0},
      encl:{o:0},grom:{o:0},shl:{o:0},sock:{y:-100},s6:{o:0},pig:{o:0},pigt:{o:0},hot:{o:0},
      w1:{d:1},w1t:{o:0},w2:{d:1},w2t:{o:0},w3:{d:1},w3t:{o:0},w4:{d:1},w4t:{o:0},ac1:{d:1},ac1t:{o:0},nn:{d:1},nnt:{o:0},g1:{d:1},g1t:{o:0},ac23:{d:1},ac23t:{o:0},
      strip:{o:0},fer:{o:0},jaw:{o:0,s:1.3},blk:{o:0},tq:{o:0},tug:{o:0},st1:{o:0},st2:{o:0},st3:{o:0},st4:{o:0}},
    steps:{all:[
      {t:'Pick the Shelly',d:['A Shelly 1PM Gen4: it switches 16 A and reports the power the machine draws. In North America, the UL-certified version, rated 15 A. Not a Mini: those switch 8 A.',['A 120 V Pro draws about 12 A.','volts:120'],
          'Its relay switches line out on O; SW is its switch input; L and N power it. This site draws the 1PM: a Shelly 1\'s relay is a dry contact and needs different wiring.'],
       a:[['k1o',{o:1},200,300],['k1sw',{o:1},500,300],['k1ln',{o:1},800,300],['k1mini',{o:1},1200,400]]},
      {t:'Plan where it goes',d:'Shelly rates it for 40 °C around it at most, and the inside of the machine runs hotter. So it goes outside, in an enclosure that takes the socket\'s place at the socket hole, as fusio built his. His printed enclosures are on MakerWorld: one for the socket alone, and one with an EMI filter, whose rating you should check, since a 120 V Pro draws about 12 A. Order the print if you have no printer; this site suggests a heat-tolerant material rather than PLA. Shelly also warns that a confined space can warm it past its limit, so you\'ll watch its temperature in the app at first power-on.',
       a:[['sc1',{o:0},0,400],['sc2',{o:1},300,500],['encl',{o:1},800,500],['shl',{o:1},1200,400]],map:[['The enclosure on the wiring map','part:encl']]},
      {t:'Move the socket into the enclosure',d:'Unplugged, take the socket out of the back panel and mount it in the enclosure beside the Shelly. The wires into the machine pass through the old socket hole: fit a grommet or sleeve so the sheet-metal edge can\'t cut them, and tie them so nothing pulls on a terminal.',
       a:[['sock',{y:0},0,1300],['grom',{o:1},1100,400]]},
      {t:'Line: socket L to the Shelly\'s L',d:'SH1 from the socket\'s L tab to L, in a two-wire spade on the tab with AC1. AC1 still runs to power switch spade 5, but now it only carries the switch\'s signal to the Shelly.',
       a:[['w1',{d:0},0,900],['w1t',{o:1},700,300],['ac1',{d:0},900,1200],['ac1t',{o:1},1900,300]],map:[['SH1 and AC1 on the wiring map','runs:SH1,AC1']]},
      {t:'Neutral: a piggyback for the Shelly',d:'A piggyback spade on the socket\'s N tab, with SH2 crimped into it, runs to the Shelly\'s N. The neutral pair\'s two-wire spade plugs onto the piggyback\'s tab, so the machine\'s neutral never runs through the Shelly: Shelly\'s own docs warn against using its L and N terminals as a bridge, which doubles the current through them and can overheat it. G1 stays on the earth pin.',
       a:[['pig',{o:1},0,300],['pigt',{o:1},0,300],['w2',{d:0},300,900],['w2t',{o:1},1000,300],['nn',{d:0},1200,900],['nnt',{o:1},1900,300],['g1',{d:0},2100,700],['g1t',{o:1},2600,300]],map:[['SH2 on the wiring map','run:SH2']]},
      {t:'Switch: spade 4 to SW',d:'SH4 from power switch spade 4, where AC2 and AC3 used to be, to the Shelly\'s SW. With the switch on, it carries mains to SW. Everything shaded stays live whenever the cord is in, even with the machine off: the socket, the Shelly, the power switch and their wires.',
       a:[['w4',{d:0},0,1500],['w4t',{o:1},1300,300],['hot',{o:1},1800,500]],map:[['SH4 on the wiring map','run:SH4']]},
      {t:'Output: O to splice S6',d:'SH3 from the Shelly\'s O to a BN2 splice by the power switch, S6, its stripped end folded back to fill the barrel, with AC2 and AC3 crimped into the other side, where they used to share spade 4. Everything after S6 is off while the Shelly is off.',
       a:[['hot',{o:0},0,300],['s6',{o:1},200,300],['w3',{d:0},400,1300],['w3t',{o:1},1500,300],['ac23',{d:0},1700,700],['ac23t',{o:1},2300,300]],map:[['SH3 and splice S6 on the wiring map','runs:SH3,AC2,AC3']]},
      {t:'Ferrules in the screw terminals',d:'Strip 6 mm, which suits both of Shelly\'s figures (6 to 7 mm for the 1PM Gen4, 5 to 6 mm for the Plus 1PM UL), and crimp a ferrule with a 6 mm sleeve on each wire end that goes into the Shelly, so no fine strand escapes the clamp. Push it fully in, tighten the screw (Shelly gives 0.4 Nm at most) and tug. Nothing else goes on the Shelly\'s terminals.',
       a:[['sc2',{o:0},0,400],['sc3',{o:1},300,400],['strip',{o:1},700,400],['fer',{o:1},1300,500],['jaw',{o:1},1900,300],['jaw',{s:1},2200,400],['blk',{o:1},2800,500],['tq',{o:1},3300,300],['tug',{o:1},3700,300]]},
      {t:'Check it with the meter',d:'Unplugged, the power-on checks add the Shelly\'s own: e30 to e35 for its paths, d8 to d10 for shorts on the switched side and h7 with the covers on. Inlet L to J11 no longer reads low: the relay is open while the Shelly has no power, so the switched side is checked from its O terminal.',
       a:[['sc3',{o:0},0,300],['sc4',{o:1},200,400]],chk:[['e30','Inlet L ↔ Shelly L terminal'],['e31','Shelly O terminal ↔ PCB J11 spade'],['e32','Inlet L ↔ PCB J11 spade, through the open relay'],['d10','Shelly O terminal ↔ inlet N']]},
      {t:'Set it up at first power-on',d:'Plug in with the power switch off: the machine stays dark. In the Shelly app, join it to your Wi-Fi and update it. Input mode Switch, output type Toggle Switch, for a power switch that latches; Button for one that springs back. Not Edge Switch: with it, flipping the rocker to off can turn the machine on. Action on power on: Turn OFF, so a power cut never starts it by itself. Auto off, if you want it, turns it off a set time after it comes on, used or not. Then watch its temperature in the app through a long heat-up and a steaming session.',
       a:[['sc4',{o:0},0,300],['sc5',{o:1},200,400],['st1',{o:1},600,300],['st2',{o:1},900,300],['st3',{o:1},1200,300],['st4',{o:1},1500,300]],links:[['Runbook, phase 5','runbook.html#p5s2']]}
    ]}};
