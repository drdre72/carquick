// CarQuick Fleet/Inventory Page - Vehicle catalog with filtering and booking
import { currentMember } from 'wix-members';
import wixData from 'wix-data';
import wixLocation from 'wix-location';
import wixStorage from 'wix-storage';

let allVehicles = [];
let filteredVehicles = [];
let currentFilters = {
    type: 'all',
    priceRange: 'all',
    availability: 'available',
    transmission: 'all'
};

$w.onReady(function () {
    initializeFleetPage();
    setupFilters();
    setupEventHandlers();
    loadVehicles();
    applySearchParams();
});

function initializeFleetPage() {
    // Apply theme from localStorage
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    toggleTheme(isDarkMode);
    
    // Check authentication state
    checkUserAuth();
    
    // Initialize loading state
    showLoadingState();
}

function setupFilters() {
    // Vehicle type filter
    const vehicleTypes = [
        { label: 'All Types', value: 'all' },
        { label: 'Economy', value: 'economy' },
        { label: 'Compact', value: 'compact' },
        { label: 'Mid-size', value: 'midsize' },
        { label: 'Full-size', value: 'fullsize' },
        { label: 'SUV', value: 'suv' },
        { label: 'Luxury', value: 'luxury' },
        { label: 'Van', value: 'van' }
    ];
    
    // Price range filter
    const priceRanges = [
        { label: 'All Prices', value: 'all' },
        { label: 'Under $50/day', value: '0-50' },
        { label: '$50-$100/day', value: '50-100' },
        { label: '$100-$150/day', value: '100-150' },
        { label: 'Over $150/day', value: '150+' }
    ];
    
    // Transmission filter
    const transmissions = [
        { label: 'All Transmissions', value: 'all' },
        { label: 'Automatic', value: 'automatic' },
        { label: 'Manual', value: 'manual' }
    ];
    
    $w('#vehicleTypeFilter').options = vehicleTypes;
    $w('#priceRangeFilter').options = priceRanges;
    $w('#transmissionFilter').options = transmissions;
}

function setupEventHandlers() {
    // Filter change handlers
    $w('#vehicleTypeFilter').onChange(() => applyFilters());
    $w('#priceRangeFilter').onChange(() => applyFilters());
    $w('#transmissionFilter').onChange(() => applyFilters());
    $w('#availabilityFilter').onChange(() => applyFilters());
    
    // Search input
    $w('#searchInput').onInput(() => debounce(handleSearch, 300)());
    
    // Sort dropdown
    $w('#sortDropdown').onChange(() => applySorting());
    
    // Clear filters button
    $w('#clearFiltersBtn').onClick(() => clearAllFilters());
    
    // Vehicle repeater events
    $w('#vehicleRepeater').onItemReady(($item, itemData, index) => {
        setupVehicleCard($item, itemData);
    });
    
    // Pagination
    $w('#prevPageBtn').onClick(() => goToPreviousPage());
    $w('#nextPageBtn').onClick(() => goToNextPage());
}

async function loadVehicles() {
    try {
        // In a real implementation, this would query the Wix database
        // For now, using sample data
        allVehicles = await getVehicleData();
        filteredVehicles = [...allVehicles];
        displayVehicles();
        hideLoadingState();
    } catch (error) {
        console.error('Failed to load vehicles:', error);
        showErrorState('Failed to load vehicles. Please try again.');
    }
}

