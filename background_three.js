(function() {
  console.log('Initializing background animation');
  let scene, camera, renderer, stars, planet;

  try {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    if (!renderer) throw new Error('WebGLRenderer initialization failed');
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    document.body.style.backgroundColor = '#1a1a2e';

    camera.position.z = 5;

    // Stars
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 });
    const starVertices = new Float32Array(600);
    for (let i = 0; i < 200; i++) {
      starVertices[i * 3] = (Math.random() - 0.5) * 50;
      starVertices[i * 3 + 1] = (Math.random() - 0.5) * 50;
      starVertices[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starVertices, 3));
    stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Planet
    const planetGeometry = new THREE.SphereGeometry(0.8, 16, 16);
    const planetMaterial = new THREE.MeshBasicMaterial({ color: 0x50e3c2 });
    planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.position.set(2.5, 0, 0);
    scene.add(planet);

    function animate() {
      requestAnimationFrame(animate);
      if (planet) planet.rotation.y += 0.02;
      if (renderer) renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      console.log('Resizing canvas');
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, { passive: true });
  } catch (error) {
    console.error('Background Error:', error.message, error.stack);
    document.body.style.backgroundColor = '#1a1a2e'; // Fallback solid color
  }
})();
