DROP TABLE IF EXISTS personalities CASCADE;

-- Create personalities table
CREATE TABLE personalities (
  id SERIAL PRIMARY KEY,
  personality_name VARCHAR(255) UNIQUE,
  energy_decay NUMERIC(5, 2), 
  happiness_decay NUMERIC(5, 2),
  hunger_decay NUMERIC(5, 2),
  cleanliness_decay NUMERIC(5, 2)
);