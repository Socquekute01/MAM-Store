<?php
require "../config.php";

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$categoryId = intval($input['category_id'] ?? 0);
$name = trim($input['name'] ?? '');
$description = trim($input['description'] ?? '');

if ($categoryId <= 0 || empty($name)) {
  http_response_code(400);
  echo json_encode(['error' => 'Category ID and name are required']);
  exit;
}

try {
  $stmt = $db->prepare("INSERT INTO products (category_id, name, description) VALUES (?, ?, ?)");
  $stmt->execute([$categoryId, $name, $description]);
  
  $productId = $db->lastInsertId();
  
  echo json_encode([
    'success' => true,
    'data' => [
      'id' => $productId,
      'category_id' => $categoryId,
      'name' => $name,
      'description' => $description
    ]
  ]);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}