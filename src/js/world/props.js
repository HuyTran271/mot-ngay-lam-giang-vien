"use strict";
function tree(x,z,s){
  var _kinds=['treeOak','treePine','treeDetailed'];
  var _kind=_kinds[Math.abs(Math.round(x*7+z*13))%3];
  if(MODELS[_kind]){ var _pm=placeModel(_kind, x, z, 4.3*(s||1), (Math.abs(Math.round(x*3+z*5))%6)*1.05); if(_pm && typeof regWind==='function') regWind(_pm, 0.02); solid(x-0.55, z-0.55, x+0.55, z+0.55); return; }
  var g=new THREE.Group(); g.position.set(x,0,z); g.scale.setScalar(s||1);
  var trunk=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.3,1.6,7), new THREE.MeshStandardMaterial({color:0x8a5a28, roughness:.9}));
  trunk.position.y=0.8; trunk.castShadow=true; g.add(trunk);
  var c1=new THREE.Mesh(new THREE.SphereGeometry(1.5,10,8), new THREE.MeshStandardMaterial({color:0x4e7a3a, roughness:.9}));
  c1.position.y=2.6; c1.castShadow=true; g.add(c1);
  var c2=new THREE.Mesh(new THREE.SphereGeometry(1.05,10,8), new THREE.MeshStandardMaterial({color:0x5d8a44, roughness:.9}));
  c2.position.set(0.7,3.4,0.3); c2.castShadow=true; g.add(c2);
  scene.add(g); if(typeof regWind==='function') regWind(g, 0.025); solid(x-0.55, z-0.55, x+0.55, z+0.55);
}
function lamp(x,z){
  var poleMat=new THREE.MeshStandardMaterial({color:0x3f3730, roughness:0.65, metalness:0.25});
  var base=new THREE.Mesh(new THREE.CylinderGeometry(0.14,0.18,0.35,8), poleMat);
  base.position.set(x,0.175,z); base.castShadow=true; scene.add(base);
  var pole=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.09,3.1,8), poleMat);
  pole.position.set(x,1.55,z); pole.castShadow=true; scene.add(pole);
  var cap=new THREE.Mesh(new THREE.ConeGeometry(0.36,0.22,8), poleMat);
  cap.position.set(x,3.42,z); scene.add(cap);
  var bulbMat=new THREE.MeshStandardMaterial({color:0xffe9a8, emissive:0xffbe44, emissiveIntensity:0.35, roughness:0.3});
  var bulb=new THREE.Mesh(new THREE.SphereGeometry(0.23,12,10), bulbMat);
  bulb.position.set(x,3.2,z); scene.add(bulb);
  var hc=document.createElement('canvas'); hc.width=hc.height=64;
  var hg=hc.getContext('2d');
  hg.fillStyle='rgba(255,214,120,0.32)'; hg.beginPath(); hg.arc(32,32,26,0,Math.PI*2); hg.fill();
  hg.fillStyle='rgba(255,235,175,0.55)'; hg.beginPath(); hg.arc(32,32,14,0,Math.PI*2); hg.fill();
  var htx=new THREE.CanvasTexture(hc); htx.colorSpace=THREE.SRGBColorSpace;
  var haloMat=new THREE.SpriteMaterial({map:htx, transparent:true, opacity:0.25, depthWrite:false});
  var halo=new THREE.Sprite(haloMat);
  halo.position.set(x,3.2,z); halo.scale.set(2.8,2.8,1); scene.add(halo);
  lampLights.push({bulbMat:bulbMat, haloMat:haloMat, halo:halo});
  solid(x-0.2, z-0.2, x+0.2, z+0.2);
}
var _grassTex=null, _pathTex=null;
function grassTexture(){
  if(_grassTex) return _grassTex;
  var c=document.createElement('canvas'); c.width=c.height=256;
  var g=c.getContext('2d');
  g.fillStyle='#67a349'; g.fillRect(0,0,256,256);
  var cols=['#5d9740','#72ae52','#619c44','#7ab65a'];
  for(var i=0;i<320;i++){
    g.fillStyle=cols[i%4];
    var x=(i*73)%256, y=(i*137)%256;
    g.fillRect(x,y,4+((i*11)%6),3+((i*7)%5));
  }
  var tx=new THREE.CanvasTexture(c); tx.colorSpace=THREE.SRGBColorSpace;
  tx.wrapS=tx.wrapT=THREE.RepeatWrapping; tx.repeat.set(22,26);
  _grassTex=tx; return tx;
}
function pathTexture(){
  if(_pathTex) return _pathTex;
  var c=document.createElement('canvas'); c.width=c.height=128;
  var g=c.getContext('2d');
  g.fillStyle='#bfb191'; g.fillRect(0,0,128,128);
  g.strokeStyle='rgba(145,130,102,0.45)'; g.lineWidth=2;
  for(var y=0;y<128;y+=32){
    g.beginPath(); g.moveTo(0,y); g.lineTo(128,y); g.stroke();
    var off=(y/32)%2? 32 : 0;
    for(var x=off;x<128;x+=64){ g.beginPath(); g.moveTo(x,y); g.lineTo(x,y+32); g.stroke(); }
  }
  g.fillStyle='rgba(255,248,230,0.16)';
  for(var k=0;k<40;k++) g.fillRect((k*37)%124,(k*53)%124,4,4);
  var tx=new THREE.CanvasTexture(c); tx.colorSpace=THREE.SRGBColorSpace;
  tx.wrapS=tx.wrapT=THREE.RepeatWrapping;
  _pathTex=tx; return tx;
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
  g.fillStyle='#d9c69c'; g.fillRect(0,244,256,12);
  var cols=4, rows=3, ww=34, wh=40, gx=(256-cols*ww)/(cols+1), gy=(256-rows*wh)/(rows+1);
  for(var r=0;r<rows;r++){
    if(r>0){ g.fillStyle='#e6d3a8'; g.fillRect(0, gy+r*(wh+gy)-gy*0.55, 256, 5); }
    for(var ci=0;ci<cols;ci++){
      var x=gx+ci*(ww+gx), y=gy+r*(wh+gy);
      g.fillStyle='#8a6d4a'; g.fillRect(x-4,y-4,ww+8,wh+8);
      g.fillStyle='#cbb489'; g.fillRect(x-1,y-1,ww+2,wh+2);
      var grad=g.createLinearGradient?g.createLinearGradient(x,y,x,y+wh):null;
      if(grad && grad.addColorStop){
        grad.addColorStop(0,'#5b83b4'); grad.addColorStop(0.55,'#33507e'); grad.addColorStop(1,'#27436b');
        g.fillStyle=grad;
      } else g.fillStyle='#33507e';
      g.fillRect(x,y,ww,wh);
      g.fillStyle='rgba(255,255,255,.30)';
      g.beginPath(); g.moveTo(x+4,y+wh); g.lineTo(x+15,y); g.lineTo(x+24,y); g.lineTo(x+13,y+wh); g.closePath(); g.fill();
      g.fillStyle='rgba(255,255,255,.20)'; g.fillRect(x,y,ww,9);
      g.strokeStyle='#8a6d4a'; g.lineWidth=3;
      g.beginPath(); g.moveTo(x+ww/2,y); g.lineTo(x+ww/2,y+wh); g.moveTo(x,y+wh/2); g.lineTo(x+ww,y+wh/2); g.stroke();
      g.fillStyle='rgba(90,70,40,.35)'; g.fillRect(x-4,y+wh+4,ww+8,3);
    }
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
  // Chi tiết hoàn thiện: bệ chân tường, gờ dưới mái, cột góc, bậc thềm mặt trước
  var trimM=new THREE.MeshStandardMaterial({color:0xe6d3a8, roughness:.9});
  var base=new THREE.Mesh(new THREE.BoxGeometry(w+0.35,0.55,d+0.35), new THREE.MeshStandardMaterial({color:0xb8a888, roughness:.95}));
  base.position.set(x,0.27,z); base.receiveShadow=true; scene.add(base);
  var eave=new THREE.Mesh(new THREE.BoxGeometry(w+0.9,0.2,d+0.9), trimM);
  eave.position.set(x,h-0.08,z); eave.castShadow=true; scene.add(eave);
  var pilG=new THREE.BoxGeometry(0.42,h,0.42);
  [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(function(sg){
    var pil=new THREE.Mesh(pilG, trimM);
    pil.position.set(x+sg[0]*w/2, h/2, z+sg[1]*d/2); pil.castShadow=true; scene.add(pil);
  });
  var step1=new THREE.Mesh(new THREE.BoxGeometry(Math.min(3.2,w*0.3),0.16,0.75), base.material);
  step1.position.set(x,0.08,z+d/2+0.55); step1.receiveShadow=true; scene.add(step1);
  var step2=new THREE.Mesh(new THREE.BoxGeometry(Math.min(3.2,w*0.3),0.32,0.45), base.material);
  step2.position.set(x,0.16,z+d/2+0.28); scene.add(step2);
  return m;
}
function beacon(x, z, emo){
  var grp=new THREE.Group(); grp.position.set(x, 0, z);
  var ring=new THREE.Mesh(new THREE.RingGeometry(1.05, 1.48, 40), new THREE.MeshBasicMaterial({color:0xf2b33d, transparent:true, opacity:.92, side:THREE.DoubleSide}));
  ring.rotation.x=-Math.PI/2; ring.position.y=0.06; grp.add(ring);
  var inner=new THREE.Mesh(new THREE.RingGeometry(0.55, 0.78, 24), new THREE.MeshBasicMaterial({color:0xffe9a8, transparent:true, opacity:.7, side:THREE.DoubleSide}));
  inner.rotation.x=-Math.PI/2; inner.position.y=0.065; grp.add(inner);
  var beam=new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.32, 6.2, 24, 1, true), new THREE.MeshBasicMaterial({color:0xffd76e, transparent:true, opacity:0.16, side:THREE.DoubleSide, depthWrite:false}));
  beam.position.y=3.1; grp.add(beam);
  var icon=makeIcon(emo, 2.2); icon.position.y=2.6; grp.add(icon);
  scene.add(grp);
  return {grp:grp, ring:ring, inner:inner, beam:beam, icon:icon, x:x, z:z};
}
