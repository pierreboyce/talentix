import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, updateEmail } = body;

    console.log('🔍 Simple portal request for email:', email);

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // First, let's try to find ANY customer with active subscriptions
    console.log('🔍 Searching for all customers...');
    const allCustomers = await stripe.customers.list({
      limit: 100,
    });

    console.log(`📊 Found ${allCustomers.data.length} total customers`);

    // Log all customer emails for debugging
    allCustomers.data.forEach(customer => {
      console.log(`📧 Customer: ${customer.email} (ID: ${customer.id})`);
    });

    // Try exact match first
    let targetCustomer = allCustomers.data.find(c => c.email === email);
    
    if (!targetCustomer) {
      console.log('❌ No exact match, trying case-insensitive match...');
      targetCustomer = allCustomers.data.find(c => 
        c.email && c.email.toLowerCase() === email.toLowerCase()
      );
    }

    if (!targetCustomer) {
      console.log('❌ No match found, checking for active subscriptions...');
      
      // Get all active subscriptions
      const activeSubscriptions = await stripe.subscriptions.list({
        status: 'active',
        limit: 100,
      });

      console.log(`📊 Found ${activeSubscriptions.data.length} active subscriptions`);
      
      if (activeSubscriptions.data.length > 0) {
        // Use the first active subscription's customer
        const firstActiveCustomerId = activeSubscriptions.data[0].customer as string;
        targetCustomer = await stripe.customers.retrieve(firstActiveCustomerId) as Stripe.Customer;
        console.log(`🎯 Using customer from active subscription: ${targetCustomer.email}`);
      }
    }

    if (!targetCustomer) {
      return NextResponse.json({ 
        error: `No customer found. Available emails: ${allCustomers.data.map(c => c.email).filter(Boolean).join(', ')}`
      }, { status: 404 });
    }

    console.log('✅ Creating portal for customer:', targetCustomer.email, targetCustomer.id);

    // If updateEmail is provided and different from current email, update the customer
    if (updateEmail && updateEmail !== targetCustomer.email) {
      try {
        await stripe.customers.update(targetCustomer.id, {
          email: updateEmail,
        });
        console.log('✅ Updated customer email from', targetCustomer.email, 'to', updateEmail);
        targetCustomer.email = updateEmail; // Update local reference
      } catch (updateError: any) {
        console.log('⚠️ Failed to update customer email:', updateError.message);
      }
    }

    // Create the billing portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: targetCustomer.id,
      return_url: 'https://talentix.co.uk/dashboard',
    });

    console.log('✅ Portal session created successfully:', portalSession.id);

    return NextResponse.json({ 
      url: portalSession.url,
      customerEmail: targetCustomer.email,
      customerId: targetCustomer.id
    });

  } catch (error: any) {
    console.error('❌ Detailed error:', {
      message: error.message,
      type: error.type,
      code: error.code,
      stack: error.stack
    });
    
    return NextResponse.json({ 
      error: `Portal creation failed: ${error.message}`,
      details: error.type || 'unknown_error'
    }, { status: 500 });
  }
}
