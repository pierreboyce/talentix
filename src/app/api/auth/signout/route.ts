import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json({ 
      success: true, 
      message: 'Signed out successfully'
    });

    // Clear authentication cookies
    response.cookies.set('talentix-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0 // Expire immediately
    });

    response.cookies.set('talentix-session', '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0 // Expire immediately
    });

    return response;

  } catch (error) {
    console.error('Signout error:', error);
    return NextResponse.json(
      { success: false, error: 'Signout failed' },
      { status: 500 }
    );
  }
}

