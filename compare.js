/**
 * compare.js - Handles bike comparison page logic.
 */

window.Compare = (function() {
    const bike1Select = document.getElementById('bike1');
    const bike2Select = document.getElementById('bike2');
    const compareBtn = document.getElementById('compareBtn');
    const resultDiv = document.getElementById('comparisonResult');

    function init() {
        populateDropdowns();
        compareBtn.addEventListener('click', performComparison);
        
        // Pre-fill from session if available
        const compareList = JSON.parse(sessionStorage.getItem('compareList')) || [];
        if (compareList.length >= 1) bike1Select.value = compareList[0];
        if (compareList.length >= 2) bike2Select.value = compareList[1];
    }

    function populateDropdowns() {
        const bikes = BikeData.getBikes();
        let options = '<option value="">Select Bike</option>';
        bikes.forEach(bike => {
            options += `<option value="${bike.id}">${bike.name}</option>`;
        });
        bike1Select.innerHTML = options;
        bike2Select.innerHTML = options;
    }

    function performComparison() {
        const id1 = bike1Select.value;
        const id2 = bike2Select.value;
        if (!id1 || !id2) {
            alert('Please select two bikes.');
            return;
        }
        if (id1 === id2) {
            alert('Please select two different bikes.');
            return;
        }

        const bikes = BikeData.getBikes();
        const bike1 = bikes.find(b => b.id === id1);
        const bike2 = bikes.find(b => b.id === id2);
        if (!bike1 || !bike2) return;

        renderComparison(bike1, bike2);
    }

    function renderComparison(b1, b2) {
        const priceDiff = b1.price - b2.price;
        const specsToCompare = [
            'engine', 'displacement', 'power', 'torque', 'mileage', 'fuelCapacity', 'kerbWeight'
        ];
        
        let html = `
            <div class="comparison-row header">
                <div class="comparison-cell">Specification</div>
                <div class="comparison-cell">${b1.name}</div>
                <div class="comparison-cell">${b2.name}</div>
            </div>
        `;

        specsToCompare.forEach(spec => {
            const val1 = b1.specs[spec] || '—';
            const val2 = b2.specs[spec] || '—';
            // Simple highlight: if numeric comparison possible, but here just for demo
            const highlight1 = false;
            const highlight2 = false;
            html += `
                <div class="comparison-row">
                    <div class="comparison-cell">${spec}</div>
                    <div class="comparison-cell ${highlight1 ? 'highlight' : ''}">${val1}</div>
                    <div class="comparison-cell ${highlight2 ? 'highlight' : ''}">${val2}</div>
                </div>
            `;
        });

        // Price and rating
        html += `
            <div class="comparison-row">
                <div class="comparison-cell">Price (₹)</div>
                <div class="comparison-cell ${b1.price < b2.price ? 'highlight' : ''}">${b1.price.toLocaleString()}</div>
                <div class="comparison-cell ${b2.price < b1.price ? 'highlight' : ''}">${b2.price.toLocaleString()}</div>
            </div>
            <div class="comparison-row">
                <div class="comparison-cell">Overall Rating</div>
                <div class="comparison-cell ${b1.ratings.overall > b2.ratings.overall ? 'highlight' : ''}">${b1.ratings.overall?.toFixed(1) || 'N/A'}</div>
                <div class="comparison-cell ${b2.ratings.overall > b1.ratings.overall ? 'highlight' : ''}">${b2.ratings.overall?.toFixed(1) || 'N/A'}</div>
            </div>
            <div class="comparison-row">
                <div class="comparison-cell">Price Difference</div>
                <div class="comparison-cell" colspan="2">
                    ${priceDiff > 0 ? `${b1.name} is ₹ ${Math.abs(priceDiff).toLocaleString()} more expensive` : priceDiff < 0 ? `${b2.name} is ₹ ${Math.abs(priceDiff).toLocaleString()} more expensive` : 'Same price'}
                </div>
            </div>
        `;

        resultDiv.innerHTML = html;
    }

    return { init };
})();