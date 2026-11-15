"use strict";
// Sân trường: nền, đường, tường rào, cổng, cột cờ, cây đèn
function buildCampus(){
  // Nền
  var grass=new THREE.Mesh(new THREE.PlaneGeometry(104,124), new THREE.MeshStandardMaterial({color:0x69a24b, roughness:1}));
  grass.rotation.x=-Math.PI/2; grass.receiveShadow=true; scene.add(grass);
  var plaza=new THREE.Mesh(new THREE.PlaneGeometry(42,16), new THREE.MeshStandardMaterial({color:0xcfc8b8, roughness:1}));
  plaza.rotation.x=-Math.PI/2; plaza.position.set(0,0.02,-25); plaza.receiveShadow=true; scene.add(plaza);
  var court=new THREE.Mesh(new THREE.PlaneGeometry(58,40), new THREE.MeshStandardMaterial({color:0xcac2ae, roughness:1}));
  court.rotation.x=-Math.PI/2; court.position.set(0,0.015,3); court.receiveShadow=true; scene.add(court);
  var path=new THREE.Mesh(new THREE.PlaneGeometry(4.6,22), new THREE.MeshStandardMaterial({color:0xb8ab8c, roughness:1}));
  path.rotation.x=-Math.PI/2; path.position.set(0,0.03,34); path.receiveShadow=true; scene.add(path);
  var garden=new THREE.Mesh(new THREE.PlaneGeometry(32,17), new THREE.MeshStandardMaterial({color:0x7fae56, roughness:1}));
  garden.rotation.x=-Math.PI/2; garden.position.set(0,0.012,44.5); garden.receiveShadow=true; scene.add(garden);
  // Chấm hoa
  var flowerCols=[0xf28bb4, 0xffd76e, 0xffffff, 0xe2703a];
  for(var i=0;i<14;i++){
    var f=new THREE.Mesh(new THREE.CircleGeometry(0.45+((i*37)%40)/60, 10), new THREE.MeshBasicMaterial({color:flowerCols[i%4]}));
    f.rotation.x=-Math.PI/2; var fx=-44+((i*53)%88), fz=-48+((i*29)%92);
    if(Math.abs(fx)<4) fx+=7;
    f.position.set(fx, 0.035, fz); scene.add(f);
  }

  // ===== Rào + cổng + băng-rôn =====
  // Tường rào bao quanh trường (tường xây có trụ + nắp, chừa cổng chính x -3..3)
  var twC=0xe3d7bd, twCap=0xb08954, twPil=0xcbb489;
  box(39,2.2,0.4, twC, -22.5,1.1,24); box(39,2.2,0.4, twC, 22.5,1.1,24);
  box(39.4,0.2,0.62, twCap, -22.5,2.3,24, scene, false); box(39.4,0.2,0.62, twCap, 22.5,2.3,24, scene, false);
  solid(-42,23.7, -3,24.3); solid(3,23.7, 42,24.3);
  box(0.4,2.2,80, twC, -42,1.1,-16); box(0.4,2.2,80, twC, 42,1.1,-16);
  box(0.62,0.2,80.4, twCap, -42,2.3,-16, scene, false); box(0.62,0.2,80.4, twCap, 42,2.3,-16, scene, false);
  solid(-42.3,-56, -41.7,24); solid(41.7,-56, 42.3,24);
  box(84.4,2.2,0.4, twC, 0,1.1,-56); box(84.8,0.2,0.62, twCap, 0,2.3,-56, scene, false);
  solid(-42,-56.3, 42,-55.7);
  var pilX=[-42,-37,-30,-22.5,-15,-7.5,7.5,15,22.5,30,37,42];
  for(var pli=0; pli<pilX.length; pli++) box(0.72,2.55,0.72, twPil, pilX[pli],1.27,24, scene, false);
  var pilZ=[-50,-43,-36,-29,-22,-15,-8,-1,6,13,20];
  for(var plz=0; plz<pilZ.length; plz++){ box(0.72,2.55,0.72, twPil, -42,1.27,pilZ[plz], scene, false); box(0.72,2.55,0.72, twPil, 42,1.27,pilZ[plz], scene, false); }
  var pilN=[-42,-28,-14,0,14,28,42];
  for(var pln=0; pln<pilN.length; pln++) box(0.72,2.55,0.72, twPil, pilN[pln],1.27,-56, scene, false);
  var schName=makeLabel('🏫 TRƯỜNG ĐẠI HỌC TÂY NGUYÊN', 8.5); schName.position.set(10.5,1.85,23.6); scene.add(schName);
  var post1=new THREE.Mesh(new THREE.CylinderGeometry(0.14,0.14,4.8,8), new THREE.MeshStandardMaterial({color:0x7a4a21}));
  post1.position.set(-3.4,2.4,24); post1.castShadow=true; scene.add(post1);
  var post2=post1.clone(); post2.position.x=3.4; scene.add(post2);
  var bc=document.createElement('canvas'); bc.width=1024; bc.height=144;
  var bg2=bc.getContext('2d'); bg2.fillStyle='#c62828'; bg2.fillRect(0,0,1024,144);
  bg2.strokeStyle='#f2b33d'; bg2.lineWidth=10; bg2.strokeRect(8,8,1008,128);
  bg2.fillStyle='#ffe9a8'; bg2.font='bold 74px "Segoe UI",sans-serif'; bg2.textAlign='center'; bg2.textBaseline='middle';
  bg2.fillText('🎉 CHÀO MỪNG 20/11 🎉', 512, 76);
  var btx=new THREE.CanvasTexture(bc); btx.colorSpace=THREE.SRGBColorSpace;
  var banner=new THREE.Mesh(new THREE.PlaneGeometry(12.5,1.75), new THREE.MeshStandardMaterial({map:btx, side:THREE.DoubleSide, roughness:.9}));
  banner.position.set(0,4,24); scene.add(banner);
  var lb4=makeLabel('🎓 CỔNG TRƯỜNG', 10); lb4.position.set(0,6.4,24); scene.add(lb4);

  // Cột cờ
  var pole=new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.12,9.5,8), new THREE.MeshStandardMaterial({color:0xd8d8e2, metalness:.5, roughness:.4}));
  pole.position.set(-12,4.75,2); pole.castShadow=true; scene.add(pole);
  flagMesh=box(2.7,1.6,0.09, 0xd43a2f, -10.55,8.5,2, scene, false);
  solid(-12.35,1.65, -11.65,2.35);

  // Ghế đá + cây + đèn
  box(2.6,0.5,0.8, 0x9a8a72, -8,0.45,-4); solid(-9.3,-4.4, -6.7,-3.6);
  box(2.6,0.5,0.8, 0x9a8a72, 8,0.45,12); solid(6.7,11.6, 9.3,12.4);
  tree(-24,-8,1.1); tree(27.5,-15,1.25); tree(-16,14,1); tree(16,14,1.15); tree(26,32,1.2); tree(-26,34,1); tree(12,35,0.95); tree(-14,-19,1.05);
  lamp(-3.4,-14); lamp(3.4,-14); lamp(-3.4,6); lamp(3.4,6); lamp(-3.4,20); lamp(3.4,20);
  var lb5=makeLabel('🌳 SÂN TRƯỜNG', 10); lb5.position.set(13,6.8,-2); scene.add(lb5);

  // Đường nhựa + điểm xe buýt trước cổng
  var road=new THREE.Mesh(new THREE.PlaneGeometry(104, 5), new THREE.MeshLambertMaterial({color:0x8a8f98}));
  road.rotation.x=-Math.PI/2; road.position.set(0, 0.008, 28.75); scene.add(road);
  var bpole=new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 2.2, 6), new THREE.MeshLambertMaterial({color:0x666666}));
  bpole.position.set(22.5, 1.1, 30.6); scene.add(bpole);
  var bsign=makeIcon('🚏', 1.6); bsign.position.set(22.5, 2.6, 30.6); scene.add(bsign);

  // Chi tiết sinh động: ghế đá sân trường, bụi cây, chỗ để xe gần cổng
  box(2.4,0.14,0.65, 0x8a5a28, -14,0.55,-18, scene, false);
  box(2.4,0.55,0.12, 0x8a5a28, -14,0.9,-17.68, scene, false);
  box(2.4,0.14,0.65, 0x8a5a28, 14,0.55,-18, scene, false);
  box(2.4,0.55,0.12, 0x8a5a28, 14,0.9,-17.68, scene, false);
  var bushPos=[[-18,-16.5],[-12,-16.5],[12,-16.5],[18,-16.5],[-24,-16.5],[24,-16.5],[-11,50.5],[11,50.5]];
  for(var bui=0; bui<bushPos.length; bui++){
    if(placeModel('bush', bushPos[bui][0], bushPos[bui][1], 1.15, bui*0.7)) continue;
    var bush=new THREE.Mesh(new THREE.SphereGeometry(0.62,9,7), new THREE.MeshStandardMaterial({color:0x4e7a3a, roughness:.95}));
    bush.position.set(bushPos[bui][0],0.5,bushPos[bui][1]); bush.castShadow=true; scene.add(bush);
  }
  // Đá + hoa: model 3D thật (Kenney Nature Kit, CC0)
  placeModel('rock', -27,-14, 1, 0.4); placeModel('rock', 27,-20, 1.3, 2.1); placeModel('rock', 16,52, 0.9, 4.0);
  placeModel('flower', -10,-16.6, 0.6, 0); placeModel('flower', 10,-16.6, 0.6, 1.2);
  placeModel('flower', 6,50, 0.6, 2.2); placeModel('flower', -6,50, 0.6, 3.1); placeModel('flower', -24,33, 0.6, 0.7);
  box(3.2,0.5,0.8, 0x666c75, -26,0.25,20.5, scene, false);
  var bike=makeIcon('🚲',1.1); bike.position.set(-26.8,0.95,20.5); scene.add(bike);
  var moto=makeIcon('🛵',1.1); moto.position.set(-25.2,0.95,20.5); scene.add(moto);
}
