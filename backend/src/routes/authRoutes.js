// src/routes/authRoutes.js
import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/me', AuthController.getCurrentUser);

export default router;