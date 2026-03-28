import express from 'express';
import {saveScrapedArticle, saveScrapedYtVideo} from '../controllers/scrape.controller.js';

const saveRouter = express.Router();

saveRouter.post('/article', saveScrapedArticle);
saveRouter.post('/ytVideo', saveScrapedYtVideo);
export default saveRouter;
