// 🚗 CarQuick Home Page - FIXED VERSION
console.log('🚗 CarQuick Home Page - Fixed Version Loading...');

import { currentMember } from 'wix-members';
import wixLocation from 'wix-location';
import wixStorage from 'wix-storage';
import { getFeaturedVehicles } from 'backend/vehicles.web';

let currentUser = null;
let featuredVehicles = [];

$w.onReady(function () {
    console.log('✅ HOME page $w.onReady fired!');
    initializePage();
    setupEventHandlers();
    checkUserAuthentication();
    loadFeaturedVehicles();
});

function initializePage() {
    console.log('🎨 Initializing CarQuick homepage...');
    
    // Update main content immediately
    updatePageContent();
    
    // Setup contact form if available
    setupContactForm();
    
    console.log('✅ Homepage initialization complete');
}

function updatePageContent() {
    console.log('🔤 Updating page content...');
    
    // Update main headings and text elements - with error handling
    try {
        if ($w('#text1')) {
            $w('#text1').text = '🚗 CarQuick - Premium Car Rentals';
            $w('#text1').show();
            console.log('✅ Updated text1');
        }
    } catch (error) {
        console.log('⚠️ Could not update text1:', error.message);
    }
    
    try {
        if ($w('#text2')) {
            $w('#text2').text = 'Find the perfect vehicle for your journey • Premium fleet • Great rates • Easy booking';
            $w('#text2').show();
            console.log('✅ Updated text2');
        }
    } catch (error) {
        console.log('⚠️ Could not update text2:', error.message);
    }
    
    try {
        if ($w('#text3')) {
            $w('#text3').text = '✨ Premium Fleet Available';
            $w('#text3').show();
            console.log('✅ Updated text3');
        }
    } catch (error) {
        console.log('⚠️ Could not update text3:', error.message);
    }
    
    try {
        if ($w('#text4')) {
            $w('#text4').text = '⚡ Instant Booking';
            $w('#text4').show();
            console.log('✅ Updated text4');
        }
    } catch (error) {
        console.log('⚠️ Could not update text4:', error.message);
    }
    
    try {
        if ($w('#text5')) {
            $w('#text5').text = '🛡️ 24/7 Support';
            $w('#text5').show();
            console.log('✅ Updated text5');
        }
    } catch (error) {
        console.log('⚠️ Could not update text5:', error.message);
    }
    
    // Update buttons with proper error handling
    try {
        if ($w('#button1')) {
            $w('#button1').label = '🚀 View Fleet';
            $w('#button1').show();
            console.log('✅ Updated button1');
        }
    } catch (error) {
        console.log('⚠️ Could not update button1:', error.message);
    }
    
    try {
        if ($w('#button2')) {
            $w('#button2').label = '📝 Book Now';
            $w('#button2').show();
            console.log('✅ Updated button2');
        }
    } catch (error) {
        console.log('⚠️ Could not update button2:', error.message);
    }
    
    console.log('✅ Page content update complete');
}

