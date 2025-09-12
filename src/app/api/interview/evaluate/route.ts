import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import Groq from 'groq-sdk';

interface EvaluationRequest {
  question: string;
  answer: string;
  category: string;
}

interface AIEvaluation {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  points?: number; // Points awarded based on score
}


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

async function evaluateWithOpenAI(question: string, answer: string, category: string): Promise<AIEvaluation> {
  console.log('🔍 evaluateWithOpenAI called with:', { question: question.substring(0, 50), answer: answer.substring(0, 20), category });
  
  const usingOpenAI = Boolean(process.env.OPENAI_API_KEY);
  const usingGroq = !usingOpenAI && Boolean(process.env.GROQ_API_KEY);
  if (!usingOpenAI && !usingGroq) {
    console.error('❌ No AI provider key found');
    throw new Error('AI service not configured');
  }

  const categoryContext = {
    introductory: "This is an introductory interview question about the candidate's background, experience, and personal qualities. Look for relevant experience, clear communication, and genuine enthusiasm.",
    competency: "This is a behavioral/competency-based question that should be answered using the STAR method (Situation, Task, Action, Result). Look for specific examples, clear problem-solving, and measurable outcomes.",
    research: "This is a company/role research question testing the candidate's knowledge about the organization. Look for genuine research, understanding of company values, and alignment with role requirements.",
    yourQuestions: "This is a question the candidate should ask the interviewer. Look for thoughtful, role-relevant questions that show genuine interest and strategic thinking about the position."
  };

  const prompt = `You are an expert interview coach. Evaluate this candidate's response and provide honest, detailed feedback.

QUESTION CATEGORY: ${category}
CONTEXT: ${categoryContext[category as keyof typeof categoryContext]}

INTERVIEW QUESTION: "${question}"
CANDIDATE'S ANSWER: "${answer}"

IMPORTANT: Be harsh but fair. Very short answers like "..." or single words should get 1/5. Only well-structured, detailed answers with specific examples deserve high scores.

Respond with ONLY a JSON object (no markdown, no code blocks, no extra text):
{
  "score": [1-5 where 1=very poor, 2=poor, 3=average, 4=good, 5=excellent],
  "feedback": "[2-3 sentences of specific, actionable feedback]",
  "strengths": ["[specific strength 1]", "[specific strength 2]"],
  "improvements": ["[specific improvement 1]", "[specific improvement 2]", "[specific improvement 3]"]
}

SCORING GUIDE:
- 1/5: Extremely brief, irrelevant, or nonsensical (like "...", single words, or completely off-topic)
- 2/5: Very basic, lacks substance, shows minimal effort
- 3/5: Adequate but generic, missing specific examples or depth
- 4/5: Good response with relevant details and some specifics
- 5/5: Excellent, comprehensive, well-structured with specific examples and clear relevance`;

  try {
    let responseText = '';
    if (usingOpenAI) {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert interview coach and career advisor. You MUST respond with ONLY a valid JSON object - no markdown code blocks, no explanatory text, no formatting. Just pure JSON that can be parsed directly.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 800,
      });
      responseText = completion.choices[0].message.content || '';
    } else {
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });
      const completion = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'You are an expert interview coach and career advisor. You MUST respond with ONLY a valid JSON object - no markdown code blocks, no explanatory text, no formatting. Just pure JSON that can be parsed directly.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 800,
      });
      responseText = completion.choices?.[0]?.message?.content || '';
    }
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response - handle both markdown-wrapped and pure JSON
    console.log('🔍 Raw OpenAI response:', responseText);
    let cleanedResponse = responseText.trim();
    
    // Remove markdown code block wrapper if present
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    let evaluation: AIEvaluation;
    try {
      evaluation = JSON.parse(cleanedResponse) as AIEvaluation;
      console.log('✅ JSON parsed successfully:', evaluation);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      console.error('❌ Cleaned response that failed to parse:', cleanedResponse);
      console.error('❌ Original response:', responseText);
      throw new Error(`Failed to parse OpenAI response as JSON: ${parseError}`);
    }
    
    // Validate the response structure
    if (typeof evaluation.score !== 'number' || 
        typeof evaluation.feedback !== 'string' ||
        !Array.isArray(evaluation.strengths) ||
        !Array.isArray(evaluation.improvements)) {
      throw new Error('Invalid response structure from OpenAI');
    }

    // Ensure score is within valid range
    evaluation.score = Math.max(1, Math.min(5, Math.round(evaluation.score)));

    return evaluation;
  } catch (error) {
    console.error('❌ OpenAI evaluation error:', error);
    console.error('❌ Error details:', JSON.stringify(error, null, 2));
    throw error;
  }
}

