<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="favicon.png">
    <title>JCI Zone 12</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        :root {
            --jci-blue: #0096D6;
            --bg-light: #f8f9fa;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            font-family: 'Segoe UI', sans-serif;
            background-color: var(--bg-light);
        }

        /* Top Navigation Bar */
        .navbar {
            background: #ffffff;
            border-bottom: 1px solid #ddd;
            padding: 0 30px;
            height: 70px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
        }

        .navbar-brand {
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--jci-blue);
            display: flex;
            align-items: center;
            gap: 10px;
            text-decoration: none;
        }

        .navbar-brand img {
            height: 40px;
            width: auto;
        }

        .navbar-menu {
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .nav-item {
            padding: 10px 15px;
            text-decoration: none;
            color: #555;
            display: flex;
            align-items: center;
            transition: 0.3s;
            font-weight: 500;
            border-radius: 5px;
            font-size: 0.85rem;
        }

        .nav-item i {
            margin-right: 6px;
            width: 18px;
            text-align: center;
            font-size: 0.9rem;
        }

        .nav-item:hover {
            background-color: #eef9ff;
            color: var(--jci-blue);
        }

        .nav-item.active {
            background-color: #eef9ff;
            color: var(--jci-blue);
        }

        .nav-item.login-btn {
            background-color: var(--jci-blue);
            color: white;
            margin-left: 10px;
        }

        .nav-item.login-btn:hover {
            background-color: #007bb5;
            color: white;
        }

        /* Content Area */
        .main-content {
            margin-top: 70px;
            padding: 40px;
            width: 100%;
            flex: 1;
        }

        /* Welcome Section */
        .welcome-section {
            text-align: center;
            margin-bottom: 40px;
        }

        .welcome-section h2 {
            color: var(--jci-blue);
            font-size: 2rem;
            margin-bottom: 10px;
        }

        .welcome-section p {
            color: #666;
            font-size: 1.1rem;
        }

        /* Creed, Vision & Mission Section */
        .cvm-section {
            margin: 30px 0;
        }

        .cvm-section-title {
            text-align: center;
            margin-bottom: 30px;
        }

        .cvm-section-title h3 {
            color: var(--jci-blue);
            font-size: 1.8rem;
            margin-bottom: 8px;
        }

        .cvm-section-title p {
            color: #666;
            font-size: 1rem;
        }

        .cvm-cards {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 25px;
        }

        .cvm-card {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
            transition: transform 0.3s, box-shadow 0.3s;
        }

        .cvm-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
        }

        .cvm-card h4 {
            color: var(--jci-blue);
            font-size: 1.3rem;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .cvm-card p {
            color: #555;
            line-height: 1.7;
            font-size: 0.95rem;
        }

        .creed-list {
            list-style: none;
            padding: 0;
        }

        .creed-list li {
            color: #555;
            line-height: 1.8;
            padding-left: 20px;
            position: relative;
            margin-bottom: 8px;
        }

        .creed-list li::before {
            content: "•";
            color: var(--jci-blue);
            position: absolute;
            left: 0;
            font-weight: bold;
        }

        /* Highlights Section */
        .highlights-section {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            margin-top: 30px;
        }

        .highlights-section h4 {
            color: var(--jci-blue);
            margin-bottom: 15px;
            font-size: 1.2rem;
        }

        .highlights-section p {
            color: #555;
        }

        /* Four Areas of Opportunity */
        .fao-section {
            margin: 50px 0 30px 0;
        }

        .fao-section-title {
            text-align: center;
            margin-bottom: 30px;
        }

        .fao-section-title h3 {
            color: var(--jci-blue);
            font-size: 1.8rem;
            margin-bottom: 8px;
        }

        .fao-section-title p {
            color: #666;
            font-size: 1rem;
            max-width: 700px;
            margin: 0 auto;
            line-height: 1.6;
        }

        .fao-cards {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
        }

        .fao-card {
            background: white;
            padding: 25px 20px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
            text-align: center;
            transition: transform 0.3s, box-shadow 0.3s;
        }

        .fao-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
        }

        .fao-card .icon {
            width: 60px;
            height: 60px;
            background: #eef9ff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 15px;
        }

        .fao-card .icon i {
            font-size: 1.5rem;
            color: var(--jci-blue);
        }

        .fao-card h4 {
            color: var(--jci-blue);
            font-size: 1rem;
            margin-bottom: 8px;
            font-weight: 600;
        }

        .fao-card p {
            color: #666;
            font-size: 0.85rem;
            line-height: 1.5;
        }

        /* Footer Styling */
        .footer {
            position: relative;
            background: #ffffff;
            border-top: 1px solid #ddd;
            padding: 30px 40px;
            color: #666;
            font-size: 0.85rem;
            margin-top: auto;
        }

        .footer-container {
            display: flex;
            flex-wrap: wrap;
            gap: 30px;
            justify-content: space-between;
        }

        .footer-section {
            flex: 1;
            min-width: 150px;
        }

        .footer-section h4 {
            color: var(--jci-blue);
            margin: 0 0 10px 0;
            font-size: 0.9rem;
            font-weight: 600;
        }

        .footer-section ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .footer-section ul li {
            margin-bottom: 5px;
        }

        .footer-section a {
            color: #666;
            text-decoration: none;
            transition: 0.3s;
        }

        .footer-section a:hover {
            color: var(--jci-blue);
        }

        .social-links {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }

        .social-links a {
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: #f0f0f0;
            color: #666;
            transition: 0.3s;
        }

        .social-links a:hover {
            background: var(--jci-blue);
            color: white;
        }

        .footer-bottom {
            border-top: 1px solid #eee;
            margin-top: 15px;
            padding-top: 15px;
            text-align: center;
            width: 100%;
        }

        /* Responsive */
        @media (max-width: 1024px) {
            .fao-cards {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 768px) {
            .navbar {
                padding: 0 15px;
                flex-wrap: wrap;
                height: auto;
                padding: 10px 15px;
            }

            .navbar-menu {
                flex-wrap: wrap;
                gap: 5px;
            }

            .main-content {
                margin-top: 120px;
                padding: 20px;
            }

            .cvm-cards {
                grid-template-columns: 1fr;
            }

            .footer {
                padding: 20px;
            }

            .footer-container {
                gap: 15px;
            }
        }

        @media (max-width: 576px) {
            .fao-cards {
                grid-template-columns: 1fr;
            }
        }
    </style>
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

