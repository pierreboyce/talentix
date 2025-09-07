import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, location } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In a real app, you would:
    // 1. Hash the password
    // 2. Save to database
    // 3. Send verification email
    
    // For now, return success to allow localStorage-based auth to work
    return NextResponse.json({ 
      success: true, 
      message: 'Account created successfully',
      user: { name, email, location }
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, error: 'Signup failed' },
      { status: 500 }
    );
  }
}


