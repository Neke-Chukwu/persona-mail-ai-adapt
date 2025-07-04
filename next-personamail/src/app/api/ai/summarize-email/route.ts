
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { emailContent } = await request.json();
    
    if (!emailContent) {
      return NextResponse.json({ error: 'Email content is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `
    Summarize the following email in 2-3 concise sentences. Focus on the key points, action items, and important information:

    Email Content:
    ${emailContent}

    Summary:
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const summary = response.text().trim();

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error summarizing email:', error);
    return NextResponse.json({ error: 'Failed to summarize email' }, { status: 500 });
  }
}
