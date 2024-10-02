const express = require("express");
const router = express.Router();
const cors = require("cors");
require('dotenv').config();
const pool = require('../db/db'); // Import the pool from db/db.js

// Enable CORS for cross-origin requests
router.use(cors());

// Function to decrement pet stats
const decrementPetStats = async () => {
    try {
        const query = `
        SELECT p.id AS pet_id, p.energy, p.happiness, p.hunger, p.cleanliness, 
               per.energy_decay, per.happiness_decay, per.hunger_decay, per.cleanliness_decay
        FROM pets p
        JOIN personalities per ON p.personality_id = per.id
        `;
        const result = await pool.query(query);
        const pets = result.rows;

        for (const pet of pets) {
            const newEnergy = Math.max(Math.floor(pet.energy - pet.energy_decay), 0);
            const newHappiness = Math.max(Math.floor(pet.happiness - pet.happiness_decay), 0);
            const newHunger = Math.max(Math.floor(pet.hunger - pet.hunger_decay), 0);
            const newCleanliness = Math.max(Math.floor(pet.cleanliness - pet.cleanliness_decay), 0);

            // Update the pet stats in the database
            const updateQuery = `
            UPDATE pets 
            SET energy = $1, happiness = $2, hunger = $3, cleanliness = $4
            WHERE id = $5
            `;
            await pool.query(updateQuery, [newEnergy, newHappiness, newHunger, newCleanliness, pet.pet_id]);
        }
        console.log('Pet stats updated successfully.');
    } catch (error) {
        console.error('Error decrementing pet stats:', error);
    }
};

// Run the decrement function every 60 seconds (1 minute)
setInterval(() => {
    decrementPetStats();
}, 60000);

// Get home data including pets and inventory
router.get('/', async (req, res) => {
    const userId = 1; // Hardcoded user ID for now
    console.log(`Current User ID in /home route: ${userId}`); 
    const selectedPetId = req.query.selectedPetId;

    try {
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
            return res.json({ pets: [], selectedPet: null });
        }

        const selectedPet = selectedPetId
            ? pets.rows.find(pet => pet.pet_id === parseInt(selectedPetId))
            : pets.rows[0];

        if (!selectedPet) {
            return res.status(404).send('Pet not found');
        }

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
            SELECT uf.count, f.name AS food_name, f.food_image AS "foodImage"
            FROM user_foods uf
            JOIN foods f ON uf.item_type_id = f.id
            WHERE uf.user_id = $1
        `, [userId]);

        const userToiletries = await pool.query(`
            SELECT ut.count, t.name AS toiletries_name, t.toiletry_image AS "toiletryImage"
            FROM user_toiletries ut
            JOIN toiletries t ON ut.item_type_id = t.id
            WHERE ut.user_id = $1
        `, [userId]);

        const userToys = await pool.query(`
            SELECT ut.count, ty.name AS toys_name, ty.toy_image AS "toyImage"
            FROM user_toys ut
            JOIN toys ty ON ut.item_type_id = ty.id
            WHERE ut.user_id = $1
        `, [userId]);

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
        });

        await decrementPetStats();

    } catch (error) {
        console.error('Error executing query', error.stack);
        res.status(500).send('Internal Server Error');
    }
});




module.exports = router;
