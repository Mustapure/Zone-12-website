<?php
/**
 * Logout Handler for JCI Zone 12
 * Destroys user session and redirects to login gateway
 */

require_once 'config/session.php';

// Destroy session
destroyUserSession();

// Start fresh session to store logout notification
session_start();
$_SESSION['success'] = "You have been successfully signed out. Have a great day!";

header("Location: login.php");
exit();
