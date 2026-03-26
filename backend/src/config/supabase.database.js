import dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';



export async function checkConnection() {
  try{
    const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
  
)
console.log(supabase)
console.log('Database connected successfully');
  } catch (error){
    console.error('Database connection failed:', error.message);
    
  }
}


