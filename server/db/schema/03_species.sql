DROP TABLE IF EXISTS species CASCADE;

-- Create species table
CREATE TABLE species (
    id SERIAL PRIMARY KEY,
    species_name VARCHAR(255) NOT NULL,
    hunger_mod INT,
    happy_mod INT,
    energy_mod INT,
    clean_mod INT,
    lifespan INT,
    diet_type INT,
    diet_desc TEXT,
    image VARCHAR(255)
);
