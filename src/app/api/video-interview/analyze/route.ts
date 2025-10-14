import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import Groq from 'groq-sdk';
import { v4 as uuidv4 } from 'uuid';
import { rateLimiters, createRateLimitResponse } from '../../../../lib/rate-limiter';

// Configure route for large payloads
export const maxDuration = 60; // 60 seconds timeout

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

// Common filler words to detect
const fillerWords = [
  'um', 'uh', 'like', 'you know', 'so', 'well', 'actually', 'basically',
  'literally', 'totally', 'really', 'very', 'just', 'kind of', 'sort of',
  'i mean', 'right', 'okay', 'alright', 'anyway', 'obviously'
];

export async function POST(request: NextRequest) {
  try {
    // 🛡️ Rate limiting check - 3 requests per minute for expensive video analysis
    const rateLimitResult = await rateLimiters.aiHeavy.checkLimit(request);
    if (!rateLimitResult.allowed) {
      console.log('🚫 Video interview analysis rate limit exceeded');
      return createRateLimitResponse(rateLimitResult.resetTime);
    }
    console.log(`✅ Video analysis rate limit passed. Remaining: ${rateLimitResult.remaining}`);
    
    // Check at least one provider exists
    if (!openai && !groq) {
      console.error('❌ No AI providers available for video interview analysis');
      console.error('OpenAI API Key exists:', !!process.env.OPENAI_API_KEY);
      console.error('Groq API Key exists:', !!process.env.GROQ_API_KEY);
      
      return NextResponse.json(
        { 
          error: 'AI services temporarily unavailable',
          details: 'Both OpenAI and Groq are currently experiencing issues. Please try again later or contact support.',
          fallback: {
            message: 'Video interview analysis is temporarily unavailable due to AI service issues.',
            suggestion: 'Please try again in a few minutes, or contact support if the issue persists.',
            supportEmail: 'support@talentix.co.uk'
          }
        },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const videoFile = formData.get('video') as File;
    const question = formData.get('question') as string;
    const category = formData.get('category') as string;
    const userId = formData.get('userId') as string;

    if (!videoFile || !question) {
      return NextResponse.json(
        { error: 'Video file and question are required' },
        { status: 400 }
      );
    }

    
    
    
    

    // Check file size limit (20MB for Vercel compatibility)
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (videoFile.size > maxSize) {
      
      return NextResponse.json(
        { error: `Video file too large. Maximum size is 20MB. Your file is ${Math.round(videoFile.size / 1024 / 1024)}MB. Please record a shorter answer.` },
        { status: 413 }
      );
    }

    // Process video file in memory (Vercel doesn't allow disk writes)
    const buffer = Buffer.from(await videoFile.arrayBuffer());
    
    
    

    // Helper: attempt transcription with providers in order
    const transcribeAudio = async (): Promise<string> => {
      // Determine appropriate filename based on MIME type
      let filename = 'video.webm';
      if (videoFile.type.includes('mp4')) {
        filename = 'video.mp4';
      } else if (videoFile.type.includes('webm')) {
        filename = 'video.webm';
      } else if (videoFile.type.includes('ogg')) {
        filename = 'video.ogg';
      }
      
      
      
      // Create a File object from buffer for API compatibility
      const videoFileForAPI = new File([buffer], filename, { type: videoFile.type });

      // 1) Try OpenAI Whisper first if available
      if (openai) {
        try {
          console.log('🎤 Attempting OpenAI Whisper transcription...');
          console.log('📁 File details:', {
            name: filename,
            type: videoFile.type,
            size: videoFile.size
          });
          
          const transcriptionResponse = await openai.audio.transcriptions.create({
            file: videoFileForAPI,
            model: 'whisper-1',
            language: 'en',
          });
          
          const t = transcriptionResponse.text;
          console.log('✅ OpenAI transcription result:', t ? `"${t.substring(0, 100)}..."` : 'EMPTY');
          
          if (t && t.trim().length > 0) {
            return t;
          }
        } catch (err: any) {
          console.error('❌ OpenAI transcription error:', err.message);
          console.error('❌ Full error:', err);
          if (err.message?.includes('quota') || err.message?.includes('429')) {
            console.log('💡 OpenAI quota exceeded for transcription, trying Groq...');
          }
        }
      }

      // 2) Try Groq Whisper if key present
      if (groq) {
        try {
          const groqResp = await groq.audio.transcriptions.create({
            file: videoFileForAPI,
            // Groq-compatible Whisper model name
            model: 'whisper-large-v3',
            response_format: 'json',
            language: 'en',
          } as any);
          const t = (groqResp as any)?.text || (groqResp as any)?.transcription || '';
          if (t && t.trim().length > 0) {
            return t;
          }
        } catch (err: any) {
          console.error('❌ Groq transcription error:', err.message);
          if (err.message?.includes('quota') || err.message?.includes('429')) {
            console.log('💡 Groq quota also exceeded for transcription');
          }
        }
      }

      console.error('❌ All transcription providers failed');
      console.error('Video file details:', {
        name: videoFile.name,
        type: videoFile.type,
        size: videoFile.size,
        filename: filename
      });
      
      throw new Error('Transcription failed with all providers. Video details: ' + JSON.stringify({
        type: videoFile.type,
        size: videoFile.size,
        filename: filename
      }));
    };

    // Helper: analyze transcript with LLM providers in order
    const analyzeTranscript = async (question: string, category: string, transcript: string) => {
      
      
      const analysisPrompt = `
You are an expert interview coach analyzing a candidate's video interview response. 

INTERVIEW QUESTION: "${question}"
CATEGORY: ${category}
CANDIDATE'S ANSWER: "${transcript}"

Please analyze this interview response and provide detailed feedback in the following JSON format:

{
  "clarity": <score 1-10>,
  "confidence": <score 1-10>, 
  "relevance": <score 1-10>,
  "overallScore": <average score 1-10>,
  "fillerWords": [<array of detected filler words from the response>],
  "strengths": [<array of 2-4 specific strengths>],
  "improvements": [<array of 2-4 specific areas for improvement>],
  "transcript": "${transcript}"
}

SCORING CRITERIA:
- Clarity (1-10): Speech clarity, articulation, pace, and ease of understanding
- Confidence (1-10): Tone of voice, hesitation, assertiveness, and overall presence
- Relevance (1-10): How well the answer addresses the question and demonstrates relevant skills/experience

FILLER WORDS TO DETECT: um, uh, like, you know, so, well, actually, basically, literally, totally, really, very, just, kind of, sort of, i mean, right, okay, alright, anyway, obviously

Provide constructive, specific feedback that will help the candidate improve their interview performance. Be encouraging but honest about areas that need work.

Return ONLY the JSON object, no additional text.
`;

      // Prefer OpenAI if available
      const tryParse = (text: string) => {
        // Extract first JSON object to be robust to extra text
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        const candidate = start >= 0 && end > start ? text.slice(start, end + 1) : text;
        return JSON.parse(candidate);
      };

      if (openai) {
        try {
          const gptResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'You are an expert interview coach. Analyze interview responses and provide detailed, constructive feedback in JSON format.' },
              { role: 'user', content: analysisPrompt }
            ],
            temperature: 0.3,
            max_tokens: 1500,
          });
          const analysisContent = gptResponse.choices[0]?.message?.content || '';
          
          const result = tryParse(analysisContent);
          return result;
        } catch (err: any) {
          console.error('❌ OpenAI analysis error:', err.message);
          if (err.message?.includes('quota') || err.message?.includes('429')) {
            console.log('💡 OpenAI quota exceeded for analysis, trying Groq...');
          }
        }
      }

      if (groq) {
        try {
          const groqResp = await groq.chat.completions.create({
            model: 'llama-3.1-70b-versatile',
            messages: [
              { role: 'system', content: 'You are an expert interview coach. Analyze interview responses and provide detailed, constructive feedback in JSON format.' },
              { role: 'user', content: analysisPrompt }
            ],
            temperature: 0.2,
            max_tokens: 1500,
          });
          const analysisContent = groqResp.choices?.[0]?.message?.content || '';
          
          const result = tryParse(analysisContent);
          return result;
        } catch (err: any) {
          console.error('❌ Groq analysis error:', err.message);
          if (err.message?.includes('quota') || err.message?.includes('429')) {
            console.log('💡 Groq quota also exceeded for analysis');
          }
        }
      }

      throw new Error('Analysis failed with all providers');
    };

    try {
      // Step 1: Transcribe audio (OpenAI → Groq)
      let transcript = '';
      
      try {
        transcript = await transcribeAudio();
      } catch (transcriptionError: any) {
        console.error('❌ Transcription failed:', transcriptionError.message);
        
        // Return a helpful error with manual transcript option
        return NextResponse.json({
          error: 'Failed to transcribe audio',
          details: transcriptionError.message,
          suggestion: 'Try recording again with better audio quality, or use the manual transcript option if available.',
          fallback: {
            canRetry: true,
            supportedFormats: ['mp4', 'webm', 'ogg'],
            maxSize: '10MB',
            tips: [
              'Ensure good audio quality',
              'Speak clearly and avoid background noise',
              'Keep video under 2 minutes',
              'Use supported formats: MP4, WebM, OGG'
            ]
          }
        }, { status: 500 });
      }
      
      if (!transcript || transcript.trim().length === 0) {
        return NextResponse.json({
          error: 'No speech detected in the recording',
          details: 'The audio transcription was empty. Please ensure you spoke clearly and there was no background noise.',
          suggestion: 'Try recording again with better audio quality.'
        }, { status: 500 });
      }

      // Step 2: Analyze transcript (OpenAI → Groq)
      const analysisResult = await analyzeTranscript(question, category, transcript);

      // Validate required fields
      const requiredFields = ['clarity', 'confidence', 'relevance', 'overallScore', 'fillerWords', 'strengths', 'improvements'];
      for (const field of requiredFields) {
        if (!(field in analysisResult)) {
          
          throw new Error(`Analysis result missing required field: ${field}`);
        }
      }

      // Additional processing: detect filler words manually as backup
      const detectedFillers = fillerWords.filter(word => 
        transcript.toLowerCase().includes(word)
      );
      
      // Merge with GPT-detected filler words
      const allFillerWords = [...new Set([...analysisResult.fillerWords, ...detectedFillers])];
      analysisResult.fillerWords = allFillerWords;

      

      // Save to localStorage-based storage (temporary solution)
      
      const interviewAttempt = {
        id: uuidv4(),
        userId,
        question,
        category,
        transcript,
        scores: {
          clarity: analysisResult.clarity,
          confidence: analysisResult.confidence,
          relevance: analysisResult.relevance,
          overall: analysisResult.overallScore
        },
        fillerWords: allFillerWords,
        strengths: analysisResult.strengths,
        improvements: analysisResult.improvements,
        createdAt: new Date().toISOString()
      };
      
      // For now, we'll return the attempt data to be stored on the client side
      analysisResult.attemptData = interviewAttempt;

      return NextResponse.json(analysisResult);

    } finally {
      // No cleanup needed since we're processing in memory
    }

  } catch (error) {
    
    
    let errorMessage = 'Failed to analyze video interview';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    // No mock data - let errors propagate to show proper error messages
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
