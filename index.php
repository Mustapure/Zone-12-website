<?php $page = 'home'; include 'include/header.php'; ?>

    <div class="main-content">

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
    </div>

    <!-- Join JCI Section -->
    <section id="join-jci" style="padding:50px; background:#f5f5f5; text-align:center;">
        <h2>Be a Part of JCI</h2>
        <p>Join a global movement of young leaders creating positive change.</p>

        <form action="#" method="post" style="max-width:500px; margin:auto;">
            <input type="text" name="name" placeholder="Full Name" required style="width:100%; padding:10px; margin:10px 0;"><br>
            <input type="email" name="email" placeholder="Email Address" required style="width:100%; padding:10px; margin:10px 0;"><br>
            <input type="tel" name="phone" placeholder="Phone Number" required style="width:100%; padding:10px; margin:10px 0;"><br>
            <input type="text" name="city" placeholder="Location" required style="width:100%; padding:10px; margin:10px 0;"><br>
            <textarea name="message" placeholder="Why do you want to join JCI?" style="width:100%; padding:10px; margin:10px 0;"></textarea>
            <button type="submit" style="background:#0056b3; color:white; padding:12px 25px; border:none; cursor:pointer;">
                🔵 Join JCI
            </button>
        </form>
    </section>

<?php include 'include/footer.php'; ?>

