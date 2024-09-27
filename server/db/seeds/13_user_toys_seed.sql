INSERT INTO user_toys (count, user_id, inventory_id, item_type_id) VALUES
(1, 1, 1, (SELECT id FROM toys WHERE name = 'Doll')),
(2, 1, 1, (SELECT id FROM toys WHERE name = 'Ball')),
(3, 1, 1, (SELECT id FROM toys WHERE name = 'Yoyo'));