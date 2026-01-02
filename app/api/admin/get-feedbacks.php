<?php
require "../config.php";

header('Content-Type: application/json');

$stmt = $db->query("
  SELECT 
    id,
    name,
    phone,
    area,
    message,
    is_read,
    created_at
  FROM feedbacks
  ORDER BY created_at DESC
");

$feedbacks = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($feedbacks);
