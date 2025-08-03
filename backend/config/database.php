<?php
// Database configuration
define('DB_HOST', '127.0.0.1');
define('DB_USERNAME', 'root'); // Change to your MySQL username
define('DB_PASSWORD', ''); // Change to your MySQL password
define('DB_NAME', 'ai_workforce');

// Enable CORS for React frontend
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection
function getDbConnection() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USERNAME,
            DB_PASSWORD,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Database connection failed: ' . $e->getMessage()]);
        exit();
    }
}
//error log 
function logError($severity, $message, $userId = null, $source = null) {
  global $pdo;
  $stmt = $pdo->prepare("INSERT INTO error_logs (severity, message, user_id, source) VALUES (?, ?, ?, ?)");
  $stmt->execute([$severity, $message, $userId, $source]);
}

// Helper function to send JSON response
function sendResponse($success, $data = null, $message = null, $error = null) {
    $response = ['success' => $success];
    if ($data !== null) $response['data'] = $data;
    if ($message !== null) $response['message'] = $message;
    if ($error !== null) $response['error'] = $error;
    echo json_encode($response);
    exit;
}

/*function sendResponse($success, $data = null, $message = null, $error = null) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => $success,
        'data' => $data,
        'message' => $message,
        'error' => $error
    ]);
    exit();
}*/

// Helper function to validate required fields
function validateRequired($data, $fields) {
    foreach ($fields as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            return "Field '$field' is required";
        }
    }
    return null;
}
?>