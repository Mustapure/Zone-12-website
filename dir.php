<?php $page = 'dir'; include 'include/header.php'; ?>

    <header class="hero-section">
        <h1>Business Directory</h1>
        <p>Connecting JCI members and their businesses across the world.</p>
    </header>

    <div class="container">
        <div class="dir-grid">
            <div class="business-card">
                <h3 class="business-name">Creative Pulse Marketing</h3>
                <p class="owner-name">Owned by: JC John Doe</p>
                <div class="tag-container">
                    <span class="tag">Service Provider</span>
                    <span class="tag">Digital Marketing</span>
                    <span class="tag">Branding</span>
                </div>
                <div class="contact-info">
                    <p><i class="fas fa-phone"></i> +91 98765 43210</p>
                    <p><i class="fas fa-envelope"></i> info@creativepulse.com</p>
                    <p><i class="fas fa-map-marker-alt"></i> Suite 101, Business Hub, Zone 12</p>
                </div>
                <a href="mailto:info@creativepulse.com" class="btn-contact">Get a Quote</a>
            </div>
            

            <div class="business-card">
                <h3 class="business-name">Green Earth Solar Solutions</h3>
                <p class="owner-name">Owned by: JC Sarah Smith</p>
                <div class="tag-container">
                    <span class="tag">Products</span>
                    <span class="tag">Solar Panels</span>
                    <span class="tag">Installation Service</span>
                </div>
                <div class="contact-info">
                    <p><i class="fas fa-phone"></i> +91 99988 77766</p>
                    <p><i class="fas fa-envelope"></i> sarah@greenearth.com</p>
                    <p><i class="fas fa-globe"></i> www.greenearthsolar.com</p>
                </div>
                <a href="#" class="btn-contact">View Catalog</a>
            </div>

            <div class="business-card">
                <h3 class="business-name">Elite Tech Supplies</h3>
                <p class="owner-name">Owned by: JC Michael Ross</p>
                <div class="tag-container">
                    <span class="tag">Products</span>
                    <span class="tag">IT Hardware</span>
                    <span class="tag">Bulk Supplier</span>
                </div>
                <div class="contact-info">
                    <p><i class="fas fa-phone"></i> +91 88776 65544</p>
                    <p><i class="fas fa-envelope"></i> sales@elitetech.com</p>
                    <p><i class="fas fa-map-marker-alt"></i> Industrial Area Phase II</p>
                </div>
                <a href="#" class="btn-contact">Inquire Now</a>
            </div>
        </div>
    </div>

    <style>
        .hero-section {
            margin-top: 70px;
            padding: 60px 20px;
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
            margin: 40px auto;
            padding: 0 20px;
        }

        .dir-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 25px;
        }

        .business-card {
            background: white;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            border-left: 5px solid var(--jci-blue);
        }

        .business-name {
            color: var(--jci-blue);
            font-size: 1.4rem;
            margin-bottom: 5px;
            font-weight: 700;
        }

        .owner-name {
            font-size: 0.9rem;
            color: #666;
            margin-bottom: 15px;
            font-style: italic;
        }

        .tag-container {
            margin: 10px 0;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }

        .tag {
            background: #eef9ff;
            color: var(--jci-blue);
            font-size: 0.75rem;
            padding: 4px 10px;
            border-radius: 20px;
            font-weight: 600;
        }

        .contact-info {
            margin-top: 15px;
            font-size: 0.9rem;
            color: #444;
        }

        .contact-info p {
            margin: 5px 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .contact-info i {
            color: var(--jci-blue);
            width: 15px;
        }

        .btn-contact {
            display: inline-block;
            margin-top: 15px;
            padding: 8px 20px;
            background: var(--jci-blue);
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-size: 0.85rem;
            transition: 0.3s;
        }

        .btn-contact:hover {
            background: #007bb5;
        }
    </style>

<?php include 'include/footer.php'; ?>

