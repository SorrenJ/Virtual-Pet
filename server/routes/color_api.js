const express = require('express');
const router = express.Router();
const pool = require('../db/db')

router.get('/', async (req, res) => {
  const { species_id, color_id } = req.query;

  try {
    const spriteResult = await pool.query(`
      SELECT image_url
      FROM sprites
      WHERE species_id = $1
        AND color_id = $2
        AND mood_id = (SELECT id FROM moods WHERE mood_name = 'default' LIMIT 1)
      LIMIT 1
    `, [species_id, color_id]);

    if (spriteResult.rows.length === 0) {
      return res.status(404).json({ error: 'Sprite not found' });
    }

    const spriteUrl = spriteResult.rows[0].image_url;
    res.status(200).json({ spriteUrl });
  } catch (err) {
    console.error('Error fetching sprite:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;