<?php
require "../config.php";
header('Content-Type: application/json');

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

$imageInfo = getimagesize($file['tmp_name']);
if (!$imageInfo) {
  http_response_code(400);
  echo json_encode(['success' => false, 'error' => 'Invalid image']);
  exit;
}

if ($file['size'] > 5 * 1024 * 1024) {
  http_response_code(400);
  echo json_encode(['success' => false, 'error' => 'Max 5MB']);
  exit;
}

$allowedExts = ['jpg', 'jpeg', 'png', 'webp'];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if (!in_array($ext, $allowedExts)) {
  http_response_code(400);
  echo json_encode(['success' => false, 'error' => 'Invalid image type']);
  exit;
}
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
