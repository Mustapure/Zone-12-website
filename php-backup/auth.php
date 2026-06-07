<?php
/**
 * Authentication Handler for JCI Zone 12
 * Processes login submissions and routes users to their specific portals
 */

require_once 'config/database.php';
require_once 'config/session.php';
require_once 'config/functions.php';

// Start session if not active
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $selectedPortal = $_POST['selected_portal'] ?? 'user';
    
    // Authenticate
    $result = loginUser($email, $password);
    
    if ($result['status'] === 'success') {
        $user = $result['user'];
        
        // Re-verify the status is active
        $db = getDB();
        $stmt = $db->prepare("SELECT status FROM users WHERE id = ?");
        $stmt->bind_param("i", $user['id']);
        $stmt->execute();
        $statusRes = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        
        if ($statusRes && $statusRes['status'] !== 'active') {
            $_SESSION['error'] = "Your account is currently " . $statusRes['status'] . ". Please contact the administrator.";
            header("Location: login.php");
            exit();
        }
        
        // Create session
        createUserSession(
            $user['id'], 
            $user['email'], 
            $user['first_name'] . ' ' . $user['last_name'], 
            $user['user_type'],
            $user['role']
        );
        
        // Handle "Remember Me" cookie
        if (isset($_POST['remember'])) {
            setcookie("user_login", $email, time() + (86400 * 30), "/");
        }
        
        // Dynamic Role-Based Routing
        $_SESSION['success'] = "Welcome back, " . htmlspecialchars($user['first_name']) . "!";
        
        if ($user['role'] === 'admin') {
            header("Location: dashboard-admin.php");
        } else if ($user['role'] === 'vendor') {
            header("Location: dashboard-vendor.php");
        } else {
            header("Location: dashboard-user.php");
        }
        exit();
        
    } else {
        // Authentication failed
        $_SESSION['error'] = $result['message'];
        header("Location: login.php");
        exit();
    }
} else {
    // Redirect to login if accessed directly
    header("Location: login.php");
    exit();
}
