<?php
require "../config.php";

$data = json_decode(file_get_contents("php://input"), true);

$cid = (int)$data["conversation_id"];
$message = trim($data["message"]);

if (!$message) {
  echo json_encode(["success" => false]);
  exit;
}

// lưu message guest
$stmt = $db->prepare("
  INSERT INTO messages (conversation_id, sender, content)
  VALUES (?, 'guest', ?)
");
$stmt->execute([$cid, $message]);

// kiểm tra tin đầu tiên của guest
$stmt = $db->prepare("
  SELECT COUNT(*) FROM messages
  WHERE conversation_id = ? AND sender = 'guest'
");
$stmt->execute([$cid]);
$count = $stmt->fetchColumn();

if ($count == 1) {
  // bot phản hồi
  $stmt = $db->prepare("
    INSERT INTO messages (conversation_id, sender, content)
    VALUES (?, 'bot', ?)
  ");
  $stmt->execute([
    $cid,
    "MAM sẽ nhanh chóng phản hồi câu hỏi của bạn, bạn chờ trong giây lát nhé!"
  ]);
}

echo json_encode(["success" => true]);
