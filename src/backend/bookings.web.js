// CarQuick Booking Management - Backend functions for rental bookings
import { Permissions, webMethod } from 'wix-web-module';
import wixData from 'wix-data';
import { currentMember } from 'wix-members-backend';
import { triggeredEmails } from 'wix-triggered-emails-backend';
import { awardLoyaltyPoints } from './auth.web.js';

// Create a new booking
export const createBooking = webMethod(Permissions.SiteMember, async (bookingData) => {
    try {
        const member = await currentMember.getMember();
        if (!member.member) {
            return {
                success: false,
                message: 'User not authenticated'
            };
        }
        
        // Validate booking data
        const validation = validateBookingData(bookingData);
        if (!validation.isValid) {
            return {
                success: false,
                message: validation.message
            };
        }
        
        // Check vehicle availability
        const availability = await checkVehicleAvailability(
            bookingData.vehicleId,
            bookingData.startDate,
            bookingData.endDate
        );
        
        if (!availability.available) {
            return {
                success: false,
                message: 'Vehicle is not available for the selected dates'
            };
        }
        
        // Calculate pricing
        const pricing = await calculateBookingPrice(bookingData);
        
        // Generate booking ID
        const bookingId = generateBookingId();
        
        // Create booking record
        const booking = {
            _id: bookingId,
            contactId: member.member.contactId,
            vehicleId: bookingData.vehicleId,
            startDate: new Date(bookingData.startDate),
            endDate: new Date(bookingData.endDate),
            startTime: bookingData.startTime,
            endTime: bookingData.endTime,
            pickupLocation: bookingData.pickupLocation,
            returnLocation: bookingData.returnLocation,
            
            // Pricing details
            basePrice: pricing.basePrice,
            insurancePrice: pricing.insurancePrice,
            extrasPrice: pricing.extrasPrice,
            taxesPrice: pricing.taxesPrice,
            discountAmount: pricing.discountAmount,
            totalPrice: pricing.totalPrice,
            
            // Additional services
            insurance: bookingData.insurance,
            extras: bookingData.extras || [],
            promoCode: bookingData.promoCode,
            
            // Contact information
            driverInfo: {
                firstName: bookingData.firstName,
                lastName: bookingData.lastName,
                email: bookingData.email,
                phone: bookingData.phone,
                licenseNumber: bookingData.licenseNumber
            },
            
            // Payment information (store only safe data)
            paymentMethod: bookingData.paymentMethod,
            paymentStatus: 'pending',
            
            // Booking status
            status: 'confirmed',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        // Save booking to database
        const savedBooking = await wixData.insert('Bookings', booking);
        
        // Update vehicle status
        await wixData.update('Vehicles', {
            _id: bookingData.vehicleId,
            status: 'rented',
            currentBookingId: bookingId
        });
        
        // Award loyalty points for booking
        await awardLoyaltyPoints(member.member.contactId, 50, 'New booking reward');
        
        // Send confirmation email
        await sendBookingConfirmationEmail(savedBooking, member.member);
        
        return {
            success: true,
            message: 'Booking created successfully',
            booking: savedBooking,
            bookingId: bookingId
        };
        
    } catch (error) {
        console.error('Error creating booking:', error);
        return {
            success: false,
            message: 'Failed to create booking. Please try again.'
        };
    }
});

// Get user's bookings
export const getUserBookings = webMethod(Permissions.SiteMember, async (status = null) => {
    try {
        const member = await currentMember.getMember();
        if (!member.member) {
            return {
                success: false,
                message: 'User not authenticated'
            };
        }
        
        let query = wixData.query('Bookings').eq('contactId', member.member.contactId);
        
        if (status) {
            query = query.eq('status', status);
        }
        
        const results = await query.descending('createdAt').find();
        
        // Populate vehicle data for each booking
        const bookingsWithVehicles = await Promise.all(
            results.items.map(async (booking) => {
                const vehicle = await wixData.get('Vehicles', booking.vehicleId);
                return {
                    ...booking,
                    vehicle: vehicle
                };
            })
        );
        
        return {
            success: true,
            bookings: bookingsWithVehicles
        };
        
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        return {
            success: false,
            message: 'Failed to fetch bookings',
            bookings: []
        };
    }
});

// Get booking by ID
export const getBookingById = webMethod(Permissions.SiteMember, async (bookingId) => {
    try {
        const member = await currentMember.getMember();
        const booking = await wixData.get('Bookings', bookingId);
        
        if (!booking) {
            return {
                success: false,
                message: 'Booking not found'
            };
        }
        
        // Check if user owns this booking or is admin
        const isOwner = booking.contactId === member.member.contactId;
        const isAdmin = await checkAdminPermissions(member.member.contactId);
        
        if (!isOwner && !isAdmin) {
            return {
                success: false,
                message: 'Unauthorized access to booking'
            };
        }
        
        // Get vehicle details
        const vehicle = await wixData.get('Vehicles', booking.vehicleId);
        
        return {
            success: true,
            booking: {
                ...booking,
                vehicle: vehicle
            }
        };
        
    } catch (error) {
        console.error('Error fetching booking:', error);
        return {
            success: false,
            message: 'Failed to fetch booking details'
        };
    }
});

// Update booking status
export const updateBookingStatus = webMethod(Permissions.SiteMember, async (bookingId, newStatus) => {
    try {
        const member = await currentMember.getMember();
        const isAdmin = await checkAdminPermissions(member.member.contactId);
        
        if (!isAdmin) {
            return {
                success: false,
                message: 'Insufficient permissions'
            };
        }
        
        const booking = await wixData.get('Bookings', bookingId);
        if (!booking) {
            return {
                success: false,
                message: 'Booking not found'
            };
        }
        
        // Update booking status
        const updatedBooking = await wixData.update('Bookings', {
            _id: bookingId,
            status: newStatus,
            updatedAt: new Date()
        });
        
        // Update vehicle status based on booking status
        await updateVehicleStatusFromBooking(booking.vehicleId, newStatus, bookingId);
        
        // Send status update email
        await sendBookingStatusEmail(updatedBooking, newStatus);
        
        return {
            success: true,
            message: `Booking status updated to ${newStatus}`,
            booking: updatedBooking
        };
        
    } catch (error) {
        console.error('Error updating booking status:', error);
        return {
            success: false,
            message: 'Failed to update booking status'
        };
    }
});

// Cancel booking
export const cancelBooking = webMethod(Permissions.SiteMember, async (bookingId, reason) => {
    try {
        const member = await currentMember.getMember();
        const booking = await wixData.get('Bookings', bookingId);
        
        if (!booking) {
            return {
                success: false,
                message: 'Booking not found'
            };
        }
        
        // Check if user owns this booking or is admin
        const isOwner = booking.contactId === member.member.contactId;
        const isAdmin = await checkAdminPermissions(member.member.contactId);
        
        if (!isOwner && !isAdmin) {
            return {
                success: false,
                message: 'Unauthorized to cancel this booking'
            };
        }
        
        // Check if booking can be cancelled
        const canCancel = canCancelBooking(booking);
        if (!canCancel.allowed) {
            return {
                success: false,
                message: canCancel.reason
            };
        }
        
        // Calculate refund amount based on cancellation policy
        const refund = calculateRefundAmount(booking);
        
        // Update booking status
        const updatedBooking = await wixData.update('Bookings', {
            _id: bookingId,
            status: 'cancelled',
            cancellationReason: reason,
            refundAmount: refund.amount,
            cancelledAt: new Date(),
            updatedAt: new Date()
        });
        
        // Make vehicle available again
        await wixData.update('Vehicles', {
            _id: booking.vehicleId,
            status: 'available',
            currentBookingId: null
        });
        
        // Process refund (in real implementation, integrate with payment processor)
        await processRefund(booking, refund.amount);
        
        // Send cancellation email
        await sendBookingCancellationEmail(updatedBooking, refund);
        
        return {
            success: true,
            message: 'Booking cancelled successfully',
            refundAmount: refund.amount,
            booking: updatedBooking
        };
        
    } catch (error) {
        console.error('Error cancelling booking:', error);
        return {
            success: false,
            message: 'Failed to cancel booking'
        };
    }
});

// Get booking statistics for admin dashboard
export const getBookingStatistics = webMethod(Permissions.SiteMember, async (dateRange = null) => {
    try {
        const member = await currentMember.getMember();
        const isAdmin = await checkAdminPermissions(member.member.contactId);
        
        if (!isAdmin) {
            return {
                success: false,
                message: 'Insufficient permissions'
            };
        }
        
        let query = wixData.query('Bookings');
        
        if (dateRange) {
            query = query.ge('createdAt', new Date(dateRange.start))
                        .le('createdAt', new Date(dateRange.end));
        }
        
        const [allBookings, confirmedBookings, completedBookings, cancelledBookings] = await Promise.all([
            query.count(),
            query.eq('status', 'confirmed').count(),
            query.eq('status', 'completed').count(),
            query.eq('status', 'cancelled').count()
        ]);
        
        // Calculate revenue
        const revenueQuery = await wixData.query('Bookings')
            .eq('status', 'completed')
            .find();
        
        const totalRevenue = revenueQuery.items.reduce((sum, booking) => sum + booking.totalPrice, 0);
        const averageBookingValue = revenueQuery.items.length > 0 ? totalRevenue / revenueQuery.items.length : 0;
        
        return {
            success: true,
            statistics: {
                totalBookings: allBookings,
                confirmedBookings: confirmedBookings,
                completedBookings: completedBookings,
                cancelledBookings: cancelledBookings,
                totalRevenue: totalRevenue,
                averageBookingValue: averageBookingValue
            }
        };
        
    } catch (error) {
        console.error('Error fetching booking statistics:', error);
        return {
            success: false,
            message: 'Failed to fetch statistics'
        };
    }
});

// Complete booking and initiate return process
export const completeBooking = webMethod(Permissions.SiteMember, async (bookingId, completionData) => {
    try {
        const member = await currentMember.getMember();
        const isAdmin = await checkAdminPermissions(member.member.contactId);
        
        if (!isAdmin) {
            return {
                success: false,
                message: 'Insufficient permissions'
            };
        }
        
        const booking = await wixData.get('Bookings', bookingId);
        if (!booking) {
            return {
                success: false,
                message: 'Booking not found'
            };
        }
        
        // Update booking with completion data
        const updatedBooking = await wixData.update('Bookings', {
            _id: bookingId,
            status: 'completed',
            completedAt: new Date(),
            returnInspection: completionData.inspection,
            finalMileage: completionData.mileage,
            additionalCharges: completionData.additionalCharges || 0,
            updatedAt: new Date()
        });
        
        // Update vehicle status and mileage
        await wixData.update('Vehicles', {
            _id: booking.vehicleId,
            status: 'available',
            currentBookingId: null,
            mileage: completionData.mileage,
            lastRentalDate: new Date()
        });
        
        // Award completion points to customer
        const completionPoints = calculateCompletionPoints(booking);
        await awardLoyaltyPoints(booking.contactId, completionPoints, 'Rental completion bonus');
        
        // Update member's total rentals
        await incrementMemberRentals(booking.contactId);
        
        // Send completion email with review request
        await sendBookingCompletionEmail(updatedBooking);
        
        return {
            success: true,
            message: 'Booking completed successfully',
            booking: updatedBooking,
            pointsAwarded: completionPoints
        };
        
    } catch (error) {
        console.error('Error completing booking:', error);
        return {
            success: false,
            message: 'Failed to complete booking'
        };
    }
});

// Helper functions

function validateBookingData(data) {
    const required = ['vehicleId', 'startDate', 'endDate', 'firstName', 'lastName', 'email', 'phone'];
    
    for (const field of required) {
        if (!data[field]) {
            return {
                isValid: false,
                message: `Missing required field: ${field}`
            };
        }
    }
    
    // Validate dates
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const now = new Date();
    
    if (startDate < now) {
        return {
            isValid: false,
            message: 'Start date cannot be in the past'
        };
    }
    
    if (endDate <= startDate) {
        return {
            isValid: false,
            message: 'End date must be after start date'
        };
    }
    
    return { isValid: true };
}

async function calculateBookingPrice(bookingData) {
    try {
        // Get vehicle details
        const vehicle = await wixData.get('Vehicles', bookingData.vehicleId);
        
        // Calculate days
        const startDate = new Date(bookingData.startDate);
        const endDate = new Date(bookingData.endDate);
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        
        // Base price
        const basePrice = vehicle.dailyRate * days;
        
        // Insurance pricing
        const insurancePrices = {
            basic: 0,
            premium: 15,
            full: 25
        };
        const insurancePrice = (insurancePrices[bookingData.insurance] || 0) * days;
        
        // Extras pricing
        const extrasPrices = {
            gps: 8,
            'child-seat': 12,
            wifi: 10,
            roadside: 6
        };
        const extrasPrice = (bookingData.extras || []).reduce((total, extra) => {
            return total + (extrasPrices[extra] || 0) * days;
        }, 0);
        
        // Calculate discount from promo code
        let discountAmount = 0;
        if (bookingData.promoCode) {
            const discount = await getPromoCodeDiscount(bookingData.promoCode, basePrice);
            discountAmount = discount.amount;
        }
        
        // Calculate taxes (8.75% Illinois rate)
        const subtotal = basePrice + insurancePrice + extrasPrice - discountAmount;
        const taxesPrice = subtotal * 0.0875;
        
        const totalPrice = subtotal + taxesPrice;
        
        return {
            basePrice,
            insurancePrice,
            extrasPrice,
            discountAmount,
            taxesPrice,
            totalPrice,
            days
        };
        
    } catch (error) {
        console.error('Error calculating booking price:', error);
        throw error;
    }
}

async function getPromoCodeDiscount(promoCode, basePrice) {
    const promoCodes = {
        'welcome10': { discount: 0.10, description: '10% off your first rental' },
        'carquick20': { discount: 0.20, description: '20% off any rental' },
        'loyalty15': { discount: 0.15, description: '15% loyalty member discount' },
        'weekend25': { discount: 0.25, description: '25% off weekend rentals' }
    };
    
    const promo = promoCodes[promoCode.toLowerCase()];
    if (promo) {
        return {
            amount: basePrice * promo.discount,
            description: promo.description
        };
    }
    
    return { amount: 0, description: '' };
}

function generateBookingId() {
    return 'CQ' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
}

async function checkVehicleAvailability(vehicleId, startDate, endDate) {
    try {
        const conflictingBookings = await wixData.query('Bookings')
            .eq('vehicleId', vehicleId)
            .eq('status', 'confirmed')
            .and(
                wixData.query('Bookings')
                    .le('startDate', endDate)
                    .ge('endDate', startDate)
            )
            .find();
        
        return {
            available: conflictingBookings.items.length === 0,
            conflicts: conflictingBookings.items.length
        };
        
    } catch (error) {
        console.error('Error checking availability:', error);
        return { available: false, conflicts: 0 };
    }
}

function canCancelBooking(booking) {
    const now = new Date();
    const startDate = new Date(booking.startDate);
    const hoursUntilStart = (startDate - now) / (1000 * 60 * 60);
    
    // Can't cancel if booking has already started
    if (booking.status === 'completed' || booking.status === 'cancelled') {
        return {
            allowed: false,
            reason: 'Booking is already completed or cancelled'
        };
    }
    
    if (hoursUntilStart < 0) {
        return {
            allowed: false,
            reason: 'Cannot cancel a booking that has already started'
        };
    }
    
    return { allowed: true };
}

function calculateRefundAmount(booking) {
    const now = new Date();
    const startDate = new Date(booking.startDate);
    const hoursUntilStart = (startDate - now) / (1000 * 60 * 60);
    
    let refundPercentage = 1.0; // 100% refund by default
    
    // Cancellation policy: reducing refund based on time until start
    if (hoursUntilStart < 24) {
        refundPercentage = 0.5; // 50% refund if cancelled within 24 hours
    } else if (hoursUntilStart < 48) {
        refundPercentage = 0.75; // 75% refund if cancelled within 48 hours
    }
    
    return {
        amount: booking.totalPrice * refundPercentage,
        percentage: refundPercentage * 100
    };
}

async function updateVehicleStatusFromBooking(vehicleId, bookingStatus, bookingId) {
    let vehicleStatus = 'available';
    let currentBookingId = null;
    
    switch (bookingStatus) {
        case 'confirmed':
            vehicleStatus = 'rented';
            currentBookingId = bookingId;
            break;
        case 'completed':
        case 'cancelled':
            vehicleStatus = 'available';
            currentBookingId = null;
            break;
    }
    
    await wixData.update('Vehicles', {
        _id: vehicleId,
        status: vehicleStatus,
        currentBookingId: currentBookingId
    });
}

function calculateCompletionPoints(booking) {
    // Base points for completing a rental
    let points = 25;
    
    // Bonus points based on rental duration
    const days = Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24));
    if (days >= 7) points += 25; // Weekly rental bonus
    if (days >= 30) points += 50; // Monthly rental bonus
    
    return points;
}

