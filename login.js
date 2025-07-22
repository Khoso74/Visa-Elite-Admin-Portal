let retryCount = 0;
const maxRetries = 3;
const baseUrl = 'https://script.google.com/macros/s/AKfycbxIkJL8tNlrZKL2jS2zcfDL3_-XssqRGYWeZvWgbqPTK_pG2FOUSKNYAw-cpgugihdC/exec'; // Update if new
const proxyUrl = 'https://cors-anywhere.herokuapp.com/' + baseUrl; // Fallback for CORS

function attemptLogin(email, password, loginBtn, loginStatus, loadingSpinner) {
  console.group('Login Attempt');
  console.log('Email:', email, 'Password Length:', password.length);
  const urlToUse = baseUrl; // Try direct first, fallback to proxy if needed
  console.log('Using URL:', urlToUse);

  fetch(urlToUse, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
    .then(res => {
      console.log('Response Status:', res.status, 'OK:', res.ok);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log('Response Data:', data);
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
      console.error('Error Details:', err.name, err.message, err.stack);
      retryCount++;
      if (retryCount < maxRetries) {
        console.log(`Retry ${retryCount} of ${maxRetries}... Error: ${err.message}`);
        setTimeout(() => attemptLogin(email, password, loginBtn, loginStatus, loadingSpinner), 1000);
      } else {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Login';
        loadingSpinner.classList.add('hidden');
        loginStatus.textContent = `Failed to connect. Error: ${err.message}. Trying proxy...`;
        loginStatus.classList.add('error-popup');
        // Fallback to proxy after retries
        if (urlToUse === baseUrl) {
          console.log('Switching to proxy URL:', proxyUrl);
          attemptLoginWithProxy(email, password, loginBtn, loginStatus, loadingSpinner);
        } else {
          loginStatus.textContent = `Connection failed. Please check network. Error: ${err.message}`;
        }
      }
    });
  console.groupEnd();
}

function attemptLoginWithProxy(email, password, loginBtn, loginStatus, loadingSpinner) {
  console.group('Proxy Login Attempt');
  console.log('Using Proxy URL:', proxyUrl);
  fetch(proxyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
    .then(res => {
      console.log('Proxy Response Status:', res.status, 'OK:', res.ok);
      if (!res.ok) throw new Error(`Proxy error! Status: ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log('Proxy Response Data:', data);
      loginBtn.disabled = false;
      loginBtn.textContent = 'Login';
      loadingSpinner.classList.add('hidden');
      if (data.status === 'success') {
        sessionStorage.setItem('loggedIn', true);
        sessionStorage.setItem('email', email);
        window.location.href = 'dashboard.html';
      } else {
        loginStatus.textContent = data.message || 'Invalid credentials via proxy.';
        loginStatus.classList.add('error-popup');
      }
    })
    .catch(err => {
      console.error('Proxy Error Details:', err.name, err.message, err.stack);
      loginBtn.disabled = false;
      loginBtn.textContent = 'Login';
      loadingSpinner.classList.add('hidden');
      loginStatus.textContent = `Proxy failed. Error: ${err.message}. Contact support.`;
      loginStatus.classList.add('error-popup');
    });
  console.groupEnd();
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM Loaded, initializing login form');
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) console.error('Login form element not found');
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

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
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
