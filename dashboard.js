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

// Define a professional and vibrant color palette focusing on cool, techy tones
const chartColors = {
    // Main vibrant colors (blues, purples, greens, subtle pink)
    vibrant1: '#00E6E6', // Bright Cyan (main accent)
    vibrant2: '#A066FF', // Medium Purple
    vibrant3: '#33FF66', // Bright Green
    vibrant4: '#FF66AA', // Soft Pink
    vibrant5: '#66CCFF', // Sky Blue

    // Grayscale/Dark tones for background, text, grid
    darkBg: '#1a1a1a',
    lightText: '#E0E0E0',
    gridLine: 'rgba(255, 255, 255, 0.08)', // Very subtle grid lines
    axisText: '#B0B0B0', // Slightly darker text for axis labels
    tooltipBg: 'rgba(15, 15, 30, 0.95)', // Very dark, almost black tooltip background
    tooltipBorder: '#00E6E6' // Cyan border for tooltips
};

// Set Chart.js defaults for a dark theme and consistent fonts
Chart.defaults.color = chartColors.lightText;
Chart.defaults.font.family = 'Lato, sans-serif';
Chart.defaults.font.size = 13; // Base font size for all text
Chart.defaults.plugins.title.color = chartColors.vibrant1; // Chart titles in bright cyan
Chart.defaults.plugins.title.font.family = 'Orbitron, sans-serif'; // Techy font for titles
Chart.defaults.plugins.legend.labels.color = chartColors.lightText;
Chart.defaults.plugins.legend.labels.font.size = 13;
Chart.defaults.elements.arc.borderColor = chartColors.darkBg; // Border for pie/doughnut slices
Chart.defaults.elements.arc.borderWidth = 3; // Slightly thicker border for slices

// Helper function to generate dynamic background colors for charts
const generateChartBackgrounds = (numColors) => {
    const colors = [
        chartColors.vibrant1,
        chartColors.vibrant2,
        chartColors.vibrant3,
        chartColors.vibrant4,
        chartColors.vibrant5,
        'rgba(255, 150, 0, 0.8)', // Orange fallback
        'rgba(0, 150, 255, 0.8)'  // Deeper Blue fallback
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
        'rgba(255, 150, 0, 1)',
        'rgba(0, 150, 255, 1)'
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
                backgroundColor: generateChartBackgrounds(visaTypeLabels.length).map(color => color.replace('0.8', '0.95')), // More opaque
                borderColor: generateChartBorders(visaTypeLabels.length),
                hoverOffset: 15 // Increased hover offset for better visual feedback
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Visa Type Distribution',
                    font: { size: 22 }, // Larger title font
                    color: chartColors.vibrant1
                },
                legend: {
                    position: 'right',
                    labels: {
                        font: { size: 14 }, // Larger legend labels
                        padding: 25 // More padding
                    }
                },
                tooltip: {
                    backgroundColor: chartColors.tooltipBg,
                    titleColor: chartColors.tooltipBorder, // Use border color for title
                    bodyColor: chartColors.lightText,
                    borderColor: chartColors.tooltipBorder,
                    borderWidth: 2,
                    cornerRadius: 10,
                    padding: 15,
                    bodyFont: { size: 14 },
                    titleFont: { size: 15, weight: 'bold' }
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
                backgroundColor: generateChartBackgrounds(locationLabels.length).map(color => color.replace('0.8', '0.95')),
                borderColor: generateChartBorders(locationLabels.length),
                borderWidth: 1.5,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    ticks: {
                        color: chartColors.axisText, // X-axis label color
                        font: { size: 12 }
                    },
                    grid: {
                        color: chartColors.gridLine, // Subtle grid line color
                        drawBorder: false // Do not draw axis border
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: chartColors.axisText, // Y-axis label color
                        font: { size: 12 }
                    },
                    grid: {
                        color: chartColors.gridLine, // Subtle grid line color
                        drawBorder: false
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Applications by Location',
                    font: { size: 22 },
                    color: chartColors.vibrant1
                },
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: chartColors.tooltipBg,
                    titleColor: chartColors.tooltipBorder,
                    bodyColor: chartColors.lightText,
                    borderColor: chartColors.tooltipBorder,
                    borderWidth: 2,
                    cornerRadius: 10,
                    padding: 15,
                    bodyFont: { size: 14 },
                    titleFont: { size: 15, weight: 'bold' }
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
                backgroundColor: generateChartBackgrounds(travelPurposeLabels.length).map(color => color.replace('0.8', '0.95')),
                borderColor: generateChartBorders(travelPurposeLabels.length),
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Travel Purpose Breakdown',
                    font: { size: 22 },
                    color: chartColors.vibrant1
                },
                legend: {
                    position: 'right',
                    labels: {
                        font: { size: 14 },
                        padding: 25
                    }
                },
                tooltip: {
                    backgroundColor: chartColors.tooltipBg,
                    titleColor: chartColors.tooltipBorder,
                    bodyColor: chartColors.lightText,
                    borderColor: chartColors.tooltipBorder,
                    borderWidth: 2,
                    cornerRadius: 10,
                    padding: 15,
                    bodyFont: { size: 14 },
                    titleFont: { size: 15, weight: 'bold' }
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
