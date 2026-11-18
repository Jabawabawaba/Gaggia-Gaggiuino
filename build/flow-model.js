/* What's inside the Gaggia's parts, for the electricity flow view.
   FLOWM.pick(v, fac, box) -> {kind, modes:[[id,label]], model(mode)} or null:
     box           the machine as it leaves the factory (fac.runs[id].n = its two terminals), thermostats and all
     Plug-and-Play the harness runs, by their terminal names
     stock wiring  the factory wires with their moved connectors, plus the install's runs, as one circuit
   A model is a FLOW.solve model plus {parts:{loadOrContactId: partId or [candidates]}, passive, state, kind}. */
var FLOWM=(function(){
  function nt(t){return String(t||'').toLowerCase().replace(/\s*\([^)]*\)\s*$/,'')}
  var MODES=[['off','Plugged in, switch off'],['on','On, at temperature'],['heat','Heating'],['brew','Brewing'],['steam','Steaming'],['water','Hot water']];
  var STATE={off:{},on:{pw:1},heat:{pw:1,heat:1},brew:{pw:1,heat:1,brew:1,pump:1,valve:1},steam:{pw:1,heat:1,steam:1},water:{pw:1,heat:1,brew:1,steam:1,pump:1}};
  /* ---- the factory harness, by terminal: shared by Out of the box and stock wiring ---- */
  var FMODES=[['off','Plugged in, switch off'],['heatup','On, heating up'],['ready','On, at brew temperature'],['brew','Brewing'],['steamheat','Steam on, heating'],['steamready','At steam temperature'],['water','Hot water']];
  var FSTATE={off:{},heatup:{pw:1,btc:1,stc:1},ready:{pw:1,stc:1},brew:{pw:1,btc:1,stc:1,brew:1},steamheat:{pw:1,steam:1,stc:1},steamready:{pw:1,steam:1},water:{pw:1,steam:1,brew:1,stc:1}};
  function facElems(T,st,sw,load){
    /* power switch: both poles on the Pro family, line only on the original Classic (7 in, P out) */
    sw('power','pwr4','pwr5',st.pw,'swP');sw('powerN','pwr1','pwr2',st.pw,'swP');
    sw('power','hs:On/Off 7','hs:On/Off P',st.pw,'housing');
    sw('fuse','b:fuseR','b:fuseL',true,'boiler');
    sw('bt','bt:a','bt:b',st.btc,'bt');sw('st','st:a','st:b',st.stc,'st');
    /* steam switch. Pro family: 2-3 closed while steam is off (the valve's neutral), 2-1 and 5-4 closed while it's on.
       Classic: P(3-4)-3 closed while on, P(5-6)-6 closed while off (the valve's feed). */
    sw('steamNC','steam2','steam3',!st.steam,'swS');sw('steamNO1','steam2','steam1',st.steam,'swS');sw('steamNO2','steam5','steam4',st.steam,'swS');
    sw('steamNO','hs:Steam P','hs:Steam 3',st.steam,'housing');sw('steamNC','hs:Spare P','hs:Spare 6',!st.steam,'housing');
    /* brew switch. Pro family: 4-5 and 1-2 closed while on. Classic: P(1-2)-1. */
    sw('brewB','brew4','brew5',st.brew,'swB');sw('brewA','brew1','brew2',st.brew,'swB');
    sw('brewA','hs:Brew P','hs:Brew 1',st.brew,'housing');
    load('elemT','b:TL','b:TR',1,'boiler');load('elemB','b:BL','b:BR',1,'boiler');
    load('lampPower','lampP:A','lampP:B',800,'lampP');load('lampBrew','lampB:A','lampB:B',800,'lampB');load('lampSteam','lampS:A','lampS:B',800,'lampS');
    /* the Classic's lamps are inside its housing: power between On/Off P and 8, ready between Brew P and 2 */
    load('lampPower','hs:On/Off P','hs:On/Off 8',800,'lampP');load('lampReady','hs:Brew P','hs:Brew 2',800,'lampB');
    if(T['pf:out'])load('pump','pump:A','pf:out',6,'pump');else load('pump','pump:A','pump:B',6,'pump');
    load('valve','sol:R','sol:L',25,'sol');
  }
  function builder(T){
    var o={joins:[],closed:[],loads:[],parts:{}};
    function has(a,b){return T[a]&&T[b]}
    o.sw=function(id,a,b,on,part){if(has(a,b)){o.parts[id]=part;if(on)o.closed.push({id:id,a:a,b:b})}};
    o.load=function(id,a,b,r,part){if(has(a,b)){o.parts[id]=part;o.loads.push({id:id,a:a,b:b,r:r})}};
    return o;
  }
  function facRuns(fac,moved){
    var T={},runs=[];
    Object.keys(fac.runs).forEach(function(id){
      var r=fac.runs[id];if(!r.n||r.sys==='E')return;
      var e=[0,1].map(function(i){var l=(r.lab||[])[i];return l&&moved&&moved[l]?'c:'+l.toLowerCase():r.n[i]});
      T[e[0]]=1;T[e[1]]=1;runs.push({id:id,a:e[0],b:e[1]});
    });
    return {T:T,runs:runs};
  }
  function factoryModel(fac,mode){
    if(!fac||!fac.runs)return null;
    var st=FSTATE[mode]||{},N=facRuns(fac,null);if(!N.T['sock:L']||!N.T['sock:N'])return null;
    var B=builder(N.T);facElems(N.T,st,B.sw,B.load);
    return {runs:N.runs,joins:B.joins,closed:B.closed,loads:B.loads,src:[{from:'sock:L',to:'sock:N',mains:true}],parts:B.parts,passive:{fuse:1,bt:1,st:1},state:st,kind:'factory',gc:!!N.T['hs:On/Off 7'],pf:!!N.T['pf:out']};
  }
  /* stock wiring: a stock connector the install moves becomes its own point (c:name); wires that share a connector
     share that point; the install's runs land on those points, on switch spades, or on the new parts */
  function stockModel(v,fac,mode){
    if(!v||v.path!=='SI'||!fac||!fac.runs)return null;
    var st=STATE[mode]||{},moved={};(fac.moves||[]).forEach(function(l){moved[l]=1});
    var N=facRuns(fac,moved),T=N.T,runs=N.runs,gc=!!T['hs:On/Off 7'];
    function alias(t){
      t=String(t||'').toLowerCase();
      var up=(fac.moves||[]).filter(function(l){return l.toLowerCase()===t})[0];if(up)return 'c:'+t;
      if(t==='pa')return 'pf:out';if(t==='pump')return 'pump:A';if(t==='pump, with f')return 'pump:B';
      var m=/^(brew|steam) sw (\d)$/.exec(t);if(m)return gc?'hs:'+(m[1]==='brew'?'Brew ':'Steam ')+m[2]:m[1]+m[2];
      if(t==='steam sw p(3-4)')return 'hs:Steam P';if(t==='brew sw p(1-2)')return 'hs:Brew P';
      return t;
    }
    v.runs.forEach(function(r){if(!r.term||r.opt)return;var a=alias(r.term[0]),b=alias(r.term[1]);T[a]=1;T[b]=1;runs.push({id:r.id,a:a,b:b})});
    if(!T['sock:L']||!T['sock:N']||!T['j11 l'])return null;
    var B=builder(T);facElems(T,st,B.sw,B.load);
    /* S4 comes off steam spade 4 and goes onto spade 1 */
    if(T['c:s4']){T['steam1']=1;B.joins.push(['c:s4','steam1']);B.sw('steamNO1','steam2','steam1',st.steam,'swS')}
    B.sw('ssr','ssr load sa','ssr load sb',st.heat,'ssr');
    B.load('pcb','j11 l','j10 n',300,'pcb');
    B.sw('pumpdrv','j11 l','j12 p',st.pump,'pcb');B.sw('valvedrv','j11 l','j13 3',st.valve,'pcb');
    var lv=[];
    if(st.pw){
      T['pcb 3v3']=1;T['pcb gnd']=1;
      B.joins.push(['pcb gnd','j7 gnd']);B.joins.push(['pcb gnd','j9 gnd']);
      B.load('pullB','pcb 3v3','j7 b',10,'pcb');B.load('pullS','pcb 3v3','j7 s',10,'pcb');
      B.load('ssrled','ssr +','ssr −',5,'ssr');B.sw('r1','pcb 3v3','j9 r1',st.heat,'pcb');
      lv.push({from:'pcb 3v3',to:'pcb gnd'});
    }
    return {runs:runs,joins:B.joins,closed:B.closed,loads:B.loads,src:[{from:'sock:L',to:'sock:N',mains:true}].concat(lv),parts:B.parts,passive:{fuse:1,bt:1,st:1},state:st,kind:'stock',gc:gc,pf:!!T['pf:out']};
  }
  function pick(v,fac,box){
    if(box){return fac&&factoryModel(fac,'off')?{kind:'factory',modes:FMODES,model:function(m){return factoryModel(fac,m)}}:null}
    if(v&&v.path==='CW')return model(v,'on')?{kind:'pnp',modes:MODES,model:function(m){return model(v,m)}}:null;
    if(v&&v.path==='SI')return stockModel(v,fac,'on')?{kind:'stock',modes:MODES,model:function(m){return stockModel(v,fac,m)}}:null;
    return null;
  }
  function model(v,mode){
    if(!v||v.path!=='CW')return null;
    var st=STATE[mode]||{},T={},runs=[];
    v.runs.forEach(function(r){if(!r.term||r.opt)return;var a=nt(r.term[0]),b=nt(r.term[1]);T[a]=1;T[b]=1;runs.push({id:r.id,a:a,b:b})});
    if(!T['power socket l']||!T['power socket n'])return null;
    var joins=[],closed=[],loads=[],parts={};
    function has(a,b){return T[a]&&T[b]}
    function join(a,b){if(has(a,b))joins.push([a,b])}
    function sw(id,a,b,on,part){if(has(a,b)){parts[id]=part;if(on)closed.push({id:id,a:a,b:b})}}
    function load(id,a,b,r,part){if(has(a,b)){parts[id]=part;loads.push({id:id,a:a,b:b,r:r})}}
    var sh=!!T['shelly l terminal'];
    /* connections that plug together, and the fuses (closed unless tripped) */
    join('x1a',"l2b, to the boiler lamp's x1a");join('x1b',"l4b, to the lamps' x1b");join('x1c','solenoid left spade');join('p2b',"n1a, on the pump fuse's p2b");
    sw('fuse','re-settable fuse right spade','re-settable fuse left spade',true,'rf');
    sw('pfuse','pump fuse lead 1','pump fuse lead 2',true,'pump');
    /* the power switch (the original Classic's is in its housing: 7 in, P out) */
    sw('power','power switch terminal 5','power switch terminal 4',st.pw,'swP');
    sw('power','switch housing on/off 7','switch housing on/off p',st.pw,'housing');
    if(sh){
      /* the Shelly: always powered from the socket; its relay follows the power switch on its SW input */
      sw('relay','shelly l terminal','shelly o terminal',st.pw,'shelly');
      load('shelly','shelly l terminal','shelly n terminal',2000,'shelly');
      load('shellysw','shelly sw terminal','shelly n terminal',5000,'shelly');
    }
    /* the SSR's load side closes while the PCB drives its control side */
    sw('ssr','ssr load right terminal','ssr load left terminal',st.heat,'ssr');
    /* inside the PCB: its own supply, and its two mains outputs */
    load('pcb','pcb j11 ac line l','pcb j10 ac neutral n',300,'pcb');
    sw('pumpdrv','pcb j11 ac line l','pcb j12 pump p',st.pump,'pcb');
    sw('valvedrv','pcb j11 ac line l','pcb j13 solenoid 3',st.valve,'pcb');
    /* loads */
    load('elemT','boiler element terminal tl','boiler element terminal tr',1,'boiler');
    load('elemB','boiler element terminal bl','boiler element terminal br',1,'boiler');
    load('lampBoiler','steam lamp lead a','steam lamp lead b',800,'lampS');
    load('lampPower','power lamp lead a','power lamp lead b',800,'lampP');
    load('lampHousing','switch housing on/off p','switch housing on/off 8',800,'lampP');
    load('pump','pump left spade','pump right spade',6,'pump');
    load('pump','pump left spade',"n1a, on the pump fuse's lead",6,'pump');
    load('valve','solenoid right spade','solenoid left spade',25,'sol');
    /* low voltage: the PCB pulls J7 B and S up and reads them; a closed switch takes one to ground. J9 R1 drives the SSR. */
    var lv=[];
    if(st.pw){
      T['pcb 3v3']=1;T['pcb gnd']=1;
      joins.push(['pcb gnd','pcb j7 gnd']);joins.push(['pcb gnd','pcb j9 gnd']);
      load('pullB','pcb 3v3','pcb j7 b',10,'pcb');load('pullS','pcb 3v3','pcb j7 s',10,'pcb');
      load('ssrled','ssr plus','ssr minus',5,'ssr');
      sw('r1','pcb 3v3','pcb j9 r1',st.heat,'pcb');
      sw('brew','brew switch terminal 1','brew switch terminal 2',st.brew,'swB');
      sw('brew','switch housing brew 1','switch housing brew p',st.brew,'housing');
      sw('steam','steam switch terminal 1','steam switch terminal 2',st.steam,'swS');
      sw('steam','switch housing steam 3','switch housing steam p',st.steam,'housing');
      lv.push({from:'pcb 3v3',to:'pcb gnd'});
    }
    return {runs:runs,joins:joins,closed:closed,loads:loads,src:[{from:'power socket l',to:'power socket n',mains:true}].concat(lv),parts:parts,passive:{fuse:1,pfuse:1},state:st,shelly:sh,gc:v.fam==='GC',kind:'pnp'};
  }
  /* what to say about each state */
  var REV='This assumes the outlet\'s line is on the socket\'s L pin. The Classic\'s switch breaks line only, so with a reversible plug or a miswired outlet the whole machine stays at line voltage with the switch off.';
  function textFactory(m,mode){
    var gc=m.gc;
    var T={
      off:['The cord is in and the power switch is off. This is the machine as it left the factory.',
        gc?'Line reaches the power socket and the switch housing\'s On/Off input (spade 7), and stops there. Neutral runs on into the machine through the thermal fuse.':'Line and neutral reach the power socket and the power switch, and stop at its two open poles.',
        (gc?REV+' ':'')+'The socket and the switch\'s input stay live until the cord is out, so unplug before you touch anything.'],
      heatup:['The machine is on and cold, so both thermostats are closed and the boiler heats.',
        gc?'Line passes the power switch, the brew thermostat and the steam thermostat to the elements, and returns to the socket through the thermal fuse, which sits in the neutral.':'Line passes the power switch and the 184 °C fuse to the elements, and returns through the steam thermostat and then the brew thermostat to neutral. The thermostats sit in the elements\' return, so the elements\' line side is live whenever the machine is on.',
        gc?'The power lamp is lit. The ready lamp sits across the two thermostats, so it stays dark while they\'re closed.':'The power lamp is lit. The brew and steam lamps each sit across a thermostat, so they stay dark while it\'s closed.'],
      ready:['The boiler is at brew temperature: the brew thermostat has opened (at about 107 °C).',
        'The heater is off. A trickle still runs through the '+(gc?'ready lamp':'brew lamp')+', which sits across the open thermostat, and on through the elements: that trickle is what lights the lamp.',
        'When the boiler has cooled some way (typically around 10 °C, not an official figure) the thermostat closes, the lamp goes dark and the heater comes back on. That swing is why people temperature-surf a stock machine.'],
      brew:['The brew switch is on. On a stock machine it switches mains itself.',
        gc?'Line runs through the brew rocker to the pump, and through the steam rocker\'s second pole to the 3-way valve. Both return on neutral, the pump '+(m.pf?'through its thermal fuse':'directly')+'.':'Line runs through the brew switch to the pump and the 3-way valve. The pump returns through its 110 °C fuse; the valve returns through the steam switch, which joins it to neutral only while steam is off.',
        'Shown with the heater on, as it soon is once cold water enters the boiler.'],
      steamheat:['The steam switch is on and the boiler is heating toward steam temperature.',
        'The steam switch bridges the brew thermostat, so the heater stays on past brew temperature and the steam thermostat (about 145 °C) alone decides when it stops.',
        gc?'The ready lamp is dark while the heater is on.':'The brew lamp is bridged along with its thermostat, so it goes dark.'],
      steamready:['The boiler is at steam temperature: the steam thermostat has opened.',
        'The heater is off. A trickle runs through the '+(gc?'ready lamp':'steam lamp')+', across the open thermostat, and on through the elements, which lights it.',
        'Opening the steam knob cools the boiler; the thermostat closes and the heater returns.'],
      water:['Brew and steam switches on together: hot water from the wand.',
        'The brew switch runs the pump. The steam switch\'s other pole breaks the 3-way valve\'s circuit, so the valve stays shut and the pumped water leaves through the steam wand when the knob is open.',
        'Shown with the heater on.']
    };
    return T[mode]||['','',''];
  }
  function textStock(m,mode){
    var gc=m.gc;
    var T={
      off:['The cord is in and the power switch is off.',
        gc?'Line reaches the power socket and the switch housing\'s On/Off input (spade 7), and stops there. Neutral runs on into the machine through the thermal fuse.':'Line and neutral reach the power socket and the power switch, and stop at its two open poles.',
        (gc?REV+' ':'')+'The socket and the switch\'s input stay live until the cord is out, so unplug before you touch anything.'],
      on:['The machine is on and the boiler is at temperature, so the PCB isn\'t asking for heat.',
        'Line passes the power switch and reaches the PCB at J11 on wire L, which plugs onto the stock connector '+(gc?'P1-2':'B4')+'. The PCB\'s neutral is wire N, piggybacked at the pump. The PCB reads the thermocouple, the pressure sensor and the switches all the time.',
        (gc?'The SSR sits in the line to the elements, where the thermostats were, and it\'s open. ':'The SSR sits in the elements\' return, where the thermostats were, and it\'s open: the elements\' line side is live whenever the machine is on, and the steam lamp, now the boiler lamp, is lit by a trickle through the elements. ')+(gc?'The parked stock connectors 3 and P3-4 are live whenever the machine is on; 2 goes live each time the SSR conducts and 1 each time the valve opens. Treat all four as live in every state and keep them insulated.':'The parked connector S5 sits on the switched neutral, so this picture never marks it live. It is still a mains conductor (at line voltage with a miswired outlet or a broken neutral), so keep it insulated.')+(m.pf?' Wire N shares the pump\'s fused terminal, so if the pump\'s 110 °C fuse opens the PCB loses its neutral.':'')],
      heat:['The boiler is below its target, so the PCB drives the SSR.',
        'J9 R1 sends a low-voltage signal through the SSR\'s control side and back on J9 GND. The SSR closes and current runs through the elements, by way of wires Sa and Sb and the jumper J that stands in for the brew thermostat.',
        gc?'This is by far the biggest current in the machine.':'With the SSR closed the boiler lamp goes dark. This is by far the biggest current in the machine.'],
      brew:['The brew switch is on.',
        (gc?'The switch now only joins J7 B to J7 GND, a low-voltage signal.':'One pole of the switch joins J7 B to J7 GND, a low-voltage signal. Its other pole still has the valve\'s feed on spade 5, so spades 5 and 4 are at line voltage while the valve is open.')+' The PCB powers the pump from J12 on wire P, and the 3-way valve from J13 on wire 3, which plugs onto the stock connector Pb.',
        'On stock wiring the valve\'s circuit still passes a pole of the steam switch, so the valve can only open while the steam switch is off. The PCB keeps pulsing the SSR to hold the temperature.'],
      steam:['The steam switch is on.',
        'One pole of the switch joins J7 S to J7 GND, and the PCB heats to the Steam Temperature setting. Its other pole, still on mains, breaks the 3-way valve\'s circuit.',
        'The pump stays off unless DreamSteam is on in the settings: then the PCB runs it from J12 to feed fresh water into the boiler, which this picture doesn\'t show.'],
      water:['Brew and steam switches on together: hot water mode.',
        'The PCB reads both signals and runs the pump from J12. The steam switch\'s mains pole holds the 3-way valve\'s circuit open, so the valve stays shut and the water leaves through the steam wand when you open the knob.',
        'The heater keeps pulsing to hold the temperature.']
    };
    return T[mode]||['','',''];
  }
  function text(m,mode){
    if(m.kind==='factory')return textFactory(m,mode);
    if(m.kind==='stock')return textStock(m,mode);
    var gc=m.gc,sh=m.shelly,lamp=gc?'the lamp in the switch housing':'the boiler lamp';
    var T={
      off:['The cord is in and the power switch is off.',
        sh?'Line still reaches the power socket, the Shelly and the power switch\'s input. The Shelly is powered all the time (that\'s how it hears the app and the switch), with its relay open.':'Line still reaches the power socket and the power switch\'s input (L1a-L1b), and stops at the open switch.',
        'Nothing past the '+(sh?'Shelly\'s relay':'switch')+' is powered'+(sh?', until the app or a schedule closes the relay, which can happen at any moment whatever the power switch says':'')+'. This assumes the outlet\'s line is on the socket\'s L pin: the '+(sh?'relay':'switch')+' breaks line only, so with a reversible plug or a miswired outlet the whole machine stays at line voltage with the switch off. Unplug before you touch anything.'],
      on:['The machine is on and the boiler is at temperature, so the PCB isn\'t asking for heat.',
        (sh?'The power switch tells the Shelly to close its relay, and line runs on':'Line passes the power switch')+' to the SSR\'s input, the PCB (J11) and '+(gc?'the lamp in the switch housing. The loose L4b spade is live whenever the machine is on':'the lamps')+'. The PCB runs on J11 and J10 and reads the thermocouple, the pressure sensor and the switches all the time.',
        (gc?'':'The power lamp is lit. ')+'The SSR is open, so '+lamp+' is lit: it sits across the SSR, and a trickle runs through it and the elements to neutral (the thin dots on the heater wires). Treat the heater wires as live even when the boiler isn\'t heating. The pump and valve wires are dimmed, but only the PCB\'s electronics hold them off.'],
      heat:['The boiler is below its target, so the PCB drives the SSR.',
        'J9 R1 sends a low-voltage signal through the SSR\'s control side and back on J9 GND. The SSR closes, and line runs through the 185 °C fuse into the elements and back to the socket on neutral. This is by far the biggest current in the machine.',
        'With the SSR closed, both leads of '+lamp+' are at line, so it goes dark. In use the PCB switches the SSR on and off in short pulses to hold the temperature, so the lamp can flicker as the boiler nears its target.'],
      brew:['The brew switch is on.',
        'The switch only joins J7 B to J7 GND: a low-voltage signal the PCB reads. The PCB then powers the 3-way valve from J13 and the pump from J12, changing the pump\'s power to follow the pressure or flow profile. Both return on neutral, the pump through its 110 °C thermal fuse.',
        'The PCB keeps pulsing the SSR to hold the temperature while water runs through. No mains passes through the brew switch any more.'],
      steam:['The steam switch is on.',
        'The switch joins J7 S to J7 GND'+(gc?'':' (through the jumper to the brew switch\'s ground spade)')+'. The PCB reads that and heats to the Steam Temperature setting instead of the brew temperature.',
        'The valve stays off. The pump stays off too unless DreamSteam is on in the settings: then the PCB runs it from J12 to feed fresh water into the boiler, which this picture doesn\'t show.'],
      water:['Brew and steam switches on together: hot water mode.',
        'The official manual says only that both switches together trigger Hot Water Mode, the same as a stock machine. As on a stock machine, the PCB runs the pump from J12 with the 3-way valve left closed (this site\'s reading), so the water leaves through the steam wand when you open the knob.',
        'The heater keeps pulsing to hold the temperature.']
    };
    return T[mode]||['','',''];
  }
  return {modes:MODES,model:model,text:text,nt:nt,pick:pick};
})();
