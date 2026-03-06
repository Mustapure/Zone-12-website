<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="favicon.png">
    <title>JCI Zone 12</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="css/common.css">
    <link rel="stylesheet" href="css/index.css">
</head>

<body>

    <!-- Top Navigation Bar -->
    <nav class="navbar">
        <a href="index.php" class="navbar-brand">
            <img src="JCI Zone.png" alt="JCI Logo">
        </a>
        <div class="navbar-menu">
            <a href="index.php" class="nav-item <?php echo ($page == 'home') ? 'active' : ''; ?>">
                <i class="fas fa-home"></i>Dashboard
            </a>
            <a href="leaders.php" class="nav-item <?php echo ($page == 'leaders') ? 'active' : ''; ?>">
                <i class="fas fa-users"></i>Leaders
            </a>
            <a href="dir.php" class="nav-item <?php echo ($page == 'dir') ? 'active' : ''; ?>">
                <i class="fas fa-address-book"></i>DIR
            </a>
            <a href="partner.php" class="nav-item <?php echo ($page == 'partner') ? 'active' : ''; ?>">
                <i class="fas fa-handshake"></i>Partner
            </a>
            <a href="events.php" class="nav-item <?php echo ($page == 'events') ? 'active' : ''; ?>">
                <i class="fas fa-calendar-alt"></i>Events
            </a>
            <a href="#" class="nav-item login-btn">Login</a>
        </div>
    </nav>

