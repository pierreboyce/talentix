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

    return NextResponse.json({ url: session.url });

  } catch (error) {
    
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
