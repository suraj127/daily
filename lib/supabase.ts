import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ojtwjbvqxfssjhcngyxt.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qdHdqYnZxeGZzc2poY25neXh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU4NjMwNjYsImV4cCI6MjEwMTQzOTA2Nn0.JU9Gmn12WWy1FcvFt1HXDQrYntR3ZZH6aePJiQHZbe8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
