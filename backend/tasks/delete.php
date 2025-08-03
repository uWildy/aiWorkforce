<?php
require_once '../config/database.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['id'])) {
        sendResponse(false, null, null, 'Task ID is required');
    }
    
    $pdo = getDbConnection();
    
    $stmt = $pdo->prepare("DELETE FROM tasks WHERE id = ?");
    $stmt->execute([$input['id']]);
    
    if ($stmt->rowCount() > 0) {
        sendResponse(true, null, 'Task deleted successfully');
    } else {
        sendResponse(false, null, null, 'Task not found');
    }
    
} catch (Exception $e) {
    sendResponse(false, null, null, 'Failed to delete task: ' . $e->getMessage());
}
?>