<?php
$dbFile = __DIR__ . "/data/notesync.db";
if (!is_dir(__DIR__ . "/data")) mkdir(__DIR__ . "/data", 0777, true);

$db = new PDO("sqlite:" . $dbFile);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// --- Enhanced Tables ---
$db->exec("
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT 0,
    sync_id TEXT UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_updated ON notes(updated_at);
CREATE INDEX IF NOT EXISTS idx_notes_sync ON notes(sync_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
");

// --- Enhanced Dummy Data with Password Hashing ---
$password1 = password_hash('1234', PASSWORD_DEFAULT);
$password2 = password_hash('abcd', PASSWORD_DEFAULT);

$db->exec("
INSERT OR IGNORE INTO users (email, password) VALUES
('john@example.com', '$password1'),
('sara@example.com', '$password2');
");

// --- Enhanced Dummy Notes ---
$db->exec("
INSERT OR IGNORE INTO notes (user_id, title, content, sync_id) VALUES
(1, 'Grocery List', 'Milk, Eggs, Bread, and Butter', 'sync_1'),
(1, 'Study Plan', 'Finish microbiology chapters 3–5 this week', 'sync_2'),
(1, 'Workout Routine', 'Morning jog + pushups and squats', 'sync_3'),
(1, 'Project Idea', 'Build a personal finance tracker app', 'sync_4'),
(1, 'Book Notes', 'Quotes from \"Atomic Habits\"', 'sync_5'),
(2, 'Trip Prep', 'Passport, charger, and tickets for Khartoum trip', 'sync_6'),
(2, 'Client Meeting', 'Discuss React integration with backend', 'sync_7'),
(2, 'Birthday Reminder', 'Mom''s birthday on 22 Nov 🎂', 'sync_8'),
(2, 'Bug Fixes', 'Resolve PHP upload permission issues', 'sync_9'),
(2, 'App Feature List', 'Add dark mode and offline sync', 'sync_10');
");

echo "✅ Database initialized with enhanced schema and dummy data at $dbFile\n";
?>