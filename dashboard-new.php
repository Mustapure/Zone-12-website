<?php
/**
 * JCI Zone 12 - Dashboard Page
 * Protected page requiring authentication
 */

// Start session first
session_start();

// Include required files
require_once 'config/database.php';
require_once 'config/functions.php';
require_once 'config/session.php';

// Require login - redirect to login if not authenticated
requireLogin();

// Get current user information
\$userId = getCurrentUserId();
\$userName = getCurrentUserName();
\$userEmail = getCurrentUserEmail();
\$userType = getCurrentUserType();

\$page = 'dashboard';
?>

<?php include 'include/header.php'; ?>

<main class=\"main-content\">
    <!-- Welcome Message -->
    <div class=\"bg-white rounded-lg shadow p-6 mb-6\">
        <h1 class=\"text-2xl font-bold text-gray-800\">Welcome back, <?php echo htmlspecialchars(\$userName); ?>! 👋</h1>
        <p class=\"text-gray-600 mt-2\">Member Type: <span class=\"font-semibold text-blue-600\"><?php echo htmlspecialchars(ucfirst(\$userType)); ?></span></p>
    </div>

    <!-- Quick Stats -->
    <div class=\"grid grid-cols-1 md:grid-cols-3 gap-6 mb-6\">
        <div class=\"bg-white rounded-lg shadow p-6\">
            <div class=\"flex items-center gap-4\">
                <div class=\"w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center\">
                    <i class=\"fas fa-user text-blue-600 text-xl\"></i>
                </div>
                <div>
                    <p class=\"text-sm text-gray-500\">Account</p>
                    <p class=\"text-xl font-bold text-gray-800\">Active</p>
                </div>
            </div>
        </div>

        <div class=\"bg-white rounded-lg shadow p-6\">
            <div class=\"flex items-center gap-4\">
                <div class=\"w-12 h-12 bg-green-100 rounded-full flex items-center justify-center\">
                    <i class=\"fas fa-calendar-alt text-green-600 text-xl\"></i>
                </div>
                <div>
                    <p class=\"text-sm text-gray-500\">Events</p>
                    <p class=\"text-xl font-bold text-gray-800\">View All</p>
                </div>
            </div>
        </div>

        <div class=\"bg-white rounded-lg shadow p-6\">
            <div class=\"flex items-center gap-4\">
                <div class=\"w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center\">
                    <i class=\"fas fa-users text-purple-600 text-xl\"></i>
                </div>
                <div>
                    <p class=\"text-sm text-gray-500\">Network</p>
                    <p class=\"text-xl font-bold text-gray-800\">Connect</p>
                </div>
            </div>
        </div>
    </div>

    <!-- User Info Card -->
    <div class=\"bg-white rounded-lg shadow p-6\">
        <h2 class=\"text-lg font-bold text-gray-800 mb-4\">Your Account Information</h2>
        <div class=\"grid grid-cols-1 md:grid-cols-2 gap-4\">
            <div>
                <p class=\"text-sm text-gray-500\">Full Name</p>
                <p class=\"font-medium text-gray-800\"><?php echo htmlspecialchars(\$userName); ?></p>
            </div>
            <div>
                <p class=\"text-sm text-gray-500\">Email Address</p>
                <p class=\"font-medium text-gray-800\"><?php echo htmlspecialchars(\$userEmail); ?></p>
            </div>
            <div>
                <p class=\"text-sm text-gray-500\">Member Type</p>
                <p class=\"font-medium text-gray-800\"><?php echo htmlspecialchars(ucfirst(\$userType)); ?></p>
            </div>
            <div>
                <p class=\"text-sm text-gray-500\">User ID</p>
                <p class=\"font-medium text-gray-800\">#<?php echo htmlspecialchars(\$userId); ?></p>
            </div>
        </div>
    </div>
</main>

<?php include 'include/footer.php'; ?>

