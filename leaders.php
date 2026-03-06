<?php $page = 'leaders'; include 'include/header.php'; ?>

    <header class="hero-section">
        <h1>Board of Directors</h1>
        <p>JCI Board of Directors is composed of dynamic young leaders from around the world who provide strategic direction and visionary leadership.</p>
    </header>

    <div class="container">
        <div class="profile-grid president-section">
            <div class="profile-card">
                <img src="https://jci.cc/wp-content/uploads/2026/01/WPAlejandra-Castillo-1-200x300.png" alt="Alejandra Castillo" class="profile-image">
                <div class="profile-info">
                    <h3 class="profile-name">Alejandra Castillo</h3>
                    <p class="profile-position">President</p>
                    <p class="profile-country">JCI BOLIVIA</p>
                </div>
            </div>
        </div>

        <div class="profile-grid">
            <div class="profile-card">
                <img src="https://jci.cc/wp-content/uploads/2026/01/Kengo-Suzuki-200x300.png" alt="Kengo Suzuki" class="profile-image">
                <div class="profile-info">
                    <h3 class="profile-name">Kengo Suzuki</h3>
                    <p class="profile-position">Vice President</p>
                    <p class="profile-country">JCI JAPAN</p>
                </div>
            </div>

            <div class="profile-card">
                <img src="https://jci.cc/wp-content/uploads/2026/01/Naranbaatar-Otgonchuluun-200x300.png" alt="Naranbaatar Otgonchuluun" class="profile-image">
                <div class="profile-info">
                    <h3 class="profile-name">Naranbaatar Otgonchuluun</h3>
                    <p class="profile-position">Vice President</p>
                    <p class="profile-country">JCI MONGOLIA</p>
                </div>
            </div>
        </div>
    </div>

    <style>
        .hero-section {
            margin-top: 70px;
            padding: 80px 20px;
            text-align: center;
            background: linear-gradient(135deg, #0096D6 0%, #007bb5 100%);
            color: white;
        }

        .hero-section h1 {
            font-size: 2.5rem;
            margin-bottom: 15px;
            font-weight: 700;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
        }

        .profile-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
            margin: 0 auto 40px;
            max-width: 1000px;
        }

        .profile-grid.president-section {
            grid-template-columns: 1fr;
            max-width: 250px;
            margin: 0 auto 40px;
        }

        .profile-card {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            text-align: center;
            transition: transform 0.3s;
        }

        .profile-card:hover {
            transform: translateY(-8px);
        }

        .profile-image {
            width: 100%;
            aspect-ratio: 2/3;
            object-fit: cover;
            background: #e0e0e0;
        }

        .profile-info {
            padding: 20px;
        }

        .profile-name {
            color: var(--jci-blue);
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 8px;
        }

        .profile-position {
            color: #555;
            font-size: 0.95rem;
            margin-bottom: 5px;
        }

        .profile-country {
            color: #888;
            font-size: 0.85rem;
            text-transform: uppercase;
        }
    </style>

<?php include 'include/footer.php'; ?>

