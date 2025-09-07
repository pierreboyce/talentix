import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import Groq from 'groq-sdk';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { createReadStream } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

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

// Common filler words to detect
const fillerWords = [
  'um', 'uh', 'like', 'you know', 'so', 'well', 'actually', 'basically',
  'literally', 'totally', 'really', 'very', 'just', 'kind of', 'sort of',
  'i mean', 'right', 'okay', 'alright', 'anyway', 'obviously'
];

export async function POST(request: NextRequest) {
  try {
    console.log('🎥 Video interview analysis started');
    
    // Check at least one provider exists
    if (!openai && !groq) {
      console.error('❌ No AI provider available');
      return NextResponse.json(
        { error: 'No AI provider configured. Add OPENAI_API_KEY or GROQ_API_KEY to .env.local.' },
        { status: 500 }
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

    console.log('📝 Question:', question);
    console.log('📁 Category:', category);
    console.log('👤 User ID:', userId);
    console.log('🎬 Video file size:', videoFile.size, 'bytes');

    // Save uploaded file temporarily (make sure directory exists)
    const buffer = Buffer.from(await videoFile.arrayBuffer());
    const filename = `${uuidv4()}.webm`;
    const tempDir = path.join(process.cwd(), 'temp');
    const filepath = path.join(tempDir, filename);
    
    try {
      await mkdir(tempDir, { recursive: true });
      await writeFile(filepath, buffer);
      console.log('💾 Video file saved temporarily:', filepath);
    } catch (error) {
      console.error('❌ Error saving video file:', error);
      return NextResponse.json(
        { error: 'Failed to save video file' },
        { status: 500 }
      );
    }

    // Helper: attempt transcription with providers in order
    const transcribeAudio = async (): Promise<string> => {
      // Use Node stream for better compatibility
      const audioStream = createReadStream(filepath);

      // 1) Try OpenAI Whisper first if available
      if (openai) {
        try {
          console.log('🎤 Whisper (OpenAI) transcription attempt...');
          const transcriptionResponse = await openai.audio.transcriptions.create({
            file: audioStream as any,
            model: 'whisper-1',
            language: 'en',
          });
          const t = transcriptionResponse.text;
          if (t && t.trim().length > 0) {
            console.log('✅ Whisper (OpenAI) transcription complete');
            return t;
          }
        } catch (err) {
          console.error('❌ Whisper (OpenAI) failed:', err);
          // fall through to next provider
        }
      }

      // 2) Try Groq Whisper if key present
      if (groq) {
        try {
          console.log('🎤 Whisper (Groq) transcription attempt...');
          const groqResp = await groq.audio.transcriptions.create({
            file: createReadStream(filepath) as unknown as any,
            // Groq-compatible Whisper model name
            model: 'whisper-large-v3',
            response_format: 'json',
            language: 'en',
          } as any);
          const t = (groqResp as any)?.text || (groqResp as any)?.transcription || '';
          if (t && t.trim().length > 0) {
            console.log('✅ Whisper (Groq) transcription complete');
            return t;
          }
        } catch (err) {
          console.error('❌ Whisper (Groq) failed:', err);
        }
      }

      throw new Error('Transcription failed with all providers');
    };

    // Helper: analyze transcript with LLM providers in order
    const analyzeTranscript = async (question: string, category: string, transcript: string) => {
      console.log('🧠 Starting LLM analysis...');
      
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
          console.log('🔍 Raw OpenAI analysis:', analysisContent);
          const result = tryParse(analysisContent);
          return result;
        } catch (err) {
          console.error('❌ OpenAI analysis failed:', err);
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
          console.log('🔍 Raw Groq analysis:', analysisContent);
          const result = tryParse(analysisContent);
          return result;
        } catch (err) {
          console.error('❌ Groq analysis failed:', err);
        }
      }

      throw new Error('Analysis failed with all providers');
    };

    try {
      // Step 1: Transcribe audio (OpenAI → Groq)
      const transcript = await transcribeAudio();
      console.log('📄 Transcript:', transcript);
      if (!transcript || transcript.trim().length === 0) {
        throw new Error('No speech detected in the recording');
      }

      // Step 2: Analyze transcript (OpenAI → Groq)
      const analysisResult = await analyzeTranscript(question, category, transcript);

      // Validate required fields
      const requiredFields = ['clarity', 'confidence', 'relevance', 'overallScore', 'fillerWords', 'strengths', 'improvements'];
      for (const field of requiredFields) {
        if (!(field in analysisResult)) {
          console.error(`❌ Missing required field: ${field}`);
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

      console.log('✅ Video interview analysis complete!', {
        clarity: analysisResult.clarity,
        confidence: analysisResult.confidence,
        relevance: analysisResult.relevance,
        overallScore: analysisResult.overallScore,
        fillerWordsCount: allFillerWords.length
      });

      // Save to localStorage-based storage (temporary solution)
      console.log('💾 Saving interview attempt to storage...');
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
      // Clean up temporary file
      try {
        await unlink(filepath);
        console.log('🗑️ Temporary file deleted');
      } catch (cleanupError) {
        console.error('⚠️ Failed to delete temporary file:', cleanupError);
      }
    }

  } catch (error) {
    console.error('❌ Video interview analysis error:', error);
    
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
