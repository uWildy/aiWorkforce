<?php
require_once '../config/database.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $error = validateRequired($input, ['id']);
    if ($error) {
        sendResponse(false, null, null, $error);
    }
    
    $pdo = getDbConnection();
    
    // Build dynamic update query
    $updateFields = [];
    $values = [];
    
    $allowedFields = ['name', 'description', 'goal', 'status', 'priority', 'progress', 'deadline'];
    
    foreach ($allowedFields as $field) {
        if (isset($input[$field])) {
            $updateFields[] = "$field = ?";
            $values[] = $input[$field];
        }
    }
    
    // Handle JSON fields
    if (isset($input['agent_ids'])) {
        $updateFields[] = "agent_ids = ?";
        $values[] = json_encode($input['agent_ids']);
    }
    
    if (isset($input['task_ids'])) {
        $updateFields[] = "task_ids = ?";
        $values[] = json_encode($input['task_ids']);
    }
    
    if (empty($updateFields)) {
        sendResponse(false, null, null, 'No fields to update');
    }
    
    $values[] = $input['id'];
    
    $stmt = $pdo->prepare("
        UPDATE workgroups 
        SET " . implode(', ', $updateFields) . ", updated_at = NOW() 
        WHERE id = ?
    ");
    
    $stmt->execute($values);
    
    // Get updated workgroup
    $stmt = $pdo->prepare("SELECT * FROM workgroups WHERE id = ?");
    $stmt->execute([$input['id']]);
    $workgroup = $stmt->fetch();
    
    if ($workgroup) {
        $workgroup['agent_ids'] = json_decode($workgroup['agent_ids'], true);
        $workgroup['task_ids'] = json_decode($workgroup['task_ids'], true);
    }
    
    sendResponse(true, $workgroup, 'Workgroup updated successfully');
    
} catch (Exception $e) {
    sendResponse(false, null, null, 'Failed to update workgroup: ' . $e->getMessage());
}
?>