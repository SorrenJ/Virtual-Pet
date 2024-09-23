const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config();
const pool = require('./db/db'); // Import the pool from db/db.js

// Serve static files from the "db" directory
app.use('/db', express.static('db'));

//middleware
app.use(cors());


// Set up EJS as the templating engine
app.set('view engine', 'ejs');

app.listen(5000, () => {
    console.log("server started on port 5000");
});


app.get('/adopt', async (req, res) => {

    try {
   // Query the species table
   const speciesResult = await pool.query('SELECT * FROM species');
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

