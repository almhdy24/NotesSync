<?php
require "../cors.php";
require "../db.php"; // This provides $db
require "../auth.php";

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Email and password are required"]);
    exit;
}

$auth = new Auth($db); // Pass the database connection
$result = $auth->login($data['email'], $data['password']);

if ($result['success']) {
    echo json_encode($result);
} else {
    http_response_code(401);
    echo json_encode($result);
}
?>