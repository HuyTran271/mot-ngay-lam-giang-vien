"use strict";
window.addEventListener('error', function(e){ var d=document.getElementById('err'); if(d){ d.style.display='block'; d.textContent='⚠️ Có lỗi khi chạy demo 3D: '+(e.message||'không rõ')+', chụp màn hình gửi mình nhé!'; } });

var SOLIDS=[]; // {x0,z0,x1,z1}
function solid(x0,z0,x1,z1){ SOLIDS.push({x0:x0,z0:z0,x1:x1,z1:z1}); }
function collideXZ(nx, nz, r){
  nx=Math.max(-41.5, Math.min(41.5, nx)); nz=Math.max(-55.5, Math.min(51.5, nz));
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
var flagMesh=null, lampLights=[];
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
function makeLabel(text, w, fs){
  var c=document.createElement('canvas'); c.width=512; c.height=112;
  var g=c.getContext('2d');
  g.fillStyle='rgba(13,20,40,.87)'; g.beginPath(); g.roundRect(6,14,500,84,40); g.fill();
  g.strokeStyle='rgba(242,179,61,.9)'; g.lineWidth=5; g.beginPath(); g.roundRect(6,14,500,84,40); g.stroke();
  g.fillStyle='#fff'; g.font='bold '+(fs||44)+'px "Segoe UI",sans-serif'; g.textAlign='center'; g.textBaseline='middle';
  g.fillText(text, 256, 58);
  var tx=new THREE.CanvasTexture(c); tx.colorSpace=THREE.SRGBColorSpace;
  var sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tx, transparent:true}));
  sp.scale.set(w||11, (w||11)*0.219, 1); return sp;
}
function makeIcon(emo, s){
  var c=document.createElement('canvas'); c.width=c.height=128;
  var g=c.getContext('2d'); g.font='92px serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillText(emo, 64, 70);
  var tx=new THREE.CanvasTexture(c); tx.colorSpace=THREE.SRGBColorSpace;
  var sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tx, transparent:true}));
  sp.scale.set(s||2.2, s||2.2, 1); return sp;
}
