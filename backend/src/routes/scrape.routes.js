import express from 'express';
import {saveScrapedArticle, saveScrapedYtVideo} from '../controllers/scrape.controller.js';
import {requireAuth} from '../middlewares/auth.middleware.js';
import {getGraphData} from '../controllers/graph.controller.js';
const saveRouter = express.Router();

saveRouter.post('/article', requireAuth, saveScrapedArticle);
saveRouter.post('/ytVideo', requireAuth, saveScrapedYtVideo);
saveRouter.get('/graph', requireAuth, getGraphData);

saveRouter.get('/items', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('items')
    .select('id, url, type, title, excerpt, thumbnail, domain, created_at')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })
  return res.json({ items: data })
})
export default saveRouter;
