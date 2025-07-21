document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const errorMsg = document.getElementById('error-msg');

  // If already logged in, redirect to dashboard
  if (localStorage.getItem('loggedIn') === 'true') {
    window.location.href = 'dashboard.html';
    return;
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password) {
      errorMsg.textContent = "Please enter both email and password.";
      return;
    }

    // Google Apps Script Web App URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxIkJL8tNlrZKL2jS2zcfDL3_-XssqRGYWeZvWgbqPTK_pG2FOUSKNYAw-cpgugihdC/exec';

    fetch(`${scriptURL}?sheet=Admin-Login&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem('loggedIn', 'true');
          localStorage.setItem('userEmail', email);
          window.location.href = 'dashboard.html';
        } else {
          errorMsg.textContent = "Invalid email or password.";
        }
      })
      .catch(err => {
        console.error('Error:', err);
        errorMsg.textContent = "An error occurred. Please try again.";
      });
  });
});
