<?php
require "../config.php";

$data = json_decode(file_get_contents("php://input"), true);

$cid = (int)(isset($data["conversation_id"]) ? $data["conversation_id"] : 0);
$message = trim(isset($data["message"]) ? $data["message"] : "");
$sender = isset($data["sender"]) ? $data["sender"] : "guest";

if (!$cid || $message === "") {
  echo json_encode(["success" => false]);
  exit;
}

$stmt = $db->prepare("
  INSERT INTO messages (conversation_id, sender, content, is_read)
  VALUES (?, ?, ?, 0)
");
$stmt->execute([$cid, $sender, $message]);

echo json_encode(["success" => true]);
