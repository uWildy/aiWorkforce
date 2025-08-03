<?php
require_once '../config/database.php';

try {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    
    if (empty($authHeader) || !str_starts_with($authHeader, 'Bearer ')) {
        sendResponse(false, null, null, 'Authorization token required');
    }
    
    $sessionToken = substr($authHeader, 7);
    
    $pdo = getDbConnection();
    
    // Delete session
    $stmt = $pdo->prepare("DELETE FROM user_sessions WHERE session_token = ?");
    $stmt->execute([$sessionToken]);
    
    sendResponse(true, null, 'Logout successful');
    
} catch (Exception $e) {
    sendResponse(false, null, null, 'Logout failed: ' . $e->getMessage());
}
?>