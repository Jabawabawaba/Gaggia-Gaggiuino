/* Wire label sheets: layout shared by the on-page preview and the PDF. A row is one or two flags side by side; a
   flag (cell) has an ID, a color bar for its circuit, a tag at the top right and two short lines. Cells marked hot
   sit on or beside the boiler, where paper and tape won't last, so they print as a reminder to use a marker. */
var LabelCore=(function(){
  var PAPER={letter:{w:215.9,h:279.4,name:'US Letter'},a4:{w:210,h:297,name:'A4'}};
  var L={w:92,h:13,half:40,wrap:12,gapX:4,gapY:3,top:20,bottom:10};
  var COLOR={L:[176,58,46],H:[199,120,0],N:[47,95,179],E:[45,122,76],LV:[112,70,184],LVG:[89,97,106],STK:[138,109,59]};
  function ends(r){
    var parts=String(r.short).split('→');
    return [parts[0].trim(),(parts[1]||'').trim()];
  }
  function hotAt(r,i){return r.hot==='both'||(r.hot==='a'&&i===0)||(r.hot==='b'&&i===1)}
  function runRow(r){
    var e=ends(r),tag=r.stock?'stock lead':/^22/.test(r.wire||'')?'22 AWG':'18 AWG';
    return [0,1].map(function(i){return {id:r.id,sys:r.sys,tag:tag,l1:'this end: '+e[i],l2:'to: '+e[1-i],here:e[i],hot:hotAt(r,i)}});
  }
  function flagCell(f){return {id:f.id,sys:'STK',tag:'stock',l1:f.l1,l2:f.l2,here:f.at||f.l1.replace(/^stock: /,''),hot:!!f.hot}}
  function rows(runs,flags){
    var out=runs.map(runRow),fl=(flags||[]).map(flagCell);
    for(var i=0;i<fl.length;i+=2)out.push(fl.slice(i,i+2));
    return out;
  }
  function sheets(rowList,paperKey){
    var P=PAPER[paperKey]||PAPER.letter;
    var left=(P.w-(2*L.w+L.gapX))/2;
    var per=Math.floor((P.h-L.top-L.bottom+L.gapY)/(L.h+L.gapY));
    var pages=[],page=null;
    rowList.forEach(function(cells){
      if(!page||page.rows.length>=per){page={rows:[]};pages.push(page)}
      var y=L.top+page.rows.length*(L.h+L.gapY);
      page.rows.push({y:y,cells:cells.map(function(c,i){return Object.assign({x:left+i*(L.w+L.gapX),y:y},c)})});
    });
    return {paper:P,left:left,rows:per,pages:pages,L:L};
  }
  function hotText(c){return c.sys==='STK'?'Near the boiler: write '+c.id+' on its wire with an oil-based marker.':'Near the boiler: no paper label. Write '+c.id+' on the jacket with an oil-based marker.'}
  function pdfText(s){return String(s).replace(/→/g,'>').replace(/−/g,'-').replace(/[^\x20-\x7E°–]/g,'')}
  function drawPdf(jsPDF,rowList,paperKey,title){
    var S=sheets(rowList,paperKey),P=S.paper;
    var doc=new jsPDF({unit:'mm',format:paperKey==='a4'?'a4':'letter',orientation:'portrait'});
    S.pages.forEach(function(pg,pi){
      if(pi>0)doc.addPage();
      doc.setTextColor(22,25,28);
      doc.setFont('helvetica','bold');doc.setFontSize(9);
      doc.text(pdfText(title||'Gaggia wire labels'),S.left,10);
      doc.setFont('helvetica','normal');doc.setFontSize(7.5);
      doc.text('Sheet '+(pi+1)+' of '+S.pages.length+'  |  Print at 100% (actual size). Cut on solid lines, fold on dashed lines around the wire, text outward.',S.left,14);
      var bx=P.w-S.left-50;
      doc.setDrawColor(22,25,28);doc.setLineWidth(0.4);doc.line(bx,8,bx+50,8);doc.line(bx,6.8,bx,9.2);doc.line(bx+50,6.8,bx+50,9.2);
      doc.setFontSize(6.5);doc.text('This bar should measure 50 mm',bx,11.5);
      pg.rows.forEach(function(row){
        row.cells.forEach(function(c){
          var col=COLOR[c.sys]||COLOR.LVG;
          if(c.hot){
            doc.setDrawColor(160,166,172);doc.setLineWidth(0.2);doc.setLineDashPattern([0.6,0.9],0);
            doc.rect(c.x,c.y,L.w,L.h);doc.setLineDashPattern([],0);
            doc.setFont('helvetica','bold');doc.setFontSize(8);doc.setTextColor(90,96,104);
            doc.text(pdfText(c.id+'  at '+c.here),c.x+3,c.y+5.4,{maxWidth:L.w-6});
            doc.setFont('helvetica','normal');doc.setFontSize(6.5);
            doc.text(pdfText(hotText(c)),c.x+3,c.y+9.6,{maxWidth:L.w-6});
            doc.setTextColor(22,25,28);
            return;
          }
          doc.setDrawColor(22,25,28);doc.setLineWidth(0.25);doc.rect(c.x,c.y,L.w,L.h);
          doc.setDrawColor(150,150,150);doc.setLineWidth(0.2);doc.setLineDashPattern([1,1],0);
          doc.line(c.x+L.half,c.y,c.x+L.half,c.y+L.h);doc.line(c.x+L.half+L.wrap,c.y,c.x+L.half+L.wrap,c.y+L.h);
          doc.setLineDashPattern([],0);
          [c.x,c.x+L.half+L.wrap].forEach(function(hx){
            doc.setFillColor(col[0],col[1],col[2]);doc.rect(hx,c.y,1.8,L.h,'F');
            doc.setTextColor(22,25,28);
            doc.setFont('helvetica','bold');doc.setFontSize(12);doc.text(pdfText(c.id),hx+3.4,c.y+5.2);
            doc.setFont('helvetica','normal');doc.setFontSize(5.6);doc.setTextColor(90,96,104);
            doc.text(pdfText(c.tag),hx+L.half-1.2,c.y+3.6,{align:'right'});
            doc.setTextColor(22,25,28);doc.setFontSize(6.4);
            doc.text(pdfText(c.l1),hx+3.4,c.y+8.5,{maxWidth:L.half-4.6});
            doc.setTextColor(90,96,104);doc.setFontSize(6);
            doc.text(pdfText(c.l2),hx+3.4,c.y+11.4,{maxWidth:L.half-4.6});
          });
        });
      });
    });
    return doc;
  }
  return {PAPER:PAPER,L:L,COLOR:COLOR,rows:rows,sheets:sheets,drawPdf:drawPdf,ends:ends,hotText:hotText};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=LabelCore;
