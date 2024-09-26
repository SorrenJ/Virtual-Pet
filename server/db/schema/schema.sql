DROP TABLE IF EXISTS species CASCADE;
DROP TABLE IF EXISTS pets CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS user_food CASCADE;
DROP TABLE IF EXISTS user_toiletries CASCADE;
DROP TABLE IF EXISTS user_toys CASCADE;
DROP TABLE IF EXISTS shop CASCADE;
DROP TABLE IF EXISTS toys CASCADE;
DROP TABLE IF EXISTS toiletries CASCADE;
DROP TABLE IF EXISTS foods CASCADE;
DROP TABLE IF EXISTS moods CASCADE;
DROP TABLE IF EXISTS colors CASCADE;
DROP TABLE IF EXISTS sprites CASCADE;
DROP TABLE IF EXISTS personalities CASCADE;

-- Create moods table
CREATE TABLE moods (
  id SERIAL PRIMARY KEY,
  mood_name VARCHAR(255)
);

-- Create colors table
CREATE TABLE colors (
  id SERIAL PRIMARY KEY,
  color_name VARCHAR(255) NOT NULL
);

-- Create species table
CREATE TABLE species (
    id SERIAL PRIMARY KEY,
    species_name VARCHAR(255) NOT NULL,
    hunger_mod INT,
    happy_mod INT,
    energy_mod INT,
    clean_mod INT,
    lifespan INT,
    diet_type INT,
    diet_desc VARCHAR(255)
);

-- Create sprites table
CREATE TABLE sprites (
  id SERIAL PRIMARY KEY,
  color_id INT REFERENCES colors(id) ON DELETE CASCADE,
  species_id INT REFERENCES species(id) ON DELETE CASCADE,
  mood_id INT REFERENCES moods(id) ON DELETE CASCADE,
  image_url VARCHAR(255)
  );

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP
);

-- Create personalities table
CREATE TABLE personalities (
  id SERIAL PRIMARY KEY,
  personality_name VARCHAR(255) UNIQUE,
  energy_decay NUMERIC(5, 2), 
  happiness_decay NUMERIC(5, 2),
  hunger_decay NUMERIC(5, 2),
  cleanliness_decay NUMERIC(5, 2)
);

-- Create pets table
CREATE TABLE pets (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  species_id INT REFERENCES species(id) ON DELETE CASCADE,
  name VARCHAR(255),
  age INT, 
  adopted_at TIMESTAMP,
  image VARCHAR(255),
  mood_id INT REFERENCES moods(id) ON DELETE CASCADE,
  color_id INT REFERENCES colors(id) ON DELETE CASCADE,
  personality_id INT REFERENCES personalities(id) ON DELETE CASCADE,
  update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
  energy INT,
  happiness INT,
  hunger INT,
  cleanliness INT
);

-- Create shop table
CREATE TABLE shop (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create toys table
CREATE TABLE toys (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  name VARCHAR(255),
  price NUMERIC,
  effects VARCHAR(255),
  description VARCHAR(255),
  shop_id INTEGER REFERENCES shop(id) ON DELETE CASCADE
);

-- Create toiletries table
CREATE TABLE toiletries (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  name VARCHAR(255),
  price NUMERIC,
  effects VARCHAR(255),
  description VARCHAR(255), 
  shop_id INTEGER REFERENCES shop(id) ON DELETE CASCADE
);

-- Create foods table
CREATE TABLE foods (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  name VARCHAR(255),
  price NUMERIC,
  effects VARCHAR(255),
  description VARCHAR(255),  
  shop_id INTEGER REFERENCES shop(id) ON DELETE CASCADE
);

-- Create inventory table
CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  money NUMERIC,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

-- Create user food table
CREATE TABLE user_food (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  count INTEGER DEFAULT 0,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  inventory_id INTEGER REFERENCES inventory(id) ON DELETE CASCADE,
  item_type_id INTEGER REFERENCES foods(id) ON DELETE CASCADE
);

-- Create user toiletries table
CREATE TABLE user_toiletries (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  count INTEGER DEFAULT 0,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  inventory_id INTEGER REFERENCES inventory(id) ON DELETE CASCADE,
  item_type_id INTEGER REFERENCES toiletries(id) ON DELETE CASCADE
);

-- Create user toys table
CREATE TABLE user_toys (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  count INTEGER DEFAULT 0,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  inventory_id INTEGER REFERENCES inventory(id) ON DELETE CASCADE,
  item_type_id INTEGER REFERENCES toys(id) ON DELETE CASCADE
);

-- Create a view to calculate toy counts dynamically
CREATE VIEW user_toy_count AS
SELECT 
    user_id, 
    inventory_id, 
    item_type_id, 
    COUNT(*) AS toy_count
FROM 
    user_toys
GROUP BY 
    user_id, inventory_id, item_type_id;

-- Create a view to calculate toiletry counts dynamically
CREATE VIEW user_toiletries_count AS
SELECT 
    user_id, 
    inventory_id, 
    item_type_id, 
    COUNT(*) AS toiletry_count
FROM 
    user_toiletries
GROUP BY 
    user_id, inventory_id, item_type_id;

-- Create a view to calculate food counts dynamically
CREATE VIEW user_food_count AS
SELECT 
    user_id, 
    inventory_id, 
    item_type_id, 
    COUNT(*) AS food_count
FROM 
    user_food
GROUP BY 
    user_id, inventory_id, item_type_id;
