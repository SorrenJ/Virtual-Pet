DROP TABLE IF EXISTS pets CASCADE;

-- Create pets table
CREATE TABLE pets (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  species_id INT REFERENCES species(id) ON DELETE CASCADE,
  name VARCHAR(255),
  age INT, 
  adopted_at TIMESTAMP,
  sprite_id INT REFERENCES sprites(id) ON DELETE CASCADE,
  mood_id INT REFERENCES moods(id) ON DELETE CASCADE,
  color_id INT REFERENCES colors(id) ON DELETE CASCADE,
  personality_id INT REFERENCES personalities(id) ON DELETE CASCADE,
  update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
  energy INT,
  happiness INT,
  hunger INT,
  cleanliness INT
);