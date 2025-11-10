<?php
require "cors.php";
require "db.php";

header("Content-Type: application/json");

$response = [
    "success" => true,
    "message" => "NotesSync API",
    "version" => "1.0.0",
    "endpoints" => [
        "POST /routes/register" => "Register new user",
        "POST /routes/login" => "User login",
        "GET /routes/notes_list" => "Get user notes (requires Authorization header)",
        "POST /routes/notes_add" => "Create new note (requires Authorization header)",
        "PUT /routes/update_note" => "Update note (requires Authorization header)",
        "DELETE /routes/delete_note" => "Delete note (requires Authorization header)"
    ],
    "timestamp" => date('Y-m-d H:i:s')
];

echo json_encode($response);
?>