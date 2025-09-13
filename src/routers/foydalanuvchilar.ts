import { Router } from "express";
import * as foydalanuvchilarControllers from '../controllers/foydalanuvchilar.js'
import * as validation from '../middleware/validation.js'

const router = Router();

router.get('/', foydalanuvchilarControllers.getFoydalanuvchilar);
router.patch('/', validation.UpdateFoydalanuvchi, foydalanuvchilarControllers.updateFoydalanuvchi);
router.get('/:id', validation.validateParamsId, foydalanuvchilarControllers.getFoydalanuvchi);
router.delete('/', foydalanuvchilarControllers.deleteFoydalanuvchi);

export default router;