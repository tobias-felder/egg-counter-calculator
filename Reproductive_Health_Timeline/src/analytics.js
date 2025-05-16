// Fetch analytics data
async function fetchAnalytics(startDate = null, endDate = null) {
    try {
        let url = '/api/analytics';
        if (startDate && endDate) {
            url += `?startDate=${startDate}&endDate=${endDate}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return null;
    }
}

// Track user activity
async function trackActivity(email, type, details) {
    try {
        await fetch('/api/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, type, details })
        });
    } catch (error) {
        console.error('Error tracking activity:', error);
    }
}

// Track purchase
async function trackPurchase(email, productType, amount, affiliateId = null) {
    try {
        await fetch('/api/purchases', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, productType, amount, affiliateId })
        });
    } catch (error) {
        console.error('Error tracking purchase:', error);
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
async function initializeDashboard(startDate = null, endDate = null) {
    const data = await fetchAnalytics(startDate, endDate);
    if (data) {
        updateStats(data);
        createCampaignChart(data.recentCampaigns);
        createProductChart(data.purchases);
        updateActivityTable(data.recentActivities || []);
    }
}

// Set default date range to last 30 days
function setDefaultDateRange() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    document.getElementById('startDate').value = startDate.toISOString().split('T')[0];
    document.getElementById('endDate').value = endDate.toISOString().split('T')[0];
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Set default date range
    setDefaultDateRange();
    
    // Initialize dashboard with default date range
    initializeDashboard();
    
    // Handle date range filter
    document.getElementById('applyDateRange').addEventListener('click', () => {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        initializeDashboard(startDate, endDate);
    });

    // Export buttons
    document.getElementById('exportCSV').addEventListener('click', () => exportAdminData('csv'));
    document.getElementById('exportExcel').addEventListener('click', () => exportAdminData('excel'));
    document.getElementById('exportCustomerData').addEventListener('click', exportCustomerData);

    // Add event listener for save schedule button
    const saveScheduleBtn = document.getElementById('saveScheduleBtn');
    if (saveScheduleBtn) {
        saveScheduleBtn.addEventListener('click', saveExportSchedule);
    }
});

// Export functions
function convertToCSV(data) {
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    for (const row of data) {
        const values = headers.map(header => {
            const value = row[header];
            return typeof value === 'string' ? `"${value}"` : value;
        });
        csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
}

function downloadFile(content, fileName, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

async function exportAdminData(format) {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const includeUsers = document.getElementById('exportUsers').checked;
    const includeActivities = document.getElementById('exportActivities').checked;
    const includePurchases = document.getElementById('exportPurchases').checked;

    try {
        const data = await fetchAnalytics(startDate, endDate);
        let exportData = [];

        if (includeUsers) {
            const users = await fetch('/api/users').then(res => res.json());
            exportData = exportData.concat(users.map(user => ({
                type: 'User',
                email: user.email,
                name: user.name,
                age: user.age,
                lastActive: user.lastActive,
                createdAt: user.createdAt
            })));
        }

        if (includeActivities) {
            exportData = exportData.concat(data.recentActivities.map(activity => ({
                type: 'Activity',
                timestamp: activity.timestamp,
                email: activity.email,
                activityType: activity.type,
                details: activity.details
            })));
        }

        if (includePurchases) {
            exportData = exportData.concat(data.purchases.map(purchase => ({
                type: 'Purchase',
                timestamp: purchase.timestamp,
                email: purchase.email,
                productType: purchase.productType,
                amount: purchase.amount,
                status: purchase.status
            })));
        }

        if (format === 'csv') {
            const csv = convertToCSV(exportData);
            downloadFile(csv, `analytics_${startDate}_to_${endDate}.csv`, 'text/csv');
        } else {
            const ws = XLSX.utils.json_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Analytics Data');
            XLSX.writeFile(wb, `analytics_${startDate}_to_${endDate}.xlsx`);
        }
    } catch (error) {
        console.error('Error exporting data:', error);
        alert('Failed to export data. Please try again.');
    }
}

async function exportCustomerData() {
    const email = document.getElementById('customerEmail').value;
    if (!email) {
        alert('Please enter a customer email address');
        return;
    }

    try {
        const response = await fetch(`/api/customer-data/${encodeURIComponent(email)}`);
        const data = await response.json();

        const exportData = [
            ...data.activities.map(activity => ({
                type: 'Activity',
                timestamp: activity.timestamp,
                activityType: activity.type,
                details: activity.details
            })),
            ...data.purchases.map(purchase => ({
                type: 'Purchase',
                timestamp: purchase.timestamp,
                productType: purchase.productType,
                amount: purchase.amount,
                status: purchase.status
            }))
        ];

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Customer Data');
        XLSX.writeFile(wb, `customer_data_${email}.xlsx`);
    } catch (error) {
        console.error('Error exporting customer data:', error);
        alert('Failed to export customer data. Please try again.');
    }
}

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

// Export functions for use in other files
window.analytics = {
    trackActivity,
    trackPurchase
}; 