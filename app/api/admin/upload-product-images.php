<?php
require "../config.php";

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['success' => false, 'error' => 'Method not allowed']);
  exit;
}

$productId = intval($_POST['product_id'] ?? 0);
if ($productId <= 0) {
  http_response_code(400);
  echo json_encode(['success' => false, 'error' => 'Product ID is required']);
  exit;
}

/* =========================
 * CHECK PRODUCT
 * ========================= */
$stmt = $db->prepare("SELECT id FROM products WHERE id = ?");
$stmt->execute([$productId]);
if (!$stmt->fetch()) {
  http_response_code(404);
  echo json_encode(['success' => false, 'error' => 'Product not found']);
  exit;
}

if (empty($_FILES['images'])) {
  http_response_code(400);
  echo json_encode(['success' => false, 'error' => 'No images uploaded']);
  exit;
}

/* =========================
 * PATH SETUP (QUAN TRỌNG)
 * ========================= */
$baseUploadDir = $_SERVER['DOCUMENT_ROOT'] . '/uploads/products/';
$productDir = $baseUploadDir . $productId . '/';

if (!is_dir($productDir)) {
  mkdir($productDir, 0755, true);
}

$uploadedImages = [];
$files = $_FILES['images'];

/* =========================
 * SORT ORDER
 * ========================= */
$stmt = $db->prepare("
  SELECT COALESCE(MAX(sort_order), -1) AS max_order
  FROM product_images
  WHERE product_id = ?
");
$stmt->execute([$productId]);
$maxOrder = (int)$stmt->fetch()['max_order'];

/* =========================
 * CHECK THUMBNAIL EXIST
 * ========================= */
$stmt = $db->prepare("
  SELECT COUNT(*) FROM product_images
  WHERE product_id = ? AND is_thumbnail = 1
");
$stmt->execute([$productId]);
$hasThumbnail = $stmt->fetchColumn() > 0;

/* =========================
 * MULTIPLE FILES
 * ========================= */
$fileCount = is_array($files['name']) ? count($files['name']) : 1;

for ($i = 0; $i < $fileCount; $i++) {
  $fileName  = is_array($files['name']) ? $files['name'][$i] : $files['name'];
  $fileTmp   = is_array($files['tmp_name']) ? $files['tmp_name'][$i] : $files['tmp_name'];
  $fileError = is_array($files['error']) ? $files['error'][$i] : $files['error'];

  if ($fileError !== UPLOAD_ERR_OK) continue;

  /* Validate image */
  $imageInfo = getimagesize($fileTmp);
  if (!$imageInfo) continue;

  /* Extension whitelist */
  $ext = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
  if (!in_array($ext, ['jpg', 'jpeg', 'png', 'webp'])) continue;

  $newFileName = uniqid('img_') . '.' . $ext;
  $destination = $productDir . $newFileName;

  /* 🔴 DI CHUYỂN FILE */
  if (!move_uploaded_file($fileTmp, $destination)) continue;

  $imageUrl  = "/uploads/products/$productId/$newFileName";
  $sortOrder = ++$maxOrder;

  /* Thumbnail logic */
  $isThumbnail = (!$hasThumbnail && $i === 0) ? 1 : 0;
  if ($isThumbnail) $hasThumbnail = true;

  $stmt = $db->prepare("
    INSERT INTO product_images
    (product_id, image_url, is_thumbnail, sort_order)
    VALUES (?, ?, ?, ?)
  ");
  $stmt->execute([$productId, $imageUrl, $isThumbnail, $sortOrder]);

  $uploadedImages[] = [
    'id' => $db->lastInsertId(),
    'image_url' => $imageUrl,
    'is_thumbnail' => $isThumbnail,
    'sort_order' => $sortOrder,
  ];
}

echo json_encode([
  'success' => true,
  'data' => $uploadedImages,
]);
