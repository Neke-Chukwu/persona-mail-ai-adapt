
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { emailContent, tone = 'professional', persona = 'default' } = req.body;
    
    if (!emailContent) {
      return res.status(400).json({ error: 'Email content is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
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

    res.status(200).json({ reply });
  } catch (error) {
    console.error('Error generating reply:', error);
    res.status(500).json({ error: 'Failed to generate reply' });
  }
}
