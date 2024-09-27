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
INSERT INTO species (species_name, hunger_mod, happy_mod, energy_mod, clean_mod, lifespan, diet_type, diet_desc) 
VALUES
('Hippostyx', 1, 5, 4, 2, 300, 3, 'Omnivore'),
('Skeletal turtle', 3, 3, 3, 2, 500, 2, 'Herbivore'),
('Bunny ball', 5, 3, 3, 4, 200, 1, 'Carnivore'),
('Fluffy angler', 2, 3, 4, 3, 200, 2, 'Herbivore'),
('Cog hybrid', 3, 5, 4, 1, 200, 3, 'Omnivore'),
('Creep Vulture', 4, 2, 5, 1, 400, 1, 'Carnivore'),
('Slugaboo', 3, 3, 3, 3, 300, 3, 'Omnivore');

-- Finally, insert pets
INSERT INTO pets (user_id, species_id, name, age, created_at, image, emotion, personality, energy, happiness, hunger, cleanliness) 
VALUES
(1, 7, 'Glurb', 5, CURRENT_TIMESTAMP, 'monster_assets/slugaboo/blue_default.png', 'default', 'hardy', 100, 100, 100, 100);


INSERT INTO shop (created_at) 
VALUES (CURRENT_TIMESTAMP);


INSERT INTO foods (name, price, effects, food_type, description, shop_id, food_image) VALUES
('Rotting Banana', 5, 5, 2, '"hello"', 1, 'https://res.cloudinary.com/deszclhtq/image/upload/v1727460483/rotten_banana.jpg'),
('Salad', 15, 10, 2, '"hello"', 1, NULL),
('Can of Beans', 15, 15, 2, '"hello"', 1, NULL),
('Chicken Leg', 15, 15, 3, '"hello"', 1, NULL),
('Sushi', 30, 20, 3, '"hello" ', 1, NULL),
('Apple Pie', 30, 20, 2, '"hello"', 1, NULL),
('Hamburger', 35, 25, 3, '"hello" ', 1, NULL);

INSERT INTO toiletries (name, price, effects, description, shop_id, toiletry_image) VALUES
('Soap', 25, 5, '"hello"', 1, 'https://res.cloudinary.com/deszclhtq/image/upload/v1727460482/soap.jpg'),
('Hairbrush', 50, 35, '"hello"', 1, NULL),
('Toilet Paper', 25, 5, '"hello"', 1, NULL),
('Toothbrush', 40, 30, '"hello"', 1, NULL);

INSERT INTO toys (name, price, effects, description, shop_id, toy_image) VALUES
('Doll', 100, 50, '"hello"', 1, 'https://res.cloudinary.com/deszclhtq/image/upload/v1727460484/doll.jpg' ),
('Ball', 50, 25, '"hello"', 1, NULL),
('iPad', 1000, 100, '"hello"', 1, NULL),
('Paint  set', 150, 60, '"hello"', 1, NULL),
('Yoyo', 60, 30, '"hello"', 1, NULL),
('Rubber Ducky', 40, 20, '"hello" ', 1, NULL);



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



