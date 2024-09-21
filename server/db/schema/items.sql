DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS user_food CASCADE;
DROP TABLE IF EXISTS user_tolietries CASCADE;
DROP TABLE IF EXISTS user_toys CASCADE;
DROP TABLE IF EXISTS shop CASCADE;
DROP TABLE IF EXISTS toys CASCADE;
DROP TABLE IF EXISTS tolietries CASCADE;
DROP TABLE IF EXISTS foods CASCADE;

-- Inventory table
CREATE TABLE inventory (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  money NUMERIC,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
);

-- User food table
CREATE TABLE user_food (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  count INTEGER DEFAULT 0,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  inventory_id INTEGER REFERENCES inventory(id) ON DELETE CASCADE,
  item_type_id INTEGER REFERENCES foods(id) ON DELETE CASCADE
);

-- User toiletries table
CREATE TABLE user_tolietries (
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
CREATE VIEW user_tolietries_count AS
SELECT 
    user_id, 
    inventory_id, 
    item_type_id, 
    COUNT(*) AS toiletry_count
FROM 
    user_tolietries
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
  
);

-- Toiletries table
CREATE TABLE tolietries (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  name VARCHAR(255),
  price NUMERIC,
  effects VARCHAR(255),
  description VARCHAR(255), 
  shop_id INTEGER REFERENCES shop(id) ON DELETE CASCADE,
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
);