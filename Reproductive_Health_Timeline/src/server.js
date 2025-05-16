require('dotenv').config();
const express = require('express');
const path = require('path');
const notifications = require('./notifications');
const mongoose = require('mongoose');
const { User, Click, Purchase, Campaign, Schedule } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fertility_tracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Security middleware for production
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect(['https://', req.get('Host'), req.url].join(''));
        }
        next();
    });
}

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Track user activity
app.post('/api/track', async (req, res) => {
    try {
        const { email, type, details } = req.body;
        const click = new Click({
            email,
            type,
            details,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });
        await click.save();
        res.json({ success: true });
    } catch (error) {
        console.error('Error tracking activity:', error);
        res.status(500).json({ error: 'Failed to track activity' });
    }
});

// Track purchase
app.post('/api/purchases', async (req, res) => {
    try {
        const { email, productType, amount, affiliateId } = req.body;
        const purchase = new Purchase({
            email,
            productType,
            amount,
            affiliateId,
            commission: amount * (process.env.COMMISSION_RATE || 0.1)
        });
        await purchase.save();
        res.json({ success: true });
    } catch (error) {
        console.error('Error recording purchase:', error);
        res.status(500).json({ error: 'Failed to record purchase' });
    }
});

// Create campaign
app.post('/api/campaigns', async (req, res) => {
    try {
        const campaign = new Campaign(req.body);
        await campaign.save();
        res.json({ success: true, campaign });
    } catch (error) {
        console.error('Error creating campaign:', error);
        res.status(500).json({ error: 'Failed to create campaign' });
    }
});

// Update campaign metrics
app.put('/api/campaigns/:id/metrics', async (req, res) => {
    try {
        const { opens, clicks, conversions } = req.body;
        const campaign = await Campaign.findByIdAndUpdate(
            req.params.id,
            {
                $inc: {
                    opens: opens || 0,
                    clicks: clicks || 0,
                    conversions: conversions || 0
                }
            },
            { new: true }
        );
        res.json({ success: true, campaign });
    } catch (error) {
        console.error('Error updating campaign metrics:', error);
        res.status(500).json({ error: 'Failed to update campaign metrics' });
    }
});

// Analytics API endpoint with date filtering
app.get('/api/analytics', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const dateFilter = {};
        
        if (startDate && endDate) {
            dateFilter.timestamp = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        // Get total users
        const totalUsers = await User.countDocuments();

        // Get total clicks with date filter
        const totalClicks = await Click.countDocuments(dateFilter);

        // Get total purchases and revenue with date filter
        const purchases = await Purchase.find(dateFilter);
        const totalPurchases = purchases.length;
        const totalRevenue = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

        // Get recent campaigns with performance metrics
        const recentCampaigns = await Campaign
            .find()
            .sort({ timestamp: -1 })
            .limit(5)
            .lean();

        // Get recent activities with date filter
        const recentActivities = await Click
            .find(dateFilter)
            .sort({ timestamp: -1 })
            .limit(10)
            .lean();

        // Format campaign data
        const formattedCampaigns = recentCampaigns.map(campaign => ({
            name: campaign.name,
            openRate: campaign.opens / campaign.sent,
            clickRate: campaign.clicks / campaign.sent,
            conversionRate: campaign.conversions / campaign.sent
        }));

        // Format activity data
        const formattedActivities = recentActivities.map(activity => ({
            timestamp: activity.timestamp,
            email: activity.email,
            type: activity.type,
            details: activity.details
        }));

        res.json({
            users: totalUsers,
            clicks: totalClicks,
            purchases: totalPurchases,
            totalRevenue,
            recentCampaigns: formattedCampaigns,
            purchases,
            recentActivities: formattedActivities
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ error: 'Failed to fetch analytics data' });
    }
});

// Notification API endpoint
app.post('/api/notifications', async (req, res) => {
    try {
        const { type, data } = req.body;
        await notifications.sendNotification(type, data);
        res.json({ success: true, message: 'Notification sent successfully' });
    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).json({ error: 'Failed to send notification' });
    }
});

// Get all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find().lean();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get customer data
app.get('/api/customer-data/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const [activities, purchases] = await Promise.all([
            Click.find({ email }).lean(),
            Purchase.find({ email }).lean()
        ]);
        
        res.json({
            activities,
            purchases
        });
    } catch (error) {
        console.error('Error fetching customer data:', error);
        res.status(500).json({ error: 'Failed to fetch customer data' });
    }
});

// Schedule export
app.post('/api/schedule-export', async (req, res) => {
    try {
        const { scheduleType, scheduleTime, emails } = req.body;
        
        // Validate schedule type
        if (!['daily', 'weekly', 'monthly'].includes(scheduleType)) {
            return res.status(400).json({ error: 'Invalid schedule type' });
        }

        // Validate time format
        if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(scheduleTime)) {
            return res.status(400).json({ error: 'Invalid time format' });
        }

        // Validate emails
        const emailList = emails.split(',').map(email => email.trim());
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailList.every(email => emailRegex.test(email))) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Save schedule to database
        const schedule = new Schedule({
            type: scheduleType,
            time: scheduleTime,
            emails: emailList,
            lastRun: null,
            nextRun: calculateNextRun(scheduleType, scheduleTime)
        });
        await schedule.save();

        res.json({ success: true, message: 'Export schedule saved successfully' });
    } catch (error) {
        console.error('Error saving schedule:', error);
        res.status(500).json({ error: 'Failed to save schedule' });
    }
});

// Helper function to calculate next run time
function calculateNextRun(type, time) {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const nextRun = new Date(now);
    
    nextRun.setHours(hours, minutes, 0, 0);
    
    if (nextRun <= now) {
        if (type === 'daily') {
            nextRun.setDate(nextRun.getDate() + 1);
        } else if (type === 'weekly') {
            nextRun.setDate(nextRun.getDate() + 7);
        } else if (type === 'monthly') {
            nextRun.setMonth(nextRun.getMonth() + 1);
        }
    }
    
    return nextRun;
}

// Serve the main HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Environment:', process.env.NODE_ENV);
}); 