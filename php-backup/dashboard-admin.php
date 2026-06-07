<?php
require_once 'config/database.php';
require_once 'config/session.php';
require_once 'config/functions.php';

// Access Control
checkRole(['admin']);

$db = getDB();
$adminId = getCurrentUserId();

$error = '';
$success = '';

// --- POST HANDLERS ---
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $action = $_POST['action'];
    
    // 1. Change Role
    if ($action === 'change_role') {
        $userId = intval($_POST['user_id'] ?? 0);
        $newRole = trim($_POST['new_role'] ?? '');
        
        if ($userId > 0 && in_array($newRole, ['user', 'verified_user', 'vendor', 'admin'])) {
            // Prevent admin from demoting themselves
            if ($userId === $adminId && $newRole !== 'admin') {
                $error = "For safety, you cannot demote your own Admin account.";
            } else {
                $stmt = $db->prepare("UPDATE users SET role = ?, verification_requested = 0 WHERE id = ?");
                $stmt->bind_param("si", $newRole, $userId);
                if ($stmt->execute()) {
                    $success = "User role successfully changed to " . ucfirst(str_replace('_', ' ', $newRole)) . "!";
                } else {
                    $error = "Failed to update role: " . $db->error;
                }
                $stmt->close();
            }
        }
    }
    
    // 2. Change Status (Active/Inactive)
    if ($action === 'change_status') {
        $userId = intval($_POST['user_id'] ?? 0);
        $newStatus = trim($_POST['new_status'] ?? '');
        
        if ($userId > 0 && in_array($newStatus, ['active', 'inactive'])) {
            if ($userId === $adminId && $newStatus === 'inactive') {
                $error = "You cannot suspend your own Admin account.";
            } else {
                $stmt = $db->prepare("UPDATE users SET status = ? WHERE id = ?");
                $stmt->bind_param("si", $newStatus, $userId);
                if ($stmt->execute()) {
                    $success = "User account status changed to " . ucfirst($newStatus) . ".";
                } else {
                    $error = "Failed to update status: " . $db->error;
                }
                $stmt->close();
            }
        }
    }
    
    // 3. Approve Business
    if ($action === 'approve_business') {
        $businessId = intval($_POST['business_id'] ?? 0);
        if ($businessId > 0) {
            $stmt = $db->prepare("UPDATE businesses SET status = 'active' WHERE id = ?");
            $stmt->bind_param("i", $businessId);
            if ($stmt->execute()) {
                $success = "Business listing successfully approved and published!";
            } else {
                $error = "Failed to approve business: " . $db->error;
            }
            $stmt->close();
        }
    }
    
    // 4. Reject/Deactivate Business
    if ($action === 'reject_business') {
        $businessId = intval($_POST['business_id'] ?? 0);
        if ($businessId > 0) {
            $stmt = $db->prepare("UPDATE businesses SET status = 'inactive' WHERE id = ?");
            $stmt->bind_param("i", $businessId);
            if ($stmt->execute()) {
                $success = "Business listing deactivated.";
            } else {
                $error = "Failed to update business status: " . $db->error;
            }
            $stmt->close();
        }
    }

    // 5. Update Contact Submission Status
    if ($action === 'update_submission') {
        $subId = intval($_POST['submission_id'] ?? 0);
        $newStatus = trim($_POST['status'] ?? '');
        
        if ($subId > 0 && in_array($newStatus, ['new', 'contacted', 'closed'])) {
            $stmt = $db->prepare("UPDATE contact_submissions SET status = ? WHERE id = ?");
            $stmt->bind_param("si", $newStatus, $subId);
            if ($stmt->execute()) {
                $success = "Submission marked as " . ucfirst($newStatus) . "!";
            } else {
                $error = "Failed to update submission: " . $db->error;
            }
            $stmt->close();
        }
    }
}

// --- FETCH TELEMETRY ---
$totalUsers = $db->query("SELECT COUNT(*) FROM users")->fetch_row()[0];
$verifiedUsers = $db->query("SELECT COUNT(*) FROM users WHERE role = 'verified_user'")->fetch_row()[0];
$vendorUsers = $db->query("SELECT COUNT(*) FROM users WHERE role = 'vendor'")->fetch_row()[0];
$totalBusinesses = $db->query("SELECT COUNT(*) FROM businesses")->fetch_row()[0];
$pendingBusinesses = $db->query("SELECT COUNT(*) FROM businesses WHERE status = 'pending'")->fetch_row()[0];
$totalInquiries = $db->query("SELECT COUNT(*) FROM contact_submissions")->fetch_row()[0];

