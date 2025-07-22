// Three.js setup for 3D animation
const canvas = document.getElementById('background-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Lights - Keep them subtle for a dark space theme
const ambientLight = new THREE.AmbientLight(0x404040, 0.3); // Softer ambient light
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1, 150); // Main light for planets, brighter
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Sun (a large sphere with a glowing material)
const sunGeometry = new THREE.SphereGeometry(2.8, 32, 32); // Slightly larger
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffa500, emissive: 0xffa500, emissiveIntensity: 1.8 }); // Even brighter emissive
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Earth (a smaller sphere with a texture if available, or just a color)
// Optional: Load an Earth texture for better realism
// const textureLoader = new THREE.TextureLoader();
// const earthTexture = textureLoader.load('path/to/earth_texture.jpg'); // Replace with actual path if you have one
const earthGeometry = new THREE.SphereGeometry(0.7, 32, 32); // Slightly larger
const earthMaterial = new THREE.MeshPhongMaterial({ color: 0x0066ff /*, map: earthTexture */, emissive: 0x0033aa, emissiveIntensity: 0.3 }); // Added subtle glow
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.position.set(7, 0, 0); // Further from sun
scene.add(earth);

// Moon (a small sphere orbiting Earth)
const moonGeometry = new THREE.SphereGeometry(0.2, 16, 16);
const moonMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
earth.add(moon); // Add moon as child of earth for orbiting

// Stars (more stars, spread out, with a subtle twinkle effect)
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({ color: 0xeeeeee, size: 0.1, transparent: true, opacity: 0.9 }); // Brighter, slightly larger
const starVertices = [];
for (let i = 0; i < 3000; i++) { // More stars for a dense field
    const x = (Math.random() - 0.5) * 500; // Wider spread
    const y = (Math.random() - 0.5) * 500;
    const z = (Math.random() - 0.5) * 500;
    starVertices.push(x, y, z);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Asteroids (simple small spheres, more varied sizes and colors, subtle rotation)
const asteroidMaterials = [
    new THREE.MeshStandardMaterial({ color: 0x888888, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: 0x666666, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: 0xaaaaaa, flatShading: true })
];
const asteroids = [];
for (let i = 0; i < 150; i++) { // More asteroids
    const size = Math.random() * 0.3 + 0.08; // Varied sizes
    const asteroidGeometry = new THREE.SphereGeometry(size, 8, 8); // Low poly
    const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterials[Math.floor(Math.random() * asteroidMaterials.length)]);
    asteroid.position.set(
        (Math.random() - 0.5) * 50, // Wider distribution
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50
    );
    scene.add(asteroid);
    asteroids.push(asteroid);
}

// Shooting Stars (simple particles moving quickly, brighter, faster)
const shootingStarParticles = [];
function createShootingStar() {
    const geometry = new THREE.SphereGeometry(0.1, 8, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 2.5 }); // Neon color, brighter
    const star = new THREE.Mesh(geometry, material);
    star.position.set(Math.random() * 40 - 20, 20, Math.random() * 40 - 20); // Start higher
    star.velocity = new THREE.Vector3((Math.random() - 0.5) * 1, -Math.random() * 2.5, (Math.random() - 0.5) * 1); // Faster
    star.originalOpacity = 1;
    star.material.opacity = 1;
    scene.add(star);
    shootingStarParticles.push(star);
}
setInterval(createShootingStar, 1000); // More frequent

camera.position.z = 18; // Pull camera back a bit for wider view

function animate() {
    requestAnimationFrame(animate);

    // Sun rotation
    sun.rotation.y += 0.001;

    // Earth orbit and rotation
    earth.rotation.y += 0.015;
    earth.position.x = Math.cos(Date.now() * 0.0003) * 7; // Slower, wider orbit
    earth.position.z = Math.sin(Date.now() * 0.0003) * 7;

    // Moon orbit around Earth
    moon.position.x = Math.cos(Date.now() * 0.001) * 1.5;
    moon.position.z = Math.sin(Date.now() * 0.001) * 1.5;
    moon.rotation.y += 0.02;

    // Asteroid movement (slight rotation and gentle drift)
    asteroids.forEach(asteroid => {
        asteroid.rotation.x += Math.random() * 0.01;
        asteroid.rotation.y += Math.random() * 0.01;
        asteroid.position.x += (Math.random() - 0.5) * 0.01;
        asteroid.position.y += (Math.random() - 0.5) * 0.01;
        asteroid.position.z += (Math.random() - 0.5) * 0.01;

        // Loop asteroids
        if (asteroid.position.length() > 60) {
             asteroid.position.set(
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 50
            );
        }
    });

    // Shooting star movement and removal
    shootingStarParticles.forEach((star, index) => {
        star.position.add(star.velocity);
        star.material.opacity -= 0.02; // Faster fade out
        if (star.material.opacity <= 0 || star.position.y < -20) { // Also remove if too low
            scene.remove(star);
            shootingStarParticles.splice(index, 1);
        }
    });

    // Subtle camera movement for more dynamic feel
    camera.position.x = Math.sin(Date.now() * 0.00005) * 0.5;
    camera.position.y = Math.cos(Date.now() * 0.00005) * 0.5;
    camera.lookAt(scene.position); // Always look at the center

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