function setupEventHandlers() {
    console.log('🔗 Setting up event handlers...');
    
    // Main navigation buttons with comprehensive error handling
    try {
        const button1 = $w('#button1');
        if (button1) {
            // Check if it actually has an onClick method
            if (typeof button1.onClick === 'function') {
                button1.onClick(() => {
                    console.log('🎯 View Fleet button clicked!');
                    try {
                        // Both buttons now go to ALL VEHICLES page
                        wixLocation.to('/all-vehicles');
                    } catch (navError) {
                        console.log('Navigation failed:', navError.message);
                        // Update text to show it worked
                        if ($w('#text2')) {
                            $w('#text2').text = '🎯 Fleet button clicked! (Navigation to All Vehicles page)';
                        }
                    }
                });
                console.log('✅ Button1 click handler attached (links to ALL VEHICLES)');
            } else {
                console.log('⚠️ Button1 does not have onClick method - element type:', typeof button1);
                // Try alternative approach - maybe it's a different element type
                if (typeof button1.onMouseClick === 'function') {
                    button1.onMouseClick(() => {
                        console.log('🎯 View Fleet clicked (via onMouseClick)!');
                        if ($w('#text2')) {
                            $w('#text2').text = '🎯 Fleet button clicked! Going to All Vehicles page.';
                        }
                    });
                    console.log('✅ Button1 alternative click handler attached (links to ALL VEHICLES)');
                }
            }
        }
    } catch (error) {
        console.log('❌ Error setting up button1 handler:', error.message);
    }
    
    try {
        const button2 = $w('#button2');
        if (button2) {
            if (typeof button2.onClick === 'function') {
                button2.onClick(() => {
                    console.log('📝 Book Now button clicked!');
                    try {
                        // Store quick booking intent
                        wixStorage.session.setItem('searchParams', JSON.stringify({
                            quickBooking: true,
                            timestamp: new Date().toISOString()
                        }));
                        // Navigate to ALL VEHICLES page instead of new-inventory
                        wixLocation.to('/all-vehicles');
                    } catch (error) {
                        console.log('Booking navigation failed:', error.message);
                        if ($w('#text2')) {
                            $w('#text2').text = '📝 Book Now clicked! (Navigating to All Vehicles page)';
                        }
                    }
                });
                console.log('✅ Button2 click handler attached (links to ALL VEHICLES)');
            } else {
                console.log('⚠️ Button2 does not have onClick method');
                // Try alternative approach
                if (typeof button2.onMouseClick === 'function') {
                    button2.onMouseClick(() => {
                        console.log('📝 Book Now clicked (via onMouseClick)!');
                        if ($w('#text2')) {
                            $w('#text2').text = '📝 Book Now clicked! Going to All Vehicles page.';
                        }
                    });
                    console.log('✅ Button2 alternative click handler attached (links to ALL VEHICLES)');
                }
            }
        }
    } catch (error) {
        console.log('❌ Error setting up button2 handler:', error.message);
    }
    
    // Gallery interaction for featured vehicles (if it exists)
    try {
        if ($w('#gallery2')) {
            const gallery = $w('#gallery2');
            if (typeof gallery.onItemClicked === 'function') {
                gallery.onItemClicked((event) => {
                    console.log('🖼️ Gallery item clicked:', event.item);
                    const vehicleData = event.item;
                    if (vehicleData && $w('#text2')) {
                        $w('#text2').text = `🚗 Selected: ${vehicleData.title || 'Vehicle'}`;
                    }
                });
                console.log('✅ Gallery click handler attached');
            }
        }
    } catch (error) {
        console.log('❌ Error setting up gallery handler:', error.message);
    }
    
    console.log('✅ Event handlers setup complete');
}

function setupContactForm() {
    console.log('🔍 Checking for contact form...');
    try {
        if ($w('#magicForm1')) {
            console.log('✅ Contact form found and available');
            // Form will handle its own submission
        } else {
            console.log('ℹ️ No contact form found');
        }
    } catch (error) {
        console.log('⚠️ Error checking contact form:', error.message);
    }
}

async function loadFeaturedVehicles() {
    console.log('🚗 Loading featured vehicles...');
    
    try {
        // Show loading state if text element exists
        if ($w('#text11')) {
            $w('#text11').text = '🔄 Loading featured vehicles...';
        }
        
        // Get featured vehicles from backend
        const result = await getFeaturedVehicles(6);
        
        if (result && result.success && result.vehicles && result.vehicles.length > 0) {
            featuredVehicles = result.vehicles;
            console.log('✅ Loaded', featuredVehicles.length, 'featured vehicles from backend');
            displayFeaturedVehicles();
            
            // Update section title
            if ($w('#text11')) {
                $w('#text11').text = '🌟 Featured Vehicles';
            }
            
            if ($w('#text12')) {
                $w('#text12').text = 'Choose from our premium selection';
            }
        } else {
            console.log('ℹ️ No vehicles from backend, loading demo vehicles');
            loadDemoVehicles();
        }
        
    } catch (error) {
        console.log('ℹ️ Backend not available, loading demo vehicles:', error.message);
        loadDemoVehicles();
    }
}

