import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client with OpenRouter configuration
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3000',
    'X-Title': process.env.SITE_NAME || 'Moodflix',
  },
});

/**
 * Generate a movie recommendation prompt based on user preferences
 * @param {string} mood - User's current mood
 * @param {string} time - Available time
 * @param {string} situation - Current situation
 * @returns {string} Formatted prompt for AI
 */
function createMoviePrompt(mood, time, situation) {
  return `You are an expert movie recommendation AI. Based on the user's preferences, suggest 5 specific movie titles that would be perfect for their situation.

User Preferences:
- Mood: ${mood}
- Time Available: ${time}
- Situation: ${situation}

Please provide your response in the following JSON format:
{
  "recommendations": [
    {
      "title": "Exact Movie Title",
      "reason": "Brief explanation of why this movie fits their mood and situation",
      "genre": "Primary genre",
      "mood_match": "How it matches their mood",
      "time_suitable": "Why it works for their time constraint"
    }
  ],
  "overall_analysis": "Brief analysis of why these movies are perfect for their current state"
}

Focus on movies that:
1. Match the user's emotional state (${mood})
2. Can be enjoyed within their time constraint (${time})
3. Are appropriate for their situation (${situation})
4. Are well-known and accessible
5. Have positive reviews and ratings

Return only the JSON response, no additional text.`;
}

/**
 * POST /api/deepseek
 * Get AI-powered movie recommendations using DeepSeek via OpenRouter
 */
export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { mood, time, situation } = body;

    // Validate required parameters
    if (!mood || !time || !situation) {
      return NextResponse.json(
        { 
          error: 'Missing required parameters',
          message: 'Please provide mood, time, and situation',
          required: ['mood', 'time', 'situation']
        },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { 
          error: 'API key not configured',
          message: 'Please set OPENROUTER_API_KEY in your environment variables'
        },
        { status: 500 }
      );
    }

    // Create the prompt for AI
    const prompt = createMoviePrompt(mood, time, situation);

    // Call DeepSeek AI via OpenRouter
    console.log('Sending request to OpenRouter with prompt:', prompt.substring(0, 200) + '...');
    
    const completion = await openai.chat.completions.create({
      model: 'deepseek/deepseek-chat',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 0.9,
      frequency_penalty: 0.1,
      presence_penalty: 0.1
    });

    console.log('OpenRouter response received:', completion);

    // Extract the AI response
    const aiResponse = completion.choices[0]?.message?.content;
    
    if (!aiResponse) {
      console.error('Empty AI response received');
      return NextResponse.json(
        { 
          error: 'Empty AI response',
          message: 'The AI returned an empty response. Please check your API key and try again.',
          completion: completion
        },
        { status: 500 }
      );
    }

    // Try to parse the JSON response
    let recommendations;
    try {
      recommendations = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw AI response:', aiResponse);
      
      return NextResponse.json(
        { 
          error: 'Invalid AI response',
          message: 'The AI returned an invalid response format',
          raw_response: aiResponse
        },
        { status: 500 }
      );
    }

    // Validate the response structure
    if (!recommendations.recommendations || !Array.isArray(recommendations.recommendations)) {
      return NextResponse.json(
        { 
          error: 'Invalid response structure',
          message: 'AI response does not contain recommendations array',
          received: recommendations
        },
        { status: 500 }
      );
    }

    // Return successful response
    return NextResponse.json({
      success: true,
      data: {
        recommendations: recommendations.recommendations,
        overall_analysis: recommendations.overall_analysis,
        user_preferences: { mood, time, situation },
        total_results: recommendations.recommendations.length
      },
      source: 'deepseek-via-openrouter'
    });

  } catch (error) {
    console.error('DeepSeek API error:', error);

    // Handle specific error types
    if (error.message.includes('API key')) {
      return NextResponse.json(
        { 
          error: 'Authentication failed',
          message: 'Please check your OpenRouter API key'
        },
        { status: 401 }
      );
    }

    if (error.message.includes('rate limit')) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.'
        },
        { status: 429 }
      );
    }

    if (error.message.includes('insufficient credits')) {
      return NextResponse.json(
        { 
          error: 'Insufficient credits',
          message: 'Please add more credits to your OpenRouter account'
        },
        { status: 402 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Something went wrong while processing your request',
        details: error.message
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/deepseek
 * Test endpoint for development (optional)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const mood = searchParams.get('mood');
    const time = searchParams.get('time');
    const situation = searchParams.get('situation');

    // If no parameters, test the API connection
    if (!mood && !time && !situation) {
      console.log('Testing OpenRouter API connection...');
      
      try {
        const testCompletion = await openai.chat.completions.create({
          model: 'deepseek/deepseek-chat',
          messages: [
            {
              role: 'user',
              content: 'Say "Hello, API is working!"'
            }
          ],
          max_tokens: 50
        });

        const testResponse = testCompletion.choices[0]?.message?.content;
        
        return NextResponse.json({
          success: true,
          message: 'OpenRouter API is working!',
          test_response: testResponse,
          api_key_configured: !!process.env.OPENROUTER_API_KEY
        });
      } catch (apiError) {
        console.error('API test failed:', apiError);
        return NextResponse.json({
          success: false,
          error: 'API connection failed',
          message: apiError.message,
          api_key_configured: !!process.env.OPENROUTER_API_KEY
        }, { status: 500 });
      }
    }

    if (!mood || !time || !situation) {
      return NextResponse.json(
        { 
          error: 'Missing parameters',
          message: 'Please provide mood, time, and situation as query parameters',
          example: '/api/deepseek?mood=bored&time=1%20hour&situation=alone'
        },
        { status: 400 }
      );
    }

    // Use POST logic for GET requests
    const body = { mood, time, situation };
    const mockRequest = { json: async () => body };
    
    return POST(mockRequest);

  } catch (error) {
    console.error('GET request error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Something went wrong while processing your request'
      },
      { status: 500 }
    );
  }
} 