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
DROP TABLE IF EXISTS images CASCADE;
DROP TABLE IF EXISTS colors CASCADE;

-- Create images table (referenced by species table)
CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  image_url VARCHAR(255) NOT NULL
);
COMMIT;

-- Create colors table (referenced by species table)
CREATE TABLE colors (
  id SERIAL PRIMARY KEY,
  color_name VARCHAR(255) NOT NULL
);
COMMIT;

-- Create species table (depends on images and colors)
CREATE TABLE species (
    id SERIAL PRIMARY KEY,
    species_name VARCHAR(255) NOT NULL,
    hunger_mod INT,
    happy_mod INT,
    energy_mod INT,
    clean_mod INT,
    lifespan INT,
    diet_type INT,
    diet_desc VARCHAR(255),
    image_id INT,
    color_id INT,
    FOREIGN KEY (image_id) REFERENCES images(id),
    FOREIGN KEY (color_id) REFERENCES colors(id)
);
COMMIT;

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  money INT,
  created_at TIMESTAMP
);
COMMIT;

-- Create pets table (depends on users and species)
CREATE TABLE pets (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  species_id INT REFERENCES species(id) ON DELETE CASCADE,
  name VARCHAR(255),
  age INT, 
  created_at TIMESTAMP,
  image VARCHAR(255),
  emotion VARCHAR(255),
  personality VARCHAR(255),
  energy INT,
  happiness INT,
  hunger INT,
  cleanliness INT
);
COMMIT;

-- Shop table
CREATE TABLE shop (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
COMMIT;

-- Toys table
CREATE TABLE toys (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  name VARCHAR(255),
  price NUMERIC,
  effects VARCHAR(255),
  description VARCHAR(255),
  shop_id INTEGER REFERENCES shop(id) ON DELETE CASCADE
);
COMMIT;

-- Toiletries table
CREATE TABLE toiletries (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  name VARCHAR(255),
  price NUMERIC,
  effects VARCHAR(255),
  description VARCHAR(255), 
  shop_id INTEGER REFERENCES shop(id) ON DELETE CASCADE
);
COMMIT;

-- Foods table
CREATE TABLE foods (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  name VARCHAR(255),
  price NUMERIC,
  effects VARCHAR(255),
  description VARCHAR(255),  
  shop_id INTEGER REFERENCES shop(id) ON DELETE CASCADE
);
COMMIT;

-- Inventory table
CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  money NUMERIC,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);
COMMIT;

-- Create user food table
CREATE TABLE user_food (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  count INTEGER DEFAULT 0,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  inventory_id INTEGER REFERENCES inventory(id) ON DELETE CASCADE,
  item_type_id INTEGER REFERENCES foods(id) ON DELETE CASCADE
);
COMMIT;

-- Create user toiletries table
CREATE TABLE user_toiletries (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  count INTEGER DEFAULT 0,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  inventory_id INTEGER REFERENCES inventory(id) ON DELETE CASCADE,
  item_type_id INTEGER REFERENCES toiletries(id) ON DELETE CASCADE
);
COMMIT;

-- Create user toys table
CREATE TABLE user_toys (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  count INTEGER DEFAULT 0,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  inventory_id INTEGER REFERENCES inventory(id) ON DELETE CASCADE,
  item_type_id INTEGER REFERENCES toys(id) ON DELETE CASCADE
);
COMMIT;

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
COMMIT;

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
COMMIT;

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
COMMIT;
