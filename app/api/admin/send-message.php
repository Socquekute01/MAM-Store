<?php
require "../config.php";

$data = json_decode(file_get_contents("php://input"), true);

$cid = (int)($data["conversation_id"] ?? 0);
$message = trim($data["message"] ?? "");

if (!$cid || $message === "") {
  echo json_encode(["success" => false]);
  exit;
}

$stmt = $db->prepare("
  INSERT INTO messages (conversation_id, sender, content, is_read)
  VALUES (?, 'admin', ?, 1)
");
$stmt->execute([$cid, $message]);

echo json_encode(["success" => true]);