async function getVehicleData() {
    // Sample vehicle data - in production this would come from Wix Data
    return [
        {
            _id: '1',
            title: '2024 Toyota Corolla',
            type: 'economy',
            dailyRate: 45,
            image: 'https://example.com/toyota-corolla.jpg',
            transmission: 'automatic',
            passengers: 5,
            luggage: 2,
            features: ['AC', 'Bluetooth', 'Backup Camera'],
            availability: 'available',
            mpg: '32/41',
            description: 'Fuel-efficient and reliable compact car perfect for city driving.'
        },
        {
            _id: '2',
            title: '2024 Honda CR-V',
            type: 'suv',
            dailyRate: 75,
            image: 'https://example.com/honda-crv.jpg',
            transmission: 'automatic',
            passengers: 5,
            luggage: 4,
            features: ['AWD', 'Apple CarPlay', 'Safety Sense'],
            availability: 'available',
            mpg: '28/34',
            description: 'Spacious SUV with excellent safety ratings and cargo space.'
        },
        {
            _id: '3',
            title: '2024 BMW X5',
            type: 'luxury',
            dailyRate: 150,
            image: 'https://example.com/bmw-x5.jpg',
            transmission: 'automatic',
            passengers: 7,
            luggage: 5,
            features: ['Leather Seats', 'Premium Sound', 'Navigation', 'Heated Seats'],
            availability: 'available',
            mpg: '21/26',
            description: 'Premium luxury SUV with advanced technology and comfort features.'
        },
        {
            _id: '4',
            title: '2024 Ford Transit Van',
            type: 'van',
            dailyRate: 95,
            image: 'https://example.com/ford-transit.jpg',
            transmission: 'automatic',
            passengers: 12,
            luggage: 8,
            features: ['High Roof', 'Rear Camera', 'Fleet Connect'],
            availability: 'rented',
            mpg: '14/19',
            description: 'Large capacity van perfect for group transportation and cargo.'
        },
        {
            _id: '5',
            title: '2024 Nissan Sentra',
            type: 'compact',
            dailyRate: 40,
            image: 'https://example.com/nissan-sentra.jpg',
            transmission: 'manual',
            passengers: 5,
            luggage: 2,
            features: ['Manual Transmission', 'AC', 'USB Ports'],
            availability: 'available',
            mpg: '29/39',
            description: 'Affordable compact car with manual transmission option.'
        }
    ];
}

function applyFilters() {
    currentFilters = {
        type: $w('#vehicleTypeFilter').value,
        priceRange: $w('#priceRangeFilter').value,
        availability: $w('#availabilityFilter').checked ? 'available' : 'all',
        transmission: $w('#transmissionFilter').value
    };
    
    filteredVehicles = allVehicles.filter(vehicle => {
        // Type filter
        if (currentFilters.type !== 'all' && vehicle.type !== currentFilters.type) {
            return false;
        }
        
        // Price range filter
        if (currentFilters.priceRange !== 'all') {
            const [min, max] = currentFilters.priceRange.split('-').map(Number);
            if (max) {
                if (vehicle.dailyRate < min || vehicle.dailyRate > max) return false;
            } else {
                if (vehicle.dailyRate < min) return false;
            }
        }
        
        // Availability filter
        if (currentFilters.availability === 'available' && vehicle.availability !== 'available') {
            return false;
        }
        
        // Transmission filter
        if (currentFilters.transmission !== 'all' && vehicle.transmission !== currentFilters.transmission) {
            return false;
        }
        
        return true;
    });
    
    applySorting();
    displayVehicles();
    updateResultsCount();
}

function handleSearch() {
    const searchTerm = $w('#searchInput').value.toLowerCase();
    
    if (!searchTerm) {
        applyFilters();
        return;
    }
    
    filteredVehicles = allVehicles.filter(vehicle => 
        vehicle.title.toLowerCase().includes(searchTerm) ||
        vehicle.type.toLowerCase().includes(searchTerm) ||
        vehicle.features.some(feature => feature.toLowerCase().includes(searchTerm))
    );
    
    displayVehicles();
    updateResultsCount();
}

function applySorting() {
    const sortOption = $w('#sortDropdown').value;
    
    switch (sortOption) {
        case 'price-low':
            filteredVehicles.sort((a, b) => a.dailyRate - b.dailyRate);
            break;
        case 'price-high':
            filteredVehicles.sort((a, b) => b.dailyRate - a.dailyRate);
            break;
        case 'name':
            filteredVehicles.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'type':
            filteredVehicles.sort((a, b) => a.type.localeCompare(b.type));
            break;
        default:
            // Keep original order
            break;
    }
}

