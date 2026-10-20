  /* Links into the wiring page's map; wiring.html reads them (applyHash there). A target is 'run:TC' (| between
     alternatives: the first one on the reader's drawing wins), 'part:ssr', 'runs:AC1,AC2', 'short:J9 R1,J9 GND'
     (every run whose name starts that way), 'layer:E', or '' for the whole map; join two with ';'. o.path (SI or CW) or o.v (a schematic
     key) picks the drawing when it isn't the reader's own, and o.fam (GC or GCP) the family; o.label names a set of runs. */
  function mapHref(t,o){
    o=o||{};var q=[];
    if(t)t.split(';').forEach(function(x){var i=x.indexOf(':');q.push(x.slice(0,i)+'='+encodeURIComponent(x.slice(i+1)))});
    if(o.v)q.push('v='+encodeURIComponent(o.v));else{if(o.path)q.push('path='+o.path);if(o.fam)q.push('fam='+o.fam)}
    if(o.label)q.push('label='+encodeURIComponent(o.label));
    return 'wiring.html#map'+(q.length?'?'+q.join('&'):'');
  }
