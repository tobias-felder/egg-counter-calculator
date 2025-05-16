// Fetch analytics data
async function fetchAnalytics() {
    try {
        const response = await fetch('/api/analytics');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return null;
    }
}

// Update stats cards
function updateStats(data) {
    document.getElementById('totalUsers').textContent = data.users;
    document.getElementById('totalClicks').textContent = data.clicks;
    document.getElementById('totalPurchases').textContent = data.purchases;
    document.getElementById('totalRevenue').textContent = `$${data.totalRevenue.toFixed(2)}`;
}

// Create campaign performance chart
function createCampaignChart(campaigns) {
    const ctx = document.getElementById('campaignChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: campaigns.map(c => c.name),
            datasets: [{
                label: 'Open Rate',
                data: campaigns.map(c => c.openRate * 100),
                backgroundColor: 'rgba(52, 152, 219, 0.5)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 1
            }, {
                label: 'Click Rate',
                data: campaigns.map(c => c.clickRate * 100),
                backgroundColor: 'rgba(46, 204, 113, 0.5)',
                borderColor: 'rgba(46, 204, 113, 1)',
                borderWidth: 1
            }, {
                label: 'Conversion Rate',
                data: campaigns.map(c => c.conversionRate * 100),
                backgroundColor: 'rgba(155, 89, 182, 0.5)',
                borderColor: 'rgba(155, 89, 182, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Percentage (%)'
                    }
                }
            }
        }
    });
}

// Create product performance chart
function createProductChart(purchases) {
    const productTypes = ['menstrual_care', 'fertility_tracking', 'wellness'];
    const revenueByProduct = productTypes.map(type => {
        const productPurchases = purchases.filter(p => p.productType === type);
        return productPurchases.reduce((sum, p) => sum + p.amount, 0);
    });

    const ctx = document.getElementById('productChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Menstrual Care', 'Fertility Tracking', 'Wellness'],
            datasets: [{
                data: revenueByProduct,
                backgroundColor: [
                    'rgba(52, 152, 219, 0.5)',
                    'rgba(46, 204, 113, 0.5)',
                    'rgba(155, 89, 182, 0.5)'
                ],
                borderColor: [
                    'rgba(52, 152, 219, 1)',
                    'rgba(46, 204, 113, 1)',
                    'rgba(155, 89, 182, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

// Update activity table
function updateActivityTable(activities) {
    const tableBody = document.getElementById('activityTable');
    tableBody.innerHTML = '';

    activities.forEach(activity => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(activity.timestamp).toLocaleDateString()}</td>
            <td>${activity.email}</td>
            <td>${activity.type}</td>
            <td>${activity.details}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Initialize dashboard
async function initializeDashboard() {
    const data = await fetchAnalytics();
    if (data) {
        updateStats(data);
        createCampaignChart(data.recentCampaigns);
        createProductChart(data.purchases);
        updateActivityTable(data.recentActivities || []);
    }
}

// Refresh data every 5 minutes
initializeDashboard();
setInterval(initializeDashboard, 300000);

// Save export schedule
async function saveExportSchedule() {
    const scheduleType = document.getElementById('scheduleType').value;
    const scheduleTime = document.getElementById('scheduleTime').value;
    const emails = document.getElementById('scheduleEmails').value;

    try {
        const response = await fetch('/api/schedule-export', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                scheduleType,
                scheduleTime,
                emails
            })
        });

        const data = await response.json();
        if (data.success) {
            alert('Export schedule saved successfully!');
        } else {
            alert('Error saving schedule: ' + data.error);
        }
    } catch (error) {
        console.error('Error saving schedule:', error);
        alert('Failed to save schedule. Please try again.');
    }
}

// Export functions
function exportData(format, type) {
    const url = `/api/export/${format}?type=${type}`;
    window.location.href = url;
}

// Customer export function
async function exportCustomerData() {
    const email = document.getElementById('customerEmail').value;
    if (!email) {
        alert('Please enter a customer email address');
        return;
    }

    try {
        const response = await fetch(`/api/export/customer?email=${encodeURIComponent(email)}`);
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `customer_${email}_export.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            alert('Customer data exported successfully!');
        } else {
            const error = await response.json();
            alert('Error: ' + error.error);
        }
    } catch (error) {
        console.error('Error exporting customer data:', error);
        alert('Failed to export customer data. Please try again.');
    }
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Export buttons
    document.getElementById('exportCSV')?.addEventListener('click', () => {
        const type = document.querySelector('input[name="exportType"]:checked')?.value || 'users';
        exportData('csv', type);
    });

    document.getElementById('exportExcel')?.addEventListener('click', () => {
        const type = document.querySelector('input[name="exportType"]:checked')?.value || 'users';
        exportData('excel', type);
    });

    // Date range filter
    document.getElementById('applyDateRange')?.addEventListener('click', () => {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        if (startDate && endDate) {
            fetchAnalytics(startDate, endDate).then(updateDashboard);
        }
    });

    // Schedule export
    document.getElementById('saveSchedule')?.addEventListener('click', async () => {
        const scheduleType = document.getElementById('scheduleType').value;
        const scheduleTime = document.getElementById('scheduleTime').value;
        const emails = document.getElementById('scheduleEmails').value;

        try {
            const response = await fetch('/api/schedule-export', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ scheduleType, scheduleTime, emails })
            });

            const data = await response.json();
            if (data.success) {
                alert('Export schedule saved successfully!');
            } else {
                alert('Error: ' + data.error);
            }
        } catch (error) {
            console.error('Error scheduling export:', error);
            alert('Failed to schedule export. Please try again.');
        }
    });

    // Customer export button
    document.getElementById('exportCustomerData')?.addEventListener('click', exportCustomerData);

    // Initialize dashboard
    initializeDashboard();
}); 