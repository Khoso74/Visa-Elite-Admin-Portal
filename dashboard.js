window.onload = async () => {
  const response = await fetch('https://script.google.com/macros/s/YOUR_DEPLOYED_SCRIPT_URL/exec?action=getData');
  const data = await response.json();

  const ctx = document.getElementById('visaChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(row => row.name),
      datasets: [{
        label: 'Applications',
        data: data.map(row => row.visa_count),
        backgroundColor: 'blue'
      }]
    }
  });
};
