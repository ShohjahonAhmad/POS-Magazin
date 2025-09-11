import { Router } from "express";
import * as mahsulotControllers from '../controllers/mahsulotlar.js';
const router = Router();
router.get('/', mahsulotControllers.getMahsulotlar);
router.post('/', mahsulotControllers.createMahsulot);
export default router;
