const express = require('express');
const pool = require('../db/db'); // Assuming you've set up your PostgreSQL connection pool
const router = express.Router();

// Route to fetch the pet by user ID
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    console.log('Fetching pet for user ID:', userId); // Debugging statement

    const petQuery = await pool.query(
      `SELECT pets.name, sprites.image_url AS pet_image_url, colors.color_name, pets.mood_id
       FROM pets 
       JOIN sprites ON pets.sprite_id = sprites.id
       JOIN colors ON pets.color_id = colors.id
       
       WHERE pets.user_id = $1`,
      [userId]
    );

    console.log('Pet query result:', petQuery.rows); // Debugging statement

    if (petQuery.rows.length === 0) {
      return res.status(404).json({ error: 'No pet found for this user' });
    }

    const pet = petQuery.rows[0];
    res.json(pet); // Send the pet data
  } catch (error) {
    console.error('Error fetching pet:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/update-image/:userId', async (req, res) => {
  const { userId } = req.params;
  const { mood_id } = req.body; // Get the new mood_id from the request body

  try {
    // Query to get the pet's current color_id and species_id
    const petQuery = await pool.query(
      `SELECT color_id, species_id FROM pets WHERE user_id = $1`,
      [userId]
    );

    if (petQuery.rowCount === 0) {
      return res.status(404).json({ error: 'No pet found for this user' });
    }

    const { color_id, species_id } = petQuery.rows[0];

    // Query to get the new sprite_id based on color_id, species_id, and mood_id
    const spriteQuery = await pool.query(
      `SELECT id FROM sprites 
      WHERE color_id = $1 AND species_id = $2 AND mood_id = $3`,
      [color_id, species_id, mood_id]
    );

    if (spriteQuery.rowCount === 0) {
      return res.status(404).json({ error: 'No sprite found for the given parameters' });
    }

    const newSpriteId = spriteQuery.rows[0].id;

    // Update the pet's sprite_id in the pets table
    await pool.query(
      `UPDATE pets 
      SET sprite_id = $1, update_time = CURRENT_TIMESTAMP 
      WHERE user_id = $2`,
      [newSpriteId, userId]
    );

    res.json({ message: 'Sprite updated successfully', sprite_id: newSpriteId }); // Respond with the new sprite ID
  } catch (error) {
    console.error('Error updating sprite:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
