
// // src/server.js - UPDATED WITH AUTH
// import express from 'express';
// import cors from 'cors';
// import { config } from './config/env.js';
// import { initializeDatabase } from './config/db.js';

// // Import routes
// import authRoutes from './routes/authRoutes.js';
// import aiRoutes from './routes/aiRoutes.js';
// import habitRoutes from './routes/habitRoutes.js';
// import streakRoutes from './routes/streakRoutes.js';

// // Import middleware
// import { authenticateToken } from './middleware/auth.js';

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Public routes (no authentication required)
// app.use('/api/auth', authRoutes);

// // Protected routes (authentication required)
// app.use('/api/ai', authenticateToken, aiRoutes);
// app.use('/api/habits', authenticateToken, habitRoutes);
// app.use('/api/streak', authenticateToken, streakRoutes);

// // Health check (public)
// app.get('/api/health', (req, res) => {
//   res.json({ 
//     status: 'OK', 
//     message: 'AI Habit Coach API is running',
//     timestamp: new Date().toISOString()
//   });
// });

// // Error handling middleware
// app.use((error, req, res, next) => {
//   console.error('Unhandled error:', error);
//   res.status(500).json({ error: 'Internal server error' });
// });

// // 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({ error: 'Route not found' });
// });

// // Start server
// async function startServer() {
//   const dbConnected = await initializeDatabase();
  
//   if (!dbConnected) {
//     console.log('⚠️  Starting server without database connection');
//   }

//   app.listen(config.port, () => {
//     console.log(`🚀 Server running on port ${config.port}`);
//     console.log(`📊 Health check: http://localhost:${config.port}/api/health`);
    
//     if (!config.groqApiKey) {
//       console.log('⚠️  GROQ_API_KEY not set - AI features will use fallback responses');
//     }
//     if (!config.huggingfaceToken) {
//       console.log('⚠️  HUGGINGFACE_TOKEN not set - Emotion detection will use fallback');
//     }
//     if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your-super-secret-jwt-key-here-make-it-very-long-and-secure') {
//       console.log('⚠️  JWT_SECRET not set or using default - Please set a secure JWT secret in production');
//     }
//   });
// }

// startServer().catch(console.error);
// src/server.js - UPDATED WITH AUTH AND PROFILE
import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { initializeDatabase } from './config/db.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import habitRoutes from './routes/habitRoutes.js';
import streakRoutes from './routes/streakRoutes.js';
import profileRoutes from './routes/profileRoutes.js'; // Add this line

// Import middleware
import { authenticateToken } from './middleware/auth.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Public routes (no authentication required)
app.use('/api/auth', authRoutes);

// Protected routes (authentication required)
app.use('/api/ai', authenticateToken, aiRoutes);
app.use('/api/habits', authenticateToken, habitRoutes);
app.use('/api/streak', authenticateToken, streakRoutes);
app.use('/api', authenticateToken, profileRoutes); // Add this line

// Health check (public)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'AI Habit Coach API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
async function startServer() {
  const dbConnected = await initializeDatabase();
  
  if (!dbConnected) {
    console.log('⚠️  Starting server without database connection');
  }

  app.listen(config.port, () => {
    console.log(`🚀 Server running on port ${config.port}`);
    console.log(`📊 Health check: http://localhost:${config.port}/api/health`);
    
    if (!config.groqApiKey) {
      console.log('⚠️  GROQ_API_KEY not set - AI features will use fallback responses');
    }
    if (!config.huggingfaceToken) {
      console.log('⚠️  HUGGINGFACE_TOKEN not set - Emotion detection will use fallback');
    }
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your-super-secret-jwt-key-here-make-it-very-long-and-secure') {
      console.log('⚠️  JWT_SECRET not set or using default - Please set a secure JWT secret in production');
    }
  });
}

startServer().catch(console.error);