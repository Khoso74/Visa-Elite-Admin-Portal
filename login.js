function loginUser() {
  const email = document.getElementById("email").value.trim();
  if (!email) return alert("Please enter your Gmail.");

  fetch("https://script.google.com/macros/s/AKfycbxIkJL8tNlrZKL2jS2zcfDL3_-XssqRGYWeZvWgbqPTK_pG2FOUSKNYAw-cpgugihdC/exec?email=" + email)
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        sessionStorage.setItem("admin", email);
        window.location.href = "index.html";
      } else {
        alert("Access denied. Contact Admin.");
      }
    });
}
```
