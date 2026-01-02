<?php
require "../config.php";

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$imageOrders = $input['image_orders'] ?? [];

// Format: [{ id: 1, sort_order: 0 }, { id: 2, sort_order: 1 }, ...]

if (empty($imageOrders)) {
  http_response_code(400);
  echo json_encode(['error' => 'Image orders array is required']);
  exit;
}

try {
  $db->beginTransaction();
  
  $stmt = $db->prepare("UPDATE product_images SET sort_order = ? WHERE id = ?");
  
  foreach ($imageOrders as $item) {
    $imageId = intval($item['id'] ?? 0);
    $sortOrder = intval($item['sort_order'] ?? 0);
    
    if ($imageId > 0) {
      $stmt->execute([$sortOrder, $imageId]);
    }
  }
  
  $db->commit();
  
  echo json_encode([
    'success' => true,
    'message' => 'Images reordered successfully'
  ]);
} catch (PDOException $e) {
  $db->rollBack();
  http_response_code(500);
  echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}