<?php
require_once 'config/database.php';
require_once 'config/session.php';
require_once 'config/functions.php';

// Access Control
checkRole(['vendor', 'admin']);

$db = getDB();
$userId = getCurrentUserId();

// Fetch fresh user data
$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();
$stmt->close();

$error = '';
$success = '';

// Fetch the vendor's business listing (each vendor has one business listing)
$stmt = $db->prepare("SELECT * FROM businesses WHERE user_id = ? LIMIT 1");
$stmt->bind_param("i", $userId);
$stmt->execute();
$business = $stmt->get_result()->fetch_assoc();
$stmt->close();

// Handle Profile Updates
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'update_profile') {
    $firstName = trim($_POST['first_name'] ?? '');
    $lastName = trim($_POST['last_name'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    
    if (empty($firstName) || empty($lastName)) {
        $error = "First name and last name are required.";
    } else {
        $stmt = $db->prepare("UPDATE users SET first_name = ?, last_name = ?, phone = ? WHERE id = ?");
        $stmt->bind_param("sssi", $firstName, $lastName, $phone, $userId);
        if ($stmt->execute()) {
            $success = "Personal contact information saved!";
            $_SESSION[SESSION_USER_NAME] = $firstName . ' ' . $lastName;
            $user['first_name'] = $firstName;
            $user['last_name'] = $lastName;
            $user['phone'] = $phone;
        } else {
            $error = "Failed to update profile: " . $db->error;
        }
        $stmt->close();
    }
}

// Handle Business Profile creation or updates
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'save_business') {
    $businessName = trim($_POST['business_name'] ?? '');
    $ownerName = trim($_POST['owner_name'] ?? '');
    $email = trim($_POST['business_email'] ?? '');
    $phone = trim($_POST['business_phone'] ?? '');
    $city = trim($_POST['city'] ?? '');
    $category = trim($_POST['category'] ?? '');
    $website = trim($_POST['website'] ?? '');
    $address = trim($_POST['address'] ?? '');
    $description = trim($_POST['description'] ?? '');
    
    if (empty($businessName) || empty($ownerName) || empty($email) || empty($phone) || empty($city)) {
        $error = "Please fill in all required fields marked with *";
    } else {
        if ($business) {
            // Update existing business listing
            // Preserve current status if active/inactive, or keep it pending
            $stmt = $db->prepare("UPDATE businesses SET business_name = ?, owner_name = ?, email = ?, phone = ?, city = ?, category = ?, website = ?, address = ?, description = ? WHERE user_id = ?");
            $stmt->bind_param("sssssssssi", $businessName, $ownerName, $email, $phone, $city, $category, $website, $address, $description, $userId);
            if ($stmt->execute()) {
                $success = "Business directory listing updated successfully!";
                // Refresh local variable
                $business['business_name'] = $businessName;
                $business['owner_name'] = $ownerName;
                $business['email'] = $email;
                $business['phone'] = $phone;
                $business['city'] = $city;
                $business['category'] = $category;
                $business['website'] = $website;
                $business['address'] = $address;
                $business['description'] = $description;
            } else {
                $error = "Failed to update listing: " . $db->error;
            }
            $stmt->close();
        } else {
            // Create new business listing (initial status: pending)
            $stmt = $db->prepare("INSERT INTO businesses (user_id, business_name, owner_name, email, phone, city, category, website, address, description, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')");
            $stmt->bind_param("isssssssss", $userId, $businessName, $ownerName, $email, $phone, $city, $category, $website, $address, $description);
            if ($stmt->execute()) {
                $success = "Your business listing has been created and submitted for Admin approval!";
                // Fetch to populate local variable
                $stmt2 = $db->prepare("SELECT * FROM businesses WHERE user_id = ? LIMIT 1");
                $stmt2->bind_param("i", $userId);
                $stmt2->execute();
                $business = $stmt2->get_result()->fetch_assoc();
                $stmt2->close();
            } else {
                $error = "Failed to create listing: " . $db->error;
            }
            $stmt->close();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vendor Space — JCI India Zone 12</title>
    <link rel="icon" type="image/png" href="favicon.png">
    
    <!-- Tailwind CSS & Fonts -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: { sans: ['Outfit', 'sans-serif'] },
                    colors: {
                        brand: {
                            50: '#f0f9ff',
                            100: '#e0f2fe',
                            500: '#0096D6',
                            600: '#007bb2',
                            700: '#0369a1',
                            950: '#032030',
                        }
                    }
                }
            }
        }
    </script>
    <style>
        body {
            background-color: #0b1329;
            background-image: radial-gradient(at 0% 0%, hsla(210,100%,15%,0.4) 0, transparent 50%);
        }
    </style>
</head>
<body class="text-slate-200 min-h-screen antialiased flex flex-col font-sans">

    <!-- ====== HEADER ====== -->
    <header class="border-b border-slate-800/80 bg-[#0e172e]/80 sticky top-0 z-50 backdrop-blur-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <a href="index.html" class="flex items-center gap-2.5">
                    <img src="JCI Zone.png" alt="JCI Logo" class="h-8">
                    <span class="text-md font-bold tracking-tight text-white hidden sm:block">JCI Zone 12</span>
                </a>
                <span class="bg-[#1e294b] text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-slate-700 text-amber-500">Vendor Portal</span>
            </div>
            
            <div class="flex items-center gap-4">
                <div class="text-right hidden md:block">
                    <p class="text-xs font-semibold text-white"><?php echo htmlspecialchars($user['first_name'] . ' ' . $user['last_name']); ?></p>
                    <p class="text-[10px] text-slate-400 capitalize">Vendor Account</p>
                </div>
                <a href="index.html" class="bg-brand-500/10 hover:bg-brand-500 text-brand-500 hover:text-white px-3.5 py-1.5 rounded-lg border border-brand-500/20 text-xs font-bold transition flex items-center gap-1.5">
                    <i class="fa-solid fa-house"></i>
                    <span class="hidden sm:inline">Home Page</span>
                </a>
                <a href="logout.php" class="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-3.5 py-1.5 rounded-lg border border-red-500/20 text-xs font-bold transition flex items-center gap-1.5">
                    <i class="fa-solid fa-arrow-right-from-bracket"></i>
                    <span>Log Out</span>
                </a>
            </div>
        </div>
    </header>

    <!-- ====== MAIN CONTENT ====== -->
    <main class="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <!-- Alerts -->
        <?php if ($error): ?>
            <div class="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-start gap-2.5">
                <i class="fa-solid fa-circle-exclamation mt-0.5"></i>
                <span><?php echo htmlspecialchars($error); ?></span>
            </div>
        <?php endif; ?>

        <?php if ($success): ?>
            <div class="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-start gap-2.5">
                <i class="fa-solid fa-circle-check mt-0.5"></i>
                <span><?php echo $success; ?></span>
            </div>
        <?php endif; ?>

        <!-- Welcome & Simulated Analytics Row -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            
            <div class="lg:col-span-2 bg-[#101c38]/60 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
                <div>
                    <h2 class="text-xl font-extrabold text-white">Welcome, <?php echo htmlspecialchars($user['first_name']); ?>! 🏢</h2>
                    <p class="text-xs text-slate-400 mt-2 leading-relaxed">
                        Configure your commercial profile to start showing up inside the official JCI business directory.
                    </p>
                </div>
                
                <div class="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span class="text-slate-400">Directory Status:</span>
                    <?php if ($business): ?>
                        <?php if ($business['status'] === 'active'): ?>
                            <span class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-0.5 rounded-full font-bold">Approved &amp; Active</span>
                        <?php elseif ($business['status'] === 'pending'): ?>
                            <span class="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-0.5 rounded-full font-bold">Pending Review</span>
                        <?php else: ?>
                            <span class="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-0.5 rounded-full font-bold">Inactive</span>
                        <?php endif; ?>
                    <?php else: ?>
                        <span class="bg-slate-700/30 text-slate-400 border border-slate-700/50 px-3 py-0.5 rounded-full">Not Configured</span>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Simulated Stats (WOW Factor!) -->
            <div class="bg-[#101c38]/40 border border-slate-800 p-6 rounded-2xl">
                <div class="flex items-center justify-between">
                    <span class="text-slate-400 text-xs font-bold uppercase tracking-wider">Directory Views</span>
                    <i class="fa-solid fa-eye text-brand-500"></i>
                </div>
                <h3 class="text-3xl font-extrabold text-white mt-4"><?php echo $business && $business['status'] === 'active' ? '418' : '0'; ?></h3>
                <p class="text-[10px] text-emerald-400 mt-1"><i class="fa-solid fa-arrow-up text-[9px] mr-1"></i>+12% vs last week</p>
            </div>

            <div class="bg-[#101c38]/40 border border-slate-800 p-6 rounded-2xl">
                <div class="flex items-center justify-between">
                    <span class="text-slate-400 text-xs font-bold uppercase tracking-wider">Website Clicks</span>
                    <i class="fa-solid fa-up-right-from-square text-emerald-500"></i>
                </div>
                <h3 class="text-3xl font-extrabold text-white mt-4"><?php echo $business && $business['status'] === 'active' ? '52' : '0'; ?></h3>
                <p class="text-[10px] text-slate-500 mt-1">Conversion rate: 12.4%</p>
            </div>
            
        </div>

        <!-- Forms Layout Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <!-- Personal Contact details -->
            <div class="lg:col-span-1 space-y-6">
                <div class="bg-[#101c38]/60 border border-slate-800/80 rounded-2xl p-6">
                    <h3 class="text-base font-bold text-white mb-5 pb-3 border-b border-slate-800/80 flex items-center gap-2">
                        <i class="fa-solid fa-circle-user text-brand-500"></i>
                        <span>Contact Settings</span>
                    </h3>
                    
                    <form action="dashboard-vendor.php" method="POST" class="space-y-4 text-xs">
                        <input type="hidden" name="action" value="update_profile">
                        
                        <div>
                            <label class="block text-slate-400 font-bold uppercase mb-1.5">First Name</label>
                            <input type="text" name="first_name" required value="<?php echo htmlspecialchars($user['first_name']); ?>"
                                class="w-full bg-[#15203c] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-brand-500 transition">
                        </div>
                        
                        <div>
                            <label class="block text-slate-400 font-bold uppercase mb-1.5">Last Name</label>
                            <input type="text" name="last_name" required value="<?php echo htmlspecialchars($user['last_name']); ?>"
                                class="w-full bg-[#15203c] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-brand-500 transition">
                        </div>

                        <div>
                            <label class="block text-slate-400 font-bold uppercase mb-1.5">Phone Number</label>
                            <input type="tel" name="phone" value="<?php echo htmlspecialchars($user['phone'] ?? ''); ?>"
                                class="w-full bg-[#15203c] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-brand-500 transition"
                                placeholder="+91 98765 43210">
                        </div>

                        <div>
                            <label class="block text-slate-500 font-bold uppercase mb-1.5">Email Address (Locked)</label>
                            <input type="text" disabled value="<?php echo htmlspecialchars($user['email']); ?>"
                                class="w-full bg-[#0d1425] border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-500 select-none outline-none">
                        </div>

                        <button type="submit" class="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-2.5 rounded-xl transition active:scale-[0.98]">
                            Update Contact Details
                        </button>
                    </form>
                </div>
            </div>

            <!-- Business Directory profile manager -->
            <div class="lg:col-span-2">
                <div class="bg-[#101c38]/60 border border-slate-800/80 rounded-2xl p-6">
                    <h3 class="text-base font-bold text-white mb-5 pb-3 border-b border-slate-800/80 flex items-center gap-2">
                        <i class="fa-solid fa-store text-amber-500"></i>
                        <span>Directory Business Profile</span>
                    </h3>
                    
                    <form action="dashboard-vendor.php" method="POST" class="space-y-5 text-xs">
                        <input type="hidden" name="action" value="save_business">
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-slate-400 font-bold uppercase mb-1.5">Business / Shop Name *</label>
                                <input type="text" name="business_name" required value="<?php echo htmlspecialchars($business['business_name'] ?? ''); ?>"
                                    class="w-full bg-[#15203c] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-brand-500 transition"
                                    placeholder="Enterprise name">
                            </div>
                            
                            <div>
                                <label class="block text-slate-400 font-bold uppercase mb-1.5">Owner Contact Person *</label>
                                <input type="text" name="owner_name" required value="<?php echo htmlspecialchars($business['owner_name'] ?? ($user['first_name'] . ' ' . $user['last_name'])); ?>"
                                    class="w-full bg-[#15203c] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-brand-500 transition"
                                    placeholder="Full name">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-slate-400 font-bold uppercase mb-1.5">Public Business Email *</label>
                                <input type="email" name="business_email" required value="<?php echo htmlspecialchars($business['email'] ?? $user['email']); ?>"
                                    class="w-full bg-[#15203c] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-brand-500 transition"
                                    placeholder="contact@enterprise.com">
                            </div>
                            
                            <div>
                                <label class="block text-slate-400 font-bold uppercase mb-1.5">Business Phone Number *</label>
                                <input type="tel" name="business_phone" required value="<?php echo htmlspecialchars($business['phone'] ?? $user['phone'] ?? ''); ?>"
                                    class="w-full bg-[#15203c] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-brand-500 transition"
                                    placeholder="+91 99999 88888">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-slate-400 font-bold uppercase mb-1.5">Public Category *</label>
                                <input type="text" name="category" required value="<?php echo htmlspecialchars($business['category'] ?? ''); ?>"
                                    class="w-full bg-[#15203c] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-brand-500 transition"
                                    placeholder="e.g. Retail, Consulting, Trade">
                            </div>

                            <div>
                                <label class="block text-slate-400 font-bold uppercase mb-1.5">Public City / Location *</label>
                                <input type="text" name="city" required value="<?php echo htmlspecialchars($business['city'] ?? ''); ?>"
                                    class="w-full bg-[#15203c] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-brand-500 transition"
                                    placeholder="e.g. Mumbai, Pune">
                            </div>

                            <div>
                                <label class="block text-slate-400 font-bold uppercase mb-1.5">Website (Optional)</label>
                                <input type="url" name="website" value="<?php echo htmlspecialchars($business['website'] ?? ''); ?>"
                                    class="w-full bg-[#15203c] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-brand-500 transition"
                                    placeholder="https://enterprise.com">
                            </div>
                        </div>

                        <div>
                            <label class="block text-slate-400 font-bold uppercase mb-1.5">Street Address</label>
                            <input type="text" name="address" value="<?php echo htmlspecialchars($business['address'] ?? ''); ?>"
                                class="w-full bg-[#15203c] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-brand-500 transition"
                                placeholder="Public street address">
                        </div>

                        <div>
                            <label class="block text-slate-400 font-bold uppercase mb-1.5">Business Summary / Description</label>
                            <textarea name="description" rows="5"
                                class="w-full bg-[#15203c] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-brand-500 transition resize-none"
                                placeholder="Describe your products, services, and why JCI members should contact you..."><?php echo htmlspecialchars($business['description'] ?? ''); ?></textarea>
                        </div>

                        <button type="submit" class="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-xl transition shadow-lg shadow-amber-500/20 active:scale-[0.98]">
                            <i class="fa-solid fa-save mr-1.5"></i> Save Business Listing
                        </button>
                    </form>
                </div>
            </div>

        </div>

    </main>

    <!-- ====== FOOTER ====== -->
    <footer class="border-t border-slate-800 bg-[#070d1e] py-6 text-center text-xs text-slate-500">
        <p>&copy; <?php echo date('Y'); ?> JCI India Zone 12. All Rights Reserved.</p>
    </footer>

</body>
</html>
