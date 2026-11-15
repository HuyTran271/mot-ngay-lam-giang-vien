"use strict";
// Tòa trường: Phòng học (có học sinh) + Văn phòng khoa + hành lang
function buildSchool(){
  // ===== TRƯỜNG HỌC: 2 phòng có cửa (Phòng học + Văn phòng khoa), hành lang phía trước =====
  box(34,0.14,10, 0xe6dcc4, 0,0.07,-38, scene, false);
  var wallC=0xf3e6c8;
  box(34,2.9,0.5, wallC, 0,1.45,-42.75); solid(-17,-43, 17,-42.5);
  box(0.5,2.9,9.5, wallC, -16.75,1.45,-38); solid(-17,-42.5, -16.5,-33.5);
  box(0.5,2.9,9.5, wallC, 16.75,1.45,-38); solid(16.5,-42.5, 17,-33.5);
  box(0.5,2.9,9.5, 0xe8dcc0, 0,1.45,-38); solid(-0.25,-42.5, 0.25,-33.5);
  box(5,2.9,0.5, wallC, -14.5,1.45,-33.25); solid(-17,-33.5, -12,-33);
  box(18.8,2.9,0.5, wallC, 0,1.45,-33.25); solid(-9.4,-33.5, 9.4,-33);
  box(5,2.9,0.5, wallC, 14.5,1.45,-33.25); solid(12,-33.5, 17,-33);
  box(2.6,0.55,0.56, 0x6d4c41, -10.7,2.62,-33.25, scene, false);
  box(2.6,0.55,0.56, 0x6d4c41, 10.7,2.62,-33.25, scene, false);
  box(35,0.35,1.1, 0xc0392b, 0,3.05,-42.75, scene, false);
  box(35,0.35,1.1, 0xc0392b, 0,3.05,-33.25, scene, false);
  box(1.1,0.35,10.6, 0xc0392b, -17,3.05,-38, scene, false);
  box(1.1,0.35,10.6, 0xc0392b, 17,3.05,-38, scene, false);
  var corr=new THREE.Mesh(new THREE.PlaneGeometry(34.6,3.6), new THREE.MeshLambertMaterial({color:0xbfb49a}));
  corr.rotation.x=-Math.PI/2; corr.position.set(0,0.028,-31.3); corr.receiveShadow=true; scene.add(corr);
  // Trong PHÒNG HỌC: bảng đen, bàn giảng viên, 6 bàn sinh viên
  box(7,2,0.15, 0x2e4a3a, -8.5,1.7,-42.35, scene, false);
  box(2.2,1.4,0.1, 0x33507e, -13.5,1.9,-42.42, scene, false);
  box(2.2,1.4,0.1, 0x33507e, -3.5,1.9,-42.42, scene, false);
  box(2.2,0.9,1, 0x8a5a28, -8.5,0.45,-40.6); solid(-9.6,-41.1, -7.4,-40.1);
  var deskPos=[[-12.5,-39.8],[-5,-39.8],[-12.5,-37.6],[-5,-37.6],[-12.5,-35.4],[-5,-35.4]];
  for(var di=0; di<deskPos.length; di++){ var dp=deskPos[di]; box(1.9,0.75,1, 0xa8763e, dp[0],0.38,dp[1]); solid(dp[0]-0.95,dp[1]-0.5, dp[0]+0.95,dp[1]+0.5); }
  var clk=makeIcon('🕐',0.9); clk.position.set(-8.5,2.7,-42.2); scene.add(clk);
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
  chat1.position.set(-15,0,-36.8); chat1.rotation.y=1.9; scene.add(chat1);
  var chat2=makePerson({suit:0xffffff, cloth:0x27364f, hair:0x6b4a2a});
  chat2.position.set(-13.9,0,-35.8); chat2.rotation.y=-1.2; scene.add(chat2);
  var chatLb=makeLabel('Sinh viên', 4.2, 40); chatLb.position.set(-14.5,3.2,-36.3); scene.add(chatLb);
  var col=makePerson({suit:0x3a6ea5, cloth:0x3a3f4a, hair:0x2b2b30});
  col.position.set(11,-0.35,-39.5); col.rotation.y=Math.PI; scene.add(col);
  seated.push({g:col, ph:2.4, base:-0.35});
  var lap2=makeIcon('💻',0.85); lap2.position.set(11,1.25,-40.5); scene.add(lap2);
  // Tranh treo tường trong phòng học + bảng tin ở hành lang
  var po1=makeIcon('📚',1); po1.position.set(-13.5,2.1,-42.35); scene.add(po1);
  var po2=makeIcon('⭐',1); po2.position.set(-3.5,2.1,-42.35); scene.add(po2);
  box(2.6,1.5,0.1, 0x8a5a28, -14.5,1.8,-32.92, scene, false);
  var pin=makeIcon('📌',0.8); pin.position.set(-14.5,1.9,-32.75); scene.add(pin);
  var sign=makeLabel('🎓 TRƯỜNG ĐẠI HỌC', 7.5); sign.position.set(0,2.3,-32.6); scene.add(sign);
  // Trong VĂN PHÒNG KHOA: 2 bàn làm việc, tủ hồ sơ, bàn họp
  box(2.4,0.9,1.1, 0x8a5a28, 5.5,0.45,-40.5); solid(4.3,-41.05, 6.7,-39.95);
  box(2.4,0.9,1.1, 0x8a5a28, 11,0.45,-40.5); solid(9.8,-41.05, 12.2,-39.95);
  box(3,2,0.7, 0x7a5a38, 14.5,1,-42.1); solid(13,-42.45, 16,-41.75);
  box(3.4,0.8,1.6, 0xa8763e, 8,0.4,-36); solid(6.3,-36.8, 9.7,-35.2);
  var bk=makeIcon('📚',0.85); bk.position.set(5.5,1.25,-40.5); scene.add(bk);
  var pl=makeIcon('🪴',1.1); pl.position.set(1.8,0.8,-41.6); scene.add(pl);
  var lb1=makeLabel('🏫 TRƯỜNG HỌC', 12); lb1.position.set(0,5.4,-38); scene.add(lb1);
  var lb1a=makeLabel('📖 PHÒNG HỌC', 6); lb1a.position.set(-8.5,4.3,-38); scene.add(lb1a);
  var lb1b=makeLabel('🗂️ VĂN PHÒNG KHOA', 6); lb1b.position.set(8.5,4.3,-38); scene.add(lb1b);
}
