<!-- Footer -->
<footer class="footer">

    <div class="footer-container">

        <!-- Newsletter Section -->
        <div class="footer-section">
            <h4>Join our Newsletter</h4>
            <form class="newsletter-form">
                <input type="text" placeholder="Your Name">
                <input type="email" placeholder="Your Email Address">
                <label>
                    <input type="checkbox"> I agree to receive email updates
                </label>
                <button type="submit" class="subscribe-btn">Subscribe</button>
            </form>
        </div>

        <!-- Menu Section -->
        <div class="footer-section">
            <h4>Menu</h4>
            <ul>
                <li><a href="index.php">Home</a></li>
                <li><a href="about.php">About</a></li>
                <li><a href="services.php">What We Do</a></li>
                <li><a href="partners.php">Partners</a></li>
                <li><a href="events.php">News and Events</a></li>
                <li><a href="media.php">Media</a></li>
                <li><a href="contact.php">Contact Us</a></li>
            </ul>
        </div>

        <!-- Connect Section -->
        <div class="footer-section">
            <h4>Connect</h4>
            <ul>
                <li><a href="#">JCI Senate</a></li>
                <li><a href="#">JCI Foundation</a></li>
                <li><a href="#">JCI Masterclass</a></li>
                <li><a href="#">JCI Club 100</a></li>
                <li><a href="#">JCI Store</a></li>
                <li><a href="#">Resources</a></li>
                <li><a href="#">Branding</a></li>
                <li><a href="#">Toolkits</a></li>
            </ul>
        </div>

        <!-- Follow Us Section -->
        <div class="footer-section">
            <h4>Follow us</h4>

            <div class="social-links">
                <a href="#" title="Facebook"><i class="fab fa-facebook-f"></i></a>
                <a href="#" title="Instagram"><i class="fab fa-instagram"></i></a>
                <a href="#" title="YouTube"><i class="fab fa-youtube"></i></a>
                <a href="#" title="X"><i class="fab fa-x-twitter"></i></a>
                <a href="#" title="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                <a href="#" title="Tiktok"><i class="fab fa-tiktok"></i></a>
            </div>

            <div style="margin-top:10px;">
                <a href="#">
                    <i class="fas fa-download"></i> Download JCI App
                </a>
            </div>

        </div>

    </div>

    <div class="footer-bottom">
        <strong>Official Linktr.ee</strong> | &copy; <?php echo date("Y"); ?> JCI India Zone 12. All Rights Reserved.
    </div>

</footer>

<style>
.newsletter-form {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.newsletter-form input[type="text"],
.newsletter-form input[type="email"] {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.8rem;
    width: 100%;
    max-width: 200px;
}

.newsletter-form label {
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    gap: 5px;
}

.newsletter-form .subscribe-btn {
    padding: 8px 15px;
    background: var(--jci-blue);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: 0.3s;
    align-self: flex-start;
    width: fit-content;
}

.newsletter-form .subscribe-btn:hover {
    background: #007bb5;
}
</style>
