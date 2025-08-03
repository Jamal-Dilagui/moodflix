# DeepSeek API Route Setup Guide

This guide will help you set up the `/api/deepseek` route for AI-powered movie recommendations.

## 🎯 **What This API Does**

The `/api/deepseek` route:
- ✅ Receives user preferences (mood, time, situation)
- ✅ Generates intelligent movie recommendations using DeepSeek AI
- ✅ Returns structured JSON with movie suggestions and explanations
- ✅ Handles errors gracefully with helpful messages

## 🔑 **Setup Steps**

### 1. **Install Dependencies**

The `openai` package should already be installed. If not:
```bash
npm install openai
```

### 2. **Get OpenRouter API Key**

1. Go to [OpenRouter](https://openrouter.ai/)
2. Create a free account
3. Navigate to "Keys" section
4. Create a new API key
5. Copy the key (starts with `sk-or-`)

### 3. **Configure Environment Variables**

Add these to your `.env.local`:

```env
# OpenRouter Configuration
OPENROUTER_API_KEY=sk-or-your-api-key-here
SITE_URL=http://localhost:3000
SITE_NAME=Moodflix
```

## 🚀 **How to Use the API**

### **POST Request**

```javascript
// Example POST request
const response = await fetch('/api/deepseek', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    mood: "bored",
    time: "1 hour",
    situation: "alone"
  })
});

const data = await response.json();
```

### **GET Request (for testing)**

```javascript
// Example GET request
const response = await fetch('/api/deepseek?mood=bored&time=1%20hour&situation=alone');
const data = await response.json();
```

## 📋 **API Response Format**

### **Success Response:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "title": "The Secret Life of Walter Mitty",
        "reason": "Perfect for when you're bored and alone - an inspiring adventure that will lift your spirits",
        "genre": "Adventure",
        "mood_match": "Uplifting and inspiring",
        "time_suitable": "Perfect length for 1 hour viewing"
      }
    ],
    "overall_analysis": "These movies are perfect for your bored mood when alone...",
    "user_preferences": {
      "mood": "bored",
      "time": "1 hour",
      "situation": "alone"
    },
    "total_results": 5
  },
  "source": "deepseek-via-openrouter"
}
```

### **Error Response:**
```json
{
  "error": "Missing required parameters",
  "message": "Please provide mood, time, and situation",
  "required": ["mood", "time", "situation"]
}
```

## 🧪 **Testing the API**

### **Option 1: Use the Test Script**

1. Start your Next.js server:
   ```bash
   npm run dev
   ```

2. Run the test script:
   ```bash
   node test-deepseek-api.js
   ```

### **Option 2: Test with curl**

```bash
curl -X POST http://localhost:3000/api/deepseek \
  -H "Content-Type: application/json" \
  -d '{
    "mood": "bored",
    "time": "1 hour",
    "situation": "alone"
  }'
```

### **Option 3: Test in Browser**

Visit: `http://localhost:3000/api/deepseek?mood=bored&time=1%20hour&situation=alone`

## 🎭 **Supported Input Values**

### **Moods:**
- `happy` - Uplifting, feel-good content
- `sad` - Comforting, emotional stories
- `bored` - Engaging, entertaining options
- `excited` - High-energy, action-packed
- `relaxed` - Calming, peaceful content
- `motivated` - Inspiring, uplifting stories
- `romantic` - Love stories, romantic comedies
- `adventurous` - Action, adventure, exploration

### **Time Constraints:**
- `30 minutes` - Quick watches
- `1 hour` - Standard episodes
- `2 hours` - Full-length movies
- `3+ hours` - Extended viewing sessions

### **Situations:**
- `alone` - Personal viewing preferences
- `family` - Family-friendly content
- `date` - Romantic, couple-friendly
- `friends` - Group entertainment

## 🛠️ **Error Handling**

The API handles various error scenarios:

### **Missing Parameters (400)**
```json
{
  "error": "Missing required parameters",
  "message": "Please provide mood, time, and situation",
  "required": ["mood", "time", "situation"]
}
```

### **API Key Not Configured (500)**
```json
{
  "error": "API key not configured",
  "message": "Please set OPENROUTER_API_KEY in your environment variables"
}
```

### **Authentication Failed (401)**
```json
{
  "error": "Authentication failed",
  "message": "Please check your OpenRouter API key"
}
```

### **Rate Limit Exceeded (429)**
```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Please try again later."
}
```

### **Insufficient Credits (402)**
```json
{
  "error": "Insufficient credits",
  "message": "Please add more credits to your OpenRouter account"
}
```

## 🔧 **Code Structure**

### **Key Functions:**

1. **`createMoviePrompt(mood, time, situation)`**
   - Generates the AI prompt based on user preferences
   - Ensures consistent formatting for the AI

2. **`POST(request)`**
   - Main API endpoint
   - Validates input parameters
   - Calls DeepSeek AI via OpenRouter
   - Parses and validates AI response
   - Returns structured data

3. **`GET(request)`**
   - Test endpoint for development
   - Accepts query parameters
   - Reuses POST logic

### **Error Handling:**
- ✅ Input validation
- ✅ API key validation
- ✅ JSON parsing validation
- ✅ Response structure validation
- ✅ Specific error messages for different scenarios

## 💰 **Pricing & Costs**

### **OpenRouter Pricing:**
- **Free Tier**: $5 in free credits
- **DeepSeek via OpenRouter**: ~$0.001-0.005 per request
- **1000 requests/month**: ~$1-5

### **Cost Optimization:**
- The API uses efficient prompts to minimize token usage
- Responses are limited to 1000 tokens
- Temperature is set to 0.7 for balanced creativity

## 🚀 **Integration Examples**

### **React Hook Example:**
```javascript
import { useState } from 'react';

function useDeepSeekRecommendations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState(null);

  const getRecommendations = async (mood, time, situation) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/deepseek', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, time, situation })
      });

      const data = await response.json();

      if (response.ok) {
        setRecommendations(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return { getRecommendations, loading, error, recommendations };
}
```

### **Direct API Call Example:**
```javascript
async function getMovieRecommendations(mood, time, situation) {
  const response = await fetch('/api/deepseek', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mood, time, situation })
  });

  if (!response.ok) {
    throw new Error('Failed to get recommendations');
  }

  return response.json();
}
```

## 🔍 **Debugging Tips**

### **Check Environment Variables:**
```bash
# Make sure these are set in .env.local
OPENROUTER_API_KEY=sk-or-your-key-here
SITE_URL=http://localhost:3000
SITE_NAME=Moodflix
```

### **Check API Key Format:**
- OpenRouter keys start with `sk-or-`
- Make sure there are no extra spaces or characters

### **Check Network Connectivity:**
- Ensure your Next.js server is running
- Check if OpenRouter is accessible from your network

### **Monitor Console Logs:**
- The API logs detailed error information
- Check your terminal/console for error messages

## 📝 **Testing Checklist**

- [ ] OpenRouter API key configured
- [ ] Environment variables set correctly
- [ ] Next.js server running on localhost:3000
- [ ] Test script runs successfully
- [ ] API responds to POST requests
- [ ] API responds to GET requests
- [ ] Error handling works correctly
- [ ] JSON response is properly formatted

---

🎬 **Your DeepSeek API route is ready for AI-powered movie recommendations!** 