<?php
require "../config.php";

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$name = trim($input['name'] ?? '');

if (empty($name)) {
  http_response_code(400);
  echo json_encode(['error' => 'Category name is required']);
  exit;
}

// Tạo slug tự động
$slug = strtolower(preg_replace('/[^a-z0-9]+/i', '-', $name));
$slug = trim($slug, '-');

try {
  $stmt = $db->prepare("INSERT INTO categories (name, slug) VALUES (?, ?)");
  $stmt->execute([$name, $slug]);
  
  $categoryId = $db->lastInsertId();
  
  echo json_encode([
    'success' => true,
    'data' => [
      'id' => $categoryId,
      'name' => $name,
      'slug' => $slug
    ]
  ]);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}