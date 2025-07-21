async function handleLogin() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const error = document.getElementById('error');

  try {
    const response = await fetch(
      'https://opensheet.vercel.app/1FJn2u5QRh2fduij-nIn4gH6_uGzxnsa8Ou1y4SLA-SE/Admin-Login'
    );
    const data = await response.json();

    const matched = data.find(
      (entry) => entry.Email === email && entry.Password === password
    );

    if (matched) {
      window.location.href = 'dashboard.html';
    } else {
      error.textContent = 'Invalid credentials. Please try again.';
    }
  } catch (err) {
    console.error(err);
    error.textContent = 'Login failed. Try again later.';
  }
}
