const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    age: Number,
    lastPeriod: Date,
    cycleLength: Number,
    createdAt: { type: Date, default: Date.now },
    lastCalculated: Date,
    emailPreferences: {
        productRecommendations: { type: Boolean, default: true },
        cycleReminders: { type: Boolean, default: true }
    }
});

// Click Tracking Schema
const clickSchema = new mongoose.Schema({
    email: String,
    productType: String,
    timestamp: { type: Date, default: Date.now },
    ipAddress: String,
    userAgent: String,
    converted: { type: Boolean, default: false },
    conversionValue: Number,
    affiliateId: String
});

// Purchase Tracking Schema
const purchaseSchema = new mongoose.Schema({
    email: String,
    productType: String,
    timestamp: { type: Date, default: Date.now },
    amount: Number,
    commission: Number,
    orderId: String,
    affiliateId: String
});

// Email Campaign Schema
const campaignSchema = new mongoose.Schema({
    name: String,
    sentDate: Date,
    openRate: Number,
    clickRate: Number,
    conversionRate: Number,
    revenue: Number,
    affiliateId: String
});

// Create models
const User = mongoose.model('User', userSchema);
const Click = mongoose.model('Click', clickSchema);
const Purchase = mongoose.model('Purchase', purchaseSchema);
const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = {
    User,
    Click,
    Purchase,
    Campaign
}; 