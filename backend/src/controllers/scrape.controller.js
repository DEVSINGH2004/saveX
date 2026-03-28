import { Readability } from '@mozilla/readability';
import { extract } from '@extractus/oembed-extractor'
import { JSDOM } from 'jsdom';


export async function saveScrapedArticle(req, res) {
   const { url } = req.body;
   // Validation
   if (!url) {
    return res.status(400).json({ error: 'url field is required' });
}
   const html = await fetch(url).then(res => res.text());
   const doc = new JSDOM(html, { url });
   const reader = new Readability(doc.window.document);
   const article = reader.parse();
   if (!article) {
    return res.status(422).json({ error: 'Article content extract failed' });
   }
   return res.json({ article });
}

export async function saveScrapedYtVideo(req, res) {
   const { url } = req.body;
  const result = await extract(url);
 console.log(result);
 return res.json({ result });
}