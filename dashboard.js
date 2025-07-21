// You will expand this part later with chart + fetch from sheet
const ctx = document.getElementById('chart').getContext('2d');
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['USA', 'UK', 'Canada'],
    datasets: [{
      label: 'Applications',
      data: [12, 19, 3],
      backgroundColor: ['red', 'blue', 'green']
    }]
  }
});
