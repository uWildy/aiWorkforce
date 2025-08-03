<?php
// Health check endpoint
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

echo json_encode([
    'status' => 'ok',
    'message' => 'Backend is running',
    'timestamp' => date('Y-m-d H:i:s'),
    'models' => [
        'grok-4' => 'FLAGSHIP - Most Advanced Available',
        'grok-2' => 'Available',
        'grok-2-mini' => 'Available',
        'grok-1.5' => 'Available', 
        'grok-1' => 'Available',
        'grok-beta' => 'Available',
        'gpt-4' => 'Secondary - Available',
        'claude-3-opus' => 'Secondary - Available'
    ],
    'primary_provider' => 'xAI Grok 4'
]);
?>