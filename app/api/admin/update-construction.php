<?php
require "../config.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$id            = isset($data['id']) ? intval($data['id']) : 0;
$image         = isset($data['image']) ? trim($data['image']) : '';
$completedDate = isset($data['completedDate']) ? trim($data['completedDate']) : '';
$title         = isset($data['title']) ? trim($data['title']) : '';
$videoUrl      = isset($data['videoUrl']) ? trim($data['videoUrl']) : '';

if ($id <= 0 || $image === '' || $completedDate === '' || $title === '') {
  http_response_code(400);
  echo json_encode(['error' => 'Missing required fields']);
  exit;
}

/**
 * 1️⃣ Kiểm tra construction tồn tại
 */
$stmt = $db->prepare("SELECT image FROM construction WHERE id = ?");
$stmt->execute([$id]);
$oldConstruction = $stmt->fetch();

if (!$oldConstruction) {
  http_response_code(404);
  echo json_encode(['error' => 'Construction not found']);
  exit;
}

/**
 * 2️⃣ Update DB
 */
$stmt = $db->prepare("
  UPDATE construction
  SET image = ?, completed_date = ?, title = ?, video_url = ?
  WHERE id = ?
");

$stmt->execute([
  $image,
  $completedDate,
  $title,
  $videoUrl !== '' ? $videoUrl : null,
  $id
]);

/**
 * 3️⃣ Xoá ảnh cũ nếu:
 * - Ảnh thay đổi
 * - Ảnh cũ là ảnh local (/uploads/...)
 */
$oldImage = $oldConstruction['image'];

if (
  $oldImage !== $image &&
  str_starts_with($oldImage, '/uploads/') &&
  file_exists(__DIR__ . '/..' . $oldImage)
) {
  unlink(__DIR__ . '/..' . $oldImage);
}

echo json_encode([
  'success' => true,
  'data' => [
    'id'             => $id,
    'image'          => $image,
    'completed_date' => $completedDate,
    'title'          => $title,
    'video_url'      => $videoUrl !== '' ? $videoUrl : null
  ]
]);
