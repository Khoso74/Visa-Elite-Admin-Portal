const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
document.body.style.backgroundColor = '#1a1a2e';

camera.position.z = 5;

// Optimized Stars
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 });
const starVertices = new Float32Array(600); // Reduced from 800 to 200
for (let i = 0; i < 200; i++) {
  starVertices[i * 3] = (Math.random() - 0.5) * 50;
  starVertices[i * 3 + 1] = (Math.random() - 0.5) * 50;
  starVertices[i * 3 + 2] = (Math.random() - 0.5) * 50;
}
starGeometry.setAttribute('position', new THREE.BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Simple Planet
const planetGeometry = new THREE.SphereGeometry(0.8, 16, 16);
const planetMaterial = new THREE.MeshBasicMaterial({ color: 0x50e3c2 });
const planet = new THREE.Mesh(planetGeometry, planetMaterial);
planet.position.set(2.5, 0, 0);
scene.add(planet);

function animate() {
  requestAnimationFrame(animate);
  planet.rotation.y += 0.02;
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}, { passive: true });
