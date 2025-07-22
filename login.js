// Three.js setup for 3D animation
const canvas = document.getElementById('background-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Lights - Keep them subtle for a dark space theme
const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // Softer ambient light
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 0.8, 100); // Main light for planets
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Sun (a large sphere with a glowing material)
const sunGeometry = new THREE.SphereGeometry(2.5, 32, 32); // Slightly larger
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffa500, emissive: 0xffa500, emissiveIntensity: 1.5 }); // Brighter emissive
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Earth (a smaller sphere with a texture)
// Optional: Load an Earth texture for better realism
// const textureLoader = new THREE.TextureLoader();
// const earthTexture = textureLoader.load('path/to/earth_texture.jpg'); // Replace with actual path if you have one
const earthGeometry = new THREE.SphereGeometry(0.6, 32, 32); // Slightly larger
const earthMaterial = new THREE.MeshPhongMaterial({ color: 0x0066ff /*, map: earthTexture */ });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.position.set(6, 0, 0); // Further from sun
scene.add(earth);

// Stars
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({ color: 0xeeeeee, size: 0.08, transparent: true, opacity: 0.9 }); // Brighter, slightly transparent
const starVertices = [];
for (let i = 0; i < 2000; i++) { // More stars
    const x = (Math.random() - 0.5) * 400; // Wider spread
    const y = (Math.random() - 0.5) * 400;
    const z = (Math.random() - 0.5) * 400;
    starVertices.push(x, y, z);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Asteroids (simple small spheres, more varied sizes and colors)
const asteroidMaterials = [
    new THREE.MeshStandardMaterial({ color: 0x888888 }),
    new THREE.MeshStandardMaterial({ color: 0x666666 }),
    new THREE.MeshStandardMaterial({ color: 0xaaaaaa })
];
const asteroids = [];
for (let i = 0; i < 100; i++) { // More asteroids
    const size = Math.random() * 0.2 + 0.05; // Varied sizes
    const asteroidGeometry = new THREE.SphereGeometry(size, 8, 8);
    const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterials[Math.floor(Math.random() * asteroidMaterials.length)]);
    asteroid.position.set(
        (Math.random() - 0.5) * 40, // Wider distribution
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40
    );
    scene.add(asteroid);
    asteroids.push(asteroid);
}

// Shooting Stars (simple particles moving quickly, brighter, faster)
const shootingStarParticles = [];
function createShootingStar() {
    const geometry = new THREE.SphereGeometry(0.1, 8, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2 }); // Neon color, brighter
    const star = new THREE.Mesh(geometry, material);
    star.position.set(Math.random() * 30 - 15, 15, Math.random() * 30 - 15); // Start higher
    star.velocity = new THREE.Vector3((Math.random() - 0.5) * 0.8, -Math.random() * 2, (Math.random() - 0.5) * 0.8); // Faster
    star.originalOpacity = 1;
    star.material.opacity = 1;
    scene.add(star);
    shootingStarParticles.push(star);
}
setInterval(createShootingStar, 1500); // More frequent

camera.position.z = 15; // Pull camera back a bit for wider view

function animate() {
    requestAnimationFrame(animate);

    // Sun rotation
    sun.rotation.y += 0.001; // Slower rotation

    // Earth orbit and rotation
    earth.rotation.y += 0.015;
    earth.position.x = Math.cos(Date.now() * 0.0003) * 6; // Slower, wider orbit
    earth.position.z = Math.sin(Date.now() * 0.0003) * 6;

    // Asteroid movement (slight rotation and gentle drift)
    asteroids.forEach(asteroid => {
        asteroid.rotation.x += 0.005;
        asteroid.rotation.y += 0.005;
        asteroid.position.x += (Math.random() - 0.5) * 0.005;
        asteroid.position.y += (Math.random() - 0.5) * 0.005;
        asteroid.position.z += (Math.random() - 0.5) * 0.005;
    });

    // Shooting star movement and removal
    shootingStarParticles.forEach((star, index) => {
        star.position.add(star.velocity);
        star.material.opacity -= 0.02; // Faster fade out
        if (star.material.opacity <= 0) {
            scene.remove(star);
            shootingStarParticles.splice(index, 1);
        }
    });

    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


// Login form handling
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    // !!! IMPORTANT: Replace with your deployed Google Apps Script Web App URL !!!
    const gasUrl = 'https://script.google.com/macros/s/AKfycbxIkJL8tNlrZKL2jS2zcfDL3_-XssqRGYWeZvWgbqPTK_pG2FOUSKNYAw-cpgugihdC/exec';

    try {
        const response = await fetch(gasUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ email, password }).toString()
        });

        const result = await response.json();

        if (result.success) {
            // Store a simple session indicator or token (for demonstration)
            localStorage.setItem('loggedIn', 'true');
            window.location.href = 'dashboard.html';
        } else {
            errorMessage.textContent = result.message;
        }
    } catch (error) {
        console.error('Login error:', error);
        errorMessage.textContent = 'An error occurred during login. Please try again.';
    }
});
