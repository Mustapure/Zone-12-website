<?php
/**
 * Logout Handler for JCI Zone 12
 * Destroys user session and redirects to login
 */

session_start();

// Include required files
require_once 'config/database.php';
require_once 'config/functions.php';
require_once 'config/session.php';

// Destroy the session
destroyUserSession();

// Redirect to login page
header("Location: login.php");
exit();
?>
