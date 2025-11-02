import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import jwt from 'jsonwebtoken';
import { database } from '../../../../lib/database-vercel-kv';
import { rateLimiters, createRateLimitResponse } from '../../../../lib/rate-limiter';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export async function POST(request: NextRequest) {
  try {
    // 🛡️ Rate limiting check - 5 requests per minute for payment operations
    const rateLimitResult = await rateLimiters.payment.checkLimit(request);
    if (!rateLimitResult.allowed) {
      console.log('🚫 Stripe checkout creation rate limit exceeded');
      return createRateLimitResponse(rateLimitResult.resetTime);
    }
    console.log(`✅ Payment rate limit passed. Remaining: ${rateLimitResult.remaining}`);

    // Skip JWT validation - allow direct subscription creation
    const body = await request.json();
    const { priceId, userEmail } = body;

    console.log('🛒 Creating checkout session for:', {
      priceId,
      userEmail,
      timestamp: new Date().toISOString()
    });

    if (!priceId) {
      return NextResponse.json(
        { error: 'Missing price ID' },
        { status: 400 }
      );
    }

    if (!userEmail) {
      return NextResponse.json(
        { error: 'Missing user email' },
        { status: 400 }
      );
    }

    // Ensure user exists in database (create if needed)
    let user = await database.findUserByEmail(userEmail);
    if (!user) {
      console.log('⚠️ User not found, creating basic user entry');
      try {
        user = await database.createUser({
          name: 'Talentix User',
          email: userEmail,
          password: '', // No password for checkout-only users
          location: 'London'
        });
        console.log('✅ Created user entry for checkout:', userEmail);
      } catch (createError: any) {
        console.log('⚠️ User creation failed, continuing with checkout:', createError.message);
      }
    }

    console.log('✅ User verified for checkout:', userEmail);

    // Create or get existing customer
    const customers = await stripe.customers.list({
      email: userEmail,
      limit: 1,
    });

    let customerId: string;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log('✅ Found existing Stripe customer:', {
        customerId,
        email: customers.data[0].email
      });
    } else {
      const customer = await stripe.customers.create({
        email: userEmail,
      });
      customerId = customer.id;
      console.log('➕ Created new Stripe customer:', {
        customerId,
        email: customer.email
      });
    }

    // Validate the price exists and is active
    try {
      const price = await stripe.prices.retrieve(priceId);
      console.log('✅ Price validated:', {
        priceId,
        active: price.active,
        type: price.type,
        recurring: price.recurring ? {
          interval: price.recurring.interval,
          intervalCount: price.recurring.interval_count
        } : null
      });
      
      if (!price.active) {
        return NextResponse.json(
          { error: 'This price is no longer available. Please contact support or try a different subscription plan.' },
          { status: 400 }
        );
      }
      
      // Ensure it's a recurring price for subscriptions
      if (price.type !== 'recurring') {
        return NextResponse.json(
          { error: 'Invalid price type. Only recurring subscriptions are supported.' },
          { status: 400 }
        );
      }
    } catch (priceError: any) {
      console.error('❌ Price validation failed:', priceError.message);
      if (priceError.code === 'resource_missing') {
        return NextResponse.json(
          { error: 'The subscription price is not found. Please update the price ID or contact support.' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: `Price validation failed: ${priceError.message}` },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXTAUTH_URL || 'https://talentix.co.uk'}/dashboard?subscription=success`,
      cancel_url: `${process.env.NEXTAUTH_URL || 'https://talentix.co.uk'}/?subscription=canceled`,
      allow_promotion_codes: true,
      metadata: {
        priceId: priceId,
        userEmail: userEmail,
      },
    });

    console.log('✅ Checkout session created:', {
      sessionId: session.id,
      url: session.url,
      priceId
    });

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error('❌ Stripe checkout creation error:', {
      message: error.message,
      type: error.type,
      code: error.code,
      priceId: error.request?.body?.line_items?.[0]?.price
    });
    
    let errorMessage = 'Failed to create checkout session';
    if (error.type === 'StripeInvalidRequestError') {
      if (error.code === 'resource_missing') {
        errorMessage = 'The subscription price is not found. Please update the price ID in your Stripe dashboard or contact support.';
      } else {
        errorMessage = `Stripe error: ${error.message}`;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage, details: error.message },
      { status: 500 }
    );
  }
}
