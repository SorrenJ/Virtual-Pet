const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('../db/db'); // Import the pool from db/db.js
router.use(bodyParser.json());
router.use(cors());

// Retrieve species information
router.get('/', async (req, res) => {
  try {
      const speciesResult = await pool.query('SELECT * FROM species');
      res.json(speciesResult.rows);  // Return species data as JSON
  } catch (err) {
      console.error('Error fetching species:', err);
      res.status(500).send('Server error');
  }
});

module.exports = router;
