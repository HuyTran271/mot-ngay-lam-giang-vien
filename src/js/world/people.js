"use strict";
function makePerson(o){
  var g=new THREE.Group();
  var suit=new THREE.MeshStandardMaterial({color:o.suit, roughness:.78});
  var cloth=new THREE.MeshStandardMaterial({color:o.cloth, roughness:.85});
  var skin=new THREE.MeshStandardMaterial({color:o.skin||0xf2c49b, roughness:.68});
  var hairM=new THREE.MeshStandardMaterial({color:o.hair, roughness:.88});
  var shoeM=new THREE.MeshStandardMaterial({color:0x2a2d34, roughness:.7});
  function bx(w,h,d,mat,x,y,z,parent){ var m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat); m.position.set(x,y,z); m.castShadow=true; (parent||g).add(m); return m; }
  // Bóng tiếp xúc mặt đất giúp nhân vật nổi khối rõ hơn
  var sh=new THREE.Mesh(new THREE.CircleGeometry(0.46, 16), new THREE.MeshBasicMaterial({color:0x000000, transparent:true, opacity:0.22, depthWrite:false}));
  sh.rotation.x=-Math.PI/2; sh.position.y=0.02; g.add(sh);
  var legL=new THREE.Group(); legL.position.set(-0.16,0.98,0); g.add(legL);
  var legR=new THREE.Group(); legR.position.set(0.16,0.98,0); g.add(legR);
  bx(0.27,0.95,0.3, cloth, 0,-0.46,0, legL); bx(0.27,0.95,0.3, cloth, 0,-0.46,0, legR);
  bx(0.3,0.13,0.44, shoeM, 0,-0.95,0.06, legL);
  bx(0.3,0.13,0.44, shoeM, 0,-0.95,0.06, legR);
  bx(0.8, o.long?1.15:0.85, 0.44, suit, 0, o.long?1.28:1.42, 0);
  if(!o.long){ bx(0.42,0.68,0.05, new THREE.MeshStandardMaterial({color:0xffffff}), 0,1.46,0.23); }
  if(o.tie){ bx(0.13,0.5,0.06, new THREE.MeshStandardMaterial({color:0xd43a2f}), 0,1.5,0.25); }
  var armL=new THREE.Group(); armL.position.set(-0.5,1.78,0); g.add(armL);
  var armR=new THREE.Group(); armR.position.set(0.5,1.78,0); g.add(armR);
  bx(0.23,0.72,0.27, suit, 0,-0.32,0, armL); bx(0.23,0.72,0.27, suit, 0,-0.32,0, armR);
  bx(0.19,0.16,0.21, skin, 0,-0.74,0, armL); bx(0.19,0.16,0.21, skin, 0,-0.74,0, armR);
  // Cổ & đầu
  bx(0.24,0.14,0.24, skin, 0,1.94,0);
  var head=new THREE.Group(); head.position.set(0,2.28,0); g.add(head);
  bx(0.54,0.56,0.5, skin, 0,0,0, head);
  bx(0.59,0.2,0.56, hairM, 0,0.34,0, head);
  bx(0.58,0.1,0.12, hairM, 0,0.24,0.23, head); // tóc mái
  bx(0.58, o.longHair?0.85:0.42, 0.14, hairM, 0, o.longHair?-0.08:0.14, -0.24, head);
  // Mắt & má hồng
  var eyeM=new THREE.MeshBasicMaterial({color:0x1b2028});
  var cheekM=new THREE.MeshBasicMaterial({color:0xe88b7d, transparent:true, opacity:0.55});
  bx(0.08,0.09,0.03, eyeM, -0.12,0.02,0.255, head);
  bx(0.08,0.09,0.03, eyeM, 0.12,0.02,0.255, head);
  bx(0.09,0.05,0.02, cheekM, -0.17,-0.07,0.252, head);
  bx(0.09,0.05,0.02, cheekM, 0.17,-0.07,0.252, head);
  if(o.glasses){
    var glM=new THREE.MeshStandardMaterial({color:0x202632, roughness:0.4, metalness:0.3});
    bx(0.16,0.11,0.03, glM, -0.12,0.03,0.268, head);
    bx(0.16,0.11,0.03, glM, 0.12,0.03,0.268, head);
    bx(0.1,0.03,0.03, glM, 0,0.04,0.268, head);
  }
  g.userData={legL:legL, legR:legR, armL:armL, armR:armR, head:head, phase:Math.random()*6, baseY:0};
  return g;
}
function animPerson(p, moving, dt, t){
  var u=p.userData;
  if(moving){ u.phase+=dt*9.5; }
  var sw=moving? Math.sin(u.phase)*0.62 : 0;
  u.legL.rotation.x=sw; u.legR.rotation.x=-sw; u.armL.rotation.x=-sw*0.8; u.armR.rotation.x=sw*0.8;
  if(u.head){ u.head.rotation.z=moving? Math.sin(u.phase*0.5)*0.04 : 0; }
  p.position.y=u.baseY + (moving? Math.abs(Math.sin(u.phase))*0.085 : Math.sin(t*1.8+u.phase)*0.015);
}
function faceToward(p, dx, dz, dt){
  if(Math.abs(dx)<0.01 && Math.abs(dz)<0.01) return;
  var want=Math.atan2(dx, dz), cur=p.rotation.y, diff=want-cur;
  while(diff>Math.PI) diff-=Math.PI*2; while(diff<-Math.PI) diff+=Math.PI*2;
  p.rotation.y=cur+diff*Math.min(1, dt*12);
}

// Tạo nhân vật chính + các NPC trong khuôn viên
function buildPeople(){
  // Người chơi (giảng viên đeo kính)
  player=makePerson({suit:0x27364f, cloth:0x3a3f4a, hair:0x2b2b30, tie:true, glasses:true});
  player.position.set(0,0,35); player.rotation.y=Math.PI; scene.add(player);
  var st1=makePerson({suit:0xffffff, cloth:0x27364f, hair:0x4a3421});
  st1.position.set(-24,0,-32); st1.rotation.y=-0.7; scene.add(st1);
  var stLabel=makeLabel('Sinh viên', 4.6, 40); stLabel.position.set(-24,3.4,-32); scene.add(stLabel);
  var st2=makePerson({suit:0xffffff, cloth:0x27364f, hair:0x191919});
  st2.position.set(-32,0,-25); scene.add(st2);
  students.push({p:st2, a:{x:-32,z:-25}, b:{x:-32,z:-44}, t:0, dir:1, speed:2.3});
  var gv=makePerson({suit:0x8e2f3c, cloth:0xffffff, hair:0x5a3a22, long:true, longHair:true, glasses:true});
  gv.position.set(-13,0,-20); gv.rotation.y=0.4; scene.add(gv);
  var gvLabel=makeLabel('💻 Khoa CNTT', 5.2, 40); gvLabel.position.set(-13,3.5,-20); scene.add(gvLabel);
}
