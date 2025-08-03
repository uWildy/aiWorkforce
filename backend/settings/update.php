<?php
require_once '../config/database.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (empty($input)) {
        sendResponse(false, null, null, 'No settings data provided');
    }
    
    $pdo = getDbConnection();
    
    // Update each settings section
    foreach ($input as $key => $value) {
        $stmt = $pdo->prepare("
            INSERT INTO settings (setting_key, setting_value, updated_at) 
            VALUES (?, ?, NOW()) 
            ON DUPLICATE KEY UPDATE 
            setting_value = VALUES(setting_value), 
            updated_at = NOW()
        ");
        
        $stmt->execute([$key, json_encode($value)]);
    }
    
    sendResponse(true, null, 'Settings updated successfully');
    
} catch (Exception $e) {
    sendResponse(false, null, null, 'Failed to update settings: ' . $e->getMessage());
}
?>