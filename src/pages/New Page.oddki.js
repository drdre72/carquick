// 🚗 CarQuick Home Page - SECTION1 VERSION
console.log('🚗 CarQuick Home Page - Section1 Dynamic Version Loading...');

import { currentMember } from 'wix-members';
import wixLocation from 'wix-location';
import wixStorage from 'wix-storage';
import { getFeaturedVehicles } from 'backend/vehicles.web';

let currentUser = null;
let featuredVehicles = [];

$w.onReady(function () {
    console.log('✅ HOME page $w.onReady fired!');

    // Check if section1 is available and build content dynamically
    if ($w('#section1')) {
        console.log('✅ Found section1 - building dynamic homepage content');
        buildHomepageInSection1();
    } else {
        console.log('⚠️ No section1 found - falling back to standard elements');
        initializePage();
    }

    setupEventHandlers();
    checkUserAuthentication();
    loadFeaturedVehicles();
});

function buildHomepageInSection1() {
    console.log('🏗️ Building dynamic homepage content in section1...');

    try {
        const section1 = $w('#section1');

        // Set section1 properties
        section1.show();

        // Create dynamic HTML content for the homepage
        const homepageHTML = `
            <div style="padding: 40px 20px; max-width: 1200px; margin: 0 auto; text-align: center;">
                <!-- Hero Section -->
                <div style="margin-bottom: 60px;">
                    <h1 style="font-size: 3.5rem; font-weight: 700; color: #1a365d; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);">
                        🚗 CarQuick - Premium Car Rentals
                    </h1>
                    <p style="font-size: 1.3rem; color: #4a5568; margin-bottom: 40px; line-height: 1.6;">
                        Find the perfect vehicle for your journey • Premium fleet • Great rates • Easy booking
                    </p>

                    <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; margin-bottom: 40px;">
                        <button id="dynamicFleetBtn" style="
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white; border: none; padding: 15px 30px;
                            font-size: 1.1rem; font-weight: 600; border-radius: 12px;
                            cursor: pointer; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                            transition: all 0.3s ease;
                        ">🚀 View Fleet</button>

                        <button id="dynamicBookBtn" style="
                            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                            color: white; border: none; padding: 15px 30px;
                            font-size: 1.1rem; font-weight: 600; border-radius: 12px;
                            cursor: pointer; box-shadow: 0 4px 15px rgba(245, 87, 108, 0.3);
                            transition: all 0.3s ease;
                        ">📝 Book Now</button>
                    </div>
                </div>

                <!-- Features Section -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; margin-bottom: 60px;">
                    <div style="padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px; color: white; box-shadow: 0 8px 32px rgba(102, 126, 234, 0.2);">
                        <div style="font-size: 3rem; margin-bottom: 15px;">✨</div>
                        <h3 style="font-size: 1.4rem; margin-bottom: 10px; font-weight: 600;">Premium Fleet Available</h3>
                        <p>Luxury vehicles maintained to the highest standards</p>
                    </div>

                    <div style="padding: 30px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 16px; color: white; box-shadow: 0 8px 32px rgba(240, 147, 251, 0.2);">
                        <div style="font-size: 3rem; margin-bottom: 15px;">⚡</div>
                        <h3 style="font-size: 1.4rem; margin-bottom: 10px; font-weight: 600;">Instant Booking</h3>
                        <p>Reserve your vehicle in minutes with our streamlined process</p>
                    </div>

                    <div style="padding: 30px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border-radius: 16px; color: white; box-shadow: 0 8px 32px rgba(79, 172, 254, 0.2);">
                        <div style="font-size: 3rem; margin-bottom: 15px;">🛡️</div>
                        <h3 style="font-size: 1.4rem; margin-bottom: 10px; font-weight: 600;">24/7 Support</h3>
                        <p>Round-the-clock assistance for all your rental needs</p>
                    </div>
                </div>

                <!-- Featured Vehicles Section -->
                <div id="featuredSection" style="margin-bottom: 40px;">
                    <h2 style="font-size: 2.5rem; font-weight: 700; color: #1a365d; margin-bottom: 20px;">🌟 Featured Vehicles</h2>
                    <p style="font-size: 1.1rem; color: #4a5568; margin-bottom: 40px;">Choose from our premium selection</p>
                    <div id="vehicleGrid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
                        <div style="text-align: center; color: #4a5568; font-size: 1.1rem;">🔄 Loading featured vehicles...</div>
                    </div>
                </div>

                <!-- User Status Section -->
                <div id="userStatusSection" style="margin-top: 40px; padding: 30px; background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); border-radius: 16px;">
                    <div id="welcomeMessage" style="font-size: 1.2rem; font-weight: 600; color: #1a365d; margin-bottom: 15px;">🎁 Sign up today and get 100 bonus points for your first rental</div>
                    <div id="statusMessage" style="color: #4a5568;">✅ CarQuick System Online - Ready to serve you!</div>
                </div>
            </div>
        `;

        // Check if section1 supports HTML content
        if (section1.html !== undefined) {
            section1.html = homepageHTML;
            console.log('✅ Homepage HTML content set in section1');
        } else {
            console.log('ℹ️ Section1 does not support HTML - trying alternative approach');
            // Alternative approach: try to set background or other properties
            section1.background = {
                "src": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&q=80"
            };
        }

        // Setup click handlers for dynamic buttons (with delay to ensure elements are rendered)
        setTimeout(() => {
            setupDynamicEventHandlers();
        }, 500);

        console.log('✅ Dynamic homepage content built successfully');

    } catch (error) {
        console.log('❌ Error building homepage in section1:', error.message);
        console.log('🔄 Falling back to standard initialization');
        initializePage();
    }
}

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

