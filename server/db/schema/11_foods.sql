DROP TABLE IF EXISTS foods CASCADE;

-- Create foods table
CREATE TABLE foods (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  name VARCHAR(255),
  price NUMERIC,
  effects INT,
  food_type INT,
  description VARCHAR(255),  
  shop_id INTEGER REFERENCES shop(id) ON DELETE CASCADE,
  food_image VARCHAR(255)
);