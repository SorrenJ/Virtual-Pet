const express = require("express");
const router = express.Router();
const cors = require("cors");
require('dotenv').config();
const pool = require('../db/db'); // Import the pool from db/db.js

// Enable CORS for cross-origin requests
router.use(cors());



router.get('/', async (req, res) => {
    try {
        const userId = 1; // Hardcoded user ID for now
        const inventoryQuery = `SELECT * FROM inventory WHERE user_id = $1`;
        const result = await pool.query(inventoryQuery, [userId]);

        const userFoodCountQuery = `SELECT food_count FROM user_food_count WHERE user_id = $1`;
        const userToiletriesCountQuery = `SELECT toiletry_count FROM user_toiletries_count WHERE user_id = $1`;
        const userToysCountQuery = `SELECT toy_count FROM user_toy_count WHERE user_id = $1`;

        const foodCount = await pool.query(userFoodCountQuery, [userId]);
        const toiletriesCount = await pool.query(userToiletriesCountQuery, [userId]);
        const toysCount = await pool.query(userToysCountQuery, [userId]);

        res.json({
            inventory: result.rows,
            foodCount: foodCount.rows[0]?.food_count || 0,
            toiletriesCount: toiletriesCount.rows[0]?.toiletry_count || 0,
            toysCount: toysCount.rows[0]?.toy_count || 0
        });
    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({ error: 'Failed to fetch inventory' });
    }
});

module.exports = router;