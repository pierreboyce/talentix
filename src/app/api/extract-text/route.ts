import { NextRequest, NextResponse } from 'next/server';

// Force Node.js runtime for this API route
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({ 
    message: 'Text extraction API is working',
    timestamp: new Date().toISOString(),
    supportedFormats: ['.docx (Word documents)', '.txt (Text files)'],
    note: 'PDF support temporarily unavailable - please convert to .docx or copy/paste text manually'
  });
}

export async function POST(request: NextRequest) {
  try {
    
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    

    const buffer = Buffer.from(await file.arrayBuffer());
    let extractedText = '';

    // Handle PDF files - provide helpful guidance
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      
      
      return NextResponse.json(
        { error: `PDF text extraction is currently unavailable due to technical limitations.\n\n🔧 Quick Solutions:\n\n1. 📝 Convert to Word: Save your PDF as a .docx file\n   • Open PDF → File → Export → Microsoft Word\n   • Or use online converters like SmallPDF or ILovePDF\n\n2. 📋 Copy & Paste: Select all text from your PDF and paste it manually\n   • This works great for text-based PDFs\n\n3. 💾 Save as Text: Export your PDF as a .txt file\n   • Most PDF viewers have this option\n\n✅ Word (.docx) and Text (.txt) files work perfectly!\nWe apologize for the inconvenience and are working on a solution.` },
        { status: 400 }
      );
    }
    // Handle Word documents (.docx)
    else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.name.toLowerCase().endsWith('.docx')
    ) {
      try {
        // Dynamic import of mammoth
        const mammoth = await import('mammoth');
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value;
        
        
        if (result.messages && result.messages.length > 0) {
          
        }
      } catch (error) {
        
        return NextResponse.json(
          { error: 'Failed to extract text from Word document. Please ensure the file is not corrupted.' },
          { status: 500 }
        );
      }
    }
    // Handle legacy Word documents (.doc)
    else if (
      file.type === 'application/msword' ||
      file.name.toLowerCase().endsWith('.doc')
    ) {
      return NextResponse.json(
        { error: 'Legacy .doc files are not supported. Please save your document as .docx format and try again.' },
        { status: 400 }
      );
    }
    // Handle plain text files
    else if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
      try {
        
        extractedText = buffer.toString('utf-8');
        
      } catch (error) {
        
        return NextResponse.json(
          { error: 'Failed to read text file. Please ensure the file is properly encoded.' },
          { status: 500 }
        );
      }
    }
    // Unsupported file type
    else {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}. Please upload a PDF (.pdf), Word document (.docx), or text file (.txt).` },
        { status: 400 }
      );
    }

    // Validate extracted text
    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json(
        { error: 'No text could be extracted from the file. The file may be empty, corrupted, or contain only images.' },
        { status: 400 }
      );
    }

    // Clean up the text
    const cleanedText = extractedText
      .replace(/\r\n/g, '\n')  // Normalize line endings
      .replace(/\n\s*\n/g, '\n\n')  // Remove excessive empty lines
      .trim();

    return NextResponse.json({
      text: cleanedText,
      metadata: {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        textLength: cleanedText.length,
        wordCount: cleanedText.split(/\s+/).length
      }
    });

  } catch (error) {
    
    
    let errorMessage = 'Failed to extract text from file';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
