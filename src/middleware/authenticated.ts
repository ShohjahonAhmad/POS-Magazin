import { RequestHandler } from "express";

const authenticated: RequestHandler = (req, res, next) => {
    console.log(req.user)
    if(!req.user?.id){
        res.status(401).json({error: "Not authenticated"});
        return;
    }

    next()
}

export default authenticated;