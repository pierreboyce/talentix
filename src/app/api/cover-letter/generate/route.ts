import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import Groq from 'groq-sdk';

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
  console.error('❌ Failed to initialize OpenAI:', error);
}

try {
  if (process.env.GROQ_API_KEY) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
} catch (error) {
  console.error('❌ Failed to initialize Groq:', error);
}

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Cover letter generation started');
    
    // Check at least one provider is available
    if (!openai && !groq) {
      console.error('❌ No AI provider available');
      return NextResponse.json(
        { error: 'No AI provider available. Please check your OpenAI or Groq API keys in .env.local.' },
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

    console.log('👤 User ID:', userId);
    console.log('📄 CV length:', cv.length);
    console.log('💼 Job description length:', jobDescription.length);

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
        console.log('🤖 Generating with OpenAI...');
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
          console.log('✅ OpenAI generation successful');
          return NextResponse.json({ 
            coverLetter: coverLetter.trim(),
            provider: 'OpenAI'
          });
        }
      } catch (error) {
        console.error('❌ OpenAI failed:', error);
        console.error('❌ OpenAI error details:', error instanceof Error ? error.message : 'Unknown error');
        console.error('❌ OpenAI instance available:', !!openai);
      }
    }

    // Try Groq as fallback (or if OpenAI failed)
    if (groq && !coverLetter.trim()) {
      try {
        console.log('🤖 Generating with Groq...');
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
          console.log('✅ Groq generation successful');
          return NextResponse.json({ 
            coverLetter: coverLetter.trim(),
            provider: 'Groq'
          });
        }
      } catch (error) {
        console.error('❌ Groq failed:', error);
        console.error('❌ Groq error details:', error instanceof Error ? error.message : 'Unknown error');
        console.error('❌ Groq instance available:', !!groq);
      }
    }

    // If both AI providers fail, return an error instead of template
    console.log('❌ All AI providers failed');
    
    return NextResponse.json(
      { error: 'Failed to generate cover letter with AI providers. Please check your OpenAI or Groq API keys in .env.local file.' },
      { status: 500 }
    );

  } catch (error) {
    console.error('❌ Cover letter generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate cover letter' },
      { status: 500 }
    );
  }
}
