import supabase from '../config/supabase.database.js';

export async function getGraphData(req, res) {
  const user_id = req.user.id;

  const { data: items, error } = await supabase
    .from('items')
    .select('id, title, type, domain, url, thumbnail')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // Nodes banao
  const nodes = items.map(item => ({
    id:        item.id,
    title:     item.title,
    type:      item.type,
    domain:    item.domain,
    url:       item.url,
    thumbnail: item.thumbnail,
  }));

  // Edges — same type wale items connect honge
  const edges = [];

  const articles = items.filter(i => i.type === 'article');
  const videos   = items.filter(i => i.type === 'youtube');

  // Articles ko aapas mein connect karo
  for (let i = 0; i < articles.length; i++) {
    for (let j = i + 1; j < articles.length; j++) {
      edges.push({
        source: articles[i].id,
        target: articles[j].id,
        reason: 'same-type',
      });
    }
  }

  // Videos ko aapas mein connect karo
  for (let i = 0; i < videos.length; i++) {
    for (let j = i + 1; j < videos.length; j++) {
      edges.push({
        source: videos[i].id,
        target: videos[j].id,
        reason: 'same-type',
      });
    }
  }

  return res.status(200).json({ nodes, edges });
}