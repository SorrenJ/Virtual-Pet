DROP TABLE IF EXISTS SPECIES CASCADE;

CREATE TABLE pets (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users (id) ON DELETE CASCADE,
  species_id INT REFERENCES species(id) ON DELETE CASCADE,
  name varchar (255),
  age INT, 
  created_at timestamp,
  image varchar (255),
  emotion varchar (255),
  personality varchar (255),
  energy INT,
  happiness INT,
  hunger INT,
  cleanliness INT
  
)
