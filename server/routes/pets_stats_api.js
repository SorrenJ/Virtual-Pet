const express = require("express");
const router = express.Router();


const pool = require('../db/db'); // Import the pool from db/db.js

// Enable CORS for cross-origin requests

router.get('/', async (req, res) => {
    const userId = 1; // Hardcoded user ID for now
    try {
        const petStatsQuery = `
        SELECT 
            p.id AS pet_id, 
            p.energy, 
            p.happiness, 
            p.hunger, 
            p.cleanliness
        FROM pets p
        WHERE p.user_id = $1
        `;
        const result = await pool.query(petStatsQuery, [userId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching pet stats:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;