DROP TABLE IF EXISTS toys CASCADE;

-- Create toys table
CREATE TABLE toys (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  name VARCHAR(255),
  price NUMERIC,
  effects INT,
  description VARCHAR(255),
  shop_id INTEGER REFERENCES shop(id) ON DELETE CASCADE,
  toy_image VARCHAR(255)
);
