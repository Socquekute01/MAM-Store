<?php
require "../config.php";

$guestId = uniqid("guest_");

$stmt = $db->prepare("
  INSERT INTO conversations (guest_id)
  VALUES (?)
");
$stmt->execute([$guestId]);

echo json_encode([
  "conversation_id" => (int)$db->lastInsertId(),
  "guest_id" => $guestId
]);
