import express from 'express';
import dotenv from 'dotenv';
import mahsulotlarRouter from './routers/mahsulotlar.js';
import rasxodlarRouter from './routers/rasxodlar.js';
import sotuvlarRouter from './routers/sotuvlar.js';
import statistikaRouter from './routers/statistika.js';
import authRouter from './routers/auth.js';
import foydalanuvchilarRouter from './routers/foydalanuvchilar.js';
import errorHandler from './middleware/errorHandler.js';
import authenticated from './middleware/authenticated.js';
dotenv.config();
const app = express();
const port = 8080;
app.use(express.json());
app.get('/', (req, res) => {
    res.send("Hello");
});
app.use((req, res, next) => {
    req.user = {
        id: 1
    };
    next();
});
app.use('/auth', authRouter);
app.use(authenticated);
app.use('/foydalanuvchilar', foydalanuvchilarRouter);
app.use('/statistika', statistikaRouter);
app.use('/sotuvlar', sotuvlarRouter);
app.use('/mahsulotlar', mahsulotlarRouter);
app.use('/rasxodlar', rasxodlarRouter);
app.use(errorHandler);
app.listen(port, () => {
    console.log(`Listening on port: http://localhost:${port}`);
});
