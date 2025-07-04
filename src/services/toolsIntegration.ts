import { createClient } from '@supabase/supabase-js';

export class SupabaseService {
  public supabase;
  constructor() {
    const url = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error('Supabase credentials not found');
    this.supabase = createClient(url, key);
  }
}
