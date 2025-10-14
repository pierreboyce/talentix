import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';

export async function POST(request: NextRequest) {
  try {
    // Get the Word document buffer from the request
    const buffer = Buffer.from(await request.arrayBuffer());
    
    
    
    // Extract text using mammoth
    const result = await mammoth.extractRawText({ buffer });
    
    if (result.messages.length > 0) {
      
    }
    
    return NextResponse.json({
      text: result.value.trim(),
      messages: result.messages
    });
    
  } catch (error) {
    
    
    return NextResponse.json(
      { 
        error: 'Failed to extract text from Word document',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

