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

// Login modal functionality
function openLoginbox() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('signupContainer').style.display = 'none';
}

function closeLoginbox() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('signupContainer').style.display = 'none';
}

function toggleForm() {
    const loginContainer = document.getElementById('loginContainer');
    const signupContainer = document.getElementById('signupContainer');
    
    if (loginContainer.style.display === 'none') {
        loginContainer.style.display = 'block';
        signupContainer.style.display = 'none';
    } else {
        loginContainer.style.display = 'none';
        signupContainer.style.display = 'block';
    }
}

// Form validation stubs
function validateLoginForm() {
    // Add validation logic here
    return true;
}

function validateSignupForm() {
    // Add validation logic here
    return true;
}

// Add login link functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginLink = document.getElementById('loginLink');
    if (loginLink) {
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            openLoginbox();
        });
    }
});