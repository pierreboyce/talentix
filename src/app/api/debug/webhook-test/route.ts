import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🔔 DEBUG WEBHOOK: Received at:', new Date().toISOString());
    
    const body = await request.text();
    const headers = Object.fromEntries(request.headers.entries());
    
    console.log('🔔 DEBUG WEBHOOK: Headers:', headers);
    console.log('🔔 DEBUG WEBHOOK: Body length:', body.length);
    console.log('🔔 DEBUG WEBHOOK: Body preview:', body.substring(0, 200));
    
    // Try to parse as JSON
    try {
      const jsonBody = JSON.parse(body);
      console.log('🔔 DEBUG WEBHOOK: Event type:', jsonBody.type);
      console.log('🔔 DEBUG WEBHOOK: Event ID:', jsonBody.id);
    } catch (parseError) {
      console.log('🔔 DEBUG WEBHOOK: Failed to parse JSON:', parseError);
    }
    
    return NextResponse.json({ 
      received: true, 
      timestamp: new Date().toISOString(),
      bodyLength: body.length 
    });
    
  } catch (error: any) {
    console.error('🔔 DEBUG WEBHOOK ERROR:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Debug webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}







