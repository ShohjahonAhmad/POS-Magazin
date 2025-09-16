import prisma from "../prisma.js";
import { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
export const getKategoriyalar = async (req, res, next) => {
    const kategoriyalar = await prisma.kategoriya.findMany({
        select: {
            id: true,
            nomi: true,
            _count: {
                select: {
                    mahsulotlar: true
                }
            }
        },
        orderBy: [
            { mahsulotlar: {
                    _count: 'desc'
                } },
            { nomi: 'asc' },
        ]
    });
    const response = kategoriyalar.map((kategoriya) => ({
        id: kategoriya.id,
        kategoriya: kategoriya.nomi,
        miqdor: kategoriya._count.mahsulotlar
    }));
    res.json({ kategoriyalar: response });
};
export const createKategoriya = async (req, res, next) => {
    try {
        const nomi = req.body.kategoriya?.trim().toLowerCase();
        if (!nomi) {
            res.status(400).json({ error: "So'rovda kategoriya nomi berilishi shart" });
            return;
        }
        const kategoriya = await prisma.kategoriya.create({
            data: {
                nomi
            }
        });
        res.status(201).json({ kategoriya });
    }
    catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
            res.status(400).json({ error: "Bunday kategoriya allaqachon mavjud" });
            return;
        }
        next(err);
    }
};
export const deleteKategoriya = async (req, res, next) => {
    try {
        const kategoriyaId = parseInt(req.params.id);
        await prisma.kategoriya.delete({
            where: { id: kategoriyaId }
        });
        res.sendStatus(204);
    }
    catch (err) {
        if (err instanceof PrismaClientKnownRequestError && err.code === 'P2003') {
            res.status(400).json({ error: "Kategoriyani o'chirib bo'lmaydi, mahsulotlar mavjud" });
            return;
        }
        next(err);
    }
};
