INSERT INTO users (name, email, password, created_at) 
VALUES 
('Mr. Poopybutthole', 'Poopybuttholee@example.com', 'password123', CURRENT_TIMESTAMP),
('Sorren Jao', 'Poopybuttholee@example.com', 'password123', CURRENT_TIMESTAMP),
('Krisan Manoharan', 'Poopybuttholee@example.com', 'password123', CURRENT_TIMESTAMP);

-- Insert images first
INSERT INTO images (image_url) 
VALUES 
('image_0_url'),
('image_1_url'),
('image_2_url'),
('image_3_url'),
('image_4_url'),
('image_5_url'),
('https://res.cloudinary.com/deszclhtq/image/upload/v1727112791/Yellow_Default_hrgmsk.png');

-- Then insert species
INSERT INTO species (species_name, hunger_mod, happy_mod, energy_mod, clean_mod, lifespan, diet_type, diet_desc, image_id, color_id) 
VALUES
('Fire hippo', 1, 5, 4, 2, 300, 3, 'Omnivore', 1, NULL),
('Skeletal turtle', 3, 3, 3, 2, 500, 2, 'Herbivore', 2, NULL),
('Bunny ball', 5, 3, 3, 4, 200, 1, 'Carnivore', 3, NULL),
('Fluffy angler', 2, 3, 4, 3, 200, 2, 'Herbivore', 4, NULL),
('Cog hybrid', 3, 5, 4, 1, 200, 3, 'Omnivore', 5, NULL),
('Creep Vulture', 4, 2, 5, 1, 400, 1, 'Carnivore', 6, NULL),
('Slugaboo', 3, 3, 3, 3, 300, 3, 'Omnivore', 7, NULL);

-- Finally, insert pets
INSERT INTO pets (user_id, species_id, name, age, created_at, image, emotion, personality, energy, happiness, hunger, cleanliness) 
VALUES
(1, 7, 'Glurb', 5, CURRENT_TIMESTAMP, 'monster_assets/slugaboo/blue_default.png', 'default', 'hardy', 100, 100, 100, 100);


INSERT INTO shop (created_at) 
VALUES (CURRENT_TIMESTAMP);


INSERT INTO foods (name, price, effects, description, shop_id) VALUES
('Rotting Banana', 5, NULL, '"hello"', 1),
('Salad', 15, NULL, '"hello"', 1),
('Can of Beans', 25, NULL, '"hello"', 1),
('Chicken Leg', 15, NULL, '"hello"', 1),
('Sushi', 30, NULL, '"hello" ', 1),
('Apple Pie', 30, NULL, '"hello"', 1),
('Hamburger', 30, NULL, '"hello" ', 1);

INSERT INTO toiletries (name, price, effects, description, shop_id) VALUES
('Soap', 25, NULL, '"hello"', 1),
('Hairbrush', 50, NULL, '"hello"', 1),
('Toilet Paper', 25, NULL, '"hello"', 1),
('Toothbrush', 40, NULL, '"hello"', 1);

INSERT INTO toys (name, price, effects, description, shop_id) VALUES
('Doll', 100, NULL, '"hello"', 1),
('Ball', 50, NULL, '"hello"', 1),
('iPad', 1000, NULL, '"hello"', 1),
('Paint  set', 150, NULL, '"hello"', 1),
('Yoyo', 60, NULL, '"hello"', 1),
('Rubber Ducky', 40, NULL, '"hello" ', 1);



INSERT INTO inventory (user_id, money) VALUES
(1, 300.0);

INSERT INTO user_food (count, user_id, inventory_id, item_type_id) VALUES
(2, 1, 1, (SELECT id FROM foods WHERE name = 'Rotting Banana')),
(1, 1, 1, (SELECT id FROM foods WHERE name = 'Salad')),
(3, 1, 1, (SELECT id FROM foods WHERE name = 'Can of Beans'));

INSERT INTO user_toiletries (count, user_id, inventory_id, item_type_id) VALUES
(4, 1, 1, (SELECT id FROM toiletries WHERE name = 'Soap')),
(2, 1, 1, (SELECT id FROM toiletries WHERE name = 'Hairbrush')),
(1, 1, 1, (SELECT id FROM toiletries WHERE name = 'Toilet Paper'));

INSERT INTO user_toys (count, user_id, inventory_id, item_type_id) VALUES
(1, 1, 1, (SELECT id FROM toys WHERE name = 'Doll')),
(2, 1, 1, (SELECT id FROM toys WHERE name = 'Ball')),
(3, 1, 1, (SELECT id FROM toys WHERE name = 'Yoyo'));



