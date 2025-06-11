// src/app.js
console.log("Application script loaded as module.");

// Import screen rendering functions
import { renderWelcomeScreen } from './screens/WelcomeScreen.js';
import { renderLoginScreen } from './screens/LoginScreen.js';
import { renderDashboardScreen } from './screens/DashboardScreen.js';
import { renderPhaseTaskListScreen } from './screens/PhaseTaskListScreen.js';
import { renderTaskDetailScreen } from './screens/TaskDetailScreen.js';
import { renderSelfCareHubScreen } from './screens/SelfCareHubScreen.js';
import { renderSupportContentScreen } from './screens/SupportContentScreen.js';

// Import Firebase services
import { auth } from './services/firebaseConfig.js'; // db, functions can be imported if needed here
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth"; // Renamed signOut to avoid conflict
console.log("Firebase Auth imported in app.js:", auth ? "Success" : "Failed");

let currentUser = null; // Variable to store current user state

// Make currentUser accessible globally for other modules if needed
window.getCurrentUser = () => currentUser;

onAuthStateChanged(auth, (user) => {
    const rootEl = document.getElementById('root');
    const activeScreenElement = rootEl ? rootEl.firstChild : null;
    const activeScreenId = activeScreenElement ? activeScreenElement.id : null;

    if (user) {
        currentUser = user;
        console.log("User is signed in:", user);
        // If user is on login or welcome, redirect to dashboard
        if (activeScreenId === 'loginScreen' || activeScreenId === 'welcomeScreen' || activeScreenId === null) {
            window.loadScreen('dashboard');
        } else {
            // User is logged in, but might be on an internal page.
            // Refresh dashboard if already there to update user info (e.g. display name).
            if (activeScreenId === 'dashboardScreen' && typeof renderDashboardScreen === 'function') {
                window.loadScreen('dashboard');
            }
        }
    } else {
        currentUser = null;
        console.log("User is signed out.");
        // If user is on a protected page (not login or welcome), redirect to login.
        if (activeScreenId && activeScreenId !== 'loginScreen' && activeScreenId !== 'welcomeScreen') {
            window.loadScreen('login');
        } else if (!activeScreenId) { // Handles initial load when no screen is rendered yet
            window.loadScreen('welcome'); // Or 'login' if preferred as default for logged-out users
        }
    }
});

// Expose signOut globally for DashboardScreen
window.appSignOut = function() {
    firebaseSignOut(auth).then(() => {
        console.log("Sign-out successful from app.js");
        // onAuthStateChanged will handle navigation
    }).catch((error) => {
        console.error("Sign-out error:", error);
    });
};

window.loadScreen = function(screenName, options = {}) {
    const root = document.getElementById('root');
    const currentScreenContainer = root.firstChild; // This is the div.screen-slide-in or the screen itself if not slide-in

    function doLoad() {
        // Clear previous content. If currentScreenContainer was a slide-in div, it's already handled by slide-out animation.
        // Otherwise, clear root for direct renders.
        if (currentScreenContainer && !currentScreenContainer.classList.contains('screen-slide-in')) {
            root.innerHTML = '';
        } else if (currentScreenContainer && currentScreenContainer.classList.contains('screen-slide-in') && !currentScreenContainer.classList.contains('active')) {
            // If it's a slide-in container that has finished sliding out (is not 'active')
            currentScreenContainer.remove();
        }
        // If currentScreenContainer is an active slide-in, its removal is handled by the slide-out part of the transition logic below.


        let containerForNewScreen = root;
        let newScreenElement; // To reference the actual screen element after rendering

        if (options.transition === 'slide-in') {
            const slideContainer = document.createElement('div');
            slideContainer.classList.add('screen-slide-in');
            // ID can be useful for debugging, but ensure it's unique if multiple instances could exist
            // slideContainer.id = screenName + "Container";
            root.appendChild(slideContainer);
            containerForNewScreen = slideContainer;
        }

        // Render the new screen into the appropriate container
        if (screenName === 'welcome') {
            renderWelcomeScreen(containerForNewScreen);
        } else if (screenName === 'login') {
            renderLoginScreen(containerForNewScreen);
        } else if (screenName === 'dashboard') {
            renderDashboardScreen(containerForNewScreen);
        } else if (screenName === 'phase1Tasks' || screenName === 'phase2Tasks' || screenName === 'phase3Tasks') {
            renderPhaseTaskListScreen(screenName, containerForNewScreen, options.transition); // Pass transition type
        } else if (screenName && screenName.startsWith('taskDetail')) {
            renderTaskDetailScreen(screenName, options.taskId, options.phaseKey, containerForNewScreen, options.transition);
        } else if (screenName === 'selfCareHub') {
            renderSelfCareHubScreen(containerForNewScreen, options.transition);
        } else if (screenName && screenName.startsWith('supportContent')) {
            renderSupportContentScreen(screenName, options.topicId, containerForNewScreen, options.transition);
        } else {
            containerForNewScreen.innerHTML = '<p>Error: Screen not found: ' + screenName + '</p>';
        }

        // newScreenElement is the first child of the container where content was rendered
        newScreenElement = containerForNewScreen.firstChild;

        // Activate slide-in animation if applicable
        if (options.transition === 'slide-in' && containerForNewScreen.classList.contains('screen-slide-in')) {
            void containerForNewScreen.offsetWidth; // Trigger reflow
            containerForNewScreen.classList.add('active');
        } else if (newScreenElement && newScreenElement.style && !newScreenElement.style.animation && (!newScreenElement.classList || !newScreenElement.classList.contains('dashboard-screen'))) {
            // Apply general fade-in for non-slide, non-dashboard screens
            // Ensure newScreenElement is a valid element and has a style property
            newScreenElement.style.opacity = 0;
            newScreenElement.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300 });
       }
    }

    // Handle transitions for the outgoing screen
    if (currentScreenContainer && currentScreenContainer.classList && currentScreenContainer.classList.contains('screen-slide-in') && currentScreenContainer.classList.contains('active')) {
        currentScreenContainer.classList.remove('active'); // Trigger slide-out
        setTimeout(doLoad, 500); // Wait for slide-out animation
    } else if (currentScreenContainer && currentScreenContainer.firstChild && currentScreenContainer.firstChild.classList && (currentScreenContainer.firstChild.classList.contains('welcome-screen') || currentScreenContainer.firstChild.classList.contains('login-screen'))) {
         // Check child if currentScreenContainer is root
        const actualScreenElement = currentScreenContainer.firstChild;
         if(!actualScreenElement.classList.contains('fade-out')) { // Avoid double animation
            actualScreenElement.classList.add('fade-out');
            setTimeout(doLoad, actualScreenElement.classList.contains('welcome-screen') ? 1000 : 300);
         } else {
            doLoad(); // Already fading out
         }
    } else {
        doLoad(); // No specific animation for current screen or no current screen
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Check for Firebase warning div and potentially move it if root was not available initially
    const warningDiv = document.getElementById('firebaseConfigWarning');
    if (warningDiv && warningDiv.parentNode !== document.getElementById('root')) {
        const rootEl = document.getElementById('root');
        if (rootEl) rootEl.prepend(warningDiv);
    }
    window.loadScreen('welcome');
});
