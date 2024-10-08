const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
require('dotenv').config(); // Load environment variables from the .env file

// Import the pool from db.js to handle PostgreSQL queries
const pool = require('./db/db'); 

const app = express();

// Middleware

// Enable CORS to allow requests from localhost:3000 (your React frontend)
app.use(cors({
  origin: 'http://localhost:3000' // Allow only the React app to make requests
}));

// Parse incoming JSON requests
app.use(bodyParser.json());
app.use(express.json());

// Serve static files from the "db" directory (if needed)
app.use('/db', express.static('db'));

// Set up EJS as the templating engine (if needed)
app.set('view engine', 'ejs');

// Routes

// Importing routes from separate files
const convertScoreRoutes = require('./routes/convert-score');
const speciesApiRoute = require('./routes/species_api');
const petApiRoute = require('./routes/pet_api');
const userPetsApi = require('./routes/user_pet_api');
const homeApiRoute = require('./routes/home_api');
const cleanApiRoute = require('./routes/clean_pet_api');
const feedApiRoute = require('./routes/feed_pet_api');
const playApiRoute = require('./routes/play_with_pet_api');
const itemApiRoute = require('./routes/inventory_api');
const statsApiRoute = require('./routes/pets_stats_api');
const sleepApiRoute = require('./routes/sleep_pet_api');

const deleteApiRoute = require('./routes/delete_pet_api');


// Register routes
app.use('/api/convert-score', convertScoreRoutes);
app.use('/api/pets', petApiRoute);
app.use('/api/species', speciesApiRoute);
app.use('/api/user-pets', userPetsApi); // Changed to avoid duplicate paths
app.use('/api/home', homeApiRoute);
app.use('/api/clean-pet', cleanApiRoute);
app.use('/api/feed-pet', feedApiRoute);
app.use('/api/play-with-pet', playApiRoute);
app.use('/api/inventory', itemApiRoute);
app.use('/api/pets-stats', statsApiRoute);
app.use('/api/sleep-pet', sleepApiRoute);
app.use('/api/delete-pet', deleteApiRoute);


// Start the server on port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


