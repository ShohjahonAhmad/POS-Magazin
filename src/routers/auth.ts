import { Router } from "express";
import * as authControllers from '../controllers/auth.js'
import authenticated from "../middleware/authenticated.js";
import * as validation from '../middleware/validation.js'

const router = Router()

router.post('/registratsiya', validation.CreateFoydalanuvchi, authControllers.register);
router.post('/login', authControllers.login);
router.post('/logout', authenticated, authControllers.logout);
router.get('/tasdiq-email', authControllers.verifyEmail);
router.post('/jonat-email', authControllers.resendEmail);
router.post('/refresh-token', authControllers.refreshToken)
router.get('/me', authenticated, authControllers.getMe)
export default router;