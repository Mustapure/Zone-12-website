<?php
/**
 * JCI Zone 12 - Login Page
 * User authentication login form
 */

require_once 'config/database.php';
require_once 'config/session.php';
require_once 'config/functions.php';

redirectIfLoggedIn();

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    
    $result = loginUser($email, $password);
    
    if ($result['status'] === 'success') {
        $user = getUserByEmail($email);
        if ($user) {
            createUserSession($user['id'], $user['email'], $user['first_name'] . ' ' . $user['last_name'], $user['user_type']);
            header("Location: dashboard.php");
            exit;
        }
    } else {
        $error = $result['message'];
    }
}

$page = 'login';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <title>Login - JCI Zone 12</title>
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
<body class="bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen flex items-center justify-center p-4">

    <div class="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div class="flex flex-col lg:flex-row">
            
            <!-- Left Side - Brand Section -->
            <div class="lg:w-1/2 bg-gradient-to-br from-jci to-jci-dark p-6 lg:p-8 relative overflow-hidden">
                <div class="absolute top-[-60px] right-[-60px] w-40 h-40 bg-white/10 rounded-full"></div>
                <div class="absolute bottom-[-30px] left-[-30px] w-28 h-28 bg-white/10 rounded-full"></div>
                
                <div class="relative z-10 h-full flex flex-col justify-between">
                    <div>
                        <img src="JCI Zone.png" alt="JCI Zone 12" class="h-12 mb-4">
                        <h1 class="text-2xl font-bold text-white mb-2">JCI Zone 12</h1>
                        <p class="text-white/90 text-sm">Join a global network of young active citizens building a better world.</p>
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
                        <a href="register.php" class="inline-block px-4 py-1.5 bg-white text-jci-dark text-sm font-semibold rounded-lg hover:bg-white/90 transition">
                            <i class="fas fa-user-plus mr-1"></i>Join Now
                        </a>
                    </div>
                </div>
            </div>
            
            <!-- Right Side - Login Form -->
            <div class="lg:w-1/2 p-6 lg:p-8">
                <div class="max-w-sm mx-auto">
                    <h2 class="text-xl font-bold text-gray-800 mb-1">Welcome Back! 👋</h2>
                    <p class="text-gray-500 text-sm mb-5">Sign in to continue</p>


                    <?php 
                    // Check for session errors (from authnew.php redirect)
                    if (isset($_SESSION['error'])) {
                        $error = $_SESSION['error'];
                        unset($_SESSION['error']);
                    }
                    if ($error): ?>
                        <div class="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded mb-4 text-sm">
                            <i class="fas fa-exclamation-circle mr-2"></i><?php echo htmlspecialchars($error); ?>
                        </div>
                    <?php endif; ?>

                    <form action="authnew.php" method="POST" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" name="email" required 
                                value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>"
                                class="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-jci focus:outline-none text-sm"
                                placeholder="you@example.com">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input type="password" name="password" required 
                                class="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-jci focus:outline-none text-sm"
                                placeholder="••••••••">
                        </div>

                        <div class="flex items-center justify-between text-sm">
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="remember" class="w-4 h-4 text-jci rounded">
                                <span class="text-gray-600">Remember me</span>
                            </label>
                            <a href="forgot-password.php" class="text-jci hover:underline">Forgot?</a>
                        </div>

                        <button type="submit" class="w-full bg-jci hover:bg-jci-dark text-white font-semibold py-2.5 rounded-lg transition text-sm">
                            <i class="fas fa-sign-in-alt mr-2"></i> Sign In
                        </button>
                    </form>

                    <div class="mt-4 text-center">
                        <p class="text-gray-600 text-sm">Don't have an account? 
                            <a href="register.php" class="text-jci font-semibold hover:underline">Register</a>
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