// Adoption route
app.get('/adopt', async (req, res) => {
    try {
        // Query the species table
        const speciesResult = await pool.query(`
            SELECT *
            FROM species
            `);
        const species = speciesResult.rows;

        // Query the pets table joined with species
        const petsResult = await pool.query(`
            SELECT pets.*, species.species_name, species.diet_desc, moods.mood_name, colors.color_name, sprites.image_url, personalities.personality_name
            FROM pets
            JOIN species ON pets.species_id = species.id
            JOIN moods ON pets.mood_id = moods.id
            JOIN colors ON pets.color_id = colors.id
            JOIN sprites ON pets.sprite_id = sprites.id
            JOIN personalities ON pets.personality_id = personalities.id
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
    const { species_id, color_id } = req.body;  // Get species_id and color_id from the request
    const userId = 1;  // Hardcoded user ID for now

    console.log('Received species_id:', species_id, 'and color_id:', color_id);  // Debug log

    try {
        // Fetch the appropriate sprite_id based on the selected species_id, mood, and color
        const spriteResult = await pool.query(`
            SELECT id
            FROM sprites
            WHERE species_id = $1
              AND color_id = $2  -- Use the selected color_id from the request
              AND mood_id = (SELECT id FROM moods WHERE mood_name = 'default' LIMIT 1)
            LIMIT 1
        `, [species_id, color_id]);  // Pass both species_id and color_id as parameters

        if (spriteResult.rows.length === 0) {
            console.log('No matching sprite found for the given species and color.');
            return res.status(400).json({ error: 'No matching sprite found for the given species and color.' });
        }

        const sprite_id = spriteResult.rows[0].id;  // Get the first matching sprite

        // Insert the new pet (without name initially)
        const newPetResult = await pool.query(`
            INSERT INTO pets 
            (user_id, species_id, age, adopted_at, sprite_id, mood_id, color_id, personality_id, update_time, energy, happiness, hunger, cleanliness)
            VALUES 
            (
              $1,    -- user_id
              $2,    -- species_id
              1,     -- Hardcoded age
              NOW(), -- adopted_at (current timestamp)
              $3,    -- sprite_id
              (SELECT id FROM moods WHERE mood_name = 'default' LIMIT 1), 
              $4,    -- color_id from the request
              (SELECT id FROM personalities WHERE personality_name = 'Gloomy' LIMIT 1), 
              NOW(), 
              100, 100, 100, 100
            )
            RETURNING *
        `, [userId, species_id, sprite_id, color_id]);  // Use species_id, sprite_id, and color_id as parameters

        const newPet = newPetResult.rows[0];  // Get the newly created pet

        res.status(201).json(newPet);  // Send the newly created pet back to the client
    } catch (err) {
        console.error('Error inserting pet:', err.message);
        res.status(500).send('Server error');
    }
});



app.post('/set-pet-name', async (req, res) => {
    const { pet_id, name } = req.body;

    try {
        // Update the pet's name based on the pet_id
        const updatedPetResult = await pool.query(`
            UPDATE pets
            SET 
                name = $1,
                update_time = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *
        `, [name, pet_id]);

        if (updatedPetResult.rowCount === 0) {
            return res.status(404).send('No pet found to update.');
        }

        res.status(200).json(updatedPetResult.rows[0]);
    } catch (err) {
        console.error('Error setting pet name:', err);
        res.status(500).send('Server error');
    }
});
app.get('/shop', async (req, res) => {
    try {
        const toysResult = await pool.query('SELECT * FROM toys');
        const toys = toysResult.rows;

        const toiletriesResult = await pool.query('SELECT * FROM toiletries');
        const toiletries = toiletriesResult.rows;

        const foodsResult = await pool.query('SELECT * FROM foods');
        const foods = foodsResult.rows;

        const moneyResult = await pool.query('SELECT money FROM inventory WHERE user_id = $1', [1]); // Replace 1 with actual user ID if available
        const money = moneyResult.rows[0] ? moneyResult.rows[0].money : 0; // Fallback to 0 if no money found

        // Send data as JSON response
        res.json({ toys, toiletries, foods, money });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Buy route
app.post('/buy', async (req, res) => {
  const { userId, itemId, itemType, itemCount } = req.body;

  try {
      // Get item price based on item type
      const itemResult = await pool.query('SELECT price FROM ' + itemType + ' WHERE id = $1', [itemId]);
      const item = itemResult.rows[0];

      if (!item) {
          return res.status(404).json({ error: 'Item not found' });
      }

      const totalCost = item.price * itemCount;

      // Update the user's money in the inventory
      const moneyResult = await pool.query('SELECT money FROM inventory WHERE user_id = $1', [userId]);

      // Check if the moneyResult has any rows
      if (moneyResult.rows.length === 0) {
          return res.status(404).json({ error: 'User inventory not found' });
      }

      const currentMoney = moneyResult.rows[0].money;

      if (currentMoney < totalCost) {
          return res.status(400).json({ error: 'Not enough money' });
      }

      // Deduct money from the inventory
      await pool.query('UPDATE inventory SET money = money - $1 WHERE user_id = $2', [totalCost, userId]);

      // Check if the item already exists in the user-specific table
      const userItemResult = await pool.query(`
          SELECT * FROM user_${itemType} 
          WHERE user_id = $1 AND item_type_id = $2
      `, [userId, itemId]);

      if (userItemResult.rows.length > 0) {
          // If it exists, update the count
          await pool.query(`
              UPDATE user_${itemType} 
              SET count = count + $1 
              WHERE user_id = $2 AND item_type_id = $3
          `, [itemCount, userId, itemId]);
      } else {
          // If it doesn't exist, insert a new row
          await pool.query(`
              INSERT INTO user_${itemType} (count, user_id, inventory_id, item_type_id) 
              VALUES ($1, $2, (SELECT id FROM inventory WHERE user_id = $2), $3)
          `, [itemCount, userId, itemId]);
      }

      res.status(200).json({ message: 'Item purchased successfully' });
  } catch (err) {
      console.error('Error purchasing item:', err);
      res.status(500).json({ error: 'Server error' });
  }
});

// Temporary add money route
app.post('/add-money', async (req, res) => {
  const { userId, amount } = req.body;


  try {
      // Update the user's money in the inventory
      await pool.query('UPDATE inventory SET money = money + $1 WHERE user_id = $2', [amount, userId]);
      
      res.status(200).json({ message: `$${amount} added to your balance` });
  } catch (err) {
      console.error('Error adding money:', err);
      res.status(500).json({ error: 'Server error' });
  }
});

// Route to get all data from all tables
// Route to get all data from all tables
app.get('/all_tables', async (req, res) => {
    try {
      // Queries for all tables
      const speciesQuery = 'SELECT * FROM species';
      const usersQuery = 'SELECT * FROM users';
      const petsQuery = 'SELECT * FROM pets';
      const moodsQuery = 'SELECT * FROM moods';
      const spritesQuery = 'SELECT * FROM sprites';  // Added sprites query
      const colorsQuery = 'SELECT * FROM colors';
      const personalitiesQuery = 'SELECT * FROM personalities';  // Added personalities query
  
      const inventoryQuery = 'SELECT * FROM inventory';
      const userFoodQuery = 'SELECT * FROM user_foods';
      const userToiletriesQuery = 'SELECT * FROM user_toiletries';
      const userToysQuery = 'SELECT * FROM user_toys';
      const shopQuery = 'SELECT * FROM shop';
      const toysQuery = 'SELECT * FROM toys';
      const toiletriesQuery = 'SELECT * FROM toiletries';
      const foodsQuery = 'SELECT * FROM foods';
  
      // Execute all queries
      const species = await pool.query(speciesQuery);
      const users = await pool.query(usersQuery);
      const pets = await pool.query(petsQuery);
      const moods = await pool.query(moodsQuery);
      const sprites = await pool.query(spritesQuery);  // Fetch sprites data
      const colors = await pool.query(colorsQuery);
      const personalities = await pool.query(personalitiesQuery);  // Fetch personalities data
  
      const inventory = await pool.query(inventoryQuery);
      const userFood = await pool.query(userFoodQuery);
      const userToiletries = await pool.query(userToiletriesQuery);
      const userToys = await pool.query(userToysQuery);
      const shop = await pool.query(shopQuery);
      const toys = await pool.query(toysQuery);
      const toiletries = await pool.query(toiletriesQuery);
      const foods = await pool.query(foodsQuery);
  
      // Render the EJS template and pass all the data to the template
      res.render('all_tables', {
        species: species.rows,
        users: users.rows,
        pets: pets.rows,
        moods: moods.rows,
        sprites: sprites.rows,  // Pass sprites data to the view
        colors: colors.rows,
        personalities: personalities.rows,  // Pass personalities data to the view
        inventory: inventory.rows,
        userFood: userFood.rows,
        userToiletries: userToiletries.rows,
        userToys: userToys.rows,
        shop: shop.rows,
        toys: toys.rows,
        toiletries: toiletries.rows,
        foods: foods.rows
      });
    } catch (error) {
      console.error('Error executing query', error.stack);
      res.status(500).send('Internal Server Error');
    }
  });
  



 

  

// Convert score to money


