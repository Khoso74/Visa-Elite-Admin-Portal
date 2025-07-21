document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('login-btn');
  const errorMsg = document.getElementById('error-msg');

  loginBtn.addEventListener('click', async () => {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
      errorMsg.textContent = "Email and Password required!";
      return;
    }

    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbxIkJL8tNlrZKL2jS2zcfDL3_-XssqRGYWeZvWgbqPTK_pG2FOUSKNYAw-cpgugihdC/exec', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();

      if (result.status === "success") {
        window.location.href = "dashboard.html";
      } else {
        errorMsg.textContent = result.message || "Login failed!";
      }
    } catch (err) {
      errorMsg.textContent = "Server error!";
      console.error(err);
    }
  });
});
