"use strict";
window.addEventListener('error', function(e){ var d=document.getElementById('err'); if(d){ d.style.display='block'; d.textContent='⚠️ Có lỗi khi chạy demo 3D: '+(e.message||'không rõ')+', chụp màn hình gửi mình nhé!'; } });

var SOLIDS=[]; // {x0,z0,x1,z1}
function solid(x0,z0,x1,z1){ SOLIDS.push({x0:x0,z0:z0,x1:x1,z1:z1}); }
function collideXZ(nx, nz, r){
  // Biên phía Nam được mở rộng cho khu vườn cộng đồng mới.
  nx=Math.max(-41.5, Math.min(41.5, nx)); nz=Math.max(-55.5, Math.min(72.5, nz));
  for(var i=0;i<SOLIDS.length;i++){ var o=SOLIDS[i];
    var cx=Math.max(o.x0, Math.min(nx, o.x1)), cz=Math.max(o.z0, Math.min(nz, o.z1));
    var dx=nx-cx, dz=nz-cz, d2=dx*dx+dz*dz;
    if(d2<r*r){ var d=Math.sqrt(d2)||0.001; if(d2===0){ nz=o.z0-r-0.05; } else { nx=cx+dx/d*r; nz=cz+dz/d*r; } }
  }
  return {x:nx, z:nz};
}

