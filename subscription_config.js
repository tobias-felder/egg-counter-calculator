const subscriptionTiers = {
  basic: {
    name: 'Basic',
    price: 9.99,
    features: [
      'Basic egg count calculator',
      'Monthly cycle tracking',
      'Email notifications',
      'Up to 50 SMS notifications/month'
    ],
    limits: {
      smsPerMonth: 50,
      emailsPerMonth: 'Unlimited',
      dataRetention: '3 months'
    }
  },
  premium: {
    name: 'Premium', 
    price: 19.99,
    features: [
      'All Basic features',
      'Unlimited SMS notifications',
      'Custom alert scheduling',
      'Priority support',
      'Advanced cycle predictions',
      'Export data functionality'
    ],
    limits: {
      smsPerMonth: 'Unlimited',
      emailsPerMonth: 'Unlimited',
      dataRetention: '1 year'
    }
  },
  enterprise: {
    name: 'Enterprise',
    price: 49.99,
    features: [
      'All Premium features',
      'White-label solution',
      'Custom branding',
      'API access',
      'Multiple user accounts',
      'Dedicated account manager',
      'Custom SMS templates',
      'Advanced analytics'
    ],
    limits: {
      smsPerMonth: 'Unlimited',
      emailsPerMonth: 'Unlimited',
      dataRetention: '3 years',
      customFeatures: true
    }
  }
};

// SMS cost tracking helper
const smsTracking = {
  calculateUsage: (userTier, smsCount) => {
    const tier = subscriptionTiers[userTier];
    if (!tier) return { exceeded: true };
    
    if (tier.limits.smsPerMonth === 'Unlimited') {
      return { exceeded: false };
    }
    
    return {
      exceeded: smsCount > tier.limits.smsPerMonth,
      remaining: Math.max(0, tier.limits.smsPerMonth - smsCount)
    };
  }
};

module.exports = {
  subscriptionTiers,
  smsTracking
}; 