import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here-change-in-production';

export async function GET(request: NextRequest) {
  try {
    // Get user from JWT token
    const authHeader = request.headers.get('cookie');
    const tokenMatch = authHeader?.match(/auth-token=([^;]+)/);
    
    if (!tokenMatch) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const token = tokenMatch[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userEmail = decoded.email;
    const userId = decoded.userId;

    console.log('🔧 DEBUG: Upgrading user to Pro tier:', { email: userEmail, userId });

    // Read users from file
    const dataPath = path.join(process.cwd(), 'data', 'users.json');
    const fileData = await fs.readFile(dataPath, 'utf-8');
    const users = JSON.parse(fileData);

    // Find and update user by BOTH email AND user ID to avoid duplicates
    const userIndex = users.findIndex((u: any) => u.email === userEmail && u.id === userId);
    
    if (userIndex === -1) {
      console.log('❌ User not found. Looking for:', { email: userEmail, userId });
      console.log('📋 Available users:', users.map((u: any) => ({ id: u.id, email: u.email })));
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Upgrade to Pro
    users[userIndex].tier = 'pro';
    users[userIndex].status = 'active';
    users[userIndex].stripeCustomerId = 'debug_customer_' + Date.now();
    users[userIndex].stripeSubscriptionId = 'debug_sub_' + Date.now();
    users[userIndex].currentPeriodEnd = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(); // 1 year from now

    // Save back to file
    await fs.writeFile(dataPath, JSON.stringify(users, null, 2));

    console.log('✅ DEBUG: User upgraded to Pro:', {
      id: users[userIndex].id,
      email: users[userIndex].email,
      tier: users[userIndex].tier
    });

    return NextResponse.json({
      success: true,
      message: 'User upgraded to Pro tier',
      user: {
        id: users[userIndex].id,
        email: users[userIndex].email,
        tier: users[userIndex].tier,
        status: users[userIndex].status
      }
    });

  } catch (error: any) {
    console.error('❌ DEBUG: Error upgrading user:', error);
    return NextResponse.json(
      { error: 'Failed to upgrade user', details: error.message },
      { status: 500 }
    );
  }
}

