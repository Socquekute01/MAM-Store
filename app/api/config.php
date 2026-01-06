<?php
// ==========================
// BASIC CONFIG
// ==========================
ini_set('zlib.output_compression', 'Off');

$host   = "localhost";
$dbname = "p1bwha70f8p3_mam_store";
$user   = "p1bwha70f8p3_root";
$pass   = "Nguyenloc2001@";

// ==========================
// ERROR (TẮT TRÊN PRODUCTION)
// ==========================
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/upload_error.log');

// ==========================
// CORS
// ==========================
$allowedOrigins = array(
  "http://localhost:5173",
  "https://mamvietnam.vn",
  "https://www.mamvietnam.vn",
  "https://khoancatbetongtienxuan.com",
  "https://www.khoancatbetongtienxuan.com"
);

if (!empty($_SERVER['HTTP_ORIGIN'])) {
  if (in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
    header("Access-Control-Allow-Credentials: true");
  }
}

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-ADMIN-KEY");
header("Content-Type: application/json; charset=utf-8");
header('Content-Encoding: none');

// ==========================
// OPTIONS PRE-FLIGHT
// ==========================
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  echo json_encode(['success' => true, 'message' => 'CORS OK']);
  exit;
}

// ==========================
// DATABASE CONNECTION
// ==========================
try {
  $db = new PDO(
    "mysql:host=".$host.";dbname=".$dbname.";charset=utf8mb4",
    $user,
    $pass,
    array(
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
      PDO::ATTR_EMULATE_PREPARES => false
    )
  );
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(array(
    "success" => false,
    "message" => "Database connection failed"
  ));
  exit;
}
