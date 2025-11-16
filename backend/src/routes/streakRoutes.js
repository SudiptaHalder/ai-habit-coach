// src/routes/streakRoutes.js
import { Router } from 'express';
import { StreakController } from '../controllers/streakController.js';

const router = Router();

router.get('/streak', StreakController.getStreak);
router.post('/update-streak', StreakController.updateStreak);

export default router;