function displayVehicles() {
    $w('#vehicleRepeater').data = filteredVehicles.map(vehicle => ({
        ...vehicle,
        priceDisplay: `$${vehicle.dailyRate}/day`,
        featuresText: vehicle.features.join(' • '),
        availabilityClass: vehicle.availability === 'available' ? 'available' : 'unavailable'
    }));
}

function setupVehicleCard($item, itemData) {
    // Set up individual vehicle card interactions
    $item('#vehicleImage').src = itemData.image;
    $item('#vehicleTitle').text = itemData.title;
    $item('#vehiclePrice').text = itemData.priceDisplay;
    $item('#vehicleFeatures').text = itemData.featuresText;
    $item('#vehicleType').text = itemData.type.charAt(0).toUpperCase() + itemData.type.slice(1);
    
    // Book now button
    $item('#bookNowBtn').onClick(async () => {
        const member = await currentMember.getMember();
        if (member.loggedIn) {
            initiateBooking(itemData);
        } else {
            showLoginPrompt();
        }
    });
    
    // View details button
    $item('#viewDetailsBtn').onClick(() => {
        showVehicleDetails(itemData);
    });
    
    // Disable booking for unavailable vehicles
    if (itemData.availability !== 'available') {
        $item('#bookNowBtn').disable();
        $item('#bookNowBtn').label = 'Unavailable';
    }
}

function initiateBooking(vehicle) {
    // Store selected vehicle and navigate to booking page
    wixStorage.session.setItem('selectedVehicle', JSON.stringify(vehicle));
    wixLocation.to('/booking');
}

function showVehicleDetails(vehicle) {
    // Populate and show vehicle details modal
    $w('#detailsVehicleTitle').text = vehicle.title;
    $w('#detailsVehicleImage').src = vehicle.image;
    $w('#detailsVehiclePrice').text = `$${vehicle.dailyRate}/day`;
    $w('#detailsVehicleDescription').text = vehicle.description;
    $w('#detailsPassengers').text = `${vehicle.passengers} passengers`;
    $w('#detailsLuggage').text = `${vehicle.luggage} bags`;
    $w('#detailsMPG').text = vehicle.mpg;
    $w('#detailsTransmission').text = vehicle.transmission;
    $w('#detailsFeaturesList').text = vehicle.features.join(', ');
    
    $w('#vehicleDetailsModal').show();
}

function applySearchParams() {
    const searchParams = wixStorage.session.getItem('searchParams');
    if (searchParams) {
        const params = JSON.parse(searchParams);
        if (params.vehicleType && params.vehicleType !== 'all') {
            $w('#vehicleTypeFilter').value = params.vehicleType;
            applyFilters();
        }
    }
}

function clearAllFilters() {
    $w('#vehicleTypeFilter').value = 'all';
    $w('#priceRangeFilter').value = 'all';
    $w('#transmissionFilter').value = 'all';
    $w('#availabilityFilter').checked = true;
    $w('#searchInput').value = '';
    
    applyFilters();
}

function updateResultsCount() {
    const count = filteredVehicles.length;
    $w('#resultsCount').text = `${count} vehicle${count !== 1 ? 's' : ''} found`;
}

async function checkUserAuth() {
    try {
        const member = await currentMember.getMember();
        if (member.loggedIn) {
            $w('#loginPrompt').hide();
        } else {
            $w('#loginPrompt').show();
        }
    } catch (error) {
        console.error('Auth check failed:', error);
    }
}

function showLoginPrompt() {
    $w('#loginModal').show();
}

function showLoadingState() {
    $w('#loadingSpinner').show();
    $w('#vehicleRepeater').hide();
}

function hideLoadingState() {
    $w('#loadingSpinner').hide();
    $w('#vehicleRepeater').show();
}

function showErrorState(message) {
    $w('#errorMessage').text = message;
    $w('#errorState').show();
    $w('#loadingSpinner').hide();
}

function toggleTheme(isDark) {
    const theme = isDark ? 'dark' : 'light';
    $w('#page').setAttribute('data-theme', theme);
}

// Utility function for search debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Pagination functions (for future implementation)
function goToPreviousPage() {
    // Implementation for pagination
}

function goToNextPage() {
    // Implementation for pagination
}
