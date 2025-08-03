<?php
require_once '../config/database.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['id'])) {
        sendResponse(false, null, null, 'Task ID is required');
    }
    
    $pdo = getDbConnection();
    
    $updateFields = [];
    $params = [];
    
    if (isset($input['title'])) {
        $updateFields[] = 'title = ?';
        $params[] = $input['title'];
    }
    
    if (isset($input['description'])) {
        $updateFields[] = 'description = ?';
        $params[] = $input['description'];
    }
    
    if (isset($input['status'])) {
        $updateFields[] = 'status = ?';
        $params[] = $input['status'];
    }
    
    if (isset($input['priority'])) {
        $updateFields[] = 'priority = ?';
        $params[] = $input['priority'];
    }
    
    if (isset($input['assigned_agent_id'])) {
        $updateFields[] = 'assigned_agent_id = ?';
        $params[] = $input['assigned_agent_id'];
    }
    
    if (isset($input['due_date'])) {
        $updateFields[] = 'due_date = ?';
        $params[] = $input['due_date'];
    }
    
    if (isset($input['progress'])) {
        $updateFields[] = 'progress = ?';
        $params[] = $input['progress'];
    }
    
    if (empty($updateFields)) {
        sendResponse(false, null, null, 'No fields to update');
    }
    
    $updateFields[] = 'updated_at = NOW()';
    $params[] = $input['id'];
    
    $sql = "UPDATE tasks SET " . implode(', ', $updateFields) . " WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    if ($stmt->rowCount() > 0) {
        sendResponse(true, null, 'Task updated successfully');
    } else {
        sendResponse(false, null, null, 'Task not found or no changes made');
    }
    
} catch (Exception $e) {
    sendResponse(false, null, null, 'Failed to update task: ' . $e->getMessage());
}
?>