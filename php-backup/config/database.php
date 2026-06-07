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
    
    // Auto-migration: Check if users table exists and has 'role' column
    $tableCheck = $conn->query("SHOW TABLES LIKE 'users'");
    if ($tableCheck && $tableCheck->num_rows > 0) {
        $columnCheck = $conn->query("SHOW COLUMNS FROM users LIKE 'role'");
        if ($columnCheck && $columnCheck->num_rows == 0) {
            // Add role column
            $conn->query("ALTER TABLE users ADD COLUMN role ENUM('user', 'verified_user', 'vendor', 'admin') DEFAULT 'user' AFTER user_type");
        }
        
        $reqCheck = $conn->query("SHOW COLUMNS FROM users LIKE 'verification_requested'");
        if ($reqCheck && $reqCheck->num_rows == 0) {
            // Add verification_requested column
            $conn->query("ALTER TABLE users ADD COLUMN verification_requested TINYINT(1) DEFAULT 0 AFTER email_verified");
        }
    } else {
        // If the table doesn't exist, we run a simplified table creation to ensure setup
        $conn->query("CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            user_type ENUM('individual', 'educational', 'corporate', 'business') DEFAULT 'individual',
            role ENUM('user', 'verified_user', 'vendor', 'admin') DEFAULT 'user',
            chapter_name VARCHAR(100),
            organization_name VARCHAR(150),
            status ENUM('active', 'inactive', 'pending') DEFAULT 'active',
            email_verified TINYINT(1) DEFAULT 0,
            verification_requested TINYINT(1) DEFAULT 0,
            verification_token VARCHAR(255),
            reset_token VARCHAR(255),
            reset_token_expire DATETIME,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )");
    }

    // Ensure businesses table exists (for vendors)
    $conn->query("CREATE TABLE IF NOT EXISTS businesses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        business_name VARCHAR(150) NOT NULL,
        owner_name VARCHAR(100) NOT NULL,
        owner_jci_name VARCHAR(100),
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        website VARCHAR(200),
        address TEXT,
        city VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL,
        description TEXT,
        tags VARCHAR(255),
        status ENUM('active', 'pending', 'inactive') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )");

    // Ensure contact submissions table exists
    $conn->query("CREATE TABLE IF NOT EXISTS contact_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        city VARCHAR(100),
        message TEXT,
        status ENUM('new', 'contacted', 'closed') DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

    // Ensure default Admin user exists
    $adminEmail = 'admin@jcizone12.org';
    $adminCheck = $conn->query("SELECT id, role FROM users WHERE email = '$adminEmail'");
    if ($adminCheck && $adminCheck->num_rows == 0) {
        $adminPassword = password_hash('Admin@123', PASSWORD_DEFAULT);
        $conn->query("INSERT INTO users (first_name, last_name, email, password, user_type, role, email_verified, status) 
                      VALUES ('Admin', 'User', '$adminEmail', '$adminPassword', 'individual', 'admin', 1, 'active')");
    } else if ($adminCheck) {
        $adminUser = $adminCheck->fetch_assoc();
        if ($adminUser['role'] !== 'admin') {
            $conn->query("UPDATE users SET role = 'admin' WHERE email = '$adminEmail'");
        }
    }
    
} catch (Exception $e) {
    error_log("Database connection error: " . $e->getMessage());
    die("Database connection failed. Please check your configuration: " . $e->getMessage());
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

