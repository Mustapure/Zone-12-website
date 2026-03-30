<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="favicon.png">
    <title><?php echo isset($page_title) ? $page_title : 'JCI Zone 12'; ?></title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="css/common.css">
    <?php if (isset($page) && $page == 'home'): ?>
    <link rel="stylesheet" href="css/index.css">
    <?php endif; ?>

</head>

<body>

<?php 
require_once 'config/session.php'; 
requireLogin(); 
?>


    <!-- Top Navigation Bar -->
    <nav class="navbar">
        <a href="index.php" class="navbar-brand">
            <img src="JCI Zone.png" alt="JCI Logo">
        </a>
        <div class="navbar-menu">
            <?php if (isLoggedIn()): 
                $userName = getCurrentUserName() ?: getCurrentUserEmail();
            ?>
            <a href="dashboard.php" class="nav-item <?php echo ($page == 'dashboard') ? 'active' : ''; ?>">
                <i class="fas fa-tachometer-alt"></i> Dashboard
            </a>
            <a href="dir.php" class="nav-item <?php echo ($page == 'dir') ? 'active' : ''; ?>">
                <i class="fas fa-address-book"></i> DIR
            </a>
            <a href="add-business.php" class="nav-item <?php echo ($page == 'add-business') ? 'active' : ''; ?>">
                <i class="fas fa-plus"></i> Add Business
            </a>
            <a href="leaders.php" class="nav-item <?php echo ($page == 'leaders') ? 'active' : ''; ?>">
                <i class="fas fa-users"></i> Leaders
            </a>
            <a href="events.php" class="nav-item <?php echo ($page == 'events') ? 'active' : ''; ?>">
                <i class="fas fa-calendar-alt"></i> Events
            </a>
            <a href="partner.php" class="nav-item <?php echo ($page == 'partner') ? 'active' : ''; ?>">
                <i class="fas fa-handshake"></i> Partner
            </a>
            <span class="nav-user">
                <i class="fas fa-user"></i> Hi, <?php echo htmlspecialchars($userName); ?>
            </span>
            <a href="logout.php" class="nav-item login-btn bg-red-500 hover:bg-red-600">
                <i class="fas fa-sign-out-alt"></i> Logout
            </a>
            <?php else: ?>
            <a href="dashboard.php" class="nav-item <?php echo ($page == 'dashboard') ? 'active' : ''; ?>">
                <i class="fas fa-tachometer-alt"></i> Dashboard
            </a>
            <a href="dir.php" class="nav-item <?php echo ($page == 'dir') ? 'active' : ''; ?>">
                <i class="fas fa-address-book"></i> DIR
            </a>
            <a href="login.php" class="nav-item login-btn">Login</a>
            <a href="register.php" class="nav-item login-btn bg-green-500 hover:bg-green-600 ml-2">Register</a>
            <?php endif; ?>
        </div>
    </nav>

