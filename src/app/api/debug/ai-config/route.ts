import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const config = {
      hasOpenAI: !!process.env.OPENAI_API_KEY,
      hasGroq: !!process.env.GROQ_API_KEY,
      openaiKeyLength: process.env.OPENAI_API_KEY?.length || 0,
      groqKeyLength: process.env.GROQ_API_KEY?.length || 0,
      nodeEnv: process.env.NODE_ENV,
    };

    return NextResponse.json({
      success: true,
      config
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to check AI configuration', details: error.message },
      { status: 500 }
    );
  }
}











