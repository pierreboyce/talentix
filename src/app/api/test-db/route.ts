import { NextRequest, NextResponse } from 'next/server';
import { database } from '../../../lib/database';

export async function GET(request: NextRequest) {
  console.log('🧪 Testing database connection...');
  
  try {
    // Try to find a user (this will test database read/write)
    const testUser = await database.findUserByEmail('test@test.com');
    console.log('✅ Database test successful');
    
    return NextResponse.json({
      success: true,
      message: 'Database is working',
      testResult: testUser ? 'User found' : 'No user found (normal)'
    });
  } catch (error: any) {
    console.error('❌ Database test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Database test failed',
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}













