// 🚗 CarQuick Homepage - WORKING VERSION
console.log('🚗 CarQuick Homepage Loading...');

import { currentMember } from 'wix-members';
import wixLocation from 'wix-location';
import { getFeaturedVehicles } from 'backend/vehicles.web';

let currentUser = null;
let featuredVehicles = [];

$w.onReady(function () {
    console.log('✅ Homepage $w.onReady fired!');
    
    // Immediately set visible content
    setImmediateContent();
    
    // Then load dynamic content
    loadDynamicContent();
    setupEventHandlers();
    checkUserAuthentication();
});

function setImmediateContent() {
    console.log('🎨 Setting immediate homepage content...');
    
    // Set main heading
    if ($w('#text1')) {
        $w('#text1').text = '🚗 CarQuick - Premium Car Rentals';
        $w('#text1').show();
        console.log('✅ Updated main heading');
    }
    
    // Set description
    if ($w('#text2')) {
        $w('#text2').text = 'Find the perfect vehicle for your journey. Premium fleet • Competitive rates • 24/7 support • Instant booking';
        $w('#text2').show();
        console.log('✅ Updated description');
    }
    
    // Set button
    if ($w('#button1')) {
        $w('#button1').label = '🚀 View Our Fleet';
        $w('#button1').show();
        console.log('✅ Updated button');
    }
    
    console.log('✅ Immediate content set successfully!');
}

async function loadDynamicContent() {
    console.log('🔄 Loading dynamic content...');
    
    try {
        // Try to load featured vehicles
        const result = await getFeaturedVehicles(3);
        
        if (result && result.success && result.vehicles && result.vehicles.length > 0) {
            featuredVehicles = result.vehicles;
            console.log('✅ Loaded', featuredVehicles.length, 'featured vehicles from backend');
            
            // Update description with real vehicle data
            const vehicleNames = featuredVehicles.map(v => v.name || 'Vehicle').join(', ');
            if ($w('#text2')) {
                $w('#text2').text = `🌟 Featured Vehicles: ${vehicleNames}. Premium fleet with competitive rates and instant booking!`;
            }
        } else {
            console.log('ℹ️ No vehicles from backend, using demo content');
            // Keep the default content set in setImmediateContent()
        }
        
    } catch (error) {
        console.log('ℹ️ Backend not available, keeping default content:', error.message);
        // Keep the default content - no problem!
    }
    
    console.log('✅ Dynamic content loading complete');
}

function setupEventHandlers() {
    console.log('🔗 Setting up event handlers...');
    
    if ($w('#button1')) {
        $w('#button1').onClick(() => {
            console.log('🎯 Fleet button clicked!');
            
            // Show user feedback
            if ($w('#text2')) {
                $w('#text2').text = '🔄 Loading vehicle inventory... Please wait';
            }
            
            // Navigate to inventory page after short delay
            setTimeout(() => {
                // Try different navigation approaches
                try {
                    wixLocation.to('/new-page-kysz7');
                } catch (error) {
                    console.log('Navigation error:', error);
                    // Fallback - just update the content
                    if ($w('#text2')) {
                        $w('#text2').text = '📱 Navigation: Please manually go to the Inventory page to view our fleet.';
                    }
                }
            }, 500);
        });
        
        console.log('✅ Button click handler set');
    }
}

async function checkUserAuthentication() {
    console.log('🔐 Checking user authentication...');
    
    try {
        const member = await currentMember.getMember();
        
        if (member && member.loggedIn) {
            currentUser = member;
            console.log('✅ User is logged in:', member.loginEmail || 'Unknown email');
            
            // Personalize for logged-in user
            if ($w('#text1')) {
                const firstName = (member.contact && member.contact.firstName) || 'Valued Customer';
                $w('#text1').text = `🎉 Welcome back, ${firstName}!`;
            }
            
            if ($w('#button1')) {
                $w('#button1').label = '🚀 Continue Booking';
            }
            
            console.log('✅ Personalized content for logged-in user');
        } else {
            console.log('ℹ️ User not logged in - showing public content');
        }
        
    } catch (error) {
        console.log('ℹ️ Auth check failed (normal in preview):', error.message);
        // This is normal in preview mode - keep default content
    }
    
    console.log('✅ Authentication check complete');
}

// Add a timer to show the page is fully interactive
setTimeout(() => {
    console.log('');
    console.log('🎉 CARQUICK HOMEPAGE FULLY LOADED!');
    console.log('=====================================');
    console.log('✅ Text elements updated');
    console.log('✅ Button configured'); 
    console.log('✅ Event handlers active');
    console.log('✅ Page is fully interactive');
    console.log('=====================================');
    console.log('');
    
    // Final status update
    if ($w('#text2') && featuredVehicles.length === 0) {
        setTimeout(() => {
            $w('#text2').text = '🚗 CarQuick is ready! Click "View Our Fleet" to explore our premium vehicles. Modern fleet • Great rates • Easy booking!';
        }, 1000);
    }
}, 2000);
