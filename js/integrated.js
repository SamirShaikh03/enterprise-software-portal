// Intersection Observer for fade-in animations
document.addEventListener('DOMContentLoaded', function() {
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all containers
    const containers = document.querySelectorAll('.container, .tech-conference, .digital-expertise');
    containers.forEach(container => {
        observer.observe(container);
    });

    // Make first few containers visible immediately
    const immediateVisible = document.querySelectorAll('#image, #services');
    immediateVisible.forEach(element => {
        element.classList.add('visible');
    });
});

const AUTH_STORAGE_KEY = 'binarySolutionsUsers';
const CURRENT_USER_KEY = 'binarySolutionsCurrentUser';

let overlayEl;
let loginContainerEl;
let signupContainerEl;
let loginFormEl;
let signupFormEl;
let loginMessageEl;
let signupMessageEl;
let loginLinkEl;
let navProfileEl;
let profileTriggerEl;
let profileCardEl;
let profileInitialsEl;
let profileNameEl;
let profileEmailEl;
let profileEmployeeIdEl;
let profileDepartmentEl;
let profileLogoutEl;

function safeParse(json) {
    try {
        return JSON.parse(json);
    } catch (error) {
        console.warn('Unable to parse stored auth data:', error);
        return null;
    }
}

function getStoredUsers() {
    if (typeof window === 'undefined' || !window.localStorage) {
        return [];
    }
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    const parsed = raw ? safeParse(raw) : null;
    return Array.isArray(parsed) ? parsed : [];
}

function saveUsers(users) {
    if (typeof window === 'undefined' || !window.localStorage) {
        return;
    }
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(users));
}

function setCurrentUser(employeeId) {
    if (typeof window === 'undefined' || !window.localStorage) {
        return;
    }
    window.localStorage.setItem(CURRENT_USER_KEY, employeeId);
}

function removeCurrentUser() {
    if (typeof window === 'undefined' || !window.localStorage) {
        return;
    }
    window.localStorage.removeItem(CURRENT_USER_KEY);
}

function getActiveUser() {
    if (typeof window === 'undefined' || !window.localStorage) {
        return null;
    }
    const identifier = window.localStorage.getItem(CURRENT_USER_KEY);
    if (!identifier) {
        return null;
    }
    return findUserByIdentifier(identifier);
}

function findUserByIdentifier(identifier) {
    if (!identifier) {
        return null;
    }
    const trimmed = identifier.trim().toLowerCase();
    return getStoredUsers().find(user =>
        user.employeeId?.toLowerCase() === trimmed || user.email?.toLowerCase() === trimmed
    ) || null;
}

function setFormMessage(element, type, message) {
    if (!element) {
        return;
    }
    element.textContent = message || '';
    element.classList.remove('error', 'success');
    if (type) {
        element.classList.add(type);
    }
}

function resetFormFeedback(form) {
    if (!form) {
        return;
    }
    form.querySelectorAll('input, select').forEach(field => {
        field.classList.remove('error', 'success');
    });
}

function clearAuthMessages() {
    setFormMessage(loginMessageEl, null, '');
    setFormMessage(signupMessageEl, null, '');
    resetFormFeedback(loginFormEl);
    resetFormFeedback(signupFormEl);
}

function markField(field, status) {
    if (!field) {
        return;
    }
    field.classList.remove('error', 'success');
    if (status) {
        field.classList.add(status);
    }
}

function focusFirstField(container) {
    if (!container) {
        return;
    }
    const firstInput = container.querySelector('input, select');
    if (firstInput) {
        firstInput.focus({ preventScroll: true });
    }
}

function getInitials(name = '') {
    if (!name) {
        return 'BS';
    }
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) {
        return 'BS';
    }
    const first = parts[0][0] || '';
    const second = parts.length > 1 ? (parts[parts.length - 1][0] || '') : (parts[0][1] || '');
    const initials = `${first}${second}`.toUpperCase();
    return initials || parts[0].slice(0, 2).toUpperCase();
}

