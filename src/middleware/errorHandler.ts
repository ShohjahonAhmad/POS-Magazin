import { ErrorRequestHandler } from "express";
import z from 'zod'

export class ValidationError extends Error{
    constructor(public validationErrors: z.core.$ZodIssue[]){
        super('ValidationErrors');
        this.name = this.constructor.name
    }
}

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.log(err.message);
    console.log(err.stack);
    console.log(err.code)

    if(err instanceof ValidationError){
        res.status(400).json({error: err.validationErrors})
        return
    }

    if(err.message === 'email error'){
        res.status(500).json({error: "Elektron pochta jo'natib bo'lmadi. Iltimos, keyinroq urinib ko'ring"});
        
    }

    if(err.message === 'base_url or user error'){
        res.status(500).json({error: "Elektron pochta jo'natishda xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring"});
        return
    }

    if(err.code === 'P2002'){
        const fields = Array.isArray(err.meta?.target) ? err.meta?.target.join(', ') : err.meta?.target
        res.status(409).json({error: `Yagonalik cheklovi buzildi: ${fields}. Bu mahsulot allaqachon omborxonada mavjud`})
        return 
    }

    if(err.code === 'P2025'){
        res.status(404).json({error: "Resurs topilmadi"});
        return
    }

    res.status(500).json({error: "Internal Server Error"})
}

export default errorHandler;