import { RequestHandler } from "express";
import prisma from "../prisma.js";
import crypto from 'crypto';
import bcrypt from 'bcrypt';
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
    res.sendStatus(200)
}

export const logout: RequestHandler = async (req, res, next) => {
    res.sendStatus(200)
}

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
        res.status(400).json({error: "User not found"});
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
    res.sendStatus(200)
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
        emailVerified: !!emailTasdiqlanganVaqt
    }

    res.json({me: response})
}