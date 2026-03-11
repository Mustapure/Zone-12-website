 e<?php
/**
 * JCI Zone 12 - Login Page
 * User authentication login form
 */

// Include configuration files
require_once 'config/database.php';
require_once 'config/session.php';
require_once 'config/functions.php';

// Redirect to dashboard if already logged in
redirectIfLoggedIn();

$error = '';
$success = '';

// Process login form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    
    $result = loginUser($email, $password);
    
    if ($result['status'] === 'success') {
        $user = getUserByEmail($email);
        if ($user) {
            createUserSession($user['id'], $user['email'], $user['first_name'] . ' ' . $user['last_name'], $user['user_type']);
            
            if (isset($_POST['remember'])) {
                setcookie("user_login", $email, time() + (86400 * 30), "/");
            }
            
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
                        jci: {
                            light: '#eef9ff',
                            DEFAULT: '#0096D6',
                            dark: '#006699'
                        }
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-gradient-to-br from-jci-light via-white to-jci-light min-h-screen flex items-center justify-center p-4">

    <div class="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
    <div class="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div class="flex flex-col lg:flex-row">
            
            <!-- Left Side - Brand Section -->
            <div class="lg:w-1/2 bg-gradient-to-br from-jci to-jci-dark p-10 lg:p-14 relative overflow-hidden">
                <!-- Decorative circles -->
                <div class="absolute top-[-100px] right-[-100px] w-64 h-64 bg-white/10 rounded-full"></div>
                <div class="absolute bottom-[-50px] left-[-50px] w-40 h-40 bg-white/10 rounded-full"></div>
                <div class="absolute top-1/2 left-1/4 w-20 h-20 bg-white/10 rounded-full"></div>
                
                <div class="relative z-10 h-full flex flex-col justify-between">
                    <div>
                        <img src="JCI Zone.png" alt="JCI Zone 12" class="h-16 mb-8">
                        <h1 class="text-4xl font-bold text-white mb-4">JCI Zone 12</h1>
                        <p class="text-white/90 text-lg mb-8 leading-relaxed">Join a global network of young active citizens building a better world.</p>
                    </div>
                    
                    <div class="space-y-4">
                        <div class="flex items-center gap-4 text-white">
                            <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <i class="fas fa-users text-xl"></i>
                            </div>
                            <div>
                                <h3 class="font-semibold">Connect</h3>
                                <p class="text-white/70 text-sm">Network with young leaders</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-4 text-white">
                            <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <i class="fas fa-calendar-alt text-xl"></i>
                            </div>
                            <div>
                                <h3 class="font-semibold">Engage</h3>
                                <p class="text-white/70 text-sm">Participate in events</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-4 text-white">
                            <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <i class="fas fa-bullhorn text-xl"></i>
                            </div>
                            <div>
                                <h3 class="font-semibold">Impact</h3>
                                <p class="text-white/70 text-sm">Make a difference</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mt-8 pt-6 border-t border-white/20">
                        <p class="text-white/80 text-sm">Already a member?</p>
                        <a href="register.php" class="inline-block mt-2 px-6 py-2 bg-white text-jci-dark font-semibold rounded-lg hover:bg-white/90 transition">
                            <i class="fas fa-user-plus mr-2"></i>Join Now
                        </a>
                    </div>
                </div>
            </div>
            
            <!-- Right Side - Login Form -->
            <div class="lg:w-1/2 p-10 lg:p-14">
                <div class="max-w-md mx-auto">
                    <div class="text-center mb-10">
                        <h2 class="text-3xl font-bold text-gray-800 mb-2">Welcome Back! 👋</h2>
                        <p class="text-gray-500">Sign in to continue your journey</p>
                    </div>

                    <?php if ($error): ?>
                        <div class="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg mb-6">
                            <div class="flex items-center gap-3">
                                <i class="fas fa-exclamation-circle"></i>
                                <span><?php echo htmlspecialchars($error); ?></span>
                            </div>
                        </div>
                    <?php endif; ?>

                    <?php if ($success): ?>
                        <div class="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-r-lg mb-6">
                            <div class="flex items-center gap-3">
                                <i class="fas fa-check-circle"></i>
                                <span><?php echo htmlspecialchars($success); ?></span>
                            </div>
                        </div>
                    <?php endif; ?>

                    <form action="authnew.php" method="POST" class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <i class="fas fa-envelope text-gray-400"></i>
                                </div>
                                <input type="email" name="email" required 
                                    value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>"
                                    class="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-jci focus:outline-none transition-colors"
                                    placeholder="you@example.com">
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <i class="fas fa-lock text-gray-400"></i>
                                </div>
                                <input type="password" name="password" required id="password"
                                    class="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-jci focus:outline-none transition-colors"
                                    placeholder="••••••••">
                                <button type="button" onclick="togglePassword()" class="absolute inset-y-0 right-0 pr-4 flex items-center">
                                    <i class="fas fa-eye text-gray-400 hover:text-jci" id="toggleIcon"></i>
                                </button>
                            </div>
                        </div>

                        <div class="flex items-center justify-between">
                            <label class="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="remember" class="w-4 h-4 text-jci rounded focus:ring-jci">
                                <span class="text-sm text-gray-600">Remember me</span>
                            </label>
                            <a href="forgot-password.php" class="text-sm text-jci hover:text-jci-dark font-medium">
                                Forgot Password?
                            </a>
                        </div>

                        <button type="submit" class="w-full bg-jci hover:bg-jci-dark text-white font-semibold py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-jci/30">
                            <i class="fas fa-sign-in-alt mr-2"></i> Sign In
                        </button>
                    </form>

                    <div class="mt-8 text-center">
                        <p class="text-gray-600">
                            Don't have an account? 
                            <a href="register.php" class="text-jci font-semibold hover:underline">Register here</a>
                        </p>
                    </div>

                    <div class="mt-6 flex items-center justify-center gap-4">
                        <div class="h-px bg-gray-200 flex-1"></div>
                        <span class="text-gray-400 text-sm">or</span>
                        <div class="h-px bg-gray-200 flex-1"></div>
                    </div>

                    <div class="mt-6 text-center">
                        <a href="index.php" class="inline-flex items-center gap-2 text-gray-500 hover:text-jci transition">
                            <i class="fas fa-arrow-left"></i>
                            Back to Home
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        function togglePassword() {
            const passwordInput = document.getElementById('password');
            const toggleIcon = document.getElementById('toggleIcon');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleIcon.classList.remove('fa-eye');
                toggleIcon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                toggleIcon.classList.remove('fa-eye-slash');
                toggleIcon.classList.add('fa-eye');
            }
        }
    </script>

</body>
</html>

