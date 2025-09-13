import { Router } from "express";
import * as foydalanuvchilarControllers from '../controllers/foydalanuvchilar.js'

const router = Router();

router.get('/', foydalanuvchilarControllers.getFoydalanuvchilar);
router.patch('/', foydalanuvchilarControllers.updateFoydalanuvchi);
router.get('/:id', foydalanuvchilarControllers.getFoydalanuvchi);
router.delete('/', foydalanuvchilarControllers.deleteFoydalanuvchi);

export default router;