var scene, camera, renderer, clock;
var player, playerParts, students=[];
var S={en:70, he:70, fi:60, flags:{}, badges:[]};
var mode='start'; // start | play | dialog
var keys={};
var joy={on:false, id:null, bx:0, by:0, dx:0, dy:0};
var target=null, targetRing=null, stallT=0, lastPX=0, lastPZ=0;
var beaconStep=0, beacons=[];
var flagMesh=null, lampLights=[], lakeMeshes=[], LAKE_MATS=[], burstParticles=[], dustParticles=[], ambientParticles=null;
var skyDome=null, skyMat=null, celestialBody=null, starPoints=null, hemiLight=null, sunLight=null;
var camShake=0, sfxMuted=false, _audioCtx=null;
// Bảng màu bầu trời & ánh sáng theo 13 mốc thời gian (05:00 -> 01:00)
var TIME_THEMES=[
  {sky:0x2b3556, fog:0x364166, sun:0xffa873, sunI:0.9, hemiSky:0x7888b8, hemiGnd:0x2c3828, hemiI:0.65, sx:-38, sy:14, sz:24, lamp:0.95, stars:0.65},
  {sky:0x7ec0ee, fog:0x95cef5, sun:0xffdfb0, sunI:1.55, hemiSky:0xc2e2ff, hemiGnd:0x60824a, hemiI:0.9, sx:26, sy:32, sz:24, lamp:0.15, stars:0},
  {sky:0x97d2f7, fog:0xa8daf8, sun:0xffe6bd, sunI:1.85, hemiSky:0xd2ecff, hemiGnd:0x729654, hemiI:0.95, sx:34, sy:46, sz:22, lamp:0, stars:0},
  {sky:0x9fd6f9, fog:0xb0dff9, sun:0xfff0d4, sunI:2.0, hemiSky:0xdcf0ff, hemiGnd:0x7ca05c, hemiI:1.0, sx:28, sy:56, sz:16, lamp:0, stars:0},
  {sky:0xa4dafc, fog:0xb5e3fc, sun:0xfff6e3, sunI:2.1, hemiSky:0xe3f4ff, hemiGnd:0x82a562, hemiI:1.05, sx:12, sy:64, sz:10, lamp:0, stars:0},
  {sky:0x9dd4f8, fog:0xb2dff9, sun:0xfff5de, sunI:2.15, hemiSky:0xe0f2ff, hemiGnd:0x82a562, hemiI:1.05, sx:0, sy:68, sz:6, lamp:0, stars:0},
  {sky:0x96cef2, fog:0xabd9f4, sun:0xffeac2, sunI:1.95, hemiSky:0xd8ecff, hemiGnd:0x789c58, hemiI:0.98, sx:-18, sy:54, sz:14, lamp:0, stars:0},
  {sky:0x8ec2ea, fog:0xa6d0ee, sun:0xffdc9e, sunI:1.75, hemiSky:0xcce2fa, hemiGnd:0x6e8f50, hemiI:0.9, sx:-32, sy:40, sz:20, lamp:0, stars:0},
  {sky:0xd99b72, fog:0xdca682, sun:0xff9c59, sunI:1.45, hemiSky:0xf5ba95, hemiGnd:0x5e6940, hemiI:0.8, sx:-44, sy:22, sz:26, lamp:0.45, stars:0.1},
  {sky:0x363b63, fog:0x3c4068, sun:0x8fa4d8, sunI:0.65, hemiSky:0x58689c, hemiGnd:0x252d26, hemiI:0.55, sx:30, sy:36, sz:-24, lamp:1.0, stars:0.8},
  {sky:0x1b233d, fog:0x212945, sun:0x8da6de, sunI:0.55, hemiSky:0x435282, hemiGnd:0x1d231e, hemiI:0.48, sx:26, sy:44, sz:-20, lamp:1.1, stars:0.95},
  {sky:0x141b30, fog:0x192038, sun:0x829ad4, sunI:0.5, hemiSky:0x394772, hemiGnd:0x181d1a, hemiI:0.44, sx:16, sy:50, sz:-16, lamp:1.15, stars:1.0},
  {sky:0x0f1526, fog:0x141b2e, sun:0x7a92cc, sunI:0.48, hemiSky:0x334066, hemiGnd:0x151a18, hemiI:0.42, sx:6, sy:54, sz:-12, lamp:1.2, stars:1.0}
];
function playSfx(type){
  if(sfxMuted) return;
  try{
    var AC=window.AudioContext || window.webkitAudioContext; if(!AC) return;
    if(!_audioCtx) _audioCtx=new AC();
    if(_audioCtx.state==='suspended') _audioCtx.resume();
    var now=_audioCtx.currentTime;
    function tone(freq, dur, vol, wave, delay, freqEnd){
      var o=_audioCtx.createOscillator(), g=_audioCtx.createGain();
      o.type=wave||'sine'; o.frequency.setValueAtTime(freq, now+(delay||0));
      if(freqEnd) o.frequency.exponentialRampToValueAtTime(freqEnd, now+(delay||0)+dur);
      g.gain.setValueAtTime(0.0001, now+(delay||0));
      g.gain.linearRampToValueAtTime(vol||0.08, now+(delay||0)+0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, now+(delay||0)+dur);
      o.connect(g); g.connect(_audioCtx.destination);
      o.start(now+(delay||0)); o.stop(now+(delay||0)+dur+0.02);
    }
    if(type==='pickup'){ tone(587,0.12,0.09,'triangle',0,880); tone(880,0.18,0.08,'triangle',0.08,1174); }
    else if(type==='hit'){ tone(190,0.22,0.11,'sawtooth',0,95); }
    else if(type==='scene'){ tone(523,0.14,0.07,'sine',0); tone(659,0.18,0.07,'sine',0.09); }
    else if(type==='pick'){ tone(440,0.08,0.06,'triangle',0,554); }
    else if(type==='blip'){ tone(500+Math.random()*70,0.035,0.018,'square',0); }
    else if(type==='end'){ tone(523,0.18,0.08,'sine',0); tone(659,0.18,0.08,'sine',0.12); tone(784,0.28,0.09,'sine',0.24); tone(1046,0.4,0.08,'sine',0.36); }
  }catch(e){}
}
function spawnBurst(x, y, z, color, count){
  if(!scene || typeof THREE==='undefined') return;
  var n=count||12;
  for(var i=0;i<n;i++){
    var m=new THREE.Mesh(
      new THREE.SphereGeometry(0.11, 6, 5),
      new THREE.MeshBasicMaterial({color:color, transparent:true, opacity:0.95})
    );
    m.position.set(x, y, z);
    var ang=Math.random()*Math.PI*2, spd=1.8+Math.random()*3.2;
    scene.add(m);
    burstParticles.push({m:m, vx:Math.cos(ang)*spd, vy:2.5+Math.random()*3.2, vz:Math.sin(ang)*spd, life:0.55+Math.random()*0.25, max:0.8});
  }
}
function buzz(p){ try{ if(navigator && navigator.vibrate) navigator.vibrate(p); }catch(e){} }
var toastTimer=null;
var cur=0, pendingNext=null, collapseUsed=false, inCollapse=false, invulnT=0;
var pickups=[], spirit=null;
var guideArrow=null;
var seated=[];

