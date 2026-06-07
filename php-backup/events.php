<?php $page = 'events'; include 'include/header.php'; ?>

<main class="main-content">
    <header class="hero-section">
        <h1>Upcoming Events</h1>
        <p>Join us in our upcoming projects, training sessions, and community meetings. View in 5-column grid layout.</p>
    </header>

    <div class="container">
        <div class="events-grid">
            <?php
            // Mock raw data for events (rows) - replace with DB query if events table added
            $events = [
                [
                    'image' => 'https://via.placeholder.com/1080x1350/0096D6/FFFFFF?text=Zone+Conference+2024',
                    'date' => 'MARCH 15, 2024',
                    'title' => 'Zone Conference 2024',
                    'desc' => 'Join leaders from across the zone for a weekend of strategic planning and networking.',
                    'location' => 'City Hall Annex'
                ],
                [
                    'image' => 'img/img1.png',
                    'date' => 'APRIL 10, 2024',
                    'title' => 'Leadership Training Workshop',
                    'desc' => 'Enhance your professional skills with our expert-led workshop on effective communication.',
                    'location' => 'Online (Zoom)'
                ],
                [
                    'image' => 'https://via.placeholder.com/1080x1350/FF6B35/FFFFFF?text=Zone+Midcon',
                    'date' => 'JUNE 12, 2024',
                    'title' => 'Zone Midcon 2026',
                    'desc' => 'Annual gathering of all local chapters for mid-year review.',
                    'location' => 'TBD'
                ],
                [
                    'image' => 'https://via.placeholder.com/1080x1350/28A745/FFFFFF?text=Business+Networking',
                    'date' => 'JULY 20, 2024',
                    'title' => 'Business Networking Night',
                    'desc' => 'Connect with business leaders and partners in JCI Zone 12.',
                    'location' => 'Grand Hotel'
                ],
                [
                    'image' => 'https://via.placeholder.com/1080x1350/6F42C1/FFFFFF?text=Youth+Leadership',
                    'date' => 'AUGUST 10, 2024',
                    'title' => 'Youth Leadership Summit',
                    'desc' => 'Empowering the next generation of JCI leaders.',
                    'location' => 'Convention Center'
                ],
                [
                    'image' => 'https://via.placeholder.com/1080x1350/0096D6/FFFFFF?text=Community+Impact',
                    'date' => 'SEPTEMBER 14, 2024',
                    'title' => 'Community Impact Day',
                    'desc' => 'Hands-on community service projects across the zone.',
                    'location' => 'Various Locations'
                ],
                [
                    'image' => 'https://via.placeholder.com/1080x1350/007bb5/FFFFFF?text=Training+Seminar',
                    'date' => 'OCTOBER 05, 2024',
                    'title' => 'Project Management Training',
                    'desc' => 'Learn best practices for managing successful JCI projects.',
                    'location' => 'Online'
                ],
                [
                    'image' => 'https://via.placeholder.com/1080x1350/FF6B35/FFFFFF?text=Awards+Night',
                    'date' => 'NOVEMBER 22, 2024',
                    'title' => 'Annual Awards Night',
                    'desc' => 'Celebrating outstanding achievements in JCI Zone 12.',
                    'location' => 'Gala Venue'
                ],
                [
                    'image' => 'https://via.placeholder.com/1080x1350/28A745/FFFFFF?text=End+of+Year',
                    'date' => 'DECEMBER 15, 2024',
                    'title' => 'End of Year Celebration',
                    'desc' => 'Year-end review and celebration of accomplishments.',
                    'location' => 'Banquet Hall'
                ],
                [
                    'image' => 'https://via.placeholder.com/1080x1350/6F42C1/FFFFFF?text=New+Year+Planning',
                    'date' => 'JANUARY 18, 2025',
                    'title' => 'New Year Planning Session',
                    'desc' => 'Strategic planning for the upcoming year.',
                    'location' => 'Conference Room'
                ]
            ];

            foreach ($events as $event) {
            ?>
            <div class="event-card">
                <img src="<?php echo htmlspecialchars($event['image']); ?>" alt="<?php echo htmlspecialchars($event['title']); ?>" class="event-image">
                <div class="event-content">
                    <span class="event-date"><?php echo htmlspecialchars($event['date']); ?></span>
                    <h3 class="event-title"><?php echo htmlspecialchars($event['title']); ?></h3>
                    <p class="event-description"><?php echo htmlspecialchars($event['desc']); ?></p>
                    <div class="event-footer">
                        <span class="event-location"><i class="fas fa-map-marker-alt"></i> <?php echo htmlspecialchars($event['location']); ?></span>
                        <a href="#" class="btn-details">Register</a>
                    </div>
                </div>
            </div>
            <?php } ?>
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
            max-width: 1400px;
            margin: 0 auto;
            padding: 40px 20px;
        }

        .events-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 20px;
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
            height: 400px;
            object-fit: cover;
        }

        .event-content {
            padding: 20px;
        }

        .event-date {
            color: #0096D6;
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
            background: #0096D6;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-size: 0.85rem;
            transition: 0.3s;
        }

        .btn-details:hover {
            background: #007bb5;
        }

        /* Responsive */
        @media (max-width: 1400px) {
            .events-grid {
                grid-template-columns: repeat(4, 1fr);
            }
        }

        @media (max-width: 1100px) {
            .events-grid {
                grid-template-columns: repeat(3, 1fr);
            }
        }

        @media (max-width: 800px) {
            .events-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
            }
            .event-image {
                height: 300px;
            }
        }

        @media (max-width: 500px) {
            .events-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</main>

<?php include 'include/footer.php'; ?>

