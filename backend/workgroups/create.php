<?php
require_once '../config/database.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $error = validateRequired($input, ['name', 'goal']);
    if ($error) {
        sendResponse(false, null, null, $error);
    }
    
    $pdo = getDbConnection();
    
    $stmt = $pdo->prepare("
        INSERT INTO workgroups (name, description, goal, status, priority, agent_ids, task_ids, deadline, created_by) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $agentIds = json_encode($input['agent_ids'] ?? []);
    $taskIds = json_encode($input['task_ids'] ?? []);
    
    $stmt->execute([
        $input['name'],
        $input['description'] ?? '',
        $input['goal'],
        $input['status'] ?? 'active',
        $input['priority'] ?? 'medium',
        $agentIds,
        $taskIds,
        $input['deadline'] ?? null,
        $input['created_by'] ?? 'Admin'
    ]);
    
    $workgroupId = $pdo->lastInsertId();
    
    // Get the created workgroup
    $stmt = $pdo->prepare("SELECT * FROM workgroups WHERE id = ?");
    $stmt->execute([$workgroupId]);
    $workgroup = $stmt->fetch();
    
    $workgroup['agent_ids'] = json_decode($workgroup['agent_ids'], true);
    $workgroup['task_ids'] = json_decode($workgroup['task_ids'], true);
    
    sendResponse(true, $workgroup, 'Workgroup created successfully');
    
} catch (Exception $e) {
    sendResponse(false, null, null, 'Failed to create workgroup: ' . $e->getMessage());
}
?>