function box(w,h,d,color,x,y,z,parent,shadow){
  var m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d), new THREE.MeshStandardMaterial({color:color, roughness:.85}));
  m.position.set(x,y,z); if(shadow!==false){ m.castShadow=true; m.receiveShadow=true; }
  (parent||scene).add(m); return m;
}
var LABELS=[]; var _lblT=0, _lv=null;
function makeLabel(text, w, fs){
  var c=document.createElement('canvas'); c.width=512; c.height=112;
  var g=c.getContext('2d');
  g.fillStyle='rgba(13,20,40,.87)'; g.beginPath(); g.roundRect(6,14,500,84,40); g.fill();
  g.strokeStyle='rgba(242,179,61,.9)'; g.lineWidth=5; g.beginPath(); g.roundRect(6,14,500,84,40); g.stroke();
  g.fillStyle='#fff'; g.font='bold '+(fs||44)+'px "Segoe UI",sans-serif'; g.textAlign='center'; g.textBaseline='middle';
  g.fillText(text, 256, 58);
  var tx=new THREE.CanvasTexture(c); tx.colorSpace=THREE.SRGBColorSpace;
  var sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tx, transparent:true}));
  sp.scale.set(w||11, (w||11)*0.219, 1);
  sp.userData={w:sp.scale.x, h:sp.scale.y, prio:(w||11), tag:(fs===40)}; LABELS.push(sp); return sp;
}

function updateLabels(){
  if(!camera || !player || typeof THREE==='undefined' || !THREE.Vector3 || !THREE.MathUtils) return;
  if(!_lv) _lv=new THREE.Vector3();
  if(!_lv.project) return;
  var hideAll=(mode!=='play');
  var W=window.innerWidth||1, H=window.innerHeight||1;
  var tanF=Math.tan(THREE.MathUtils.degToRad(camera.fov*0.5));
  var list=LABELS.slice().sort(function(a,b){ return b.userData.prio-a.userData.prio; });
  var kept=[];
  for(var i=0;i<list.length;i++){
    var sp=list[i], ud=sp.userData;
    if(hideAll){ if(sp.visible) sp.visible=false; continue; }
    var dx=sp.position.x-player.position.x, dz=sp.position.z-player.position.z;
    var maxD=ud.tag?26:48;
    if(dx*dx+dz*dz>maxD*maxD){ if(sp.visible) sp.visible=false; continue; }
    _lv.copy(sp.position); _lv.project(camera);
    if(_lv.z>1 || _lv.z<-1){ if(sp.visible) sp.visible=false; continue; }
    var dc=camera.position.distanceTo(sp.position)||1;
    var pxH=ud.h/(2*dc*tanF)*H, pxW=pxH*(ud.w/ud.h);
    var sx=(_lv.x*0.5+0.5)*W, sy=(-_lv.y*0.5+0.5)*H;
    var r={x1:sx-pxW/2, y1:sy-pxH/2, x2:sx+pxW/2, y2:sy+pxH/2};
    if(r.x2<0 || r.x1>W || r.y2<0 || r.y1>H){ if(sp.visible) sp.visible=false; continue; }
    var th=sp.visible?0.16:0.08;
    var bad=false;
    for(var j=0;j<kept.length;j++){ var k=kept[j];
      var ox=Math.min(r.x2,k.x2)-Math.max(r.x1,k.x1), oy=Math.min(r.y2,k.y2)-Math.max(r.y1,k.y1);
      if(ox>0 && oy>0){ var mine=(r.x2-r.x1)*(r.y2-r.y1); if(mine>0 && (ox*oy)>mine*th){ bad=true; break; } }
    }
    if(bad){ if(sp.visible) sp.visible=false; continue; }
    sp.visible=true; kept.push(r);
  }
}

function makeIcon(emo, s){
  var c=document.createElement('canvas'); c.width=c.height=128;
  var g=c.getContext('2d'); g.font='92px serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillText(emo, 64, 70);
  var tx=new THREE.CanvasTexture(c); tx.colorSpace=THREE.SRGBColorSpace;
  var sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tx, transparent:true}));
  sp.scale.set(s||2.2, s||2.2, 1); return sp;
}
