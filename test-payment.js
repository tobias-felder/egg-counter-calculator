const PaymentService = require('./payment-service/paymentService');
require('dotenv').config();

async function testPaymentService() {
    console.log('Starting payment service test...');
    
    // Check if Stripe secret key is set
    console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'Set' : 'Not set');
    
    try {
        // 1. Test payment intent creation
        console.log('\n1. Testing payment intent creation...');
        const paymentIntent = await PaymentService.createPaymentIntent(9.99);
        console.log('Payment intent created:', paymentIntent);
        
        if (!paymentIntent.success) {
            throw new Error('Failed to create payment intent');
        }
        
        // 2. Test subscription creation
        console.log('\n2. Testing subscription creation...');
        const subscription = await PaymentService.createSubscription('test@example.com', 'monthly');
        console.log('Subscription created:', subscription);
        
        if (!subscription.success) {
            throw new Error('Failed to create subscription');
        }
        
        // Note: In a real application, you would use Stripe Elements on the frontend
        // to collect card details and create a payment method. For testing purposes,
        // you would need to use Stripe's test tokens or enable raw card data APIs
        // in your Stripe account settings.
        
        console.log('\nTest completed. Note: To complete the payment flow, you need to:');
        console.log('1. Use Stripe Elements on the frontend to collect card details');
        console.log('2. Create a payment method using the card details');
        console.log('3. Confirm the payment intent with the payment method');
        console.log('4. Handle the payment success webhook');
        
    } catch (error) {
        console.error('Error in payment service test:', error);
    }
}

testPaymentService(); 
require('dotenv').config();

async function testPaymentService() {
    console.log('Starting payment service test...');
    
    // Check if Stripe secret key is set
    console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'Set' : 'Not set');
    
    try {
        // 1. Test payment intent creation
        console.log('\n1. Testing payment intent creation...');
        const paymentIntent = await PaymentService.createPaymentIntent(9.99);
        console.log('Payment intent created:', paymentIntent);
        
        if (!paymentIntent.success) {
            throw new Error('Failed to create payment intent');
        }
        
        // 2. Test subscription creation
        console.log('\n2. Testing subscription creation...');
        const subscription = await PaymentService.createSubscription('test@example.com', 'monthly');
        console.log('Subscription created:', subscription);
        
        if (!subscription.success) {
            throw new Error('Failed to create subscription');
        }
        
        // Note: In a real application, you would use Stripe Elements on the frontend
        // to collect card details and create a payment method. For testing purposes,
        // you would need to use Stripe's test tokens or enable raw card data APIs
        // in your Stripe account settings.
        
        console.log('\nTest completed. Note: To complete the payment flow, you need to:');
        console.log('1. Use Stripe Elements on the frontend to collect card details');
        console.log('2. Create a payment method using the card details');
        console.log('3. Confirm the payment intent with the payment method');
        console.log('4. Handle the payment success webhook');
        
    } catch (error) {
        console.error('Error in payment service test:', error);
    }
}

testPaymentService(); 