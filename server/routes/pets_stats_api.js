const express = require("express");
const router = express.Router();
const pool = require('../db/db'); // Import the pool from db/db.js

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

// Run the decrement function every 60 seconds
const intervalId = setInterval(() => {
    decrementPetStats();
}, 60000); // 60 seconds

// Optionally clear the interval when the app shuts down
process.on('SIGTERM', () => {
    clearInterval(intervalId);
});

// Test route (move this above parameterized routes to avoid conflicts)
router.get('/test', (req, res) => {
    res.send('Test route works!');
});

// Fetch pet stats for a specific pet
router.get('/:petId', async (req, res) => {
    const petId = parseInt(req.params.petId, 10); // Convert petId to an integer
    console.log(`Received petId as integer: ${petId}`); // Log to confirm

    try {
        const petStatsQuery = `
            SELECT
                p.energy, 
                p.happiness, 
                p.hunger, 
                p.cleanliness
            FROM pets p
            WHERE p.id = $1
        `;
        const result = await pool.query(petStatsQuery, [petId]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Pet not found' });
        }
    } catch (error) {
        console.error('Error fetching pet stats:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
