INSERT INTO user_foods (count, user_id, inventory_id, item_type_id) VALUES
(99, 1, 1, (SELECT id FROM foods WHERE name = 'Rotting Banana')),
(99, 1, 1, (SELECT id FROM foods WHERE name = 'Salad')),
(99, 1, 1, (SELECT id FROM foods WHERE name = 'Can of Beans'));
