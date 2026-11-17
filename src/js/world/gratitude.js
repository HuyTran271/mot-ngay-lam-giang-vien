"use strict";

// ===== KHU VỰC GỬI LỜI TRI ÂN: vườn cộng đồng phía Nam (x -18..18, z 44..69) =====
// Mỗi lời tri ân gửi lên Supabase là một hạt giống: mọc thành một cây trong vườn,
// trên cây có thiệp để người chơi khác tới gần và đọc. Người chơi đứng ở ô đất
// trống nào thì gieo hạt ở ô trống gần mình nhất, không gieo trùng chỗ đã có cây.
// Vườn là của chung, lưu online; cốt truyện vẫn là trải nghiệm riêng từng máy.

var GARDEN={x0:-18, x1:18, z0:44, z1:69};
var GARDEN_HOUSE={x0:-8.6, x1:8.6, z1:50.2}; // vùng nhà ở, không tính là trong vườn
var GARDEN_BEDS_X=[-10,-3,4,11], GARDEN_BEDS_Z=[52.5,58,63];
var gardenSlots=null, gardenTrees=[], gardenRows=[];
var gratitudeNear=false, gratitudeBusy=false, gardenNearest=null, gardenBtnState='';
var gardenPlantPoint=null;

function gardenSlotList(){
  if(gardenSlots) return gardenSlots;
  var list=[], i, j;
  var offs=[[-1.15,-0.62],[1.15,-0.62],[-1.15,0.62],[1.15,0.62]];
  for(i=0;i<GARDEN_BEDS_Z.length;i++) for(j=0;j<GARDEN_BEDS_X.length;j++)
    for(var k=0;k<offs.length;k++) list.push({x:GARDEN_BEDS_X[j]+offs[k][0], z:GARDEN_BEDS_Z[i]+offs[k][1], bed:true, used:false});
  var rows=[45.3,53.2,60.3];
  for(i=0;i<rows.length;i++) for(j=0;j<=12;j++){
    var x=-16+j*2.67;
    var skip=(rows[i]<50)?8.6:2.7; // hàng cỏ phía Bắc phải tránh phạm vi nhà ở
    if(Math.abs(x)<skip) continue;
    if(rows[i]<50 && Math.abs(x)>15) continue; // tránh hai cây trang trí ở góc vườn

    list.push({x:x, z:rows[i], bed:false, used:false});
  }
  gardenSlots=list; return list;
}

function gardenFreeSlotNear(x, z){
  var slots=gardenSlotList(), best=-1, bd=1e9;
  for(var i=0;i<slots.length;i++){
    if(slots[i].used) continue;
    var d=(slots[i].x-x)*(slots[i].x-x)+(slots[i].z-z)*(slots[i].z-z);
    if(d<bd){ bd=d; best=i; }
  }
  return best;
}

function gratitudeConfig(){
  var c=window.SUPABASE_CONFIG||{};
  return {url:String(c.url||'').replace(/\/$/,''), key:String(c.anonKey||''), table:c.table||'cay_tri_an'};
}

function gratitudeSetStatus(text, ok){
  var el=document.getElementById('gratitude-status');
  if(el){ el.textContent=text; el.style.color=ok?'#1e7d46':'#8b2d2d'; }
}

var GARDEN_BAD_WORDS=['địt','đụ má','đéo','lồn','cặc','buồi','đĩ','chó đẻ','địt mẹ','vãi lồn','cứt'];
function gardenHasBadWord(s){
  var t=' '+String(s||'').toLowerCase()+' ';
  for(var i=0;i<GARDEN_BAD_WORDS.length;i++) if(t.indexOf(GARDEN_BAD_WORDS[i])>=0) return true;
  return false;
}

