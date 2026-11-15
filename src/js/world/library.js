"use strict";
// Thư viện (phòng đọc) + Căn-tin
function buildLibrary(){
  // ===== THƯ VIỆN: phòng đọc có cửa, kệ sách, bàn đọc =====
  box(12,0.14,9, 0xd8c9a8, -25,0.07,-34, scene, false);
  var libC=0xe8dcc0;
  box(12,2.7,0.5, libC, -25,1.35,-38.25); solid(-31,-38.5, -19,-38);
  box(0.5,2.7,8.5, libC, -30.75,1.35,-34); solid(-31,-38, -30.5,-30);
  box(0.5,2.7,8.5, libC, -19.25,1.35,-34); solid(-19.5,-38, -19,-30);
  box(4.8,2.7,0.5, libC, -28.6,1.35,-29.75); solid(-31,-30, -26.2,-29.5);
  box(5.2,2.7,0.5, libC, -21.4,1.35,-29.75); solid(-23.8,-30, -19,-29.5);
  box(2.4,0.5,0.56, 0x6d4c41, -25,2.45,-29.75, scene, false);
  box(13,0.3,1, 0x8a5a28, -25,2.85,-38.25, scene, false);
  box(13,0.3,1, 0x8a5a28, -25,2.85,-29.75, scene, false);
  box(1,0.3,9.5, 0x8a5a28, -31,2.85,-34, scene, false);
  box(1,0.3,9.5, 0x8a5a28, -19,2.85,-34, scene, false);
  var shelfX=[-28.5,-25,-21.5], bookCols=[0xc0392b,0x33507e,0x2e7d46];
  for(var si2=0; si2<3; si2++){
    box(2.6,2,0.6, 0x7a5a38, shelfX[si2],1,-37.6); solid(shelfX[si2]-1.3,-37.9, shelfX[si2]+1.3,-37.3);
    for(var bj=0; bj<3; bj++) box(0.5,0.8,0.1, bookCols[(si2+bj)%3], shelfX[si2]-0.7+bj*0.7, 1.35,-37.24, scene, false);
  }
  box(3,0.8,1.4, 0xa8763e, -25,0.4,-33.5); solid(-26.5,-34.2, -23.5,-32.8);
  var lb2=makeLabel('📚 THƯ VIỆN', 9.5); lb2.position.set(-25,5.8,-34); scene.add(lb2);

  // Sinh viên ngồi đọc sách tại bàn đọc
  box(0.85,0.5,0.8, 0x6b4a2a, -25,0.25,-31.85, scene, false);
  var rd1=makePerson({suit:0xffffff, cloth:0x27364f, hair:0x5a3a22});
  rd1.position.set(-25,-0.35,-31.9); rd1.rotation.y=Math.PI; scene.add(rd1);
  seated.push({g:rd1, ph:0.7, base:-0.35});
  var bk2=makeIcon('📖',0.8); bk2.position.set(-25,1.05,-33.4); scene.add(bk2);
}
function buildCanteen(){
  // ===== CĂN-TIN: mái che viền, quầy bán, bàn ăn =====
  var canFloor=new THREE.Mesh(new THREE.PlaneGeometry(16,12.5), new THREE.MeshLambertMaterial({color:0xd9c9a3}));
  canFloor.rotation.x=-Math.PI/2; canFloor.position.set(17.5,0.028,-5); canFloor.receiveShadow=true; scene.add(canFloor);
  box(15,2.6,0.45, 0xf3e6c8, 17.5,1.3,-10.8); solid(10,-11.02, 25,-10.58);
  box(0.45,2.6,6, 0xf3e6c8, 10.2,1.3,-7.8); solid(9.98,-10.8, 10.43,-4.8);
  box(0.45,2.6,6, 0xf3e6c8, 24.8,1.3,-7.8); solid(24.58,-10.8, 25.03,-4.8);
  box(16.5,0.3,1, 0xb07a3f, 17.5,3.05,-10.8, scene, false);
  box(16.5,0.3,1, 0xb07a3f, 17.5,3.05,0.8, scene, false);
  box(1,0.3,12.6, 0xb07a3f, 9.9,3.05,-5, scene, false);
  box(1,0.3,12.6, 0xb07a3f, 25.1,3.05,-5, scene, false);
  box(6,1.05,1.2, 0x8a5a28, 17.5,0.53,-9.3); solid(14.5,-9.9, 20.5,-8.7);
  var fd1=makeIcon('🍜',0.9); fd1.position.set(15.8,1.5,-9.3); scene.add(fd1);
  var fd2=makeIcon('🍚',0.9); fd2.position.set(17.5,1.5,-9.3); scene.add(fd2);
  var fd3=makeIcon('🥤',0.9); fd3.position.set(19.2,1.5,-9.3); scene.add(fd3);
  box(2.4,1.4,0.12, 0x2e4a3a, 22.3,1.7,-10.5, scene, false);
  box(2,0.75,1.2, 0xd8c9a8, 13.5,0.38,-3.5); solid(12.5,-4.1, 14.5,-2.9);
  box(2,0.75,1.2, 0xd8c9a8, 21.5,0.38,-3.5); solid(20.5,-4.1, 22.5,-2.9);
  var fd4=makeIcon('🍜',0.8); fd4.position.set(13.5,1.05,-3.5); scene.add(fd4);
  var lb6=makeLabel('🍚 CĂN-TIN', 6.5); lb6.position.set(17.5,4.4,-5); scene.add(lb6);

  // Sinh viên ngồi ăn tại 2 bàn
  box(0.85,0.5,0.8, 0x6b4a2a, 13.5,0.25,-2.5, scene, false);
  var eat1=makePerson({suit:0xffffff, cloth:0x27364f, hair:0x4a3421});
  eat1.position.set(13.5,-0.35,-2.55); eat1.rotation.y=Math.PI; scene.add(eat1);
  seated.push({g:eat1, ph:1.9, base:-0.35});
  box(0.85,0.5,0.8, 0x6b4a2a, 21.5,0.25,-2.5, scene, false);
  var eat2=makePerson({suit:0xffffff, cloth:0x27364f, hair:0x333333});
  eat2.position.set(21.5,-0.35,-2.55); eat2.rotation.y=Math.PI; scene.add(eat2);
  seated.push({g:eat2, ph:3.1, base:-0.35});
}
