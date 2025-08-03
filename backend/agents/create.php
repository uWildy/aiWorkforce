<?php
require_once '../config/database.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $error = validateRequired($input, ['name', 'role']);
    if ($error) {
        sendResponse(false, null, null, $error);
    }
    
    $pdo = getDbConnection();
    
    $stmt = $pdo->prepare("
        INSERT INTO agents (name, role, status, efficiency, api_key, model) 
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $input['name'],
        $input['role'],
        $input['status'] ?? 'offline',
        $input['efficiency'] ?? 0,
        $input['apiKey'] ?? '',
        $input['model'] ?? 'gpt-4'
    ]);
    
    $agentId = $pdo->lastInsertId();
    
    sendResponse(true, ['id' => $agentId], 'Agent created successfully');
    
} catch (Exception $e) {
    sendResponse(false, null, null, 'Failed to create agent: ' . $e->getMessage());
}
?>