function evaluateAnswerBasic(question: string, answer: string, category: string): AIEvaluation {
  const answerLength = answer.trim().length;
  const words = answer.trim().split(/\s+/).length;
  const sentences = answer.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  
  let score = 3; // Base score
  const strengths: string[] = [];
  const improvements: string[] = [];
  
  // Length evaluation
  if (answerLength < 50) {
    score -= 1;
    improvements.push("Provide more detailed responses - aim for at least 100-150 words");
  } else if (answerLength > 100 && answerLength < 300) {
    score += 0.5;
    strengths.push("Good response length - detailed but concise");
  } else if (answerLength > 500) {
    score -= 0.5;
    improvements.push("Consider being more concise - focus on key points");
  }

  // Structure evaluation
  if (sentences >= 3) {
    strengths.push("Well-structured response with multiple points");
    score += 0.5;
  } else if (sentences < 2) {
    improvements.push("Break your answer into multiple sentences for better clarity");
  }

  // Category-specific evaluation
  switch (category) {
    case 'introductory':
      if (answer.toLowerCase().includes('experience') || answer.toLowerCase().includes('background')) {
        strengths.push("Good focus on relevant experience and background");
        score += 0.5;
      }
      if (answer.toLowerCase().includes('passion') || answer.toLowerCase().includes('motivated')) {
        strengths.push("Shows enthusiasm and motivation");
        score += 0.3;
      }
      if (!answer.toLowerCase().includes('i') && !answer.toLowerCase().includes('my')) {
        improvements.push("Make it more personal - use 'I' statements to talk about yourself");
      }
      break;

    case 'competency':
      // Check for STAR method components
      let starScore = 0;
      if (answer.toLowerCase().includes('situation') || answer.toLowerCase().includes('when') || 
          answer.toLowerCase().includes('time') || answer.toLowerCase().includes('example')) {
        starScore += 1;
        strengths.push("Good use of specific examples and situations");
      }
      if (answer.toLowerCase().includes('task') || answer.toLowerCase().includes('responsible') || 
          answer.toLowerCase().includes('needed to')) {
        starScore += 1;
      }
      if (answer.toLowerCase().includes('action') || answer.toLowerCase().includes('did') || 
          answer.toLowerCase().includes('approach')) {
        starScore += 1;
        strengths.push("Clear explanation of actions taken");
      }
      if (answer.toLowerCase().includes('result') || answer.toLowerCase().includes('outcome') || 
          answer.toLowerCase().includes('achieved') || answer.toLowerCase().includes('success')) {
        starScore += 1;
        strengths.push("Good focus on results and outcomes");
      }
      
      if (starScore >= 3) {
        score += 1;
        strengths.push("Excellent use of STAR method structure");
      } else if (starScore >= 2) {
        score += 0.5;
        improvements.push("Try to include all STAR elements: Situation, Task, Action, Result");
      } else {
        improvements.push("Use the STAR method: describe the Situation, Task, Action taken, and Result");
      }
      break;

    case 'research':
      if (answer.toLowerCase().includes('company') || answer.toLowerCase().includes('organization')) {
        strengths.push("Shows knowledge about the company");
        score += 0.5;
      }
      if (answer.toLowerCase().includes('mission') || answer.toLowerCase().includes('values') || 
          answer.toLowerCase().includes('culture')) {
        strengths.push("Demonstrates understanding of company culture and values");
        score += 0.5;
      }
      if (answer.toLowerCase().includes('industry') || answer.toLowerCase().includes('market')) {
        strengths.push("Shows broader industry knowledge");
        score += 0.3;
      }
      if (answer.length < 100) {
        improvements.push("Show more detailed research about the company and role");
      }
      break;

    case 'yourQuestions':
      if (answer.includes('?') || answer.toLowerCase().includes('question')) {
        strengths.push("Properly formatted as a question");
        score += 0.3;
      } else {
        improvements.push("Make sure to phrase this as a clear question");
      }
      if (answer.toLowerCase().includes('role') || answer.toLowerCase().includes('position') || 
          answer.toLowerCase().includes('team') || answer.toLowerCase().includes('company')) {
        strengths.push("Relevant and thoughtful question");
        score += 0.5;
      }
      break;
  }

  // Professional language check
  const professionalWords = ['experience', 'skills', 'achieve', 'develop', 'contribute', 'collaborate', 'leadership', 'responsibility'];
  const professionalCount = professionalWords.filter(word => 
    answer.toLowerCase().includes(word)
  ).length;
  
  if (professionalCount >= 3) {
    strengths.push("Uses professional and relevant vocabulary");
    score += 0.3;
  } else if (professionalCount === 0) {
    improvements.push("Use more professional vocabulary related to work and skills");
  }

  // Confidence indicators
  const confidenceWords = ['confident', 'believe', 'sure', 'capable', 'able', 'will', 'can'];
  const confidenceCount = confidenceWords.filter(word => 
    answer.toLowerCase().includes(word)
  ).length;
  
  if (confidenceCount >= 2) {
    strengths.push("Shows confidence and self-assurance");
    score += 0.2;
  } else if (confidenceCount === 0) {
    improvements.push("Show more confidence in your abilities and achievements");
  }

  // Ensure score is within bounds
  score = Math.max(1, Math.min(5, Math.round(score * 2) / 2)); // Round to nearest 0.5

  // Generate contextual feedback
  let feedback = generateContextualFeedback(score, category, answerLength);

  // Ensure we have at least some strengths and improvements
  if (strengths.length === 0) {
    strengths.push("Shows effort and engagement with the question");
  }
  if (improvements.length === 0) {
    improvements.push("Consider adding more specific examples to strengthen your response");
  }

  return {
    score: Math.round(score),
    feedback,
    strengths,
    improvements
  };
}

