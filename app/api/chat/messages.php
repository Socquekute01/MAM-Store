<?php
require "../config.php";

$cid = (int)$_GET["conversation_id"];

$stmt = $db->prepare("
  SELECT sender, content, created_at
  FROM messages
  WHERE conversation_id = ?
  ORDER BY id ASC
");
$stmt->execute([$cid]);

echo json_encode($stmt->fetchAll());
