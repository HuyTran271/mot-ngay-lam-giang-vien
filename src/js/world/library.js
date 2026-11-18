"use strict";
// Thư viện (phòng đọc) + Căn-tin
// THƯ VIỆN đã tịnh tiến nguyên khối dx=+3, dz=+12 theo layout-final.md (cũ x -29..-19, z -40..-30 -> x -26..-16, z -28..-18)
// CĂN-TIN dựng lại tại x -8..2, z -18..-10, mở về phía Nam (mặt z=-10 giáp đường A), beacon (-3,-13)
function buildLibrary(){
  // ===== THƯ VIỆN: phòng đọc có cửa, kệ sách, bàn đọc =====
  box(12,0.14,9, 0xd8c9a8, -22,0.07,-22, scene, false);
  var libC=0xe8dcc0;
  box(12,2.7,0.5, libC, -22,1.35,-26.25); solid(-28,-26.5, -16,-26);
  box(0.5,2.7,8.5, libC, -27.75,1.35,-22); solid(-28,-26, -27.5,-18);
  box(0.5,2.7,8.5, libC, -16.25,1.35,-22); solid(-16.5,-26, -16,-18);
  box(4.8,2.7,0.5, libC, -25.6,1.35,-17.75); solid(-28,-18, -23.2,-17.5);
  box(5.2,2.7,0.5, libC, -18.4,1.35,-17.75); solid(-20.8,-18, -16,-17.5);
  box(2.4,0.5,0.56, 0x6d4c41, -22,2.45,-17.75, scene, false);
  box(13,0.3,1, 0x8a5a28, -22,2.85,-26.25, scene, false);
  box(13,0.3,1, 0x8a5a28, -22,2.85,-17.75, scene, false);
  box(1,0.3,9.5, 0x8a5a28, -28,2.85,-22, scene, false);
  box(1,0.3,9.5, 0x8a5a28, -16,2.85,-22, scene, false);
  var shelfX=[-25.5,-22,-18.5], bookCols=[0xc0392b,0x33507e,0x2e7d46];
  for(var si2=0; si2<3; si2++){
    box(2.6,2,0.6, 0x7a5a38, shelfX[si2],1,-25.6); solid(shelfX[si2]-1.3,-25.9, shelfX[si2]+1.3,-25.3);
    for(var bj=0; bj<3; bj++) box(0.5,0.8,0.1, bookCols[(si2+bj)%3], shelfX[si2]-0.7+bj*0.7, 1.35,-25.24, scene, false);
  }
  box(3,0.8,1.4, 0xa8763e, -22,0.4,-21.5); solid(-23.5,-22.2, -20.5,-20.8);
  var lb2=makeLabel('📚 THƯ VIỆN', 9.5); lb2.position.set(-22,5.8,-22); scene.add(lb2);

  // Sinh viên ngồi đọc sách tại bàn đọc
  box(0.85,0.5,0.8, 0x6b4a2a, -22,0.25,-19.85, scene, false);
  var rd1=makePerson({suit:0xffffff, cloth:0x27364f, hair:0x5a3a22});
  rd1.position.set(-22,-0.35,-19.9); rd1.rotation.y=Math.PI; scene.add(rd1);
  seated.push({g:rd1, ph:0.7, base:-0.35});
  var bk2=makeIcon('📖',0.8); bk2.position.set(-22,1.05,-21.4); scene.add(bk2);
  // ===== TRANG TRÍ LẠI THƯ VIỆN: mặt kệ đầy sách, 2 kệ đứng giữa phòng, đèn bàn đọc, thảm =====
  var libBkTex=bookSpineTexture();
  function spineFace(w,h){
    return new THREE.Mesh(new THREE.BoxGeometry(w,h,0.04), new THREE.MeshStandardMaterial({map:libBkTex, roughness:.85}));
  }
  for(var sfi=0; sfi<3; sfi++){ var sf0=spineFace(2.5,1.5); sf0.position.set(shelfX[sfi],1.32,-25.16); scene.add(sf0); }
  [[-25.3,-21.8],[-18.7,-21.8]].forEach(function(sp){
    box(0.6,2,2.6, 0x7a5a38, sp[0],1,sp[1]); solid(sp[0]-0.35,sp[1]-1.35, sp[0]+0.35,sp[1]+1.35);
    var sfA=spineFace(0.04,1.5); sfA.geometry=new THREE.BoxGeometry(0.04,1.5,2.4); sfA.position.set(sp[0]-0.33,1.32,sp[1]); scene.add(sfA);
    var sfB=spineFace(0.04,1.5); sfB.geometry=new THREE.BoxGeometry(0.04,1.5,2.4); sfB.position.set(sp[0]+0.33,1.32,sp[1]); scene.add(sfB);
  });
  var lampMat2=new THREE.MeshStandardMaterial({color:0xfff2cc, emissive:0xffdf9e, emissiveIntensity:0.9, roughness:.6});
  [-22.8,-21.2].forEach(function(lx){
    var stem=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,0.42,6), new THREE.MeshStandardMaterial({color:0x555555}));
    stem.position.set(lx,1.0,-21.5); scene.add(stem);
    var shade2=new THREE.Mesh(new THREE.CylinderGeometry(0.13,0.2,0.18,10), lampMat2);
    shade2.position.set(lx,1.3,-21.5); scene.add(shade2);
  });
  box(0.5,0.09,0.36, 0xc0392b, -22.4,0.86,-21.9, scene, false);
  box(0.46,0.08,0.33, 0x33507e, -21.5,0.85,-21.1, scene, false);
  box(5.5,0.04,3.6, 0x33507e, -22,0.02,-21.3, scene, false);
  box(1.6,0.75,0.8, 0x8a5a28, -26.4,0.38,-19.5); solid(-27.2,-19.9, -25.6,-19.1);
  var lapL=makeIcon('💻',0.8); lapL.position.set(-26.4,1.05,-19.5); scene.add(lapL);
}
function buildCanteen(){
  // ===== CĂN-TIN MỚI: x -8..2, z -18..-10, tường Bắc + 2 tường bên nửa phía Bắc, mở hẳn phía Nam =====
  var canFloor=new THREE.Mesh(new THREE.PlaneGeometry(10,8), new THREE.MeshLambertMaterial({map:checkerTexture()}));
  canFloor.rotation.x=-Math.PI/2; canFloor.position.set(-3,0.028,-14); canFloor.receiveShadow=true; scene.add(canFloor);
  box(10,2.6,0.45, 0xf3e6c8, -3,1.3,-17.8); solid(-8,-18.02, 2,-17.58);
  box(0.45,2.6,4, 0xf3e6c8, -7.8,1.3,-15.8); solid(-8.02,-17.8, -7.58,-13.8);
  box(0.45,2.6,4, 0xf3e6c8, 1.8,1.3,-15.8); solid(1.58,-17.8, 2.02,-13.8);
  box(10.5,0.3,1, 0xb07a3f, -3,3.05,-17.8, scene, false);
  box(1,0.3,4.5, 0xb07a3f, -8.1,3.05,-15.9, scene, false);
  box(1,0.3,4.5, 0xb07a3f, 2.1,3.05,-15.9, scene, false);
  box(6,1.05,1.2, 0x8a5a28, -3,0.53,-16.3); solid(-6,-16.9, 0,-15.7);
  var fd1=makeIcon('🍜',0.9); fd1.position.set(-4.7,1.5,-16.3); scene.add(fd1);
  var fd2=makeIcon('🍚',0.9); fd2.position.set(-3,1.5,-16.3); scene.add(fd2);
  var fd3=makeIcon('🥤',0.9); fd3.position.set(-1.3,1.5,-16.3); scene.add(fd3);
  box(2.4,1.4,0.12, 0x2e4a3a, 0.8,1.7,-17.5, scene, false);
  box(2,0.75,1.2, 0xd8c9a8, -5.5,0.38,-12.5); solid(-6.5,-13.1, -4.5,-11.9);
  box(2,0.75,1.2, 0xd8c9a8, -0.5,0.38,-12.5); solid(-1.5,-13.1, 0.5,-11.9);
  var fd4=makeIcon('🍜',0.8); fd4.position.set(-5.5,1.05,-12.5); scene.add(fd4);
  var lb6=makeLabel('🍚 CĂN-TIN', 6.5); lb6.position.set(-3,4.4,-14); scene.add(lb6);

  // Sinh viên ngồi ăn tại 2 bàn
  box(0.85,0.5,0.8, 0x6b4a2a, -5.5,0.25,-11.5, scene, false);
  var eat1=makePerson({suit:0xffffff, cloth:0x27364f, hair:0x4a3421});
  eat1.position.set(-5.5,-0.35,-11.55); eat1.rotation.y=Math.PI; scene.add(eat1);
  seated.push({g:eat1, ph:1.9, base:-0.35});
  box(0.85,0.5,0.8, 0x6b4a2a, -0.5,0.25,-11.5, scene, false);
  var eat2=makePerson({suit:0xffffff, cloth:0x27364f, hair:0x333333});
  eat2.position.set(-0.5,-0.35,-11.55); eat2.rotation.y=Math.PI; scene.add(eat2);
  seated.push({g:eat2, ph:3.1, base:-0.35});
  // ===== TRANG TRÍ LẠI CĂN-TIN: kính quầy, đèn treo, tủ lạnh, thêm 2 bàn, chậu cây =====
  var glassMat=new THREE.MeshStandardMaterial({color:0xcfe4ee, transparent:true, opacity:0.35, roughness:.15});
  var glass=new THREE.Mesh(new THREE.BoxGeometry(5.6,0.5,0.05), glassMat);
  glass.position.set(-3,1.32,-15.68); scene.add(glass);
  box(6,0.06,0.6, 0x6d4c41, -3,1.78,-16.3, scene, false);
  var lampMat3=new THREE.MeshStandardMaterial({color:0xfff2cc, emissive:0xffdf9e, emissiveIntensity:0.9, roughness:.6});
  [-5,-3,-1].forEach(function(hx){
    var cord3=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.02,0.6,5), new THREE.MeshStandardMaterial({color:0x555555}));
    cord3.position.set(hx,2.6,-16.3); scene.add(cord3);
    var shade3=new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.24,0.2,10), lampMat3);
    shade3.position.set(hx,2.25,-16.3); scene.add(shade3);
  });
  var lbMenu=makeLabel('🍽️ THỰC ĐƠN', 4, 32); lbMenu.position.set(0.8,2.62,-17.35); scene.add(lbMenu);
  box(0.9,1.9,0.8, 0xdfe6ea, 1.05,0.95,-16.9, scene, true); solid(0.6,-17.3, 1.5,-16.5);
  box(0.7,1.5,0.04, 0x9fc4e8, 1.05,1.05,-16.47, scene, false);
  [[-6.2,-14.6],[0.2,-14.6]].forEach(function(tp, ti){
    box(1.6,0.75,1, 0xd8c9a8, tp[0],0.38,tp[1]); solid(tp[0]-0.8,tp[1]-0.5, tp[0]+0.8,tp[1]+0.5);
    box(0.6,0.45,0.6, 0x6b4a2a, tp[0]-0.4,0.23,tp[1]-0.85, scene, false);
    box(0.6,0.45,0.6, 0x6b4a2a, tp[0]+0.4,0.23,tp[1]+0.85, scene, false);
    var fdi=makeIcon(ti===0?'🍚':'🥤',0.7); fdi.position.set(tp[0],1.0,tp[1]); scene.add(fdi);
  });
  [[-7.3,-11],[1.3,-11]].forEach(function(pp2){
    var pot=new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.27,0.4,9), new THREE.MeshStandardMaterial({color:0xa35d3a, roughness:.8}));
    pot.position.set(pp2[0],0.2,pp2[1]); pot.castShadow=true; scene.add(pot);
    placeModel('bush', pp2[0], pp2[1], 0.55, 1.2);
  });
}
