"use strict";
var _camWant=null, _nvEl=null, _nvArrow=null, _nvTxt=null, _nvDeg=9999, _nvM=-1;
function init(){
  scene=new THREE.Scene();
  scene.background=new THREE.Color(0x9fd3f5);
  scene.fog=new THREE.Fog(0x9fd3f5, 85, 170);
  camera=new THREE.PerspectiveCamera(55, innerWidth/innerHeight, 0.1, 300);
  camera.position.set(0, 23, 52);
  renderer=new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFShadowMap;
  document.getElementById('app').appendChild(renderer.domElement);
  var hemi=new THREE.HemisphereLight(0xcfe6ff, 0x7a9a5a, 0.95); scene.add(hemi);
  var sun=new THREE.DirectionalLight(0xffe3b3, 1.9);
  sun.position.set(34, 48, 22); sun.castShadow=true;
  sun.shadow.mapSize.set(1024,1024);
  sun.shadow.camera.left=-72; sun.shadow.camera.right=72; sun.shadow.camera.top=72; sun.shadow.camera.bottom=-72;
  sun.shadow.camera.near=5; sun.shadow.camera.far=130; sun.shadow.bias=-0.0006;
  scene.add(sun);
  buildWorld();
  clock=new THREE.Clock();
  animate();
}

