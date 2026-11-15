"use strict";
function tree(x,z,s){
  var _kinds=['treeOak','treePine','treeDetailed'];
  var _kind=_kinds[Math.abs(Math.round(x*7+z*13))%3];
  if(MODELS[_kind]){ placeModel(_kind, x, z, 4.3*(s||1), (Math.abs(Math.round(x*3+z*5))%6)*1.05); solid(x-0.55, z-0.55, x+0.55, z+0.55); return; }
  var g=new THREE.Group(); g.position.set(x,0,z); g.scale.setScalar(s||1);
  var trunk=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.3,1.6,7), new THREE.MeshStandardMaterial({color:0x8a5a28, roughness:.9}));
  trunk.position.y=0.8; trunk.castShadow=true; g.add(trunk);
  var c1=new THREE.Mesh(new THREE.SphereGeometry(1.5,10,8), new THREE.MeshStandardMaterial({color:0x4e7a3a, roughness:.9}));
  c1.position.y=2.6; c1.castShadow=true; g.add(c1);
  var c2=new THREE.Mesh(new THREE.SphereGeometry(1.05,10,8), new THREE.MeshStandardMaterial({color:0x5d8a44, roughness:.9}));
  c2.position.set(0.7,3.4,0.3); c2.castShadow=true; g.add(c2);
  scene.add(g); solid(x-0.55, z-0.55, x+0.55, z+0.55);
}
function lamp(x,z){
  var pole=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.09,3.1,6), new THREE.MeshStandardMaterial({color:0x5a4632}));
  pole.position.set(x,1.55,z); pole.castShadow=true; scene.add(pole);
  var bulb=new THREE.Mesh(new THREE.SphereGeometry(0.24,10,8), new THREE.MeshStandardMaterial({color:0xffe9a8, emissive:0xffca55, emissiveIntensity:.7}));
  bulb.position.set(x,3.2,z); scene.add(bulb);
  solid(x-0.2, z-0.2, x+0.2, z+0.2);
}
function beacon(x, z, emo){
  var grp=new THREE.Group(); grp.position.set(x, 0, z);
  var ring=new THREE.Mesh(new THREE.RingGeometry(1.05, 1.45, 36), new THREE.MeshBasicMaterial({color:0xf2b33d, transparent:true, opacity:.9, side:THREE.DoubleSide}));
  ring.rotation.x=-Math.PI/2; ring.position.y=0.06; grp.add(ring);
  var icon=makeIcon(emo, 2.1); icon.position.y=2.6; grp.add(icon);
  scene.add(grp);
  return {grp:grp, ring:ring, icon:icon, x:x, z:z};
}
