<?php
require_once '../config/database.php';

try {
    $pdo = getDbConnection();
    
    $stmt = $pdo->query("
        SELECT 
            id,
            name,
            role,
            status,
            tasks_completed as tasksCompleted,
            current_task as currentTask,
            DATE_FORMAT(last_active, '%Y-%m-%d %H:%i') as lastActive,
            efficiency,
            api_key as apiKey,
            model,
            created_at as createdAt
        FROM agents 
        ORDER BY created_at DESC
    ");
    
    $agents = $stmt->fetchAll();
    
    sendResponse(true, $agents);
    
} catch (Exception $e) {
    sendResponse(false, null, null, 'Failed to fetch agents: ' . $e->getMessage());
}
?>