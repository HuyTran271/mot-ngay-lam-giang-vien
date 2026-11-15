"use strict";
// Model 3D thật (Kenney Nature Kit, CC0), dữ liệu .glb được build.py nhúng vào biến MODEL_DATA.
// Nếu model lỗi/không có, game tự dùng hình khối hộp dự phòng, không bao giờ vỡ game.
var MODELS={};
function loadModels(){
  return new Promise(function(resolve){
    if(typeof MODEL_DATA==='undefined' || !window.GLTFLoader){ resolve(false); return; }
    var loader=new GLTFLoader();
    var names=Object.keys(MODEL_DATA), left=names.length, done=false;
    if(!left){ resolve(false); return; }
    function fin(){ left--; if(left<=0 && !done){ done=true; resolve(true); } }
    setTimeout(function(){ if(!done){ done=true; resolve(true); } }, 5000);
    names.forEach(function(n){
      try{ loader.load(MODEL_DATA[n], function(g){ MODELS[n]=g.scene; fin(); }, undefined, function(){ fin(); }); }
      catch(e){ fin(); }
    });
  });
}
function placeModel(name, x, z, targetH, rotY){
  var t=MODELS[name]; if(!t) return null;
  var m=t.clone();
  var bb=new THREE.Box3().setFromObject(m);
  var h=(bb.max.y-bb.min.y)||1, s=targetH/h;
  m.scale.setScalar(s);
  m.position.set(x, -bb.min.y*s, z);
  m.rotation.y=rotY||0;
  m.traverse(function(o){ if(o.isMesh) o.castShadow=true; });
  scene.add(m);
  return m;
}
