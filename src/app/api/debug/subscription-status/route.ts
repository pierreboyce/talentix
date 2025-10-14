import { NextRequest, NextResponse } from 'next/server';
import { database } from '../../../../lib/database-vercel-kv';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug: Checking subscription status');
    
    // Get user from token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No auth token' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'talentix-secret-key-change-in-production') as any;
    
    console.log('🔍 Debug: Token decoded:', { email: decoded.email, userId: decoded.userId });
    
    // Check if user exists in memory database
    const user = await database.findUserByEmail(decoded.email);
    console.log('🔍 Debug: User in database:', user ? {
      email: user.email,
      tier: user.subscriptionTier,
      status: user.subscriptionStatus,
      stripeCustomerId: user.stripeCustomerId,
      stripeSubscriptionId: user.stripeSubscriptionId
    } : 'NOT FOUND');
    
    // Get all users in memory database
    const allUsers = await database.getAllUsers();
    console.log('🔍 Debug: All users in memory database:', allUsers.map(u => ({
      email: u.email,
      tier: u.subscriptionTier,
      id: u.id
    })));
    
    return NextResponse.json({
      userFound: !!user,
      userDetails: user ? {
        email: user.email,
        tier: user.subscriptionTier,
        status: user.subscriptionStatus,
        stripeCustomerId: user.stripeCustomerId,
        stripeSubscriptionId: user.stripeSubscriptionId
      } : null,
      totalUsersInMemory: allUsers.length,
      allUsers: allUsers.map(u => ({ email: u.email, tier: u.subscriptionTier }))
    });
    
  } catch (error: any) {
    console.error('🔍 Debug error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
