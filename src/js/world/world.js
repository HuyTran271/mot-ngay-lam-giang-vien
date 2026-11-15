"use strict";
// Ghép toàn bộ thế giới 3D từ các module con
function buildWorld(){
  buildCampus();
  buildSchool();
  buildLibrary();
  buildCanteen();
  buildHouse();
  buildExpansion();
  buildPeople();
  buildBeacons();
}
function buildBeacons(){
  // 13 điểm sự kiện theo kịch bản (cảnh 12 lặp lại điểm cảnh 1 ở nhà)
  // Tọa độ mới theo layout-final.md: cảnh 2,3,4,6,7,8 dời theo khối trường (dx=-16, dz=-4);
  // cảnh 1 ở cổng chính phía Tây, cảnh 5 ở căn-tin mới, các cảnh ở nhà giữ nguyên
  var BEACON_POS=[[0,40.2],[-36.5,-9],[-24.75,-38.6],[-24.5,-43.2],[-5,-42.5],[-3,-13],[-8,-38.3],[-26.7,-35.3],[-19.2,-41.5],[-1.6,45.2],[5,43.6],[5,43.6],[3.9,47]];
  var BEACON_ICONS=['⏰','🚌','😴','❓','📩','🍚','🗂️','📄','🌤️','🍽️','💬','📝','🌙'];
  for(var bi=0; bi<BEACON_POS.length; bi++){
    var bc3=beacon(BEACON_POS[bi][0], BEACON_POS[bi][1], BEACON_ICONS[bi]);
    bc3.grp.visible=(bi===0); beacons.push(bc3);
  }

  // Mũi tên chỉ đường nằm trên mặt đất, dưới chân người chơi
  var aShape=new THREE.Shape();
  aShape.moveTo(0,0.95); aShape.lineTo(0.55,-0.45); aShape.lineTo(0.2,-0.45); aShape.lineTo(0.2,-0.9);
  aShape.lineTo(-0.2,-0.9); aShape.lineTo(-0.2,-0.45); aShape.lineTo(-0.55,-0.45); aShape.lineTo(0,0.95);
  var aGeo=new THREE.ShapeGeometry(aShape); aGeo.rotateX(-Math.PI/2);
  guideArrow=new THREE.Mesh(aGeo, new THREE.MeshBasicMaterial({color:0xffd76e, transparent:true, opacity:0.9, side:THREE.DoubleSide}));
  guideArrow.position.set(0,0.07,33); scene.add(guideArrow);

  targetRing=new THREE.Mesh(new THREE.RingGeometry(0.45,0.65,28), new THREE.MeshBasicMaterial({color:0xffffff, transparent:true, opacity:.85, side:THREE.DoubleSide}));
  targetRing.rotation.x=-Math.PI/2; targetRing.position.y=0.05; targetRing.visible=false; scene.add(targetRing);}
