<?php
require_once '../config/database.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['id'])) {
        sendResponse(false, null, null, 'Workgroup ID is required');
    }
    
    $pdo = getDbConnection();
    
    // Check if workgroup has active tasks
    $taskStmt = $pdo->prepare("SELECT COUNT(*) FROM tasks WHERE workgroup_id = ? AND status IN ('pending', 'in_progress')");
    $taskStmt->execute([$input['id']]);
    $activeTasks = $taskStmt->fetchColumn();
    
    if ($activeTasks > 0) {
        sendResponse(false, null, null, 'Cannot delete workgroup with active tasks. Please complete or reassign tasks first.');
    }
    
    // Delete workgroup members first
    $membersStmt = $pdo->prepare("DELETE FROM workgroup_members WHERE workgroup_id = ?");
    $membersStmt->execute([$input['id']]);
    
    // Delete workgroup
    $stmt = $pdo->prepare("DELETE FROM workgroups WHERE id = ?");
    $stmt->execute([$input['id']]);
    
    if ($stmt->rowCount() > 0) {
        sendResponse(true, null, 'Workgroup deleted successfully');
    } else {
        sendResponse(false, null, null, 'Workgroup not found');
    }
    
} catch (Exception $e) {
    sendResponse(false, null, null, 'Failed to delete workgroup: ' . $e->getMessage());
}
?>