// CarQuick Vehicle Management - Backend functions for vehicle operations
import { Permissions, webMethod } from 'wix-web-module';
import wixData from 'wix-data';
import { currentMember } from 'wix-members-backend';

// Get all vehicles with filtering options
export const getVehicles = webMethod(Permissions.Anyone, async (filters = {}) => {
    try {
        let query = wixData.query('Vehicles');
        
        // Apply filters
        if (filters.type && filters.type !== 'all') {
            query = query.eq('type', filters.type);
        }
        
        if (filters.available !== undefined) {
            query = query.eq('available', filters.available);
        }
        
        if (filters.location) {
            query = query.eq('location', filters.location);
        }
        
        if (filters.minPrice) {
            query = query.ge('dailyRate', filters.minPrice);
        }
        
        if (filters.maxPrice) {
            query = query.le('dailyRate', filters.maxPrice);
        }
        
        if (filters.transmission && filters.transmission !== 'all') {
            query = query.eq('transmission', filters.transmission);
        }
        
        if (filters.features && filters.features.length > 0) {
            query = query.hasAll('features', filters.features);
        }
        
        // Apply sorting
        switch (filters.sortBy) {
            case 'price-low':
                query = query.ascending('dailyRate');
                break;
            case 'price-high':
                query = query.descending('dailyRate');
                break;
            case 'name':
                query = query.ascending('name');
                break;
            case 'type':
                query = query.ascending('type');
                break;
            case 'rating':
                query = query.descending('rating');
                break;
            default:
                query = query.ascending('name');
        }
        
        const results = await query.find();
        
        return {
            success: true,
            vehicles: results.items,
            totalCount: results.totalCount,
            hasNext: results.hasNext(),
            hasPrev: results.hasPrev()
        };
        
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        return {
            success: false,
            message: 'Failed to fetch vehicles',
            vehicles: []
        };
    }
});

// Get vehicle by ID with full details
export const getVehicleById = webMethod(Permissions.Anyone, async (vehicleId) => {
    try {
        const vehicle = await wixData.get('Vehicles', vehicleId);
        
        if (!vehicle) {
            return {
                success: false,
                message: 'Vehicle not found'
            };
        }
        
        // Get rental history and reviews for this vehicle
        const [rentalHistory, reviews] = await Promise.all([
            getVehicleRentalHistory(vehicleId),
            getVehicleReviews(vehicleId)
        ]);
        
        return {
            success: true,
            vehicle: {
                ...vehicle,
                rentalHistory: rentalHistory.length,
                averageRating: calculateAverageRating(reviews),
                reviewCount: reviews.length,
                recentReviews: reviews.slice(0, 5)
            }
        };
        
    } catch (error) {
        console.error('Error fetching vehicle:', error);
        return {
            success: false,
            message: 'Failed to fetch vehicle details'
        };
    }
});

// Get featured vehicles for homepage
export const getFeaturedVehicles = webMethod(Permissions.Anyone, async (limit = 8) => {
    try {
        const query = wixData.query('Vehicles')
            .eq('featured', true)
            .eq('available', true)
            .limit(limit)
            .descending('rating');
        
        const results = await query.find();
        
        return {
            success: true,
            vehicles: results.items
        };
        
    } catch (error) {
        console.error('Error fetching featured vehicles:', error);
        return {
            success: false,
            message: 'Failed to fetch featured vehicles',
            vehicles: []
        };
    }
});

// Search vehicles with text search
export const searchVehicles = webMethod(Permissions.Anyone, async (searchTerm, filters = {}) => {
    try {
        let query = wixData.query('Vehicles');
        
        if (searchTerm) {
            query = query.contains('name', searchTerm)
                .or(query.contains('description', searchTerm))
                .or(query.contains('features', searchTerm));
        }
        
        // Apply additional filters
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== 'all' && value !== '') {
                query = query.eq(key, value);
            }
        });
        
        const results = await query.find();
        
        return {
            success: true,
            vehicles: results.items,
            totalCount: results.totalCount
        };
        
    } catch (error) {
        console.error('Error searching vehicles:', error);
        return {
            success: false,
            message: 'Search failed',
            vehicles: []
        };
    }
});

// Check vehicle availability for specific dates
export const checkVehicleAvailability = webMethod(Permissions.Anyone, async (vehicleId, startDate, endDate) => {
    try {
        // First check if vehicle exists and is generally available
        const vehicle = await wixData.get('Vehicles', vehicleId);
        if (!vehicle || !vehicle.available) {
            return {
                success: false,
                available: false,
                message: 'Vehicle is not available'
            };
        }
        
        // Check for conflicting bookings
        const conflictingBookings = await wixData.query('Bookings')
            .eq('vehicleId', vehicleId)
            .eq('status', 'confirmed')
            .and(
                wixData.query('Bookings')
                    .le('startDate', endDate)
                    .ge('endDate', startDate)
            )
            .find();
        
        const isAvailable = conflictingBookings.items.length === 0;
        
        return {
            success: true,
            available: isAvailable,
            conflictingBookings: conflictingBookings.items.length,
            message: isAvailable ? 'Vehicle is available' : 'Vehicle is not available for selected dates'
        };
        
    } catch (error) {
        console.error('Error checking availability:', error);
        return {
            success: false,
            available: false,
            message: 'Failed to check availability'
        };
    }
});

