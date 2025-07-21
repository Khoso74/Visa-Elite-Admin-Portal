const sheetURL = "https://docs.google.com/spreadsheets/d/1FJn2u5QRh2fduij-nIn4gH6_uGzxnsa8Ou1y4SLA-SE/gviz/tq?tqx=out:json&sheet=Visa%20Applications";

fetch(sheetURL)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(text.substr(47).slice(0, -2));
    const rows = json.table.rows;

    const visaTypes = {};
    rows.forEach(row => {
      const type = row.c[5]?.v || "Unknown";
      visaTypes[type] = (visaTypes[type] || 0) + 1;
    });

    const ctx = document.getElementById("visaChart").getContext("2d");
    new Chart(ctx, {
      type: "pie",
      data: {
        labels: Object.keys(visaTypes),
        datasets: [{
          data: Object.values(visaTypes),
          backgroundColor: ['#007bff', '#00ffff', '#ff0066', '#ffcc00'],
        }],
      },
    });
  })
  .catch(err => console.error("Dashboard Error:", err));
