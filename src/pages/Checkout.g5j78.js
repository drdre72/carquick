// CarQuick Booking/Checkout Page - Complete rental booking process
import { currentMember } from 'wix-members';
import wixStorage from 'wix-storage';
import wixLocation from 'wix-location';

let selectedVehicle = null;
let bookingDetails = {
    pickupDate: null,
    returnDate: null,
    pickupTime: '10:00',
    returnTime: '10:00',
    pickupLocation: 'Joliet Main Office',
    returnLocation: 'Joliet Main Office',
    totalDays: 0,
    subtotal: 0,
    taxes: 0,
    insurance: 0,
    total: 0
};

$w.onReady(function () {
    initializeBookingPage();
    loadSelectedVehicle();
    setupEventHandlers();
    checkUserAuthentication();
});

function initializeBookingPage() {
    // Apply theme
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    applyTheme(isDarkMode);
    
    // Initialize date pickers with restrictions
    setupDatePickers();
    
    // Setup location dropdowns
    setupLocationDropdowns();
    
    // Setup time dropdowns
    setupTimeDropdowns();
    
    // Initialize insurance options
    setupInsuranceOptions();
}

function loadSelectedVehicle() {
    const vehicleData = wixStorage.session.getItem('selectedVehicle');
    
    if (!vehicleData) {
        // No vehicle selected, redirect to fleet
        showErrorMessage('No vehicle selected. Redirecting to fleet...');
        setTimeout(() => wixLocation.to('/fleet'), 2000);
        return;
    }
    
    selectedVehicle = JSON.parse(vehicleData);
    displayVehicleInfo();
    
    // Load any existing search parameters
    loadSearchParameters();
}

function displayVehicleInfo() {
    if (!selectedVehicle) return;
    
    $w('#selectedVehicleImage').src = selectedVehicle.image;
    $w('#selectedVehicleTitle').text = selectedVehicle.title;
    $w('#selectedVehicleType').text = selectedVehicle.type.charAt(0).toUpperCase() + selectedVehicle.type.slice(1);
    $w('#selectedVehicleRate').text = `$${selectedVehicle.dailyRate}/day`;
    $w('#selectedVehicleFeatures').text = selectedVehicle.features.join(' • ');
    $w('#vehiclePassengers').text = `${selectedVehicle.passengers} passengers`;
    $w('#vehicleLuggage').text = `${selectedVehicle.luggage} bags`;
    $w('#vehicleTransmission').text = selectedVehicle.transmission;
    $w('#vehicleMPG').text = selectedVehicle.mpg;
}

function setupEventHandlers() {
    // Date and time change handlers
    $w('#pickupDate').onChange(() => updateBookingCalculation());
    $w('#returnDate').onChange(() => updateBookingCalculation());
    $w('#pickupTime').onChange(() => updateBookingCalculation());
    $w('#returnTime').onChange(() => updateBookingCalculation());
    
    // Location change handlers
    $w('#pickupLocation').onChange(() => updateDeliveryFees());
    $w('#returnLocation').onChange(() => updateDeliveryFees());
    
    // Insurance options
    $w('#basicInsurance').onChange(() => updateInsuranceCalculation());
    $w('#premiumInsurance').onChange(() => updateInsuranceCalculation());
    $w('#comprehensiveInsurance').onChange(() => updateInsuranceCalculation());
    
    // Add-ons
    $w('#gpsNavigation').onChange(() => updateAddOnsCalculation());
    $w('#childSeat').onChange(() => updateAddOnsCalculation());
    $w('#additionalDriver').onChange(() => updateAddOnsCalculation());
    
    // Driver information form
    setupDriverInfoValidation();
    
    // Payment method selection
    $w('#paymentMethodCards').onClick(() => selectPaymentMethod('cards'));
    $w('#paymentMethodPaypal').onClick(() => selectPaymentMethod('paypal'));
    $w('#paymentMethodApplePay').onClick(() => selectPaymentMethod('applepay'));
    
    // Promo code
    $w('#applyPromoBtn').onClick(() => applyPromoCode());
    
    // Booking confirmation
    $w('#confirmBookingBtn').onClick(() => confirmBooking());
    $w('#cancelBookingBtn').onClick(() => cancelBooking());
    
    // Terms and conditions
    $w('#termsCheckbox').onChange(() => toggleConfirmButton());
}

function setupDatePickers() {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() + 1);
    
    // Set minimum date to today
    $w('#pickupDate').minDate = today;
    $w('#returnDate').minDate = today;
    
    // Set maximum date to 1 year from now
    $w('#pickupDate').maxDate = maxDate;
    $w('#returnDate').maxDate = maxDate;
    
    // Validate return date is after pickup date
    $w('#pickupDate').onChange(() => {
        const pickupDate = $w('#pickupDate').value;
        if (pickupDate) {
            const minReturnDate = new Date(pickupDate);
            minReturnDate.setDate(minReturnDate.getDate() + 1);
            $w('#returnDate').minDate = minReturnDate;
        }
    });
}

