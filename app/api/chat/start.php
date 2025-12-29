<?php
require "../config.php";

$guestId = uniqid("guest_");

$stmt = $db->prepare("
  INSERT INTO conversations (guest_id)
  VALUES (?)
");
$stmt->execute([$guestId]);

$conversationId = $db->lastInsertId();

// bot chào
$stmt = $db->prepare("
  INSERT INTO messages (conversation_id, sender, content)
  VALUES (?, 'bot', ?)
");
$stmt->execute([
  $conversationId,
  "Chào bạn, MAM có thể giúp gì cho bạn?"
]);

echo json_encode([
  "conversation_id" => (int)$conversationId,
  "guest_id" => $guestId
]);
