import { NextRequest, NextResponse } from 'next/server';

// Import the verification codes storage from forgot-password route
// In production, this would be in a shared database
const verificationCodes = new Map<string, { code: string; timestamp: number; email: string }>();

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and verification code are required' }, { status: 400 });
    }

    // Get stored verification code
    const storedData = verificationCodes.get(email);

    if (!storedData) {
      return NextResponse.json({ error: 'No verification code found for this email' }, { status: 400 });
    }

    // Check if code has expired (10 minutes)
    const now = Date.now();
    if (now - storedData.timestamp > 10 * 60 * 1000) {
      verificationCodes.delete(email);
      return NextResponse.json({ error: 'Verification code has expired' }, { status: 400 });
    }

    // Verify the code
    if (storedData.code !== code) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    // Code is valid - keep it for the password reset step
    return NextResponse.json({ 
      success: true, 
      message: 'Verification code is valid' 
    });

  } catch (error) {
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

