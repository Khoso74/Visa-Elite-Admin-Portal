function login() {
  const email = document.getElementById("email").value.trim();
  const allowedEmails = [
    "admin1@gmail.com",
    "admin2@gmail.com",
    "admin3@gmail.com"
  ];

  const status = document.getElementById("status");

  if (allowedEmails.includes(email)) {
    status.innerText = "Access Granted ✅";
    status.style.color = "green";
    setTimeout(() => {
      window.location.href = "dashboard.html"; // Or wherever you want
    }, 1000);
  } else {
    status.innerText = "Access Denied ❌";
    status.style.color = "red";
  }
}
