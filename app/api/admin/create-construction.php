<?php
require "../config.php";

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$image = isset($data['image']) ? trim($data['image']) : '';
$completedDate = isset($data['completedDate']) ? trim($data['completedDate']) : '';
$title = isset($data['title']) ? trim($data['title']) : '';
$videoUrl = isset($data['videoUrl']) ? trim($data['videoUrl']) : '';

if ($image === '' || $completedDate === '' || $title === '') {
  http_response_code(400);
  echo json_encode(['error' => 'Missing required fields']);
  exit;
}

$stmt = $db->prepare("
  INSERT INTO construction (image, completed_date, title, video_url)
  VALUES (?, ?, ?, ?)
");

$stmt->execute([
  $image,
  $completedDate,
  $title,
  $videoUrl ?: null
]);

echo json_encode([
  'success' => true,
  'data' => [
    'id' => $db->lastInsertId(),
    'image' => $image,
    'completedDate' => $completedDate,
    'title' => $title,
    'videoUrl' => $videoUrl
  ]
]);
