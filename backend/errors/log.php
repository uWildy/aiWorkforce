<?php
require_once '../config/database.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  exit(0);
}

$rawInput = file_get_contents('php://input');
$rawInput = trim($rawInput);
error_log('Raw POST: ' . $rawInput);

$data = json_decode($rawInput, true);

if (json_last_error() !== JSON_ERROR_NONE) {
  $err = json_last_error_msg();
  error_log('Decode: ' . $err);
  if ($err === 'Syntax error') {
    $rawInput = mb_convert_encoding($rawInput, 'UTF-8', 'ISO-8859-1'); // Replacement
    $data = json_decode($rawInput, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
      echo json_encode(['success' => false, 'error' => 'Invalid JSON: ' . $err]);
      exit;
    }
  } else {
    echo json_encode(['success' => false, 'error' => 'Invalid JSON: ' . $err]);
    exit;
  }
}

try {
  $pdo = getDbConnection();
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
  
  $stmt = $pdo->prepare("INSERT INTO error_logs (type, message, stack_trace, user_id, severity) VALUES (?, ?, ?, ?, ?)");
 $stmt->execute([
    $data['type'] ?? 'unknown',
    $data['message'] ?? 'No message',
    $data['stack_trace'] ?? '',
    $data['user_id'] ?? null,
    $data['severity'] ?? 'medium'
  ]);
  
  echo json_encode(['success' => true]);
} catch (PDOException $e) {
  error_log('PDO: ' . $e->getMessage());
  echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>