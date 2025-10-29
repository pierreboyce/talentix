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
    let prompt = `Generate exactly ${questionCount} beginner‑friendly interview questions`;
    
    if (jobRole && companyName) {
      prompt += ` specifically tailored for a ${jobRole} position at ${companyName}.`;
    } else if (jobRole) {
      prompt += ` specifically tailored for a ${jobRole} position.`;
    } else if (companyName) {
      prompt += ` specifically tailored for an interview at ${companyName}.`;
    } else {
      prompt += ` for a general job interview.`;
    }

    prompt += `\n\nRules:\n- Questions MUST be interview‑style (introductory, motivation, competency/behavioral using STAR, teamwork, communication, company research, problem solving).\n- DO NOT ask technical trivia, quizzes, coding, algorithms, system design, language/framework specifics, or domain exams.\n- Keep wording simple and beginner‑friendly. Prefer Easy difficulty (~70%), rest Medium. Avoid trick questions.\n- Each question should stand alone and be relevant to${companyName ? ` ${companyName}` : ''}${companyName && jobRole ? ' and ' : ''}${jobRole ? `the ${jobRole} role` : ''}, without requiring prior technical knowledge.\n\nFor each question, provide:\n1. The question itself\n2. A category (e.g., "Introductory", "Motivation", "Behavioral", "Teamwork", "Communication", "Company Research", "Problem Solving")\n3. A difficulty level (Easy, Medium, or Hard)\n\nFormat the response as a JSON array with objects containing: question, category, and difficulty fields.\n\nEvery question must be tailored to${companyName ? ` ${companyName}` : ''}${companyName && jobRole ? ' and ' : ''}${jobRole ? `the ${jobRole} role` : ''}. Use simple wording and concrete scenarios.`;

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
      temperature: 0.4,
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
    let questionsWithIds = Array.isArray(questions) 
      ? questions.map((q: any, index: number) => ({
          id: Date.now() + index,
          question: q.question || q,
          category: q.category || 'General',
          difficulty: q.difficulty || 'Easy'
        }))
      : [];

    // If fewer than requested, top up with gentle, interview‑style templates (non‑technical)
    if (questionsWithIds.length < questionCount) {
      const templates = [
        `Why are you interested in ${companyName || 'our company'} and the ${jobRole || 'role'}?`,
        `What is one strength you would bring to ${companyName || 'the team'} as a ${jobRole || 'new hire'}?`,
        `Tell us about a time you learned something new quickly. How would that help you at ${companyName || 'this company'}?`,
        `How would you handle a simple mistake on your first week as a ${jobRole || 'team member'}?`,
        `What do you know about ${companyName || 'our company'} and why does it appeal to you?`
      ];
      while (questionsWithIds.length < questionCount) {
        const idx = questionsWithIds.length % templates.length;
        questionsWithIds.push({
          id: Date.now() + questionsWithIds.length,
          question: templates[idx],
          category: 'Behavioral',
          difficulty: 'Easy'
        });
      }
    }
    
    // Guard against accidental technical/trivia questions
    const technicalRegex = /(algorithm|big o|data structure|syntax|compile|runtime|sql|javascript|python|java\b|c\+\+|react|node|api design|system design|binary tree|linked list|complexity|hash map|docker|kubernetes|terraform|regex|time complexity)/i;
    questionsWithIds = questionsWithIds.map(q => ({
      ...q,
      question: technicalRegex.test(q.question) ? `Tell me about a time you faced a new challenge and how you approached it at ${companyName || 'work/school'}.` : q.question,
      category: technicalRegex.test(q.question) ? 'Behavioral' : q.category
    }));

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

