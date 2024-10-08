// Route to delete a pet
const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('../db/db'); // Import the pool from db/db.js
router.use(bodyParser.json());
router.use(cors());


router.delete('/:petId', async (req, res) => {
    const { petId } = req.params;
    try {
        // Assuming you're using a PostgreSQL query
        const result = await pool.query('DELETE FROM pets WHERE id = $1 RETURNING *', [petId]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Pet not found' });
        }
        res.json({ success: true, message: 'Pet deleted successfully' });
    } catch (error) {
        console.error('Error deleting pet:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;