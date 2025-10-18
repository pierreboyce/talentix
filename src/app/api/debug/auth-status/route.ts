import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Auth Status Debug');
    
    // Check auth header
    const authHeader = request.headers.get('authorization');
    console.log('📋 Auth header present:', !!authHeader);
    console.log('📋 Auth header value:', authHeader ? authHeader.substring(0, 50) + '...' : 'null');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        authenticated: false,
        issue: 'No Bearer token in Authorization header',
        authHeader: authHeader || 'missing'
      });
    }

    const token = authHeader.split(' ')[1];
    console.log('🔑 Token extracted:', token ? token.substring(0, 50) + '...' : 'null');
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'talentix-secret-key-change-in-production') as any;
      console.log('✅ Token decoded successfully:', { email: decoded.email, userId: decoded.userId });
      
      return NextResponse.json({
        authenticated: true,
        user: {
          email: decoded.email,
          userId: decoded.userId,
          isOAuth: decoded.isOAuth
        },
        tokenValid: true
      });
      
    } catch (jwtError: any) {
      console.error('❌ JWT verification failed:', jwtError.message);
      
      return NextResponse.json({
        authenticated: false,
        issue: 'Invalid JWT token',
        error: jwtError.message,
        tokenPresent: !!token
      });
    }
    
  } catch (error: any) {
    console.error('🔍 Auth status error:', error);
    return NextResponse.json({ 
      error: error.message,
      authenticated: false,
      issue: 'Server error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Check localStorage token (sent in body)
  try {
    const { token } = await request.json();
    
    console.log('🔍 Checking localStorage token:', token ? token.substring(0, 50) + '...' : 'null');
    
    if (!token) {
      return NextResponse.json({
        valid: false,
        issue: 'No token provided'
      });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'talentix-secret-key-change-in-production') as any;
      console.log('✅ localStorage token valid:', { email: decoded.email, userId: decoded.userId });
      
      return NextResponse.json({
        valid: true,
        user: {
          email: decoded.email,
          userId: decoded.userId,
          isOAuth: decoded.isOAuth
        }
      });
      
    } catch (jwtError: any) {
      console.error('❌ localStorage token invalid:', jwtError.message);
      
      return NextResponse.json({
        valid: false,
        issue: 'Invalid token',
        error: jwtError.message
      });
    }
    
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message,
      valid: false 
    }, { status: 500 });
  }
}







