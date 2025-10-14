import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface CertificateImageRequest {
  level: string;
}

export async function POST(request: NextRequest) {
  try {
    const { level }: CertificateImageRequest = await request.json();

    console.log('🎓 Certificate API received level:', level);

    if (!level) {
      console.error('❌ Missing required field: level');
      return NextResponse.json(
        { error: 'Level is required' },
        { status: 400 }
      );
    }

    // Map level to certificate image file
    const certificateFiles: { [key: string]: string } = {
      'Bronze': 'bronzerankcerti.png',
      'Silver': 'silverrankcerti.png', 
      'Gold': 'goldrankcerti.png',
      'Diamond': 'diamondrankcerti.png',
      'Platinum': 'platinumrankcerti.png'
    };

    const imageFile = certificateFiles[level] || 'bronzerankcerti.png';
    const imagePath = path.join(process.cwd(), 'public', imageFile);

    // Check if image exists
    if (!fs.existsSync(imagePath)) {
      console.error('❌ Certificate image not found:', imagePath);
      return NextResponse.json(
        { error: 'Certificate image not found' },
        { status: 404 }
      );
    }

    // Read the certificate image file directly
    const imageBuffer = fs.readFileSync(imagePath);
    console.log('📦 Certificate image loaded, size:', imageBuffer.length);

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="certificate-${level.toLowerCase()}.png"`
      }
    });

  } catch (error) {
    console.error('❌ Certificate generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate certificate' },
      { status: 500 }
    );
  }
}