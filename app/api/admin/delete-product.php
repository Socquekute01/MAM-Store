<?php
require "../config.php";

/* =========================
 * METHOD CHECK
 * ========================= */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(array(
    'success' => false,
    'error' => 'Method not allowed'
  ));
  exit;
}

/* =========================
 * INPUT
 * ========================= */
$input = json_decode(file_get_contents('php://input'), true);
$productId = isset($input['id']) ? intval($input['id']) : 0;

if ($productId <= 0) {
  http_response_code(400);
  echo json_encode(array(
    'success' => false,
    'error' => 'Product ID is required'
  ));
  exit;
}

/* =========================
 * HELPER: DELETE FOLDER
 * ========================= */
function deleteFolder($dir) {
  if (!is_dir($dir)) return;

  $files = scandir($dir);
  foreach ($files as $file) {
    if ($file === '.' || $file === '..') continue;

    $path = $dir . '/' . $file;
    if (is_dir($path)) {
      deleteFolder($path);
    } else {
      unlink($path);
    }
  }
  rmdir($dir);
}

try {
  /* =========================
   * CHECK PRODUCT
   * ========================= */
  $stmt = $db->prepare("SELECT id FROM products WHERE id = ?");
  $stmt->execute(array($productId));
  if (!$stmt->fetch()) {
    http_response_code(404);
    echo json_encode(array(
      'success' => false,
      'error' => 'Product not found'
    ));
    exit;
  }

  /* =========================
   * DELETE IMAGE FOLDER
   * ========================= */
  $productDir = $_SERVER['DOCUMENT_ROOT'] . "/uploads/products/" . $productId;

  if (is_dir($productDir)) {
    deleteFolder($productDir);
  }

  /* =========================
   * DELETE DB RECORDS
   * ========================= */
  $db->prepare("DELETE FROM product_images WHERE product_id = ?")
     ->execute(array($productId));

  $db->prepare("DELETE FROM products WHERE id = ?")
     ->execute(array($productId));

  echo json_encode(array(
    'success' => true,
    'message' => 'Product and image folder deleted successfully'
  ));

} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(array(
    'success' => false,
    'error' => 'Server error'
  ));
}
