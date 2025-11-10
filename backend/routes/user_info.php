<?php
require "../cors.php";
require "../db.php";
require "../auth.php";

header("Content-Type: application/json");

try {
    $auth = new Auth($db);
    
    // Get authorization header
    $headers = getallheaders();
    $token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;
    
    if (!$token) {
        http_response_code(401);
        echo json_encode(["success" => false, "error" => "Authorization token required"]);
        exit;
    }
    
    $user = $auth->validateToken($token);
    if (!$user) {
        http_response_code(401);
        echo json_encode(["success" => false, "error" => "Invalid or expired token"]);
        exit;
    }
    
    // Return user information
    echo json_encode([
        "success" => true,
        "user" => [
            "id" => $user['user_id'],
            "email" => $user['email']
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>