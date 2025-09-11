import z from 'zod';
import * as schemas from './schemas.js';
import { ValidationError } from './errorHandler.js';
export const validateParamsId = (req, res, next) => {
    const result = z.number().int().nonnegative().safeParse(parseInt(req.params.id));
    if (!result.success) {
        next(new ValidationError(result.error.issues));
        return;
    }
    next();
};
export const validateRasxodQuery = (req, res, next) => {
    const result = schemas.RasxodQuerySchema.safeParse(req.query);
    if (!result.success) {
        next(new ValidationError(result.error.issues));
        return;
    }
    req.validatedQuery = result.data;
    next();
};
const validateBody = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        next(new ValidationError(result.error.issues));
        return;
    }
    next();
};
export const CreateMahsulot = validateBody(schemas.MahsulotCreate);
export const UpdateMahsulot = validateBody(schemas.MahsulotUpdate);
export const CreateRasxod = validateBody(schemas.RasxodCreate);
export const UpdateRasxod = [validateParamsId, validateBody(schemas.RasxodUpdate)];
export const CreateSavdo = validateBody(schemas.SavdoCreate);
export const UpdateSavdo = validateBody(schemas.SavdoUpdate);
