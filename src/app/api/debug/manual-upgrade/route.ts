import { NextRequest, NextResponse } from 'next/server';
import { database } from '../../../../lib/database-vercel-kv';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Manual upgrade: Starting');
    
    const { email, tier = 'pro' } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }
    
    console.log('🔧 Manual upgrade: Looking for user:', email);
    
    // Find user
    let user = await database.findUserByEmail(email);
    
    if (!user) {
      console.log('🔧 Manual upgrade: User not found, creating...');
      // Create user if not exists
      user = await database.createUser({
        name: 'Manual User',
        email: email,
        password: '', // OAuth user
        location: 'London'
      });
    }
    
    console.log('🔧 Manual upgrade: User found/created:', user.email);
    
    // Update subscription
    const updateResult = await database.updateUserSubscription(email, {
      stripeCustomerId: 'manual_customer_' + Date.now(),
      stripeSubscriptionId: 'manual_sub_' + Date.now(),
      tier: tier,
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      cancelAtPeriodEnd: false,
      priceId: 'manual_price'
    });
    
    console.log('🔧 Manual upgrade: Update result:', updateResult);
    
    // Verify update
    const updatedUser = await database.findUserByEmail(email);
    console.log('🔧 Manual upgrade: Updated user:', updatedUser ? {
      email: updatedUser.email,
      tier: updatedUser.subscriptionTier,
      status: updatedUser.subscriptionStatus
    } : 'NOT FOUND');
    
    return NextResponse.json({
      success: true,
      user: updatedUser ? {
        email: updatedUser.email,
        tier: updatedUser.subscriptionTier,
        status: updatedUser.subscriptionStatus,
        stripeCustomerId: updatedUser.stripeCustomerId,
        stripeSubscriptionId: updatedUser.stripeSubscriptionId
      } : null
    });
    
  } catch (error: any) {
    console.error('🔧 Manual upgrade error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
