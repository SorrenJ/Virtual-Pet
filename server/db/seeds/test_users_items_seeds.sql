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
