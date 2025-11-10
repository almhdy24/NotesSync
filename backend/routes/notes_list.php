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
        echo json_encode(["error" => "Authorization token required"]);
        exit;
    }
    
    $user = $auth->validateToken($token);
    if (!$user) {
        http_response_code(401);
        echo json_encode(["error" => "Invalid or expired token"]);
        exit;
    }
    
    $user_id = $user['user_id'];
    $since = $_GET['since'] ?? null;
    
    if ($since) {
        // Sync endpoint - get notes updated since given timestamp
        $stmt = $db->prepare("
            SELECT * FROM notes 
            WHERE user_id = ? AND updated_at > ? AND is_deleted = 0 
            ORDER BY updated_at DESC
        ");
        $stmt->execute([$user_id, $since]);
    } else {
        // Regular list endpoint
        $stmt = $db->prepare("
            SELECT * FROM notes 
            WHERE user_id = ? AND is_deleted = 0 
            ORDER BY updated_at DESC
        ");
        $stmt->execute([$user_id]);
    }
    
    $notes = $stmt->fetchAll();
    
    // Add sync metadata
    $response = [
        'success' => true,
        'notes' => $notes,
        'sync_timestamp' => date('Y-m-d H:i:s'),
        'total' => count($notes)
    ];
    
    echo json_encode($response);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>