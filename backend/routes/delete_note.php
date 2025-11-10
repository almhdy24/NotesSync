<?php
require "../cors.php";
require "../db.php";
require "../auth.php";

header("Content-Type: application/json");

try {
    $auth = new Auth($db);
    
    // Authentication
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
    
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['id'])) {
        http_response_code(400);
        echo json_encode(["error" => "Note ID is required"]);
        exit;
    }
    
    $user_id = $user['user_id'];
    $note_id = $data['id'];
    
    // Soft delete (mark as deleted)
    $stmt = $db->prepare("
        UPDATE notes 
        SET is_deleted = 1, updated_at = datetime('now') 
        WHERE id = ? AND user_id = ?
    ");
    $stmt->execute([$note_id, $user_id]);
    
    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(["success" => false, "error" => "Note not found"]);
        exit;
    }
    
    echo json_encode([
        "success" => true,
        "message" => "Note deleted successfully"
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>