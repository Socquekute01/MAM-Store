<?php
require "../config.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$id = isset($data['id']) ? intval($data['id']) : 0;

if ($id <= 0) {
  http_response_code(400);
  echo json_encode(['error' => 'Construction ID is required']);
  exit;
}

// Lấy construction
$stmt = $db->prepare("SELECT image FROM construction WHERE id = ?");
$stmt->execute([$id]);
$construction = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$construction) {
  http_response_code(404);
  echo json_encode(['error' => 'Construction not found']);
  exit;
}

// Xóa file ảnh (nếu có)
if (!empty($construction['image'])) {
  $imagePath = $_SERVER['DOCUMENT_ROOT'] . $construction['image'];

  if (file_exists($imagePath)) {
    unlink($imagePath);
  }
}

// Xóa record DB
$stmt = $db->prepare("DELETE FROM construction WHERE id = ?");
$stmt->execute([$id]);

echo json_encode([
  'success' => true,
  'message' => 'Construction deleted successfully'
]);
