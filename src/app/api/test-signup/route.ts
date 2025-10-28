import { NextRequest, NextResponse } from 'next/server';
import { database } from '../../../lib/database';
import { jwtUtils } from '../../../lib/jwt';

export async function POST(request: NextRequest) {
  console.log('🧪 Testing full signup process...');
  
  try {
    const testEmail = `test_${Date.now()}@test.com`;
    console.log('📧 Test email:', testEmail);
    
    // Step 1: Test user creation
    console.log('🔄 Step 1: Creating test user...');
    const user = await database.createUser({
      name: 'Test User',
      email: testEmail,
      password: 'testpassword123',
      location: 'London'
    });
    console.log('✅ Step 1: User created successfully:', { id: user.id, email: user.email });
    
    // Step 2: Test JWT creation
    console.log('🔄 Step 2: Creating JWT token...');
    const token = jwtUtils.createToken(user);
    console.log('✅ Step 2: JWT token created successfully');
    
    // Step 3: Test user lookup
    console.log('🔄 Step 3: Looking up created user...');
    const foundUser = await database.findUserByEmail(testEmail);
    console.log('✅ Step 3: User found successfully:', !!foundUser);
    
    return NextResponse.json({
      success: true,
      message: 'Full signup test successful',
      steps: {
        userCreation: 'SUCCESS',
        jwtCreation: 'SUCCESS',
        userLookup: 'SUCCESS'
      },
      testUser: {
        id: user.id,
        email: user.email,
        hasToken: !!token
      }
    });
    
  } catch (error: any) {
    console.error('❌ Signup test failed:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    
    return NextResponse.json({
      success: false,
      error: 'Signup test failed',
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}










