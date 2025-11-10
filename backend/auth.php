<?php

class Auth {
    private $db;
    
    public function __construct($db) {
        $this->db = $db;
    }
    
    public function generateToken($length = 32) {
        return bin2hex(random_bytes($length));
    }
    
    public function createSession($user_id) {
        $token = $this->generateToken();
        $expires_at = date('Y-m-d H:i:s', strtotime('+30 days'));
        
        $stmt = $this->db->prepare("
            INSERT INTO sessions (user_id, token, expires_at) 
            VALUES (?, ?, ?)
        ");
        $stmt->execute([$user_id, $token, $expires_at]);
        
        return $token;
    }
    
    public function validateToken($token) {
    $stmt = $this->db->prepare("
        SELECT u.id as user_id, u.email 
        FROM sessions s 
        JOIN users u ON s.user_id = u.id 
        WHERE s.token = ? AND s.expires_at > datetime('now')
    ");
    $stmt->execute([$token]);
    return $stmt->fetch();
}
    
    public function login($email, $password) {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if ($user && password_verify($password, $user['password'])) {
            $token = $this->createSession($user['id']);
            return [
                'success' => true,
                'token' => $token,
                'user' => [
                    'id' => $user['id'],
                    'email' => $user['email']
                ]
            ];
        }
        
        return ['success' => false, 'error' => 'Invalid credentials'];
    }
}
?>