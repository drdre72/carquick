// CarQuick Authentication Module - Backend functions for user management
import { Permissions, webMethod } from 'wix-web-module';
import { members } from 'wix-members-backend';
import { emailTemplates } from 'wix-email-templates-backend';
import { triggeredEmails } from 'wix-triggered-emails-backend';

// User registration with email verification
export const registerUser = webMethod(Permissions.Anyone, async (userData) => {
    try {
        const { email, password, firstName, lastName, phone } = userData;
        
        // Validate input data
        if (!email || !password || !firstName || !lastName) {
            throw new Error('Missing required fields');
        }
        
        if (!isValidEmail(email)) {
            throw new Error('Invalid email format');
        }
        
        if (!isValidPassword(password)) {
            throw new Error('Password must be at least 8 characters with uppercase, lowercase, and number');
        }
        
        // Register member with Wix Members
        const registrationResult = await members.register(email, password, {
            contactInfo: {
                firstName,
                lastName,
                phones: phone ? [phone] : []
            },
            privacyStatus: 'PUBLIC'
        });
        
        if (registrationResult.status === 'ACTIVE') {
            // Member registered and activated
            await initializeNewMember(registrationResult.member.contactId, {
                loyaltyPoints: 100, // Welcome bonus
                memberSince: new Date(),
                preferredLocation: 'Joliet, IL'
            });
            
            // Send welcome email
            await sendWelcomeEmail(email, firstName);
            
            return {
                success: true,
                message: 'Registration successful! Welcome bonus of 100 points added.',
                memberId: registrationResult.member.contactId
            };
        } else if (registrationResult.status === 'PENDING') {
            // Email verification required
            return {
                success: true,
                message: 'Registration successful! Please check your email to verify your account.',
                requiresVerification: true
            };
        }
        
    } catch (error) {
        console.error('Registration error:', error);
        
        if (error.message.includes('already exists')) {
            return {
                success: false,
                message: 'An account with this email already exists. Please sign in instead.'
            };
        }
        
        return {
            success: false,
            message: error.message || 'Registration failed. Please try again.'
        };
    }
});

// Enhanced login with loyalty points tracking
export const loginUser = webMethod(Permissions.Anyone, async (credentials) => {
    try {
        const { email, password } = credentials;
        
        if (!email || !password) {
            throw new Error('Email and password are required');
        }
        
        // Attempt login
        const loginResult = await members.authentication.login(email, password);
        
        if (loginResult.success) {
            // Update last login time and increment login streak
            await updateMemberLoginData(loginResult.member.contactId);
            
            // Get member profile with custom data
            const memberProfile = await getMemberProfile(loginResult.member.contactId);
            
            return {
                success: true,
                message: 'Login successful',
                member: memberProfile
            };
        } else {
            return {
                success: false,
                message: 'Invalid email or password'
            };
        }
        
    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            message: 'Login failed. Please check your credentials and try again.'
        };
    }
});

// Google OAuth registration/login
export const googleAuth = webMethod(Permissions.Anyone, async (googleToken) => {
    try {
        // In a real implementation, verify the Google token
        // For now, this is a placeholder for the OAuth flow
        
        const loginResult = await members.authentication.loginWithGoogle(googleToken);
        
        if (loginResult.success) {
            // Check if this is a new member
            if (loginResult.isNewMember) {
                await initializeNewMember(loginResult.member.contactId, {
                    loyaltyPoints: 100, // Welcome bonus
                    memberSince: new Date(),
                    preferredLocation: 'Joliet, IL',
                    authProvider: 'google'
                });
            }
            
            const memberProfile = await getMemberProfile(loginResult.member.contactId);
            
            return {
                success: true,
                message: loginResult.isNewMember ? 'Welcome to CarQuick!' : 'Welcome back!',
                member: memberProfile,
                isNewMember: loginResult.isNewMember
            };
        }
        
        return {
            success: false,
            message: 'Google authentication failed'
        };
        
    } catch (error) {
        console.error('Google auth error:', error);
        return {
            success: false,
            message: 'Google authentication failed. Please try again.'
        };
    }
});

// Password reset functionality
export const requestPasswordReset = webMethod(Permissions.Anyone, async (email) => {
    try {
        if (!isValidEmail(email)) {
            throw new Error('Invalid email format');
        }
        
        // Send password reset email
        await members.authentication.sendPasswordResetEmail(email);
        
        return {
            success: true,
            message: 'Password reset instructions sent to your email'
        };
        
    } catch (error) {
        console.error('Password reset error:', error);
        
        // Don't reveal if email exists for security
        return {
            success: true,
            message: 'If an account with this email exists, password reset instructions have been sent'
        };
    }
});

