// src/routes/habitRoutes.js
import { Router } from 'express';
import { HabitController } from '../controllers/habitController.js';

const router = Router();

router.get('/habits', HabitController.getTodayHabits);
router.post('/complete-habit', HabitController.completeHabit);
router.post('/create-habit', HabitController.createHabit);

export default router;