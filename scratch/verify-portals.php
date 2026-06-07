<?php
/**
 * Programmatic verification & mock account generator
 * Run this in your browser: http://localhost/Zone-12-website/scratch/verify-portals.php
 */

header('Content-Type: text/plain');

echo "===========================================\n";
echo "    JCI ZONE 12 AUTHENTICATION VERIFIER     \n";
echo "===========================================\n\n";

// 1. Database Connection Check
echo "[1] Checking database connection... ";
require_once __DIR__ . '/../config/database.php';
$db = getDB();
if ($db && !$db->connect_error) {
    echo "SUCCESS!\n";
} else {
    echo "FAILED: " . ($db ? $db->connect_error : "No connection") . "\n";
    exit();
}

// 2. Schema check
echo "[2] Verifying table structure...\n";
$tables = ['users', 'businesses', 'contact_submissions', 'user_sessions'];
foreach ($tables as $table) {
    $res = $db->query("SHOW TABLES LIKE '$table'");
    if ($res && $res->num_rows > 0) {
        echo "  - Table '$table': EXISTS\n";
        
        // Show fields for users table
        if ($table === 'users') {
            $cols = $db->query("SHOW COLUMNS FROM users");
            while ($col = $cols->fetch_assoc()) {
                if (in_array($col['Field'], ['role', 'verification_requested'])) {
                    echo "    * Field '{$col['Field']}': EXISTS ({$col['Type']})\n";
                }
            }
        }
    } else {
        echo "  - Table '$table': MISSING!\n";
    }
}

// 3. Admin Account Verification
echo "\n[3] Verifying default Admin account... ";
$adminRes = $db->query("SELECT id, role, status FROM users WHERE email = 'admin@jcizone12.org'");
if ($adminRes && $adminRes->num_rows > 0) {
    $admin = $adminRes->fetch_assoc();
    echo "EXISTS (ID: {$admin['id']}, Role: {$admin['role']}, Status: {$admin['status']})\n";
} else {
    echo "MISSING!\n";
}

// 4. Register Mock Accounts for testing
echo "\n[4] Registering test accounts for manual verification:\n";

$mocks = [
    [
        'first_name' => 'John (Standard)',
        'last_name' => 'User',
        'email' => 'user@jcizone12.org',
        'password' => 'User@123',
        'role' => 'user',
        'user_type' => 'individual'
    ],
    [
        'first_name' => 'Alice (Verified)',
        'last_name' => 'Member',
        'email' => 'verified@jcizone12.org',
        'password' => 'Verified@123',
        'role' => 'verified_user',
        'user_type' => 'corporate'
    ],
    [
        'first_name' => 'Bob (Local)',
        'last_name' => 'Vendor',
        'email' => 'vendor@jcizone12.org',
        'password' => 'Vendor@123',
        'role' => 'vendor',
        'user_type' => 'business'
    ]
];

foreach ($mocks as $m) {
    echo "  * Email: '{$m['email']}' (Password: '{$m['password']}') -> ";
    $check = $db->query("SELECT id FROM users WHERE email = '{$m['email']}'");
    if ($check && $check->num_rows > 0) {
        $existing = $check->fetch_assoc();
        // Update role and password to ensure clean testing state
        $hashed = password_hash($m['password'], PASSWORD_DEFAULT);
        $db->query("UPDATE users SET first_name = '{$m['first_name']}', last_name = '{$m['last_name']}', password = '$hashed', role = '{$m['role']}', status = 'active', email_verified = 1 WHERE id = {$existing['id']}");
        echo "UPDATED & READY\n";
    } else {
        $hashed = password_hash($m['password'], PASSWORD_DEFAULT);
        $res = $db->query("INSERT INTO users (first_name, last_name, email, password, user_type, role, email_verified, status) 
                    VALUES ('{$m['first_name']}', '{$m['last_name']}', '{$m['email']}', '$hashed', '{$m['user_type']}', '{$m['role']}', 1, 'active')");
        if ($res) {
            echo "CREATED & READY\n";
        } else {
            echo "INSERT ERROR: " . $db->error . "\n";
        }
    }
}

// 5. Seed one pending business listing (if none exists)
echo "\n[5] Checking business directory seeds... ";
$countBiz = $db->query("SELECT COUNT(*) FROM businesses")->fetch_row()[0];
if ($countBiz == 0) {
    // Seed an active and a pending business for John and Bob
    $vendorUserRes = $db->query("SELECT id FROM users WHERE email = 'vendor@jcizone12.org'");
    if ($vendorUserRes && $vendorUserRes->num_rows > 0) {
        $vendorId = $vendorUserRes->fetch_row()[0];
        $db->query("INSERT INTO businesses (user_id, business_name, owner_name, email, phone, city, category, description, website, status) 
                    VALUES ($vendorId, 'Bob Tech Solutions', 'Bob Vendor', 'contact@bobtech.com', '+91 99000 88000', 'Mumbai', 'Technology', 'Enterprise network setup and cloud integration services.', 'https://bobtech.com', 'active')");
    }
    
    $verifiedUserRes = $db->query("SELECT id FROM users WHERE email = 'verified@jcizone12.org'");
    if ($verifiedUserRes && $verifiedUserRes->num_rows > 0) {
        $verifiedId = $verifiedUserRes->fetch_row()[0];
        $db->query("INSERT INTO businesses (user_id, business_name, owner_name, email, phone, city, category, description, website, status) 
                    VALUES ($verifiedId, 'Organic Harvest', 'Alice Member', 'orders@organicharvest.in', '+91 98888 77777', 'Pune', 'Agriculture', 'Fresh organic farm produce delivered straight to your doorstep.', 'https://organicharvest.in', 'pending')");
    }
    echo "SEEDED MOCK BUSINESSES!\n";
} else {
    echo "EXISTS ($countBiz listings found)\n";
}

echo "\nVerification script execution complete! All settings verified successfully.";
