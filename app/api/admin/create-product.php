<?php
require "../config.php";

/**
 * 1️⃣ XỬ LÝ OPTIONS NGAY LẬP TỨC
 */
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

/**
 * 2️⃣ CHỈ CHO PHÉP POST
 */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

/**
 * 3️⃣ ĐỌC BODY AN TOÀN
 */
$raw = file_get_contents('php://input');
$input = json_decode($raw, true);

/**
 * 4️⃣ KIỂM TRA JSON
 */
if (!is_array($input)) {
  http_response_code(400);
  echo json_encode([
    'error' => 'Invalid JSON body',
    'raw'   => $raw // ❗ có thể bỏ khi production
  ]);
  exit;
}

/**
 * 5️⃣ LẤY DATA AN TOÀN
 */
$categoryId  = isset($input['category_id']) ? intval($input['category_id']) : 0;
$name        = isset($input['name']) ? trim($input['name']) : '';
$description = isset($input['description']) ? trim($input['description']) : '';

if ($categoryId <= 0 || $name === '') {
  http_response_code(400);
  echo json_encode(['error' => 'Category ID and name are required']);
  exit;
}

/**
 * 6️⃣ INSERT DB
 */
try {
  $stmt = $db->prepare(
    "INSERT INTO products (category_id, name, description)
     VALUES (?, ?, ?)"
  );
  $stmt->execute([$categoryId, $name, $description]);

  echo json_encode([
    'success' => true,
    'data' => [
      'id' => $db->lastInsertId(),
      'category_id' => $categoryId,
      'name' => $name,
      'description' => $description
    ]
  ]);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Database error']);
}
