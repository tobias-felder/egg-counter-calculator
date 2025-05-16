import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ plan, onSubscriptionComplete }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true);

        if (!stripe || !elements) {
            return;
        }

        const { error: cardError, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement),
        });

        if (cardError) {
            setError(cardError.message);
            setProcessing(false);
            return;
        }

        try {
            const response = await fetch('/api/subscriptions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    plan: plan.name,
                    paymentMethodId: paymentMethod.id,
                }),
            });

            const data = await response.json();

            if (data.error) {
                setError(data.error);
                setProcessing(false);
                return;
            }

            const { clientSecret } = data;

            const { error: confirmError } = await stripe.confirmCardPayment(clientSecret);

            if (confirmError) {
                setError(confirmError.message);
            } else {
                onSubscriptionComplete(data);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        }

        setProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} className="subscription-form">
            <div className="card-element-container">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button
                type="submit"
                disabled={!stripe || processing}
                className="subscribe-button"
            >
                {processing ? 'Processing...' : `Subscribe to ${plan.name}`}
            </button>
        </form>
    );
};

const PlanCard = ({ plan, selected, onSelect }) => (
    <div className={`plan-card ${selected ? 'selected' : ''}`} onClick={onSelect}>
        <h3>{plan.name}</h3>
        <div className="price">${plan.price}/month</div>
        <ul className="features">
            {plan.features.map((feature, index) => (
                <li key={index}>{feature}</li>
            ))}
        </ul>
        {selected && (
            <Elements stripe={stripePromise}>
                <CheckoutForm plan={plan} />
            </Elements>
        )}
    </div>
);

const SubscriptionPlans = () => {
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [subscriptionStatus, setSubscriptionStatus] = useState(null);

    useEffect(() => {
        // Fetch subscription plans
        fetch('/api/subscriptions/plans')
            .then(response => response.json())
            .then(data => setPlans(data))
            .catch(error => console.error('Error fetching plans:', error));

        // Check current subscription status
        fetch('/api/subscriptions/status')
            .then(response => response.json())
            .then(data => setSubscriptionStatus(data))
            .catch(error => console.error('Error fetching subscription status:', error));
    }, []);

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
    };

    const handleSubscriptionComplete = (data) => {
        setSubscriptionStatus(data);
        // You might want to trigger a notification or redirect here
    };

    if (!plans.length) {
        return <div>Loading plans...</div>;
    }

    return (
        <div className="subscription-plans">
            <h2>Choose Your Plan</h2>
            {subscriptionStatus?.active && (
                <div className="current-subscription">
                    <p>Current Plan: {subscriptionStatus.plan}</p>
                    <p>Next billing date: {new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString()}</p>
                </div>
            )}
            <div className="plans-container">
                {plans.map((plan) => (
                    <PlanCard
                        key={plan.name}
                        plan={plan}
                        selected={selectedPlan?.name === plan.name}
                        onSelect={() => handlePlanSelect(plan)}
                    />
                ))}
            </div>
            <style jsx>{`
                .subscription-plans {
                    padding: 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .plans-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                    margin-top: 2rem;
                }

                .plan-card {
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    padding: 2rem;
                    text-align: center;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }

                .plan-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                }

                .plan-card.selected {
                    border-color: #6772e5;
                    box-shadow: 0 4px 20px rgba(103, 114, 229, 0.2);
                }

                .price {
                    font-size: 2rem;
                    font-weight: bold;
                    color: #6772e5;
                    margin: 1rem 0;
                }

                .features {
                    list-style: none;
                    padding: 0;
                    margin: 2rem 0;
                }

                .features li {
                    margin: 0.5rem 0;
                    color: #525f7f;
                }

                .subscription-form {
                    margin-top: 2rem;
                }

                .card-element-container {
                    padding: 1rem;
                    border: 1px solid #e0e0e0;
                    border-radius: 4px;
                    background: #f8f9fa;
                }

                .subscribe-button {
                    margin-top: 1rem;
                    padding: 0.8rem 2rem;
                    background: #6772e5;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: background 0.3s ease;
                }

                .subscribe-button:hover {
                    background: #5469d4;
                }

                .subscribe-button:disabled {
                    background: #b7b7b7;
                    cursor: not-allowed;
                }

                .error-message {
                    color: #9e2146;
                    margin-top: 0.5rem;
                }

                .current-subscription {
                    background: #f8f9fa;
                    padding: 1rem;
                    border-radius: 4px;
                    margin-bottom: 2rem;
                }
            `}</style>
        </div>
    );
};

export default SubscriptionPlans; 