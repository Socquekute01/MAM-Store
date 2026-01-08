<?php
require "../config.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['success' => false, 'error' => 'Method not allowed']);
  exit;
}

if (empty($_FILES['image'])) {
  http_response_code(400);
  echo json_encode(['success' => false, 'error' => 'No image uploaded']);
  exit;
}

$file = $_FILES['image'];

if ($file['error'] !== UPLOAD_ERR_OK) {
  http_response_code(400);
  echo json_encode(['success' => false, 'error' => 'Upload error']);
  exit;
}

/**
 * ✅ Validate MIME type (HỖ TRỢ WEBP)
 */
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime  = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

$allowedMimes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/x-webp',
  'application/octet-stream' // fallback cho webp
];

if (!in_array($mime, $allowedMimes)) {
  http_response_code(400);
  echo json_encode([
    'success' => false,
    'error' => 'Invalid image type',
    'mime' => $mime // debug
  ]);
  exit;
}


/**
 * ✅ Check size
 */
if ($file['size'] > 5 * 1024 * 1024) {
  http_response_code(400);
  echo json_encode(['success' => false, 'error' => 'Max 5MB']);
  exit;
}

/**
 * ✅ Extension check (phụ)
 */
$allowedExts = ['jpg', 'jpeg', 'png', 'webp'];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

if (!in_array($ext, $allowedExts)) {
  http_response_code(400);
  echo json_encode(['success' => false, 'error' => 'Invalid extension']);
  exit;
}

/**
 * ✅ Upload
 */
$uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/uploads/constructions/';
if (!is_dir($uploadDir)) {
  mkdir($uploadDir, 0755, true);
}

$newFileName = 'construction_' . uniqid() . '.' . $ext;
$targetPath = $uploadDir . $newFileName;

if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
  http_response_code(500);
  echo json_encode(['success' => false, 'error' => 'Failed to save image']);
  exit;
}

echo json_encode([
  'success' => true,
  'data' => [
    'image' => 'constructions/' . $newFileName,
    'image_url' => '/uploads/constructions/' . $newFileName
  ]
]);
