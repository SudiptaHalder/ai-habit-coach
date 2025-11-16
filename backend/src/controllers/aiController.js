// // src/controllers/aiController.js
// import { EmotionService } from '../services/emotionService.js';
// import { GroqService } from '../services/groqService.js';
// import { pool } from '../config/db.js';

// export class AIController {
//   static async analyzeMood(req, res) {
//     try {
//       const { message } = req.body;

//       if (!message) {
//         return res.status(400).json({ error: 'Message is required' });
//       }

//       const mood = await EmotionService.detectMood(message);
      
//       res.json({ 
//         mood,
//         message: 'Mood analyzed successfully'
//       });
//     } catch (error) {
//       console.error('Analyze mood error:', error);
//       res.status(500).json({ error: 'Failed to analyze mood' });
//     }
//   }

//   static async coachReply(req, res) {
//     try {
//       const { message, mood, personality = 'fun' } = req.body;

//       if (!message) {
//         return res.status(400).json({ error: 'Message is required' });
//       }

//       const { reply, habits } = await GroqService.getCoachReply(message, mood, personality);
      
//       res.json({
//         reply,
//         habits,
//         mood
//       });
//     } catch (error) {
//       console.error('Coach reply error:', error);
//       res.status(500).json({ error: 'Failed to get coach response' });
//     }
//   }

//   static async saveMood(req, res) {
//     try {
//       const { user_id, mood, message } = req.body;

//       if (!user_id || !mood) {
//         return res.status(400).json({ error: 'User ID and mood are required' });
//       }

//       const [result] = await pool.execute(
//         'INSERT INTO mood_history (user_id, mood, message) VALUES (?, ?, ?)',
//         [user_id, mood, message || '']
//       );

//       res.json({
//         success: true,
//         mood_id: result.insertId,
//         message: 'Mood saved successfully'
//       });
//     } catch (error) {
//       console.error('Save mood error:', error);
//       res.status(500).json({ error: 'Failed to save mood' });
//     }
//   }
// }
// src/controllers/aiController.js
import { EmotionService } from '../services/emotionService.js';
import { GroqService } from '../services/groqService.js';
import { pool } from '../config/db.js';

export class AIController {
  static async analyzeMood(req, res) {
    try {
      const { message } = req.body;
      const userId = req.user.userId; // Get from authenticated user

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const mood = await EmotionService.detectMood(message);
      
      res.json({ 
        mood,
        message: 'Mood analyzed successfully'
      });
    } catch (error) {
      console.error('Analyze mood error:', error);
      res.status(500).json({ error: 'Failed to analyze mood' });
    }
  }

  static async coachReply(req, res) {
    try {
      const { message, mood, personality = 'fun' } = req.body;
      const userId = req.user.userId;

      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      console.log('🎯 Processing coach request:', { userId, message, mood, personality });
      
      const { reply, habits } = await GroqService.getCoachReply(message, mood, personality);
      
      console.log('✅ Sending AI response to frontend');
      
      res.json({
        reply,
        habits,
        mood
      });
    } catch (error) {
      console.error('❌ Coach reply error:', error.message);
      res.status(500).json({ 
        error: 'AI service unavailable',
        details: error.message 
      });
    }
  }

  static async saveMood(req, res) {
    try {
      const { mood, message } = req.body;
      const userId = req.user.userId;

      if (!mood) {
        return res.status(400).json({ error: 'Mood is required' });
      }

      const [result] = await pool.execute(
        'INSERT INTO mood_history (user_id, mood, message) VALUES (?, ?, ?)',
        [userId, mood, message || '']
      );

      res.json({
        success: true,
        mood_id: result.insertId,
        message: 'Mood saved successfully'
      });
    } catch (error) {
      console.error('Save mood error:', error);
      res.status(500).json({ error: 'Failed to save mood' });
    }
  }

  static async getMoodHistory(req, res) {
    try {
      const userId = req.user.userId;
      const { limit = 30 } = req.query;

      const [moods] = await pool.execute(
        'SELECT * FROM mood_history WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
        [userId, parseInt(limit)]
      );

      res.json({ moods });
    } catch (error) {
      console.error('Get mood history error:', error);
      res.status(500).json({ error: 'Failed to get mood history' });
    }
  }
}