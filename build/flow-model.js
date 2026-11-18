/* What's inside the Gaggia's parts, for the electricity flow view (Plug-and-Play wiring only: the stock-wiring
   maps draw only the wires the install touches, so they can't show a whole circuit).
   FLOWM.modes -> [[id, label]]; FLOWM.model(v, mode) -> a FLOW.solve model plus {parts:{loadOrContactId: partId}}, or null. */
var FLOWM=(function(){
  function nt(t){return String(t||'').toLowerCase().replace(/\s*\([^)]*\)\s*$/,'')}
  var MODES=[['off','Plugged in, switch off'],['on','On, at temperature'],['heat','Heating'],['brew','Brewing'],['steam','Steaming'],['water','Hot water']];
  var STATE={off:{},on:{pw:1},heat:{pw:1,heat:1},brew:{pw:1,heat:1,brew:1,pump:1,valve:1},steam:{pw:1,heat:1,steam:1},water:{pw:1,heat:1,brew:1,steam:1,pump:1}};
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
    return {runs:runs,joins:joins,closed:closed,loads:loads,src:[{from:'power socket l',to:'power socket n',mains:true}].concat(lv),parts:parts,passive:{fuse:1,pfuse:1},state:st,shelly:sh,gc:v.fam==='GC'};
  }
  /* what to say about each state */
  function text(m,mode){
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
  return {modes:MODES,model:model,text:text,nt:nt};
})();
