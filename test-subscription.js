const SubscriptionService = require('./subscription-service/subscriptionService');

async function testSubscription() {
    console.log('Starting subscription test...');

    // Test data
    const testData = {
        email: 'test@example.com',
        phone: '+1234567890',
        plan: 'monthly'
    };

    try {
        // Test creating a subscription
        console.log('Creating subscription...');
        const subscription = await SubscriptionService.createSubscription(testData);
        console.log('Subscription created:', subscription);

        // Test getting a subscription
        console.log('Getting subscription...');
        const retrievedSubscription = await SubscriptionService.getSubscription(testData.email);
        console.log('Retrieved subscription:', retrievedSubscription);

        // Test updating a subscription
        console.log('Updating subscription...');
        const updatedSubscription = await SubscriptionService.updateSubscription(testData.email, {
            plan: 'quarterly'
        });
        console.log('Updated subscription:', updatedSubscription);

        // Test getting active subscriptions
        console.log('Getting active subscriptions...');
        const activeSubscriptions = await SubscriptionService.getActiveSubscriptions();
        console.log('Active subscriptions:', activeSubscriptions);

        // Test cancelling a subscription
        console.log('Cancelling subscription...');
        const cancelledSubscription = await SubscriptionService.cancelSubscription(testData.email);
        console.log('Cancelled subscription:', cancelledSubscription);

    } catch (error) {
        console.error('Error in test script:', error);
    }
}

async function testCreateSubscription() {
    try {
        console.log('Creating test subscription...');
        
        const subscription = await SubscriptionService.createSubscription({
            email: 'test@example.com',
            plan: 'premium',
            stripeCustomerId: 'cus_test123',
            stripeSubscriptionId: 'sub_test123',
            stripePaymentMethodId: 'pm_test123'
        });

        console.log('Subscription created successfully:', subscription);

        // Get all subscriptions to verify
        const allSubscriptions = await SubscriptionService.getActiveSubscriptions();
        console.log('All active subscriptions:', allSubscriptions);

    } catch (error) {
        console.error('Error creating subscription:', error);
    }
}

async function testDifferentSubscriptions() {
    try {
        // Test 1: Basic subscription
        console.log('\nTest 1: Creating basic subscription...');
        const basicSub = await SubscriptionService.createSubscription({
            email: 'basic@example.com',
            phone: '+1987654321',
            plan: 'basic',
            stripeCustomerId: 'cus_basic123',
            stripeSubscriptionId: 'sub_basic123',
            stripePaymentMethodId: 'pm_basic123'
        });
        console.log('Basic subscription created:', basicSub);

        // Test 2: Premium subscription
        console.log('\nTest 2: Creating premium subscription...');
        const premiumSub = await SubscriptionService.createSubscription({
            email: 'premium@example.com',
            phone: '+1122334455',
            plan: 'premium',
            stripeCustomerId: 'cus_premium123',
            stripeSubscriptionId: 'sub_premium123',
            stripePaymentMethodId: 'pm_premium123'
        });
        console.log('Premium subscription created:', premiumSub);

        // Test 3: Enterprise subscription
        console.log('\nTest 3: Creating enterprise subscription...');
        const enterpriseSub = await SubscriptionService.createSubscription({
            email: 'enterprise@example.com',
            phone: '+1999888777',
            plan: 'enterprise',
            stripeCustomerId: 'cus_enterprise123',
            stripeSubscriptionId: 'sub_enterprise123',
            stripePaymentMethodId: 'pm_enterprise123'
        });
        console.log('Enterprise subscription created:', enterpriseSub);

        // Get all active subscriptions
        console.log('\nGetting all active subscriptions...');
        const allSubscriptions = await SubscriptionService.getActiveSubscriptions();
        console.log('All active subscriptions:', allSubscriptions);

    } catch (error) {
        console.error('Error in test script:', error);
    }
}

async function testUpdateSubscription() {
    try {
        console.log('\nTesting subscription update...');
        
        // Update the premium subscription
        const updateResult = await SubscriptionService.updateSubscription('premium@example.com', {
            plan: 'premium_plus',  // Upgrade the plan
            status: 'active',
            stripeCustomerId: 'cus_premium_plus123',
            stripeSubscriptionId: 'sub_premium_plus123',
            stripePaymentMethodId: 'pm_premium_plus123'
        });

        console.log('Update result:', updateResult);

        // Get the updated subscription
        const updatedSubscription = await SubscriptionService.getSubscription('premium@example.com');
        console.log('Updated subscription details:', updatedSubscription);

        // Get all active subscriptions to verify
        const allSubscriptions = await SubscriptionService.getActiveSubscriptions();
        console.log('\nAll active subscriptions after update:', allSubscriptions);

    } catch (error) {
        console.error('Error updating subscription:', error);
    }
}

async function testCancelSubscription() {
    try {
        console.log('\nTesting subscription cancellation...');
        
        // Cancel the basic subscription
        const cancelResult = await SubscriptionService.cancelSubscription('basic@example.com');
        console.log('Cancel result:', cancelResult);

        // Get the cancelled subscription
        const cancelledSubscription = await SubscriptionService.getSubscription('basic@example.com');
        console.log('Cancelled subscription details:', cancelledSubscription);

        // Get all active subscriptions to verify
        const allSubscriptions = await SubscriptionService.getActiveSubscriptions();
        console.log('\nAll active subscriptions after cancellation:', allSubscriptions);

    } catch (error) {
        console.error('Error cancelling subscription:', error);
    }
}

// Run all tests
async function runAllTests() {
    await testSubscription();
    await testCreateSubscription();
    await testDifferentSubscriptions();
    await testUpdateSubscription();
    await testCancelSubscription();
}

