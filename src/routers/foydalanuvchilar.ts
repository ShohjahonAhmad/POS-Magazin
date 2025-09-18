import { Router } from "express";
import * as foydalanuvchilarControllers from '../controllers/foydalanuvchilar.js'
import * as validation from '../middleware/validation.js'
import isAdmin from "../middleware/isAdmin.js";

const router = Router();

router.get('/', isAdmin, foydalanuvchilarControllers.getFoydalanuvchilar);
router.patch('/', validation.UpdateFoydalanuvchi, foydalanuvchilarControllers.updateFoydalanuvchi);
router.get('/:id', isAdmin, validation.validateParamsId, foydalanuvchilarControllers.getFoydalanuvchi);
router.delete('/', foydalanuvchilarControllers.deleteFoydalanuvchi);

export default router;