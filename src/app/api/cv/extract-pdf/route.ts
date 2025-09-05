import { NextRequest, NextResponse } from 'next/server';
import PDFParser from 'pdf2json';

export async function POST(request: NextRequest) {
  try {
    // Get the PDF buffer from the request
    const buffer = Buffer.from(await request.arrayBuffer());
    
    console.log('📄 Extracting text from PDF, buffer size:', buffer.length);
    
    // Create a promise-based wrapper for pdf2json
    const extractTextFromPDF = (buffer: Buffer): Promise<string> => {
      return new Promise((resolve, reject) => {
        const pdfParser = new (PDFParser as any)(null, 1);
        
        pdfParser.on('pdfParser_dataError', (errData: any) => {
          console.error('❌ PDF parsing error:', errData.parserError);
          reject(new Error(errData.parserError));
        });
        
        pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
          try {
            let fullText = '';
            
            // Extract text from all pages
            if (pdfData.Pages) {
              pdfData.Pages.forEach((page: any) => {
                if (page.Texts) {
                  page.Texts.forEach((textObj: any) => {
                    if (textObj.R) {
                      textObj.R.forEach((textRun: any) => {
                        if (textRun.T) {
                          // Decode URI components and add spaces
                          const decodedText = decodeURIComponent(textRun.T);
                          fullText += decodedText + ' ';
                        }
                      });
                    }
                  });
                }
                fullText += '\n'; // Add line break after each page
              });
            }
            
            resolve(fullText.trim());
          } catch (error) {
            reject(error);
          }
        });
        
        // Parse the PDF buffer
        pdfParser.parseBuffer(buffer);
      });
    };
    
    const extractedText = await extractTextFromPDF(buffer);
    
    console.log('✅ PDF text extracted successfully, length:', extractedText.length);
    console.log('📝 Extracted text preview:', extractedText.substring(0, 200) + '...');
    
    return NextResponse.json({
      text: extractedText,
      pages: 'Unknown' // pdf2json doesn't provide page count directly
    });
    
  } catch (error) {
    console.error('❌ PDF extraction failed:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to extract text from PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
