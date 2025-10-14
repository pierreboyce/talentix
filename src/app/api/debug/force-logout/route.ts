import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Force logout requested');
    
    // Create response that clears all authentication cookies and storage
    const response = NextResponse.json({ 
      success: true, 
      message: 'Logout successful - all tokens cleared' 
    });
    
    // Clear all possible authentication cookies
    response.cookies.delete('token');
    response.cookies.delete('auth-token');
    response.cookies.delete('session');
    response.cookies.delete('next-auth.session-token');
    response.cookies.delete('__Secure-next-auth.session-token');
    
    console.log('✅ All authentication cookies cleared');
    
    return response;
  } catch (error) {
    console.error('❌ Error during force logout:', error);
    return NextResponse.json({ 
      error: 'Failed to logout' 
    }, { status: 500 });
  }
}



