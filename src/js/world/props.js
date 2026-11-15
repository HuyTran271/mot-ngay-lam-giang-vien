"use strict";
function tree(x,z,s){
  var _kinds=['treeOak','treePine','treeDetailed'];
  var _kind=_kinds[Math.abs(Math.round(x*7+z*13))%3];
  if(MODELS[_kind]){ placeModel(_kind, x, z, 4.3*(s||1), (Math.abs(Math.round(x*3+z*5))%6)*1.05); solid(x-0.55, z-0.55, x+0.55, z+0.55); return; }
  var g=new THREE.Group(); g.position.set(x,0,z); g.scale.setScalar(s||1);
  var trunk=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.3,1.6,7), new THREE.MeshStandardMaterial({color:0x8a5a28, roughness:.9}));
  trunk.position.y=0.8; trunk.castShadow=true; g.add(trunk);
  var c1=new THREE.Mesh(new THREE.SphereGeometry(1.5,10,8), new THREE.MeshStandardMaterial({color:0x4e7a3a, roughness:.9}));
  c1.position.y=2.6; c1.castShadow=true; g.add(c1);
  var c2=new THREE.Mesh(new THREE.SphereGeometry(1.05,10,8), new THREE.MeshStandardMaterial({color:0x5d8a44, roughness:.9}));
  c2.position.set(0.7,3.4,0.3); c2.castShadow=true; g.add(c2);
  scene.add(g); solid(x-0.55, z-0.55, x+0.55, z+0.55);
}
function lamp(x,z){
  var pole=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.09,3.1,6), new THREE.MeshStandardMaterial({color:0x5a4632}));
  pole.position.set(x,1.55,z); pole.castShadow=true; scene.add(pole);
  var bulb=new THREE.Mesh(new THREE.SphereGeometry(0.24,10,8), new THREE.MeshStandardMaterial({color:0xffe9a8, emissive:0xffca55, emissiveIntensity:.7}));
  bulb.position.set(x,3.2,z); scene.add(bulb);
  solid(x-0.2, z-0.2, x+0.2, z+0.2);
}
// Mặt đứng nhà học dùng chung: canvas vẽ 1 lần (nền kem + lưới cửa sổ xanh xám có khung),
// dùng cho các khối nhà trang trí (giảng đường, ký túc xá, nhà điều hành) giống nhà khoa thật:
// tường kem nhiều tầng, cửa sổ đều, mái ngói cam đỏ dốc 2 phía với đầu hồi màu kem.
var _facadeTex=null;
function facadeTexture(){
  if(_facadeTex) return _facadeTex;
  var c=document.createElement('canvas'); c.width=256; c.height=256;
  var g=c.getContext('2d');
  g.fillStyle='#f3e6c8'; g.fillRect(0,0,256,256);
  g.fillStyle='#e0cda1'; g.fillRect(0,0,256,12);
  var cols=4, rows=3, ww=34, wh=40, gx=(256-cols*ww)/(cols+1), gy=(256-rows*wh)/(rows+1);
  for(var r=0;r<rows;r++) for(var ci=0;ci<cols;ci++){
    var x=gx+ci*(ww+gx), y=gy+r*(wh+gy);
    g.fillStyle='#d8c9a3'; g.fillRect(x-3,y-3,ww+6,wh+6);
    g.fillStyle='#33507e'; g.fillRect(x,y,ww,wh);
    g.fillStyle='rgba(255,255,255,.28)'; g.fillRect(x,y,ww,11);
    g.strokeStyle='#f3e6c8'; g.lineWidth=3;
    g.beginPath(); g.moveTo(x+ww/2,y); g.lineTo(x+ww/2,y+wh); g.moveTo(x,y+wh/2); g.lineTo(x+ww,y+wh/2); g.stroke();
  }
  var tx=new THREE.CanvasTexture(c); tx.colorSpace=THREE.SRGBColorSpace;
  tx.wrapS=tx.wrapT=THREE.RepeatWrapping;
  _facadeTex=tx; return tx;
}
function decoBuilding(w,h,d,x,z,roofColor){
  var tex=facadeTexture();
  function wm(repX){
    var t=tex.clone(); t.needsUpdate=true; t.wrapS=t.wrapT=THREE.RepeatWrapping;
    t.repeat.set(Math.max(1,Math.round(repX)),1);
    return new THREE.MeshStandardMaterial({map:t, roughness:.9});
  }
  var sideM=wm(d/8), frontM=wm(w/8);
  var plainM=new THREE.MeshStandardMaterial({color:0xf3e6c8, roughness:.95});
  var m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d), [sideM,sideM,plainM,plainM,frontM,frontM]);
  m.position.set(x,h/2,z); m.castShadow=true; m.receiveShadow=true; scene.add(m);
  var rise=(d/2+0.5)*0.55;
  var shape=new THREE.Shape();
  shape.moveTo(-(d/2+0.5),0); shape.lineTo(d/2+0.5,0); shape.lineTo(0,rise); shape.closePath();
  var rg=new THREE.ExtrudeGeometry(shape, {depth:w+0.8, bevelEnabled:false});
  rg.rotateY(Math.PI/2);
  var rm=new THREE.Mesh(rg, [plainM, new THREE.MeshStandardMaterial({color:roofColor, roughness:.85})]);
  rm.position.set(x-(w+0.8)/2, h, z); rm.castShadow=true; rm.receiveShadow=true; scene.add(rm);
  return m;
}
function beacon(x, z, emo){
  var grp=new THREE.Group(); grp.position.set(x, 0, z);
  var ring=new THREE.Mesh(new THREE.RingGeometry(1.05, 1.45, 36), new THREE.MeshBasicMaterial({color:0xf2b33d, transparent:true, opacity:.9, side:THREE.DoubleSide}));
  ring.rotation.x=-Math.PI/2; ring.position.y=0.06; grp.add(ring);
  var icon=makeIcon(emo, 2.1); icon.position.y=2.6; grp.add(icon);
  scene.add(grp);
  return {grp:grp, ring:ring, icon:icon, x:x, z:z};
}
