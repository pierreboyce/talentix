import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err: any) {
    console.error(`⚠️  Webhook signature verification failed.`, err.message);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('💳 Payment successful:', session.id);
      
      // TODO: Update user subscription in your database
      // You would typically:
      // 1. Get the customer ID from session.customer
      // 2. Get the subscription ID from session.subscription
      // 3. Update your user's subscription status in your database
      
      break;
    
    case 'customer.subscription.updated':
      const subscription = event.data.object as Stripe.Subscription;
      console.log('🔄 Subscription updated:', subscription.id);
      
      // TODO: Update subscription status in your database
      
      break;
    
    case 'customer.subscription.deleted':
      const canceledSubscription = event.data.object as Stripe.Subscription;
      console.log('❌ Subscription canceled:', canceledSubscription.id);
      
      // TODO: Update subscription status to canceled in your database
      
      break;
    
    case 'invoice.payment_failed':
      const failedInvoice = event.data.object as Stripe.Invoice;
      console.log('💳 Payment failed:', failedInvoice.id);
      
      // TODO: Handle failed payment (notify user, retry, etc.)
      
      break;

    default:
      console.log(`🤷‍♀️ Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
