// SPACE BACKGROUND USING THREE.JS
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("login-bg").appendChild(renderer.domElement);

// Stars
function createStar() {
  const geometry = new THREE.SphereGeometry(0.1, 24, 24);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  star.position.x = (Math.random() - 0.5) * 100;
  star.position.y = (Math.random() - 0.5) * 100;
  star.position.z = (Math.random() - 0.5) * 100;

  scene.add(star);
}

for (let i = 0; i < 800; i++) createStar();

camera.position.z = 30;

function animate() {
  requestAnimationFrame(animate);
  scene.rotation.x += 0.0005;
  scene.rotation.y += 0.0005;
  renderer.render(scene, camera);
}
animate();
