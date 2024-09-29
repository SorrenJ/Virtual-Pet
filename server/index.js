const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config();
const pool = require('./db/db'); // Import the pool from db/db.js

// Middleware
app.use(cors());

app.use(express.json()); // Add this line to parse JSON bodies

// Serve static files from the "db" directory
app.use('/db', express.static('db'));



// Set up EJS as the templating engine
app.set('view engine', 'ejs');

app.listen(5000, () => {
    console.log("Server started on port 5000");
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
      const userFoodQuery = 'SELECT * FROM user_food';
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
  


app.get('/home', async (req, res) => {
    const userId = 1; // Hardcoded user ID for now
    const selectedPetId = req.query.selectedPetId;
  
    try {
      // Query to get pets with their sprite and species details
      const petQuery = `
        SELECT p.id, p.name AS pet_name, s.species_name, s.hunger_mod, s.happy_mod, 
               p.hunger, p.cleanliness, p.happiness, u.name AS user_name, u.email, sp.image_url AS pet_image
        FROM pets p
        JOIN species s ON p.species_id = s.id
        JOIN users u ON p.user_id = u.id
        JOIN sprites sp ON p.sprite_id = sp.id  -- Fetch image_url from sprites
        WHERE p.user_id = $1
        ORDER BY p.name;
      `;
      
      const pets = await pool.query(petQuery, [userId]);
  
      // If no pets are found, handle that case
      if (pets.rows.length === 0) {
        return res.render('home', { pets: [], selectedPet: null });
      }
  
      // Find the selected pet or default to the first pet
      const selectedPet = selectedPetId
        ? pets.rows.find(pet => pet.id === parseInt(selectedPetId)) || pets.rows[0]
        : pets.rows[0];
  
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
        SELECT uf.count, uf.user_id, uf.inventory_id, 
               f.id AS item_type_id, f.name AS food_name, f.food_image AS "foodImage"
        FROM user_food uf
        JOIN foods f ON uf.item_type_id = f.id
        WHERE uf.user_id = $1
      `, [userId]);
      
      console.log(userFood.rows); // LOG this to check if foodImage is fetched
  
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
  
      // Render the EJS template for the home page
      res.render('home', {
        pets: pets.rows, // List of pets
        selectedPet: selectedPet, // The currently selected pet
        inventory: inventory.rows, // Inventory data
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
  
app.get('/switch-pet', async (req, res) => {
    const userId = 1; // Adjust this as necessary

    try {
        // Query to get a random pet or the next one (you can modify as needed)
        const petQuery = `
            SELECT p.name AS pet_name, p.image AS pet_image, 
                   s.species_name, s.hunger_mod, s.happy_mod,
                   p.hunger,
            FROM pets p
            JOIN species s ON p.species_id = s.id
            WHERE p.user_id = $1
            ORDER BY RANDOM() 
            LIMIT 1
        `;
        const pets = await pool.query(petQuery, [userId]);

        if (pets.rows.length === 0) {
            return res.status(404).send({ message: 'No pets available' });
        }

        res.json(pets.rows[0]);
    } catch (error) {
        console.error('Error executing query', error.stack);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/feed-pet', async (req, res) => {
    const { petId, foodId } = req.body; // Get petId and foodId from the request body
    const userId = 1; // Use the actual userId from your session or request

    try {
        // First, update the pet's hunger to a default value (e.g., 100) if it is NULL
        const hungerFixQuery = `
            UPDATE pets
            SET hunger = 100
            WHERE id = $1 AND hunger IS NULL;
        `;
        await pool.query(hungerFixQuery, [petId]);

        // Get the food's effect value and count
        const foodQuery = `
           SELECT f.effects AS effect, uf.count 
           FROM foods f
           JOIN user_food uf ON f.id = uf.item_type_id
           WHERE uf.user_id = $1 AND uf.item_type_id = $2;
        `;
        const foodResult = await pool.query(foodQuery, [userId, foodId]);
        
        if (foodResult.rows.length === 0) {
            return res.status(400).json({ error: 'Food not found or not enough count' });
        }

        const { effect, count } = foodResult.rows[0];

        if (count <= 0) {
            return res.status(400).json({ error: 'No food left to feed' });
        }

        // Update the pet's hunger by adding the food's effect
        const updateHungerQuery = `
            UPDATE pets
            SET hunger = hunger + $1
            WHERE id = $2;
        `;
        await pool.query(updateHungerQuery, [effect, petId]);

        // Decrease the food count
        const decreaseFoodCountQuery = `
            UPDATE user_food
            SET count = count - 1
            WHERE user_id = $1 AND item_type_id = $2;
        `;
        await pool.query(decreaseFoodCountQuery, [userId, foodId]);

        res.json({ success: true });
    } catch (error) {
        console.error('Error feeding pet:', error.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/clean-pet', async (req, res) => {
    const { petId, toiletriesId } = req.body; // Get petId and toiletriesId from the request body
    const userId = 1; // Use the actual userId from your session or request

    try {
        // First, update any pets with NULL cleanliness to 100 (cleanliness fix)
        const cleanlinessFixQuery = `
            UPDATE pets
            SET cleanliness = 100
            WHERE id = $1 AND cleanliness IS NULL;
        `;
        await pool.query(cleanlinessFixQuery, [petId]);

        // Get the toiletries' effect value and count
        const toiletriesQuery = `
           SELECT effects AS effect, ut.count 
           FROM toiletries t
           JOIN user_toiletries ut ON t.id = ut.item_type_id
           WHERE ut.user_id = $1 AND ut.item_type_id = $2
        `;
        const toiletriesResult = await pool.query(toiletriesQuery, [userId, toiletriesId]);

        if (toiletriesResult.rows.length === 0) {
            return res.status(400).json({ error: 'Toiletry not found or not enough count' });
        }

        const { effect, count } = toiletriesResult.rows[0];

        if (count <= 0) {
            return res.status(400).json({ error: 'No toiletry left to use' });
        }

        // Update the pet's cleanliness using the toiletries' effect
        const updateCleanlinessQuery = `
            UPDATE pets
            SET cleanliness = COALESCE(cleanliness, 0) + $1
            WHERE id = $2;
        `;
        await pool.query(updateCleanlinessQuery, [effect, petId]);

        // Decrease the toiletries count
        const decreaseToiletryCountQuery = `
            UPDATE user_toiletries
            SET count = count - 1
            WHERE user_id = $1 AND item_type_id = $2;
        `;
        await pool.query(decreaseToiletryCountQuery, [userId, toiletriesId]);

        res.json({ success: true });
    } catch (error) {
        console.error('Error cleaning pet:', error.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/play-with-pet', async (req, res) => {
    const { petId, toyId } = req.body; // Get petId and toyId from the request body
    const userId = 1; // Use the actual userId from your session or request

    try {
        // First, update the pet's happiness to a default value (e.g., 100) if it is NULL
        const happinessFixQuery = `
            UPDATE pets
            SET happiness = 100
            WHERE id = $1 AND happiness IS NULL;
        `;
        await pool.query(happinessFixQuery, [petId]);

        // Get the toy's effect value and count
        const toyQuery = `
           SELECT t.effects AS effect, ut.count 
           FROM toys t
           JOIN user_toys ut ON t.id = ut.item_type_id
           WHERE ut.user_id = $1 AND ut.item_type_id = $2;
        `;
        const toyResult = await pool.query(toyQuery, [userId, toyId]);
        
        if (toyResult.rows.length === 0) {
            return res.status(400).json({ error: 'Toy not found or not enough count' });
        }

        const { effect, count } = toyResult.rows[0];

        if (count <= 0) {
            return res.status(400).json({ error: 'No toys left to play with' });
        }

        // Update the pet's happiness by adding the toy's effect
        const updateHappinessQuery = `
            UPDATE pets
            SET happiness = happiness + $1
            WHERE id = $2;
        `;
        await pool.query(updateHappinessQuery, [effect, petId]);

        // Decrease the toy count
        const decreaseToyCountQuery = `
            UPDATE user_toys
            SET count = count - 1
            WHERE user_id = $1 AND item_type_id = $2;
        `;
        await pool.query(decreaseToyCountQuery, [userId, toyId]);

        res.json({ success: true });
    } catch (error) {
        console.error('Error playing with pet:', error.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
