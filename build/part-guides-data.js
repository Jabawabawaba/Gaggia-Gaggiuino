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

