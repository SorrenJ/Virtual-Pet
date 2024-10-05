const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('../db/db'); // Import the pool from db/db.js
router.use(bodyParser.json());
router.use(cors());

// Enable CORS for cross-origin requests




router.get('/', async (req, res) => {
    try {
        const userId = 1; // Hardcoded user ID for now
      
        const inventoryQuery = `SELECT * FROM inventory WHERE user_id = $1`;
        const inventory = await pool.query(inventoryQuery, [userId]);

        // Example queries for counts (replace with actual table and query as needed)
        const userFoodCountQuery = `SELECT food_count FROM user_food_count WHERE user_id = $1`;
        const userToiletriesCountQuery = `SELECT toiletry_count FROM user_toiletries_count WHERE user_id = $1`;
        const userToysCountQuery = `SELECT toy_count FROM user_toy_count WHERE user_id = $1`;

        const userFoodCount = await pool.query(userFoodCountQuery, [userId]);
        const userToiletriesCount = await pool.query(userToiletriesCountQuery, [userId]);
        const userToysCount = await pool.query(userToysCountQuery, [userId]);

        const foodCount = userFoodCount.rows[0] ? userFoodCount.rows[0].food_count : 0;
        const toiletriesCount = userToiletriesCount.rows[0] ? userToiletriesCount.rows[0].toiletry_count : 0;
        const toysCount = userToysCount.rows[0] ? userToysCount.rows[0].toy_count : 0;

        const userFood = await pool.query(`
            SELECT uf.count, uf.item_type_id, uf.id, f.name AS food_name, f.food_image AS "foodImage"
            FROM user_foods uf
            JOIN foods f ON uf.item_type_id = f.id
            WHERE uf.user_id = $1
        `, [userId]);

        const userToiletries = await pool.query(`
            SELECT ut.count, ut.item_type_id, ut.id, t.name AS toiletries_name, t.toiletry_image AS "toiletryImage"
            FROM user_toiletries ut
            JOIN toiletries t ON ut.item_type_id = t.id
            WHERE ut.user_id = $1
        `, [userId]);

        const userToys = await pool.query(`
            SELECT ut.count, ut.item_type_id, ut.id, ty.name AS toys_name, ty.toy_image AS "toyImage"
            FROM user_toys ut
            JOIN toys ty ON ut.item_type_id = ty.id
            WHERE ut.user_id = $1
        `, [userId]);

        res.json({
            inventory: inventory.rows,
            foodCount,
            toiletriesCount,
            toysCount,
            userFood: userFood.rows,
            userToiletries: userToiletries.rows,
            userToys: userToys.rows,
        });

    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({ error: 'Failed to fetch inventory' });
    }
});

module.exports = router;