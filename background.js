window.addEventListener('DOMContentLoaded', () => {
  VANTA.NET({
    el: "#vanta-bg",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.0,
    scaleMobile: 1.0,
    color: 0x00ffff,
    backgroundColor: 0x0a0a0a
  });

  // Delay Login Container
  setTimeout(() => {
    document.getElementById("login-box").classList.remove("hidden");
  }, 3500);
});

