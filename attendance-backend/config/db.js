// config/db.js
const { Pool } = require('pg');
require('dotenv').config();

// Create a PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST,         // e.g., 'localhost'
  user: process.env.DB_USER,         // e.g., 'postgres'
  password: process.env.DB_PASSWORD, // your DB password
  database: process.env.DB_NAME,     // e.g., 'fingerprint_attendance'
  port: process.env.DB_PORT || 5432, // default PostgreSQL port
});


// Test the database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    console.log('✅ PostgreSQL connected. Server time:', res.rows[0].now);
  }
});
// Export the pool for use in queries
module.exports = pool;
