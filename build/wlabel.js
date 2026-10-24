/* A short tag saying which machines a step or note is for, from its data-when / w condition */
  function wlabel(w){
    var NM={GC:'Classic',GCP:'Classic Pro',EVO:'Evo',E24:'E24'},out=[];
    String(w).split(';').forEach(function(c){
      c=c.trim();if(!c)return;var i=c.indexOf(':'),k=i<0?c:c.slice(0,i),v=i<0?[]:c.slice(i+1).split(',');
      if(k==='model')out.push(v.map(function(x){return NM[x]||x}).join(', '));
      else if(k==='fam')out.push(v[0]==='GCP'?'Pro family':'Classic');
      else if(k==='volts')out.push(v.join('/')+' V');
      else if(k==='eco')out.push(v[0]==='yes'?'Eco board':'No Eco board');
      else if(k==='opv9')out.push('US Evo Pro, E24');
      else if(k==='ground')out.push('120 V Classic');
      else if(k==='siok')out.push('Classic or 120 V Pro family');
      else if(k==='path'||k==='wpath')out.push(v[0]==='SI'?'Stock wiring':'Custom wiring');
      else if(k==='shelly')out.push('With the Shelly');
    });
    return out.join(' · ');
  }
  /* the official-guide link for a step: offp picks the section for the reader's install path (stock wiring when not set) */
  function offOf(s){
    if(s.offp){var m=window.GaggiaMachine,k=(m&&m.wpath&&m.wpath())||'SI';return s.offp[k]||s.offp.SI}
    return s.off||null;
  }
