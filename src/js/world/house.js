"use strict";
// Nhà của giảng viên: phòng khách/bàn ăn, bàn làm việc, phòng ngủ + sân vườn
function buildHouse(){
  // ===== NHÀ Ở: có phòng khách/bàn ăn, bàn làm việc, phòng ngủ =====
  box(15,0.14,8, 0xe8dcc8, 0,0.07,45, scene, false);
  var homeC=0xf7ead2;
  box(15,2.7,0.45, homeC, 0,1.35,48.8); solid(-7.5,48.58, 7.5,49);
  box(0.45,2.7,8, homeC, -7.3,1.35,45); solid(-7.5,41, -7.08,49);
  box(0.45,2.7,8, homeC, 7.3,1.35,45); solid(7.08,41, 7.5,49);
  box(6.3,2.7,0.45, homeC, -4.35,1.35,41.2); solid(-7.5,40.98, -1.2,41.43);
  box(6.3,2.7,0.45, homeC, 4.35,1.35,41.2); solid(1.2,40.98, 7.5,41.43);
  box(2.4,0.5,0.5, 0x6d4c41, 0,2.45,41.2, scene, false);
  box(16,0.3,1, 0x3f6fb5, 0,2.9,48.8, scene, false);
  box(16,0.3,1, 0x3f6fb5, 0,2.9,41.2, scene, false);
  box(1,0.3,8.5, 0x3f6fb5, -7.5,2.9,45, scene, false);
  box(1,0.3,8.5, 0x3f6fb5, 7.5,2.9,45, scene, false);
  box(0.4,2.2,4.5, 0xe8dcc0, 1.8,1.1,46.75); solid(1.6,44.5, 2,49); // vách ngăn phòng ngủ
  // Giường ngủ (phòng ngủ, phía đông sau vách)
  box(2.2,0.55,3.2, 0x8e2f3c, 5.6,0.28,47); solid(4.5,45.4, 6.7,48.6);
  box(1.8,0.25,0.7, 0xffffff, 5.6,0.62,45.85, scene, false);
  // Bàn làm việc + laptop
  box(2.4,0.85,1.1, 0x8a5a28, 5,0.43,42.3); solid(3.8,41.75, 6.2,42.85);
  var lap=makeIcon('💻',0.85); lap.position.set(5,1.15,42.3); scene.add(lap);
  // Bàn ăn + sofa + TV + kệ sách + thảm + mèo (phía tây)
  box(2.6,0.75,1.4, 0xa8763e, -3.8,0.38,46.5); solid(-5.1,45.8, -2.5,47.2);
  box(3,0.8,1.1, 0x3a6ea5, -4,0.4,42.6); solid(-5.5,42.05, -2.5,43.15);
  box(2.4,1.4,0.12, 0x22242c, -4,1.7,41.55, scene, false);
  box(1.8,1.8,0.5, 0x7a5a38, -6.1,0.9,44); solid(-7,43.75, -5.2,44.25);
  var rug=new THREE.Mesh(new THREE.PlaneGeometry(5,3.4), new THREE.MeshLambertMaterial({color:0xc96f4a}));
  rug.rotation.x=-Math.PI/2; rug.position.set(-3.8,0.035,44.6); rug.receiveShadow=true; scene.add(rug);
  var cat=makeIcon('🐱',0.8); cat.position.set(-5.6,0.5,44.9); scene.add(cat);
  var pl2=makeIcon('🪴',1); pl2.position.set(6.9,0.7,41.9); scene.add(pl2);
  var lb3=makeLabel('🏠 NHÀ Ở', 9.5); lb3.position.set(0,5.6,45); scene.add(lb3);
}
