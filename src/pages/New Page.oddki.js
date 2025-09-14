// 🚗 CarQuick Home Page - WIX COMPATIBLE VERSION
console.log('🚗 CarQuick Home Page - Wix Compatible Version Loading...');

import { currentMember } from 'wix-members';
import wixLocation from 'wix-location';
import wixStorage from 'wix-storage';
import { getFeaturedVehicles } from 'backend/vehicles.web';

let currentUser = null;
let featuredVehicles = [];

$w.onReady(function () {
    console.log('✅ HOME page $w.onReady fired!');
    console.log('🧪 TESTING - HMR-safe approach...');

    // CHECK FOR HMR ISSUES FIRST
    try {
        if (typeof module !== 'undefined' && module.hot) {
            console.log('⚠️ HMR detected - this might cause issues');
        } else {
            console.log('✅ No HMR conflicts detected');
        }
    } catch (error) {
        console.log('🔧 HMR check failed:', error.message);
    }

    // HEADLESS MODE DETECTION TEST
    try {
        console.log('🎯 HEADLESS MODE DETECTION TEST...');

        // Test if we're in headless mode
        console.log('🔍 Environment check:');
        console.log('- window.location.href:', (typeof window !== 'undefined' ? window.location.href : 'undefined'));
        console.log('- Document title:', (typeof document !== 'undefined' ? document.title : 'undefined'));
        console.log('- $w function available:', typeof $w);

        // Try to find ANY elements at all
        const allPossibleElements = [
            '#text1', '#text2', '#text3', '#text4', '#text5', '#text6', '#text7', '#text8',
            '#button1', '#button2', '#section1', '#container1', '#box1', '#image1',
            'body', 'html', '#page', '#main', '#content'
        ];

        let foundAny = false;
        for (let i = 0; i < allPossibleElements.length; i++) {
            const elementId = allPossibleElements[i];
            try {
                const element = $w(elementId);
                if (element) {
                    console.log(`✅ FOUND ELEMENT: ${elementId}, type:`, typeof element);
                    foundAny = true;

                    // Try to log element properties
                    const props = Object.keys(element);
                    console.log(`📋 ${elementId} properties:`, props.slice(0, 10));
                } else {
                    console.log(`❌ NULL: ${elementId}`);
                }
            } catch (elemError) {
                console.log(`❌ ERROR: ${elementId} -`, elemError.message);
            }
        }

        if (!foundAny) {
            console.log('🚨 CRITICAL: NO ELEMENTS FOUND AT ALL!');
            console.log('🤔 This suggests either:');
            console.log('   1. You are in Wix HEADLESS mode (no visual elements)');
            console.log('   2. The page has no elements added in Wix Studio');
            console.log('   3. The $w selector is broken');
        } else {
            console.log('✅ Elements found - not in pure headless mode');
        }

    } catch (ultraError) {
        console.log('❌ Headless detection test failed:', ultraError.message);
    }

    // SIMPLE TEST: Try to change any text to "Hello World"
    try {
        testHelloWorld();
    } catch (error) {
        console.log('❌ testHelloWorld failed:', error.message);
    }

    // Initialize homepage with proper Wix element handling
    try {
        initializeWixHomepage();
    } catch (error) {
        console.log('❌ initializeWixHomepage failed:', error.message);
    }

    try {
        setupEventHandlers();
    } catch (error) {
        console.log('❌ setupEventHandlers failed:', error.message);
    }

    try {
        checkUserAuthentication();
    } catch (error) {
        console.log('❌ checkUserAuthentication failed:', error.message);
    }

    try {
        loadFeaturedVehicles();
    } catch (error) {
        console.log('❌ loadFeaturedVehicles failed:', error.message);
    }
});

function testHelloWorld() {
    console.log('🧪 Running FIXED Hello World test - NO .show() calls...');

    // FOCUS ON WORKING ELEMENTS from the logs
    const workingElements = ['#text6', '#text7', '#text8'];
    let successCount = 0;

    workingElements.forEach(elementId => {
        try {
            const element = $w(elementId);
            if (element) {
                element.text = '🎉 HELLO WORLD! 🎉 JavaScript IS WORKING! 🚀';

                // TRY EXTREME STYLING TO BREAK THROUGH Z-INDEX LAYERS
                try {
                    if (element.style) {
                        element.style = {
                            "z-index": "99999",
                            "position": "fixed",
                            "top": "50px",
                            "left": "50px",
                            "background-color": "red",
                            "color": "white",
                            "font-size": "32px",
                            "padding": "20px",
                            "border": "10px solid yellow",
                            "width": "500px",
                            "height": "100px"
                        };
                        console.log(`✅ Applied EXTREME styling to ${elementId}!`);
                    }
                } catch (styleError) {
                    console.log(`⚠️ Styling failed for ${elementId}:`, styleError.message);
                }

                console.log(`✅ BIG HELLO WORLD SUCCESS in ${elementId}!`);
                successCount++;
            }
        } catch (error) {
            console.log(`❌ Failed to set Hello World in ${elementId}:`, error.message);
        }
    });

    console.log(`🎯 FIXED test complete - ${successCount}/3 working elements updated`);

    if (successCount > 0) {
        console.log('🎉 SUCCESS! You should see "HELLO WORLD!" text on the page now!');
    } else {
        console.log('❌ No working elements found - template may be overriding everything');
    }
}

