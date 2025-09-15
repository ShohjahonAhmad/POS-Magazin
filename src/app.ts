import express from 'express';
import dotenv from 'dotenv';
import mahsulotlarRouter from './routers/mahsulotlar.js';
import rasxodlarRouter from './routers/rasxodlar.js';
import sotuvlarRouter from './routers/sotuvlar.js';
import statistikaRouter from './routers/statistika.js';
import authRouter from './routers/auth.js';
import foydalanuvchilarRouter from './routers/foydalanuvchilar.js';
import kategoriyalarRouter from './routers/kategoriyalar.js'
import errorHandler from './middleware/errorHandler.js';
import authenticated from './middleware/authenticated.js';
import authenticate from './middleware/authenticate.js';
import notFound from './middleware/notFound.js';
import cookieParser from 'cookie-parser';
import task from './utils/deleteExpiredTokens.js';
dotenv.config();

const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("Hello")
})

app.use('/auth', authRouter);
app.use(authenticate);
app.use(authenticated);
app.use('/foydalanuvchilar', foydalanuvchilarRouter);
app.use('/statistika', statistikaRouter);
app.use('/sotuvlar', sotuvlarRouter);
app.use('/kategoriyalar', kategoriyalarRouter)
app.use('/mahsulotlar', mahsulotlarRouter);
app.use('/rasxodlar', rasxodlarRouter);
app.use(notFound);
app.use(errorHandler);
task.start();

app.listen(port, () => {
    console.log(`Listening on port: http://localhost:${port}`);
})