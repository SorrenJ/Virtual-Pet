const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config();
const pool = require('./db/db'); // Import the pool from db/db.js

// Serve static files from the "db" directory
app.use('/db', express.static('db'));

//middleware
app.use(cors());
app.use(express.json()); // Add this line for JSON parsing

// Set up EJS as the templating engine
app.set('view engine', 'ejs');

app.listen(5000, () => {
    console.log("server started on port 5000");
});


app.get('/adopt', async (req, res) => {

    try {
   // Query the species table
   const speciesResult = await pool.query(`
      SELECT *
      FROM species
      JOIN images ON species.image_id = images.id
      
   `);
   const species = speciesResult.rows;

   // Query the pets table joined with species
   const petsResult = await pool.query(`
      SELECT pets.*, species.species_name, species.diet_desc
      FROM pets
      JOIN species ON pets.species_id = species.id
    `);
   const pets = petsResult.rows;

   // Render the 'adopt.ejs' template and pass both species and pets data to it
   res.render('adopt', { species, pets });
 } catch (err) {
   console.error('Error fetching data:', err);
   res.status(500).send('Server error');
 }

});


app.post('/adopt-pet', async (req, res) => {
  const { species_id } = req.body;
  const userId = 1; // Change this to the actual user ID

  try {
      const newPet = await pool.query(`
          INSERT INTO pets (user_id, species_id, created_at)
          VALUES ($1, $2, NOW()) RETURNING *
      `, [userId, species_id]);

      res.status(201).json(newPet.rows[0]);
  } catch (err) {
      console.error('Error inserting pet:', err);
      res.status(500).send('Server error');
  }
});

app.post('/set-pet-name', async (req, res) => {
  const { pet_id, name } = req.body;

  try {
      const updatedPet = await pool.query(`
          UPDATE pets
          SET name = $1,
              age = 1,
              emotion = 'default',
              personality = 'Gloomy'
          WHERE id = $2
          RETURNING *
      `, [name, pet_id]);

      if (updatedPet.rowCount === 0) {
          return res.status(404).send('No pet found to update.');
      }

      res.status(200).json(updatedPet.rows[0]);
  } catch (err) {
      console.error('Error setting pet name:', err);
      res.status(500).send('Server error');
  }
});
app.get('/shop', async (req, res) => {
  try {
    toysResult = await pool.query('SELECT * FROM toys');
    toys = toysResult.rows;

    toiletriesResult = await pool.query('SELECT * FROM toiletries');
    toiletries = toiletriesResult.rows;

    foodsResult = await pool.query('SELECT * FROM foods');
    foods = foodsResult.rows; 

    res.render('shop', { toys, toiletries, foods });
} catch (err) {
  console.error('Error fetching data:', err);
  res.status(500).send('Server error');
}
})

