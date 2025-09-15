import { Router } from "express";
import * as kategoriyalarControllers from '../controllers/kategoriyalar.js' 
import * as validation from '../middleware/validation.js' 

const router = Router();

router.get('/', kategoriyalarControllers.getKategoriyalar)
router.post('/', kategoriyalarControllers.createKategoriya)
router.delete('/:id', validation.validateParamsId, kategoriyalarControllers.deleteKategoriya)

export default router;