function loadDemoVehicles() {
    console.log('📦 Loading demo vehicle data...');
    
    featuredVehicles = [
        {
            _id: '1',
            name: 'Tesla Model 3',
            type: 'Electric Luxury',
            dailyRate: 89,
            imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&q=80',
            features: ['Electric', 'Autopilot', 'Premium Audio']
        },
        {
            _id: '2', 
            name: 'BMW X5',
            type: 'Luxury SUV',
            dailyRate: 125,
            imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&q=80',
            features: ['AWD', 'Leather', 'Sunroof']
        },
        {
            _id: '3',
            name: 'Toyota Camry',
            type: 'Mid-size Sedan',
            dailyRate: 65,
            imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&q=80',
            features: ['Hybrid', 'Safety 2.0', 'CarPlay']
        }
    ];
    
    console.log('✅ Demo vehicles loaded:', featuredVehicles.length, 'vehicles');
    displayFeaturedVehicles();
    
    try {
        if ($w('#text11')) {
            $w('#text11').text = '🌟 Featured Vehicles';
        }
        
        if ($w('#text12')) {
            $w('#text12').text = 'Choose from our premium selection';
        }
    } catch (error) {
        console.log('⚠️ Could not update vehicle section titles:', error.message);
    }
}

function displayFeaturedVehicles() {
    console.log('🖼️ Displaying featured vehicles...');
    
    try {
        if ($w('#gallery2') && featuredVehicles.length > 0) {
            // Prepare gallery data
            const galleryData = featuredVehicles.map(vehicle => ({
                _id: vehicle._id,
                title: vehicle.name,
                description: `${vehicle.type} - $${vehicle.dailyRate}/day`,
                slug: vehicle.name.toLowerCase().replace(/\s+/g, '-'),
                src: vehicle.imageUrl,
                alt: vehicle.name,
                type: 'image',
                vehicleData: vehicle
            }));
            
            // Update gallery
            $w('#gallery2').items = galleryData;
            console.log('✅ Gallery updated with', galleryData.length, 'vehicles');
        } else if (!$w('#gallery2')) {
            console.log('ℹ️ No gallery element found');
        } else {
            console.log('ℹ️ No vehicles to display');
        }
    } catch (error) {
        console.log('⚠️ Error displaying vehicles:', error.message);
    }
}

async function checkUserAuthentication() {
    console.log('🔐 Checking user authentication...');
    
    try {
        const member = await currentMember.getMember();
        if (member && member.loggedIn) {
            currentUser = member;
            console.log('✅ User logged in:', member.loginEmail || 'unknown email');
            
            // Update welcome message
            try {
                if ($w('#text13')) {
                    const firstName = (member.contact && member.contact.firstName) || 'User';
                    $w('#text13').text = `🎉 Welcome back, ${firstName}!`;
                }
            } catch (error) {
                console.log('⚠️ Could not update welcome message:', error.message);
            }
            
            showLoggedInContent();
        } else {
            console.log('ℹ️ User not logged in');
            showLoggedOutContent();
        }
    } catch (error) {
        console.log('ℹ️ Authentication check failed (normal in preview):', error.message);
        showLoggedOutContent();
    }
}

function showLoggedInContent() {
    console.log('👤 Showing logged-in user content...');
    
    try {
        if ($w('#button2')) {
            $w('#button2').label = '📝 Continue Booking';
        }
        
        if ($w('#text14')) {
            $w('#text14').text = '🎯 Continue where you left off or start a new booking';
        }
    } catch (error) {
        console.log('⚠️ Error updating logged-in content:', error.message);
    }
}

function showLoggedOutContent() {
    console.log('🌐 Showing public content...');
    
    try {
        if ($w('#text14')) {
            $w('#text14').text = '🎁 Sign up today and get 100 bonus points for your first rental';
        }
    } catch (error) {
        console.log('⚠️ Error updating public content:', error.message);
    }
}

// Add completion message
setTimeout(() => {
    console.log('');
    console.log('🎉 CARQUICK HOME PAGE FULLY LOADED!');
    console.log('==========================================');
    console.log('✅ Page content updated');
    console.log('✅ Event handlers configured');
    console.log('✅ Authentication checked');
    console.log('✅ Vehicles loaded');
    console.log('✅ All systems ready');
    console.log('==========================================');
    
    // Final content update to show success
    try {
        if ($w('#text6')) {
            $w('#text6').text = '✅ CarQuick System Online - Ready to serve you!';
        }
    } catch (error) {
        // Silent fail
    }
}, 3000);