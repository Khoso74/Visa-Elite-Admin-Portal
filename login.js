let retryCount = 0;
const maxRetries = 3;
const baseUrl = 'https://script.google.com/macros/s/AKfycbxIkJL8tNlrZKL2jS2zcfDL3_-XssqRGYWeZvWgbqPTK_pG2FOUSKNYAw-cpgugihdC/exec'; // Update if new

function attemptLogin(email, password, loginBtn, loginStatus, loadingSpinner) {
  console.log('Attempting login with email:', email, 'and password length:', password.length);
  fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
    .then(res => {
      console.log('Server response status:', res.status, 'OK:', res.ok);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log('Server response data:', data);
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
      console.error('Login error details:', err.name, err.message, err.stack);
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
      }
    });
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) console.error('Login form not found');
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const loginBtn = document.getElementById('loginBtn');
    const loginStatus = document.getElementById('login-status');
    const loadingSpinner = document.getElementById('loadingSpinner');
    if (!loginBtn || !loginStatus || !loadingSpinner) {
      console.error('Required elements missing:', { loginBtn, loginStatus, loadingSpinner });
      return;
    }

    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in...';
    loadingSpinner.classList.remove('hidden');
    loginStatus.textContent = '';
    loginStatus.classList.remove('error-popup');

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (!email || !password) {
      loginStatus.textContent = 'Please fill all fields.';
      loginStatus.classList.add('error-popup');
      loginBtn.disabled = false;
      loginBtn.textContent = 'Login';
      loadingSpinner.classList.add('hidden');
      return;
    }

    retryCount = 0;
    attemptLogin(email, password, loginBtn, loginStatus, loadingSpinner);
  });
});
