document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("loggedIn");
    window.location.href = "login.html";
  });

  fetch("https://script.google.com/macros/s/AKfycbxIkJL8tNlrZKL2jS2zcfDL3_-XssqRGYWeZvWgbqPTK_pG2FOUSKNYAw-cpgugihdC/exec", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
    .then((data) => {
      if (data.status === "success") {
        const visaData = data.data;
        populateCharts(visaData);
        populateTable(visaData);
      } else {
        console.error("Data fetch error:", data.message);
      }
    })
    .catch((err) => {
      console.error("Error fetching data:", err);
    });

  function populateCharts(data) {
    const visaTypeCounts = {};
    const travelPurposeCounts = {};
    const travelDates = {};

    data.forEach(item => {
      visaTypeCounts[item.visaType] = (visaTypeCounts[item.visaType] || 0) + 1;
      travelPurposeCounts[item.travelPurpose] = (travelPurposeCounts[item.travelPurpose] || 0) + 1;
      if (item.dateOfTravel) {
        travelDates[item.dateOfTravel] = (travelDates[item.dateOfTravel] || 0) + 1;
      }
    });

    new Chart(document.getElementById("visaTypeChart"), {
      type: "pie",
      data: {
        labels: Object.keys(visaTypeCounts),
        datasets: [{
          data: Object.values(visaTypeCounts),
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"]
        }]
      }
    });

    new Chart(document.getElementById("travelPurposeChart"), {
      type: "bar",
      data: {
        labels: Object.keys(travelPurposeCounts),
        datasets: [{
          label: "Count",
          data: Object.values(travelPurposeCounts),
          backgroundColor: "#36A2EB"
        }]
      }
    });

    new Chart(document.getElementById("travelDateChart"), {
      type: "line",
      data: {
        labels: Object.keys(travelDates),
        datasets: [{
          label: "Applications",
          data: Object.values(travelDates),
          borderColor: "#FF6384",
          fill: false
        }]
      }
    });
  }

  function populateTable(data) {
    const tbody = document.querySelector("#visaDataTable tbody");
    tbody.innerHTML = "";
    data.forEach(item => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.fullName || ""}</td>
        <td>${item.passportNumber || ""}</td>
        <td>${item.email || ""}</td>
        <td>${item.location || ""}</td>
        <td>${item.travelPurpose || ""}</td>
        <td>${item.visaType || ""}</td>
        <td>${item.dateOfTravel || ""}</td>
        <td>${item.additionalNotes || ""}</td>
      `;
      tbody.appendChild(row);
    });
  }
});
