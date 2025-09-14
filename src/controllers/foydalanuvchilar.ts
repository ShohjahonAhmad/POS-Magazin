import { RequestHandler } from "express";
import prisma from "../prisma.js";
import bcrypt from 'bcrypt'


const omittedColumns = {
    parol: true
}

export const getFoydalanuvchilar: RequestHandler = async (req, res, next) => {
    const foydalanuvchilar = await prisma.foydalanuvchi.findMany({
        omit: omittedColumns
    })

    const response = foydalanuvchilar.map(({emailTasdiqlanganVaqt, ...user}) => ({
        ...user,
        emailTasdiqlangan: !!emailTasdiqlanganVaqt
    }))

    res.json({foydalanuvchilar: response})
}

export const updateFoydalanuvchi: RequestHandler = async (req, res, next) => {
    const userId = req.user?.id;

    const {parol, ...rest} = req.body

    const hashedPassword = parol ? await bcrypt.hash(parol, 10) : undefined;

    const foydalanuvchi = await prisma.foydalanuvchi.update({
        where: {id: userId},
        data: {
            ...rest,
            ...(hashedPassword ? {parol: hashedPassword} : {})
        },
        omit: omittedColumns
    })

    const {emailTasdiqlanganVaqt, ...user} = foydalanuvchi;

    const response = {
        ...user,
        emailTasdiqlangan: !!emailTasdiqlanganVaqt
    }

    res.json({foydalanuvchi: response})
}

export const getFoydalanuvchi: RequestHandler = async (req, res, next) => {
    const userId = parseInt(req.params.id);

    const user = await prisma.foydalanuvchi.findUnique({
        where: {
            id: userId
        },
        omit: omittedColumns
    })

    if(!user) {
        res.status(404).json({error: "Foydalanuvchi topilmadi"});
        return;
    }

    const {emailTasdiqlanganVaqt, ...rest} = user;
    
    const response = {
        ...rest,
        emailTasdiqlangan: !!emailTasdiqlanganVaqt
    }

    res.json({foydalanuvchi: response})
}

export const deleteFoydalanuvchi: RequestHandler = async (req, res, next) => {
    const userId = req.user?.id;
    
    await prisma.foydalanuvchi.delete({
        where: {
            id: userId
        }
    })

    res.sendStatus(204);
}
