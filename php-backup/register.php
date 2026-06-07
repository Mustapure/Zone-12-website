<?php
require_once 'config/database.php';
require_once 'config/session.php';
require_once 'config/functions.php';

// Redirect if already logged in
redirectIfLoggedIn();

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $result = registerUser($_POST);
    
    if ($result['status'] === 'success') {
        $success = $result['message'] . ' <a href="login.php" class="font-bold underline text-brand-500 hover:text-brand-400">Click here to log in</a>';
    } else {
        $error = $result['message'];
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Join JCI India Zone 12. Create your account to access our exclusive features.">
    <title>Register Account — JCI India Zone 12</title>
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
    </style>
</head>
<body class="text-slate-200 min-h-screen flex items-center justify-center p-4 antialiased my-8">

    <div class="w-full max-w-4xl flex flex-col lg:flex-row bg-[#101c38]/70 rounded-3xl overflow-hidden shadow-2xl border border-slate-800/80">
        
        <!-- Left Side: Brand Panel -->
        <div class="lg:w-2/5 p-10 flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-[#111e3b] to-[#070d1e]">
            <div class="absolute -top-24 -left-24 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div class="relative z-10">
                <a href="index.html" class="inline-flex items-center gap-3">
                    <img src="JCI Zone.png" alt="JCI Logo" class="h-8">
                    <h1 class="text-lg font-bold text-white">JCI India Zone 12</h1>
                </a>
            </div>

            <div class="my-8 relative z-10">
                <span class="text-xs font-semibold uppercase tracking-widest text-brand-500 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">Join the Movement</span>
                <h2 class="text-2xl font-extrabold text-white mt-4 leading-tight">Create an Account</h2>
                <p class="text-slate-400 text-xs mt-3 leading-relaxed">
                    Connect with young active citizens, register your business in our local directory, and participate in exclusive leadership events.
                </p>
            </div>

            <div class="space-y-4 border-t border-slate-800/80 pt-6 relative z-10 text-xs">
                <div class="flex items-center gap-3">
                    <i class="fa-solid fa-user-check text-brand-500"></i>
                    <span><strong>Members:</strong> Share events & explore.</span>
                </div>
                <div class="flex items-center gap-3">
                    <i class="fa-solid fa-store text-emerald-500"></i>
                    <span><strong>Vendors:</strong> List & manage businesses.</span>
                </div>
            </div>
        </div>

        <!-- Right Side: Form -->
        <div class="lg:w-3/5 p-8 lg:p-10 bg-[#0e172e]">
            <div class="w-full">
                
                <div class="mb-6">
                    <h3 class="text-xl font-bold text-white">Get Started! 🚀</h3>
                    <p class="text-slate-400 text-xs mt-1">Enter your credentials to configure your new profile.</p>
                </div>

                <!-- Messages -->
                <?php if ($error): ?>
                    <div class="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2.5 rounded-xl mb-4 text-xs flex items-start gap-2.5">
                        <i class="fa-solid fa-circle-exclamation mt-0.5"></i>
                        <span><?php echo htmlspecialchars($error); ?></span>
                    </div>
                <?php endif; ?>

                <?php if ($success): ?>
                    <div class="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2.5 rounded-xl mb-4 text-xs flex items-start gap-2.5">
                        <i class="fa-solid fa-circle-check mt-0.5"></i>
                        <span><?php echo $success; ?></span>
                    </div>
                <?php endif; ?>

                <!-- Registration Form -->
                <form action="register.php" method="POST" class="space-y-4">
                    
                    <!-- Form Role Selector Card Toggle -->
                    <div class="grid grid-cols-2 gap-3 bg-[#15203c] p-1 rounded-xl border border-slate-800">
                        <button type="button" onclick="setRegistrationRole('user', this)" class="reg-role-btn py-2 text-xs font-semibold rounded-lg transition-all duration-200 text-white bg-brand-500">
                            <i class="fa-solid fa-user mr-1.5"></i> Member Profile
                        </button>
                        <button type="button" onclick="setRegistrationRole('vendor', this)" class="reg-role-btn py-2 text-xs font-semibold rounded-lg transition-all duration-200 text-slate-400 hover:text-white">
                            <i class="fa-solid fa-store mr-1.5"></i> Vendor Profile
                        </button>
                    </div>
                    
                    <input type="hidden" name="role" id="reg-role" value="user">

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-400 uppercase mb-1.5">First Name *</label>
                            <input type="text" name="first_name" required value="<?php echo htmlspecialchars($_POST['first_name'] ?? ''); ?>"
                                class="w-full bg-[#15203c] border border-slate-700 rounded-xl px-3 py-2 focus:border-brand-500 outline-none text-xs text-white placeholder-slate-500">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-400 uppercase mb-1.5">Last Name *</label>
                            <input type="text" name="last_name" required value="<?php echo htmlspecialchars($_POST['last_name'] ?? ''); ?>"
                                class="w-full bg-[#15203c] border border-slate-700 rounded-xl px-3 py-2 focus:border-brand-500 outline-none text-xs text-white placeholder-slate-500">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-400 uppercase mb-1.5">Email Address *</label>
                            <input type="email" name="email" required value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>"
                                class="w-full bg-[#15203c] border border-slate-700 rounded-xl px-3 py-2 focus:border-brand-500 outline-none text-xs text-white placeholder-slate-500"
                                placeholder="name@domain.com">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-400 uppercase mb-1.5">Phone Number</label>
                            <input type="tel" name="phone" value="<?php echo htmlspecialchars($_POST['phone'] ?? ''); ?>"
                                class="w-full bg-[#15203c] border border-slate-700 rounded-xl px-3 py-2 focus:border-brand-500 outline-none text-xs text-white placeholder-slate-500"
                                placeholder="+91 98765 43210">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-400 uppercase mb-1.5">Membership Type *</label>
                            <select name="user_type" id="user-type-select" required onchange="onUserTypeChange()"
                                class="w-full bg-[#15203c] border border-slate-700 rounded-xl px-3 py-2.5 focus:border-brand-500 outline-none text-xs text-white">
                                <option value="individual" <?php echo ($_POST['user_type'] ?? '') === 'individual' ? 'selected' : ''; ?>>Individual Member</option>
                                <option value="educational" <?php echo ($_POST['user_type'] ?? '') === 'educational' ? 'selected' : ''; ?>>Educational Institution</option>
                                <option value="corporate" <?php echo ($_POST['user_type'] ?? '') === 'corporate' ? 'selected' : ''; ?>>Corporate/Organization</option>
                                <option value="business" <?php echo ($_POST['user_type'] ?? '') === 'business' ? 'selected' : ''; ?>>Business Owner / Vendor</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-400 uppercase mb-1.5">JCI Chapter Name</label>
                            <input type="text" name="chapter_name" value="<?php echo htmlspecialchars($_POST['chapter_name'] ?? ''); ?>"
                                class="w-full bg-[#15203c] border border-slate-700 rounded-xl px-3 py-2 focus:border-brand-500 outline-none text-xs text-white placeholder-slate-500"
                                placeholder="e.g. JCI Mumbai">
                        </div>
                    </div>

                    <div id="org-field">
                        <label class="block text-xs font-bold text-slate-400 uppercase mb-1.5">Organization / Business Name</label>
                        <input type="text" name="organization_name" value="<?php echo htmlspecialchars($_POST['organization_name'] ?? ''); ?>"
                            class="w-full bg-[#15203c] border border-slate-700 rounded-xl px-3 py-2 focus:border-brand-500 outline-none text-xs text-white placeholder-slate-500"
                            placeholder="Your Company or Listing Name">
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-400 uppercase mb-1.5">Password *</label>
                            <input type="password" name="password" required
                                class="w-full bg-[#15203c] border border-slate-700 rounded-xl px-3 py-2 focus:border-brand-500 outline-none text-xs text-white"
                                placeholder="Min 8 characters">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-400 uppercase mb-1.5">Confirm Password *</label>
                            <input type="password" name="confirm_password" required
                                class="w-full bg-[#15203c] border border-slate-700 rounded-xl px-3 py-2 focus:border-brand-500 outline-none text-xs text-white"
                                placeholder="Repeat password">
                        </div>
                    </div>

                    <div class="flex items-start gap-2.5 pt-1">
                        <input type="checkbox" required class="w-4 h-4 rounded border-slate-700 bg-[#15203c] text-brand-500 accent-brand-500 mt-0.5">
                        <span class="text-[10px] text-slate-400 leading-normal">
                            I accept the JCI India Zone 12 <a href="#" class="text-brand-500 hover:underline font-bold">Terms &amp; Conditions</a> and <a href="#" class="text-brand-500 hover:underline font-bold">Privacy Policy</a>.
                        </span>
                    </div>

                    <!-- CTA Button -->
                    <button type="submit" class="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-2.5 rounded-xl transition shadow-lg shadow-brand-500/20 active:scale-[0.99] text-xs">
                        Create Account
                    </button>
                </form>

                <div class="mt-6 pt-5 border-t border-slate-800 text-center text-xs space-y-3">
                    <p class="text-slate-400">
                        Already have an account? 
                        <a href="login.php" class="text-brand-500 hover:underline font-bold">Sign In</a>
                    </p>
                    <div>
                        <a href="index.html" class="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition">
                            <i class="fa-solid fa-arrow-left"></i>
                            <span>Back to Home Page</span>
                        </a>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <script>
        function setRegistrationRole(role, btn) {
            // Update hidden input
            document.getElementById('reg-role').value = role;
            
            // Remove active classes
            document.querySelectorAll('.reg-role-btn').forEach(b => {
                b.classList.remove('bg-brand-500', 'text-white');
                b.classList.add('text-slate-400', 'hover:text-white');
            });
            
            // Add active classes
            btn.classList.remove('text-slate-400', 'hover:text-white');
            btn.classList.add('bg-brand-500', 'text-white');
            
            // Update select type mapping
            const selectEl = document.getElementById('user-type-select');
            if (role === 'vendor') {
                selectEl.value = 'business';
            } else {
                if (selectEl.value === 'business') {
                    selectEl.value = 'individual';
                }
            }
        }
        
        function onUserTypeChange() {
            const selectEl = document.getElementById('user-type-select');
            const btns = document.querySelectorAll('.reg-role-btn');
            
            if (selectEl.value === 'business') {
                document.getElementById('reg-role').value = 'vendor';
                btns[0].classList.remove('bg-brand-500', 'text-white');
                btns[0].classList.add('text-slate-400', 'hover:text-white');
                btns[1].classList.remove('text-slate-400', 'hover:text-white');
                btns[1].classList.add('bg-brand-500', 'text-white');
            } else {
                document.getElementById('reg-role').value = 'user';
                btns[1].classList.remove('bg-brand-500', 'text-white');
                btns[1].classList.add('text-slate-400', 'hover:text-white');
                btns[0].classList.remove('text-slate-400', 'hover:text-white');
                btns[0].classList.add('bg-brand-500', 'text-white');
            }
        }
    </script>
</body>
</html>
