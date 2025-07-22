// Check if user is logged in
if (!localStorage.getItem('loggedIn')) {
    window.location.href = 'login.html'; // Redirect to login if not logged in
}

async function fetchDashboardData() {
    // !!! IMPORTANT: Replace with your deployed Google Apps Script Web App URL !!!
    const gasUrl = 'https://script.google.com/macros/s/AKfycbxIkJL8tNlrZKL2jS2zcfDL3_-XssqRGYWeZvWgbqPTK_pG2FOUSKNYAw-cpgugihdC/exec'; // This GAS URL also handles doGet for data

    try {
        const response = await fetch(gasUrl, { method: 'GET' });
        const result = await response.json();

        if (result.success) {
            processDataAndRenderCharts(result.data);
        } else {
            console.error('Failed to fetch dashboard data:', result.message);
            alert('Could not load dashboard data.');
        }
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        alert('An error occurred while fetching dashboard data.');
    }
}

function processDataAndRenderCharts(data) {
    // Example: Count Visa Types
    const visaTypeCounts = {};
    data.forEach(row => {
        const visaType = row['Visa Type']; // Use the exact column name from your sheet
        if (visaType) { // Ensure value exists
            visaTypeCounts[visaType] = (visaTypeCounts[visaType] || 0) + 1;
        }
    });

    const visaTypeLabels = Object.keys(visaTypeCounts);
    const visaTypeData = Object.values(visaTypeCounts);

    // Render Visa Type Chart
    new Chart(document.getElementById('visaTypeChart'), {
        type: 'pie',
        data: {
            labels: visaTypeLabels,
            datasets: [{
                data: visaTypeData,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)', // Red
                    'rgba(54, 162, 235, 0.8)', // Blue
                    'rgba(255, 206, 86, 0.8)', // Yellow
                    'rgba(75, 192, 192, 0.8)', // Green
                    'rgba(153, 102, 255, 0.8)', // Purple
                    'rgba(255, 159, 64, 0.8)'  // Orange
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Visa Type Distribution',
                    color: '#e0e0e0' // Text color for dark theme
                },
                legend: {
                    labels: {
                        color: '#e0e0e0' // Label color for dark theme
                    }
                }
            }
        }
    });

    // Example: Applications by Location
    const locationCounts = {};
    data.forEach(row => {
        const location = row['Location'];
        if (location) {
            locationCounts[location] = (locationCounts[location] || 0) + 1;
        }
    });

    const locationLabels = Object.keys(locationCounts);
    const locationData = Object.values(locationCounts);

    new Chart(document.getElementById('locationChart'), {
        type: 'bar',
        data: {
            labels: locationLabels,
            datasets: [{
                label: 'Number of Applications',
                data: locationData,
                backgroundColor: 'rgba(75, 192, 192, 0.8)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    ticks: {
                        color: '#e0e0e0' // X-axis label color
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)' // Grid line color
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#e0e0e0' // Y-axis label color
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)' // Grid line color
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Applications by Location',
                    color: '#e0e0e0'
                },
                legend: {
                    labels: {
                        color: '#e0e0e0'
                    }
                }
            }
        }
    });

    // Example: Travel Purpose Breakdown
    const travelPurposeCounts = {};
    data.forEach(row => {
        const purpose = row['Travel Purpose'];
        if (purpose) {
            travelPurposeCounts[purpose] = (travelPurposeCounts[purpose] || 0) + 1;
        }
    });

    const travelPurposeLabels = Object.keys(travelPurposeCounts);
    const travelPurposeData = Object.values(travelPurposeCounts);

    new Chart(document.getElementById('travelPurposeChart'), {
        type: 'doughnut',
        data: {
            labels: travelPurposeLabels,
            datasets: [{
                data: travelPurposeData,
                backgroundColor: [
                    'rgba(255, 159, 64, 0.8)',  // Orange
                    'rgba(153, 102, 255, 0.8)', // Purple
                    'rgba(255, 99, 132, 0.8)',  // Red
                    'rgba(54, 162, 235, 0.8)',  // Blue
                    'rgba(201, 203, 207, 0.8)'  // Grey
                ],
                borderColor: [
                    'rgba(255, 159, 64, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(201, 203, 207, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Travel Purpose Breakdown',
                    color: '#e0e0e0'
                },
                legend: {
                    labels: {
                        color: '#e0e0e0'
                    }
                }
            }
        }
    });
}

function logout() {
    localStorage.removeItem('loggedIn');
    window.location.href = 'login.html';
}

// Call fetchDashboardData when the page loads
document.addEventListener('DOMContentLoaded', fetchDashboardData);
