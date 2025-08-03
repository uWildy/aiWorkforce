<?php
require_once '../config/database.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['id'])) {
        sendResponse(false, null, null, 'Agent ID is required');
    }
    
    $pdo = getDbConnection();
    
    // Check if agent has active tasks
    $taskStmt = $pdo->prepare("SELECT COUNT(*) FROM tasks WHERE assigned_agent_id = ? AND status IN ('pending', 'in_progress')");
    $taskStmt->execute([$input['id']]);
    $activeTasks = $taskStmt->fetchColumn();
    
    if ($activeTasks > 0) {
        sendResponse(false, null, null, 'Cannot delete agent with active tasks. Please reassign or complete tasks first.');
    }
    
    // Delete agent
    $stmt = $pdo->prepare("DELETE FROM agents WHERE id = ?");
    $stmt->execute([$input['id']]);
    
    if ($stmt->rowCount() > 0) {
        sendResponse(true, null, 'Agent deleted successfully');
    } else {
        sendResponse(false, null, null, 'Agent not found');
    }
    
} catch (Exception $e) {
    sendResponse(false, null, null, 'Failed to delete agent: ' . $e->getMessage());
}
?>