/**
 * data.js - Bike data management using localStorage
 * Contains sample data and CRUD operations for bikes.
 */

const BIKE_STORAGE_KEY = 'bikeClutch_bikes';

// Sample initial bikes
const sampleBikes = [
    {
        id: 'b1',
        name: 'Yamaha R15 V4',
        brand: 'Yamaha',
        category: 'Sports',
        price: 185000,
        image: 'https://placehold.co/600x400?text=Yamaha+R15',
        gallery: [
            'https://placehold.co/600x400?text=R15+1',
            'https://placehold.co/600x400?text=R15+2',
            'https://placehold.co/600x400?text=R15+3'
        ],
        description: 'The Yamaha R15 V4 is a popular sports bike known for its aggressive styling and track-focused performance.',
        pros: ['Excellent handling', 'Refined engine', 'Full digital console'],
        cons: ['Stiff ride', 'Expensive spares', 'No dual-channel ABS'],
        expertReview: 'The R15 V4 continues to be the king of 150cc sports segment with its razor-sharp handling and premium features. The engine is smooth and the new design turns heads. However, it remains a focused machine, not for comfort seekers.',
        specs: {
            engine: '155cc liquid-cooled',
            displacement: '155cc',
            power: '18.4 bhp',
            torque: '14.2 Nm',
            mileage: '40 kmpl',
            fuelCapacity: '11 L',
            kerbWeight: '141 kg'
        },
        ratings: {
            performance: 4.5,
            comfort: 3.5,
            mileage: 4.0,
            overall: 4.0
        },
        reviews: [
            { user: 'Rahul', rating: 4.2, comment: 'Great bike for enthusiasts!', date: '2025-01-15' }
        ]
    },
    {
        id: 'b2',
        name: 'Royal Enfield Classic 350',
        brand: 'Royal Enfield',
        category: 'Cruiser',
        price: 200000,
        image: 'https://placehold.co/600x400?text=Classic+350',
        gallery: [
            'https://placehold.co/600x400?text=Classic+350+1',
            'https://placehold.co/600x400?text=Classic+350+2'
        ],
        description: 'The Classic 350 is a timeless cruiser with modern engineering and iconic design.',
        pros: ['Iconic style', 'Refined engine', 'Comfortable ride'],
        cons: ['Heavy', 'Average braking', 'Vibrations at high speed'],
        expertReview: 'The new Classic 350 retains its retro charm while offering a much smoother engine and better road manners. It is a great city cruiser and highway tourer.',
        specs: {
            engine: '349cc air-cooled',
            displacement: '349cc',
            power: '20.2 bhp',
            torque: '27 Nm',
            mileage: '35 kmpl',
            fuelCapacity: '13 L',
            kerbWeight: '195 kg'
        },
        ratings: {
            performance: 3.8,
            comfort: 4.5,
            mileage: 3.5,
            overall: 3.9
        },
        reviews: [
            { user: 'Raj', rating: 4.5, comment: 'Lovely thump!', date: '2025-02-10' }
        ]
    },
    {
        id: 'b3',
        name: 'KTM 390 Duke',
        brand: 'KTM',
        category: 'Naked',
        price: 295000,
        image: 'https://placehold.co/600x400?text=390+Duke',
        gallery: [
            'https://placehold.co/600x400?text=390+Duke+1',
            'https://placehold.co/600x400?text=390+Duke+2'
        ],
        description: 'The 390 Duke is a performance-oriented naked bike with aggressive styling and razor-sharp dynamics.',
        pros: ['Powerful engine', 'Lightweight', 'Top-notch electronics'],
        cons: ['Stiff suspension', 'Heat dissipation', 'Service cost'],
        expertReview: 'The 390 Duke remains a hooligan machine that offers incredible value for performance seekers. The updated version gets a quickshifter and better brakes, making it a track day special.',
        specs: {
            engine: '373cc liquid-cooled',
            displacement: '373cc',
            power: '43 bhp',
            torque: '37 Nm',
            mileage: '25 kmpl',
            fuelCapacity: '13.4 L',
            kerbWeight: '168 kg'
        },
        ratings: {
            performance: 4.8,
            comfort: 3.0,
            mileage: 3.0,
            overall: 3.9
        },
        reviews: []
    },
    {
        id: 'b4',
        name: 'Ola S1 Pro',
        brand: 'Ola Electric',
        category: 'Electric',
        price: 140000,
        image: 'https://placehold.co/600x400?text=Ola+S1+Pro',
        gallery: [
            'https://placehold.co/600x400?text=Ola+S1+Pro+1'
        ],
        description: 'India’s best-selling electric scooter with impressive range and features.',
        pros: ['Fast acceleration', 'Large boot', 'Touchscreen', 'Low running cost'],
        cons: ['Build quality issues', 'Service network', 'Real-world range lower'],
        expertReview: 'The Ola S1 Pro has set new benchmarks in the electric scooter space with its performance and tech. However, reliability and after-sales support are still evolving.',
        specs: {
            engine: 'Electric motor',
            displacement: 'NA',
            power: '8.5 kW',
            torque: '58 Nm',
            mileage: '180 km/charge',
            fuelCapacity: 'Battery 4 kWh',
            kerbWeight: '125 kg'
        },
        ratings: {
            performance: 4.2,
            comfort: 4.0,
            mileage: 4.5,
            overall: 4.2
        },
        reviews: []
    }
];

// Initialize localStorage with sample data if empty
function initializeData() {
    if (!localStorage.getItem(BIKE_STORAGE_KEY)) {
        localStorage.setItem(BIKE_STORAGE_KEY, JSON.stringify(sampleBikes));
    }
}

// Get all bikes
function getBikes() {
    initializeData();
    return JSON.parse(localStorage.getItem(BIKE_STORAGE_KEY)) || [];
}

// Get bike by ID
function getBikeById(id) {
    const bikes = getBikes();
    return bikes.find(bike => bike.id === id);
}

// Save bikes array to localStorage
function saveBikes(bikes) {
    localStorage.setItem(BIKE_STORAGE_KEY, JSON.stringify(bikes));
}

// Add new bike
function addBike(bike) {
    const bikes = getBikes();
    bike.id = 'b' + Date.now(); // simple unique id
    if (!bike.reviews) bike.reviews = [];
    if (!bike.gallery) bike.gallery = [bike.image];
    bikes.push(bike);
    saveBikes(bikes);
    return bike;
}

// Update existing bike
function updateBike(updatedBike) {
    let bikes = getBikes();
    const index = bikes.findIndex(b => b.id === updatedBike.id);
    if (index !== -1) {
        bikes[index] = { ...bikes[index], ...updatedBike };
        saveBikes(bikes);
        return true;
    }
    return false;
}

// Delete bike
function deleteBike(id) {
    let bikes = getBikes();
    bikes = bikes.filter(b => b.id !== id);
    saveBikes(bikes);
}

// Add review to a bike
function addReview(bikeId, review) {
    const bikes = getBikes();
    const bike = bikes.find(b => b.id === bikeId);
    if (bike) {
        if (!bike.reviews) bike.reviews = [];
        review.date = new Date().toISOString().split('T')[0];
        bike.reviews.push(review);
        
        // Recalculate overall rating
        const total = bike.reviews.reduce((sum, r) => sum + r.rating, 0);
        bike.ratings.overall = total / bike.reviews.length;
        saveBikes(bikes);
        return true;
    }
    return false;
}

// Export functions for use in other modules
window.BikeData = {
    getBikes,
    getBikeById,
    addBike,
    updateBike,
    deleteBike,
    addReview
};