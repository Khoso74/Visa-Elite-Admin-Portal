// Check if user is logged in
window.onload = function () {
  const email = localStorage.getItem("email");
  const password = localStorage.getItem("password");

  // Redirect to login if not logged in
  if (!email || !password) {
    window.location.href = "index.html";
  }
};
