<?php
session_start();

// Redirect if already logged in
if (isset($_SESSION['user_id'])) {
    header("Location: dashboard.php");
    exit();
}

$error = $_SESSION['error'] ?? '';
unset($_SESSION['error']);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <title>JCI Login</title>
</head>
<body class="bg-[#1a2332] text-white min-h-screen flex items-center justify-center p-4">

    <div class="flex flex-col md:flex-row w-full max-w-6xl bg-[#252f44] rounded-xl overflow-hidden shadow-2xl min-h-[600px]">
        
        <div class="hidden md:flex md:w-3/5 p-12 flex-col justify-between bg-gradient-to-br from-[#1a2332] to-[#252f44]">
            <h1 class="text-3xl font-bold italic">JCI <span class="bg-blue-500 p-1 rounded-md not-italic">🛡️</span></h1>
            
            <div class="bg-[#1e273a] p-8 rounded-2xl border border-gray-700/50">
                <div class="flex justify-between text-xs font-bold tracking-widest mb-6 border-b border-gray-700 pb-2">
                    <span>NEWS</span>
                    <span class="text-gray-500">JCI WORLDWIDE</span>
                </div>
                <div class="grid grid-cols-3 gap-4">
                    <div class="aspect-square bg-sky-500 rounded-lg p-2 text-[10px] font-bold">"Humanity matters most."</div>
                    <div class="aspect-square bg-gray-600 rounded-lg"></div>
                    <div class="aspect-square bg-pink-600 rounded-lg p-2 text-[10px] font-bold">CSW70 Forum</div>
                </div>
            </div>
        </div>

        <div class="w-full md:w-2/5 bg-[#2b364d] p-10">
            <h2 class="text-3xl font-bold mb-2">Welcome To JCI! 👋</h2>
            <p class="text-gray-400 text-sm mb-8">Sign in to your leadership journey.</p>

            <?php if ($error): ?>
                <div class="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm">
                    <?php echo htmlspecialchars($error); ?>
                </div>
            <?php endif; ?>

            <form action="auth.php" method="POST" class="space-y-6">
                <div>
                    <label class="block text-sm text-gray-400 mb-2">Email</label>
                    <input type="email" name="email" required
                        class="w-full bg-transparent border-2 border-blue-500/50 rounded-lg px-4 py-3 focus:border-blue-500 outline-none transition-all">
                </div>

                <div>
                    <label class="block text-sm text-gray-400 mb-2">Password</label>
                    <input type="password" name="password" required
                        class="w-full bg-[#1e273a] rounded-lg px-4 py-3 outline-none">
                </div>

                <div class="flex items-center justify-between text-sm">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="remember" class="accent-blue-500">
                        <span class="text-gray-400">Remember Me</span>
                    </label>
                    <a href="#" class="text-blue-400 hover:underline">Forgot Password?</a>
                </div>

                <button type="submit" class="w-full bg-blue-500 hover:bg-blue-600 py-3 rounded-lg font-bold transition-all">
                    Login
                </button>
            </form>
        </div>
    </div>
</body>
</html>