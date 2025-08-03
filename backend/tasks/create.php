<?php
require_once '../config/database.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $error = validateRequired($input, ['title', 'description']);
    if ($error) {
        sendResponse(false, null, null, $error);
    }
    
    $pdo = getDbConnection();
    
    $stmt = $pdo->prepare("
        INSERT INTO tasks (title, description, priority, status, assigned_to, progress, due_date, estimated_time) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $input['title'],
        $input['description'],
        $input['priority'] ?? 'medium',
        $input['status'] ?? 'pending',
        json_encode($input['assignedTo'] ?? []),
        $input['progress'] ?? 0,
        $input['dueDate'] ?? null,
        $input['estimatedTime'] ?? null
    ]);
    
    $taskId = $pdo->lastInsertId();
    
    sendResponse(true, ['id' => $taskId], 'Task created successfully');
    
} catch (Exception $e) {
    sendResponse(false, null, null, 'Failed to create task: ' . $e->getMessage());
}
?>