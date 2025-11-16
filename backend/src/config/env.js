// src/config/env.js
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  groqApiKey: process.env.GROQ_API_KEY,
  huggingfaceToken: process.env.HUGGINGFACE_TOKEN,
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'habit_coach',
    port: process.env.DB_PORT || 3306
  }
};