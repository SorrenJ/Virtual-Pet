DROP TABLE IF EXISTS user_toiletries CASCADE;

CREATE TABLE user_toiletries (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  count INTEGER DEFAULT 0,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  inventory_id INTEGER REFERENCES inventory(id) ON DELETE CASCADE,
  item_type_id INTEGER REFERENCES toiletries(id) ON DELETE CASCADE
);

DROP VIEW IF EXISTS user_toiletries_count;
-- Create a view to calculate toiletry counts dynamically
CREATE VIEW user_toiletries_count AS
SELECT 
    user_id, 
    inventory_id, 
    SUM(count) AS toiletry_count
FROM 
    user_toiletries
GROUP BY 
    user_id, inventory_id, item_type_id;