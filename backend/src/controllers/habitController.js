// // src/controllers/habitController.js
// import { pool } from '../config/db.js';

// export class HabitController {
//   static async getTodayHabits(req, res) {
//     try {
//       const { user_id } = req.query;

//       if (!user_id) {
//         return res.status(400).json({ error: 'User ID is required' });
//       }

//       const today = new Date().toISOString().split('T')[0];
      
//       const [habits] = await pool.execute(
//         `SELECT * FROM daily_habits 
//          WHERE user_id = ? AND DATE(created_at) = ? 
//          ORDER BY created_at DESC`,
//         [user_id, today]
//       );

//       res.json({ habits });
//     } catch (error) {
//       console.error('Get habits error:', error);
//       res.status(500).json({ error: 'Failed to get habits' });
//     }
//   }

//   static async completeHabit(req, res) {
//     try {
//       const { habit_id } = req.body;

//       if (!habit_id) {
//         return res.status(400).json({ error: 'Habit ID is required' });
//       }

//       const [result] = await pool.execute(
//         'UPDATE daily_habits SET completed = TRUE WHERE id = ?',
//         [habit_id]
//       );

//       if (result.affectedRows === 0) {
//         return res.status(404).json({ error: 'Habit not found' });
//       }

//       res.json({ 
//         success: true,
//         message: 'Habit marked as completed'
//       });
//     } catch (error) {
//       console.error('Complete habit error:', error);
//       res.status(500).json({ error: 'Failed to complete habit' });
//     }
//   }

//   static async createHabit(req, res) {
//     try {
//       const { user_id, habit } = req.body;

//       if (!user_id || !habit) {
//         return res.status(400).json({ error: 'User ID and habit are required' });
//       }

//       const [result] = await pool.execute(
//         'INSERT INTO daily_habits (user_id, habit) VALUES (?, ?)',
//         [user_id, habit]
//       );

//       res.json({
//         success: true,
//         habit_id: result.insertId,
//         message: 'Habit created successfully'
//       });
//     } catch (error) {
//       console.error('Create habit error:', error);
//       res.status(500).json({ error: 'Failed to create habit' });
//     }
//   }
// }
// src/controllers/habitController.js
import { pool } from '../config/db.js';

export class HabitController {
  static async getTodayHabits(req, res) {
    try {
      const userId = req.user.userId;

      const today = new Date().toISOString().split('T')[0];
      
      const [habits] = await pool.execute(
        `SELECT * FROM daily_habits 
         WHERE user_id = ? AND DATE(created_at) = ? 
         ORDER BY created_at DESC`,
        [userId, today]
      );

      res.json({ habits });
    } catch (error) {
      console.error('Get habits error:', error);
      res.status(500).json({ error: 'Failed to get habits' });
    }
  }

  static async getAllHabits(req, res) {
    try {
      const userId = req.user.userId;
      const { limit = 50 } = req.query;

      const [habits] = await pool.execute(
        `SELECT * FROM daily_habits 
         WHERE user_id = ? 
         ORDER BY created_at DESC 
         LIMIT ?`,
        [userId, parseInt(limit)]
      );

      res.json({ habits });
    } catch (error) {
      console.error('Get all habits error:', error);
      res.status(500).json({ error: 'Failed to get habits' });
    }
  }

  static async completeHabit(req, res) {
    try {
      const { habit_id } = req.body;
      const userId = req.user.userId;

      if (!habit_id) {
        return res.status(400).json({ error: 'Habit ID is required' });
      }

      // Verify the habit belongs to the user
      const [habits] = await pool.execute(
        'SELECT * FROM daily_habits WHERE id = ? AND user_id = ?',
        [habit_id, userId]
      );

      if (habits.length === 0) {
        return res.status(404).json({ error: 'Habit not found' });
      }

      const [result] = await pool.execute(
        'UPDATE daily_habits SET completed = TRUE WHERE id = ? AND user_id = ?',
        [habit_id, userId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Habit not found' });
      }

      res.json({ 
        success: true,
        message: 'Habit marked as completed'
      });
    } catch (error) {
      console.error('Complete habit error:', error);
      res.status(500).json({ error: 'Failed to complete habit' });
    }
  }

  static async createHabit(req, res) {
    try {
      const { habit } = req.body;
      const userId = req.user.userId;

      if (!habit) {
        return res.status(400).json({ error: 'Habit is required' });
      }

      const [result] = await pool.execute(
        'INSERT INTO daily_habits (user_id, habit) VALUES (?, ?)',
        [userId, habit]
      );

      res.json({
        success: true,
        habit_id: result.insertId,
        message: 'Habit created successfully'
      });
    } catch (error) {
      console.error('Create habit error:', error);
      res.status(500).json({ error: 'Failed to create habit' });
    }
  }

  static async deleteHabit(req, res) {
    try {
      const { habit_id } = req.body;
      const userId = req.user.userId;

      if (!habit_id) {
        return res.status(400).json({ error: 'Habit ID is required' });
      }

      const [result] = await pool.execute(
        'DELETE FROM daily_habits WHERE id = ? AND user_id = ?',
        [habit_id, userId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Habit not found' });
      }

      res.json({
        success: true,
        message: 'Habit deleted successfully'
      });
    } catch (error) {
      console.error('Delete habit error:', error);
      res.status(500).json({ error: 'Failed to delete habit' });
    }
  }
}