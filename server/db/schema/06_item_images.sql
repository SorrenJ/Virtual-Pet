DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS user_foods CASCADE;
DROP TABLE IF EXISTS user_toiletries CASCADE;
DROP TABLE IF EXISTS user_toys CASCADE;
DROP TABLE IF EXISTS shop CASCADE;
DROP TABLE IF EXISTS toys CASCADE;
DROP TABLE IF EXISTS toiletries CASCADE;
DROP TABLE IF EXISTS foods CASCADE;
DROP TABLE IF EXISTS users CASCADE;


-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP
);

-- Shop table
CREATE TABLE shop (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Toys table
CREATE TABLE toys (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  name VARCHAR(255),
  price NUMERIC,
  effects VARCHAR(255),
  description VARCHAR(255),
  shop_id INTEGER REFERENCES shop(id) ON DELETE CASCADE,
  toy_image VARCHAR(255)
  
);

-- Toiletries table
CREATE TABLE toiletries (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  name VARCHAR(255),
  price NUMERIC,
  effects VARCHAR(255),
  description VARCHAR(255), 
  shop_id INTEGER REFERENCES shop(id) ON DELETE CASCADE,
  toiletry_image VARCHAR(255)
);

-- Foods table
CREATE TABLE foods (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  name VARCHAR(255),
  price NUMERIC,
  effects VARCHAR(255),
  description VARCHAR(255),  
  shop_id INTEGER REFERENCES shop(id) ON DELETE CASCADE,
  food_image VARCHAR(255)
);

-- Inventory table
CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  money NUMERIC,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

-- User food table
CREATE TABLE user_foods (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  count INTEGER DEFAULT 0,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  inventory_id INTEGER REFERENCES inventory(id) ON DELETE CASCADE,
  item_type_id INTEGER REFERENCES foods(id) ON DELETE CASCADE
);

-- User toiletries table
CREATE TABLE user_toiletries (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  count INTEGER DEFAULT 0,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  inventory_id INTEGER REFERENCES inventory(id) ON DELETE CASCADE,
  item_type_id INTEGER REFERENCES tolietries(id) ON DELETE CASCADE
);

-- User toys table
CREATE TABLE user_toys (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  count INTEGER DEFAULT 0,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  inventory_id INTEGER REFERENCES inventory(id) ON DELETE CASCADE,
  item_type_id INTEGER REFERENCES toys(id) ON DELETE CASCADE
);

-- Drop existing views if they exist
DROP VIEW IF EXISTS user_food_count;
DROP VIEW IF EXISTS user_toiletries_count;
DROP VIEW IF EXISTS user_toy_count;

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

