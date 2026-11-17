"use strict";
// Tòa trường: Phòng học (có học sinh) + Văn phòng khoa + hành lang
// ĐÃ TỊNH TIẾN NGUYÊN KHỐI dx=-16, dz=-4 theo layout-final.md (khối cũ x -14..14, z -40..-33 -> x -30..-2, z -44..-37)
function buildSchool(){
  // ===== TRƯỜNG HỌC: 2 phòng có cửa (Phòng học + Văn phòng khoa), hành lang phía trước =====
  box(34,0.14,10, 0xe6dcc4, -16,0.07,-42, scene, false);
  var wallC=0xf3e6c8;
  box(34,2.9,0.5, wallC, -16,1.45,-46.75); solid(-33,-47, 1,-46.5);
  box(0.5,2.9,9.5, wallC, -32.75,1.45,-42); solid(-33,-46.5, -32.5,-37.5);
  box(0.5,2.9,9.5, wallC, 0.75,1.45,-42); solid(0.5,-46.5, 1,-37.5);
  box(0.5,2.9,9.5, 0xe8dcc0, -16,1.45,-42); solid(-16.25,-46.5, -15.75,-37.5);
  box(5,2.9,0.5, wallC, -30.5,1.45,-37.25); solid(-33,-37.5, -28,-37);
  box(18.8,2.9,0.5, wallC, -16,1.45,-37.25); solid(-25.4,-37.5, -6.6,-37);
  box(5,2.9,0.5, wallC, -1.5,1.45,-37.25); solid(-4,-37.5, 1,-37);
  box(2.6,0.55,0.56, 0x6d4c41, -26.7,2.62,-37.25, scene, false);
  box(2.6,0.55,0.56, 0x6d4c41, -5.3,2.62,-37.25, scene, false);
  box(35,0.35,1.1, 0xc0392b, -16,3.05,-46.75, scene, false);
  box(35,0.35,1.1, 0xc0392b, -16,3.05,-37.25, scene, false);
  box(1.1,0.35,10.6, 0xc0392b, -33,3.05,-42, scene, false);
  box(1.1,0.35,10.6, 0xc0392b, 1,3.05,-42, scene, false);
  var corr=new THREE.Mesh(new THREE.PlaneGeometry(34.6,3.6), new THREE.MeshLambertMaterial({color:0xbfb49a}));
  corr.rotation.x=-Math.PI/2; corr.position.set(-16,0.028,-35.3); corr.receiveShadow=true; scene.add(corr);
  // Trong PHÒNG HỌC: bảng đen, bàn giảng viên, 6 bàn sinh viên
  box(7,2,0.15, 0x2e4a3a, -24.5,1.7,-46.35, scene, false);
  box(2.2,1.4,0.1, 0x33507e, -29.5,1.9,-46.42, scene, false);
  box(2.2,1.4,0.1, 0x33507e, -19.5,1.9,-46.42, scene, false);
  box(2.2,0.9,1, 0x8a5a28, -24.5,0.45,-44.6); solid(-25.6,-45.1, -23.4,-44.1);
  var deskPos=[[-28.5,-43.8],[-21,-43.8],[-28.5,-41.6],[-21,-41.6],[-28.5,-39.4],[-21,-39.4]];
  for(var di=0; di<deskPos.length; di++){ var dp=deskPos[di]; box(1.9,0.75,1, 0xa8763e, dp[0],0.38,dp[1]); solid(dp[0]-0.95,dp[1]-0.5, dp[0]+0.95,dp[1]+0.5); }
  var clk=makeIcon('🕐',0.9); clk.position.set(-24.5,2.7,-46.2); scene.add(clk);
  // Học sinh ngồi học tại 6 bàn: có ghế, sách trên bàn, ngồi cao rõ người (em bàn cuối phía đông gục ngủ, cảnh 07:30)
  var stuCols=[0x4a3421, 0x191919, 0x5a3a22, 0x2b2b30, 0x6b4a2a, 0x333333];
  var bookCols=[0xd84a4a, 0x3a6ea5, 0x3f9e4d, 0xf2b33d, 0x8e44ad, 0xe2703a];
  for(var sti=0; sti<deskPos.length; sti++){
    var sdp=deskPos[sti];
    box(0.85,0.5,0.8, 0x6b4a2a, sdp[0],0.25,sdp[1]+0.9, scene, false);
    box(0.52,0.07,0.36, bookCols[sti], sdp[0]+0.28,0.8,sdp[1], scene, false);
    var stu=makePerson({suit:0xffffff, cloth:0x27364f, hair:stuCols[sti]});
    stu.position.set(sdp[0], -0.35, sdp[1]+0.85); stu.rotation.y=Math.PI; stu.scale.setScalar(0.95);
    if(sti===5){ stu.rotation.x=0.45; var zz=makeIcon('💤',1); zz.position.set(sdp[0]+0.7, 1.8, sdp[1]+0.7); scene.add(zz); }
    scene.add(stu);
    seated.push({g:stu, ph:sti*1.13, base:-0.35});
  }
  // 2 sinh viên đứng trò chuyện ở lối đi trong lớp + 1 đồng nghiệp ngồi làm việc trong Văn phòng khoa
  var chat1=makePerson({suit:0xffffff, cloth:0x27364f, hair:0x191919});
  chat1.position.set(-31,0,-40.8); chat1.rotation.y=1.9; scene.add(chat1);
  var chat2=makePerson({suit:0xffffff, cloth:0x27364f, hair:0x6b4a2a});
  chat2.position.set(-29.9,0,-39.8); chat2.rotation.y=-1.2; scene.add(chat2);
  var chatLb=makeLabel('Sinh viên', 4.2, 40); chatLb.position.set(-30.5,3.2,-40.3); scene.add(chatLb);
  var col=makePerson({suit:0x3a6ea5, cloth:0x3a3f4a, hair:0x2b2b30});
  col.position.set(-5,-0.35,-43.5); col.rotation.y=Math.PI; scene.add(col);
  seated.push({g:col, ph:2.4, base:-0.35});
  var lap2=makeIcon('💻',0.85); lap2.position.set(-5,1.25,-44.5); scene.add(lap2);
  // Tranh treo tường trong phòng học + bảng tin ở hành lang
  var po1=makeIcon('📚',1); po1.position.set(-29.5,2.1,-46.35); scene.add(po1);
  var po2=makeIcon('⭐',1); po2.position.set(-19.5,2.1,-46.35); scene.add(po2);
  box(2.6,1.5,0.1, 0x8a5a28, -30.5,1.8,-36.92, scene, false);
  var pin=makeIcon('📌',0.8); pin.position.set(-30.5,1.9,-36.75); scene.add(pin);
  var sign=makeLabel('🎓 TRƯỜNG ĐẠI HỌC', 7.5); sign.position.set(-16,2.3,-36.6); scene.add(sign);
  // Trong VĂN PHÒNG KHOA: 2 bàn làm việc, tủ hồ sơ, bàn họp
  box(2.4,0.9,1.1, 0x8a5a28, -10.5,0.45,-44.5); solid(-11.7,-45.05, -9.3,-43.95);
  box(2.4,0.9,1.1, 0x8a5a28, -5,0.45,-44.5); solid(-6.2,-45.05, -3.8,-43.95);
  box(3,2,0.7, 0x7a5a38, -1.5,1,-46.1); solid(-3,-46.45, 0,-45.75);
  box(3.4,0.8,1.6, 0xa8763e, -8,0.4,-40); solid(-9.7,-40.8, -6.3,-39.2);
  var bk=makeIcon('📚',0.85); bk.position.set(-10.5,1.25,-44.5); scene.add(bk);
  var pl=makeIcon('🪴',1.1); pl.position.set(-14.2,0.8,-45.6); scene.add(pl);
  var lb1=makeLabel('🏫 TRƯỜNG HỌC', 10); lb1.position.set(-16,6.4,-42); scene.add(lb1);
  var lb1a=makeLabel('📖 PHÒNG HỌC', 6); lb1a.position.set(-26.5,4.3,-42); scene.add(lb1a);
  var lb1b=makeLabel('🗂️ VĂN PHÒNG KHOA', 6); lb1b.position.set(-5.5,4.3,-42); scene.add(lb1b);
  // ===== TRANG TRÍ LẠI PHÒNG HỌC + VĂN PHÒNG KHOA =====
  var lampMat=new THREE.MeshStandardMaterial({color:0xfff2cc, emissive:0xffdf9e, emissiveIntensity:0.85, roughness:.6});
  function hangLamp(x,z){
    var cord=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.02,0.5,5), new THREE.MeshStandardMaterial({color:0x555555}));
    cord.position.set(x,2.85,z); scene.add(cord);
    var shade=new THREE.Mesh(new THREE.BoxGeometry(1.25,0.09,0.42), lampMat);
    shade.position.set(x,2.58,z); scene.add(shade);
  }
  // Phòng học: khung gỗ quanh bảng đen + khay phấn
  box(7.3,0.12,0.06, 0x6d4c41, -24.5,2.76,-46.28, scene, false);
  box(7.3,0.12,0.06, 0x6d4c41, -24.5,0.64,-46.28, scene, false);
  box(0.12,2.24,0.06, 0x6d4c41, -28.1,1.7,-46.28, scene, false);
  box(0.12,2.24,0.06, 0x6d4c41, -20.9,1.7,-46.28, scene, false);
  box(7,0.06,0.2, 0x8a5a28, -24.5,0.58,-46.2, scene, false);
  // Ốp gỗ chân tường phía Bắc + 2 cửa sổ kính tường Tây của phòng học
  box(32,0.9,0.05, 0x8a5a28, -16,0.45,-46.44, scene, false);
  box(0.05,1.6,2.4, 0x6d4c41, -32.46,1.8,-44, scene, false);
  box(0.06,1.4,2.2, 0xbfd9e8, -32.43,1.8,-44, scene, false);
  box(0.05,1.6,2.4, 0x6d4c41, -32.46,1.8,-40.5, scene, false);
  box(0.06,1.4,2.2, 0xbfd9e8, -32.43,1.8,-40.5, scene, false);
  // Lưng ghế cho 6 ghế sinh viên + ghế và laptop trên bàn giảng viên
  for(var cbi=0; cbi<deskPos.length; cbi++) box(0.85,0.62,0.08, 0x6b4a2a, deskPos[cbi][0],0.78,deskPos[cbi][1]+1.3, scene, false);
  box(0.7,0.5,0.7, 0x6b4a2a, -24.5,0.25,-45.65, scene, false);
  var lapT=makeIcon('💻',0.8); lapT.position.set(-24.5,1.12,-44.6); scene.add(lapT);
  hangLamp(-24.5,-42); hangLamp(-24.5,-39.6);
  // Văn phòng khoa: màn hình máy tính trên 2 bàn, gáy sách trên tủ hồ sơ
  [-10.5,-5].forEach(function(mx){
    box(0.3,0.32,0.05, 0x333333, mx,1.06,-44.62, scene, false);
    box(0.95,0.6,0.05, 0x9fc4e8, mx,1.38,-44.64, scene, false);
  });
  var bkTex=bookSpineTexture();
  var cabFace=new THREE.Mesh(new THREE.BoxGeometry(2.9,1.8,0.04), new THREE.MeshStandardMaterial({map:bkTex, roughness:.85}));
  cabFace.position.set(-1.5,1,-45.72); scene.add(cabFace);
  // Ghế sofa tiếp khách sát vách ngăn + thảm đỏ dưới bàn họp + cây nước ở góc Đông Nam
  box(0.95,0.45,2.8, 0x7a4a3a, -14.9,0.23,-41.5, scene, true);
  box(0.25,0.85,2.8, 0x7a4a3a, -15.32,0.65,-41.5, scene, true);
  box(0.95,0.3,0.25, 0x7a4a3a, -14.9,0.6,-42.95, scene, false);
  box(0.95,0.3,0.25, 0x7a4a3a, -14.9,0.6,-40.05, scene, false);
  solid(-15.4,-42.9, -14.4,-40.1);
  box(4.4,0.04,3, 0xa33d2a, -8,0.02,-40.5, scene, false);
  var cool=new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.16,0.9,10), new THREE.MeshStandardMaterial({color:0xf0f0f0, roughness:.5}));
  cool.position.set(-0.2,0.45,-38.6); cool.castShadow=true; scene.add(cool);
  var bottle=new THREE.Mesh(new THREE.CylinderGeometry(0.13,0.13,0.36,10), new THREE.MeshStandardMaterial({color:0x7ab5e8, roughness:.3}));
  bottle.position.set(-0.2,1.08,-38.6); scene.add(bottle);
  solid(-0.45,-38.85, 0.05,-38.35);
  hangLamp(-8,-42);
}
