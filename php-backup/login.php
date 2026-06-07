<?php
require_once 'config/database.php';
require_once 'config/session.php';

// Redirect if already logged in
redirectIfLoggedIn();

$error = $_SESSION['error'] ?? '';
$success = $_SESSION['success'] ?? '';
unset($_SESSION['error']);
unset($_SESSION['success']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Access the JCI India Zone 12 Portal. Sign in to your personalized dashboard.">
    <title>Gateway Portal — JCI India Zone 12</title>
    <link rel="icon" type="image/png" href="favicon.png">
    
    <!-- Tailwind CSS & Fonts -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Outfit', 'sans-serif'],
                    },
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
            background-image: 
                radial-gradient(at 0% 0%, hsla(210,100%,15%,0.6) 0, transparent 50%),
                radial-gradient(at 100% 100%, hsla(195,100%,12%,0.6) 0, transparent 50%);
        }
        .glass-panel {
            background: rgba(26, 37, 65, 0.45);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.07);
        }
    </style>
</head>
<body class="text-slate-200 min-h-screen flex items-center justify-center p-4 antialiased">

    <div class="w-full max-w-5xl flex flex-col lg:flex-row bg-[#101c38]/70 rounded-3xl overflow-hidden shadow-2xl border border-slate-800/80 min-h-[640px]">
        
        <!-- Left panel: Visual Branding and Intro -->
        <div class="lg:w-1/2 p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-[#111e3b] to-[#070d1e]">
            <!-- Decorative light glows -->
            <div class="absolute -top-24 -left-24 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div class="absolute -bottom-20 -right-20 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div class="relative z-10">
                <a href="index.html" class="inline-flex items-center gap-3 group">
                    <div class="bg-brand-500/10 p-2.5 rounded-xl border border-brand-500/20 group-hover:border-brand-500/40 transition">
                        <img src="JCI Zone.png" alt="JCI Logo" class="h-8">
                    </div>
                    <div>
                        <h1 class="text-xl font-bold tracking-tight text-white">JCI India Zone 12</h1>
                        <p class="text-xs text-slate-400">Active Citizens Worldwide</p>
                    </div>
                </a>
            </div>

            <div class="my-10 relative z-10">
                <span class="text-xs font-semibold uppercase tracking-widest text-brand-500 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">Gateway Portal</span>
                <h2 class="text-3xl lg:text-4xl font-extrabold text-white mt-4 leading-tight">
                    Empowering Young leaders, <br>
                    <span class="bg-gradient-to-r from-brand-500 to-sky-400 bg-clip-text text-transparent">Fostering Innovation.</span>
                </h2>
                <p class="text-slate-400 text-sm mt-4 max-w-md">
                    Access your secure dashboard to manage your JCI activities, directory submissions, vendor catalogs, and leadership resources.
                </p>
            </div>

            <div class="space-y-4 border-t border-slate-800/80 pt-6 relative z-10">
                <div class="flex items-center gap-3.5">
                    <div class="w-9 h-9 rounded-lg bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
                        <i class="fa-solid fa-shield-halved text-brand-500 text-sm"></i>
                    </div>
                    <div>
                        <h4 class="text-xs font-bold text-white uppercase tracking-wider">Role-Based Segregation</h4>
                        <p class="text-xs text-slate-400 mt-0.5">Strict database isolation for standard users, business vendors, and admins.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right panel: Interactive Multitab Login -->
        <div class="lg:w-1/2 p-8 lg:p-12 bg-[#0e172e] flex flex-col justify-center">
            <div class="max-w-md mx-auto w-full">
                
                <div class="mb-8">
                    <h3 class="text-2xl font-bold text-white">Welcome Back! 👋</h3>
                    <p class="text-slate-400 text-sm mt-1">Select your designated portal and log in.</p>
                </div>

                <!-- Tab Selectors -->
                <div class="grid grid-cols-3 gap-1 bg-[#15203c] p-1 rounded-xl mb-6 border border-slate-800">
                    <button type="button" onclick="selectPortal('user', this)" id="tab-user" class="portal-tab py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 flex flex-col items-center gap-1 text-white bg-brand-500 shadow-md">
                        <i class="fa-solid fa-users text-sm"></i>
                        <span>Member</span>
                    </button>
                    <button type="button" onclick="selectPortal('vendor', this)" id="tab-vendor" class="portal-tab py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 flex flex-col items-center gap-1 text-slate-400 hover:text-white">
                        <i class="fa-solid fa-briefcase text-sm"></i>
                        <span>Vendor</span>
                    </button>
                    <button type="button" onclick="selectPortal('admin', this)" id="tab-admin" class="portal-tab py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 flex flex-col items-center gap-1 text-slate-400 hover:text-white">
                        <i class="fa-solid fa-user-shield text-sm"></i>
                        <span>Admin</span>
                    </button>
                </div>

                <!-- Messages -->
                <?php if ($error): ?>
                    <div class="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-5 text-sm flex items-start gap-2.5">
                        <i class="fa-solid fa-circle-exclamation mt-0.5"></i>
                        <span><?php echo htmlspecialchars($error); ?></span>
                    </div>
                <?php endif; ?>

                <?php if ($success): ?>
                    <div class="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl mb-5 text-sm flex items-start gap-2.5">
                        <i class="fa-solid fa-circle-check mt-0.5"></i>
                        <span><?php echo $success; ?></span>
                    </div>
                <?php endif; ?>

                <!-- Login Form -->
                <form action="auth.php" method="POST" class="space-y-5">
                    <!-- Hidden Selected Role Input -->
                    <input type="hidden" name="selected_portal" id="selected-portal" value="user">

                    <div>
                        <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                        <div class="relative">
                            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                                <i class="fa-solid fa-envelope"></i>
                            </span>
                            <input type="email" name="email" required
                                class="w-full bg-[#15203c] border border-slate-700/80 rounded-xl pl-10 pr-4 py-3.5 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition text-sm text-white placeholder-slate-500"
                                placeholder="name@domain.com">
                        </div>
                    </div>

                    <div>
                        <div class="flex justify-between items-center mb-2">
                            <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                            <a href="forgot-password.php" class="text-xs text-brand-500 hover:text-brand-600 font-medium">Forgot?</a>
                        </div>
                        <div class="relative">
                            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                                <i class="fa-solid fa-lock"></i>
                            </span>
                            <input type="password" name="password" required
                                class="w-full bg-[#15203c] border border-slate-700/80 rounded-xl pl-10 pr-4 py-3.5 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition text-sm text-white placeholder-slate-500"
                                placeholder="••••••••">
                        </div>
                    </div>

                    <div class="flex items-center justify-between py-1">
                        <label class="flex items-center gap-2.5 cursor-pointer group select-none">
                            <input type="checkbox" name="remember" class="w-4 h-4 rounded border-slate-700 bg-[#15203c] text-brand-500 focus:ring-brand-500 accent-brand-500">
                            <span class="text-xs text-slate-400 group-hover:text-slate-300 transition">Keep me signed in</span>
                        </label>
                    </div>

                    <!-- CTA Button -->
                    <button type="submit" id="submit-btn" class="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-brand-500/20 active:scale-[0.99] flex items-center justify-center gap-2">
                        <span>Sign In to Member Portal</span>
                        <i class="fa-solid fa-arrow-right text-xs"></i>
                    </button>
                </form>

                <div class="mt-8 pt-6 border-t border-slate-800 text-center">
                    <p class="text-sm text-slate-400">
                        Don't have an account? 
                        <a href="register.php" class="text-brand-500 hover:underline font-bold">Create Account</a>
                    </p>
                    <a href="index.html" class="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 mt-4 transition">
                        <i class="fa-solid fa-arrow-left"></i>
                        <span>Back to Landing Page</span>
                    </a>
                </div>

            </div>
        </div>
    </div>

    <script>
        function selectPortal(role, element) {
            // Update hidden input
            document.getElementById('selected-portal').value = role;
            
            // Remove active classes from all tabs
            document.querySelectorAll('.portal-tab').forEach(tab => {
                tab.classList.remove('bg-brand-500', 'text-white', 'shadow-md');
                tab.classList.add('text-slate-400', 'hover:text-white');
            });
            
            // Add active classes to selected tab
            element.classList.remove('text-slate-400', 'hover:text-white');
            element.classList.add('bg-brand-500', 'text-white', 'shadow-md');
            
            // Update submit button text based on role
            const btn = document.getElementById('submit-btn');
            let label = "Member Portal";
            if (role === 'vendor') label = "Vendor Space";
            if (role === 'admin') label = "Admin Gateway";
            
            btn.querySelector('span').textContent = "Sign In to " + label;
        }
    </script>
</body>
</html>