function setupLocationDropdowns() {
    const locations = [
        { label: 'Joliet Main Office - 123 Main St', value: 'joliet_main' },
        { label: 'Joliet North - 456 North Ave', value: 'joliet_north' },
        { label: 'Plainfield Branch - 789 Route 59', value: 'plainfield' },
        { label: 'Naperville Location - 321 Downtown Dr', value: 'naperville' },
        { label: 'Home/Hotel Delivery (+$25)', value: 'delivery' },
        { label: 'Airport Pickup (+$35)', value: 'airport' }
    ];
    
    $w('#pickupLocation').options = locations;
    $w('#returnLocation').options = locations;
    
    // Set default values
    $w('#pickupLocation').value = 'joliet_main';
    $w('#returnLocation').value = 'joliet_main';
}

function setupTimeDropdowns() {
    const times = [];
    for (let hour = 8; hour <= 20; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            times.push({ label: timeStr, value: timeStr });
        }
    }
    
    $w('#pickupTime').options = times;
    $w('#returnTime').options = times;
}

function setupInsuranceOptions() {
    // Insurance option details
    const insuranceOptions = {
        basic: { daily: 15, description: 'Basic collision coverage' },
        premium: { daily: 25, description: 'Comprehensive coverage + roadside assistance' },
        comprehensive: { daily: 40, description: 'Full coverage + rental replacement' }
    };
    
    // Update insurance descriptions and pricing
    $w('#basicInsuranceDetails').text = `${insuranceOptions.basic.description} - $${insuranceOptions.basic.daily}/day`;
    $w('#premiumInsuranceDetails').text = `${insuranceOptions.premium.description} - $${insuranceOptions.premium.daily}/day`;
    $w('#comprehensiveInsuranceDetails').text = `${insuranceOptions.comprehensive.description} - $${insuranceOptions.comprehensive.daily}/day`;
}

function loadSearchParameters() {
    const searchParams = wixStorage.session.getItem('searchParams');
    if (searchParams) {
        const params = JSON.parse(searchParams);
        
        if (params.pickupDate) {
            $w('#pickupDate').value = new Date(params.pickupDate);
        }
        if (params.returnDate) {
            $w('#returnDate').value = new Date(params.returnDate);
        }
        if (params.location) {
            // Try to match location to dropdown options
            const locationMap = {
                'joliet': 'joliet_main',
                'plainfield': 'plainfield',
                'naperville': 'naperville'
            };
            const mappedLocation = locationMap[params.location.toLowerCase()] || 'joliet_main';
            $w('#pickupLocation').value = mappedLocation;
            $w('#returnLocation').value = mappedLocation;
        }
        
        updateBookingCalculation();
    }
}

function updateBookingCalculation() {
    const pickupDate = $w('#pickupDate').value;
    const returnDate = $w('#returnDate').value;
    
    if (!pickupDate || !returnDate || !selectedVehicle) {
        return;
    }
    
    // Calculate rental days
    const timeDiff = returnDate.getTime() - pickupDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff <= 0) {
        showError('Return date must be after pickup date');
        return;
    }
    
    bookingDetails.pickupDate = pickupDate;
    bookingDetails.returnDate = returnDate;
    bookingDetails.totalDays = daysDiff;
    
    // Calculate subtotal
    bookingDetails.subtotal = selectedVehicle.dailyRate * daysDiff;
    
    updateTotalCalculation();
}

function updateDeliveryFees() {
    const pickupLocation = $w('#pickupLocation').value;
    const returnLocation = $w('#returnLocation').value;
    
    let deliveryFee = 0;
    
    if (pickupLocation === 'delivery') deliveryFee += 25;
    if (pickupLocation === 'airport') deliveryFee += 35;
    if (returnLocation === 'delivery') deliveryFee += 25;
    if (returnLocation === 'airport') deliveryFee += 35;
    
    bookingDetails.deliveryFee = deliveryFee;
    updateTotalCalculation();
}

function updateInsuranceCalculation() {
    let insuranceCost = 0;
    
    if ($w('#basicInsurance').checked) {
        insuranceCost = 15 * bookingDetails.totalDays;
    } else if ($w('#premiumInsurance').checked) {
        insuranceCost = 25 * bookingDetails.totalDays;
    } else if ($w('#comprehensiveInsurance').checked) {
        insuranceCost = 40 * bookingDetails.totalDays;
    }
    
    bookingDetails.insurance = insuranceCost;
    updateTotalCalculation();
}

