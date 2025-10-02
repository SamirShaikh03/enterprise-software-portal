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
        showAuthModal('login', { preserveMessages: true });
        setFormMessage(loginMessageEl, 'success', 'Account ready! Please sign in to continue.');
        focusFirstField(loginContainerEl);
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
});