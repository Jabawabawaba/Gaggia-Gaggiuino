  /* ---------- the coach for "Run the machine" ----------
     Watches the simulator (learn-sim.js hooks: each step of machine time, each control used, start over) and writes
     a report card for every shot and every jug of milk: what went well, what to change next time. When something goes
     wrong it says what happened, what the controls involved do, and the better way, once per kind of slip until you
     start over. The bands come from the model itself: about 75 °C at the puck at the first lamp, 88 °C after a
     15-minute warm-up with the portafilter in, over 105 °C straight after steaming. Words stay off the machine. */
  (function(){
    var root=$('sim'),box=$('sim-coach');if(!root||!box||!root._sim)return;
    var sim=root._sim,K=sim.K,feed=$('coach-feed'),guide=$('coach-guide');
    function e(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
    function r0(x){return Math.round(x)}

    /* ---- what each control does, for the machine on show ---- */
    function CTL(){
      var gc=K.gc;
      return {
        pwr:['Power',gc?'The left rocker. Switches the machine on and the boiler starts heating; it lights while the machine is on.':'The left rocker. Switches the machine on and the boiler starts heating; the lamp under it shows power.'],
        brew:['Brew',(gc?'The right-hand rocker. ':'The middle rocker. ')+'Runs the pump and opens the 3-way valve, so water goes through the group and the coffee. Switched off, the valve drops shut and vents the pressure over the puck into the drip tray.'],
        steam:['Steam',(gc?'The wide rocker in the middle. ':'The right rocker. ')+'Raises the boiler to steam temperature, about 145 °C. While it\'s on, the 3-way valve stays shut, so brew can\'t reach the group; with the knob open, brew sends hot water out of the wand instead.'],
        lamps:['The lamps',gc?'The brew rocker lights when the boiler has reached temperature and heating pauses: brew temperature, or steam temperature with steam on. It goes out each time heating comes back on.':'The lamp under brew lights when the boiler is at brew temperature; the one under steam lights at steam temperature. They go out while the boiler heats.'],
        knob:['Steam knob','On the right side. Opens the steam valve to the wand. With steam ready it gives steam; from a full boiler the first second or two is hot water. For hot water, switch steam on and then brew, so the 3-way valve stays shut and it all comes out of the wand.'],
        pf:['Portafilter','Tap it to take it out and tap its handle to lock it in. Never force it out while there\'s pressure in the group: here it just won\'t budge, on a real machine it sprays scalding water and grounds. Tap the basket to dose it, or to knock out a spent puck.'],
        cup:['Cup','Tap it to move it between the cup warmer on top and the drip tray under the spouts.'],
        jug:['Milk jug','Tap it to put it under the wand or take it away. The clip-on thermometer shows the milk\'s temperature.'],
        tank:['Tank and drip tray','Tap the tank in the inside view to refill it; tap the drip tray to empty it.'],
        time:['Time','Start over gives a cold machine. The arrows run time at 1x, 5x and 20x, handy for the warm-up.']
      };
    }
    function ctlList(keys){var C=CTL();return '<ul class="ck-ctl">'+keys.map(function(k){return '<li><b>'+e(C[k][0])+'</b>: '+e(C[k][1])+'</li>'}).join('')+'</ul>'}
    /* the ready light, as a noun: Pro family lamps, or the original Classic's lit brew rocker */
    function readyWord(steam){return K.gc?'the brew rocker\'s light':(steam?'the steam lamp':'the brew lamp')}

    /* ---- the best way, and the full control list, in the guide under the coach ---- */
    function renderGuide(){
      var C=CTL(),gc=K.gc;
      var steps=[
        'Fill the tank. Lock the empty portafilter in, loosely, so it heats with the group, put the cup on the warmer, and switch on.',
        'Wait 15 minutes or more (5x or 20x saves the wait). The first ready lamp comes after about a minute, but the group and portafilter are still cold then, so that shot comes out sour.',
        'Run a little water through the empty portafilter to warm it the rest of the way. Then take it out, dose the basket and lock it back in.',
        'Cup on the drip tray. With '+readyWord(false)+' on, switch brew on for 25 to 30 seconds, about 40 ml in the cup, and switch it off.',
        'Milk: switch steam on and wait for '+readyWord(true)+', usually well under a minute. Purge first: open the knob with no jug until the water turns to steam, and close it.',
        'Jug under the wand, open the knob. It foams while the milk is cold; stop at 60 to 65 °C on the thermometer. Close the knob, then take the jug away.',
        'Switch steam off. Take the portafilter out and knock the puck out, then run water through the group into the drip tray until '+readyWord(false)+' goes out, then stop and let it come back on: that refills the boiler and brings it back down to brew temperature. After a long steaming, over a minute, refill through the wand first: knob open, brew on until water comes out, then off.',
        'Empty the drip tray when it fills.'
      ];
      guide.querySelector('.cg-steps').innerHTML=steps.map(function(s){return '<li>'+e(s)+'</li>'}).join('');
      guide.querySelector('.cg-ctl').innerHTML=ctlList(['pwr','brew','steam','lamps','knob','pf','cup','jug','tank','time']);
    }

    /* ---- the feed ---- */
    var n={shot:0,milk:0},seen={};
    function card(cls,html){
      var empty=feed.querySelector('.ck-empty');if(empty)empty.remove();
      /* only the newest slip keeps its control notes open; the older ones fold away */
      Array.prototype.forEach.call(feed.querySelectorAll('details.ck-more[open]'),function(d){d.open=false});
      var a=document.createElement('article');a.className='ck '+cls;a.innerHTML=html;
      feed.insertBefore(a,feed.firstChild);
      while(feed.children.length>14)feed.removeChild(feed.lastChild);
      return a;
    }
    function checks(list){return '<ul class="ck-list">'+list.map(function(c){return '<li class="'+(c[0]?'ok':'no')+'"><span class="ck-i" aria-label="'+(c[0]?'Good':'To improve')+'">'+(c[0]?'✓':'✗')+'</span>'+e(c[1])+'</li>'}).join('')+'</ul>'}
    function nextList(list){return list.length?'<div class="ck-next"><span class="k">Next time</span><ul>'+list.map(function(x){return '<li>'+e(x)+'</li>'}).join('')+'</ul></div>':''}
    /* a slip: once per kind until you start over */
    function slip(kind,title,what,keys,better){
      if(seen[kind])return;seen[kind]=1;
      card('slip','<div class="ck-h"><span class="ck-tag">Slip</span><h4>'+e(title)+'</h4></div><p>'+e(what)+'</p>'+
        '<details class="ck-more" open><summary>What the controls do</summary>'+ctlList(keys)+'</details><p class="ck-best"><b>Better:</b> '+e(better)+'</p>');
    }

    /* ---- watching ---- */
    var B=null,M=null,st={purge:0,steamOn:null,milkDone:false,idle:0,lastMilk:null,refill:false};
    function startShot(s){
      B={t0:s.t,g0:s.Tg,pf0:s.Tpf,tw0:s.Tw,ready:sim.ready(),steam:!!s.steam,dosed:!!(s.pf.in&&s.pf.b==='dosed'&&s.pf.wet<1),pfIn:!!s.pf.in,
         tray:s.cup.pos==='tray',cupV0:s.cup.v,tc0:s.cup.Tc,maxP:0,flash:0,dry:false,toTray:s.drip};
      if(!s.pwr){slip('brew-off','Nothing happens with the power off','Brew needs the machine switched on: the pump and valve have no power.',['pwr','brew'],'Switch power on first and give it time to heat.');B=null;return}
      if(s.steam&&!s.knob){B.steamShut=true;slip('brew-steam','Brew with steam on','With steam on, the 3-way valve stays shut, so nothing reached the group: the pump just ran against the over-pressure valve.',['brew','steam','lamps'],'Switch steam off before brewing, and wait for '+readyWord(false)+'. To get hot water from the wand, open the knob first.')}
      if(B.dosed&&!B.steamShut){
        if(!B.tray)slip('no-cup','The coffee went into the drip tray','The cup was still on the warmer, so the shot ran straight into the tray.',['cup','brew'],'Tap the cup down onto the drip tray before switching brew on. Keeping it on the warmer until then is right: it starts the shot warm.');
        if(B.tw0>108)slip('hot-shot','Brewing straight after steaming','The boiler was still near steam temperature, so the water flashed to steam at the group, which can scald, and the coffee came out burnt.',['steam','brew','lamps'],'After steaming, switch steam off, '+'take the portafilter out and run water through the group into the drip tray until '+readyWord(false)+' goes out, then stop and let it come back on: that refills the boiler and brings it back down to brew temperature'+'. Then brew.');
        else if(!B.ready&&B.tw0<90)slip('early-shot','Brewing before the machine was ready','The boiler hadn\'t reached brew temperature, so the shot ran cool.',['lamps','brew'],'Wait for '+readyWord(false)+', and on a cold start give it 15 minutes or more with the portafilter locked in.');
      }
    }
    function endShot(s){
      var b=B;B=null;if(!b)return;
      var secs=s.t-b.t0,c=s.cup;
      if(!b.dosed){
        /* a flush: it warms the group and portafilter, which is good practice before a shot */
        return;
      }
      if(secs<3)return;
      var v=b.tray?c.v-b.cupV0:0,Tq=c.Ew>0?c.EwT/c.Ew:0,cr=c.cr;n.shot++;
      var verdict,cls;
      if(b.steam&&v<2){verdict='Nothing reached the cup';cls='bad'}
      else if(!b.tray){verdict='Into the drip tray';cls='bad'}
      else if(Tq>96.5){verdict='Burnt and bitter';cls='bad'}
      else if(Tq<84){verdict='Sour';cls='bad'}
      else if(Tq<88){verdict='A little sour';cls='mid'}
      else if(v<25){verdict='Short';cls='mid'}
      else if(v>52){verdict='Long and thin';cls='mid'}
      else{verdict='A good shot';cls='good'}
      var L=[],N=[];
      if(b.steamShut&&v<2){
        L.push([false,'Steam was on, so the 3-way valve stayed shut and nothing reached the group.']);
        L.push([b.tray,b.tray?'Cup on the drip tray.':'The cup wasn\'t under the spouts either.']);
        N.push('Switch steam off and wait for '+readyWord(false)+' before you brew.');if(!b.tray)N.push('Tap the cup onto the drip tray before brewing.');
        card('shot bad','<div class="ck-h"><span class="ck-tag">Shot '+n.shot+'</span><h4>'+e(verdict)+'</h4></div>'+checks(L)+nextList(N));return;
      }
      L.push([b.tw0<=108&&!b.flash,b.tw0>108||b.flash>0?'The boiler was too hot: it flashed to steam at the group.':'Boiler at brew temperature, not steam.']);
      if(b.tw0>108||b.flash>0)N.push('After steaming, switch steam off, take the portafilter out and run water through the group into the drip tray until '+readyWord(false)+' goes out, then stop and let it come back on: that refills the boiler and brings it back down to brew temperature.');
      if(b.tw0<=108){
        L.push([b.ready||b.tw0>=92,b.ready?'Started with '+readyWord(false)+' on.':b.tw0>=92?'Boiler hot enough, though '+readyWord(false)+' was off while it topped up.':'Started before '+readyWord(false)+' came on.']);
        if(!b.ready&&b.tw0<92)N.push('Wait for '+readyWord(false)+' before you brew.');
      }
      L.push([b.g0>=68,'Group at '+r0(b.g0)+' °C'+(b.g0>=68?': well warmed.':b.g0>=50?': still warming.':': cold.')]);
      if(b.g0<68)N.push('Give the machine 15 minutes or more from cold so the group soaks up heat (5x or 20x saves the wait).');
      L.push([b.pf0>=55,'Portafilter at '+r0(b.pf0)+' °C'+(b.pf0>=55?'.':': it takes heat out of the shot.')]);
      if(b.pf0<55)N.push('Keep the portafilter locked in while the machine heats, and run a little water through it before you dose.');
      L.push([b.tray,b.tray?'Cup on the drip tray.':'The cup wasn\'t under the spouts.']);
      if(b.tray)L.push([b.tc0>=38,'Cup at '+r0(b.tc0)+' °C'+(b.tc0>=38?': warmed on top.':': a cold cup cools the shot.')]);
      if(b.tray&&b.tc0<38)N.push('Leave the cup on the warmer while the machine heats.');
      if(Tq>0)L.push([Tq>=88&&Tq<=96.5,'About '+r0(Tq)+' °C at the puck'+(Tq<88?': too cool, so sour.':Tq>96.5?': too hot, so bitter.':': right in the band.')]);
      if(b.tray&&!b.steam){
        L.push([v>=25&&v<=52,r0(secs)+' s for '+r0(v)+' ml'+(v<25?(secs<22?': stopped early.':Tq<86?': it ran slow, as a cold puck does.':': it ran slow.'):v>52?': ran long, so thin and bitter.':'.')]);
        if(v<25&&secs<22)N.push('Let it run 25 to 30 seconds, about 40 ml in the cup.');
        if(v>52)N.push('Stop at about 30 seconds.');
      }
      if(!b.tray)N.push('Tap the cup onto the drip tray before brewing.');
      if(b.dry)N.push('Refill the tank before it runs dry.');
      var good=L.filter(function(x){return x[0]}).length;
      card('shot '+cls,'<div class="ck-h"><span class="ck-tag">Shot '+n.shot+'</span><h4>'+e(verdict)+'</h4><span class="ck-score">'+good+' of '+L.length+'</span></div>'+
        '<p class="ck-stats">'+[r0(secs)+' s',b.tray?r0(v)+' ml':null,Tq?r0(Tq)+' °C at the puck':null,r0(b.maxP)+' bar',b.tray&&cr>0.5&&Tq>=86&&Tq<=99?'good crema':null].filter(Boolean).join(' · ')+'</p>'+
        checks(L)+nextList(N));
    }
    function startMilk(s){
      M={t0:s.t,ready:sim.ready(),purged:st.purge>=1,spurt:0,maxT:s.jug.T,T0:s.jug.T,offOpen:false,early:!sim.ready()};
      if(M.early)slip('steam-early','Steaming before it was ready','The boiler hadn\'t reached steam temperature, so the steam was weak and wet and the milk took longer to heat.',['steam','lamps','knob'],'After switching steam on, wait for '+readyWord(true)+' before opening the knob, usually well under a minute.');
    }
    function endMilk(s,why){
      var m=M;M=null;if(!m)return;
      var j=s.jug,T=m.maxT,secs=s.t-m.t0;
      if(T<30&&secs<3)return;
      n.milk++;st.lastMilk=s.t;
      var verdict,cls;
      if(T>72){verdict='Scalded';cls='bad'}
      else if(T<50){verdict='Lukewarm';cls='mid'}
      else if(m.spurt>=2){verdict='Watery';cls='mid'}
      else if(T>68){verdict='A bit hot';cls='mid'}
      else{verdict='Silky milk';cls='good'}
      var L=[],N=[];
      L.push([!m.early,m.early?'Started before '+readyWord(true)+' came on.':'Waited for '+readyWord(true)+'.']);
      if(m.early)N.push('Wait for '+readyWord(true)+' after switching steam on.');
      L.push([m.purged&&m.spurt<2,m.purged?'Purged the wand into the drip tray first.':m.spurt>=2?'The wand\'s first water went into the milk ('+r0(m.spurt)+' ml).':'No purge first.']);
      if(!m.purged)N.push('Purge first: open the knob with no jug until the water turns to steam, then close it.');
      L.push([T>=55&&T<=68,'Stopped at '+r0(T)+' °C'+(T<50?': too cool to taste sweet.':T<55?': a touch cool.':T>72?': scalded, it loses its sweetness.':T>68?': a little past the sweet spot.':': the sweet spot.')]);
      if(T<55)N.push('Keep steaming to 60 to 65 °C on the thermometer.');
      if(T>68)N.push('Close the knob at 60 to 65 °C; the milk keeps rising a little after.');
      L.push([!m.offOpen,m.offOpen?'The jug came off with the knob still open: on a real machine that sprays milk.':'Closed the knob before taking the jug away.']);
      if(m.offOpen)N.push('Close the knob, then take the jug away.');
      var now=s.steam?'<p class="ck-now"><b>Now:</b> switch steam off, take the portafilter out and run water through the group into the drip tray until '+readyWord(false)+' goes out, then stop and let it come back on: that refills the boiler and brings it back down to brew temperature.</p>':'';
      var good=L.filter(function(x){return x[0]}).length;
      card('milk '+cls,'<div class="ck-h"><span class="ck-tag">Milk '+n.milk+'</span><h4>'+e(verdict)+'</h4><span class="ck-score">'+good+' of '+L.length+'</span></div>'+
        '<p class="ck-stats">'+[r0(secs)+' s of steam',r0(T)+' °C',j.foam>j.m*0.3?'plenty of foam':j.foam>j.m*0.08?'some foam':'little foam'].join(' · ')+'</p>'+
        checks(L)+nextList(N)+now);
      st.purge=0;
    }
    sim.on(function(ev,a,dt){
      var s=sim.get();
      if(ev==='reset'||ev==='setup'){B=null;M=null;st={purge:0,steamOn:null,idle:0,lastMilk:null};if(ev==='reset'){seen={};n={shot:0,milk:0};feed.innerHTML='<p class="ck-empty">'+e(EMPTY)+'</p>'}renderGuide();return}
      if(ev==='blocked'){slip('pf-stuck','Don\'t force the portafilter','There was still pressure in the group. Forced out, a real one sprays scalding water and grounds.',['pf','brew'],'Switch brew off and give it a couple of seconds for the 3-way valve to vent the pressure into the drip tray, then take it out.');return}
      if(ev==='act'){
        if((a==='f-sw-brew'||a==='f-gsw-brew')&&s.brew)startShot(s);
        if((a==='f-sw-brew'||a==='f-gsw-brew')&&!s.brew&&B)endShot(s);
        if(a==='f-jug'&&s.jug.pos!=='wand'&&M){if(s.knob)M.offOpen=true;endMilk(s,'off');if(s.knob)slip('jug-open','The jug came off with the knob open','On a real machine the steam blows milk everywhere as the tip leaves the surface.',['knob','jug'],'Close the knob first, then take the jug away.')}
        if((a==='f-sw-steam'||a==='f-gsw-steam')&&s.steam){st.steamOn=s.t;st.purge=0;st.idle=0}
        if((a==='f-sw-steam'||a==='f-gsw-steam')&&!s.steam&&M)endMilk(s,'steamoff');
        return;
      }
      if(ev!=='step')return;
      var q=s.q||{};
      /* the knob open for a while with nothing coming out: not the first moments of a refill or a prime */
      if(s.knob&&!s.pumpOn&&!s.steam&&s.Tw<100.3&&!(q.qW>0)&&!(q.mS>0)){st.kc=(st.kc||0)+dt;if(st.kc>6)slip('knob-cold','Nothing came out of the wand','The knob only lets out what the boiler has: below boiling there\'s no steam to give.',['steam','knob','lamps'],'Switch steam on and wait for '+readyWord(true)+'. For hot water, open the knob and switch steam on, then brew.')}else st.kc=0;
      /* shots: pressure, flashing, running dry; the switch turned off by start over is handled above */
      if(B){B.maxP=Math.max(B.maxP,s.P);B.flash=Math.max(B.flash,q.flash||0);if(s.air||s.tank<=0.5)B.dry=true;
        if(B.dosed&&s.t-B.t0>55)slip('long-shot','A very long shot','Run well past 30 seconds, the coffee turns thin and bitter as the puck runs out of flavour.',['brew'],'Switch brew off at 25 to 30 seconds, about 40 ml in the cup.')}
      if(s.brew&&!B&&s.pwr)startShot(s);
      if(!s.brew&&B)endShot(s);
      /* the wand: a purge into the tray, then milk */
      var out=(q.qW||0)+(q.mS||0);
      if(out>0&&s.jug.pos!=='wand'&&s.steam)st.purge+=dt;
      if(out>0&&s.jug.pos==='wand'&&!M)startMilk(s);
      if(M){M.maxT=Math.max(M.maxT,s.jug.T);if(s.jug.pos==='wand'&&(q.qW||0)>0&&!(q.mS>0))M.spurt+=(q.qW||0)*dt;
        if(M.spurt>=2&&!M.purged)slip('no-purge','Water in the milk','The first thing out of the wand from a full boiler is hot water, and it went into the jug.',['knob','steam'],'Purge first: open the knob with no jug until the water turns to steam, close it, then steam the milk.');
        if(s.jug.T>72)slip('milk-hot','The milk is past 70 °C','Above about 70 °C milk loses its sweetness and the foam breaks down.',['knob','jug'],'Close the knob at 60 to 65 °C.');
        if(!s.knob&&s.jug.pos==='wand'&&!s.steam)endMilk(s,'steamoff');
      }
      /* steam left on with nothing to do */
      if(s.steam&&!s.knob&&!M){st.idle+=dt;if(st.idle>150)slip('steam-idle','Steam still on','The boiler sits at steam temperature, too hot for the next shot.',['steam','brew'],'When the milk\'s done, switch steam off, take the portafilter out and run water through the group into the drip tray until '+readyWord(false)+' goes out, then stop and let it come back on: that refills the boiler and brings it back down to brew temperature.')}else st.idle=0;
      if(s.pumpOn&&(s.air||s.tank<=0.5))slip('dry','The tank ran dry','With no water the pump rattles and takes in air, and it won\'t push against the coffee until that air is out.',['tank','knob','brew'],'Refill the tank, then prime: open the knob and switch brew on until water flows from the wand.');
      if(s.puddle>0)slip('tray','The drip tray overflowed','Every flush, vent and purge ends up in the tray.',['tank'],'Tap the drip tray to empty it now and then.');
    });
    var EMPTY='Make a coffee. The coach grades each shot and each jug of milk, says what to change next time, and explains the controls when something goes wrong.';
    feed.innerHTML='<p class="ck-empty">'+e(EMPTY)+'</p>';
    renderGuide();
  })();
