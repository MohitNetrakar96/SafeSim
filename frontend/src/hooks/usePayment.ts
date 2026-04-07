import { useState } from 'react';

// Initialize Stripe
// Initialize Stripe (checking if key exists)
if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
    console.warn('VITE_STRIPE_PUBLISHABLE_KEY is missing');
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface PaymentPlan {
    name: string;
    price: number;
    billingCycle: 'monthly' | 'yearly';
    priceId?: string; // Stripe Price ID (optional if using dynamic pricing)
}

export const usePayment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Handle Stripe Checkout - Real Payment Flow
     */
    const handleStripeCheckout = async (plan: PaymentPlan) => {
        try {
            setLoading(true);
            setError(null);

            // Skip Free plan
            if (plan.name === 'Free') {
                alert('Free plan does not require payment!');
                return;
            }

            // Call backend to create checkout session
            const response = await fetch(`${API_URL}/api/payment/create-payment-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    plan: plan.name,
                    billingCycle: plan.billingCycle,
                    price: plan.price,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create checkout session');
            }

            const { url } = await response.json();

            // Redirect to Stripe Checkout
            if (url) {
                window.location.href = url;
            } else {
                throw new Error('No checkout URL returned');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Payment failed';
            setError(errorMessage);
            console.error('Payment error:', err);
            alert(`Payment Error: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle Razorpay Checkout
     */
    const handleRazorpayCheckout = (plan: PaymentPlan) => {
        try {
            setLoading(true);
            setError(null);

            // Check if Razorpay is loaded
            if (!(window as any).Razorpay) {
                throw new Error('Razorpay SDK not loaded. Add the script to your HTML.');
            }

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: plan.price * 100, // Convert to paise
                currency: 'INR',
                name: 'SafeSim',
                description: `${plan.name} ${plan.billingCycle} Subscription`,
                image: '/logo.png',
                handler: function (response: any) {
                    // Payment successful
                    console.log('Payment successful:', response);
                    alert(`🎉 Payment Successful!\n\nPayment ID: ${response.razorpay_payment_id}\n\nWelcome to SafeSim ${plan.name}!`);

                    // Redirect to success page
                    window.location.href = '/payment/success';
                },
                prefill: {
                    name: '',
                    email: '',
                    contact: '',
                },
                theme: {
                    color: '#22d3ee', // Cyan color to match your brand
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    }
                }
            };

            const razorpay = new (window as any).Razorpay(options);

            razorpay.on('payment.failed', function (response: any) {
                setError('Payment failed: ' + response.error.description);
                alert(`Payment Failed!\n\n${response.error.description}`);
                setLoading(false);
            });

            razorpay.open();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Payment failed';
            setError(errorMessage);
            console.error('Razorpay error:', err);
            alert(`Razorpay Error: ${errorMessage}`);
            setLoading(false);
        }
    };

    /**
     * Demo Mode - For testing without real payments
     */
    const handleDemoCheckout = (plan: PaymentPlan) => {
        setLoading(true);
        setTimeout(() => {
            alert(
                `🎉 Demo Mode: Successfully subscribed to ${plan.name} plan!\n\n` +
                `Price: $${plan.price}/${plan.billingCycle}\n\n` +
                `In production, this would redirect to Stripe/Razorpay checkout.`
            );
            setLoading(false);
        }, 1000);
    };

    return {
        handleStripeCheckout,
        handleRazorpayCheckout,
        handleDemoCheckout,
        loading,
        error,
    };
};
