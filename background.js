// Create space-style background using Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("bg-canvas").appendChild(renderer.domElement);

// Stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}

Array(300).fill().forEach(addStar);

camera.position.z = 30;

function animate() {
  requestAnimationFrame(animate);
  scene.rotation.y += 0.0005;
  scene.rotation.x += 0.0002;
  renderer.render(scene, camera);
}
animate();
