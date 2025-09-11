// CarQuick Master Page - Global navigation and authentication
import { authentication, currentMember } from 'wix-members';
import { registerUser, loginUser, googleAuth, requestPasswordReset } from 'backend/auth.web';

$w.onReady(function () {
    initializeMasterPage();
    setupGlobalNavigation();
    setupAuthenticationModals();
    checkAuthenticationState();
});

function initializeMasterPage() {
    // Apply saved theme
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    applyTheme(isDarkMode);
    
    // Set up theme toggle in header
    if ($w('#headerThemeToggle')) {
        $w('#headerThemeToggle').checked = isDarkMode;
        $w('#headerThemeToggle').onChange(() => {
            const newTheme = $w('#headerThemeToggle').checked;
            applyTheme(newTheme);
            localStorage.setItem('darkMode', newTheme);
        });
    }
    
    // Hide authentication modals initially
    hideAllModals();
}

function setupGlobalNavigation() {
    // Main navigation handlers
    if ($w('#logoLink')) {
        $w('#logoLink').onClick(() => navigateTo('/'));
    }
    
    if ($w('#homeNavLink')) {
        $w('#homeNavLink').onClick(() => navigateTo('/'));
    }
    
    if ($w('#fleetNavLink')) {
        $w('#fleetNavLink').onClick(() => navigateTo('/fleet'));
    }
    
    if ($w('#aboutNavLink')) {
        $w('#aboutNavLink').onClick(() => navigateTo('/about'));
    }
    
    if ($w('#contactNavLink')) {
        $w('#contactNavLink').onClick(() => navigateTo('/contact'));
    }
    
    // Authentication buttons in header
    if ($w('#headerLoginBtn')) {
        $w('#headerLoginBtn').onClick(() => openLoginModal());
    }
    
    if ($w('#headerSignupBtn')) {
        $w('#headerSignupBtn').onClick(() => openSignupModal());
    }
    
    if ($w('#headerLogoutBtn')) {
        $w('#headerLogoutBtn').onClick(() => handleLogout());
    }
    
    // User menu dropdown
    if ($w('#userMenuDropdown')) {
        $w('#userMenuDropdown').onClick(() => toggleUserMenu());
    }
    
    if ($w('#dashboardLink')) {
        $w('#dashboardLink').onClick(() => navigateTo('/dashboard'));
    }
    
    if ($w('#profileLink')) {
        $w('#profileLink').onClick(() => navigateTo('/profile'));
    }
}

function setupAuthenticationModals() {
    // Login Modal
    if ($w('#loginModal')) {
        setupLoginModal();
    }
    
    // Signup Modal
    if ($w('#signupModal')) {
        setupSignupModal();
    }
    
    // Password Reset Modal
    if ($w('#passwordResetModal')) {
        setupPasswordResetModal();
    }
}

function setupLoginModal() {
    // Close button
    $w('#loginCloseBtn').onClick(() => $w('#loginModal').hide());
    
    // Switch to signup
    $w('#switchToSignupBtn').onClick(() => {
        $w('#loginModal').hide();
        openSignupModal();
    });
    
    // Forgot password
    $w('#forgotPasswordBtn').onClick(() => {
        $w('#loginModal').hide();
        openPasswordResetModal();
    });
    
    // Login form submission
    $w('#loginForm').onSubmit(async (event) => {
        event.preventDefault();
        await handleLogin();
    });
    
    // Google login
    if ($w('#googleLoginBtn')) {
        $w('#googleLoginBtn').onClick(() => handleGoogleLogin());
    }
    
    // Enter key support
    $w('#loginPassword').onKeyPress((event) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    });
}

function setupSignupModal() {
    // Close button
    $w('#signupCloseBtn').onClick(() => $w('#signupModal').hide());
    
    // Switch to login
    $w('#switchToLoginBtn').onClick(() => {
        $w('#signupModal').hide();
        openLoginModal();
    });
    
    // Signup form submission
    $w('#signupForm').onSubmit(async (event) => {
        event.preventDefault();
        await handleSignup();
    });
    
    // Google signup
    if ($w('#googleSignupBtn')) {
        $w('#googleSignupBtn').onClick(() => handleGoogleLogin());
    }
    
    // Password confirmation validation
    $w('#signupPasswordConfirm').onChange(() => validatePasswordMatch());
    $w('#signupPassword').onChange(() => validatePasswordMatch());
}

function setupPasswordResetModal() {
    // Close button
    $w('#resetCloseBtn').onClick(() => $w('#passwordResetModal').hide());
    
    // Back to login
    $w('#backToLoginBtn').onClick(() => {
        $w('#passwordResetModal').hide();
        openLoginModal();
    });
    
    // Reset form submission
    $w('#resetForm').onSubmit(async (event) => {
        event.preventDefault();
        await handlePasswordReset();
    });
}

