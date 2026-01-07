<?php
require "../config.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(array(
    'success' => false,
    'error' => 'Method not allowed'
  ));
  exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$categoryId = isset($input['id']) ? intval($input['id']) : 0;

if ($categoryId <= 0) {
  http_response_code(400);
  echo json_encode(array(
    'success' => false,
    'error' => 'Category ID is required'
  ));
  exit;
}

/* =========================
 * CHECK PRODUCT EXIST
 * ========================= */
$stmt = $db->prepare("
  SELECT COUNT(*) 
  FROM products 
  WHERE category_id = ?
");
$stmt->execute(array($categoryId));

if ($stmt->fetchColumn() > 0) {
  http_response_code(400);
  echo json_encode(array(
    'success' => false,
    'error' => 'Cannot delete category with existing products'
  ));
  exit;
}

/* =========================
 * DELETE CATEGORY
 * ========================= */
$db->prepare("DELETE FROM categories WHERE id = ?")
   ->execute(array($categoryId));

echo json_encode(array(
  'success' => true,
  'message' => 'Category deleted successfully'
));
