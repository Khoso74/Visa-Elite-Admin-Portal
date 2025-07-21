// login.js
document.getElementById('loginBtn').addEventListener('click', () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const err = document.getElementById('error');
  err.textContent = '';

  if (!email || !password) {
    err.textContent = 'Please fill in both fields.';
    return;
  }

  fetch('YOUR_WEB_APP_URL', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  })
  .then(r => r.json())
  .then(data => {
    if (data.success) {
      sessionStorage.setItem('loggedIn', '1');
      window.location.href = 'dashboard.html';
    } else {
      err.textContent = data.message || 'Invalid credentials';
    }
  })
  .catch(e => {
    err.textContent = 'Error connecting. Try later.';
    console.error(e);
  });
});

// Redirect if already logged in
if (sessionStorage.getItem('loggedIn')) window.location.href = 'dashboard.html';
