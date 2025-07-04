import type { NextApiRequest, NextApiResponse } from 'next';
import { SupabaseService } from '@/services/toolsIntegration';

const supabase = new SupabaseService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // TODO: Replace with real user ID from session/auth
  const userId = req.headers['x-mock-user-id'] as string || 'mock-user-id';

  if (req.method === 'GET') {
    // Fetch user preferences
    const { data, error } = await supabase.supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'PUT') {
    const { theme, language, notifications_enabled } = req.body;
    const { data, error } = await supabase.supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        theme,
        language,
        notifications_enabled,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  res.setHeader('Allow', ['GET', 'PUT']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 