// Space Background using Three.js
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("space-background").appendChild(renderer.domElement);

// Create stars
let starGeometry = new THREE.BufferGeometry();
let starCount = 10000;
let positions = [];

for (let i = 0; i < starCount; i++) {
  let x = (Math.random() - 0.5) * 2000;
  let y = (Math.random() - 0.5) * 2000;
  let z = -Math.random() * 2000;
  positions.push(x, y, z);
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
let starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
let stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

camera.position.z = 1;

function animate() {
  requestAnimationFrame(animate);
  stars.rotation.x += 0.0005;
  stars.rotation.y += 0.0005;
  renderer.render(scene, camera);
}
animate();
