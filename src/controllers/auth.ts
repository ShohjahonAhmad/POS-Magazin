import { RequestHandler } from "express";
import prisma from "../prisma.js";
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { sendEmailToken } from "../utils/sendEmail.js";

const saltRounds = 10;

export const register: RequestHandler = async (req, res, next) => {
    const {email} = req.body;

    const existing = await prisma.foydalanuvchi.findUnique({
        where: {
            email: email
        }
    })

    if(existing) {  
        res.status(409).json({error: "Ushbu elektron pochta allaqachon ro'yxatdan o'tgan"});
        return
    }

    const parol = await bcrypt.hash(req.body.parol, saltRounds)
    const token = crypto.randomBytes(64).toString('hex');
    const muddati = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const foydalanuvchi = await prisma.foydalanuvchi.create({
        data: {
            ...req.body,
            parol,
        },
        omit: {
            parol: true
        }
    })

    const emailToken = await prisma.emailVerificationToken.create({
        data: {
            token,
            muddati,
            foydalanuvchiId: foydalanuvchi.id 
        }
    })

    try{await sendEmailToken(email, token)}
    catch(err){
        await prisma.emailVerificationToken.delete({
            where:{
                id: emailToken.id
            }
        })
        return next(err)
    }

    const { emailTasdiqlanganVaqt, ...rest } = foydalanuvchi;

    res.status(201).json({
        foydalanuvchi: {
        ...rest,
        emailTasdiqlangan: !!emailTasdiqlanganVaqt,
        },
    });
}

export const login: RequestHandler = async (req, res, next) => {
    const {email, parol} = req.body;

    const foydalanuvchi = await prisma.foydalanuvchi.findUnique({
        where: {
            email
        }
    })

    if(!foydalanuvchi){
        res.status(401).json({error: "Elektron pochta yoki parol xato"});
        return;
    }

    if(!foydalanuvchi.emailTasdiqlanganVaqt){
        res.status(403).json({error: "Avval elektron pochtangizni tasdiqlang"});
        return;
    }

    const ok = await bcrypt.compare(parol, foydalanuvchi.parol);

    if(!ok){
        res.status(401).json({error: "Elektron pochta yoki parol xato"});
        return;
    } 

    const accessToken = generateAccessToken(foydalanuvchi.id)
    const refreshToken = generateRefreshToken(foydalanuvchi.id)

    await prisma.refreshToken.deleteMany({
        where: {
            foydalanuvchiId: foydalanuvchi.id
        }
    })

    await prisma.refreshToken.create({
        data: {
            token: refreshToken,
            foydalanuvchiId: foydalanuvchi.id
        }
    })

    res.cookie('jwt', refreshToken, {
        httpOnly: true, secure: false, sameSite: 'lax', maxAge: 24 * 60 * 60 * 1000
    })

    res.json({accessToken})
}

function generateAccessToken (id: number) {
    return jwt.sign({
        id},
        process.env.ACCESS_TOKEN_SECRET!,
        {expiresIn: '1h'} );
} 

function generateRefreshToken (id: number) {
    return jwt.sign(   
                {id}, 
                process.env.REFRESH_TOKEN_SECRET!, 
                {expiresIn: '1d'})
}

export const logout: RequestHandler = async (req, res, next) => {
    const refreshToken = req.cookies?.jwt;
    if (!refreshToken) {
        res.sendStatus(204);
        return;
    }

    await prisma.refreshToken.deleteMany({
        where: { token: refreshToken }
    });

    res.clearCookie('jwt', { httpOnly: true, secure: false, sameSite: 'lax' });
    res.sendStatus(204);
};

export const verifyEmail: RequestHandler = async (req, res, next) => {
    const token = req.query.token as string | undefined;

    if(!token) {
        res.status(400).json({error: "Token is required"});
        return;
    }

    const emailToken = await prisma.emailVerificationToken.findFirst({
        where:{
            token,
            muddati: {
                gte: new Date()
            }
        }
    })

    if(!emailToken) {
        res.status(400).json({error: "Token invalid or expired"});
        return;
    }

    const user = await prisma.foydalanuvchi.findUnique({
        where: {
            id: emailToken.foydalanuvchiId
        }
    })

    if(!user) {
        res.status(404).json({error: "User not found"});
        return;
    }

    const [userDb, result] = await prisma.$transaction([
        prisma.foydalanuvchi.update({
            where: {id: user.id},
            data: {
                emailTasdiqlanganVaqt: new Date()
            }
        }),
        prisma.emailVerificationToken.delete({
            where: {
                id: emailToken.id
            }
        })
    ])

    res.status(200).json({xabar: "Emailingiz tasdiqlandi"})
}

export const resendEmail: RequestHandler = async (req, res, next) => {
    const { email } = req.body;

    const user = await prisma.foydalanuvchi.findUnique({
        where: {email}
    });

    if(!user || user?.emailTasdiqlanganVaqt) {
        res.status(202).json({xabar: "Agar foydalanuvchi mavjud va tasdiqlanmagan bo'lsa, elektron pochta jo'natildi"})
        return;
    }

    await prisma.emailVerificationToken.deleteMany({
        where: { foydalanuvchiId: user.id }
    });

    const token = crypto.randomBytes(64).toString('hex');
    const muddati = new Date(Date.now() + 24 * 60 * 60 * 1000);

    
    await prisma.emailVerificationToken.create({
        data: {
            token,
            muddati,
            foydalanuvchiId: user.id
        }
    })

    try {
        await sendEmailToken(user.email, token);
      } catch (err) {
        await prisma.emailVerificationToken.deleteMany({
          where: { foydalanuvchiId: user.id }
        });
        return next(err);
      }

    res.status(202).json({xabar: "Agar foydalanuvchi mavjud va tasdiqlanmagan bo'lsa, elektron pochta jo'natildi"})
}

export const refreshToken: RequestHandler = async (req, res, next) => {
    const cookie = req.cookies;
    if(!cookie?.jwt) {
        res.status(401).json({error: "Iltimos login"});
        console.log("salom")
        return;
    }
    const refreshToken = cookie.jwt

    const token = await prisma.refreshToken.findUnique({
        where: {
            token: refreshToken
        }
    })

    if(!token){
        res.status(403).json({error: "Iltimos login"});
        return;
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, (err: any, decoded:any) => {
        if(err || token.foydalanuvchiId !== decoded.id ){
            res.status(403).json({error: "Iltimos login"});
            return;
        }
        const accessToken = generateAccessToken(token!.foydalanuvchiId);
        res.json({accessToken});
        return;
    })
}

export const getMe: RequestHandler = async (req, res, next) => {
    const userId = req.user?.id;

    const me = await prisma.foydalanuvchi.findUnique({
        where:{
            id: userId
        },
        omit: {
            parol: true
        }
    })

    if(!me) {
        res.status(404).json({error: "Foydalanuvchi topilmadi"});
        return;
    }
    
    const {emailTasdiqlanganVaqt, ...rest} = me;

    const response = {
        ...rest,
        emailTasdiqlangan: !!emailTasdiqlanganVaqt
    }

    res.json({me: response})
}