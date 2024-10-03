const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('../db/db'); // Import the pool from db/db.js
router.use(bodyParser.json());
router.use(cors());


router.post('/', async (req, res) => {
    const { petId, toiletriesId} = req.body; // Get petId and toiletriesId from the request body
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
           SELECT t.id AS toiletriesId, effects AS effect, ut.count, p.cleanliness 
           FROM toiletries t
           JOIN user_toiletries ut ON t.id = ut.item_type_id
           JOIN pets p ON p.id = $3
           WHERE ut.user_id = $1 AND ut.id = $2;
        `;
        const toiletriesResult = await pool.query(toiletriesQuery, [userId, toiletriesId, petId]);

        if (toiletriesResult.rows.length === 0) {
            return res.status(400).json({ error: 'Toiletry not found or not enough count' });
        }

        let { effect, count, cleanliness } = toiletriesResult.rows[0];


        // Ensure effect and hunger are valid numbers (fallback to 0 if not)
        effect = effect || 0;
        cleanliness = cleanliness || 0;


        if (count <= 0) {
            return res.status(400).json({ error: 'No toiletry left to use' });
        }

         // Update the pet's hunger by adding the food's effect, ensuring hunger doesn't exceed 200
         const newClean = Math.min(cleanliness + effect, 200); // Adjust max hunger to 200
        // Update the pet's cleanliness using the toiletries' effect
        const updateCleanlinessQuery = `
            UPDATE pets
            SET cleanliness = $1
            WHERE id = $2;
        `;
        await pool.query(updateCleanlinessQuery, [newClean , petId]);

        // Decrease the toiletries count
        const decreaseToiletryCountQuery = `
            UPDATE user_toiletries
            SET count = count - 1
            WHERE user_id = $1 AND id = $2;
        `;
        await pool.query(decreaseToiletryCountQuery, [userId, toiletriesId]);

        res.json({ success: true });
    } catch (error) {
        console.error('Error cleaning pet:', error.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Export the router
module.exports = router;