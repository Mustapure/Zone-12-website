<?php $page = 'events'; include 'include/header.php'; ?>

    <header class="hero-section">
        <h1>Upcoming Events</h1>
        <p>Join us in our upcoming projects, training sessions, and community meetings.</p>
    </header>

    <div class="container">
        <div class="events-grid">
            <div class="event-card">
                <img src="https://via.placeholder.com/400x200" alt="Event Image" class="event-image">
                <div class="event-content">
                    <span class="event-date">MARCH 15, 2024</span>
                    <h3 class="event-title">Zone Conference 2024</h3>
                    <p class="event-description">Join leaders from across the zone for a weekend of strategic planning and networking.</p>
                    <div class="event-footer">
                        <span class="event-location"><i class="fas fa-map-marker-alt"></i> City Hall Annex</span>
                        <a href="#" class="btn-details">Register</a>
                    </div>
                </div>
            </div>

            <div class="event-card">
                <img src="https://via.placeholder.com/400x200" alt="Event Image" class="event-image">
                <div class="event-content">
                    <span class="event-date">APRIL 05, 2024</span>
                    <h3 class="event-title">Leadership Training Workshop</h3>
                    <p class="event-description">Enhance your professional skills with our expert-led workshop on effective communication.</p>
                    <div class="event-footer">
                        <span class="event-location"><i class="fas fa-map-marker-alt"></i> Online (Zoom)</span>
                        <a href="#" class="btn-details">Register</a>
                    </div>
                </div>
            </div>

            <div class="event-card">
                <img src="https://via.placeholder.com/400x200" alt="Event Image" class="event-image">
                <div class="event-content">
                    <span class="event-date">JUNE 12, 2024</span>
                    <h3 class="event-title">Zone Conference</h3>
                    <p class="event-description">Annual gathering of all local chapters.</p>
                    <div class="event-footer">
                        <span class="event-location"><i class="fas fa-map-marker-alt"></i> TBD</span>
                        <a href="#" class="btn-details">Register</a>
                    </div>
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

        .events-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 30px;
        }

        .event-card {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            transition: transform 0.3s;
        }

        .event-card:hover {
            transform: translateY(-5px);
        }

        .event-image {
            width: 100%;
            height: 200px;
            background: #e0e0e0;
            object-fit: cover;
        }

        .event-content {
            padding: 20px;
        }

        .event-date {
            color: var(--jci-blue);
            font-weight: bold;
            font-size: 0.9rem;
            margin-bottom: 10px;
            display: block;
        }

        .event-title {
            font-size: 1.25rem;
            color: #333;
            margin-bottom: 10px;
        }

        .event-description {
            color: #666;
            font-size: 0.95rem;
            line-height: 1.5;
            margin-bottom: 20px;
        }

        .event-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }

        .event-location {
            font-size: 0.85rem;
            color: #666;
        }

        .btn-details {
            padding: 8px 16px;
            background: var(--jci-blue);
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-size: 0.85rem;
            transition: 0.3s;
        }

        .btn-details:hover {
            background: #007bb5;
        }
    </style>

<?php include 'include/footer.php'; ?>

