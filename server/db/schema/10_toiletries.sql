DROP TABLE IF EXISTS toiletries CASCADE;

-- Create toiletries table
CREATE TABLE toiletries (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  name VARCHAR(255),
  price NUMERIC,
  effects INT,
  description VARCHAR(255), 
  shop_id INTEGER REFERENCES shop(id) ON DELETE CASCADE,
  toiletry_image VARCHAR(255)
);