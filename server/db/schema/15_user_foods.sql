DROP TABLE IF EXISTS user_food CASCADE;

CREATE TABLE user_food (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  count INTEGER DEFAULT 0,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  inventory_id INTEGER REFERENCES inventory(id) ON DELETE CASCADE,
  item_type_id INTEGER REFERENCES foods(id) ON DELETE CASCADE
);

DROP VIEW IF EXISTS user_food_count;

-- Create a view to calculate food counts dynamically
CREATE VIEW user_food_count AS
SELECT 
    user_id, 
    inventory_id, 
    SUM(count) AS food_count
FROM 
    user_food
GROUP BY 

    user_id, inventory_id, item_type_id;
