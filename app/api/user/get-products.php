<?php
require "../config.php";

header('Content-Type: application/json');

$categoryId = intval($_GET['category_id'] ?? 0);

if ($categoryId <= 0) {
  http_response_code(400);
  echo json_encode(['error' => 'Category ID is required']);
  exit;
}

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
  ) AS image_count
FROM products p
WHERE p.category_id = ?
ORDER BY p.created_at DESC
";

$stmt = $db->prepare($sql);
$stmt->execute([$categoryId]);
$products = $stmt->fetchAll();

echo json_encode($products);