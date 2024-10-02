const express = require("express");
const router = express.Router();


const pool = require('../db/db'); // Import the pool from db/db.js

// Enable CORS for cross-origin requests




router.post('/', async (req, res) => {
    const { petId, toyId } = req.body; // Get petId and toyId from the request body
    const userId = 1; // Use the actual userId from your session or request

    try {
        // First, update the pet's happiness to a default value (e.g., 100) if it is NULL
        const happinessFixQuery = `
            UPDATE pets
            SET happiness = 100
            WHERE id = $1 AND happiness IS NULL;
        `;
        await pool.query(happinessFixQuery, [petId]);

        // Get the toy's effect value and count
        const toyQuery = `
           SELECT t.effects AS effect, ut.count 
           FROM toys t
           JOIN user_toys ut ON t.id = ut.item_type_id
           WHERE ut.user_id = $1 AND ut.item_type_id = $2;
        `;
        const toyResult = await pool.query(toyQuery, [userId, toyId]);

        if (toyResult.rows.length === 0) {
            return res.status(400).json({ error: 'Toy not found or not enough count' });
        }

        const { effect, count } = toyResult.rows[0];

        if (count <= 0) {
            return res.status(400).json({ error: 'No toys left to play with' });
        }

        // Update the pet's happiness by adding the toy's effect
        const updateHappinessQuery = `
           UPDATE pets
           SET happiness = happiness + $1
           WHERE id = $2;
        `;
        await pool.query(updateHappinessQuery, [effect, petId]);

        // Decrease the toy count
        const decreaseToyCountQuery = `
           UPDATE user_toys
           SET count = count - 1
           WHERE user_id = $1 AND item_type_id = $2;
        `;
        await pool.query(decreaseToyCountQuery, [userId, toyId]);

        res.json({ success: true });
    } catch (error) {
        console.error('Error playing with pet:', error.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;