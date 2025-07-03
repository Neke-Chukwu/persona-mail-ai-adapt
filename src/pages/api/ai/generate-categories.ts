
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
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

    res.status(200).json({ categories });
  } catch (error) {
    console.error('Error generating categories:', error);
    res.status(500).json({ error: 'Failed to generate categories' });
  }
}
