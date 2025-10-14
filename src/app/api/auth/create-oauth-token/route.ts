import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Simple JWT creation without external dependencies
const JWT_SECRET = process.env.JWT_SECRET || 'talentix-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 OAuth JWT API called');
    const body = await request.json();
    console.log('📊 Request body:', JSON.stringify(body, null, 2));
    
    const { user } = body;

    if (!user || !user.email) {
      console.log('❌ Missing user data');
      return NextResponse.json(
        { success: false, error: 'User data is required' },
        { status: 400 }
      );
    }

    console.log('🔐 Creating simple JWT token for OAuth user:', user.email);
    
    // Create a simple JWT token with the OAuth user data
    const payload = {
      userId: user.id || `oauth_${Date.now()}`,
      email: user.email,
      name: user.name,
      isOAuth: true
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    console.log('✅ JWT token created successfully');

    return NextResponse.json({ 
      success: true, 
      token: token
    });

  } catch (error) {
    console.error('❌ Create OAuth token error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: `Failed to create token: ${errorMessage}` },
      { status: 500 }
    );
  }
}
