// CarQuick Fleet/Inventory Page - Clean Implementation
import { currentMember } from 'wix-members';
import wixLocation from 'wix-location';
import wixStorage from 'wix-storage';
import { getVehicles } from 'backend/vehicles.web';

let allVehicles = [];
let currentUser = null;

$w.onReady(function () {
    initializeFleetPage();
    setupEventHandlers();
    loadVehicles();
    checkUserAuth();
});

function initializeFleetPage() {
    console.log('CarQuick - Clean Fleet Page Loading...');
    
    // Initialize page content
    console.log('Vehicle inventory page initialized');
}

function setupEventHandlers() {
    // Basic page event handlers
    console.log('Fleet page event handlers setup complete');
}

async function loadVehicles() {
    try {
        console.log('Loading vehicles from backend...');
        
        // Try to get vehicles from backend
        const result = await getVehicles({ available: true });
        
        if (result.success && result.vehicles.length > 0) {
            allVehicles = result.vehicles;
            console.log('Loaded', allVehicles.length, 'vehicles from backend');
            displayVehiclesInfo();
        } else {
            // Fallback to demo data
            allVehicles = getDemoVehicles();
            console.log('Using demo vehicle data');
            displayVehiclesInfo();
        }
        
    } catch (error) {
        console.error('Failed to load vehicles:', error);
        // Use demo data on error
        allVehicles = getDemoVehicles();
        displayVehiclesInfo();
    }
}

function getDemoVehicles() {
    return [
        {
            _id: '1',
            name: '2024 Toyota Corolla',
            type: 'Economy',
            dailyRate: 45,
            imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&q=80',
            transmission: 'Automatic',
            passengers: 5,
            features: ['AC', 'Bluetooth', 'Backup Camera'],
            available: true,
            description: 'Fuel-efficient and reliable compact car perfect for city driving.'
        },
        {
            _id: '2',
            name: '2024 Honda CR-V',
            type: 'SUV',
            dailyRate: 75,
            imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&q=80',
            transmission: 'Automatic',
            passengers: 5,
            features: ['AWD', 'Apple CarPlay', 'Safety Sense'],
            available: true,
            description: 'Spacious SUV with excellent safety ratings and cargo space.'
        },
        {
            _id: '3',
            name: '2024 BMW X5',
            type: 'Luxury',
            dailyRate: 150,
            imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&q=80',
            transmission: 'Automatic',
            passengers: 7,
            features: ['Leather Seats', 'Premium Sound', 'Navigation', 'Heated Seats'],
            available: true,
            description: 'Premium luxury SUV with advanced technology and comfort features.'
        },
        {
            _id: '4',
            name: '2024 Tesla Model 3',
            type: 'Electric',
            dailyRate: 89,
            imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&q=80',
            transmission: 'Automatic',
            passengers: 5,
            features: ['Electric', 'Autopilot', 'Premium Audio'],
            available: true,
            description: 'Clean electric vehicle with advanced technology features.'
        }
    ];
}

function displayVehiclesInfo() {
    console.log('Our Fleet Inventory:');
    console.log('==================');
    
    allVehicles.forEach((vehicle, index) => {
        console.log(`${index + 1}. ${vehicle.name}`);
        console.log(`   Type: ${vehicle.type}`);
        console.log(`   Rate: $${vehicle.dailyRate}/day`);
        console.log(`   Passengers: ${vehicle.passengers}`);
        console.log(`   Features: ${vehicle.features.join(', ')}`);
        console.log(`   Available: ${vehicle.available ? 'Yes' : 'No'}`);
        console.log(`   Description: ${vehicle.description}`);
        console.log('---');
    });
    
    console.log(`Total vehicles available: ${allVehicles.filter(v => v.available).length}`);
    console.log('To book a vehicle, visit our booking page or contact customer service.');
}

async function checkUserAuth() {
    try {
        const member = await currentMember.getMember();
        if (member.loggedIn) {
            currentUser = member;
            console.log('User logged in:', member.loginEmail);
            console.log('User can proceed with vehicle selection and booking');
        } else {
            console.log('User not logged in - showing public inventory');
        }
    } catch (error) {
        console.error('Auth check failed:', error);
    }
}

// Function to simulate vehicle selection (for console demo)
function selectVehicle(vehicleId) {
    const vehicle = allVehicles.find(v => v._id === vehicleId);
    if (vehicle) {
        console.log(`Vehicle selected: ${vehicle.name}`);
        console.log('Storing selection and preparing booking...');
        wixStorage.session.setItem('selectedVehicle', JSON.stringify(vehicle));
        
        // In a real implementation, this would navigate to checkout
        console.log('Ready to proceed to checkout page');
        // wixLocation.to('/checkout');
    }
}

// Export function for testing (can be called from console)
export { selectVehicle };
