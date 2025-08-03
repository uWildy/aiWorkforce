<?php
require_once '../config/database.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $error = validateRequired($input, ['file_id', 'analysis_result']);
    if ($error) {
        sendResponse(false, null, null, $error);
    }
    
    $pdo = getDbConnection();
    
    $stmt = $pdo->prepare("
        UPDATE agent_files 
        SET analysis_result = ?, updated_at = NOW() 
        WHERE id = ?
    ");
    
    $stmt->execute([
        json_encode($input['analysis_result']),
        $input['file_id']
    ]);
    
    // Get updated file record
    $stmt = $pdo->prepare("SELECT * FROM agent_files WHERE id = ?");
    $stmt->execute([$input['file_id']]);
    $file = $stmt->fetch();
    
    sendResponse(true, $file, 'File analysis updated successfully');
    
} catch (Exception $e) {
    sendResponse(false, null, null, 'Failed to update file analysis: ' . $e->getMessage());
}
?>