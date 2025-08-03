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
    
    // Verify session
    $stmt = $pdo->prepare("
        SELECT u.id, u.username, u.email, u.role, u.is_active, s.expires_at
        FROM users u 
        JOIN user_sessions s ON u.id = s.user_id 
        WHERE s.session_token = ? AND s.expires_at > NOW() AND u.is_active = 1
    ");
    $stmt->execute([$sessionToken]);
    $result = $stmt->fetch();
    
    if (!$result) {
        sendResponse(false, null, null, 'Invalid or expired session');
    }
    
    // Update session expiry
    $updateStmt = $pdo->prepare("
        UPDATE user_sessions 
        SET expires_at = DATE_ADD(NOW(), INTERVAL 24 HOUR) 
        WHERE session_token = ?
    ");
    $updateStmt->execute([$sessionToken]);
    
    sendResponse(true, [
        'user' => [
            'id' => $result['id'],
            'username' => $result['username'],
            'email' => $result['email'],
            'role' => $result['role']
        ],
        'expires_at' => date('Y-m-d H:i:s', strtotime('+24 hours'))
    ]);
    
} catch (Exception $e) {
    sendResponse(false, null, null, 'Session verification failed: ' . $e->getMessage());
}
?>