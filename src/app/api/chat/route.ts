import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message, userName } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not configured');
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      );
    }

    console.log('🤖 Using OpenAI for chat response...');
    console.log('🔍 Chat request:', { message, userName });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a helpful AI career assistant for Talentix, a platform helping teenagers get their first jobs. 

Your role:
- Help with CV writing, interview preparation, job applications, and career advice
- Be encouraging, supportive, and age-appropriate for teenagers (16-19)
- Use a friendly, enthusiastic tone with occasional emojis
- Provide practical, actionable advice
- Focus on entry-level jobs and first-time job seekers
- Be concise but thorough (2-3 sentences usually)

User context:
- User name: ${userName || 'there'}
- Target audience: Teenagers seeking their first job
- Platform: Talentix career platform

Keep responses helpful, encouraging, and specifically tailored to first-time job seekers!`
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from OpenAI');
    }

    console.log('✅ OpenAI chat response generated successfully');

    return NextResponse.json({
      response: aiResponse
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    
    // Fallback response
    const fallbackResponses = [
      "I'm here to help with your career questions! 💼 Could you tell me more about what you're looking for help with?",
      "Great question! 🌟 I'd love to help you with that. Can you provide a bit more detail so I can give you the best advice?",
      "Thanks for reaching out! 🚀 I'm here to support your job search journey. What specific area would you like guidance on?",
      "I'm excited to help you succeed! ✨ What career challenge can we tackle together today?",
      "Perfect timing to ask! 💪 I'm here to help you navigate your job search. What's on your mind?"
    ];

    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

    return NextResponse.json({
      response: randomResponse
    });
  }
}