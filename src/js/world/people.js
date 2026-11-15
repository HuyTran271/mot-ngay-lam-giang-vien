"use strict";
function makePerson(o){
  var g=new THREE.Group();
  var suit=new THREE.MeshStandardMaterial({color:o.suit, roughness:.8});
  var cloth=new THREE.MeshStandardMaterial({color:o.cloth, roughness:.85});
  var skin=new THREE.MeshStandardMaterial({color:o.skin||0xf2c49b, roughness:.7});
  var hairM=new THREE.MeshStandardMaterial({color:o.hair, roughness:.9});
  function bx(w,h,d,mat,x,y,z,parent){ var m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat); m.position.set(x,y,z); m.castShadow=true; (parent||g).add(m); return m; }
  var legL=new THREE.Group(); legL.position.set(-0.16,0.98,0); g.add(legL);
  var legR=new THREE.Group(); legR.position.set(0.16,0.98,0); g.add(legR);
  bx(0.27,0.95,0.3, cloth, 0,-0.46,0, legL); bx(0.27,0.95,0.3, cloth, 0,-0.46,0, legR);
  bx(0.3,0.12,0.42, new THREE.MeshStandardMaterial({color:0x333333}), 0,-0.95,0.05, legL);
  bx(0.3,0.12,0.42, new THREE.MeshStandardMaterial({color:0x333333}), 0,-0.95,0.05, legR);
  bx(0.8, o.long?1.15:0.85, 0.44, suit, 0, o.long?1.28:1.42, 0);
  if(!o.long){ bx(0.42,0.68,0.05, new THREE.MeshStandardMaterial({color:0xffffff}), 0,1.46,0.23); }
  if(o.tie){ bx(0.13,0.5,0.06, new THREE.MeshStandardMaterial({color:0xd43a2f}), 0,1.5,0.25); }
  var armL=new THREE.Group(); armL.position.set(-0.5,1.78,0); g.add(armL);
  var armR=new THREE.Group(); armR.position.set(0.5,1.78,0); g.add(armR);
  bx(0.23,0.8,0.27, suit, 0,-0.36,0, armL); bx(0.23,0.8,0.27, suit, 0,-0.36,0, armR);
  bx(0.54,0.56,0.5, skin, 0,2.26,0);
  bx(0.58,0.2,0.56, hairM, 0,2.6,0);
  bx(0.58, o.longHair?0.85:0.42, 0.14, hairM, 0, o.longHair?2.2:2.42, -0.24);
  g.userData={legL:legL, legR:legR, armL:armL, armR:armR, phase:Math.random()*6, baseY:0};
  return g;
}
function animPerson(p, moving, dt, t){
  var u=p.userData;
  if(moving){ u.phase+=dt*9; }
  var sw=moving? Math.sin(u.phase)*0.6 : 0;
  u.legL.rotation.x=sw; u.legR.rotation.x=-sw; u.armL.rotation.x=-sw*0.8; u.armR.rotation.x=sw*0.8;
  p.position.y=u.baseY + (moving? Math.abs(Math.sin(u.phase))*0.08 : Math.sin(t*1.8+u.phase)*0.015);
}
function faceToward(p, dx, dz, dt){
  if(Math.abs(dx)<0.01 && Math.abs(dz)<0.01) return;
  var want=Math.atan2(dx, dz), cur=p.rotation.y, diff=want-cur;
  while(diff>Math.PI) diff-=Math.PI*2; while(diff<-Math.PI) diff+=Math.PI*2;
  p.rotation.y=cur+diff*Math.min(1, dt*12);
}

// Tạo nhân vật chính + các NPC trong khuôn viên
function buildPeople(){
  // Người
  player=makePerson({suit:0x27364f, cloth:0x3a3f4a, hair:0x2b2b30, tie:true});
  player.position.set(0,0,35); player.rotation.y=Math.PI; scene.add(player);
  var st1=makePerson({suit:0xffffff, cloth:0x27364f, hair:0x4a3421});
  st1.position.set(-24,0,-32); st1.rotation.y=-0.7; scene.add(st1);
  var stLabel=makeLabel('Sinh viên', 4.6, 40); stLabel.position.set(-24,3.4,-32); scene.add(stLabel);
  var st2=makePerson({suit:0xffffff, cloth:0x27364f, hair:0x191919});
  st2.position.set(-32,0,-25); scene.add(st2);
  students.push({p:st2, a:{x:-32,z:-25}, b:{x:-32,z:-44}, t:0, dir:1, speed:2.3});
  var gv=makePerson({suit:0x8e2f3c, cloth:0xffffff, hair:0x5a3a22, long:true, longHair:true});
  gv.position.set(-13,0,-20); gv.rotation.y=0.4; scene.add(gv);
  var gvLabel=makeLabel('💻 Khoa CNTT', 5.2, 40); gvLabel.position.set(-13,3.5,-20); scene.add(gvLabel);
}
