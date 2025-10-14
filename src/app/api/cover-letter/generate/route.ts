import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import Groq from 'groq-sdk';
import { rateLimiters, createRateLimitResponse } from '../../../../lib/rate-limiter';

// Initialize AI providers safely
let openai: OpenAI | null = null;
let groq: Groq | null = null;

try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
} catch (error) {
  
}

try {
  if (process.env.GROQ_API_KEY) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
} catch (error) {
  
}

export async function POST(request: NextRequest) {
  try {
    // 🛡️ Rate limiting check - 10 requests per minute for cover letter generation
    const rateLimitResult = await rateLimiters.aiModerate.checkLimit(request);
    if (!rateLimitResult.allowed) {
      console.log('🚫 Cover letter generation rate limit exceeded');
      return createRateLimitResponse(rateLimitResult.resetTime);
    }
    console.log(`✅ Cover letter rate limit passed. Remaining: ${rateLimitResult.remaining}`);
    
    // Check at least one provider is available
    if (!openai && !groq) {
      console.error('❌ No AI providers available');
      console.error('OpenAI API Key exists:', !!process.env.OPENAI_API_KEY);
      console.error('Groq API Key exists:', !!process.env.GROQ_API_KEY);
      
      return NextResponse.json(
        { 
          error: 'Failed to generate cover letter: No AI provider available', 
          details: 'Please ensure your AI provider (OpenAI or Groq) is properly configured in your .env.local file.',
          debug: {
            hasOpenAI: !!process.env.OPENAI_API_KEY,
            hasGroq: !!process.env.GROQ_API_KEY
          }
        },
        { status: 500 }
      );
    }

    const { cv, jobDescription, userId } = await request.json();

    if (!cv || !jobDescription) {
      return NextResponse.json(
        { error: 'CV and job description are required' },
        { status: 400 }
      );
    }

    
    
    

    const prompt = `You are an expert cover letter writer with years of experience helping candidates land their dream jobs. Create a highly personalized, compelling cover letter based on the following information:

**CANDIDATE'S CV/RESUME:**
${cv}

**TARGET JOB DESCRIPTION:**
${jobDescription}

**DETAILED INSTRUCTIONS:**
1. **Personalization**: Carefully analyze the candidate's background and extract specific achievements, skills, and experiences that directly match the job requirements.

2. **Company Research**: If the company name is mentioned in the job description, reference it specifically and show knowledge of their industry/mission.

3. **Quantifiable Results**: When possible, highlight specific metrics, achievements, or results from the CV that demonstrate the candidate's value.

4. **Keyword Matching**: Naturally incorporate key terms and requirements from the job description to pass ATS systems.

5. **Structure**: 
   - Opening: Strong hook that immediately shows relevance
   - Body: 2-3 paragraphs highlighting most relevant experience with specific examples
   - Closing: Confident call to action with enthusiasm

6. **Tone**: Professional yet personable, confident but not arrogant, enthusiastic about the specific opportunity.

7. **Length**: 3-4 paragraphs, approximately 250-400 words total.

8. **Avoid Generic Language**: No template phrases like "I am writing to express my interest" - make it unique and compelling.

**OUTPUT FORMAT:**
Generate a complete cover letter in proper business letter format, ready to send. Include appropriate salutation (use "Hiring Manager" if no specific name is provided) and professional closing.

Create the cover letter now:`;

    let coverLetter = '';

    // Try OpenAI first if available
    if (openai) {
      try {
        
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a professional cover letter writer who creates compelling, tailored cover letters.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 800,
          temperature: 0.7,
        });

        coverLetter = completion.choices[0]?.message?.content || '';
        
        if (coverLetter.trim()) {
          console.log('✅ OpenAI cover letter generated successfully');
          return NextResponse.json({ 
            coverLetter: coverLetter.trim(),
            provider: 'OpenAI'
          });
        }
      } catch (error: any) {
        console.error('❌ OpenAI API error:', error.message);
        console.error('Error details:', error);
        
        // If it's a quota/billing error, log it specifically
        if (error.message?.includes('quota') || error.message?.includes('429')) {
          console.log('💡 OpenAI quota exceeded, will try Groq as fallback');
        }
      }
    }

    // Try Groq as fallback (or if OpenAI failed)
    if (groq && !coverLetter.trim()) {
      try {
        console.log('🔄 Trying Groq as fallback...');
        const completion = await groq.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'You are a professional cover letter writer who creates compelling, tailored cover letters.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          model: 'llama-3.1-8b-instant',
          max_tokens: 800,
          temperature: 0.7,
        });

        coverLetter = completion.choices[0]?.message?.content || '';
        
        if (coverLetter.trim()) {
          console.log('✅ Groq cover letter generated successfully');
          return NextResponse.json({ 
            coverLetter: coverLetter.trim(),
            provider: 'Groq'
          });
        }
      } catch (error: any) {
        console.error('❌ Groq API error:', error.message);
        console.error('Error details:', error);
        
        // If Groq also fails, we'll fall through to the final error
        if (error.message?.includes('quota') || error.message?.includes('429')) {
          console.log('💡 Groq quota also exceeded');
        }
      }
    }

    // If both AI providers fail, provide a helpful template
    console.error('❌ All AI providers failed to generate cover letter');
    
    const templateCoverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the position at your company. After reviewing the job description, I am excited about the opportunity to contribute my skills and experience to your team.

Based on my background and the requirements outlined in the job posting, I believe I would be a valuable addition to your organization. My experience has equipped me with the skills necessary to excel in this role, and I am particularly drawn to the opportunity to contribute to your company's continued success.

I would welcome the opportunity to discuss how my background and enthusiasm can benefit your team. Thank you for considering my application, and I look forward to hearing from you soon.

Sincerely,
[Your Name]

---
Note: This is a template cover letter. Our AI service is temporarily unavailable due to usage limits. Please customize this template with your specific experience and the job details.`;

    return NextResponse.json(
      { 
        coverLetter: templateCoverLetter,
        provider: 'Template (AI services temporarily unavailable)',
        isTemplate: true,
        message: 'AI services are temporarily unavailable due to usage limits. A template has been provided instead.'
      },
      { status: 200 }
    );

  } catch (error) {
    
    return NextResponse.json(
      { error: 'Failed to generate cover letter' },
      { status: 500 }
    );
  }
}
