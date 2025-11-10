<?php
require "../cors.php";
require "../db.php"; // This provides $db

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Email and password are required"]);
    exit;
}

$email = filter_var($data['email'], FILTER_VALIDATE_EMAIL);
$password = $data['password'];

if (!$email) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Invalid email format"]);
    exit;
}

if (strlen($password) < 4) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Password must be at least 4 characters"]);
    exit;
}

try {
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    $stmt = $db->prepare("INSERT INTO users (email, password) VALUES (?, ?)");
    $stmt->execute([$email, $hashed_password]);
    
    $user_id = $db->lastInsertId();
    
    echo json_encode([
        "success" => true,
        "message" => "User registered successfully",
        "user_id" => $user_id
    ]);
    
} catch (Exception $e) {
    if (strpos($e->getMessage(), 'UNIQUE constraint failed') !== false) {
        http_response_code(409);
        echo json_encode(["success" => false, "error" => "Email already exists"]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
}
?>