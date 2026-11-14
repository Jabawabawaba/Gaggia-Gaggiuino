  /* The runbook's figures (runbook-figs.js) on another page: PF(getV) returns the settings for RBF.init. getV() gives
     the schematic the page shows ({path, fam, volts}), or null. Drawings and their text follow that schematic for the
     install path, family and voltage, and Your Gaggia for anything else; nothing unknown ever hides anything.
     A page that plays part guide drawings defines PGD first (the part guides' data, as the runbook wraps it). */
  function PF(getV){
    function GMx(){return window.GaggiaMachine||null}
    function m(w){
      if(!w)return true;
      var v=getV&&getV(),rest=[],ok=true;
      String(w).split(';').forEach(function(tok){
        var t=tok.trim();if(!t)return;
        var neg=t.charAt(0)==='!',b=neg?t.slice(1):t,i=b.indexOf(':'),k=i<0?b:b.slice(0,i),vals=i<0?[]:b.slice(i+1).split(','),cur=null;
        if(v){
          if(k==='wpath'||k==='path')cur=v.path;
          else if(k==='fam')cur=v.fam;
          else if(k==='volts')cur=String(v.volts);
          /* the original Classic is the only model in its family */
          else if(k==='model'&&vals.length===1&&vals[0]==='GC')cur=v.fam==='GC'?'GC':'pro';
          /* a page showing one schematic has its family pinned down */
          else if((k==='set'||k==='unset')&&vals.length===1&&vals[0]==='model'){if(k==='unset')ok=false;return}
        }
        if(cur!=null){var has=vals.indexOf(cur)>=0;if(neg?has:!has)ok=false}else rest.push(t);
      });
      var g=GMx();
      return ok&&(!rest.length||!g||g.matches(rest.join(';')));
    }
    function T(x){
      if(x==null)return '';if(!Array.isArray(x))return String(x);
      return x.filter(function(s){return typeof s==='string'||m(s[1])}).map(function(s){return typeof s==='string'?s:s[0]}).join(' ').replace(/ ([,.;:])/g,'$1');
    }
    function fill(t){var g=GMx();return String(t==null?'':t).replace(/\{(outlet|gfci|volts)\}/g,function(_,k){return g&&g.text?g.text(k):''})}
    function fam(){var v=getV&&getV();return v?v.fam:null}
    return {G:(typeof PGD!=='undefined'&&PGD)?PGD.G:null,ok:m,m:m,T:T,fill:fill,famOf:fam,
      prof:function(){var v=getV&&getV();return {volts:v?v.volts:null}},
      dv:function(d){var v=getV&&getV();return !v||d===v.path},guides:'part-guides.html'};
  }