function animate(){
  requestAnimationFrame(animate);
  var dt=Math.min(0.05, clock.getDelta()), t=clock.elapsedTime;
  var moving=false, mx=0, mz=0;
  if(mode==='play'){
    if(joy.on && Math.hypot(joy.dx,joy.dy)>0.22){ mx=joy.dx; mz=joy.dy; target=null; targetRing.visible=false; }
    else {
      if(keys['arrowleft']||keys['a']) mx=-1; else if(keys['arrowright']||keys['d']) mx=1;
      if(keys['arrowup']||keys['w']) mz=-1; else if(keys['arrowdown']||keys['s']) mz=1;
      if(mx||mz){ target=null; targetRing.visible=false; }
    }
    if(!mx && !mz && target){
      var dx=target.x-player.position.x, dz=target.z-player.position.z, d=Math.hypot(dx,dz);
      if(d<0.6){ target=null; targetRing.visible=false; }
      else {
        mx=dx/d; mz=dz/d;
        if(Math.hypot(player.position.x-lastPX, player.position.z-lastPZ)<0.01){ stallT+=dt; if(stallT>0.8){ target=null; targetRing.visible=false; } } else stallT=0;
      }
    }
    lastPX=player.position.x; lastPZ=player.position.z;
    if(mx||mz){
      var l=Math.hypot(mx,mz); mx/=l; mz/=l;
      var np=collideXZ(player.position.x+mx*11*dt, player.position.z+mz*11*dt, 0.85);
      player.position.x=np.x; player.position.z=np.z;
      faceToward(player, mx, mz, dt);
      moving=true;
    }
    // Tới điểm sự kiện
    if(mode==='play' && cur<DLGS.length){
      var b=beacons[cur];
      if(b && Math.hypot(b.x-player.position.x, b.z-player.position.z)<2.2) openScene(cur);
    }
    // Vật phẩm hồi chỉ số
    for(var pi=pickups.length-1; pi>=0; pi--){
      var pk=pickups[pi];
      pk.sp.position.y=1.25+Math.sin(t*2.4+pk.ph)*0.18;
      if(Math.hypot(pk.x-player.position.x, pk.z-player.position.z)<1.7){
        S[pk.k]+=pk.v; clampStat(); syncStats();
        showToast('+'+pk.v+' '+(pk.k==='en'?'⚡':pk.k==='he'?'❤️':'🔥')+', '+pk.n, 1400);
        scene.remove(pk.sp); pickups.splice(pi,1);
      }
    }
    // Hồn deadline
    if(spirit){
      spirit.t-=dt;
      if(spirit.t<=0){ spirit.tx=-40+Math.random()*80; spirit.tz=-54+Math.random()*102; spirit.t=3+Math.random()*3; }
      var sgx=spirit.tx-spirit.sp.position.x, sgz=spirit.tz-spirit.sp.position.z, sgl=Math.hypot(sgx,sgz);
      if(sgl>0.4){ var snx=spirit.sp.position.x+sgx/sgl*3.4*dt, snz=spirit.sp.position.z+sgz/sgl*3.4*dt;
        var sc2=collideXZ(snx, snz, 0.7);
        spirit.sp.position.x=sc2.x; spirit.sp.position.z=sc2.z; }
      spirit.sp.position.y=1.7+Math.sin(t*2)*0.15;
      if(invulnT>0) invulnT-=dt;
      if(Math.hypot(player.position.x-spirit.sp.position.x, player.position.z-spirit.sp.position.z)<1.9 && invulnT<=0){
        S.en=Math.max(0,S.en-5); syncStats();
        showToast('👻 Deadline dí! −5 ⚡', 1500); invulnT=1.6;
        spirit.sp.position.set(12, 1.7, -24); spirit.t=0;
      }
    }
  }
  animPerson(player, moving, dt, t);
  // Sinh viên đi tuần
  for(var i=0;i<students.length;i++){ var st=students[i];
    st.t+=dt*st.speed*st.dir;
    var span=Math.hypot(st.b.x-st.a.x, st.b.z-st.a.z);
    if(st.t>span){ st.t=span; st.dir=-1; } if(st.t<0){ st.t=0; st.dir=1; }
    var k=span? st.t/span : 0;
    st.p.position.x=st.a.x+(st.b.x-st.a.x)*k;
    st.p.position.z=st.a.z+(st.b.z-st.a.z)*k;
    faceToward(st.p, (st.b.x-st.a.x)*st.dir, (st.b.z-st.a.z)*st.dir, dt);
    animPerson(st.p, true, dt, t);
  }
  // Nhân vật ngồi (học sinh trong lớp, người đọc sách, người ăn, đồng nghiệp): nhấp nhô nhẹ
  for(var sdi=0; sdi<seated.length; sdi++){ var sdo=seated[sdi]; sdo.g.position.y=sdo.base+Math.sin(t*1.7+sdo.ph)*0.03; }
  // Mũi tên chỉ đường tới điểm sự kiện
  // Mũi tên đất dưới chân: nằm trước mặt người chơi, chỉ về điểm sự kiện
  if(guideArrow){
    if(mode==='play' && cur<DLGS.length && beacons[cur]){
      var gb=beacons[cur], gdx=gb.x-player.position.x, gdz=gb.z-player.position.z, gd=Math.hypot(gdx,gdz);
      if(gd>2.4){
        guideArrow.visible=true;
        var ga=Math.atan2(gdx,gdz), gOff=1.7+Math.sin(t*3)*0.25;
        guideArrow.position.set(player.position.x+Math.sin(ga)*gOff, 0.07, player.position.z+Math.cos(ga)*gOff);
        guideArrow.rotation.y=ga+Math.PI;
      } else guideArrow.visible=false;
    } else guideArrow.visible=false;
  }
  if(!_nvEl){ _nvEl=document.getElementById('navi'); _nvArrow=document.getElementById('navi-arrow'); _nvTxt=document.getElementById('navi-txt'); }
  if(mode==='play' && cur<DLGS.length && beacons[cur]){
    var nb=beacons[cur], ndx=nb.x-player.position.x, ndz=nb.z-player.position.z, nd=Math.hypot(ndx,ndz);
    if(nd>2.4){
      if(_nvEl.style.display!=='flex') _nvEl.style.display='flex';
      var nfx=player.position.x-camera.position.x, nfz=player.position.z-camera.position.z;
      var ndeg=Math.round((Math.atan2(nfx,nfz)-Math.atan2(ndx,ndz))*180/Math.PI);
      var nm=Math.max(1,Math.round(nd));
      if(ndeg!==_nvDeg){ _nvDeg=ndeg; _nvArrow.style.transform='rotate('+ndeg+'deg)'; }
      if(nm!==_nvM){ _nvM=nm; _nvTxt.textContent='Còn '+nm+'m, đi theo mũi tên'; }
    } else if(_nvEl.style.display!=='none') _nvEl.style.display='none';
  } else if(_nvEl.style.display!=='none') _nvEl.style.display='none';
  // Beacon + cờ
  for(var j=0;j<beacons.length;j++){ var bc2=beacons[j];
    bc2.ring.rotation.z=t*0.8;
    var sc=1+0.12*Math.sin(t*3.2); bc2.ring.scale.set(sc,sc,1);
    bc2.icon.position.y=2.6+Math.sin(t*2.2+j)*0.22;
  }
  if(flagMesh){ flagMesh.rotation.y=Math.sin(t*2.6)*0.16; flagMesh.position.x=-19.05+Math.sin(t*2.6)*0.08; }
  if(targetRing && targetRing.visible){ var tr=1+0.18*Math.sin(t*6); targetRing.scale.set(tr,tr,1); }
  // Camera bám theo
  if(!_camWant) _camWant=new THREE.Vector3();
  _camWant.set(player.position.x, 23, player.position.z+16.5);
  camera.position.lerp(_camWant, Math.min(1, dt*4.5));
  camera.lookAt(player.position.x, 1.4, player.position.z-2);
  if(t-_lblT>0.18){ _lblT=t; updateLabels(); }
  renderer.render(scene, camera);
}