function gardenFallbackTree(x, z, targetH, kind){
  var g=new THREE.Group(); g.position.set(x,0,z); g.scale.setScalar(targetH/4.3);
  var trunk=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.3,1.6,7), new THREE.MeshStandardMaterial({color:0x8a5a28, roughness:.9}));
  trunk.position.y=0.8; trunk.castShadow=true; g.add(trunk);
  if(kind==='pine'){
    var greens=[0x3d6b35,0x477a3c,0x528a44];
    for(var ci=0; ci<3; ci++){
      var cone=new THREE.Mesh(new THREE.ConeGeometry(1.35-ci*0.32, 1.5, 8), new THREE.MeshStandardMaterial({color:greens[ci], roughness:.9}));
      cone.position.y=1.7+ci*0.85; cone.castShadow=true; g.add(cone);
    }
  } else if(kind==='flower'){
    var c1=new THREE.Mesh(new THREE.SphereGeometry(1.5,10,8), new THREE.MeshStandardMaterial({color:0x7a9a4a, roughness:.9}));
    c1.position.y=2.6; c1.castShadow=true; g.add(c1);
    var blossomCols=[0xd94f6a,0xe86a8a,0xf2f0f5];
    var blossomPos=[[0.6,3.2,0.3],[-0.7,3.0,-0.2],[0.1,3.6,-0.5],[-0.3,2.9,0.7],[0.8,2.7,-0.4]];
    for(var bi=0; bi<blossomPos.length; bi++){
      var bl=new THREE.Mesh(new THREE.SphereGeometry(0.42,8,7), new THREE.MeshStandardMaterial({color:blossomCols[bi%3], roughness:.8}));
      bl.position.set(blossomPos[bi][0], blossomPos[bi][1], blossomPos[bi][2]); bl.castShadow=true; g.add(bl);
    }
  } else {
    var o1=new THREE.Mesh(new THREE.SphereGeometry(1.5,10,8), new THREE.MeshStandardMaterial({color:0x4e7a3a, roughness:.9}));
    o1.position.y=2.6; o1.castShadow=true; g.add(o1);
    var o2=new THREE.Mesh(new THREE.SphereGeometry(1.05,10,8), new THREE.MeshStandardMaterial({color:0x5d8a44, roughness:.9}));
    o2.position.set(0.7,3.4,0.3); o2.castShadow=true; g.add(o2);
  }
  scene.add(g); return g;
}

function plantTree(row, slotIdx){
  var slots=gardenSlotList();
  if(slotIdx===undefined || slotIdx<0 || slots[slotIdx].used){
    slotIdx=-1;
    for(var i=0;i<slots.length;i++) if(!slots[i].used){ slotIdx=i; break; }
    if(slotIdx<0) return;
  }
  var slot=slots[slotIdx]; slot.used=true;
  var jx=((row.id*37)%11-5)/10*0.44, jz=((row.id*53)%11-5)/10*0.44;
  var x=slot.x+jx, z=slot.z+jz;
  var targetH=(slot.bed?1.85:2.55)+((row.id%4)*0.16);
  var rot=((row.id*29)%62)/10;
  var made=null;
  if(row.loai_cay==='pine') made=placeModel('treePine', x, z, targetH, rot);
  else if(row.loai_cay==='flower'){
    made=placeModel('bush', x, z, targetH*0.52, rot);
    placeModel('flower', x+0.34, z+0.22, 0.72, rot+1);
    placeModel('flower', x-0.38, z-0.18, 0.62, rot+2.4);
    placeModel('flower', x+0.05, z+0.45, 0.58, rot+0.6);
    if(!made) made=gardenFallbackTree(x, z, targetH*0.6, 'flower');
  }
  else made=placeModel('treeOak', x, z, targetH, rot);
  if(!made) made=gardenFallbackTree(x, z, targetH, row.loai_cay);
  regWind(made, row.loai_cay==='flower'?0.035:0.022);
  solid(x-0.45, z-0.45, x+0.45, z+0.45);
  var ten=String(row.ten||'Một người học trò'); if(ten.length>18) ten=ten.slice(0,18)+'…';
  var treeIcon=row.loai_cay==='pine'?'🌲':(row.loai_cay==='flower'?'🌸':'🌳');
  var lb=makeLabel(treeIcon+' '+ten, 5.5, 30);
  lb.position.set(x, targetH+1.05, z); scene.add(lb);
  gardenTrees.push({x:x, z:z, row:row, slot:slotIdx});
}

