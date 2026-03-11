<?php
session_start();

// Mock Database Credentials
$valid_email = "admin@jci.cc";
$valid_password = "password123"; // In reality, use password_hash()

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Basic Validation
    if ($email === $valid_email && $password === $valid_password) {
        // Success! Set session
        $_SESSION['user_id'] = 1;
        $_SESSION['user_name'] = "JCI Leader";
        
        // Handle "Remember Me" cookie
        if (isset($_POST['remember'])) {
            setcookie("user_login", $email, time() + (86400 * 30), "/"); // 30 days
        }

        header("Location: dashboard.php");
        exit();
    } else {
        // Failure
        $_SESSION['error'] = "Invalid email or password.";
        header("Location: login.php");
        exit();
    }
}
?>d