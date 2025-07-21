async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const error = document.getElementById("login-error");

  error.textContent = "";

  if (!email || !password) {
    error.textContent = "Please fill in both fields.";
    return;
  }

  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbxIkJL8tNlrZKL2jS2zcfDL3_-XssqRGYWeZvWgbqPTK_pG2FOUSKNYAw-cpgugihdC/exec?action=login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" }
      }
    );

    const result = await response.json();

    if (result.success) {
      window.location.href = "dashboard.html";
    } else {
      error.textContent = "Login failed. Check credentials.";
    }
  } catch (err) {
    error.textContent = "Error connecting to server.";
  }
}
