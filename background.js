// background_three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), antialias:true });
renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(innerWidth, innerHeight);
camera.position.z = 50;

// Simple Stars field
function createStar() {
  const geo = new THREE.SphereGeometry(0.3,16,16);
  const mat = new THREE.MeshBasicMaterial({ color:0xffffff });
  const star = new THREE.Mesh(geo, mat);
  star.position.set((Math.random()-0.5)*200, (Math.random()-0.5)*200, (Math.random()-0.5)*200);
  scene.add(star);
}
Array(600).fill().forEach(createStar);

// Rotating orb (Earth-like)
const sphereGeo = new THREE.SphereGeometry(8,32,32);
const sphereMat = new THREE.MeshPhongMaterial({ color:0x2266ff, emissive:0x112244 });
const earth = new THREE.Mesh(sphereGeo, sphereMat);
scene.add(earth);

// Lighting
const light = new THREE.PointLight(0xffffff,1);
light.position.set(20,20,20);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

function animate() {
  requestAnimationFrame(animate);
  earth.rotation.y += 0.002;
  scene.rotation.y += 0.0005;
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
