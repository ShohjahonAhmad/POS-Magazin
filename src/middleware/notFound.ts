import { RequestHandler } from "express";

const notFound:RequestHandler = (req, res) =>{
    res.status(404).json({error: "So'rov url topilmadi"})
} 

export default notFound