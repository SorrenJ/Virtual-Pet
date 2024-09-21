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
  user_id INTEGER NOT NULL,
  money NUMERIC,
  CONSTRAINT fk_user_inventory FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User food table
CREATE TABLE user_food (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  count INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  inventory_id INTEGER NOT NULL,
  item_type_id INTEGER NOT NULL,
  CONSTRAINT fk_user_food_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_food_inventory FOREIGN KEY (inventory_id) REFERENCES inventory(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_food_item_type FOREIGN KEY (item_type_id) REFERENCES foods(id) ON DELETE CASCADE
);

-- User toiletries table
CREATE TABLE user_tolietries (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  count INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  inventory_id INTEGER NOT NULL,
  item_type_id INTEGER NOT NULL,
  CONSTRAINT fk_user_tolietries_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_tolietries_inventory FOREIGN KEY (inventory_id) REFERENCES inventory(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_tolietries_item_type FOREIGN KEY (item_type_id) REFERENCES tolietries(id) ON DELETE CASCADE
);

-- User toys table
CREATE TABLE user_toys (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  count INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  inventory_id INTEGER NOT NULL,
  item_type_id INTEGER NOT NULL,
  CONSTRAINT fk_user_toys_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_toys_inventory FOREIGN KEY (inventory_id) REFERENCES inventory(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_toys_item_type FOREIGN KEY (item_type_id) REFERENCES toys(id) ON DELETE CASCADE
);

-- Shop table
CREATE TABLE shop (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Toys table
CREATE TABLE toys (
  id SERIAL PRIMARY KEY,
  shop_id INTEGER NOT NULL,
  name VARCHAR(255),
  price NUMERIC,
  effects VARCHAR(255),
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_toys_shop FOREIGN KEY (shop_id) REFERENCES shop(id) ON DELETE CASCADE
);

-- Toiletries table
CREATE TABLE tolietries (
  id SERIAL PRIMARY KEY,
  shop_id INTEGER NOT NULL,
  name VARCHAR(255),
  price NUMERIC,
  effects VARCHAR(255),
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tolietries_shop FOREIGN KEY (shop_id) REFERENCES shop(id) ON DELETE CASCADE
);

-- Foods table
CREATE TABLE foods (
  id SERIAL PRIMARY KEY,
  shop_id INTEGER NOT NULL,
  name VARCHAR(255),
  price NUMERIC,
  effects VARCHAR(255),
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_foods_shop FOREIGN KEY (shop_id) REFERENCES shop(id) ON DELETE CASCADE
);