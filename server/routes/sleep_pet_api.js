const express = require("express");
const router = express.Router();
const pool = require('../db/db'); // Import the pool from db/db.js

router.patch('/:petId', async (req, res) => {
    const { petId } = req.params;
    const { amount } = req.body;

    try {
        // Fetch current pet stats from the database
        const pet = await pool.query('SELECT energy FROM pets WHERE id = $1', [petId]);

        if (!pet.rows.length) {
            return res.status(404).json({ error: 'Pet not found' });
        }

        const newEnergy = Math.max(0, pet.rows[0].energy + amount); // Ensure energy doesn't go below 0

        // Update the energy in the database
        await pool.query('UPDATE pets SET energy = $1 WHERE id = $2', [newEnergy, petId]);

        // Return the updated stats with a success message
        const updatedPet = await pool.query('SELECT * FROM pets WHERE id = $1', [petId]);
        res.json({
            success: true,    // Adding the success field
            pet: updatedPet.rows[0] // Returning the updated pet data
        });
    } catch (error) {
        console.error('Error in backend sleep:', error);
        res.status(500).json({ error: 'Failed to sleep the pet' });
    }
});

module.exports = router;
