
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { emailContent, tone = 'professional', persona = 'default' } = await request.json();
    
    if (!emailContent) {
      return NextResponse.json({ error: 'Email content is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const toneInstructions = {
      professional: "Write in a professional, courteous tone suitable for business communications.",
      casual: "Write in a friendly, conversational tone as if speaking to a colleague.",
      formal: "Write in a very formal, respectful tone suitable for official communications.",
      friendly: "Write in a warm, friendly tone that builds rapport."
    };

    const prompt = `
    Generate a thoughtful email reply to the following email. 
    
    Tone: ${toneInstructions[tone as keyof typeof toneInstructions] || toneInstructions.professional}
    
    Original Email:
    ${emailContent}
    
    Instructions:
    - Keep the reply concise but comprehensive
    - Address the main points from the original email
    - Be helpful and actionable
    - End with an appropriate closing
    - Do not include subject line or email headers
    
    Reply:
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const reply = response.text().trim();

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Error generating reply:', error);
    return NextResponse.json({ error: 'Failed to generate reply' }, { status: 500 });
  }
}
