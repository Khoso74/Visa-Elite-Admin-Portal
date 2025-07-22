// Basic login check - will be replaced by API call
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // !!! IMPORTANT: Replace with your deployed Google Apps Script Web App URL !!!
            const gasUrl = 'https://script.google.com/macros/s/AKfycbxIkJL8tNlrZKL2jS2zcfDL3_-XssqRGYWeZvWgbqPTK_pG2FOUSKNYAw-cpgugihdC/exec'; // This GAS URL handles doPost for login

            try {
                const response = await fetch(gasUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        action: 'login',
                        email: email,
                        password: password
                    })
                });

                const result = await response.json();

                if (result.success) {
                    localStorage.setItem('loggedIn', 'true'); // Store login state
                    window.location.href = 'dashboard.html'; // Redirect to dashboard
                } else {
                    alert('Login failed: ' + result.message);
                }
            } catch (error) {
                console.error('Error during login:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }
});


// Three.js Background Animation for Login Page
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('threejs-background').appendChild(renderer.domElement);

camera.position.z = 5;

// Create stars
const starGeometry = new THREE.SphereGeometry(0.05, 24, 24);
const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const stars = [];

for (let i = 0; i < 500; i++) {
    const star = new THREE.Mesh(starGeometry, starMaterial);
    star.position.x = (Math.random() - 0.5) * 100;
    star.position.y = (Math.random() - 0.5) * 100;
    star.position.z = (Math.random() - 0.5) * 100;
    scene.add(star);
    stars.push(star);
}

// Create shooting stars
const shootingStars = [];
const shootingStarGeometry = new THREE.CylinderGeometry(0.01, 0.01, 2, 8); // Thin cylinder
// --- FIX: Removed emissive properties not supported by MeshBasicMaterial ---
const shootingStarMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff }); // Bright cyan color
// --- END FIX ---

function createShootingStar() {
    const shootingStar = new THREE.Mesh(shootingStarGeometry, shootingStarMaterial);
    shootingStar.position.x = (Math.random() - 0.5) * 100;
    shootingStar.position.y = 50; // Start high up
    shootingStar.position.z = (Math.random() - 0.5) * 100;
    shootingStar.rotation.z = Math.PI / 4; // Angle it diagonally
    scene.add(shootingStar);
    shootingStars.push({ mesh: shootingStar, speed: 0.5 + Math.random() * 0.5 });
}

// Initial shooting stars
for (let i = 0; i < 5; i++) {
    createShootingStar();
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate stars
    stars.forEach(star => {
        star.rotation.x += 0.001;
        star.rotation.y += 0.001;
    });

    // Animate shooting stars
    shootingStars.forEach((star, index) => {
        star.mesh.position.y -= star.speed;
        star.mesh.position.x += star.speed * 0.5; // Move diagonally

        if (star.mesh.position.y < -50 || star.mesh.position.x > 50) {
            // Remove and recreate when it goes off screen
            scene.remove(star.mesh);
            shootingStars.splice(index, 1);
            createShootingStar();
        }
    });

    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
