"use strict";

var GRATITUDE_POS={x:0,z:63};
var gratitudeBoard=null, gratitudeNear=false, gratitudeBusy=false;

function buildGratitudeBoard(){
  var wood=0x70452a, gold=0xf2b33d;
  box(0.45,4.2,0.45,wood,-4.8,2.1,63,scene,false);
  box(0.45,4.2,0.45,wood,4.8,2.1,63,scene,false);
  box(11,4.1,0.35,wood,0,3.15,63,scene,false);
  box(11.5,0.22,0.7,gold,0,5.18,63,scene,false);
  box(11.5,0.22,0.7,gold,0,1.12,63,scene,false);
  solid(-5.1,62.65,5.1,63.35);
  var title=makeLabel('💌 BẢNG TRI ÂN',12,40);
  title.position.set(0,4.25,62.72);
  gratitudeBoard=title;
  var prompt=makeLabel('ĐI TỚI ĐỂ VIẾT LỜI TRI ÂN',10,32);
  prompt.position.set(0,5.8,63);
  var flower=makeIcon('🌼',1.5); flower.position.set(-6.2,1.1,63); scene.add(flower);
  var flower2=makeIcon('🌼',1.5); flower2.position.set(6.2,1.1,63); scene.add(flower2);
}

function gratitudeConfig(){
  var c=window.SUPABASE_CONFIG||{};
  return {url:String(c.url||'').replace(/\/$/,''), key:String(c.anonKey||''), table:c.table||'gratitude_messages'};
}

function gratitudeSetStatus(text, ok){
  var el=document.getElementById('gratitude-status');
  if(el){ el.textContent=text; el.style.color=ok?'#1e7d46':'#8b2d2d'; }
}

function openGratitude(){
  if(mode!=='play' || gratitudeBusy) return;
  var p=document.getElementById('gratitude-panel');
  p.style.display='flex';
  document.getElementById('gratitude-message').focus();
  gratitudeSetStatus('',true);
}

function closeGratitude(){
  document.getElementById('gratitude-panel').style.display='none';
  gratitudeBusy=false;
}

function submitGratitude(){
  if(gratitudeBusy) return;
  var message=document.getElementById('gratitude-message').value.trim();
  var name=document.getElementById('gratitude-name').value.trim();
  if(message.length<3){ gratitudeSetStatus('Hãy viết ít nhất 3 ký tự nhé.',false); return; }
  var c=gratitudeConfig();
  if(!c.url || !c.key){ gratitudeSetStatus('Chưa cấu hình Supabase. Hãy điền SUPABASE_CONFIG trong src/index.html.',false); return; }
  gratitudeBusy=true; gratitudeSetStatus('Đang gửi lời tri ân...',true);
  fetch(c.url+'/rest/v1/'+encodeURIComponent(c.table),{
    method:'POST',
    headers:{'apikey':c.key,'Authorization':'Bearer '+c.key,'Content-Type':'application/json','Prefer':'return=minimal'},
    body:JSON.stringify({name:name||'Một người học trò',message:message})
  }).then(function(r){
    if(!r.ok) throw new Error('HTTP '+r.status);
    document.getElementById('gratitude-message').value='';
    document.getElementById('gratitude-name').value='';
    gratitudeSetStatus('Đã lưu lời tri ân. Cảm ơn bạn!',true);
    showToast('💌 Lời tri ân đã được gửi lên bảng!',2200);
    setTimeout(closeGratitude,1200);
  }).catch(function(){ gratitudeBusy=false; gratitudeSetStatus('Không thể lưu lúc này. Hãy thử lại sau.',false); });
}

function updateGratitude(){
  if(!player || mode!=='play') return;
  var d=Math.hypot(player.position.x-GRATITUDE_POS.x,player.position.z-GRATITUDE_POS.z);
  var near=d<4.5;
  if(near && !gratitudeNear){ showToast('💌 Đứng gần bảng và nhấn E để viết lời tri ân',3000); }
  gratitudeNear=near;
  if(gratitudeBoard) gratitudeBoard.material.opacity=near?1:0.9;
}

function initGratitude(){
  buildGratitudeBoard();
  document.getElementById('gratitude-close').addEventListener('click',closeGratitude);
  document.getElementById('gratitude-submit').addEventListener('click',submitGratitude);
  document.getElementById('gratitude-message').addEventListener('input',function(){
    document.getElementById('gratitude-count').textContent=this.value.length+'/500';
  });
  document.addEventListener('keydown',function(e){ if(e.key.toLowerCase()==='e' && gratitudeNear && mode==='play') openGratitude(); });
}

document.addEventListener('DOMContentLoaded',function(){
  var oldBuildWorld=window.buildWorld;
  if(oldBuildWorld){
    window.buildWorld=function(){ oldBuildWorld(); initGratitude(); };
  }
});