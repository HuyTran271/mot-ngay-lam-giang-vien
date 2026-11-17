"use strict";
// Giao diện hộp thoại kiểu visual novel: đoạn thoại chạy chữ, chạm để tiếp, lựa chọn giữa màn hình
function fxText(fx){
  var names={en:"⚡", he:"❤️", fi:"🔥"}, parts=[];
  ["en","he","fi"].forEach(function(k){ if(fx[k]) parts.push((fx[k]>0?"+":"−")+Math.abs(fx[k])+" "+names[k]); });
  return parts.join(" · ");
}
function syncStats(){
  document.getElementById('st-en').textContent=S.en;
  document.getElementById('st-he').textContent=S.he;
  document.getElementById('st-fi').textContent=S.fi;
}
function clampStat(){ S.en=Math.max(0,Math.min(100,S.en)); S.he=Math.max(0,Math.min(100,S.he)); S.fi=Math.max(0,Math.min(100,S.fi)); }
var toastTimer=null;
function showToast(msg, ms){
  var t=document.getElementById('toast'); t.textContent=msg; t.style.display='block';
  if(toastTimer) clearTimeout(toastTimer);
  toastTimer=setTimeout(function(){ t.style.display='none'; }, ms||3600);
}
function drawFace(){
  var fc=document.getElementById('d-face'); if(!fc) return;
  var fg=fc.getContext('2d');
  fg.clearRect(0,0,72,72);
  fg.fillStyle='#2b3c5e'; fg.fillRect(0,0,72,72);
  fg.fillStyle='rgba(242,179,61,0.18)'; fg.beginPath(); fg.arc(36,36,30,0,Math.PI*2); fg.fill();
  fg.fillStyle='#1f2c44'; fg.beginPath(); fg.roundRect(12,48,48,28,12); fg.fill();
  fg.fillStyle='#ffffff'; fg.beginPath(); fg.moveTo(27,48); fg.lineTo(45,48); fg.lineTo(36,64); fg.closePath(); fg.fill();
  fg.fillStyle='#d43a2f'; fg.beginPath(); fg.moveTo(34,50); fg.lineTo(38,50); fg.lineTo(39,67); fg.lineTo(36,71); fg.lineTo(33,67); fg.closePath(); fg.fill();
  fg.fillStyle='#e5b389'; fg.fillRect(31,42,10,8);
  fg.fillStyle='#f3c79f'; fg.beginPath(); fg.roundRect(21,16,30,30,12); fg.fill();
  fg.fillStyle='#262830'; fg.beginPath(); fg.roundRect(19,10,34,14,8); fg.fill();
  fg.fillRect(19,17,5,12); fg.fillRect(48,17,5,12);
  fg.fillStyle='rgba(232,128,116,0.45)';
  fg.beginPath(); fg.arc(26,35,3.2,0,Math.PI*2); fg.fill();
  fg.beginPath(); fg.arc(46,35,3.2,0,Math.PI*2); fg.fill();
  fg.fillStyle='#1b2028';
  if(typeof S!=='undefined' && S.en<25){
    fg.fillRect(26,30,6,2); fg.fillRect(40,30,6,2);
  } else {
    fg.beginPath(); fg.arc(29,30,2.3,0,Math.PI*2); fg.fill();
    fg.beginPath(); fg.arc(43,30,2.3,0,Math.PI*2); fg.fill();
  }
  fg.strokeStyle='#222938'; fg.lineWidth=1.8;
  fg.strokeRect(24,26,10,8); fg.strokeRect(38,26,10,8);
  fg.beginPath(); fg.moveTo(34,30); fg.lineTo(38,30); fg.stroke();
  fg.strokeStyle='#8e4d3a'; fg.lineWidth=1.8;
  fg.beginPath(); fg.arc(36,38,4.2,0.15*Math.PI,0.85*Math.PI); fg.stroke();
}
var dlgSegs=[], dlgIdx=0, dlgPhase='story', dlgChoices=null, dlgOnPick=null, typeTimer=null, typing=false, typeFull='';
function typeSeg(txt){
  var el=document.getElementById('d-text');
  typeFull=txt; typing=true; el.textContent='';
  var i=0, pauseT=0;
  if(typeTimer) clearInterval(typeTimer);
  typeTimer=setInterval(function(){
    if(pauseT>0){ pauseT--; return; }
    i+=3;
    el.innerHTML=typeFull.slice(0,i).replace(/\n/g,'<br>');
    var lastCh=typeFull.charAt(i-1);
    if((lastCh==='.'||lastCh==='!'||lastCh==='?'||lastCh==='…') && i<typeFull.length) pauseT=20;
    if(i>=typeFull.length){ clearInterval(typeTimer); typeTimer=null; typing=false; }
  }, 16);
}
function finishType(){
  if(typeTimer){ clearInterval(typeTimer); typeTimer=null; }
  typing=false;
  document.getElementById('d-text').innerHTML=typeFull.replace(/\n/g,'<br>');
}
function fillDlg(icon, time, title, text, choices, onPick){
  joy.on=false; joy.dx=0; joy.dy=0; target=null; if(targetRing) targetRing.visible=false;
  document.getElementById('d-icon').textContent=icon;
  document.getElementById('d-time').textContent=time;
  document.getElementById('d-title').textContent=title;
  drawFace();
  document.getElementById('d-fx').textContent='';
  document.getElementById('d-badge').textContent='';
  document.getElementById('choices').classList.remove('show');
  dlgSegs=text.split('\n\n'); dlgIdx=0; dlgPhase='story'; dlgChoices=choices; dlgOnPick=onPick;
  document.getElementById('dlg').classList.add('show');
  typeSeg(dlgSegs[0]);
}
function showChoices(){
  var box=document.getElementById('choices'); box.innerHTML='';
  dlgChoices.forEach(function(ch){
    var b=document.createElement('button'); b.className='vn-choice'; b.textContent=ch.t;
    b.addEventListener('click', function(){ buzz(8); pickChoice(ch); });
    box.appendChild(b);
  });
  box.classList.add('show');
}
function pickChoice(ch){
  if(typeof playSfx==='function') playSfx('pick');
  document.getElementById('choices').classList.remove('show');
  var fx=ch.fx||{};
  S.en+=fx.en||0; S.he+=fx.he||0; S.fi+=fx.fi||0; clampStat();
  if(ch.set){ for(var k in ch.set) S.flags[k]=ch.set[k]; }
  if(ch.badge && S.badges.indexOf(ch.badge)<0) S.badges.push(ch.badge);
  syncStats();
  if(dlgOnPick) dlgOnPick(ch);
  document.getElementById('d-fx').textContent=fxText(fx);
  document.getElementById('d-badge').textContent= ch.badge ? '🏅 Dấu ấn: '+ch.badge : '';
  dlgPhase='response';
  typeSeg(ch.res);
}
function advanceDlg(){
  if(typing){ finishType(); return; }
  if(dlgPhase==='story'){
    if(dlgIdx<dlgSegs.length-1){ dlgIdx++; typeSeg(dlgSegs[dlgIdx]); }
    else { dlgPhase='choice'; showChoices(); }
  } else if(dlgPhase==='response'){ goNext(); }
}
