const express = require("express");
const router = express.Router();

const pool = require('../db/db'); // Import the pool from db/db.js

// Enable CORS for cross-origin requests





router.post('/', async (req, res) => {
    const { petId, foodId } = req.body; // Get petId and foodId from the request body
    const userId = 1; // Use the actual userId from your session or request
    console.log(`Feeding pet. User ID: ${userId}, Pet ID: ${petId}, Food ID: ${foodId}`); // Log these values

    try {
        // Ensure pet's hunger is initialized to 100 if it's currently NULL
        const hungerFixQuery = `
            UPDATE pets
            SET hunger = 100
            WHERE id = $1 AND hunger IS NULL;
        `;
        await pool.query(hungerFixQuery, [petId]);

        // Get the food's effect value, count, and pet's current hunger
        const foodQuery = `
           SELECT f.id AS foodId, f.effects AS effect, uf.count, p.hunger
           FROM foods f
           JOIN user_foods uf ON f.id = uf.item_type_id
           JOIN pets p ON p.id = $3
           WHERE uf.user_id = $1 AND uf.item_type_id = $2;
        `;
        const foodResult = await pool.query(foodQuery, [userId, foodId, petId]);

        // Log the query result to check what's being returned
        console.log('Food Query Result:', foodResult.rows);

        if (foodResult.rows.length === 0) {
            console.log(`No food found for user ${userId} or food count is zero.`);
            return res.status(400).json({ error: 'Food not found or not enough count' });
        }

        let { effect, count, hunger } = foodResult.rows[0];

        // Ensure effect and hunger are valid numbers (fallback to 0 if not)
        effect = effect || 0;
        hunger = hunger || 0;

        if (count <= 0) {
            return res.status(400).json({ error: 'No food left to feed' });
        }

        // Update the pet's hunger by adding the food's effect, ensuring hunger doesn't exceed 200
        const newHunger = Math.min(hunger + effect, 200); // Adjust max hunger to 200

        const updateHungerQuery = `
           UPDATE pets
           SET hunger = $1
           WHERE id = $2;
        `;
        await pool.query(updateHungerQuery, [newHunger, petId]);

        // Decrease the food count in user_foods
        const decreaseFoodCountQuery = `
            UPDATE user_foods
            SET count = count - 1
            WHERE user_id = $1 AND item_type_id = $2;
        `;
        await pool.query(decreaseFoodCountQuery, [userId, foodId]);

        res.json({ success: true });
    } catch (error) {
        console.error('Error feeding pet:', error.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;