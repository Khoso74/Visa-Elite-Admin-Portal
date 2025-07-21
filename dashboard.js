if (!sessionStorage.getItem("admin")) {
  window.location.href = "login.html";
}

function logout() {
  sessionStorage.removeItem("admin");
  window.location.href = "login.html";
}
