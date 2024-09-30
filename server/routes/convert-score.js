const express = require('express');
const router = express.Router();
const pool = require('../db/db')


// Convert score to money
router.post('/', async (req, res) => {
  const { userId, score } = req.body;
  const moneyPerScore = 10;
  const moneyEarned = score * moneyPerScore;

  try {
    await pool.query(
      `UPDATE inventory 
       SET money = money + $1 
       WHERE user_id = $2`,
      [moneyEarned, userId]
    );

    const moneyResult = await pool.query('SELECT money FROM inventory WHERE user_id = $1', [userId]);
    const money = moneyResult.rows[0] ? moneyResult.rows[0].money : 0;
    res.json({ money });
  } catch (error) {
    console.error('Error converting score:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;