function gardenRefreshCount(){
  var el=document.getElementById('gratitude-count-line');
  if(el) el.textContent=gardenRows.length>0
    ? 'Vườn đã có '+gardenRows.length+' cây tri ân do các bạn học trò gieo. Mỗi cây mang một tấm thiệp.'
    : 'Vườn đang chờ hạt tri ân đầu tiên. Hãy là người gieo hạt đầu tiên nhé.';
}

function loadGarden(){
  var c=gratitudeConfig();
  if(!c.url || !c.key || typeof fetch==='undefined') return;
  fetch(c.url+'/rest/v1/'+encodeURIComponent(c.table)+'?select=id,ten,lop,nguoi_nhan,loi_tri_an,loai_cay,created_at&order=id.asc&limit=300',{
    headers:{'apikey':c.key,'Authorization':'Bearer '+c.key}
  }).then(function(r){ if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); })
  .then(function(rows){
    gardenRows=rows||[];
    for(var i=0;i<gardenRows.length;i++) plantTree(gardenRows[i]);
    gardenRefreshCount();
  }).catch(function(){ /* Không tải được vườn online thì game vẫn chạy bình thường. */ });
}

function openGratitude(){
  if(mode!=='play' || gratitudeBusy) return;
  if(!player) return;
  gardenPlantPoint={x:player.position.x, z:player.position.z};
  if(gardenFreeSlotNear(gardenPlantPoint.x, gardenPlantPoint.z)<0){
    showToast('🌿 Vườn đã đầy cây tri ân rồi. Cảm ơn bạn!',2600); return;
  }
  mode='gratitude';
  var p=document.getElementById('gratitude-panel');
  p.style.display='flex';
  gardenRefreshCount();
  gratitudeSetStatus('',true);
  var to=document.getElementById('gratitude-to'); if(to) to.focus();
}

function closeGratitude(){
  document.getElementById('gratitude-panel').style.display='none';
  gratitudeBusy=false;
  if(mode==='gratitude') mode='play';
}

function openCard(row){
  if(mode!=='play') return;
  mode='gratitude';
  document.getElementById('card-to').textContent='💌 Gửi tới: '+row.nguoi_nhan;
  document.getElementById('card-msg').textContent=row.loi_tri_an;
  var from='🌱 Người gieo: '+row.ten+(row.lop?' · Lớp '+row.lop:'');
  if(row.created_at){
    var d=new Date(row.created_at);
    if(!isNaN(d.getTime())) from+=' · '+('0'+d.getDate()).slice(-2)+'/'+('0'+(d.getMonth()+1)).slice(-2)+'/'+d.getFullYear();
  }
  document.getElementById('card-from').textContent=from;
  document.getElementById('card-panel').style.display='flex';
}

function closeCard(){
  document.getElementById('card-panel').style.display='none';
  if(mode==='gratitude') mode='play';
}

