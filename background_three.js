const scene = new THREE.Scene();
const loginContainer = document.querySelector('.login-container');
const { width, height } = loginContainer.getBoundingClientRect();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#login-bg'), alpha: true });
renderer.setSize(width, height);

// Lighting
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Sun
const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
const sunTexture = new THREE.TextureLoader().load(
  'https://images-assets.nasa.gov/image/PIA00129/PIA00129~thumb.jpg',
  undefined,
  undefined,
  () => { console.error('Failed to load sun texture'); }
);
const sunMaterial = new THREE.MeshStandardMaterial({ map: sunTexture || new THREE.Color(0xffff00) });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Earth
const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
const earthTexture = new THREE.TextureLoader().load(
  'https://images-assets.nasa.gov/image/PIA00122/PIA00122~thumb.jpg',
  undefined,
  undefined,
  () => { console.error('Failed to load earth texture'); }
);
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture || new THREE.Color(0x0000ff) });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.position.set(6, 0, 0);
scene.add(earth);

// Asteroids
for (let i = 0; i < 30; i++) {
  const asteroidGeometry = new THREE.SphereGeometry(Math.random() * 0.3 + 0.1, 8, 8);
  const asteroidMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.8 });
  const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
  asteroid.position.set(
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20
  );
  scene.add(asteroid);
}

// Stars
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.15 });
const starVertices = [];
for (let i = 0; i < 800; i++) {
  starVertices.push(
    (Math.random() - 0.5) * 60,
    (Math.random() - 0.5) * 60,
    (Math.random() - 0.5) * 60
  );
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Shooting Star
const shootingStarGeometry = new THREE.BufferGeometry();
const shootingStarMaterial = new THREE.PointsMaterial({ color: 0xffff00, size: 0.3 });
const shootingStarVertices = [0, 0, 0];
shootingStarGeometry.setAttribute('position', new THREE.Float32BufferAttribute(shootingStarVertices, 3));
const shootingStar = new THREE.Points(shootingStarGeometry, shootingStarMaterial);
scene.add(shootingStar);

camera.position.z = 12;

function animate() {
  requestAnimationFrame(animate);
  sun.rotation.y += 0.005;
  earth.rotation.y += 0.01;
  shootingStar.position.x += 0.15;
  shootingStar.position.y -= 0.08;
  if (shootingStar.position.x > 25) {
    shootingStar.position.x = -25;
    shootingStar.position.y = 15;
  }
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  const { width, height } = loginContainer.getBoundingClientRect();
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});
