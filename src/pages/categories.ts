import type { NextApiRequest, NextApiResponse } from 'next';
import { SupabaseService } from '@/services/toolsIntegration';

const supabase = new SupabaseService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // TODO: Replace with real user ID from session/auth
  const userId = req.headers['x-mock-user-id'] as string || 'mock-user-id';

  if (req.method === 'GET') {
    // Fetch categories for user
    const { data, error } = await supabase.supabase
      .from('email_categories')
      .select('*')
      .eq('user_id', userId);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { name, keywords, description, is_system_category } = req.body;
    const { data, error } = await supabase.supabase
      .from('email_categories')
      .insert([
        {
          user_id: userId,
          name,
          keywords,
          description,
          is_system_category: !!is_system_category,
        },
      ]);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
} 