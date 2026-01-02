<?php
require "../config.php";

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$imageId = intval($input['image_id'] ?? 0);

if ($imageId <= 0) {
  http_response_code(400);
  echo json_encode(['error' => 'Image ID is required']);
  exit;
}

try {
  // Lấy product_id của ảnh
  $stmt = $db->prepare("SELECT product_id FROM product_images WHERE id = ?");
  $stmt->execute([$imageId]);
  $image = $stmt->fetch();
  
  if (!$image) {
    http_response_code(404);
    echo json_encode(['error' => 'Image not found']);
    exit;
  }
  
  $productId = $image['product_id'];
  
  // Reset tất cả thumbnail của product này
  $stmt = $db->prepare("UPDATE product_images SET is_thumbnail = 0 WHERE product_id = ?");
  $stmt->execute([$productId]);
  
  // Set thumbnail mới
  $stmt = $db->prepare("UPDATE product_images SET is_thumbnail = 1 WHERE id = ?");
  $stmt->execute([$imageId]);
  
  echo json_encode([
    'success' => true,
    'message' => 'Thumbnail updated successfully'
  ]);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}