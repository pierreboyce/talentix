import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyName, jobRole, questionCount = 5 } = body;

    console.log('🎯 Tailoring interview questions:', { companyName, jobRole, questionCount });

    // Build the prompt based on what information is provided
    let prompt = `Generate ${questionCount} professional interview questions`;
    
    if (jobRole && companyName) {
      prompt += ` specifically tailored for a ${jobRole} position at ${companyName}.`;
    } else if (jobRole) {
      prompt += ` specifically tailored for a ${jobRole} position.`;
    } else if (companyName) {
      prompt += ` specifically tailored for an interview at ${companyName}.`;
    } else {
      prompt += ` for a general job interview.`;
    }

    prompt += `\n\nFor each question, provide:
1. The question itself
2. A category (e.g., "Technical", "Behavioral", "Leadership", "Company Culture", "Problem Solving")
3. A difficulty level (Easy, Medium, or Hard)

Format the response as a JSON array with objects containing: question, category, and difficulty fields.

Make the questions specific, insightful, and relevant${companyName ? ` to ${companyName}'s industry and values` : ''}${jobRole ? ` and the ${jobRole} role` : ''}.`;

    console.log('📝 Prompt:', prompt);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert interview coach and recruiter. Generate thoughtful, professional interview questions that help candidates prepare effectively. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' }
    });

    const responseText = completion.choices[0].message.content;
    console.log('🤖 OpenAI response:', responseText);

    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    const parsedResponse = JSON.parse(responseText);
    
    // Handle different possible response formats (check all common variations)
    const questions = parsedResponse.questions || 
                      parsedResponse.interview_questions || 
                      parsedResponse.interviewQuestions ||  // Added camelCase version
                      parsedResponse;

    console.log('📦 Parsed response keys:', Object.keys(parsedResponse));
    console.log('📋 Questions found:', questions);

    // Ensure each question has an ID
    const questionsWithIds = Array.isArray(questions) 
      ? questions.map((q: any, index: number) => ({
          id: Date.now() + index,
          question: q.question || q,
          category: q.category || 'General',
          difficulty: q.difficulty || 'Medium'
        }))
      : [];

    console.log('✅ Generated questions:', questionsWithIds.length);

    return NextResponse.json({
      success: true,
      questions: questionsWithIds,
      tailoredFor: {
        companyName: companyName || null,
        jobRole: jobRole || null
      }
    });

  } catch (error: any) {
    console.error('❌ Error generating tailored questions:', error);
    
    // Check if it's an OpenAI API key issue
    if (error.message?.includes('API key')) {
      return NextResponse.json(
        { 
          error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your .env.local file.',
          fallback: true
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to generate tailored questions',
        details: error.message,
        fallback: true
      },
      { status: 500 }
    );
  }
}

