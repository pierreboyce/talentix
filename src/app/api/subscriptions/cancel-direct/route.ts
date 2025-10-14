import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    console.log('🔍 Looking for Stripe customer with email:', email);

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Find the customer in Stripe by email
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      console.log('❌ No exact match found for email:', email);
      
      // Try to find customers with similar emails or active subscriptions
      console.log('🔍 Searching for similar emails or active subscriptions...');
      
      const allCustomers = await stripe.customers.list({
        limit: 100,
      });
      
      // Look for partial matches or customers with active subscriptions
      const possibleMatches = allCustomers.data.filter(customer => {
        if (!customer.email) return false;
        
        // Check for partial email matches (same domain, similar name)
        const inputParts = email.toLowerCase().split('@');
        const customerParts = customer.email.toLowerCase().split('@');
        
        // Same domain check
        if (inputParts[1] === customerParts[1]) {
          console.log('🔍 Found customer with same domain:', customer.email);
          return true;
        }
        
        return false;
      });
      
      if (possibleMatches.length > 0) {
        console.log('⚠️ Found possible matches:', possibleMatches.map(c => c.email));
        return NextResponse.json({ 
          error: `No exact match found for ${email}. Found similar emails: ${possibleMatches.map(c => c.email).join(', ')}. Please use the exact email address from your Stripe account.`
        }, { status: 404 });
      }
      
      return NextResponse.json({ 
        error: 'No subscription found for this email address' 
      }, { status: 404 });
    }

    const customer = customers.data[0];
    console.log('✅ Found Stripe customer:', customer.id, customer.email);

    // Create customer portal session without authentication
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${process.env.NEXTAUTH_URL || 'https://talentix.co.uk'}/dashboard`,
    });

    console.log('✅ Created portal session for customer:', customer.email);

    return NextResponse.json({ 
      url: portalSession.url,
      customerEmail: customer.email
    });

  } catch (error) {
    console.error('❌ Error creating direct cancellation portal:', error);
    return NextResponse.json({ 
      error: 'Failed to create cancellation portal' 
    }, { status: 500 });
  }
}
