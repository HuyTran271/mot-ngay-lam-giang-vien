"use strict";
// Sân trường theo layout-final.md: rào x -37..41, z -55..34 (cổng Tây z -12..-6, cổng Nam x 0..4),
// đường Lê Duẩn phía Tây, hồ Đông Bắc, giảng đường Bắc, nhà điều hành cạnh cổng chính
function buildCampus(){
  var pathC=0xb8ab8c, wallC=0xf3e6c8, roofRed=0xc0392b;
  // Nền cỏ toàn map
  var grass=new THREE.Mesh(new THREE.PlaneGeometry(104,124), new THREE.MeshStandardMaterial({color:0x69a24b, roughness:1}));
  grass.rotation.x=-Math.PI/2; grass.receiveShadow=true; scene.add(grass);
  function flat(w,d,color,x,z,y){
    var m=new THREE.Mesh(new THREE.PlaneGeometry(w,d), new THREE.MeshStandardMaterial({color:color, roughness:1}));
    m.rotation.x=-Math.PI/2; m.position.set(x,y||0.02,z); m.receiveShadow=true; scene.add(m); return m;
  }
  // Đường Lê Duẩn (ngoài rào phía Tây) + dải đường phía Nam ngoài rào
  flat(4,90, 0x8a8f98, -40,-11, 0.008);
  flat(84,3, 0x8a8f98, 0,37.5, 0.008);
  // Đường nội bộ A-E + lối cổng Nam + lối xuống thư viện
  flat(60,4, pathC, -6,-8);        // A: Đông Tây
  flat(4,38, pathC, -32,-25);      // B: Bắc Nam phía Tây
  flat(32,4, pathC, -14,-32);      // C: sân trước trường + thư viện
  flat(4,52, pathC, 20,0);         // D: Bắc Nam phía Đông
  flat(62,4, pathC, 7,28);         // E: Đông Tây phía Nam
  flat(4,6, pathC, 2,33);          // lối cổng Nam
  flat(2.4,12.5, pathC, -22,-23.75); // lối từ đường C xuống cửa thư viện
  flat(14,4, 0xcfc8b8, -27,-2.5);  // sân trước nhà điều hành
  // Sân vườn trước nhà ở (giữ như bản cũ)
  flat(32,17, 0x7fae56, 0,44.5, 0.012);
  // Chấm hoa rải trên cỏ
  var flowerCols=[0xf28bb4, 0xffd76e, 0xffffff, 0xe2703a];
  for(var i=0;i<10;i++){
    var f=new THREE.Mesh(new THREE.CircleGeometry(0.45+((i*37)%40)/60, 10), new THREE.MeshBasicMaterial({color:flowerCols[i%4]}));
    f.rotation.x=-Math.PI/2; var fx=-40+((i*53)%80), fz=-52+((i*29)%100);
    if(Math.abs(fx)<4) fx+=7;
    if(fx>2 && fx<22 && fz>-45 && fz<-27) fz+=13; // tránh chấm hoa rơi giữa hồ (trông như hoa sen)
    f.position.set(fx, 0.035, fz); scene.add(f);
  }

  // ===== HÀNG RÀO KHUÔN VIÊN: x -37.5 (Tây), x 41 (Đông), z -55 (Bắc), z 34 (Nam) =====
  var twC=0xe3d7bd, twCap=0xb08954, twPil=0xcbb489;
  // Tây: 2 đoạn chừa khe cổng z -12..-6
  box(0.4,2.2,43, twC, -37.5,1.1,-33.5); box(0.62,0.2,43.4, twCap, -37.5,2.3,-33.5, scene, false);
  solid(-37.8,-55, -37.2,-12);
  box(0.4,2.2,40, twC, -37.5,1.1,14); box(0.62,0.2,40.4, twCap, -37.5,2.3,14, scene, false);
  solid(-37.8,-6, -37.2,34);
  // Đông: liền mạch
  box(0.4,2.2,89, twC, 41,1.1,-10.5); box(0.62,0.2,89.4, twCap, 41,2.3,-10.5, scene, false);
  solid(40.7,-55, 41.3,34);
  // Bắc: liền mạch
  box(78.9,2.2,0.4, twC, 1.75,1.1,-55); box(79.3,0.2,0.62, twCap, 1.75,2.3,-55, scene, false);
  solid(-37.5,-55.3, 41,-54.7);
  // Nam: 2 đoạn chừa khe cổng x 0..4
  box(37.5,2.2,0.4, twC, -18.75,1.1,34); box(37.9,0.2,0.62, twCap, -18.75,2.3,34, scene, false);
  solid(-37.5,33.7, 0,34.3);
  box(37,2.2,0.4, twC, 22.5,1.1,34); box(37.4,0.2,0.62, twCap, 22.5,2.3,34, scene, false);
  solid(4,33.7, 41,34.3);
  // Trụ rào
  var pilW=[-50,-40,-30,-20,0,10,20,28];
  for(var pw=0; pw<pilW.length; pw++) box(0.72,2.55,0.72, twPil, -37.5,1.27,pilW[pw], scene, false);
  var pilE=[-50,-40,-30,-20,-10,0,10,20,27];
  for(var pe=0; pe<pilE.length; pe++) box(0.72,2.55,0.72, twPil, 41,1.27,pilE[pe], scene, false);
  var pilN=[-16,12,40];
  for(var pn=0; pn<pilN.length; pn++) box(0.72,2.55,0.72, twPil, pilN[pn],1.27,-55, scene, false);
  var pilS=[-30,-16,-2,16,30];
  for(var ps=0; ps<pilS.length; ps++) box(0.72,2.55,0.72, twPil, pilS[ps],1.27,34, scene, false);
  box(0.72,2.55,0.72, twPil, -37.5,1.27,-55, scene, false); box(0.72,2.55,0.72, twPil, 41,1.27,-55, scene, false);
  box(0.72,2.55,0.72, twPil, -37.5,1.27,34, scene, false); box(0.72,2.55,0.72, twPil, 41,1.27,34, scene, false);

  // ===== CỔNG CHÍNH PHÍA TÂY: 2 cột + băng-rôn + biển tên trường =====
  var post1=new THREE.Mesh(new THREE.CylinderGeometry(0.14,0.14,4.8,8), new THREE.MeshStandardMaterial({color:0x7a4a21}));
  post1.position.set(-37.5,2.4,-12.6); post1.castShadow=true; scene.add(post1);
  var post2=post1.clone(); post2.position.z=-5.4; scene.add(post2);
  var bc=document.createElement('canvas'); bc.width=1024; bc.height=144;
  var bg2=bc.getContext('2d'); bg2.fillStyle='#c62828'; bg2.fillRect(0,0,1024,144);
  bg2.strokeStyle='#f2b33d'; bg2.lineWidth=10; bg2.strokeRect(8,8,1008,128);
  bg2.fillStyle='#ffe9a8'; bg2.font='bold 74px "Segoe UI",sans-serif'; bg2.textAlign='center'; bg2.textBaseline='middle';
  bg2.fillText('🎉 CHÀO MỪNG 20/11 🎉', 512, 76);
  var btx=new THREE.CanvasTexture(bc); btx.colorSpace=THREE.SRGBColorSpace;
  var banner=new THREE.Mesh(new THREE.PlaneGeometry(7.2,1.75), new THREE.MeshStandardMaterial({map:btx, side:THREE.DoubleSide, roughness:.9}));
  banner.rotation.y=Math.PI/2; banner.position.set(-37.5,4,-9); scene.add(banner);
  var schName=makeLabel('🏫 TRƯỜNG ĐẠI HỌC TÂY NGUYÊN', 8.5); schName.position.set(-35.6,2.75,-9); scene.add(schName);
  var lb4=makeLabel('🎓 CỔNG TRƯỜNG', 10); lb4.position.set(-37.5,6.4,-9); scene.add(lb4);
  var lbS=makeLabel('🚪 CỔNG NAM', 6); lbS.position.set(2,3.6,33.4); scene.add(lbS);

  // ===== BẾN XE BUÝT ngoài cổng chính, trên đường Lê Duẩn (-39.8,-9) =====
  var bp1=new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.09,2.4,6), new THREE.MeshStandardMaterial({color:0x5a4028}));
  bp1.position.set(-40.5,1.2,-11.5); bp1.castShadow=true; scene.add(bp1);
  var bp2=bp1.clone(); bp2.position.z=-6.5; scene.add(bp2);
  box(2.2,0.15,6, 0x8a5a28, -40.3,2.5,-9, scene, false);
  box(0.5,0.45,1.8, 0x9a8a72, -40.3,0.45,-9); solid(-40.6,-9.9, -40,-8.1);
  var bpole=new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 2.2, 6), new THREE.MeshLambertMaterial({color:0x666666}));
  bpole.position.set(-39.2, 1.1, -5.6); scene.add(bpole);
  var bsign=makeIcon('🚏', 1.6); bsign.position.set(-39.2, 2.6, -5.6); scene.add(bsign);

  // ===== HỒ NƯỚC: tâm (12,-36), solid (3,-44)-(21,-28), chòi bờ Tây Bắc (0,-43) =====
  // Hồ thật có hình không đều và nước xanh đậm: dựng mặt hồ bằng 3 đĩa ellipse chồng nhau
  // (hợp của chúng nằm trong hình chữ nhật solid), dưới là 3 đĩa bờ cát lớn hơn 1.12 lần.
  function lakeDisc(cx,cz,rx,rz,color,y,rough){
    var m=new THREE.Mesh(new THREE.CircleGeometry(1,36), new THREE.MeshStandardMaterial({color:color, roughness:rough}));
    m.rotation.x=-Math.PI/2; m.scale.set(rx,rz,1); m.position.set(cx,y,cz); m.receiveShadow=true; scene.add(m); return m;
  }
  lakeDisc(12,-36, 9*1.12, 7.5*1.12, 0xcbb98a, 0.02, 1);
  lakeDisc(8,-32, 5*1.12, 4*1.12, 0xcbb98a, 0.02, 1);
  lakeDisc(16,-40, 5*1.12, 4*1.12, 0xcbb98a, 0.02, 1);
  lakeDisc(12,-36, 9, 7.5, 0x2f6f4e, 0.035, .35);
  lakeDisc(8,-32, 5, 4, 0x2f6f4e, 0.035, .35);
  lakeDisc(16,-40, 5, 4, 0x2f6f4e, 0.035, .35);
  solid(3,-44, 21,-28);
  box(3,0.18,3, 0xd8c9a8, 0,0.09,-43, scene, false);
  var pvXY=[[-1.3,-44.3],[1.3,-44.3],[-1.3,-41.7],[1.3,-41.7]];
  for(var pvi=0; pvi<4; pvi++){
    var ppv=new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.09,2.4,6), new THREE.MeshStandardMaterial({color:0x7a4a21}));
    ppv.position.set(pvXY[pvi][0],1.2,pvXY[pvi][1]); ppv.castShadow=true; scene.add(ppv);
  }
  box(3.6,0.18,3.6, roofRed, 0,2.55,-43, scene, false);
  var lbLake=makeLabel('🌊 HỒ NƯỚC', 10); lbLake.position.set(12,6.6,-36); scene.add(lbLake);
  var lbPav=makeLabel('⛩️ CHÒI NGHỈ', 4.5); lbPav.position.set(0,3.5,-43); scene.add(lbPav);

  // ===== GIẢNG ĐƯỜNG BẮC: 2 dãy nhà khoa nhiều tầng (tường kem + lưới cửa sổ + mái ngói dốc), không vào trong =====
  decoBuilding(16,6.5,6, -16,-50, roofRed); solid(-24,-53, -8,-47);
  decoBuilding(18,6.5,6, 17,-51, roofRed); solid(8,-54, 26,-48);
  var lbLec=makeLabel('🏫 GIẢNG ĐƯỜNG', 10); lbLec.position.set(0,6.4,-50); scene.add(lbLec);

  // ===== NHÀ ĐIỀU HÀNH: khối mái cam ngay trong cổng chính (-27,-8), cùng kiểu mặt đứng nhà khoa =====
  decoBuilding(12,5,7, -27,-8, 0xe2703a); solid(-33,-11.5, -21,-4.5);
  box(1.6,2.4,0.14, 0x6d4c41, -27,1.2,-4.42, scene, false);
  var lbAdm=makeLabel('🏛️ NHÀ ĐIỀU HÀNH', 10); lbAdm.position.set(-27,8.6,-8); scene.add(lbAdm);

  // Cột cờ ở sân trước nhà điều hành
  var pole=new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.12,9.5,8), new THREE.MeshStandardMaterial({color:0xd8d8e2, metalness:.5, roughness:.4}));
  pole.position.set(-20.5,4.75,-2.5); pole.castShadow=true; scene.add(pole);
  flagMesh=box(2.7,1.6,0.09, 0xd43a2f, -19.05,8.5,-2.5, scene, false);
  solid(-20.85,-2.85, -20.15,-2.15);

  // Ghế đá + cây + đèn quanh khuôn viên mới
  box(2.6,0.5,0.8, 0x9a8a72, -12,0.45,-3.5); solid(-13.3,-3.9, -10.7,-3.1);
  box(2.6,0.5,0.8, 0x9a8a72, -1,0.45,-27); solid(-2.3,-27.4, 0.3,-26.6);
  tree(2,-27,1); tree(24,-27,1.1); tree(24,-45,1); tree(2,-46,0.95);
  tree(4,-13,1); tree(-20,-12.5,1.05); tree(-35,-48,1.1); tree(-30,20,1); tree(24,32,1.05);
  // Hàng cây bên trong rào dọc đường Lê Duẩn (phía Tây, chừa khe cổng z -12..-6)
  tree(-35.5,-52,1); tree(-35.5,-40,1.05); tree(-35.5,-30,0.95); tree(-35.5,-22,1);
  tree(-35.5,2,1.05); tree(-35.5,12,0.95); tree(-35.5,22,1); tree(-35.5,30,1.05);
  // Cụm cây bờ Bắc và bờ Đông hồ (ngoài hình chữ nhật solid của hồ)
  tree(6,-46.5,1); tree(12,-47,1.1); tree(18,-46.5,0.95); tree(24,-38,1); tree(23.5,-41,1.05);
  lamp(-14,-11); lamp(10,-11); lamp(-28,-29); lamp(0,-29); lamp(-10,25); lamp(24,25);
  var lb5=makeLabel('🌳 SÂN TRƯỜNG', 10); lb5.position.set(0,6.8,-8); scene.add(lb5);
  var bushPos=[[-34,-14],[-34,2],[36,-2],[36,32],[-11,50.5],[11,50.5]];
  for(var bui=0; bui<bushPos.length; bui++){
    if(placeModel('bush', bushPos[bui][0], bushPos[bui][1], 1.15, bui*0.7)) continue;
    var bush=new THREE.Mesh(new THREE.SphereGeometry(0.62,9,7), new THREE.MeshStandardMaterial({color:0x4e7a3a, roughness:.95}));
    bush.position.set(bushPos[bui][0],0.5,bushPos[bui][1]); bush.castShadow=true; scene.add(bush);
  }
  placeModel('rock', -35,-20, 1, 0.4); placeModel('rock', 26,-46, 1.2, 2.1); placeModel('rock', 16,52, 0.9, 4.0);
  placeModel('flower', -36,-4, 0.6, 0); placeModel('flower', 6,50, 0.6, 2.2); placeModel('flower', -6,50, 0.6, 3.1);
}
