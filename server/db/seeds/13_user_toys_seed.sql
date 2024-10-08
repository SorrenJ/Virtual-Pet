INSERT INTO user_toys (count, user_id, inventory_id, item_type_id) VALUES
(99, 1, 1, (SELECT id FROM toys WHERE name = 'Doll')),
(99, 1, 1, (SELECT id FROM toys WHERE name = 'Ball')),
(1, 1, 1, (SELECT id FROM toys WHERE name = 'Yoyo'));