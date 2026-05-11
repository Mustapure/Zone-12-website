<?php
// Registration removed.
http_response_code(410);
echo "Registration has been disabled.";
exit;


require_once 'config/database.php';
require_once 'config/session.php';
require_once 'config/functions.php';

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $result = registerUser($_POST);
    
    if ($result['status'] === 'success') {
        $success = $result['message'] . ' <a href="login.php" class="font-semibold underline">Click here to login</a>';
    } else {
        $error = $result['message'];
    }
}

$page = 'register';
redirectIfLoggedIn();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <title>Register - JCI Zone 12</title>
    <link rel="icon" type="image/png" href="favicon.png">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
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
<body class="bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen flex items-center justify-center p-4">

    <div class="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div class="flex flex-col lg:flex-row">
            
            <!-- Left Side - Brand Section -->
            <div class="lg:w-1/2 bg-gradient-to-br from-jci to-jci-dark p-6 lg:p-8 relative overflow-hidden">
                <div class="absolute top-[-60px] right-[-60px] w-40 h-40 bg-white/10 rounded-full"></div>
                <div class="absolute bottom-[-30px] left-[-30px] w-28 h-28 bg-white/10 rounded-full"></div>
                
                <div class="relative z-10 h-full flex flex-col justify-between">
                    <div>
                        <img src="JCI Zone.png" alt="JCI Zone 12" class="h-12 mb-4">
                        <h1 class="text-2xl font-bold text-white mb-2">Join JCI Zone 12</h1>
                        <p class="text-white/90 text-sm">Become part of a global network of young active citizens building a better world.</p>
                    </div>
                    
                    <div class="space-y-3 mt-4">
                        <div class="flex items-center gap-3 text-white text-sm">
                            <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-xs">
                                <i class="fas fa-users"></i>
                            </div>
                            <span>Connect with young leaders</span>
                        </div>
                        <div class="flex items-center gap-3 text-white text-sm">
                            <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-xs">
                                <i class="fas fa-calendar-alt"></i>
                            </div>
                            <span>Access exclusive events</span>
                        </div>
                        <div class="flex items-center gap-3 text-white text-sm">
                            <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-xs">
                                <i class="fas fa-bullhorn"></i>
                            </div>
                            <span>Make a real impact</span>
                        </div>
                    </div>
                    
                    <div class="mt-4 pt-3 border-t border-white/20">
                        <p class="text-white/80 text-sm">Already a member? 
                            <a href="login.php" class="inline-block px-4 py-1.5 bg-white text-jci-dark text-sm font-semibold rounded-lg hover:bg-white/90 transition">
                                <i class="fas fa-sign-in-alt mr-1"></i>Sign In
                            </a>
                        </p>
                    </div>
                </div>
            </div>
            
            <!-- Right Side - Registration Form -->
            <div class="lg:w-1/2 p-6 lg:p-8">
                <div class="max-w-md mx-auto">
                    <h2 class="text-xl font-bold text-gray-800 mb-1">Create Account! 👋</h2>
                    <p class="text-gray-500 text-sm mb-5">Join the JCI Zone 12 community</p>

                    <?php if ($error): ?>
                        <div class="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded mb-4 text-sm">
                            <i class="fas fa-exclamation-circle mr-2"></i><?php echo htmlspecialchars($error); ?>
                        </div>
                    <?php endif; ?>

                    <?php if ($success): ?>
                        <div class="bg-green-50 border-l-4 border-green-500 text-green-700 p-3 rounded mb-4 text-sm">
                            <i class="fas fa-check-circle mr-2"></i><?php echo $success; ?>
                        </div>
                    <?php endif; ?>

                    <form action="register.php" method="POST" class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                                <input type="text" name="first_name" required 
                                    value="<?php echo htmlspecialchars($_POST['first_name'] ?? ''); ?>"
                                    class="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-jci focus:outline-none text-sm"
                                    placeholder="John">
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                                <input type="text" name="last_name" required 
                                    value="<?php echo htmlspecialchars($_POST['last_name'] ?? ''); ?>"
                                    class="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-jci focus:outline-none text-sm"
                                    placeholder="Doe">
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                            <input type="email" name="email" required 
                                value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>"
                                class="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-jci focus:outline-none text-sm"
                                placeholder="you@example.com">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input type="tel" name="phone" 
                                value="<?php echo htmlspecialchars($_POST['phone'] ?? ''); ?>"
                                class="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-jci focus:outline-none text-sm"
                                placeholder="+91 98765 43210">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Membership Type *</label>
                            <select name="user_type" required 
                                class="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-jci focus:outline-none text-sm">
                                <option value="individual">Individual Member</option>
                                <option value="educational">Educational Institution</option>
                                <option value="corporate">Corporate/Organization</option>
                                <option value="business">Business Owner</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">JCI Chapter Name</label>
                            <input type="text" name="chapter_name" 
                                value="<?php echo htmlspecialchars($_POST['chapter_name'] ?? ''); ?>"
                                class="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-jci focus:outline-none text-sm"
                                placeholder="e.g., JCI Mumbai">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                            <input type="text" name="organization_name" 
                                value="<?php echo htmlspecialchars($_POST['organization_name'] ?? ''); ?>"
                                class="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-jci focus:outline-none text-sm"
                                placeholder="Your Company/Organization">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                            <input type="password" name="password" required 
                                class="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-jci focus:outline-none text-sm"
                                placeholder="Min 8 characters">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                            <input type="password" name="confirm_password" required 
                                class="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-jci focus:outline-none text-sm"
                                placeholder="Confirm your password">
                        </div>

                        <div class="flex items-start gap-2">
                            <input type="checkbox" required class="w-4 h-4 text-jci rounded mt-0.5">
<span class="text-xs text-gray-600">I agree to the <a href="#" class="text-jci hover:underline">Terms & Conditions</a> and <a href="#" class="text-jci hover:underline">Privacy Policy</a></span>
                        </div>

                        <button type="submit" class="w-full bg-jci hover:bg-jci-dark text-white font-semibold py-2.5 rounded-lg transition text-sm">
                            <i class="fas fa-user-plus mr-2"></i> Create Account
                        </button>
                    </form>

                    <div class="mt-4 text-center">
                        <p class="text-gray-600 text-sm">Already have an account? 
                            <a href="login.php" class="text-jci font-semibold hover:underline">Sign In</a>
                        </p>
                    </div>

                    <div class="mt-3 flex items-center justify-center gap-3">
                        <div class="h-px bg-gray-200 flex-1"></div>
                        <span class="text-gray-400 text-xs">or</span>
                        <div class="h-px bg-gray-200 flex-1"></div>
                    </div>

                    <div class="mt-3 text-center">
                        <a href="index.php" class="text-gray-500 hover:text-jci text-sm">
                            <i class="fas fa-arrow-left mr-1"></i> Back to Home
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>

</body>
</html>

