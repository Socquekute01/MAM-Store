<?php
require "../config.php";

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['success' => false, 'error' => 'Method not allowed']);
  exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$name = trim(isset($data['name']) ? $data['name'] : '');
$phone = trim(isset($data['phone']) ? $data['phone'] : '');
$area = trim(isset($data['area']) ? $data['area'] : '');
$message = trim(isset($data['message']) ? $data['message'] : '');

if ($name === '' || $phone === '' || $message === '') {
  http_response_code(400);
  echo json_encode(['success' => false, 'error' => 'Missing required fields']);
  exit;
}

$stmt = $db->prepare("
  INSERT INTO feedbacks (name, phone, area, message)
  VALUES (?, ?, ?, ?)
");
$stmt->execute([$name, $phone, $area, $message]);

echo json_encode([
  'success' => true,
  'id' => $db->lastInsertId()
]);
