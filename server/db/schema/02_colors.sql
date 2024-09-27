DROP TABLE IF EXISTS colors CASCADE;

-- Create colors table
CREATE TABLE colors (
  id SERIAL PRIMARY KEY,
  color_name VARCHAR(255) NOT NULL
);