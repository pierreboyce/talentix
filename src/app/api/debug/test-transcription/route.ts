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
  console.error('OpenAI init error:', error);
}

try {
  if (process.env.GROQ_API_KEY) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
} catch (error) {
  console.error('Groq init error:', error);
}

export async function GET(request: NextRequest) {
  try {
    const results = {
      openai: {
        available: !!openai,
        keyExists: !!process.env.OPENAI_API_KEY,
        keyLength: process.env.OPENAI_API_KEY?.length || 0,
        testResult: null as any
      },
      groq: {
        available: !!groq,
        keyExists: !!process.env.GROQ_API_KEY,
        keyLength: process.env.GROQ_API_KEY?.length || 0,
        testResult: null as any
      }
    };

    // Test OpenAI with a simple completion
    if (openai) {
      try {
        console.log('🧪 Testing OpenAI API...');
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'Say "OpenAI is working"' }],
          max_tokens: 10,
        });
        console.log('✅ OpenAI test successful');
        results.openai.testResult = {
          success: true,
          response: completion.choices[0]?.message?.content || 'No response'
        };
      } catch (error: any) {
        console.error('❌ OpenAI test failed:', error.message);
        console.error('❌ Full OpenAI error:', error);
        results.openai.testResult = {
          success: false,
          error: error.message,
          code: error.code,
          type: error.type,
          status: error.status
        };
      }
    }

    // Test Groq with a simple completion
    if (groq) {
      try {
        console.log('🧪 Testing Groq API...');
        const completion = await groq.chat.completions.create({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: 'Say "Groq is working"' }],
          max_tokens: 10,
        });
        console.log('✅ Groq test successful');
        results.groq.testResult = {
          success: true,
          response: completion.choices[0]?.message?.content || 'No response'
        };
      } catch (error: any) {
        console.error('❌ Groq test failed:', error.message);
        console.error('❌ Full Groq error:', error);
        results.groq.testResult = {
          success: false,
          error: error.message,
          code: error.code,
          type: error.type,
          status: error.status
        };
      }
    }

    return NextResponse.json({
      success: true,
      results,
      summary: {
        openaiWorking: results.openai.testResult?.success || false,
        groqWorking: results.groq.testResult?.success || false,
        anyWorking: (results.openai.testResult?.success || results.groq.testResult?.success) || false
      }
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Test failed', details: error.message },
      { status: 500 }
    );
  }
}
