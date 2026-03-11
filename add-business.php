<?php
/**
 * Add Business Listing Form
 * Allows JCI members to add their businesses to the directory
 */

session_start();

// Include required files
require_once 'config/database.php';
require_once 'config/functions.php';
require_once 'config/session.php';

// Require login to access this page
requireLogin();

$message = '';
$error = '';

// Check if user is logged in (optional - can be viewed by anyone)
$isLoggedIn = isLoggedIn();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $db = getDB();
    
    // Get form data
    $business_name = trim($_POST['business_name'] ?? '');
    $owner_name = trim($_POST['owner_name'] ?? '');
    $owner_jci_name = trim($_POST['owner_jci_name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $website = trim($_POST['website'] ?? '');
    $address = trim($_POST['address'] ?? '');
    $city = trim($_POST['city'] ?? '');
    $category = trim($_POST['category'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $tags = trim($_POST['tags'] ?? '');
    
    // Validation
    if (empty($business_name) || empty($owner_name) || empty($email) || empty($phone) || empty($city) || empty($category)) {
        $error = 'Please fill in all required fields.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Please enter a valid email address.';
    } else {
        // Get user_id if logged in
        $userId = $isLoggedIn ? getCurrentUserId() : null;
        
        // Insert business
        $stmt = $db->prepare("INSERT INTO businesses (user_id, business_name, owner_name, owner_jci_name, email, phone, website, address, city, category, description, tags, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')");
        $stmt->bind_param("isssssssssss", 
            $userId,
            $business_name,
            $owner_name,
            $owner_jci_name,
            $email,
            $phone,
            $website,
            $address,
            $city,
            $category,
            $description,
            $tags
        );
        
        if ($stmt->execute()) {
            $message = 'Business listing submitted successfully! Your listing will be reviewed and published soon.';
        } else {
            $error = 'Error submitting business: ' . $stmt->error;
        }
        $stmt->close();
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <title>Add Business - JCI Zone 12</title>
    <link rel="icon" type="image/png" href="favicon.png">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        jci: { DEFAULT: '#0096D6', dark: '#006699' }
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-gray-50 min-h-screen">

    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <a href="index.php" class="flex items-center gap-2">
                        <img src="JCI Zone.png" alt="JCI Zone 12" class="h-8">
                        <span class="font-bold text-xl text-jci">JCI Zone 12</span>
                    </a>
                </div>
                <div class="flex items-center gap-4">
                    <a href="dir.php" class="text-gray-600 hover:text-jci">Directory</a>
                    <?php if ($isLoggedIn): ?>
                        <a href="dashboard.php" class="text-gray-600 hover:text-jci">Dashboard</a>
                        <a href="logout.php" class="text-gray-600 hover:text-jci">Logout</a>
                    <?php else: ?>
                        <a href="login.php" class="text-jci font-semibold">Login</a>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </nav>

    <div class="max-w-3xl mx-auto px-4 py-8">
        <div class="bg-white rounded-lg shadow-lg p-8">
            <h1 class="text-2xl font-bold text-gray-800 mb-2">Add Your Business</h1>
            <p class="text-gray-600 mb-6">List your business in the JCI Zone 12 Directory</p>
            
            <?php if (!$isLoggedIn): ?>
                <div class="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded mb-6">
                    <p><i class="fas fa-info-circle mr-2"></i>You are submitting as a guest. <a href="login.php" class="font-semibold underline">Login</a> to track and manage your listings.</p>
                </div>
            <?php endif; ?>

            <?php if ($message): ?>
                <div class="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded mb-6">
                    <p><?php echo htmlspecialchars($message); ?></p>
                </div>
            <?php endif; ?>

            <?php if ($error): ?>
                <div class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
                    <p><?php echo htmlspecialchars($error); ?></p>
                </div>
            <?php endif; ?>

            <form method="POST" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
                        <input type="text" name="business_name" required 
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jci focus:border-jci"
                            placeholder="Your Business Name">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Owner Name *</label>
                        <input type="text" name="owner_name" required 
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jci focus:border-jci"
                            placeholder="Full Name">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">JCI Name (JC Name)</label>
                        <input type="text" name="owner_jci_name" 
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jci focus:border-jci"
                            placeholder="e.g., JC John Doe">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input type="email" name="email" required 
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jci focus:border-jci"
                            placeholder="business@email.com">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                        <input type="tel" name="phone" required 
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jci focus:border-jci"
                            placeholder="+91 98765 43210">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Website</label>
                        <input type="url" name="website" 
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jci focus:border-jci"
                            placeholder="https://www.example.com">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">City *</label>
                        <select name="city" required 
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jci focus:border-jci">
                            <option value="">Select City</option>
                            <option value="Zone 12">Zone 12</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Bangalore">Bangalore</option>
                            <option value="Chennai">Chennai</option>
                            <option value="Kolkata">Kolkata</option>
                            <option value="Hyderabad">Hyderabad</option>
                            <option value="Pune">Pune</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                        <select name="category" required 
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jci focus:border-jci">
                            <option value="">Select Category</option>
                            <option value="Services">Services</option>
                            <option value="Products">Products</option>
                            <option value="Service Provider">Service Provider</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea name="address" rows="2" 
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jci focus:border-jci"
                        placeholder="Full address"></textarea>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea name="description" rows="3" 
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jci focus:border-jci"
                        placeholder="Tell us about your business..."></textarea>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                    <input type="text" name="tags" 
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jci focus:border-jci"
                        placeholder="Digital Marketing, SEO, Branding">
                    <p class="text-xs text-gray-500 mt-1">Example: Marketing, Design, Consulting</p>
                </div>

                <button type="submit" class="w-full bg-jci hover:bg-jci-dark text-white font-semibold py-3 rounded-lg transition">
                    <i class="fas fa-plus-circle mr-2"></i> Submit Business Listing
                </button>
            </form>
        </div>
    </div>

</body>
</html>

