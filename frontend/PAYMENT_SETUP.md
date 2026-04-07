# Stripe Configuration

## Setup Instructions

### 1. Install Stripe
```bash
npm install @stripe/stripe-js
```

### 2. Get Stripe Keys
1. Sign up at https://stripe.com
2. Go to Developers → API Keys
3. Copy your Publishable Key and Secret Key

### 3. Add to .env
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

### 4. Backend Setup (Optional)
For production, you'll need a backend endpoint to create payment sessions:

```typescript
// backend/src/routes/payment.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

app.post('/api/create-checkout-session', async (req, res) => {
  const { priceId, plan } = req.body;
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/pricing`,
  });

  res.json({ sessionId: session.id });
});
```

### 5. Stripe Price IDs
Create products and prices in Stripe Dashboard:
- Pro Monthly: `price_xxx`
- Pro Yearly: `price_yyy`
- Enterprise Monthly: `price_zzz`
- Enterprise Yearly: `price_aaa`

Add these to your environment variables.

---

## Alternative: Razorpay

### Setup
```bash
npm install razorpay
```

### Configuration
```env
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_here
```

### Usage
```typescript
const options = {
  key: import.meta.env.VITE_RAZORPAY_KEY_ID,
  amount: price * 100, // Amount in paise
  currency: 'INR',
  name: 'SafeSim',
  description: `${plan} Subscription`,
  handler: function (response) {
    // Handle success
  },
};

const razorpay = new window.Razorpay(options);
razorpay.open();
```
