<?php
require "../config.php";

$data = json_decode(file_get_contents("php://input"), true);

$cid  = (int)($data["conversation_id"] ?? 0);
$role = $data["role"] ?? "";

if (!$cid || !in_array($role, ["admin", "guest"])) {
  echo json_encode(["success" => false]);
  exit;
}

if ($role === "admin") {
  // Admin đọc tin của guest
  $stmt = $db->prepare("
    UPDATE messages
    SET is_read = 1
    WHERE conversation_id = ?
      AND sender = 'guest'
      AND is_read = 0
  ");
} else {
  // Guest đọc tin của admin + bot
  $stmt = $db->prepare("
    UPDATE messages
    SET is_read = 1
    WHERE conversation_id = ?
      AND sender != 'guest'
      AND is_read = 0
  ");
}

$stmt->execute([$cid]);

echo json_encode(["success" => true]);
