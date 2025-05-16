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