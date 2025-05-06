const { User, Click, Purchase, Campaign } = require('./db');
const mongoose = require('mongoose');

// Sample data
const sampleUsers = [
    { email: 'user1@example.com', age: 28, lastPeriod: new Date('2024-03-01'), cycleLength: 28 },
    { email: 'user2@example.com', age: 32, lastPeriod: new Date('2024-03-05'), cycleLength: 30 },
    { email: 'user3@example.com', age: 25, lastPeriod: new Date('2024-03-10'), cycleLength: 29 }
];

const sampleClicks = [
    { email: 'user1@example.com', productType: 'menstrual_care', ipAddress: '192.168.1.1', userAgent: 'Chrome/Windows' },
    { email: 'user2@example.com', productType: 'fertility_tracking', ipAddress: '192.168.1.2', userAgent: 'Safari/Mac' },
    { email: 'user3@example.com', productType: 'wellness', ipAddress: '192.168.1.3', userAgent: 'Firefox/Linux' }
];

const samplePurchases = [
    { email: 'user1@example.com', productType: 'menstrual_care', amount: 49.99, orderId: 'ORD001' },
    { email: 'user2@example.com', productType: 'fertility_tracking', amount: 79.99, orderId: 'ORD002' },
    { email: 'user3@example.com', productType: 'wellness', amount: 29.99, orderId: 'ORD003' }
];

const sampleCampaigns = [
    { name: 'Spring Wellness', sentDate: new Date('2024-03-01'), openRate: 0.25, clickRate: 0.15, conversionRate: 0.05, revenue: 159.97 },
    { name: 'Fertility Focus', sentDate: new Date('2024-03-15'), openRate: 0.30, clickRate: 0.20, conversionRate: 0.08, revenue: 239.97 }
];

async function populateDatabase() {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Click.deleteMany({});
        await Purchase.deleteMany({});
        await Campaign.deleteMany({});

        // Insert sample data
        await User.insertMany(sampleUsers);
        await Click.insertMany(sampleClicks);
        await Purchase.insertMany(samplePurchases);
        await Campaign.insertMany(sampleCampaigns);

        console.log('Database populated with sample data successfully!');
        
        // Display counts
        const userCount = await User.countDocuments();
        const clickCount = await Click.countDocuments();
        const purchaseCount = await Purchase.countDocuments();
        const campaignCount = await Campaign.countDocuments();

        console.log('\nSample Data Counts:');
        console.log(`Users: ${userCount}`);
        console.log(`Clicks: ${clickCount}`);
        console.log(`Purchases: ${purchaseCount}`);
        console.log(`Campaigns: ${campaignCount}`);

    } catch (error) {
        console.error('Error populating database:', error);
    } finally {
        mongoose.disconnect();
    }
}

// Run the population script
populateDatabase(); 