function generateContextualFeedback(score: number, category: string, answerLength: number): string {
  const categoryNames = {
    introductory: 'introductory',
    competency: 'behavioral',
    research: 'company research',
    yourQuestions: 'interviewer'
  };

  const categoryName = categoryNames[category as keyof typeof categoryNames] || 'interview';

  if (score >= 4.5) {
    return `Excellent response! Your answer demonstrates strong preparation and understanding of ${categoryName} questions. You've provided specific details and shown clear communication skills that would impress interviewers.`;
  } else if (score >= 3.5) {
    return `Good response! You've addressed the question well and shown relevant knowledge. With some minor refinements in structure and specificity, this could be an outstanding answer for ${categoryName} questions.`;
  } else if (score >= 2.5) {
    return `Solid foundation! Your answer shows understanding of the question, but could benefit from more specific examples and better structure. Consider the key elements that make ${categoryName} questions effective.`;
  } else if (score >= 1.5) {
    return `Your answer addresses the question but needs development. Focus on providing more detailed examples and structuring your response more clearly for ${categoryName} questions.`;
  } else {
    return `This response needs significant improvement. Consider researching best practices for ${categoryName} questions and practice providing more comprehensive, structured answers with specific examples.`;
  }
}

export async function POST(request: NextRequest) {
  try {
    const requestData: EvaluationRequest = await request.json();
    const { question, answer, category } = requestData;

    if (!question || !answer || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use real AI (OpenAI GPT) for intelligent evaluation
    console.log('🤖 Using OpenAI GPT for evaluation...');
    const evaluation = await evaluateWithOpenAI(question, answer, category);
    
    // Add points based on score
    const points = calculatePoints(evaluation.score);
    const evaluationWithPoints = { ...evaluation, points };
    
    console.log('✅ OpenAI evaluation successful!', { score: evaluation.score, points });

    return NextResponse.json(evaluationWithPoints);
  } catch (error) {
    console.error('❌ Interview evaluation error:', error);
    console.error('❌ Full error:', JSON.stringify(error, null, 2));
    
    // Fallback to basic evaluation if OpenAI fails
    console.log('⚠️ Falling back to basic evaluation...');
    
    // Extract data from request for fallback
    try {
      const requestData: EvaluationRequest = await request.json();
      const { question, answer, category } = requestData;
      const fallbackEvaluation = evaluateAnswerBasic(question, answer, category);
      
      // Add points to fallback evaluation
      const points = calculatePoints(fallbackEvaluation.score);
      const fallbackWithPoints = { ...fallbackEvaluation, points };
      
      return NextResponse.json(fallbackWithPoints);
    } catch (fallbackError) {
      console.error('❌ Fallback evaluation also failed:', fallbackError);
      return NextResponse.json(
        { error: 'Evaluation failed' },
        { status: 500 }
      );
    }
  }
}
