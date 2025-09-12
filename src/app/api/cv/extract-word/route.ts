import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';

export async function POST(request: NextRequest) {
  try {
    // Get the Word document buffer from the request
    const buffer = Buffer.from(await request.arrayBuffer());
    
    console.log('📄 Extracting text from Word document, buffer size:', buffer.length);
    
    // Extract text using mammoth
    const result = await mammoth.extractRawText({ buffer });
    
    console.log('✅ Word document text extracted successfully, length:', result.value.length);
    console.log('📝 Extracted text preview:', result.value.substring(0, 200) + '...');
    
    if (result.messages.length > 0) {
      console.log('⚠️ Extraction warnings:', result.messages);
    }
    
    return NextResponse.json({
      text: result.value.trim(),
      messages: result.messages
    });
    
  } catch (error) {
    console.error('❌ Word document extraction failed:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to extract text from Word document',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}