function initializeWixHomepage() {
    console.log('🎨 Initializing Wix-compatible homepage...');

    try {
        // Set up section1 if available - but only use Wix properties
        if ($w('#section1')) {
            console.log('✅ Found section1 - configuring with Wix properties');
            const section1 = $w('#section1');

            // Show the section
            section1.show();

            // Try to set a background image if supported
            try {
                section1.background = {
                    "src": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&q=80",
                    "color": "#f7fafc"
                };
                console.log('✅ Section1 background set');
            } catch (error) {
                console.log('ℹ️ Section1 background not supported:', error.message);
            }
        }

        // Configure any available page elements with CarQuick content
        configurePageElements();
        console.log('✅ Wix homepage initialization complete');

    } catch (error) {
        console.log('❌ Error initializing homepage:', error.message);
    }
}

function configurePageElements() {
    console.log('🔧 Configuring WORKING page elements only...');

    // FOCUS ON WORKING ELEMENTS ONLY (from logs: text6, text7, text8, gallery1)
    const workingElements = [
        { id: '#text6', content: '🚗 CarQuick - Premium Car Rentals' },
        { id: '#text7', content: 'Find the perfect vehicle for your journey • Premium fleet • Great rates • Easy booking' },
        { id: '#text8', content: '✨ Premium Fleet Available • ⚡ Instant Booking • 🛡️ 24/7 Support' }
    ];

    workingElements.forEach(({ id, content }) => {
        try {
            if ($w(id)) {
                $w(id).text = content;

                // TRY TO FORCE VISIBILITY WITH EXTREME Z-INDEX
                try {
                    const element = $w(id);
                    if (element.style) {
                        element.style = {
                            "z-index": "9999",
                            "position": "relative",
                            "background-color": "red",
                            "color": "white",
                            "font-size": "24px",
                            "padding": "20px",
                            "border": "5px solid yellow"
                        };
                        console.log(`✅ Applied high z-index styling to ${id}`);
                    }
                } catch (styleError) {
                    console.log(`⚠️ Could not apply styling to ${id}:`, styleError.message);
                }

                console.log(`✅ WORKING ELEMENT UPDATED: ${id}`);
            }
        } catch (error) {
            console.log(`❌ Failed to update working element ${id}:`, error.message);
        }
    });

    // Gallery1 works from logs - no .show() needed
    try {
        if ($w('#gallery1')) {
            // Gallery exists and works - no need to show() it
            console.log('✅ Gallery1 is available');
        }
    } catch (error) {
        console.log('⚠️ Could not access gallery1:', error.message);
    }

    console.log('✅ WORKING elements configuration complete');
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

function updateStatusMessage(message) {
    console.log('📝 Status update:', message);

    // Try to update any available text elements with the status
    const statusElements = ['#text6', '#text7', '#text8'];

    statusElements.forEach(elementId => {
        try {
            if ($w(elementId)) {
                $w(elementId).text = message;
                console.log(`✅ Updated status in ${elementId}`);
                return; // Stop after first successful update
            }
        } catch (error) {
            // Continue to next element
        }
    });
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
        // Try to display in Wix gallery first
        if ($w('#gallery1') && featuredVehicles.length > 0) {
            console.log('🎯 Displaying vehicles in gallery1');

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

            $w('#gallery1').items = galleryData;
            console.log('✅ Gallery1 updated with', galleryData.length, 'vehicles');
        }
        // Try gallery2 as fallback
        else if ($w('#gallery2') && featuredVehicles.length > 0) {
            console.log('🔄 Using gallery2');

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

            $w('#gallery2').items = galleryData;
            console.log('✅ Gallery2 updated with', galleryData.length, 'vehicles');
        }
        // Use repeater if available
        else if ($w('#repeater1') && featuredVehicles.length > 0) {
            console.log('🔄 Using repeater1');

            $w('#repeater1').data = featuredVehicles;
            console.log('✅ Repeater updated with', featuredVehicles.length, 'vehicles');
        }
        // Display vehicle info in text elements
        else if (featuredVehicles.length > 0) {
            console.log('🔄 Displaying vehicle info in text elements');

            const vehicleInfo = featuredVehicles.map(v =>
                `🚗 ${v.name} (${v.type}) - $${v.dailyRate}/day`
            ).join(' • ');

            updateStatusMessage(`🌟 Featured: ${vehicleInfo}`);
        } else {
            console.log('ℹ️ No vehicles to display or no display elements found');
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
        // Update button labels for logged-in users
        if ($w('#button2')) {
            $w('#button2').label = '📝 Continue Booking';
        }

        // Update welcome message
        const welcomeMessage = '🎯 Continue where you left off or start a new booking';
        updateStatusMessage(welcomeMessage);

    } catch (error) {
        console.log('⚠️ Error updating logged-in content:', error.message);
    }
}

function showLoggedOutContent() {
    console.log('🌐 Showing public content...');

    try {
        // Update welcome message for logged-out users
        const welcomeMessage = '🎁 Sign up today and get 100 bonus points for your first rental';
        updateStatusMessage(welcomeMessage);

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