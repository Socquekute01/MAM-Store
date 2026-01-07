<?php
require "../config.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

$input = json_decode(file_get_contents("php://input"), true);
$id = isset($input['id']) ? intval($input['id']) : 0;
$name = isset($input['name']) ? trim($input['name']) : '';
$description = isset($input['description']) ? trim($input['description']) : '';

if ($id <= 0 || $name === '') {
  http_response_code(400);
  echo json_encode(array(
    "success" => false,
    "error" => "Product ID and name are required"
  ));
  exit;
}

$stmt = $db->prepare("
  UPDATE products
  SET name = ?, description = ?
  WHERE id = ?
");
$stmt->execute(array($name, $description, $id));

echo json_encode(array(
  "success" => true,
  "message" => "Product updated"
));
