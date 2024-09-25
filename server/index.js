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
              personality = 'Gloomy',
              image = 'monster_assets/slugaboo/blue_default.png'
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

// Route to get all data from all tables
app.get('/all_tables', async (req, res) => {
  try {
    const speciesQuery = 'SELECT * FROM species';
    const usersQuery = 'SELECT * FROM users';
    const petsQuery = 'SELECT * FROM pets';
    const inventoryQuery = 'SELECT * FROM inventory';
    const userFoodQuery = 'SELECT * FROM user_food';
    const userToiletriesQuery = 'SELECT * FROM user_toiletries';
    const userToysQuery = 'SELECT * FROM user_toys';
    const shopQuery = 'SELECT * FROM shop';
    const toysQuery = 'SELECT * FROM toys';
    const toiletriesQuery = 'SELECT * FROM toiletries';
    const foodsQuery = 'SELECT * FROM foods';
    const imagesQuery = 'SELECT * FROM images';
    const colorsQuery = 'SELECT * FROM colors';

    const species = await pool.query(speciesQuery);
    const users = await pool.query(usersQuery);
    const pets = await pool.query(petsQuery);
    const inventory = await pool.query(inventoryQuery);
    const userFood = await pool.query(userFoodQuery);
    const userToiletries = await pool.query(userToiletriesQuery);
    const userToys = await pool.query(userToysQuery);
    const shop = await pool.query(shopQuery);
    const toys = await pool.query(toysQuery);
    const toiletries = await pool.query(toiletriesQuery);
    const foods = await pool.query(foodsQuery);
    const images = await pool.query(imagesQuery);
    const colors = await pool.query(colorsQuery);

    // Send all data back in a single response
    // res.json({
    //   species: species.rows,
    //   users: users.rows,
    //   pets: pets.rows,
    //   inventory: inventory.rows,
    //   userFood: userFood.rows,
    //   userToiletries: userToiletries.rows,
    //   userToys: userToys.rows,
    //   shop: shop.rows,
    //   toys: toys.rows,
    //   toiletries: toiletries.rows,
    //   foods: foods.rows,
    //   images: images.rows,
    //   colors: colors.rows,
    // });
      
        // Render the EJS template
        res.render('all_tables', {
          species: species.rows,
          users: users.rows,
          pets: pets.rows,
          inventory: inventory.rows,
          userFood: userFood.rows,
          userToiletries: userToiletries.rows,
          userToys: userToys.rows,
          shop: shop.rows,
          toys: toys.rows,
          toiletries: toiletries.rows,
          foods: foods.rows,
          images: images.rows,
          colors: colors.rows,
      });
  } catch (error) {
      console.error('Error executing query', error.stack);
      res.status(500).send('Internal Server Error');
  }
});


app.get('/home', async (req, res) => {
  const userId = 1; // Change this as necessary

  try {
      // Query to get the most recent pet with species and user details
      const petQuery = `
          SELECT p.name AS pet_name, p.image AS pet_image, 
                 s.species_name, s.hunger_mod, s.happy_mod, 
                 u.name AS user_name, u.email
          FROM pets p
          JOIN species s ON p.species_id = s.id
          JOIN users u ON p.user_id = u.id
          ORDER BY p.created_at DESC
          LIMIT 1
      `;
      const pets = await pool.query(petQuery);

      // Query to get inventory data for the user
      const inventoryQuery = `
          SELECT * FROM inventory WHERE user_id = $1
      `;
      const inventory = await pool.query(inventoryQuery, [userId]);

      // Queries to get counts from views for the user
      const userFoodCountQuery = `
            SELECT food_count FROM user_food_count WHERE user_id = $1
        `;
      const userToiletriesCountQuery = `
          SELECT toiletry_count FROM user_toiletries_count WHERE user_id = $1
      `;
      const userToysCountQuery = `
          SELECT toy_count FROM user_toy_count WHERE user_id = $1
      `;

      const userFoodCount = await pool.query(userFoodCountQuery, [userId]);
      const userToiletriesCount = await pool.query(userToiletriesCountQuery, [userId]);
      const userToysCount = await pool.query(userToysCountQuery, [userId]);

      // Extract counts or default to 0
      const foodCount = userFoodCount.rows[0] ? userFoodCount.rows[0].food_count : 0;
      const toiletriesCount = userToiletriesCount.rows[0] ? userToiletriesCount.rows[0].toiletry_count : 0;
      const toysCount = userToysCount.rows[0] ? userToysCount.rows[0].toy_count : 0;

      // Queries to get user_toys, user_toiletries, and user_foods for the user with names
      const userFood = await pool.query(`
          SELECT uf.count, uf.user_id, uf.inventory_id, f.id AS item_type_id, f.name AS food_name
          FROM user_food uf
          JOIN foods f ON uf.item_type_id = f.id
          WHERE uf.user_id = $1
      `, [userId]);
      
      const userToiletries = await pool.query(`
          SELECT ut.count, ut.user_id, ut.inventory_id, t.id AS item_type_id, t.name AS toiletries_name
          FROM user_toiletries ut
          JOIN toiletries t ON ut.item_type_id = t.id
          WHERE ut.user_id = $1
      `, [userId]);
      
      const userToys = await pool.query(`
          SELECT ut.count, ut.user_id, ut.inventory_id, ty.id AS item_type_id, ty.name AS toys_name
          FROM user_toys ut
          JOIN toys ty ON ut.item_type_id = ty.id
          WHERE ut.user_id = $1
      `, [userId]);

      // Render the EJS template for the home page
      res.render('home', {
          pet: pets.rows[0],
          inventory: inventory.rows,
          foodCount,
          toiletriesCount,
          toysCount,
          userFood: userFood.rows,
          userToiletries: userToiletries.rows,
          userToys: userToys.rows,
      });
  } catch (error) {
      console.error('Error executing query', error.stack);
      res.status(500).send('Internal Server Error');
  }
});
