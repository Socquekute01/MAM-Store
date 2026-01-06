<?php
$host   = "localhost";
$dbname = "mam_store";
$user   = "root";
$pass   = "";

$allowedOrigins = [
  "http://localhost:5173",        // Admin UI local
  "https://mamvietnam.vn",        // User UI
  "https://www.mamvietnam.vn",
  "https://khoancatbetongtienxuan.com"
  "https://www.khoancatbetongtienxuan.com"
];

if (isset($_SERVER['HTTP_ORIGIN'])) {
  if (in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
  }
}

// BẮT BUỘC cho CORS
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-ADMIN-KEY");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=utf-8");

// Xử lý preflight (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

// ==========================
// DATABASE CONNECTION
// ==========================
try {
  $db = new PDO(
    "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
    $user,
    $pass,
    [
      PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
      PDO::ATTR_EMULATE_PREPARES   => false
    ]
  );
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode([
    "success" => false,
    "message" => "Database connection failed"
    // "debug" => $e->getMessage() // ❌ bật khi dev local
  ]);
  exit;
}
