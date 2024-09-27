INSERT INTO user_toiletries (count, user_id, inventory_id, item_type_id) VALUES
(4, 1, 1, (SELECT id FROM toiletries WHERE name = 'Soap')),
(2, 1, 1, (SELECT id FROM toiletries WHERE name = 'Hairbrush')),
(1, 1, 1, (SELECT id FROM toiletries WHERE name = 'Toilet Paper'));