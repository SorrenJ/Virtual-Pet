const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('../db/db'); // Import the pool from db/db.js
router.use(bodyParser.json());
router.use(cors());

// Route to fetch all pets by user ID
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  // Validate userId and check if it's defined and a number
  if (!userId || isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid or missing user ID' });
  }

  try {
    const petsQuery = await pool.query(
      `SELECT pets.id, pets.name, sprites.image_url AS pet_image_url, colors.color_name, pets.mood_id
       FROM pets 
       JOIN sprites ON pets.sprite_id = sprites.id
       JOIN colors ON pets.color_id = colors.id
       WHERE pets.user_id = $1`,
      [userId]
    );

    if (petsQuery.rows.length === 0) {
      return res.status(404).json({ error: 'No pets found for this user' });
    }

    res.json(petsQuery.rows);
  } catch (error) {
    console.error('Error fetching pets:', error);
    res.status(500).json({ error: 'Server error' });
  }
});



// Route to update a specific pet's image based on mood
router.put('/update-image/:userId/:petId', async (req, res) => {
  const { userId, petId } = req.params;
  const { mood_id } = req.body;

  try {
    // Update mood_id and sprite_id
    await pool.query(
      'UPDATE pets SET mood_id = $1, sprite_id = (SELECT id FROM sprites WHERE species_id = pets.species_id AND color_id = pets.color_id AND mood_id = $1) WHERE id = $2 AND user_id = $3',
      [mood_id, petId, userId]
    );

    // Fetch the updated pet to return the new image URL
    const updatedPet = await pool.query(
      `SELECT sprites.image_url AS pet_image_url 
       FROM pets 
       JOIN sprites ON pets.sprite_id = sprites.id 
       WHERE pets.id = $1`,
      [petId]
    );

    res.json(updatedPet.rows[0]);  // Return the updated pet with the new image URL
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update pet mood and sprite' });
  }
});


module.exports = router;
