// src/config/db.js
import mysql from 'mysql2/promise';
import { config } from './env.js';

const pool = mysql.createPool({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
  port: config.database.port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

export { pool };