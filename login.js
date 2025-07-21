// login.js
function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorElem = document.getElementById("error");

  if (!email || !password) {
    errorElem.textContent = "Please enter both email and password.";
    return;
  }

  fetch("YOUR_WEB_APP_URL", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    contentType: "application/json"
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        window.location.href = "dashboard.html";
      } else {
        errorElem.textContent = data.message;
      }
    })
    .catch(err => {
      errorElem.textContent = "Network error. Try again.";
      console.error("Login error:", err);
    });
}
