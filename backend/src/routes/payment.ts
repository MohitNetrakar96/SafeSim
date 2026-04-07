import express, { Request, Response } from 'express';
import Stripe from 'stripe';

const router = express.Router();

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-12-18.acacia' as any, // Type assertion for latest API version
});

// Price configuration - Map your plan names to Stripe Price IDs
// You'll need to create these in your Stripe Dashboard
const PRICE_IDS = {
    'Pro-monthly': process.env.STRIPE_PRICE_PRO_MONTHLY || 'price_pro_monthly',
    'Pro-yearly': process.env.STRIPE_PRICE_PRO_YEARLY || 'price_pro_yearly',
    'Enterprise-monthly': process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY || 'price_enterprise_monthly',
    'Enterprise-yearly': process.env.STRIPE_PRICE_ENTERPRISE_YEARLY || 'price_enterprise_yearly',
};

/**
 * Create a Stripe Checkout Session
 * POST /api/payment/create-checkout-session
 */
router.post('/create-checkout-session', async (req: Request, res: Response) => {
    try {
        const { plan, billingCycle } = req.body;

        // Validation
        if (!plan || !billingCycle) {
            return res.status(400).json({ error: 'Missing required fields: plan, billingCycle' });
        }

        // Skip Free plan
        if (plan === 'Free') {
            return res.status(400).json({ error: 'Free plan does not require payment' });
        }

        // Get the price ID
        const priceKey = `${plan}-${billingCycle}` as keyof typeof PRICE_IDS;
        const priceId = PRICE_IDS[priceKey];

        if (!priceId) {
            return res.status(400).json({ error: 'Invalid plan or billing cycle' });
        }

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/canceled`,
            metadata: {
                plan,
                billingCycle,
            },
            // Optional: Collect customer email
            customer_email: req.body.email,
            // Optional: Apply coupon codes
            allow_promotion_codes: true,
        });

        res.json({
            sessionId: session.id,
            url: session.url,
        });
    } catch (error: any) {
        console.error('Stripe checkout error:', error);
        res.status(500).json({
            error: 'Failed to create checkout session',
            message: error.message,
        });
    }
});

/**
 * Create a one-time payment (for testing without subscription)
 * POST /api/payment/create-payment-session
 */
router.post('/create-payment-session', async (req: Request, res: Response) => {
    try {
        const { plan, billingCycle, price } = req.body;

        if (!plan || !price) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create Checkout Session for one-time payment
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `SafeSim ${plan} Plan`,
                            description: `${billingCycle} subscription to SafeSim ${plan}`,
                        },
                        unit_amount: price * 100, // Convert to cents
                        recurring: {
                            interval: billingCycle === 'monthly' ? 'month' : 'year',
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/canceled`,
            metadata: {
                plan,
                billingCycle,
            },
        });

        res.json({
            sessionId: session.id,
            url: session.url,
        });
    } catch (error: any) {
        console.error('Stripe payment error:', error);
        res.status(500).json({
            error: 'Failed to create payment session',
            message: error.message,
        });
    }
});

/**
 * Get session details
 * GET /api/payment/session/:sessionId
 */
router.get('/session/:sessionId', async (req: Request, res: Response) => {
    try {
        const { sessionId } = req.params;

        if (!sessionId || typeof sessionId !== 'string') {
            return res.status(400).json({ error: 'Invalid session ID' });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        res.json({
            status: session.status,
            customerEmail: session.customer_email,
            amountTotal: session.amount_total,
            metadata: session.metadata,
        });
    } catch (error: any) {
        console.error('Session retrieval error:', error);
        res.status(500).json({
            error: 'Failed to retrieve session',
            message: error.message,
        });
    }
});

/**
 * Webhook handler for Stripe events
 * POST /api/payment/webhook
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];

    if (!sig) {
        return res.status(400).send('Missing stripe-signature header');
    }

    try {
        const event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET || ''
        );

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                console.log('Payment successful:', session);
                // TODO: Fulfill the subscription (activate user account, send email, etc.)
                break;

            case 'customer.subscription.updated':
                console.log('Subscription updated:', event.data.object);
                // TODO: Update subscription status in database
                break;

            case 'customer.subscription.deleted':
                console.log('Subscription canceled:', event.data.object);
                // TODO: Deactivate user subscription
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
    } catch (error: any) {
        console.error('Webhook error:', error);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
});

export default router;
