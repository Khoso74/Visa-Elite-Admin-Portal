window.onload = function () {
  setTimeout(() => {
    document.getElementById("intro").style.display = "none";
    document.querySelector(".login-container").style.display = "flex";
  }, 3000); // 3s delay for fade-in intro
};

function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorBox = document.getElementById("error-msg");

  fetch('https://script.google.com/macros/s/AKfycbxIkJL8tNlrZKL2jS2zcfDL3_-XssqRGYWeZvWgbqPTK_pG2FOUSKNYAw-cpgugihdC/exec')
    .then(res => res.json())
    .then(data => {
      const match = data.find(user => user.email === email && user.password === password);
      if (match) {
        window.location.href = "dashboard.html"; // Load dashboard
      } else {
        errorBox.textContent = "Invalid Email or Password.";
      }
    })
    .catch(() => {
      errorBox.textContent = "Login failed. Try again.";
    });
}
