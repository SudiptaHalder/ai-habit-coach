// src/controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here-make-it-very-long-and-secure';

export class AuthController {
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;

      console.log('📝 Registration attempt:', { name, email });

      // Validation
      if (!name || !email || !password) {
        return res.status(400).json({ 
          success: false,
          error: 'Name, email, and password are required' 
        });
      }

      if (password.length < 6) {
        return res.status(400).json({ 
          success: false,
          error: 'Password must be at least 6 characters' 
        });
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          success: false,
          error: 'Please enter a valid email address' 
        });
      }

      // Name validation
      if (name.length < 2) {
        return res.status(400).json({ 
          success: false,
          error: 'Name must be at least 2 characters' 
        });
      }

      // Check if user already exists
      const [existingUsers] = await pool.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existingUsers.length > 0) {
        return res.status(400).json({ 
          success: false,
          error: 'User already exists with this email' 
        });
      }

      // Hash password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Create user
      const [result] = await pool.execute(
        'INSERT INTO users (name, email, password_hash, personality) VALUES (?, ?, ?, ?)',
        [name, email, passwordHash, 'fun']
      );

      // Generate JWT token
      const token = jwt.sign(
        { userId: result.insertId, email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Create initial streak record
      await pool.execute(
        'INSERT INTO streaks (user_id, current_streak, last_updated) VALUES (?, 0, NULL)',
        [result.insertId]
      );

      console.log('✅ User registered successfully:', result.insertId);

      res.status(201).json({
        success: true,
        message: 'Account created successfully! Welcome to Habit Coach! 🎉',
        user: {
          id: result.insertId,
          name,
          email,
          personality: 'fun'
        },
        token
      });

    } catch (error) {
      console.error('❌ Registration error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Internal server error. Please try again.' 
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      console.log('🔐 Login attempt for email:', email);

      // Validation
      if (!email || !password) {
        return res.status(400).json({ 
          success: false,
          error: 'Email and password are required' 
        });
      }

      // Basic email format check
      if (!email.includes('@')) {
        return res.status(400).json({ 
          success: false,
          error: 'Please enter a valid email address' 
        });
      }

      // Find user
      const [users] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      console.log('📊 Users found:', users.length);

      if (users.length === 0) {
        console.log('❌ No user found with email:', email);
        return res.status(401).json({ 
          success: false,
          error: 'Invalid email or password. Please try again.' 
        });
      }

      const user = users[0];
      console.log('👤 User found:', { id: user.id, email: user.email });

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      console.log('🔑 Password valid:', isPasswordValid);

      if (!isPasswordValid) {
        console.log('❌ Invalid password for user:', user.email);
        return res.status(401).json({ 
          success: false,
          error: 'Invalid email or password. Please try again.' 
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      console.log('✅ Login successful for user:', user.id);

      res.json({
        success: true,
        message: 'Welcome back! Great to see you again! 👋',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          personality: user.personality
        },
        token
      });

    } catch (error) {
      console.error('❌ Login error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Internal server error. Please try again.' 
      });
    }
  }

  static async logout(req, res) {
    try {
      // For JWT, we don't need to do much on the server side
      // Client will remove the token
      res.json({ 
        success: true, 
        message: 'Logged out successfully' 
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Logout failed' 
      });
    }
  }

  static async getCurrentUser(req, res) {
    try {
      const userId = req.user.userId;

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

      res.json({ 
        success: true,
        user: users[0] 
      });

    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to get user data' 
      });
    }
  }

  static async updateProfile(req, res) {
    try {
      const userId = req.user.userId;
      const { name, personality } = req.body;

      if (!name && !personality) {
        return res.status(400).json({ 
          success: false,
          error: 'No fields to update' 
        });
      }

      // Validate name if provided
      if (name && name.length < 2) {
        return res.status(400).json({ 
          success: false,
          error: 'Name must be at least 2 characters' 
        });
      }

      const updateFields = [];
      const updateValues = [];

      if (name) {
        updateFields.push('name = ?');
        updateValues.push(name);
      }

      if (personality) {
        if (!['fun', 'strict', 'chill'].includes(personality)) {
          return res.status(400).json({ 
            success: false,
            error: 'Invalid personality type' 
          });
        }
        updateFields.push('personality = ?');
        updateValues.push(personality);
      }

      updateValues.push(userId);

      const [result] = await pool.execute(
        `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          success: false,
          error: 'User not found' 
        });
      }

      // Get updated user
      const [users] = await pool.execute(
        'SELECT id, name, email, personality FROM users WHERE id = ?',
        [userId]
      );

      res.json({
        success: true,
        message: 'Profile updated successfully!',
        user: users[0]
      });

    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to update profile' 
      });
    }
  }

  static async checkEmail(req, res) {
    try {
      const { email } = req.query;

      if (!email) {
        return res.status(400).json({ 
          success: false,
          error: 'Email is required' 
        });
      }

      const [users] = await pool.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      res.json({
        success: true,
        exists: users.length > 0
      });

    } catch (error) {
      console.error('Check email error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to check email' 
      });
    }
  }
}