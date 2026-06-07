
<?php 
$page = 'dir'; 
include 'include/header.php';

// Include database config


$db = getDB();

// Get businesses from database (only active ones)
$businesses = [];
$result = $db->query("SELECT * FROM businesses WHERE status = 'active' ORDER BY business_name ASC");
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $businesses[] = $row;
    }
}

// Get unique cities for filter
$cities = [];
$cityResult = $db->query("SELECT DISTINCT city FROM businesses WHERE status = 'active' ORDER BY city");
if ($cityResult && $cityResult->num_rows > 0) {
    while ($row = $cityResult->fetch_assoc()) {
        $cities[] = $row['city'];
    }
}
?>

    <header class="hero-section">
        <h1>Business Directory</h1>
        <p>Connecting JCI members and their businesses across the world.</p>
        <?php if (isLoggedIn()): ?>
            <a href="add-business.php" class="inline-block mt-4 px-6 py-2 bg-white text-jci-dark font-semibold rounded-lg hover:bg-gray-100 transition">
                <i class="fas fa-plus mr-2"></i>Add Your Business
            </a>
        <?php else: ?>
            <a href="add-business.php" class="inline-block mt-4 px-6 py-2 bg-white text-jci-dark font-semibold rounded-lg hover:bg-gray-100 transition">
                <i class="fas fa-plus mr-2"></i>Add Your Business
            </a>
        <?php endif; ?>

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
                    <?php foreach ($cities as $city): ?>
                        <option value="<?php echo htmlspecialchars($city); ?>"><?php echo htmlspecialchars($city); ?></option>
                    <?php endforeach; ?>
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
            <?php if (empty($businesses)): ?>
                <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #666;">
                    <p>No businesses listed yet.</p>
                    <a href="add-business.php" class="text-jci hover:underline">Be the first to list your business!</a>
                </div>
            <?php else: ?>
                <?php foreach ($businesses as $biz): 
                    $tags = $biz['tags'] ? explode(',', $biz['tags']) : [];
                    $location = $biz['website'] ? $biz['website'] : $biz['address'];
                    $btnLink = $biz['email'] ? 'mailto:' . $biz['email'] : ($biz['website'] ?: '#');
                    $btnText = $biz['email'] ? 'Contact' : ($biz['website'] ? 'Visit Website' : 'View Details');
                ?>
                <div class="business-card" 
                     data-name="<?php echo htmlspecialchars(strtolower($biz['business_name'])); ?>"
                     data-owner="<?php echo htmlspecialchars(strtolower($biz['owner_name'])); ?>"
                     data-category="<?php echo htmlspecialchars($biz['category']); ?>"
                     data-city="<?php echo htmlspecialchars($biz['city']); ?>"
                     data-tags="<?php echo htmlspecialchars(strtolower($biz['tags'])); ?>">
                    <h3 class="business-name"><?php echo htmlspecialchars($biz['business_name']); ?></h3>
                    <p class="owner-name">Owned by: <?php echo htmlspecialchars($biz['owner_jci_name'] ?: $biz['owner_name']); ?></p>
                    <div class="tag-container">
                        <span class="tag"><?php echo htmlspecialchars($biz['category']); ?></span>
                        <?php foreach (array_slice($tags, 0, 2) as $tag): ?>
                            <span class="tag"><?php echo htmlspecialchars(trim($tag)); ?></span>
                        <?php endforeach; ?>
                    </div>
                    <div class="contact-info">
                        <p><i class="fas fa-phone"></i> <?php echo htmlspecialchars($biz['phone']); ?></p>
                        <p><i class="fas fa-envelope"></i> <?php echo htmlspecialchars($biz['email']); ?></p>
                        <p><i class="fas fa-map-marker-alt"></i> <?php echo htmlspecialchars($biz['city']); ?></p>
                    </div>
                    <a href="<?php echo htmlspecialchars($btnLink); ?>" class="btn-contact"><?php echo htmlspecialchars($btnText); ?></a>
                </div>
                <?php endforeach; ?>
            <?php endif; ?>
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
        // Get all business cards
        function filterBusinesses() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const category = document.getElementById('categoryFilter').value;
            const city = document.getElementById('cityFilter').value;
            const cards = document.querySelectorAll('.business-card');
            
            cards.forEach(card => {
                const name = card.dataset.name || '';
                const owner = card.dataset.owner || '';
                const cardCategory = card.dataset.category || '';
                const cardCity = card.dataset.city || '';
                const tags = card.dataset.tags || '';
                
                const matchesSearch = name.includes(searchTerm) || 
                                    owner.includes(searchTerm) ||
                                    tags.includes(searchTerm);
                const matchesCategory = category === '' || cardCategory === category;
                const matchesCity = city === '' || cardCity === city;
                
                if (matchesSearch && matchesCategory && matchesCity) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Show no results message if all hidden
            const visibleCards = document.querySelectorAll('.business-card[style="display: block"], .business-card:not([style*="display"])');
            const hasVisible = Array.from(cards).some(c => c.style.display !== 'none');
            
            let noResults = document.querySelector('.no-results-message');
            if (!hasVisible) {
                if (!noResults) {
                    noResults = document.createElement('div');
                    noResults.className = 'no-results-message';
                    noResults.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 40px; color: #666;';
                    noResults.innerHTML = 'No businesses found matching your criteria.';
                    document.getElementById('businessGrid').appendChild(noResults);
                }
            } else if (noResults) {
                noResults.remove();
            }
        }

        function sortBusinesses() {
            const sortOrder = document.getElementById('sortOrder').value;
            const grid = document.getElementById('businessGrid');
            const cards = Array.from(document.querySelectorAll('.business-card'));
            
            if (sortOrder === 'az') {
                cards.sort((a, b) => (a.dataset.name || '').localeCompare(b.dataset.name || ''));
            } else if (sortOrder === 'za') {
                cards.sort((a, b) => (b.dataset.name || '').localeCompare(a.dataset.name || ''));
            }
            
            cards.forEach(card => grid.appendChild(card));
        }
    </script>

<?php include 'include/footer.php'; ?>

