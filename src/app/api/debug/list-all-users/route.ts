import { NextRequest, NextResponse } from 'next/server';
import { database } from '../../../../lib/database-vercel-kv';

export async function GET(request: NextRequest) {
  try {
    const users = await database.getAllUsers();
    
    console.log(`📊 Found ${users.length} users in database`);
    
    const userSummary = users.map(user => ({
      email: user.email,
      name: user.name,
      tier: user.subscriptionTier,
      status: user.subscriptionStatus,
      stripeCustomerId: user.stripeCustomerId,
      stripeSubscriptionId: user.stripeSubscriptionId,
      createdAt: user.createdAt
    }));

    return NextResponse.json({
      success: true,
      totalUsers: users.length,
      users: userSummary
    });

  } catch (error) {
    console.error('❌ Error listing users:', error);
    return NextResponse.json({ 
      error: 'Failed to list users' 
    }, { status: 500 });
  }
}







