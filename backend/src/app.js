import express from 'express';
import dotenv from 'dotenv';
import saveRouter from './routes/scrape.routes.js';
dotenv.config();
const app = express();
app.use(express.json());
app.use("/save", saveRouter);



export default app;



