# Stripe Integration Setup Guide

## 🚀 Quick Setup Instructions

### 1. Create Stripe Account
1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete business verification if needed
3. Navigate to the Dashboard

### 2. Get API Keys
1. In Stripe Dashboard, go to **Developers** → **API keys**
2. Copy your **Publishable key** and **Secret key**
3. For webhooks, you'll also need the **Webhook signing secret**

### 3. Create Products & Prices
Create these products in your Stripe Dashboard (**Products** section):

#### Talentix Pro Monthly
- **Name**: Talentix Pro Monthly
- **Price**: £3.99/month
- **Billing**: Recurring monthly
- **Price ID**: `price_pro_monthly` (copy the actual ID from Stripe)

#### Talentix Pro Yearly  
- **Name**: Talentix Pro Yearly
- **Price**: £30.99/year
- **Billing**: Recurring yearly
- **Price ID**: `price_pro_yearly` (copy the actual ID from Stripe)

### 4. Environment Variables
Add these to your `.env.local` file:

```env
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Your site URL (for success/cancel redirects)
NEXTAUTH_URL=http://localhost:3000
```

### 5. Set Up Webhooks
1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. **Endpoint URL**: `https://your-domain.com/api/webhooks/stripe`
4. **Events to send**:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Copy the **Signing secret** to your `.env.local`

### 6. Update Price IDs
In `src/components/PricingModal.tsx`, update the price IDs with your actual Stripe price IDs:

```typescript
{
  id: 'pro',
  name: 'Talentix Pro',
  price: 3.99,
  yearlyPrice: 30.99,
  priceId: 'price_1234567890abcdef', // Replace with your monthly price ID
  yearlyPriceId: 'price_0987654321fedcba', // Replace with your yearly price ID
  // ... rest of config
}
```

## 🧪 Testing

### Test Cards (for development)
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0027 6000 3184`

Use any future expiry date, any 3-digit CVC, and any postal code.

### Webhook Testing
1. Install Stripe CLI: `npm install -g stripe`
2. Login: `stripe login`
3. Forward webhooks: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

## 🔐 Security Notes

- Never commit your secret keys to version control
- Use test keys during development
- Switch to live keys only when ready for production
- Verify webhook signatures for security

## 📊 Next Steps

After setup:
1. Test the payment flow end-to-end
2. Implement subscription status updates in your database
3. Add subscription management features
4. Set up proper error handling and user notifications

Your Stripe integration is now ready! 🎉

