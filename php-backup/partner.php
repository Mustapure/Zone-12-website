<?php $page = 'partner'; include 'include/header.php'; ?>

    <header class="hero-section">
        <h1>Our Partners</h1>
        <p>Collaborating with organizations that share our vision for positive change.</p>
    </header>

    <div class="container">
        <div class="partners-grid">
            <div class="partner-card">
                <div class="partner-logo">
                    <i class="fas fa-building"></i>
                </div>
                <h3 class="partner-name">Corporate Partners</h3>
                <p class="partner-description">Strategic alliances with leading corporations to empower young leaders and create sustainable impact in communities.</p>
            </div>

            <div class="partner-card">
                <div class="partner-logo">
                    <i class="fas fa-university"></i>
                </div>
                <h3 class="partner-name">Educational Institutions</h3>
                <p class="partner-description">Partnerships with universities and schools to provide leadership development opportunities for students.</p>
            </div>

            <div class="partner-card">
                <div class="partner-logo">
                    <i class="fas fa-hand-holding-heart"></i>
                </div>
                <h3 class="partner-name">NGOs & Foundations</h3>
                <p class="partner-description">Collaborating with non-profit organizations to address social challenges and create meaningful change.</p>
            </div>

            <div class="partner-card">
                <div class="partner-logo">
                    <i class="fas fa-globe-americas"></i>
                </div>
                <h3 class="partner-name">International Organizations</h3>
                <p class="partner-description">Working with global entities to promote international cooperation and youth empowerment.</p>
            </div>
        </div>

        <div class="become-partner-section">
            <h2>Become a Partner</h2>
            <p>Join us in creating positive change. Become a JCI partner and help empower young leaders worldwide.</p>
            <a href="contact.php" class="btn-partner">Contact Us</a>
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

        .partners-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 30px;
            margin-bottom: 50px;
        }

        .partner-card {
            background: white;
            border-radius: 15px;
            padding: 30px;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            transition: transform 0.3s;
        }

        .partner-card:hover {
            transform: translateY(-5px);
        }

        .partner-logo {
            width: 80px;
            height: 80px;
            background: #eef9ff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
        }

        .partner-logo i {
            font-size: 2rem;
            color: var(--jci-blue);
        }

        .partner-name {
            color: var(--jci-blue);
            font-size: 1.3rem;
            margin-bottom: 10px;
        }

        .partner-description {
            color: #666;
            font-size: 0.95rem;
            line-height: 1.6;
        }

        .become-partner-section {
            text-align: center;
            background: white;
            padding: 50px;
            border-radius: 15px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .become-partner-section h2 {
            color: var(--jci-blue);
            font-size: 2rem;
            margin-bottom: 15px;
        }

        .become-partner-section p {
            color: #666;
            font-size: 1.1rem;
            margin-bottom: 25px;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }

        .btn-partner {
            display: inline-block;
            padding: 12px 30px;
            background: var(--jci-blue);
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-size: 1rem;
            transition: 0.3s;
        }

        .btn-partner:hover {
            background: #007bb5;
        }
    </style>

<?php include 'include/footer.php'; ?>

