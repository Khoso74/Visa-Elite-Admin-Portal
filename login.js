document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  fetch("https://script.google.com/macros/s/AKfycbxIkJL8tNlrZKL2jS2zcfDL3_-XssqRGYWeZvWgbqPTK_pG2FOUSKNYAw-cpgugihdC/exec", {
    method: "POST",
    body: new URLSearchParams({
      email: email,
      password: password,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        window.location.href = "dashboard.html";
      } else {
        alert("Login Failed. Invalid credentials.");
      }
    })
    .catch((err) => {
      console.error("Error:", err);
      alert("Something went wrong. Please try again later.");
    });
});
