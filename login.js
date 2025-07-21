// Replace this with your Apps Script Web App URL 👇
const scriptURL = "https://script.google.com/macros/s/AKfycbxxxxx/exec";

async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("error");

  if (!email || !password) {
    errorMsg.textContent = "Please enter both email and password.";
    return;
  }

  try {
    const res = await fetch(scriptURL + "?action=getAdmins");
    const admins = await res.json();

    const matched = admins.find(admin =>
      admin.email.toLowerCase() === email.toLowerCase() &&
      admin.password === password
    );

    if (matched) {
      // Save session (if needed)
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("adminEmail", email);
      window.location.href = "dashboard.html"; // Redirect to dashboard
    } else {
      errorMsg.textContent = "Invalid login credentials.";
    }
  } catch (err) {
    errorMsg.textContent = "Error connecting to server.";
    console.error(err);
  }
}

