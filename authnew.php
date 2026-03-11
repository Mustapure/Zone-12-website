<?php
/**
 * Authentication Handler for JCI Zone 12
 * Processes login form submission
 */

session_start();

// Include required files
require_once 'config/database.php';
require_once 'config/functions.php';
require_once 'config/session.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    
    // Validate input
    if (empty($email) || empty($password)) {
        $_SESSION['error'] = "Email and password are required.";
        header("Location: login.php");
        exit();
    }
    
    // Authenticate user using database
    $result = loginUser($email, $password);
    
    if ($result['status'] === 'success') {
        // Get user data
        $user = getUserByEmail($email);
        
        if ($user) {
            // Create session
            createUserSession(
                $user['id'], 
                $user['email'], 
                $user['first_name'] . ' ' . $user['last_name'], 
                $user['user_type']
            );
            
            // Handle "Remember Me" cookie
            if (isset($_POST['remember'])) {
                setcookie("user_login", $email, time() + (86400 * 30), "/");
            }
            
            header("Location: dashboard.php");
            exit();
        }
    } else {
        // Login failed - store error and redirect
        $_SESSION['error'] = $result['message'];
        header("Location: login.php");
        exit();
    }
} else {
    // Not a POST request, redirect to login
    header("Location: login.php");
    exit();
}
?>
