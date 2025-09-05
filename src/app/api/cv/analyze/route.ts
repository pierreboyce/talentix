import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Calculate points based on score (30/25/20/10/0 for 5/4/3/2/1)
function calculatePoints(score: number): number {
  switch (score) {
    case 5: return 30;
    case 4: return 25;
    case 3: return 20;
    case 2: return 10;
    case 1: return 0;
    default: return 0;
  }
}

interface CVFeedback {
  score: number;
  overallFeedback: string;
  sections: {
    section: string;
    score: number;
    feedback: string;
    suggestions: string[];
  }[];
  strengths: string[];
  improvements: string[];
  points?: number; // Points awarded based on score
}

async function analyzeWithOpenAI(cvText: string): Promise<CVFeedback> {
  console.log('🤖 Using OpenAI GPT for CV analysis...');
  console.log('🔍 analyzeWithOpenAI called with CV text length:', cvText.length);
  console.log('📄 CV TEXT CONTENT:', cvText);

  if (!process.env.OPENAI_API_KEY) {
    console.log('❌ No OpenAI API key found');
    throw new Error('OpenAI API key not configured');
  }
  
  console.log('✅ OpenAI API key exists:', process.env.OPENAI_API_KEY.slice(0, 10) + '...');

      const prompt = `ANALYZE THIS ACTUAL CV TEXT AND PROVIDE PERSONALIZED FEEDBACK:

==== CV CONTENT TO ANALYZE ====
${cvText}
==== END CV CONTENT ====

INSTRUCTIONS:
1. READ the actual CV text above word-for-word
2. EXTRACT real information: person's name, companies, job titles, skills, education
3. USE ONLY the real information from the CV in your response
4. NEVER use placeholders like [Name], [Company], [Job Title] - use the ACTUAL text from the CV
5. QUOTE specific phrases directly from the CV when giving feedback

REQUIRED JSON FORMAT:
{
  "score": [1-5],
  "overallFeedback": "Based on this CV, [ACTUAL NAME FROM CV] has worked at [ACTUAL COMPANIES FROM CV]...",
  "sections": [
    {
      "section": "Contact Information", 
      "score": [1-5],
      "feedback": "The CV shows [ACTUAL EMAIL/PHONE FROM CV]...",
      "suggestions": ["Specific suggestion based on what's actually in the CV"]
    },
    {
      "section": "Experience",
      "score": [1-5], 
      "feedback": "Working as [ACTUAL JOB TITLE FROM CV] at [ACTUAL COMPANY FROM CV], the CV describes [QUOTE ACTUAL TEXT FROM CV]...",
      "suggestions": ["Improve the description of your role at [ACTUAL COMPANY NAME FROM CV]"]
    }
  ],
  "strengths": ["Real strength from actual CV content with quotes"],
  "improvements": ["Specific improvement using actual company/role names from CV"]
}

ABSOLUTELY CRITICAL: 
- If the CV mentions "John Smith worked at Microsoft as Software Engineer", use "John Smith", "Microsoft", and "Software Engineer" 
- If the CV says "Email: john@example.com", reference "john@example.com" specifically
- NEVER write generic feedback - everything must reference the actual CV content
- If you cannot extract real information, state exactly what information is missing from the CV text`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert CV reviewer. You MUST read the actual CV text and use ONLY real information from it. NEVER use placeholders like [Name] or [Company] - use the actual names, companies, job titles, and details from the CV text. Always respond with valid JSON only, no markdown formatting. If you use generic examples instead of real CV content, you have failed the task."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const rawResponse = completion.choices[0]?.message?.content || '';
    console.log('🔍 Raw OpenAI response:', rawResponse);

    // Clean up potential markdown formatting
    let cleanedResponse = rawResponse;
    if (rawResponse.includes('```json')) {
      cleanedResponse = rawResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    } else if (rawResponse.includes('```')) {
      cleanedResponse = rawResponse.replace(/```\s*/g, '');
    }

    const parsedResult = JSON.parse(cleanedResponse);
    console.log('✅ JSON parsed successfully:', parsedResult);
    console.log('✅ OpenAI CV analysis successful!');
    
    return parsedResult;
  } catch (error) {
    console.error('❌ OpenAI CV analysis failed:', error);
    throw error;
  }
}

function analyzeBasicCV(cvText: string): CVFeedback {
  console.log('🔧 Using basic CV analysis fallback...');
  
  const sections = [
    {
      section: "Contact Information",
      score: 4,
      feedback: "Contact information appears to be present.",
      suggestions: ["Ensure phone number and email are professional", "Consider adding LinkedIn profile"]
    },
    {
      section: "Professional Experience",
      score: 3,
      feedback: "Experience section needs more detail and quantified achievements.",
      suggestions: ["Add specific metrics and results", "Use action verbs to start bullet points", "Include relevant technologies and tools"]
    },
    {
      section: "Skills",
      score: 3,
      feedback: "Skills section could be more comprehensive and better organized.",
      suggestions: ["Group skills by category", "Include proficiency levels", "Add industry-relevant tools"]
    },
    {
      section: "Education",
      score: 4,
      feedback: "Education information is present but could include more details.",
      suggestions: ["Add graduation year if recent", "Include relevant coursework or projects", "Mention academic achievements"]
    }
  ];

  return {
    score: 3,
    overallFeedback: "Your CV has a solid foundation but could benefit from more detailed achievements, quantified results, and better formatting. Focus on showcasing your impact in previous roles.",
    sections,
    strengths: [
      "Clear career progression shown",
      "Relevant technical skills listed",
      "Professional experience demonstrated"
    ],
    improvements: [
      "Add quantified achievements and metrics",
      "Improve formatting and visual hierarchy",
      "Include more specific technical details",
      "Optimize for ATS compatibility"
    ]
  };
}

export async function POST(request: NextRequest) {
  try {
    const { cvText } = await request.json();

    if (!cvText || typeof cvText !== 'string') {
      return NextResponse.json(
        { error: 'CV text is required' },
        { status: 400 }
      );
    }

    let result: CVFeedback;

    try {
      result = await analyzeWithOpenAI(cvText);
    } catch (error) {
      console.error('❌ OpenAI analysis failed, using fallback:', error);
      result = analyzeBasicCV(cvText);
    }

    // Add points based on score
    const points = calculatePoints(result.score);
    const resultWithPoints = { ...result, points };
    
    console.log('✅ CV analysis complete!', { score: result.score, points });

    return NextResponse.json(resultWithPoints);
  } catch (error) {
    console.error('❌ CV analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze CV' },
      { status: 500 }
    );
  }
}
