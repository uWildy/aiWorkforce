<?php
require_once '../config/database.php';

try {
    $pdo = getDbConnection();
    
    $stmt = $pdo->query("
        SELECT 
            id,
            title,
            description,
            priority,
            status,
            JSON_UNQUOTE(assigned_to) as assignedTo,
            progress,
            due_date as dueDate,
            estimated_time as estimatedTime,
            created_at as createdAt
        FROM tasks 
        ORDER BY created_at DESC
    ");
    
    $tasks = $stmt->fetchAll();
    
    // Parse JSON assigned_to field
    foreach ($tasks as &$task) {
        $task['assignedTo'] = json_decode($task['assignedTo']) ?: [];
    }
    
    sendResponse(true, $tasks);
    
} catch (Exception $e) {
    sendResponse(false, null, null, 'Failed to fetch tasks: ' . $e->getMessage());
}
?>