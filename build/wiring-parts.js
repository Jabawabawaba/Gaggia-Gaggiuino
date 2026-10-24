  /* ---------- what each part on the wiring map is ----------
     For the map's detail card: a line on what the part is and does, and one on what the Gaggiuino PCB does with it.
     v is the schematic on show (path SI or CW, family GC or GCP, volts). Stock connectors (f:...) carry their own
     note from wiring_map.py, so they only get the general line. */
  function partInfo(id,v){
    var si=v.path==='SI',gc=v.fam==='GC',w,p;
    if(/^f:/.test(id))return {w:'A connector from the machine\'s own harness. Mark it before you unplug it, so the install can be traced or undone.'};
    if(id==='s6')return {w:'A BN2 butt splice by the power switch, added with the Shelly: the Shelly\'s output (SH3) on one side, AC2 and AC3 on the other, where they used to share the power switch\'s spade 4.',p:'Everything after it, the PCB on J11 included, is off while the Shelly is off.'};
    if(/^s\d$/.test(id))return {w:'A crimped butt splice where runs join: BN1.25 for one wire a side, BN2 for two. Near the boiler it\'s bare, under silicone heat shrink.'};
    switch(id){
      case 'pcb':
        return {w:'The Gaggiuino board: the controller that takes over from the thermostats. Mains comes in on J10 (neutral) and J11 (line) and feeds its own 5 V supply and its pump and valve outputs.',
          p:'It reads the thermocouple on J4, the pressure sensor on J6 and the brew and steam switches on J7. It heats through the SSR on J9, runs the pump on J12 and opens the 3-way valve on J13. The screen talks to it on J1.'};
      case 'ssr':
        return {w:'A solid-state relay (SSR-40DA): an electronic switch with no moving contacts. A small DC signal on its two control screws switches mains through its two load screws. Its light shows when it\'s on.'+
            (si?' On stock wiring it takes over from the steam thermostat: Sa and Sb move onto its load screws.':' On custom wiring it sits in the heater line, feeding the elements through the boiler\'s thermal fuse.'),
          p:'The PCB drives it from J9 (R1 to +, GND to −), switching the heating elements on and off in pulses to hold the temperature it reads from the thermocouple.'};
      case 'tc':
        return {w:'An ungrounded K-type thermocouple, screwed into the brew thermostat\'s hole in the boiler. Ungrounded means its junction is insulated from the probe body.',
          p:'The PCB reads it on J4 and uses that temperature to decide when to pulse the SSR. It must be the ungrounded type because the PCB\'s 5 V side floats.'};
      case 'psens':
        return {w:'A pressure transducer, 0 to 12 bar (1.2 MPa), on a T-fitting in the pump-to-boiler line or a tap block at the group.',
          p:'The PCB powers it with 5 V and reads its signal on J6, then adjusts the pump to follow a pressure or flow profile.'};
      case 'pump':
        return {w:'The vibratory pump'+(gc&&si&&v.volts===230?' (the 230 V Classic\'s stock-integration drawing shows no pump fuse)':', with its 110 °C thermal fuse on the neutral side')+'. It pushes water from the tank into the boiler and on to the group or the wand.',
          p:'The PCB switches it from J12'+(si?' (wire P)':'')+' and lets through only part of each second\'s mains half-cycles, which sets the pressure and flow during a shot.'};
      case 'sol':
        return {w:'The 3-way solenoid valve. Open, it connects the boiler to the group; closed, it vents the group into the drip tray, so the portafilter comes off without spraying.',
          p:'The PCB opens it from J13'+(si?' (wire 3 onto Pb\'s stock lead)':'')+' for a shot or a flush, and closes it at the end.'};
      case 'boiler':
        return {w:'The boiler, with two heating elements ('+(v.volts===230?'in series at 230 V':'in parallel at 120 V')+') and the stock 184 °C one-shot thermal fuse on top. The brew thermostat\'s hole now holds the thermocouple.',
          p:'The PCB doesn\'t connect to it directly: it heats the elements through the SSR and reads the temperature through the thermocouple.'};
      case 'rf':
        return {w:'The optional 185 °C resettable thermal fuse, in the steam thermostat\'s hole. If the boiler ever overheats it cuts the heater; press its button to reset it once it\'s cool.',
          p:'The PCB doesn\'t see it: it\'s a safety cut-out in the heater line, behind the SSR.'};
      case 'screen':
        return {w:'The 4.3" touch screen, a small computer of its own: it draws the interface, keeps your profiles and settings, and runs the Wi-Fi network and the web page at gaggiuino.local.',
          p:'It talks to the PCB over a serial link on J1 (GND, TX, RX, 5V), which also powers it. Wire it by pin, not by colour.'};
      case 'sock':
        return {w:'The power inlet: line, neutral and earth come in here. Earth goes to the frame and the boiler.'+(v.shelly?' With the Shelly it moves into the Shelly\'s enclosure, and stays live whenever the cord is in.':''),
          p:'Mains reaches the PCB on J11 (line, after the '+(v.shelly?'Shelly\'s relay':'power switch')+') and J10 (neutral). Earth never connects to the PCB\'s 5 V side.'};
      case 'shelly':
        return {w:'A Shelly 1PM smart relay, an unofficial add-on: a Wi-Fi switch that turns the machine on and off from a phone or a schedule. Its relay breaks line to everything after it; the power switch now only signals it, through SW. It, its wires and the power switch are live whenever the cord is in, even with the machine off.',
          p:'The PCB doesn\'t know it\'s there: it simply powers up when the Shelly switches on. The machine\'s neutral doesn\'t run through it, only its own supply (SH2).'};
      case 'encl':
        return {w:'A closed enclosure outside the case for the Shelly and the socket, like fusio\'s printed one at the socket hole. Shelly rates the relay for 40 °C at most around it, and inside the machine it gets hotter than that.'};
      case 'chassis':
        return {w:'The chassis earth point: earth fixed to the frame, so any metal a fault could make live is held at earth.',p:'Earth never connects to the PCB\'s 5 V ground: that side floats, so the thermocouple reads true.'};
      case 'cup':
        return {w:'The cup warmer plate\'s earth wire. Reconnect it whenever the plate goes back on.'};
      case 'inl':
        return {w:'An inline spade joint at the pump\'s thermal fuse, on the neutral side, where the neutral runs meet.'};
      case 'swP':
        if(v.shelly)return {w:'The power switch, still on mains, but now only an input to the Shelly: AC1 brings line to spade 5 and SH4 takes it to the Shelly\'s SW terminal when it\'s on. Both stay live whenever the cord is in.',p:'The PCB has no input from it: it powers up when the Shelly switches the machine on.'};
        return {w:'The power switch, still on mains. '+(si?'Stock, it breaks both line and neutral.':'In custom wiring it breaks line only.'),p:'The PCB has no input from it: it simply powers up with the machine.'};
      case 'swB':
        return {w:'The brew switch. '+(si?'On stock wiring one pole carries a low-voltage signal to J7 B while its other spades still carry mains.':'In custom wiring it carries only the low-voltage signal to J7 B.'),
          p:'On, it joins J7 B to the 5 V ground and the PCB starts a shot: pump, valve and the profile you picked. Brew and steam on together start hot water mode.'};
      case 'swS':
        return {w:'The steam switch. '+(si?'On stock wiring one pole carries a low-voltage signal to J7 S while its other spades still carry mains.':'In custom wiring it carries only the low-voltage signal to J7 S.'),
          p:'On, it joins J7 S to the 5 V ground and the PCB heats to its steam setpoint through the SSR. Brew and steam on together start hot water mode.'};
      case 'housing':
        return {w:'The Classic\'s switch housing: power, steam and brew rockers in one block, with the lamps inside. '+(si?'On stock wiring, spades 1, 3, P(1-2) and P(3-4) carry the low-voltage signals; the rest stay on mains, and the parked connectors stay live.':'In custom wiring the brew and steam rockers carry only the low-voltage signals; the power rocker still switches mains.'),
          p:'Brew on starts a shot, steam on sends the PCB to its steam setpoint, and both together start hot water mode, all through J7.'};
      case 'lampP':
        return gc?{w:'The power lamp, inside the switch housing. '+(si?'It works as before.':'Custom wiring turns it into the boiler lamp.')}:{w:'The power lamp: it lights whenever the machine is on.'};
      case 'lampS':
        return {w:'The steam lamp, now a boiler lamp: it sits across the SSR, so it lights while the boiler isn\'t heating.'};
      case 'lampB':
        return {w:gc?'The internal boiler lamp. It stays dark now.':'The brew lamp. Unused now, it stays dark.'};
    }
    return null;
  }
