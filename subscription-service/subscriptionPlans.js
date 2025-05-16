const SUBSCRIPTION_PLANS = {
    FREE: {
        name: 'Free',
        price: 0,
        features: [
            'Basic fertility calculator',
            'Email notifications',
            'Basic period tracking'
        ],
        stripeProductId: null, // Free plan doesn't need Stripe integration
        interval: 'month'
    },
    BASIC: {
        name: 'Basic',
        price: 9.99,
        features: [
            'Advanced fertility calculator',
            'Email notifications',
            'Period tracking',
            'Ovulation predictions',
            'Basic health insights'
        ],
        stripeProductId: 'prod_basic', // You'll need to replace this with your actual Stripe product ID
        interval: 'month'
    },
    PREMIUM: {
        name: 'Premium',
        price: 19.99,
        features: [
            'Advanced fertility calculator',
            'Priority email notifications',
            'Advanced period tracking',
            'Precise ovulation predictions',
            'Detailed health insights',
            'Personalized fertility reports',
            'Priority support'
        ],
        stripeProductId: 'prod_premium', // You'll need to replace this with your actual Stripe product ID
        interval: 'month'
    }
};

const PLAN_FEATURES = {
    calculator: {
        FREE: {
            updateFrequency: 'daily',
            dataPoints: 'basic'
        },
        BASIC: {
            updateFrequency: 'hourly',
            dataPoints: 'advanced'
        },
        PREMIUM: {
            updateFrequency: 'realtime',
            dataPoints: 'comprehensive'
        }
    },
    notifications: {
        FREE: {
            email: true,
            sms: false,
            frequency: 'weekly'
        },
        BASIC: {
            email: true,
            sms: true,
            frequency: 'daily'
        },
        PREMIUM: {
            email: true,
            sms: true,
            frequency: 'custom',
            priority: true
        }
    },
    support: {
        FREE: {
            type: 'email',
            responseTime: '48h'
        },
        BASIC: {
            type: 'email',
            responseTime: '24h'
        },
        PREMIUM: {
            type: 'priority',
            responseTime: '4h',
            phone: true
        }
    }
};

module.exports = {
    SUBSCRIPTION_PLANS,
    PLAN_FEATURES,
    getPlanFeatures: (planType) => PLAN_FEATURES[planType] || null,
    getPlanPrice: (planName) => SUBSCRIPTION_PLANS[planName]?.price || 0,
    isPremiumFeature: (feature, planName) => {
        const plan = SUBSCRIPTION_PLANS[planName];
        return plan?.features.includes(feature) || false;
    }
}; 