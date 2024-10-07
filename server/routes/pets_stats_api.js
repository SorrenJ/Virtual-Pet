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

        console.timeEnd('decrementPetStats'); // End timer
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

router.patch('/reduce-hunger/:petId', async (req, res) => {
    const { petId } = req.params;
    const { amount } = req.body;

    try {
        // Fetch current pet stats from the database
        const pet = await pool.query('SELECT hunger FROM pets WHERE id = $1', [petId]); // Using pool.query and id instead of pet_id

        if (!pet.rows.length) {
            return res.status(404).json({ error: 'Pet not found' });
        }

        const newHunger = Math.max(0, pet.rows[0].hunger + amount); // Ensure hunger doesn't go below 0

        // Update the hunger in the database
        await pool.query('UPDATE pets SET hunger = $1 WHERE id = $2', [newHunger, petId]);

        // Return the updated stats
        const updatedPet = await pool.query('SELECT * FROM pets WHERE id = $1', [petId]);
        res.json(updatedPet.rows[0]);
    } catch (error) {
        console.error('Error reducing hunger:', error);
        res.status(500).json({ error: 'Failed to reduce hunger' });
    }
});


router.patch('/reduce-energy/:petId', async (req, res) => {
    const { petId } = req.params;
    const { amount } = req.body;

    try {
        // Fetch current pet stats from the database
        const pet = await pool.query('SELECT energy FROM pets WHERE id = $1', [petId]); // Using pool.query and id instead of pet_id

        if (!pet.rows.length) {
            return res.status(404).json({ error: 'Pet not found' });
        }

        const newEnergy = Math.max(0, pet.rows[0].energy + amount); // Ensure hunger doesn't go below 0

        // Update the hunger in the database
        await pool.query('UPDATE pets SET energy = $1 WHERE id = $2', [newEnergy, petId]);

        // Return the updated stats
        const updatedPet = await pool.query('SELECT * FROM pets WHERE id = $1', [petId]);
        res.json(updatedPet.rows[0]);
    } catch (error) {
        console.error('Error reducing energy:', error);
        res.status(500).json({ error: 'Failed to reduce energy' });
    }
});



router.patch('/reduce-happiness/:petId', async (req, res) => {
    const { petId } = req.params;
    const { amount } = req.body;

    try {
        // Fetch current pet stats from the database
        const pet = await pool.query('SELECT happiness FROM pets WHERE id = $1', [petId]); // Using pool.query and id instead of pet_id

        if (!pet.rows.length) {
            return res.status(404).json({ error: 'Pet not found' });
        }

        const newhappiness  = Math.max(0, pet.rows[0].happiness  + amount); // Ensure hunger doesn't go below 0

        // Update the hunger in the database
        await pool.query('UPDATE pets SET happiness  = $1 WHERE id = $2', [newhappiness , petId]);

        // Return the updated stats
        const updatedPet = await pool.query('SELECT * FROM pets WHERE id = $1', [petId]);
        res.json(updatedPet.rows[0]);
    } catch (error) {
        console.error('Error reducing happiness :', error);
        res.status(500).json({ error: 'Failed to reduce happiness ' });
    }
});

router.patch('/update-mood/:petId', async (req, res) => {
    const { petId } = req.params;
    let { moodId } = req.body; // Get the new mood_id from the request body

    // Default mood_id to 1 if not provided or invalid
    moodId = !moodId || isNaN(parseInt(moodId, 10)) ? 1 : parseInt(moodId, 10);

    try {
        // Update the pet's mood in the database
        const updateQuery = 'UPDATE pets SET mood_id = $1 WHERE id = $2';
        await pool.query(updateQuery, [moodId, petId]);

        // Return success response
        res.status(200).json({ message: 'Mood updated successfully' });
    } catch (error) {
        console.error('Error updating mood:', error);
        res.status(500).json({ error: 'Failed to update mood' });
    }
});

// Route to fetch the pet's sprite based on its mood
router.get('/pet-sprite/:petId', async (req, res) => {
    const { petId } = req.params;
    let { mood_id } = req.query; // Get the moodId from the query string

    // Default mood_id to 1 if not provided or invalid
    mood_id = !mood_id || isNaN(parseInt(mood_id, 10)) ? 1 : parseInt(mood_id, 10);

    try {
        // Fetch the current sprite based on the pet's species and mood
        const spriteQuery = `
        SELECT s.image_url 
        FROM sprites s
        JOIN pets p ON s.species_id = p.species_id
        WHERE p.id = $1 AND s.mood_id = $2;
        `;
        const result = await pool.query(spriteQuery, [petId, parseInt(mood_id, 10)]); // Ensure mood_id is passed as an integer

        if (result.rows.length > 0) {
            res.json(result.rows[0]); // Return the sprite URL
        } else {
            res.status(404).json({ error: 'Sprite not found for this mood' });
        }
    } catch (error) {
        console.error('Error fetching sprite:', error);
        res.status(500).json({ error: 'Server error' });
    }
});



module.exports = router;
