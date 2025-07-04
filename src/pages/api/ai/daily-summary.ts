
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { emails } = req.body;
    
    if (!emails || !Array.isArray(emails)) {
      return res.status(400).json({ error: 'Emails array is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    // Group emails by sender domain to identify sources
    const emailSummary = emails.map((email: any) => ({
      from: email.from,
      subject: email.subject,
      category: email.category || 'general',
      timestamp: email.timestamp
    }));

    const prompt = `
    Analyze these emails received today and provide a concise summary in this format:
    "You have X emails from [source], Y emails about [topic], Z pending [action items]"
    
    Focus on:
    1. Group by sender type (work/boss, school/education, personal, newsletters, etc.)
    2. Identify action items or urgent matters
    3. Count emails by category
    4. Use natural language

    Emails: ${JSON.stringify(emailSummary)}

    Provide a friendly, conversational summary like: "You have 3 emails from work including 1 from your boss, 2 emails from school with 1 pending assignment, and 1 personal email."
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const summary = response.text().trim();

    // Extract numbers and create clickable data
    const clickableData = {
      work: emails.filter((e: any) => 
        e.from.toLowerCase().includes('work') || 
        e.from.toLowerCase().includes('boss') || 
        e.category === 'work'
      ),
      school: emails.filter((e: any) => 
        e.from.toLowerCase().includes('school') || 
        e.from.toLowerCase().includes('edu') || 
        e.category === 'education'
      ),
      personal: emails.filter((e: any) => e.category === 'personal'),
      urgent: emails.filter((e: any) => 
        e.subject.toLowerCase().includes('urgent') ||
        e.subject.toLowerCase().includes('asap') ||
        e.subject.toLowerCase().includes('deadline')
      )
    };

    res.status(200).json({ 
      summary,
      clickableData,
      totalEmails: emails.length
    });
  } catch (error) {
    console.error('Error generating daily summary:', error);
    res.status(500).json({ error: 'Failed to generate daily summary' });
  }
}
