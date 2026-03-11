<?php
/**
 * Session Management for JCI Zone 12
 * Handles user authentication sessions
 */

// Session configuration (must be set BEFORE session_start)
ini_set('session.cookie_httponly', 1);
ini_set('session.use_strict_mode', 1);
ini_set('session.cookie_lifetime', 0);

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Define session variables
define('SESSION_USER_ID', 'user_id');
define('SESSION_USER_EMAIL', 'user_email');
define('SESSION_USER_NAME', 'user_name');
define('SESSION_USER_TYPE', 'user_type');
define('SESSION_LOGIN_TIME', 'login_time');

/**
 * Check if user is logged in
 * @return bool
 */
function isLoggedIn() {
    return isset($_SESSION[SESSION_USER_ID]) && !empty($_SESSION[SESSION_USER_ID]);
}

/**
 * Get current user ID
 * @return int|null
 */
function getCurrentUserId() {
    return isset($_SESSION[SESSION_USER_ID]) ? $_SESSION[SESSION_USER_ID] : null;
}

/**
 * Get current user email
 * @return string|null
 */
function getCurrentUserEmail() {
    return isset($_SESSION[SESSION_USER_EMAIL]) ? $_SESSION[SESSION_USER_EMAIL] : null;
}

/**
 * Get current user name
 * @return string|null
 */
function getCurrentUserName() {
    return isset($_SESSION[SESSION_USER_NAME]) ? $_SESSION[SESSION_USER_NAME] : null;
}

/**
 * Get current user type
 * @return string|null
 */
function getCurrentUserType() {
    return isset($_SESSION[SESSION_USER_TYPE]) ? $_SESSION[SESSION_USER_TYPE] : null;
}

/**
 * Create user session after successful login
 * @param int $userId
 * @param string $email
 * @param string $name
 * @param string $userType
 */
function createUserSession($userId, $email, $name, $userType) {
    $_SESSION[SESSION_USER_ID] = $userId;
    $_SESSION[SESSION_USER_EMAIL] = $email;
    $_SESSION[SESSION_USER_NAME] = $name;
    $_SESSION[SESSION_USER_TYPE] = $userType;
    $_SESSION[SESSION_LOGIN_TIME] = time();
    
    // Regenerate session ID for security
    session_regenerate_id(true);
}

/**
 * Destroy user session (logout)
 */
function destroyUserSession() {
    // Unset all session variables
    $_SESSION = array();
    
    // Destroy the session
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    
    session_destroy();
}

/**
 * Redirect to login page if not logged in
 */
function requireLogin() {
    if (!isLoggedIn()) {
        header("Location: login.php");
        exit;
    }
}

/**
 * Redirect to dashboard if already logged in
 */
function redirectIfLoggedIn() {
    if (isLoggedIn()) {
        header("Location: dashboard.php");
        exit;
    }
}

/**
 * Check if session has expired (30 minutes)
 * @return bool
 */
function isSessionExpired() {
    if (!isset($_SESSION[SESSION_LOGIN_TIME])) {
        return true;
    }
    
    $sessionLifetime = 30 * 60; // 30 minutes in seconds
    return (time() - $_SESSION[SESSION_LOGIN_TIME]) > $sessionLifetime;
}

/**
 * Refresh session activity
 */
function refreshSession() {
    if (isset($_SESSION[SESSION_LOGIN_TIME])) {
        $_SESSION[SESSION_LOGIN_TIME] = time();
    }
}

