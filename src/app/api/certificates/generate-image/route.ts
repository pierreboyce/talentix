import { NextRequest, NextResponse } from 'next/server';
import { createCanvas, loadImage, registerFont } from 'canvas';
import fs from 'fs';
import path from 'path';

interface CertificateImageRequest {
  level: string;
  userName: string;
  achievementName?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { level, userName, achievementName }: CertificateImageRequest = await request.json();

    // Debug logging for production
    console.log('Certificate generation request:', {
      level,
      userName,
      achievementName,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      origin: request.headers.get('origin')
    });

    if (!level || !userName) {
      console.error('Missing required fields:', { level, userName });
      return NextResponse.json(
        { error: 'Level and userName are required' },
        { status: 400 }
      );
    }

    // Map level to certificate image file
    const certificateFiles: { [key: string]: string } = {
      'Bronze': 'talentixbronzecertificate.png',
      'Silver': 'talentixsilvercertificate.png', 
      'Gold': 'talentixgoldcertificate.png',
      'Diamond': 'talentixgoldcertificate.png', // Fallback to gold
      'Platinum': 'talentixgoldcertificate.png' // Fallback to gold
    };

    const imageFile = certificateFiles[level] || 'talentixbronzecertificate.png';
    const imagePath = path.join(process.cwd(), 'public', imageFile);

    // Check if image exists
    if (!fs.existsSync(imagePath)) {
      return NextResponse.json(
        { error: 'Certificate image not found' },
        { status: 404 }
      );
    }

    // Load the certificate image
    const image = await loadImage(imagePath);
    
    // Create canvas with same dimensions as the image
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    // Draw the original certificate image
    ctx.drawImage(image, 0, 0);

    // Add user name to the certificate
    // Position the name where the line is (adjust these coordinates based on your certificate design)
    const nameX = image.width / 2; // Center horizontally
    let nameY = image.height * 0.45; // Default position
    
    // Adjust positioning based on certificate type
    if (level === 'Bronze') {
      nameY = image.height * 0.42; // Fine-tune for bronze certificate
    } else if (level === 'Silver') {
      nameY = image.height * 0.44; // Fine-tune for silver certificate  
    } else if (level === 'Gold') {
      nameY = image.height * 0.46; // Fine-tune for gold certificate
    }

    // Set font properties for the user name
    let fontSize = 48;
    // Adjust font size based on name length to prevent overflow
    if (userName.length > 15) fontSize = 36;
    else if (userName.length > 20) fontSize = 30;
    
    ctx.font = `bold ${fontSize}px Arial`; // Adjust font size as needed
    ctx.fillStyle = '#1a1a1a'; // Dark color for better contrast
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Add text shadow for better visibility
    ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    // Draw the user name
    ctx.fillText(userName.toUpperCase(), nameX, nameY);

    // Reset shadow for achievement name
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Add achievement name if provided (below the user name)
    if (achievementName) {
      ctx.font = 'bold 32px Arial'; // Smaller font for achievement
      ctx.fillStyle = '#34495e';
      const achievementY = nameY + 60; // Position below the name
      ctx.fillText(achievementName.toUpperCase(), nameX, achievementY);
    }

    // Convert canvas to buffer
    const buffer = canvas.toBuffer('image/png');

    // Return the image as response
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="Talentix-${level}-Certificate-${userName.replace(/\s+/g, '-')}.png"`,
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    console.error('Error generating certificate image:', error);
    return NextResponse.json(
      { error: 'Failed to generate certificate image' },
      { status: 500 }
    );
  }
}
