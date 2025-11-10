<?php
// Simple database connection without classes
$dbFile = __DIR__ . "/data/notesync.db";

if (!file_exists($dbFile)) {
    require __DIR__ . "/init_db.php";
}

try {
    $db = new PDO("sqlite:" . $dbFile);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}
?>