// Replace with your actual script URL
const scriptURL = "https://script.google.com/macros/s/AKfycbxxxxx/exec";

if (localStorage.getItem("loggedIn") !== "true") {
  window.location.href = "index.html";
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

async function loadDashboard() {
  try {
    const res = await fetch(scriptURL + "?action=getVisaData");
    const data = await res.json();
    document.getElementById("totalCount").textContent = data.length;

    // Visa Type Chart
    const visaCount = {};
    data.forEach(entry => {
      const type = entry["Visa Type"];
      visaCount[type] = (visaCount[type] || 0) + 1;
    });

    new Chart(document.getElementById("visaTypeChart"), {
      type: "pie",
      data: {
        labels: Object.keys(visaCount),
        datasets: [{
          label: "Visa Types",
          data: Object.values(visaCount),
          backgroundColor: ["#007BFF", "#28A745", "#FFC107", "#DC3545"]
        }]
      }
    });

    // Travel Purpose Chart
    const purposeCount = {};
    data.forEach(entry => {
      const purpose = entry["Travel Purpose"];
      purposeCount[purpose] = (purposeCount[purpose] || 0) + 1;
    });

    new Chart(document.getElementById("purposeChart"), {
      type: "bar",
      data: {
        labels: Object.keys(purposeCount),
        datasets: [{
          label: "Travel Purpose",
          data: Object.values(purposeCount),
          backgroundColor: "#17a2b8"
        }]
      },
      options: { indexAxis: 'y' }
    });

    // Location Chart
    const locationCount = {};
    data.forEach(entry => {
      const loc = entry["Location"];
      locationCount[loc] = (locationCount[loc] || 0) + 1;
    });

    new Chart(document.getElementById("locationChart"), {
      type: "doughnut",
      data: {
        labels: Object.keys(locationCount),
        datasets: [{
          label: "Location",
          data: Object.values(locationCount),
          backgroundColor: ["#6f42c1", "#20c997", "#fd7e14", "#6610f2"]
        }]
      }
    });

  } catch (err) {
    console.error("Dashboard Error:", err);
  }
}

loadDashboard();

