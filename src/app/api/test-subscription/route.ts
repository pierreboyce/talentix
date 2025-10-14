import { NextRequest, NextResponse } from 'next/server';
import { database } from '../../../lib/database';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Manual subscription test called');
    const { email } = await request.json();
    
    if (!email) {
      console.log('❌ No email provided');
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    console.log('🔍 Upgrading user:', email);

    // Manually update user to Pro for testing
    const success = await database.updateUserSubscription(email, {
      stripeCustomerId: 'test_customer',
      stripeSubscriptionId: 'test_subscription',
      tier: 'pro',
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      cancelAtPeriodEnd: false,
      priceId: 'test_price'
    });

    console.log('💾 Database update result:', success);

    if (success) {
      console.log('✅ User manually upgraded to Pro');
      return NextResponse.json({ 
        success: true, 
        message: 'User manually upgraded to Pro for testing' 
      });
    } else {
      console.log('❌ Failed to upgrade user');
      return NextResponse.json({ 
        error: 'User not found' 
      }, { status: 404 });
    }

  } catch (error) {
    console.error('❌ Manual subscription test error:', error);
    return NextResponse.json({ 
      error: 'Failed to update subscription' 
    }, { status: 500 });
  }
}
