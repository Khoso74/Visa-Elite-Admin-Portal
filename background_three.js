const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BufferGeometry();
const vertices = [];

for (let i = 0; i < 10000; i++) {
  const x = 2000 * Math.random() - 1000;
  const y = 2000 * Math.random() - 1000;
  const z = 2000 * Math.random() - 1000;
  vertices.push(x, y, z);
}

geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
const material = new THREE.PointsMaterial({ color: 0x00ffe5, size: 2 });
const particles = new THREE.Points(geometry, material);
scene.add(particles);

camera.position.z = 500;

function animate() {
  requestAnimationFrame(animate);
  particles.rotation.x += 0.0005;
  particles.rotation.y += 0.001;
  renderer.render(scene, camera);
}
animate();
