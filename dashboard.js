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

// Define a professional and vibrant color palette with more emphasis on blues/purples/cyans
const chartColors = {
    // Main vibrant colors
    vibrant1: '#33FFFF', // Bright Cyan
    vibrant2: '#FF33FF', // Bright Magenta
    vibrant3: '#66FF66', // Green
    vibrant4: '#FFCC33', // Orange-Yellow
    vibrant5: '#9966FF', // Medium Purple

    // Backgrounds and accents
    darkBg: '#1a1a1a',
    lightText: '#E0E0E0',
    gridLine: 'rgba(255, 255, 255, 0.15)', // Slightly brighter grid lines
    tooltipBg: 'rgba(20, 20, 40, 0.95)', // Darker, more opaque tooltip
    tooltipBorder: '#33FFFF' // Cyan border for tooltips
};

// Set Chart.js defaults for a dark theme and consistent fonts
Chart.defaults.color = chartColors.lightText;
Chart.defaults.font.family = 'Lato, sans-serif';
Chart.defaults.plugins.title.color = chartColors.vibrant1; // Chart titles in bright cyan
Chart.defaults.plugins.legend.labels.color = chartColors.lightText;
Chart.defaults.elements.arc.borderColor = chartColors.darkBg; // Border for pie/doughnut slices
Chart.defaults.elements.arc.borderWidth = 3; // Slightly thicker border for slices

// Helper function to generate dynamic background colors for charts
const generateChartBackgrounds = (numColors) => {
    const colors = [
        chartColors.vibrant1, // Cyan
        chartColors.vibrant2, // Magenta
        chartColors.vibrant3, // Green
        chartColors.vibrant4, // Orange-Yellow
        chartColors.vibrant5, // Purple
        'rgba(0, 150, 255, 0.8)', // Royal Blue
        'rgba(255, 50, 50, 0.8)'  // Red
    ];
    const selectedColors = [];
    for (let i = 0; i < numColors; i++) {
        selectedColors.push(colors[i % colors.length]);
    }
    return selectedColors;
};

const generateChartBorders = (numColors) => {
    const borders = [
        chartColors.vibrant1,
        chartColors.vibrant2,
        chartColors.vibrant3,
        chartColors.vibrant4,
        chartColors.vibrant5,
        'rgba(0, 150, 255, 1)',
        'rgba(255, 50, 50, 1)'
    ];
    const selectedBorders = [];
    for (let i = 0; i < numColors; i++) {
        selectedBorders.push(borders[i % borders.length]);
    }
    return selectedBorders;
};


function processDataAndRenderCharts(data) {
    // 1. Visa Type Distribution (Pie Chart)
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
                backgroundColor: generateChartBackgrounds(visaTypeLabels.length).map(color => color.replace('0.8', '0.9')), // Slightly more opaque
                borderColor: generateChartBorders(visaTypeLabels.length),
                hoverOffset: 12 // Increased hover offset
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Visa Type Distribution',
                    font: { size: 20, family: 'Orbitron, sans-serif' }, // Larger title font
                    color: chartColors.vibrant1
                },
                legend: {
                    position: 'right',
                    labels: {
                        font: { size: 14 }, // Larger legend labels
                        padding: 20 // More padding
                    }
                },
                tooltip: {
                    backgroundColor: chartColors.tooltipBg,
                    titleColor: chartColors.vibrant1,
                    bodyColor: chartColors.lightText,
                    borderColor: chartColors.tooltipBorder,
                    borderWidth: 2, // Thicker border
                    cornerRadius: 10, // More rounded
                    padding: 15, // More padding
                    bodyFont: { size: 14 }
                }
            }
        }
    });

    // 2. Applications by Location (Bar Chart)
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
                backgroundColor: generateChartBackgrounds(locationLabels.length).map(color => color.replace('0.8', '0.9')),
                borderColor: generateChartBorders(locationLabels.length),
                borderWidth: 1.5, // Slightly thicker bar border
                borderRadius: 5 // Rounded bars
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    ticks: {
                        color: chartColors.lightText, // X-axis label color
                        font: { size: 12 }
                    },
                    grid: {
                        color: chartColors.gridLine // Grid line color
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: chartColors.lightText, // Y-axis label color
                        font: { size: 12 }
                    },
                    grid: {
                        color: chartColors.gridLine // Grid line color
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Applications by Location',
                    font: { size: 20, family: 'Orbitron, sans-serif' },
                    color: chartColors.vibrant1
                },
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: chartColors.tooltipBg,
                    titleColor: chartColors.vibrant1,
                    bodyColor: chartColors.lightText,
                    borderColor: chartColors.tooltipBorder,
                    borderWidth: 2,
                    cornerRadius: 10,
                    padding: 15,
                    bodyFont: { size: 14 }
                }
            }
        }
    });

    // 3. Travel Purpose Breakdown (Doughnut Chart)
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
                backgroundColor: generateChartBackgrounds(travelPurposeLabels.length).map(color => color.replace('0.8', '0.9')),
                borderColor: generateChartBorders(travelPurposeLabels.length),
                hoverOffset: 12
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Travel Purpose Breakdown',
                    font: { size: 20, family: 'Orbitron, sans-serif' },
                    color: chartColors.vibrant1
                },
                legend: {
                    position: 'right',
                    labels: {
                        font: { size: 14 },
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: chartColors.tooltipBg,
                    titleColor: chartColors.vibrant1,
                    bodyColor: chartColors.lightText,
                    borderColor: chartColors.tooltipBorder,
                    borderWidth: 2,
                    cornerRadius: 10,
                    padding: 15,
                    bodyFont: { size: 14 }
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
