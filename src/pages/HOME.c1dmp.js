// CarQuick Home Page - Main landing page functionality
import { currentMember } from 'wix-members';
import { authentication } from 'wix-members';

$w.onReady(function () {
    initializePage();
    setupEventHandlers();
    checkUserAuthentication();
});

function initializePage() {
    // Set initial dark mode state
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    toggleTheme(isDarkMode);
    
    // Update theme toggle button state
    $w('#themeToggle').checked = isDarkMode;
    
    // Initialize search functionality
    setupVehicleSearch();
}

function setupEventHandlers() {
    // Theme toggle functionality
    $w('#themeToggle').onChange(() => {
        const isDark = $w('#themeToggle').checked;
        toggleTheme(isDark);
        localStorage.setItem('darkMode', isDark);
    });
    
    // Navigation menu handlers
    $w('#homeNav').onClick(() => navigateToPage('home'));
    $w('#fleetNav').onClick(() => navigateToPage('fleet'));
    $w('#aboutNav').onClick(() => navigateToPage('about'));
    $w('#contactNav').onClick(() => navigateToPage('contact'));
    
    // Authentication buttons
    $w('#loginBtn').onClick(() => openLoginModal());
    $w('#signupBtn').onClick(() => openSignupModal());
    $w('#logoutBtn').onClick(() => handleLogout());
    
    // Vehicle search
    $w('#searchBtn').onClick(() => handleVehicleSearch());
    $w('#vehicleType').onChange(() => filterVehiclesByType());
    
    // CTA buttons
    $w('#heroBookNowBtn').onClick(() => scrollToVehicles());
    $w('#featuredVehicleBtn').onClick(() => navigateToPage('fleet'));
}

async function checkUserAuthentication() {
    try {
        const member = await currentMember.getMember();
        if (member.loggedIn) {
            showLoggedInState(member);
        } else {
            showLoggedOutState();
        }
    } catch (error) {
        console.error('Authentication check failed:', error);
        showLoggedOutState();
    }
}

function showLoggedInState(member) {
    $w('#loginBtn').hide();
    $w('#signupBtn').hide();
    $w('#userMenu').show();
    $w('#welcomeText').text = `Welcome back, ${member.contact?.firstName || 'User'}!`;
    $w('#userPointsDisplay').text = `Points: ${member.customFields?.loyaltyPoints || 0}`;
}

function showLoggedOutState() {
    $w('#loginBtn').show();
    $w('#signupBtn').show();
    $w('#userMenu').hide();
    $w('#welcomeText').text = 'Welcome to CarQuick';
}

function toggleTheme(isDark) {
    const theme = isDark ? 'dark' : 'light';
    $w('#page').setAttribute('data-theme', theme);
    
    // Update CSS variables for theme
    if (isDark) {
        document.documentElement.style.setProperty('--primary-bg', '#1a1a1a');
        document.documentElement.style.setProperty('--secondary-bg', '#2d2d2d');
        document.documentElement.style.setProperty('--text-primary', '#ffffff');
        document.documentElement.style.setProperty('--text-secondary', '#cccccc');
        document.documentElement.style.setProperty('--accent-color', '#00d4ff');
    } else {
        document.documentElement.style.setProperty('--primary-bg', '#ffffff');
        document.documentElement.style.setProperty('--secondary-bg', '#f8f9fa');
        document.documentElement.style.setProperty('--text-primary', '#333333');
        document.documentElement.style.setProperty('--text-secondary', '#666666');
        document.documentElement.style.setProperty('--accent-color', '#007bff');
    }
}

function setupVehicleSearch() {
    // Populate vehicle type dropdown
    const vehicleTypes = ['All', 'Economy', 'Compact', 'Mid-size', 'Full-size', 'SUV', 'Luxury', 'Van'];
    $w('#vehicleType').options = vehicleTypes.map(type => ({ label: type, value: type.toLowerCase() }));
}

function handleVehicleSearch() {
    const searchParams = {
        location: $w('#locationInput').value,
        pickupDate: $w('#pickupDate').value,
        returnDate: $w('#returnDate').value,
        vehicleType: $w('#vehicleType').value
    };
    
    // Validate search parameters
    if (!searchParams.location || !searchParams.pickupDate || !searchParams.returnDate) {
        $w('#searchError').text = 'Please fill in all required fields';
        $w('#searchError').show();
        return;
    }
    
    // Store search parameters and navigate to fleet page
    wixStorage.session.setItem('searchParams', JSON.stringify(searchParams));
    wixLocation.to('/fleet');
}

function filterVehiclesByType() {
    const selectedType = $w('#vehicleType').value;
    // This would filter the featured vehicles display
    displayFeaturedVehicles(selectedType);
}

async function displayFeaturedVehicles(filterType = 'all') {
    try {
        // This would typically fetch from a database
        const featuredVehicles = await getFeaturedVehicles(filterType);
        
        $w('#featuredVehiclesRepeater').data = featuredVehicles.map(vehicle => ({
            _id: vehicle.id,
            image: vehicle.imageUrl,
            title: vehicle.name,
            price: `$${vehicle.dailyRate}/day`,
            type: vehicle.type,
            features: vehicle.features.join(', ')
        }));
    } catch (error) {
        console.error('Failed to load featured vehicles:', error);
    }
}

async function getFeaturedVehicles(filterType) {
    // Placeholder for database query
    // In a real implementation, this would query the vehicle collection
    return [
        {
            id: '1',
            name: '2024 Toyota Corolla',
            type: 'economy',
            dailyRate: 45,
            imageUrl: '/images/toyota-corolla.jpg',
            features: ['Automatic', 'AC', 'Bluetooth']
        },
        {
            id: '2',
            name: '2024 Honda CR-V',
            type: 'suv',
            dailyRate: 75,
            imageUrl: '/images/honda-crv.jpg',
            features: ['AWD', 'Backup Camera', 'Apple CarPlay']
        },
        {
            id: '3',
            name: '2024 BMW X5',
            type: 'luxury',
            dailyRate: 150,
            imageUrl: '/images/bmw-x5.jpg',
            features: ['Leather', 'Premium Sound', 'Navigation']
        }
    ];
}

function openLoginModal() {
    $w('#loginModal').show();
    $w('#loginEmail').focus();
}

function openSignupModal() {
    $w('#signupModal').show();
    $w('#signupEmail').focus();
}

async function handleLogout() {
    try {
        await authentication.logout();
        showLoggedOutState();
        $w('#logoutSuccess').text = 'Successfully logged out';
        $w('#logoutSuccess').show();
        setTimeout(() => $w('#logoutSuccess').hide(), 3000);
    } catch (error) {
        console.error('Logout failed:', error);
    }
}

function navigateToPage(page) {
    const routes = {
        'home': '/',
        'fleet': '/fleet',
        'about': '/about',
        'contact': '/contact'
    };
    
    if (routes[page]) {
        wixLocation.to(routes[page]);
    }
}

function scrollToVehicles() {
    $w('#featuredVehiclesSection').scrollTo();
}
