<?php
require_once '../config/database.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['username']) || empty($input['password'])) {
        sendResponse(false, null, null, 'Username and password are required');
    }
    
    $pdo = getDbConnection();
    
    // Find user
    $stmt = $pdo->prepare("SELECT id, username, email, password_hash, role, is_active FROM users WHERE username = ? OR email = ?");
    $stmt->execute([$input['username'], $input['username']]);
    $user = $stmt->fetch();
    
    if (!$user) {
        sendResponse(false, null, null, 'Invalid credentials');
    }
    
    if (!$user['is_active']) {
        sendResponse(false, null, null, 'Account is disabled');
    }
    
    // Verify password
    if (!password_verify($input['password'], $user['password_hash'])) {
        sendResponse(false, null, null, 'Invalid credentials');
    }
    
    // Generate session token
    $sessionToken = bin2hex(random_bytes(32));
    $expiresAt = date('Y-m-d H:i:s', strtotime('+24 hours'));
    
    // Create session
    $sessionStmt = $pdo->prepare("
        INSERT INTO user_sessions (user_id, session_token, expires_at) 
        VALUES (?, ?, ?)
    ");
    $sessionStmt->execute([$user['id'], $sessionToken, $expiresAt]);
    
    // Clean up expired sessions
    $cleanupStmt = $pdo->prepare("DELETE FROM user_sessions WHERE expires_at < NOW()");
    $cleanupStmt->execute();
    
    sendResponse(true, [
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'role' => $user['role']
        ],
        'session_token' => $sessionToken,
        'expires_at' => $expiresAt
    ], 'Login successful');
    
} catch (Exception $e) {
    sendResponse(false, null, null, 'Login failed: ' . $e->getMessage());
}
?>