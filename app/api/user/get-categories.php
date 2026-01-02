<?php
require "../config.php";

header('Content-Type: application/json');

$sql = "
SELECT 
  c.id,
  c.name,
  c.slug,
  c.created_at,
  COUNT(p.id) AS product_count
FROM categories c
LEFT JOIN products p ON p.category_id = c.id
GROUP BY c.id
ORDER BY c.created_at DESC
";

$categories = $db->query($sql)->fetchAll();

echo json_encode($categories);