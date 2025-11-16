// src/controllers/profileController.js
import { pool } from '../config/db.js';

export class ProfileController {
  static async getProfile(req, res) {
    try {
      const userId = req.user.userId;

      // Get user basic info
      const [users] = await pool.execute(
        'SELECT id, name, email, personality, created_at FROM users WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      const user = users[0];

      // Get user preferences
      const [preferences] = await pool.execute(
        'SELECT daily_reminders, weekly_reports FROM user_preferences WHERE user_id = ?',
        [userId]
      );

      // Get user goals
      const [goals] = await pool.execute(
        'SELECT goal_text, progress_percentage FROM user_goals WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
        [userId]
      );

      // Create default preferences if none exist
      let userPreferences = {
        daily_reminders: true,
        weekly_reports: false
      };

      if (preferences.length > 0) {
        userPreferences = preferences[0];
      } else {
        // Create default preferences
        await pool.execute(
          'INSERT INTO user_preferences (user_id, daily_reminders, weekly_reports) VALUES (?, ?, ?)',
          [userId, true, false]
        );
      }

      // Get goal data
      let userGoal = {
        goal_text: 'Build better habits',
        progress_percentage: 0
      };

      if (goals.length > 0) {
        userGoal = goals[0];
      } else {
        // Create default goal
        await pool.execute(
          'INSERT INTO user_goals (user_id, goal_text, progress_percentage) VALUES (?, ?, ?)',
          [userId, 'Build better habits', 0]
        );
      }

      res.json({
        success: true,
        profile: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            personality: user.personality,
            created_at: user.created_at
          },
          preferences: userPreferences,
          goals: userGoal
        }
      });

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get profile data'
      });
    }
  }

  static async updateProfile(req, res) {
    try {
      const userId = req.user.userId;
      const { name, personality, preferences, goals } = req.body;

      // Start transaction
      await pool.execute('START TRANSACTION');

      // Update user basic info
      if (name || personality) {
        const updateFields = [];
        const updateValues = [];

        if (name) {
          if (name.length < 2) {
            await pool.execute('ROLLBACK');
            return res.status(400).json({
              success: false,
              error: 'Name must be at least 2 characters'
            });
          }
          updateFields.push('name = ?');
          updateValues.push(name);
        }

        if (personality) {
          if (!['fun', 'strict', 'chill'].includes(personality)) {
            await pool.execute('ROLLBACK');
            return res.status(400).json({
              success: false,
              error: 'Invalid personality type'
            });
          }
          updateFields.push('personality = ?');
          updateValues.push(personality);
        }

        if (updateFields.length > 0) {
          updateValues.push(userId);
          await pool.execute(
            `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
          );
        }
      }

      // Update preferences
      if (preferences) {
        const [existingPrefs] = await pool.execute(
          'SELECT id FROM user_preferences WHERE user_id = ?',
          [userId]
        );

        if (existingPrefs.length > 0) {
          await pool.execute(
            'UPDATE user_preferences SET daily_reminders = ?, weekly_reports = ? WHERE user_id = ?',
            [preferences.dailyReminders || false, preferences.weeklyReports || false, userId]
          );
        } else {
          await pool.execute(
            'INSERT INTO user_preferences (user_id, daily_reminders, weekly_reports) VALUES (?, ?, ?)',
            [userId, preferences.dailyReminders || false, preferences.weeklyReports || false]
          );
        }
      }

      // Update goals
      if (goals && goals.goalText) {
        const [existingGoals] = await pool.execute(
          'SELECT id FROM user_goals WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
          [userId]
        );

        if (existingGoals.length > 0) {
          await pool.execute(
            'UPDATE user_goals SET goal_text = ?, progress_percentage = ? WHERE id = ?',
            [goals.goalText, goals.progressPercentage || 0, existingGoals[0].id]
          );
        } else {
          await pool.execute(
            'INSERT INTO user_goals (user_id, goal_text, progress_percentage) VALUES (?, ?, ?)',
            [userId, goals.goalText, goals.progressPercentage || 0]
          );
        }
      }

      await pool.execute('COMMIT');

      // Get updated profile
      const [updatedUsers] = await pool.execute(
        'SELECT id, name, email, personality FROM users WHERE id = ?',
        [userId]
      );

      res.json({
        success: true,
        message: 'Profile updated successfully!',
        user: updatedUsers[0]
      });

    } catch (error) {
      await pool.execute('ROLLBACK');
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update profile'
      });
    }
  }
}