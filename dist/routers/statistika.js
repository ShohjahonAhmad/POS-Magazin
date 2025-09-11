import { Router } from "express";
import * as statistikaControllers from '../controllers/statistika.js';
const router = Router();
router.get('/oylik-rasxodlar', statistikaControllers.getMonthlyRasxodlar);
router.get('/oylik-tushumlar', statistikaControllers.getMonthlyTushumlar);
router.get('/oylik-savdolar', statistikaControllers.getMonthlySavdolar);
router.get('/yillik', statistikaControllers.getAnnualStats);
export default router;