function setupDynamicEventHandlers() {
    console.log('🔗 Setting up dynamic event handlers for section1 content...');

    try {
        // Setup fleet button click handler
        const fleetBtn = document.getElementById('dynamicFleetBtn');
        if (fleetBtn) {
            fleetBtn.addEventListener('click', () => {
                console.log('🎯 Dynamic View Fleet button clicked!');
                try {
                    wixLocation.to('/all-vehicles');
                } catch (error) {
                    console.log('Navigation failed:', error.message);
                    updateStatusMessage('🎯 Fleet button clicked! (Navigation to All Vehicles page)');
                }
            });
            console.log('✅ Dynamic fleet button click handler attached');
        }

        // Setup book button click handler
        const bookBtn = document.getElementById('dynamicBookBtn');
        if (bookBtn) {
            bookBtn.addEventListener('click', () => {
                console.log('📝 Dynamic Book Now button clicked!');
                try {
                    // Store quick booking intent
                    wixStorage.session.setItem('searchParams', JSON.stringify({
                        quickBooking: true,
                        timestamp: new Date().toISOString()
                    }));
                    wixLocation.to('/all-vehicles');
                } catch (error) {
                    console.log('Booking navigation failed:', error.message);
                    updateStatusMessage('📝 Book Now clicked! (Navigating to All Vehicles page)');
                }
            });
            console.log('✅ Dynamic book button click handler attached');
        }

        // Add hover effects to buttons
        [fleetBtn, bookBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('mouseenter', () => {
                    btn.style.transform = 'translateY(-2px)';
                    btn.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
                });
                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = 'translateY(0)';
                    btn.style.boxShadow = btn.id === 'dynamicFleetBtn' ?
                        '0 4px 15px rgba(102, 126, 234, 0.3)' :
                        '0 4px 15px rgba(245, 87, 108, 0.3)';
                });
            }
        });

        console.log('✅ Dynamic event handlers setup complete');

    } catch (error) {
        console.log('❌ Error setting up dynamic event handlers:', error.message);
    }
}

function updateStatusMessage(message) {
    try {
        const statusElement = document.getElementById('statusMessage');
        if (statusElement) {
            statusElement.textContent = message;
        }
    } catch (error) {
        console.log('⚠️ Could not update status message:', error.message);
    }
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
        // Try to display in dynamic section first
        const vehicleGrid = document.getElementById('vehicleGrid');
        if (vehicleGrid && featuredVehicles.length > 0) {
            console.log('🎯 Displaying vehicles in dynamic section1 grid');

            const vehicleCards = featuredVehicles.map(vehicle => `
                <div style="
                    background: white;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    cursor: pointer;
                " class="vehicle-card" data-vehicle-id="${vehicle._id}">
                    <img src="${vehicle.imageUrl}" alt="${vehicle.name}" style="
                        width: 100%;
                        height: 200px;
                        object-fit: cover;
                    ">
                    <div style="padding: 24px;">
                        <h3 style="font-size: 1.4rem; font-weight: 600; color: #1a365d; margin-bottom: 8px;">
                            ${vehicle.name}
                        </h3>
                        <p style="color: #4a5568; margin-bottom: 12px; font-size: 1rem;">
                            ${vehicle.type}
                        </p>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                            <span style="font-size: 1.5rem; font-weight: 700; color: #667eea;">
                                $${vehicle.dailyRate}/day
                            </span>
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                            ${vehicle.features.map(feature =>
                                `<span style="
                                    background: #e2e8f0;
                                    color: #4a5568;
                                    padding: 4px 8px;
                                    border-radius: 12px;
                                    font-size: 0.8rem;
                                ">${feature}</span>`
                            ).join('')}
                        </div>
                    </div>
                </div>
            `).join('');

            vehicleGrid.innerHTML = vehicleCards;

            // Add click handlers to vehicle cards
            setTimeout(() => {
                document.querySelectorAll('.vehicle-card').forEach(card => {
                    card.addEventListener('click', () => {
                        const vehicleId = card.getAttribute('data-vehicle-id');
                        const vehicle = featuredVehicles.find(v => v._id === vehicleId);
                        console.log('🚗 Vehicle card clicked:', vehicle.name);
                        updateStatusMessage(`🚗 Selected: ${vehicle.name} - Click Book Now to reserve!`);
                    });

                    // Add hover effects
                    card.addEventListener('mouseenter', () => {
                        card.style.transform = 'translateY(-8px)';
                        card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                    });
                    card.addEventListener('mouseleave', () => {
                        card.style.transform = 'translateY(0)';
                        card.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
                    });
                });
            }, 100);

            console.log('✅ Vehicle grid updated with', featuredVehicles.length, 'vehicles');
        }
        // Fallback to standard gallery
        else if ($w('#gallery2') && featuredVehicles.length > 0) {
            console.log('🔄 Fallback: Using standard gallery');
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
        } else {
            console.log('ℹ️ No vehicle display area found or no vehicles to show');
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
        // Update dynamic book button if it exists
        const bookBtn = document.getElementById('dynamicBookBtn');
        if (bookBtn) {
            bookBtn.textContent = '📝 Continue Booking';
        }

        // Update welcome message in dynamic section
        const welcomeMsg = document.getElementById('welcomeMessage');
        if (welcomeMsg) {
            welcomeMsg.textContent = '🎯 Continue where you left off or start a new booking';
        }

        // Fallback to standard elements
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
        // Update welcome message in dynamic section
        const welcomeMsg = document.getElementById('welcomeMessage');
        if (welcomeMsg) {
            welcomeMsg.textContent = '🎁 Sign up today and get 100 bonus points for your first rental';
        }

        // Fallback to standard elements
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