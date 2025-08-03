<?php
require_once '../config/database.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['id'])) {
        sendResponse(false, null, null, 'Agent ID is required');
    }
    
    $pdo = getDbConnection();
    
    // Build dynamic update query
    $updateFields = [];
    $values = [];
    
    $allowedFields = ['name', 'role', 'status', 'tasks_completed', 'current_task', 'efficiency', 'api_key', 'model'];
    
    foreach ($allowedFields as $field) {
        if (isset($input[$field])) {
            $dbField = $field === 'tasksCompleted' ? 'tasks_completed' : 
                      ($field === 'currentTask' ? 'current_task' : 
                      ($field === 'apiKey' ? 'api_key' : $field));
            $updateFields[] = "$dbField = ?";
            $values[] = $input[$field];
        }
    }
    
    if (empty($updateFields)) {
        sendResponse(false, null, null, 'No fields to update');
    }
    
    $updateFields[] = "last_active = NOW()";
    $values[] = $input['id'];
    
    $sql = "UPDATE agents SET " . implode(', ', $updateFields) . " WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($values);
    
    sendResponse(true, null, 'Agent updated successfully');
    
} catch (Exception $e) {
    sendResponse(false, null, null, 'Failed to update agent: ' . $e->getMessage());
}
?>