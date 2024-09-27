DROP TABLE IF EXISTS user_toys CASCADE;

-- Create user toys table
CREATE TABLE user_toys (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  count INTEGER DEFAULT 0,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  inventory_id INTEGER REFERENCES inventory(id) ON DELETE CASCADE,
  item_type_id INTEGER REFERENCES toys(id) ON DELETE CASCADE
);

DROP VIEW IF EXISTS user_toy_count;

-- Create a view to calculate toy counts dynamically
CREATE VIEW user_toy_count AS
SELECT 
    user_id, 
    inventory_id, 
    SUM(count) AS toy_count
FROM 
    user_toys
GROUP BY 
    user_id, inventory_id, item_type_id;