function closeProfileDropdown() {
    if (!navProfileEl) {
        return;
    }
    navProfileEl.classList.remove('open');
    profileTriggerEl?.setAttribute('aria-expanded', 'false');
}

function toggleProfileDropdown(forceState) {
    if (!navProfileEl || !profileTriggerEl) {
        return;
    }
    const desiredState = typeof forceState === 'boolean'
        ? forceState
        : !navProfileEl.classList.contains('open');
    navProfileEl.classList.toggle('open', desiredState);
    profileTriggerEl.setAttribute('aria-expanded', String(desiredState));
}

function setProfileState(user) {
    if (!navProfileEl) {
        return;
    }
    const isLoggedIn = Boolean(user);
    navProfileEl.classList.toggle('active', isLoggedIn);
    navProfileEl.setAttribute('aria-hidden', String(!isLoggedIn));

    if (!isLoggedIn) {
        closeProfileDropdown();
        return;
    }

    const initials = getInitials(user.fullName || user.employeeId || '');
    if (profileInitialsEl) {
        profileInitialsEl.textContent = initials;
    }
    if (profileNameEl) {
        profileNameEl.textContent = user.fullName || 'Team Member';
    }
    if (profileEmailEl) {
        profileEmailEl.textContent = user.email || '—';
    }
    if (profileEmployeeIdEl) {
        profileEmployeeIdEl.textContent = user.employeeId || '—';
    }
    if (profileDepartmentEl) {
        profileDepartmentEl.textContent = user.department || '—';
    }
}

function showAuthModal(mode, options = {}) {
    if (!overlayEl || !loginContainerEl || !signupContainerEl) {
        return;
    }

    closeProfileDropdown();

    const { preserveMessages = false } = options;
    if (!preserveMessages) {
        clearAuthMessages();
    }

    overlayEl.classList.add('active');
    overlayEl.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    const view = mode === 'signup' ? 'signup' : 'login';
    const containers = {
        login: loginContainerEl,
        signup: signupContainerEl
    };

    Object.entries(containers).forEach(([key, container]) => {
        const isActive = key === view;
        container.classList.toggle('active', isActive);
        container.setAttribute('aria-hidden', String(!isActive));
    });

    focusFirstField(view === 'signup' ? signupContainerEl : loginContainerEl);
}

function openLoginbox(mode = 'login') {
    showAuthModal(mode);
}

function closeLoginbox() {
    if (!overlayEl || !loginContainerEl || !signupContainerEl) {
        return;
    }
    overlayEl.classList.remove('active');
    overlayEl.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    loginContainerEl.classList.remove('active');
    signupContainerEl.classList.remove('active');
    loginContainerEl.setAttribute('aria-hidden', 'true');
    signupContainerEl.setAttribute('aria-hidden', 'true');
    clearAuthMessages();
    loginFormEl?.reset();
    signupFormEl?.reset();
}

function toggleForm(targetMode) {
    const mode = targetMode === 'signup' ? 'signup' : 'login';
    if (!overlayEl || !overlayEl.classList.contains('active')) {
        showAuthModal(mode);
        return;
    }
    showAuthModal(mode);
}

