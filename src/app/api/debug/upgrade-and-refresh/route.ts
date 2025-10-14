import { NextRequest, NextResponse } from 'next/server';
import { database } from '../../../../lib/database-vercel-kv';

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Upgrade and refresh: Starting');
    
    const { email, tier = 'pro' } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }
    
    console.log('🔧 Upgrade and refresh: Processing for:', email);
    
    // Find or create user
    let user = await database.findUserByEmail(email);
    
    if (!user) {
      console.log('🔧 Creating new user for:', email);
      user = await database.createUser({
        name: 'Manual User',
        email: email,
        password: '',
        location: 'London'
      });
    }
    
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
    
    // Verify the update worked
    const updatedUser = await database.findUserByEmail(email);
    
    console.log('🔧 Final user state:', updatedUser ? {
      email: updatedUser.email,
      tier: updatedUser.subscriptionTier,
      status: updatedUser.subscriptionStatus,
      stripeCustomerId: updatedUser.stripeCustomerId
    } : 'NOT FOUND');
    
    return NextResponse.json({
      success: true,
      message: 'User upgraded successfully',
      user: updatedUser ? {
        email: updatedUser.email,
        tier: updatedUser.subscriptionTier,
        status: updatedUser.subscriptionStatus,
        stripeCustomerId: updatedUser.stripeCustomerId,
        stripeSubscriptionId: updatedUser.stripeSubscriptionId,
        currentPeriodEnd: updatedUser.subscriptionCurrentPeriodEnd
      } : null,
      // Return subscription data in the format the frontend expects
      subscription: updatedUser ? {
        id: updatedUser.stripeSubscriptionId || 'manual',
        tier: updatedUser.subscriptionTier,
        status: updatedUser.subscriptionStatus || 'active',
        currentPeriodEnd: updatedUser.subscriptionCurrentPeriodEnd || new Date().toISOString(),
        cancelAtPeriodEnd: updatedUser.subscriptionCancelAtPeriodEnd || false
      } : null
    });
    
  } catch (error: any) {
    console.error('🔧 Upgrade and refresh error:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
