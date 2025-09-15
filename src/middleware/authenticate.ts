import { RequestHandler } from "express";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

const authenticate: RequestHandler = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if(!token){
        res.status(401).json({error: "Iltimos login"});
        return;
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, decoded : any) =>{
        if(err) {
            res.status(403).json({error: "Iltimos login"})
            return 
        }
        req.user = decoded;
        next()
    })
}

export default authenticate