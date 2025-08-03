<?php
require_once '../config/database.php';

try {
    if (!isset($_FILES['file'])) {
        sendResponse(false, null, null, 'No file uploaded');
    }
    
    $file = $_FILES['file'];
    $agentId = $_POST['agent_id'] ?? null;
    $description = $_POST['description'] ?? '';
    
    // Validate file
    if ($file['error'] !== UPLOAD_ERR_OK) {
        sendResponse(false, null, null, 'File upload error: ' . $file['error']);
    }
    
    // File size limit (50MB)
    $maxSize = 50 * 1024 * 1024;
    if ($file['size'] > $maxSize) {
        sendResponse(false, null, null, 'File too large. Maximum size is 50MB');
    }
    
    // Allowed file types
    $allowedTypes = [
        'application/pdf',
        'application/zip',
        'application/x-zip-compressed',
        'text/plain',
        'text/csv',
        'application/json',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    if (!in_array($mimeType, $allowedTypes)) {
        sendResponse(false, null, null, 'File type not allowed');
    }
    
    // Create upload directory if it doesn't exist
    $uploadDir = '../uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    // Generate unique filename
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid() . '_' . time() . '.' . $extension;
    $filepath = $uploadDir . $filename;
    
    // Move uploaded file
    if (!move_uploaded_file($file['tmp_name'], $filepath)) {
        sendResponse(false, null, null, 'Failed to save file');
    }
    
    // Save file metadata to database
    $pdo = getDbConnection();
    $stmt = $pdo->prepare("
        INSERT INTO files (agent_id, filename, original_name, file_path, file_size, mime_type, description, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    ");
    
    $stmt->execute([
        $agentId,
        $filename,
        $file['name'],
        $filepath,
        $file['size'],
        $mimeType,
        $description
    ]);
    
    $fileId = $pdo->lastInsertId();
    
    // Return file metadata
    $fileData = [
        'id' => $fileId,
        'filename' => $filename,
        'original_name' => $file['name'],
        'file_size' => $file['size'],
        'mime_type' => $mimeType,
        'description' => $description,
        'agent_id' => $agentId
    ];
    
    sendResponse(true, $fileData, 'File uploaded successfully');
    
} catch (Exception $e) {
    sendResponse(false, null, null, 'Failed to upload file: ' . $e->getMessage());
}
?>