const { Pool } = require('pg');
require('dotenv').config(); // Optional, if using environment variables

const pool = new Pool({
  user: process.env.DB_USER || 'labber',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'beastly_bonds_development',
  password: process.env.DB_PASSWORD || 'labber',  // This should match DB_PASSWORD in .env
  port: process.env.DB_PORT || 5432, // No space around 5432
});

module.exports = pool;