async function incrementMemberRentals(contactId) {
    try {
        const memberData = await wixData.query('Members')
            .eq('contactId', contactId)
            .find();
        
        if (memberData.items.length > 0) {
            const member = memberData.items[0];
            await wixData.update('Members', {
                _id: member._id,
                totalRentals: (member.totalRentals || 0) + 1
            });
        }
    } catch (error) {
        console.error('Error incrementing member rentals:', error);
    }
}

// Email functions (simplified - in production these would use proper templates)
async function sendBookingConfirmationEmail(booking, member) {
    try {
        await triggeredEmails.emailMember(
            'booking_confirmation',
            member.loginEmail,
            {
                bookingId: booking._id,
                vehicleName: booking.vehicle?.name,
                startDate: booking.startDate.toLocaleDateString(),
                totalPrice: booking.totalPrice
            }
        );
    } catch (error) {
        console.error('Error sending confirmation email:', error);
    }
}

async function sendBookingStatusEmail(booking, status) {
    // Implementation for status update emails
}

async function sendBookingCancellationEmail(booking, refund) {
    // Implementation for cancellation emails
}

async function sendBookingCompletionEmail(booking) {
    // Implementation for completion/review request emails
}

async function processRefund(booking, amount) {
    // Implementation for payment processor integration
    console.log(`Processing refund of $${amount} for booking ${booking._id}`);
}

async function checkAdminPermissions(contactId) {
    try {
        const memberData = await wixData.query('Members')
            .eq('contactId', contactId)
            .find();
        
        return memberData.items.length > 0 && memberData.items[0].isAdmin === true;
    } catch (error) {
        console.error('Error checking admin permissions:', error);
        return false;
    }
}