function submitGratitude(){
  if(gratitudeBusy) return;
  var name=document.getElementById('gratitude-name').value.trim();
  var lop=document.getElementById('gratitude-class').value.trim();
  var to=document.getElementById('gratitude-to').value.trim();
  var loai=document.getElementById('gratitude-tree').value;
  var message=document.getElementById('gratitude-message').value.trim();
  if(to.length<2){ gratitudeSetStatus('Hãy ghi rõ bạn muốn gửi lời tri ân tới thầy cô nào nhé.',false); return; }
  if(message.length<3){ gratitudeSetStatus('Hãy viết lời tri ân ít nhất 3 ký tự nhé.',false); return; }
  if(gardenHasBadWord(name)||gardenHasBadWord(to)||gardenHasBadWord(message)){
    gratitudeSetStatus('Lời tri ân cần những lời đẹp. Bạn sửa lại giúp mình nhé.',false); return;
  }
  var c=gratitudeConfig();
  if(!c.url || !c.key){ gratitudeSetStatus('Vườn online chưa được kết nối. Hãy thử lại sau.',false); return; }
  var anchor=gardenPlantPoint||(player?{x:player.position.x, z:player.position.z}:{x:0, z:56});
  if(gardenFreeSlotNear(anchor.x, anchor.z)<0){ gratitudeSetStatus('Vườn đã đầy cây tri ân rồi. Cảm ơn bạn!',false); return; }
  gratitudeBusy=true; gratitudeSetStatus('Đang gieo hạt tri ân của bạn...',true);
  fetch(c.url+'/rest/v1/'+encodeURIComponent(c.table),{
    method:'POST',
    headers:{'apikey':c.key,'Authorization':'Bearer '+c.key,'Content-Type':'application/json','Prefer':'return=representation'},
    body:JSON.stringify({ten:name||'Một người học trò', lop:lop||null, nguoi_nhan:to, loi_tri_an:message, loai_cay:loai})
  }).then(function(r){
    if(!r.ok) throw new Error('HTTP '+r.status);
    return r.json();
  }).then(function(rows){
    if(rows && rows[0]){
      gardenRows.push(rows[0]);
      plantTree(rows[0], gardenFreeSlotNear(anchor.x, anchor.z));
    }
    document.getElementById('gratitude-name').value='';
    document.getElementById('gratitude-class').value='';
    document.getElementById('gratitude-to').value='';
    document.getElementById('gratitude-message').value='';
    document.getElementById('gratitude-count').textContent='0/300';
    gratitudeSetStatus('Đã gieo hạt xong. Cây tri ân của bạn đã mọc ở ô đất trống gần bạn nhất!',true);
    showToast('🌱 Hạt tri ân đã nảy mầm thành cây trong vườn!',2400);
    setTimeout(closeGratitude,1300);
  }).catch(function(){ gratitudeBusy=false; gratitudeSetStatus('Chưa gieo được hạt lúc này. Bạn thử lại sau nhé.',false); });
}

function updateGratitude(){
  if(!player || mode!=='play') return;
  var px=player.position.x, pz=player.position.z;
  var inside=px>=GARDEN.x0 && px<=GARDEN.x1 && pz>=GARDEN.z0 && pz<=GARDEN.z1
    && !(px>GARDEN_HOUSE.x0 && px<GARDEN_HOUSE.x1 && pz<GARDEN_HOUSE.z1);
  if(inside && !gratitudeNear){ showToast('🌿 Khu vực gửi lời tri ân: đứng gần ô đất trống để gieo hạt, tới gần cây để đọc thiệp',3200); }
  gratitudeNear=inside;
  gardenNearest=null;
  var best=2.4;
  for(var i=0;i<gardenTrees.length;i++){
    var d=Math.hypot(px-gardenTrees[i].x, pz-gardenTrees[i].z);
    if(d<best){ best=d; gardenNearest=gardenTrees[i]; }
  }
  var state=(inside?'plant':'')+(gardenNearest?'+view':'');
  if(state!==gardenBtnState){
    gardenBtnState=state;
    var b=document.getElementById('garden-action');
    if(b){
      if(inside){ b.textContent='🌱 Gieo hạt tri ân'; b.style.display='block'; }
      else b.style.display='none';
    }
    var v=document.getElementById('garden-view');
    if(v){
      if(gardenNearest){ v.textContent='💌 Xem thiệp cây này'; v.style.display='block'; }
      else v.style.display='none';
    }
  }
}

