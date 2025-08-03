<?php
require_once '../config/database.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Define a helper function for consistent responses (since sendResponse was undefined)


try {
    $pdo = getDbConnection();  // Assuming this returns PDO from database.php
    
    // Fixed SQL syntax: Added space between * and FROM
    $stmt = $pdo->prepare("SELECT * FROM error_logs");
    
    $stmt->execute();
    
    // Fetch once into $errors (removed redundant $agents fetch)
    $errors = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Send array data (empty [] if no rows)
    sendResponse(true, $errors, 'Errors fetched successfully');
    
} catch (Exception $e) {
    http_response_code(500);
    sendResponse(false, null, null, 'Failed to fetch errors: ' . $e->getMessage());
}
?>