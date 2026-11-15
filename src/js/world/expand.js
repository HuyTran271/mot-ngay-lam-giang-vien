"use strict";
// Mở rộng khuôn viên: dãy nhà học B (tây), sân thể thao + bãi xe (đông), vườn sau (bắc), vườn hoa (tây nam)
function buildExpansion(){
  var wallC=0xf3e6c8, woodC=0x8a5a28, slabC=0xd8c9a8, pathC=0xb8ab8c;

  // ===== DÃY NHÀ HỌC B, phía tây =====
  box(8,0.14,25, slabC, -37.5,0.07,-32, scene, false);
  box(6.5,5.2,24, wallC, -38,2.6,-32); solid(-41.2,-44.2, -34.8,-19.8);
  box(8.6,0.3,1, woodC, -37.5,5.35,-44, scene, false);
  box(8.6,0.3,1, woodC, -37.5,5.35,-20, scene, false);
  box(1,0.3,25, woodC, -41.5,5.35,-32, scene, false);
  box(1,0.3,25, woodC, -33.5,5.35,-32, scene, false);
  var doorZ=[-40,-32,-24];
  for(var di=0; di<3; di++){
    box(0.18,2.3,1.25, 0x6d4c41, -34.68,1.15,doorZ[di], scene, false);
    var lbd=makeLabel('📚 PHÒNG B'+(di+1), 2.6); lbd.position.set(-34.2,2.95,doorZ[di]); scene.add(lbd);
  }
  var winZ=[-43,-36,-28,-21];
  for(var wi=0; wi<4; wi++) box(0.14,1.3,1.7, 0xbfe3ff, -34.68,3.4,winZ[wi], scene, false);
  var lbB=makeLabel('🏫 DÃY NHÀ HỌC B', 9); lbB.position.set(-33.6,6.6,-32); scene.add(lbB);
  var wp=new THREE.Mesh(new THREE.PlaneGeometry(3.4,27), new THREE.MeshStandardMaterial({color:pathC, roughness:1}));
  wp.rotation.x=-Math.PI/2; wp.position.set(-32.3,0.025,-32); wp.receiveShadow=true; scene.add(wp);
  tree(-30.9,-44.6,1); tree(-30.9,-19.4,1);
  lamp(-33,-38); lamp(-33,-26);

  // ===== SÂN THỂ THAO, phía đông =====
  var sc=new THREE.Mesh(new THREE.PlaneGeometry(11.5,23), new THREE.MeshStandardMaterial({color:0x6a994e, roughness:1}));
  sc.rotation.x=-Math.PI/2; sc.position.set(36,0.02,-23); sc.receiveShadow=true; scene.add(sc);
  box(11.5,0.03,0.18, 0xffffff, 36,0.045,-34.4, scene, false);
  box(11.5,0.03,0.18, 0xffffff, 36,0.045,-11.6, scene, false);
  box(0.18,0.03,23, 0xffffff, 30.35,0.045,-23, scene, false);
  box(0.18,0.03,23, 0xffffff, 41.65,0.045,-23, scene, false);
  box(11.5,0.03,0.18, 0xffffff, 36,0.045,-23, scene, false);
  var cc=new THREE.Mesh(new THREE.RingGeometry(1.8,2.02,28), new THREE.MeshBasicMaterial({color:0xffffff, side:THREE.DoubleSide}));
  cc.rotation.x=-Math.PI/2; cc.position.set(36,0.045,-23); scene.add(cc);
  // 2 rổ bóng: cột + bảng + vành
  var hoopZ=[[-33.6,-33.2,-32.6],[-12.4,-12.8,-13.4]];
  for(var hi=0; hi<2; hi++){
    var hp=new THREE.Mesh(new THREE.CylinderGeometry(0.11,0.11,3.4,8), new THREE.MeshStandardMaterial({color:0x707880, roughness:.6}));
    hp.position.set(36,1.7,hoopZ[hi][0]); hp.castShadow=true; scene.add(hp);
    box(1.7,1.05,0.08, 0xffffff, 36,3.05,hoopZ[hi][1], scene, false);
    var rim=new THREE.Mesh(new THREE.TorusGeometry(0.45,0.04,8,20), new THREE.MeshStandardMaterial({color:0xe2703a, roughness:.5}));
    rim.rotation.x=Math.PI/2; rim.position.set(36,2.9,hoopZ[hi][2]); scene.add(rim);
    solid(35.75,hoopZ[hi][0]-0.25, 36.25,hoopZ[hi][0]+0.25);
  }
  var lbS=makeLabel('🏀 SÂN THỂ THAO', 9); lbS.position.set(36,6.8,-23); scene.add(lbS);
  box(0.7,0.5,2.6, 0x9a8a72, 40.6,0.45,-28, scene, false);
  box(0.7,0.5,2.6, 0x9a8a72, 40.6,0.45,-18, scene, false);
  tree(31,-36.5,1.05); tree(31,-9.5,1.05);

  // ===== BÃI XE, đông nam =====
  var pk=new THREE.Mesh(new THREE.PlaneGeometry(11,13.5), new THREE.MeshStandardMaterial({color:0xbdb5a2, roughness:1}));
  pk.rotation.x=-Math.PI/2; pk.position.set(35.7,0.018,14.8); pk.receiveShadow=true; scene.add(pk);
  var pkp=new THREE.Mesh(new THREE.PlaneGeometry(2.4,13), new THREE.MeshStandardMaterial({color:pathC, roughness:1}));
  pkp.rotation.x=-Math.PI/2; pkp.position.set(29.9,0.02,14.8); pkp.receiveShadow=true; scene.add(pkp);
  box(11,0.16,13, woodC, 35.7,2.7,14.8, scene, false);
  var postXY=[[31,9],[40.4,9],[31,20.6],[40.4,20.6]];
  for(var pi2=0; pi2<4; pi2++){
    var pp=new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.09,2.7,6), new THREE.MeshStandardMaterial({color:0x5a4028, roughness:.8}));
    pp.position.set(postXY[pi2][0],1.35,postXY[pi2][1]); pp.castShadow=true; scene.add(pp);
  }
  var bikeCols=[0xd43a2f,0x2e5fa3,0x3f7a3a,0xe8a13a,0x707880,0x8e44ad];
  var rowZ=[11.3,17.9];
  for(var ri=0; ri<2; ri++) for(var bi2=0; bi2<6; bi2++)
    box(0.55,0.85,1.5, bikeCols[(ri*3+bi2)%6], 32.2+bi2*1.45, 0.45, rowZ[ri], scene, false);
  solid(31.4,10.4, 40.2,12.2); solid(31.4,17.0, 40.2,18.8);
  var ic1=makeIcon('🛵',1.2); ic1.position.set(33,1.6,11.3); scene.add(ic1);
  var ic2=makeIcon('🚲',1.2); ic2.position.set(38.5,1.6,17.9); scene.add(ic2);
  var lbP=makeLabel('🅿️ BÃI XE', 9); lbP.position.set(35.7,5.6,14.8); scene.add(lbP);

  // ===== VƯỜN SAU, phía bắc =====
  var bp=new THREE.Mesh(new THREE.PlaneGeometry(82,3), new THREE.MeshStandardMaterial({color:pathC, roughness:1}));
  bp.rotation.x=-Math.PI/2; bp.position.set(0,0.02,-49.5); bp.receiveShadow=true; scene.add(bp);
  tree(-36,-52.5,1.1); tree(-24,-52.5,1); tree(24,-52.5,1); tree(36,-52.5,1.1); tree(-14,-53,0.9); tree(14,-53,0.9);
  box(2.6,0.5,0.8, 0x9a8a72, -8,0.45,-51.5); solid(-9.3,-51.9, -6.7,-51.1);
  box(2.6,0.5,0.8, 0x9a8a72, 8,0.45,-51.5); solid(6.7,-51.9, 9.3,-51.1);
  placeModel('flower', -18,-48.4, 0.6, 0); placeModel('flower', 18,-48.4, 0.6, 1);
  placeModel('flower', -4,-50.9, 0.6, 2); placeModel('flower', 4,-50.9, 0.6, 3);
  lamp(-20,-49.5); lamp(20,-49.5);
  var lbG=makeLabel('🌿 VƯỜN SAU TRƯỜNG', 9); lbG.position.set(0,6.2,-52.5); scene.add(lbG);

  // ===== VƯỜN HOA, tây nam =====
  var bedZ=[1,9,17];
  for(var bei=0; bei<3; bei++){
    box(7,0.18,3.2, 0x8a6d4a, -36,0.09,bedZ[bei], scene, false);
    placeModel('flower', -38,bedZ[bei], 0.7, bei); placeModel('flower', -36,bedZ[bei]+0.8, 0.7, bei+1.3); placeModel('flower', -34,bedZ[bei]-0.6, 0.7, bei+2.1);
  }
  tree(-38.5,-5,1.05); tree(-33,22.6,1);
  box(2.6,0.5,0.8, 0x9a8a72, -36,0.45,-1.5); solid(-37.3,-1.9, -34.7,-1.1);
  var lbF=makeLabel('🌸 VƯỜN HOA', 9); lbF.position.set(-36,6,9); scene.add(lbF);
}
