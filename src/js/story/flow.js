"use strict";
// Luồng truyện: mở cảnh, vật phẩm nhặt được, ma deadline, kết thúc
function setEvent(i){
  cur=i;
  for(var j=0;j<beacons.length;j++) beacons[j].grp.visible=(j===i);
  var clkIco = i===0 ? "🌅 " : (i<8 ? "☀️ " : (i===8 ? "🌇 " : "🌙 "));
  document.getElementById('hud-clock').textContent=clkIco+DLGS[i].time;
  var stp=document.getElementById('hud-step'); if(stp) stp.textContent=(i+1)+'/'+DLGS.length;
  document.getElementById('hud-phase').textContent=DLGS[i].phase;
  document.getElementById('objective').textContent=DLGS[i].obj;
  if(i===5 || i===9) spawnSpirit();
}
function openScene(i){
  mode='dialog'; inCollapse=false;
  if(typeof playSfx==='function') playSfx('scene');
  var sc=DLGS[i];
  // Callback: em sinh vien ngu gat (flag empathy) tang ca phe o canh bua trua, cong mot lan duy nhat
  if(i===5 && S.flags.empathy && !S.flags._cbCoffee){
    S.flags._cbCoffee=true; S.fi=Math.min(100, S.fi+4); syncStats();
    setTimeout(function(){ showToast('☕ Ly cà phê em sinh viên tặng: +4 🔥', 2400); }, 900);
  }
  var startDlg=function(){
    fillDlg(sc.icon, sc.time, sc.title, (typeof sc.text==="function" ? sc.text(S) : sc.text), sc.choices, function(ch){
      pendingNext=i+1;
    });
  };
  var fd=document.getElementById('scene-fade');
  if(fd){
    document.getElementById('sf-time').textContent=sc.icon+' '+sc.time;
    document.getElementById('sf-title').textContent=sc.title;
    fd.style.display='flex'; fd.classList.remove('on'); void fd.offsetWidth; fd.classList.add('on');
    setTimeout(function(){ fd.classList.remove('on'); fd.style.display='none'; }, 820);
  }
  startDlg();
}
function openCollapse(savedNext){
  inCollapse=true; mode='dialog';
  fillDlg(COLLAPSE.icon, COLLAPSE.time, COLLAPSE.title, COLLAPSE.text, COLLAPSE.choices, function(ch){
    pendingNext=savedNext;
  });
}
function goNext(){
  document.getElementById('dlg').classList.remove('show');
  if(!inCollapse && S.en<=0 && !collapseUsed && pendingNext<DLGS.length){
    collapseUsed=true;
    setTimeout(function(){ openCollapse(pendingNext); }, 260);
    return;
  }
  inCollapse=false;
  if(pendingNext>=DLGS.length){ showEnding(); return; }
  mode='play';
  setEvent(pendingNext);
  spawnPickups(2);
}
function showEnding(){
  mode='end';
  if(typeof playSfx==='function') playSfx('end');
  var e=computeEnding();
  var u=saveUnlocked(e.id);
  document.getElementById('end-icon').textContent=e.icon;
  document.getElementById('end-title').textContent=e.title;
  document.getElementById('end-text').textContent=e.text;
  document.getElementById('end-epilogue').innerHTML=
    "Bạn vừa sống thử <b>một ngày</b> làm giảng viên. Thầy cô của bạn đã sống khoảng <b>7.000 ngày</b> như vậy, hơn 20 năm, và không có nút chơi lại.<br><br>Nhân Ngày Nhà giáo Việt Nam 20/11, xin cảm ơn thầy cô Bộ môn CNTT, Trường Đại học Tây Nguyên: cảm ơn thầy cô đã luôn có mặt, kể cả những ngày mệt nhất.";
  var recap="<b>Chỉ số cuối ngày:</b> ⚡ "+S.en+" · ❤️ "+S.he+" · 🔥 "+S.fi;
  recap += S.badges.length ? "<br><b>Dấu ấn hôm nay:</b><br>🏅 "+S.badges.join("<br>🏅 ") : "<br>Hôm nay bạn không để lại dấu ấn đặc biệt nào, một ngày bình thường cũng là một ngày làm giảng viên.";
  if(collapseUsed) recap+="<br>🪫 Bạn đã gục một lần vì kiệt sức, và đã đứng dậy đi tiếp.";
  document.getElementById('end-recap').innerHTML=recap;
  document.getElementById('unlock-end').textContent="🔓 Bạn đã mở "+u.length+"/4 kết thúc. Chơi lại và chọn khác đi nhé!";
  document.getElementById('copy-ok').textContent="";
  document.getElementById('screen-end').style.display='flex';
  document.getElementById('objective').textContent="🌙 Một ngày làm giảng viên đã kết thúc. Cảm ơn bạn đã sống thử nó.";
}

// ================= VẬT PHẨM + HỒN DEADLINE =================
var PICK_TYPES=[{emo:"☕",k:"en",v:6,n:"cà phê"},{emo:"🍵",k:"en",v:4,n:"trà"},{emo:"🍎",k:"he",v:4,n:"táo"},{emo:"💐",k:"he",v:6,n:"hoa học trò tặng"},{emo:"📚",k:"fi",v:4,n:"ý tưởng mới"},{emo:"☕",k:"boost",v:4,n:"cà phê đặc",s:1.55}];
function ptSolid(x,z){
  for(var i=0;i<SOLIDS.length;i++){ var o=SOLIDS[i]; if(x>o.x0-1.3 && x<o.x1+1.3 && z>o.z0-1.3 && z<o.z1+1.3) return true; }
  return false;
}
function spawnPickups(n){
  for(var i=0;i<n;i++){
    for(var tries=0;tries<25;tries++){
      var x=-30+Math.random()*60, z=-46+Math.random()*94;
      if(ptSolid(x,z)) continue;
      if(Math.hypot(x-player.position.x, z-player.position.z)<5) continue;
      var pt=PICK_TYPES[Math.floor(Math.random()*PICK_TYPES.length)];
      var sp=makeIcon(pt.emo, pt.s||1.15); sp.position.set(x, 1.25, z); scene.add(sp);
      pickups.push({sp:sp, x:x, z:z, k:pt.k, v:pt.v, n:pt.n, ph:Math.random()*6});
      break;
    }
  }
}
function spawnSpirit(){
  // Hồn deadline xuất hiện ở đầu Đông đường C, sát bờ Nam hồ nước (map mới).
  // Hai biến thể: cảnh index 5 là Hồn cuộc họp (chậm), cảnh index 9 là Hồn tin nhắn (nhanh hơn, đuổi thẳng)
  var kind=(cur===9)?'msg':'meet';
  var emo=(kind==='msg')?'📱':'👻';
  if(spirit && spirit.kind===kind){ spirit.sp.position.set(12, 1.7, -24); spirit.t=0; spirit.chasing=false; return; }
  if(spirit && spirit.sp){
    scene.remove(spirit.sp);
    if(spirit.sp.material){ if(spirit.sp.material.map) spirit.sp.material.map.dispose(); spirit.sp.material.dispose(); }
  }
  var sp=makeIcon(emo, 2); sp.position.set(12, 1.7, -24); scene.add(sp);
  spirit={sp:sp, tx:0, tz:0, t:0, kind:kind, chasing:false,
    chaseSpd:(kind==='msg')?9.0:6.0, wanderSpd:(kind==='msg')?3.8:3.0, detectR:(kind==='msg')?13:11};
}
