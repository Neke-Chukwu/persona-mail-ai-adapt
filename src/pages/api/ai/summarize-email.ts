
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { emailContent } = req.body;
    
    if (!emailContent) {
      return res.status(400).json({ error: 'Email content is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
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

    res.status(200).json({ summary });
  } catch (error) {
    console.error('Error summarizing email:', error);
    res.status(500).json({ error: 'Failed to summarize email' });
  }
}
