<?php
require_once 'config/database.php';
require_once 'config/session.php';
require_once 'config/functions.php';

// Access Control
checkRole(['user', 'verified_user', 'admin']);

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

// Handle Profile Updates
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'update_profile') {
    $firstName = trim($_POST['first_name'] ?? '');
    $lastName = trim($_POST['last_name'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $chapterName = trim($_POST['chapter_name'] ?? '');
    $orgName = trim($_POST['organization_name'] ?? '');
    
    if (empty($firstName) || empty($lastName)) {
        $error = "First name and last name are required.";
    } else {
        $stmt = $db->prepare("UPDATE users SET first_name = ?, last_name = ?, phone = ?, chapter_name = ?, organization_name = ? WHERE id = ?");
        $stmt->bind_param("sssssi", $firstName, $lastName, $phone, $chapterName, $orgName, $userId);
        if ($stmt->execute()) {
            $success = "Profile details updated successfully!";
            // Update session name
            $_SESSION[SESSION_USER_NAME] = $firstName . ' ' . $lastName;
            // Refresh local variable
            $user['first_name'] = $firstName;
            $user['last_name'] = $lastName;
            $user['phone'] = $phone;
            $user['chapter_name'] = $chapterName;
            $user['organization_name'] = $orgName;
        } else {
            $error = "Failed to update profile: " . $db->error;
        }
        $stmt->close();
    }
}

// Handle Verification Request
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'apply_verification') {
    if ($user['role'] === 'user' && !$user['verification_requested']) {
        $stmt = $db->prepare("UPDATE users SET verification_requested = 1 WHERE id = ?");
        $stmt->bind_param("i", $userId);
        if ($stmt->execute()) {
            $success = "Your verification request has been submitted! Our admin team will review it.";
            $user['verification_requested'] = 1;
        } else {
            $error = "Failed to submit request: " . $db->error;
        }
        $stmt->close();
    }
}

// Handle Business Submission (Only for verified_user or admin)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'add_business') {
    if ($user['role'] === 'verified_user' || $user['role'] === 'admin') {
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
            $error = "Please fill in all required business fields.";
        } else {
            $stmt = $db->prepare("INSERT INTO businesses (user_id, business_name, owner_name, email, phone, city, category, website, address, description, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')");
            $stmt->bind_param("isssssssss", $userId, $businessName, $ownerName, $email, $phone, $city, $category, $website, $address, $description);
            if ($stmt->execute()) {
                $success = "Business listing successfully submitted for Admin approval!";
            } else {
                $error = "Failed to submit listing: " . $db->error;
            }
            $stmt->close();
        }
    } else {
        $error = "Only verified members can add directory listings.";
    }
}

// Fetch active business directory
$directoryRes = $db->query("SELECT * FROM businesses WHERE status = 'active' ORDER BY business_name ASC");
$activeBusinesses = [];
if ($directoryRes) {
    while ($row = $directoryRes->fetch_assoc()) {
        $activeBusinesses[] = $row;
    }
}