// ===== HIỆU ỨNG: cánh hoa rơi trong vườn, đom đóm buổi tối, mặt hồ lấp lánh =====
var fxPetals=null, fxFlies=null, fxSpark=null, fxLeaves=null;

// ===== GIÓ: cây đung đưa nhẹ quanh gốc =====
var WINDY=[];
function regWind(obj, amp){
  if(obj) WINDY.push({o:obj, ph:Math.random()*6.28, amp:amp||0.02});
}

function fxMakePoints(n, color, size, opacity){
  var g=new THREE.BufferGeometry();
  var pos=new Float32Array(n*3);
  g.setAttribute('position', new THREE.BufferAttribute(pos,3));
  var m=new THREE.PointsMaterial({color:color, size:size, transparent:true, opacity:opacity, depthWrite:false});
  var p=new THREE.Points(g,m); p.frustumCulled=false; scene.add(p);
  return {points:p, pos:pos, n:n};
}

function buildFx(){
  var i;
  fxPetals=fxMakePoints(110, 0xf6c6d9, 0.22, 0.95);
  for(i=0;i<fxPetals.n;i++){ fxPetals.pos[i*3]=-17+Math.random()*34; fxPetals.pos[i*3+1]=0.3+Math.random()*5.5; fxPetals.pos[i*3+2]=45+Math.random()*23; }
  fxPetals.points.geometry.attributes.position.needsUpdate=true;
  fxFlies=fxMakePoints(70, 0xd8f78a, 0.3, 0);
  for(i=0;i<fxFlies.n;i++){ fxFlies.pos[i*3]=-34+Math.random()*70; fxFlies.pos[i*3+1]=0.6+Math.random()*2.2; fxFlies.pos[i*3+2]=-40+Math.random()*100; }
  fxFlies.points.geometry.attributes.position.needsUpdate=true;
  fxSpark=fxMakePoints(50, 0xbfe8d8, 0.16, 0.5);
  for(i=0;i<fxSpark.n;i++){ fxSpark.pos[i*3]=4+Math.random()*16; fxSpark.pos[i*3+1]=0.12; fxSpark.pos[i*3+2]=-43+Math.random()*14; }
  fxSpark.points.geometry.attributes.position.needsUpdate=true;
  // Lá bay khắp khuôn viên, mỗi lá một màu trong bảng màu lá
  fxLeaves=fxMakePoints(90, 0xffffff, 0.2, 0.9);
  var leafCols=new Float32Array(fxLeaves.n*3);
  var leafPal=[[0.55,0.75,0.35],[0.85,0.72,0.28],[0.92,0.58,0.32],[0.62,0.8,0.42],[0.8,0.65,0.3]];
  for(i=0;i<fxLeaves.n;i++){
    fxLeaves.pos[i*3]=-36+Math.random()*76; fxLeaves.pos[i*3+1]=0.3+Math.random()*5.5; fxLeaves.pos[i*3+2]=-50+Math.random()*85;
    var lc=leafPal[i%leafPal.length];
    leafCols[i*3]=lc[0]; leafCols[i*3+1]=lc[1]; leafCols[i*3+2]=lc[2];
  }
  fxLeaves.points.geometry.setAttribute('color', new THREE.BufferAttribute(leafCols,3));
  fxLeaves.points.material.vertexColors=true;
  fxLeaves.points.geometry.attributes.position.needsUpdate=true;
}

