# Tailor Interview Feature Setup Guide

## Overview
The "Tailor Interview" feature uses OpenAI's GPT-4 to generate personalized interview questions based on:
- **Company Name** (optional)
- **Job Role** (optional)

## Setup Instructions

### 1. Get Your OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to **API Keys** section
4. Click **"Create new secret key"**
5. Copy the API key (starts with `sk-...`)

### 2. Add API Key to Your Project
Open your `.env.local` file in the project root and add:

```env
OPENAI_API_KEY=sk-your-api-key-here
```

If you don't have a `.env.local` file, create one in the project root.

### 3. Restart Your Development Server
After adding the API key, restart your dev server:

```bash
npm run dev
```

## How It Works

### Interview Prep Feature
1. Click the **"✨ Tailor Interview"** button (purple gradient)
2. Enter company name and/or job role (both optional)
3. Click **"Generate Questions"**
4. AI generates 10 tailored questions
5. Questions appear in a new "Tailored Questions" category
6. Practice with AI-powered feedback!

### Video Interview Feature
1. Click the **"✨ Tailor Your Interview ✨"** button (golden animated)
2. Enter company name and/or job role (both optional)
3. Click **"Generate Questions"**
4. AI generates a tailored question for your video practice
5. Click "Start Practice" to begin recording!

## API Endpoint

The feature uses the `/api/interview/tailor` endpoint which:
- Accepts: `companyName`, `jobRole`, `questionCount`
- Returns: Array of tailored questions with categories and difficulty levels
- Uses: GPT-4o-mini for fast, cost-effective question generation

## Example Generated Questions

For a **Software Engineer** at **Google**:
- "Describe how you would approach designing a system that handles millions of requests per second at Google."
- "Google values innovation and 'moonshot thinking.' Tell me about a time you proposed or worked on an innovative solution."
- "How would you optimize a slow-running query in a large-scale database system?"

## Fallback Behavior

If the API key is not configured:
- Users will see an error message
- Feature will gracefully handle the error
- Generic questions will still be available

## Cost Considerations

- Uses **gpt-4o-mini** model (very affordable)
- Approximately $0.15 per 1M input tokens
- Each question generation uses ~500-1000 tokens
- Cost per question set: < $0.01

## Features

✅ Real-time AI question generation  
✅ Company-specific questions  
✅ Role-specific questions  
✅ Multiple difficulty levels  
✅ Categorized questions  
✅ Beautiful, animated UI  
✅ Mobile responsive  
✅ Works with existing interview features  

## Need Help?

If you encounter any issues:
1. Check that your API key is correct in `.env.local`
2. Restart your development server
3. Check the browser console for error messages
4. Check the terminal for API response logs


