import { pool } from "./src/config/db.js";

const test = async () => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    console.log("Connected to DB. Users:", rows);
  } catch (err) {
    console.error("❌ DB Error:", err);
  }
};

test();