// Fetch user's business submissions
$myListingsRes = $db->query("SELECT * FROM businesses WHERE user_id = $userId ORDER BY id DESC");
$myListings = [];
if ($myListingsRes) {
    while ($row = $myListingsRes->fetch_assoc()) {
        $myListings[] = $row;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Member Portal — JCI India Zone 12</title>
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
                <span class="bg-[#1e294b] text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-slate-700 text-brand-500">Member Space</span>
            </div>
            
            <div class="flex items-center gap-4">
                <div class="text-right hidden md:block">
                    <p class="text-xs font-semibold text-white"><?php echo htmlspecialchars($user['first_name'] . ' ' . $user['last_name']); ?></p>
                    <p class="text-[10px] text-slate-400 capitalize"><?php echo $user['role'] === 'verified_user' ? 'Verified Member 🛡️' : 'Standard Member'; ?></p>
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

        <!-- Welcome banner -->
        <div class="bg-gradient-to-r from-brand-700/30 via-slate-800/40 to-slate-800/20 border border-slate-700/60 rounded-3xl p-6 lg:p-8 mb-8 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div class="relative z-10">
                <h2 class="text-2xl lg:text-3xl font-extrabold text-white">Hello, <?php echo htmlspecialchars($user['first_name']); ?>! 👋</h2>
                <p class="text-slate-400 text-sm mt-1 max-w-xl">
                    Welcome to your active JCI Zone 12 Member dashboard. Here you can manage your membership profile, apply for verification badges, and submit directory entries.
                </p>
            </div>
            
            <div class="relative z-10 shrink-0">
                <?php if ($user['role'] === 'verified_user'): ?>
                    <div class="flex items-center gap-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-5 py-3 rounded-2xl">
                        <i class="fa-solid fa-shield-halved text-2xl text-emerald-400"></i>
                        <div>
                            <p class="text-xs uppercase tracking-wider font-extrabold">Account Status</p>
                            <p class="text-xs text-emerald-300 font-bold mt-0.5">Verified Member</p>
                        </div>
                    </div>
                <?php elseif ($user['role'] === 'admin'): ?>
                    <a href="dashboard-admin.php" class="flex items-center gap-3 bg-brand-500 text-white px-5 py-3 rounded-2xl hover:bg-brand-600 transition shadow-lg shadow-brand-500/20">
                        <i class="fa-solid fa-user-shield text-2xl"></i>
                        <div>
                            <p class="text-xs uppercase tracking-wider font-extrabold">System Administration</p>
                            <p class="text-xs text-white/90 font-bold mt-0.5">Admin Console</p>
                        </div>
                    </a>
                <?php else: ?>
                    <?php if ($user['verification_requested']): ?>
                        <div class="flex items-center gap-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-5 py-3 rounded-2xl">
                            <i class="fa-solid fa-hourglass-half text-xl animate-pulse"></i>
                            <div>
                                <p class="text-xs uppercase tracking-wider font-extrabold">Verification Status</p>
                                <p class="text-xs text-amber-300 font-bold mt-0.5">Pending Approval</p>
                            </div>
                        </div>
                    <?php else: ?>
                        <form action="dashboard-user.php" method="POST">
                            <input type="hidden" name="action" value="apply_verification">
                            <button type="submit" class="bg-brand-500 hover:bg-brand-600 text-white font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-brand-500/20 flex items-center gap-2">
                                <i class="fa-solid fa-shield-halved"></i>
                                <span>Request Verification Badge</span>
                            </button>
                        </form>
                    <?php endif; ?>
                <?php endif; ?>
            </div>
        </div>

        <!-- Layout Split -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <!-- Left Side: Profile Card -->
            <div class="lg:col-span-1 space-y-6">
                <div class="bg-[#101c38]/60 border border-slate-800/80 rounded-2xl p-6">
                    <h3 class="text-base font-bold text-white mb-5 pb-3 border-b border-slate-800/80 flex items-center gap-2">
                        <i class="fa-solid fa-circle-user text-brand-500"></i>
                        <span>Profile Settings</span>
                    </h3>
                    
                    <form action="dashboard-user.php" method="POST" class="space-y-4 text-xs">
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
                            <label class="block text-slate-400 font-bold uppercase mb-1.5">JCI Chapter</label>
                            <input type="text" name="chapter_name" value="<?php echo htmlspecialchars($user['chapter_name'] ?? ''); ?>"
                                class="w-full bg-[#15203c] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-brand-500 transition"
                                placeholder="JCI City Chapter">
                        </div>

                        <div>
                            <label class="block text-slate-400 font-bold uppercase mb-1.5">Organization / Business</label>
                            <input type="text" name="organization_name" value="<?php echo htmlspecialchars($user['organization_name'] ?? ''); ?>"
                                class="w-full bg-[#15203c] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-brand-500 transition"
                                placeholder="Your enterprise name">
                        </div>

                        <div>
                            <label class="block text-slate-500 font-bold uppercase mb-1.5">Email Address (Locked)</label>
                            <input type="text" disabled value="<?php echo htmlspecialchars($user['email']); ?>"
                                class="w-full bg-[#0d1425] border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-500 select-none outline-none">
                        </div>

                        <button type="submit" class="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-2.5 rounded-xl transition active:scale-[0.98]">
                            Save Changes
                        </button>
                    </form>
                </div>
            </div>

            <!-- Right Side: Directory and Submission Form -->
            <div class="lg:col-span-2 space-y-8">
                
                <!-- Business Submission: If user is verified -->
                <?php if ($user['role'] === 'verified_user' || $user['role'] === 'admin'): ?>
                    <div class="bg-[#101c38]/60 border border-slate-800/80 rounded-2xl p-6">
                        <h3 class="text-base font-bold text-white mb-5 pb-3 border-b border-slate-800/80 flex items-center gap-2">
                            <i class="fa-solid fa-store text-emerald-500"></i>
                            <span>Register Business Listing (Verified Member Perk)</span>
                        </h3>
                        
                        <form action="dashboard-user.php" method="POST" class="space-y-4 text-xs">
                            <input type="hidden" name="action" value="add_business">
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-slate-400 font-bold uppercase mb-1.5">Business Name *</label>
                                    <input type="text" name="business_name" required class="w-full bg-[#15203c] border border-slate-700/80 rounded-xl px-3 py-2 text-white outline-none focus:border-brand-500 transition">
                                </div>
                                <div>
                                    <label class="block text-slate-400 font-bold uppercase mb-1.5">Owner Full Name *</label>
                                    <input type="text" name="owner_name" required class="w-full bg-[#15203c] border border-slate-700/80 rounded-xl px-3 py-2 text-white outline-none focus:border-brand-500 transition" value="<?php echo htmlspecialchars($user['first_name'] . ' ' . $user['last_name']); ?>">
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-slate-400 font-bold uppercase mb-1.5">Business Email *</label>
                                    <input type="email" name="business_email" required class="w-full bg-[#15203c] border border-slate-700/80 rounded-xl px-3 py-2 text-white outline-none focus:border-brand-500 transition">
                                </div>
                                <div>
                                    <label class="block text-slate-400 font-bold uppercase mb-1.5">Business Phone *</label>
                                    <input type="tel" name="business_phone" required class="w-full bg-[#15203c] border border-slate-700/80 rounded-xl px-3 py-2 text-white outline-none focus:border-brand-500 transition">
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label class="block text-slate-400 font-bold uppercase mb-1.5">City *</label>
                                    <input type="text" name="city" required class="w-full bg-[#15203c] border border-slate-700/80 rounded-xl px-3 py-2 text-white outline-none focus:border-brand-500 transition">
                                </div>
                                <div>
                                    <label class="block text-slate-400 font-bold uppercase mb-1.5">Category *</label>
                                    <input type="text" name="category" required class="w-full bg-[#15203c] border border-slate-700/80 rounded-xl px-3 py-2 text-white outline-none focus:border-brand-500 transition" placeholder="e.g. Technology, Retail">
                                </div>
                                <div>
                                    <label class="block text-slate-400 font-bold uppercase mb-1.5">Website (Optional)</label>
                                    <input type="url" name="website" class="w-full bg-[#15203c] border border-slate-700/80 rounded-xl px-3 py-2 text-white outline-none focus:border-brand-500 transition" placeholder="https://domain.com">
                                </div>
                            </div>

                            <div>
                                <label class="block text-slate-400 font-bold uppercase mb-1.5">Business Address</label>
                                <input type="text" name="address" class="w-full bg-[#15203c] border border-slate-700/80 rounded-xl px-3 py-2 text-white outline-none focus:border-brand-500 transition" placeholder="Street, block number">
                            </div>

                            <div>
                                <label class="block text-slate-400 font-bold uppercase mb-1.5">Short Description</label>
                                <textarea name="description" class="w-full bg-[#15203c] border border-slate-700/80 rounded-xl px-3 py-2 text-white outline-none focus:border-brand-500 transition h-20" placeholder="Tell us about your organization..."></textarea>
                            </div>

                            <button type="submit" class="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-6 rounded-xl transition active:scale-[0.98]">
                                Submit Directory Listing
                            </button>
                        </form>
                    </div>
                <?php endif; ?>

                <!-- Your Business Listings (only if they exist) -->
                <?php if (count($myListings) > 0): ?>
                    <div class="bg-[#101c38]/60 border border-slate-800/80 rounded-2xl p-6">
                        <h3 class="text-base font-bold text-white mb-5 pb-3 border-b border-slate-800/80 flex items-center gap-2">
                            <i class="fa-solid fa-table-list text-brand-500"></i>
                            <span>Your Business Listings</span>
                        </h3>
                        
                        <div class="space-y-4">
                            <?php foreach ($myListings as $listing): ?>
                                <div class="bg-[#15203c] border border-slate-800 p-4 rounded-xl flex items-center justify-between text-xs">
                                    <div>
                                        <h4 class="text-white font-bold text-sm"><?php echo htmlspecialchars($listing['business_name']); ?></h4>
                                        <p class="text-slate-400 mt-1"><i class="fa-solid fa-tags text-[10px] mr-1 text-slate-500"></i><?php echo htmlspecialchars($listing['category']); ?> &bull; <i class="fa-solid fa-location-dot text-[10px] mr-1 text-slate-500"></i><?php echo htmlspecialchars($listing['city']); ?></p>
                                    </div>
                                    <div>
                                        <?php if ($listing['status'] === 'active'): ?>
                                            <span class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-bold">Active</span>
                                        <?php elseif ($listing['status'] === 'pending'): ?>
                                            <span class="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full font-bold">Pending Review</span>
                                        <?php else: ?>
                                            <span class="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full font-bold">Inactive</span>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                <?php endif; ?>

                <!-- Active Business Directory Reader -->
                <div class="bg-[#101c38]/60 border border-slate-800/80 rounded-2xl p-6">
                    <h3 class="text-base font-bold text-white mb-5 pb-3 border-b border-slate-800/80 flex items-center gap-2">
                        <i class="fa-solid fa-address-book text-brand-500"></i>
                        <span>Local JCI Business Directory</span>
                    </h3>
                    
                    <?php if (count($activeBusinesses) === 0): ?>
                        <div class="text-center py-10 text-slate-500">
                            <i class="fa-solid fa-folder-open text-3xl mb-3"></i>
                            <p class="text-sm">No active business directory listings available.</p>
                        </div>
                    <?php else: ?>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <?php foreach ($activeBusinesses as $business): ?>
                                <div class="bg-[#15203c]/60 hover:bg-[#15203c] border border-slate-800/60 hover:border-slate-700/80 p-5 rounded-2xl transition duration-150 flex flex-col justify-between">
                                    <div>
                                        <div class="flex items-start justify-between gap-3">
                                            <h4 class="text-sm font-bold text-white"><?php echo htmlspecialchars($business['business_name']); ?></h4>
                                            <span class="bg-brand-500/10 text-brand-500 text-[10px] font-bold px-2 py-0.5 rounded border border-brand-500/20 shrink-0">
                                                <?php echo htmlspecialchars($business['category']); ?>
                                            </span>
                                        </div>
                                        <p class="text-xs text-slate-400 mt-2 line-clamp-2"><?php echo htmlspecialchars($business['description']); ?></p>
                                        
                                        <div class="mt-4 space-y-1.5 text-[11px] text-slate-400 border-t border-slate-800/80 pt-3">
                                            <div class="flex items-center gap-2">
                                                <i class="fa-solid fa-user text-slate-500 text-[10px] w-4"></i>
                                                <span>Owner: <?php echo htmlspecialchars($business['owner_name']); ?></span>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <i class="fa-solid fa-location-dot text-slate-500 text-[10px] w-4"></i>
                                                <span>City: <?php echo htmlspecialchars($business['city']); ?></span>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <i class="fa-solid fa-phone text-slate-500 text-[10px] w-4"></i>
                                                <span><?php echo htmlspecialchars($business['phone']); ?></span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <?php if ($business['website']): ?>
                                        <div class="mt-4 pt-3 border-t border-slate-800/40">
                                            <a href="<?php echo htmlspecialchars($business['website']); ?>" target="_blank" class="text-brand-500 text-xs font-bold hover:underline inline-flex items-center gap-1">
                                                <span>Visit Website</span>
                                                <i class="fa-solid fa-up-right-from-square text-[9px]"></i>
                                            </a>
                                        </div>
                                    <?php endif; ?>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
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
