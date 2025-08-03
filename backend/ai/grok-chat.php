<?php
// CORS Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');


// Handle OPTIONS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$message = $data['message'] ?? '';
$key = $data['key'] ?? '';

if (!$message || !$key) {
  echo json_encode(['success' => false, 'error' => 'Missing message or key']);
  exit;
}

$curl = curl_init('https://api.grok.x.ai/v1/chat/completions');
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_HTTPHEADER, [
  'Content-Type: application/json',
  'Authorization: Bearer ' . $key
]);
curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode([
  'model' => 'grok-beta',
  'messages' => [['role' => 'user', 'content' => $message]]
]));

$response = curl_exec($curl);
if (curl_errno($curl)) {
  echo json_encode(['success' => false, 'error' => curl_error($curl)]);
} else {
  echo $response; // Forward JSON
}
curl_close($curl);
?>