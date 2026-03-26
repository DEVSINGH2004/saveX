import express from 'express';
import {saveScrapedArticle} from '../controllers/scrape.controller.js';

const saveRouter = express.Router();

saveRouter.get('/article', saveScrapedArticle);
export default saveRouter;
