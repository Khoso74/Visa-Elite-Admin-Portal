document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const loginBtn = document.getElementById("loginBtn");
  const loginStatus = document.getElementById("login-status");
  loginBtn.disabled = true;
  loginBtn.textContent = "Logging in...";
  loginStatus.textContent = "";

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  async function attemptLogin(attempts = 3) {
    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbxIkJL8tNlrZKL2jS2zcfDL3_-XssqRGYWeZvWgbqPTK_pG2FOUSKNYAw-cpgugihdC/exec", {
        method: "POST",
        body: new URLSearchParams({ email, password }),
      });
      const data = await response.json();
      loginBtn.disabled = false;
      loginBtn.textContent = "Login";
      if (data.status === "success") {
        sessionStorage.setItem("loggedIn", true);
        sessionStorage.setItem("email", email);
        window.location.href = "dashboard.html";
      } else {
        loginStatus.textContent = "Invalid credentials. Please try again.";
      }
    } catch (err) {
      if (attempts > 1) {
        console.warn(`Retrying login... Attempts left: ${attempts - 1}`);
        setTimeout(() => attemptLogin(attempts - 1), 1000);
      } else {
        loginBtn.disabled = false;
        loginBtn.textContent = "Login";
        loginStatus.textContent = "Failed to connect to server. Please try again later.";
        console.error("Login error:", err);
      }
    }
  }
  attemptLogin();
});
