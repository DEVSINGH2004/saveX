import supabase from '../config/supabase.database.js';

export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token required hai' });
  }

  const token = authHeader.split(' ')[1];

  // Supabase se token verify karo
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid ya expired token' });
  }

  // user_id request mein attach karo
  req.user = user;
  next();
}