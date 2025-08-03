<?php
require_once '../config/database.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Get files for an agent
        $agentId = $_GET['agent_id'] ?? null;
        
        if (!$agentId) {
            sendResponse(false, null, null, 'Agent ID is required');
        }
        
        $pdo = getDbConnection();
        
        $stmt = $pdo->prepare("
            SELECT * FROM agent_files 
            WHERE agent_id = ? 
            ORDER BY uploaded_at DESC
        ");
        $stmt->execute([$agentId]);
        $files = $stmt->fetchAll();
        
        sendResponse(true, $files);
        
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Upload file metadata (actual file should be uploaded to Supabase)
        $error = validateRequired($input, ['agent_id', 'file_name', 'file_size', 'mime_type', 'file_path']);
        if ($error) {
            sendResponse(false, null, null, $error);
        }
        
        $pdo = getDbConnection();
        
        $stmt = $pdo->prepare("
            INSERT INTO agent_files (agent_id, file_name, file_size, mime_type, file_path, analysis_result) 
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        
        $analysisResult = isset($input['analysis_result']) ? json_encode($input['analysis_result']) : null;
        
        $stmt->execute([
            $input['agent_id'],
            $input['file_name'],
            $input['file_size'],
            $input['mime_type'],
            $input['file_path'],
            $analysisResult
        ]);
        
        $fileId = $pdo->lastInsertId();
        
        // Get the created file record
        $stmt = $pdo->prepare("SELECT * FROM agent_files WHERE id = ?");
        $stmt->execute([$fileId]);
        $file = $stmt->fetch();
        
        // Update agent files count
        $stmt = $pdo->prepare("UPDATE agents SET files_count = files_count + 1 WHERE id = ?");
        $stmt->execute([$input['agent_id']]);
        
        sendResponse(true, $file, 'File uploaded successfully');
        
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        // Delete file
        $fileId = $_GET['file_id'] ?? null;
        
        if (!$fileId) {
            sendResponse(false, null, null, 'File ID is required');
        }
        
        $pdo = getDbConnection();
        
        // Get agent_id before deleting
        $stmt = $pdo->prepare("SELECT agent_id FROM agent_files WHERE id = ?");
        $stmt->execute([$fileId]);
        $agentId = $stmt->fetchColumn();
        
        // Delete file record
        $stmt = $pdo->prepare("DELETE FROM agent_files WHERE id = ?");
        $stmt->execute([$fileId]);
        
        if ($agentId) {
            // Update agent files count
            $stmt = $pdo->prepare("UPDATE agents SET files_count = files_count - 1 WHERE id = ?");
            $stmt->execute([$agentId]);
        }
        
        sendResponse(true, null, 'File deleted successfully');
    }
    
} catch (Exception $e) {
    sendResponse(false, null, null, 'Failed to process file operation: ' . $e->getMessage());
}
?>