  /* Steps the runbook ticks for you (progress-links.js, needs progress-store.js). Your Gaggia, the parts tracker, and
     the wire labels, cut list and power-on checks pages keep their own records in this browser; a step whose record
     says it's done counts as done in the runbook, with a line under it saying where that came from, and unticks again
     if the record changes. A step without a rule here is ticked by hand only.
     get(id) returns null for a step with no rule, or {on, t, go}: on is done, t the line under the step, and go where
     to change it ('machine' for Your Gaggia, or a page key and hash). */
  var PL=(function(){
    var TKEY='gaggia-parts-tracker-v1';
    function rd(k){try{var s=localStorage.getItem(k);return s?JSON.parse(s):null}catch(e){return null}}
    function GMx(){return window.GaggiaMachine||null}
    function prof(){var m=GMx();return (m&&m.get())||null}
    function mname(){var m=GMx(),p=prof();return p&&p.model?((m&&m.name()?m.name():'')+(p.volts?', '+p.volts+' V':'')):''}
    /* the tracker: a line's status (only the ones that mean it's on its way or here) and its pieces in hand */
    var STN={ordered:'Ordered',received:'Received',have:'Already have'};
    function tparts(){var s=rd(TKEY);return s&&s.parts&&typeof s.parts==='object'?s.parts:{}}
    function tst(id){var s=(tparts()[id]||{}).status;return STN[s]?s:null}
    function tgot(id,sub){var g=(tparts()[id]||{}).got;return !!(g&&g[sub]===true)}
    function inHand(id){var s=tst(id);return s==='received'||s==='have'}
    function fmtDate(ts){try{return new Date(ts).toLocaleDateString('en-US',{month:'short',day:'numeric'})}catch(e){return ''}}
    function andList(a){return a.length<2?a.join(''):a.slice(0,-1).join(', ')+' and '+a[a.length-1]}
    function prog(){return PS.read()}
    function vk(){return PS.vkFor(prof())}
    /* a line ordered or in hand, or every listed piece of it ticked off */
    function line(id,name,subs,need){
      var s=tst(id),pieces=(subs||[]).length&&subs.every(function(x){return tgot(id,x)});
      var on=need==='hand'?(inHand(id)||pieces):(!!s||pieces);
      return {on:on,t:on?('From the parts tracker: '+name+(s?' marked '+STN[s]:' ticked off')+'.'):('Ticks itself when the parts tracker shows '+name+(need==='hand'?' in hand':' ordered')+'.'),go:['tracker','#'+id]};
    }
    /* the cut list's tally for your schematic: [rows, ticked] for every run, and for the runs the Shelly adds or changes */
    function cut(which){
      var k=vk(),c=k&&(prog().cut||{})[k],t=c&&(which==='sh'?c.sh:c.all),w=which==='sh'?' wires the Shelly adds or changes':' wires';
      if(!k)return {on:false,t:'Ticks itself when every wire for your schematic is ticked on the cut list. Set your model, voltage and install path in Your Gaggia first.',go:'machine'};
      if(!t||!t[0])return {on:false,t:'Ticks itself when every '+(which==='sh'?'wire the Shelly adds or changes':'wire')+' for your schematic is ticked on the cut list.',go:['cut','']};
      var on=t[1]>=t[0];
      return {on:on,t:on?('From the cut list: all '+t[0]+w+' ticked.'):('Cut list so far: '+t[1]+' of '+t[0]+w+' ticked. This ticks itself when they all are.'),go:['cut','']};
    }
    /* the power-on checks' tally for your schematic, by section: [checks, passed, failed]; Covers on is h. It counts the
       newest run only, and only for this exact profile (a few checks follow the model or the Eco board, not just the
       schematic) and this site's current list of checks (PS.CV), so a run or a list it wasn't made for never counts. */
    function checks(withH){
      var k=vk(),c=prog().checks;
      if(!k)return {on:false,t:'Ticks itself when the power-on checks pass for your schematic. Set your model, voltage and install path in Your Gaggia first.',go:'machine'};
      if(c&&c.vk===k&&c.sig===PS.sig(prof())&&c.sec&&c.ver!==PS.CV)return {on:false,t:'The power-on checks have changed since the checks page last counted yours. Open it to count them again.',go:['checks','']};
      if(!c||c.vk!==k||c.sig!==PS.sig(prof())||!c.sec)return {on:false,t:'Ticks itself when '+(withH?'every power-on check, Covers on too,':'every power-on check up to Covers on')+' passes for your schematic.',go:['checks','']};
      var n=0,p=0,f=0;Object.keys(c.sec).forEach(function(s){if(s==='h'&&!withH)return;var x=c.sec[s];n+=x[0];p+=x[1];f+=x[2]});
      var on=n>0&&p>=n&&!f;
      return {on:on,t:on?('From the power-on checks: all '+n+' passed'+(withH?', Covers on too':' up to Covers on')+(c.run?' ('+c.run+')':'')+'.'):('Power-on checks so far: '+p+' of '+n+' passed'+(f?', '+f+' failed':'')+(withH?'':' up to Covers on')+'. This ticks itself when they all pass.'),go:['checks','']};
    }
    var RULES={
      p0v:function(){var p=prof(),on=!!(p&&p.model&&p.volts);return {on:on,t:on?('Set in Your Gaggia: '+mname()+'.'):'Ticks itself once Your Gaggia has your model and mains voltage.',go:'machine'}},
      p0p:function(){var p=prof(),on=!!(p&&p.path);return {on:on,t:on?('Set in Your Gaggia: '+(p.path==='SI'?'stock wiring':'Plug-and-Play wiring')+'.'):'Ticks itself once Your Gaggia has your install path.',go:'machine'}},
      p0e:function(){
        var p=prof()||{},eco=p.eco===true,cw=p.path==='CW',need=[];if(!eco)need.push('the Eco board');if(!cw)need.push('Plug-and-Play wiring as your install path');
        return {on:eco&&cw,t:eco&&cw?'Set in Your Gaggia: Eco board, Plug-and-Play wiring.':'Ticks itself once Your Gaggia has '+need.join(' and ')+'.',go:'machine'};
      },
      p0g:function(){return line('ground','the grounding retrofit',['inlet','cord','green'])},
      p0o:function(){return line('opv','the 12 bar OPV spring or M3 washers')},
      p0c:function(){
        var tape=tgot('conn','tape'),hand=inHand('conn');
        return {on:tape||hand,t:tape?'From the parts tracker: the silicone tape ticked off under Connectors and insulation.':hand?('From the parts tracker: Connectors and insulation, which includes the silicone tape, marked '+STN[tst('conn')]+'.'):'Ticks itself when the parts tracker shows the silicone tape in hand.',go:['tracker','#conn']};
      },
      p0s:function(){return line('shelly','the Shelly',['relay'])},
      p0k:function(){
        var s=prog().tracker,p=prof();
        if(!s||s.sig!==PS.sig(p))return {on:false,t:'Ticks itself when the parts tracker shows every part for your machine in hand. Open the tracker once to count them.',go:['tracker','']};
        /* a part the build needs, marked Not getting, keeps it open */
        var sk=Array.isArray(s.skip)?s.skip:[];
        if(sk.length)return {on:false,t:'Parts tracker: '+s.hand+' of '+s.n+' parts in hand, but '+andList(sk)+(sk.length>1?', parts the build needs, are':', a part the build needs, is')+' marked Not getting. This ticks itself once every part is in hand.',go:['tracker','']};
        var on=s.n>0&&s.hand>=s.n;
        return {on:on,t:on?('From the parts tracker: all '+s.n+' parts for your machine are in hand.'):('Parts tracker so far: '+s.hand+' of '+s.n+' parts in hand. This ticks itself when they all are.'),go:['tracker','']};
      },
      p0l:function(){
        var k=vk(),ts=k&&(prog().labels||{})[k];
        if(!k)return {on:false,t:'Ticks itself when you make the PDF on the wire labels page for your schematic. Set your model, voltage and install path in Your Gaggia first.',go:'machine'};
        return {on:!!ts,t:ts?('From the wire labels page: PDF made '+fmtDate(ts)+'.'):'Ticks itself when you make the PDF on the wire labels page for your schematic.',go:['labels','']};
      },
      p2w:function(){return cut('all')},
      p2h:function(){return cut('all')},
      p2s:function(){return cut('sh')},
      p4z:function(){return checks(false)},
      p5b:function(){return checks(true)}
    };
    function get(id){var r=RULES[id];return r?r():null}
    /* the records to watch for changes made in another tab */
    var KEYS=[TKEY,PS.KEY,'gaggia-machine-v1'];
    return {get:get,has:function(id){return !!RULES[id]},KEYS:KEYS};
  })();
