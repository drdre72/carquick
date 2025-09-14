// CarQuick Admin Dashboard - Account Settings / Admin Panel
import { currentMember } from 'wix-members';
import wixLocation from 'wix-location';
import { getVehicles, createVehicle, updateVehicle, deleteVehicle } from 'backend/vehicles.web';
import { getAllBookings, updateBookingStatus } from 'backend/bookings.web';
import { checkAdminPermission } from 'backend/auth.web';

let currentUser = null;
let isAdmin = false;
let dashboardData = {
    totalVehicles: 0,
    availableVehicles: 0,
    activeBookings: 0,
    totalRevenue: 0
};

$w.onReady(function () {
    initializeAdminDashboard();
    checkUserPermissions();
    loadDashboardData();
});

async function initializeAdminDashboard() {
    console.log('CarQuick Admin Dashboard - Loading...');
    
    // Initialize page content
    setupAdminInterface();
}

function setupAdminInterface() {
    // Since we only have an IFrame and section, we'll use the IFrame for admin content
    // and show basic admin info
    console.log('Setting up admin interface with available elements');
    
    // The IFrame (#24) could be used to embed external admin tools
    // For now, we'll focus on basic functionality
}

async function checkUserPermissions() {
    try {
        const member = await currentMember.getMember();
        if (!member.loggedIn) {
            // Redirect to login
            wixLocation.to('/');
            return;
        }
        
        currentUser = member;
        
        // Check if user has admin permissions
        const adminCheck = await checkAdminPermission();
        if (adminCheck.isAdmin) {
            isAdmin = true;
            console.log('Admin access granted');
            showAdminContent();
        } else {
            console.log('Access denied - not admin');
            showAccessDenied();
        }
        
    } catch (error) {
        console.error('Permission check failed:', error);
        wixLocation.to('/');
    }
}

async function loadDashboardData() {
    if (!isAdmin) return;
    
    try {
        console.log('Loading admin dashboard data...');
        
        // Load vehicles data
        const vehiclesResult = await getVehicles({});
        if (vehiclesResult.success) {
            dashboardData.totalVehicles = vehiclesResult.vehicles.length;
            dashboardData.availableVehicles = vehiclesResult.vehicles.filter(v => v.available).length;
        }
        
        // Load bookings data
        const bookingsResult = await getAllBookings();
        if (bookingsResult.success) {
            dashboardData.activeBookings = bookingsResult.bookings.filter(b => 
                b.status === 'confirmed' || b.status === 'active'
            ).length;
            
            dashboardData.totalRevenue = bookingsResult.bookings
                .filter(b => b.status === 'completed')
                .reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
        }
        
        displayDashboardStats();
        
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
    }
}

function showAdminContent() {
    console.log('Showing admin dashboard content');
    // With limited elements, we'll use console logging and basic functionality
    // In a full implementation, this would populate UI elements
}

function showAccessDenied() {
    console.log('Access denied - redirecting to home');
    // Show access denied message and redirect
    setTimeout(() => {
        wixLocation.to('/');
    }, 2000);
}

function displayDashboardStats() {
    console.log('Admin Dashboard Stats:', {
        'Total Vehicles': dashboardData.totalVehicles,
        'Available Vehicles': dashboardData.availableVehicles,
        'Active Bookings': dashboardData.activeBookings,
        'Total Revenue': `$${dashboardData.totalRevenue.toFixed(2)}`
    });
}

// Admin functions for vehicle management
async function handleCreateVehicle(vehicleData) {
    if (!isAdmin) return;
    
    try {
        const result = await createVehicle(vehicleData);
        if (result.success) {
            console.log('Vehicle created successfully');
            loadDashboardData(); // Refresh data
        }
    } catch (error) {
        console.error('Failed to create vehicle:', error);
    }
}

async function handleUpdateVehicle(vehicleId, updateData) {
    if (!isAdmin) return;
    
    try {
        const result = await updateVehicle(vehicleId, updateData);
        if (result.success) {
            console.log('Vehicle updated successfully');
            loadDashboardData(); // Refresh data
        }
    } catch (error) {
        console.error('Failed to update vehicle:', error);
    }
}

async function handleDeleteVehicle(vehicleId) {
    if (!isAdmin) return;
    
    try {
        const result = await deleteVehicle(vehicleId);
        if (result.success) {
            console.log('Vehicle deleted successfully');
            loadDashboardData(); // Refresh data
        }
    } catch (error) {
        console.error('Failed to delete vehicle:', error);
    }
}

async function handleUpdateBookingStatus(bookingId, newStatus) {
    if (!isAdmin) return;
    
    try {
        const result = await updateBookingStatus(bookingId, newStatus);
        if (result.success) {
            console.log('Booking status updated successfully');
            loadDashboardData(); // Refresh data
        }
    } catch (error) {
        console.error('Failed to update booking status:', error);
    }
}