document.addEventListener('DOMContentLoaded', function(){
  document.getElementById('btn-start').addEventListener('click', function(){
    document.getElementById('start').style.display='none';
    mode='play';
    setEvent(0);
    showToast('📍 Đi tới vòng sáng ⏰ ở cửa Nhà ở!', 3200);
  });
  document.getElementById('dlg').addEventListener('click', function(){ if(mode==='dialog') advanceDlg(); });
  document.getElementById('btn-again').addEventListener('click', function(){ location.reload(); });
  document.getElementById('btn-copy').addEventListener('click', function(){
    var txt="Nhân ngày 20/11, em xin gửi lời cảm ơn chân thành nhất tới thầy cô. Cảm ơn thầy cô đã dạy dỗ, đã kiên nhẫn và đã luôn tin tưởng chúng em, kể cả những lúc chúng em chưa tin vào chính mình. Chúc thầy cô luôn mạnh khỏe và giữ mãi ngọn lửa với nghề. Từ game 3D “Một Ngày Làm Giảng Viên” (CODE THE THANKS 2026)";
    function done(){ document.getElementById('copy-ok').textContent='✅ Đã chép! Dán vào Zalo/Facebook để gửi thầy cô nhé.'; }
    if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(txt).then(done, done); }
    else { var ta=document.createElement('textarea'); ta.value=txt; document.body.appendChild(ta); ta.select(); try{ document.execCommand('copy'); }catch(e){} document.body.removeChild(ta); done(); }
  });
  syncStats();
  var _booted=false;
  function boot(){
    if(_booted) return; _booted=true;
    try { init(); bindInput(); var bs=document.getElementById('btn-start'); if(bs){ bs.disabled=false; bs.textContent='▶ Bắt đầu ngày mới'; } }
    catch(err){ var d=document.getElementById('err'); if(d){ d.style.display='block'; d.textContent='⚠️ Thiết bị/trình duyệt này không chạy được WebGL 3D: '+err.message; } }
  }
  if(window.__threeReady){
    Promise.race([ window.__threeReady.then(function(){ return loadModels(); }),
                   new Promise(function(r){ setTimeout(r, 6000); }) ]).then(boot, boot);
  } else { boot(); }
});
