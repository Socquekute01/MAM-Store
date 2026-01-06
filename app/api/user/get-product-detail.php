<?php
require "../config.php";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

$productId = isset($_GET['product_id']) ? intval($_GET['product_id']) : 0;

if ($productId <= 0) {
  http_response_code(400);
  echo json_encode(['error' => 'Product ID is required']);
  exit;
}

// Lấy thông tin product
$stmt = $db->prepare("
  SELECT p.*, c.name AS category_name
  FROM products p
  JOIN categories c ON c.id = p.category_id
  WHERE p.id = ?
");
$stmt->execute([$productId]);
$product = $stmt->fetch();

if (!$product) {
  http_response_code(404);
  echo json_encode(['error' => 'Product not found']);
  exit;
}

// Lấy tất cả ảnh
$stmt = $db->prepare("
  SELECT id, image_url, is_thumbnail, sort_order
  FROM product_images
  WHERE product_id = ?
  ORDER BY sort_order ASC
");
$stmt->execute([$productId]);
$images = $stmt->fetchAll();

$product['images'] = $images;

echo json_encode($product);