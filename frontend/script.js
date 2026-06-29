// Configuration
// frontend/script.js - Replace the API_URL line
// frontend/script.js
const API_URL = 'https://skillsprint-api.onrender.com';  // Your actual Render URL
// The rest of your script stays the same...

// ========== LOGIN PAGE ==========
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const messageDiv = document.getElementById('message');

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Save token and user data
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.user));

                showMessage(messageDiv, `✅ Welcome ${data.user.name}! Redirecting...`, 'success');

                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1000);
            } else {
                showMessage(messageDiv, `❌ ${data.detail || 'Invalid credentials'}`, 'error');
            }
        } catch (error) {
            showMessage(messageDiv, '❌ Network error. Is the backend running?', 'error');
        }
    });
}

// ========== SIGNUP PAGE ==========
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        const messageDiv = document.getElementById('message');

        if (password !== confirmPassword) {
            showMessage(messageDiv, '❌ Passwords do not match!', 'error');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                showMessage(messageDiv, '✅ Signup successful! Redirecting to login...', 'success');

                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            } else {
                showMessage(messageDiv, `❌ ${data.detail || 'Signup failed'}`, 'error');
            }
        } catch (error) {
            showMessage(messageDiv, '❌ Network error. Is the backend running?', 'error');
        }
    });
}

// ========== DASHBOARD PAGE ==========
// Check if we're on dashboard page
if (window.location.pathname === '/dashboard' || window.location.pathname === '/dashboard.html') {
    // Check if user is logged in
    const token = localStorage.getItem('access_token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (!token || !user) {
        // Redirect to login if not authenticated
        window.location.href = '/';
    }

    // Display user info
    document.getElementById('welcomeName').textContent = user.name;
    document.getElementById('userNameDisplay').textContent = `👋 ${user.name}`;
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileEmail').textContent = user.email;
    
    // Format date
    if (user.created_at) {
        const date = new Date(user.created_at);
        document.getElementById('profileJoined').textContent = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Fetch fresh user data from API
    async function fetchUserProfile() {
        try {
            const response = await fetch(`${API_URL}/users/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                document.getElementById('profileName').textContent = userData.name;
                document.getElementById('profileEmail').textContent = userData.email;
            } else if (response.status === 401) {
                // Token expired
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    }

    fetchUserProfile();

    // Logout handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await fetch(`${API_URL}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            } catch (error) {
                // Ignore errors
            }

            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            window.location.href = '/';
        });
    }
}

// ========== REDIRECT IF ALREADY LOGGED IN ==========
// Check on login and signup pages
const currentPath = window.location.pathname;
if (currentPath === '/' || currentPath === '/signup') {
    const token = localStorage.getItem('access_token');
    if (token) {
        // If already logged in, redirect to dashboard
        window.location.href = '/dashboard';
    }
}

// ========== HELPER FUNCTIONS ==========
function showMessage(element, text, type) {
    element.textContent = text;
    element.className = `message ${type}`;
    element.style.display = 'block';
}