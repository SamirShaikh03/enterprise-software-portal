document.getElementById('loginLink').addEventListener('click', function(e) {
    e.preventDefault(); // Prevent default link behavior
    // Show the overlay
    document.getElementById('overlay').style.display = 'block';
    // Show the login container
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('signupContainer').style.display = 'none';
  });
  
  // Function to close the login/signup modal.
  function closeLoginbox() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('signupContainer').style.display = 'none';
  }
  function toggleForm() {
    var loginContainer = document.getElementById('loginContainer');
    var signupContainer = document.getElementById('signupContainer');
    if (loginContainer.style.display === 'none') {
      loginContainer.style.display = 'block';
      signupContainer.style.display = 'none';
    } else {
      loginContainer.style.display = 'none';
      signupContainer.style.display = 'block';
    }
  }
  
  // Login form validation function.
  function validateLoginForm() {
    var employeeId = document.getElementById('employeeId').value;
    var loginDepartment = document.getElementById('loginDepartment').value;
    var loginPassword = document.getElementById('loginPassword').value;
    var loginConfirmPassword = document.getElementById('loginConfirmPassword').value;
    var phone = document.getElementById('phone').value;
    
    var phonePattern = /^\d{10}$/;
    var employeeIdPattern = /^[A-Za-z0-9]{6,}$/;
    
    if (employeeId === "" || loginDepartment === "" || loginPassword === "" || loginConfirmPassword === "" || phone === "") {
      alert("All fields are required!");
      return false;
    }
    if (!employeeId.match(employeeIdPattern)) {
      alert("Please enter a valid Employee ID!");
      return false;
    }
    if (loginPassword !== loginConfirmPassword) {
      alert("Passwords do not match!");
      return false;
    }
    if (loginPassword.length < 6) {
      alert("Password must be at least 6 characters long!");
      return false;
    }
    if (!phone.match(phonePattern)) {
      alert("Please enter a valid 10-digit number!");
      return false;
    }
    alert("Login Successful!");
    closeLoginbox();
    return false; // Prevent actual submission for demonstration
  }
  
  // Signup form validation function.
  function validateSignupForm() {
    var signupEmployeeId = document.getElementById('signupEmployeeId').value;
    var signupFullName = document.getElementById('signupFullName').value;
    var signupEmail = document.getElementById('signupEmail').value;
    var signupDepartment = document.getElementById('signupDepartment').value;
    var signupPassword = document.getElementById('signupPassword').value;
    var signupConfirmPassword = document.getElementById('signupConfirmPassword').value;
    if (signupEmployeeId === "" || signupFullName === "" || signupEmail === "" || signupDepartment === "" || signupPassword === "" || signupConfirmPassword === "") {
      alert("All fields are required!");
      return false;
    }
    if (signupPassword !== signupConfirmPassword) {
      alert("Passwords do not match.");
      return false;
    }
    alert("Signup Successful!");
    closeLoginbox();
    return false; // Prevent actual submission for demonstration
  }
    const sections = document.querySelectorAll('.container, .tech-conference, .digital-expertise');
  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('visible');
          }
      });
  }, { threshold: 0.2 });
  
  sections.forEach(section => observer.observe(section));