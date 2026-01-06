<?php
// FORCE TẮT MỌI COMPRESSION
header('Content-Encoding: none');
header_remove('Content-Encoding');

if (function_exists('apache_setenv')) {
    apache_setenv('no-gzip', '1');
    apache_setenv('dont-vary', '1');
}

ini_set('zlib.output_compression', '0');
ini_set('zlib.output_compression_level', '0');

// Tắt output buffering
if (ob_get_level()) {
    ob_end_clean();
}

require "../config.php";

// ... rest of code ...

/* =========================
 * CORS & PRE-FLIGHT
 * ========================= */
// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
//   http_response_code(200);
//   exit;
// }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode([
    'success' => false,
    'error' => 'Method not allowed'
  ]);
  exit;
}

/* =========================
 * VALIDATE INPUT
 * ========================= */
$productId = isset($_POST['product_id']) ? intval($_POST['product_id']) : 0;

if ($productId <= 0) {
  http_response_code(400);
  echo json_encode([
    'success' => false,
    'error' => 'Product ID is required'
  ]);
  exit;
}

/* =========================
 * CHECK PRODUCT EXIST
 * ========================= */
$stmt = $db->prepare("SELECT id FROM products WHERE id = ?");
$stmt->execute([$productId]);

if (!$stmt->fetch()) {
  http_response_code(404);
  echo json_encode([
    'success' => false,
    'error' => 'Product not found'
  ]);
  exit;
}

/* =========================
 * CHECK FILE UPLOAD
 * ========================= */
if (empty($_FILES['images'])) {
  http_response_code(400);
  echo json_encode([
    'success' => false,
    'error' => 'No images uploaded'
  ]);
  exit;
}

/* =========================
 * PATH SETUP (AN TOÀN)
 * ========================= */
$uploadRoot = realpath(__DIR__ . '/../../uploads/products');

if ($uploadRoot === false) {
  http_response_code(500);
  echo json_encode([
    'success' => false,
    'error' => 'Upload root directory not found'
  ]);
  exit;
}

$productDir = $uploadRoot . '/' . $productId . '/';

if (!is_dir($productDir)) {
  if (!mkdir($productDir, 0755, true)) {
    http_response_code(500);
    echo json_encode([
      'success' => false,
      'error' => 'Cannot create product upload directory'
    ]);
    exit;
  }
}

/* =========================
 * SORT ORDER
 * ========================= */
$stmt = $db->prepare("
  SELECT COALESCE(MAX(sort_order), -1) AS max_order
  FROM product_images
  WHERE product_id = ?
");
$stmt->execute([$productId]);
$maxOrder = (int) $stmt->fetch()['max_order'];

/* =========================
 * THUMBNAIL CHECK
 * ========================= */
$stmt = $db->prepare("
  SELECT COUNT(*) FROM product_images
  WHERE product_id = ? AND is_thumbnail = 1
");
$stmt->execute([$productId]);
$hasThumbnail = $stmt->fetchColumn() > 0;

/* =========================
 * UPLOAD PROCESS
 * ========================= */
$allowedExt = ['jpg', 'jpeg', 'png', 'webp'];
$maxSize    = 5 * 1024 * 1024; // 5MB

$files = $_FILES['images'];
$fileCount = is_array($files['name']) ? count($files['name']) : 1;

$uploadedImages = [];

for ($i = 0; $i < $fileCount; $i++) {

  $name  = is_array($files['name'])     ? $files['name'][$i]     : $files['name'];
  $tmp   = is_array($files['tmp_name']) ? $files['tmp_name'][$i] : $files['tmp_name'];
  $error = is_array($files['error'])    ? $files['error'][$i]    : $files['error'];
  $size  = is_array($files['size'])     ? $files['size'][$i]     : $files['size'];

  if ($error !== UPLOAD_ERR_OK) continue;
  if ($size > $maxSize) continue;

  /* Validate image */
  if (!getimagesize($tmp)) continue;

  /* Extension check */
  $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
  if (!in_array($ext, $allowedExt)) continue;

  $newName = uniqid('img_', true) . '.' . $ext;
  $dest    = $productDir . $newName;

  if (!move_uploaded_file($tmp, $dest)) continue;

  $imageUrl = "/uploads/products/$productId/$newName";
  $sortOrder = ++$maxOrder;

  $isThumbnail = (!$hasThumbnail && $i === 0) ? 1 : 0;
  if ($isThumbnail) $hasThumbnail = true;

  $stmt = $db->prepare("
    INSERT INTO product_images
      (product_id, image_url, is_thumbnail, sort_order)
    VALUES (?, ?, ?, ?)
  ");
  $stmt->execute([
    $productId,
    $imageUrl,
    $isThumbnail,
    $sortOrder
  ]);

  $uploadedImages[] = [
    'id'           => $db->lastInsertId(),
    'image_url'    => $imageUrl,
    'is_thumbnail' => (bool) $isThumbnail,
    'sort_order'   => $sortOrder
  ];
}


if (empty($uploadedImages)) {
  http_response_code(400);
  echo json_encode([
    'success' => false,
    'error' => 'No images were uploaded'
  ]);
  exit;
}

// XÓA MỌI CODE ob_flush, ob_end_clean

// Chỉ cần:
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

echo json_encode([
  'success' => true,
  'data' => $uploadedImages
]);

// Log thời gian gửi
file_put_contents(
  __DIR__ . '/response_sent.log',
  date('Y-m-d H:i:s') . " - Response sent: " . json_encode($uploadedImages) . "\n",
  FILE_APPEND
);

exit;