function updateAddOnsCalculation() {
    let addOnsCost = 0;
    
    if ($w('#gpsNavigation').checked) {
        addOnsCost += 10 * bookingDetails.totalDays;
    }
    if ($w('#childSeat').checked) {
        addOnsCost += 8 * bookingDetails.totalDays;
    }
    if ($w('#additionalDriver').checked) {
        addOnsCost += 15 * bookingDetails.totalDays;
    }
    
    bookingDetails.addOns = addOnsCost;
    updateTotalCalculation();
}

function updateTotalCalculation() {
    if (bookingDetails.totalDays === 0) return;
    
    const subtotal = bookingDetails.subtotal + (bookingDetails.deliveryFee || 0) + bookingDetails.insurance + (bookingDetails.addOns || 0);
    const taxes = subtotal * 0.0875; // 8.75% Illinois tax rate
    const total = subtotal + taxes;
    
    bookingDetails.taxes = taxes;
    bookingDetails.total = total;
    
    // Update display
    $w('#rentalDaysDisplay').text = `${bookingDetails.totalDays} day${bookingDetails.totalDays !== 1 ? 's' : ''}`;
    $w('#subtotalDisplay').text = `$${subtotal.toFixed(2)}`;
    $w('#taxesDisplay').text = `$${taxes.toFixed(2)}`;
    $w('#totalDisplay').text = `$${total.toFixed(2)}`;
    
    // Update breakdown
    updateCostBreakdown();
}

function updateCostBreakdown() {
    let breakdownHTML = `
        <div>Vehicle Rental: $${bookingDetails.subtotal.toFixed(2)}</div>
    `;
    
    if (bookingDetails.deliveryFee > 0) {
        breakdownHTML += `<div>Delivery Fee: $${bookingDetails.deliveryFee.toFixed(2)}</div>`;
    }
    
    if (bookingDetails.insurance > 0) {
        breakdownHTML += `<div>Insurance: $${bookingDetails.insurance.toFixed(2)}</div>`;
    }
    
    if (bookingDetails.addOns > 0) {
        breakdownHTML += `<div>Add-ons: $${bookingDetails.addOns.toFixed(2)}</div>`;
    }
    
    $w('#costBreakdown').html = breakdownHTML;
}

function setupDriverInfoValidation() {
    // Real-time validation for driver information
    $w('#driverEmail').onChange(() => validateEmail($w('#driverEmail').value));
    $w('#driverPhone').onChange(() => validatePhone($w('#driverPhone').value));
    $w('#driverLicense').onChange(() => validateDriverLicense($w('#driverLicense').value));
}

function validateEmail(email) {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    toggleFieldValidation('#driverEmail', isValid);
    return isValid;
}

function validatePhone(phone) {
    const isValid = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone);
    toggleFieldValidation('#driverPhone', isValid);
    return isValid;
}

function validateDriverLicense(license) {
    const isValid = license.length >= 8;
    toggleFieldValidation('#driverLicense', isValid);
    return isValid;
}

function toggleFieldValidation(fieldId, isValid) {
    if (isValid) {
        $w(fieldId).style.borderColor = '#28a745';
    } else {
        $w(fieldId).style.borderColor = '#dc3545';
    }
}

function selectPaymentMethod(method) {
    // Update payment method selection
    $w('#paymentMethodCards').style.borderColor = method === 'cards' ? '#007bff' : '#e0e0e0';
    $w('#paymentMethodPaypal').style.borderColor = method === 'paypal' ? '#007bff' : '#e0e0e0';
    $w('#paymentMethodApplePay').style.borderColor = method === 'applepay' ? '#007bff' : '#e0e0e0';
    
    bookingDetails.paymentMethod = method;
    
    // Show/hide payment forms
    $w('#cardPaymentForm').hidden = method !== 'cards';
    $w('#paypalPaymentForm').hidden = method !== 'paypal';
    $w('#applePayPaymentForm').hidden = method !== 'applepay';
}

async function applyPromoCode() {
    const promoCode = $w('#promoCodeInput').value.trim().toLowerCase();
    
    if (!promoCode) {
        showError('Please enter a promo code');
        return;
    }
    
    // Sample promo codes
    const promoCodes = {
        'welcome10': { discount: 0.10, description: '10% off your first rental' },
        'carquick20': { discount: 0.20, description: '20% off any rental' },
        'loyalty15': { discount: 0.15, description: '15% loyalty member discount' },
        'weekend25': { discount: 0.25, description: '25% off weekend rentals' }
    };
    
    if (promoCodes[promoCode]) {
        const promo = promoCodes[promoCode];
        const discount = bookingDetails.subtotal * promo.discount;
        
        bookingDetails.promoDiscount = discount;
        bookingDetails.promoCode = promoCode;
        
        $w('#promoSuccessMessage').text = `${promo.description} - $${discount.toFixed(2)} savings!`;
        $w('#promoSuccessMessage').show();
        $w('#promoErrorMessage').hide();
        
        updateTotalCalculation();
    } else {
        $w('#promoErrorMessage').text = 'Invalid promo code';
        $w('#promoErrorMessage').show();
        $w('#promoSuccessMessage').hide();
    }
}

