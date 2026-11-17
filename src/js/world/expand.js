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

  // ===== VƯỜN CỘNG ĐỒNG PHÍA NAM: khu mới nối từ cổng Nam, z 40..68 =====
  // Khu này mở rộng không gian chơi ra ngoài dải nhà ở nhưng vẫn giữ lối đi rõ ràng.
  flat(30,27, 0x78a951, 0,55, 0.015);
  flat(4,32, 0xb8ab8c, 0,52);
  flat(24,3, 0xb8ab8c, 0,43);
  flat(24,3, 0xb8ab8c, 0,67);
  var gardenX=[-10,-3,4,11], gardenZ=[52.5,58,63];
  for(var gxi=0; gxi<gardenX.length; gxi++) for(var gzi=0; gzi<gardenZ.length; gzi++){
    box(4.6,0.18,2.8, 0x8a6d4a, gardenX[gxi],0.09,gardenZ[gzi], scene, false);
    var spr=new THREE.Mesh(new THREE.ConeGeometry(0.28,0.9,7), new THREE.MeshStandardMaterial({color:0x4e8f43, roughness:.9}));
    spr.position.set(gardenX[gxi],0.62,gardenZ[gzi]); spr.castShadow=true; scene.add(spr);
  }
  box(4.2,0.5,1.1, 0x9a8a72, -14,0.45,55); solid(-16.1,54.4, -11.9,55.6);
  box(4.2,0.5,1.1, 0x9a8a72, 14,0.45,55); solid(11.9,54.4, 16.1,55.6);
  tree(-17,45,1); tree(17,45,1); tree(-17,65,1.05); tree(17,65,1.05);
  placeModel('flower', -18,56, 0.65, 1.1); placeModel('flower', 18,56, 0.65, 2.4);
  var lbGarden=makeLabel('🌿 KHU VỰC GỬI LỜI TRI ÂN', 13, 35); lbGarden.position.set(0,6.2,55); scene.add(lbGarden);
  // Viền hoa hai bên lối đi giữa vườn, hoa ở góc các luống đất, đèn ở cổng Nam của vườn
  var gfCols=[0xe86a8a, 0xf5f0e6, 0xf2b33d, 0xd94f6a];
  function gardenFlower(x,z,i){
    if(!placeModel('flower', x, z, 0.7, i*1.3)) box(0.3,0.32,0.3, gfCols[i%4], x,0.16,z, scene, false);
  }
  for(var gfi=0; gfi<8; gfi++){
    gardenFlower(-2.7, 50+gfi*2.3, gfi);
    gardenFlower(2.7, 51.1+gfi*2.3, gfi+2);
  }
  for(var gbi=0; gbi<gardenX.length; gbi++) for(var gbj=0; gbj<gardenZ.length; gbj++){
    gardenFlower(gardenX[gbi]-2.6, gardenZ[gbj]-1.7, gbi+gbj);
    gardenFlower(gardenX[gbi]+2.6, gardenZ[gbj]+1.7, gbi+gbj+1);
  }
  lamp(-2.6,67); lamp(2.6,67);
  // Hoa trang trí bờ hồ phía Nam và hai bên cổng trường phía Nam
  for(var lfi=0; lfi<6; lfi++) gardenFlower(4+lfi*3.1, -27.4, lfi+1);
  gardenFlower(5.6,33.2,2); gardenFlower(-1.6,33.2,3);
  tree(-6,22,1); tree(-26,22,1.05); tree(36,12,1);
  // Hàng cây dọc phía Tây đường D (cách tim đường 4 đơn vị, ngoài mọi solid)
  tree(16,-24,1); tree(16,-2,1.05); tree(16,10,0.95); tree(16,20,1); tree(16,32.5,1.05);

  // ===== TRỤ CỔNG + XÀ NGANG: cổng Nam và cổng Tây =====
  var gateM=new THREE.MeshStandardMaterial({color:0xcfc4ae, roughness:.85});
  var gateCapM=new THREE.MeshStandardMaterial({color:0xa33d2a, roughness:.85});
  function gatePost(x,z){
    box(0.55,3.4,0.55, 0xcfc4ae, x,1.7,z, scene, true);
    var cap=new THREE.Mesh(new THREE.BoxGeometry(0.8,0.28,0.8), gateCapM);
    cap.position.set(x,3.55,z); cap.castShadow=true; scene.add(cap);
    solid(x-0.3,z-0.3, x+0.3,z+0.3);
  }
  gatePost(-0.6,34); gatePost(4.6,34);
  box(6.2,0.4,0.7, 0xa33d2a, 2,3.85,34, scene, true);
  gatePost(-37.5,-12.6); gatePost(-37.5,-5.4);
  box(0.7,0.4,8.2, 0xa33d2a, -37.5,3.85,-9, scene, true);

  // ===== HỒ NƯỚC: cầu gỗ, lau sậy, ghế ngắm hồ =====
  var dockM=new THREE.MeshStandardMaterial({color:0x9a7448, roughness:.9});
  var dock=new THREE.Mesh(new THREE.BoxGeometry(2.2,0.16,3.4), dockM);
  dock.position.set(12,0.34,-27.1); dock.castShadow=true; dock.receiveShadow=true; scene.add(dock);
  [[10.9,-28.6],[13.1,-28.6],[10.9,-25.6],[13.1,-25.6]].forEach(function(pp){
    var post=new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.09,0.8,6), dockM);
    post.position.set(pp[0],0.05,pp[1]); scene.add(post);
  });
  var reedM=new THREE.MeshStandardMaterial({color:0x5d8a44, roughness:.9});
  var reedPos=[[4.5,-28.2],[7,-27.7],[17,-27.8],[20,-28.2],[3.2,-33],[3.4,-39],[20.8,-33],[20.6,-39]];
  reedPos.forEach(function(rp, ri){
    for(var rk=0; rk<3; rk++){
      var reed=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.045,0.9+((ri+rk)%3)*0.22,5), reedM);
      reed.position.set(rp[0]+(rk-1)*0.16, 0.45, rp[1]+(rk%2)*0.14); reed.rotation.z=(rk-1)*0.09; scene.add(reed);
    }
  });
  box(2.1,0.45,0.6, 0x9a8a72, 6,0.42,-26.6, scene, true); solid(4.9,-26.9, 7.1,-26.3);
  box(2.1,0.45,0.6, 0x9a8a72, 18,0.42,-26.6, scene, true); solid(16.9,-26.9, 19.1,-26.3);

  // ===== CỜ GÓC SÂN BÓNG ĐÁ =====
  var flagM=new THREE.MeshStandardMaterial({color:0xd94f6a, roughness:.7, side:THREE.DoubleSide});
  [[-4,6],[14,6],[-4,26],[14,26]].forEach(function(fp){
    var pole=new THREE.Mesh(new THREE.CylinderGeometry(0.03,0.03,1.6,6), new THREE.MeshStandardMaterial({color:0xf0f0f0}));
    pole.position.set(fp[0],0.8,fp[1]); scene.add(pole);
    var fl=new THREE.Mesh(new THREE.BoxGeometry(0.55,0.34,0.03), flagM);
    fl.position.set(fp[0]+0.28,1.42,fp[1]); scene.add(fl);
  });

  // ===== CHI TIẾT ĐỊA ĐIỂM (gpt-6-astra góp ý, đã đối chiếu map thật) =====
  // Cổng vòm vào vườn tri ân, ngay đầu lối đi giữa vườn phía Nam nhà giảng viên
  gatePost(-2.9,50.6); gatePost(2.9,50.6);
  box(6.4,0.4,0.7, 0xa33d2a, 0,3.85,50.6, scene, true);
  // Bảng tỷ số sân bóng, phía Đông ngoài đường biên
  box(0.18,2.6,0.18, 0xf0f0f0, 15.6,1.3,14.9, scene, true);
  box(0.18,2.6,0.18, 0xf0f0f0, 15.6,1.3,17.1, scene, true);
  box(0.15,1.7,3.6, 0x243b5a, 15.6,3.2,16, scene, true);
  box(0.17,0.12,3.7, 0xf2b33d, 15.6,4.1,16, scene, false);
  box(0.17,0.12,3.7, 0xf2b33d, 15.6,2.3,16, scene, false);
  solid(15.4,14.7, 15.8,17.3);
  var lbScore=makeLabel('⚽ 0 - 0', 4.2, 40); lbScore.position.set(15.3,3.2,16); scene.add(lbScore);
  // Quảng trường cột cờ: lát đá chữ thập + 4 bồn hoa ở 4 góc
  box(3,0.06,9, 0xc8b99b, -20.5,0.03,-2.5, scene, false);
  box(9,0.06,3, 0xc8b99b, -20.5,0.045,-2.5, scene, false);
  [[-23.6,-5.6],[-17.4,-5.6],[-23.6,0.6],[-17.4,0.6]].forEach(function(pp, pi){
    box(1.2,0.5,1.2, 0xa35d3a, pp[0],0.25,pp[1], scene, true);
    solid(pp[0]-0.6,pp[1]-0.6, pp[0]+0.6,pp[1]+0.6);
    gardenFlower(pp[0], pp[1], pi+1);
  });
  // Cổng chào sân tennis ở lối vào phía Nam + 2 ghế khán giả ngoài rào
  box(0.4,2.6,0.4, 0xcfc4ae, 8.5,1.3,-11.4, scene, true); solid(8.2,-11.7, 8.8,-11.1);
  box(0.4,2.6,0.4, 0xcfc4ae, 13.5,1.3,-11.4, scene, true); solid(13.2,-11.7, 13.8,-11.1);
  box(5.6,0.5,0.3, 0x3a6ea5, 11,2.85,-11.4, scene, true);
  var lbTen=makeLabel('🎾 TENNIS', 4.5, 36); lbTen.position.set(11,3.7,-11.4); scene.add(lbTen);
  box(1.8,0.45,0.5, 0x9a7448, 6.8,0.42,-10.8, scene, true); solid(5.9,-11.05, 7.7,-10.55);
  box(1.8,0.45,0.5, 0x9a7448, 15.2,0.42,-10.8, scene, true); solid(14.3,-11.05, 16.1,-10.55);
  // Bồn hoa hai bên chòi nghỉ bên hồ
  [[-2.4,-41.3],[2.4,-41.3]].forEach(function(pp, pi){
    box(1.5,0.55,0.7, 0xa35d3a, pp[0],0.27,pp[1], scene, true);
    solid(pp[0]-0.75,pp[1]-0.35, pp[0]+0.75,pp[1]+0.35);
    gardenFlower(pp[0]-0.35, pp[1], pi+2);
    gardenFlower(pp[0]+0.35, pp[1], pi+3);
  });
}
