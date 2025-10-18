import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { database } from '../../../../lib/database-vercel-kv';

export async function GET(request: NextRequest) {
  try {
    // Get user from JWT token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    let decoded: any;
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    console.log('🔍 JWT decoded email:', decoded.email);
    
    const user = await database.findUserByEmail(decoded.email);
    if (!user) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    console.log('✅ Current user found:', {
      email: user.email,
      name: user.name,
      tier: user.subscriptionTier,
      stripeCustomerId: user.stripeCustomerId
    });

    return NextResponse.json({
      success: true,
      currentUser: {
        email: user.email,
        name: user.name,
        tier: user.subscriptionTier,
        status: user.subscriptionStatus,
        stripeCustomerId: user.stripeCustomerId,
        stripeSubscriptionId: user.stripeSubscriptionId
      },
      jwtEmail: decoded.email
    });

  } catch (error) {
    console.error('❌ Error checking current user:', error);
    return NextResponse.json({ 
      error: 'Failed to check current user' 
    }, { status: 500 });
  }
}







