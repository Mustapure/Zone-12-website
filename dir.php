<?php $page = 'dir'; include 'include/header.php'; ?>

    <header class="hero-section">
        <h1>Business Directory</h1>
        <p>Connecting JCI members and their businesses across the world.</p>
    </header>

    <div class="container">
        <!-- Search and Filter Section -->
        <div class="search-filter-bar">
            <div class="search-box">
                <i class="fas fa-search"></i>
                <input type="text" id="searchInput" placeholder="Search businesses..." onkeyup="filterBusinesses()">
            </div>
            <div class="filter-box">
                <select id="categoryFilter" onchange="filterBusinesses()">
                    <option value="">All Categories</option>
                    <option value="Services">Services</option>
                    <option value="Products">Products</option>
                    <option value="Service Provider">Service Provider</option>
                </select>
            </div>
            <div class="filter-box">
                <select id="cityFilter" onchange="filterBusinesses()">
                    <option value="">All Cities</option>
                    <option value="Zone 12">Zone 12</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Bangalore">Bangalore</option>
                </select>
            </div>
            <div class="sort-box">
                <select id="sortOrder" onchange="sortBusinesses()">
                    <option value="">Sort By</option>
                    <option value="az">Name (A-Z)</option>
                    <option value="za">Name (Z-A)</option>
                </select>
            </div>
        </div>

        <div class="dir-grid" id="businessGrid">
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

            <div class="business-card">
                <h3 class="business-name">Fresh Foods Catering</h3>
                <p class="owner-name">Owned by: JC Priya Sharma</p>
                <div class="tag-container">
                    <span class="tag">Services</span>
                    <span class="tag">Catering</span>
                    <span class="tag">Events</span>
                </div>
                <div class="contact-info">
                    <p><i class="fas fa-phone"></i> +91 77665 44332</p>
                    <p><i class="fas fa-envelope"></i> priya@freshfoods.com</p>
                    <p><i class="fas fa-map-marker-alt"></i> Food Court, Zone 12</p>
                </div>
                <a href="mailto:priya@freshfoods.com" class="btn-contact">Book Now</a>
            </div>

            <div class="business-card">
                <h3 class="business-name">Urban Design Studio</h3>
                <p class="owner-name">Owned by: JC Arjun Patel</p>
                <div class="tag-container">
                    <span class="tag">Services</span>
                    <span class="tag">Interior Design</span>
                    <span class="tag">Architecture</span>
                </div>
                <div class="contact-info">
                    <p><i class="fas fa-phone"></i> +91 99887 76655</p>
                    <p><i class="fas fa-envelope"></i> arjun@urbandesign.com</p>
                    <p><i class="fas fa-globe"></i> www.urbandesignstudio.com</p>
                </div>
                <a href="#" class="btn-contact">Get Quote</a>
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
            grid-template-columns: repeat(5, 1fr);
            gap: 15px;
        }

        .business-card {
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            border-left: 5px solid var(--jci-blue);
        }

        .business-name {
            color: var(--jci-blue);
            font-size: 1rem;
            margin-bottom: 5px;
            font-weight: 700;
        }

        .owner-name {
            font-size: 0.8rem;
            color: #666;
            margin-bottom: 10px;
            font-style: italic;
        }

        .tag-container {
            margin: 8px 0;
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
        }

        .tag {
            background: #eef9ff;
            color: var(--jci-blue);
            font-size: 0.65rem;
            padding: 3px 8px;
            border-radius: 20px;
            font-weight: 600;
        }

        .contact-info {
            margin-top: 10px;
            font-size: 0.8rem;
            color: #444;
        }

        .contact-info p {
            margin: 3px 0;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .contact-info i {
            color: var(--jci-blue);
            width: 12px;
        }

        .btn-contact {
            display: inline-block;
            margin-top: 10px;
            padding: 6px 15px;
            background: var(--jci-blue);
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-size: 0.75rem;
            transition: 0.3s;
        }

        .btn-contact:hover {
            background: #007bb5;
        }

        /* Responsive */
        @media (max-width: 1200px) {
            .dir-grid {
                grid-template-columns: repeat(4, 1fr);
            }
        }

        @media (max-width: 992px) {
            .dir-grid {
                grid-template-columns: repeat(3, 1fr);
            }
        }

        @media (max-width: 768px) {
            .dir-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 480px) {
            .dir-grid {
                grid-template-columns: 1fr;
            }
        }

        /* Search and Filter Styles */
        .search-filter-bar {
            display: flex;
            gap: 15px;
            margin-bottom: 30px;
            flex-wrap: wrap;
        }

        .search-box {
            flex: 2;
            min-width: 250px;
            position: relative;
        }

        .search-box i {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: #999;
        }

        .search-box input {
            width: 100%;
            padding: 12px 15px 12px 40px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 1rem;
        }

        .search-box input:focus {
            outline: none;
            border-color: var(--jci-blue);
        }

        .filter-box, .sort-box {
            flex: 1;
            min-width: 150px;
        }

        .filter-box select, .sort-box select {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 1rem;
            background: white;
            cursor: pointer;
        }

        .filter-box select:focus, .sort-box select:focus {
            outline: none;
            border-color: var(--jci-blue);
        }

        .no-results {
            grid-column: 1 / -1;
            text-align: center;
            padding: 40px;
            color: #666;
            font-size: 1.1rem;
        }

        @media (max-width: 768px) {
            .search-filter-bar {
                flex-direction: column;
            }
            .search-box, .filter-box, .sort-box {
                width: 100%;
            }
        }
    </style>

    <script>
        // Business data
        const businesses = [
            { name: "Creative Pulse Marketing", owner: "JC John Doe", category: "Service Provider", city: "Zone 12", tags: ["Service Provider", "Digital Marketing", "Branding"], phone: "+91 98765 43210", email: "info@creativepulse.com", location: "Suite 101, Business Hub, Zone 12", btn: "Get a Quote", link: "mailto:info@creativepulse.com" },
            { name: "Green Earth Solar Solutions", owner: "JC Sarah Smith", category: "Products", city: "Mumbai", tags: ["Products", "Solar Panels", "Installation Service"], phone: "+91 99988 77766", email: "sarah@greenearth.com", location: "www.greenearthsolar.com", btn: "View Catalog", link: "#" },
            { name: "Elite Tech Supplies", owner: "JC Michael Ross", category: "Products", city: "Delhi", tags: ["Products", "IT Hardware", "Bulk Supplier"], phone: "+91 88776 65544", email: "sales@elitetech.com", location: "Industrial Area Phase II", btn: "Inquire Now", link: "#" },
            { name: "Fresh Foods Catering", owner: "JC Priya Sharma", category: "Services", city: "Zone 12", tags: ["Services", "Catering", "Events"], phone: "+91 77665 44332", email: "priya@freshfoods.com", location: "Food Court, Zone 12", btn: "Book Now", link: "mailto:priya@freshfoods.com" },
            { name: "Urban Design Studio", owner: "JC Arjun Patel", category: "Services", city: "Bangalore", tags: ["Services", "Interior Design", "Architecture"], phone: "+91 99887 76655", email: "arjun@urbandesign.com", location: "www.urbandesignstudio.com", btn: "Get Quote", link: "#" }
        ];

        function renderBusinesses(data) {
            const grid = document.getElementById('businessGrid');
            grid.innerHTML = '';
            
            if (data.length === 0) {
                grid.innerHTML = '<div class="no-results">No businesses found matching your criteria.</div>';
                return;
            }
            
            data.forEach(biz => {
                const card = document.createElement('div');
                card.className = 'business-card';
                card.innerHTML = `
                    <h3 class="business-name">${biz.name}</h3>
                    <p class="owner-name">Owned by: ${biz.owner}</p>
                    <div class="tag-container">
                        ${biz.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="contact-info">
                        <p><i class="fas fa-phone"></i> ${biz.phone}</p>
                        <p><i class="fas fa-envelope"></i> ${biz.email}</p>
                        <p><i class="fas fa-map-marker-alt"></i> ${biz.location}</p>
                    </div>
                    <a href="${biz.link}" class="btn-contact">${biz.btn}</a>
                `;
                grid.appendChild(card);
            });
        }

        function filterBusinesses() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const category = document.getElementById('categoryFilter').value;
            const city = document.getElementById('cityFilter').value;
            
            let filtered = businesses.filter(biz => {
                const matchesSearch = biz.name.toLowerCase().includes(searchTerm) || 
                                    biz.owner.toLowerCase().includes(searchTerm) ||
                                    biz.tags.some(tag => tag.toLowerCase().includes(searchTerm));
                const matchesCategory = category === '' || biz.category === category || biz.tags.includes(category);
                const matchesCity = city === '' || biz.city === city;
                
                return matchesSearch && matchesCategory && matchesCity;
            });
            
            renderBusinesses(filtered);
        }

        function sortBusinesses() {
            const sortOrder = document.getElementById('sortOrder').value;
            let filtered = businesses;
            
            // Apply filter first
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const category = document.getElementById('categoryFilter').value;
            const city = document.getElementById('cityFilter').value;
            
            filtered = businesses.filter(biz => {
                const matchesSearch = biz.name.toLowerCase().includes(searchTerm) || 
                                    biz.owner.toLowerCase().includes(searchTerm) ||
                                    biz.tags.some(tag => tag.toLowerCase().includes(searchTerm));
                const matchesCategory = category === '' || biz.category === category || biz.tags.includes(category);
                const matchesCity = city === '' || biz.city === city;
                
                return matchesSearch && matchesCategory && matchesCity;
            });
            
            // Then sort
            if (sortOrder === 'az') {
                filtered.sort((a, b) => a.name.localeCompare(b.name));
            } else if (sortOrder === 'za') {
                filtered.sort((a, b) => b.name.localeCompare(a.name));
            }
            
            renderBusinesses(filtered);
        }

        // Initial render
        document.addEventListener('DOMContentLoaded', function() {
            renderBusinesses(businesses);
        });
    </script>

<?php include 'include/footer.php'; ?>