runAllTests(); 

async function testSubscription() {
    console.log('Starting subscription test...');

    // Test data
    const testData = {
        email: 'test@example.com',
        phone: '+1234567890',
        plan: 'monthly'
    };

    try {
        // Test creating a subscription
        console.log('Creating subscription...');
        const subscription = await SubscriptionService.createSubscription(testData);
        console.log('Subscription created:', subscription);

        // Test getting a subscription
        console.log('Getting subscription...');
        const retrievedSubscription = await SubscriptionService.getSubscription(testData.email);
        console.log('Retrieved subscription:', retrievedSubscription);

        // Test updating a subscription
        console.log('Updating subscription...');
        const updatedSubscription = await SubscriptionService.updateSubscription(testData.email, {
            plan: 'quarterly'
        });
        console.log('Updated subscription:', updatedSubscription);

        // Test getting active subscriptions
        console.log('Getting active subscriptions...');
        const activeSubscriptions = await SubscriptionService.getActiveSubscriptions();
        console.log('Active subscriptions:', activeSubscriptions);

        // Test cancelling a subscription
        console.log('Cancelling subscription...');
        const cancelledSubscription = await SubscriptionService.cancelSubscription(testData.email);
        console.log('Cancelled subscription:', cancelledSubscription);

    } catch (error) {
        console.error('Error in test script:', error);
    }
}

async function testCreateSubscription() {
    try {
        console.log('Creating test subscription...');
        
        const subscription = await SubscriptionService.createSubscription({
            email: 'test@example.com',
            plan: 'premium',
            stripeCustomerId: 'cus_test123',
            stripeSubscriptionId: 'sub_test123',
            stripePaymentMethodId: 'pm_test123'
        });

        console.log('Subscription created successfully:', subscription);

        // Get all subscriptions to verify
        const allSubscriptions = await SubscriptionService.getActiveSubscriptions();
        console.log('All active subscriptions:', allSubscriptions);

    } catch (error) {
        console.error('Error creating subscription:', error);
    }
}

async function testDifferentSubscriptions() {
    try {
        // Test 1: Basic subscription
        console.log('\nTest 1: Creating basic subscription...');
        const basicSub = await SubscriptionService.createSubscription({
            email: 'basic@example.com',
            phone: '+1987654321',
            plan: 'basic',
            stripeCustomerId: 'cus_basic123',
            stripeSubscriptionId: 'sub_basic123',
            stripePaymentMethodId: 'pm_basic123'
        });
        console.log('Basic subscription created:', basicSub);

        // Test 2: Premium subscription
        console.log('\nTest 2: Creating premium subscription...');
        const premiumSub = await SubscriptionService.createSubscription({
            email: 'premium@example.com',
            phone: '+1122334455',
            plan: 'premium',
            stripeCustomerId: 'cus_premium123',
            stripeSubscriptionId: 'sub_premium123',
            stripePaymentMethodId: 'pm_premium123'
        });
        console.log('Premium subscription created:', premiumSub);

        // Test 3: Enterprise subscription
        console.log('\nTest 3: Creating enterprise subscription...');
        const enterpriseSub = await SubscriptionService.createSubscription({
            email: 'enterprise@example.com',
            phone: '+1999888777',
            plan: 'enterprise',
            stripeCustomerId: 'cus_enterprise123',
            stripeSubscriptionId: 'sub_enterprise123',
            stripePaymentMethodId: 'pm_enterprise123'
        });
        console.log('Enterprise subscription created:', enterpriseSub);

        // Get all active subscriptions
        console.log('\nGetting all active subscriptions...');
        const allSubscriptions = await SubscriptionService.getActiveSubscriptions();
        console.log('All active subscriptions:', allSubscriptions);

    } catch (error) {
        console.error('Error in test script:', error);
    }
}

async function testUpdateSubscription() {
    try {
        console.log('\nTesting subscription update...');
        
        // Update the premium subscription
        const updateResult = await SubscriptionService.updateSubscription('premium@example.com', {
            plan: 'premium_plus',  // Upgrade the plan
            status: 'active',
            stripeCustomerId: 'cus_premium_plus123',
            stripeSubscriptionId: 'sub_premium_plus123',
            stripePaymentMethodId: 'pm_premium_plus123'
        });

        console.log('Update result:', updateResult);

        // Get the updated subscription
        const updatedSubscription = await SubscriptionService.getSubscription('premium@example.com');
        console.log('Updated subscription details:', updatedSubscription);

        // Get all active subscriptions to verify
        const allSubscriptions = await SubscriptionService.getActiveSubscriptions();
        console.log('\nAll active subscriptions after update:', allSubscriptions);

    } catch (error) {
        console.error('Error updating subscription:', error);
    }
}

async function testCancelSubscription() {
    try {
        console.log('\nTesting subscription cancellation...');
        
        // Cancel the basic subscription
        const cancelResult = await SubscriptionService.cancelSubscription('basic@example.com');
        console.log('Cancel result:', cancelResult);

        // Get the cancelled subscription
        const cancelledSubscription = await SubscriptionService.getSubscription('basic@example.com');
        console.log('Cancelled subscription details:', cancelledSubscription);

        // Get all active subscriptions to verify
        const allSubscriptions = await SubscriptionService.getActiveSubscriptions();
        console.log('\nAll active subscriptions after cancellation:', allSubscriptions);

    } catch (error) {
        console.error('Error cancelling subscription:', error);
    }
}

// Run all tests
async function runAllTests() {
    await testSubscription();
    await testCreateSubscription();
    await testDifferentSubscriptions();
    await testUpdateSubscription();
    await testCancelSubscription();
}

runAllTests(); 