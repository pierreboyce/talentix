import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { database } from '../../../../lib/database-vercel-kv';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, adminKey } = body;

    // Simple admin key check
    if (adminKey !== 'downgrade_talentix_2024') {
      return NextResponse.json({ error: 'Invalid admin key' }, { status: 401 });
    }

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    console.log('🔄 Downgrading user to free tier:', email);

    // Find the user in our database
    const user = await database.findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    // If user has a Stripe customer ID, cancel their subscription
    if (user.stripeCustomerId) {
      try {
        // Get all active subscriptions for this customer
        const subscriptions = await stripe.subscriptions.list({
          customer: user.stripeCustomerId,
          status: 'active',
          limit: 10,
        });

        console.log(`📊 Found ${subscriptions.data.length} active subscriptions`);

        // Cancel all active subscriptions
        for (const subscription of subscriptions.data) {
          await stripe.subscriptions.cancel(subscription.id);
          console.log('✅ Cancelled Stripe subscription:', subscription.id);
        }
      } catch (stripeError: any) {
        console.log('⚠️ Stripe cancellation error:', stripeError.message);
        // Continue with database update even if Stripe fails
      }
    }

    // Update user in our database to free tier
    const updateResult = await database.updateUserSubscription(email, {
      stripeCustomerId: user.stripeCustomerId || '',
      stripeSubscriptionId: null,
      tier: 'free',
      status: 'canceled',
      currentPeriodEnd: new Date(),
      cancelAtPeriodEnd: false,
      priceId: null
    });

    if (updateResult) {
      console.log('✅ User downgraded to free tier in database:', email);
      
      return NextResponse.json({
        success: true,
        message: `Successfully downgraded ${email} to free tier`,
        user: {
          email: email,
          tier: 'free',
          status: 'canceled',
          stripeCustomerId: user.stripeCustomerId,
          updatedAt: new Date().toISOString()
        }
      });
    } else {
      return NextResponse.json({ error: 'Failed to update user in database' }, { status: 500 });
    }

  } catch (error: any) {
    console.error('❌ Error downgrading user:', error);
    return NextResponse.json({ 
      error: `Downgrade failed: ${error.message}` 
    }, { status: 500 });
  }
}







