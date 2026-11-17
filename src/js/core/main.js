"use strict";
var _camWant=null, _nvEl=null, _nvArrow=null, _nvTxt=null, _nvDeg=9999, _nvM=-1;
var _cSky=null, _cFog=null, _cSun=null, _cHS=null, _cHG=null, _vSun=null;
var _curLamp=0, _curStars=0, _dustT=0;

function init(){
  scene=new THREE.Scene();
  scene.background=new THREE.Color(0x2b3556);
  scene.fog=new THREE.Fog(0x364166, 75, 165);
  camera=new THREE.PerspectiveCamera(55, innerWidth/innerHeight, 0.1, 300);
  camera.position.set(0, 23, 52);
  renderer=new THREE.WebGLRenderer({antialias:true, powerPreference:'high-performance'});
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio||1, 2));
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  if(THREE.ACESFilmicToneMapping!==undefined){
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.06;
  }
  document.getElementById('app').appendChild(renderer.domElement);
  window.addEventListener('resize', function(){
    if(!camera || !renderer) return;
    camera.aspect=innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  hemiLight=new THREE.HemisphereLight(0xcfe6ff, 0x7a9a5a, 0.95); scene.add(hemiLight);
  sunLight=new THREE.DirectionalLight(0xffe3b3, 1.9);
  sunLight.position.set(34, 48, 22); sunLight.castShadow=true;
  sunLight.shadow.mapSize.set(2048,2048);
  sunLight.shadow.camera.left=-72; sunLight.shadow.camera.right=72; sunLight.shadow.camera.top=72; sunLight.shadow.camera.bottom=-72;
  sunLight.shadow.camera.near=5; sunLight.shadow.camera.far=140; sunLight.shadow.bias=-0.0005;
  scene.add(sunLight);

  // Bầu trời sao (hiện dần vào lúc 05:00 sáng sớm và buổi tối 19:00-01:00)
  if(THREE.BufferGeometry && THREE.Float32BufferAttribute && THREE.Points){
    var starGeo=new THREE.BufferGeometry();
    var starPos=[];
    for(var si=0; si<220; si++){
      var th=Math.random()*Math.PI*2, ph=Math.random()*Math.PI*0.42;
      var sr=145;
      starPos.push(Math.cos(th)*Math.sin(ph)*sr, Math.cos(ph)*sr+12, Math.sin(th)*Math.sin(ph)*sr);
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
    starPoints=new THREE.Points(starGeo, new THREE.PointsMaterial({color:0xfff6d6, size:1.15, transparent:true, opacity:0.65, depthWrite:false}));
    scene.add(starPoints);

    // Hạt không khí bay nhẹ (phấn hoa ban ngày / đom đóm buổi tối)
    var ambGeo=new THREE.BufferGeometry();
    var ambPos=[];
    for(var ai=0; ai<50; ai++){
      ambPos.push(-38+Math.random()*78, 0.8+Math.random()*5.5, -52+Math.random()*122);
    }
    ambGeo.setAttribute('position', new THREE.Float32BufferAttribute(ambPos, 3));
    ambientParticles=new THREE.Points(ambGeo, new THREE.PointsMaterial({color:0xffe99c, size:0.35, transparent:true, opacity:0.55, depthWrite:false}));
    scene.add(ambientParticles);
  }

  buildWorld();
  applyTimeTheme(0, 1);
  clock=new THREE.Clock();
  animate();
}

function applyTimeTheme(idx, alpha){
  var th=TIME_THEMES[Math.max(0, Math.min(idx, TIME_THEMES.length-1))];
  if(!th || !scene || !hemiLight || !sunLight) return;
  if(!_cSky){
    _cSky=new THREE.Color(); _cFog=new THREE.Color(); _cSun=new THREE.Color();
    _cHS=new THREE.Color(); _cHG=new THREE.Color(); _vSun=new THREE.Vector3();
  }
  _cSky.setHex(th.sky); _cFog.setHex(th.fog); _cSun.setHex(th.sun);
  _cHS.setHex(th.hemiSky); _cHG.setHex(th.hemiGnd);
  _vSun.set(th.sx, th.sy, th.sz);
  if(scene.background && scene.background.lerp) scene.background.lerp(_cSky, alpha);
  if(scene.fog && scene.fog.color && scene.fog.color.lerp) scene.fog.color.lerp(_cFog, alpha);
  if(hemiLight.color && hemiLight.color.lerp) hemiLight.color.lerp(_cHS, alpha);
  if(hemiLight.groundColor && hemiLight.groundColor.lerp) hemiLight.groundColor.lerp(_cHG, alpha);
  hemiLight.intensity += (th.hemiI - hemiLight.intensity) * alpha;
  if(sunLight.color && sunLight.color.lerp) sunLight.color.lerp(_cSun, alpha);
  sunLight.intensity += (th.sunI - sunLight.intensity) * alpha;
  if(sunLight.position && sunLight.position.lerp) sunLight.position.lerp(_vSun, alpha);

  _curLamp += (th.lamp - _curLamp) * alpha;
  for(var li=0; li<lampLights.length; li++){
    var ll=lampLights[li];
    ll.bulbMat.emissiveIntensity = 0.25 + _curLamp * 1.45;
    ll.haloMat.opacity = 0.08 + _curLamp * 0.65;
    var hs = 1.6 + _curLamp * 2.1;
    ll.halo.scale.set(hs, hs, 1);
  }
  _curStars += (th.stars - _curStars) * alpha;
  if(starPoints && starPoints.material) starPoints.material.opacity = _curStars * 0.85;
  if(ambientParticles && ambientParticles.material){
    ambientParticles.material.opacity = 0.28 + _curLamp * 0.45;
    ambientParticles.material.size = 0.26 + _curLamp * 0.2;
  }
}

function animate(){
  requestAnimationFrame(animate);
  var dt=Math.min(0.05, clock.getDelta()), t=clock.elapsedTime;
  applyTimeTheme(cur, Math.min(1, dt*1.6));
  if(typeof updateFx==='function') updateFx(dt, t);

  var moving=false, mx=0, mz=0;
  if(mode==='play'){
    if(typeof updateGratitude==='function') updateGratitude();
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
      _dustT+=dt;
      if(_dustT>0.14){
        _dustT=0;
        var dm=new THREE.Mesh(new THREE.SphereGeometry(0.14, 6, 5), new THREE.MeshBasicMaterial({color:0xe8dec5, transparent:true, opacity:0.55}));
        dm.position.set(player.position.x+(Math.random()-0.5)*0.3, 0.12, player.position.z+(Math.random()-0.5)*0.3);
        scene.add(dm);
        dustParticles.push({m:dm, life:0.35, max:0.35});
      }
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
        playSfx('pickup');
        spawnBurst(pk.x, 1.3, pk.z, pk.k==='en'?0xffd76e:(pk.k==='he'?0xff7b9c:0xff9045), 14);
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
        playSfx('hit');
        spawnBurst(player.position.x, 1.4, player.position.z, 0xd84a4a, 16);
        camShake=0.35;
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
  // Nhân vật ngồi
  for(var sdi=0; sdi<seated.length; sdi++){ var sdo=seated[sdi]; sdo.g.position.y=sdo.base+Math.sin(t*1.7+sdo.ph)*0.03; }
  // Hạt bụi chân & hiệu ứng nổ
  for(var di=dustParticles.length-1; di>=0; di--){
    var dp=dustParticles[di]; dp.life-=dt;
    if(dp.life<=0){ scene.remove(dp.m); dustParticles.splice(di,1); }
    else { var dk=dp.life/dp.max; dp.m.scale.setScalar(1+(1-dk)*0.9); dp.m.material.opacity=dk*0.45; dp.m.position.y+=dt*0.4; }
  }
  for(var bi2=burstParticles.length-1; bi2>=0; bi2--){
    var bp=burstParticles[bi2]; bp.life-=dt;
    if(bp.life<=0){ scene.remove(bp.m); burstParticles.splice(bi2,1); }
    else {
      bp.vy-=dt*9.5;
      bp.m.position.x+=bp.vx*dt; bp.m.position.y=Math.max(0.1, bp.m.position.y+bp.vy*dt); bp.m.position.z+=bp.vz*dt;
      bp.m.material.opacity=Math.max(0, bp.life/bp.max);
    }
  }
  if(ambientParticles && ambientParticles.geometry && ambientParticles.geometry.attributes && ambientParticles.geometry.attributes.position){
    var arr=ambientParticles.geometry.attributes.position.array;
    for(var ai2=0; ai2<arr.length; ai2+=3){
      arr[ai2+1]+=Math.sin(t*1.2+ai2)*0.008;
      arr[ai2]+=Math.cos(t*0.7+ai2)*0.006;
    }
    ambientParticles.geometry.attributes.position.needsUpdate=true;
  }
  // Gợn sóng hồ nước
  for(var lmi=0; lmi<lakeMeshes.length; lmi++){
    var lm=lakeMeshes[lmi], ph=(t*0.55+lmi*0.5)%1;
    lm.scale.setScalar(0.8+ph*1.1);
    lm.material.opacity=(1-ph)*0.45;
  }
  // Mũi tên chỉ đường tới điểm sự kiện
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
    if(bc2.inner){ bc2.inner.rotation.z=-t*1.2; var isc=1+0.15*Math.cos(t*3.5); bc2.inner.scale.set(isc,isc,1); }
    if(bc2.beam){ bc2.beam.material.opacity=0.11+0.07*Math.sin(t*2.6); }
    bc2.icon.position.y=2.6+Math.sin(t*2.2+j)*0.22;
  }
  if(flagMesh){ flagMesh.rotation.y=Math.sin(t*2.6)*0.16; flagMesh.position.x=-19.05+Math.sin(t*2.6)*0.08; }
  if(targetRing && targetRing.visible){ var tr=1+0.18*Math.sin(t*6); targetRing.scale.set(tr,tr,1); }
  // Camera bám theo + rung nhẹ khi va chạm Deadline
  if(!_camWant) _camWant=new THREE.Vector3();
  _camWant.set(player.position.x, 23, player.position.z+16.5);
  camera.position.lerp(_camWant, Math.min(1, dt*4.5));
  if(camShake>0){
    camShake=Math.max(0, camShake-dt);
    camera.position.x+=(Math.random()-0.5)*camShake*1.1;
    camera.position.y+=(Math.random()-0.5)*camShake*0.6;
  }
  camera.lookAt(player.position.x, 1.4, player.position.z-2);
  if(t-_lblT>0.18){ _lblT=t; updateLabels(); }
  renderer.render(scene, camera);
}

document.addEventListener('DOMContentLoaded', function(){
  document.getElementById('btn-start').addEventListener('click', function(){
    document.getElementById('start').style.display='none';
    mode='play';
    setEvent(0);
    playSfx('scene');
    showToast('📍 Đi tới vòng sáng ⏰ ở cửa Nhà ở!', 3200);
  });
  var muteBtn=document.getElementById('btn-mute');
  if(muteBtn){
    muteBtn.addEventListener('click', function(){
      sfxMuted=!sfxMuted;
      muteBtn.textContent=sfxMuted?'🔇':'🔊';
    });
  }
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
