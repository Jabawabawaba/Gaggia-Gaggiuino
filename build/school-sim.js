  /* ---------- Barista school: the machine on screen ----------
     Draws school-sim.html from the engine's state (school-engine.js) and turns taps on the machine into changes to
     it. Forked from learn-sim.js; the drawing code is the same apart from the scale, the jug's height (where the wand
     tip sits), the blind basket, milk on the wand, oil on the shower screen and descaler in the tank.
     The shared school layer (school.js) drives everything else through SIM: it doses the basket, swaps baskets,
     moves the jug's tip, wipes the wand, fills the tank, starts lessons and reads the state every step.
     Taps on the machine are reported as plain names: pwr, brew, steam, knob, pf-out, pf-in, basket, cup, jug, tray, tank. */
  var SIM=(function(){
    var root=$('school');if(!root)return null;
    var NS='http://www.w3.org/2000/svg';
    var E=GaggiaEngine();
    function mk(tag,a,p){var e=document.createElementNS(NS,tag);for(var k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}
    function cl(v,a,b){return v<a?a:v>b?b:v}
    function lerp(a,b,t){return a+(b-a)*t}
    function mix(a,b,t){t=cl(t,0,1);return [lerp(a[0],b[0],t),lerp(a[1],b[1],t),lerp(a[2],b[2],t)]}
    function rgb(c){return 'rgb('+Math.round(c[0])+','+Math.round(c[1])+','+Math.round(c[2])+')'}
    function sa(e,k,v){if(!e)return;v=String(v);var key='_'+k;if(e[key]!==v){e[key]=v;e.setAttribute(k,v)}}
    function ss(e,k,v){if(!e)return;v=String(v);var key='__'+k;if(e[key]!==v){e[key]=v;e.style[k]=v}}
    function tog(e,c,on){if(e&&e.classList.contains(c)!==!!on)e.classList.toggle(c,!!on)}
    var K=E.K,S=null,HOOKS=[],paused=false;
    function emit(a,b,c){for(var i=0;i<HOOKS.length;i++)try{HOOKS[i](a,b,c)}catch(err){if(window.console)console.error(err)}}
    /* the machine you picked; with none picked, a 120 V Classic Pro E24 */
    function setup(){
      var p=prof(),m=GM();
      E.setup({model:p.model||'E24',volts:p.volts||120,opv9:!!(m&&m.matches&&m.matches('opv9')&&(m.decided('opv9')||!p.model))});
      tog(root,'gc',K.gc);
      var md=K.model;
      $('x-bbody').setAttribute('fill',K.e24?'url(#sx-brassb)':'url(#sx-alu)');
      $('x-gbody').setAttribute('fill',md==='EVO'||md==='E24'?'url(#sx-brassb)':'url(#sx-chrome)');
      if(S)S.vol=Math.min(S.vol,K.full);
    }

    /* ---- drawing ---- */
    var D={};
    ['f-sw-pwr','f-sw-brew','f-sw-steam','f-gsw-pwr','f-gsw-brew','f-gsw-steam','f-lp-pwr','f-lp-brew','f-lp-steam','f-knob','f-knobp','f-pf','f-pfout','f-pfgr','f-pfbasket','f-pfblind',
     'f-cup','f-cupvap','f-jug','f-thn','f-gs1','f-gs2','f-gs3','f-ss1','f-ss2','f-ws','f-tray','f-trayw','f-puddle','f-hhr','f-hmin','f-hsec','f-puffs','f-scale-g','f-wandmilk','f-wandmilk-gc',
     'x-tank','x-tankw','x-tanks','x-lid','x-pour','x-pumpv','x-piston','x-pcoil','x-opvplug','x-opvplug-gc','x-bwater','x-bsurf','x-bhead','x-bub','x-elem','x-glow',
     'x-tbb','x-tsb','x-gheat','x-vcoil','x-vpl','x-vsin','x-vsex','x-vcav','x-rain','x-pf','x-pfw','x-puck','x-cup','x-cupl','x-crema','x-cupvap','x-screen','x-blind',
     'x-tray','x-trayw','x-knobp','x-jug','x-milk','x-foam','x-mbub','x-thn','x-pipes','x-flows','x-parts'].forEach(function(id){D[id]=$(id)});
    var xwd=root.querySelector('.simx .xwd');
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
      P[k]={w:mk('path',{d:PIPES[k],'class':'xp-w'},D['x-pipes']),b:mk('path',{d:PIPES[k],'class':'xp-b'},D['x-pipes']),f:mk('path',{d:PIPES[k],'class':'xf'},D['x-flows']),o:0};
    });
    var XS={spout:mk('path',{d:'M240,326 V352','class':'xf'},D['x-flows']),wtip:mk('path',{d:'M60,334 V398','class':'xf'},D['x-flows'])};
    var rain=Array.prototype.slice.call(D['x-rain'].querySelectorAll('line'));
    function Pool(parent,n,cls){this.a=[];for(var i=0;i<n;i++)this.a.push({e:mk('circle',{r:0,cx:-40,cy:-40,'class':cls},parent),on:false});this.acc=0}
    Pool.prototype.spawn=function(x,y,vx,vy,r0,r1,L,o){for(var i=0;i<this.a.length;i++){var p=this.a[i];if(!p.on){p.on=true;p.l=0;p.L=L;p.x=x;p.y=y;p.vx=vx;p.vy=vy;p.r0=r0;p.r1=r1;p.o=o==null?1:o;return}}};
    Pool.prototype.emit=function(rate,dt,fn){this.acc+=rate*dt;var n=0;while(this.acc>=1&&n<8){this.acc-=1;fn(this);n++}if(this.acc>3)this.acc=0};
    Pool.prototype.tick=function(dt,ymin){for(var i=0;i<this.a.length;i++){var p=this.a[i];if(!p.on)continue;p.l+=dt;
      if(p.l>=p.L||(ymin!=null&&p.y<ymin)){p.on=false;sa(p.e,'r',0);continue}
      p.x+=p.vx*dt;p.y+=p.vy*dt;var t=p.l/p.L;sa(p.e,'cx',p.x.toFixed(1));sa(p.e,'cy',p.y.toFixed(1));sa(p.e,'r',lerp(p.r0,p.r1,t).toFixed(1));sa(p.e,'opacity',(p.o*(1-t*t)).toFixed(2))}};
    Pool.prototype.clear=function(){this.a.forEach(function(p){p.on=false;sa(p.e,'r',0)})};
    var fPuff=new Pool(D['f-puffs'],26,'puff'),xPuff=new Pool(D['x-parts'],26,'puff'),bub=new Pool(D['x-bub'],22,'bub'),mbub=new Pool(D['x-mbub'],10,'bub');

    var WATER=[150,200,236],GOOD=[80,45,22],SOUR=[156,110,54],BITTER=[40,29,24];
    function waterCol(T){return T<60?mix([108,174,230],[142,190,228],(T-20)/40):T<90?mix([142,190,228],[206,196,184],(T-60)/30):T<102?mix([206,196,184],[234,172,132],(T-90)/12):mix([234,172,132],[240,128,78],(T-102)/30)}
    function coffeeCol(T,c){var base=T<90?mix(GOOD,SOUR,(90-T)/7):mix(GOOD,BITTER,(T-96)/5);return mix(WATER,base,0.25+0.75*cl(c/0.07,0,1))}
    function boreCol(kind,T,Pb){
      if(kind==='air')return 'rgba(196,203,209,.5)';
      if(kind==='steam')return 'rgb(238,242,246)';
      var c=waterCol(T);if(Pb>0.3)c=mix(c,[36,92,170],cl(Pb/12,0,1)*0.75);return rgb(c);
    }
    function flow(el,rate,dtv,col){
      var on=rate>0.03;ss(el,'opacity',on?1:0);if(!on)return;
      if(col)ss(el,'stroke',col);
      if(!RM){el.o=(el.o||0)-dtv*(14+11*Math.min(rate,8));sa(el,'stroke-dashoffset',el.o.toFixed(1))}
    }
    function pipe(k,kind,T,Pb,rate,dtv){
      var p=P[k];ss(p.b,'stroke',boreCol(kind,T,Pb));
      flow(p.f,rate,dtv,kind==='steam'?'#8E9AA5':'rgba(255,255,255,.92)');
    }
    var JUGY={sub:381,surf:391,high:400};
    function render(dtr){
      var s=S,q=s.q||{},j=s.jug,c=s.cup,pf=s.pf,w=s.wand,dtv=RM?0:Math.min(dtr,0.1)*(0.7+0.3*Math.sqrt(speed));
      ['pwr','brew','steam'].forEach(function(k){
        [D['f-sw-'+k],D['f-gsw-'+k]].forEach(function(e){if(!e)return;tog(e,'on',s[k]);sa(e,'aria-pressed',s[k]?'true':'false')});
        var lp=D['f-lp-'+k];if(lp){var lit=!!s.lamp[k];if(lp.classList.contains('on')!==lit){tog(lp,'on',lit);sa(lp,'aria-label',lp.getAttribute('aria-label').replace(/, (on|off)$/,lit?', on':', off'))}}
      });
      tog(D['f-gsw-pwr'],'lit',s.lamp.pwr);tog(D['f-gsw-brew'],'lit',s.lamp.brew);
      ss(D['f-knobp'],'transform',s.knob?'rotate(-110deg)':'rotate(0deg)');ss(D['x-knobp'],'transform',s.knob?'rotate(-110deg)':'rotate(0deg)');
      sa(D['f-knob'],'aria-pressed',s.knob?'true':'false');
      /* portafilter, cup on the scale, jug at the height the tip asks for */
      ss(D['f-pf'],'display',pf.in?'':'none');ss(D['f-pfout'],'display',pf.in?'none':'');
      ss(D['f-pfgr'],'display',pf.b==='dosed'||pf.b==='spent'?'':'none');tog(D['f-pfbasket'],'spent',pf.b==='spent');
      ss(D['f-pfblind'],'display',pf.b==='blind'?'':'none');
      tog(D['f-cup'],'onscale',c.pos==='tray');
      sa(D['f-cup'],'transform',c.pos==='tray'?'translate(280 375)':'translate(172 31) scale(.8)');
      var big=j.cap>400,jy=j.pos==='wand'?JUGY[j.tip]||391:448;
      sa(D['f-jug'],'transform',j.pos==='wand'?'translate(378 '+jy+')'+(big?' scale(1.14)':''):'translate(492 448)'+(big?' scale(1.14)':''));
      var thA=-130+cl(j.T,0,100)*2.6;
      sa(D['f-thn'],'transform','rotate('+thA.toFixed(1)+' 10 -96)');sa(D['x-thn'],'transform','rotate('+thA.toFixed(1)+' 36 312)');
      var cupHot=c.v>3?cl((c.T-48)/30,0,1):0;ss(D['f-cupvap'],'opacity',cupHot.toFixed(2));ss(D['x-cupvap'],'opacity',cupHot.toFixed(2));
      D['f-scale-g'].textContent=c.pos==='tray'?E.grams(s).toFixed(1):'0.0';
      /* streams on the front */
      var endY=c.pos==='tray'?335:388,gw=q.group||0,sw=q.spout||0;
      ['f-gs1','f-gs2','f-gs3'].forEach(function(id,i){var e=D[id];sa(e,'d','M'+(264+16*i)+',247 V'+endY);sa(e,'stroke-width',(1.4+gw*0.34).toFixed(2));flow(e,gw,dtv)});
      var scol=pf.b==='empty'||!q.c?'#7FBDEB':rgb(coffeeCol(q.Tout||93,q.c));
      ['f-ss1','f-ss2'].forEach(function(id,i){var e=D[id];sa(e,'d','M'+(272+16*i)+',282 V'+endY);sa(e,'stroke-width',(1.6+sw*0.7).toFixed(2));flow(e,sw,dtv,scol)});
      var wOut=j.pos==='wand'?0:(q.qW||0);sa(D['f-ws'],'stroke-width',(1.6+wOut*0.5).toFixed(2));sa(D['f-ws'],'d',K.gc?'M382,332 V388':'M380.5,333 V388');flow(D['f-ws'],wOut,dtv);
      /* milk left on the wand: white while it's fresh, brown once it's baked on */
      var mo=w.out>0.5?0.9:0,mc=rgb(mix([246,240,226],[160,112,64],w.bake));
      [D['f-wandmilk'],D['f-wandmilk-gc']].forEach(function(e){ss(e,'opacity',mo);ss(e,'fill',mc)});
      /* nudges, no words: an empty tank, a full drip tray, a spent puck waiting to be knocked out */
      tog($('x-tank'),'need',s.tank<150&&s.fill<=0);tog(D['f-tray'],'need',s.drip>430||s.puddle>0);tog(D['x-tray'],'need',s.drip>430||s.puddle>0);
      tog(D['f-pfbasket'],'need',!pf.in&&pf.b==='spent');
      ss(D['f-trayw'],'opacity',cl((s.drip-300)/175,0,0.75).toFixed(2));
      sa(D['f-puddle'],'rx',Math.min(120,s.puddle*0.6).toFixed(1));sa(D['f-puddle'],'ry',Math.min(6,s.puddle*0.04).toFixed(1));
      var tt=27720+s.t;
      sa(D['f-hsec'],'transform','rotate('+((tt%60)*6).toFixed(1)+')');sa(D['f-hmin'],'transform','rotate('+((tt/60%60)*6).toFixed(1)+')');sa(D['f-hhr'],'transform','rotate('+((tt/3600%12)*30).toFixed(1)+')');

      /* inside: tank (tinted while it holds descaler) */
      var th=s.tank/E.TANK*234,ty=330-th;sa(D['x-tankw'],'y',ty.toFixed(1));sa(D['x-tankw'],'height',th.toFixed(1));sa(D['x-tanks'],'d','M500,'+ty.toFixed(1)+' H628');
      ss(D['x-tankw'],'fill',s.desc>0.02?rgb(mix([79,155,216],[170,96,200],cl(s.desc*1.4,0,1))):'');
      ss(D['x-lid'],'transform',s.fill>0?'rotate(-18deg)':'rotate(0deg)');ss(D['x-pour'],'opacity',q.pour?1:0);
      if(q.pour&&!RM){D['x-pour'].o=(D['x-pour'].o||0)-dtv*60;sa(D['x-pour'],'stroke-dashoffset',D['x-pour'].o.toFixed(1))}
      var dry=s.pumpOn&&(s.tank<=0.5||s.air);
      if(s.pumpOn&&!RM){var amp=dry?1.8:0.9;sa(D['x-pumpv'],'transform','translate('+((Math.random()-0.5)*amp*2).toFixed(2)+' '+((Math.random()-0.5)*amp).toFixed(2)+')');sa(D['x-piston'],'transform','translate(0 '+(Math.random()<0.5?-5:3)+')')}
      else{sa(D['x-pumpv'],'transform','');sa(D['x-piston'],'transform','')}
      tog(D['x-pcoil'],'on',s.pumpOn);
      var lift=cl((s.P-K.opv+0.4)*8,0,5);sa(D['x-opvplug'],'transform','translate(0 '+(-lift).toFixed(1)+')');sa(D['x-opvplug-gc'],'transform','translate(0 '+(-lift).toFixed(1)+')');
      var f=cl(s.vol/K.full,0,1),wh=f*98,wy=208-wh;
      sa(D['x-bwater'],'y',wy.toFixed(1));sa(D['x-bwater'],'height',wh.toFixed(1));ss(D['x-bwater'],'fill',s.descB>0.03?rgb(mix(waterCol(s.Tw),[170,96,200],cl(s.descB*1.2,0,0.8))):rgb(waterCol(s.Tw)));
      sa(D['x-bsurf'],'d','M164,'+wy.toFixed(1)+' H316');ss(D['x-bsurf'],'opacity',f<0.995?1:0);
      ss(D['x-bhead'],'opacity',s.Tw>100?1:0.55);
      var dryHot=s.vol<25&&s.heat;
      ss(D['x-elem'],'stroke',rgb(mix([110,90,62],dryHot?[255,70,40]:[255,138,42],s.glow)));
      ss(D['x-elem'],'filter',s.glow>0.25?'drop-shadow(0 0 '+(3+s.glow*3).toFixed(1)+'px #FF8A2A)':'none');
      sa(D['x-glow'],'opacity',(s.glow*(dryHot?0.75:0.45)).toFixed(2));
      sa(D['x-tbb'],'transform',s.brewC?'':'rotate(-30 -7 -9)');sa(D['x-tsb'],'transform',s.steamC?'':'rotate(-30 -7 -9)');
      if(!RM){
        var boil=(s.Tw>98.5&&s.heat?5:0)+(q.mS>0?30*q.mS:0)+(q.fill>0&&s.Tw>100?8:0);
        if(f>0.05)bub.emit(boil,dtr,function(p){p.spawn(172+Math.random()*136,204,0,-(28+Math.random()*24),1.2,2.6,3)});
        bub.tick(dtr,wy+2);
      }
      sa(D['x-gheat'],'opacity',cl((s.Tg-25)/150,0,0.42).toFixed(2));
      ss(D['x-screen'],'stroke',rgb(mix([94,101,108],[92,58,30],cl(s.grime*1.6,0,1))));
      tog(D['x-vcoil'],'on',s.sol);tog(xwd,'on',s.sol);ss(D['x-vpl'],'transform',s.sol?'translateY(-20px)':'translateY(0px)');
      ss(D['x-vsin'],'opacity',s.sol?0:1);ss(D['x-vsex'],'opacity',s.sol?1:0);
      ss(D['x-vcav'],'fill',boreCol('water',s.Tw,s.sol?s.P:0));
      var rainOn=(q.group||0)+(q.spout||0)+(s.sol&&pf.in&&pf.b!=='empty'&&pf.b!=='blind'&&pf.wet<pf.soak?1:0);
      var rEnd=pf.in?289:(c.pos==='tray'?352:400);
      rain.forEach(function(l){sa(l,'y2',rEnd);ss(l,'opacity',rainOn>0.05?0.9:0);if(rainOn>0.05&&!RM){l.o=(l.o||0)-dtv*40;sa(l,'stroke-dashoffset',l.o.toFixed(1))}});
      ss(D['x-pf'],'display',pf.in?'':'none');ss(D['x-blind'],'display',pf.b==='blind'?'':'none');
      var ph=pf.b==='dosed'?10:pf.b==='spent'?8:0;sa(D['x-puck'],'y',(307-ph).toFixed(1));sa(D['x-puck'],'height',ph);
      ss(D['x-puck'],'fill',pf.b==='spent'?'#2E1D12':rgb(mix([96,62,36],[52,32,18],cl(pf.wet/pf.soak,0,1))));
      var pw=pf.in&&(pf.b==='dosed'||pf.b==='spent')&&(s.sol||s.vent>0)?(pf.wet<pf.soak?cl(pf.wet/pf.soak,0,1)*10:10):(pf.in&&pf.b==='blind'&&s.sol?16:(pf.in&&pf.b==='empty'&&(q.spout||0)>0?20:0));
      sa(D['x-pfw'],'y',(307-ph-Math.min(pw,20-ph)).toFixed(1));sa(D['x-pfw'],'height',Math.min(pw,20-ph).toFixed(1));ss(D['x-pfw'],'opacity',pw>0?(s.det>0.05?0.85:0.6):0);
      ss(D['x-pfw'],'fill',s.det>0.05?'#CFE3F2':'');
      ss(D['x-cup'],'display',c.pos==='tray'?'':'none');
      var ch=c.v/90*40,cy=394-ch,Tq=c.Ew>0?c.EwT/c.Ew:93,conc=c.v>0?c.s/c.v:0;
      sa(D['x-cupl'],'y',cy.toFixed(1));sa(D['x-cupl'],'height',(ch+4).toFixed(1));ss(D['x-cupl'],'fill',conc>0.002?rgb(coffeeCol(Tq,conc)):rgb(WATER));
      var crq=Tq>=86&&Tq<=99?1:0.4,crh=c.v>2?cl(c.cr/1.6,0,1)*5*crq:0;
      sa(D['x-crema'],'y',cy.toFixed(1));sa(D['x-crema'],'height',crh.toFixed(1));
      ss(D['x-crema'],'fill',rgb(Tq<89?[214,182,124]:Tq>97?[118,74,42]:[196,138,80]));
      var sEnd=c.pos==='tray'?Math.max(354,cy):400;
      sa(XS.spout,'d','M240,326 V'+sEnd.toFixed(1));sa(XS.spout,'stroke-width',(1.5+sw*0.6).toFixed(2));flow(XS.spout,sw,dtv,scol);
      var dh=s.drip/E.TRAY*16;sa(D['x-trayw'],'y',(422-dh).toFixed(1));sa(D['x-trayw'],'height',dh.toFixed(1));
      ss(D['x-jug'],'display',j.pos==='wand'?'':'none');
      var jc=j.cap>400?560:330,mh=(j.m+j.w)/jc*69,fh=j.foam/jc*69,my=399-mh;
      sa(D['x-milk'],'y',my.toFixed(1));sa(D['x-milk'],'height',(mh+2).toFixed(1));sa(D['x-foam'],'y',(my-fh).toFixed(1));sa(D['x-foam'],'height',fh.toFixed(1));
      ss(D['x-milk'],'fill',rgb(mix(mix([244,240,230],[176,196,210],cl((j.w/(j.m+j.w)-0.08)*3,0,0.7)),[226,204,160],cl((j.T-72)/14,0,1))));
      ss(D['x-foam'],'fill',j.big>j.airC*0.6&&j.foam>4?'#F2F4F6':'#FFFFFF');
      var wEnd=j.pos==='wand'?my-fh:400;
      sa(XS.wtip,'d','M60,334 V'+Math.max(336,wEnd).toFixed(1));sa(XS.wtip,'stroke-width',(2+(q.qW||0)*0.4).toFixed(2));flow(XS.wtip,j.pos==='wand'?0:(q.qW||0),dtv,'#5FA8E0');
      var pro=!K.gc,po=pro?'pumpout':'pumpoutgc',ret=pro?'opvret':'opvretgc';
      ss(P.pumpout.w,'display',pro?'':'none');ss(P.pumpout.b,'display',pro?'':'none');ss(P.pumpoutgc.w,'display',pro?'none':'');ss(P.pumpoutgc.b,'display',pro?'none':'');
      ss(P.opvret.w,'display',pro?'':'none');ss(P.opvret.b,'display',pro?'':'none');ss(P.opvretgc.w,'display',pro?'none':'');ss(P.opvretgc.b,'display',pro?'none':'');
      if(pro){flow(P.pumpoutgc.f,0,0);flow(P.opvretgc.f,0,0)}else{flow(P.pumpout.f,0,0);flow(P.opvret.f,0,0)}
      pipe('intake',s.tank>0.5?'water':'air',21,0,q.intake||0,dtv);
      pipe(po,dry&&!s.air?'air':'water',21,s.pumpOn?s.P:0,q.pumpout||0,dtv);
      pipe(ret,'water',21,0,q.opvret||0,dtv);
      pipe('boilout','water',s.Tw,s.sol?s.P:0,q.boilout||0,dtv);
      pipe('togroup',s.sol||(q.group||q.spout)?'water':'air',q.Tout||s.Tw,s.sol?s.P:0,q.boilout||0,dtv);
      pipe('exhaust',q.exhaust>0?'water':'air',s.Tw,0,q.exhaust||0,dtv);
      var stK=q.mS>0?'steam':(q.qW>0||s.vol>=K.full*0.97?'water':(s.Tw>100?'steam':'air'));
      pipe('steam',stK,s.Tw,0,(q.qW||0)+(q.mS||0)*3,dtv);
      pipe('wand',q.mS>0?'steam':(q.qW>0?'water':'air'),s.Tw,0,(q.qW||0)+(q.mS||0)*3,dtv);
      if(!RM){
        var tipF=K.gc?[382,332]:[380.5,333];
        if(q.mS>0){
          var rate=8+q.mS*40;
          if(j.pos==='wand'){fPuff.emit(rate*(j.tip==='high'?0.9:0.4),dtr,function(p){p.spawn(366+Math.random()*24,jy-73,(Math.random()-0.5)*14,-(14+Math.random()*12),2,7,1.4,0.8)});
            xPuff.emit(rate*0.4,dtr,function(p){p.spawn(46+Math.random()*28,my-fh-2,(Math.random()-0.5)*12,-(12+Math.random()*10),2,7,1.4,0.8)});
            mbub.emit(rate*(j.tip==='sub'?0.6:1),dtr,function(p){p.spawn(52+Math.random()*18,Math.min(392,my+14+Math.random()*20),(Math.random()-0.5)*10,-(26+Math.random()*16),1,j.tip==='high'?3.4:2.4,0.8)})}
          else{fPuff.emit(rate,dtr,function(p){p.spawn(tipF[0],tipF[1]+2,(Math.random()-0.5)*46,34+Math.random()*30,3,14,1.5,0.95)});
            xPuff.emit(rate,dtr,function(p){p.spawn(60,338,(Math.random()-0.5)*40,26+Math.random()*30,2,10,1.3,0.9)})}
        }
        if(q.flash>0){fPuff.emit(q.flash*30,dtr,function(p){p.spawn(256+Math.random()*48,pf.in?282:250,(Math.random()-0.5)*30,10+Math.random()*16,2,8,1,0.85)});
          xPuff.emit(q.flash*30,dtr,function(p){p.spawn(190+Math.random()*100,pf.in?326:288,(Math.random()-0.5)*30,10+Math.random()*14,2,8,1,0.85)})}
        if(j.pos==='wand'&&j.T>78&&q.mS>0)mbub.emit(20,dtr,function(p){p.spawn(34+Math.random()*56,my+4,(Math.random()-0.5)*6,-12,2,4,0.6)});
        fPuff.tick(dtr);xPuff.tick(dtr);mbub.tick(dtr,my-fh);
      }
      emit('render',s,dtr);
    }

    /* ---- time ---- */
    var speed=1,acc=0,last=0,raf=0,vis=false;
    function frame(ms){
      raf=0;if(!vis)return;
      var dtr=last?Math.min(0.1,(ms-last)/1000):0;last=ms;if(!paused)acc+=dtr*speed;
      var n=0;while(acc>=E.DT&&n<800){E.step(S,E.DT);emit('step',S,E.DT);acc-=E.DT;n++}if(n>=800)acc=0;
      render(dtr);raf=requestAnimationFrame(frame);
    }
    function wake(){if(vis&&!raf){last=0;raf=requestAnimationFrame(frame)}}
    if('IntersectionObserver' in window)new IntersectionObserver(function(es){vis=es.some(function(x){return x.isIntersecting});if(vis)wake();else last=0}).observe(root);else{vis=true;wake()}

    /* ---- hands on ---- */
    function act(id,name,fn){var e=$(id);if(!e)return;
      function go(ev){ev.preventDefault();ev.stopPropagation();if(fn(e)===false)return;root.classList.remove('fresh');render(0);emit('act',name)}
      e.addEventListener('click',go);
      e.addEventListener('keydown',function(ev){if(ev.key==='Enter'||ev.key===' ')go(ev)});
    }
    function wiggle(e){e.classList.remove('wiggle');void e.getBoundingClientRect();e.classList.add('wiggle')}
    ['pwr','brew','steam'].forEach(function(k){
      ['f-sw-'+k,'f-gsw-'+k].forEach(function(id){act(id,k,function(){S[k]=S[k]?0:1})});
    });
    act('f-knob','knob',function(){S.knob=S.knob?0:1});
    /* the portafilter won't come out under pressure, or with the pump running into it */
    act('f-pf','pf-out',function(e){if(S.sol||S.P>0.5||S.vent>0){wiggle(e);emit('blocked','pf');return false}S.pf.in=0;if(S.pf.b==='dosed'&&S.pf.wet>8)S.pf.b='spent'});
    act('f-pfhandle','pf-in',function(){S.pf.in=1});
    /* the basket: a spent puck gets knocked out; an empty one asks the bench for a dose (school.js does the dosing) */
    act('f-pfbasket','basket',function(){var p=S.pf;if(p.b==='spent'||p.b==='dosed'){p.b='empty';p.Sr=0;p.wet=0;emit('knock')}else if(p.b==='empty')emit('dose-ask');})
    act('f-cup','cup',function(){var c=S.cup;if(c.pos==='tray'){c.pos='warm';emit('cup-off',c)}else{c.pos='tray';if(c.v>0){c.v=0;c.s=0;c.Ew=0;c.EwT=0;c.cr=0;c.soap=0;c.T=c.Tc}}});
    act('f-jug','jug',function(){var j=S.jug;if(j.pos==='wand'){j.pos='away'}else{if(j.used)freshJug(j);j.pos='wand'}});
    ['f-tray','x-tray'].forEach(function(id){act(id,'tray',function(){S.drip=0;S.puddle=0})});
    act('x-tank','tank',function(){if(S.tank<E.TANK-10){S.fillDesc=0;S.fill=E.TANK-S.tank}});
    function freshJug(j){j.w=0;j.T=5;j.foam=0;j.used=0;j.airC=0;j.airH=0;j.spin=0;j.big=0;j.spit=0}
    window.addEventListener('gaggia-machine',function(){setup();render(0);emit('setup')});
    setup();S=E.fresh();root.classList.add('fresh');
    return {
      E:E,K:K,root:root,
      get:function(){return S},
      set:function(s){S=s;acc=0;[fPuff,xPuff,bub,mbub].forEach(function(p){p.clear()});render(0)},
      on:function(fn){HOOKS.push(fn)},emit:emit,
      render:function(){render(0)},
      step:function(n){for(var i=0;i<n;i++){E.step(S,E.DT);emit('step',S,E.DT)}render(0)},
      speed:function(v){if(v!=null){speed=v}return speed},
      pause:function(v){if(v!=null)paused=!!v;return paused},
      ready:function(){return E.ready(S)},
      freshJug:freshJug,setup:setup,
      fresh:function(){root.classList.add('fresh')}
    };
  })();
