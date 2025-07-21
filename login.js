function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!email || !password) {
    alert('Please enter both email and password');
    return;
  }

  // Dummy check
  if (email === "admin@example.com" && password === "123456") {
    window.location.href = "dashboard.html"; // Replace with your page
  } else {
    alert("Invalid credentials");
  }
}