// Create a new vehicle (Admin only)
export const createVehicle = webMethod(Permissions.SiteMember, async (vehicleData) => {
    try {
        // Check admin permissions
        const member = await currentMember.getMember();
        const isAdmin = await checkAdminPermissions(member.contactId);
        
        if (!isAdmin) {
            return {
                success: false,
                message: 'Insufficient permissions'
            };
        }
        
        // Validate required fields
        const requiredFields = ['name', 'type', 'dailyRate', 'location'];
        for (const field of requiredFields) {
            if (!vehicleData[field]) {
                return {
                    success: false,
                    message: `Missing required field: ${field}`
                };
            }
        }
        
        const newVehicle = {
            ...vehicleData,
            _id: undefined, // Let Wix Data generate the ID
            available: true,
            featured: vehicleData.featured || false,
            rating: 5.0, // Default rating for new vehicles
            reviewCount: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const result = await wixData.insert('Vehicles', newVehicle);
        
        return {
            success: true,
            message: 'Vehicle created successfully',
            vehicle: result
        };
        
    } catch (error) {
        console.error('Error creating vehicle:', error);
        return {
            success: false,
            message: 'Failed to create vehicle'
        };
    }
});

// Update vehicle (Admin only)
export const updateVehicle = webMethod(Permissions.SiteMember, async (vehicleId, updateData) => {
    try {
        // Check admin permissions
        const member = await currentMember.getMember();
        const isAdmin = await checkAdminPermissions(member.contactId);
        
        if (!isAdmin) {
            return {
                success: false,
                message: 'Insufficient permissions'
            };
        }
        
        const existingVehicle = await wixData.get('Vehicles', vehicleId);
        if (!existingVehicle) {
            return {
                success: false,
                message: 'Vehicle not found'
            };
        }
        
        const updatedVehicle = {
            ...updateData,
            _id: vehicleId,
            updatedAt: new Date()
        };
        
        const result = await wixData.update('Vehicles', updatedVehicle);
        
        return {
            success: true,
            message: 'Vehicle updated successfully',
            vehicle: result
        };
        
    } catch (error) {
        console.error('Error updating vehicle:', error);
        return {
            success: false,
            message: 'Failed to update vehicle'
        };
    }
});

// Delete vehicle (Admin only)
export const deleteVehicle = webMethod(Permissions.SiteMember, async (vehicleId) => {
    try {
        // Check admin permissions
        const member = await currentMember.getMember();
        const isAdmin = await checkAdminPermissions(member.contactId);
        
        if (!isAdmin) {
            return {
                success: false,
                message: 'Insufficient permissions'
            };
        }
        
        // Check if vehicle has active bookings
        const activeBookings = await wixData.query('Bookings')
            .eq('vehicleId', vehicleId)
            .eq('status', 'confirmed')
            .ge('endDate', new Date())
            .find();
        
        if (activeBookings.items.length > 0) {
            return {
                success: false,
                message: 'Cannot delete vehicle with active bookings'
            };
        }
        
        await wixData.remove('Vehicles', vehicleId);
        
        return {
            success: true,
            message: 'Vehicle deleted successfully'
        };
        
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        return {
            success: false,
            message: 'Failed to delete vehicle'
        };
    }
});

// Get vehicle rental history
async function getVehicleRentalHistory(vehicleId) {
    try {
        const rentals = await wixData.query('Bookings')
            .eq('vehicleId', vehicleId)
            .eq('status', 'completed')
            .descending('endDate')
            .find();
        
        return rentals.items;
    } catch (error) {
        console.error('Error fetching rental history:', error);
        return [];
    }
}

// Get vehicle reviews and ratings
async function getVehicleReviews(vehicleId) {
    try {
        const reviews = await wixData.query('Reviews')
            .eq('vehicleId', vehicleId)
            .descending('createdAt')
            .find();
        
        return reviews.items;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
}

// Calculate average rating from reviews
function calculateAverageRating(reviews) {
    if (reviews.length === 0) return 5.0;
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((totalRating / reviews.length) * 10) / 10;
}

// Get vehicle statistics for admin dashboard
export const getVehicleStatistics = webMethod(Permissions.SiteMember, async () => {
    try {
        // Check admin permissions
        const member = await currentMember.getMember();
        const isAdmin = await checkAdminPermissions(member.contactId);
        
        if (!isAdmin) {
            return {
                success: false,
                message: 'Insufficient permissions'
            };
        }
        
        const [totalVehicles, availableVehicles, rentedVehicles, maintenanceVehicles] = await Promise.all([
            wixData.query('Vehicles').count(),
            wixData.query('Vehicles').eq('available', true).count(),
            wixData.query('Vehicles').eq('status', 'rented').count(),
            wixData.query('Vehicles').eq('status', 'maintenance').count()
        ]);
        
        const utilization = totalVehicles > 0 ? Math.round((rentedVehicles / totalVehicles) * 100) : 0;
        
        return {
            success: true,
            statistics: {
                totalVehicles,
                availableVehicles,
                rentedVehicles,
                maintenanceVehicles,
                utilization
            }
        };
        
    } catch (error) {
        console.error('Error fetching vehicle statistics:', error);
        return {
            success: false,
            message: 'Failed to fetch statistics'
        };
    }
});

// Update vehicle location (for fleet tracking)
export const updateVehicleLocation = webMethod(Permissions.SiteMember, async (vehicleId, location) => {
    try {
        await wixData.update('Vehicles', {
            _id: vehicleId,
            location: location,
            lastLocationUpdate: new Date()
        });
        
        return {
            success: true,
            message: 'Location updated successfully'
        };
        
    } catch (error) {
        console.error('Error updating vehicle location:', error);
        return {
            success: false,
            message: 'Failed to update location'
        };
    }
});

// Helper function to check admin permissions
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