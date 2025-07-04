
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { emails = [] } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const emailContext = emails.map((email: any) => 
      `From: ${email.sender}, Subject: ${email.subject}, Category: ${email.category || 'general'}`
    ).join('\n');

    const prompt = `
    Analyze the following emails received today and provide a concise daily summary:

    ${emailContext}

    Create a summary in this format:
    "You have [X] emails from [category], [Y] emails about [topic], and [Z] [specific items like pending assignments, boss messages, etc.]"

    Make it conversational and highlight the most important categories and senders. Group similar emails together.
    Keep it under 2 sentences and make the numbers clickable references.

    Summary:
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const summary = response.text().trim();

    // Extract categories and counts for clickable links
    const categoryCount = emails.reduce((acc: any, email: any) => {
      const category = email.category || 'general';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({ 
      summary,
      categoryBreakdown: categoryCount,
      totalEmails: emails.length
    });
  } catch (error) {
    console.error('Error generating daily summary:', error);
    return NextResponse.json({ error: 'Failed to generate daily summary' }, { status: 500 });
  }
}
