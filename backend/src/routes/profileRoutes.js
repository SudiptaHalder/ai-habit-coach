// src/routes/profileRoutes.js
import express from 'express';
import { ProfileController } from '../controllers/profileController.js';

const router = express.Router();

router.get('/profile', ProfileController.getProfile);
router.put('/profile', ProfileController.updateProfile);

export default router;