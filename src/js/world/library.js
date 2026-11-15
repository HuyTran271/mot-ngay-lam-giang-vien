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
}
function buildCanteen(){
  // ===== CĂN-TIN MỚI: x -8..2, z -18..-10, tường Bắc + 2 tường bên nửa phía Bắc, mở hẳn phía Nam =====
  var canFloor=new THREE.Mesh(new THREE.PlaneGeometry(10,8), new THREE.MeshLambertMaterial({color:0xd9c9a3}));
  canFloor.rotation.x=-Math.PI/2; canFloor.position.set(-3,0.028,-14); canFloor.receiveShadow=true; scene.add(canFloor);
  box(10,2.6,0.45, 0xf3e6c8, -3,1.3,-17.8); solid(-8,-18.02, 2,-17.58);
  box(0.45,2.6,4, 0xf3e6c8, -7.8,1.3,-15.8); solid(-8.02,-17.8, -7.58,-13.8);
  box(0.45,2.6,4, 0xf3e6c8, 1.8,1.3,-15.8); solid(1.58,-17.8, 2.02,-13.8);
  box(10.5,0.3,1, 0xb07a3f, -3,3.05,-17.8, scene, false);
  box(10.5,0.3,1, 0xb07a3f, -3,3.05,-10.2, scene, false);
  box(1,0.3,8.6, 0xb07a3f, -8.1,3.05,-14, scene, false);
  box(1,0.3,8.6, 0xb07a3f, 2.1,3.05,-14, scene, false);
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
}