async function confirmBooking() {
    try {
        // Validate all required fields
        if (!validateBookingData()) {
            return;
        }
        
        showConfirmationLoading(true);
        
        // In a real implementation, this would process payment and create booking
        await simulatePaymentProcessing();
        
        // Create booking record
        const bookingId = await createBookingRecord();
        
        // Clear session data
        wixStorage.session.removeItem('selectedVehicle');
        wixStorage.session.removeItem('searchParams');
        
        // Redirect to confirmation page
        wixStorage.session.setItem('bookingConfirmation', JSON.stringify({
            bookingId,
            vehicle: selectedVehicle,
            details: bookingDetails
        }));
        
        wixLocation.to('/booking-confirmation');
        
    } catch (error) {
        console.error('Booking error:', error);
        showError('Booking failed. Please try again.');
    } finally {
        showConfirmationLoading(false);
    }
}

function validateBookingData() {
    const requiredFields = [
        { field: '#driverFirstName', message: 'First name is required' },
        { field: '#driverLastName', message: 'Last name is required' },
        { field: '#driverEmail', message: 'Valid email is required' },
        { field: '#driverPhone', message: 'Valid phone number is required' },
        { field: '#driverLicense', message: 'Driver license number is required' },
        { field: '#pickupDate', message: 'Pickup date is required' },
        { field: '#returnDate', message: 'Return date is required' }
    ];
    
    for (let field of requiredFields) {
        if (!$w(field.field).value) {
            showError(field.message);
            $w(field.field).focus();
            return false;
        }
    }
    
    if (!$w('#termsCheckbox').checked) {
        showError('Please agree to the terms and conditions');
        return false;
    }
    
    if (!bookingDetails.paymentMethod) {
        showError('Please select a payment method');
        return false;
    }
    
    return true;
}

async function simulatePaymentProcessing() {
    // Simulate payment processing delay
    return new Promise(resolve => setTimeout(resolve, 2000));
}

async function createBookingRecord() {
    // Generate booking ID
    const bookingId = 'CQ' + Date.now().toString().slice(-8);
    
    // In a real implementation, this would save to database
    console.log('Creating booking:', {
        bookingId,
        vehicle: selectedVehicle,
        details: bookingDetails,
        timestamp: new Date()
    });
    
    return bookingId;
}

function cancelBooking() {
    if (confirm('Are you sure you want to cancel this booking?')) {
        wixLocation.to('/fleet');
    }
}

function toggleConfirmButton() {
    const termsAccepted = $w('#termsCheckbox').checked;
    const hasPaymentMethod = bookingDetails.paymentMethod !== undefined;
    const hasValidTotal = bookingDetails.total > 0;
    
    $w('#confirmBookingBtn').enabled = termsAccepted && hasPaymentMethod && hasValidTotal;
}

async function checkUserAuthentication() {
    try {
        const member = await currentMember.getMember();
        if (member.loggedIn) {
            // Pre-fill user information
            const profile = member.contact;
            if (profile) {
                $w('#driverFirstName').value = profile.firstName || '';
                $w('#driverLastName').value = profile.lastName || '';
                $w('#driverEmail').value = member.loginEmail || '';
                if (profile.phones && profile.phones.length > 0) {
                    $w('#driverPhone').value = profile.phones[0] || '';
                }
            }
        }
    } catch (error) {
        console.error('Failed to load user data:', error);
    }
}

function showConfirmationLoading(show) {
    $w('#confirmationSpinner').shown = show;
    $w('#confirmBookingBtn').enabled = !show;
    $w('#confirmBookingBtn').label = show ? 'Processing...' : 'Confirm Booking';
}

function showError(message) {
    $w('#bookingErrorMessage').text = message;
    $w('#bookingErrorMessage').show();
    setTimeout(() => $w('#bookingErrorMessage').hide(), 5000);
}

function showSuccess(message) {
    $w('#bookingSuccessMessage').text = message;
    $w('#bookingSuccessMessage').show();
    setTimeout(() => $w('#bookingSuccessMessage').hide(), 5000);
}

function applyTheme(isDark) {
    const theme = isDark ? 'dark' : 'light';
    $w('#page').setAttribute('data-theme', theme);
}
