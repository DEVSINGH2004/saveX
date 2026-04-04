import dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';

// Bahar banao — ek baar banta hai, sab jagah same object milta hai
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export async function checkConnection() {
  try {
    const { error } = await supabase.from('items').select('id').limit(1);
    if (error) throw error;
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
}

export default supabase;