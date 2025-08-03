<?php
error_reporting(0); // Suppress in response
header('Content-Type: application/json');
require_once '../config/database.php';
require_once '../../vendor/autoload.php'; // For dotenv
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

$data = json_decode(file_get_contents('php://input'), true);
$agentId = $data['agentId'] ?? 'test';
$message = $data['message'] ?? '';

if (empty($message)) {
    echo json_encode(['error' => 'Message required']);
    exit;
}

$hfToken = $_ENV['apikey'];
$url = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';
$payload = json_encode(['inputs' => "Agent $agentId: $message"]);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $hfToken,
    'Content-Type: application/json'
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    $aiResponse = json_decode($response, true)[0]['generated_text'] ?? 'No response';
    // Optional DB log
    $stmt = $pdo->prepare("INSERT INTO ai_tests (agent_id, message, response, status) VALUES (?, ?, ?, 'success')");
    $stmt->execute([$agentId, $message, $aiResponse]);
    echo json_encode(['success' => true, 'data' => ['response' => $aiResponse]]);
} else {
    $error = json_decode($response, true)['error'] ?? 'API error';
    // Log error
    $stmt = $pdo->prepare("INSERT INTO ai_tests (agent_id, message, response, status) VALUES (?, ?, ?, 'error')");
    $stmt->execute([$agentId, $message, $error]);
    echo json_encode(['error' => $error]);
}
?>