async function handleLogin() {
    try {
        showLoginLoading(true);
        clearLoginErrors();
        
        const email = $w('#loginEmail').value;
        const password = $w('#loginPassword').value;
        
        if (!email || !password) {
            showLoginError('Please enter both email and password');
            return;
        }
        
        const result = await loginUser({ email, password });
        
        if (result.success) {
            $w('#loginModal').hide();
            await updateAuthenticationState(result.member);
            showSuccessMessage('Welcome back!');
        } else {
            showLoginError(result.message);
        }
        
    } catch (error) {
        console.error('Login error:', error);
        showLoginError('Login failed. Please try again.');
    } finally {
        showLoginLoading(false);
    }
}

async function handleSignup() {
    try {
        showSignupLoading(true);
        clearSignupErrors();
        
        const userData = {
            email: $w('#signupEmail').value,
            password: $w('#signupPassword').value,
            firstName: $w('#signupFirstName').value,
            lastName: $w('#signupLastName').value,
            phone: $w('#signupPhone').value
        };
        
        // Validate required fields
        if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
            showSignupError('Please fill in all required fields');
            return;
        }
        
        // Check password confirmation
        if (userData.password !== $w('#signupPasswordConfirm').value) {
            showSignupError('Passwords do not match');
            return;
        }
        
        const result = await registerUser(userData);
        
        if (result.success) {
            $w('#signupModal').hide();
            
            if (result.requiresVerification) {
                showSuccessMessage('Registration successful! Please check your email to verify your account.');
            } else {
                showSuccessMessage(result.message);
                // Auto-login after successful registration
                setTimeout(() => openLoginModal(), 2000);
            }
        } else {
            showSignupError(result.message);
        }
        
    } catch (error) {
        console.error('Signup error:', error);
        showSignupError('Registration failed. Please try again.');
    } finally {
        showSignupLoading(false);
    }
}

async function handleGoogleLogin() {
    try {
        // This would integrate with Google OAuth
        // For now, showing a placeholder message
        showSuccessMessage('Google login integration coming soon!');
        
        // In a real implementation:
        // const googleToken = await getGoogleAuthToken();
        // const result = await googleAuth(googleToken);
        // Handle result...
        
    } catch (error) {
        console.error('Google login error:', error);
        showLoginError('Google login failed. Please try again.');
    }
}

async function handlePasswordReset() {
    try {
        showResetLoading(true);
        clearResetErrors();
        
        const email = $w('#resetEmail').value;
        
        if (!email) {
            showResetError('Please enter your email address');
            return;
        }
        
        const result = await requestPasswordReset(email);
        
        if (result.success) {
            $w('#passwordResetModal').hide();
            showSuccessMessage(result.message);
        } else {
            showResetError(result.message);
        }
        
    } catch (error) {
        console.error('Password reset error:', error);
        showResetError('Password reset failed. Please try again.');
    } finally {
        showResetLoading(false);
    }
}

async function handleLogout() {
    try {
        await authentication.logout();
        updateLoggedOutState();
        showSuccessMessage('Successfully logged out');
        
        // Redirect to home page
        setTimeout(() => navigateTo('/'), 1000);
        
    } catch (error) {
        console.error('Logout error:', error);
        showErrorMessage('Logout failed. Please try again.');
    }
}

async function checkAuthenticationState() {
    try {
        const member = await currentMember.getMember();
        if (member.loggedIn) {
            await updateAuthenticationState(member);
        } else {
            updateLoggedOutState();
        }
    } catch (error) {
        console.error('Auth state check failed:', error);
        updateLoggedOutState();
    }
}

async function updateAuthenticationState(memberData) {
    // Show logged-in state
    if ($w('#headerLoginBtn')) $w('#headerLoginBtn').hide();
    if ($w('#headerSignupBtn')) $w('#headerSignupBtn').hide();
    if ($w('#headerLogoutBtn')) $w('#headerLogoutBtn').show();
    if ($w('#userMenuDropdown')) $w('#userMenuDropdown').show();
    
    // Update user info display
    if ($w('#userNameDisplay')) {
        const firstName = memberData.contact?.firstName || 'User';
        $w('#userNameDisplay').text = `Hi, ${firstName}`;
    }
    
    if ($w('#userPointsDisplay')) {
        const points = memberData.customFields?.loyaltyPoints || 0;
        $w('#userPointsDisplay').text = `${points} points`;
    }
}

function updateLoggedOutState() {
    // Show logged-out state
    if ($w('#headerLoginBtn')) $w('#headerLoginBtn').show();
    if ($w('#headerSignupBtn')) $w('#headerSignupBtn').show();
    if ($w('#headerLogoutBtn')) $w('#headerLogoutBtn').hide();
    if ($w('#userMenuDropdown')) $w('#userMenuDropdown').hide();
}

