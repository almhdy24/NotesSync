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
        echo json_encode(["success" => false, "error" => "Authorization token required"]);
        exit;
    }
    
    $user = $auth->validateToken($token);
    if (!$user) {
        http_response_code(401);
        echo json_encode(["success" => false, "error" => "Invalid or expired token"]);
        exit;
    }
    
    $data = json_decode(file_get_contents("php://input"), true);
    
    // More flexible validation - require either title or content
    if (!isset($data['title']) && !isset($data['content'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Note must have either title or content"]);
        exit;
    }
    
    $user_id = $user['user_id'];
    $title = trim($data['title'] ?? '');
    $content = trim($data['content'] ?? '');
    $sync_id = $data['sync_id'] ?? uniqid('sync_');
    
    // If title is empty but content exists, use first few words of content as title
    if (empty($title) && !empty($content)) {
        $title = substr($content, 0, 50);
        if (strlen($content) > 50) {
            $title .= '...';
        }
    }
    
    $stmt = $db->prepare("
        INSERT INTO notes (user_id, title, content, sync_id, updated_at) 
        VALUES (?, ?, ?, ?, datetime('now'))
    ");
    
    $stmt->execute([$user_id, $title, $content, $sync_id]);
    
    $note_id = $db->lastInsertId();
    
    // Return the created note
    $stmt = $db->prepare("SELECT * FROM notes WHERE id = ?");
    $stmt->execute([$note_id]);
    $note = $stmt->fetch();
    
    echo json_encode([
        "success" => true, 
        "note" => $note,
        "message" => "Note created successfully"
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>