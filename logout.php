<?php
// Logout removed.
http_response_code(410);
echo "Logout has been disabled.";
exit;


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
