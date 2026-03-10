<?php
/**
 * Database Configuration for JCI Zone 12
 * Handles connection to MySQL database
 */

// Database credentials
define('DB_HOST', 'localhost');
define('DB_NAME', 'jci_zone12');
define('DB_USER', 'root');
define('DB_PASS', '');

// Global connection variable
$conn = null;

try {
    // Connect to MySQL
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS);
    
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    
    // Create database if not exists
    $conn->query("CREATE DATABASE IF NOT EXISTS " . DB_NAME);
    $conn->select_db(DB_NAME);
    
} catch (Exception $e) {
    error_log("Database connection error: " . $e->getMessage());
    die("Database connection failed. Please check your configuration.");
}

/**
 * Get database connection instance
 * @return mysqli
 */
function getDB() {
    global $conn;
    return $conn;
}

/**
 * Close database connection
 */
function closeDB() {
    global $conn;
    if ($conn) {
        $conn->close();
    }
}

