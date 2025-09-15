import { RequestHandler } from "express";
import {parse} from 'date-fns'
import prisma from "../prisma.js";

export const getRasxodlar: RequestHandler = async (req, res) => {
    const month = req.validatedQuery.oy as string | undefined
    const year = req.validatedQuery.yil as string | undefined

    let whereClause = {}

    if(month && year){
        const startDate = new Date(Number(year), Number(month) - 1, 1);
        const endDate = new Date(Number(year), Number(month), 1)

        whereClause = {
            kun: {
                gte: startDate,
                lt: endDate
            }
        }
    }

    const rasxodlar = await prisma.rasxod.findMany({
        where: whereClause,
        orderBy: {
            kun: 'desc'
        }
    })

    res.json({rasxodlar})
} 

export const createRasxod: RequestHandler = async (req, res) => {
    const kunBody = parse(req.body.kun, 'MM/dd/yyyy', new Date());
    

    if (isNaN(kunBody.getTime())) {
        return res.status(400).json({ error: "Invalid date format" });
      }

    kunBody.setHours(12, 0, 0, 0)

    const rasxod = await prisma.rasxod.create({
        data: {
            ...req.body,
            kun: kunBody
        }
    })

    res.status(201).json({rasxod})
} 

export const getRasxod: RequestHandler = async (req, res) => {
    const rasxodId = parseInt(req.params.id);

    const rasxod = await prisma.rasxod.findUnique({
        where: {
            id: rasxodId
        }
    })    

    if (!rasxod) {
        res.status(404).json({ error: "Rasxod topilmadi" });
        return 
    }

    res.json({rasxod})
} 

export const updateRasxod: RequestHandler = async (req, res) => {
    const rasxodId = parseInt(req.params.id);

    const kun = req.body.kun && parse(req.body.kun, 'MM/dd/yyyy', new Date());

    const rasxod = await prisma.rasxod.update({
        where: {
            id: rasxodId
        },
        data: {
            ...req.body,
            ...(kun && {kun})
        }
    })

    res.json({rasxod})
} 

export const deleteRasxod: RequestHandler = async (req, res) => {
    const rasxodId = parseInt(req.params.id);

    await prisma.rasxod.delete({
        where: {
            id: rasxodId
        }
    })

    res.sendStatus(204)
} 