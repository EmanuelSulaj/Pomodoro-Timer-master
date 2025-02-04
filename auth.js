// DOM Elements
const authContainer = document.querySelector('.auth-container');
const userMenu = document.querySelector('.user-menu');
const userEmail = document.querySelector('.user-email');
const loginTrigger = document.getElementById('login-trigger');
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');
const authError = document.querySelector('.auth-error');
const authClose = document.querySelector('.auth-close');

// Show/Hide Auth Modal
loginTrigger.addEventListener('click', () => {
    console.log('Login clicked');
    authContainer.classList.add('show');
});

authClose.addEventListener('click', () => {
    authContainer.classList.remove('show');
});

// Tab Switching
authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        authTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const formToShow = tab.dataset.tab;
        authForms.forEach(form => {
            form.style.display = form.classList.contains(`${formToShow}-form`) ? 'block' : 'none';
        });
        
        authError.style.display = 'none';
    });
});

// Error Display Function
function showError(message) {
    const authError = document.querySelector('.auth-error');
    if (authError) {
        authError.textContent = message;
        authError.style.display = 'block';
    } else {
        console.error('Auth error element not found:', message);
    }
}

// Sign Up Function
async function signUp(email, password) {
    try {
        if (!email || !password) {
            showError('Please enter both email and password');
            return;
        }
        
        if (password.length < 6) {
            showError('Password should be at least 6 characters long');
            return;
        }

        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Create user data in database
        await firebase.database().ref('users/' + user.uid).set({
            email: user.email,
            createdAt: new Date().toISOString(),
            settings: {
                pomoValue: 25,
                shortValue: 5,
                longValue: 15,
                intervalValue: 4
            }
        });
        
        document.body.style.overflow = ''; // Restore scrolling
        authContainer.classList.remove('show');
        updateUIForUser(user);
    } catch (error) {
        console.error('Signup error:', error);
        showError(error.message.replace('Firebase:', '').trim());
    }
}

// Login Function
async function login(email, password) {
    try {
        if (!email || !password) {
            showError('Please enter both email and password');
            return;
        }

        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        document.body.style.overflow = ''; // Restore scrolling
        authContainer.classList.remove('show');
        updateUIForUser(userCredential.user);
    } catch (error) {
        console.error('Login error:', error);
        showError(error.message.replace('Firebase:', '').trim());
    }
}

// Google Sign In
async function signInWithGoogle() {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await firebase.auth().signInWithPopup(provider);
        const user = result.user;
        
        // Check if this is a new user
        const userRef = firebase.database().ref('users/' + user.uid);
        const snapshot = await userRef.once('value');
        
        if (!snapshot.exists()) {
            // Create new user data
            await userRef.set({
                email: user.email,
                createdAt: new Date().toISOString(),
                settings: {
                    pomoValue: 25,
                    shortValue: 5,
                    longValue: 15,
                    intervalValue: 4
                }
            });
        }
        
        document.body.style.overflow = ''; // Restore scrolling
        authContainer.classList.remove('show');
        updateUIForUser(user);
    } catch (error) {
        showError(error.message);
    }
}

// Logout Function
async function logout() {
    try {
        await firebase.auth().signOut();
        updateUIForLogout();
    } catch (error) {
        console.error('Error signing out:', error);
    }
}

// UI Update Functions
function updateUIForUser(user) {
    userEmail.textContent = user.email;
    document.querySelector('.header-login').style.display = 'none';
    document.querySelector('.header-logout').style.display = 'flex';
    userMenu.style.display = 'flex';
    document.querySelector('.header-title-login').textContent = user.email.split('@')[0];
}

function updateUIForLogout() {
    document.querySelector('.header-login').style.display = 'flex';
    document.querySelector('.header-logout').style.display = 'none';
    userMenu.style.display = 'none';
    document.querySelector('.header-title-login').textContent = 'Login';
}

// Auth State Observer
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        updateUIForUser(user);
    } else {
        updateUIForLogout();
    }
});

// Make functions available globally
window.login = login;
window.signUp = signUp;
window.signInWithGoogle = signInWithGoogle;
window.logout = logout;

// Add this at the top of auth.js
function initializeAuth() {
    const loginTrigger = document.getElementById('login-trigger');
    const authContainer = document.querySelector('.auth-container');
    const closeButton = document.querySelector('.auth-close');
    
    if (!loginTrigger || !authContainer || !closeButton) {
        console.error('Required elements not found');
        return;
    }

    // Login button click handler
    loginTrigger.addEventListener('click', function(e) {
        e.preventDefault();
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        authContainer.classList.add('show');
    });

    // Close button click handler
    closeButton.addEventListener('click', () => {
        closeAuthView();
    });

    // ESC key handler
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && authContainer.classList.contains('show')) {
            closeAuthView();
        }
    });

    // Click outside to close
    authContainer.addEventListener('click', (e) => {
        if (e.target === authContainer) {
            closeAuthView();
        }
    });
}

// Call it after DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAuth);
} else {
    initializeAuth();
}

// Add this initialization code
document.addEventListener('DOMContentLoaded', () => {
    // Create and append overlay
    const authOverlay = document.createElement('div');
    authOverlay.className = 'auth-overlay';
    document.body.appendChild(authOverlay);

    // Close auth UI when clicking overlay
    authOverlay.addEventListener('click', (e) => {
        if (e.target === authOverlay) {
            hideAuthUI();
        }
    });

    // Close auth UI when pressing Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideAuthUI();
        }
    });

    // Handle tab switching
    const authTabs = document.querySelectorAll('.auth-tab');
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            authTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Show corresponding form
            const forms = document.querySelectorAll('.auth-form');
            forms.forEach(form => form.style.display = 'none');
            
            if (tab.dataset.tab === 'login') {
                document.querySelector('.login-form').style.display = 'block';
            } else {
                document.querySelector('.signup-form').style.display = 'block';
            }
        });
    });
});

// Add this function to handle closing the auth UI
function closeAuthView() {
    const authContainer = document.querySelector('.auth-container');
    document.body.style.overflow = ''; // Restore scrolling
    authContainer.classList.remove('show');
}

// Add this at the bottom of your auth.js file
console.log('Auth.js loaded');

// Add this at the bottom of auth.js
document.addEventListener('DOMContentLoaded', () => {
    // Initialize auth elements
    const authContainer = document.querySelector('.auth-container');
    const loginTrigger = document.getElementById('login-trigger');
    const authClose = document.querySelector('.auth-close');
    const authError = document.querySelector('.auth-error');

    if (!authContainer || !loginTrigger || !authClose || !authError) {
        console.error('Some auth elements are missing from the DOM');
        return;
    }

    // Clear any existing error messages
    authError.style.display = 'none';
}); 