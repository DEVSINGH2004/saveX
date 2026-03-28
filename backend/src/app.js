import express from 'express';
import dotenv from 'dotenv';
import saveRouter from './routes/scrape.routes.js';
import cors from 'cors';
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/save", saveRouter);



export default app;



