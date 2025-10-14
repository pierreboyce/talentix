import { NextRequest, NextResponse } from 'next/server';
import { database } from '../../../../lib/database-vercel-kv';

export async function POST(request: NextRequest) {
  try {
    // Simple admin authentication (you can enhance this)
    const { adminKey } = await request.json();
    
    if (adminKey !== 'migrate_talentix_data_2024') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔄 Starting migration to Vercel KV...');
    
    // Perform migration
    const success = await database.migrateToKV();
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Data successfully migrated to Vercel KV' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Migration failed - Vercel KV not available' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('❌ Migration error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Migration failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}



