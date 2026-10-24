  /* ---------- Barista school: the Gaggia's words, recipes, routines, lessons and care ----------
     Everything school.js needs that's particular to the Gaggia: what the lamps mean, the surfing routines that go with
     them, the lessons, Gaggia's own cleaning and descaling steps, and the sources for each.
     Sources: Gaggia's manuals (Classic 2019, Evo Pro, E24 US 2024 and 2026), its service manual and E24 page; Whole
     Latte Love's E24 review; Kaffeemacher's E24 test (Scace 2); Coffee Kev's surfing routine; home-barista and
     Coffee Forums threads; Barista Hustle, Clive, Seattle Coffee Gear, La Marzocco Home and others for the recipes,
     milk and water. The page's Sources section lists them with links. */
  var SCHOOL=(function(){
    var K=SIM.K,E=SIM.E;
    function gc(){return K.gc}
    function lampName(){return gc()?'the brew rocker\'s light':'the brew lamp'}
    function Lamp(){var l=lampName();return l.charAt(0).toUpperCase()+l.slice(1)}
    function sLamp(){return gc()?'the brew rocker\'s light':'the steam lamp'}
    function mname(){var p=prof(),m=GM();return p.model?(m&&m.name()?'Gaggia '+m.name():'Gaggia'):'Gaggia Classic Pro E24'}
    /* after steaming, a cupful (about 150 ml) through the group with the portafilter out, as Gaggia's manual says;
       the brass E24 then needs a longer wait than the aluminum boilers (see SURF) */
    var CUP=140;
    /* the surfing figures for the machine picked, from this page's simulation, tuned to the measurements on the cards.
       Brass (E24): brewed straight after flushing until the hissing stops, Kaffeemacher measured about 91 °C, the dark
       band of their own table; a rest of 45 s to a minute after the flush lets the element bring the fresh water up for medium;
       light beans get only a short flush (1 s at 120 V, half a second at 230 V). Aluminum (Classic Pro, Evo Pro, original Classic) runs hotter, so
       medium is a flush a second past the hissing (two on the hotter-running Evo Pro), dark is Kaffeemacher's New
       Classic routine (a 10 s flush and a 45 s rest) and light waits for the lamp after the flush. After steaming,
       Gaggia's cupful, then about a minute and a half on the aluminum boilers and about three minutes on the E24
       (from 100 to 180 ml that lands 92 to 93.5 °C at 120 V; a smaller flush swings with the amount run). The steam
       boost follows Coffee Kev with a fixed flush first (on the E24 2 s at 120 V, 1 s at 230 V); it lands in the light band, not above it. */
    /* the US Evo Pro's 9-bar valve slows the flow and runs it about a degree hotter, so it flushes a second longer;
       at 230 V the E24's element is weaker, so its medium rest runs to a minute and its light and boost flushes are
       shorter (in the simulation the 120 V flushes landed on the light band's bottom edge at 230 V) */
    function SURF(){var b=!!K.e24,hv=prof().volts===230,slow=!b&&K.opv<10;return {b:b,medExtra:b?0:(slow?2:1),lightExtra:slow?1:0,boostExtra:b?0:(slow?3:2),rest:hv?60:45,boost:hv?'3 to 4':'about 5',after:b?'about three minutes':'about a minute and a half',afterS:b?180:90,lightF:hv?0.5:1,boostF:hv?1:2}}
    function fsec(x){return x<1?'for about half a second':'about '+x+' s'}
    var X={
      key:'gaggia',
      /* the light the routines go by: the brew lamp, or on the original Classic the brew rocker's light. Both light
         when the element switches off, at about 107 °C on the boiler wall, and go out while it heats. */
      indicator:function(s){return gc()?!!s.lamp.brew:!!(s.steam?s.lamp.steam:s.lamp.brew)},
      lampKey:'BREW LAMP',
      lampShort:function(on){return (gc()?'brew rocker light':'brew lamp')+(on?' on':' off')},
      /* the sentences the coach builds around the ready light */
      phrase:function(k){var g=gc(),L=g?'the brew rocker\'s light':'the brew lamp',S=g?'the brew rocker\'s light':'the steam lamp';
        return {lamp:L,steamWaited:'Waited for '+S+(g?' with steam on.':'.'),steamEarly:'Started before '+S+' came on'+(g?' with steam on.':'.'),
          steamWait:'After switching steam on, wait for '+S+'.',back:(g?'The brew rocker\'s light':'The brew lamp')+' is back: ready for the next shot.'}[k]},
      readyNow:function(s){return E.ready(s)},
      heatingWords:'element on, '+'lamp out',
      idleWords:'Element off, coasting',
      cue:{heatOn:'the brew lamp went out',heatOff:'the brew lamp came on'},
      /* heat-soaked: the group (fast on the aluminum boilers, slower on the brass E24) and the portafilter, which
         Kaffeemacher found at 65 to 70 °C after 15 minutes; a portafilter out for a minute while you dose loses a few degrees */
      warm:{get group(){return K.e24?80:95},pf:55,soak:64},
      /* the Eco board's auto-off: only on 230 V Pro-family machines that have it (machine.js eco) */
      warmAdvice:function(){var p=prof(),m=GM(),e=m&&m.eco?m.eco():null;
        return 'Give it about 15 minutes from cold with the empty portafilter locked in (use 20× here), and run about 150 ml through the empty portafilter before the first shot: that is Gaggia\'s own first-coffee step.'+
          (e===true?' Your Eco board switches the machine off after 20 idle minutes; this simulation doesn\'t.':e===null&&p.volts===230&&p.model!=='GC'?' 230 V Pro-family machines with the Eco board switch themselves off after 20 idle minutes; this simulation doesn\'t.':'')},
      stretchMax:37,
      /* how long to blow the wand out after the milk: Gaggia's care steps */
      purgeAfter:'a second or two',
      /* the backflush hint on the cleaning panel: Gaggia's E24 manual (2026) for the cleaner, common practice for plain water */
      bfHint:function(det){return det?'Blind basket with cleaner: brew on for about 5 s, then off for about 30 s, at least 10 times (Gaggia), then at least 10 more with plain water.':'Blind basket in: brew on for about 5 s, off for about 10 s, five times or so. That is a plain-water backflush.'},
      pourWithin:300,
      twoWorkflow:'Pull both shots, then steam once for both and pour straight away. The crema fades within a minute or so, but the shots taste fine for several minutes.',
      waterDefault:'tap',
      waters:[{v:'tap',label:'Tap water: descale every 2 months'},{v:'filtered',label:'Purified or bottled: every 2 to 3 months'}],
      milk:{1:{m:150,cap:350},2:{m:280,cap:600}},
      drinks:{
        flat:{name:'Flat white',plural:'flat whites',foam:[8,25],note:'a thin layer of microfoam, about 5 mm in the cup'},
        latte:{name:'Latte',plural:'lattes',foam:[18,35],note:'a thin, silky layer of foam, a little more than a flat white'},
        capp:{name:'Cappuccino',plural:'cappuccinos',foam:[40,70],note:'a glossy cap of at least 10 mm'}
      },
      /* the bands are Kaffeemacher's espresso temperature table (dark 90 to 93 °C, medium-light 92 to 94, light 93 to
         96); Complete Home Barista's figures sit inside them, Clive's dark-roast one a degree above */
      recipes:{
        light:{name:'Light',T:[93,96],ratio:[2.2,3,2.5],time:[27,35],EY:[20,23.5],TDS:[7,10.5],grind:7,grindWord:'Finer',aim:'Sweet and bright, not sour'},
        medium:{name:'Medium',T:[92,94],ratio:[1.8,2.3,2],time:[25,31],EY:[18.5,22],TDS:[8,11.5],grind:10,grindWord:'Middle',aim:'Sweet and balanced'},
        dark:{name:'Dark',T:[90,93],ratio:[1.5,2,1.8],time:[22,28],EY:[17,20.5],TDS:[9,12.5],grind:12,grindWord:'Coarser',aim:'Rich and sweet, not ashy'}
      },
      descaler:{fillLabel:'Empty the tank, add half a bottle of Gaggia descaler, top up',ml:2100},
      controls:function(){
        var g=gc();
        return {
          pwr:['Power',g?'The left rocker. Switches the machine on; it lights while the machine is on.':'The left rocker. Switches the machine on; the lamp under it shows power.'],
          brew:['Brew',(g?'The right-hand rocker. ':'The middle rocker. ')+'Runs the pump and opens the 3-way valve, so water goes through the group. Switched off, the valve drops shut and vents the pressure over the puck into the drip tray.'],
          steam:['Steam',(g?'The wide rocker in the middle. ':'The right rocker. ')+'Lets the boiler heat up to steam temperature, about 145 °C on the wall. While it\'s on, the 3-way valve stays shut, so brew can\'t reach the group; with the knob open, brew sends water out of the wand instead.'],
          lamps:['The lamps',g?'The brew rocker lights when the element switches off: at brew temperature, or at steam temperature with steam on. It goes out each time the element comes back on.':'The lamp under brew lights when the element switches off, with the boiler wall at about 107 °C, and goes out while it heats. The steam lamp does the same at about 145 °C.'],
          knob:['Steam knob','On the right side. Opens the steam valve to the wand. With steam ready it gives steam; from a full boiler the first second or two is water.'],
          pf:['Portafilter','Tap it to take it out and tap its handle to lock it in. Never force it out while there\'s pressure in the group. Tap the basket to knock out a spent puck.'],
          cup:['Cup and scale','Tap the cup to move it between the warmer on top and the scale on the drip tray.'],
          jug:['Milk jug','Tap it to put it under the wand or take it away; the Milk tab sets how deep the tip sits.'],
          tank:['Tank and drip tray','Tap the tank in the inside view to refill it; tap the drip tray to empty it.']
        };
      },
      /* after steaming: Gaggia's cupful through the group, then a wait (longer on the brass E24: this page's estimate) */
      refill:{
        get short(){return 'Switch steam off, take the portafilter out, put a cup on the drip tray and switch brew on until the cup is full: that refills the boiler and brings it down from steam temperature (Gaggia\'s own step). Then give it '+SURF().after+(SURF().b?' (this page\'s estimate for the brass E24)':'')+'.'},
        get now(){return 'Then switch steam off and run a cupful of water through the group with the portafilter out (Gaggia\'s step): it refills the boiler and brings it down from steam temperature. Give it '+SURF().after+' before the next shot.'}
      },
      knobColdBetter:'Switch steam on and wait for the steam lamp. For hot water, Gaggia says: knob open, then brew and steam on together, for no more than 60 s.',
      primeBetter:'Refill the tank, then prime: open the knob and switch brew on until water flows from the wand, then switch brew off and close the knob (Gaggia\'s "loading the circuit").'
    };
    /* where on the wave the shot started, in the lamp's terms */
    X.surfNote=function(c,res,R0){
      var w,L=lampName();
      if(c.afterSteam!=null&&c.afterSteam<300&&c.tw0>108)w='Started soon after steaming, with the boiler still above brew temperature.';
      else if(c.afterSteam!=null&&c.afterSteam<40&&c.steamFor!=null&&c.steamFor<15)w='Started '+Math.round(c.afterSteam)+' s after a '+Math.round(c.steamFor)+' s steam boost.';
      else if(c.flushBefore&&c.flushBefore.t1>c.t0-25)w='Started '+Math.round(c.t0-c.flushBefore.t1)+' s after a '+Math.round(c.flushBefore.secs)+' s flush'+(c.heat?', with the element heating':'')+'.';
      else if(c.heat)w='Started while the element was heating ('+L+' out'+(c.sinceHeat!=null?', '+Math.round(c.sinceHeat)+' s in':'')+').';
      else if(c.sinceOn!=null)w='Started '+Math.round(c.sinceOn)+' s after '+L+' came on'+(c.sinceOn<10?': near the top of the wave, with the water still hot from the idle.':c.sinceOn<35?': on the way down from the peak.':': low on the wave, just before the element comes back on.');
      else w='Started '+(c.ready?'with '+L+' on':'before '+L+' first came on')+'.';
      if(c.idleFor!=null&&c.idleFor>150&&!(c.flushBefore&&c.flushBefore.t1>c.t0-25))w+=' Nothing had been drawn for '+Math.round(c.idleFor/60)+' min, so the first water out was the hottest.';
      if(c.fc&&c.fc.Tq)w+=' The forecast said '+(Math.round(c.fc.Tq*10)/10).toFixed(1)+' °C.';
      return w;
    };
    /* which way to surf next time, for the routines this machine uses (directions from the simulation and the sources
       on the routine cards: a longer flush cools, a wait for the element heats) */
    X.tempAdvice=function(dir,roast){
      var L=lampName(),b=SURF().b;
      if(dir==='cool'){
        if(roast==='light')return b?'For a hotter shot: flush less, or not at all (Kaffeemacher measured 95.8 °C with no flush).':'For a hotter shot: stop the flush as soon as the hissing stops, and brew as soon as '+L+' comes back on.';
        if(roast==='dark')return b?'For a hotter shot: stop the flush as soon as the hissing stops and brew straight away.':'For a hotter shot: rest a little longer after the 10 s flush, about a minute.';
        return b?'For a hotter shot: rest a little longer after the flush, up to a minute.':'For a hotter shot: stop the flush as soon as the hissing stops and brew straight away.';
      }
      if(roast==='light')return b?'For a cooler shot: flush a second or two longer.':'For a cooler shot: flush a second longer before you wait for '+L+'.';
      if(roast==='dark')return b?'For a cooler shot: flush a second or two past the point where the hissing stops, then brew straight away.':'For a cooler shot: a shorter rest after the 10 s flush, about 30 s.';
      return b?'For a cooler shot: a shorter rest after the flush, or brew straight after it.':'For a cooler shot: flush a couple of seconds longer past the hissing.';
    };
    X.onShotStart=function(s,c,slip){
      if(s.steam&&!s.knob&&c.dosed)slip('brew-steam','Brew with steam on','With steam on, the 3-way valve stays shut, so nothing reached the group: the pump just pushed against the over-pressure valve.',['brew','steam','lamps'],'Switch steam off before brewing, and get back to brew temperature first.');
    };
    X.adapt=function(){
      var pl=$('bs-plate');if(pl)pl.textContent=mname();
      var nm=$('bs-name');if(nm)nm.textContent=mname().replace(/^Gaggia /,'Gaggia ');
      var mn=$('bs-mname');if(mn){var p=prof();mn.textContent=mname().replace(/^Gaggia /,'')+(p.volts?', '+p.volts+' V':', 120 V')}
    };

    /* ---------- the surfing routines ---------- */
    X.intro={
      surf:function(){return '<p><b>The lamp first.</b> '+Lamp()+' lights when the element switches <em>off</em>: the boiler wall has reached about 107 °C, Gaggia\'s rating for the brew thermostat. It goes out while the element heats. Some popular guides say the opposite; Gaggia\'s wiring diagrams, its manual and Whole Latte Love\'s E24 test all agree with this. The wall keeps rising for a few seconds after the lamp comes on, and the water lags behind it.</p>'+
        '<p><b>The idle water is the hot part.</b> A warm machine left alone holds water above 100 °C in the boiler, so the first water out of the group spits and hisses. Kaffeemacher\'s E24 test with a Scace thermometer in the portafilter found the first shot after a 15-minute warm-up at 95.8 °C with little or no flush; four more pulled a minute apart fell to 88.2 °C. Their fix: flush 7 to 8 s, until it no longer hisses, before the first shot, then wait 1.5 to 2 minutes between shots and flush just 1 to 2 s. Five shots that way ran 90.1 to 92.3 °C, about 91 °C, and the fifth moved only 0.44 °C through the shot. That is the lever: the less you flush, the more of the idle heat the shot keeps.</p>'+
        '<p><b>The brass E24 runs cooler than the aluminum Pro and Evo.</b> It holds more water (about 109 ml against 74 ml), and in Kaffeemacher\'s tests it came back slowly after each shot. Brewed with no flush, they measured 95.8 °C on the E24 and over 98 °C on the aluminum New Classic. So the routines differ: on the E24, Kaffeemacher\'s flush and go lands in the dark-roast band, and in this page\'s simulation medium wants a rest of 45 s to a minute after the flush, while on the aluminum boilers a flush and go is medium. The routines below follow the model you pick in Your Gaggia.</p>'+
        '<p class="fine">The simulation is tuned to those published measurements, not measured on your machine. It matches Kaffeemacher\'s first three unflushed shots and their flushed routine within about half a degree, but its hissing stops after about 3 s of flushing where theirs took 7 to 8. Use it to learn the pattern, then let your own cups decide.</p>'}
    };
    X.routines=function(){
      var S0=SURF(),L=lampName(),b=S0.b;
      return [
      b?
      {id:'flushrest',roast:'medium',name:'Flush and rest',tag:'Medium, everyday',lesson:'medium',
        why:'The brass E24 gives up a lot of heat in a flush and takes a while to bring the fresh water back up. Give it a moment before you brew.',
        steps:['Warm up about 15 minutes with the empty portafilter locked in.','Take the portafilter out and run water through the group until the hissing and spitting stop.','Dose and tamp, so about '+S0.rest+' s pass while the element heats the fresh water.','Lock in and start the shot.','For the next shot, wait at least a minute and a half (Kaffeemacher found a minute too short on the E24), then the same again.'],
        wave:'The flush pulls the boiler down off its idle high; in the rest the element brings the fresh water partway back up.',
        src:'Brewed straight after the flush, Kaffeemacher measured about 91 °C on an E24 (see Dark). The '+S0.rest+' s rest is this page\'s estimate from the simulation, about 93 °C, so taste and adjust.'}:
      {id:'flushgo',roast:'medium',name:'Flush and go',tag:'Medium, everyday',lesson:'medium',
        why:'A simple, repeatable routine on the aluminum boilers: it throws away the water that sat too hot in the boiler and brews straight after.',
        steps:['Warm up about 15 minutes with the empty portafilter locked in.','Dose and tamp, so the portafilter is ready.','Run water through the group until the hissing and spitting stop, then '+S0.medExtra+' s more.','Lock in and start the shot straight away.','For the next shot, wait a minute or two and repeat.'],
        wave:'The flush pulls the boiler down off its idle high; the element comes on, and the shot runs on fresh water heated as it goes.',
        src:'Whole Latte Love\'s Silvia review for the direction: a longer flush gives a cooler shot, a shorter one a hotter shot. The extra '+(S0.medExtra>1?S0.medExtra+' seconds':'second')+' is this page\'s estimate from the simulation, about 93 °C, so taste and adjust.'},
      b?
      {id:'kaffeemacher',roast:'dark',name:'Flush and go',tag:'Dark',lesson:'dark',
        why:'Kaffeemacher\'s measured routine for the E24. It lands at about 91 °C, inside the dark-roast band of their own table, so dark beans don\'t turn ashy.',
        steps:['Dose and tamp first.','Take the portafilter out and flush until it no longer hisses: Kaffeemacher needed 7 to 8 s on a machine warmed for 15 minutes.','Lock in and brew straight away; stop around 1:1.8.','For the next shot, wait at least 1.5 to 2 minutes, then flush just 1 to 2 s and brew.'],
        wave:'The flush throws away the water that sat above 100 °C; the shot runs on fresh water heated as it goes.',
        src:'Kaffeemacher\'s E24 test with a Scace: 91.5 °C for the first shot that way, and 90.1 to 92.3 °C for the next four with 1.5 to 2 minutes and a 1 to 2 s flush between. This page\'s simulation gives about 92 °C.'}:
      {id:'longrest',roast:'dark',name:'Long flush and rest',tag:'Dark',lesson:'dark',
        why:'Kaffeemacher\'s routine for the aluminum New Classic: a long flush, then a short rest while you dose. In this page\'s simulation it runs one to two degrees cooler than Flush and go, which suits dark beans.',
        steps:['Take the portafilter out and flush 10 s.','Dose and tamp in the next 45 s or so.','Lock in and brew; stop around 1:1.8.','For a second shot straight after: flush 2 s and brew about 45 s later (Kaffeemacher). After a longer break, or if it tastes harsh, start again with the 10 s flush.'],
        wave:'The long flush leaves the boiler full of fresh water; in the rest the element brings it partway back.',
        src:'Kaffeemacher\'s New Classic test: 92 to 93 °C with a 10 s flush and a 45 s wait, then a 2 s flush for the shots that follow. They name no roast. This page\'s simulation gives about 91 °C for the first shot and 92 to 93 °C for the next ones, the top of the dark band.'},
      b?
      {id:'short',roast:'light',name:'Short flush',tag:'Light',lesson:'light',
        why:'Light roasts are dense and hard to extract, so they want the hottest water the machine gives without boiling at the group. On the E24 that is nearly the idle water: clear only the first spit.',
        steps:['Leave the warm machine alone for a few minutes, then dose and tamp.','Take the portafilter out and flush '+fsec(S0.lightF)+': just the first spit.','Lock in and start the shot straight away.','Stop around 1:2.5, and grind finer than for darker beans.'],
        wave:'The shot starts on water that sat at the idle high, minus the part that flashes to steam.',
        watch:'With no flush at all, Kaffeemacher measured 95.8 °C for an E24\'s first shot: the top of the band. In this page\'s simulation each extra second of flush takes about a degree and a half off.',
        src:'Kaffeemacher\'s Scace test for the unflushed shot; the '+(S0.lightF<1?'half second':'1 s')+' is this page\'s estimate from the simulation, about 95 °C.'}:
      {id:'lamp',roast:'light',name:'Flush, then the lamp',tag:'Light',lesson:'light',
        why:'Light roasts are dense and hard to extract, so they want the hottest water the machine gives without boiling at the group. After the flush, let the element top the boiler up first.',
        steps:['Dose and tamp first.','Flush until the hissing stops'+(S0.lightExtra?', then '+S0.lightExtra+' s more':'')+': '+L+' goes out as the element comes on.','Wait for it to come back on, then lock in and start the shot within a few seconds. If it never went out, brew straight away.','Stop around 1:2.5, and grind finer than for darker beans.'],
        wave:'With the lamp back on, the element has just finished heating: the boiler is at the top of its wave.',
        watch:'Don\'t brew at the lamp with no flush at all: on the earlier New Classic that gave over 98 °C.',
        src:'Kaffeemacher\'s New Classic test for the unflushed shot; the routine is this page\'s estimate from the simulation, about 95 °C.'},
      {id:'boost',roast:'light',name:'Steam-switch boost',tag:'Light, a second way',lesson:'boost',
        why:(b?'Coffee Kev\'s routine for the Classic, adapted to the E24: just before the shot, give the element a few more seconds with the steam switch, which bypasses the brew thermostat.':'Coffee Kev\'s routine for the Classic: time the shot to the lamp, and give the element a few more seconds with the steam switch, which bypasses the brew thermostat.')+' In this page\'s simulation it lands in the same band as '+(b?'Short flush':'Flush, then the lamp')+': a second way there, not a hotter one.',
        steps:b?['Dose and tamp first.',S0.boostF>1?'Flush about 2 s, just past the first spit, so the E24 keeps most of its idle heat.':'Flush about 1 s: just the first spit, so the E24 keeps its idle heat.','Wait about 10 s, then switch steam on for '+S0.boost+' s, then off.','Wait 3 to 4 s, lock in and brew.']:
          ['Flush until the hissing stops, then '+S0.boostExtra+' s more.','When '+L+' comes back on, wait about 10 s (if it never went out, about 20 s from the flush).','Switch steam on for '+S0.boost+' s, then off.','Wait 3 to 4 s, lock in and brew.'],
        wave:'With steam on, the brew thermostat is bypassed and the element keeps heating; the shot catches the top of the wave.',
        watch:'Never leave steam on during the shot, and don\'t stretch the boost: a long one makes the water flash at the group.',
        src:'Coffee Kev\'s routine (coffeeblog.co.uk): 3 to 4 s of steam at 230 V, about 5 s at 110 to 120 V. He flushes until the lamp goes out; this page uses a fixed flush instead'+(b?' (on the E24 just '+S0.boostF+' s, to keep '+(S0.boostF>1?'most of ':'')+'its idle heat)':'')+', because how long that takes varies with the cycle and so does the shot. An owner on home-barista measured 4 s of steam lifting the boiler wall from about 108 to 116 °C. This page\'s simulation gives about 93 to 95 °C, with the steam adding half a degree to a degree over the same timing without it.'},
      {id:'aftersteam',roast:'any',name:'After steaming',tag:'Any coffee',lesson:'refill',
        why:'Straight after steaming the brew lamp is on, because the wall is above 107 °C, but the water is near steam temperature. Brewing then flashes and scalds.',
        steps:['Switch steam off.','Take the portafilter out and put a cup on the drip tray.','Switch brew on until the cup is full, about 150 ml, then off. It spits and steams at first.','Dose, and give it '+S0.after+' before the next shot.'],
        wave:'The water refills the boiler (steaming uses its water) and drags it down from steam temperature; the wait lets the element bring the fresh water up.',
        src:'Gaggia\'s manuals: "How to lower the boiler temperature" (fill a cup through the group). Kaffeemacher\'s advice after frothing: flush well and wait one to two minutes. Seattle Coffee Gear: "That refill step matters on single boilers, since steaming draws down the water in the boiler." '+(b?'The three minutes is this page\'s estimate for the brass E24 after a full cup, about 93 °C; in its simulation a smaller flush gets there sooner but swings a degree or more with the amount you run.':'The minute and a half is this page\'s estimate from the simulation, about 93 °C.')}
      ];
    };

    /* under the recipe table: what the temperatures mean and where the bands come from */
    X.recipeNote='Temperatures are for the water reaching the coffee, as a Scace thermometer in the portafilter reads it: the number the coach grades. The bands are Kaffeemacher\'s espresso temperature table, read here as the temperature at the coffee, with its medium-light row for medium. Complete Home Barista\'s figures sit inside them; Clive\'s dark-roast figure is about a degree higher. On a stock Gaggia you reach them by surfing, not by a setting.';

    /* ---------- the dial-in cards ---------- */
    X.dial=[
      {h:'Sour, thin, short finish',ul:['Under-extracted: the water didn\'t take enough out.','Grind finer first, one step at a time, keeping the yield the same.','Then try a longer ratio (stop a few grams later).','Then surf hotter: a shorter flush.']},
      {h:'Bitter, dry, ashy or hollow',ul:['Over-extracted, or too hot for the roast.','Grind a step coarser, or stop a few grams sooner.','Then surf cooler: a longer flush.']},
      {h:'Sour and bitter at once, inconsistent',ul:['Channeling: water found a path through the puck.','Fix the puck, not the recipe: break up clumps (a needle tool), level it, tamp level and firm.','Don\'t knock the portafilter after tamping.']},
      {h:'One change at a time',ul:['Weigh the dose to 0.1 g and keep it fixed.','Grind is the main control; ratio next; temperature last.','On a stock machine, temperature means the surf: flush length and timing.','Expect three or four shots to dial in a new bag.']},
      {h:'Baskets',p:'The recipes here are for an 18 g basket, a common upgrade. Gaggia\'s own double basket takes about 14 g: use 14 g and keep the same ratio. The pressurized basket that ships with it is for pre-ground coffee and hides most of what grind and prep do.'}
    ];

    /* ---------- milk ---------- */
    X.milkRef=function(){return '<div class="mr-steps"><h3>Step by step</h3><ol>'+
      '<li>Switch steam on and wait for '+sLamp()+': Gaggia says 15 to 20 s, Whole Latte Love timed about 60 s on an E24.</li>'+
      '<li>Purge the condensed water into the drip tray, then close the knob.</li>'+
      '<li>Cold milk, about 5 °C, in a jug no more than half full: about 150 ml in a 350 ml jug for one drink, 250 to 300 ml in a 600 ml jug for two.</li>'+
      '<li>Tip just under the surface near the edge, knob fully open. A gentle tearing hiss means it\'s drawing air in: about 2 to 4 s for a latte and 4 to 6 s for a cappuccino (Clive), a little less for a flat white, all done by body temperature, about 37 °C, when the jug starts to feel warm.</li>'+
      '<li>Then raise the jug a little so the tip sits under the surface, and tilt it so the milk spins. That folds the bubbles in fine.</li>'+
      '<li>Close the knob at about 60 °C (55 to 65): the thermometer lags 2 to 3 °C and the milk keeps rising. Never past 70.</li>'+
      '<li>Jug away, then purge the wand for a second or two and wipe it straight away.</li>'+
      '<li>Tap, swirl until it looks like wet paint, and pour at once.</li>'+
      '<li>Switch steam off and run a cupful through the group (Gaggia\'s step), then give it '+SURF().after+' before the next shot.</li></ol>'+
      '<p class="fine">Gaggia\'s limit is 60 s of continuous steam; longer can empty the boiler, and then it needs priming ("loading the circuit"). Whole Latte Love heated 148 ml to 60 °C in 24 s on both the E24 and the Evo Pro.</p>'+
      (gc()?'<p class="fine">The original Classic came with a Turbo Frother sleeve on its steam pipe. Gaggia\'s steps for it: tip just under the surface, open the knob slowly, and move the jug in circles as the milk froths, for no more than 60 s. Many owners slide the sleeve off (it pulls off downward for cleaning) and steam with the bare pipe as shown here; that is common practice, not Gaggia\'s.</p>':'')+'</div>'+
      '<div class="mr-side"><div class="mr-box"><h3>How much foam</h3><p><b>Flat white:</b> a thin layer of microfoam, about 5 mm.</p><p><b>Latte:</b> a thin, silky layer, a little more.</p><p><b>Cappuccino:</b> at least 10 mm, glossy.</p><p class="fine">Perfect Daily Grind for the flat white and the cappuccino (the SCA\'s minimum); Clive for the latte.</p></div>'+
      '<div class="mr-box"><h3>Two drinks</h3><p>Most sources say pull both shots first, then steam once for both: the shots keep their flavour for several minutes even as the crema fades. Whole Latte Love prefers steaming first and cooling the boiler before brewing; either works if you refill and cool afterwards.</p><p>For flat whites, a shorter ratio (1:1.5 to 1:2) holds up better in milk.</p></div></div>'};

    /* ---------- the lessons ---------- */
    function idleSince(c){return c.flushes.length?c.t-c.flushes[c.flushes.length-1].t1:c.t}
    function lastFlush(c,since){var f=c.flushes[c.flushes.length-1];return f&&f.t1>=(since==null?c.since:since)?f:null}
    function inBand(r){var R0=X.recipes[r.roast],t=Math.round(r.Tq*10)/10;return t>=R0.T[0]&&t<=R0.T[1]}
    function stars(sc){return sc>=85?3:sc>=65?2:1}
    function shotScore(c,fn){var r=c.lastShot(fn);return r?r:null}
    var DOSED=function(c){return c.s.pf.b==='dosed'&&c.s.pf.prep>=0.99};
    X.lessons=[
      {id:'warm',track:'Get to know it',title:'Warm up properly',time:'4 min',sub:'Why the first lamp doesn\'t mean ready.',
        why:'The brew lamp comes on after a minute or two, but that only means the boiler wall is hot. The group and the portafilter take about a quarter of an hour to catch up, and they cool the first shots until they do. Gaggia\'s own first step is to run water through the empty portafilter.',
        start:{state:'cold',speed:20},
        steps:[
          {t:'The empty portafilter is locked in and a cup is on the warmer, so both heat with the machine.',done:function(c){return c.s.pf.in&&c.s.cup.pos==='warm'},hint:'Tap the portafilter\'s handle to lock it in; tap the cup to move it to the top.'},
          {t:'Switch the power on (the left rocker). Time is running at 20×.',done:function(c){return !!c.s.pwr},hint:'Tap the left rocker on the front of the machine.'},
          {t:function(){return 'Wait for '+lampName()+' to come on for the first time. Watch the map: the boiler line climbs, the group behind it.'},done:function(c){return c.has('lamp-on')},hint:'Under two minutes of machine time.'},
          {t:'Keep waiting until the group and portafilter are heat-soaked, about 15 minutes. The lamp keeps cycling meanwhile.',done:function(c){return c.s.Tg>=X.warm.group&&c.s.Tpf>=X.warm.soak},hint:'Turn on More lines on the map to watch the group and portafilter catch up.'},
          {t:'Run about 150 ml through the empty portafilter into the drip tray (brew on for about 30 s, then off).',done:function(c){return c.count('flush',function(d){return d.pfIn&&d.vol>=110})>0||c.ev('flush',function(d){return d.pfIn&&d.vol>=110})},hint:'Leave the empty portafilter in and switch brew on, then off again after about 30 s.'}
        ],
        score:function(c){var early=c.count('shot',null,0)>0;return {stars:early?2:3,text:early?'Warm. A shot pulled before the group soaked would have run cool; now the group is at '+Math.round(c.s.Tg)+' °C.':'Warm and ready: the group is at '+Math.round(c.s.Tg)+' °C and the portafilter at '+Math.round(c.s.Tpf)+' °C.'}}},
      {id:'wave',track:'Get to know it',title:'Read the temperature wave',time:'3 min',sub:'What the brew lamp is really telling you.',
        why:'Every surfing routine is built on one fact: the lamp lights when the element switches off. Watch a couple of cycles on the map, then see what a flush does to the wave.',
        start:{state:'warm',speed:1},
        steps:[
          {t:function(){return 'Watch '+lampName()+' go out: the element is heating (the amber band on the map).'},done:function(c){return c.has('heat-on')},hint:'Wait for the next cycle: about a minute on an E24.'},
          {t:'Watch it come back on: the element has stopped.',done:function(c){return c.has('heat-off')}},
          {t:'Wait for the boiler line to peak and start coasting down: it keeps rising for a few seconds after the lamp comes on.',done:function(c){return c.phase==='coast'}},
          {t:'Check yourself.',quiz:{id:'lamp',q:'The brew lamp just came on. What is the element doing?',opts:['Heating','Off: the boiler wall reached about 107 °C','Making steam'],a:1,yes:'Right: lamp on means the element just switched off.',no:'Not quite: the lamp lights when the element switches off.'},done:function(c){return c.has('quiz-ok',function(d){return d==='lamp'})}},
          {t:function(){return 'Take the portafilter out and run a flush of about '+(SURF().b?7:5)+' s. Watch the boiler line drop and the lamp go out as the element comes on.'},
            done:function(c){var f=c.ev('flush',function(d){return d.secs>=(SURF().b?5:4)});return !!f&&(c.has('heat-on',function(d,e){return e.t>=f.t-4})||c.t-f.t>20)},hint:'Tap the portafilter to take it out, then brew on and off.'},
          {t:'Check yourself.',quiz:{id:'steam',q:'Right after steaming, the brew lamp is lit. Is the boiler ready for a shot?',opts:['Yes, the lamp says so','No: the water is still near steam temperature, so run water through the group first'],a:1,yes:'Right: the wall is above 107 °C, which lights the lamp, but the water is far too hot.',no:'Not quite: the lamp only says the element is off.'},done:function(c){return c.has('quiz-ok',function(d){return d==='steam'})}}
        ],
        score:function(){return {stars:3,text:'You can read the wave. Everything after this builds on it.'}}},
      {id:'medium',track:'Espresso by roast',title:function(){return SURF().b?'Medium roast: flush and rest':'Medium roast: flush and go'},time:'3 min',sub:function(){return SURF().b?'Let the element catch up.':'A simple, repeatable routine.'},
        why:function(){return SURF().b?'A warm machine holds water above 100 °C in the boiler. Flushing until the hissing stops throws that away; brewed straight after, Kaffeemacher measured about 91 °C on an E24, the dark-roast band. Rest about '+SURF().rest+' s and the element brings the fresh water up to medium.':'A warm machine holds water above 100 °C in the boiler. Flushing until the hissing stops throws that away; '+(SURF().medExtra>1?'on the US Evo Pro, whose 9-bar valve slows the flow, '+SURF().medExtra+' seconds':'on the aluminum boilers a second')+' more lands the shot in the medium band (this page\'s estimate from the simulation).'},
        start:{state:'warm',speed:1,bench:{roast:'medium',D:18},tab:'coffee'},
        steps:[
          {t:'Take the portafilter out.',done:function(c){return !c.s.pf.in},hint:'Tap the portafilter on the machine.'},
          {t:function(){return SURF().b?'Flush the group until the hissing stops.':'Grind and dose 18 g, then distribute and tamp (the Puck buttons in the Coffee tab).'},
            done:function(c){return SURF().b?c.has('flush',function(d){return !d.pfIn&&d.secs>=1&&d.quiet&&d.quietFor<=2.5}):DOSED(c)},
            hint:function(){return SURF().b?'With the portafilter out, switch brew on and watch the group: switch off once the steam puffs stop.':'Three buttons in order: Grind and dose, Distribute, Tamp.'}},
          {t:function(){return SURF().b?'Now grind and dose 18 g, then distribute and tamp (the Puck buttons in the Coffee tab).':'Flush the group until the hissing stops, then '+SURF().medExtra+' s more.'},
            done:function(c){var n=SURF().medExtra;return SURF().b?DOSED(c):c.has('flush',function(d){return !d.pfIn&&d.secs>=1&&d.quiet&&d.quietFor>=n-0.5&&d.quietFor<=n+2.5})},
            hint:function(){return SURF().b?'Three buttons in order: Grind and dose, Distribute, Tamp. The element is heating the fresh water meanwhile.':'With the portafilter out, switch brew on; when the steam puffs stop, count, then off.'}},
          {t:function(){return SURF().b?'About '+SURF().rest+' s after the flush, lock in, cup on the scale, and start the shot.':'Lock in, cup on the scale, and start the shot within 15 s of the flush.'},
            done:function(c){var f=lastFlush(c,0),sh=c.shotNow;if(!sh||!sh.dosed||!f)return false;var w=sh.t0-f.t1;return SURF().b?w>=30&&w<=75:w<=15},
            hint:function(){return SURF().b?'Watch the seconds since the flush on the map.':'Tap the handle to lock in, tap the cup down onto the scale, then brew.'}},
          {t:'Stop at about 36 g on the scale (1:2).',done:function(c){return !!c.lastShot()}}
        ],
        score:function(c){var r=c.lastShot();if(!r)return {stars:1,text:'No shot.'};var ok=inBand(r);return {stars:Math.min(stars(r.taste.score),ok?3:2),text:(ok?'In the band: ':'Outside the band: ')+r.Tq.toFixed(1)+' °C at the puck, '+r.taste.word.toLowerCase()+'.'}}},
      {id:'dark',track:'Espresso by roast',title:function(){return SURF().b?'Dark roast: flush and go':'Dark roast: long flush and rest'},time:'3 min',sub:function(){return SURF().b?'Kaffeemacher\'s measured routine.':'A long flush, a short rest.'},
        why:function(){return 'Dark roasts dissolve easily, and hot water pulls out ashy, bitter flavours. Aim for 90 to 93 °C at the puck with a coarser grind and a shorter ratio. '+(SURF().b?'On the E24, flushing until the hissing stops and brewing at once does it: Kaffeemacher measured about 91 °C that way.':'On the aluminum boilers, Kaffeemacher\'s New Classic routine does it: a 10 s flush, then about 45 s while you dose.')},
        start:{state:'warm',speed:1,bench:{roast:'dark',D:18},tab:'coffee'},
        steps:[
          {t:function(){return SURF().b?'Take the portafilter out, then grind, dose, distribute and tamp (the grinder is set coarser for dark beans).':'Take the portafilter out and flush 10 s.'},
            done:function(c){return SURF().b?DOSED(c):c.has('flush',function(d){return !d.pfIn&&d.secs>=8&&d.secs<=13})},
            hint:function(){return SURF().b?'Three buttons in the Coffee tab: Grind and dose, Distribute, Tamp.':'Brew on with the portafilter out, count ten, off.'}},
          {t:function(){return SURF().b?'Flush until the hissing stops.':'Now grind, dose, distribute and tamp (the grinder is set coarser for dark beans).'},
            done:function(c){return SURF().b?c.has('flush',function(d){return !d.pfIn&&d.secs>=1&&d.quiet&&d.quietFor<=2.5}):DOSED(c)},
            hint:function(){return SURF().b?'Brew on with the portafilter out; off as soon as the steam puffs stop.':'No hurry: the boiler is recovering meanwhile.'}},
          {t:function(){return SURF().b?'Lock in and brew within 10 s of the flush.':'About 45 s after the flush, lock in and brew.'},
            done:function(c){var f=lastFlush(c,0),sh=c.shotNow;if(!sh||!sh.dosed||!f)return false;var w=sh.t0-f.t1;return SURF().b?w<=10:w>=30&&w<=75},
            hint:function(){return SURF().b?'Tap the handle to lock in, cup on the scale, brew.':'Watch the seconds since the flush on the map.'}},
          {t:'Stop at about 32 g (1:1.8).',done:function(c){return !!c.lastShot()}}
        ],
        score:function(c){var r=c.lastShot();if(!r)return {stars:1,text:'No shot.'};var ok=inBand(r);return {stars:Math.min(stars(r.taste.score),ok?3:2),text:r.Tq.toFixed(1)+' °C at the puck: '+(ok?'cool enough for dark beans. ':'not in the dark-roast band. ')+r.taste.word+'.'}}},
      {id:'light',track:'Espresso by roast',title:'Light roast: keep the heat',time:'4 min',sub:'The hottest water that doesn\'t flash.',
        why:function(){return 'Light roasts are dense and slow to give up their sweetness; cool water leaves them sour. '+(SURF().b?'On the E24 a flush '+fsec(SURF().lightF)+', just the first spit, keeps the shot near 95 °C (this page\'s estimate).':'Flush, let the element top the boiler up, and brew as '+lampName()+' comes back on.')+' Grind finer, too.'},
        start:{state:'warm',speed:1,bench:{roast:'light',D:18},tab:'coffee',mins:28},
        steps:[
          {t:'Take the portafilter out, then grind, dose, distribute and tamp (finer for light beans).',done:DOSED},
          {t:function(){return SURF().b?'Flush '+fsec(SURF().lightF)+' with the portafilter out: only the first spit.':'Flush until the hissing stops'+(SURF().lightExtra?', then '+SURF().lightExtra+' s more.':'.')},
            done:function(c){var n=SURF().lightExtra;return c.has('flush',function(d){return !d.pfIn&&(SURF().b?d.secs>=0.2&&d.secs<=2.2:d.quiet&&d.quietFor>=n-0.5&&d.quietFor<=n+2.5)})},
            hint:function(){return SURF().b?(SURF().lightF<1?'Brew on and straight off again.':'Brew on, count one, off.'):'Brew on with the portafilter out; off as soon as the steam puffs stop.'}},
          {t:function(){return SURF().b?'Lock in and start the shot within 10 s.':'Wait for '+lampName()+' to come back on, then lock in and start the shot within 5 s.'},
            done:function(c){var f=lastFlush(c,0),sh=c.shotNow;if(!sh||!sh.dosed||!f)return false;if(SURF().b)return sh.t0-f.t1<=10;
              /* the usual case: the element came on with the flush and has just stopped; if it never came on, brewing soon counts */
              var cycled=c.heatOnAt!=null&&c.heatOnAt>=f.t0-1;return cycled?(sh.sinceOn!=null&&sh.sinceOn<=6&&!sh.heat&&c.heatOffAt!=null&&c.heatOffAt>f.t1):(!sh.heat&&sh.t0-f.t1<=15)},
            hint:function(){return SURF().b?'Tap the handle to lock in, cup on the scale, brew.':'The lamp strip on the map shows it; the element runs for a few seconds after the flush.'}},
          {t:'Stop at about 45 g (1:2.5).',done:function(c){return !!c.lastShot()}}
        ],
        score:function(c){var r=c.lastShot();if(!r)return {stars:1,text:'No shot.'};var ok=inBand(r);return {stars:Math.min(stars(r.taste.score),ok?3:2),text:r.Tq.toFixed(1)+' °C at the puck: '+(ok?'hot enough for light beans. ':'outside the light-roast band. ')+r.taste.word+'.'}}},
      {id:'boost',track:'Espresso by roast',title:'Light roast: the steam boost',time:'4 min',sub:'Coffee Kev\'s routine, timed with the steam switch.',
        why:function(){return (SURF().b?'Coffee Kev\'s routine, adapted to the E24: keep '+(SURF().boostF>1?'most of ':'')+'the idle heat with a '+SURF().boostF+' s flush, then give the element a few more seconds with the steam switch, which bypasses the brew thermostat.':'Coffee Kev\'s routine: time the shot to the lamp, and give the element a few more seconds with the steam switch, which bypasses the brew thermostat.')+' In this page\'s simulation it lands in the same band as the light-roast lesson: a second way there, not a hotter one.'},
        start:{state:'warm',speed:1,bench:{roast:'light',D:18},tab:'coffee'},
        steps:[
          {t:'Take the portafilter out, then grind, dose, distribute and tamp.',done:DOSED},
          {t:function(){return SURF().b?'Flush about '+SURF().boostF+' s with the portafilter out: '+(SURF().boostF>1?'just past the first spit.':'only the first spit.'):'Flush until the hissing stops, then '+SURF().boostExtra+' s more.'},
            done:function(c){var n=SURF().boostExtra;return c.has('flush',function(d){return !d.pfIn&&(SURF().b?d.secs>=SURF().boostF-0.6&&d.secs<=SURF().boostF+1.2:d.quiet&&d.quietFor>=n-0.5&&d.quietFor<=n+2.5)})},
            hint:function(){return SURF().b?'Brew on, count '+(SURF().boostF>1?'two':'one')+', off.':'Brew on with the portafilter out; count past the last steam puff, then off.'}},
          {t:function(){return SURF().b?'Wait about 10 s, then switch steam on for '+SURF().boost+' s and off.':'When '+lampName()+' comes back on, wait about 10 s, then switch steam on for '+SURF().boost+' s and off.'},done:function(c){var on=c.ev('steam-on'),off=on&&c.ev('steam-off',function(d,e){return e.t>on.t});return !!(on&&off&&off.t-on.t>=2&&off.t-on.t<=8)},hint:'The steam rocker on, count, off.'},
          {t:'Wait 3 to 4 s, lock in and brew; stop at about 45 g.',done:function(c){return !!c.lastShot()}}
        ],
        score:function(c){var r=c.lastShot();if(!r)return {stars:1,text:'No shot.'};var ok=inBand(r);return {stars:Math.min(stars(r.taste.score),ok?3:2),text:r.Tq.toFixed(1)+' °C at the puck. '+r.taste.word+'.'}}},
      {id:'dial',track:'Espresso by roast',title:'Dial in by taste',time:'6 min',sub:'Fix a bad shot in as few tries as you can.',
        why:'A new bag rarely pulls right first time. Taste, change one thing, pull again. Grind first; ratio next; temperature last.',
        start:{state:'warm',speed:1,bench:{roast:'medium',D:18,g:16},tab:'coffee'},
        steps:[
          {t:function(){return 'Pull a medium shot with the grinder where it is ('+(SURF().b?'flush and rest':'flush and go')+'). Read the coach\'s verdict.'},done:function(c){return c.count('shot')>=1}},
          {t:'Change one thing the coach suggests: most likely the grind.',done:function(c){return c.has('grind')||c.has('yield')}},
          {t:'Pull again, and keep going until a shot scores 80 or more.',done:function(c){var r=c.lastShot();return !!r&&r.taste.score>=80&&c.count('shot',null,0)>=2}}
        ],
        score:function(c){var n=c.count('shot',null,0);return {stars:n<=3?3:n<=5?2:1,text:'Dialed in after '+n+' shots.'}}},
      {id:'milk',track:'Milk',title:'Steam silky milk',time:'3 min',sub:'Stretch, then spin, then stop at 60 °C.',
        why:'Silky milk is two steps: a few seconds of air while the milk is cold, then a spin with the tip under the surface to fold the bubbles in. Stop at about 60 °C, where it tastes sweetest.',
        start:{state:'warm',speed:1,bench:{drink:'flat',milk:1},milk:1,tab:'milk'},
        steps:[
          {t:function(){return 'Switch steam on and wait for '+sLamp()+'.'},done:function(c){var on=c.ev('steam-on');return c.s.steam&&c.ready&&!!on&&c.has('heat-off',function(d,e){return e.t>on.t+0.5})},hint:function(){return gc()?'The wide rocker in the middle; then watch the brew rocker\'s light on the right.':'The right rocker; the lamp under it lights at steam temperature.'}},
          {t:'Purge: open the knob with no jug until the water turns to steam, then close it.',done:function(c){return c.has('purge')},hint:'Tap the knob on the right side, then tap it again.'},
          {t:'Put the jug under the wand, tip at the surface, and open the knob.',done:function(c){return c.s.jug.pos==='wand'&&c.s.knob&&c.s.jug.tip==='surf'}},
          {t:'Stretch for a second or two, then sink the tip (Under, spinning) before the milk passes about 37 °C.',done:function(c){return c.s.jug.tip==='sub'&&c.s.jug.airC>2},hint:'Milk tab: Under, spinning. The thermometer is on the jug.'},
          {t:'Close the knob at about 60 °C, then take the jug away.',done:function(c){return c.has('milk')}},
          {t:'Purge the wand for a second or two and wipe it.',done:function(c){return c.has('wand-clean')},hint:'Jug away, knob open briefly, then Wipe the wand.'}
        ],
        score:function(c){var m=c.ev('milk',null,0);var sc=m&&m.d?m.d.score:50;return {stars:stars(sc),text:m?'Milk at '+Math.round(m.d.T)+' °C, stretched '+Math.round(m.d.foam)+'%.':'Done.'}}},
      {id:'refill',track:'Milk',title:'Back to brew temperature',time:'4 min',sub:'The step most people skip.',
        why:function(){return 'Steaming takes the boiler to about 145 °C on the wall and uses up some of its water. The moment you switch steam off the brew lamp lights, but the water is still far too hot: a shot now flashes to steam. Gaggia\'s fix is a cupful through the group; Kaffeemacher adds a wait of one to two minutes.'+(SURF().b?' The brass E24 comes back slowly: in this page\'s simulation it needs about three minutes after a full cup.':'')},
        start:{state:'warm',speed:1,mod:function(s){s.steam=1;s.Tb=146;s.Te=150;s.Tw=140;s.vol=s.vol*0.6;s.brewC=0;s.steamC=0},tab:'coffee'},
        steps:[
          {t:'You\'ve just finished steaming. Switch steam off.',done:function(c){return !c.s.steam}},
          {t:'Check yourself.',quiz:{id:'lamp2',q:'The brew lamp is on now. Can you pull a shot?',opts:['Yes','No: the water is near steam temperature'],a:1,yes:'Right. The lamp only says the element is off.',no:'Not yet: the wall is above 107 °C, so the lamp lights, but the water is far too hot.'},done:function(c){return c.has('quiz-ok',function(d){return d==='lamp2'})}},
          {t:'Take the portafilter out and run a cupful (about 150 ml) through the group. Watch it spit and steam at first.',
            done:function(c){return c.has('flush',function(d){return !d.pfIn&&d.vol>=CUP-10})},
            hint:'Brew on for about 25 s with the portafilter out, then off.'},
          {t:function(){return 'Dose, give it '+SURF().after+', then pull a medium shot.'},done:function(c){return !!c.lastShot()},hint:'Speed time up while you wait; the map shows the boiler coming back.'}
        ],
        score:function(c){var r=c.lastShot();if(!r)return {stars:1,text:'No shot.'};var ok=inBand(r);return {stars:ok?3:r.flash>0.2?1:2,text:r.Tq.toFixed(1)+' °C at the puck'+(r.flash>0.2?': it still flashed.':ok?': back in the band.':'.')}}},
      {id:'two',track:'Milk',title:'Two flat whites',time:'7 min',sub:'The whole routine, start to finish.',
        why:'Two drinks on one boiler: pull both shots, steam once for both, pour, then get the boiler back to brew temperature for next time.',
        start:{state:'warm',speed:1,bench:{roast:'medium',D:18,drink:'flat',milk:2},milk:2,tab:'coffee'},
        steps:[
          {t:function(){return 'Pull the first shot ('+(SURF().b?'flush and rest':'flush and go')+').'},done:function(c){return c.count('shot')>=1}},
          {t:'Set that cup aside (Coffee tab) so a fresh cup sits on the scale.',done:function(c){return c.has('aside')}},
          {t:'Knock out, dose again and pull the second shot the same way.',done:function(c){return c.count('shot')>=1}},
          {t:'Steam about 280 ml of milk for two: stretch briefly, then spin.',done:function(c){return c.has('milk',function(d){return true})&&c.s.jug.m>=250}},
          {t:'Pour into both cups (Milk tab).',done:function(c){return c.has('pour',function(d){return d.n>=2})}},
          {t:'Purge and wipe the wand, switch steam off and run a cupful through the group.',done:function(c){return c.has('wand-clean',null)&&c.has('flush',function(d){return !d.pfIn&&d.vol>=CUP-10})}}
        ],
        score:function(c){var p=c.ev('pour',null,0);var sc=p&&p.d?p.d.score:60;return {stars:stars(sc),text:'Two flat whites, '+(p?p.d.score:'')+' for the pour.'}}},
      {id:'clean',track:'Care',title:'Clean up after coffee',time:'2 min',sub:'Two minutes that save a monthly scrub.',
        why:'Coffee oil and milk turn rancid and bake on. A quick clean-up after each session keeps the shower screen clear and the wand sweet.',
        start:{state:'warm',speed:1,mod:function(s){s.pf.b='spent';s.pf.D=18;s.pf.soak=26;s.pf.wet=30;s.wand.out=1;s.wand.inn=0.4;s.drip=330;s.grime=0.2;s.cup.pos='warm'},tab:'clean'},
        steps:[
          {t:'Take the portafilter out and knock out the puck (tap the basket).',done:function(c){return c.has('knock')}},
          {t:'Flush the group with the portafilter out for a few seconds to rinse the screen.',done:function(c){return c.has('flush',function(d){return !d.pfIn&&d.secs>=2.5})}},
          {t:function(){return 'Purge the steam wand into the drip tray: steam on, wait for '+sLamp()+', then open the knob a second and close it.'},done:function(c){return c.has('purge')},hint:'The wand has milk inside it from the last jug; with the boiler below steam temperature little comes out.'},
          {t:'Wipe the wand with a damp cloth (Milk or Cleaning tab).',done:function(c){return c.has('wipe')}},
          {t:'Empty the drip tray, lock the empty portafilter back in, and switch off (steam off first).',done:function(c){return c.has('act',function(d){return d==='tray'})&&!c.s.pwr&&c.s.pf.in&&!c.s.steam}}
        ],
        score:function(){return {stars:3,text:'Clean and off. Wash the basket and the drip tray in the sink.'}}},
      {id:'backflush',track:'Care',title:'Backflush with cleaner',time:'6 min',sub:'Gaggia\'s monthly clean, step by step.',
        why:'Coffee oil builds up behind the shower screen and in the 3-way valve. Gaggia\'s E24 manual cleans it monthly with a blind filter and a quarter of a cleaning tablet: at least 10 cycles with the cleaner, then at least 10 rinse cycles.',
        start:{state:'warm',speed:5,mod:function(s){s.grime=0.6},tab:'clean'},
        steps:[
          {t:'Take the portafilter out and swap to the blind basket (Cleaning tab).',done:function(c){return c.s.pf.b==='blind'}},
          {t:'Add a quarter of a cleaning tablet (Detergent in the blind basket).',done:function(c){return c.has('detergent')}},
          {t:'Lock it in and run 10 cycles: brew on for about 5 s, then off for about 30 s.',done:function(c){return c.count('bf-cycle',function(d){return d.det>0.05})>=10||c.count('bf-cycle')>=10},hint:'Each off vents the cleaner back through the valve into the drip tray. Speed up time while it soaks.'},
          {t:'Take it out and rinse the blind basket (swap to Double and back to Blind), lock in again.',done:function(c){return c.has('basket',function(d){return d==='empty'})&&c.s.pf.b==='blind'&&c.s.pf.in}},
          {t:'Run at least 10 rinse cycles with plain water.',done:function(c){return c.count('bf-cycle')>=10&&c.s.det<0.03}},
          {t:'Swap back to the double basket, then run about 150 ml through the group.',done:function(c){return c.has('flush',function(d){return d.vol>=120})&&c.s.pf.b==='empty'}}
        ],
        score:function(c){var g=c.s.grime;return {stars:g<0.08&&c.s.det<0.02?3:2,text:'Group oil down to '+Math.round(g*100)+'% and the cleaner rinsed out.'}}},
      {id:'descale',track:'Care',title:'Descale',time:'8 min',sub:'Gaggia\'s procedure, every two months.',
        why:function(){return 'Scale builds up in the boiler from the minerals in the water; it slows heating and blocks the small passages. Gaggia\'s procedure uses its own descaler, never vinegar, and ends with four tanks of rinse water.'+(gc()?' These are the newer manuals\' steps; the original Classic\'s own manual differs (see Care and cleaning).':'')},
        start:{state:'warm',speed:20,mod:function(s){s.scale=0.65;s.pf.in=0;s.pf.b='empty'},tab:'clean'},
        steps:[
          {t:'Take the portafilter out. Empty the tank and add half a bottle of Gaggia descaler, topped up with water (Cleaning tab).',done:function(c){return c.has('descaler-in')}},
          {t:'Run two cups (about 300 ml) out of the wand: knob open, then brew and steam on together.',done:function(c){return c.cnt.wandDesc>=280},hint:'Open the knob, switch steam on, then brew. Switch both off after two cups.'},
          {t:'Run two cups (about 300 ml) through the group: steam off, brew on.',done:function(c){return c.cnt.groupDesc>=280}},
          {t:'Switch off and leave it about 20 minutes (use 60× time).',done:function(c){return !c.s.pwr&&c.cnt.offFor>=1140},hint:'The descaler works while it sits.'},
          {t:'Switch on; keep running two cups out of the wand and two through the group, with short rests, until the tank is empty.',done:function(c){return c.s.tank<60&&c.s.pwr}},
          {t:'Rinse: refill with fresh water (Cleaning tab) and run it through the wand and the group. Four tanks in all, as Gaggia says.',done:function(c){return c.cnt.rinse>=4*1900&&c.s.descB<0.01},hint:'Refill each time the tank empties: a full tank through the wand, then a full tank through the group, twice over.'}
        ],
        score:function(c){return {stars:c.s.scale<0.15?3:2,text:'Scale down to '+Math.round(c.s.scale*100)+'% and the boiler rinsed clean. Next one in about two months.'}}}
    ];

    /* ---------- the care log ---------- */
    X.care=[
      {id:'pf',group:'After every coffee',title:'Knock out, rinse, flush',src:'Gaggia manual + common practice',when:'After each shot.',every:null,
        steps:['Take the portafilter out slowly: the water on the grounds is hot.','Knock out the puck and rinse the basket.','Run a second or two of water through the group to rinse the screen.','Lock the empty portafilter back in so it stays warm.'],lesson:'clean'},
      {id:'wand',group:'After every coffee',title:'Purge and wipe the wand',src:'Gaggia manual',when:'Straight after steaming, before the milk dries on.',every:null,
        steps:['Point the wand at the drip tray and open the knob for 1 to 2 s to clear the hole.','Wipe it with a damp cloth. Move the wand only by its rubber grip: it\'s hot.'],lesson:'milk'},
      {id:'baskets',group:'Daily',title:'Wash the baskets and portafilter',src:'Gaggia manual',when:'Every day you use it.',every:1,
        steps:['Wash them in warm water. Gaggia says no dishwasher.','Swap baskets only when the portafilter is cold.']},
      {id:'tray',group:'Daily',title:'Empty and rinse the drip tray',src:'Gaggia manual',when:'Every day you use it.',every:1,
        steps:['Empty it and rinse it with water. No abrasive cleaners.']},
      {id:'tank',group:'Daily',title:'Fresh water in the tank',src:'Gaggia manual',when:'Every day you use it.',every:1,
        steps:['Fill with fresh, cold water each time; never warm, hot or sparkling.','Don\'t leave water standing in the tank during a long break.','Never let the tank run dry while the pump runs.']},
      {id:'screen',group:'Every few days',title:'Brush the shower screen and gasket',src:'Gaggia manual',when:'Gaggia says regularly; every few days is a good habit.',every:3,
        steps:['With the portafilter out, brush the screen and the gasket around it.','Run a cup of water through the group to rinse it.']},
      {id:'wbf',group:'Every few days',title:'Plain-water backflush',src:'Complete Home Barista (how often); the timing is common practice',when:'Every session or two, Complete Home Barista says. Of Gaggia\'s manuals, only the 2026 E24 ones describe a blind-filter clean at all, and that one is monthly, with cleaner.',every:2,
        steps:['Blind basket in the portafilter, lock it in.','Brew on for about 5 s, off for about 10 s; five times or so.','Swap back to the double basket and run a cup of water through the group.'],lesson:'backflush'},
      {id:'tip',group:'Weekly',title:'Rinse the steam tip',src:'Gaggia manual (it unscrews); timing is common practice',when:'Weekly, or whenever steam weakens.',every:7,
        steps:['With the machine off and cool, unscrew the wand\'s tip.','Rinse it, clear the hole, and screw it back on.']},
      {id:'cbf',group:'Monthly',title:'Backflush with cleaner',src:'Gaggia E24 manual (2026)',when:'Monthly.',every:30,
        steps:['A quarter of a Gaggia Coffee Oil Remover tablet in the blind filter.','Pump 5 s on, then wait about 30 s; at least 10 times.','Wash the portafilter, then run at least 10 more cycles with plain water.','Brush the screen and run about 150 ml through the group.','Forum reports say strong cleaners slowly attack the aluminum shower-screen holder on aluminum-boiler Classics: use only a little.'],lesson:'backflush'},
      {id:'soak',group:'Monthly',title:'Soak the baskets',src:'Gaggia manual (when brewing misbehaves); monthly is common practice',when:'Gaggia says whenever brewing misbehaves; monthly is a common habit.',every:30,
        steps:['Soak the baskets in boiling water for 10 minutes, or use Gaggia cleaning tablets for a deeper clean (Gaggia).','Rinse them well before the next coffee.']},
      {id:'deep',group:'Monthly',title:'Clean behind the shower screen',src:'Whole Latte Love tech tip (the steps); monthly is common practice',when:'Monthly for daily use is a common habit; Whole Latte Love gives no interval.',every:30,
        steps:['Unplug the machine and let it cool completely. The screen comes off with the Phillips screw in its centre; the plate behind it with two 5 mm Allen bolts.','Brush them clean. Whole Latte Love soaks the metal parts in descaler to lift stubborn build-up, and never the plastic ones.','Rinse well and refit.']},
      {id:'descale',group:'Every 2 months',title:'Descale',src:function(){return gc()?'Gaggia\'s original Classic manual':'Gaggia manual (2019 and later)'},when:function(){return gc()?'About every 2 months, depending on use and water (Gaggia), and whenever the flow drops.':'Every 2 months, or 2 to 3 months on purified or bottled water (Gaggia), and whenever the flow drops.'},every:function(w){return w==='filtered'?75:60},
        steps:function(){return gc()?['Gaggia descaler, made up as the packet says. Portafilter out.','With the machine off and cool, unscrew the shower disc and clean it.','Pour the solution into the tank and run the pump for 15 s, letting it flow through the group and out of the steam wand for a few seconds.','Wait 20 minutes, then repeat until the solution has run through.','Rinse thoroughly with plain cold water through the group and the wand, then refit the shower disc.','Don\'t drink anything that comes out until the rinse is done.']:
          ['Gaggia descaler only, never vinegar or other acids. Portafilter out.','Empty the tank, add half a bottle (about 125 ml) of descaler and top up to MAX.','Switch on; run 2 cups out of the wand (knob open, brew and steam on together) and 2 through the group. Switch off for about 20 minutes.','Switch on; 2 cups from the wand and 2 from the group, then off for 3 minutes. Repeat until the tank is empty.','Rinse the tank, fill it, run a full tank through the wand; refill, lock in the portafilter, and run a full tank through the group. Repeat both: four tanks in all.','Don\'t drink anything that comes out until the rinse is done.']},lesson:'descale'},
      {id:'gasket',group:'Yearly',title:'New group gasket (and screen if worn)',src:'Seattle Coffee Gear',when:'About once a year, Seattle Coffee Gear says, or sooner if it leaks or the handle locks past 6 o\'clock.',every:365,
        steps:['Signs: water around the rim during a shot, the handle swinging further than it used to, a flat, cracked or shiny gasket.','Unplug the machine and let it cool completely; take off the screen, pry out the old gasket, seat the new one evenly.','Replace the screen if it\'s bent, torn or clogged.']},
      {id:'idle2w',group:'After a break',title:'After two weeks unused',src:'Gaggia manual',when:'Before the first coffee after a break.',every:null,
        steps:['Repeat the first-use flush: a full tank through the wand and a full tank through the group.','Pour all of it away.']}
    ];
    X.intro.care=function(){return 'Gaggia\'s own schedule plus the common practice around it; each card says which is which. Tick a task when you do it and the date saves in this browser. Gaggia\'s US manual recommends purified or bottled water. Hard tap water scales faster. Fully stripped water, pure reverse osmosis or distilled, isn\'t ideal either: Espresso Parts says it can taste flat and, depending on the rest of its profile, be corrosive. If you filter that far, add minerals back. A chloride-free espresso-machine mix such as Third Wave Water\'s espresso profile is a common choice.'};

    X.sources=function(){return '<h3>Gaggia</h3><ul>'+
      '<li><a href="https://www.gaggia.com/app/uploads/2023/10/6420-010-43466-MANUAL-GAG.-CLASSIC-E24-USA-Rev-00-6.pdf">Gaggia Classic E24 manual, USA (2026)</a>: lamps, brewing, steaming, lowering the boiler temperature, hot water, cleaning, the monthly blind-filter clean, descaling.</li>'+
      '<li><a href="https://cdn.shopify.com/s/files/1/0076/7649/3888/files/MANUAL_6420-010-01628_GAG._CLASSIC_PRO_USA_Rev_00.pdf">Gaggia Classic Evo Pro manual, USA (2023)</a> and <a href="https://www.gaggia.com/app/uploads/2023/07/4219-465-07801-MANUAL-GAG.-CLASSIC-2019-RI9380-USA-EN-FR-ES-Rev-00_New_Classic.pdf">Classic 2019 manual, USA</a>.</li>'+
      '<li><a href="https://cdn.shopify.com/s/files/1/0076/7649/3888/files/SMA_GAGGIA_CLASSIC_REV04_EN.pdf">Gaggia Classic service manual (Rev.04)</a>: 107 °C and 145 °C thermostats, 184 °C fuse, heater power.</li>'+
      '<li><a href="https://www.gaggia.com/manual-machines/new-classic-e24/">Gaggia Classic E24 page and FAQ</a>: brass boiler, milk, cleaning.</li>'+
      '<li><a href="https://s3.amazonaws.com/wll-documents/Gaggia/Classic/Classic+Full+Manual.pdf">Original Classic manual</a> (hosted by Whole Latte Love).</li></ul>'+
      '<h3>Measurements</h3><ul>'+
      '<li><a href="https://kaffeemacher.de/en/blogs/kaffeewissen/gaggia-classic-e24-test">Kaffeemacher, Gaggia Classic E24 test</a>: Scace 2 shot temperatures with and without a flush.</li>'+
      '<li><a href="https://www.wholelattelove.com/blogs/reviews/gaggia-classic-pro-e24-review">Whole Latte Love, Classic Pro E24 review</a>: heat-up, idle cycles, shot temperature, steaming, boiler sizes.</li>'+
      '<li><a href="https://kaffeemacher.de/en//blogs/kaffeewissen/gaggia-new-classic">Kaffeemacher, Gaggia New Classic</a> and the home-barista thread on the <a href="https://www.home-barista.com/espresso-machines/gaggia-classic-boiler-temperature-cycle-t10988.html">Classic\'s boiler cycle</a>.</li></ul>'+
      '<h3>Surfing</h3><ul>'+
      '<li><a href="https://coffeeblog.co.uk/temperature-surf-gaggia-classic/">Coffee Kev, temperature surfing the Gaggia Classic</a> (steam-switch boost) and the home-barista thread on <a href="https://www.home-barista.com/tips/different-approach-to-gaggia-temperature-routine-t22059.html">a different Gaggia routine</a> (4 s of steam, about 108 to 116 °C on the boiler wall).</li>'+
      '<li><a href="https://www.wholelattelove.com/blogs/reviews/rancilio-silvia-review">Whole Latte Love, Rancilio Silvia review</a>: on a single boiler, a longer flush gives a cooler shot and a shorter one a hotter shot.</li>'+
      '<li><a href="https://www.seattlecoffeegear.com/blogs/learning-center/temperature-surfing-single-boiler">Seattle Coffee Gear, temperature surfing a single boiler</a>.</li>'+
      '<li><a href="https://comoricoffee.com/en/gaggia-classic-pro-circuit-diagram-en/">Comori Coffee, Classic Pro circuit walkthrough</a> (why the lamp lights when the element stops).</li></ul>'+
      '<h3>Recipes, milk, cleaning, water</h3><ul>'+
      '<li><a href="https://kaffeemacher.de/en/blogs/kaffeewissen/espresso-temperature">Kaffeemacher, espresso temperature</a> (the bands); <a href="https://completehomebarista.com/faqs/brewing-methods/espresso-technique/adjust-for-different-roast-levels/">Complete Home Barista, adjusting for roast level</a>; <a href="https://clivecoffee.com/blogs/learn/how-water-temperature-affects-espresso-extraction-clive-coffee">Clive, water temperature and extraction</a>; <a href="https://clivecoffee.com/blogs/learn/espresso-extraction-time-ratio-a-complete-guide-clive-coffee">Clive, extraction time and ratio</a>; <a href="https://www.baristahustle.com/what-difference-will-it-make-to-an-espresso-if-i-raise-the-temperature-of-my-machine-by-one-degree/">Barista Hustle on brew temperature</a>.</li>'+
      '<li><a href="https://clivecoffee.com/blogs/learn/why-is-my-espresso-sour-or-bitter-how-to-fix-it-clive-coffee">Clive, sour or bitter</a>; <a href="https://www.baristahustle.com/coffee-extraction-and-how-to-taste-it/">Barista Hustle, tasting extraction</a>; <a href="https://completehomebarista.com/faqs/brewing-methods/espresso-technique/what-is-channeling/">Complete Home Barista, channeling</a>.</li>'+
      '<li><a href="https://au.lamarzoccohome.com/blog/how-to-steam-milk-like-a-pro-barista/">La Marzocco Home, steaming milk</a>; <a href="https://clivecoffee.com/blogs/learn/how-to-steam-milk-for-lattes-and-cappuccinos-at-home-clive-coffee">Clive, steaming milk</a>; <a href="https://www.baristahustle.com/lesson/la-1-01-making-microfoam/">Barista Hustle, microfoam</a>; <a href="https://perfectdailygrind.com/2022/06/what-is-a-flat-white/">Perfect Daily Grind, the flat white</a>; <a href="https://www.wholelattelove.com/blogs/articles/why-you-should-steam-before-brewing">Whole Latte Love, why steam before brewing</a>.</li>'+
      '<li><a href="https://completehomebarista.com/faqs/equipment/how-often-to-backflush-espresso-machine/">Complete Home Barista, backflush frequency</a>; <a href="https://www.wholelattelove.com/blogs/tech-tips/how-to-clean-your-gaggia-semi-automatics-brew-group">Whole Latte Love, cleaning the Gaggia group</a>; <a href="https://www.seattlecoffeegear.com/blogs/learning-center/replacing-group-gasket-shower-screen">Seattle Coffee Gear, gasket and screen</a> and <a href="https://www.seattlecoffeegear.com/blogs/learning-center/espresso-machine-leaking-from-group-head">group head leaks</a> (the yearly gasket).</li>'+
      '<li><a href="https://www.espressoparts.com/blogs/news/how-water-chemistry-affects-espresso-machines-hardness-chloride-scale-and-ro-water">Espresso Parts, water chemistry and RO water</a>; <a href="https://www.baristahustle.com/water-hardness/">Barista Hustle, water hardness</a>; <a href="https://support.thirdwavewater.com/en-US/articles/espresso-profile-26039">Third Wave Water, espresso profile</a>.</li></ul>'+
      '<p class="fine">The page is unofficial. Gaggia\'s manual wins wherever this page and it differ.</p>'};
    return X;
  })();
