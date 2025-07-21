window.onload = function () {
  if (!sessionStorage.getItem("loggedIn")) {
    window.location.href = "index.html";
    return;
  }

  const loadingCharts = document.getElementById("loading-charts");
  const chartsGrid = document.querySelector(".charts-grid");
  const chartError = document.getElementById("chart-error");
  const loadingTable = document.getElementById("loading-table");
  const visaDataTable = document.getElementById("visaDataTable");
  const tableError = document.getElementById("table-error");

  // Fallback data in case API fails
  const fallbackData = [
    { fullName: "John Doe", passportNumber: "AB123456", email: "john@example.com", location: "New York", travelPurpose: "Tourism", visaType: "Tourist", dateOfTravel: "2025-08-01", additionalNotes: "" },
    { fullName: "Jane Smith", passportNumber: "CD789012", email: "jane@example.com", location: "London", travelPurpose: "Business", visaType: "Business", dateOfTravel: "2025-09-15", additionalNotes: "Meeting" }
  ];

  // Fetch Visa Applications data with retry logic
  async function fetchData(attempts = 3) {
    try {
      const response = await fetch("https://script.google.com/macros/s/YOUR_DATA_SCRIPT_URL/exec");
      const data = await response.json();
      if (data.status === "success" && data.data && data.data.length > 0) {
        return data.data;
      } else {
        throw new Error("No data received from server");
      }
    } catch (err) {
      if (attempts > 1) {
        console.warn(`Retrying data fetch... Attempts left: ${attempts - 1}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchData(attempts - 1);
      } else {
        console.error("Data fetch error:", err);
        return fallbackData; // Use fallback data
      }
    }
  }

  // Render charts and table
  setTimeout(async () => {
    try {
      const visaData = await fetchData();
      loadingCharts.classList.add("hidden");
      chartsGrid.classList.remove("hidden");
      loadingTable.classList.add("hidden");
      visaDataTable.classList.remove("hidden");

      // Visa Type Pie Chart
      const visaTypes = [...new Set(visaData.map(item => item.visaType))];
      const visaTypeCounts = visaTypes.map(type => visaData.filter(item => item.visaType === type).length);
      new Chart(document.getElementById("visaTypeChart"), {
        type: 'pie',
        data: {
          labels: visaTypes,
          datasets: [{
            label: 'Visa Types',
            data: visaTypeCounts,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            borderColor: '#ffffff',
            borderWidth: 1,
          }],
        },
        options: {
          responsive: true,
          animation: { animateScale: true, animateRotate: true },
          plugins: {
            legend: { position: 'top', labels: { color: '#fff', font: { size: 14 } } },
            title: { display: true, text: 'Visa Type Distribution', color: '#fff', font: { size: 18 } },
            tooltip: { backgroundColor: '#333', titleFont: { size: 14 }, bodyFont: { size: 12 } },
          },
        },
      });

      // Travel Purpose Bar Chart
      const travelPurposes = [...new Set(visaData.map(item => item.travelPurpose))];
      const travelPurposeCounts = travelPurposes.map(purpose => visaData.filter(item => item.travelPurpose === purpose).length);
      new Chart(document.getElementById("travelPurposeChart"), {
        type: 'bar',
        data: {
          labels: travelPurposes,
          datasets: [{
            label: 'Travel Purpose',
            data: travelPurposeCounts,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            borderColor: '#ffffff',
            borderWidth: 1,
          }],
        },
        options: {
          responsive: true,
          animation: { duration: 1000, easing: 'easeOutQuart' },
          plugins: {
            legend: { position: 'top', labels: { color: '#fff', font: { size: 14 } } },
            title: { display: true, text: 'Travel Purpose Distribution', color: '#fff', font: { size: 18 } },
            tooltip: { backgroundColor: '#333', titleFont: { size: 14 }, bodyFont: { size: 12 } },
          },
          scales: {
            y: { beginAtZero: true, ticks: { color: '#fff' } },
            x: { ticks: { color: '#fff' } },
          },
        },
      });

      // Travel Date Line Chart
      const dates = visaData.map(item => item.dateOfTravel);
      const dateCounts = dates.reduce((acc, date) => {
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
      new Chart(document.getElementById("travelDateChart"), {
        type: 'line',
        data: {
          labels: Object.keys(dateCounts).sort(),
          datasets: [{
            label: 'Applications by Date',
            data: Object.values(dateCounts),
            borderColor: '#36A2EB',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: true,
            tension: 0.4,
          }],
        },
        options: {
          responsive: true,
          animation: { duration: 1000, easing: 'easeOutQuart' },
          plugins: {
            legend: { position: 'top', labels: { color: '#fff', font: { size: 14 } } },
            title: { display: true, text: 'Travel Date Trends', color: '#fff', font: { size: 18 } },
            tooltip: { backgroundColor: '#333', titleFont: { size: 14 }, bodyFont: { size: 12 } },
          },
          scales: {
            y: { beginAtZero: true, ticks: { color: '#fff' } },
            x: { ticks: { color: '#fff' } },
          },
        },
      });

      // Populate Data Table
      const tableBody = document.querySelector("#visaDataTable tbody");
      visaData.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${item.fullName || 'N/A'}</td>
          <td>${item.passportNumber || 'N/A'}</td>
          <td>${item.email || 'N/A'}</td>
          <td>${item.location || 'N/A'}</td>
          <td>${item.travelPurpose || 'N/A'}</td>
          <td>${item.visaType || 'N/A'}</td>
          <td>${item.dateOfTravel || 'N/A'}</td>
          <td>${item.additionalNotes || ''}</td>
        `;
        tableBody.appendChild(row);
      });
    } catch (err) {
      loadingCharts.classList.add("hidden");
      loadingTable.classList.add("hidden");
      chartError.textContent = "Failed to load charts. Please try again later.";
      tableError.textContent = "Failed to load table data. Please try again later.";
      console.error("Dashboard error:", err);
    }
  }, 500); // Delay to avoid DOM conflicts

  document.getElementById("logoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem("loggedIn");
    sessionStorage.removeItem("email");
    window.location.href = "index.html";
  });
};
