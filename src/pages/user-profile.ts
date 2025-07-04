import type { NextApiRequest, NextApiResponse } from 'next';
import { SupabaseService } from '@/services/toolsIntegration';

const supabase = new SupabaseService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // TODO: Replace with real user ID from session/auth
  const userId = req.headers['x-mock-user-id'] as string || 'mock-user-id';

  if (req.method === 'GET') {
    // Fetch user profile
    const { data, error } = await supabase.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'PUT') {
    const { name, default_tone_preference, role_profession } = req.body;
    const { data, error } = await supabase.supabase
      .from('users')
      .update({
        name,
        default_tone_preference,
        role_profession,
      })
      .eq('id', userId)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  res.setHeader('Allow', ['GET', 'PUT']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 