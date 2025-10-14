import { NextRequest, NextResponse } from 'next/server';
import { database } from '../../../../lib/database-vercel-kv';
import { jwtUtils } from '../../../../lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Verify user credentials
    const user = await database.verifyPassword(email, password);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwtUtils.createToken(user);

    // Create response
    const response = NextResponse.json({ 
      success: true, 
      message: 'Signed in successfully',
      token: token, // Include token in response for localStorage storage
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        location: user.location,
        score: user.score,
        emoji: user.emoji
      }
    });

    // Set HTTP-only cookie for session
    response.cookies.set('talentix-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    // Also set a lightweight cookie for middleware detection
    response.cookies.set('talentix-session', '1', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;

  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json(
      { success: false, error: 'Signin failed' },
      { status: 500 }
    );
  }
}
