const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const subscriptionService = require('../subscription-service/subscriptionService');
const { SUBSCRIPTION_PLANS } = require('../subscription-service/subscriptionPlans');

class PaymentService {
    constructor() {
        if (!process.env.STRIPE_SECRET_KEY) {
            console.error('Stripe secret key is missing');
            return;
        }
        this.stripe = stripe;
    }

    async createCustomer({ email, name, paymentMethod }) {
        try {
            const customer = await this.stripe.customers.create({
                email,
                name,
                payment_method: paymentMethod,
                invoice_settings: {
                    default_payment_method: paymentMethod,
                },
            });
            return customer;
        } catch (error) {
            console.error('Error creating customer:', error);
            throw error;
        }
    }

    async createSubscription({ email, planName, paymentMethod, customerName }) {
        try {
            const plan = SUBSCRIPTION_PLANS[planName];
            if (!plan || !plan.stripeProductId) {
                throw new Error('Invalid plan or free plan selected');
            }

            // Create or get customer
            let customer;
            try {
                customer = await this.stripe.customers.list({ email, limit: 1 });
                customer = customer.data[0];
            } catch (error) {
                console.log('Customer not found, creating new customer');
            }

            if (!customer) {
                customer = await this.createCustomer({
                    email,
                    name: customerName,
                    paymentMethod
                });
            }

            // Create subscription
            const subscription = await this.stripe.subscriptions.create({
                customer: customer.id,
                items: [{ price: plan.stripeProductId }],
                payment_settings: {
                    payment_method_types: ['card'],
                    save_default_payment_method: 'on_subscription'
                },
                expand: ['latest_invoice.payment_intent']
            });

            // Update local subscription record
            await subscriptionService.createSubscription({
                email,
                plan: planName,
                stripeCustomerId: customer.id,
                stripeSubscriptionId: subscription.id,
                stripePaymentMethodId: paymentMethod
            });

            return {
                subscriptionId: subscription.id,
                clientSecret: subscription.latest_invoice.payment_intent.client_secret
            };
        } catch (error) {
            console.error('Error creating subscription:', error);
            throw error;
        }
    }

    async cancelSubscription(email) {
        try {
            const subscription = await subscriptionService.getSubscription(email);
            if (!subscription || !subscription.stripeSubscriptionId) {
                throw new Error('Subscription not found');
            }

            // Cancel the subscription in Stripe
            await this.stripe.subscriptions.del(subscription.stripeSubscriptionId);

            // Update local subscription record
            await subscriptionService.cancelSubscription(email);

            return { success: true, message: 'Subscription cancelled successfully' };
        } catch (error) {
            console.error('Error cancelling subscription:', error);
            throw error;
        }
    }

    async updateSubscription({ email, newPlanName }) {
        try {
            const subscription = await subscriptionService.getSubscription(email);
            if (!subscription || !subscription.stripeSubscriptionId) {
                throw new Error('Subscription not found');
            }

            const newPlan = SUBSCRIPTION_PLANS[newPlanName];
            if (!newPlan || !newPlan.stripeProductId) {
                throw new Error('Invalid plan selected');
            }

            // Update the subscription in Stripe
            const updatedSubscription = await this.stripe.subscriptions.update(
                subscription.stripeSubscriptionId,
                {
                    items: [{
                        id: subscription.stripeSubscriptionId,
                        price: newPlan.stripeProductId
                    }],
                    proration_behavior: 'create_prorations'
                }
            );

            // Update local subscription record
            await subscriptionService.updateSubscription(email, {
                plan: newPlanName
            });

            return {
                success: true,
                subscriptionId: updatedSubscription.id,
                plan: newPlanName
            };
        } catch (error) {
            console.error('Error updating subscription:', error);
            throw error;
        }
    }

    async getSubscriptionStatus(email) {
        try {
            const subscription = await subscriptionService.getSubscription(email);
            if (!subscription || !subscription.stripeSubscriptionId) {
                return { status: 'inactive' };
            }

            const stripeSubscription = await this.stripe.subscriptions.retrieve(
                subscription.stripeSubscriptionId
            );

            return {
                status: stripeSubscription.status,
                currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
                cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end
            };
        } catch (error) {
            console.error('Error getting subscription status:', error);
            throw error;
        }
    }
}

module.exports = new PaymentService(); 