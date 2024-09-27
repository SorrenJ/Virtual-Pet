INSERT INTO user_food (count, user_id, inventory_id, item_type_id) VALUES
(2, 1, 1, (SELECT id FROM foods WHERE name = 'Rotting Banana')),
(1, 1, 1, (SELECT id FROM foods WHERE name = 'Salad')),
(3, 1, 1, (SELECT id FROM foods WHERE name = 'Can of Beans'));
