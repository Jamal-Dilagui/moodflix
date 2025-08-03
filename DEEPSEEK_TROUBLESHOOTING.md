# DeepSeek API Troubleshooting Guide

## 🚨 **Error: "Failed to parse AI response: SyntaxError: Unexpected end of JSON input"**

This error occurs when the AI returns an empty response. Here's how to fix it:

## 🔍 **Step 1: Check Environment Variables**

Make sure you have these in your `.env.local` file:

```env
OPENROUTER_API_KEY=sk-or-your-api-key-here
SITE_URL=http://localhost:3000
SITE_NAME=Moodflix
```

## 🔍 **Step 2: Verify API Key**

1. **Get your OpenRouter API key:**
   - Go to [OpenRouter](https://openrouter.ai/)
   - Sign in to your account
   - Go to "Keys" section
   - Copy your API key (starts with `sk-or-`)

2. **Test the API key:**
   ```bash
   # Start your server
   npm run dev
   
   # Test the API connection
   node test-deepseek-debug.js
   ```

## 🔍 **Step 3: Check Server Logs**

When you make a request, check your terminal for these logs:

```
Sending request to OpenRouter with prompt: You are an expert movie recommendation AI...
OpenRouter response received: { ... }
```

If you see errors, they might be:
- `Authentication failed` → Check your API key
- `Rate limit exceeded` → Wait a few minutes
- `Insufficient credits` → Add credits to your account

## 🔍 **Step 4: Test API Connection**

Visit this URL in your browser:
```
http://localhost:3000/api/deepseek
```

You should see:
```json
{
  "success": true,
  "message": "OpenRouter API is working!",
  "test_response": "Hello, API is working!",
  "api_key_configured": true
}
```

## 🔍 **Step 5: Common Issues**

### **Issue: "API key not configured"**
**Solution:** Add `OPENROUTER_API_KEY` to your `.env.local`

### **Issue: "Authentication failed"**
**Solution:** 
- Check your API key format (should start with `sk-or-`)
- Make sure there are no extra spaces
- Verify the key is active in your OpenRouter account

### **Issue: "Rate limit exceeded"**
**Solution:** 
- Wait a few minutes before trying again
- Check your OpenRouter usage limits

### **Issue: "Insufficient credits"**
**Solution:** 
- Add credits to your OpenRouter account
- Check your billing status

## 🔍 **Step 6: Debug Steps**

1. **Run the debug script:**
   ```bash
   node test-deepseek-debug.js
   ```

2. **Check server logs** when making a request

3. **Test with curl:**
   ```bash
   curl -X POST http://localhost:3000/api/deepseek \
     -H "Content-Type: application/json" \
     -d '{"mood":"bored","time":"1 hour","situation":"alone"}'
   ```

## 🔍 **Step 7: Alternative Models**

If DeepSeek is having issues, you can try other models by changing the model name in `app/api/deepseek/route.js`:

```javascript
// Change this line:
model: 'deepseek/deepseek-chat',

// To one of these:
model: 'openai/gpt-4o-mini',  // OpenAI's model
model: 'anthropic/claude-3-haiku',  // Anthropic's model
model: 'meta-llama/llama-3.1-8b-instruct',  // Meta's model
```

## 🔍 **Step 8: Check OpenRouter Status**

- Visit [OpenRouter Status](https://status.openrouter.ai/)
- Check if there are any service issues

## 🔍 **Step 9: Verify Setup**

Make sure you have:
- ✅ OpenRouter account created
- ✅ API key generated
- ✅ Credits added to account
- ✅ Environment variables set
- ✅ Server running (`npm run dev`)

## 🆘 **Still Having Issues?**

1. **Check the console logs** in your browser's developer tools
2. **Check the terminal logs** where your server is running
3. **Try the test endpoint:** `http://localhost:3000/api/deepseek`
4. **Verify your API key** in the OpenRouter dashboard

---

**Need more help?** Check the OpenRouter documentation or contact their support. 