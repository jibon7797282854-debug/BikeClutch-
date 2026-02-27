/**
 * main.js - Entry point for all pages.
 * Detects current page and initializes appropriate functionality.
 */

(function() {
    // Initialize data on first load
    if (window.BikeData) {
        BikeData.getBikes(); // ensures sample data
    }

    const path = window.location.pathname.split('/').pop();

    if (path === 'index.html' || path === '' || path === '/') {
        initHomePage();
    } else if (path === 'bike.html') {
        initBikePage();
    } else if (path === 'compare.html') {
        initComparePage();
    } else if (path === 'admin.html') {
        initAdminPage();
    }

    // ==================== HOMEPAGE ====================
    function initHomePage() {
        const bikes = BikeData.getBikes();
        const featuredGrid = document.getElementById('featuredGrid');
        const trendingGrid = document.getElementById('trendingGrid');
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        // Render featured (first 4)
        renderBikeCards(bikes.slice(0, 4), featuredGrid);
        
        // Render trending (next 3 or random)
        const trending = bikes.sort(() => 0.5 - Math.random()).slice(0, 3);
        renderBikeCards(trending, trendingGrid);

        // Search functionality
        function filterBikes() {
            const searchTerm = searchInput.value.toLowerCase();
            const activeCategory = document.querySelector('.filter-btn.active')?.dataset.category || 'all';
            
            const filtered = bikes.filter(bike => {
                const matchesSearch = bike.name.toLowerCase().includes(searchTerm) || bike.brand.toLowerCase().includes(searchTerm);
                const matchesCategory = activeCategory === 'all' || bike.category === activeCategory;
                return matchesSearch && matchesCategory;
            });
            
            renderBikeCards(filtered, featuredGrid);
        }

        searchBtn.addEventListener('click', filterBikes);
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') filterBikes();
        });

        // Category filter
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterBikes();
            });
        });
    }

    function renderBikeCards(bikes, container) {
        if (!container) return;
        container.innerHTML = '';
        const template = document.getElementById('bike-card-template');
        
        bikes.forEach(bike => {
            const card = template.content.cloneNode(true);
            const img = card.querySelector('.bike-img');
            img.src = bike.image || 'https://placehold.co/300x200?text=No+Image';
            img.alt = bike.name;
            card.querySelector('.bike-name').textContent = bike.name;
            card.querySelector('.bike-price').textContent = `₹ ${bike.price.toLocaleString()}`;
            const detailsBtn = card.querySelector('.details-btn');
            detailsBtn.href = `bike.html?id=${bike.id}`;
            
            const compareBtn = card.querySelector('.compare-btn');
            compareBtn.addEventListener('click', (e) => {
                e.preventDefault();
                addToComparison(bike.id);
            });
            
            container.appendChild(card);
        });
    }

    // ==================== BIKE DETAIL PAGE ====================
    function initBikePage() {
        const params = new URLSearchParams(window.location.search);
        const bikeId = params.get('id');
        if (!bikeId) {
            document.getElementById('bikeDetail').innerHTML = '<p>Bike not found.</p>';
            return;
        }

        const bike = BikeData.getBikeById(bikeId);
        if (!bike) {
            document.getElementById('bikeDetail').innerHTML = '<p>Bike not found.</p>';
            return;
        }

        renderBikeDetails(bike);
        setupGallery(bike);
        setupReviewForm(bikeId);
        setupEmiCalculator(bike.price);
        displayReviews(bike.reviews);
    }

    function renderBikeDetails(bike) {
        const container = document.getElementById('bikeDetail');
        // Build HTML structure (simplified – in real app would use template)
        let html = `
            <h1>${bike.name} - ₹ ${bike.price.toLocaleString()}</h1>
            <div class="bike-gallery">
                <img src="${bike.gallery?.[0] || bike.image}" alt="${bike.name}" class="main-image" id="mainImage">
                <div class="thumbnail-container" id="thumbnailContainer">
                    ${(bike.gallery || [bike.image]).map((img, i) => `<img src="${img}" alt="thumb" class="thumbnail" data-index="${i}">`).join('')}
                </div>
            </div>

            <div class="specs-section">
                <h2>Specifications</h2>
                <table class="specs-table">
                    ${Object.entries(bike.specs).map(([key, val]) => `<tr><td>${key}</td><td>${val}</td></tr>`).join('')}
                </table>
            </div>

            <div class="pros-cons">
                <div class="pros">
                    <h3>Pros</h3>
                    <ul>${bike.pros.map(p => `<li>${p}</li>`).join('')}</ul>
                </div>
                <div class="cons">
                    <h3>Cons</h3>
                    <ul>${bike.cons.map(c => `<li>${c}</li>`).join('')}</ul>
                </div>
            </div>

            <div class="expert-review">
                <h3>Expert Review</h3>
                <p>${bike.expertReview}</p>
            </div>

            <div class="rating-bars">
                <h3>Ratings</h3>
                ${['performance', 'comfort', 'mileage'].map(r => `
                    <div class="rating-item">
                        <div class="rating-label"><span>${r}</span> <span>${bike.ratings[r]}/5</span></div>
                        <div class="bar"><div class="fill" style="width: ${(bike.ratings[r]/5)*100}%"></div></div>
                    </div>
                `).join('')}
                <div class="overall-rating">Overall: ${bike.ratings.overall?.toFixed(1) || 'N/A'}/5</div>
            </div>
        `;
        container.innerHTML = html;
    }

    function setupGallery(bike) {
        const mainImage = document.getElementById('mainImage');
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                mainImage.src = thumb.src;
                thumbnails.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
        });
    }

    function displayReviews(reviews) {
        const reviewsList = document.getElementById('reviewsList');
        if (!reviews || reviews.length === 0) {
            reviewsList.innerHTML = '<p>No reviews yet. Be the first to review!</p>';
            return;
        }
        reviewsList.innerHTML = reviews.map(r => `
            <div class="review-card">
                <div class="review-header">
                    <span class="reviewer-name">${r.user}</span>
                    <span class="review-rating">${'★'.repeat(Math.floor(r.rating))}${'☆'.repeat(5-Math.floor(r.rating))} ${r.rating}</span>
                    <span class="review-date">${r.date}</span>
                </div>
                <p class="review-comment">${r.comment}</p>
            </div>
        `).join('');
    }

    function setupReviewForm(bikeId) {
        const form = document.getElementById('reviewForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('reviewerName').value;
            const rating = parseFloat(document.getElementById('reviewRating').value);
            const comment = document.getElementById('reviewComment').value;
            
            if (window.BikeData) {
                const success = BikeData.addReview(bikeId, { user: name, rating, comment });
                if (success) {
                    alert('Review added!');
                    form.reset();
                    // Refresh reviews
                    const updatedBike = BikeData.getBikeById(bikeId);
                    displayReviews(updatedBike.reviews);
                } else {
                    alert('Failed to add review.');
                }
            }
        });
    }

    function setupEmiCalculator(price) {
        document.getElementById('loanAmount').value = price;
        document.getElementById('calcEmiBtn').addEventListener('click', () => {
            const principal = parseFloat(document.getElementById('loanAmount').value);
            const rate = parseFloat(document.getElementById('interestRate').value) / 12 / 100;
            const months = parseInt(document.getElementById('loanTenure').value);
            
            if (window.EMI) {
                const emi = EMI.calculate(principal, rate, months);
                document.getElementById('emiResult').innerHTML = `Monthly EMI: ₹ ${emi.toFixed(2)}`;
            }
        });
    }

    // ==================== COMPARE PAGE ====================
    function initComparePage() {
        if (window.Compare) {
            Compare.init();
        }
    }

    // ==================== ADMIN PAGE ====================
    function initAdminPage() {
        const form = document.getElementById('bikeForm');
        const bikeListDiv = document.getElementById('adminBikeList');
        const cancelBtn = document.getElementById('cancelEdit');

        function loadBikes() {
            const bikes = BikeData.getBikes();
            bikeListDiv.innerHTML = bikes.map(bike => `
                <div class="bike-list-item" data-id="${bike.id}">
                    <span><strong>${bike.name}</strong> - ₹${bike.price} (${bike.category})</span>
                    <div class="bike-list-actions">
                        <button class="edit-btn" data-id="${bike.id}">Edit</button>
                        <button class="delete-btn" data-id="${bike.id}">Delete</button>
                    </div>
                </div>
            `).join('');

            // Attach event listeners
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', () => editBike(btn.dataset.id));
            });
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', () => deleteBike(btn.dataset.id));
            });
        }

        function editBike(id) {
            const bike = BikeData.getBikeById(id);
            if (!bike) return;
            
            document.getElementById('bikeId').value = bike.id;
            document.getElementById('name').value = bike.name;
            document.getElementById('brand').value = bike.brand;
            document.getElementById('category').value = bike.category;
            document.getElementById('price').value = bike.price;
            document.getElementById('image').value = bike.image || '';
            document.getElementById('description').value = bike.description || '';
            document.getElementById('engine').value = bike.specs?.engine || '';
            document.getElementById('displacement').value = bike.specs?.displacement || '';
            document.getElementById('power').value = bike.specs?.power || '';
            document.getElementById('torque').value = bike.specs?.torque || '';
            document.getElementById('mileage').value = bike.specs?.mileage || '';
            document.getElementById('fuelCapacity').value = bike.specs?.fuelCapacity || '';
            document.getElementById('kerbWeight').value = bike.specs?.kerbWeight || '';
            document.getElementById('ratingPerformance').value = bike.ratings?.performance || '';
            document.getElementById('ratingComfort').value = bike.ratings?.comfort || '';
            document.getElementById('ratingMileage').value = bike.ratings?.mileage || '';
            document.getElementById('pros').value = bike.pros?.join('\n') || '';
            document.getElementById('cons').value = bike.cons?.join('\n') || '';
            document.getElementById('expertReview').value = bike.expertReview || '';
        }

        function deleteBike(id) {
            if (confirm('Delete this bike?')) {
                BikeData.deleteBike(id);
                loadBikes();
                form.reset();
                document.getElementById('bikeId').value = '';
            }
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const bikeData = {
                id: document.getElementById('bikeId').value || undefined,
                name: document.getElementById('name').value,
                brand: document.getElementById('brand').value,
                category: document.getElementById('category').value,
                price: parseFloat(document.getElementById('price').value),
                image: document.getElementById('image').value,
                description: document.getElementById('description').value,
                specs: {
                    engine: document.getElementById('engine').value,
                    displacement: document.getElementById('displacement').value,
                    power: document.getElementById('power').value,
                    torque: document.getElementById('torque').value,
                    mileage: document.getElementById('mileage').value,
                    fuelCapacity: document.getElementById('fuelCapacity').value,
                    kerbWeight: document.getElementById('kerbWeight').value
                },
                ratings: {
                    performance: parseFloat(document.getElementById('ratingPerformance').value) || 0,
                    comfort: parseFloat(document.getElementById('ratingComfort').value) || 0,
                    mileage: parseFloat(document.getElementById('ratingMileage').value) || 0
                },
                pros: document.getElementById('pros').value.split('\n').filter(p => p.trim()),
                cons: document.getElementById('cons').value.split('\n').filter(c => c.trim()),
                expertReview: document.getElementById('expertReview').value,
                gallery: [document.getElementById('image').value] // simple
            };

            if (bikeData.id) {
                BikeData.updateBike(bikeData);
            } else {
                BikeData.addBike(bikeData);
            }

            loadBikes();
            form.reset();
            document.getElementById('bikeId').value = '';
        });

        cancelBtn.addEventListener('click', () => {
            form.reset();
            document.getElementById('bikeId').value = '';
        });

        loadBikes();
    }

    // Simple compare list (for homepage add to compare)
    window.addToComparison = function(bikeId) {
        let compareList = JSON.parse(sessionStorage.getItem('compareList')) || [];
        if (!compareList.includes(bikeId) && compareList.length < 2) {
            compareList.push(bikeId);
            sessionStorage.setItem('compareList', JSON.stringify(compareList));
            alert('Bike added to comparison. Go to Compare page.');
        } else if (compareList.length >= 2) {
            alert('Comparison list full (max 2). Go to Compare page to change.');
        } else {
            alert('Bike already in comparison.');
        }
    };
})();