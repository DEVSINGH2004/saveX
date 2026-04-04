import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';
import { extract } from '@extractus/oembed-extractor';
import supabase from '../config/supabase.database.js';

export async function saveScrapedArticle(req, res) {
  const { url } = req.body;
  const user_id = req.user.id;

  if (!url) {
    return res.status(400).json({ error: 'url field is required' });
  }

  // Duplicate check — same user ka same URL
  const { data: existing } = await supabase
    .from('items')
    .select('id')
    .eq('url', url)
    .eq('user_id', user_id)
    .single();

  if (existing) {
    return res.status(409).json({ error: 'Already saved!' });
  }

  // Scrape karo
  const html    = await fetch(url).then(r => r.text());
  const doc     = new JSDOM(html, { url });
  const reader  = new Readability(doc.window.document);
  const article = reader.parse();

  if (!article) {
    return res.status(422).json({ error: 'Article content extract failed' });
  }

  const domain    = new URL(url).hostname.replace('www.', '');
  const thumbnail = doc.window.document
    .querySelector('meta[property="og:image"]')
    ?.getAttribute('content') || null;
  const wordCount = article.textContent?.trim().split(/\s+/).length || 0;
  const excerpt   = article.textContent?.trim().slice(0, 300) + '...' || null;

  // Supabase mein save karo
  const { data, error } = await supabase
    .from('items')
    .insert({
      user_id,
      url,
      type:      'article',
      title:     article.title       || null,
      body:      article.textContent || null,
      excerpt,
      author:    article.byline      || null,
      thumbnail,
      domain,
      word_count: wordCount,
      raw_html:  article.content    || null,
      metadata: {
        siteName: article.siteName || null,
        lang:     article.lang     || null,
      },
    })
    .select('id, title, domain, excerpt, created_at')
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json({ success: true, item: data });
}

export async function saveScrapedYtVideo(req, res) {
  const { url } = req.body;
  const user_id = req.user.id;

  if (!url) {
    return res.status(400).json({ error: 'url field is required' });
  }

  // Video ID nikalo
  const parsed  = new URL(url);
  const videoId = parsed.hostname === 'youtu.be'
    ? parsed.pathname.slice(1)
    : parsed.searchParams.get('v');

  if (!videoId) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  // Duplicate check
  const { data: existing } = await supabase
    .from('items')
    .select('id')
    .eq('url', url)
    .eq('user_id', user_id)
    .single();

  if (existing) {
    return res.status(409).json({ error: 'Already saved!' });
  }

  // oEmbed se metadata fetch karo
  const result = await extract(url);

  console.log('YT metadata:', result);

  if (!result) {
    return res.status(422).json({ error: 'YouTube metadata fetch failed' });
  }

  // Supabase mein save karo
  const { data, error } = await supabase
    .from('items')
    .insert({
      user_id,
      url,
      type:         'youtube',
      title:        result.title        || null,
      author:       result.author_name  || null,
      thumbnail:    result.thumbnail_url || null,
      domain:       'youtube.com',
      video_id:     videoId,
      channel_name: result.author_name  || null,
      channel_url:  result.author_url   || null,
      metadata: {
        videoId,
        channelName:  result.author_name,
        channelUrl:   result.author_url,
        thumbnail:    result.thumbnail_url,
        embedUrl:     `https://www.youtube.com/embed/${videoId}`,
      },
    })
    .select('id, title, thumbnail, channel_name, created_at')
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json({ success: true, item: data });
}