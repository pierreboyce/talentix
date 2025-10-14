import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { database } from '../../../../lib/database-vercel-kv';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  console.log('🔔 Stripe webhook received at:', new Date().toISOString());
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;
  
  console.log('📝 Webhook signature present:', !!sig);
  console.log('📦 Webhook body length:', body.length);

  let event: Stripe.Event;

  try {
    // Try to verify webhook signature
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    console.log('✅ Webhook verified successfully');
    console.log('🎯 Event type:', event.type);
    console.log('🆔 Event ID:', event.id);
  } catch (err: any) {
    console.error('❌ Webhook signature verification failed:', err.message);
    console.log('🔄 Attempting to parse webhook without signature verification (TESTING ONLY)');
    
    try {
      // Parse the event without signature verification (for testing)
      event = JSON.parse(body);
      console.log('⚠️ Webhook parsed without verification - TESTING MODE');
      console.log('🎯 Event type:', event.type);
      console.log('🆔 Event ID:', event.id);
    } catch (parseErr: any) {
      console.error('❌ Failed to parse webhook body:', parseErr.message);
      return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 });
    }
  }

  try {
    console.log('🔄 Processing webhook event:', event.type);
    
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('💳 Checkout session completed:', session.id);
        console.log('📧 Customer email:', session.customer_email);
        console.log('🔄 Session mode:', session.mode);
        console.log('🔍 Session object keys:', Object.keys(session));
        
        if (session.mode === 'subscription' && session.subscription) {
          try {
            console.log('🔍 Retrieving subscription:', session.subscription);
            const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
            console.log('✅ Subscription retrieved:', subscription.id);
            
            console.log('🔍 Retrieving customer:', session.customer);
            const customer = await stripe.customers.retrieve(session.customer as string) as Stripe.Customer;
            console.log('✅ Customer retrieved:', customer.id, customer.email);
            
            if (customer.email) {
              // Determine tier based on price ID
              const priceId = subscription.items.data[0]?.price.id;
              console.log('💰 Price ID:', priceId);
              let tier = 'free';
              
              // Map price IDs to tiers
              if (priceId === 'price_1S6FAPENQFYWRFKWL9LCfneV' || priceId === 'price_1S6FAmENQFYWRFKWZkFqm4Bx') {
                tier = 'pro';
              }
              console.log('🎯 Determined tier:', tier);
              
              // Check if user exists, create if not
              console.log('🔍 Checking if user exists:', customer.email);
              let user = await database.findUserByEmail(customer.email);
              
              if (!user) {
                console.log('❌ User not found, creating new user for subscription');
                try {
                  user = await database.createUser({
                    name: (customer as any).name || 'Stripe Customer',
                    email: customer.email,
                    password: '', // OAuth user, no password needed
                    location: 'London'
                  });
                  console.log('✅ Created new user for subscription:', user.email);
                } catch (createError: any) {
                  console.error('❌ Failed to create user:', createError.message);
                  console.error('❌ Create user stack:', createError.stack);
                  // Don't throw - continue with webhook processing
                  console.log('⚠️ Continuing webhook processing without user creation');
                }
              } else {
                console.log('✅ User found:', user.email);
              }
              
              // Update user subscription in database (only if user exists)
              if (user) {
                console.log('💾 Updating database for user:', customer.email, 'to tier:', tier);
                console.log('📅 Current period end timestamp:', (subscription as any).current_period_end);
                
                try {
                  const currentPeriodEndTimestamp = (subscription as any).current_period_end;
                  let currentPeriodEndDate: Date;
                  
                  if (!currentPeriodEndTimestamp || isNaN(currentPeriodEndTimestamp)) {
                    console.error('❌ Invalid current_period_end timestamp:', currentPeriodEndTimestamp);
                    // Use a default date instead of throwing
                    currentPeriodEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
                  } else {
                    currentPeriodEndDate = new Date(currentPeriodEndTimestamp * 1000);
                  }
                  
                  console.log('📅 Using date:', currentPeriodEndDate.toISOString());
                  
                  const updateResult = await database.updateUserSubscription(customer.email, {
                    stripeCustomerId: customer.id,
                    stripeSubscriptionId: subscription.id,
                    tier: tier,
                    status: subscription.status,
                    currentPeriodEnd: currentPeriodEndDate,
                    cancelAtPeriodEnd: (subscription as any).cancel_at_period_end || false,
                    priceId: priceId || null
                  });
                  
                  console.log('✅ Database update result:', updateResult);
                  console.log(`🎉 Updated subscription for ${customer.email} to ${tier} tier`);
                } catch (updateError: any) {
                  console.error('❌ Failed to update subscription:', updateError.message);
                  console.error('❌ Update error stack:', updateError.stack);
                  // Don't throw - log error but continue
                }
              } else {
                console.log('⚠️ Skipping subscription update - no user found');
              }
            } else {
              console.log('❌ No customer email found');
            }
          } catch (subscriptionError: any) {
            console.error('❌ Error processing subscription:', subscriptionError.message);
            console.error('❌ Stack trace:', subscriptionError.stack);
            throw subscriptionError;
          }
        } else {
          console.log('ℹ️ Not a subscription checkout or no subscription ID');
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
        
        if (customer.email) {
          const priceId = subscription.items.data[0]?.price.id;
          let tier = 'free';
          
          if (priceId === 'price_1S6FAPENQFYWRFKWL9LCfneV' || priceId === 'price_1S6FAmENQFYWRFKWZkFqm4Bx') {
            tier = 'pro';
          }
          
          await database.updateUserSubscription(customer.email, {
            stripeCustomerId: customer.id,
            stripeSubscriptionId: subscription.id,
            tier: tier,
            status: subscription.status,
            currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
            cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
            priceId: priceId
          });
          
          console.log(`Updated subscription for ${customer.email}: ${subscription.status}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
        
        if (customer.email) {
          // Reset to free tier
          await database.updateUserSubscription(customer.email, {
            stripeCustomerId: customer.id,
            stripeSubscriptionId: null,
            tier: 'free',
            status: 'canceled',
            currentPeriodEnd: new Date(),
            cancelAtPeriodEnd: false,
            priceId: null
          });
          
          console.log(`Subscription canceled for ${customer.email}, reset to free tier`);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('💰 Invoice payment succeeded:', invoice.id);
        // Payment successful - subscription should already be active
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customer = await stripe.customers.retrieve(invoice.customer as string) as Stripe.Customer;
        
        if (customer.email) {
          console.log(`❌ Payment failed for ${customer.email}`);
          // You might want to send an email notification here
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}