<?php
require_once '../config/database.php';

try {
    $pdo = getDbConnection();
    
    $stmt = $pdo->query("SELECT setting_key, setting_value FROM settings");
    $rows = $stmt->fetchAll();
    
    $settings = [
        'apiKeys' => ['xai' => '', 'openai' => '', 'anthropic' => '', 'google' => ''],
        'aiModels' => ['defaultModel' => 'grok-4', 'temperature' => 0.7, 'maxTokens' => 4000],
        'database' => ['host' => 'localhost', 'username' => '', 'database' => 'ai_workforce'],
        'security' => ['enableAuthentication' => false, 'sessionTimeout' => 60, 'rateLimiting' => true],
        'notifications' => ['emailNotifications' => true, 'taskUpdates' => true, 'systemAlerts' => true],
        'uiTheme' => ['colorScheme' => 'obsidian', 'accentColor' => '#8B5CF6', 'sidebarStyle' => 'dark', 'compactMode' => false]
    ];
    
    foreach ($rows as $row) {
        $settings[$row['setting_key']] = json_decode($row['setting_value'], true);
    }
    
    sendResponse(true, $settings);
    
} catch (Exception $e) {
    sendResponse(false, null, null, 'Failed to fetch settings: ' . $e->getMessage());
}
?>