<?php
require_once '../config/database.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');


try {
  $pdo = getDbConnection();
      $stmt = $pdo->prepare("SELECT *FROM error_logs");
 


  $stmt->execute();
  $errors = $stmt->fetchAll();
  $agents = $stmt->fetchAll();
   sendResponse(true, $errors);

} catch (Exception $e) {
  http_response_code(500);
  // In staging, you might `echo $e->getMessage();`
  sendResponse(false, null, null, 'Failed to fetch agents: ' . $e->getMessage());
}

?>