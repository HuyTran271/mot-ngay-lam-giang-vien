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
  var fg=fc.getContext('2d'); fg.fillStyle='#8e2f3c'; fg.fillRect(0,0,72,72);
  fg.fillStyle='#f2c49b'; fg.fillRect(24,16,24,24);
  fg.fillStyle='#2b2b30'; fg.fillRect(22,10,28,10);
  fg.fillStyle='#27364f'; fg.fillRect(16,42,40,30);
  fg.fillStyle='#d43a2f'; fg.fillRect(33,44,6,16);
}
var dlgSegs=[], dlgIdx=0, dlgPhase='story', dlgChoices=null, dlgOnPick=null, typeTimer=null, typing=false, typeFull='';
function typeSeg(txt){
  var el=document.getElementById('d-text');
  typeFull=txt; typing=true; el.textContent='';
  var i=0;
  if(typeTimer) clearInterval(typeTimer);
  typeTimer=setInterval(function(){
    i+=3;
    el.innerHTML=typeFull.slice(0,i).replace(/\n/g,'<br>');
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
    b.addEventListener('click', function(){ pickChoice(ch); });
    box.appendChild(b);
  });
  box.classList.add('show');
}
function pickChoice(ch){
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
