const express = require('express');
const router = express.Router();
const pool = require('../db/db');

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
