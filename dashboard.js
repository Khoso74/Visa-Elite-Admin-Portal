// Check if user is logged in
if (!localStorage.getItem('loggedIn')) {
    window.location.href = 'login.html'; // Redirect to login if not logged in
}

// Global variable to store all fetched data and pagination state
let allApplicationsData = [];
let currentPage = 1;
const rowsPerPage = 10; // Number of rows to show per page in the table

async function fetchDashboardData() {
    // !!! IMPORTANT: Replace with your deployed Google Apps Script Web App URL !!!
    const gasUrl = 'https://script.google.com/macros/s/AKfycbxIkJL8tNlrZKL2jS2zcfDL3_-XssqRGYWeZvWgbqPTK_pG2FOUSKNYAw-cpgugihdC/exec'; // This GAS URL also handles doGet for data

    try {
        const response = await fetch(gasUrl, { method: 'GET' });
        const result = await response.json();

        if (result.success) {
            allApplicationsData = result.data; // Store all fetched data globally
            processDataAndRenderCharts(allApplicationsData);
            displaySummaryMetrics(allApplicationsData);
            displayKeyDataLists(allApplicationsData);
            renderTable(allApplicationsData); // Render the initial table
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
// 1. Global Font Defaults
Chart.defaults.font = {
    family: 'Lato, sans-serif',
    size: 13, // Base font size for all text
    color: chartColors.lightText // Global default text color
};

// 2. Plugin-specific Font Defaults
// For Chart Titles
Chart.defaults.plugins.title = {
    ...Chart.defaults.plugins.title, // Preserve other title defaults if any exist
    font: { // Explicitly define font object for title
        family: 'Orbitron, sans-serif',
        size: 22, // Default size for titles
        weight: 'bold' // Optional: default weight for titles
    },
    color: chartColors.vibrant1 // Chart titles in bright cyan
};

// For Legend Labels
Chart.defaults.plugins.legend.labels = {
    ...Chart.defaults.plugins.legend.labels, // Preserve other legend label defaults
    font: { // Explicitly define font object for legend labels
        size: 14 // Default size for legend labels
    },
    color: chartColors.lightText // Legend labels text color
};

// Other defaults
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
    // Destroy existing charts before rendering new ones to prevent conflicts
    Chart.getChart('visaTypeChart')?.destroy();
    Chart.getChart('locationChart')?.destroy();
    Chart.getChart('travelPurposeChart')?.destroy();

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
                    // Font properties are now set in Chart.defaults.plugins.title
                    color: chartColors.vibrant1
                },
                legend: {
                    position: 'right',
                    labels: {
                        // Font properties are now set in Chart.defaults.plugins.legend.labels
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
                    // Font properties are now set in Chart.defaults.plugins.title
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
                    // Font properties are now set in Chart.defaults.plugins.title
                    color: chartColors.vibrant1
                },
                legend: {
                    position: 'right',
                    labels: {
                        // Font properties are now set in Chart.defaults.plugins.legend.labels
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

// --- New Functions for Additional Data Display and Features ---

function displaySummaryMetrics(data) {
    document.getElementById('totalEntries').textContent = data.length;

    const uniqueLocations = new Set(data.map(row => row['Location']).filter(Boolean));
    document.getElementById('uniqueLocationsCount').textContent = uniqueLocations.size;

    const uniqueVisaTypes = new Set(data.map(row => row['Visa Type']).filter(Boolean));
    document.getElementById('uniqueVisaTypesCount').textContent = uniqueVisaTypes.size;

    const uniqueTravelPurposes = new Set(data.map(row => row['Travel Purpose']).filter(Boolean));
    document.getElementById('uniqueTravelPurposesCount').textContent = uniqueTravelPurposes.size;

    // Assuming 'Category' is a column name in your data if you want to display it
    // const uniqueCategories = new Set(data.map(row => row['Category']).filter(Boolean));
    // document.getElementById('uniqueCategoriesCount').textContent = uniqueCategories.size;
}

function displayKeyDataLists(data) {
    const allLocations = [...new Set(data.map(row => row['Location']).filter(Boolean))].sort();
    const allVisaTypes = [...new Set(data.map(row => row['Visa Type']).filter(Boolean))].sort();
    const allTravelPurposes = [...new Set(data.map(row => row['Travel Purpose']).filter(Boolean))].sort();

    const populateList = (elementId, items) => {
        const ul = document.getElementById(elementId);
        ul.innerHTML = ''; // Clear previous items
        if (items.length === 0) {
            ul.innerHTML = '<li>N/A</li>';
            return;
        }
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            ul.appendChild(li);
        });
    };

    populateList('allLocationsList', allLocations);
    populateList('allVisaTypesList', allVisaTypes);
    populateList('allTravelPurposesList', allTravelPurposes);
}

function renderTable(dataToRender) {
    const tableBody = document.querySelector('#recentApplicationsTable tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = dataToRender.slice(startIndex, endIndex);

    if (paginatedData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7">No data available.</td></tr>';
        updatePaginationControls(dataToRender.length);
        return;
    }

    paginatedData.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row['Timestamp'] ? new Date(row['Timestamp']).toLocaleDateString() : 'N/A'}</td>
            <td>${row['Full Name'] || 'N/A'}</td>
            <td>${row['Email Address'] || 'N/A'}</td>
            <td>${row['Visa Type'] || 'N/A'}</td>
            <td>${row['Location'] || 'N/A'}</td>
            <td>${row['Application Status'] || 'Pending'}</td>
            <td>
                <button class="edit-btn" onclick="editEntry(${startIndex + index})">Edit</button>
                <button class="delete-btn" onclick="deleteEntry(${startIndex + index})">Delete</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });

    updatePaginationControls(dataToRender.length);
}

function updatePaginationControls(totalRows) {
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages || 1}`;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages || totalPages === 0;
}

function changePage(direction) {
    const totalPages = Math.ceil(allApplicationsData.length / rowsPerPage);
    currentPage += direction;

    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;

    filterTable(); // Re-render table with current search/filters and new page
}

// Search functionality for the table
function filterTable() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredData = allApplicationsData.filter(row => {
        const name = (row['Full Name'] || '').toLowerCase();
        const email = (row['Email Address'] || '').toLowerCase();
        return name.includes(searchTerm) || email.includes(searchTerm);
    });
    currentPage = 1; // Reset to first page on new search
    renderTable(filteredData);
}

// Placeholder for Edit and Delete functionality (Requires Backend Implementation)
function editEntry(rowIndex) {
    // In a real application, you would:
    // 1. Get the data for the specific row (using allApplicationsData[rowIndex])
    // 2. Open a modal/form pre-filled with this data
    // 3. Allow user to edit and save changes back to Google Sheet via GAS
    const entry = allApplicationsData[rowIndex];
    alert(`Edit functionality for row index ${rowIndex} (Name: ${entry['Full Name']}) would go here.\nThis requires Google Apps Script (GAS) backend to update data.`);
    console.log("Edit entry:", entry);
}

function deleteEntry(rowIndex) {
    if (confirm(`Are you sure you want to delete the entry for ${allApplicationsData[rowIndex]['Full Name']}?`)) {
        // In a real application, you would:
        // 1. Send a request to Google Apps Script (GAS) to delete this row
        // 2. On success, re-fetch dashboard data or remove the row from allApplicationsData and re-render the table
        const entryToDelete = allApplicationsData[rowIndex];
        alert(`Delete functionality for row index ${rowIndex} (Name: ${entryToDelete['Full Name']}) would go here.\nThis requires Google Apps Script (GAS) backend to delete data.`);
        console.log("Delete entry:", entryToDelete);
        // Example: If deletion was successful on backend:
        // allApplicationsData.splice(rowIndex, 1);
        // renderTable(allApplicationsData);
        // processDataAndRenderCharts(allApplicationsData); // Re-render charts with updated data
        // displaySummaryMetrics(allApplicationsData);
        // displayKeyDataLists(allApplicationsData);
    }
}


function logout() {
    localStorage.removeItem('loggedIn');
    window.location.href = 'login.html';
}

// Call fetchDashboardData when the page loads
document.addEventListener('DOMContentLoaded', fetchDashboardData);
