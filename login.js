async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const status = document.getElementById("login-status");

  if (!email || !password) {
    status.innerText = "Please enter both fields.";
    return;
  }

  try {
    const sheetURL = "https://opensheet.elk.sh/1FJn2u5QRh2fduij-nIn4gH6_uGzxnsa8Ou1y4SLA-SE/Admin-Login";
    const response = await fetch(sheetURL);
    const admins = await response.json();

    const found = admins.find(admin => admin["Email ID"] === email && admin.Password === password);

    if (found) {
      status.innerText = "Login successful!";
      localStorage.setItem("admin", JSON.stringify(found));
      window.location.href = "dashboard.html";
    } else {
      status.innerText = "Invalid login credentials.";
    }
  } catch (err) {
    status.innerText = "Error connecting to server.";
  }
}
