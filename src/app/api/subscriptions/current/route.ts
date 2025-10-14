import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { database } from '../../../../lib/database-vercel-kv';

export async function GET(request: NextRequest) {
  try {
    // Get user from session/token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    // TEMPORARY: Production bypass for specific user
    if (token && token.startsWith('temp_jwt_pierreboyce70@gmail.com')) {
      console.log('🚀 Using production bypass for pierreboyce70@gmail.com');
      const user = await database.findUserByEmail('pierreboyce70@gmail.com');
      
      if (user) {
        console.log('✅ Production bypass user found:', { email: user.email, tier: user.subscriptionTier });
        return NextResponse.json({
          subscription: {
            id: user.stripeSubscriptionId || 'bypass',
            tier: user.subscriptionTier || 'free',
            status: user.subscriptionStatus || 'active',
            currentPeriodEnd: user.subscriptionCurrentPeriodEnd || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            cancelAtPeriodEnd: user.subscriptionCancelAtPeriodEnd || false
          }
        });
      }
    }
    
    try {
      console.log('🔐 Verifying JWT token...');
      console.log('🔑 Token preview:', token ? token.substring(0, 50) + '...' : 'null');
      
      // Verify the JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'talentix-secret-key-change-in-production') as any;
      console.log('✅ JWT decoded successfully:', { email: decoded.email, userId: decoded.userId, isOAuth: decoded.isOAuth });
      
      const userEmail = decoded.email;
      
      if (!userEmail) {
        console.log('❌ No email in decoded token');
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }

      console.log('🔍 Looking for user in database:', userEmail);
      
      // Get user from database
      let user = await database.findUserByEmail(userEmail);
      
      if (!user && decoded.isOAuth) {
        console.log('🆕 OAuth user not in database, creating...');
        // Create OAuth user in database
        const success = await database.createUser({
          name: decoded.name || 'OAuth User',
          email: decoded.email,
          password: '', // OAuth users don't have passwords
          location: 'London'
        });
        
        if (success) {
          user = await database.findUserByEmail(userEmail);
          console.log('✅ OAuth user created in database');
        }
      }
      
      if (!user) {
        console.log('❌ User not found:', userEmail);
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      
      console.log('✅ User found:', { email: user.email, tier: user.subscriptionTier });

      console.log('🔍 User subscription data:', {
        tier: user.subscriptionTier,
        status: user.subscriptionStatus,
        stripeCustomerId: user.stripeCustomerId,
        stripeSubscriptionId: user.stripeSubscriptionId
      });

      // Return subscription data (including free tier)
      const subscriptionData = {
        id: user.stripeSubscriptionId || (user.subscriptionTier === 'free' ? 'free' : 'unknown'),
        tier: user.subscriptionTier || 'free',
        status: user.subscriptionStatus || 'active',
        currentPeriodEnd: user.subscriptionCurrentPeriodEnd ? new Date(user.subscriptionCurrentPeriodEnd) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: user.subscriptionCancelAtPeriodEnd || false
      };

      console.log('📤 Returning subscription data:', subscriptionData);

      return NextResponse.json({
        subscription: subscriptionData
      });

    } catch (jwtError) {
      console.error('❌ JWT verification failed:', jwtError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

  } catch (error) {
    console.error('Subscription API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