// Update member profile
export const updateMemberProfile = webMethod(Permissions.SiteMember, async (profileData) => {
    try {
        const currentMember = await members.getCurrentMember();
        if (!currentMember.member) {
            throw new Error('User not authenticated');
        }
        
        const contactId = currentMember.member.contactId;
        
        // Update contact information
        if (profileData.contactInfo) {
            await members.updateMemberContact(contactId, profileData.contactInfo);
        }
        
        // Update custom fields
        if (profileData.customFields) {
            await members.updateMemberCustomFields(contactId, profileData.customFields);
        }
        
        const updatedProfile = await getMemberProfile(contactId);
        
        return {
            success: true,
            message: 'Profile updated successfully',
            member: updatedProfile
        };
        
    } catch (error) {
        console.error('Profile update error:', error);
        return {
            success: false,
            message: 'Failed to update profile. Please try again.'
        };
    }
});

// Get member's rental history and profile
export const getMemberProfile = webMethod(Permissions.SiteMember, async (contactId) => {
    try {
        const currentMember = await members.getCurrentMember();
        const memberContactId = contactId || currentMember.member?.contactId;
        
        if (!memberContactId) {
            throw new Error('Member not found');
        }
        
        const memberData = await members.getMember(memberContactId);
        
        // Get custom fields with loyalty data
        const customFields = memberData.member.customFields || {};
        
        return {
            contactId: memberContactId,
            email: memberData.member.loginEmail,
            profile: memberData.member.contact,
            loyaltyPoints: customFields.loyaltyPoints || 0,
            memberSince: customFields.memberSince || new Date(),
            preferredLocation: customFields.preferredLocation || 'Joliet, IL',
            loginStreak: customFields.loginStreak || 0,
            totalRentals: customFields.totalRentals || 0,
            authProvider: customFields.authProvider || 'email'
        };
        
    } catch (error) {
        console.error('Get member profile error:', error);
        throw error;
    }
});

// Initialize new member with default data
async function initializeNewMember(contactId, initialData) {
    try {
        await members.updateMemberCustomFields(contactId, {
            loyaltyPoints: initialData.loyaltyPoints || 0,
            memberSince: initialData.memberSince || new Date(),
            preferredLocation: initialData.preferredLocation || 'Joliet, IL',
            loginStreak: 0,
            totalRentals: 0,
            authProvider: initialData.authProvider || 'email'
        });
    } catch (error) {
        console.error('Failed to initialize new member:', error);
    }
}

// Update member login data
async function updateMemberLoginData(contactId) {
    try {
        const memberData = await members.getMember(contactId);
        const customFields = memberData.member.customFields || {};
        
        const lastLogin = customFields.lastLogin;
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        
        let loginStreak = customFields.loginStreak || 0;
        
        // Calculate login streak
        if (lastLogin === yesterday) {
            loginStreak += 1;
        } else if (lastLogin !== today) {
            loginStreak = 1;
        }
        
        await members.updateMemberCustomFields(contactId, {
            lastLogin: today,
            loginStreak: loginStreak
        });
        
        // Award streak bonus points
        if (loginStreak > 0 && loginStreak % 7 === 0) {
            await awardLoyaltyPoints(contactId, 25, 'Weekly login streak bonus');
        }
        
    } catch (error) {
        console.error('Failed to update login data:', error);
    }
}

// Award loyalty points
export const awardLoyaltyPoints = webMethod(Permissions.SiteMember, async (contactId, points, reason) => {
    try {
        const memberData = await members.getMember(contactId);
        const currentPoints = memberData.member.customFields?.loyaltyPoints || 0;
        
        await members.updateMemberCustomFields(contactId, {
            loyaltyPoints: currentPoints + points
        });
        
        // Log the transaction (in a real app, this would go to a database)
        console.log(`Awarded ${points} points to ${contactId}: ${reason}`);
        
        return {
            success: true,
            newBalance: currentPoints + points,
            pointsAwarded: points
        };
        
    } catch (error) {
        console.error('Failed to award points:', error);
        throw error;
    }
});

// Send welcome email
async function sendWelcomeEmail(email, firstName) {
    try {
        await triggeredEmails.emailMember(
            'welcome_new_member',
            email,
            {
                firstName: firstName,
                loyaltyPoints: 100
            }
        );
    } catch (error) {
        console.error('Failed to send welcome email:', error);
    }
}

// Validation helpers
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

// Utility function to check if user has admin permissions
export const checkAdminPermissions = webMethod(Permissions.SiteMember, async () => {
    try {
        const currentMember = await members.getCurrentMember();
        const memberData = await members.getMember(currentMember.member.contactId);
        
        const isAdmin = memberData.member.customFields?.isAdmin === true;
        
        return {
            isAdmin,
            permissions: isAdmin ? ['read', 'write', 'admin'] : ['read']
        };
        
    } catch (error) {
        console.error('Admin check error:', error);
        return {
            isAdmin: false,
            permissions: ['read']
        };
    }
});