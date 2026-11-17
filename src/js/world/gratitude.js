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

function gardenFallbackTree(x, z, targetH, flower){
  var g=new THREE.Group(); g.position.set(x,0,z); g.scale.setScalar(targetH/4.3);
  var trunk=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.3,1.6,7), new THREE.MeshStandardMaterial({color:0x8a5a28, roughness:.9}));
  trunk.position.y=0.8; trunk.castShadow=true; g.add(trunk);
  var c1=new THREE.Mesh(new THREE.SphereGeometry(1.5,10,8), new THREE.MeshStandardMaterial({color:flower?0x7a9a4a:0x4e7a3a, roughness:.9}));
  c1.position.y=2.6; c1.castShadow=true; g.add(c1);
  if(flower){
    var c2=new THREE.Mesh(new THREE.SphereGeometry(0.8,8,7), new THREE.MeshStandardMaterial({color:0xd96a8a, roughness:.9}));
    c2.position.set(0.6,3.2,0.3); c2.castShadow=true; g.add(c2);
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
    if(!made) made=gardenFallbackTree(x, z, targetH*0.6, true);
  }
  else made=placeModel('treeOak', x, z, targetH, rot);
  if(!made) made=gardenFallbackTree(x, z, targetH, row.loai_cay==='flower');
  solid(x-0.45, z-0.45, x+0.45, z+0.45);
  var ten=String(row.ten||'Một người học trò'); if(ten.length>18) ten=ten.slice(0,18)+'…';
  var lb=makeLabel('🌱 '+ten, 5.5, 30);
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

function initGratitude(){
  try{
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
