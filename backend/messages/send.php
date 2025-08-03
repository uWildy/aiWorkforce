<?php
require_once '../config/database.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input['content'])) {
        sendResponse(false, null, null, 'Message content is required');
    }
    
    if (empty($input['channel'])) {
        sendResponse(false, null, null, 'Channel is required');
    }
    
    $pdo = getDbConnection();
    
    $stmt = $pdo->prepare("
        INSERT INTO messages (sender_id, channel, content, message_type, metadata, created_at) 
        VALUES (?, ?, ?, ?, ?, NOW())
    ");
    
    $messageType = $input['message_type'] ?? 'text';
    $metadata = isset($input['metadata']) ? json_encode($input['metadata']) : null;
    
    $stmt->execute([
        $input['sender_id'] ?? null,
        $input['channel'],
        $input['content'],
        $messageType,
        $metadata
    ]);
    
    $messageId = $pdo->lastInsertId();
    
    // Fetch the created message with sender details
    $fetchStmt = $pdo->prepare("
        SELECT m.*, a.name as sender_name 
        FROM messages m 
        LEFT JOIN agents a ON m.sender_id = a.id 
        WHERE m.id = ?
    ");
    $fetchStmt->execute([$messageId]);
    $message = $fetchStmt->fetch();
    
    sendResponse(true, $message, 'Message sent successfully');
    
} catch (Exception $e) {
    sendResponse(false, null, null, 'Failed to send message: ' . $e->getMessage());
}
?>