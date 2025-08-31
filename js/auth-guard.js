// Universal Authentication Guard
// This file should be included in all HTML pages to handle authentication routing

import { auth, onAuthStateChanged } from './firebase-config.js';

class AuthGuard {
    constructor() {
        this.isAuthChecking = true;
        this.currentUser = null;
        this.publicPages = [
            'index.html',
            'login.html', 
            'signup.html',
            'test.html',
            'deployment-status.html',
            'no1.html',
            'no2.html', 
            'no3.html',
            'yes.html',
            'memory-book.html'
        ];
        this.protectedPages = [
            'dashboard.html',
            'profile.html',
            'gifts.html',
            'quiz.html',
            'quotes.html',
            'reminders.html',
            'voice-messages.html',
            'date-calculator.html',
            'confession.html',
            'confessions.html'
        ];
        
        this.init();
    }

    init() {
        // Show loading spinner immediately
        this.showLoadingSpinner();
        
        // Wait for Firebase Auth to initialize, then check auth state
        this.waitForFirebaseAuth();
    }

    async waitForFirebaseAuth() {
        try {
            // Wait a bit for Firebase to load
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Firebase modules are imported, set up auth state listener directly
            onAuthStateChanged(auth, (user) => {
                this.currentUser = user;
                this.isAuthChecking = false;
                this.handleAuthStateChange();
            });
        } catch (error) {
            console.warn('Firebase Auth not available:', error);
            // Wait a reasonable time then proceed without auth
            setTimeout(() => {
                this.isAuthChecking = false;
                this.currentUser = null;
                this.handleAuthStateChange();
            }, 1500); // Show loading for 1.5 seconds then proceed
        }
    }

    showLoadingSpinner() {
        // Create loading overlay if it doesn't exist
        if (!document.getElementById('auth-loading-overlay')) {
            const loadingHTML = `
                <div id="auth-loading-overlay" class="auth-loading-overlay">
                    <div class="auth-loading-content">
                        <div class="auth-loading-spinner">💖</div>
                        <p>Checking authentication...</p>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('afterbegin', loadingHTML);
            
            // Add styles
            this.addLoadingStyles();
        }
        
        document.getElementById('auth-loading-overlay').style.display = 'flex';
    }

    hideLoadingSpinner() {
        const overlay = document.getElementById('auth-loading-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    addLoadingStyles() {
        if (!document.getElementById('auth-guard-styles')) {
            const styles = `
                <style id="auth-guard-styles">
                .auth-loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(255, 107, 157, 0.95);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    backdrop-filter: blur(5px);
                }

                .auth-loading-content {
                    text-align: center;
                    color: white;
                    font-family: 'Arial', sans-serif;
                }

                .auth-loading-spinner {
                    font-size: 4rem;
                    animation: auth-pulse 1.5s infinite;
                    margin-bottom: 1rem;
                }

                .auth-loading-content p {
                    font-size: 1.2rem;
                    margin: 0;
                    opacity: 0.9;
                }

                @keyframes auth-pulse {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    50% {
                        transform: scale(1.2);
                        opacity: 0.7;
                    }
                }
                </style>
            `;
            document.head.insertAdjacentHTML('beforeend', styles);
        }
    }

    getCurrentPageName() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        return filename === '' ? 'index.html' : filename;
    }

    isPublicPage(pageName) {
        return this.publicPages.includes(pageName);
    }

    isProtectedPage(pageName) {
        return this.protectedPages.includes(pageName);
    }

    handleAuthStateChange() {
        const currentPage = this.getCurrentPageName();
        
        // Hide loading spinner
        this.hideLoadingSpinner();

        if (this.currentUser) {
            // User is authenticated
            this.handleAuthenticatedUser(currentPage);
        } else {
            // User is not authenticated  
            this.handleUnauthenticatedUser(currentPage);
        }
    }

    handleAuthenticatedUser(currentPage) {
        // If user is on a public page that should redirect authenticated users
        if (currentPage === 'login.html' || currentPage === 'signup.html') {
            window.location.href = 'dashboard.html';
            return;
        }

        // Show protected content and user info
        this.showProtectedContent();
    }

    handleUnauthenticatedUser(currentPage) {
        // If user is trying to access a protected page, redirect to login
        if (this.isProtectedPage(currentPage)) {
            window.location.href = 'login.html';
            return;
        }

        // Hide protected content and show auth buttons
        this.hideProtectedContent();
    }

    showProtectedContent() {
        // Show all elements with protected-content class
        const protectedElements = document.querySelectorAll('.protected-content');
        protectedElements.forEach(element => {
            element.style.display = 'block';
        });

        // Show user info, hide auth buttons
        const userInfo = document.getElementById('user-info');
        const authButtons = document.getElementById('auth-buttons');
        
        if (userInfo) userInfo.style.display = 'block';
        if (authButtons) authButtons.style.display = 'none';
    }

    hideProtectedContent() {
        // Hide all elements with protected-content class  
        const protectedElements = document.querySelectorAll('.protected-content');
        protectedElements.forEach(element => {
            element.style.display = 'none';
        });

        // Hide user info, show auth buttons
        const userInfo = document.getElementById('user-info');
        const authButtons = document.getElementById('auth-buttons');
        
        if (userInfo) userInfo.style.display = 'none';
        if (authButtons) authButtons.style.display = 'block';
    }
}

// Initialize auth guard when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.authGuard = new AuthGuard();
    });
} else {
    window.authGuard = new AuthGuard();
}

export default AuthGuard;