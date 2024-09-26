CREATE TABLE personalities (
  id SERIAL PRIMARY KEY,
  personality_name VARCHAR(255) UNIQUE,
  energy_decay , 
  hunger_decay DECIMAL,
  happiness_decay DECIMAL,
  cleanliness_decay DECIMAL,
);
COMMIT;