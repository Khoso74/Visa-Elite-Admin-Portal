let retryCount = 0;
const maxRetries = 3;

function attemptLogin(email, password, loginBtn, loginStatus, loadingSpinner) {
  console.log("Attempting login with email:", email, "and password length:", password.length);
  fetch('https://script.google.com/macros/s/AKfycbxIkJL8tNlrZKL2jS2zcfDL3_-XssqRGYWeZvWgbqPTK_pG2FOUSKNYAw-cpgugihdC/exec', { // Direct URL
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
    .then(res => {
      console.log("Server response status:", res.status);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log("Server response data:", data);
      loginBtn.disabled = false;
      loginBtn.textContent = 'Login';
      loadingSpinner.classList.add('hidden');
      if (data.status === 'success') {
        sessionStorage.setItem('loggedIn', true);
        sessionStorage.setItem('email', email);
        window.location.href = 'dashboard.html';
      } else {
        loginStatus.textContent = data.message || 'Invalid credentials. Please try again.';
        loginStatus.classList.add('error-popup');
      }
    })
    .catch(err => {
      console.error("Login error:", err);
      retryCount++;
      if (retryCount < maxRetries) {
        console.log(`Retry ${retryCount} of ${maxRetries}... Error: ${err.message}`);
        setTimeout(() => attemptLogin(email, password, loginBtn, loginStatus, loadingSpinner), 1000);
      } else {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Login';
        loadingSpinner.classList.add('hidden');
        loginStatus.textContent = `An error occurred. Please try again later. Error: ${err.message}`;
        loginStatus.classList.add('error-popup');
        console.error("Final error:", err);
      }
    });
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const loginBtn = document.getElementById('loginBtn');
  const loginStatus = document.getElementById('login-status');
  const loadingSpinner = document.getElementById('loadingSpinner');

  loginBtn.disabled = true;
  loginBtn.textContent = 'Logging in...';
  loadingSpinner.classList.remove('hidden');
  loginStatus.textContent = '';
  loginStatus.classList.remove('error-popup');

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  retryCount = 0;
  attemptLogin(email, password, loginBtn, loginStatus, loadingSpinner);
});
