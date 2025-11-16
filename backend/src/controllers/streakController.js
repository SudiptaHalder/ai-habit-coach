// // src/controllers/streakController.js
// import { pool } from '../config/db.js';

// export class StreakController {
//   static async getStreak(req, res) {
//     try {
//       const { user_id } = req.query;

//       if (!user_id) {
//         return res.status(400).json({ error: 'User ID is required' });
//       }

//       const [streaks] = await pool.execute(
//         'SELECT * FROM streaks WHERE user_id = ?',
//         [user_id]
//       );

//       const streak = streaks[0] || { current_streak: 0, last_updated: null };

//       res.json({ 
//         streak: streak.current_streak,
//         last_updated: streak.last_updated
//       });
//     } catch (error) {
//       console.error('Get streak error:', error);
//       res.status(500).json({ error: 'Failed to get streak' });
//     }
//   }

//   static async updateStreak(req, res) {
//     try {
//       const { user_id } = req.body;

//       if (!user_id) {
//         return res.status(400).json({ error: 'User ID is required' });
//       }

//       const today = new Date().toISOString().split('T')[0];

//       // Check if streak exists
//       const [streaks] = await pool.execute(
//         'SELECT * FROM streaks WHERE user_id = ?',
//         [user_id]
//       );

//       if (streaks.length === 0) {
//         // Create new streak
//         const [result] = await pool.execute(
//           'INSERT INTO streaks (user_id, current_streak, last_updated) VALUES (?, 1, ?)',
//           [user_id, today]
//         );
        
//         return res.json({
//           success: true,
//           streak: 1,
//           message: 'New streak started'
//         });
//       }

//       const streak = streaks[0];
//       const lastUpdated = new Date(streak.last_updated);
//       const yesterday = new Date();
//       yesterday.setDate(yesterday.getDate() - 1);

//       let newStreak = streak.current_streak;

//       if (lastUpdated.toDateString() === yesterday.toDateString()) {
//         // Consecutive day - increment streak
//         newStreak += 1;
//       } else if (lastUpdated.toDateString() !== new Date().toDateString()) {
//         // Not consecutive - reset to 1
//         newStreak = 1;
//       }

//       await pool.execute(
//         'UPDATE streaks SET current_streak = ?, last_updated = ? WHERE user_id = ?',
//         [newStreak, today, user_id]
//       );

//       res.json({
//         success: true,
//         streak: newStreak,
//         message: 'Streak updated successfully'
//       });
//     } catch (error) {
//       console.error('Update streak error:', error);
//       res.status(500).json({ error: 'Failed to update streak' });
//     }
//   }
// }
// src/controllers/streakController.js
import { pool } from '../config/db.js';

export class StreakController {
  static async getStreak(req, res) {
    try {
      const userId = req.user.userId;

      const [streaks] = await pool.execute(
        'SELECT * FROM streaks WHERE user_id = ?',
        [userId]
      );

      const streak = streaks[0] || { current_streak: 0, last_updated: null };

      res.json({ 
        streak: streak.current_streak,
        last_updated: streak.last_updated
      });
    } catch (error) {
      console.error('Get streak error:', error);
      res.status(500).json({ error: 'Failed to get streak' });
    }
  }

  static async updateStreak(req, res) {
    try {
      const userId = req.user.userId;

      const today = new Date().toISOString().split('T')[0];

      // Check if streak exists
      const [streaks] = await pool.execute(
        'SELECT * FROM streaks WHERE user_id = ?',
        [userId]
      );

      if (streaks.length === 0) {
        // Create new streak
        const [result] = await pool.execute(
          'INSERT INTO streaks (user_id, current_streak, last_updated) VALUES (?, 1, ?)',
          [userId, today]
        );
        
        return res.json({
          success: true,
          streak: 1,
          message: 'New streak started'
        });
      }

      const streak = streaks[0];
      const lastUpdated = new Date(streak.last_updated);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      let newStreak = streak.current_streak;

      if (lastUpdated.toDateString() === yesterday.toDateString()) {
        // Consecutive day - increment streak
        newStreak += 1;
      } else if (lastUpdated.toDateString() !== new Date().toDateString()) {
        // Not consecutive - reset to 1
        newStreak = 1;
      }

      await pool.execute(
        'UPDATE streaks SET current_streak = ?, last_updated = ? WHERE user_id = ?',
        [newStreak, today, userId]
      );

      res.json({
        success: true,
        streak: newStreak,
        message: 'Streak updated successfully'
      });
    } catch (error) {
      console.error('Update streak error:', error);
      res.status(500).json({ error: 'Failed to update streak' });
    }
  }

  static async resetStreak(req, res) {
    try {
      const userId = req.user.userId;

      await pool.execute(
        'UPDATE streaks SET current_streak = 0, last_updated = NULL WHERE user_id = ?',
        [userId]
      );

      res.json({
        success: true,
        message: 'Streak reset successfully'
      });
    } catch (error) {
      console.error('Reset streak error:', error);
      res.status(500).json({ error: 'Failed to reset streak' });
    }
  }
}