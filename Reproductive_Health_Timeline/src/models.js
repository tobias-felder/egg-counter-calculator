const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true
    },
    lastPeriodDate: {
        type: Date,
        required: true
    },
    cycleLength: {
        type: Number,
        default: 28
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastActive: {
        type: Date,
        default: Date.now
    },
    notificationPreferences: {
        email: {
            type: Boolean,
            default: true
        },
        sms: {
            type: Boolean,
            default: false
        }
    }
});

// Click Schema (tracks user interactions)
const clickSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    type: {
        type: String,
        required: true,
        enum: ['calculator', 'product', 'campaign', 'notification']
    },
    details: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    ipAddress: String,
    userAgent: String
});

// Purchase Schema
const purchaseSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    productType: {
        type: String,
        required: true,
        enum: ['menstrual_care', 'fertility_tracking', 'wellness']
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    affiliateId: String,
    commission: Number
});

// Campaign Schema
const campaignSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['email', 'sms', 'push']
    },
    targetAudience: {
        type: String,
        required: true,
        enum: ['all', 'new_users', 'active_users', 'inactive_users']
    },
    sent: {
        type: Number,
        default: 0
    },
    opens: {
        type: Number,
        default: 0
    },
    clicks: {
        type: Number,
        default: 0
    },
    conversions: {
        type: Number,
        default: 0
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: Date,
    status: {
        type: String,
        required: true,
        enum: ['draft', 'scheduled', 'active', 'completed', 'cancelled'],
        default: 'draft'
    }
});

// Create and export models
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