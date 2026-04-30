import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Using demo mode with localStorage.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      headers: {
        'x-application-name': 'FAL Finance Ledger',
      },
    },
  }
);

const PLACEHOLDER_URLS = [
  'https://your-project.supabase.co',
  'https://placeholder.supabase.co',
  'https://example.supabase.co',
];

const PLACEHOLDER_KEYS = [
  'your-anon-key-here',
  'placeholder-key',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
];

function isPlaceholderUrl(url: string): boolean {
  return PLACEHOLDER_URLS.some(p => url.includes(p) || url === p);
}

function isPlaceholderKey(key: string): boolean {
  return PLACEHOLDER_KEYS.some(p => key.includes(p) || key === p);
}

export const isSupabaseConfigured = !!(
  supabaseUrl &&
  supabaseAnonKey &&
  !isPlaceholderUrl(supabaseUrl) &&
  !isPlaceholderKey(supabaseAnonKey)
);
