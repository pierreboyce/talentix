import { NextRequest, NextResponse } from 'next/server';

interface CertificateRequest {
  level: string;
  userName: string;
  achievementName?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { level, userName, achievementName }: CertificateRequest = await request.json();

    if (!level || !userName) {
      return NextResponse.json(
        { error: 'Level and userName are required' },
        { status: 400 }
      );
    }

    // Generate unique certificate ID
    const certificateId = `TLX-${level.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`;
    const currentDate = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long', 
      year: 'numeric'
    });

    // Skills by level
    const skillsByLevel: { [key: string]: string[] } = {
      'Bronze': ['Job Search Strategy', 'Profile Building', 'Career Planning', 'Basic Networking'],
      'Silver': ['Interview Skills', 'CV Writing', 'Professional Networking', 'Communication', 'Personal Branding'],
      'Gold': ['Advanced Interview Techniques', 'Career Strategy', 'Leadership', 'Industry Knowledge', 'Mentoring'],
      'Diamond': ['Executive Presence', 'Strategic Thinking', 'Team Leadership', 'Business Acumen', 'Innovation'],
      'Platinum': ['Visionary Leadership', 'Organizational Strategy', 'Change Management', 'Global Perspective', 'Legacy Building']
    };

    // Certificate data
    const certificateData = {
      id: certificateId,
      level,
      holderName: userName,
      issueDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      credentialUrl: `/certificates/${certificateId}`,
      description: `Demonstrates ${level.toLowerCase()} level proficiency in career development skills and professional growth.`,
      skills: skillsByLevel[level] || ['Professional Development'],
      imageUrl: `/talentix${level.toLowerCase()}certificate.png`,
      color: getColorByLevel(level),
      icon: getIconByLevel(level),
      achievementName: achievementName || `${level} Level Achievement`
    };

    // In production, you would save this to a database
    // The certificate ID should be unique and stored with user association
    // For now, we'll just return the certificate data
    
    return NextResponse.json({
      success: true,
      certificate: certificateData,
      message: 'Certificate generated successfully'
    });

  } catch (error) {
    console.error('Error generating certificate:', error);
    return NextResponse.json(
      { error: 'Failed to generate certificate' },
      { status: 500 }
    );
  }
}

function getColorByLevel(level: string): string {
  const colors: { [key: string]: string } = {
    'Bronze': '#cd7f32',
    'Silver': '#c0c0c0', 
    'Gold': '#ffd700',
    'Diamond': '#b9f2ff',
    'Platinum': '#e5e4e2'
  };
  return colors[level] || '#8b5cf6';
}

function getIconByLevel(level: string): string {
  const icons: { [key: string]: string } = {
    'Bronze': '🥉',
    'Silver': '🥈',
    'Gold': '🥇',
    'Diamond': '💎',
    'Platinum': '🏆'
  };
  return icons[level] || '🌟';
}