// Modal management functions
function openLoginModal() {
    hideAllModals();
    $w('#loginModal').show();
    $w('#loginEmail').focus();
}

function openSignupModal() {
    hideAllModals();
    $w('#signupModal').show();
    $w('#signupFirstName').focus();
}

function openPasswordResetModal() {
    hideAllModals();
    $w('#passwordResetModal').show();
    $w('#resetEmail').focus();
}

function hideAllModals() {
    const modals = ['#loginModal', '#signupModal', '#passwordResetModal'];
    modals.forEach(modal => {
        if ($w(modal)) {
            $w(modal).hide();
        }
    });
}

// Validation functions
function validatePasswordMatch() {
    const password = $w('#signupPassword').value;
    const confirm = $w('#signupPasswordConfirm').value;
    
    if (confirm && password !== confirm) {
        $w('#passwordMatchError').text = 'Passwords do not match';
        $w('#passwordMatchError').show();
    } else {
        $w('#passwordMatchError').hide();
    }
}

// Loading state functions
function showLoginLoading(show) {
    if ($w('#loginLoadingSpinner')) {
        $w('#loginLoadingSpinner').shown = show;
    }
    if ($w('#loginSubmitBtn')) {
        $w('#loginSubmitBtn').enabled = !show;
    }
}

function showSignupLoading(show) {
    if ($w('#signupLoadingSpinner')) {
        $w('#signupLoadingSpinner').shown = show;
    }
    if ($w('#signupSubmitBtn')) {
        $w('#signupSubmitBtn').enabled = !show;
    }
}

function showResetLoading(show) {
    if ($w('#resetLoadingSpinner')) {
        $w('#resetLoadingSpinner').shown = show;
    }
    if ($w('#resetSubmitBtn')) {
        $w('#resetSubmitBtn').enabled = !show;
    }
}

// Error display functions
function showLoginError(message) {
    if ($w('#loginErrorMessage')) {
        $w('#loginErrorMessage').text = message;
        $w('#loginErrorMessage').show();
    }
}

function showSignupError(message) {
    if ($w('#signupErrorMessage')) {
        $w('#signupErrorMessage').text = message;
        $w('#signupErrorMessage').show();
    }
}

function showResetError(message) {
    if ($w('#resetErrorMessage')) {
        $w('#resetErrorMessage').text = message;
        $w('#resetErrorMessage').show();
    }
}

function clearLoginErrors() {
    if ($w('#loginErrorMessage')) {
        $w('#loginErrorMessage').hide();
    }
}

function clearSignupErrors() {
    if ($w('#signupErrorMessage')) {
        $w('#signupErrorMessage').hide();
    }
    if ($w('#passwordMatchError')) {
        $w('#passwordMatchError').hide();
    }
}

function clearResetErrors() {
    if ($w('#resetErrorMessage')) {
        $w('#resetErrorMessage').hide();
    }
}

// Success/error message functions
function showSuccessMessage(message) {
    if ($w('#globalSuccessMessage')) {
        $w('#globalSuccessMessage').text = message;
        $w('#globalSuccessMessage').show();
        setTimeout(() => $w('#globalSuccessMessage').hide(), 5000);
    }
}

function showErrorMessage(message) {
    if ($w('#globalErrorMessage')) {
        $w('#globalErrorMessage').text = message;
        $w('#globalErrorMessage').show();
        setTimeout(() => $w('#globalErrorMessage').hide(), 5000);
    }
}

// Theme management
function applyTheme(isDark) {
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update CSS custom properties
    if (isDark) {
        document.documentElement.style.setProperty('--primary-bg', '#1a1a1a');
        document.documentElement.style.setProperty('--secondary-bg', '#2d2d2d');
        document.documentElement.style.setProperty('--text-primary', '#ffffff');
        document.documentElement.style.setProperty('--text-secondary', '#cccccc');
        document.documentElement.style.setProperty('--accent-color', '#00d4ff');
        document.documentElement.style.setProperty('--border-color', '#404040');
    } else {
        document.documentElement.style.setProperty('--primary-bg', '#ffffff');
        document.documentElement.style.setProperty('--secondary-bg', '#f8f9fa');
        document.documentElement.style.setProperty('--text-primary', '#333333');
        document.documentElement.style.setProperty('--text-secondary', '#666666');
        document.documentElement.style.setProperty('--accent-color', '#007bff');
        document.documentElement.style.setProperty('--border-color', '#e0e0e0');
    }
}

// Navigation helper
function navigateTo(url) {
    wixLocation.to(url);
}

// User menu toggle
function toggleUserMenu() {
    if ($w('#userMenuContent')) {
        const isVisible = $w('#userMenuContent').isVisible;
        $w('#userMenuContent').shown = !isVisible;
    }
}
