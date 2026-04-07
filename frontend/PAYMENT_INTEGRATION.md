# 💳 Payment Integration Guide

## ✅ Implementation Complete!

The pricing section now includes full payment integration support for both **Stripe** and **Razorpay**.

---

## 🎯 Current Status

### ✅ What's Working:
- **Demo Mode**: All pricing buttons are functional and show a demo payment flow
- **Pricing Page**: Fully integrated with payment hooks
- **Payment Hook**: Created with support for both Stripe and Razorpay
- **UI/UX**: Loading states, disabled buttons during processing
- **Billing Toggle**: Switch between monthly/yearly pricing

### 🔧 To Enable Real Payments:

#### **Option 1: Stripe (International)**

1. **Install Dependencies** ✅ (Already done!)
   ```bash
   npm install @stripe/stripe-js
   ```

2. **Get Stripe API Keys**
   - Sign up at [https://stripe.com](https://stripe.com)
   - Go to **Developers → API Keys**
   - Copy your **Publishable Key**

3. **Add to `.env`**
   ```env
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51...your_key
   ```

4. **Create Products in Stripe Dashboard**
   - Create Products for Pro and Enterprise
   - Create Prices for monthly/yearly billing
   - Note the Price IDs

5. **Update Payment Hook**
   - In `usePayment.ts`, replace `handleDemoCheckout` with `handleStripeCheckout`
   - In `PricingSection.tsx`, change the onClick handler

6. **Backend API** (Required for production)
   - Create `/api/create-checkout-session` endpoint
   - See `PAYMENT_SETUP.md` for backend code examples

#### **Option 2: Razorpay (India)**

1. **Get Razorpay Keys**
   - Sign up at [https://razorpay.com](https://razorpay.com)
   - Go to **Settings → API Keys**
   - Copy your **Key ID**

2. **Add Razorpay Script**
   ```html
   <!-- Add to frontend/index.html -->
   <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
   ```

3. **Add to `.env`**
   ```env
   VITE_RAZORPAY_KEY_ID=rzp_test_your_key
   ```

4. **Update Payment Hook**
   - In `PricingSection.tsx`, change:
   ```tsx
   handleDemoCheckout() → handleRazorpayCheckout()
   ```

---

## 📝 Usage Example

### Current Implementation (Demo Mode):
```tsx
const { handleDemoCheckout, loading } = usePayment();

// Button onClick:
handleDemoCheckout({
  name: 'Pro',
  price: 29,
  billingCycle: 'monthly',
});
```

### For Stripe:
```tsx
const { handleStripeCheckout, loading } = usePayment();

// Button onClick:
handleStripeCheckout({
  name: 'Pro',
  price: 29,
  billingCycle: 'monthly',
  priceId: 'price_1234567890', // From Stripe Dashboard
});
```

### For Razorpay:
```tsx
const { handleRazorpayCheckout, loading } = usePayment();

// Button onClick:
handleRazorpayCheckout({
  name: 'Pro',
  price: 29,
  billingCycle: 'monthly',
});
```

---

## 🎨 Features Implemented

### ✅ Payment Hook (`usePayment.ts`)
- Stripe checkout integration
- Razorpay checkout integration
- Demo mode for testing
- Loading states
- Error handling
- Both monthly and yearly billing support

### ✅ Pricing Section (`PricingSection.tsx`)
- 3 pricing tiers (Free, Pro, Enterprise)
- Monthly/Yearly toggle with 17% savings
- Payment integration on all buttons
- Loading states during checkout
- Disabled buttons during processing
- Beautiful glassmorphism design

### ✅ Environment Configuration
- `.env.example` updated with payment keys
- Support for both Stripe and Razorpay
- Easy switching between payment providers

---

## 🚀 Testing

### Demo Mode (Current):
1. Click any pricing button
2. See demo success message
3. No real payment processed

### Test Mode (After setup):
1. Use Stripe test cards: `4242 4242 4242 4242`
2. Use Razorpay test mode
3. Payments won't charge real money

### Production:
1. Replace test keys with live keys
2. Remove test mode flags
3. Deploy backend API for session creation

---

## 🔒 Security Notes

⚠️ **Important:**
- Never commit `.env` file to git (already in `.gitignore`)
- Use HTTPS in production
- Validate payments on the backend
- Store subscription data in your database
- Implement webhook handlers for payment events

---

## 📦 File Structure

```
frontend/
├── src/
│   ├── hooks/
│   │   └── usePayment.ts          ← Payment integration hook
│   ├── components/
│   │   └── PricingSection.tsx     ← Pricing UI with payment
│   └── ...
├── .env.example                    ← Environment template
├── PAYMENT_SETUP.md               ← Detailed setup guide
└── PAYMENT_INTEGRATION.md         ← This file!
```

---

## 🎯 Next Steps

1. **Choose Payment Provider**: Stripe (global) or Razorpay (India)
2. **Get API Keys**: Sign up and get test keys
3. **Update .env**: Add your keys
4. **Test**: Use test cards to verify
5. **Backend**: Create checkout session API
6. **Deploy**: Switch to live keys for production

---

## 💡 Tips

- Start with test mode to avoid real charges
- Use Stripe for international customers
- Use Razorpay for Indian customers
- You can support both simultaneously!
- Monitor payments in respective dashboards

---

## 📞 Support

For payment integration issues:
- **Stripe**: [stripe.com/docs](https://stripe.com/docs)
- **Razorpay**: [razorpay.com/docs](https://razorpay.com/docs)

---

**Ready to accept payments!** 🎉💰
