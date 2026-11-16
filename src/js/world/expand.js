"use strict";
// Các khu mới theo layout-final.md: sân tennis, giảng đường Đông, vườn thực nghiệm,
// nhà thi đấu, sân bóng đá, ký túc xá (thay toàn bộ khu mở rộng cũ)
function buildExpansion(){
  var wallC=0xf3e6c8, roofRed=0xc0392b, fenceC=0x9aa5a1;
  function flat(w,d,color,x,z,y){
    var m=new THREE.Mesh(new THREE.PlaneGeometry(w,d), new THREE.MeshStandardMaterial({color:color, roughness:1}));
    m.rotation.x=-Math.PI/2; m.position.set(x,y||0.02,z); m.receiveShadow=true; scene.add(m); return m;
  }

  // ===== SÂN TENNIS: 2 sân x 6..16, z -22..-12, mặt xanh dương, lưới giữa, rào thấp (chừa cổng vào phía Nam) =====
  flat(10,10, 0x3a6ea5, 11,-17);
  box(10,0.03,0.15, 0xffffff, 11,0.045,-21.9, scene, false);
  box(10,0.03,0.15, 0xffffff, 11,0.045,-12.1, scene, false);
  box(0.15,0.03,10, 0xffffff, 6.1,0.045,-17, scene, false);
  box(0.15,0.03,10, 0xffffff, 15.9,0.045,-17, scene, false);
  box(9.6,0.9,0.08, 0x333840, 11,0.45,-17, scene, false); // lưới: chỉ trang trí, không đặt solid để 2 sân thông nhau
  box(3.2,0.5,0.12, fenceC, 7.4,0.25,-22.1, scene, false); solid(5.8,-22.22, 9,-21.98);
  box(3.2,0.5,0.12, fenceC, 14.6,0.25,-22.1, scene, false); solid(13,-22.22, 16.2,-21.98);
  box(3.2,0.5,0.12, fenceC, 7.4,0.25,-11.9, scene, false); solid(5.8,-12.02, 9,-11.78);
  box(3.2,0.5,0.12, fenceC, 14.6,0.25,-11.9, scene, false); solid(13,-12.02, 16.2,-11.78);
  box(0.12,0.5,10.4, fenceC, 5.9,0.25,-17, scene, false); solid(5.78,-22.2, 6.02,-11.8);
  box(0.12,0.5,10.4, fenceC, 16.1,0.25,-17, scene, false); solid(15.98,-22.2, 16.22,-11.8);
  var lbT=makeLabel('🎾 SÂN TENNIS', 9); lbT.position.set(11,5.2,-17); scene.add(lbT);

  // ===== GIẢNG ĐƯỜNG ĐÔNG: 2 khối nhà khoa nhiều tầng (tường kem + lưới cửa sổ + mái ngói dốc), không vào trong =====
  decoBuilding(12,6.5,6, 29,-32, roofRed); solid(23,-35, 35,-29);
  decoBuilding(10,6.5,6, 30,-16, roofRed); solid(25,-19, 35,-13);
  var lbE=makeLabel('🏫 GIẢNG ĐƯỜNG', 9); lbE.position.set(29.5,6.4,-24); scene.add(lbE);

  // ===== VƯỜN THỰC NGHIỆM: x 23..40, z -24..-4, lưới ô đất 4x3 (ô đất thấp, không đặt solid) =====
  // Lưu ý: khối giảng đường Đông 2 (30,-16) nằm lọt trong hình chữ nhật vườn của layout, nên các ô đất
  // được xếp vào dải Bắc (z -22.2) và dải Nam (z -10.6, -6.2) còn trống quanh khối nhà, vẫn đủ lưới 4x3
  flat(17,20, 0x7fae56, 31.5,-14, 0.015);
  var bedX=[25.2,29.5,33.9,38.2], bedZ=[-22.2,-10.6,-6.2];
  for(var bx2=0; bx2<bedX.length; bx2++) for(var bz2=0; bz2<bedZ.length; bz2++){
    box(3,0.18,3.6, 0x8a6d4a, bedX[bx2],0.09,bedZ[bz2], scene, false);
    // (Đã bỏ các hộp mầm cây nhỏ trên luống để giữ ngân sách vật thể cho hàng cây mới)
  }
  var lbG=makeLabel('🌱 VƯỜN THỰC NGHIỆM', 10); lbG.position.set(31.5,5.0,-7); scene.add(lbG);

  // ===== NHÀ THI ĐẤU: khối lớn mái trắng (-16,15), cỡ 13x11 =====
  box(13,5.5,11, 0xe8e2d4, -16,2.75,15); box(14,0.4,12, 0xf0f0f0, -16,5.7,15, scene, false); solid(-22.5,9.5, -9.5,20.5);
  box(2,2.6,0.14, 0x33507e, -16,1.3,20.57, scene, false);
  box(10,1.1,0.12, 0xbfe3ff, -16,3.8,20.57, scene, false);
  var lbH=makeLabel('🏟️ NHÀ THI ĐẤU', 10); lbH.position.set(-16,7.2,15); scene.add(lbH);

  // ===== SÂN BÓNG ĐÁ: mặt cỏ x -4..14, z 6..26, vạch trắng, 2 khung thành =====
  flat(18,20, 0x5d9e46, 5,16);
  box(18,0.03,0.15, 0xffffff, 5,0.045,6.1, scene, false);
  box(18,0.03,0.15, 0xffffff, 5,0.045,25.9, scene, false);
  box(0.15,0.03,20, 0xffffff, -3.9,0.045,16, scene, false);
  box(0.15,0.03,20, 0xffffff, 13.9,0.045,16, scene, false);
  box(18,0.03,0.15, 0xffffff, 5,0.045,16, scene, false);
  var cc=new THREE.Mesh(new THREE.RingGeometry(1.7,1.92,28), new THREE.MeshBasicMaterial({color:0xffffff, side:THREE.DoubleSide}));
  cc.rotation.x=-Math.PI/2; cc.position.set(5,0.045,16); scene.add(cc);
  var goalZ=[6.6,25.4];
  for(var gi=0; gi<2; gi++){
    var gz=goalZ[gi];
    var gp1=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.07,2.2,6), new THREE.MeshStandardMaterial({color:0xf0f0f0}));
    gp1.position.set(3,1.1,gz); gp1.castShadow=true; scene.add(gp1);
    var gp2=gp1.clone(); gp2.position.x=7; scene.add(gp2);
    box(4.14,0.12,0.12, 0xf0f0f0, 5,2.2,gz, scene, false);
    solid(2.8,gz-0.2, 3.2,gz+0.2); solid(6.8,gz-0.2, 7.2,gz+0.2);
  }
  var lbF=makeLabel('⚽ SÂN BÓNG ĐÁ', 10); lbF.position.set(5,6.4,16); scene.add(lbF);

  // ===== KÝ TÚC XÁ: 3 khối nhà nhiều tầng phía Đông Nam (cùng kiểu mặt đứng nhà khoa), cửa hướng Tây =====
  var dormZ=[8,15,22];
  for(var di2=0; di2<3; di2++){
    var dz2=dormZ[di2];
    decoBuilding(14,6,5, 27,dz2, roofRed); solid(20,dz2-2.5, 34,dz2+2.5);
    box(0.14,2.2,1.4, 0x6d4c41, 19.93,1.1,dz2, scene, false);
  }
  var lbD=makeLabel('🛏️ KÝ TÚC XÁ', 10); lbD.position.set(27,8.8,15); scene.add(lbD);
  tree(-6,22,1); tree(-26,22,1.05); tree(36,12,1);
  // Hàng cây dọc phía Tây đường D (cách tim đường 4 đơn vị, ngoài mọi solid)
  tree(16,-24,1); tree(16,-2,1.05); tree(16,10,0.95); tree(16,20,1); tree(16,32.5,1.05);
}