function showAuthToast(message, tone = 'info') {
    if (!message) {
        return;
    }
    let toast = document.querySelector('.auth-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'auth-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.remove('success', 'error');
    if (tone === 'success' || tone === 'error') {
        toast.classList.add(tone);
    }
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

function handleSignupSubmit(event) {
    event.preventDefault();
    if (!signupFormEl) {
        return;
    }

    clearAuthMessages();

    const employeeIdField = signupFormEl.querySelector('#signupEmployeeId');
    const fullNameField = signupFormEl.querySelector('#signupFullName');
    const emailField = signupFormEl.querySelector('#signupEmail');
    const departmentField = signupFormEl.querySelector('#signupDepartment');
    const passwordField = signupFormEl.querySelector('#signupPassword');
    const confirmField = signupFormEl.querySelector('#signupConfirmPassword');

    const employeeId = employeeIdField?.value.trim();
    const fullName = fullNameField?.value.trim();
    const email = emailField?.value.trim().toLowerCase();
    const department = departmentField?.value;
    const password = passwordField?.value;
    const confirmPassword = confirmField?.value;

    const requiredFields = [
        { value: employeeId, field: employeeIdField, message: 'Employee ID is required.' },
        { value: fullName, field: fullNameField, message: 'Full name is required.' },
        { value: email, field: emailField, message: 'Email is required.' },
        { value: department, field: departmentField, message: 'Department is required.' },
        { value: password, field: passwordField, message: 'Password is required.' },
        { value: confirmPassword, field: confirmField, message: 'Please confirm your password.' }
    ];

    for (const item of requiredFields) {
        if (!item.value) {
            setFormMessage(signupMessageEl, 'error', item.message);
            markField(item.field, 'error');
            item.field?.focus();
            return;
        }
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailPattern.test(email)) {
        setFormMessage(signupMessageEl, 'error', 'Please enter a valid email address.');
        markField(emailField, 'error');
        emailField?.focus();
        return;
    }

    if (password && password.length < 6) {
        setFormMessage(signupMessageEl, 'error', 'Password must be at least 6 characters long.');
        markField(passwordField, 'error');
        passwordField?.focus();
        return;
    }

    if (password !== confirmPassword) {
        setFormMessage(signupMessageEl, 'error', 'Passwords do not match.');
        markField(passwordField, 'error');
        markField(confirmField, 'error');
        confirmField?.focus();
        return;
    }

    const users = getStoredUsers();
    const duplicate = users.some(user =>
        user.employeeId?.toLowerCase() === employeeId.toLowerCase() ||
        user.email?.toLowerCase() === email
    );

    if (duplicate) {
        setFormMessage(signupMessageEl, 'error', 'An account with that Employee ID or email already exists.');
        markField(employeeIdField, 'error');
        markField(emailField, 'error');
        employeeIdField?.focus();
        return;
    }

    users.push({
        employeeId,
        fullName,
        email,
        department,
        password
    });
    saveUsers(users);

    markField(employeeIdField, 'success');
    markField(fullNameField, 'success');
    markField(emailField, 'success');
    markField(departmentField, 'success');
    markField(passwordField, 'success');
    markField(confirmField, 'success');

    setFormMessage(signupMessageEl, 'success', 'Account created successfully! Redirecting to login...');

    setTimeout(() => {
        signupFormEl.reset();
        setFormMessage(signupMessageEl, null, '');
        
        // Show email verification modal instead of login
        const signupContainer = document.getElementById('signupContainer');
        if (signupContainer) {
            signupContainer.classList.remove('active');
            signupContainer.setAttribute('aria-hidden', 'true');
        }
        
        // Show verification modal with user's email
        const emailField = signupFormEl.querySelector('#signupEmail');
        const userEmail = emailField?.value || 'your email';
        showVerificationModal(userEmail);
    }, 1100);
}

function handleLoginSubmit(event) {
    event.preventDefault();
    if (!loginFormEl) {
        return;
    }

    clearAuthMessages();

    const identifierField = loginFormEl.querySelector('#loginIdentifier');
    const passwordField = loginFormEl.querySelector('#loginPassword');
    const identifier = identifierField?.value.trim();
    const password = passwordField?.value;

    if (!identifier) {
        setFormMessage(loginMessageEl, 'error', 'Enter your Employee ID or email.');
        markField(identifierField, 'error');
        identifierField?.focus();
        return;
    }

    if (!password) {
        setFormMessage(loginMessageEl, 'error', 'Password is required.');
        markField(passwordField, 'error');
        passwordField?.focus();
        return;
    }

    const user = findUserByIdentifier(identifier);
    if (!user) {
        setFormMessage(loginMessageEl, 'error', 'No account found for that ID or email.');
        markField(identifierField, 'error');
        identifierField?.focus();
        return;
    }

    if (user.password !== password) {
        setFormMessage(loginMessageEl, 'error', 'Incorrect password. Please try again.');
        markField(passwordField, 'error');
        passwordField?.focus();
        return;
    }

    markField(identifierField, 'success');
    markField(passwordField, 'success');
    setCurrentUser(user.employeeId);
    setFormMessage(loginMessageEl, 'success', `Welcome back, ${user.fullName.split(' ')[0]}!`);
    updateAuthLinkDisplay(user);
    loginFormEl.reset();
    showAuthToast(`Logged in as ${user.fullName}`, 'success');

    setTimeout(() => {
        closeLoginbox();
    }, 700);
}

function updateAuthLinkDisplay(user) {
    if (!loginLinkEl) {
        return;
    }
    const isLoggedIn = Boolean(user);
    loginLinkEl.setAttribute('data-auth-action', isLoggedIn ? 'logout' : 'login');
    loginLinkEl.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> ${isLoggedIn ? 'Logout' : 'Login'}`;
    loginLinkEl.setAttribute('aria-label', isLoggedIn ? 'Log out of the Binary Solutions portal' : 'Open the login form');
    loginLinkEl.classList.toggle('is-hidden', isLoggedIn);
    setProfileState(user);
}

// Add login link functionality and modal wiring
document.addEventListener('DOMContentLoaded', function() {
    overlayEl = document.getElementById('overlay');
    loginContainerEl = document.getElementById('loginContainer');
    signupContainerEl = document.getElementById('signupContainer');
    loginFormEl = document.getElementById('loginForm');
    signupFormEl = document.getElementById('signupForm');
    loginMessageEl = document.getElementById('loginMessage');
    signupMessageEl = document.getElementById('signupMessage');
    loginLinkEl = document.getElementById('loginLink');
    navProfileEl = document.getElementById('navProfile');
    profileTriggerEl = document.getElementById('profileTrigger');
    profileCardEl = document.getElementById('profileCard');
    profileInitialsEl = document.getElementById('profileInitials');
    profileNameEl = document.getElementById('profileName');
    profileEmailEl = document.getElementById('profileEmail');
    profileEmployeeIdEl = document.getElementById('profileEmployeeId');
    profileDepartmentEl = document.getElementById('profileDepartment');
    profileLogoutEl = document.getElementById('profileLogout');

    const activeUser = getActiveUser();
    updateAuthLinkDisplay(activeUser);

    if (loginLinkEl) {
        loginLinkEl.addEventListener('click', function(event) {
            event.preventDefault();
            const action = loginLinkEl.getAttribute('data-auth-action') || 'login';
            if (action === 'logout') {
                closeProfileDropdown();
                removeCurrentUser();
                updateAuthLinkDisplay(null);
                showAuthToast('You have been logged out.', 'success');
                return;
            }
            openLoginbox('login');
        });
    }

    if (profileTriggerEl) {
        profileTriggerEl.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            if (!navProfileEl?.classList.contains('active')) {
                return;
            }
            toggleProfileDropdown();
        });
    }

    if (profileCardEl) {
        profileCardEl.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    }

    if (profileLogoutEl) {
        profileLogoutEl.addEventListener('click', function(event) {
            event.preventDefault();
            closeProfileDropdown();
            removeCurrentUser();
            updateAuthLinkDisplay(null);
            showAuthToast('You have been logged out.', 'success');
        });
    }

    document.addEventListener('click', function(event) {
        if (navProfileEl && navProfileEl.classList.contains('open') && !navProfileEl.contains(event.target)) {
            closeProfileDropdown();
        }
    });

    if (overlayEl) {
        overlayEl.setAttribute('aria-hidden', 'true');
        overlayEl.addEventListener('click', function(event) {
            if (event.target === overlayEl) {
                closeLoginbox();
            }
        });
    }

    document.addEventListener('keydown', function(event) {
        if (event.key !== 'Escape') {
            return;
        }
        if (overlayEl && overlayEl.classList.contains('active')) {
            closeLoginbox();
            return;
        }
        if (navProfileEl && navProfileEl.classList.contains('open')) {
            closeProfileDropdown();
        }
    });

    if (signupFormEl) {
        signupFormEl.addEventListener('submit', handleSignupSubmit);
    }

    if (loginFormEl) {
        loginFormEl.addEventListener('submit', handleLoginSubmit);
    }

    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            const isOpen = navLinks.classList.toggle('open');
            navToggle.classList.toggle('open', isOpen);
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });

        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                if (navLinks.classList.contains('open')) {
                    navLinks.classList.remove('open');
                    navToggle.classList.remove('open');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 768 && navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Password Strength Indicator
    const signupPasswordInput = document.getElementById('signupPassword');
    const passwordStrengthEl = document.getElementById('passwordStrength');
    
    if (signupPasswordInput && passwordStrengthEl) {
        signupPasswordInput.addEventListener('input', function() {
            const password = this.value;
            const strengthData = calculatePasswordStrength(password);
            
            passwordStrengthEl.setAttribute('data-strength', strengthData.level);
            const strengthText = passwordStrengthEl.querySelector('.strength-text');
            if (strengthText) {
                strengthText.textContent = strengthData.text;
            }
        });
    }

    // Remember Me functionality
    const rememberMeCheckbox = document.getElementById('rememberMe');
    if (rememberMeCheckbox) {
        // Check if we should remember the user
        const rememberedUser = localStorage.getItem('rememberedUser');
        if (rememberedUser) {
            const userData = safeParse(rememberedUser);
            if (userData) {
                const loginIdentifier = document.getElementById('loginIdentifier');
                if (loginIdentifier) {
                    loginIdentifier.value = userData.identifier || '';
                }
                rememberMeCheckbox.checked = true;
            }
        }
    }

    // Update login submit to handle remember me
    const originalHandleLoginSubmit = handleLoginSubmit;
    if (loginFormEl) {
        loginFormEl.removeEventListener('submit', handleLoginSubmit);
        loginFormEl.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(event.target);
            const identifier = String(formData.get('loginIdentifier') || '').trim();
            const rememberMe = formData.get('rememberMe') === 'on';
            
            if (rememberMe) {
                localStorage.setItem('rememberedUser', JSON.stringify({ identifier }));
            } else {
                localStorage.removeItem('rememberedUser');
            }
            
            originalHandleLoginSubmit.call(this, event);
        });
    }
});

// Password Strength Calculator
function calculatePasswordStrength(password) {
    if (!password) {
        return { level: '', text: 'Enter a password' };
    }
    
    let strength = 0;
    const checks = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        numbers: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password)
    };
    
    strength += checks.length ? 1 : 0;
    strength += checks.uppercase ? 1 : 0;
    strength += checks.lowercase ? 1 : 0;
    strength += checks.numbers ? 1 : 0;
    strength += checks.special ? 1 : 0;
    
    if (strength <= 2) {
        return { level: 'weak', text: 'Weak password' };
    } else if (strength === 3) {
        return { level: 'fair', text: 'Fair password' };
    } else if (strength === 4) {
        return { level: 'good', text: 'Good password' };
    } else {
        return { level: 'strong', text: 'Strong password' };
    }
}

// Forgot Password Functions
function showForgotPassword() {
    const loginContainer = document.getElementById('loginContainer');
    const forgotPasswordContainer = document.getElementById('forgotPasswordContainer');
    const overlay = document.getElementById('overlay');
    
    if (loginContainer) {
        loginContainer.classList.remove('active');
        loginContainer.setAttribute('aria-hidden', 'true');
    }
    
    if (forgotPasswordContainer && overlay) {
        forgotPasswordContainer.classList.add('active');
        forgotPasswordContainer.setAttribute('aria-hidden', 'false');
        overlay.classList.add('active');
        
        // Focus on email input
        const resetEmailInput = document.getElementById('resetEmail');
        if (resetEmailInput) {
            setTimeout(() => resetEmailInput.focus(), 100);
        }
    }
}

function closeForgotPassword() {
    const forgotPasswordContainer = document.getElementById('forgotPasswordContainer');
    const overlay = document.getElementById('overlay');
    
    if (forgotPasswordContainer) {
        forgotPasswordContainer.classList.remove('active');
        forgotPasswordContainer.setAttribute('aria-hidden', 'true');
        
        // Reset form
        const form = document.getElementById('forgotPasswordForm');
        if (form) form.reset();
        
        // Clear messages
        const message = document.getElementById('forgotPasswordMessage');
        if (message) {
            message.textContent = '';
            message.className = 'form-message';
        }
    }
    
    if (overlay) {
        overlay.classList.remove('active');
    }
}

function backToLogin() {
    closeForgotPassword();
    setTimeout(() => {
        const loginContainer = document.getElementById('loginContainer');
        const overlay = document.getElementById('overlay');
        
        if (loginContainer && overlay) {
            loginContainer.classList.add('active');
            loginContainer.setAttribute('aria-hidden', 'false');
            overlay.classList.add('active');
        }
    }, 100);
}

// Email Verification Functions
function showVerificationModal(email) {
    const verificationContainer = document.getElementById('verificationContainer');
    const overlay = document.getElementById('overlay');
    
    if (verificationContainer && overlay) {
        // Close signup modal first
        const signupContainer = document.getElementById('signupContainer');
        if (signupContainer) {
            signupContainer.classList.remove('active');
            signupContainer.setAttribute('aria-hidden', 'true');
        }
        
        // Show verification modal
        verificationContainer.classList.add('active');
        verificationContainer.setAttribute('aria-hidden', 'false');
        overlay.classList.add('active');
        
        // Store email for resend functionality
        verificationContainer.setAttribute('data-email', email);
    }
}

function closeVerification() {
    const verificationContainer = document.getElementById('verificationContainer');
    const overlay = document.getElementById('overlay');
    
    if (verificationContainer) {
        verificationContainer.classList.remove('active');
        verificationContainer.setAttribute('aria-hidden', 'true');
    }
    
    if (overlay) {
        overlay.classList.remove('active');
    }
}

function resendVerification() {
    const verificationContainer = document.getElementById('verificationContainer');
    const email = verificationContainer ? verificationContainer.getAttribute('data-email') : '';
    
    // Mock resend verification
    showToast('Verification email resent to ' + email, 'success');
}

// Handle Forgot Password Form Submit
document.addEventListener('DOMContentLoaded', function() {
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(event.target);
            const email = String(formData.get('resetEmail') || '').trim();
            const messageEl = document.getElementById('forgotPasswordMessage');
            
            if (!email) {
                if (messageEl) {
                    messageEl.textContent = 'Please enter your email address';
                    messageEl.className = 'form-message error';
                }
                return;
            }
            
            if (!isValidEmail(email)) {
                if (messageEl) {
                    messageEl.textContent = 'Please enter a valid email address';
                    messageEl.className = 'form-message error';
                }
                return;
            }
            
            // Mock password reset
            if (messageEl) {
                messageEl.textContent = 'Password reset link sent to ' + email;
                messageEl.className = 'form-message success';
            }
            
            setTimeout(() => {
                closeForgotPassword();
                showToast('Check your email for reset instructions', 'success');
            }, 2000);
        });
    }
});

// ========================================
// EVENT SLIDER FUNCTIONALITY
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.events-slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const indicatorsContainer = document.querySelector('.slider-indicators');
    const cards = document.querySelectorAll('.event-card');
    
    if (!slider || !prevBtn || !nextBtn || !indicatorsContainer || cards.length === 0) {
        return;
    }
    
    let currentIndex = 0;
    let startX = 0;
    let isDragging = false;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let cardsPerView = getCardsPerView();
    
    // Determine how many cards to show based on screen width
    function getCardsPerView() {
        const width = window.innerWidth;
        if (width >= 1200) return 3; // Large Desktop: 3 cards
        if (width >= 769) return 2;  // Medium/Tablet: 2 cards
        return 1;                     // Mobile: 1 card
    }
    
    // Calculate total pages
    function getTotalPages() {
        return Math.ceil(cards.length / cardsPerView);
    }
    
    // Create indicators based on total pages
    function createIndicators() {
        indicatorsContainer.innerHTML = '';
        const totalPages = getTotalPages();
        
        for (let i = 0; i < totalPages; i++) {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (i === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToPage(i));
            indicatorsContainer.appendChild(indicator);
        }
        
        // Update indicators reference
        return document.querySelectorAll('.indicator');
    }
    
    let indicators = createIndicators();
    
    function updateSlider(smooth = true) {
        const cardWidth = cards[0].offsetWidth;
        const gap = cardsPerView === 1 ? 0 : 20;
        const offset = currentIndex * cardsPerView * (cardWidth + gap);
        
        slider.style.transition = smooth ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
        slider.style.transform = `translateX(-${offset}px)`;
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
        
        // Update button states
        const totalPages = getTotalPages();
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= totalPages - 1;
        
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentIndex >= totalPages - 1 ? '0.5' : '1';
        prevBtn.style.cursor = currentIndex === 0 ? 'not-allowed' : 'pointer';
        nextBtn.style.cursor = currentIndex >= totalPages - 1 ? 'not-allowed' : 'pointer';
    }
    
    function goToPage(pageIndex) {
        const totalPages = getTotalPages();
        currentIndex = Math.max(0, Math.min(pageIndex, totalPages - 1));
        updateSlider();
    }
    
    function nextSlide() {
        const totalPages = getTotalPages();
        if (currentIndex < totalPages - 1) {
            currentIndex++;
            updateSlider();
        }
    }
    
    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    }
    
    // Button event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Touch and mouse drag events
    slider.addEventListener('touchstart', touchStart, { passive: true });
    slider.addEventListener('touchmove', touchMove, { passive: false });
    slider.addEventListener('touchend', touchEnd);
    slider.addEventListener('mousedown', touchStart);
    slider.addEventListener('mousemove', touchMove);
    slider.addEventListener('mouseup', touchEnd);
    slider.addEventListener('mouseleave', touchEnd);
    
    function touchStart(e) {
        isDragging = true;
        startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        const cardWidth = cards[0].offsetWidth;
        const gap = cardsPerView === 1 ? 0 : 20;
        prevTranslate = currentIndex * cardsPerView * (cardWidth + gap);
        slider.style.cursor = 'grabbing';
    }
    
    function touchMove(e) {
        if (!isDragging) return;
        
        const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        const diff = currentX - startX;
        currentTranslate = prevTranslate - diff;
        
        // Prevent default only if we're actually dragging significantly
        if (Math.abs(diff) > 10) {
            e.preventDefault();
        }
        
        slider.style.transition = 'none';
        slider.style.transform = `translateX(-${currentTranslate}px)`;
    }
    
    function touchEnd() {
        if (!isDragging) return;
        
        isDragging = false;
        slider.style.cursor = 'grab';
        
        const cardWidth = cards[0].offsetWidth;
        const gap = cardsPerView === 1 ? 0 : 20;
        const movedBy = currentTranslate - prevTranslate;
        const threshold = cardWidth / 4; // More sensitive threshold
        
        const totalPages = getTotalPages();
        
        if (movedBy > threshold && currentIndex < totalPages - 1) {
            currentIndex++;
        } else if (movedBy < -threshold && currentIndex > 0) {
            currentIndex--;
        }
        
        updateSlider();
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
    
    // Update on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const newCardsPerView = getCardsPerView();
            if (newCardsPerView !== cardsPerView) {
                cardsPerView = newCardsPerView;
                currentIndex = 0; // Reset to first page on layout change
                indicators = createIndicators();
            }
            updateSlider(false);
        }, 250);
    });
    
    // Initial setup
    updateSlider(false);
});