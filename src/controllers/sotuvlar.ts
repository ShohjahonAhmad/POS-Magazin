import { RequestHandler } from "express";
import prisma from "../prisma.js";
import { Prisma } from "@prisma/client";

export const getSotuvlar: RequestHandler = async (req, res, next) => {
    const month = parseInt(req.query.oy as string);
    const year = parseInt(req.query.yil as string);

    console.log(year)

    let whereClause = {};

    if (req.query.yil !== undefined) {
        if (Number.isNaN(year)) {
          return res.status(400).json({ error: "Xato yil. Raqam bo‘lishi kerak." });
        }
        if (year < 2020 || year > 2100) {
          return res.status(400).json({ error: "Xato yil. Yil 2020–2100 oralig‘ida bo‘lishi kerak." });
        }
      }

    if(month){
        if(month < 1 || month > 12){
            res.status(400).json({error: "Xato oy. Oy 1-12 bo'lishi shart."});
            return
        }
        const startDate = new Date(year || new Date().getFullYear(), month - 1, 1);
        const endDate = new Date(year || new Date().getFullYear(), month, 1 );

        whereClause = {
            yaratilganVaqt: {
            gte: startDate,
            lt: endDate
            }
        }
    }else if(req.query.yil) {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year + 1, 0, 1);

        whereClause = {
            yaratilganVaqt: {
                gte: startDate,
                lt: endDate
            }
        }
    }

    const sotuvlar = await prisma.sotuv.findMany({
        where: whereClause
    });

    res.json({sotuvlar})
}

export const getSotuv: RequestHandler = async (req, res, next) => {
    const id = parseInt(req.params.id);

    const sotuv = await prisma.sotuv.findUnique({
        where: {
            id: id
        }
    })

    res.json({sotuv})
}
    

export const createSotuv: RequestHandler = async (req, res, next) => {
    const {mahsulotId, miqdor, yaratilganVaqt, valyuta} = req.body;

    const mahsulot = await prisma.mahsulot.findUnique({
        where: {
            id: mahsulotId
        }
    })

    if(!mahsulot) {
        res.status(404).json({error: "Mahsulot topilmadi"});
        return
    }

    const remaining = mahsulot.miqdor - miqdor;

    if(remaining < 0){
        res.status(400).json({error: "Sotilgan mahsulot miqdori omborxonadagi mahsulot miqdoridan katta bo'lishi mumkin emas"})
        return
    }

    const revenue = new Prisma.Decimal(miqdor).times(mahsulot.sotishNarx)

    const [sotuv] = await prisma.$transaction([
        prisma.sotuv.create({
            data: {
                mahsulot: {connect: {id: mahsulotId}},
                mahsulotNomi: mahsulot.nomi,
                miqdor,
                tushum: req.body.tushum || revenue,
                yaratilganVaqt,
                valyuta
            }
        }),
        prisma.mahsulot.update({
            where: {
                id: mahsulotId
            },
            data: {
                miqdor: remaining
            }
        })
    ])

    res.status(201).json({sotuv})
}

export const updateSotuv: RequestHandler = async (req, res, next) => {
    const id = parseInt(req.params.id);
    const {miqdor} = req.body

    if(miqdor === undefined){
        const sotuv = await prisma.sotuv.update({
            where: {id},
            data: req.body
        })

        res.json({sotuv})
        return
    }

    const oldSotuv = await prisma.sotuv.findUnique({
        where: {id}
    })

    if(!oldSotuv){
        res.status(404).json({error: "Bu IDda savdo mavjud emas"})
        return
    }
    const saleDiff =  miqdor - oldSotuv.miqdor;

    const mahsulot = await prisma.mahsulot.findUnique({
        where: {
            id: oldSotuv.mahsulotId
        }
    })

    if (!mahsulot) {
        res.status(404).json({ error: "Mahsulot topilmadi"});
        return }

    if(saleDiff > 0 && saleDiff > mahsulot.miqdor){
        res.status(400).json({error: "Bu o'zgarishni amalga oshirish uchun omborxonada mahsulot yetarli emas"});
        return
    }

    const [sotuv] = await prisma.$transaction([
        prisma.mahsulot.update({
            where: {id: mahsulot.id},
            data: {
                miqdor: {
                    decrement: saleDiff > 0 ? saleDiff : 0, increment: saleDiff < 0 ? Math.abs(saleDiff) : 0
                }
            }
        }),
        prisma.sotuv.update({
            where: {id},
            data: req.body
        })
    ])

    res.json({sotuv})
}

export const deleteSotuv: RequestHandler = async (req, res, next) => {
    const id = parseInt(req.params.id);

    const oldSotuv = await prisma.sotuv.findUnique({
        where: {id}
    })

    if(!oldSotuv) {
        res.status(404).json({error: "Bu IDda savdo mavjud emas"});
        return
    }

    const mahsulot = await prisma.mahsulot.findUnique({ where: { id: oldSotuv.mahsulotId } });
    if (!mahsulot) {
        res.status(404).json({ error: "Mahsulot topilmadi" });
        return 
    }

    const [updatedMahsulot, deletedSotuv] = await prisma.$transaction([
        prisma.mahsulot.update({
            where: {id: oldSotuv.mahsulotId},
            data: {
                miqdor: {
                    increment: oldSotuv.miqdor
                }
            }
        }),
        prisma.sotuv.delete({
            where: {id: oldSotuv.id}
        })
    ])

    res.sendStatus(204);    
}