<?php $page = 'home'; include 'include/header.php'; ?>

    <main class="main-content">

        <!-- Hero Slider Section -->
        <div class="hero-slider">
            <div class="slider-container">
                <!-- Slide 1 -->
                <div class="slide active" style="background-image: url('join.jpg');">
                    <div class="slide-content">
                        <h1>Welcome to JCI Zone 12</h1>
                        <p>Empowering young leaders to create positive change in communities worldwide</p>
                        <a href="contact.php" class="slider-btn">Join Us Today</a>
                    </div>
                </div>
                <!-- Slide 2 -->
                <div class="slide" style="background-image: url('JCI Zone.png');">
                    <div class="slide-content">
                        <h1>Lead the Change</h1>
                        <p>Join a global network of young leaders making a difference</p>
                        <a href="events.php" class="slider-btn">View Events</a>
                    </div>
                </div>
                <!-- Slide 3 -->
                <div class="slide" style="background-image: url('join.jpg');">
                    <div class="slide-content">
                        <h1>Build Your Future</h1>
                        <p>Develop leadership skills and create lasting impact</p>
                        <a href="login.php" class="slider-btn">Get Started</a>
                    </div>
                </div>
            </div>
        </div>

        <style>
        /* Hero Slider Styles */
        .hero-slider {
            position: relative;
            width: 100%;
            height: 500px;
            overflow: hidden;
            background: #1a1a2e;
            margin: 0;
            padding: 0;
            margin-top: -70px;
            z-index: 1;
        }

        .slider-container {
            position: relative;
            width: 100%;
            height: 100%;
        }

        .slide {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-size: cover;
            background-position: center;
            opacity: 0;
            transition: opacity 0.8s ease-in-out;
            display: flex;
            align-items: center;
            justify-content: center;
            padding-top: 70px;
        }

        .slide.active {
            opacity: 1;
        }

        .slide::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(0, 77, 128, 0.85), rgba(0, 119, 170, 0.7));
        }

        .slide-content {
            position: relative;
            z-index: 2;
            text-align: center;
            color: white;
            padding: 20px;
            max-width: 800px;
        }

        .slide-content h1 {
            font-size: 3rem;
            margin-bottom: 15px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            animation: fadeInUp 1s ease-out;
        }

        .slide-content p {
            font-size: 1.3rem;
            margin-bottom: 30px;
            opacity: 0.95;
            animation: fadeInUp 1s ease-out 0.3s both;
        }

        .slider-btn {
            display: inline-block;
            padding: 15px 40px;
            background-color: #ff6b35;
            color: white;
            text-decoration: none;
            font-size: 1.1rem;
            font-weight: bold;
            border-radius: 50px;
            transition: all 0.3s ease;
            animation: fadeInUp 1s ease-out 0.6s both;
            border: 2px solid #ff6b35;
        }

        .slider-btn:hover {
            background-color: transparent;
            color: #ff6b35;
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(255, 107, 53, 0.4);
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Responsive */
        @media (max-width: 768px) {
            .hero-slider {
                height: 400px;
            }
            .slide-content h1 {
                font-size: 2rem;
            }
            .slide-content p {
                font-size: 1rem;
            }
            .slider-btn {
                padding: 12px 30px;
                font-size: 1rem;
            }
        }
        </style>

        <script>
        let slideIndex = 1;
        let slideInterval;

        // Auto-rotate slides every 5 seconds
        function startSlider() {
            slideInterval = setInterval(() => {
                changeSlide(1);
            }, 5000);
        }

        function changeSlide(n) {
            showSlides(slideIndex += n);
            resetInterval();
        }

        function resetInterval() {
            clearInterval(slideInterval);
            startSlider();
        }

        function showSlides(n) {
            let i;
            let slides = document.getElementsByClassName("slide");
            
            if (n > slides.length) { slideIndex = 1 }
            if (n < 1) { slideIndex = slides.length }
            
            for (i = 0; i < slides.length; i++) {
                slides[i].className = slides[i].className.replace(" active", "");
            }
            
            slides[slideIndex - 1].className += " active";
        }

        // Initialize slider
        document.addEventListener("DOMContentLoaded", function() {
            startSlider();
        });
        </script>

        <!-- Welcome Section -->
        <div class="welcome-section">
            <h2>Welcome to the Legacy Reimagined Portal</h2>
            <p>Select a section from the navigation menu to manage your JCI activities.</p>
        </div>

        <!-- Creed, Vision & Mission Section -->
        <div class="cvm-section">
            <div class="cvm-section-title">
                <h3>Creed, Vision & Mission</h3>
                <p>Guiding principles that define our purpose and direction.</p>
            </div>

            <div class="cvm-cards">
                <!-- JCI Creed Card -->
                <div class="cvm-card">
                    <h4><i class="fas fa-pray"></i> JCI Creed</h4>
                    <ul class="creed-list">
                        <li>That faith in God gives meaning and purpose to human life</li>
                        <li>That the brotherhood of man transcends the sovereignty of nations</li>
                        <li>That economic justice can best be won by free men through free enterprise</li>
                        <li>That government should be of laws rather than of men</li>
                        <li>That earth's great treasure lies in human personality</li>
                        <li>And that service to humanity is the best work of life</li>
                    </ul>
                </div>

                <!-- Vision & Mission Card -->
                <div class="cvm-card">
                    <h4><i class="fas fa-eye"></i> Vision</h4>
                    <p>To be the foremost global network of young leaders creating positive change in communities and
                        beyond.</p>
                    <br>
                    <h4><i class="fas fa-bullseye"></i> Mission</h4>
                    <p>To provide leadership development opportunities that empower young people to create sustainable
                        impact in society.</p>
                </div>
            </div>
        </div>

        <!-- Highlights Section -->
        <div class="highlights-section">
            <h4>Today's Impact Highlights</h4>
            <p>New event published: <strong>Zone 12 Midcon 2026</strong></p>
        </div>

        <!-- Four Areas of Opportunity Section -->
        <div class="fao-section">
            <div class="fao-section-title">
                <h3>Four Areas of Opportunity</h3>
                <p>JCI develops young leaders by empowering personal growth, creating community impact, fostering
                    international cooperation, and supporting business and entrepreneurship. Through these four areas,
                    we shape active citizens who drive positive change locally and globally.</p>
            </div>

            <div class="fao-cards">
                <div class="fao-card">
                    <div class="icon"><i class="fas fa-briefcase"></i></div>
                    <h4>Business and Entrepreneurship</h4>
                    <p>Fostering Innovation Through Business and Entrepreneurship</p>
                </div>

                <div class="fao-card">
                    <div class="icon"><i class="fas fa-globe"></i></div>
                    <h4>International Cooperation</h4>
                    <p>Connecting Cultures Through Global Cooperation</p>
                </div>

                <div class="fao-card">
                    <div class="icon"><i class="fas fa-user-graduate"></i></div>
                    <h4>Individual Development</h4>
                    <p>Developing Young Leaders Through Personal Growth</p>
                </div>

                <div class="fao-card">
                    <div class="icon"><i class="fas fa-hands-helping"></i></div>
                    <h4>Community Impact</h4>
                    <p>Building Better Communities Through Local Action</p>
                </div>
            </div>
        </div>
    </main>

    <!-- Join JCI Section -->
 <?php include 'form.php'; ?>
 
 <!-- Footer -->
<?php include 'include/footer.php'; ?>

