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

// Define a professional and vibrant color palette
const chartColors = {
    primary: '#00e6e6', // Cyan Neon
    secondary: '#ff00ff', // Magenta Neon
    tertiary: '#00ff00', // Green Neon
    quaternary: '#ffff00', // Yellow Neon
    quinary: '#ff6600', // Orange Neon
    senary: '#6600ff', // Purple Neon
    lightGrey: '#cccccc',
    darkGrey: '#444444'
};

// Set Chart.js defaults for a dark theme
Chart.defaults.color = chartColors.lightGrey;
Chart.defaults.font.family = 'Lato, sans-serif';
Chart.defaults.plugins.title.color = chartColors.primary;
Chart.defaults.plugins.legend.labels.color = chartColors.lightGrey;
Chart.defaults.elements.arc.borderColor = '#1a1a1a'; // Border for pie/doughnut slices
Chart.defaults.elements.arc.borderWidth = 2;

function processDataAndRenderCharts(data) {
    // Helper function to generate dynamic background colors for charts
    const generateChartBackgrounds = (numColors) => {
        const colors = [
            'rgba(0, 230, 230, 0.8)', // Cyan
            'rgba(255, 0, 255, 0.8)', // Magenta
            'rgba(0, 255, 0, 0.8)',   // Green
            'rgba(255, 255, 0, 0.8)', // Yellow
            'rgba(255, 102, 0, 0.8)', // Orange
            'rgba(102, 0, 255, 0.8)'  // Purple
        ];
        const selectedColors = [];
        for (let i = 0; i < numColors; i++) {
            selectedColors.push(colors[i % colors.length]);
        }
        return selectedColors;
    };

    const generateChartBorders = (numColors) => {
        const borders = [
            'rgba(0, 230, 230, 1)',
            'rgba(255, 0, 255, 1)',
            'rgba(0, 255, 0, 1)',
            'rgba(255, 255, 0, 1)',
            'rgba(255, 102, 0, 1)',
            'rgba(102, 0, 255, 1)'
        ];
        const selectedBorders = [];
        for (let i = 0; i < numColors; i++) {
            selectedBorders.push(borders[i % borders.length]);
        }
        return selectedBorders;
    };


    // 1. Visa Type Distribution
    const visaTypeCounts = {};
    data.forEach(row => {
        const visaType = row['Visa Type'];
        if (visaType) {
            visaTypeCounts[visaType] = (visaTypeCounts[visaType] || 0) + 1;
        }
    });

    const visaTypeLabels = Object.keys(visaTypeCounts);
    const visaTypeData = Object.values(visaTypeCounts);

    new Chart(document.getElementById('visaTypeChart'), {
        type: 'pie',
        data: {
            labels: visaTypeLabels,
            datasets: [{
                data: visaTypeData,
                backgroundColor: generateChartBackgrounds(visaTypeLabels.length),
                borderColor: generateChartBorders(visaTypeLabels.length),
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Visa Type Distribution',
                    font: { size: 18, family: 'Orbitron, sans-serif' },
                    color: chartColors.primary
                },
                legend: {
                    position: 'right', // Place legend on the right for better use of space
                    labels: {
                        font: { size: 12 },
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 26, 0.9)', // Darker tooltip background
                    titleColor: chartColors.primary,
                    bodyColor: chartColors.lightGrey,
                    borderColor: chartColors.primary,
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12
                }
            }
        }
    });

    // 2. Applications by Location
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
                backgroundColor: generateChartBackgrounds(locationLabels.length),
                borderColor: generateChartBorders(locationLabels.length),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    ticks: {
                        color: chartColors.lightGrey // X-axis label color
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)' // Grid line color
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: chartColors.lightGrey // Y-axis label color
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
                    font: { size: 18, family: 'Orbitron, sans-serif' },
                    color: chartColors.primary
                },
                legend: {
                    display: false // No need for legend in single bar chart
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 26, 0.9)',
                    titleColor: chartColors.primary,
                    bodyColor: chartColors.lightGrey,
                    borderColor: chartColors.primary,
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12
                }
            }
        }
    });

    // 3. Travel Purpose Breakdown
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
                backgroundColor: generateChartBackgrounds(travelPurposeLabels.length),
                borderColor: generateChartBorders(travelPurposeLabels.length),
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Travel Purpose Breakdown',
                    font: { size: 18, family: 'Orbitron, sans-serif' },
                    color: chartColors.primary
                },
                legend: {
                    position: 'right', // Place legend on the right
                    labels: {
                        font: { size: 12 },
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 26, 0.9)',
                    titleColor: chartColors.primary,
                    bodyColor: chartColors.lightGrey,
                    borderColor: chartColors.primary,
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12
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
