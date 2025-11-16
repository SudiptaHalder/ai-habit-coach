// src/routes/aiRoutes.js
import { Router } from 'express';
import { AIController } from '../controllers/aiController.js';

const router = Router();

router.post('/analyze-mood', AIController.analyzeMood);
router.post('/coach', AIController.coachReply);
router.post('/save-mood', AIController.saveMood);

export default router;