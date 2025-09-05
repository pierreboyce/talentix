import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // This endpoint returns session status
    // In a real app, this would validate session tokens
    return NextResponse.json({ 
      success: true, 
      message: 'Session endpoint available' 
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { success: false, error: 'Session check failed' },
      { status: 500 }
    );
  }
}
