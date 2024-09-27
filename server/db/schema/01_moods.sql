DROP TABLE IF EXISTS moods CASCADE;

-- Create moods table
CREATE TABLE moods (
  id SERIAL PRIMARY KEY,
  mood_name VARCHAR(255)
);