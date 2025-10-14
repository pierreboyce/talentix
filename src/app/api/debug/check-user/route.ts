import { NextRequest, NextResponse } from 'next/server';
import { database } from '../../../../lib/database-vercel-kv';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: 'Email parameter required' }, { status: 400 });
    }
    
    console.log('🔍 Checking user:', email);
    
    // Find user in database
    const user = await database.findUserByEmail(email);
    
    if (!user) {
      return NextResponse.json({
        found: false,
        message: 'User not found in database'
      });
    }
    
    return NextResponse.json({
      found: true,
      user: {
        email: user.email,
        name: user.name,
        tier: user.subscriptionTier,
        status: user.subscriptionStatus,
        stripeCustomerId: user.stripeCustomerId,
        stripeSubscriptionId: user.stripeSubscriptionId,
        currentPeriodEnd: user.subscriptionCurrentPeriodEnd,
        cancelAtPeriodEnd: user.subscriptionCancelAtPeriodEnd
      },
      subscription: {
        id: user.stripeSubscriptionId || 'none',
        tier: user.subscriptionTier || 'free',
        status: user.subscriptionStatus || 'active',
        currentPeriodEnd: user.subscriptionCurrentPeriodEnd || new Date().toISOString(),
        cancelAtPeriodEnd: user.subscriptionCancelAtPeriodEnd || false
      }
    });
    
  } catch (error: any) {
    console.error('🔍 Check user error:', error);
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
