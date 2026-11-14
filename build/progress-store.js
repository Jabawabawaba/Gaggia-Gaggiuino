  /* What a page tells the runbook (progress-store.js, on the parts tracker, wire labels, cut list, power-on checks and
     runbook pages): one record in this browser, gaggia-progress-v1, where each page keeps a short summary under its own
     name. The runbook reads it, with Your Gaggia and the tracker's own record, to tick the steps those pages cover.
     put(name, value) replaces that page's summary and writes only when it changed. vkFor(profile) is the schematic a
     profile opens on, picked as wiring-core.js picks it but without the wiring data; keep VK in step with ORDERV there.
     sig(profile) is a short fingerprint, so a summary made for another machine isn't taken for this one. CV is a stamp of
     the power-on check list (each check's id, kind and condition) that site.py puts in at build: the checks page saves it
     with its tally, and the runbook counts a tally only if it matches, so checks added in a later update are never
     taken as passed. */
  var PS=(function(){
    var KEY='gaggia-progress-v1',CV='%%CHECKS_VER%%';
    var VK=['si-gcp-120','si-gc-120','si-gc-230','cw-gcp-120','cw-gcp-230','cw-gc-120','cw-gc-230','cw-gcp-120-sh','cw-gcp-230-sh'];
    function read(){try{var s=JSON.parse(localStorage.getItem(KEY)||'null');return s&&typeof s==='object'?s:{}}catch(e){return {}}}
    function put(name,value){
      try{
        var s=read(),was=JSON.stringify(s[name]===undefined?null:s[name]),now=JSON.stringify(value===undefined?null:value);
        if(was===now)return;
        if(value==null)delete s[name];else s[name]=value;
        localStorage.setItem(KEY,JSON.stringify(s));
      }catch(e){}
    }
    function vkFor(p){
      if(!p||!p.model||!p.volts)return null;
      var fam=p.model==='GC'?'gc':'gcp',path=p.path==='CW'?'cw':p.path==='SI'?'si':null;
      if(!path)return null;
      var k=path+'-'+fam+'-'+p.volts;
      if(VK.indexOf(k)<0&&path==='si')k='cw-'+fam+'-'+p.volts;
      if(p.shelly&&VK.indexOf(k+'-sh')>=0)k+='-sh';
      return VK.indexOf(k)>=0?k:null;
    }
    function sig(p){p=p||{};return [p.model||'',p.volts||'',p.eco==null?'':(p.eco?'eco':'noeco'),p.path||'',p.shelly?'sh':''].join('|')}
    return {KEY:KEY,CV:CV,read:read,put:put,vkFor:vkFor,sig:sig};
  })();
