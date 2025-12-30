<?php
require "../config.php";

$sql = "
SELECT
  c.id,
  c.guest_id,
  (
    SELECT content
    FROM messages m
    WHERE m.conversation_id = c.id
    ORDER BY m.id DESC
    LIMIT 1
  ) AS last_message,
  (
    SELECT COUNT(*)
    FROM messages m
    WHERE m.conversation_id = c.id
      AND m.sender = 'guest'
      AND m.is_read = 0
  ) AS unread_count
FROM conversations c
ORDER BY c.id DESC
";

echo json_encode($db->query($sql)->fetchAll());
