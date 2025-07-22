// Three.js setup for 3D animation
const canvas = document.getElementById('background-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Lights
const ambientLight = new THREE.AmbientLight(0x404040, 2); // soft white light
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Sun (a large sphere with a glowing material)
const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffa500, emissive: 0xffa500, emissiveIntensity: 1 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Earth (a smaller sphere with a texture)
const earthGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const earthMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff }); // Placeholder, ideally use a texture
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.position.set(5, 0, 0);
scene.add(earth);

// Stars
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
const starVertices = [];
for (let i = 0; i < 1000; i++) {
    const x = (Math.random() - 0.5) * 200;
    const y = (Math.random() - 0.5) * 200;
    const z = (Math.random() - 0.5) * 200;
    starVertices.push(x, y, z);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Asteroids (simple small spheres)
const asteroidGeometry = new THREE.SphereGeometry(0.1, 8, 8);
const asteroidMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
const asteroids = [];
for (let i = 0; i < 50; i++) {
    const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
    asteroid.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
    );
    scene.add(asteroid);
    asteroids.push(asteroid);
}

// Shooting Stars (simple particles moving quickly)
const shootingStarParticles = [];
function createShootingStar() {
    const geometry = new THREE.SphereGeometry(0.05, 8, 8);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1 });
    const star = new THREE.Mesh(geometry, material);
    star.position.set(Math.random() * 20 - 10, 10, Math.random() * 20 - 10);
    star.velocity = new THREE.Vector3(Math.random() * -0.5, -Math.random() * 1, Math.random() * 0.5 - 0.25);
    scene.add(star);
    shootingStarParticles.push(star);
}
setInterval(createShootingStar, 2000); // Create a new shooting star every 2 seconds

camera.position.z = 10;

function animate() {
    requestAnimationFrame(animate);

    // Sun rotation
    sun.rotation.y += 0.002;

    // Earth orbit and rotation
    earth.rotation.y += 0.01;
    earth.position.x = Math.cos(Date.now() * 0.0005) * 5;
    earth.position.z = Math.sin(Date.now() * 0.0005) * 5;

    // Asteroid movement (simple random movement)
    asteroids.forEach(asteroid => {
        asteroid.rotation.x += 0.01;
        asteroid.rotation.y += 0.01;
        asteroid.position.x += (Math.random() - 0.5) * 0.01;
        asteroid.position.y += (Math.random() - 0.5) * 0.01;
        asteroid.position.z += (Math.random() - 0.5) * 0.01;
    });

    // Shooting star movement and removal
    shootingStarParticles.forEach((star, index) => {
        star.position.add(star.velocity);
        star.material.opacity -= 0.01; // Fade out
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

    // Replace with your deployed Google Apps Script Web App URL
    const gasUrl = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';

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
