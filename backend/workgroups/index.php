<?php
require_once '../config/database.php';

try {
    $pdo = getDbConnection();
    
    $stmt = $pdo->query("
        SELECT w.*, 
               COUNT(DISTINCT JSON_EXTRACT(agent_ids, '$[*]')) as agent_count,
               COUNT(DISTINCT JSON_EXTRACT(task_ids, '$[*]')) as task_count
        FROM workgroups w 
        GROUP BY w.id 
        ORDER BY w.created_at DESC
    ");
    
    $workgroups = $stmt->fetchAll();
    
    // Decode JSON fields
    foreach ($workgroups as &$workgroup) {
        $workgroup['agent_ids'] = json_decode($workgroup['agent_ids'] ?? '[]', true);
        $workgroup['task_ids'] = json_decode($workgroup['task_ids'] ?? '[]', true);
    }
    
    sendResponse(true, $workgroups);
    
} catch (Exception $e) {
    sendResponse(false, null, null, 'Failed to fetch workgroups: ' . $e->getMessage());
}
?>