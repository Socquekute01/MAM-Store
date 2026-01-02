<?php
require "../config.php";

header('Content-Type: application/json');

$sql = "
SELECT 
  id,
  image,
  completed_date,
  title,
  video_url,
  created_at
FROM construction
ORDER BY completed_date DESC, created_at DESC
";

$constructions = $db->query($sql)->fetchAll();

echo json_encode($constructions);