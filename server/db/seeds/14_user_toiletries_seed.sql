INSERT INTO user_toiletries (count, user_id, inventory_id, item_type_id) VALUES
(99, 1, 1, (SELECT id FROM toiletries WHERE name = 'Soap')),
(99, 1, 1, (SELECT id FROM toiletries WHERE name = 'Hairbrush')),
(99, 1, 1, (SELECT id FROM toiletries WHERE name = 'Toilet Paper'));