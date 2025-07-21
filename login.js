document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const loginBtn = document.getElementById("loginBtn");
  const loginStatus = document.getElementById("login-status");
  const loadingSpinner = document.getElementById("loadingSpinner");

  loginBtn.disabled = true;
  loginBtn.textContent = "Logging in...";
  loadingSpinner.classList.remove("hidden");
  loginStatus.textContent = "";

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch("https://script.google.com/macros/s/AKfycbxIkJL8tNlrZKL2jS2zcfDL3_-XssqRGYWeZvWgbqPTK_pG2FOUSKNYAw-cpgugihdC/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
    .then((data) => {
      loginBtn.disabled = false;
      loginBtn.textContent = "Login";
      loadingSpinner.classList.add("hidden");
      if (data.status === "success") {
        sessionStorage.setItem("loggedIn", true);
        sessionStorage.setItem("email", email);
        window.location.href = "dashboard.html";
      } else {
        loginStatus.textContent = data.message || "Invalid credentials. Please try again.";
      }
    })
    .catch((err) => {
      loginBtn.disabled = false;
      loginBtn.textContent = "Login";
      loadingSpinner.classList.add("hidden");
      loginStatus.textContent = "An error occurred. Please check your network or try again later. Error: " + err.message;
      console.error("Error:", err);
    });
});
