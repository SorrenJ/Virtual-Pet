DROP TABLE IF EXISTS species;

CREATE TABLE species (
    id SERIAL PRIMARY KEY,
    species_name VARCHAR(255) NOT NULL,
    hunger_mod INT,
    happy_mod INT,
    energy_mod INT,
    clean_mod INT,
    lifespan INT,
    diet_type INT,
    diet_desc VARCHAR(255),
    monster_id INT,
    image_id INT,
    color_id INT,
    FOREIGN KEY (monster_id) REFERENCES monsters(id),
    FOREIGN KEY (image_id) REFERENCES images(id),
    FOREIGN KEY (color_id) REFERENCES colors(id)
);