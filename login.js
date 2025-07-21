window.addEventListener('DOMContentLoaded', () => {
  const intro = document.getElementById('intro');
  const loginContainer = document.getElementById('login-container');

  setTimeout(() => {
    intro.classList.add('hidden');
    loginContainer.classList.remove('hidden');
    VANTA.NET({
      el: "#vanta-bg",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0x00d4ff,
      backgroundColor: 0x0a0a23
    });
  }, 3000);

  const loginForm = document.getElementById('login-form');
  const errorMsg = document.getElementById('error-msg');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    const allowedUsers = [
      { email: "balouchp3@gmail.com", password: "Admin1234" },
      { email: "villagerr8415k@gmail.com", password: "Admin1234" }
    ];

    const isValid = allowedUsers.some(user => user.email === email && user.password === password);

    if (isValid) {
      sessionStorage.setItem('loggedIn', true);
      window.location.href = 'dashboard.html';
    } else {
      errorMsg.textContent = "Invalid email or password.";
    }
  });
});
