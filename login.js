document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const loginBtn = document.getElementById("loginBtn");
  const loginStatus = document.getElementById("login-status");
  loginBtn.disabled = true;
  loginBtn.textContent = "Logging in...";
  loginStatus.textContent = "";

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch("https://script.google.com/macros/s/AKfycbxIkJL8tNlrZKL2jS2zcfDL3_-XssqRGYWeZvWgbqPTK_pG2FOUSKNYAw-cpgugihdC/exec", { // Replace with your deployed URL
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      email: email,
      password: password,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      loginBtn.disabled = false;
      loginBtn.textContent = "Login";
      if (data.status === "success") {
        sessionStorage.setItem("loggedIn", true);
        sessionStorage.setItem("email", email);
        window.location.href = "dashboard.html";
      } else {
        loginStatus.textContent = data.message || "Invalid credentials.";
      }
    })
    .catch((err) => {
      loginBtn.disabled = false;
      loginBtn.textContent = "Login";
      loginStatus.textContent = "Something went wrong. Please try again.";
      console.error("Error:", err);
    });
});
