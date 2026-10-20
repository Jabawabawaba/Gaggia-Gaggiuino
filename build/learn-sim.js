  /* ---------- run the machine ----------
     A stock machine, switched by hand, with its insides drawn live. Everything shown comes out of a small physical
     model stepped every 50 ms of machine time:
       - the boiler body, where the elements and thermostats sit, and the water in it, as two temperatures;
       - the group and the portafilter, warmed by the boiler and by water running through them;
       - the pump against whatever it's pushing into (group, puck, wand), capped by the over-pressure valve;
       - the steam valve, the tank, the drip tray, a cup and a milk jug.
     The switching is the stock circuit, the same as the ladder further down: heating runs while the steam thermostat
     and either the brew thermostat or the steam switch are closed; the pump runs with the brew switch; the 3-way valve
     opens with the brew switch only while the steam switch is off. Lamps: Pro family, each ready lamp lights while its
     thermostat is open; original Classic, one ready lamp lights whenever heating stops.
     Figures: thermostats open at %%BREW_OPEN%% and %%STEAM_OPEN%% °C; elements 1370 W at 120 V, 1200 W at 230 V; boiler about 100 ml
     (brass on the E24, heavier, so slower to heat); OPV 11 bar, 9 on US Evo Pros and E24s, about 14 on the original
     Classic; tank 2.1 l; drip tray about 475 ml. Heat-transfer figures are tuned, not measured: about 70 s to the
     first ready lamp, 10 to 15 minutes for the group to soak, roughly 20 s from brew to steam ready. */
  (function(){
    var root=$('sim');if(!root)return;
    var NS='http://www.w3.org/2000/svg';
    function mk(tag,a,p){var e=document.createElementNS(NS,tag);for(var k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}
    function cl(v,a,b){return v<a?a:v>b?b:v}
    function lerp(a,b,t){return a+(b-a)*t}
    function mix(a,b,t){t=cl(t,0,1);return [lerp(a[0],b[0],t),lerp(a[1],b[1],t),lerp(a[2],b[2],t)]}
    function rgb(c){return 'rgb('+Math.round(c[0])+','+Math.round(c[1])+','+Math.round(c[2])+')'}
    /* set an attribute only when it changes */
    function sa(e,k,v){v=String(v);var key='_'+k;if(e[key]!==v){e[key]=v;e.setAttribute(k,v)}}
    function ss(e,k,v){v=String(v);var key='__'+k;if(e[key]!==v){e[key]=v;e.style[k]=v}}
    function tog(e,c,on){if(e.classList.contains(c)!==!!on)e.classList.toggle(c,!!on)}
    function psat(T){return 0.0061121*Math.exp((18.678-T/234.5)*(T/(257.14+T)))}   /* bar absolute (Buck) */
    var TA=21,TT=21,DT=0.05,BREW_OPEN=%%BREW_OPEN%%,BREW_CLOSE=%%BREW_CLOSE%%,STEAM_OPEN=%%STEAM_OPEN%%,STEAM_CLOSE=%%STEAM_CLOSE%%;

    /* ---- the machine you picked ---- */
    var K={},S=null,HOOKS=[];
    /* the coach (learn-coach.js) listens: each step of machine time, each control used, a start over */
    function emit(a,b,c){for(var i=0;i<HOOKS.length;i++)try{HOOKS[i](a,b,c)}catch(err){}}
    function setup(){
      var p=prof(),m=GM(),md=p.model||'GCP';
      K.gc=md==='GC';K.e24=md==='E24';
      K.P=p.volts===230?1200:1370;
      K.opv=K.gc?14:(m&&m.matches&&m.matches('opv9')&&m.decided('opv9')?9:11);
      K.full=K.e24?105:100;K.Cb=K.e24?900:560;
      root.classList.toggle('gc',K.gc);
      /* the E24's boiler is lead-free brass; the Evo's and E24's groups are plain brass */
      $('x-bbody').setAttribute('fill',K.e24?'url(#sx-brassb)':'url(#sx-alu)');
      $('x-gbody').setAttribute('fill',md==='EVO'||md==='E24'?'url(#sx-brassb)':'url(#sx-chrome)');
      if(S)S.vol=Math.min(S.vol,K.full);
    }
    function fresh(){
      return {t:0,pwr:0,brew:0,steam:0,knob:0,Tb:TA,Tw:TA,Tg:TA,Tpf:TA,vol:K.full,brewC:1,steamC:1,glow:0,heat:false,pumpOn:false,
        P:0,tank:2100,drip:0,puddle:0,air:0,airT:0,prime:0,vent:0,sol:false,fill:0,
        pf:{in:1,b:'empty',wet:0,Sr:0,S0:4,E:0},
        cup:{pos:'warm',v:0,s:0,T:TA,Tc:TA,Ew:0,EwT:0,cr:0},
        jug:{pos:'away',m:150,w:0,T:5,foam:0,used:0},
        lamp:{pwr:false,brew:false,steam:false},q:{}};
    }
    /* what the group pushes against, in bar per ml/s */
    function rGroup(){
      var p=S.pf;
      if(!p.in)return 0.12;
      if(p.b==='empty')return 0.25;
      if(p.wet<26)return 0.35;              /* filling the space over the puck and soaking it */
      if(p.b==='spent')return 1.0;
      return 5+2.5*(p.Sr/p.S0);             /* a fresh puck, opening up as it extracts */
    }
    function toCup(v,dE,T,P){
      var c=S.cup,a=Math.min(v,Math.max(0,80-c.v));S.drip+=v-a;if(a<=0)return;
      var f=a/v;c.T=(c.T*c.v+T*a)/(c.v+a);c.v+=a;c.s+=dE*f;
      if(dE>0){c.Ew+=dE*f;c.EwT+=dE*f*T;if(P>6)c.cr+=dE*f}
    }

    /* ---- one step of machine time ---- */
    function step(dt){
      var s=S,full=K.full,q={intake:0,pumpout:0,opvret:0,boilout:0,exhaust:0,spout:0,group:0,mS:0,qW:0,c:0,flash:0,pour:0,Tout:s.Tw,fill:0};
      s.t+=dt;
      var fed=!!s.pwr;
      if(s.Tb>=BREW_OPEN)s.brewC=0;else if(s.Tb<=BREW_CLOSE)s.brewC=1;
      if(s.Tb>=STEAM_OPEN)s.steamC=0;else if(s.Tb<=STEAM_CLOSE)s.steamC=1;
      var tbN=s.brewC||s.steam,heat=fed&&!!s.steamC&&!!tbN,pump=fed&&!!s.brew,sol=pump&&!s.steam;
      s.heat=heat;s.pumpOn=pump;
      s.lamp=K.gc?{pwr:fed,brew:fed&&!heat,steam:false}:{pwr:fed,brew:fed&&!!s.steamC&&!s.brewC&&!s.steam,steam:fed&&!s.steamC&&!!tbN};
      /* the 3-way valve dropping shut vents what's left over the puck down to the drip tray */
      if(s.sol&&!sol){
        if(s.P>0.4)s.vent+=s.pf.in?(s.pf.b==='empty'?3:7):2;
        if(s.pf.in&&s.pf.b==='dosed'&&s.pf.wet>8)s.pf.b='spent';
      }
      s.sol=sol;
      var head=s.vol<full-0.3,Ps=Math.max(0,psat(s.Tw)-1.013),qp=0,qOpv=0,qG=0,qW=0,mS=0,fillIn=0;
      if(pump){
        var wet=s.tank>0.5;
        if(!wet){s.airT+=dt;if(s.airT>2)s.air=1}else s.airT=0;
        var qmax=wet?7.5:0;
        /* air in the pump moves nothing against a puck or a shut valve; pumped out of the open wand it clears */
        if(s.air&&wet){if(s.knob){s.prime+=dt;qmax=3;if(s.prime>4){s.air=0;s.prime=0}}else qmax=0}
        if(head&&qmax>0){
          /* a boiler with a steam pocket fills first: cold water collapses the pocket */
          fillIn=Math.min(qmax*dt,full-s.vol);qp=fillIn/dt;
          s.P=lerp(s.P,Ps,Math.min(1,dt/0.3));
        }else if(qmax>0){
          var gG=sol?1/rGroup():0,gW=s.knob?1/0.6:0,lo=0,hi=15;
          for(var i=0;i<22;i++){var mid=(lo+hi)/2;if(qmax*(1-mid/15)-(gG+gW)*mid-Math.max(0,mid-K.opv)/0.04>0)lo=mid;else hi=mid}
          var tau=gG+gW===0?0.35:(sol&&s.pf.in&&s.pf.b!=='empty'&&s.pf.wet>=26?0.9:0.25);
          s.P+=((lo+hi)/2-s.P)*Math.min(1,dt/tau);
          qp=qmax*(1-s.P/15);qOpv=Math.min(qp,Math.max(0,s.P-K.opv)/0.04);qG=gG*s.P;qW=gW*s.P;
          var room=qp-qOpv;if(qG+qW>room&&qG+qW>0){var f=room/(qG+qW);qG*=f;qW*=f}
        }else s.P=lerp(s.P,0,Math.min(1,dt/0.3));
        s.tank=Math.max(0,s.tank-(qp-qOpv)*dt);
      }else{s.P=lerp(s.P,0,Math.min(1,dt/0.25));s.airT=0}
      q.intake=qp;q.pumpout=qp-qOpv;q.opvret=qOpv;q.fill=fillIn/dt;
      /* the steam valve open with nothing pumped through it: hot water while the boiler is full to the top, then steam */
      if(s.knob&&qW===0&&s.vol>0.5&&s.Tw>100.3){
        if(s.vol>=full*0.97&&!fillIn){qW=Math.min(5,0.2+4*Ps);s.vol-=qW*dt}
        else{mS=0.35*Ps;var carry=s.vol>full*0.6?1.4*mS:0;qW=carry;s.vol-=(mS+carry)*dt}
        if(s.vol<0)s.vol=0;
      }
      /* through the group and the portafilter: the brass takes heat from hotter water and gives it to cooler */
      var Tout=s.Tw;
      if(qG>0){
        var cq=qG*4.19,d=(Tout-s.Tg)*(1-Math.exp(-2/cq));Tout-=d;s.Tg+=cq*d*dt/550;
        if(s.pf.in){var d2=(Tout-s.Tpf)*(1-Math.exp(-1.2/cq));Tout-=d2;s.Tpf+=cq*d2*dt/260}
        q.flash=Tout>100.5?cl((Tout-100)/12,0.2,1):0;q.Tout=Tout;
        if(s.pf.in&&s.pf.b!=='empty'&&s.pf.wet<26){s.pf.wet+=qG*dt}
        else{
          var v=qG*dt,dE=0;
          if(s.pf.in&&s.pf.b==='dosed'){
            var kT=cl((Tout-68)/24,0.15,1.6);dE=Math.min(s.pf.Sr,0.11*kT*s.pf.Sr*dt);s.pf.Sr-=dE;s.pf.E+=dE;
          }
          q.c=dE/v;
          if(s.pf.in)q.spout=qG;else q.group=qG;
          if(s.cup.pos==='tray')toCup(v,dE,Tout,s.P);else s.drip+=v;
        }
      }
      q.boilout=qG;q.qW=qW;q.mS=mS;
      /* out of the wand: into the milk, or into the drip tray */
      if(qW>0||mS>0){
        var j=s.jug;
        if(j.pos==='wand'){
          if(qW>0){var tot=j.m+j.w;j.T=(j.T*tot+Math.min(s.Tw,99)*qW*dt)/(tot+qW*dt);j.w+=qW*dt;j.used=1}
          if(mS>0){j.T+=mS*(2257+4.19*(100-j.T))*dt/((j.m+j.w)*3.9);j.w+=mS*dt;if(j.T<38)j.foam=Math.min(j.m*0.55,j.foam+mS*dt*14);j.used=1}
          var over=j.m+j.w+j.foam*0.35-330;if(over>0){var lose=Math.min(over,j.w);j.w-=lose;s.drip+=over}
        }else s.drip+=qW*dt;
      }
      if(s.vent>0){var vr=Math.min(s.vent,6*dt);s.vent-=vr;s.drip+=vr;q.exhaust=vr/dt}
      /* heat: elements into the body, body into the water, the group and the room; cold water in; steam out */
      var Cw=Math.max(4,s.vol)*4.19,h=80*cl(s.vol/(0.6*full),0.12,1),Qbw=h*(s.Tb-s.Tw),Qbg=2.0*(s.Tb-s.Tg),Qba=1.1*(s.Tb-TA);
      s.Tb+=((heat?K.P:0)-Qbw-Qbg-Qba)*dt/K.Cb;
      s.Tw+=Qbw*dt/Cw;
      /* cold water in: it runs along the hot aluminum on its way in and takes heat from it, then mixes */
      var vin=(pump?(qG+qW)*dt:0)+fillIn;
      if(vin>0){var cin=vin/dt*4.19,Tin=TT+(s.Tb-TT)*(1-Math.exp(-25/cin));s.Tb-=vin*4.19*(Tin-TT)/K.Cb;s.Tw+=(Tin-s.Tw)*Math.min(1,vin/Math.max(4,s.vol+fillIn))}
      if(fillIn)s.vol=Math.min(full,s.vol+fillIn);
      if(mS>0)s.Tw-=mS*2257*dt/Cw;
      if(s.vol<1)s.Tw=lerp(s.Tw,Math.min(s.Tb,100),Math.min(1,dt));
      s.Tg+=(Qbg-0.5*(s.Tg-TA)-(s.pf.in?2*(s.Tg-s.Tpf):0))*dt/550;
      s.Tpf+=((s.pf.in?2*(s.Tg-s.Tpf):0)-(s.pf.in?0.5:0.9)*(s.Tpf-TA))*dt/260;
      var c=s.cup,warmT=TA+(s.Tb-TA)*0.3;
      c.Tc+=((c.pos==='warm'?(warmT-c.Tc)*0.9:(TA-c.Tc)*0.25)+(c.v>0?1.5*(c.T-c.Tc):0))*dt/300;
      if(c.v>0)c.T+=(-1.5*(c.T-c.Tc)-0.25*(c.T-TA))*dt/(c.v*4.19);
      var jj=s.jug;jj.T+=(TA-jj.T)*0.3*dt/((jj.m+jj.w)*3.9);
      if(s.drip>475){s.puddle+=s.drip-475;s.drip=475}
      if(s.fill>0){var a=Math.min(s.fill,600*dt);s.tank=Math.min(2100,s.tank+a);s.fill-=a;q.pour=1;if(s.tank>=2100)s.fill=0}
      s.glow+=((heat?1:0)-s.glow)*Math.min(1,dt/2.5);
      s.q=q;
      if(HOOKS.length)emit('step',s,dt);
    }

    /* ---- drawing ---- */
    var E={};
    ['f-sw-pwr','f-sw-brew','f-sw-steam','f-gsw-pwr','f-gsw-brew','f-gsw-steam','f-lp-pwr','f-lp-brew','f-lp-steam','f-knobp','f-pf','f-pfout','f-pfgr','f-pfbasket',
     'f-cup','f-cupvap','f-jug','f-thn','f-gs1','f-gs2','f-gs3','f-ss1','f-ss2','f-ws','f-trayw','f-puddle','f-hhr','f-hmin','f-hsec','f-puffs',
     'x-tankw','x-tanks','x-lid','x-pour','x-pumpv','x-piston','x-pcoil','x-opvplug','x-opvplug-gc','x-bwater','x-bsurf','x-bhead','x-bub','x-elem','x-glow',
     'x-tbb','x-tsb','x-gheat','x-vcoil','x-vpl','x-vsin','x-vsex','x-vcav','x-rain','x-pf','x-pfw','x-puck','x-cup','x-cupl','x-crema','x-cupvap',
     'x-trayw','x-knobp','x-jug','x-milk','x-foam','x-mbub','x-thn','x-pipes','x-flows','x-parts'].forEach(function(id){E[id]=$(id)});
    var xwd=root.querySelector('.simx .xwd');
    /* pipes: a wall, a bore whose colour says what's inside, and dashes that move with the flow */
    var PIPES={
      intake:'M585,330 V374 H448 V362',
      pumpout:'M426,237 H416 V150 H331',
      pumpoutgc:'M448,254 V237 H416 V150 H331',
      opvret:'M448,220 V48 H540 V74',
      opvretgc:'M357,139 V48 H540 V74',
      boilout:'M318,222 V306 H364 V298',
      togroup:'M336,266 H240 V281',
      exhaust:'M364,198 V172 H400 V401',
      steam:'M172,97 V66 H107',
      wand:'M89,82 V250 L60,300 V334'
    };
    var P={};
    Object.keys(PIPES).forEach(function(k){
      P[k]={w:mk('path',{d:PIPES[k],'class':'xp-w'},E['x-pipes']),b:mk('path',{d:PIPES[k],'class':'xp-b'},E['x-pipes']),f:mk('path',{d:PIPES[k],'class':'xf'},E['x-flows']),o:0};
    });
    var XS={spout:mk('path',{d:'M240,326 V352','class':'xf'},E['x-flows']),wtip:mk('path',{d:'M60,334 V398','class':'xf'},E['x-flows'])};
    XS.spout.o=0;XS.wtip.o=0;
    var rain=Array.prototype.slice.call(E['x-rain'].querySelectorAll('line'));
    function Pool(parent,n,cls){this.a=[];for(var i=0;i<n;i++)this.a.push({e:mk('circle',{r:0,cx:-40,cy:-40,'class':cls},parent),on:false});this.acc=0}
    Pool.prototype.spawn=function(x,y,vx,vy,r0,r1,L,o){for(var i=0;i<this.a.length;i++){var p=this.a[i];if(!p.on){p.on=true;p.l=0;p.L=L;p.x=x;p.y=y;p.vx=vx;p.vy=vy;p.r0=r0;p.r1=r1;p.o=o==null?1:o;return}}};
    Pool.prototype.emit=function(rate,dt,fn){this.acc+=rate*dt;var n=0;while(this.acc>=1&&n<8){this.acc-=1;fn(this);n++}if(this.acc>3)this.acc=0};
    Pool.prototype.tick=function(dt,ymin){for(var i=0;i<this.a.length;i++){var p=this.a[i];if(!p.on)continue;p.l+=dt;
      if(p.l>=p.L||(ymin!=null&&p.y<ymin)){p.on=false;sa(p.e,'r',0);continue}
      p.x+=p.vx*dt;p.y+=p.vy*dt;var t=p.l/p.L;sa(p.e,'cx',p.x.toFixed(1));sa(p.e,'cy',p.y.toFixed(1));sa(p.e,'r',lerp(p.r0,p.r1,t).toFixed(1));sa(p.e,'opacity',(p.o*(1-t*t)).toFixed(2))}};
    Pool.prototype.clear=function(){this.a.forEach(function(p){p.on=false;sa(p.e,'r',0)})};
    var fPuff=new Pool(E['f-puffs'],26,'puff'),xPuff=new Pool(E['x-parts'],26,'puff'),bub=new Pool(E['x-bub'],22,'bub'),mbub=new Pool(E['x-mbub'],10,'bub');

    var WATER=[150,200,236],GOOD=[80,45,22],SOUR=[156,110,54],BITTER=[40,29,24];
    function waterCol(T){return T<60?mix([108,174,230],[142,190,228],(T-20)/40):T<90?mix([142,190,228],[206,196,184],(T-60)/30):T<102?mix([206,196,184],[234,172,132],(T-90)/12):mix([234,172,132],[240,128,78],(T-102)/30)}
    function coffeeCol(T,c){var base=T<90?mix(GOOD,SOUR,(90-T)/7):mix(GOOD,BITTER,(T-96)/5);return mix(WATER,base,0.25+0.75*cl(c/0.07,0,1))}
    function boreCol(kind,T,Pb){
      if(kind==='air')return 'rgba(196,203,209,.5)';
      if(kind==='steam')return 'rgb(238,242,246)';
      var c=waterCol(T);if(Pb>0.3)c=mix(c,[36,92,170],cl(Pb/12,0,1)*0.75);return rgb(c);
    }
    /* moving dashes: faster with more flow */
    function flow(el,rate,dtv,col){
      var on=rate>0.03;ss(el,'opacity',on?1:0);if(!on)return;
      if(col)ss(el,'stroke',col);
      if(!RM){el.o=(el.o||0)-dtv*(14+11*Math.min(rate,8));sa(el,'stroke-dashoffset',el.o.toFixed(1))}
    }
    function pipe(k,kind,T,Pb,rate,dtv){
      var p=P[k];ss(p.b,'stroke',boreCol(kind,T,Pb));
      flow(p.f,rate,dtv,kind==='steam'?'#8E9AA5':'rgba(255,255,255,.92)');
    }

    var shown=false;
    function render(dtr){
      var s=S,q=s.q||{},j=s.jug,c=s.cup,pf=s.pf,dtv=RM?0:Math.min(dtr,0.1)*(0.7+0.3*Math.sqrt(speed));
      /* front: switches, lamps, knob */
      ['pwr','brew','steam'].forEach(function(k){
        [E['f-sw-'+k],E['f-gsw-'+k]].forEach(function(e){if(!e)return;tog(e,'on',s[k]);sa(e,'aria-pressed',s[k]?'true':'false')});
        var lp=E['f-lp-'+k];if(lp){var lit=!!s.lamp[k];if(lp.classList.contains('on')!==lit){tog(lp,'on',lit);sa(lp,'aria-label',lp.getAttribute('aria-label').replace(/, (on|off)$/,lit?', on':', off'))}}
      });
      tog(E['f-gsw-pwr'],'lit',s.lamp.pwr);tog(E['f-gsw-brew'],'lit',s.lamp.brew);
      ss(E['f-knobp'],'transform',s.knob?'rotate(-110deg)':'rotate(0deg)');ss(E['x-knobp'],'transform',s.knob?'rotate(-110deg)':'rotate(0deg)');
      sa($('f-knob'),'aria-pressed',s.knob?'true':'false');
      /* portafilter, cup, jug */
      ss(E['f-pf'],'display',pf.in?'':'none');ss(E['f-pfout'],'display',pf.in?'none':'');
      ss(E['f-pfgr'],'display',pf.b==='empty'?'none':'');tog(E['f-pfbasket'],'spent',pf.b==='spent');
      sa(E['f-cup'],'transform',c.pos==='tray'?'translate(280 391)':'translate(172 31) scale(.8)');
      sa(E['f-jug'],'transform',j.pos==='wand'?'translate(378 391)':'translate(492 448)');
      var thA=-130+cl(j.T,0,100)*2.6;
      sa(E['f-thn'],'transform','rotate('+thA.toFixed(1)+' 10 -96)');sa(E['x-thn'],'transform','rotate('+thA.toFixed(1)+' 36 312)');
      var cupHot=c.v>3?cl((c.T-48)/30,0,1):0;ss(E['f-cupvap'],'opacity',cupHot.toFixed(2));ss(E['x-cupvap'],'opacity',cupHot.toFixed(2));
      /* streams on the front */
      var endY=c.pos==='tray'?351:388,gw=q.group||0,sw=q.spout||0;
      ['f-gs1','f-gs2','f-gs3'].forEach(function(id,i){var e=E[id];sa(e,'d','M'+(264+16*i)+',247 V'+endY);sa(e,'stroke-width',(1.4+gw*0.34).toFixed(2));flow(e,gw,dtv)});
      var scol=pf.b==='empty'||!q.c?'#7FBDEB':rgb(coffeeCol(q.Tout||93,q.c));
      ['f-ss1','f-ss2'].forEach(function(id,i){var e=E[id];sa(e,'d','M'+(272+16*i)+',282 V'+endY);sa(e,'stroke-width',(1.6+sw*0.7).toFixed(2));flow(e,sw,dtv,scol)});
      var wOut=j.pos==='wand'?0:(q.qW||0);sa(E['f-ws'],'stroke-width',(1.6+wOut*0.5).toFixed(2));sa(E['f-ws'],'d',K.gc?'M382,332 V388':'M380.5,333 V388');flow(E['f-ws'],wOut,dtv);
      /* nudges, no words: an empty tank, a full drip tray, a spent puck waiting to be knocked out */
      tog($('x-tank'),'need',s.tank<150&&s.fill<=0);tog($('f-tray'),'need',s.drip>430||s.puddle>0);tog($('x-tray'),'need',s.drip>430||s.puddle>0);
      tog(E['f-pfbasket'],'need',!pf.in&&pf.b==='spent');
      ss(E['f-trayw'],'opacity',cl((s.drip-300)/175,0,0.75).toFixed(2));
      sa(E['f-puddle'],'rx',Math.min(120,s.puddle*0.6).toFixed(1));sa(E['f-puddle'],'ry',Math.min(6,s.puddle*0.04).toFixed(1));
      /* the clock: a quarter to eight plus however long you've been at it */
      var tt=27720+s.t;
      sa(E['f-hsec'],'transform','rotate('+((tt%60)*6).toFixed(1)+')');sa(E['f-hmin'],'transform','rotate('+((tt/60%60)*6).toFixed(1)+')');sa(E['f-hhr'],'transform','rotate('+((tt/3600%12)*30).toFixed(1)+')');

      /* inside: tank */
      var th=s.tank/2100*234,ty=330-th;sa(E['x-tankw'],'y',ty.toFixed(1));sa(E['x-tankw'],'height',th.toFixed(1));sa(E['x-tanks'],'d','M500,'+ty.toFixed(1)+' H628');
      ss(E['x-lid'],'transform',s.fill>0?'rotate(-18deg)':'rotate(0deg)');ss(E['x-pour'],'opacity',q.pour?1:0);
      if(q.pour&&!RM){E['x-pour'].o=(E['x-pour'].o||0)-dtv*60;sa(E['x-pour'],'stroke-dashoffset',E['x-pour'].o.toFixed(1))}
      /* pump: buzzing, harder when it has nothing to push */
      var dry=s.pumpOn&&(s.tank<=0.5||s.air);
      if(s.pumpOn&&!RM){var amp=dry?1.8:0.9;sa(E['x-pumpv'],'transform','translate('+((Math.random()-0.5)*amp*2).toFixed(2)+' '+((Math.random()-0.5)*amp).toFixed(2)+')');sa(E['x-piston'],'transform','translate(0 '+(Math.random()<0.5?-5:3)+')')}
      else{sa(E['x-pumpv'],'transform','');sa(E['x-piston'],'transform','')}
      tog(E['x-pcoil'],'on',s.pumpOn);
      var lift=cl((s.P-K.opv+0.4)*8,0,5);sa(E['x-opvplug'],'transform','translate(0 '+(-lift).toFixed(1)+')');sa(E['x-opvplug-gc'],'transform','translate(0 '+(-lift).toFixed(1)+')');
      /* boiler: level, temperature, the steam pocket, bubbles; elements glowing */
      var f=cl(s.vol/K.full,0,1),wh=f*98,wy=208-wh;
      sa(E['x-bwater'],'y',wy.toFixed(1));sa(E['x-bwater'],'height',wh.toFixed(1));ss(E['x-bwater'],'fill',rgb(waterCol(s.Tw)));
      sa(E['x-bsurf'],'d','M164,'+wy.toFixed(1)+' H316');ss(E['x-bsurf'],'opacity',f<0.995?1:0);
      ss(E['x-bhead'],'opacity',s.Tw>100?1:0.55);
      var dryHot=s.vol<25&&s.heat;
      ss(E['x-elem'],'stroke',rgb(mix([110,90,62],dryHot?[255,70,40]:[255,138,42],s.glow)));
      ss(E['x-elem'],'filter',s.glow>0.25?'drop-shadow(0 0 '+(3+s.glow*3).toFixed(1)+'px #FF8A2A)':'none');
      sa(E['x-glow'],'opacity',(s.glow*(dryHot?0.75:0.45)).toFixed(2));
      sa(E['x-tbb'],'transform',s.brewC?'':'rotate(-30 -7 -9)');sa(E['x-tsb'],'transform',s.steamC?'':'rotate(-30 -7 -9)');
      if(!RM){
        var boil=(s.Tw>98.5&&s.heat?5:0)+(q.mS>0?30*q.mS:0)+(q.fill>0&&s.Tw>100?8:0);
        if(f>0.05)bub.emit(boil,dtr,function(p){p.spawn(172+Math.random()*136,204,0,-(28+Math.random()*24),1.2,2.6,3)});
        bub.tick(dtr,wy+2);
      }
      /* group, valve, portafilter */
      sa(E['x-gheat'],'opacity',cl((s.Tg-25)/150,0,0.42).toFixed(2));
      tog(E['x-vcoil'],'on',s.sol);tog(xwd,'on',s.sol);ss(E['x-vpl'],'transform',s.sol?'translateY(-20px)':'translateY(0px)');
      ss(E['x-vsin'],'opacity',s.sol?0:1);ss(E['x-vsex'],'opacity',s.sol?1:0);
      ss(E['x-vcav'],'fill',boreCol('water',s.Tw,s.sol?s.P:0));
      var rainOn=(q.group||0)+(q.spout||0)+(s.sol&&pf.in&&pf.b!=='empty'&&pf.wet<26?1:0);
      var rEnd=pf.in?289:(c.pos==='tray'?352:400);
      rain.forEach(function(l){sa(l,'y2',rEnd);ss(l,'opacity',rainOn>0.05?0.9:0);if(rainOn>0.05&&!RM){l.o=(l.o||0)-dtv*40;sa(l,'stroke-dashoffset',l.o.toFixed(1))}});
      ss(E['x-pf'],'display',pf.in?'':'none');
      var ph=pf.b==='empty'?0:(pf.b==='spent'?8:10);sa(E['x-puck'],'y',(307-ph).toFixed(1));sa(E['x-puck'],'height',ph);
      ss(E['x-puck'],'fill',pf.b==='spent'?'#2E1D12':rgb(mix([96,62,36],[52,32,18],cl(pf.wet/26,0,1))));
      var pw=pf.in&&pf.b!=='empty'&&(s.sol||s.vent>0)?(pf.wet<26?cl(pf.wet/26,0,1)*10:10):(pf.in&&pf.b==='empty'&&(q.spout||0)>0?20:0);
      sa(E['x-pfw'],'y',(307-ph-Math.min(pw,20-ph)).toFixed(1));sa(E['x-pfw'],'height',Math.min(pw,20-ph).toFixed(1));ss(E['x-pfw'],'opacity',pw>0?0.6:0);
      /* cup: level, colour from how the shot went, crema */
      ss(E['x-cup'],'display',c.pos==='tray'?'':'none');
      var ch=c.v/80*40,cy=394-ch,Tq=c.Ew>0?c.EwT/c.Ew:93,conc=c.v>0?c.s/c.v:0;
      sa(E['x-cupl'],'y',cy.toFixed(1));sa(E['x-cupl'],'height',(ch+4).toFixed(1));ss(E['x-cupl'],'fill',conc>0.002?rgb(coffeeCol(Tq,conc)):rgb(WATER));
      var crq=Tq>=86&&Tq<=99?1:0.4,crh=c.v>2?cl(c.cr/1.6,0,1)*5*crq:0;
      sa(E['x-crema'],'y',cy.toFixed(1));sa(E['x-crema'],'height',crh.toFixed(1));
      ss(E['x-crema'],'fill',rgb(Tq<89?[214,182,124]:Tq>97?[118,74,42]:[196,138,80]));
      var sEnd=c.pos==='tray'?Math.max(354,cy):400;
      sa(XS.spout,'d','M240,326 V'+sEnd.toFixed(1));sa(XS.spout,'stroke-width',(1.5+sw*0.6).toFixed(2));flow(XS.spout,sw,dtv,scol);
      /* drip tray */
      var dh=s.drip/475*16;sa(E['x-trayw'],'y',(422-dh).toFixed(1));sa(E['x-trayw'],'height',dh.toFixed(1));
      /* jug: milk, foam, temperature */
      ss(E['x-jug'],'display',j.pos==='wand'?'':'none');
      var mh=(j.m+j.w)/330*69,fh=j.foam/330*69,my=399-mh;
      sa(E['x-milk'],'y',my.toFixed(1));sa(E['x-milk'],'height',(mh+2).toFixed(1));sa(E['x-foam'],'y',(my-fh).toFixed(1));sa(E['x-foam'],'height',fh.toFixed(1));
      ss(E['x-milk'],'fill',rgb(mix(mix([244,240,230],[176,196,210],cl((j.w/(j.m+j.w)-0.08)*3,0,0.7)),[226,204,160],cl((j.T-72)/14,0,1))));
      var wEnd=j.pos==='wand'?my-fh:400;
      sa(XS.wtip,'d','M60,334 V'+Math.max(336,wEnd).toFixed(1));sa(XS.wtip,'stroke-width',(2+(q.qW||0)*0.4).toFixed(2));flow(XS.wtip,j.pos==='wand'?0:(q.qW||0),dtv,'#5FA8E0');
      /* pipes */
      var pro=!K.gc,po=pro?'pumpout':'pumpoutgc',ret=pro?'opvret':'opvretgc';
      ss(P.pumpout.w,'display',pro?'':'none');ss(P.pumpout.b,'display',pro?'':'none');ss(P.pumpoutgc.w,'display',pro?'none':'');ss(P.pumpoutgc.b,'display',pro?'none':'');
      ss(P.opvret.w,'display',pro?'':'none');ss(P.opvret.b,'display',pro?'':'none');ss(P.opvretgc.w,'display',pro?'none':'');ss(P.opvretgc.b,'display',pro?'none':'');
      if(pro){flow(P.pumpoutgc.f,0,0);flow(P.opvretgc.f,0,0)}else{flow(P.pumpout.f,0,0);flow(P.opvret.f,0,0)}
      pipe('intake',s.tank>0.5?'water':'air',TT,0,q.intake||0,dtv);
      pipe(po,dry&&!s.air?'air':'water',TT,s.pumpOn?s.P:0,q.pumpout||0,dtv);
      pipe(ret,'water',TT,0,q.opvret||0,dtv);
      pipe('boilout','water',s.Tw,s.sol?s.P:0,q.boilout||0,dtv);
      pipe('togroup',s.sol||(q.group||q.spout)?'water':'air',q.Tout||s.Tw,s.sol?s.P:0,q.boilout||0,dtv);
      pipe('exhaust',q.exhaust>0?'water':'air',s.Tw,0,q.exhaust||0,dtv);
      var stK=q.mS>0?'steam':(q.qW>0||s.vol>=K.full*0.97?'water':(s.Tw>100?'steam':'air'));
      pipe('steam',stK,s.Tw,0,(q.qW||0)+(q.mS||0)*3,dtv);
      pipe('wand',q.mS>0?'steam':(q.qW>0?'water':'air'),s.Tw,0,(q.qW||0)+(q.mS||0)*3,dtv);
      /* steam and flashing water */
      if(!RM){
        var tipF=K.gc?[382,332]:[380.5,333];
        if(q.mS>0){
          var rate=8+q.mS*40;
          if(j.pos==='wand'){fPuff.emit(rate*0.4,dtr,function(p){p.spawn(366+Math.random()*24,318,(Math.random()-0.5)*14,-(14+Math.random()*12),2,7,1.4,0.8)});
            xPuff.emit(rate*0.4,dtr,function(p){p.spawn(46+Math.random()*28,my-fh-2,(Math.random()-0.5)*12,-(12+Math.random()*10),2,7,1.4,0.8)});
            mbub.emit(rate,dtr,function(p){p.spawn(52+Math.random()*18,Math.min(392,my+14+Math.random()*20),(Math.random()-0.5)*10,-(26+Math.random()*16),1,2.4,0.8)})}
          else{fPuff.emit(rate,dtr,function(p){p.spawn(tipF[0],tipF[1]+2,(Math.random()-0.5)*46,34+Math.random()*30,3,14,1.5,0.95)});
            xPuff.emit(rate,dtr,function(p){p.spawn(60,338,(Math.random()-0.5)*40,26+Math.random()*30,2,10,1.3,0.9)})}
        }
        if(q.flash>0){fPuff.emit(q.flash*30,dtr,function(p){p.spawn(256+Math.random()*48,pf.in?282:250,(Math.random()-0.5)*30,10+Math.random()*16,2,8,1,0.85)});
          xPuff.emit(q.flash*30,dtr,function(p){p.spawn(190+Math.random()*100,pf.in?326:288,(Math.random()-0.5)*30,10+Math.random()*14,2,8,1,0.85)})}
        if(j.pos==='wand'&&j.T>78&&q.mS>0)mbub.emit(20,dtr,function(p){p.spawn(34+Math.random()*56,my+4,(Math.random()-0.5)*6,-12,2,4,0.6)});
        fPuff.tick(dtr);xPuff.tick(dtr);mbub.tick(dtr,my-fh);
      }
    }

    /* ---- time ---- */
    var speed=1,acc=0,last=0,raf=0,vis=false;
    function frame(ms){
      raf=0;if(!vis)return;
      var dtr=last?Math.min(0.1,(ms-last)/1000):0;last=ms;acc+=dtr*speed;
      var n=0;while(acc>=DT&&n<800){step(DT);acc-=DT;n++}if(n>=800)acc=0;
      render(dtr);raf=requestAnimationFrame(frame);
    }
    function wake(){if(vis&&!raf){last=0;raf=requestAnimationFrame(frame)}}
    if('IntersectionObserver' in window)new IntersectionObserver(function(es){vis=es[0].isIntersecting;if(vis)wake();else last=0}).observe(root);else{vis=true;wake()}

    /* ---- hands on ---- */
    function act(id,fn){var e=$(id);if(!e)return;
      e.addEventListener('click',function(ev){ev.preventDefault();ev.stopPropagation();fn(e);root.classList.remove('fresh');render(0);emit('act',id)});
      e.addEventListener('keydown',function(ev){if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();fn(e);root.classList.remove('fresh');render(0);emit('act',id)}});
    }
    function wiggle(e){e.classList.remove('wiggle');void e.getBoundingClientRect();e.classList.add('wiggle')}
    ['pwr','brew','steam'].forEach(function(k){
      ['f-sw-'+k,'f-gsw-'+k].forEach(function(id){act(id,function(){S[k]=S[k]?0:1})});
    });
    act('f-knob',function(){S.knob=S.knob?0:1});
    /* the portafilter won't come out under pressure, or with the pump running into it */
    act('f-pf',function(e){if(S.sol||S.P>0.5||S.vent>0){wiggle(e);emit('blocked','f-pf');return}S.pf.in=0;if(S.pf.b==='dosed'&&S.pf.wet>8)S.pf.b='spent'});
    act('f-pfhandle',function(){S.pf.in=1});
    act('f-pfbasket',function(){var p=S.pf;if(p.b==='spent'||p.b==='dosed'){p.b='empty';p.Sr=0}else{p.b='dosed';p.Sr=p.S0;p.E=0}p.wet=0});
    act('f-cup',function(){var c=S.cup;if(c.pos==='tray')c.pos='warm';else{c.pos='tray';if(c.v>0){c.v=0;c.s=0;c.Ew=0;c.EwT=0;c.cr=0;c.T=c.Tc}}});
    act('f-jug',function(){var j=S.jug;if(j.pos==='wand')j.pos='away';else{if(j.used){j.m=150;j.w=0;j.T=5;j.foam=0;j.used=0}j.pos='wand'}});
    ['f-tray','x-tray'].forEach(function(id){act(id,function(){S.drip=0;S.puddle=0})});
    act('x-tank',function(){if(S.tank<2090)S.fill=2100-S.tank});
    act('sim-reset',function(){S=fresh();acc=0;[fPuff,xPuff,bub,mbub].forEach(function(p){p.clear()});root.classList.add('fresh');emit('reset')});
    qa('[data-speed]',root).forEach(function(b){b.addEventListener('click',function(){speed=Number(b.getAttribute('data-speed'));qa('[data-speed]',root).forEach(function(x){x.setAttribute('aria-pressed',String(x===b))})})});
    window.addEventListener('gaggia-machine',function(){setup();render(0);emit('setup')});
    setup();S=fresh();root.classList.add('fresh');render(0);
    /* for the page's own checks */
    root._sim={get:function(){return S},step:function(n){for(var i=0;i<n;i++)step(DT);render(0)},K:K,on:function(fn){HOOKS.push(fn)},
      speed:function(){return speed},ready:function(){return K.gc?!!S.lamp.brew:(S.steam?!!S.lamp.steam:!!S.lamp.brew)}};
  })();
