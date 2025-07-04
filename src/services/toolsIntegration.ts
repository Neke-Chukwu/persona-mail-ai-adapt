
// Comprehensive integration service for all hackathon tools

import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import FirecrawlApp from '@mendable/firecrawl-js';
import { Resend } from 'resend';
import { useTranslation } from 'react-i18next';
import { useCustomer, allowed, track } from 'autumn-js/react';

// Environment variables checker
export const checkRequiredEnvVars = () => {
  const required = [
    'VITE_GEMINI_API_KEY',
    'VITE_SUPABASE_URL', 
    'VITE_SUPABASE_ANON_KEY',
    'VITE_RESEND_API_KEY',
    'VITE_FIRECRAWL_API_KEY',
    'VITE_TAMBO_API_KEY',
    'VITE_BETTER_AUTH_SECRET',
    'VITE_AUTUMN_API_KEY'
  ];

  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
    return false;
  }
  
  return true;
};

// Gemini AI Service
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  
  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) throw new Error('Gemini API key not found');
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateEmailReply(emailContent: string, context: string = '') {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const prompt = `Generate a professional email reply for: ${emailContent}. Context: ${context}`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  async summarizeEmail(emailContent: string) {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const prompt = `Summarize this email in 2-3 sentences: ${emailContent}`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  async analyzeEmailPatterns(emails: any[]) {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const prompt = `Analyze these email patterns and provide insights: ${JSON.stringify(emails)}`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  }
}

// Supabase Service
export class SupabaseService {
  private supabase;

  constructor() {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error('Supabase credentials not found');
    this.supabase = createClient(url, key);
  }

  async saveUserPreferences(userId: string, preferences: any) {
    return await this.supabase
      .from('user_preferences')
      .upsert({ user_id: userId, ...preferences });
  }

  async getUserPreferences(userId: string) {
    return await this.supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
  }

  async saveEmailCategories(userId: string, categories: any[]) {
    return await this.supabase
      .from('email_categories')
      .upsert({ user_id: userId, categories });
  }
}

// Resend Service
export class ResendService {
  private resend;

  constructor() {
    const apiKey = import.meta.env.VITE_RESEND_API_KEY;
    if (!apiKey) throw new Error('Resend API key not found');
    this.resend = new Resend(apiKey);
  }

  async sendEmail(to: string, subject: string, content: string) {
    return await this.resend.emails.send({
      from: 'PersonaMail AI <noreply@yourdomain.com>',
      to,
      subject,
      html: content
    });
  }

  async sendDailyDigest(to: string, summary: string) {
    return await this.sendEmail(
      to,
      'Your Daily Email Summary',
      `<h1>Daily Email Summary</h1><p>${summary}</p>`
    );
  }
}

// Firecrawl Service
export class FirecrawlService {
  private app;

  constructor() {
    const apiKey = import.meta.env.VITE_FIRECRAWL_API_KEY;
    if (!apiKey) throw new Error('Firecrawl API key not found');
    this.app = new FirecrawlApp({ apiKey });
  }

  async scrapeJobPosting(url: string) {
    try {
      const scrapeResult = await this.app.scrapeUrl(url, {
        formats: ['markdown'],
      });
      return scrapeResult.markdown;
    } catch (error) {
      console.error('Firecrawl scraping error:', error);
      return null;
    }
  }

  async enhanceApplicationTracking(jobUrl: string) {
    const content = await this.scrapeJobPosting(jobUrl);
    if (content) {
      // Extract job requirements, company info, etc.
      return {
        content,
        requirements: this.extractRequirements(content),
        companyInfo: this.extractCompanyInfo(content)
      };
    }
    return null;
  }

  private extractRequirements(content: string) {
    // Simple regex to find requirements section
    const reqMatch = content.match(/requirements?:?[\s\S]*?(?=\n\n|\n[A-Z])/i);
    return reqMatch ? reqMatch[0] : '';
  }

  private extractCompanyInfo(content: string) {
    // Simple extraction of company information
    const companyMatch = content.match(/about\s+(?:the\s+)?company:?[\s\S]*?(?=\n\n|\n[A-Z])/i);
    return companyMatch ? companyMatch[0] : '';
  }
}

// Usage Tracking Hook (Autumn integration)
export const useUsageTracking = () => {
  const customer = useCustomer();
  const [dailyReplies, setDailyReplies] = useState(0);
  const maxFreeReplies = 10;

  const canUseAIReply = allowed({ featureId: "ai_replies" }) && dailyReplies < maxFreeReplies;

  const trackAIReply = async () => {
    if (canUseAIReply) {
      await track("ai_replies");
      setDailyReplies(prev => prev + 1);
    }
  };

  // Reset daily count at midnight
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const timeout = setTimeout(() => {
      setDailyReplies(0);
    }, msUntilMidnight);

    return () => clearTimeout(timeout);
  }, []);

  return {
    canUseAIReply,
    trackAIReply,
    dailyReplies,
    maxFreeReplies,
    customer
  };
};

// Comprehensive service manager
export class PersonaMailServices {
  public gemini: GeminiService;
  public supabase: SupabaseService;
  public resend: ResendService;
  public firecrawl: FirecrawlService;

  constructor() {
    if (!checkRequiredEnvVars()) {
      console.warn('Some services may not work due to missing API keys');
    }

    try {
      this.gemini = new GeminiService();
      this.supabase = new SupabaseService();
      this.resend = new ResendService();  
      this.firecrawl = new FirecrawlService();
    } catch (error) {
      console.error('Service initialization error:', error);
    }
  }

  // Comprehensive email analysis combining multiple services
  async analyzeEmailComprehensively(email: any) {
    const summary = await this.gemini.summarizeEmail(email.content);
    const reply = await this.gemini.generateEmailReply(email.content);
    
    // Save analysis to Supabase
    await this.supabase.saveUserPreferences(email.userId, {
      lastAnalyzedEmail: email.id,
      analysisTimestamp: new Date()
    });

    return { summary, reply };
  }

  // Daily digest with multiple integrations
  async generateAndSendDailyDigest(userId: string, userEmail: string, emails: any[]) {
    const analysis = await this.gemini.analyzeEmailPatterns(emails);
    await this.resend.sendDailyDigest(userEmail, analysis);
    
    // Track usage
    await track("daily_digest");
    
    return analysis;
  }
}

// Export singleton instance
export const personaMailServices = new PersonaMailServices();