function updateFx(dt, t){
  var i;
  if(fxPetals){
    var p=fxPetals.pos;
    for(i=0;i<fxPetals.n;i++){
      p[i*3+1]-=dt*0.45;
      p[i*3]+=Math.sin(t*1.3+i)*dt*0.35;
      if(p[i*3+1]<0.15){ p[i*3+1]=5.5+Math.random(); p[i*3]=-17+Math.random()*34; p[i*3+2]=45+Math.random()*23; }
    }
    fxPetals.points.geometry.attributes.position.needsUpdate=true;
  }
  if(fxFlies){
    var q=fxFlies.pos;
    for(i=0;i<fxFlies.n;i++){
      q[i*3]+=Math.sin(t*0.7+i*1.7)*dt*0.5;
      q[i*3+1]+=Math.cos(t*0.9+i)*dt*0.25;
      q[i*3+2]+=Math.cos(t*0.6+i*2.3)*dt*0.5;
    }
    fxFlies.points.geometry.attributes.position.needsUpdate=true;
    var target=(typeof cur!=='undefined' && cur>=9)?0.9:0;
    var m=fxFlies.points.material;
    m.opacity+=(target-m.opacity)*Math.min(1,dt*2);
  }
  if(fxSpark){ fxSpark.points.material.opacity=0.3+0.25*Math.sin(t*2.1); }
  for(var w=0;w<WINDY.length;w++){
    var wd=WINDY[w];
    wd.o.rotation.z=Math.sin(t*1.15+wd.ph)*wd.amp;
    wd.o.rotation.x=Math.cos(t*0.85+wd.ph)*wd.amp*0.6;
  }
  // Mặt hồ bắt ánh sáng theo giờ: rạng đông và hoàng hôn ánh cam, đêm ánh xanh trầm
  if(typeof LAKE_MATS!=='undefined' && LAKE_MATS.length && typeof TIME_THEMES!=='undefined' && TIME_THEMES[cur]){
    if(updateFx._lakeCur!==cur){
      updateFx._lakeCur=cur;
      var thSun=new THREE.Color(TIME_THEMES[cur].sun);
      var glow=(cur===0||cur===8)?0.30:(cur>=9?0.13:0.20);
      for(var lmi2=0;lmi2<LAKE_MATS.length;lmi2++){
        var lm2=LAKE_MATS[lmi2];
        if(lm2.emissive){ lm2.emissive.copy(thSun); lm2.emissiveIntensity=glow; }
      }
    }
  }
  if(fxLeaves){
    var lp=fxLeaves.pos;
    for(var li2=0;li2<fxLeaves.n;li2++){
      lp[li2*3+1]-=dt*0.32;
      lp[li2*3]+=Math.sin(t*0.9+li2*1.3)*dt*0.55;
      lp[li2*3+2]+=Math.cos(t*0.7+li2)*dt*0.3;
      if(lp[li2*3+1]<0.12){ lp[li2*3+1]=5.5+Math.random(); lp[li2*3]=-36+Math.random()*76; lp[li2*3+2]=-50+Math.random()*85; }
    }
    fxLeaves.points.geometry.attributes.position.needsUpdate=true;
  }
}

function initGratitude(){
  try{
    buildFx();
    document.getElementById('gratitude-close').addEventListener('click',closeGratitude);
    document.getElementById('gratitude-submit').addEventListener('click',submitGratitude);
    document.getElementById('card-close').addEventListener('click',closeCard);
    document.getElementById('garden-action').addEventListener('click',function(){ if(mode==='play' && gratitudeNear) openGratitude(); });
    document.getElementById('garden-view').addEventListener('click',function(){ if(mode==='play' && gardenNearest) openCard(gardenNearest.row); });
    document.getElementById('gratitude-message').addEventListener('input',function(){
      document.getElementById('gratitude-count').textContent=this.value.length+'/300';
    });
    document.addEventListener('keydown',function(e){
      if(!e.key || e.key.toLowerCase()!=='e' || mode!=='play') return;
      if(gardenNearest) openCard(gardenNearest.row);
      else if(gratitudeNear) openGratitude();
    });
    loadGarden();
  }catch(err){ /* Khu vườn lỗi cũng không được làm hỏng game chính. */ }
}

document.addEventListener('DOMContentLoaded',function(){
  var oldBuildWorld=window.buildWorld;
  if(oldBuildWorld){
    window.buildWorld=function(){ oldBuildWorld(); initGratitude(); };
  }
});
