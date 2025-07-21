window.onload = () => {
  setTimeout(() => {
    document.getElementById('login-container').classList.remove('hidden');
  }, 3500); // After intro
};

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  const response = await fetch('https://script.google.com/macros/s/AKfycbxIkJL8tNlrZKL2jS2zcfDL3_-XssqRGYWeZvWgbqPTK_pG2FOUSKNYAw-cpgugihdC/exec', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: { 'Content-Type': 'application/json' }
  });

  const result = await response.json();

  if (result.success) {
    localStorage.setItem('user', JSON.stringify(result.user));
    window.location.href = 'dashboard.html';
  } else {
    alert('Invalid credentials');
  }
});
