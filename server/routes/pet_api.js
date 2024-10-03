const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('../db/db'); // Import the pool from db/db.js
router.use(bodyParser.json());
router.use(cors());

// Retrieve pets information
router.get('/', async (req, res) => {
  try {
      const petsResult = await pool.query(`
          SELECT pets.*, species.species_name, species.diet_desc, moods.mood_name, colors.color_name, sprites.image_url, personalities.personality_name
          FROM pets
          JOIN species ON pets.species_id = species.id
          JOIN moods ON pets.mood_id = moods.id
          JOIN colors ON pets.color_id = colors.id
          JOIN sprites ON pets.sprite_id = sprites.id
          JOIN personalities ON pets.personality_id = personalities.id
      `);
      res.json(petsResult.rows);  // Return pets data as JSON
  } catch (err) {
      console.error('Error fetching pets:', err);
      res.status(500).send('Server error');
  }
});

module.exports = router;
