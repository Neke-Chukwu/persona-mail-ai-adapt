
import { createClient } from '@supabase/supabase-js';

export class SupabaseService {
  public supabase;
  constructor() {
    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error('Supabase credentials not found');
    this.supabase = createClient(url, key);
  }
}
