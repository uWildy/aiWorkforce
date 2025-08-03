<?php
require_once '../config/database.php';

try {
    $pdo = getDbConnection();
    
    $channel = $_GET['channel'] ?? null;
    $agentId = $_GET['agent'] ?? null;
    $limit = min((int)($_GET['limit'] ?? 50), 100);
    $offset = max((int)($_GET['offset'] ?? 0), 0);
    
    $sql = "SELECT m.*, a.name as sender_name 
            FROM messages m 
            LEFT JOIN agents a ON m.sender_id = a.id 
            WHERE 1=1";
    $params = [];
    
    if ($channel) {
        $sql .= " AND m.channel = ?";
        $params[] = $channel;
    }
    
    if ($agentId) {
        $sql .= " AND (m.sender_id = ? OR m.channel = ?)";
        $params[] = $agentId;
        $params[] = "agent_$agentId";
    }
    
    $sql .= " ORDER BY m.created_at DESC LIMIT ? OFFSET ?";
    $params[] = $limit;
    $params[] = $offset;
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $messages = $stmt->fetchAll();
    
    // Get total count
    $countSql = "SELECT COUNT(*) FROM messages WHERE 1=1";
    $countParams = [];
    
    if ($channel) {
        $countSql .= " AND channel = ?";
        $countParams[] = $channel;
    }
    
    if ($agentId) {
        $countSql .= " AND (sender_id = ? OR channel = ?)";
        $countParams[] = $agentId;
        $countParams[] = "agent_$agentId";
    }
    
    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute($countParams);
    $total = $countStmt->fetchColumn();
    
    sendResponse(true, [
        'messages' => $messages,
        'pagination' => [
            'total' => (int)$total,
            'limit' => $limit,
            'offset' => $offset,
            'has_more' => ($offset + $limit) < $total
        ]
    ]);
    
} catch (Exception $e) {
    sendResponse(false, null, null, 'Failed to fetch messages: ' . $e->getMessage());
}
?>