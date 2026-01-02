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
  // Lấy thông tin ảnh
  $stmt = $db->prepare("SELECT * FROM product_images WHERE id = ?");
  $stmt->execute([$imageId]);
  $image = $stmt->fetch();
  
  if (!$image) {
    http_response_code(404);
    echo json_encode(['error' => 'Image not found']);
    exit;
  }
  
  // Xóa file vật lý
  $filePath = ".." . $image['image_url'];
  if (file_exists($filePath)) {
    unlink($filePath);
  }
  
  // Xóa record trong DB
  $stmt = $db->prepare("DELETE FROM product_images WHERE id = ?");
  $stmt->execute([$imageId]);
  
  // Nếu xóa thumbnail → set ảnh đầu tiên làm thumbnail mới
  if ($image['is_thumbnail'] == 1) {
    $stmt = $db->prepare("
      UPDATE product_images 
      SET is_thumbnail = 1 
      WHERE product_id = ? 
      ORDER BY sort_order ASC 
      LIMIT 1
    ");
    $stmt->execute([$image['product_id']]);
  }
  
  echo json_encode([
    'success' => true,
    'message' => 'Image deleted successfully'
  ]);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}