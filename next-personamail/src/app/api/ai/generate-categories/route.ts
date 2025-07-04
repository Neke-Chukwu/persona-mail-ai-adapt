
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const prompt = `
    Generate 4-6 personalized email categories for a user's inbox management. 
    Based on typical email patterns, create relevant categories that would help organize emails effectively.
    
    Return a JSON array with this structure:
    [
      {
        "name": "Category Name",
        "description": "Brief description of what emails belong here",
        "estimatedCount": 5
      }
    ]
    
    Focus on common categories like Work, Applications, Shopping, Social, Finance, etc.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\[(.*?)\]/s);
    let categories;
    
    if (jsonMatch) {
      try {
        categories = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error('JSON parsing failed:', parseError);
        categories = [
          { name: "Work", description: "Professional emails and communications", estimatedCount: 8 },
          { name: "Applications", description: "Job applications and career opportunities", estimatedCount: 5 },
          { name: "Shopping", description: "Order confirmations and retail communications", estimatedCount: 3 },
          { name: "Finance", description: "Banking and financial notifications", estimatedCount: 2 }
        ];
      }
    } else {
      categories = [
        { name: "Work", description: "Professional emails and communications", estimatedCount: 8 },
        { name: "Applications", description: "Job applications and career opportunities", estimatedCount: 5 },
        { name: "Shopping", description: "Order confirmations and retail communications", estimatedCount: 3 },
        { name: "Finance", description: "Banking and financial notifications", estimatedCount: 2 }
      ];
    }

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error generating categories:', error);
    return NextResponse.json({ error: 'Failed to generate categories' }, { status: 500 });
  }
}
