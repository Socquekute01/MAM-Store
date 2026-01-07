<?php
require "../config.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$feedbackId = isset($input['id']) ? intval($input['id']) : 0;

if ($feedbackId <= 0) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid feedback id']);
  exit;
}

// Kiểm tra feedback tồn tại
$stmt = $db->prepare("SELECT id FROM feedbacks WHERE id = ?");
$stmt->execute([$feedbackId]);

if (!$stmt->fetch()) {
  http_response_code(404);
  echo json_encode(['error' => 'Feedback not found']);
  exit;
}

// Xóa feedback
$stmt = $db->prepare("DELETE FROM feedbacks WHERE id = ?");
$stmt->execute([$feedbackId]);

echo json_encode([
  'success' => true,
  'message' => 'Feedback deleted successfully'
]);