// Fetch all users
$usersRes = $db->query("SELECT * FROM users ORDER BY created_at DESC");
$allUsers = [];
if ($usersRes) {
    while ($row = $usersRes->fetch_assoc()) {
        $allUsers[] = $row;
    }
}

// Fetch all business directory listings
$businessRes = $db->query("SELECT b.*, u.first_name, u.last_name FROM businesses b LEFT JOIN users u ON b.user_id = u.id ORDER BY b.created_at DESC");
$allBusinesses = [];
if ($businessRes) {
    while ($row = $businessRes->fetch_assoc()) {
        $allBusinesses[] = $row;
    }
}

// Fetch contact form submissions
$inboxRes = $db->query("SELECT * FROM contact_submissions ORDER BY created_at DESC");
$allSubmissions = [];
if ($inboxRes) {
    while ($row = $inboxRes->fetch_assoc()) {
        $allSubmissions[] = $row;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Console — JCI India Zone 12</title>
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
        .admin-tab-content { display: none; }
        .admin-tab-content.active { display: block; }
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
                <span class="bg-[#1e294b] text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-slate-700 text-red-500">Admin Console</span>
            </div>
            
            <div class="flex items-center gap-4">
                <div class="text-right hidden md:block">
                    <p class="text-xs font-semibold text-white">Administrator</p>
                    <p class="text-[10px] text-slate-400 capitalize">System Controls Enabled</p>
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

        <!-- Telemetry Cards -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 mb-8">
            <div class="bg-[#101c38]/40 border border-slate-800/80 p-5 rounded-2xl">
                <p class="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Total Users</p>
                <h3 class="text-2xl font-extrabold text-white mt-2"><?php echo $totalUsers; ?></h3>
            </div>
            <div class="bg-[#101c38]/40 border border-slate-800/80 p-5 rounded-2xl">
                <p class="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Verified Members</p>
                <h3 class="text-2xl font-extrabold text-emerald-400 mt-2"><?php echo $verifiedUsers; ?></h3>
            </div>
            <div class="bg-[#101c38]/40 border border-slate-800/80 p-5 rounded-2xl">
                <p class="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Vendors</p>
                <h3 class="text-2xl font-extrabold text-amber-500 mt-2"><?php echo $vendorUsers; ?></h3>
            </div>
            <div class="bg-[#101c38]/40 border border-slate-800/80 p-5 rounded-2xl">
                <p class="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Businesses</p>
                <h3 class="text-2xl font-extrabold text-white mt-2"><?php echo $totalBusinesses; ?></h3>
            </div>
            <div class="bg-[#101c38]/40 border border-slate-800/80 p-5 rounded-2xl">
                <p class="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Pending Approvals</p>
                <h3 class="text-2xl font-extrabold text-amber-400 mt-2"><?php echo $pendingBusinesses; ?></h3>
            </div>
            <div class="bg-[#101c38]/40 border border-slate-800/80 p-5 rounded-2xl">
                <p class="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Total Inquiries</p>
                <h3 class="text-2xl font-extrabold text-brand-500 mt-2"><?php echo $totalInquiries; ?></h3>
            </div>
        </div>

        <!-- Master Tabs -->
        <div class="bg-[#101c38]/60 border border-slate-800/80 rounded-2xl overflow-hidden mb-8">
            <div class="flex border-b border-slate-800 bg-[#0e172e]/60 px-4">
                <button onclick="setTab('users-tab', this)" class="admin-tab-btn py-4 px-5 text-xs font-bold text-white border-b-2 border-brand-500 flex items-center gap-2">
                    <i class="fa-solid fa-users"></i>
                    <span>Member Supervisor</span>
                </button>
                <button onclick="setTab('business-tab', this)" class="admin-tab-btn py-4 px-5 text-xs font-bold text-slate-400 hover:text-white border-b-2 border-transparent flex items-center gap-2">
                    <i class="fa-solid fa-store"></i>
                    <span>Business Approvals</span>
                    <?php if ($pendingBusinesses > 0): ?>
                        <span class="bg-amber-500 text-slate-950 font-bold px-1.5 py-0.2 text-[9px] rounded-full shrink-0"><?php echo $pendingBusinesses; ?></span>
                    <?php endif; ?>
                </button>
                <button onclick="setTab('inbox-tab', this)" class="admin-tab-btn py-4 px-5 text-xs font-bold text-slate-400 hover:text-white border-b-2 border-transparent flex items-center gap-2">
                    <i class="fa-solid fa-envelope"></i>
                    <span>Inbox / Submissions</span>
                </button>
            </div>

            <!-- TAB 1: USER SUPERVISOR -->
            <div id="users-tab" class="admin-tab-content active p-6">
                <h3 class="text-sm font-bold text-white uppercase tracking-wider mb-4">Member Registration Directory</h3>
                
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr class="border-b border-slate-800 text-slate-400">
                                <th class="pb-3 font-semibold">User Details</th>
                                <th class="pb-3 font-semibold">Membership Type</th>
                                <th class="pb-3 font-semibold">System Role</th>
                                <th class="pb-3 font-semibold">Verification Request</th>
                                <th class="pb-3 font-semibold">Account Status</th>
                                <th class="pb-3 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-800/40">
                            <?php foreach ($allUsers as $u): ?>
                                <tr class="hover:bg-slate-800/10">
                                    <td class="py-3">
                                        <p class="font-bold text-white text-sm"><?php echo htmlspecialchars($u['first_name'] . ' ' . $u['last_name']); ?></p>
                                        <p class="text-slate-400 mt-0.5"><?php echo htmlspecialchars($u['email']); ?></p>
                                        <p class="text-slate-500 text-[10px] mt-0.5">Chapter: <?php echo htmlspecialchars($u['chapter_name'] ?: 'None'); ?></p>
                                    </td>
                                    <td class="py-3 capitalize text-slate-300">
                                        <?php echo htmlspecialchars($u['user_type']); ?>
                                    </td>
                                    <td class="py-3">
                                        <?php if ($u['role'] === 'admin'): ?>
                                            <span class="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded text-[10px] font-bold">Admin</span>
                                        <?php elseif ($u['role'] === 'vendor'): ?>
                                            <span class="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-bold">Vendor</span>
                                        <?php elseif ($u['role'] === 'verified_user'): ?>
                                            <span class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold">Verified Member 🛡️</span>
                                        <?php else: ?>
                                            <span class="bg-slate-700/30 text-slate-400 border border-slate-700/50 px-2 py-0.5 rounded text-[10px] font-bold">Member</span>
                                        <?php endif; ?>
                                    </td>
                                    <td class="py-3">
                                        <?php if ($u['verification_requested']): ?>
                                            <span class="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-bold animate-pulse">Pending Review</span>
                                        <?php else: ?>
                                            <span class="text-slate-600">—</span>
                                        <?php endif; ?>
                                    </td>
                                    <td class="py-3">
                                        <?php if ($u['status'] === 'active'): ?>
                                            <span class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold">Active</span>
                                        <?php else: ?>
                                            <span class="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded text-[10px] font-bold">Suspended</span>
                                        <?php endif; ?>
                                    </td>
                                    <td class="py-3">
                                        <div class="flex items-center justify-end gap-2">
                                            
                                            <!-- Action Form 1: Role Update -->
                                            <form action="dashboard-admin.php" method="POST" class="inline">
                                                <input type="hidden" name="action" value="change_role">
                                                <input type="hidden" name="user_id" value="<?php echo $u['id']; ?>">
                                                
                                                <?php if ($u['verification_requested'] || ($u['role'] === 'user')): ?>
                                                    <input type="hidden" name="new_role" value="verified_user">
                                                    <button type="submit" class="bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 font-bold px-2 py-1 rounded border border-emerald-500/20 hover:border-transparent transition-all text-[10px]" title="Verify Member">
                                                        Verify Member
                                                    </button>
                                                <?php elseif ($u['role'] === 'verified_user'): ?>
                                                    <input type="hidden" name="new_role" value="vendor">
                                                    <button type="submit" class="bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-slate-950 font-bold px-2 py-1 rounded border border-amber-500/20 hover:border-transparent transition-all text-[10px]" title="Make Vendor">
                                                        Make Vendor
                                                    </button>
                                                <?php elseif ($u['role'] === 'vendor'): ?>
                                                    <input type="hidden" name="new_role" value="user">
                                                    <button type="submit" class="bg-slate-700/40 hover:bg-slate-700 text-slate-400 hover:text-white font-bold px-2 py-1 rounded border border-slate-700/50 hover:border-transparent transition-all text-[10px]" title="Demote to Standard Member">
                                                        Reset Role
                                                    </button>
                                                <?php endif; ?>
                                            </form>
                                            
                                            <!-- Action Form 2: Suspend / Activate Toggle -->
                                            <form action="dashboard-admin.php" method="POST" class="inline">
                                                <input type="hidden" name="action" value="change_status">
                                                <input type="hidden" name="user_id" value="<?php echo $u['id']; ?>">
                                                <?php if ($u['status'] === 'active'): ?>
                                                    <input type="hidden" name="new_status" value="inactive">
                                                    <button type="submit" class="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-2 py-1 rounded border border-red-500/20 text-[10px] font-bold transition">
                                                        Suspend
                                                    </button>
                                                <?php else: ?>
                                                    <input type="hidden" name="new_status" value="active">
                                                    <button type="submit" class="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white px-2 py-1 rounded border border-emerald-500/20 text-[10px] font-bold transition">
                                                        Re-Activate
                                                    </button>
                                                <?php endif; ?>
                                            </form>

                                        </div>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- TAB 2: BUSINESS APPROVALS -->
            <div id="business-tab" class="admin-tab-content p-6">
                <h3 class="text-sm font-bold text-white uppercase tracking-wider mb-4">Directory Approval Hub</h3>
                
                <?php if (count($allBusinesses) === 0): ?>
                    <div class="text-center py-10 text-slate-500">
                        <i class="fa-solid fa-folder-open text-3xl mb-3"></i>
                        <p class="text-sm">No business listings in the database.</p>
                    </div>
                <?php else: ?>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr class="border-b border-slate-800 text-slate-400">
                                    <th class="pb-3 font-semibold">Business Details</th>
                                    <th class="pb-3 font-semibold">Public Category</th>
                                    <th class="pb-3 font-semibold">City</th>
                                    <th class="pb-3 font-semibold">Account Submitter</th>
                                    <th class="pb-3 font-semibold">Approval Status</th>
                                    <th class="pb-3 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-800/40">
                                <?php foreach ($allBusinesses as $b): ?>
                                    <tr class="hover:bg-slate-800/10">
                                        <td class="py-3">
                                            <p class="font-bold text-white text-sm"><?php echo htmlspecialchars($b['business_name']); ?></p>
                                            <p class="text-slate-400 mt-0.5"><?php echo htmlspecialchars($b['email']); ?> &bull; <?php echo htmlspecialchars($b['phone']); ?></p>
                                            <p class="text-slate-500 text-[10px] mt-0.5 line-clamp-1">Desc: <?php echo htmlspecialchars($b['description']); ?></p>
                                        </td>
                                        <td class="py-3 text-slate-300">
                                            <?php echo htmlspecialchars($b['category']); ?>
                                        </td>
                                        <td class="py-3 text-slate-300">
                                            <?php echo htmlspecialchars($b['city']); ?>
                                        </td>
                                        <td class="py-3 text-slate-400">
                                            <?php echo htmlspecialchars($b['first_name'] . ' ' . $b['last_name']); ?>
                                        </td>
                                        <td class="py-3">
                                            <?php if ($b['status'] === 'active'): ?>
                                                <span class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold">Approved &amp; Published</span>
                                            <?php elseif ($b['status'] === 'pending'): ?>
                                                <span class="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-bold animate-pulse">Pending Review</span>
                                            <?php else: ?>
                                                <span class="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded text-[10px] font-bold">Rejected / Disabled</span>
                                            <?php endif; ?>
                                        </td>
                                        <td class="py-3">
                                            <div class="flex items-center justify-end gap-2">
                                                
                                                <?php if ($b['status'] !== 'active'): ?>
                                                    <form action="dashboard-admin.php" method="POST" class="inline">
                                                        <input type="hidden" name="action" value="approve_business">
                                                        <input type="hidden" name="business_id" value="<?php echo $b['id']; ?>">
                                                        <button type="submit" class="bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 px-2.5 py-1 rounded border border-emerald-500/20 hover:border-transparent font-bold transition-all text-[10px]">
                                                            Approve
                                                        </button>
                                                    </form>
                                                <?php endif; ?>

                                                <?php if ($b['status'] !== 'inactive'): ?>
                                                    <form action="dashboard-admin.php" method="POST" class="inline">
                                                        <input type="hidden" name="action" value="reject_business">
                                                        <input type="hidden" name="business_id" value="<?php echo $b['id']; ?>">
                                                        <button type="submit" class="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-2.5 py-1 rounded border border-red-500/20 font-bold transition">
                                                            Disable
                                                        </button>
                                                    </form>
                                                <?php endif; ?>

                                            </div>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                <?php endif; ?>
            </div>

            <!-- TAB 3: CONTACT SUBMISSIONS -->
            <div id="inbox-tab" class="admin-tab-content p-6">
                <h3 class="text-sm font-bold text-white uppercase tracking-wider mb-4">Landing Page Inquiries</h3>
                
                <?php if (count($allSubmissions) === 0): ?>
                    <div class="text-center py-10 text-slate-500">
                        <i class="fa-solid fa-envelope-open text-3xl mb-3"></i>
                        <p class="text-sm">Your contact inbox is currently empty.</p>
                    </div>
                <?php else: ?>
                    <div class="space-y-4">
                        <?php foreach ($allSubmissions as $sub): ?>
                            <div class="bg-[#15203c]/40 border border-slate-800/80 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                                <div class="space-y-2">
                                    <div class="flex items-center gap-3">
                                        <h4 class="font-bold text-white text-sm"><?php echo htmlspecialchars($sub['name']); ?></h4>
                                        <span class="text-[10px] text-slate-500"><?php echo htmlspecialchars($sub['created_at']); ?></span>
                                        
                                        <?php if ($sub['status'] === 'new'): ?>
                                            <span class="bg-brand-500/10 text-brand-500 border border-brand-500/20 px-2 py-0.5 rounded font-bold text-[9px] uppercase tracking-wider">New</span>
                                        <?php elseif ($sub['status'] === 'contacted'): ?>
                                            <span class="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-bold text-[9px] uppercase tracking-wider">Contacted</span>
                                        <?php else: ?>
                                            <span class="bg-slate-700/30 text-slate-500 border border-slate-700/50 px-2 py-0.5 rounded font-bold text-[9px] uppercase tracking-wider">Closed</span>
                                        <?php endif; ?>
                                    </div>
                                    <p class="text-slate-400 mt-1"><i class="fa-solid fa-envelope text-[10px] mr-1 text-slate-500"></i><?php echo htmlspecialchars($sub['email']); ?> &bull; <i class="fa-solid fa-phone text-[10px] mr-1 text-slate-500"></i><?php echo htmlspecialchars($sub['phone'] ?: 'No Phone'); ?> &bull; <i class="fa-solid fa-location-dot text-[10px] mr-1 text-slate-500"></i><?php echo htmlspecialchars($sub['city'] ?: 'No City'); ?></p>
                                    <p class="text-slate-300 bg-[#0d1426]/60 p-3 rounded-xl border border-slate-800/40 leading-relaxed mt-2 text-xs"><?php echo nl2br(htmlspecialchars($sub['message'])); ?></p>
                                </div>
                                
                                <div class="shrink-0">
                                    <form action="dashboard-admin.php" method="POST" class="flex items-center gap-1.5">
                                        <input type="hidden" name="action" value="update_submission">
                                        <input type="hidden" name="submission_id" value="<?php echo $sub['id']; ?>">
                                        
                                        <select name="status" onchange="this.form.submit()" class="bg-[#15203c] border border-slate-700 text-slate-300 rounded-xl px-3 py-1.5 focus:border-brand-500 outline-none text-xs">
                                            <option value="new" <?php echo $sub['status'] === 'new' ? 'selected' : ''; ?>>Mark New</option>
                                            <option value="contacted" <?php echo $sub['status'] === 'contacted' ? 'selected' : ''; ?>>Mark Contacted</option>
                                            <option value="closed" <?php echo $sub['status'] === 'closed' ? 'selected' : ''; ?>>Mark Closed</option>
                                        </select>
                                    </form>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>

        </div>

    </main>

    <!-- ====== FOOTER ====== -->
    <footer class="border-t border-slate-800 bg-[#070d1e] py-6 text-center text-xs text-slate-500 mt-10">
        <p>&copy; <?php echo date('Y'); ?> JCI India Zone 12. All Rights Reserved.</p>
    </footer>

    <script>
        function setTab(tabId, element) {
            // Hide all tab content panels
            document.querySelectorAll('.admin-tab-content').forEach(panel => {
                panel.classList.remove('active');
            });
            
            // Show selected panel
            const targetPanel = document.getElementById(tabId);
            if (targetPanel) targetPanel.classList.add('active');
            
            // Remove active style from all tab selector buttons
            document.querySelectorAll('.admin-tab-btn').forEach(btn => {
                btn.classList.remove('text-white', 'border-brand-500');
                btn.classList.add('text-slate-400', 'border-transparent');
            });
            
            // Add active style to current button
            element.classList.remove('text-slate-400', 'border-transparent');
            element.classList.add('text-white', 'border-brand-500');
        }
    </script>
</body>
</html>
