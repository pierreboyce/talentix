import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Stripe Configuration Debug');
    
    const config = {
      hasStripeSecretKey: !!process.env.STRIPE_SECRET_KEY,
      hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      nextAuthUrl: process.env.NEXTAUTH_URL,
      webhookEndpoint: `${process.env.NEXTAUTH_URL || 'https://talentix.co.uk'}/api/webhooks/stripe`,
      testWebhookEndpoint: `${process.env.NEXTAUTH_URL || 'https://talentix.co.uk'}/api/debug/stripe-webhook-test`,
      stripeSecretKeyPreview: process.env.STRIPE_SECRET_KEY ? 
        process.env.STRIPE_SECRET_KEY.substring(0, 12) + '...' : 'NOT SET',
      webhookSecretPreview: process.env.STRIPE_WEBHOOK_SECRET ? 
        process.env.STRIPE_WEBHOOK_SECRET.substring(0, 12) + '...' : 'NOT SET'
    };
    
    console.log('🔍 Stripe config:', config);
    
    return NextResponse.json({
      message: 'Stripe configuration debug',
      config: config,
      instructions: {
        webhookUrl: `${process.env.NEXTAUTH_URL || 'https://talentix.co.uk'}/api/webhooks/stripe`,
        testWebhookUrl: `${process.env.NEXTAUTH_URL || 'https://talentix.co.uk'}/api/debug/stripe-webhook-test`,
        requiredEvents: [
          'checkout.session.completed',
          'customer.subscription.updated',
          'customer.subscription.deleted',
          'invoice.payment_succeeded',
          'invoice.payment_failed'
        ]
      }
    });
    
  } catch (error: any) {
    console.error('🔍 Stripe config error:', error);
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}













