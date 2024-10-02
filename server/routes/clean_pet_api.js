const express = require("express");
const router = express.Router();
const cors = require("cors");
require('dotenv').config();
const pool = require('../db/db'); // Import the pool from db/db.js

// Enable CORS for cross-origin requests
router.use(cors());


router.post('/clean-pet', async (req, res) => {
    const { petId, toiletriesId } = req.body; // Get petId and toiletriesId from the request body
    const userId = 1; // Use the actual userId from your session or request

    try {
        // First, update any pets with NULL cleanliness to 100 (cleanliness fix)
        const cleanlinessFixQuery = `
            UPDATE pets
            SET cleanliness = 100
            WHERE id = $1 AND cleanliness IS NULL;
        `;
        await pool.query(cleanlinessFixQuery, [petId]);

        // Get the toiletries' effect value and count
        const toiletriesQuery = `
           SELECT effects AS effect, ut.count 
           FROM toiletries t
           JOIN user_toiletries ut ON t.id = ut.item_type_id
           WHERE ut.user_id = $1 AND ut.item_type_id = $2;
        `;
        const toiletriesResult = await pool.query(toiletriesQuery, [userId, toiletriesId]);

        if (toiletriesResult.rows.length === 0) {
            return res.status(400).json({ error: 'Toiletry not found or not enough count' });
        }

        const { effect, count } = toiletriesResult.rows[0];

        if (count <= 0) {
            return res.status(400).json({ error: 'No toiletry left to use' });
        }

        // Update the pet's cleanliness using the toiletries' effect
        const updateCleanlinessQuery = `
            UPDATE pets
            SET cleanliness = COALESCE(cleanliness, 0) + $1
            WHERE id = $2;
        `;
        await pool.query(updateCleanlinessQuery, [effect, petId]);

        // Decrease the toiletries count
        const decreaseToiletryCountQuery = `
            UPDATE user_toiletries
            SET count = count - 1
            WHERE user_id = $1 AND item_type_id = $2;
        `;
        await pool.query(decreaseToiletryCountQuery, [userId, toiletriesId]);

        res.json({ success: true });
    } catch (error) {
        console.error('Error cleaning pet:', error.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
