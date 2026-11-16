"use strict";
// Luồng truyện: mở cảnh, vật phẩm nhặt được, ma deadline, kết thúc
function setEvent(i){
  cur=i;
  for(var j=0;j<beacons.length;j++) beacons[j].grp.visible=(j===i);
  document.getElementById('hud-clock').textContent="🕔 "+DLGS[i].time;
  document.getElementById('hud-phase').textContent=DLGS[i].phase;
  document.getElementById('objective').textContent=DLGS[i].obj;
  if(i===5 || i===9) spawnSpirit();
}
function openScene(i){
  mode='dialog'; inCollapse=false;
  var sc=DLGS[i];
  fillDlg(sc.icon, sc.time, sc.title, (typeof sc.text==="function" ? sc.text(S) : sc.text), sc.choices, function(ch){
    pendingNext=i+1;
  });
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
var PICK_TYPES=[{emo:"☕",k:"en",v:6,n:"cà phê"},{emo:"🍵",k:"en",v:4,n:"trà"},{emo:"🍎",k:"he",v:4,n:"táo"},{emo:"💐",k:"he",v:6,n:"hoa học trò tặng"},{emo:"📚",k:"fi",v:4,n:"ý tưởng mới"}];
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
      var sp=makeIcon(pt.emo, 1.15); sp.position.set(x, 1.25, z); scene.add(sp);
      pickups.push({sp:sp, x:x, z:z, k:pt.k, v:pt.v, n:pt.n, ph:Math.random()*6});
      break;
    }
  }
}
function spawnSpirit(){
  // Hồn deadline xuất hiện ở đầu Đông đường C, sát bờ Nam hồ nước (map mới)
  if(spirit){ spirit.sp.position.set(12, 1.7, -24); spirit.t=0; return; }
  var sp=makeIcon("👻", 2); sp.position.set(12, 1.7, -24); scene.add(sp);
  spirit={sp:sp, tx:0, tz:0, t:0};
}
