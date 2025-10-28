import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🔔 STRIPE WEBHOOK TEST: Received at:', new Date().toISOString());
    
    const body = await request.text();
    const headers = Object.fromEntries(request.headers.entries());
    
    console.log('🔔 STRIPE WEBHOOK TEST: Headers:', JSON.stringify(headers, null, 2));
    console.log('🔔 STRIPE WEBHOOK TEST: Body length:', body.length);
    console.log('🔔 STRIPE WEBHOOK TEST: Body preview:', body.substring(0, 500));
    
    // Try to parse as JSON
    try {
      const jsonBody = JSON.parse(body);
      console.log('🔔 STRIPE WEBHOOK TEST: Event type:', jsonBody.type);
      console.log('🔔 STRIPE WEBHOOK TEST: Event ID:', jsonBody.id);
      
      if (jsonBody.type === 'checkout.session.completed') {
        console.log('🔔 STRIPE WEBHOOK TEST: Checkout session completed!');
        console.log('🔔 STRIPE WEBHOOK TEST: Session data:', JSON.stringify(jsonBody.data.object, null, 2));
      }
    } catch (parseError) {
      console.log('🔔 STRIPE WEBHOOK TEST: Failed to parse JSON:', parseError);
    }
    
    return NextResponse.json({ 
      received: true, 
      timestamp: new Date().toISOString(),
      bodyLength: body.length,
      message: 'Webhook test received successfully'
    });
    
  } catch (error: any) {
    console.error('🔔 STRIPE WEBHOOK TEST ERROR:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Stripe webhook test endpoint is active',
    timestamp: new Date().toISOString(),
    endpoint: '/api/debug/stripe-webhook-test'
  });
}









