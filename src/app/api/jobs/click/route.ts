import { NextRequest, NextResponse } from 'next/server';

interface JobClickRequest {
  jobId: string;
  jobTitle: string;
  company: string;
}

export async function POST(request: NextRequest) {
  try {
    const { jobId, jobTitle, company }: JobClickRequest = await request.json();

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    // Award 10 points for clicking on a job
    const points = 10;
    
    console.log('💼 Job clicked!', { jobId, jobTitle, company, points });

    return NextResponse.json({ 
      success: true, 
      points,
      message: `+${points} points for exploring job opportunities!`
    });

  } catch (error) {
    console.error('❌ Job click tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track job click' },
      { status: 500 }
    );
  }
}






