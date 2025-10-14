import { NextRequest, NextResponse } from 'next/server';
import { database } from '../../../../lib/database-memory';
import { jwtUtils } from '../../../../lib/jwt';

export async function POST(request: NextRequest) {
  console.log('🚀 Signup API called at:', new Date().toISOString());
  console.log('🆔 Deployment ID: FRESH_DEPLOY_v2_' + Date.now());
  
  try {
    console.log('📥 Reading request body...');
    const body = await request.json();
    console.log('📊 Request body received:', { 
      name: body.name, 
      email: body.email, 
      hasPassword: !!body.password,
      location: body.location 
    });
    
    const { name, email, password, location } = body;

    if (!name || !email || !password) {
      console.log('❌ Missing required fields:', { name: !!name, email: !!email, password: !!password });
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('✅ All required fields present');

    try {
      console.log('🔄 Creating user in database:', { name, email, location: location || 'London' });
      
      // Create user in database
      const user = await database.createUser({
        name,
        email,
        password,
        location: location || 'London' // Default location if not provided
      });

      console.log('✅ User created successfully:', { id: user.id, email: user.email });

      // Create JWT token
      const token = jwtUtils.createToken(user);
      console.log('✅ JWT token created for new user');

      // Set HTTP-only cookie for server-side auth
      const response = NextResponse.json({
        success: true,
        message: 'Account created successfully',
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

      // Set secure HTTP-only cookie
      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 // 7 days
      });

      // Add cache-busting headers
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');

      console.log('✅ Signup completed successfully for:', user.email);
      return response;

    } catch (dbError: any) {
      console.error('💾 Database error:', dbError);
      console.error('💾 Database error message:', dbError.message);
      console.error('💾 Database error stack:', dbError.stack);
      
      if (dbError.message.includes('already exists')) {
        console.log('👤 User already exists, returning 409');
        return NextResponse.json(
          { success: false, error: 'User with this email already exists' },
          { status: 409 }
        );
      }
      console.log('💾 Rethrowing database error');
      throw dbError;
    }

  } catch (error: any) {
    console.error('❌ Signup error:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    return NextResponse.json(
      { success: false, error: 'Signup failed' },
      { status: 500 }
    );
  }
}