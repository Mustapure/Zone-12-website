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

<?php require_once 'config/session.php'; ?>



    <!-- Top Navigation Bar -->
    <nav class="navbar">
        <a href="index.php" class="navbar-brand">
            <img src="JCI Zone.png" alt="JCI Logo">
        </a>
        <div class="navbar-menu">
<?php 
                $userName = getCurrentUserName() ?: getCurrentUserEmail();
            ?>

            <a href="index.php" class="nav-item <?php echo ($page == 'home') ? 'active' : ''; ?>">
                <i class="fas fa-home"></i> Home
            </a>

            <a href="dir.php" class="nav-item <?php echo ($page == 'dir') ? 'active' : ''; ?>">

                <i class="fas fa-address-book"></i> DIR
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
            <a href="contact.php" class="nav-item <?php echo ($page == 'contact') ? 'active' : ''; ?>">
                <i class="fas fa-envelope"></i> Contact Us
            </a>

            <span class="nav-user">
                <i class="fas fa-user"></i> Hi, <?php echo htmlspecialchars($userName); ?>
            </span>
        
        </div>

    </nav>

