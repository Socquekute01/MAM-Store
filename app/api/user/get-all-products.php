<?php
require "../config.php";

header('Content-Type: application/json');

$sql = "
SELECT 
  p.id,
  p.name,
  p.description,
  p.created_at,
  (
    SELECT pi.image_url 
    FROM product_images pi 
    WHERE pi.product_id = p.id AND pi.is_thumbnail = 1
    LIMIT 1
  ) AS thumbnail,
  (
    SELECT COUNT(*) 
    FROM product_images pi 
    WHERE pi.product_id = p.id
  ) AS image_count,
  (
    SELECT cat.name 
    FROM categories cat 
    WHERE cat.id = p.category_id
  ) AS category_name
FROM products p
ORDER BY p.created_at DESC
";

$products = $db->query($sql)->fetchAll();

echo json_encode($products);