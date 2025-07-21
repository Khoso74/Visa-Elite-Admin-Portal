const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const sheetURL = "https://docs.google.com/spreadsheets/d/1FJn2u5QRh2fduij-nIn4gH6_uGzxnsa8Ou1y4SLA-SE/gviz/tq?tqx=out:json&sheet=Admin-Login";

  try {
    const res = await fetch(sheetURL);
    const text = await res.text();
    const json = JSON.parse(text.substr(47).slice(0, -2));

    const admins = json.table.rows.map((row) => ({
      email: row.c[0]?.v,
      password: row.c[1]?.v,
    }));

    const matched = admins.find((admin) => admin.email === email && admin.password === password);

    if (matched) {
      window.location.href = "dashboard.html";
    } else {
      document.getElementById("login-error").textContent = "Invalid credentials!";
    }
  } catch (err) {
    console.error("Login Error:", err);
  }
});
