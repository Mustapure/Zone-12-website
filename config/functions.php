<?php
/**
 * Authentication Functions for JCI Zone 12
 * Contains helper functions for user authentication
 */

require_once __DIR__ . '/database.php';
require_once __DIR__ . '/session.php';

/**
 * Register a new user
 * @param array $data User registration data
 * @return array Result with status and message
 */
function registerUser($data) {
    $db = getDB();
    
    // Validate input
    $requiredFields = ['first_name', 'last_name', 'email', 'password', 'confirm_password'];
    foreach ($requiredFields as $field) {
        if (!isset($data[$field]) || empty(trim($data[$field]))) {
            return ['status' => 'error', 'message' => ucfirst(str_replace('_', ' ', $field)) . ' is required'];
        }
    }
    
    // Check password match
    if ($data['password'] !== $data['confirm_password']) {
        return ['status' => 'error', 'message' => 'Passwords do not match'];
    }
    
    // Validate email
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        return ['status' => 'error', 'message' => 'Invalid email format'];
    }
    
    // Validate password strength
    if (strlen($data['password']) < 8) {
        return ['status' => 'error', 'message' => 'Password must be at least 8 characters'];
    }
    
    // Check if email already exists
    $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
    if (!$stmt) {
        return ['status' => 'error', 'message' => 'Database error (email check): ' . $db->error];
    }
    $stmt->bind_param("s", $data['email']);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $stmt->close();
        return ['status' => 'error', 'message' => 'Email already registered'];
    }
    $stmt->close();
    
    // Hash password
    $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
    
    // Generate verification token
    $verificationToken = bin2hex(random_bytes(32));
    
    // Get user type (default to individual)
    $userType = isset($data['user_type']) ? $data['user_type'] : 'individual';
    $chapterName = isset($data['chapter_name']) ? $data['chapter_name'] : '';
    $organizationName = isset($data['organization_name']) ? $data['organization_name'] : '';
    $phone = isset($data['phone']) ? $data['phone'] : '';
    
    // Insert user - check prepare success
    $stmt = $db->prepare("INSERT INTO users (first_name, last_name, email, password, phone, user_type, chapter_name, organization_name, verification_token) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    if (!$stmt) {
        return ['status' => 'error', 'message' => 'Database prepare failed: ' . $db->error];
    }
    if (!$stmt->bind_param("sssssssss", 
        $data['first_name'], 
        $data['last_name'], 
        $data['email'], 
        $hashedPassword,
        $phone,
        $userType,
        $chapterName,
        $organizationName,
        $verificationToken
    )) {
        $stmt->close();
        return ['status' => 'error', 'message' => 'Database bind failed: ' . $db->error];
    }
    
    if ($stmt->execute()) {
        $userId = $stmt->insert_id;
        $stmt->close();
        
        // Send verification email (in production, implement email sending)
        // For now, we'll auto-verify for demonstration
        $db->query("UPDATE users SET email_verified = 1 WHERE id = $userId");
        
        return ['status' => 'success', 'message' => 'Registration successful! You can now login.', 'user_id' => $userId];
    } else {
        $error = $stmt->error;
        $stmt->close();
        return ['status' => 'error', 'message' => 'Registration failed: ' . $error];
    }
}

/**
 * Authenticate user login
 * @param string $email User email
 * @param string $password User password
 * @return array Result with status and message
 */
function loginUser($email, $password) {
    $db = getDB();
    
    // Validate input
    if (empty($email) || empty($password)) {
        return ['status' => 'error', 'message' => 'Email and password are required'];
    }
    
    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return ['status' => 'error', 'message' => 'Invalid email format'];
    }
    
    // Get user from database
    $stmt = $db->prepare("SELECT id, first_name, last_name, email, password, user_type, email_verified FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        $stmt->close();
        return ['status' => 'error', 'message' => 'Invalid email or password'];
    }
    
    $user = $result->fetch_assoc();
    $stmt->close();
    
    // Check if email is verified
    if (!$user['email_verified']) {
        return ['status' => 'error', 'message' => 'Please verify your email before logging in'];
    }
    
    // Verify password
    if (!password_verify($password, $user['password'])) {
        return ['status' => 'error', 'message' => 'Invalid email or password'];
    }
    
    return [
        'status' => 'success', 
        'message' => 'Login successful',
        'user' => [
            'id' => $user['id'],
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name'],
            'email' => $user['email'],
            'user_type' => $user['user_type']
        ]
    ];
}

/**
 * Get user by email
 * @param string $email User email
 * @return array|null User data or null if not found
 */
function getUserByEmail($email) {
    $db = getDB();
    
    $stmt = $db->prepare("SELECT id, first_name, last_name, email, password, user_type, email_verified FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        $stmt->close();
        return null;
    }
    
    $user = $result->fetch_assoc();
    $stmt->close();
    
    return $user;
}
