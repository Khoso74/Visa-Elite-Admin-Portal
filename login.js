let retryCount = 0;
const maxRetries = 3;

function attemptLogin(email, password, loginBtn, loginStatus, loadingSpinner) {
  console.log("Attempting fetch to: https://visa-elite-admin-portal-pykl0uwg3-khoso74s-projects.vercel.app/api/proxy");
  fetch("https://visa-elite-admin-portal-pykl0uwg3-khoso74s-projects.vercel.app/api/proxy", {
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
      console.log("Fetch response status:", res.status);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      console.log("Response data:", data);
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
      console.error("Fetch error:", err);
      retryCount++;
      if (retryCount < maxRetries) {
        console.log(`Retry ${retryCount} of ${maxRetries}... Error: ${err.message}`);
        setTimeout(() => attemptLogin(email, password, loginBtn, loginStatus, loadingSpinner), 1000);
      } else {
        loginBtn.disabled = false;
        loginBtn.textContent = "Login";
        loadingSpinner.classList.add("hidden");
        loginStatus.textContent = `An error occurred. Please check your network or try again later. Error: ${err.message}`;
        console.error("Final Error:", err);
      }
    });
}

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

  retryCount = 0;
  attemptLogin(email, password, loginBtn, loginStatus, loadingSpinner);
});
