<?php
require "../config.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

$input = json_decode(file_get_contents("php://input"), true);
$id   = isset($input['id']) ? intval($input['id']) : 0;
$name = isset($input['name']) ? trim($input['name']) : '';

if ($id <= 0 || $name === '') {
  http_response_code(400);
  echo json_encode(array(
    "success" => false,
    "error" => "Category ID and name are required"
  ));
  exit;
}

$stmt = $db->prepare("UPDATE categories SET name = ? WHERE id = ?");
$stmt->execute(array($name, $id));

echo json_encode(array(
  "success" => true,
  "message" => "Category updated"
));
