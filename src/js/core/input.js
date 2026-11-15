"use strict";
var raycaster, groundPlane;
function pointerGround(e){
  var nx=(e.clientX/innerWidth)*2-1, ny=-(e.clientY/innerHeight)*2+1;
  raycaster.setFromCamera({x:nx, y:ny}, camera);
  var out=new THREE.Vector3();
  return raycaster.ray.intersectPlane(groundPlane, out) ? out : null;
}
function bindInput(){
  var el=renderer.domElement;
  raycaster=new THREE.Raycaster(); groundPlane=new THREE.Plane(new THREE.Vector3(0,1,0), 0);
  el.style.touchAction='none';
  el.addEventListener('pointerdown', function(e){
    if(e.cancelable) e.preventDefault();
    if(mode!=='play') return;
    if(e.clientX<innerWidth/2){
      joy.on=true; joy.id=e.pointerId; joy.bx=e.clientX; joy.by=e.clientY; joy.dx=0; joy.dy=0; target=null; targetRing.visible=false;
      var j=document.getElementById('joy'), n=document.getElementById('nub');
      j.style.display='block'; j.style.left=(joy.bx-58)+'px'; j.style.top=(joy.by-58)+'px';
      n.style.display='block'; n.style.left=(joy.bx-26)+'px'; n.style.top=(joy.by-26)+'px';
    } else {
      var p=pointerGround(e);
      if(p){ target={x:p.x, z:p.z}; stallT=0; targetRing.visible=true; targetRing.position.set(p.x, 0.05, p.z); }
    }
  });
  window.addEventListener('pointermove', function(e){
    if(!joy.on || e.pointerId!==joy.id) return;
    var dx=e.clientX-joy.bx, dy=e.clientY-joy.by, d=Math.hypot(dx,dy), max=52;
    if(d>max){ dx=dx/d*max; dy=dy/d*max; }
    joy.dx=dx/max; joy.dy=dy/max;
    var n=document.getElementById('nub');
    n.style.left=(joy.bx+dx-26)+'px'; n.style.top=(joy.by+dy-26)+'px';
  });
  function end(e){ if(joy.on && e.pointerId===joy.id){ joy.on=false; joy.dx=0; joy.dy=0;
    document.getElementById('joy').style.display='none'; document.getElementById('nub').style.display='none'; } }
  window.addEventListener('pointerup', end); window.addEventListener('pointercancel', end);
  document.addEventListener('keydown', function(e){ keys[e.key.toLowerCase()]=true; });
  document.addEventListener('keyup', function(e){ keys[e.key.toLowerCase()]=false; });
  window.addEventListener('resize', function(){
    camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
}
