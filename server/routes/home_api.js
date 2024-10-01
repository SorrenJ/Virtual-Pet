const express = require('express');
const router = express.Router();
const pool = require('../db/db');

// Middleware to log the current user ID for debugging
const userId = 1; // Hardcoded user ID for now

// Get home data including pets and inventory
router.get('/', async (req, res) => {
    console.log(`Current User ID in /home route: ${userId}`);
    const selectedPetId = req.query.selectedPetId;

    try {
        // Query to get pets with their sprite and species details
        const petQuery = `
            SELECT 
              p.id AS pet_id, 
              p.user_id, 
              p.species_id, 
              p.name AS pet_name, 
              p.age, 
              p.adopted_at, 
              p.sprite_id, 
              p.mood_id, 
              p.color_id, 
              p.personality_id, 
              p.update_time, 
              p.energy, 
              p.happiness, 
              p.hunger, 
              p.cleanliness,
              s.species_name, 
              s.hunger_mod, 
              s.happy_mod, 
              s.energy_mod, 
              s.clean_mod, 
              s.lifespan, 
              s.diet_type, 
              s.diet_desc, 
              s.image AS species_image,
              u.name AS user_name, 
              u.email,
              sp.image_url AS pet_image,
              m.mood_name, 
              c.color_name,
              per.personality_name
            FROM pets p
            JOIN species s ON p.species_id = s.id
            JOIN users u ON p.user_id = u.id
            JOIN sprites sp ON p.sprite_id = sp.id
            JOIN moods m ON p.mood_id = m.id
            JOIN colors c ON p.color_id = c.id
            JOIN personalities per ON p.personality_id = per.id
            WHERE p.user_id = $1
            ORDER BY p.name;
        `;

        const pets = await pool.query(petQuery, [userId]);

        if (pets.rows.length === 0) {
            return res.status(200).json({ pets: [], selectedPet: null });
        }

        // Find the selected pet or default to the first pet
        const selectedPet = selectedPetId
            ? pets.rows.find(pet => pet.pet_id === parseInt(selectedPetId))
            : pets.rows[0];

        if (!selectedPet) {
            return res.status(404).json({ error: 'Pet not found' });
        }

        // Query to get inventory data for the user
        const inventoryQuery = `SELECT * FROM inventory WHERE user_id = $1`;
        const inventory = await pool.query(inventoryQuery, [userId]);

        // Queries to get counts from views for the user
        const userFoodCountQuery = `SELECT food_count FROM user_food_count WHERE user_id = $1`;
        const userToiletriesCountQuery = `SELECT toiletry_count FROM user_toiletries_count WHERE user_id = $1`;
        const userToysCountQuery = `SELECT toy_count FROM user_toy_count WHERE user_id = $1`;

        const userFoodCount = await pool.query(userFoodCountQuery, [userId]);
        const userToiletriesCount = await pool.query(userToiletriesCountQuery, [userId]);
        const userToysCount = await pool.query(userToysCountQuery, [userId]);

        // Extract counts or default to 0
        const foodCount = userFoodCount.rows[0] ? userFoodCount.rows[0].food_count : 0;
        const toiletriesCount = userToiletriesCount.rows[0] ? userToiletriesCount.rows[0].toiletry_count : 0;
        const toysCount = userToysCount.rows[0] ? userToysCount.rows[0].toy_count : 0;

        // Queries to get user toys, toiletries, and foods for the user
        const userFood = await pool.query(`
            SELECT uf.count, uf.user_id, uf.inventory_id, f.id AS item_type_id, f.name AS food_name, f.food_image AS "foodImage"
            FROM user_foods uf
            JOIN foods f ON uf.item_type_id = f.id
            WHERE uf.user_id = $1
        `, [userId]);

        const userToiletries = await pool.query(`
            SELECT ut.count, ut.user_id, ut.inventory_id, t.id AS item_type_id, t.name AS toiletries_name, t.toiletry_image AS "toiletryImage"
            FROM user_toiletries ut
            JOIN toiletries t ON ut.item_type_id = t.id
            WHERE ut.user_id = $1
        `, [userId]);

        const userToys = await pool.query(`
            SELECT ut.count, ut.user_id, ut.inventory_id, ty.id AS item_type_id, ty.name AS toys_name, ty.toy_image AS "toyImage"
            FROM user_toys ut
            JOIN toys ty ON ut.item_type_id = ty.id
            WHERE ut.user_id = $1
        `, [userId]);

        // Send the data back as JSON
        res.json({
            pets: pets.rows,
            selectedPet,
            inventory: inventory.rows,
            foodCount,
            toiletriesCount,
            toysCount,
            userFood: userFood.rows,
            userToiletries: userToiletries.rows,
            userToys: userToys.rows,
            petId: selectedPet.pet_id
        });

    } catch (error) {
        console.error('Error executing query', error.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get inventory data for the user
router.get('/inventory', async (req, res) => {
    try {
        const userId = 1; // Hardcoded user ID for now
        const inventoryQuery = `SELECT * FROM inventory WHERE user_id = $1`;
        const result = await pool.query(inventoryQuery, [userId]);

        // Assuming you also want to return foodCount, toiletriesCount, and toysCount
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

// Feed pet API
router.post('/feed-pet', async (req, res) => {
    const { petId, foodId } = req.body;

    if (!petId || !foodId) {
        return res.status(400).json({ error: 'Pet ID and Food ID are required' });
    }

    try {
        const userId = 1; // Assuming a hardcoded userId
        console.log(`Feeding pet. User ID: ${userId}, Pet ID: ${petId}, Food ID: ${foodId}`);

        // Implement the logic for feeding the pet here.
        // For example, you could update the pet's hunger, etc.
        // Example response
        res.json({ success: true });
    } catch (error) {
        console.error('Error feeding pet:', error.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Clean pet API
router.post('/clean-pet', async (req, res) => {
    const { petId, toiletriesId } = req.body; // Get petId and toiletriesId from the request body
    const userId = 1; // Use the actual userId from your session or request

    try {
        // Your existing logic here...
        res.json({ success: true });
    } catch (error) {
        console.error('Error cleaning pet:', error.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Play with pet API
router.post('/play-with-pet', async (req, res) => {
    const { petId, toyId } = req.body; // Get petId and toyId from the request body
    const userId = 1; // Use the actual userId from your session or request

    try {
        // Your existing logic here...
        res.json({ success: true });
    } catch (error) {
        console.error('Error playing with pet:', error.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
