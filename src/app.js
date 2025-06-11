// src/app.js
console.log("Application script loaded.");

// Simple router / screen manager (very basic)
function loadScreen(screenName, options = {}) {
    const root = document.getElementById('root');
    const currentScreen = root.firstChild; // This could be the main screen div or a slide-in container

    function doLoad() {
        // If current screen is a slide-in container, it will be removed.
        // Otherwise, root.innerHTML clears the main content.
        if (!(currentScreen && currentScreen.classList && currentScreen.classList.contains('screen-slide-in'))) {
            root.innerHTML = '';
        } else if (currentScreen && currentScreen.remove) {
            // If it was a slide-in, it should have been handled by slide-out, but as a fallback:
            // currentScreen.remove();
            // Better to ensure slide-out animation completes then it removes itself or loadScreen handles it.
        }


        if (screenName === 'welcome') {
            if (typeof renderWelcomeScreen === 'function') renderWelcomeScreen();
            else console.error('renderWelcomeScreen not found');
        } else if (screenName === 'login') {
            if (typeof renderLoginScreen === 'function') renderLoginScreen();
            else console.error('renderLoginScreen not found');
        } else if (screenName === 'dashboard') {
            if (typeof renderDashboardScreen === 'function') renderDashboardScreen();
            else console.error('renderDashboardScreen not found');
        }
        else if (screenName === 'phase1Tasks' || screenName === 'phase2Tasks' || screenName === 'phase3Tasks' || screenName === 'selfCareHub') {
             // Common logic for screens that might slide in
             const isSelfCare = screenName === 'selfCareHub';
             const renderFunc = isSelfCare ? (typeof renderSelfCareHubScreen !== 'undefined' ? renderSelfCareHubScreen : null)
                                           : (typeof renderPhaseTaskListScreen !== 'undefined' ? renderPhaseTaskListScreen : null);

             if (renderFunc) {
                if (options.transition === 'slide-in') {
                    const newScreenContainer = document.createElement('div');
                    newScreenContainer.classList.add('screen-slide-in');
                    root.appendChild(newScreenContainer); // Append to root, it will overlay
                    isSelfCare ? renderFunc(newScreenContainer) : renderFunc(screenName, newScreenContainer);
                    void newScreenContainer.offsetWidth; // Trigger reflow
                    newScreenContainer.classList.add('active');
                } else {
                    // Render directly into root if no slide-in (e.g. page refresh/deep link)
                    isSelfCare ? renderFunc(root) : renderFunc(screenName, root);
                }
             } else {
                console.error(`${isSelfCare ? 'renderSelfCareHubScreen' : 'renderPhaseTaskListScreen'} not found for ${screenName}`);
                root.innerHTML = `<div style="padding:20px; text-align:center;"><h2>Error</h2><p>Cannot load content.</p><button class="back-button" onclick="loadScreen('dashboard')">Back to Dashboard</button></div>`;
             }
        }
        // Placeholder for various task detail screens
        else if (screenName && screenName.startsWith('taskDetail')) {
            if (typeof renderTaskDetailScreen === 'function') {
                // options should contain taskId and phaseKey
                renderTaskDetailScreen(screenName, options.taskId, options.phaseKey, options.transition);
            } else {
                console.log(`Attempting to load ${screenName} (not yet implemented).`);
                const newScreenContainer = document.createElement('div');
                newScreenContainer.classList.add('screen-slide-in');
                root.appendChild(newScreenContainer);
                newScreenContainer.innerHTML = `<div style="padding:20px; text-align:center;"><h2>Task Detail: ${options.taskId || screenName}</h2><p>Content coming soon.</p><button class="back-button" id="backToListFromDetail">Back to List</button></div>`;
                newScreenContainer.querySelector('#backToListFromDetail').onclick = () => {
                    newScreenContainer.classList.remove('active');
                    setTimeout(() => {
                        newScreenContainer.remove();
                        loadScreen(options.phaseKey || 'dashboard', { transition: 'slide-in' }); // Go back to list, which itself might slide
                    }, 500);
                };
                void newScreenContainer.offsetWidth;
                newScreenContainer.classList.add('active');
            }
        }
        else {
             root.innerHTML = '<p>Error: Screen not found: ' + screenName + '</p>';
        }
    }

    if (currentScreen && currentScreen.classList && currentScreen.classList.contains('screen-slide-in') && currentScreen.classList.contains('active')) {
        // Current screen is an active slide-in screen, so slide it out
        currentScreen.classList.remove('active');
        setTimeout(() => {
            currentScreen.remove(); // Remove the slide-in container after animation
            doLoad();
        }, 500); // Match slide animation time
    } else if (currentScreen && currentScreen.id && !currentScreen.classList.contains('fade-out')) {
        // Standard fade out for non-slide-in screens
        currentScreen.classList.add('fade-out');
        setTimeout(doLoad, currentScreen.classList.contains('welcome-screen') ? 1000 : 300);
    } else {
        doLoad(); // No current screen or already fading
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadScreen('welcome');
});
